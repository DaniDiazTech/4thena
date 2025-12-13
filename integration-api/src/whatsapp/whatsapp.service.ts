import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
const { Client } = require('whatsapp-web.js');
const puppeteer = require('puppeteer');
import * as qrcodeTerminal from 'qrcode-terminal';
import * as QRCode from 'qrcode';
import { GetMessagesDto } from './dto';

const client = new Client({
    puppeteer: {
        executablePath: puppeteer.executablePath(),
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

@Injectable()
export class WhatsappService {
    private readonly logger: Logger;
    private qrCodeUrl: string | null = null;

    constructor(private readonly configService: ConfigService,
    ) {
        this.logger = new Logger(WhatsappService.name);
    }

    getQrCode(): string | null {
        return this.qrCodeUrl;
    }

    async init() {
        client.on('qr', async (qr) => {
            this.logger.log('QR RECEIVED', qr);
            qrcodeTerminal.generate(qr, { small: true });
            try {
                this.qrCodeUrl = await QRCode.toDataURL(qr);
            } catch (err) {
                this.logger.error('Failed to generate QR code data URL', err);
            }
        });

        client.on('ready', () => {
            this.logger.log('Client is ready!');
        });
        client.initialize();
    }

    async getMessagesFromNumber(getMessagesDto: GetMessagesDto) {
        if (!client) {
            this.logger.error('Client is not initialized');
            throw new Error('Client is not initialized');
        }

        try {
            const chatId = `${getMessagesDto.phoneNumber}@c.us`;
            const chat = await client.getChatById(chatId);
            const messages = await chat.fetchMessages({ limit: getMessagesDto.limit });
            return messages;
        } catch (error) {
            this.logger.error(`Error getting messages directly from number ${getMessagesDto.phoneNumber}:`, error);
            throw new Error(`Failed to get messages: ${error.message}`);
        }
    }
}
