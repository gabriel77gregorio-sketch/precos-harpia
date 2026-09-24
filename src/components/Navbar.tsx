import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserCheck, Shield, ChevronDown, Check, Smartphone } from 'lucide-react';
import type { VendedorKey } from '../types/database';

interface NavbarProps {
  onOpenInstallModal: () => void;
  isInstalled: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenInstallModal, isInstalled }) => {
  const { profile, isAdmin, isSeller, switchDemoUser } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Lista dos vendedores oficiais com suas respectivas tabelas de preço do PDF
  const demoSellers: Array<{
    name: string;
    role: 'admin' | 'seller';
    commission: number;
    label: string;
    vendedorKey: VendedorKey;
    badge: string;
  }> = [
    { name: 'Luciano', role: 'seller', commission: 8.0, label: 'Luciano (Consultor)', vendedorKey: 'luciano', badge: 'Luciano' },
    { name: 'Wendel', role: 'seller', commission: 6.0, label: 'Wendel (Consultor)', vendedorKey: 'wendel', badge: 'Wendel' },
    { name: 'Harpia', role: 'seller', commission: 4.0, label: 'Harpia (Consultor)', vendedorKey: 'harpia', badge: 'Harpia' },
    { name: 'Loja', role: 'seller', commission: 12.0, label: 'Loja Harpia', vendedorKey: 'loja', badge: 'Loja' },
    { name: 'Balcão', role: 'seller', commission: 0.0, label: 'Balcão Fábrica', vendedorKey: 'balcao', badge: 'Balcão' },
    { name: 'Admin Geral', role: 'admin', commission: 0, label: 'Gestão Harpia (Administrador)', vendedorKey: 'balcao', badge: 'Admin' }
  ];


  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between gap-2">
        {/* Logo Harpia */}
        <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
          <div className="bg-white p-1 rounded-lg border border-slate-100 shadow-2xs">
            <img
              src="/harpia-logo.jpg"
              alt="Harpia Nutrição Animal"
              className="h-7 sm:h-9 object-contain"
            />
          </div>
          <div className="hidden min-[420px]:block">
            <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-[#006837] block leading-none">
              Tabela Oficial
            </span>
            <h1 className="text-xs sm:text-sm font-bold text-slate-800 leading-tight">
              Preços & Catálogo
            </h1>
          </div>
        </div>

        {/* Ações / Perfil / Instalar PWA */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Botão de Instalação PWA */}
          {!isInstalled && (
            <button
              onClick={onOpenInstallModal}
              className="flex items-center gap-1 sm:gap-1.5 text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-[#006837] border border-emerald-200 px-2.5 py-1.5 rounded-lg transition active:scale-95 shadow-2xs"
              title="Instalar App no celular"
            >
              <Smartphone size={15} className="shrink-0 text-[#006837]" />
              <span className="hidden sm:inline">Baixar App</span>
              <span className="sm:hidden">App</span>
            </button>
          )}

          {/* Seletor de Perfil / Vendedor */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-1.5 text-xs bg-slate-100 hover:bg-slate-200/80 text-slate-700 px-2.5 py-1.5 rounded-lg transition font-medium border border-slate-200"
            >
              {isAdmin ? (
                <Shield size={14} className="text-amber-600" />
              ) : (
                <UserCheck size={14} className="text-[#006837]" />
              )}
              <div className="text-left">
                <span className="font-semibold block max-w-[100px] sm:max-w-[140px] truncate text-slate-900">
                  {isAdmin ? 'Gestão Admin' : profile?.full_name?.split(' ')[0] || 'Vendedor'}
                </span>
                {isSeller && (
                  <span className="text-[10px] text-emerald-700 font-bold leading-none block">
                    Consultor Harpia
                  </span>
                )}
              </div>
              <ChevronDown size={14} className="text-slate-400 ml-0.5" />
            </button>

            {dropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-1.5 border-b border-slate-100 text-[11px] font-semibold uppercase text-slate-400 tracking-wider">
                    Alternar Acesso (Demonstração)
                  </div>
                  {demoSellers.map((s, idx) => {
                    const isCurrent =
                      (s.role === 'admin' && isAdmin) ||
                      (s.role === 'seller' && isSeller && (profile?.vendedor_key === s.vendedorKey || profile?.full_name?.includes(s.name)));

                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          switchDemoUser(s.role, s.commission, s.name, s.vendedorKey);
                          setDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 transition ${
                          isCurrent ? 'bg-emerald-50/70 text-[#006837] font-semibold' : 'text-slate-700'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-1.5">
                            {s.role === 'admin' ? (
                              <Shield size={13} className="text-amber-600" />
                            ) : (
                              <UserCheck size={13} className="text-[#006837]" />
                            )}
                            <span>{s.label}</span>
                          </div>
                        </div>
                        {isCurrent && <Check size={14} className="text-[#006837]" />}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
