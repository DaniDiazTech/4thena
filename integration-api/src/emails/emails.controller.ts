import { Controller, Get, Query } from '@nestjs/common';
import { EmailsService } from './emails.service'; // Asegúrate de importar el servicio

@Controller('emails')
export class EmailsController {
    constructor(private readonly emailService: EmailsService) { }

    @Get('read')
    async leerCorreos(@Query('domain') domain: string) {
        return await this.emailService.obtenerUltimosCorreos(domain);
    }
}