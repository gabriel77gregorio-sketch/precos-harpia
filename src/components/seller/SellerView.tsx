import React, { useState, useMemo } from 'react';
import type { Produto, Categoria, TipoSecao } from '../../types/database';
import { ProductListItem } from './ProductListItem';
import { ProductDetailModal } from './ProductDetailModal';
import { FamilyGrid } from './FamilyGrid';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import {
  Search,
  AlertCircle,
  RefreshCw,
  Layers,
  Wheat,
  Filter,
  ArrowLeft,
  ShoppingCart
} from 'lucide-react';
import { formatPercent, getFamiliaColorConfig, isItemInsumo, matchProdutoFamilia } from '../../lib/utils';

interface SellerViewProps {
  produtos: Produto[];
  categorias: Categoria[];
  loading: boolean;
  onRefresh: () => void;
}

export const SellerView: React.FC<SellerViewProps> = ({
  produtos,
  categorias: _categorias,
  loading,
  onRefresh: _onRefresh
}) => {
  const { profile } = useAuth();
  const { totalItems, setIsCartOpen } = useCart();
  const [searchTerm, setSearchTerm] = useState('');
  
  // 1. As duas grandes separações solicitadas: Rações e Insumos
  const [secaoAtiva, setSecaoAtiva] = useState<TipoSecao>('racoes');
  
  // 2. Família selecionada (null = mostra a grade de opções de famílias)
  const [selectedFamily, setSelectedFamily] = useState<string | null>(null);

  // Modal de Detalhes do Produto Selecionado
  const [selectedProduct, setSelectedProduct] = useState<Produto | null>(null);

  const comissao = profile?.comissao_porcentagem || 8.0;
  const vendedorKey = profile?.vendedor_key || 'luciano';

  // Contagem por seção considerando a regra de nome comercial
  const countRacoes = useMemo(
    () => produtos.filter(p => !isItemInsumo(p) && p.ativo).length,
    [produtos]
  );
  const countInsumos = useMemo(
    () => produtos.filter(p => isItemInsumo(p) && p.ativo).length,
    [produtos]
  );

  // Lista de famílias de rações para chips de filtro rápido
  const familiasRacoes = [
    { id: 'todas', label: 'Todas as Rações' },
    { id: 'Harmilk', label: 'Harmilk (Leite)' },
    { id: 'Harbeef', label: 'Harbeef (Corte)' },
    { id: 'Harphos', label: 'Harphos (Minerais)' },
    { id: 'Harpig', label: 'Harpig (Suínos)' },
    { id: 'Aves', label: 'Harpia Aves' },
    { id: 'H Horse', label: 'H Horse (Equinos)' },
    { id: 'Harsheep', label: 'Harsheep (Ovinos)' }
  ];

  // Determina se deve exibir a Grade de Famílias:
  // Só na aba de rações, quando nenhuma família foi escolhida e não há busca digitada
  const showFamilyGrid = secaoAtiva === 'racoes' && selectedFamily === null && !searchTerm.trim();

  // Filtragem dos produtos
  const filteredProdutos = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();

    return produtos.filter((p) => {
      if (!p.ativo) return false;

      // 1. Filtro pela grande separação (Rações vs Insumos)
      const isThisInsumo = isItemInsumo(p);
      if (secaoAtiva === 'insumos' && !isThisInsumo) return false;
      if (secaoAtiva === 'racoes' && isThisInsumo) return false;

      // 2. Filtro pela Família Selecionada (se não for busca global e não for 'todas')
      if (secaoAtiva === 'racoes' && selectedFamily && selectedFamily !== 'todas' && !term) {
        if (!matchProdutoFamilia(p, selectedFamily)) return false;
      }

      // 3. Busca por termo
      if (term) {
        const matchNome = p.nome.toLowerCase().includes(term);
        const matchSku = p.sku ? p.sku.toLowerCase().includes(term) : false;
        const matchDesc = p.descricao ? p.descricao.toLowerCase().includes(term) : false;
        const matchIndic = p.indicacoes ? p.indicacoes.toLowerCase().includes(term) : false;
        const matchPeso = p.peso_unitario ? `${p.peso_unitario}kg`.includes(term) || `${p.peso_unitario} kg`.includes(term) : false;
        const matchFam = p.familia ? p.familia.toLowerCase().includes(term) : false;

        return matchNome || matchSku || matchDesc || matchIndic || matchPeso || matchFam;
      }

      return true;
    });
  }, [produtos, searchTerm, secaoAtiva, selectedFamily]);

  const activeFamilyConfig = selectedFamily && selectedFamily !== 'todas'
    ? getFamiliaColorConfig(selectedFamily)
    : null;

  return (
    <div className="space-y-3.5 sm:space-y-4">
      {/* Banner de Boas-vindas e Vendedor Ativo */}
      <div className="bg-gradient-to-br from-[#006837] to-[#004d28] rounded-2xl p-3.5 sm:p-5 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full">
                Portal de Vendas & Consultoria
              </span>
              <span className="text-[10px] bg-emerald-400/30 text-emerald-100 font-semibold px-2 py-0.5 rounded-full">
                Tabela Oficial 03/09/2026
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black">
              Olá, {profile?.full_name?.split(' ')[0] || 'Consultor'}!
            </h2>
            <p className="text-xs text-emerald-100 mt-0.5 max-w-lg">
              Consulte preços, monte pedidos no carrinho e envie direto pelo WhatsApp.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {/* Box do Vendedor */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-2.5 sm:p-3 border border-white/20 shrink-0">
              <span className="text-[10px] text-emerald-200 block uppercase font-medium">
                Tabela Ativa
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-xl sm:text-2xl font-black text-white">
                  {formatPercent(comissao)}
                </span>
                <span className="text-[11px] text-emerald-200">
                  ({vendedorKey ? vendedorKey.toUpperCase() : 'BALCÃO'})
                </span>
              </div>
            </div>

            {/* Acesso rápido ao Carrinho no Banner */}
            {totalItems > 0 && (
              <button
                onClick={() => setIsCartOpen(true)}
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black p-2.5 sm:p-3 rounded-xl shadow-xs transition flex items-center gap-2 active:scale-95"
                title="Ver Pedido Atual"
              >
                <ShoppingCart size={18} />
                <div className="text-left leading-tight hidden sm:block">
                  <span className="text-[10px] font-bold uppercase block opacity-80">Carrinho</span>
                  <span className="text-xs font-black">{totalItems} sacos</span>
                </div>
              </button>
            )}
          </div>
        </div>

        {/* Efeito decorativo de fundo */}
        <div className="absolute -right-8 -bottom-8 w-36 h-36 bg-white/5 rounded-full pointer-events-none" />
      </div>

      {/* ÁREA SUPERIOR FIXA: Campo de Busca (Web e Mobile) e Seletor Rações/Insumos */}
      <div className="sticky top-[53px] sm:top-[61px] z-30 bg-slate-100/95 backdrop-blur-md py-2 -mx-2 px-2 sm:-mx-3 sm:px-3 space-y-2.5 border-b border-slate-200/80 shadow-2xs">
        
        {/* Campo de Busca Superior (Web & Mobile) */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Buscar por nome (ex: Lac 22, Engorda), peso (40kg, 20kg), insumo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-20 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-[#006837] focus:border-[#006837] shadow-2xs placeholder:text-slate-400 transition"
          />
          {searchTerm ? (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded-lg transition"
            >
              Limpar
            </button>
          ) : (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-medium text-slate-400 hidden sm:inline">
              Busca em tempo real
            </span>
          )}
        </div>

        {/* AS DUAS GRANDES SEPARAÇÕES: RAÇÕES E INSUMOS */}
        <div className="flex items-center justify-between gap-2">
          <div className="grid grid-cols-2 p-1 bg-slate-200/80 rounded-xl w-full sm:max-w-md shadow-inner">
            <button
              onClick={() => {
                setSecaoAtiva('racoes');
                // Ao clicar em Rações, reseta para mostrar a grade de famílias caso queira navegar
                if (secaoAtiva !== 'racoes') {
                  setSelectedFamily(null);
                  setSearchTerm('');
                }
              }}
              className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold transition-all duration-150 ${
                secaoAtiva === 'racoes'
                  ? 'bg-white text-[#006837] shadow-xs scale-[1.01]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Wheat size={15} className={secaoAtiva === 'racoes' ? 'text-[#006837]' : 'text-slate-500'} />
              <span>Rações & Produtos</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                secaoAtiva === 'racoes' ? 'bg-emerald-100 text-[#006837]' : 'bg-slate-300/80 text-slate-700'
              }`}>
                {countRacoes}
              </span>
            </button>

            <button
              onClick={() => {
                setSecaoAtiva('insumos');
                setSelectedFamily(null);
              }}
              className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold transition-all duration-150 ${
                secaoAtiva === 'insumos'
                  ? 'bg-white text-orange-800 shadow-xs scale-[1.01]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Layers size={15} className={secaoAtiva === 'insumos' ? 'text-orange-600' : 'text-slate-500'} />
              <span>Insumos</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                secaoAtiva === 'insumos' ? 'bg-orange-100 text-orange-800' : 'bg-slate-300/80 text-slate-700'
              }`}>
                {countInsumos}
              </span>
            </button>
          </div>

          <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-500 font-medium shrink-0">
            <Filter size={13} className="text-slate-400" />
            <span>
              {showFamilyGrid
                ? '7 Famílias Disponíveis'
                : `Exibindo ${filteredProdutos.length} itens`}
            </span>
          </div>
        </div>

        {/* BARRA DE NAVEGAÇÃO / RETORNO DA FAMÍLIA (quando dentro de uma família ou em busca) */}
        {secaoAtiva === 'racoes' && !showFamilyGrid && (
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between gap-2">
              <button
                onClick={() => {
                  setSelectedFamily(null);
                  setSearchTerm('');
                }}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#006837] hover:text-[#00522c] bg-white hover:bg-emerald-50 border border-slate-200 px-3 py-1.5 rounded-xl transition shadow-2xs"
              >
                <ArrowLeft size={14} />
                <span>Voltar para todas as Famílias</span>
              </button>

              {activeFamilyConfig && (
                <span className={`text-xs font-black uppercase tracking-wider px-2.5 py-1 rounded-lg border ${activeFamilyConfig.bgBadge} ${activeFamilyConfig.textBadge} ${activeFamilyConfig.borderBadge}`}>
                  Linha {activeFamilyConfig.nome} ({filteredProdutos.length} itens)
                </span>
              )}

              {searchTerm && (
                <span className="text-xs font-semibold text-slate-500">
                  Buscando por: "<strong>{searchTerm}</strong>"
                </span>
              )}
            </div>

            {/* Chips rápidos horizontais para alternar entre famílias */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-0.5 pb-1 -mx-1 px-1">
              {familiasRacoes.map((f) => {
                const isSelected = selectedFamily === f.id || (f.id === 'todas' && selectedFamily === 'todas');
                const colorConfig = f.id !== 'todas' ? getFamiliaColorConfig(f.id) : null;

                return (
                  <button
                    key={f.id}
                    onClick={() => {
                      setSelectedFamily(f.id);
                      setSearchTerm('');
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold shrink-0 transition flex items-center gap-1.5 border ${
                      isSelected
                        ? f.id === 'todas'
                          ? 'bg-[#006837] text-white border-[#006837] shadow-xs'
                          : `${colorConfig?.bgBadge} ${colorConfig?.textBadge} ${colorConfig?.borderBadge} ring-1 ring-slate-400/30 font-black shadow-xs`
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {colorConfig && (
                      <span className={`w-2 h-2 rounded-full ${colorConfig.dotColor}`} />
                    )}
                    <span>{f.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ÁREA DE CONTEÚDO */}
      {loading && produtos.length === 0 ? (
        <div className="py-16 text-center">
          <RefreshCw size={28} className="animate-spin mx-auto text-[#006837] mb-2" />
          <p className="text-sm font-medium text-slate-600">Atualizando tabela de preços oficiais...</p>
        </div>
      ) : showFamilyGrid ? (
        /* GRADE DE FAMÍLIAS (ANTES DE MOSTRAR TODA A LISTA) */
        <FamilyGrid
          produtos={produtos}
          onSelectFamily={(famId) => setSelectedFamily(famId)}
          onViewAll={() => setSelectedFamily('todas')}
        />
      ) : filteredProdutos.length > 0 ? (
        /* LISTA COMPACTA DOS PRODUTOS DA FAMÍLIA OU INSUMOS */
        <div className="space-y-1.5 sm:space-y-2">
          {/* Cabeçalho sutil de colunas no Desktop */}
          <div className="hidden sm:flex items-center justify-between px-4 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            <span>Produto / Embalagem</span>
            <div className="flex items-center gap-8 pr-12">
              <span>Preço Unitário</span>
              <span>Ações / Pedido</span>
            </div>
          </div>

          {/* Itens em formato de lista */}
          {filteredProdutos.map((produto) => (
            <ProductListItem
              key={produto.id}
              produto={produto}
              vendedorKey={vendedorKey}
              vendedorNome={profile?.full_name}
              comissaoPorcentagem={comissao}
              onClick={() => setSelectedProduct(produto)}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 shadow-2xs">
          <AlertCircle size={36} className="mx-auto text-slate-400 mb-2" />
          <h4 className="font-bold text-slate-800 text-base">Nenhum produto encontrado</h4>
          <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto mt-1">
            Não encontramos itens correspondentes aos filtros selecionados.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedFamily(null);
            }}
            className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[#006837] bg-emerald-50 px-3 py-1.5 rounded-lg hover:bg-emerald-100 transition"
          >
            Voltar para a grade de famílias
          </button>
        </div>
      )}

      {/* MODAL DE DETALHES COMPLETO DO PRODUTO */}
      <ProductDetailModal
        produto={selectedProduct}
        isOpen={Boolean(selectedProduct)}
        onClose={() => setSelectedProduct(null)}
        vendedorKey={vendedorKey}
        vendedorNome={profile?.full_name}
        comissaoPorcentagem={comissao}
      />
    </div>
  );
};
