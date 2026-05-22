export interface NotifyResult { success: boolean; externalId?: string; }

export interface INotificationAdapter {
  sendSMS(to: string, message: string): Promise<NotifyResult>;
  sendWhatsApp?(to: string, message: string): Promise<NotifyResult>;
}
