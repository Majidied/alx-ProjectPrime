export interface Message {
    id: number;
    senderId: string;
    recipientId: string;
    message: string;
    seen: boolean;
    contactId: string;
    timestamp: string;
}
