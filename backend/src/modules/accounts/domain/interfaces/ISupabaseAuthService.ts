export interface ISupabaseAuthService {
  createUser(email: string, password: string): Promise<{ uid: string }>;
  signIn(email: string, password: string): Promise<{ access_token: string; uid: string }>;
  deleteUser(uid: string): Promise<void>;
}
