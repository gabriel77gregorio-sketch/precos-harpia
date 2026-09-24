import React, { useState } from 'react';
import type { Produto, VendedorKey } from '../../types/database';
import { formatCurrency, getFamiliaColorConfig, getUnidadeLabel } from '../../lib/utils';
import { ChevronRight, Package, ShoppingCart, Plus, Edit3, Check, X, RotateCcw } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useSellerPricing } from '../../context/SellerPricingContext';

interface ProductListItemProps {
  produto: Produto;
  vendedorKey?: VendedorKey;
  vendedorNome?: string;
  comissaoPorcentagem?: number;
  onClick: () => void;
}

export const ProductListItem: React.FC<ProductListItemProps> = ({
  produto,
  vendedorKey,
  onClick
}) => {
  const { addToCart, getItemQuantity } = useCart();
  const { getPrecoCusto, getPrecoPraticado, isCustomPrice, setCustomPrice, removeCustomPrice } = useSellerPricing();

  const [isEditingInline, setIsEditingInline] = useState(false);
  const precoCusto = getPrecoCusto(produto);
  const precoPraticado = getPrecoPraticado(produto);
  const isIndividual = isCustomPrice(produto.id);

  const [tempPrice, setTempPrice] = useState(precoPraticado.toFixed(2));

  const colorConfig = getFamiliaColorConfig(produto.familia || produto.categoria?.nome);
  const unidadeTexto = getUnidadeLabel(produto.unidade_tipo, produto.peso_unitario);
  const qtdNoCarrinho = getItemQuantity(produto.id);

  const margemRealReais = precoPraticado - precoCusto;
  const margemRealPercent = precoCusto > 0 ? (margemRealReais / precoCusto) * 100 : 0;

  const handleSaveInlinePrice = (e: React.MouseEvent | React.FormEvent) => {
    e.stopPropagation();
    const num = parseFloat(tempPrice.replace(',', '.'));
    if (!isNaN(num) && num >= 0) {
      setCustomPrice(produto.id, num);
    }
    setIsEditingInline(false);
  };

  const handleResetIndividual = (e: React.MouseEvent) => {
    e.stopPropagation();
    removeCustomPrice(produto.id);
    setIsEditingInline(false);
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

            {/* Tag se tiver preço customizado individual */}
            {isIndividual && (
              <span className="text-[10px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded bg-amber-50 text-amber-800 border border-amber-300">
                Preço Ajustado
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

        {/* Direita: Preço Praticado de Venda, Custo e Ações */}
        <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
          <div className="text-left sm:text-right">
            
            {/* Edição Rápida Inline de Preço Praticado */}
            {isEditingInline ? (
              <div
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1 bg-white p-1 rounded-lg border border-emerald-500 shadow-md"
              >
                <span className="text-xs font-black text-slate-500 pl-1">R$</span>
                <input
                  type="number"
                  step="0.10"
                  min="0"
                  value={tempPrice}
                  onChange={(e) => setTempPrice(e.target.value)}
                  className="w-20 px-1 py-0.5 text-xs font-black border border-slate-200 rounded text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-[#006837]"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveInlinePrice(e);
                    if (e.key === 'Escape') setIsEditingInline(false);
                  }}
                />
                <button
                  type="button"
                  onClick={handleSaveInlinePrice}
                  className="p-1 bg-[#006837] text-white rounded hover:bg-[#00522c]"
                  title="Salvar preço praticado"
                >
                  <Check size={12} />
                </button>
                {isIndividual && (
                  <button
                    type="button"
                    onClick={handleResetIndividual}
                    className="p-1 bg-slate-100 text-slate-600 rounded hover:bg-slate-200"
                    title="Remover preço individual e voltar ao padrão"
                  >
                    <RotateCcw size={12} />
                  </button>
                )}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEditingInline(false);
                  }}
                  className="p-1 bg-slate-100 text-slate-500 rounded hover:bg-slate-200"
                  title="Cancelar"
                >
                  <X size={12} />
                </button>
              </div>
            ) : (
              <div>
                <div className="flex items-baseline sm:justify-end gap-1.5">
                  <span className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                    {formatCurrency(precoPraticado)}
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">
                    /{produto.unidade_tipo === 'saco' ? 'sc' : produto.unidade_tipo}
                  </span>
                  
                  {/* Botão sutil para alterar preço praticado desse produto */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setTempPrice(precoPraticado.toFixed(2));
                      setIsEditingInline(true);
                    }}
                    className="p-1 text-slate-400 hover:text-[#006837] hover:bg-emerald-50 rounded transition"
                    title="Definir preço de venda praticado para este produto"
                  >
                    <Edit3 size={13} />
                  </button>
                </div>

                <div className="flex items-center gap-1.5 sm:justify-end mt-0.5 flex-wrap">
                  <span className="text-[10px] font-medium text-slate-500">
                    Custo: <strong>{formatCurrency(precoCusto)}</strong>
                  </span>
                  {margemRealReais > 0 && (
                    <span className="text-[10px] font-bold text-[#006837] bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200/60 inline-flex items-center gap-0.5">
                      +{formatCurrency(margemRealReais)} (+{margemRealPercent.toFixed(1)}%)
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Botão de Adicionar Rápido ao Carrinho */}
          <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
            {qtdNoCarrinho > 0 ? (
              <button
                type="button"
                onClick={() => addToCart(produto, 5, vendedorKey, precoPraticado)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-2.5 py-1.5 rounded-xl flex items-center gap-1 shadow-2xs transition active:scale-95"
                title="Clique para adicionar mais 5 sacos"
              >
                <ShoppingCart size={13} />
                <span>{qtdNoCarrinho} sc</span>
                <Plus size={12} className="ml-0.5 opacity-80" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => addToCart(produto, 10, vendedorKey, precoPraticado)}
                className="bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-[#006837] border border-slate-200 hover:border-emerald-300 text-xs font-bold px-2.5 py-1.5 rounded-xl flex items-center gap-1 transition active:scale-95 shadow-2xs"
                title="Adicionar ao pedido com seu preço praticado"
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
