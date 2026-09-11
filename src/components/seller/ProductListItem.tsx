import React from 'react';
import type { Produto, VendedorKey } from '../../types/database';
import { formatCurrency, getPrecoVendedor, getFamiliaColorConfig, getUnidadeLabel, calculateCommission } from '../../lib/utils';
import { ChevronRight, Package, Tag, ShoppingCart, Plus } from 'lucide-react';
import { useCart } from '../../context/CartContext';

interface ProductListItemProps {
  produto: Produto;
  vendedorKey?: VendedorKey;
  vendedorNome?: string;
  comissaoPorcentagem: number;
  onClick: () => void;
}

export const ProductListItem: React.FC<ProductListItemProps> = ({
  produto,
  vendedorKey,
  comissaoPorcentagem,
  onClick
}) => {
  const { addToCart, getItemQuantity } = useCart();
  const precoVendedor = getPrecoVendedor(produto, vendedorKey);
  const colorConfig = getFamiliaColorConfig(produto.familia || produto.categoria?.nome);
  const unidadeTexto = getUnidadeLabel(produto.unidade_tipo, produto.peso_unitario);
  const comissaoUnitaria = calculateCommission(precoVendedor, comissaoPorcentagem);
  const qtdNoCarrinho = getItemQuantity(produto.id);


  const formatVendedorLabel = (key?: VendedorKey) => {
    switch (key) {
      case 'luciano':
        return 'Tabela Luciano (8%)';
      case 'wendel':
        return 'Tabela Wendel (6%)';
      case 'harpia':
        return 'Tabela Harpia (4%)';
      case 'loja':
        return 'Tabela Loja (12%)';
      case 'balcao':
      default:
        return 'Tabela Balcão';
    }
  };

  return (
    <div
      onClick={onClick}
      className="group relative bg-white rounded-xl border border-slate-200/90 hover:border-slate-300 hover:shadow-sm transition-all duration-150 cursor-pointer overflow-hidden flex items-stretch select-none active:bg-slate-50/80"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
    >
      {/* Barra vertical indicadora de cor por família */}
      <div className={`w-1.5 shrink-0 ${colorConfig.accentBar}`} />

      {/* Conteúdo principal da linha */}
      <div className="flex-1 p-3 sm:px-4 sm:py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4">
        
        {/* Esquerda: Família, Nome, Embalagem/Variação */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1 flex-wrap">
            {/* Badge da Família com cores dinâmicas */}
            <span
              className={`text-[10px] sm:text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${colorConfig.bgBadge} ${colorConfig.textBadge} ${colorConfig.borderBadge}`}
            >
              {colorConfig.nome}
            </span>

            {/* Badge de Peso / Variação */}
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200/60">
              <Package size={11} className="text-slate-500" />
              {unidadeTexto}
            </span>

            {/* Código SKU discreto */}
            {produto.sku && (
              <span className="text-[10px] font-mono text-slate-400 hidden md:inline-block">
                {produto.sku}
              </span>
            )}
          </div>

          {/* Nome do Produto */}
          <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug group-hover:text-[#006837] transition-colors truncate">
            {produto.nome}
          </h3>

          {/* Breve indicação se disponível */}
          {produto.indicacoes && (
            <p className="text-xs text-slate-500 truncate mt-0.5 hidden sm:block max-w-lg">
              {produto.indicacoes}
            </p>
          )}
        </div>

        {/* Direita: Preço para aquele Vendedor e Ação */}
        <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
          <div className="text-left sm:text-right">
            <div className="flex items-baseline sm:justify-end gap-1.5">
              <span className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                {formatCurrency(precoVendedor)}
              </span>
              <span className="text-[11px] text-slate-500 font-medium">
                /{produto.unidade_tipo === 'saco' ? 'sc' : produto.unidade_tipo}
              </span>
            </div>

            <div className="flex items-center gap-1.5 sm:justify-end mt-0.5">
              <span className="text-[10px] font-medium text-slate-500">
                {formatVendedorLabel(vendedorKey)}
              </span>
              {comissaoPorcentagem > 0 && (
                <span className="text-[10px] font-bold text-[#006837] bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200/60 inline-flex items-center gap-0.5">
                  <Tag size={9} />
                  +{formatCurrency(comissaoUnitaria)}
                </span>
              )}
            </div>
          </div>

          {/* Botão de Adicionar Rápido ao Carrinho */}
          <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
            {qtdNoCarrinho > 0 ? (
              <button
                onClick={() => addToCart(produto, 5, vendedorKey)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-2.5 py-1.5 rounded-xl flex items-center gap-1 shadow-2xs transition active:scale-95"
                title="Clique para adicionar mais 5 sacos"
              >
                <ShoppingCart size={13} />
                <span>{qtdNoCarrinho} sc</span>
                <Plus size={12} className="ml-0.5 opacity-80" />
              </button>
            ) : (
              <button
                onClick={() => addToCart(produto, 10, vendedorKey)}
                className="bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-[#006837] border border-slate-200 hover:border-emerald-300 text-xs font-bold px-2.5 py-1.5 rounded-xl flex items-center gap-1 transition active:scale-95 shadow-2xs"
                title="Adicionar ao pedido"
              >
                <ShoppingCart size={13} className="text-slate-500 hover:text-[#006837]" />
                <span className="hidden sm:inline">+ Carrinho</span>
                <span className="sm:hidden">+</span>
              </button>
            )}

            {/* Botão de expansão/detalhes */}
            <div className="w-7 h-7 rounded-full bg-slate-100 group-hover:bg-[#006837] group-hover:text-white text-slate-400 flex items-center justify-center transition-colors shrink-0">
              <ChevronRight size={16} />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
