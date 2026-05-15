export interface ISupabaseAuthService {
  createUser(email: string, password: string): Promise<{ uid: string }>;
  deleteUser(uid: string): Promise<void>;
}
