import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Profile, VendedorKey } from '../types/database';

interface AuthContextType {
  user: any | null;
  profile: Profile | null;
  loading: boolean;
  isAdmin: boolean;
  isSeller: boolean;
  signIn: (email: string, pass: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  switchDemoUser: (role: 'admin' | 'seller', customCommission?: number, name?: string, vendedorKey?: VendedorKey) => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Perfil inicial padrão para modo vendedor real demo (Luciano)
const DEMO_SELLER: Profile = {
  id: 'demo-luciano-id',
  full_name: 'Luciano (Vendedor)',
  email: 'luciano@harpia.com.br',
  role: 'seller',
  phone: '(16) 99876-5432',
  comissao_porcentagem: 8.0, // Tabela Luciano 8%
  vendedor_key: 'luciano',
  ativo: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

const DEMO_ADMIN: Profile = {
  id: 'demo-admin-id',
  full_name: 'Diretoria Harpia (Admin)',
  email: 'admin@harpia.com.br',
  role: 'admin',
  phone: '(16) 3322-1100',
  comissao_porcentagem: 0,
  vendedor_key: 'balcao',
  ativo: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};


export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<Profile | null>(() => {
    const saved = localStorage.getItem('harpia_demo_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEMO_SELLER;
      }
    }
    return DEMO_SELLER;
  });
  const [loading, setLoading] = useState<boolean>(true);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (data && !error) {
        setProfile(data as Profile);
      }
    } catch (err) {
      console.error('Erro ao buscar perfil:', err);
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, pass: string) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: pass
    });
    if (data.user) {
      setUser(data.user);
      await fetchProfile(data.user.id);
    }
    setLoading(false);
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(DEMO_SELLER);
    localStorage.removeItem('harpia_demo_profile');
  };

  const switchDemoUser = (role: 'admin' | 'seller', customCommission = 8.0, name?: string, vendedorKey?: VendedorKey) => {
    let newProfile: Profile;
    if (role === 'admin') {
      newProfile = { ...DEMO_ADMIN };
    } else {
      newProfile = {
        ...DEMO_SELLER,
        full_name: name || 'Vendedor Representante',
        comissao_porcentagem: customCommission,
        vendedor_key: vendedorKey || 'luciano'
      };
    }
    setProfile(newProfile);
    localStorage.setItem('harpia_demo_profile', JSON.stringify(newProfile));
  };

  const refreshProfile = async () => {
    if (user?.id) {
      await fetchProfile(user.id);
    }
  };

  const isAdmin = profile?.role === 'admin';
  const isSeller = profile?.role === 'seller';

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        isAdmin,
        isSeller,
        signIn,
        signOut,
        switchDemoUser,
        refreshProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
