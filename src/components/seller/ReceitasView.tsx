import React, { useState, useMemo } from 'react';
import type { FormulaRacao, Insumo, FormulaItem, CustoExtra } from '../../types/formulacao';
import { initialFormulas } from '../../data/initialFormulas';
import { initialInsumos } from '../../data/initialInsumos';
import { formatCurrency, formatDateBR, getCategoriaBadgeStyle } from '../../lib/utils';
import {
  FlaskConical,
  Calendar,
  Share2,
  FileDown,
  StickyNote
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import harpiaLogoUrl from '../../assets/hero.png';

interface ReceitasViewProps {
  insumos?: Insumo[];
  formulas?: FormulaRacao[];
  onUpdateFormulas?: (formulas: FormulaRacao[]) => void;
  readOnly?: boolean;
}

export const ReceitasView: React.FC<ReceitasViewProps> = ({
  insumos: propsInsumos,
  formulas: propsFormulas
}) => {
  const insumos = useMemo(() => {
    if (propsInsumos && propsInsumos.length > 0) return propsInsumos;
    try {
      const cached = localStorage.getItem('harpia_insumos_v2');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn(e);
    }
    return initialInsumos;
  }, [propsInsumos]);

  const formulas = useMemo(() => {
    if (propsFormulas && propsFormulas.length > 0) return propsFormulas;
    try {
      const cached = localStorage.getItem('harpia_formulas_v2');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const ids = new Set(parsed.map((f: FormulaRacao) => f.id));
          const faltantes = initialFormulas.filter(f => !ids.has(f.id));
          if (faltantes.length > 0) {
            const merged = [...parsed, ...faltantes];
            localStorage.setItem('harpia_formulas_v2', JSON.stringify(merged));
            return merged;
          }
          return parsed;
        }
      }
    } catch (e) {
      console.warn(e);
    }
    return initialFormulas;
  }, [propsFormulas]);

  const [selectedFormulaId, setSelectedFormulaId] = useState<string>(
    formulas[0]?.id || 'formula-harpig-inicial-1047'
  );

  // Multiplicador da batida para fábrica (padrão 1 tonelada = 1x)
  const [multiplicadorBatida, setMultiplicadorBatida] = useState<number>(1);

  const activeFormula = useMemo(() => {
    return formulas.find(f => f.id === selectedFormulaId) || formulas[0];
  }, [formulas, selectedFormulaId]);

  // Cálculos da receita ativa
  const calculos = useMemo(() => {
    if (!activeFormula) {
      return {
        itensDetalhados: [],
        totalKgFormula: 0,
        custoInsumosTon: 0,
        custoOperacionalTon: 100,
        custoTotalTon: 0,
        pesoSaco: 40,
        sacosPorTon: 25,
        custoSaco: 0,
        totalKgBatida: 1000,
        totalSacosBatida: 25,
        custoTotalBatida: 0
      };
    }

    const pesoSaco = activeFormula.peso_saco_kg || 40;
    const sacosPorTon = 1000 / pesoSaco; // 25 sacos

    // Custo Operacional (P.S/SAC)
    const custoOperacionalTon =
      activeFormula.custos_extras?.reduce((sum: number, c: CustoExtra) => {
        if (c.tipo === 'fixo') return sum + c.valor;
        return sum;
      }, 0) || 100.00;

    let totalKgFormula = 0;
    let custoInsumosTon = 0;

    const itensDetalhados = activeFormula.itens.map((item: FormulaItem) => {
      const insumo = insumos.find(i => i.id === item.insumo_id);
      const precoKg = insumo?.preco_kg ?? (insumo ? insumo.preco_tonelada / 1000 : 0);
      const custoMistura = item.quantidade_kg * precoKg;

      totalKgFormula += item.quantidade_kg;
      custoInsumosTon += custoMistura;

      return {
        ...item,
        insumoNome: insumo?.nome || 'Insumo',
        categoria: insumo?.categoria || 'MACRO',
        precoKg,
        custoMistura,
        // Projeção para a batida selecionada
        kgBatida: item.quantidade_kg * multiplicadorBatida,
        custoBatida: custoMistura * multiplicadorBatida
      };
    });

    const custoTotalTon = custoInsumosTon + custoOperacionalTon;
    const custoSaco = custoTotalTon / sacosPorTon;

    return {
      itensDetalhados,
      totalKgFormula,
      custoInsumosTon,
      custoOperacionalTon,
      custoTotalTon,
      pesoSaco,
      sacosPorTon,
      custoSaco,
      totalKgBatida: totalKgFormula * multiplicadorBatida,
      totalSacosBatida: sacosPorTon * multiplicadorBatida,
      custoTotalBatida: custoTotalTon * multiplicadorBatida
    };
  }, [activeFormula, insumos, multiplicadorBatida]);

  const handleShare = () => {
    if (!activeFormula) return;
    const header = `*RECEITA / FÓRMULA OFICIAL HARPIA*\n*${activeFormula.produto_nome}*\n_Batida Padrão: 1 Tonelada (1.000 kg) | Atualizado em: ${formatDateBR(activeFormula.updated_at)}_\n\n`;
    const linhas = calculos.itensDetalhados
      .map(
        (it: any) =>
          `• *${it.insumoNome}*: ${it.quantidade_kg.toLocaleString('pt-BR')} kg (${formatCurrency(it.precoKg)}/kg) = ${formatCurrency(it.custoMistura)}`
      )
      .join('\n');

    const totais = `\n\n📊 *RESUMO DE CUSTOS:*\n• *Total Batida:* ${calculos.totalKgFormula.toLocaleString('pt-BR')} kg\n• *Custo TON (Insumos):* ${formatCurrency(calculos.custoInsumosTon)}\n• *P.S/SAC (Custo Operacional):* ${formatCurrency(calculos.custoOperacionalTon)}\n• *Custo por Saco (${calculos.pesoSaco}kg):* ${formatCurrency(calculos.custoSaco)}`;

    const notas = activeFormula.notas ? `\n\n📝 *OBSERVAÇÕES:*\n${activeFormula.notas}` : '';

    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(header + linhas + totais + notas)}`, '_blank');
  };

  const handleDownloadPdf = async () => {
    if (!activeFormula) return;
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();

    // Logo
    try {
      const response = await fetch(harpiaLogoUrl);
      const blob = await response.blob();
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      });
      doc.addImage(base64, 'PNG', 14, 8, 35, 18);
    } catch { /* logo opcional */ }

    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('FÓRMULA DE RAÇÃO', pageW / 2, 18, { align: 'center' });
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100);
    doc.text('DOCUMENTO CONFIDENCIAL - USO INTERNO HARPIA', pageW / 2, 24, { align: 'center' });
    doc.setTextColor(0);

    doc.setDrawColor(0, 104, 55);
    doc.setLineWidth(0.8);
    doc.line(14, 28, pageW - 14, 28);

    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text(activeFormula.produto_nome, 14, 35);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`Batida Padrão: 1 Tonelada (1.000 kg) | Saco ${calculos.pesoSaco}kg (${calculos.sacosPorTon.toFixed(0)} sacos/ton)`, 14, 41);
    const dataStr = new Date().toLocaleDateString('pt-BR');
    doc.text(`Data: ${dataStr}`, pageW - 14, 41, { align: 'right' });

    const rows = calculos.itensDetalhados.map((item: any) => [
      item.insumoNome,
      `R$ ${item.precoKg.toFixed(4)}`,
      `${item.quantidade_kg.toFixed(1)}`,
      `R$ ${item.custoMistura.toFixed(2)}`
    ]);

    autoTable(doc, {
      startY: 45,
      head: [['Matéria Prima', 'KG/MP', 'Fórmula KG', 'Custo Fórmula']],
      body: rows,
      foot: [[
        { content: 'Total Formula KG/Custo', colSpan: 2, styles: { fontStyle: 'bold', halign: 'left' as const } },
        { content: `${calculos.totalKgFormula.toFixed(1)}`, styles: { fontStyle: 'bold', halign: 'right' as const } },
        { content: `R$ ${calculos.custoInsumosTon.toFixed(2)}`, styles: { fontStyle: 'bold', halign: 'right' as const } }
      ]],
      styles: { fontSize: 8, cellPadding: 2.5 },
      headStyles: { fillColor: [0, 104, 55], textColor: 255, fontStyle: 'bold', halign: 'center' },
      footStyles: { fillColor: [247, 185, 139], textColor: [20, 20, 20], fontStyle: 'bold' },
      columnStyles: {
        0: { halign: 'left', cellWidth: 70 },
        1: { halign: 'right', cellWidth: 30 },
        2: { halign: 'right', cellWidth: 30 },
        3: { halign: 'right', cellWidth: 35 }
      },
      theme: 'grid',
      margin: { left: 14, right: 14 }
    });

    const finalY = (doc as any).lastAutoTable?.finalY || 160;
    let cursorY = finalY + 6;

    doc.setFillColor(252, 219, 199);
    doc.roundedRect(14, cursorY, pageW - 28, 32, 3, 3, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(60);
    doc.text('Custo TON (Insumos):', 20, cursorY + 8);
    doc.text(`R$ ${calculos.custoInsumosTon.toFixed(2)}`, pageW - 20, cursorY + 8, { align: 'right' });
    doc.text('P.S/SAC (Operacional):', 20, cursorY + 16);
    doc.text(`R$ ${calculos.custoOperacionalTon.toFixed(2)}`, pageW - 20, cursorY + 16, { align: 'right' });
    doc.setFontSize(11);
    doc.setTextColor(0, 104, 55);
    doc.text(`Custo/SC (${calculos.pesoSaco}kg):`, 20, cursorY + 26);
    doc.text(`R$ ${calculos.custoSaco.toFixed(2)}`, pageW - 20, cursorY + 26, { align: 'right' });
    doc.setTextColor(0);
    cursorY += 38;

    if (activeFormula.notas) {
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text('OBSERVAÇÕES:', 14, cursorY);
      cursorY += 5;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      const lines = doc.splitTextToSize(activeFormula.notas, pageW - 28);
      doc.text(lines, 14, cursorY);
    }

    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.3);
      doc.line(14, pageH - 18, pageW - 14, pageH - 18);
      doc.setFontSize(7);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(180, 0, 0);
      doc.text('⚠ DOCUMENTO CONFIDENCIAL - PROPRIEDADE HARPIA NUTRIÇÃO ANIMAL', pageW / 2, pageH - 13, { align: 'center' });
      doc.setFontSize(6.5);
      doc.setTextColor(120);
      doc.setFont('helvetica', 'normal');
      doc.text('Este documento contém informações estratégicas e proprietárias. Reprodução, distribuição ou divulgação não autorizada é proibida.', pageW / 2, pageH - 9, { align: 'center' });
      doc.text(`Gerado em ${dataStr} | Harpia Nutrição Animal`, pageW / 2, pageH - 5, { align: 'center' });
      doc.setTextColor(0);
    }

    const nomeArquivo = `Formula_${activeFormula.produto_nome.replace(/[^a-zA-Z0-9]/g, '_')}_${dataStr.replace(/\//g, '-')}.pdf`;
    doc.save(nomeArquivo);
  };

  return (
    <div className="space-y-4">
      {/* Seletor de Receita no topo */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-amber-100 text-amber-900 border border-amber-200 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                Ficha Técnica de Produção
              </span>
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <Calendar size={13} className="text-slate-400" />
                {formatDateBR(activeFormula?.updated_at)}
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 mt-1">
              Receitas e Fórmulas de Ração
            </h2>
            <p className="text-xs text-slate-500">
              Kilos usados por batida de 1t, custo de cada matéria-prima, custo operacional (P.S/SAC) e custo por saco.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleDownloadPdf}
              className="inline-flex items-center gap-1.5 bg-red-50 hover:bg-red-100 active:scale-95 text-red-600 px-3 py-2 rounded-xl text-xs font-bold transition shadow-xs border border-red-200"
              title="Baixar PDF da fórmula"
            >
              <FileDown size={14} />
              <span>PDF</span>
            </button>
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 bg-[#006837] hover:bg-[#00522c] active:scale-95 text-white px-3 py-2 rounded-xl text-xs font-bold transition shadow-xs"
              title="Compartilhar fórmula no WhatsApp"
            >
              <Share2 size={14} />
              <span>Compartilhar</span>
            </button>
          </div>
        </div>

        {/* Abas das Fórmulas — Grid 3 colunas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2 pt-1 max-h-[380px] overflow-y-auto pr-1">
          {formulas.map(formula => {
            const isSelected = formula.id === selectedFormulaId;
            return (
              <button
                key={formula.id}
                onClick={() => {
                  setSelectedFormulaId(formula.id);
                  setMultiplicadorBatida(1);
                }}
                title={formula.produto_nome}
                className={`p-2.5 rounded-xl text-xs font-bold transition flex items-start gap-2 border text-left ${
                  isSelected
                    ? 'bg-amber-600 text-white border-amber-700 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                }`}
              >
                <FlaskConical size={15} className={`shrink-0 mt-0.5 ${isSelected ? 'text-amber-100' : 'text-slate-400'}`} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1.5">
                    <span className="leading-snug line-clamp-2">{formula.produto_nome}</span>
                    {formula.codigo && (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono shrink-0 ${
                        isSelected ? 'bg-black/25 text-white' : 'bg-slate-200 text-slate-700'
                      }`}>
                        #{formula.codigo}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {activeFormula && (
        <div className="bg-white rounded-2xl border border-slate-300 shadow-md overflow-hidden">
          {/* Cabeçalho da Planilha idêntico ao modelo físico oficial */}
          <div className="bg-[#f7b98b] px-4 py-3 border-b-2 border-slate-700/60 text-center">
            <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-wide uppercase">
              {activeFormula.produto_nome}
            </h3>
            <span className="text-[11px] font-bold text-slate-800">
              Batida Padrão: 1 Tonelada (1.000 kg) • Saco {calculos.pesoSaco} kg ({calculos.sacosPorTon} sacos/ton)
            </span>
          </div>

          {/* TABELA DE MATÉRIAS-PRIMAS DA RECEITA */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="bg-white border-b-2 border-slate-800 font-bold text-slate-900 text-xs sm:text-sm">
                  <th className="px-4 py-2.5 border-r border-slate-300">Matéria Prima</th>
                  <th className="px-3 py-2.5 text-right border-r border-slate-300 w-28 sm:w-32">KG/MP</th>
                  <th className="px-3 py-2.5 text-right border-r border-slate-300 w-28 sm:w-32">Fórmula KG</th>
                  <th className="px-4 py-2.5 text-right w-36 sm:w-40">Custo Formula</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-300">
                {calculos.itensDetalhados.map((item: any, idx: number) => {
                  const badge = getCategoriaBadgeStyle(item.categoria);
                  return (
                    <tr
                      key={item.insumo_id || idx}
                      className="hover:bg-amber-50/40 transition-colors"
                    >
                      {/* Matéria Prima */}
                      <td className="px-4 py-2.5 font-semibold text-slate-900 border-r border-slate-300">
                        <div className="flex items-center justify-between gap-2">
                          <span>{item.insumoNome}</span>
                          <span className={`text-[9px] font-black uppercase px-1.5 py-0.2 rounded border ${badge.bg} ${badge.text} ${badge.border}`}>
                            {item.categoria}
                          </span>
                        </div>
                      </td>

                      {/* KG/MP (Preço por kg da MP) */}
                      <td className="px-3 py-2.5 text-right text-slate-700 font-mono font-medium border-r border-slate-300 whitespace-nowrap">
                        {formatCurrency(item.precoKg)}
                      </td>

                      {/* Fórmula KG (Kilos usados por batida de 1t) */}
                      <td className="px-3 py-2.5 text-right font-black text-slate-900 font-mono border-r border-slate-300 whitespace-nowrap">
                        {item.quantidade_kg.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
                      </td>

                      {/* Custo Formula (Preço * Kilos) */}
                      <td className="px-4 py-2.5 text-right font-black text-slate-950 font-mono whitespace-nowrap">
                        {formatCurrency(item.custoMistura)}
                      </td>
                    </tr>
                  );
                })}

                {/* LINHA: Total Formula KG/Custo */}
                <tr className="bg-[#f9d7c3] font-bold text-slate-900 border-t-2 border-b border-slate-800 text-xs sm:text-sm">
                  <td className="px-4 py-2.5 border-r border-slate-300 font-black" colSpan={2}>
                    Total Formula KG/Custo
                  </td>
                  <td className="px-3 py-2.5 text-right font-black font-mono border-r border-slate-300">
                    {calculos.totalKgFormula.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
                  </td>
                  <td className="px-4 py-2.5 text-right font-black font-mono text-slate-950 text-sm sm:text-base">
                    {formatCurrency(calculos.custoInsumosTon)}
                  </td>
                </tr>

                {/* LINHA: Custo TON */}
                <tr className="bg-[#fcdbc7] font-bold text-slate-900 border-b border-slate-400">
                  <td className="px-4 py-2.5 text-right border-r border-slate-300 font-black uppercase" colSpan={2}>
                    Custo TON
                  </td>
                  <td className="px-3 py-2.5 text-right border-r border-slate-300 font-black font-mono">
                    R$
                  </td>
                  <td className="px-4 py-2.5 text-right font-black font-mono text-slate-950 text-sm sm:text-base">
                    {formatCurrency(calculos.custoInsumosTon).replace('R$', '').trim()}
                  </td>
                </tr>

                {/* LINHA: P.S/SAC (Custo Operacional Produção + Saco) */}
                <tr className="bg-[#fcdbc7] font-bold text-slate-900 border-b border-slate-400">
                  <td className="px-4 py-2.5 text-right border-r border-slate-300 font-black uppercase" colSpan={2}>
                    P.S/SAC
                  </td>
                  <td className="px-3 py-2.5 text-right border-r border-slate-300 font-black font-mono">
                    R$
                  </td>
                  <td className="px-4 py-2.5 text-right font-black font-mono text-slate-950 text-sm sm:text-base">
                    {formatCurrency(calculos.custoOperacionalTon).replace('R$', '').trim()}
                  </td>
                </tr>

                {/* LINHA: Custo/SC (Custo por Saco de 40kg) */}
                <tr className="bg-[#f7b98b] font-black text-slate-950 border-t-2 border-slate-800 text-sm sm:text-base">
                  <td className="px-4 py-3 text-right border-r border-slate-400 uppercase" colSpan={2}>
                    Custo/SC ({calculos.pesoSaco}kg)
                  </td>
                  <td className="px-3 py-3 text-right border-r border-slate-400 font-mono">
                    R$
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-[#006837] text-base sm:text-lg">
                    {formatCurrency(calculos.custoSaco).replace('R$', '').trim()}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* SIMULADOR DE BATIDA PARA FÁBRICA / MISTURADOR */}
          <div className="bg-slate-50 p-4 border-t border-slate-300 space-y-2.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-xs font-black text-slate-800 block">
                  Simulador de Batida no Misturador:
                </span>
                <span className="text-[11px] text-slate-500">
                  Escolha o volume a ser batido para ver a pesagem exata de cada ingrediente:
                </span>
              </div>

              {/* Botões de Batida */}
              <div className="flex items-center gap-1.5">
                {[0.5, 1, 2, 3, 5].map(ton => (
                  <button
                    key={ton}
                    onClick={() => setMultiplicadorBatida(ton)}
                    className={`px-2.5 py-1 text-xs font-bold rounded-lg transition border ${
                      multiplicadorBatida === ton
                        ? 'bg-[#006837] text-white border-[#006837] shadow-xs'
                        : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    {ton === 1 ? '1 Ton (Padrão)' : `${ton} Ton`}
                  </button>
                ))}
              </div>
            </div>

            {multiplicadorBatida !== 1 && (
              <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-200 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div>
                  <span className="font-bold text-emerald-950 block">
                    Batida de {multiplicadorBatida} Toneladas ({(multiplicadorBatida * 1000).toLocaleString('pt-BR')} kg):
                  </span>
                  <span className="text-emerald-700">
                    Rendimento: <strong>{calculos.totalSacosBatida} sacos</strong> de {calculos.pesoSaco}kg
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-emerald-700 block">Custo Total da Batida</span>
                  <span className="text-base font-black text-emerald-900">
                    {formatCurrency(calculos.custoTotalBatida)}
                  </span>
                </div>
              </div>
            )}

            {/* Observações da fórmula */}
            {activeFormula.notas && (
              <div className="bg-amber-50/70 border border-amber-200/90 rounded-xl p-3 flex items-start gap-2.5">
                <StickyNote size={15} className="text-amber-600 shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <span className="text-[11px] font-black uppercase text-amber-900 block tracking-wider">
                    Observações da Fórmula:
                  </span>
                  <p className="text-xs text-amber-950 mt-0.5 whitespace-pre-line leading-relaxed">
                    {activeFormula.notas}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
