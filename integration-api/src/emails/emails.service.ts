import { Injectable } from '@nestjs/common';
import { ImapFlow } from 'imapflow';
import { simpleParser, ParsedMail } from 'mailparser';
import { ConfigService } from '@nestjs/config';
import { MessageService } from 'src/message/message.service';

@Injectable()
export class EmailsService {
    constructor(private configService: ConfigService, private messageService: MessageService) { }

    async getLatestEmails(domain?: string) {
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

            if (domain) {
                searchCriteria.from = domain;
            }

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
            await this.messageService.sendMessage({ content: correosProcesados });
        } finally {
            lock.release();
        }

        await client.logout();

        return correosProcesados;
    }
}