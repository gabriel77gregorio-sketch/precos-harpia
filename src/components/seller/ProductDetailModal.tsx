import React, { useState, useEffect, useMemo } from 'react';
import type { Produto, VendedorKey } from '../../types/database';
import {
  formatCurrency,
  getFamiliaColorConfig,
  getUnidadeLabel,
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
  ShoppingCart,
  TrendingUp,
  RotateCcw,
  Check,
  Edit3,
  Sparkles
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useSellerPricing } from '../../context/SellerPricingContext';
import { initialFormulas } from '../../data/initialFormulas';
import { initialInsumos } from '../../data/initialInsumos';

interface ProductDetailModalProps {
  produto: Produto | null;
  isOpen: boolean;
  onClose: () => void;
  vendedorKey?: VendedorKey;
  vendedorNome?: string;
  comissaoPorcentagem?: number;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  produto,
  isOpen,
  onClose,
  vendedorKey,
  vendedorNome
}) => {
  const { addToCart, setIsCartOpen } = useCart();
  const {
    getPrecoCusto,
    getPrecoPraticado,
    isCustomPrice,
    setCustomPrice,
    removeCustomPrice
  } = useSellerPricing();

  const [quantidade, setQuantidade] = useState<number>(20);
  const [addedFeedback, setAddedFeedback] = useState(false);
  const [customPriceInput, setCustomPriceInput] = useState<string>('');
  const [savedFeedback, setSavedFeedback] = useState(false);

  useEffect(() => {
    if (produto) {
      setCustomPriceInput(getPrecoPraticado(produto).toFixed(2));
    }
  }, [produto, isOpen, getPrecoPraticado]);

  if (!isOpen || !produto) return null;

  const colorConfig = getFamiliaColorConfig(produto.familia || produto.categoria?.nome);
  const unidadeTexto = getUnidadeLabel(produto.unidade_tipo, produto.peso_unitario);
  
  const precoCusto = getPrecoCusto(produto);
  const precoPraticado = getPrecoPraticado(produto);
  const isIndividual = isCustomPrice(produto.id);

  const lucroUnitario = Math.max(0, precoPraticado - precoCusto);
  const lucroPercent = precoCusto > 0 ? (lucroUnitario / precoCusto) * 100 : 0;

  // Busca lista de ingredientes oficiais (apenas nomes, sem custos nem pesos)
  const ingredientes = useMemo(() => {
    if (!produto) return [];
    try {
      let formulas = initialFormulas;
      const cached = localStorage.getItem('harpia_formulas_v2');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) formulas = parsed;
      }
      const match = formulas.find(
        (f) =>
          f.produto_id === produto.id ||
          f.produto_nome.toLowerCase().includes(produto.nome.toLowerCase()) ||
          produto.nome.toLowerCase().includes(f.produto_nome.toLowerCase().split('(')[0].trim())
      );
      if (!match) return [];

      let insumos = initialInsumos;
      const cachedIns = localStorage.getItem('harpia_insumos_v2');
      if (cachedIns) {
        const parsedIns = JSON.parse(cachedIns);
        if (Array.isArray(parsedIns) && parsedIns.length > 0) insumos = parsedIns;
      }

      return match.itens.map((it) => {
        const ins = insumos.find((i) => i.id === it.insumo_id);
        return ins?.nome || 'Ingrediente';
      });
    } catch {
      return [];
    }
  }, [produto]);

  const totalVenda = precoPraticado * (quantidade || 0);
  const totalCusto = precoCusto * (quantidade || 0);
  const totalLucro = totalVenda - totalCusto;

  const handleSavePrice = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(customPriceInput.replace(',', '.'));
    if (!isNaN(val) && val >= 0) {
      setCustomPrice(produto.id, val);
      setSavedFeedback(true);
      setTimeout(() => setSavedFeedback(false), 2000);
    }
  };

  const handleResetPrice = () => {
    removeCustomPrice(produto.id);
    setCustomPriceInput(precoCusto.toFixed(2));
  };

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
              {isIndividual && (
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
                  Preço Customizado
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
          
          {/* Card de Preço de Custo e Preço Praticado */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50/40 rounded-2xl p-4 border border-emerald-500/20 space-y-3.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-emerald-200/60">
              {/* Preço de Custo Fábrica */}
              <div>
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-500 block">
                  Seu Preço de Custo (Fábrica)
                </span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
                    {formatCurrency(precoCusto)}
                  </span>
                  <span className="text-xs font-medium text-slate-500">
                    /{unidadeTexto}
                  </span>
                </div>
              </div>

              {/* Preço Praticado Atual */}
              <div className="sm:text-right">
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-[#006837] block">
                  Seu Preço de Venda (Praticado)
                </span>
                <div className="flex items-baseline sm:justify-end gap-1 mt-0.5">
                  <span className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
                    {formatCurrency(precoPraticado)}
                  </span>
                  <span className="text-xs font-medium text-slate-500">
                    /{unidadeTexto}
                  </span>
                </div>
              </div>
            </div>

            {/* Ajuste Individual do Preço Praticado deste Produto */}
            <form onSubmit={handleSavePrice} className="space-y-2">
              <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Edit3 size={13} className="text-[#006837]" />
                  Ajustar preço de venda deste produto:
                </span>
                {savedFeedback && (
                  <span className="text-emerald-700 font-bold text-[11px] flex items-center gap-1">
                    <Check size={12} /> Salvo com sucesso!
                  </span>
                )}
              </label>

              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                    R$
                  </span>
                  <input
                    type="number"
                    step="0.10"
                    min="0"
                    value={customPriceInput}
                    onChange={(e) => setCustomPriceInput(e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-sm font-black text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#006837]"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-[#006837] hover:bg-[#00522c] text-white px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-2xs"
                >
                  Salvar Preço
                </button>

                {isIndividual && (
                  <button
                    type="button"
                    onClick={handleResetPrice}
                    className="bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 px-3 py-2 rounded-xl text-xs font-semibold transition"
                    title="Remover ajuste individual e voltar ao padrão"
                  >
                    <RotateCcw size={14} />
                  </button>
                )}
              </div>

              {lucroUnitario > 0 && (
                <div className="text-[11px] font-bold text-[#006837] bg-white px-2.5 py-1 rounded-lg border border-emerald-200/80 inline-flex items-center gap-1">
                  <TrendingUp size={12} />
                  <span>
                    Sua margem de ganho neste produto: <strong>+{formatCurrency(lucroUnitario)}/sc</strong> (+{lucroPercent.toFixed(1)}%)
                  </span>
                </div>
              )}
            </form>
          </div>

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

            {ingredientes.length > 0 && (
              <div className="bg-emerald-50/50 p-3 rounded-xl border border-emerald-200/80 space-y-1.5">
                <div className="flex items-center justify-between">
                  <strong className="text-xs font-bold text-[#006837] flex items-center gap-1.5">
                    <Sparkles size={14} className="text-amber-500" />
                    Composição Qualitativa (Ingredientes):
                  </strong>
                  <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                    {ingredientes.length} matérias-primas
                  </span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-medium bg-white/70 p-2.5 rounded-lg border border-emerald-100">
                  {ingredientes.join(', ')}.
                </p>
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
              <div className="bg-white p-2.5 rounded-lg border border-slate-200/80">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Proposta Cliente</span>
                <span className="text-base font-black text-slate-900">
                  {formatCurrency(totalVenda)}
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">
                  ({quantidade}x {formatCurrency(precoPraticado)})
                </span>
              </div>
              <div className="bg-emerald-50/70 p-2.5 rounded-lg border border-emerald-200/80 text-right">
                <span className="text-[10px] uppercase font-bold text-emerald-800 block">Sua Margem / Lucro Estimado</span>
                <span className="text-base font-black text-[#006837]">
                  +{formatCurrency(totalLucro)}
                </span>
                <span className="text-[10px] text-emerald-700 block mt-0.5">
                  Custo Fábrica: {formatCurrency(totalCusto)}
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Rodapé / Ações */}
        <div className="p-3.5 sm:p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-200/70 rounded-xl transition"
            >
              Fechar
            </button>

            <button
              type="button"
              onClick={() => shareOnWhatsApp(
                produto.nome,
                unidadeTexto,
                precoPraticado,
                vendedorNome,
                produto.indicacoes,
                produto.consumo_recomendado
              )}
              className="inline-flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-3 py-2 rounded-xl transition"
              title="Compartilhar proposta no WhatsApp com seu preço praticado"
            >
              <Share2 size={13} />
              <span>WhatsApp</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                addToCart(produto, quantidade, vendedorKey, precoPraticado);
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
                type="button"
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
