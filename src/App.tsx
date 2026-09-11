import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from './lib/supabase';
import type { Produto, Categoria, Profile } from './types/database';
import { initialCategorias, initialProdutos } from './data/initialCatalog';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { SellerView } from './components/seller/SellerView';
import { AdminView } from './components/admin/AdminView';
import { InstallModal } from './components/InstallModal';
import { usePWA } from './hooks/usePWA';
import { Wifi, WifiOff } from 'lucide-react';

const mockVendedores: Profile[] = [
  {
    id: 'vend-1',
    full_name: 'Carlos Mendes',
    email: 'carlos.mendes@harpia.com.br',
    phone: '(16) 99876-5432',
    role: 'seller',
    comissao_porcentagem: 5.0,
    ativo: true,
    created_at: '',
    updated_at: ''
  },
  {
    id: 'vend-2',
    full_name: 'Mariana Silveira',
    email: 'mariana.silveira@harpia.com.br',
    phone: '(16) 98123-4567',
    role: 'seller',
    comissao_porcentagem: 6.5,
    ativo: true,
    created_at: '',
    updated_at: ''
  },
  {
    id: 'vend-3',
    full_name: 'Roberto Agro Consultoria',
    email: 'roberto@agro.com.br',
    phone: '(17) 99765-4321',
    role: 'seller',
    comissao_porcentagem: 3.5,
    ativo: true,
    created_at: '',
    updated_at: ''
  }
];

const MainContent: React.FC = () => {
  const { isAdmin } = useAuth();
  const { isInstalled, isIOS, installApp } = usePWA();
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);

  // Inicialização direta e imediata com o catálogo completo
  const [produtos, setProdutos] = useState<Produto[]>(() => {
    try {
      const cached = localStorage.getItem('harpia_cached_produtos_v4');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length >= 50) return parsed;
      }
    } catch (e) {
      console.warn('Erro ao ler cache de produtos:', e);
    }
    return initialProdutos;
  });

  const [categorias, setCategorias] = useState<Categoria[]>(() => {
    try {
      const cached = localStorage.getItem('harpia_cached_categorias_v4');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length >= 7) return parsed;
      }
    } catch (e) {
      console.warn('Erro ao ler cache de categorias:', e);
    }
    return initialCategorias;
  });

  const [vendedores, setVendedores] = useState<Profile[]>(() => {
    try {
      const cached = localStorage.getItem('harpia_cached_vendedores_v4');
      if (cached) return JSON.parse(cached);
    } catch (e) {
      console.warn('Erro ao ler cache de vendedores:', e);
    }
    return mockVendedores;
  });

  const [loading, setLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Busca segura sem loop infinito (dependências vazias)
  const fetchData = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    try {
      const [catRes, prodRes, profRes] = await Promise.all([
        supabase.from('categorias').select('*').order('ordem', { ascending: true }),
        supabase.from('produtos').select('*').order('nome', { ascending: true }),
        supabase.from('profiles').select('*').eq('role', 'seller').order('full_name', { ascending: true })
      ]);

      let currentCats = initialCategorias;
      if (catRes.data && catRes.data.length > 0) {
        currentCats = catRes.data as Categoria[];
        setCategorias(currentCats);
        localStorage.setItem('harpia_cached_categorias_v4', JSON.stringify(currentCats));
      }

      if (prodRes.data && prodRes.data.length > 0) {
        const mapped = prodRes.data.map((p: any) => ({
          ...p,
          categoria: currentCats.find((c) => c.id === p.categoria_id) || null
        }));
        setProdutos(mapped);
        localStorage.setItem('harpia_cached_produtos_v4', JSON.stringify(mapped));
      }

      if (profRes.data && profRes.data.length > 0) {
        setVendedores(profRes.data as Profile[]);
        localStorage.setItem('harpia_cached_vendedores_v4', JSON.stringify(profRes.data));
      }
    } catch (err) {
      console.warn('Operando com dados locais:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Sincronização em segundo plano sem travar a interface
    fetchData(true);
  }, [fetchData]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-100/70">
      <Navbar
        onOpenInstallModal={() => setIsInstallModalOpen(true)}
        isInstalled={isInstalled}
      />

      {/* Barra de Status Offline se necessário */}
      {!isOnline && (
        <div className="bg-amber-500 text-white text-xs font-semibold py-1.5 px-4 text-center flex items-center justify-center gap-1.5 shadow-xs">
          <WifiOff size={14} />
          <span>Modo Offline: Você está visualizando a tabela oficial armazenada no seu aparelho.</span>
        </div>
      )}

      {/* Conteúdo Principal */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-3 sm:p-5">
        {isAdmin ? (
          <AdminView
            produtos={produtos}
            categorias={categorias}
            vendedores={vendedores}
            loading={loading}
            onRefresh={() => fetchData(false)}
          />
        ) : (
          <SellerView
            produtos={produtos}
            categorias={categorias}
            loading={loading}
            onRefresh={() => fetchData(false)}
          />
        )}
      </main>

      {/* Rodapé */}
      <footer className="bg-white border-t border-slate-200 mt-auto py-4 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700">Harpia Nutrição Animal</span>
            <span>•</span>
            <span>Tabela Oficial de Preços ({produtos.length} produtos cadastrados)</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-slate-400">
            {isOnline ? (
              <span className="flex items-center gap-1 text-emerald-600 font-medium">
                <Wifi size={12} /> Sincronizado com Supabase
              </span>
            ) : (
              <span className="flex items-center gap-1 text-amber-600 font-medium">
                <WifiOff size={12} /> Modo Offline
              </span>
            )}
          </div>
        </div>
      </footer>

      {/* Modal PWA */}
      <InstallModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
        isIOS={isIOS}
        onInstallAndroid={installApp}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainContent />
    </AuthProvider>
  );
}
