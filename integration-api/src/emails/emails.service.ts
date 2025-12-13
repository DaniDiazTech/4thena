import { Injectable } from '@nestjs/common';
import { ImapFlow } from 'imapflow';
import { simpleParser, ParsedMail } from 'mailparser';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailsService {
    constructor(private configService: ConfigService) { }

    async obtenerUltimosCorreos() {
        const client = new ImapFlow({
            host: 'imap.gmail.com',
            port: 993,
            secure: true,
            auth: {
                user: this.configService.get<string>('email.user') || '',
                pass: this.configService.get<string>('email.pass') || '',
            },
            logger: false,
        });

        await client.connect();

        const correosProcesados: any[] = [];
        const lock = await client.getMailboxLock('INBOX');

        try {
            for await (const message of client.fetch({ seen: false }, { source: true, envelope: true })) {

                const emailParseado = await simpleParser(message.source!) as unknown as ParsedMail;

                correosProcesados.push({
                    asunto: emailParseado.subject,
                    remitente: emailParseado.from?.value[0].address,
                    texto: emailParseado.text,
                    html: emailParseado.html,
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