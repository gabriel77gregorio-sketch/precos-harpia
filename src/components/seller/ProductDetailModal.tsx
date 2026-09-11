import React, { useState } from 'react';
import type { Produto, VendedorKey } from '../../types/database';
import {
  formatCurrency,
  formatPercent,
  getPrecoVendedor,
  getFamiliaColorConfig,
  getUnidadeLabel,
  calculateCommission,
  shareOnWhatsApp
} from '../../lib/utils';
import {
  X,
  Package,
  Share2,
  CheckCircle,
  Scale,
  Calculator,
  Info,
  DollarSign,
  ShoppingCart
} from 'lucide-react';
import { useCart } from '../../context/CartContext';

interface ProductDetailModalProps {
  produto: Produto | null;
  isOpen: boolean;
  onClose: () => void;
  vendedorKey?: VendedorKey;
  vendedorNome?: string;
  comissaoPorcentagem: number;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  produto,
  isOpen,
  onClose,
  vendedorKey,
  vendedorNome,
  comissaoPorcentagem
}) => {
  const { addToCart, setIsCartOpen } = useCart();
  const [quantidade, setQuantidade] = useState<number>(20);
  const [addedFeedback, setAddedFeedback] = useState(false);

  if (!isOpen || !produto) return null;

  const colorConfig = getFamiliaColorConfig(produto.familia || produto.categoria?.nome);
  const unidadeTexto = getUnidadeLabel(produto.unidade_tipo, produto.peso_unitario);
  const precoAtivo = getPrecoVendedor(produto, vendedorKey);
  const comissaoUnitaria = calculateCommission(precoAtivo, comissaoPorcentagem);

  const totalVenda = precoAtivo * (quantidade || 0);
  const totalComissao = comissaoUnitaria * (quantidade || 0);

  // Lista dos vendedores e seus preços na tabela oficial
  const vendedoresTabela: Array<{ key: VendedorKey; label: string; desc: string }> = [
    { key: 'balcao', label: 'Balcão', desc: 'Tabela Cheia' },
    { key: 'loja', label: 'Loja Harpia', desc: 'Desconto 12%' },
    { key: 'luciano', label: 'Luciano', desc: 'Desconto 8%' },
    { key: 'wendel', label: 'Wendel', desc: 'Desconto 6%' },
    { key: 'harpia', label: 'Harpia', desc: 'Desconto 4%' }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div
        className="fixed inset-0"
        onClick={onClose}
      />

      <div className="relative bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[92vh]">
        {/* Topo / Header com a cor da família */}
        <div className={`p-4 sm:p-5 border-b border-slate-100 flex items-start justify-between gap-3 ${colorConfig.lightBg}`}>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className={`text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${colorConfig.bgBadge} ${colorConfig.textBadge} ${colorConfig.borderBadge}`}>
                {colorConfig.nome}
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-white/90 text-slate-700 border border-slate-200/80 flex items-center gap-1 shadow-2xs">
                <Package size={13} className="text-slate-500" />
                {unidadeTexto}
              </span>
              {produto.sku && (
                <span className="text-[11px] font-mono text-slate-500 bg-white/80 px-2 py-0.5 rounded border border-slate-200/70">
                  {produto.sku}
                </span>
              )}
            </div>

            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-snug">
              {produto.nome}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/80 hover:bg-white text-slate-500 hover:text-slate-800 flex items-center justify-center shadow-2xs transition shrink-0"
          >
            <X size={18} />
          </button>
        </div>

        {/* Corpo com rolagem */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 sm:space-y-5 text-sm">
          
          {/* Card de Preço Ativo */}
          <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/5 rounded-xl p-4 border border-emerald-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[11px] uppercase tracking-wider font-bold text-emerald-800 block">
                Preço Disponível ({vendedorKey ? vendedorKey.toUpperCase() : 'BALCÃO'})
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {formatCurrency(precoAtivo)}
                </span>
                <span className="text-xs font-medium text-slate-500">
                  /{unidadeTexto}
                </span>
              </div>
            </div>

            {comissaoPorcentagem > 0 && (
              <div className="bg-white rounded-lg p-2.5 border border-emerald-200 shadow-2xs shrink-0">
                <span className="text-[10px] text-slate-500 block uppercase font-medium">
                  Sua Comissão ({formatPercent(comissaoPorcentagem)})
                </span>
                <span className="text-base font-black text-[#006837]">
                  +{formatCurrency(comissaoUnitaria)} /sc
                </span>
              </div>
            )}
          </div>

          {/* Tabela de Preços dos Vendedores Oficiais */}
          {produto.precos_vendedores && (
            <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200">
              <div className="flex items-center gap-1.5 mb-2.5 text-xs font-bold text-slate-700">
                <DollarSign size={14} className="text-[#006837]" />
                <span>Tabela Oficial Harpia por Vendedor</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {vendedoresTabela.map((v) => {
                  const isCurrent = (vendedorKey || 'balcao') === v.key;
                  const price = getPrecoVendedor(produto, v.key);

                  return (
                    <div
                      key={v.key}
                      className={`rounded-lg p-2 border transition ${
                        isCurrent
                          ? 'bg-emerald-50/80 border-emerald-300 ring-1 ring-emerald-500/30'
                          : 'bg-white border-slate-200/80'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-[11px] font-bold block ${isCurrent ? 'text-[#006837]' : 'text-slate-700'}`}>
                          {v.label}
                        </span>
                        {isCurrent && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#006837]" />
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 block -mt-0.5">
                        {v.desc}
                      </span>
                      <span className="text-xs font-black text-slate-900 mt-1 block">
                        {formatCurrency(price)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Informações Técnicas */}
          <div className="space-y-2.5">
            {produto.indicacoes && (
              <div className="flex items-start gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <CheckCircle size={16} className="text-[#006837] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-xs font-bold text-slate-800 block">Indicação de Uso:</strong>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                    {produto.indicacoes}
                  </p>
                </div>
              </div>
            )}

            {produto.consumo_recomendado && (
              <div className="flex items-start gap-2 bg-emerald-50/60 p-3 rounded-xl border border-emerald-100">
                <Scale size={16} className="text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-xs font-bold text-emerald-900 block">Consumo Recomendado:</strong>
                  <p className="text-xs text-emerald-800 mt-0.5 leading-relaxed">
                    {produto.consumo_recomendado}
                  </p>
                </div>
              </div>
            )}

            {produto.descricao && (
              <div className="flex items-start gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <Info size={16} className="text-slate-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-xs font-bold text-slate-800 block">Descrição:</strong>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                    {produto.descricao}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Simulador de Proposta por Quantidade */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                <Calculator size={15} className="text-[#006837]" />
                <span>Simulador de Proposta</span>
              </div>
              <div className="flex items-center gap-1.5">
                <label className="text-xs font-semibold text-slate-600">Qtd ({produto.unidade_tipo === 'saco' ? 'sacos' : 'un'}):</label>
                <input
                  type="number"
                  min="1"
                  max="10000"
                  value={quantidade}
                  onChange={(e) => setQuantidade(Math.max(1, Number(e.target.value) || 0))}
                  className="w-20 px-2 py-1 text-right text-xs font-bold bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#006837]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2.5 border-t border-slate-200">
              <div className="bg-white p-2 rounded-lg border border-slate-200/80">
                <span className="text-[10px] uppercase font-semibold text-slate-400 block">Total Proposta</span>
                <span className="text-base font-extrabold text-slate-900">
                  {formatCurrency(totalVenda)}
                </span>
              </div>
              <div className="bg-emerald-50/70 p-2 rounded-lg border border-emerald-200/80 text-right">
                <span className="text-[10px] uppercase font-semibold text-emerald-700 block">Sua Comissão Total</span>
                <span className="text-base font-extrabold text-[#006837]">
                  {formatCurrency(totalComissao)}
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Rodapé / Ações */}
        <div className="p-3.5 sm:p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-200/70 rounded-xl transition"
            >
              Fechar
            </button>

            <button
              onClick={() => shareOnWhatsApp(
                produto.nome,
                unidadeTexto,
                precoAtivo,
                vendedorNome,
                produto.indicacoes,
                produto.consumo_recomendado
              )}
              className="inline-flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-3 py-2 rounded-xl transition"
              title="Compartilhar apenas este item"
            >
              <Share2 size={13} />
              <span>WhatsApp</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                addToCart(produto, quantidade, vendedorKey);
                setAddedFeedback(true);
                setTimeout(() => setAddedFeedback(false), 2000);
              }}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 bg-[#006837] hover:bg-[#00522c] text-white text-xs font-black px-4 py-2.5 rounded-xl shadow-xs transition active:scale-95"
            >
              <ShoppingCart size={15} />
              <span>
                {addedFeedback ? '✓ Adicionado ao Pedido!' : `+ Adicionar ${quantidade} ${produto.unidade_tipo === 'saco' ? 'sacos' : 'un'} ao Pedido`}
              </span>
            </button>

            {addedFeedback && (
              <button
                onClick={() => {
                  onClose();
                  setIsCartOpen(true);
                }}
                className="text-xs font-bold text-[#006837] bg-emerald-100 hover:bg-emerald-200 px-3 py-2.5 rounded-xl transition animate-in fade-in"
              >
                Ver Carrinho
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
