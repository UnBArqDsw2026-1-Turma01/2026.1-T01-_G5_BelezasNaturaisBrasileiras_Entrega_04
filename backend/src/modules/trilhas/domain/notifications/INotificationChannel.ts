export interface INotificationChannel {
  send(participanteId: string, mensagem: string): Promise<void> | void;
}
