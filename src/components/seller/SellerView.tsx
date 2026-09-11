import React, { useState, useMemo } from 'react';
import type { Produto, Categoria } from '../../types/database';
import { ProductCard } from './ProductCard';
import { useAuth } from '../../context/AuthContext';
import { Search, AlertCircle, RefreshCw } from 'lucide-react';
import { formatPercent } from '../../lib/utils';

interface SellerViewProps {
  produtos: Produto[];
  categorias: Categoria[];
  loading: boolean;
  onRefresh: () => void;
}

export const SellerView: React.FC<SellerViewProps> = ({
  produtos,
  categorias,
  loading,
  onRefresh: _onRefresh
}) => {
  const { profile } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoria, setSelectedCategoria] = useState<string>('todas');

  const comissao = profile?.comissao_porcentagem || 5.0;

  // Filtragem ágil e em tempo real
  const filteredProdutos = useMemo(() => {
    return produtos.filter((p) => {
      const matchSearch =
        p.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.sku && p.sku.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (p.descricao && p.descricao.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchCategoria =
        selectedCategoria === 'todas' || p.categoria_id === selectedCategoria;

      return matchSearch && matchCategoria && p.ativo;
    });
  }, [produtos, searchTerm, selectedCategoria]);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Banner de Boas-vindas e Comissão do Vendedor */}
      <div className="bg-gradient-to-br from-[#006837] to-[#004d28] rounded-2xl p-4 sm:p-6 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full">
                Portal do Consultor / Vendedor
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black">
              Olá, {profile?.full_name?.split(' ')[0] || 'Vendedor'}!
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100 mt-0.5">
              Consulte a tabela oficial de preços e visualize sua margem de comissão em tempo real.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 sm:p-3.5 border border-white/20 shrink-0 self-start sm:self-auto">
            <span className="text-[10px] sm:text-xs text-emerald-200 block uppercase font-medium">
              Sua Alíquota de Comissão
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-black text-white">
                {formatPercent(comissao)}
              </span>
              <span className="text-xs text-emerald-200">/ produto vendido</span>
            </div>
          </div>
        </div>

        {/* Efeito decorativo de fundo */}
        <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-white/5 rounded-full pointer-events-none" />
      </div>

      {/* Barra de Busca e Filtro de Categorias */}
      <div className="space-y-3 sticky top-[57px] sm:top-[65px] z-30 bg-slate-50/95 backdrop-blur-xs py-2 -mx-3 px-3 sm:-mx-4 sm:px-4">
        {/* Input de Busca */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Buscar ração por nome, código SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#006837] shadow-2xs"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 px-1.5 py-0.5 rounded-full"
            >
              Limpar
            </button>
          )}
        </div>

        {/* Chips Horizontais de Categoria */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <button
            onClick={() => setSelectedCategoria('todas')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 transition ${
              selectedCategoria === 'todas'
                ? 'bg-[#006837] text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            Todas as Categorias ({produtos.filter(p => p.ativo).length})
          </button>
          {categorias.map((cat) => {
            const count = produtos.filter(p => p.categoria_id === cat.id && p.ativo).length;
            const isSelected = selectedCategoria === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategoria(cat.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 transition ${
                  isSelected
                    ? 'bg-[#006837] text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {cat.nome} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Indicador de Carregamento ou Lista de Produtos */}
      {loading && produtos.length === 0 ? (
        <div className="py-16 text-center">
          <RefreshCw size={28} className="animate-spin mx-auto text-[#006837] mb-2" />
          <p className="text-sm font-medium text-slate-600">Carregando catálogo de preços...</p>
        </div>
      ) : filteredProdutos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProdutos.map((produto) => (
            <ProductCard
              key={produto.id}
              produto={produto}
              comissaoPorcentagem={comissao}
              vendedorNome={profile?.full_name}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 shadow-2xs">
          <AlertCircle size={36} className="mx-auto text-slate-400 mb-2" />
          <h4 className="font-bold text-slate-800 text-base">Nenhum produto encontrado</h4>
          <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto mt-1">
            Não encontramos produtos correspondentes ao termo "{searchTerm}". Tente buscar por outra palavra-chave ou limpe os filtros.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategoria('todas');
            }}
            className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[#006837] bg-emerald-50 px-3 py-1.5 rounded-lg hover:bg-emerald-100 transition"
          >
            Ver todos os produtos
          </button>
        </div>
      )}
    </div>
  );
};
