import { Controller, Get, Query } from '@nestjs/common';
import { EmailsService } from './emails.service'; // Asegúrate de importar el servicio

@Controller('emails')
export class EmailsController {
    constructor(private readonly emailService: EmailsService) { }

    @Get('read')
    async leerCorreos(@Query('domain') domain: string) {
        return await this.emailService.getLatestEmails(domain);
    }

    @Get("domain")
    async getDomain(@Query('domain') domain: string) {
        return this.emailService.getLatestEmails(domain);
    }
}