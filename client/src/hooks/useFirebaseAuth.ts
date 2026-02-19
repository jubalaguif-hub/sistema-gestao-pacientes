import { useEffect, useState } from 'react';
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';

export type AuthUser = FirebaseUser | null;

export function useFirebaseAuth() {
  const [user, setUser] = useState<AuthUser>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      const message = err.code === 'auth/user-not-found' 
        ? 'Usuário não encontrado'
        : err.code === 'auth/wrong-password'
        ? 'Senha incorreta'
        : err.code === 'auth/invalid-email'
        ? 'E-mail inválido'
        : 'Erro ao fazer login';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setError(null);
      await signOut(auth);
      setUser(null);
    } catch (err: any) {
      setError('Erro ao fazer logout');
      throw err;
    }
  };

  const getIdToken = async (): Promise<string | null> => {
    if (!user) return null;
    try {
      return await user.getIdToken();
    } catch (err) {
      console.error('Erro ao obter token:', err);
      return null;
    }
  };

  return {
    user,
    loading,
    error,
    login,
    logout,
    getIdToken,
    isAuthenticated: !!user,
  };
}
