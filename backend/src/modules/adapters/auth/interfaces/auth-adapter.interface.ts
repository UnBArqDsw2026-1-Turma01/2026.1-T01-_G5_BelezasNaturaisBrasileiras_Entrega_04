export interface AuthResult { userId?: string; tokens?: any; }

export interface IAuthAdapter {
  validateCallback(data: any): Promise<AuthResult>;
  signIn(dto: any): Promise<AuthResult>;
  refreshToken?(token: string): Promise<any>;
}
