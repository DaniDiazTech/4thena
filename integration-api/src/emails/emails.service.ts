import { Injectable } from '@nestjs/common';
import { ImapFlow } from 'imapflow';
import { simpleParser, ParsedMail } from 'mailparser';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailsService {
    constructor(private configService: ConfigService) { }

    async obtenerUltimosCorreos(domain?: string) {
        const client = new ImapFlow({
            host: 'imap.gmail.com',
            port: 993,
            secure: true,
            auth: {
                user: this.configService.get<string>('email.user') || '',
                pass: this.configService.get<string>('email.pass') || '',
            },
            logger: false,
            tls: {
                rejectUnauthorized: true,
                minVersion: 'TLSv1.2',
            }
        });

        await client.connect();

        const correosProcesados: any[] = [];
        const lock = await client.getMailboxLock('INBOX');

        try {
            const searchCriteria: any = {};

            // If domain is provided, filter by sender
            if (domain) {
                searchCriteria.from = domain;
            } else {
                // If no domain, fetch all (or maybe limit to recent ones if we wanted, but request says 'read emails i read')
                // '1:*' means all messages. ImapFlow fetch accepts sequence string or search object.
                // If we pass an empty object, it might not work as 'all'. 
                // Let's use '1:*' as default sequence if no search criteria is needed.
            }

            // We default to '1:*' if no domain, otherwise use the search object.
            // But fetch signature is fetch(range, options). behavior differs.
            // Actually, if we want to include seen emails, we just DON'T filter by {seen:false}.

            let fetchRange: any = '1:*';
            if (Object.keys(searchCriteria).length > 0) {
                fetchRange = searchCriteria;
            }

            for await (const message of client.fetch(fetchRange, { source: true, envelope: true })) {

                const emailParseado = await simpleParser(message.source!) as unknown as ParsedMail;

                correosProcesados.push({
                    asunto: emailParseado.subject,
                    remitente: emailParseado.from?.value[0].address,
                    texto: emailParseado.text,
                    adjuntos: emailParseado.attachments?.length || 0
                });
            }
        } finally {
            lock.release();
        }

        await client.logout();

        return correosProcesados;
    }
}