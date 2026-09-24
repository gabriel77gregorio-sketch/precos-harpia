import React, { useState, useMemo } from 'react';
import type { FormulaRacao, Insumo, FormulaItem } from '../../types/formulacao';
import type { Produto } from '../../types/database';
import { initialFormulas } from '../../data/initialFormulas';
import { initialInsumos } from '../../data/initialInsumos';
import { formatDateBR, getCategoriaBadgeStyle } from '../../lib/utils';
import {
  Calendar,
  Share2,
  FileDown,
  Search,
  X,
  CheckCircle2,
  Copy,
  Check,
  FileText,
  ShieldCheck,
  Tag,
  Package,
  Layers,
  Sparkles
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import harpiaLogoUrl from '../../assets/logo-harpia.jpg';

interface IngredienteInfo {
  insumoId: string;
  nome: string;
  categoria: string;
}

interface ReceitasViewProps {
  insumos?: Insumo[];
  formulas?: FormulaRacao[];
  produtos?: Produto[];
  onUpdateFormulas?: (formulas: FormulaRacao[]) => void;
  readOnly?: boolean;
}

export const ReceitasView: React.FC<ReceitasViewProps> = ({
  insumos: propsInsumos,
  formulas: propsFormulas,
  produtos: propsProdutos
}) => {
  const [copiedComposicao, setCopiedComposicao] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

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

  // Filtragem das fórmulas pela barra de pesquisa
  const filteredFormulas = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return formulas;
    return formulas.filter(f =>
      f.produto_nome.toLowerCase().includes(term) ||
      (f.codigo && f.codigo.toLowerCase().includes(term))
    );
  }, [formulas, searchTerm]);

  const activeFormula = useMemo(() => {
    return formulas.find(f => f.id === selectedFormulaId) || formulas[0];
  }, [formulas, selectedFormulaId]);

  // Lista pura de ingredientes (matérias-primas presentes, SEM quantidades e SEM custos)
  const ingredientesList = useMemo<IngredienteInfo[]>(() => {
    if (!activeFormula) return [];
    return activeFormula.itens.map((item: FormulaItem): IngredienteInfo => {
      const insumo = insumos.find(i => i.id === item.insumo_id);
      return {
        insumoId: item.insumo_id,
        nome: insumo?.nome || 'Ingrediente Harpia',
        categoria: insumo?.categoria || 'MACRO'
      };
    });
  }, [activeFormula, insumos]);

  // Texto corrido da composição qualitativa (padrão de rótulo e bula)
  const textoComposicaoQualitativa = useMemo(() => {
    if (ingredientesList.length === 0) return '';
    return ingredientesList.map((i: IngredienteInfo) => i.nome).join(', ') + '.';
  }, [ingredientesList]);

  // Produto do catálogo oficial associado a esta fórmula (para obter indicações e consumo)
  const produtoAssociado = useMemo(() => {
    if (!activeFormula || !propsProdutos) return null;
    return propsProdutos.find(p =>
      (activeFormula.produto_id && p.id === activeFormula.produto_id) ||
      activeFormula.produto_nome.toLowerCase().includes(p.nome.toLowerCase()) ||
      p.nome.toLowerCase().includes(activeFormula.produto_nome.toLowerCase().split('(')[0].trim())
    );
  }, [activeFormula, propsProdutos]);

  const pesoSaco = activeFormula?.peso_saco_kg || produtoAssociado?.peso_unitario || 40;

  // Copiar Composição Qualitativa para o Clipboard
  const handleCopyComposicao = () => {
    if (!textoComposicaoQualitativa) return;
    navigator.clipboard.writeText(textoComposicaoQualitativa);
    setCopiedComposicao(true);
    setTimeout(() => setCopiedComposicao(false), 2500);
  };

  // Compartilhar Ficha Técnica via WhatsApp (Somente ingredientes, indicações e embalagem - ZERO custos)
  const handleShare = () => {
    if (!activeFormula) return;
    const header = `*HARPIA NUTRIÇÃO ANIMAL*\n*FICHA TÉCNICA COMERCIAL*\n*${activeFormula.produto_nome}*\n_Embalagem: Saco de ${pesoSaco} kg | Atualizado em: ${formatDateBR(activeFormula.updated_at)}_\n\n`;

    const composicao = `🌿 *COMPOSIÇÃO QUALITATIVA (INGREDIENTES):*\n${textoComposicaoQualitativa}\n\n`;

    const indicacoes = produtoAssociado?.indicacoes
      ? `📌 *INDICAÇÃO DE USO:*\n${produtoAssociado.indicacoes}\n\n`
      : '';

    const consumo = produtoAssociado?.consumo_recomendado
      ? `⚖ *CONSUMO RECOMENDADO / MODO DE USAR:*\n${produtoAssociado.consumo_recomendado}\n\n`
      : '';

    const obs = activeFormula.notas ? `📝 *INFORMAÇÕES ADICIONAIS:*\n${activeFormula.notas}\n\n` : '';

    const rodape = `📞 _Consulte seu representante Harpia para disponibilidade e pedidos._`;

    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(header + composicao + indicacoes + consumo + obs + rodape)}`, '_blank');
  };

  // Baixar Ficha Técnica Comercial em PDF (Sem custos e sem quantidades em kg)
  const handleDownloadPdf = async () => {
    if (!activeFormula) return;
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();

    // Logotipo Harpia
    try {
      const response = await fetch(harpiaLogoUrl);
      const blob = await response.blob();
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      });
      doc.addImage(base64, 'JPEG', 14, 6.5, 45, 18.6);
    } catch {
      // logo opcional se offline
    }

    doc.setFontSize(15);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 104, 55);
    doc.text('FICHA TÉCNICA E COMPOSIÇÃO', pageW / 2, 16, { align: 'center' });
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100);
    doc.text('HARPIA NUTRIÇÃO ANIMAL - INFORMAÇÕES TÉCNICAS DO PRODUTO', pageW / 2, 22, { align: 'center' });
    doc.setTextColor(0);

    doc.setDrawColor(0, 104, 55);
    doc.setLineWidth(0.8);
    doc.line(14, 27, pageW - 14, 27);

    // Título do Produto
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(20, 20, 20);
    doc.text(activeFormula.produto_nome, 14, 35);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80);
    doc.text(`Apresentação: Saco de ${pesoSaco} kg`, 14, 41);
    const dataStr = new Date().toLocaleDateString('pt-BR');
    doc.text(`Emissão: ${dataStr}`, pageW - 14, 41, { align: 'right' });

    // Tabela com apenas os ingredientes da ração (Sem KG e Sem R$)
    const rows = ingredientesList.map((item: IngredienteInfo, idx: number) => [
      String(idx + 1),
      item.nome,
      item.categoria
    ]);

    autoTable(doc, {
      startY: 46,
      head: [['#', 'Ingrediente / Matéria-Prima', 'Classificação']],
      body: rows,
      styles: { fontSize: 8.5, cellPadding: 2.8 },
      headStyles: { fillColor: [0, 104, 55], textColor: 255, fontStyle: 'bold', halign: 'left' },
      columnStyles: {
        0: { halign: 'center', cellWidth: 12 },
        1: { halign: 'left', cellWidth: 125 },
        2: { halign: 'center', cellWidth: 45 }
      },
      theme: 'grid',
      margin: { left: 14, right: 14 }
    });

    const finalY = (doc as any).lastAutoTable?.finalY || 130;
    let cursorY = finalY + 8;

    // Caixa de Composição Qualitativa contínua
    doc.setFillColor(245, 247, 246);
    doc.setDrawColor(200, 220, 210);
    doc.roundedRect(14, cursorY, pageW - 28, 28, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(0, 104, 55);
    doc.text('COMPOSIÇÃO QUALITATIVA (RÓTULO):', 18, cursorY + 6);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(40);
    const composicaoLines = doc.splitTextToSize(textoComposicaoQualitativa, pageW - 36);
    doc.text(composicaoLines, 18, cursorY + 12);

    cursorY += 34;

    // Indicações de Uso e Consumo
    if (produtoAssociado?.indicacoes || activeFormula.notas) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(0, 104, 55);
      doc.text('INDICAÇÃO DE USO:', 14, cursorY);
      cursorY += 5;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(50);
      const indLines = doc.splitTextToSize(
        produtoAssociado?.indicacoes || activeFormula.notas || '',
        pageW - 28
      );
      doc.text(indLines, 14, cursorY);
      cursorY += indLines.length * 4.5 + 4;
    }

    if (produtoAssociado?.consumo_recomendado) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(0, 104, 55);
      doc.text('MODO DE USAR / CONSUMO RECOMENDADO:', 14, cursorY);
      cursorY += 5;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(50);
      const consLines = doc.splitTextToSize(produtoAssociado.consumo_recomendado, pageW - 28);
      doc.text(consLines, 14, cursorY);
    }

    // Rodapé de segurança e autenticidade
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setDrawColor(220, 220, 220);
      doc.setLineWidth(0.3);
      doc.line(14, pageH - 16, pageW - 14, pageH - 16);
      doc.setFontSize(7);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 104, 55);
      doc.text('Harpia Nutrição Animal • Ficha Informativa Comercial', pageW / 2, pageH - 11, { align: 'center' });
      doc.setFontSize(6.5);
      doc.setTextColor(120);
      doc.setFont('helvetica', 'normal');
      doc.text(`Documento gerado em ${dataStr} para orientação e atendimento ao cliente.`, pageW / 2, pageH - 7, { align: 'center' });
    }

    const nomeArquivo = `Ficha_Ingredientes_${activeFormula.produto_nome.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
    doc.save(nomeArquivo);
  };

  return (
    <div className="space-y-4">
      {/* Seletor de Receita & Barra de Pesquisa */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-emerald-100 text-[#006837] border border-emerald-200 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                <ShieldCheck size={12} />
                Composição Qualitativa Oficial
              </span>
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <Calendar size={13} className="text-slate-400" />
                Atualizado: {formatDateBR(activeFormula?.updated_at)}
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 mt-1">
              Ingredientes e Fórmulas das Rações
            </h2>
            <p className="text-xs text-slate-500">
              Consulte as matérias-primas e a composição oficial de cada produto Harpia para sanar dúvidas de produtores e clientes.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleDownloadPdf}
              className="inline-flex items-center gap-1.5 bg-red-50 hover:bg-red-100 active:scale-95 text-red-700 px-3 py-2 rounded-xl text-xs font-bold transition shadow-xs border border-red-200"
              title="Baixar Ficha Técnica em PDF"
            >
              <FileDown size={14} />
              <span>PDF Ficha</span>
            </button>
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 bg-[#006837] hover:bg-[#00522c] active:scale-95 text-white px-3 py-2 rounded-xl text-xs font-bold transition shadow-xs"
              title="Compartilhar Ingredientes no WhatsApp"
            >
              <Share2 size={14} />
              <span>Compartilhar</span>
            </button>
          </div>
        </div>

        {/* Barra de Pesquisa de Fórmulas */}
        <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar ração por nome (ex: Harpig, Harmilk, Lac 22) ou código..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-[#006837] focus:bg-white transition"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-md"
                title="Limpar busca"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <span className="text-[11px] font-semibold text-slate-500 shrink-0 self-end sm:self-center">
            {filteredFormulas.length === formulas.length
              ? `${formulas.length} rações cadastradas`
              : `${filteredFormulas.length} de ${formulas.length} rações encontradas`}
          </span>
        </div>

        {/* Grade de Botões das Fórmulas */}
        {filteredFormulas.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2 pt-1 max-h-[340px] overflow-y-auto pr-1">
            {filteredFormulas.map(formula => {
              const isSelected = formula.id === selectedFormulaId;
              return (
                <button
                  key={formula.id}
                  onClick={() => setSelectedFormulaId(formula.id)}
                  title={formula.produto_nome}
                  className={`p-2.5 rounded-xl text-xs font-bold transition flex items-start gap-2 border text-left ${
                    isSelected
                      ? 'bg-[#006837] text-white border-[#004e29] shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                  }`}
                >
                  <FileText size={15} className={`shrink-0 mt-0.5 ${isSelected ? 'text-emerald-200' : 'text-slate-400'}`} />
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
        ) : (
          <div className="p-6 text-center bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500 space-y-2">
            <p>Nenhuma ração encontrada para "<strong>{searchTerm}</strong>".</p>
            <button
              onClick={() => setSearchTerm('')}
              className="text-[#006837] font-bold hover:underline"
            >
              Limpar filtro de busca
            </button>
          </div>
        )}
      </div>

      {activeFormula && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden space-y-5 p-4 sm:p-6">
          {/* Cabeçalho do Produto Ativo */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-emerald-50 text-[#006837] border border-emerald-200">
                  {produtoAssociado?.categoria?.nome || 'Ração Balanceada Harpia'}
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1">
                  <Package size={13} className="text-slate-500" />
                  Saco de {pesoSaco} kg
                </span>
                {activeFormula.codigo && (
                  <span className="text-[11px] font-mono text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                    Código #{activeFormula.codigo}
                  </span>
                )}
              </div>
              <h3 className="text-lg sm:text-xl font-black text-slate-900">
                {activeFormula.produto_nome}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 flex items-center gap-1.5">
                <Layers size={14} className="text-[#006837]" />
                {ingredientesList.length} ingredientes na composição
              </span>
            </div>
          </div>

          {/* SEÇÃO 1: LISTA DOS INGREDIENTES DA RAÇÃO (SEM CUSTOS E SEM QUANTIDADES) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <Sparkles size={16} className="text-amber-500" />
                  Ingredientes Utilizados (Composição Qualitativa)
                </h4>
                <p className="text-xs text-slate-500">
                  Matérias-primas e fontes nutricionais aprovadas presentes nesta ração:
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {ingredientesList.map((item: IngredienteInfo, index: number) => {
                const badge = getCategoriaBadgeStyle(item.categoria);
                return (
                  <div
                    key={item.insumoId || index}
                    className="p-3 rounded-xl bg-slate-50 hover:bg-emerald-50/40 border border-slate-200 transition flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-6 h-6 rounded-lg bg-emerald-100 text-[#006837] flex items-center justify-center shrink-0">
                        <CheckCircle2 size={14} />
                      </div>
                      <span className="text-xs font-bold text-slate-800 truncate" title={item.nome}>
                        {item.nome}
                      </span>
                    </div>

                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded border shrink-0 ${badge.bg} ${badge.text} ${badge.border}`}>
                      {item.categoria}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SEÇÃO 2: BOX DE TEXTO OFICIAL DA COMPOSIÇÃO QUALITATIVA (PADRÃO MAPA / RÓTULO) */}
          <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span className="text-xs font-black uppercase tracking-wider text-[#006837] flex items-center gap-1.5">
                <Tag size={14} />
                Texto de Rótulo: Composição Qualitativa Completa
              </span>
              <button
                type="button"
                onClick={handleCopyComposicao}
                className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-lg bg-white border border-emerald-300 text-[#006837] hover:bg-emerald-50 transition shadow-2xs"
                title="Copiar texto para colar no WhatsApp ou proposta"
              >
                {copiedComposicao ? (
                  <>
                    <Check size={13} className="text-emerald-700" />
                    <span>Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy size={13} />
                    <span>Copiar Ingredientes</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed font-medium bg-white/80 p-3 rounded-xl border border-emerald-100">
              {textoComposicaoQualitativa}
            </p>
            <span className="text-[11px] text-slate-500 block">
              💡 Texto formatado de acordo com as normas de rotulagem nutricional para apresentação direta ao produtor.
            </span>
          </div>

          {/* SEÇÃO 3: INFORMAÇÕES DE USO E RÓTULO / ETIQUETA DO PRODUTO */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <FileText size={16} className="text-[#006837]" />
              Especificações Técnicas e Rótulo
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {/* Indicação de Uso */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="font-bold text-slate-800 block text-[11px] uppercase tracking-wider">
                  Indicação de Uso:
                </span>
                <p className="text-slate-600 leading-relaxed">
                  {produtoAssociado?.indicacoes || 'Alimento balanceado formulado especificamente para suprir as exigências nutricionais da categoria animal.'}
                </p>
              </div>

              {/* Modo de Usar / Consumo */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="font-bold text-slate-800 block text-[11px] uppercase tracking-wider">
                  Modo de Usar / Consumo Recomendado:
                </span>
                <p className="text-slate-600 leading-relaxed">
                  {produtoAssociado?.consumo_recomendado || 'Fornecer aos animais conforme prescrição do responsável técnico ou zootecnista Harpia.'}
                </p>
              </div>
            </div>

            {/* Observações da Fórmula */}
            {activeFormula.notas && (
              <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl text-xs text-amber-900 leading-relaxed">
                <strong className="block mb-0.5">Observações Técnicas:</strong>
                {activeFormula.notas}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
