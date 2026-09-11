import React, { useState } from 'react';
import type { Produto } from '../../types/database';
import { formatCurrency, formatPercent, calculateCommission, getUnidadeLabel, shareOnWhatsApp } from '../../lib/utils';
import { Share2, Package, Tag, Calculator, ChevronDown, ChevronUp, CheckCircle, Scale } from 'lucide-react';

interface ProductCardProps {
  produto: Produto;
  comissaoPorcentagem: number;
  vendedorNome?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  produto,
  comissaoPorcentagem,
  vendedorNome
}) => {
  const [showSimulador, setShowSimulador] = useState(false);
  const [quantidade, setQuantidade] = useState<number>(10);

  const comissaoUnitaria = calculateCommission(produto.preco_base, comissaoPorcentagem);
  const unidadeTexto = getUnidadeLabel(produto.unidade_tipo, produto.peso_unitario);

  const totalVenda = (produto.preco_base || 0) * (quantidade || 0);
  const totalComissao = comissaoUnitaria * (quantidade || 0);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition duration-200 overflow-hidden flex flex-col">
      {/* Topo do Card */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex flex-wrap items-center gap-1.5">
            {produto.categoria && (
              <span className="text-[11px] font-bold tracking-wide uppercase px-2 py-0.5 rounded-md bg-emerald-50 text-[#006837] border border-emerald-200">
                {produto.categoria.nome}
              </span>
            )}
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 flex items-center gap-1">
              <Package size={12} className="text-slate-500" />
              {unidadeTexto}
            </span>
          </div>
          {produto.sku && (
            <span className="text-[10px] font-mono text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">
              {produto.sku}
            </span>
          )}
        </div>

        {/* Nome do Produto */}
        <h3 className="font-extrabold text-slate-900 text-base sm:text-lg leading-snug">
          {produto.nome}
        </h3>

        {/* Informações Técnicas do Catálogo */}
        <div className="mt-2.5 space-y-1.5 text-xs">
          {produto.indicacoes && (
            <div className="flex items-start gap-1.5 text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">
              <CheckCircle size={13} className="text-[#006837] shrink-0 mt-0.5" />
              <div className="leading-snug">
                <strong className="text-slate-700 font-semibold">Indicação: </strong>
                <span>{produto.indicacoes}</span>
              </div>
            </div>
          )}

          {produto.consumo_recomendado && (
            <div className="flex items-start gap-1.5 text-emerald-900 bg-emerald-50/50 p-2 rounded-lg border border-emerald-100">
              <Scale size={13} className="text-emerald-700 shrink-0 mt-0.5" />
              <div className="leading-snug">
                <strong className="text-emerald-800 font-semibold">Consumo: </strong>
                <span>{produto.consumo_recomendado}</span>
              </div>
            </div>
          )}
        </div>

        {/* Preço de Tabela */}
        <div className="mt-auto pt-3 border-t border-slate-100">
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block">
                Preço de Tabela (Fábrica)
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {formatCurrency(produto.preco_base)}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  / {unidadeTexto}
                </span>
              </div>
            </div>

            {/* Preço Mínimo se houver */}
            {produto.preco_minimo && produto.preco_minimo > 0 && (
              <div className="text-right">
                <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                  Piso Mínimo
                </span>
                <span className="text-xs font-bold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 inline-block">
                  {formatCurrency(produto.preco_minimo)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Box da Comissão do Vendedor */}
        <div className="mt-3 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/80 rounded-xl p-2.5 sm:p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Tag size={15} className="text-[#006837]" />
              <span className="text-xs font-bold text-emerald-900">
                Sua Comissão ({formatPercent(comissaoPorcentagem)}):
              </span>
            </div>
            <div className="text-right">
              <span className="text-sm font-black text-[#006837]">
                + {formatCurrency(comissaoUnitaria)}
              </span>
              <span className="text-[10px] text-emerald-700 block font-semibold">
                por {unidadeTexto.split(' ')[0].toLowerCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Bloco Expansível de Simulação de Cotação */}
        {showSimulador && (
          <div className="mt-3 bg-slate-50 border border-slate-200 rounded-xl p-3 animate-in fade-in duration-200">
            <div className="flex items-center justify-between gap-2 mb-2">
              <label className="text-xs font-bold text-slate-700">
                Simular Quantidade ({unidadeTexto.split(' ')[0]}s):
              </label>
              <input
                type="number"
                min="1"
                max="10000"
                value={quantidade}
                onChange={(e) => setQuantidade(Math.max(1, Number(e.target.value) || 0))}
                className="w-20 px-2 py-1 text-right text-xs font-bold bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#006837]"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 text-xs">
              <div>
                <span className="text-slate-500 block text-[10px]">Total Proposta:</span>
                <span className="font-bold text-slate-900">
                  {formatCurrency(totalVenda)}
                </span>
              </div>
              <div className="text-right">
                <span className="text-emerald-700 block text-[10px] font-semibold">Sua Comissão Total:</span>
                <span className="font-extrabold text-[#006837]">
                  {formatCurrency(totalComissao)}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Ações Inferiores do Card */}
      <div className="px-4 py-2.5 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-2">
        <button
          onClick={() => setShowSimulador(!showSimulador)}
          className="text-xs font-semibold text-slate-600 hover:text-slate-800 flex items-center gap-1 py-1 px-2 rounded-lg hover:bg-slate-200/60 transition"
        >
          <Calculator size={14} className="text-slate-500" />
          <span>{showSimulador ? 'Ocultar' : 'Simular Proposta'}</span>
          {showSimulador ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        <button
          onClick={() => shareOnWhatsApp(
            produto.nome,
            unidadeTexto,
            produto.preco_base,
            vendedorNome,
            produto.indicacoes,
            produto.consumo_recomendado
          )}
          className="inline-flex items-center gap-1.5 bg-[#006837] hover:bg-[#00522c] text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-2xs transition active:scale-95"
          title="Compartilhar proposta técnica no WhatsApp"
        >
          <Share2 size={13} />
          <span>WhatsApp</span>
        </button>
      </div>
    </div>
  );
};
