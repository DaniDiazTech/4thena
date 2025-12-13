import { Controller, Get } from '@nestjs/common';
import { EmailsService } from './emails.service'; // Asegúrate de importar el servicio

@Controller('emails')
export class EmailsController {
    constructor(private readonly emailService: EmailsService) { }

    @Get('leer')
    async leerCorreos() {
        return await this.emailService.obtenerUltimosCorreos();
    }
}