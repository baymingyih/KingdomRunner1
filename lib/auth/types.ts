import { User as FirebaseUser } from 'firebase/auth';

export interface User extends FirebaseUser {
  isAdmin?: boolean;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
}

export interface AuthGuardProps {
  children: React.ReactNode;
}
