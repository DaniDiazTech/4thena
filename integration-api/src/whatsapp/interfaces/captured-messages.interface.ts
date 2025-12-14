export interface CapturedMessage {
    message_id: string;
    text: string;
    timestamp: number;
    direction: 'incoming' | 'outgoing';
    from: string;
    to: string;
    is_bussiness_account: boolean;
    message_type: string;
    has_media: boolean;
    language_hint: string | null;
    source: string;
}