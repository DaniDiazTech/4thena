import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
const { Client, LocalAuth } = require('whatsapp-web.js');
const puppeteer = require('puppeteer');
import * as qrcodeTerminal from 'qrcode-terminal';
import * as QRCode from 'qrcode';
import { GetMessagesDto } from './dto';
import { CapturedMessage } from './interfaces';
import { Message, MessageDocument } from './schemas/message.schema';

import { existsSync } from 'fs';

@Injectable()
export class WhatsappService implements OnModuleDestroy {
    private readonly logger: Logger;
    private readonly client: any;
    private qrCodeUrl: string | null = null;
    private isReady: boolean = false;
    private isInitializing: boolean = false;

    constructor(
        private readonly configService: ConfigService,
        @InjectModel(Message.name) private messageModel: Model<MessageDocument>
    ) {
        this.logger = new Logger(WhatsappService.name);

        let executablePath = process.env.CHROME_BIN || process.env.PUPPETEER_EXECUTABLE_PATH;

        if (!executablePath) {
            try {
                const bundledPath = puppeteer.executablePath();
                if (existsSync(bundledPath)) {
                    executablePath = bundledPath;
                } else {
                    this.logger.warn(`Puppeteer executable not found at ${bundledPath}. Will try system default.`);
                }
            } catch (error) {
                this.logger.warn('Failed to resolve puppeteer executable path', error);
            }
        }

        const puppeteerConfig: any = {
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
            headless: true,
        };

        if (executablePath) {
            puppeteerConfig.executablePath = executablePath;
        }

        this.client = new Client({
            authStrategy: new LocalAuth(),
            puppeteer: puppeteerConfig
        });
    }

    async onModuleDestroy() {
        if (this.client) {
            this.logger.log('Destroying Whatsapp Client...');
            await this.client.destroy();
        }
    }

    getQrCode(): string | null {
        return this.qrCodeUrl;
    }

    async init() {
        if (this.isReady) {
            this.logger.warn('Client is already ready');
            return;
        }

        if (this.isInitializing) {
            this.logger.warn('Client is already initializing');
            return;
        }

        this.isInitializing = true;

        this.client.on('qr', async (qr) => {
            this.logger.log('QR RECEIVED', qr);
            this.isInitializing = false; // Stop blocking on QR receive
            qrcodeTerminal.generate(qr, { small: true });
            try {
                this.qrCodeUrl = await QRCode.toDataURL(qr);
            } catch (err) {
                this.logger.error('Failed to generate QR code data URL', err);
            }
        });

        this.client.on('ready', () => {
            this.isReady = true;
            this.isInitializing = false;
            this.logger.log('Client is ready!');
        });

        this.client.on('auth_failure', (msg) => {
            this.logger.error('AUTHENTICATION FAILURE', msg);
            this.isInitializing = false;
        });

        this.client.on('disconnected', (reason) => {
            this.logger.log('Client was logged out', reason);
            this.isReady = false;
            this.isInitializing = false;
        });

        const maxRetries = 3;
        let attempt = 0;

        while (attempt < maxRetries) {
            try {
                this.logger.log(`Initializing WhatsApp client (Attempt ${attempt + 1}/${maxRetries})...`);
                await this.client.initialize();
                this.logger.log('WhatsApp client initialization started successfully.');
                break; // Success
            } catch (error) {
                attempt++;
                this.logger.error(`Failed to initialize client (Attempt ${attempt}/${maxRetries})`, error);

                if (attempt >= maxRetries) {
                    this.logger.error('Max retries reached. Initialization failed.');
                    this.isInitializing = false;
                    this.isReady = false;
                    break;
                }

                this.logger.log('Retrying in 3 seconds...');
                await new Promise(resolve => setTimeout(resolve, 3000));

                try {
                    await this.client.destroy();
                } catch (e) {
                    this.logger.warn('Error destroying client during retry cleanup', e);
                }
            }
        }
    }

    async getMessagesFromNumber(getMessagesDto: GetMessagesDto) {
        if (!this.isReady) {
            this.logger.error('Client is not ready');
            throw new Error('Client is not ready. Please initialize and scan QR code first.');
        }

        try {
            const chatId = `${getMessagesDto.phoneNumber}@c.us`;

            this.logger.log(`Checking if ${getMessagesDto.phoneNumber} is registered...`);
            const isRegistered = await this.client.isRegisteredUser(chatId);

            if (!isRegistered) {
                this.logger.warn(`Number ${getMessagesDto.phoneNumber} is not registered on WhatsApp`);
                throw new Error('Number is not registered on WhatsApp');
            }

            this.logger.log(`Getting chat for ${chatId}...`);
            const chat = await this.client.getChatById(chatId);

            this.logger.log(`Fetching messages for ${chatId}...`);
            const messages = await chat.fetchMessages({ limit: getMessagesDto.limit });
            const result = this.parseWhatsAppMessage(messages);
            const dataToSave: CapturedMessage[] = [];
            result.forEach((message) => {
                this.logger.log(`Message: ${message.text}`);
                if (message.text != "[Media/Link]") {
                    dataToSave.push(message);
                }
            });

            if (dataToSave.length > 0) {
                await this.saveMessages(dataToSave);
            }

            return dataToSave;
        } catch (error) {
            this.logger.error(`Error getting messages directly from number ${getMessagesDto.phoneNumber}:`, error);
            throw new Error(`Failed to get messages: ${error.message}`);
        }
    }

    async saveMessages(messages: CapturedMessage[]) {
        try {
            this.logger.log(`Saving ${messages.length} messages to database...`);
            await this.messageModel.insertMany(messages);
            this.logger.log('Messages saved successfully');
        } catch (error) {
            this.logger.error('Error saving messages to database', error);
        }
    }

    async getAllMessages() {
        return this.messageModel.find().exec();
    }

    private parseWhatsAppMessage(data: any[]): CapturedMessage[] {
        return data.map(item => {
            const message = item._data || item;

            return {
                message_id: message.id._serialized || message.id?._serialized || '',
                text: message.body,
                timestamp: message.t || message.timestamp || 0,
                direction: message.fromMe ? 'outgoing' : 'incoming',
                from: message.from?._serialized || message.from?.server + '@' + message.from?.user || '',
                to: message.to?._serialized || message.to?.server + '@' + message.to?.user || '',
                is_bussiness_account: message.from?.server === 'c.us' ? false : true,
                message_type: message.type || 'unknown',
                has_media: message.hasMedia || !!message.thumbnail || false,
                language_hint: message.language_hint || null,
                source: "Whatsapp"
            };
        });
    }
}
