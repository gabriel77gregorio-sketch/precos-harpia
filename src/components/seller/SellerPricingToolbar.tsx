import React, { useState } from 'react';
import { useSellerPricing } from '../../context/SellerPricingContext';
import {
  TrendingUp,
  RotateCcw,
  Check,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Info
} from 'lucide-react';

export const SellerPricingToolbar: React.FC = () => {
  const {
    markupPercent,
    customPricesCount,
    hasCustomizations,
    setMarkupPercent,
    resetAllPricing
  } = useSellerPricing();

  const [isOpen, setIsOpen] = useState(false);
  const [tempPercent, setTempPercent] = useState<string>(markupPercent > 0 ? String(markupPercent) : '');
  const [showAppliedToast, setShowAppliedToast] = useState(false);

  const presets = [0, 5, 8, 10, 12, 15, 20];

  const handleApplyPercent = (val: number) => {
    setMarkupPercent(val);
    setTempPercent(val > 0 ? String(val) : '');
    setShowAppliedToast(true);
    setTimeout(() => setShowAppliedToast(false), 2500);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(tempPercent.replace(',', '.'));
    if (!isNaN(num) && num >= 0) {
      handleApplyPercent(num);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-emerald-500/30 shadow-xs overflow-hidden transition-all duration-200">
      {/* Barra compacta superior de ativação */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="p-3 sm:px-4 sm:py-3 flex items-center justify-between cursor-pointer hover:bg-slate-50/80 transition select-none"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className={`p-2 rounded-xl shrink-0 ${hasCustomizations ? 'bg-[#006837] text-white shadow-2xs' : 'bg-emerald-50 text-[#006837]'}`}>
            <TrendingUp size={18} />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs sm:text-sm font-black text-slate-900">
                Seus Preços de Venda (Praticados)
              </span>
              {hasCustomizations ? (
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-[#006837] border border-emerald-300">
                  {markupPercent > 0 ? `+${markupPercent}% em todos` : 'Preços Ajustados'}
                </span>
              ) : (
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                  Tabela Fábrica (0% margem)
                </span>
              )}
              {customPricesCount > 0 && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                  {customPricesCount} {customPricesCount === 1 ? 'item customizado' : 'itens customizados'}
                </span>
              )}
            </div>

            <p className="text-[11px] text-slate-500 truncate mt-0.5 hidden sm:block">
              {hasCustomizations
                ? 'Seus preços de venda ativos serão usados no catálogo, carrinho e pedidos do WhatsApp.'
                : 'Clique para definir uma margem % geral ou ajustar preços de cada produto.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {showAppliedToast && (
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-lg flex items-center gap-1 animate-in fade-in">
              <Check size={13} />
              Aplicado!
            </span>
          )}

          <button
            type="button"
            className="text-xs font-bold text-[#006837] bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1.5 rounded-xl border border-emerald-200 transition flex items-center gap-1"
          >
            <span>{isOpen ? 'Ocultar' : 'Ajustar Margem'}</span>
            {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>
      </div>

      {/* Painel expandido de configuração rápida */}
      {isOpen && (
        <div className="p-3.5 sm:p-4 bg-gradient-to-b from-slate-50/60 to-slate-100/50 border-t border-slate-200/80 space-y-3.5">
          <div className="flex items-start gap-2 bg-emerald-50/60 p-2.5 rounded-xl border border-emerald-200/60 text-xs text-emerald-950">
            <Info size={16} className="text-[#006837] shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Você tem controle total sobre o preço de venda para seus clientes.
              Aplique uma porcentagem de margem sobre toda a tabela ou altere o preço individual de cada produto clicando sobre ele.
            </p>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1.5">
              1. Aplicar Margem Geral sobre todos os produtos:
            </label>

            {/* Presets rápidos */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {presets.map((p) => {
                const isActive = markupPercent === p;
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => handleApplyPercent(p)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black transition border shadow-2xs ${
                      isActive
                        ? 'bg-[#006837] text-white border-[#006837] scale-105'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-emerald-50 hover:border-emerald-300'
                    }`}
                  >
                    {p === 0 ? 'Custo (0%)' : `+${p}%`}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Input livre de porcentagem e botão reset */}
          <div className="pt-2 border-t border-slate-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <form onSubmit={handleCustomSubmit} className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-600">Outra porcentagem:</span>
              <div className="relative w-28">
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="500"
                  placeholder="Ex: 14.5"
                  value={tempPercent}
                  onChange={(e) => setTempPercent(e.target.value)}
                  className="w-full pl-2 pr-7 py-1.5 text-xs font-black bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#006837]"
                />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                  %
                </span>
              </div>
              <button
                type="submit"
                className="bg-[#006837] hover:bg-[#00522c] text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-2xs transition active:scale-95 flex items-center gap-1"
              >
                <Sparkles size={13} />
                <span>Aplicar a Todos</span>
              </button>
            </form>

            {hasCustomizations && (
              <button
                type="button"
                onClick={resetAllPricing}
                className="text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-3 py-1.5 rounded-lg transition flex items-center gap-1 self-start sm:self-auto"
                title="Limpar todas as margens e preços praticados customizados"
              >
                <RotateCcw size={13} />
                <span>Restaurar Preços da Fábrica</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
