import { User } from 'firebase/auth';

export interface AuthContextType {
  user: User | null;
  loading: boolean;
}

export interface AuthGuardProps {
  children: React.ReactNode;
}