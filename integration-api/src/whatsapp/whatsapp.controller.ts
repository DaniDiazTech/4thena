import { Controller, Get, Query } from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';
import { GetMessagesDto } from './dto';

@Controller('whatsapp')
export class WhatsappController {
    constructor(private readonly whatsappService: WhatsappService) { }

    @Get('init')
    async init() {
        await this.whatsappService.init()
        return "Funciona";
    }

    @Get('qr')
    getQr() {
        const qrCodeUrl = this.whatsappService.getQrCode();
        if (!qrCodeUrl) {
            return `<h1>QR Code not available yet</h1><p>Check back in a moment or ensure you've called /init</p>`;
        }
        return `<html><body><h1>Scan this QR Code</h1><img src="${qrCodeUrl}" /></body></html>`;
    }

    @Get('messages')
    async getMessages(@Query() getMessagesDto: GetMessagesDto) {
        return this.whatsappService.getMessagesFromNumber(getMessagesDto);
    }
}
