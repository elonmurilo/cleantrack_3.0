import { Session, User as SupabaseUser } from '@supabase/supabase-js';

export interface AuthState {
  session: Session | null;
  user: SupabaseUser | null;
  profile: UserProfile | null;
  loading: boolean;
}
