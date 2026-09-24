import React, { useState, useEffect } from 'react';
import type { Produto } from '../../types/database';
import type { Insumo, FormulaRacao, FormulaItem, CustoExtra } from '../../types/formulacao';
import { formatCurrency, getCategoriaBadgeStyle, formatDateBR } from '../../lib/utils';
import { initialInsumos, CATEGORIAS_INSUMOS } from '../../data/initialInsumos';
import { initialFormulas } from '../../data/initialFormulas';
import {
  FlaskConical,
  BarChart3,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  ChevronDown,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  Wheat,
  DollarSign,
  Calculator,
  TrendingUp,
  TrendingDown,
  Calendar,
  Search,
  FileDown,
  StickyNote
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import harpiaLogoUrl from '../../assets/logo-harpia.jpg';

// ─── Storage Keys ────────────────────────────────────────────
const STORAGE_INSUMOS = 'harpia_insumos_v2';
const STORAGE_FORMULAS = 'harpia_formulas_v2';

// ─── Helpers ─────────────────────────────────────────────────
function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage<T>(key: string, data: T) {
  localStorage.setItem(key, JSON.stringify(data));
}

function genId(): string {
  return crypto.randomUUID();
}

function calcCustoInsumosTon(itens: FormulaItem[], insumos: Insumo[]): number {
  return itens.reduce((sum, item) => {
    const insumo = insumos.find(i => i.id === item.insumo_id);
    if (!insumo) return sum;
    const precoKg = insumo.preco_tonelada / 1000;
    return sum + item.quantidade_kg * precoKg;
  }, 0);
}

function calcCustosExtras(custos: CustoExtra[], custoInsumos: number): number {
  return custos.reduce((sum, c) => {
    if (c.tipo === 'fixo') return sum + c.valor;
    return sum + (custoInsumos * c.valor) / 100;
  }, 0);
}

function calcTotalKgFormula(itens: FormulaItem[]): number {
  return itens.reduce((sum, item) => sum + item.quantidade_kg, 0);
}

// ─── Cache da logo em base64 ────────────────────────────────
let _logoBase64Cache: string | null = null;

async function loadLogoBase64(): Promise<string | null> {
  if (_logoBase64Cache) return _logoBase64Cache;
  try {
    const response = await fetch(harpiaLogoUrl);
    const blob = await response.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        _logoBase64Cache = reader.result as string;
        resolve(_logoBase64Cache);
      };
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

async function gerarPdfFormula(
  formula: FormulaRacao,
  insumos: Insumo[],
  produto: Produto | null
) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();

  // Logo
  const logoBase64 = await loadLogoBase64();
  if (logoBase64) {
    doc.addImage(logoBase64, 'JPEG', 14, 6.5, 45, 18.6);
  }

  // Header
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('FÓRMULA DE RAÇÃO', pageW / 2, 18, { align: 'center' });

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100);
  doc.text('DOCUMENTO CONFIDENCIAL - USO INTERNO HARPIA', pageW / 2, 24, { align: 'center' });
  doc.setTextColor(0);

  // Linha separadora
  doc.setDrawColor(0, 104, 55); // #006837
  doc.setLineWidth(0.8);
  doc.line(14, 28, pageW - 14, 28);

  // Nome do produto
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text(formula.produto_nome, 14, 35);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  const pesoSaco = formula.peso_saco_kg || produto?.peso_unitario || 40;
  const sacosPorTon = 1000 / pesoSaco;
  doc.text(`Batida Padrão: 1 Tonelada (1.000 kg) | Saco ${pesoSaco}kg (${sacosPorTon.toFixed(0)} sacos/ton)`, 14, 41);

  const dataStr = new Date().toLocaleDateString('pt-BR');
  doc.text(`Data: ${dataStr}`, pageW - 14, 41, { align: 'right' });

  // Tabela de insumos
  const custoInsumos = calcCustoInsumosTon(formula.itens, insumos);
  const custoExtras = calcCustosExtras(formula.custos_extras, custoInsumos);
  const custoTotalTon = custoInsumos + custoExtras;
  const custoSaco = custoTotalTon / sacosPorTon;

  const rows = formula.itens.map(item => {
    const ins = insumos.find(i => i.id === item.insumo_id);
    const precoKg = ins?.preco_kg ?? (ins ? ins.preco_tonelada / 1000 : 0);
    const subtotal = item.quantidade_kg * precoKg;
    return [
      ins?.nome || 'Insumo',
      `R$ ${precoKg.toFixed(4)}`,
      `${item.quantidade_kg.toFixed(1)}`,
      `R$ ${subtotal.toFixed(2)}`
    ];
  });

  const totalKg = calcTotalKgFormula(formula.itens);

  autoTable(doc, {
    startY: 45,
    head: [['Matéria Prima', 'KG/MP', 'Fórmula KG', 'Custo Fórmula']],
    body: rows,
    foot: [[
      { content: 'Total Formula KG/Custo', colSpan: 2, styles: { fontStyle: 'bold', halign: 'left' } },
      { content: `${totalKg.toFixed(1)}`, styles: { fontStyle: 'bold', halign: 'right' } },
      { content: `R$ ${custoInsumos.toFixed(2)}`, styles: { fontStyle: 'bold', halign: 'right' } }
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

  // Posição após a tabela
  const finalY = (doc as any).lastAutoTable?.finalY || 160;
  let cursorY = finalY + 6;

  // Resumo de custos
  doc.setFillColor(252, 219, 199); // #fcdbc7
  doc.roundedRect(14, cursorY, pageW - 28, 32, 3, 3, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(60);

  doc.text('Custo TON (Insumos):', 20, cursorY + 8);
  doc.text(`R$ ${custoInsumos.toFixed(2)}`, pageW - 20, cursorY + 8, { align: 'right' });

  doc.text('P.S/SAC (Operacional):', 20, cursorY + 16);
  doc.text(`R$ ${custoExtras.toFixed(2)}`, pageW - 20, cursorY + 16, { align: 'right' });

  doc.setFontSize(11);
  doc.setTextColor(0, 104, 55);
  doc.text(`Custo/SC (${pesoSaco}kg):`, 20, cursorY + 26);
  doc.text(`R$ ${custoSaco.toFixed(2)}`, pageW - 20, cursorY + 26, { align: 'right' });
  doc.setTextColor(0);

  cursorY += 38;

  // Observações
  if (formula.notas) {
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('OBSERVAÇÕES:', 14, cursorY);
    cursorY += 5;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    const lines = doc.splitTextToSize(formula.notas, pageW - 28);
    doc.text(lines, 14, cursorY);
    cursorY += lines.length * 4 + 4;
  }

  // Rodapé confidencial em todas as páginas
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

  // Salvar
  const nomeArquivo = `Formula_${formula.produto_nome.replace(/[^a-zA-Z0-9]/g, '_')}_${dataStr.replace(/\//g, '-')}.pdf`;
  doc.save(nomeArquivo);
}

// ─── Props ───────────────────────────────────────────────────
interface FormulacaoViewProps {
  produtos: Produto[];
}

// ─── Sub-tab type ────────────────────────────────────────────
type SubTab = 'insumos' | 'formulas' | 'visao';

// ═══════════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ═══════════════════════════════════════════════════════════════
export const FormulacaoView: React.FC<FormulacaoViewProps> = ({ produtos }) => {
  const [subTab, setSubTab] = useState<SubTab>('insumos');
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // ─── Estado global de insumos e fórmulas ────
  const [insumos, setInsumos] = useState<Insumo[]>(() => {
    const loaded = loadFromStorage<Insumo[]>(STORAGE_INSUMOS, []);
    if (loaded && Array.isArray(loaded) && loaded.length > 0) return loaded;
    return initialInsumos;
  });
  const [formulas, setFormulas] = useState<FormulaRacao[]>(() => {
    const loaded = loadFromStorage<FormulaRacao[]>(STORAGE_FORMULAS, []);
    if (loaded && Array.isArray(loaded) && loaded.length > 0) {
      const ids = new Set(loaded.map(f => f.id));
      const faltantes = initialFormulas.filter(f => !ids.has(f.id));
      if (faltantes.length > 0) {
        return [...loaded, ...faltantes];
      }
      return loaded;
    }
    return initialFormulas;
  });

  // Persistir no localStorage
  useEffect(() => saveToStorage(STORAGE_INSUMOS, insumos), [insumos]);
  useEffect(() => saveToStorage(STORAGE_FORMULAS, formulas), [formulas]);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setFeedbackMsg({ type, text });
    setTimeout(() => setFeedbackMsg(null), 3500);
  };

  // Sub-tabs config
  const subTabs: { key: SubTab; label: string; icon: React.ReactNode; count?: number }[] = [
    { key: 'insumos', label: 'Matérias-Primas', icon: <Wheat size={15} />, count: insumos.length },
    { key: 'formulas', label: 'Fórmulas de Ração', icon: <FlaskConical size={15} />, count: formulas.length },
    { key: 'visao', label: 'Visão de Custos', icon: <BarChart3 size={15} /> }
  ];

  return (
    <div className="space-y-4">
      {/* Toast */}
      {feedbackMsg && (
        <div
          className={`fixed bottom-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg border text-sm font-medium animate-in slide-in-from-bottom duration-200 ${
            feedbackMsg.type === 'success'
              ? 'bg-emerald-600 text-white border-emerald-500'
              : 'bg-red-600 text-white border-red-500'
          }`}
        >
          {feedbackMsg.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span>{feedbackMsg.text}</span>
        </div>
      )}

      {/* Descrição */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-200/70">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-amber-100 rounded-lg shrink-0">
            <Calculator size={20} className="text-amber-700" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-sm">Formulação & Custos de Produção</h3>
            <p className="text-xs text-slate-600 mt-0.5">
              Monte a composição de cada ração, cadastre os preços das matérias-primas e veja o custo total calculado automaticamente.
            </p>
            <p className="text-[11px] text-amber-700 font-medium mt-1">
              ⚠️ Dados salvos localmente neste dispositivo (protótipo).
            </p>
          </div>
        </div>
      </div>

      {/* Sub-abas */}
      <div className="flex gap-1 bg-slate-100 rounded-xl p-1">
        {subTabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setSubTab(tab.key)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-lg transition ${
              subTab === tab.key
                ? 'bg-white text-[#006837] shadow-xs'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab.icon}
            <span className="hidden sm:inline">{tab.label}</span>
            {tab.count !== undefined && (
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                subTab === tab.key ? 'bg-emerald-100 text-[#006837]' : 'bg-slate-200 text-slate-500'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Conteúdo da sub-aba */}
      {subTab === 'insumos' && (
        <InsumosSection
          insumos={insumos}
          setInsumos={setInsumos}
          showToast={showToast}
        />
      )}
      {subTab === 'formulas' && (
        <FormulasSection
          insumos={insumos}
          formulas={formulas}
          setFormulas={setFormulas}
          produtos={produtos}
          showToast={showToast}
        />
      )}
      {subTab === 'visao' && (
        <VisaoGeralSection
          formulas={formulas}
          insumos={insumos}
          produtos={produtos}
        />
      )}
    </div>
  );
};


// ═══════════════════════════════════════════════════════════════
// 1) SEÇÃO: CADASTRO DE INSUMOS
// ═══════════════════════════════════════════════════════════════
interface InsumosSectionProps {
  insumos: Insumo[];
  setInsumos: React.Dispatch<React.SetStateAction<Insumo[]>>;
  showToast: (text: string, type?: 'success' | 'error') => void;
}

const InsumosSection: React.FC<InsumosSectionProps> = ({ insumos, setInsumos, showToast }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCat, setSelectedCat] = useState<string>('TODAS');
  const [form, setForm] = useState({
    categoria: 'MACRO',
    nome: '',
    preco_kg: ''
  });

  const handleAdd = () => {
    if (!form.nome.trim() || !form.preco_kg) {
      showToast('Preencha nome e preço por kg', 'error');
      return;
    }
    const precoKg = Number(form.preco_kg);
    const novo: Insumo = {
      id: genId(),
      categoria: form.categoria || 'MACRO',
      nome: form.nome.trim(),
      preco_kg: precoKg,
      preco_tonelada: precoKg * 1000,
      ativo: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    setInsumos(prev => [novo, ...prev]);
    setForm({ categoria: 'MACRO', nome: '', preco_kg: '' });
    setIsAdding(false);
    showToast(`Matéria-prima "${novo.nome}" cadastrada com sucesso!`);
  };

  const handleSaveEdit = (id: string) => {
    if (!form.nome.trim() || !form.preco_kg) {
      showToast('Preencha nome e preço por kg', 'error');
      return;
    }
    const precoKg = Number(form.preco_kg);
    setInsumos(prev =>
      prev.map(ins =>
        ins.id === id
          ? {
              ...ins,
              categoria: form.categoria || ins.categoria || 'MACRO',
              nome: form.nome.trim(),
              preco_kg: precoKg,
              preco_tonelada: precoKg * 1000,
              updated_at: new Date().toISOString()
            }
          : ins
      )
    );
    setEditingId(null);
    showToast('Matéria-prima atualizada com sucesso!');
  };

  const handleDelete = (id: string) => {
    if (!confirm('Deseja remover esta matéria-prima?')) return;
    setInsumos(prev => prev.filter(i => i.id !== id));
    showToast('Matéria-prima removida');
  };

  // Filtragem dos insumos
  const filteredInsumos = insumos.filter(ins => {
    const matchesCat =
      selectedCat === 'TODAS' ||
      (ins.categoria || '').toUpperCase() === selectedCat;
    const term = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !term ||
      ins.nome.toLowerCase().includes(term) ||
      (ins.categoria && ins.categoria.toLowerCase().includes(term));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="font-bold text-slate-800 text-base">Matérias-Primas / Insumos ({insumos.length})</h3>
          <p className="text-xs text-slate-500">
            Cadastre matérias-primas por categoria, preço do kg e controle a data de atualização.
          </p>
        </div>
        <button
          onClick={() => {
            setForm({ categoria: 'MACRO', nome: '', preco_kg: '' });
            setIsAdding(true);
            setEditingId(null);
          }}
          className="inline-flex items-center gap-1.5 bg-[#006837] hover:bg-[#00522c] text-white text-xs sm:text-sm font-semibold px-3.5 py-2 rounded-xl shadow-xs transition"
        >
          <Plus size={16} />
          <span>Nova Matéria-Prima</span>
        </button>
      </div>

      {/* Barra de Filtro e Busca */}
      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 space-y-2">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar matéria-prima por nome..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#006837]"
          />
        </div>

        {/* Categorias Pills */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-0.5">
          <button
            onClick={() => setSelectedCat('TODAS')}
            className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition ${
              selectedCat === 'TODAS'
                ? 'bg-[#006837] text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            Todas ({insumos.length})
          </button>
          {CATEGORIAS_INSUMOS.map(cat => {
            const count = insumos.filter(i => (i.categoria || '').toUpperCase() === cat).length;
            const isSelected = selectedCat === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[11px] tracking-wider">
              <tr>
                <th className="px-3.5 py-3 w-32">CATEGORIA</th>
                <th className="px-4 py-3">MATÉRIA PRIMA</th>
                <th className="px-3 py-3 text-right w-36">PREÇO DO KG</th>
                <th className="px-3 py-3 text-center w-36">ÚLTIMA ATUALIZAÇÃO</th>
                <th className="px-4 py-3 text-center w-24">AÇÕES</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {/* Linha de adição */}
              {isAdding && (
                <tr className="bg-emerald-50/60">
                  <td className="px-3.5 py-2.5">
                    <select
                      value={form.categoria}
                      onChange={e => setForm({ ...form, categoria: e.target.value })}
                      className="w-full px-2 py-1.5 text-xs font-bold border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#006837] focus:outline-hidden bg-white"
                    >
                      {CATEGORIAS_INSUMOS.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-2.5">
                    <input
                      type="text"
                      placeholder="Nome da matéria-prima (ex: Milho Moído)"
                      value={form.nome}
                      onChange={e => setForm({ ...form, nome: e.target.value })}
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#006837] focus:outline-hidden"
                      autoFocus
                    />
                  </td>
                  <td className="px-3 py-2.5 text-right">
                    <input
                      type="number"
                      step="0.01"
                      placeholder="R$/Kg (ex: 1.20)"
                      value={form.preco_kg}
                      onChange={e => setForm({ ...form, preco_kg: e.target.value })}
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg text-right font-black focus:ring-2 focus:ring-[#006837] focus:outline-hidden"
                    />
                  </td>
                  <td className="px-3 py-2.5 text-center text-slate-400 text-xs font-medium">
                    {formatDateBR(new Date().toISOString())}
                  </td>
                  <td className="px-4 py-2.5 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={handleAdd} className="p-1.5 bg-[#006837] text-white rounded-lg hover:bg-[#00522c]" title="Salvar">
                        <Check size={14} />
                      </button>
                      <button onClick={() => setIsAdding(false)} className="p-1.5 bg-slate-200 text-slate-600 rounded-lg hover:bg-slate-300" title="Cancelar">
                        <X size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              )}

              {/* Insumos cadastrados */}
              {filteredInsumos.map(ins => {
                const isEditing = editingId === ins.id;
                const badge = getCategoriaBadgeStyle(ins.categoria);
                const precoKg = ins.preco_kg ?? (ins.preco_tonelada / 1000);

                return (
                  <tr key={ins.id} className="hover:bg-slate-50/60 transition">
                    {/* 1. CATEGORIA */}
                    <td className="px-3.5 py-3 whitespace-nowrap">
                      {isEditing ? (
                        <select
                          value={form.categoria}
                          onChange={e => setForm({ ...form, categoria: e.target.value })}
                          className="w-full px-2 py-1 text-xs font-bold border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#006837] focus:outline-hidden"
                        >
                          {CATEGORIAS_INSUMOS.map(c => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      ) : (
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-black border uppercase ${badge.bg} ${badge.text} ${badge.border}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                          {ins.categoria || 'MACRO'}
                        </span>
                      )}
                    </td>

                    {/* 2. MATÉRIA PRIMA */}
                    <td className="px-4 py-3">
                      {isEditing ? (
                        <input
                          type="text"
                          value={form.nome}
                          onChange={e => setForm({ ...form, nome: e.target.value })}
                          className="w-full px-2.5 py-1 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#006837] focus:outline-hidden"
                        />
                      ) : (
                        <div>
                          <span className="font-bold text-slate-900 block">{ins.nome}</span>
                          <span className="text-[10px] text-slate-400">
                            Equiv. {formatCurrency(precoKg * 1000)} / Tonelada
                          </span>
                        </div>
                      )}
                    </td>

                    {/* 3. PREÇO DO KG */}
                    <td className="px-3 py-3 text-right whitespace-nowrap">
                      {isEditing ? (
                        <input
                          type="number"
                          step="0.01"
                          value={form.preco_kg}
                          onChange={e => setForm({ ...form, preco_kg: e.target.value })}
                          className="w-full px-2.5 py-1 text-xs border border-slate-300 rounded-lg text-right font-bold focus:ring-2 focus:ring-[#006837] focus:outline-hidden"
                        />
                      ) : (
                        <span className="font-black text-slate-900 text-sm">
                          {formatCurrency(precoKg)}
                          <span className="text-[11px] font-medium text-slate-400 ml-1">/kg</span>
                        </span>
                      )}
                    </td>

                    {/* 4. ÚLTIMA ATUALIZAÇÃO */}
                    <td className="px-3 py-3 text-center whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 bg-slate-100 border border-slate-200/60 px-2 py-0.5 rounded-md">
                        <Calendar size={11} className="text-slate-400" />
                        {formatDateBR(ins.updated_at)}
                      </span>
                    </td>

                    {/* 5. AÇÕES */}
                    <td className="px-4 py-3 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1.5">
                        {isEditing ? (
                          <>
                            <button onClick={() => handleSaveEdit(ins.id)} className="p-1.5 bg-[#006837] text-white rounded-lg hover:bg-[#00522c]" title="Salvar">
                              <Check size={14} />
                            </button>
                            <button onClick={() => setEditingId(null)} className="p-1.5 bg-slate-200 text-slate-600 rounded-lg hover:bg-slate-300" title="Cancelar">
                              <X size={14} />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => {
                                setEditingId(ins.id);
                                setIsAdding(false);
                                const precoAtual = ins.preco_kg ?? (ins.preco_tonelada / 1000);
                                setForm({
                                  categoria: ins.categoria || 'MACRO',
                                  nome: ins.nome,
                                  preco_kg: String(precoAtual)
                                });
                              }}
                              className="p-1.5 text-slate-500 hover:text-[#006837] hover:bg-emerald-50 rounded-lg transition"
                              title="Editar"
                            >
                              <Edit2 size={15} />
                            </button>
                            <button
                              onClick={() => handleDelete(ins.id)}
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                              title="Remover"
                            >
                              <Trash2 size={15} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}

              {/* Vazio */}
              {filteredInsumos.length === 0 && !isAdding && (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-slate-400 text-sm">
                    <Wheat size={32} className="mx-auto mb-2 text-slate-300" />
                    Nenhuma matéria-prima encontrada.
                    <br />
                    <span className="text-xs">Tente buscar por outro termo ou adicione uma nova.</span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};


// ═══════════════════════════════════════════════════════════════
// 2) SEÇÃO: FÓRMULAS DE RAÇÃO
// ═══════════════════════════════════════════════════════════════
interface FormulasSectionProps {
  insumos: Insumo[];
  formulas: FormulaRacao[];
  setFormulas: React.Dispatch<React.SetStateAction<FormulaRacao[]>>;
  produtos: Produto[];
  showToast: (text: string, type?: 'success' | 'error') => void;
}

const FormulasSection: React.FC<FormulasSectionProps> = ({ insumos, formulas, setFormulas, produtos, showToast }) => {
  const [expandedFormulaId, setExpandedFormulaId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newProdutoId, setNewProdutoId] = useState('');

  // ─── Criar nova fórmula ────
  const handleCreate = () => {
    if (!newProdutoId) {
      showToast('Selecione um produto', 'error');
      return;
    }
    const prod = produtos.find(p => p.id === newProdutoId);
    if (!prod) return;

    // Evitar duplicata
    if (formulas.some(f => f.produto_id === newProdutoId)) {
      showToast('Este produto já possui uma fórmula cadastrada', 'error');
      return;
    }

    const nova: FormulaRacao = {
      id: genId(),
      produto_id: prod.id,
      produto_nome: prod.nome,
      itens: [],
      custos_extras: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    setFormulas(prev => [...prev, nova]);
    setExpandedFormulaId(nova.id);
    setIsCreating(false);
    setNewProdutoId('');
    showToast(`Fórmula criada para "${prod.nome}"`);
  };

  const handleDeleteFormula = (id: string) => {
    if (!confirm('Deseja remover esta fórmula?')) return;
    setFormulas(prev => prev.filter(f => f.id !== id));
    showToast('Fórmula removida');
  };

  // Produtos que ainda não têm fórmula
  const produtosSemFormula = produtos.filter(p => p.ativo && !formulas.some(f => f.produto_id === p.id));

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-slate-800 text-base">Fórmulas de Ração</h3>
          <p className="text-xs text-slate-500">Monte a composição de cada ração e adicione custos extras.</p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="inline-flex items-center gap-1.5 bg-[#006837] hover:bg-[#00522c] text-white text-xs sm:text-sm font-semibold px-3.5 py-2 rounded-xl shadow-xs transition"
          disabled={produtosSemFormula.length === 0}
        >
          <Plus size={16} />
          <span>Nova Fórmula</span>
        </button>
      </div>

      {/* Criar fórmula */}
      {isCreating && (
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row items-start sm:items-end gap-3">
          <div className="flex-1 w-full">
            <label className="block text-xs font-semibold text-slate-700 mb-1">Produto</label>
            <select
              value={newProdutoId}
              onChange={e => setNewProdutoId(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#006837] focus:outline-hidden"
            >
              <option value="">Selecione um produto...</option>
              {produtosSemFormula.map(p => (
                <option key={p.id} value={p.id}>{p.nome}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            <button onClick={handleCreate} className="px-4 py-2 bg-[#006837] text-white text-xs font-semibold rounded-xl hover:bg-[#00522c] transition">
              Criar Fórmula
            </button>
            <button onClick={() => { setIsCreating(false); setNewProdutoId(''); }} className="px-4 py-2 border border-slate-300 text-slate-600 text-xs font-semibold rounded-xl hover:bg-slate-50">
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Lista de fórmulas */}
      {formulas.length === 0 && !isCreating ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center text-slate-400 shadow-2xs">
          <FlaskConical size={36} className="mx-auto mb-2 text-slate-300" />
          <p className="text-sm font-medium">Nenhuma fórmula cadastrada.</p>
          <p className="text-xs mt-1">Clique em "Nova Fórmula" para começar a compor suas rações.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5">
          {formulas.map(formula => {
            const isExpanded = expandedFormulaId === formula.id;
            const custoInsumos = calcCustoInsumosTon(formula.itens, insumos);
            const custoExtras = calcCustosExtras(formula.custos_extras, custoInsumos);
            const custoTotalTon = custoInsumos + custoExtras;
            const totalKg = calcTotalKgFormula(formula.itens);
            const prod = produtos.find(p => p.id === formula.produto_id);
            const pesoSaco = formula.peso_saco_kg || prod?.peso_unitario || 40;
            const custoSaco = custoTotalTon / (1000 / pesoSaco);

            return (
              <div
                key={formula.id}
                className={`bg-white rounded-2xl border transition-all ${
                  isExpanded
                    ? 'border-[#006837] ring-1 ring-[#006837] shadow-md md:col-span-2 xl:col-span-3'
                    : 'border-slate-200/90 hover:border-emerald-300 hover:shadow-md shadow-2xs'
                } overflow-hidden flex flex-col justify-between`}
              >
                {/* Cabeçalho do Card */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Top bar: Tags + Ações rápidas */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {formula.codigo && (
                          <span className="bg-emerald-50 text-[#006837] border border-emerald-200 text-[10px] font-mono font-extrabold px-2 py-0.5 rounded-md">
                            #{formula.codigo}
                          </span>
                        )}
                        <span className="text-[11px] text-slate-500 font-medium">
                          {formula.itens.length} {formula.itens.length === 1 ? 'insumo' : 'insumos'} • {totalKg.toFixed(0)} kg/ton
                        </span>
                      </div>

                      {/* Botões de Ação */}
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            gerarPdfFormula(formula, insumos, prod || null);
                          }}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 transition text-[11px] font-bold border border-red-200/60"
                          title="Baixar PDF Oficial da Fórmula"
                        >
                          <FileDown size={13} />
                          <span>PDF</span>
                        </button>
                        <button
                          onClick={() => setExpandedFormulaId(isExpanded ? null : formula.id)}
                          className={`p-1.5 rounded-lg transition ${
                            isExpanded
                              ? 'bg-emerald-100 text-[#006837]'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                          }`}
                          title={isExpanded ? 'Recolher detalhes' : 'Expandir fórmula'}
                        >
                          {isExpanded ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
                        </button>
                      </div>
                    </div>

                    {/* Nome do Produto completo e sem truncar */}
                    <button
                      onClick={() => setExpandedFormulaId(isExpanded ? null : formula.id)}
                      className="text-left w-full group block"
                    >
                      <h4 className="font-extrabold text-slate-900 text-sm sm:text-base leading-snug group-hover:text-[#006837] transition">
                        {formula.produto_nome}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Batida padrão 1 Tonelada • Saco {pesoSaco}kg ({Math.round(1000 / pesoSaco)} sc/ton)
                      </p>
                    </button>
                  </div>

                  {/* Quadro de Valores / Custos em 3 Colunas */}
                  <div className="mt-3.5 bg-slate-50 rounded-xl p-2.5 border border-slate-200/70 grid grid-cols-3 gap-2 text-center">
                    <div>
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Custo/Ton</span>
                      <span className="font-black text-slate-900 text-xs sm:text-sm block mt-0.5">
                        {formatCurrency(custoTotalTon)}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Custo/Kg</span>
                      <span className="font-bold text-slate-700 text-xs sm:text-sm block mt-0.5">
                        {formatCurrency(custoTotalTon / 1000)}
                      </span>
                    </div>

                    <div>
                      {prod?.preco_base ? (
                        <>
                          <span className="text-[10px] text-[#006837] font-bold uppercase tracking-wider block">Preço Venda</span>
                          <span className="font-black text-[#006837] text-xs sm:text-sm block mt-0.5">
                            {formatCurrency(prod.preco_base)}
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="text-[10px] text-orange-900 font-bold uppercase tracking-wider block">Custo/SC</span>
                          <span className="font-black text-orange-950 text-xs sm:text-sm block mt-0.5">
                            {formatCurrency(custoSaco)}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Observações / Notas Rápidas */}
                  {formula.notas && !isExpanded && (
                    <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-start gap-1.5 text-[11px] text-slate-600 bg-amber-50/50 p-2 rounded-lg border border-amber-200/60">
                      <StickyNote size={13} className="text-amber-600 shrink-0 mt-0.5" />
                      <span className="line-clamp-2 leading-tight font-medium text-amber-950">
                        {formula.notas}
                      </span>
                    </div>
                  )}
                </div>

                {/* Conteúdo expandido */}
                {isExpanded && (
                  <FormulaDetail
                    formula={formula}
                    insumos={insumos}
                    produto={prod || null}
                    setFormulas={setFormulas}
                    showToast={showToast}
                    onDelete={() => handleDeleteFormula(formula.id)}
                  />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};


// ═══════════════════════════════════════════════════════════════
// 2b) DETALHE DA FÓRMULA (expandido)
// ═══════════════════════════════════════════════════════════════
interface FormulaDetailProps {
  formula: FormulaRacao;
  insumos: Insumo[];
  produto: Produto | null;
  setFormulas: React.Dispatch<React.SetStateAction<FormulaRacao[]>>;
  showToast: (text: string, type?: 'success' | 'error') => void;
  onDelete: () => void;
}

const FormulaDetail: React.FC<FormulaDetailProps> = ({ formula, insumos, produto, setFormulas, showToast, onDelete }) => {
  const [addInsumoId, setAddInsumoId] = useState('');
  const [addQtdKg, setAddQtdKg] = useState('');
  const [addCustoDesc, setAddCustoDesc] = useState('');
  const [addCustoValor, setAddCustoValor] = useState('');
  const [addCustoTipo, setAddCustoTipo] = useState<'fixo' | 'percentual'>('fixo');

  // Atualizar fórmula no array
  const updateFormula = (updater: (f: FormulaRacao) => FormulaRacao) => {
    setFormulas(prev =>
      prev.map(f => (f.id === formula.id ? updater({ ...f, updated_at: new Date().toISOString() }) : f))
    );
  };

  // ─── Insumos da fórmula ────
  const handleAddInsumo = () => {
    if (!addInsumoId || !addQtdKg || Number(addQtdKg) <= 0) {
      showToast('Selecione um insumo e informe a quantidade', 'error');
      return;
    }
    if (formula.itens.some(it => it.insumo_id === addInsumoId)) {
      showToast('Este insumo já está na fórmula', 'error');
      return;
    }
    const newItem: FormulaItem = {
      insumo_id: addInsumoId,
      quantidade_kg: Number(addQtdKg)
    };
    updateFormula(f => ({ ...f, itens: [...f.itens, newItem] }));
    setAddInsumoId('');
    setAddQtdKg('');
    showToast('Insumo adicionado à fórmula');
  };

  const handleRemoveInsumo = (insumoId: string) => {
    updateFormula(f => ({ ...f, itens: f.itens.filter(it => it.insumo_id !== insumoId) }));
  };

  const handleUpdateQtd = (insumoId: string, novaQtd: number) => {
    updateFormula(f => ({
      ...f,
      itens: f.itens.map(it => (it.insumo_id === insumoId ? { ...it, quantidade_kg: novaQtd } : it))
    }));
  };

  // ─── Custos extras ────
  const handleAddCusto = () => {
    if (!addCustoDesc.trim() || !addCustoValor) {
      showToast('Preencha descrição e valor do custo', 'error');
      return;
    }
    const novoCusto: CustoExtra = {
      id: genId(),
      descricao: addCustoDesc.trim(),
      valor: Number(addCustoValor),
      tipo: addCustoTipo
    };
    updateFormula(f => ({ ...f, custos_extras: [...f.custos_extras, novoCusto] }));
    setAddCustoDesc('');
    setAddCustoValor('');
    showToast('Custo extra adicionado');
  };

  const handleRemoveCusto = (custoId: string) => {
    updateFormula(f => ({ ...f, custos_extras: f.custos_extras.filter(c => c.id !== custoId) }));
  };

  // ─── Cálculos ────
  const custoInsumos = calcCustoInsumosTon(formula.itens, insumos);
  const custoExtras = calcCustosExtras(formula.custos_extras, custoInsumos);
  const custoTotalTon = custoInsumos + custoExtras;
  const totalKgFormula = calcTotalKgFormula(formula.itens);

  // Custo por saco (com base no peso do saco da fórmula ou produto, padrão 40kg)
  const pesoSaco = formula.peso_saco_kg || produto?.peso_unitario || 40;
  const sacosPorTon = 1000 / pesoSaco; // 25 sacos para 40kg
  const custoSaco = custoTotalTon / sacosPorTon;
  const precoVenda = produto?.preco_base || 0;
  const margem = precoVenda > 0 ? ((precoVenda - custoSaco) / precoVenda) * 100 : 0;
  const lucroSaco = precoVenda - custoSaco;

  // Insumos que ainda não estão na fórmula
  const insumosDisponiveis = insumos.filter(ins => ins.ativo && !formula.itens.some(it => it.insumo_id === ins.id));

  return (
    <div className="border-t border-slate-200 px-4 py-4 space-y-4">
      {/* Tabela de matérias-primas da fórmula */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Wheat size={13} /> Composição (Batida Padrão: 1 Tonelada / 1.000 kg)
          </h4>
          <span className="text-[11px] text-slate-500 font-medium">
            Última atualização: <strong>{formatDateBR(formula.updated_at)}</strong>
          </span>
        </div>

        <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full text-xs">
            <thead className="bg-slate-100 text-slate-700 uppercase text-[10px] tracking-wider font-bold border-b border-slate-200">
              <tr>
                <th className="px-3 py-2 text-left">Matéria Prima</th>
                <th className="px-3 py-2 text-right">KG/MP</th>
                <th className="px-3 py-2 text-right">Fórmula KG</th>
                <th className="px-3 py-2 text-right">Custo Formula</th>
                <th className="px-3 py-2 text-center w-10">⨉</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {formula.itens.map(item => {
                const ins = insumos.find(i => i.id === item.insumo_id);
                const precoKg = ins?.preco_kg ?? (ins ? ins.preco_tonelada / 1000 : 0);
                const subtotal = item.quantidade_kg * precoKg;

                return (
                  <tr key={item.insumo_id} className="hover:bg-white/80">
                    <td className="px-3 py-2 font-semibold text-slate-900">{ins?.nome || 'Insumo'}</td>
                    <td className="px-3 py-2 text-right text-slate-600 font-mono">{formatCurrency(precoKg)}</td>
                    <td className="px-3 py-2 text-right">
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        value={item.quantidade_kg}
                        onChange={e => handleUpdateQtd(item.insumo_id, Number(e.target.value))}
                        className="w-20 px-2 py-1 text-right text-xs font-bold border border-slate-300 rounded-md focus:ring-1 focus:ring-[#006837] focus:outline-hidden bg-white"
                      />
                    </td>
                    <td className="px-3 py-2 text-right text-slate-500">{formatCurrency(precoKg)}</td>
                    <td className="px-3 py-2 text-right font-bold text-slate-900">{formatCurrency(subtotal)}</td>
                    <td className="px-3 py-2 text-center">
                      <button onClick={() => handleRemoveInsumo(item.insumo_id)} className="text-slate-400 hover:text-red-500 transition">
                        <X size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })}

              {/* Adicionar insumo */}
              {insumosDisponiveis.length > 0 && (
                <tr className="bg-emerald-50/40">
                  <td className="px-3 py-2" colSpan={2}>
                    <div className="flex items-center gap-2">
                      <select
                        value={addInsumoId}
                        onChange={e => setAddInsumoId(e.target.value)}
                        className="flex-1 px-2 py-1.5 text-xs border border-slate-300 rounded-md focus:ring-1 focus:ring-[#006837] focus:outline-hidden bg-white"
                      >
                        <option value="">+ Adicionar insumo...</option>
                        {insumosDisponiveis.map(ins => (
                          <option key={ins.id} value={ins.id}>{ins.nome}</option>
                        ))}
                      </select>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        placeholder="Kg"
                        value={addQtdKg}
                        onChange={e => setAddQtdKg(e.target.value)}
                        className="w-20 px-2 py-1.5 text-xs border border-slate-300 rounded-md text-right focus:ring-1 focus:ring-[#006837] focus:outline-hidden bg-white"
                      />
                    </div>
                  </td>
                  <td colSpan={3} className="px-3 py-2 text-center">
                    <button
                      onClick={handleAddInsumo}
                      disabled={!addInsumoId || !addQtdKg}
                      className="px-3 py-1.5 bg-[#006837] text-white text-xs font-semibold rounded-md hover:bg-[#00522c] disabled:opacity-40 disabled:cursor-not-allowed transition"
                    >
                      Adicionar
                    </button>
                  </td>
                </tr>
              )}

              {/* Subtotal insumos */}
              {formula.itens.length > 0 && (
                <tr className="bg-slate-100/80 font-bold text-slate-800">
                  <td className="px-3 py-2">Subtotal Insumos</td>
                  <td className="px-3 py-2 text-right">{totalKgFormula.toFixed(1)} kg</td>
                  <td className="px-3 py-2"></td>
                  <td className="px-3 py-2 text-right text-[#006837]">{formatCurrency(custoInsumos)}</td>
                  <td></td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalKgFormula > 0 && totalKgFormula !== 1000 && (
          <p className="text-[11px] text-amber-700 mt-1.5 flex items-center gap-1">
            <AlertCircle size={12} />
            A soma dos insumos é {totalKgFormula.toFixed(1)} kg. Uma formulação por tonelada normalmente soma 1.000 kg.
          </p>
        )}
      </div>

      {/* Custos extras */}
      <div>
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <DollarSign size={13} /> Custos Extras (por Tonelada)
        </h4>

        <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full text-xs">
            <thead className="bg-slate-100 text-slate-500 uppercase text-[10px] tracking-wider font-semibold">
              <tr>
                <th className="px-3 py-2 text-left">Descrição</th>
                <th className="px-3 py-2 text-center">Tipo</th>
                <th className="px-3 py-2 text-right">Valor</th>
                <th className="px-3 py-2 text-right">Impacto/Ton</th>
                <th className="px-3 py-2 text-center w-10">⨉</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {formula.custos_extras.map(custo => {
                const impacto = custo.tipo === 'fixo' ? custo.valor : (custoInsumos * custo.valor) / 100;
                return (
                  <tr key={custo.id} className="hover:bg-white/80">
                    <td className="px-3 py-2 font-semibold text-slate-900">{custo.descricao}</td>
                    <td className="px-3 py-2 text-center">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                        custo.tipo === 'fixo' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                      }`}>
                        {custo.tipo === 'fixo' ? 'R$/ton' : '%'}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-right font-bold">
                      {custo.tipo === 'fixo' ? formatCurrency(custo.valor) : `${custo.valor}%`}
                    </td>
                    <td className="px-3 py-2 text-right font-bold text-slate-900">
                      {formatCurrency(impacto)}
                    </td>
                    <td className="px-3 py-2 text-center">
                      <button onClick={() => handleRemoveCusto(custo.id)} className="text-slate-400 hover:text-red-500 transition">
                        <X size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })}

              {/* Adicionar custo */}
              <tr className="bg-emerald-50/40">
                <td className="px-3 py-2">
                  <input
                    type="text"
                    placeholder="Ex: Embalagem, Produção..."
                    value={addCustoDesc}
                    onChange={e => setAddCustoDesc(e.target.value)}
                    className="w-full px-2 py-1.5 text-xs border border-slate-300 rounded-md focus:ring-1 focus:ring-[#006837] focus:outline-hidden bg-white"
                  />
                </td>
                <td className="px-3 py-2 text-center">
                  <select
                    value={addCustoTipo}
                    onChange={e => setAddCustoTipo(e.target.value as 'fixo' | 'percentual')}
                    className="px-2 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-hidden bg-white"
                  >
                    <option value="fixo">R$/ton</option>
                    <option value="percentual">%</option>
                  </select>
                </td>
                <td className="px-3 py-2">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="Valor"
                    value={addCustoValor}
                    onChange={e => setAddCustoValor(e.target.value)}
                    className="w-full px-2 py-1.5 text-xs border border-slate-300 rounded-md text-right focus:ring-1 focus:ring-[#006837] focus:outline-hidden bg-white"
                  />
                </td>
                <td colSpan={2} className="px-3 py-2 text-center">
                  <button
                    onClick={handleAddCusto}
                    disabled={!addCustoDesc || !addCustoValor}
                    className="px-3 py-1.5 bg-[#006837] text-white text-xs font-semibold rounded-md hover:bg-[#00522c] disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >
                    Adicionar
                  </button>
                </td>
              </tr>

              {/* Subtotal extras */}
              {formula.custos_extras.length > 0 && (
                <tr className="bg-slate-100/80 font-bold text-slate-800">
                  <td className="px-3 py-2" colSpan={3}>Subtotal Custos Extras</td>
                  <td className="px-3 py-2 text-right text-amber-700">{formatCurrency(custoExtras)}</td>
                  <td></td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── Resumo de Custos (Padrão Oficial Harpia) ─── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="bg-[#fcdbc7] rounded-xl p-3 border border-orange-300 text-center">
          <span className="text-[10px] text-orange-950 uppercase tracking-wider font-black block">Custo TON (Insumos)</span>
          <span className="text-lg font-black text-slate-950 block">{formatCurrency(custoInsumos)}</span>
        </div>
        <div className="bg-[#fcdbc7] rounded-xl p-3 border border-orange-300 text-center">
          <span className="text-[10px] text-orange-950 uppercase tracking-wider font-black block">P.S/SAC (Operacional)</span>
          <span className="text-lg font-black text-slate-950 block">{formatCurrency(custoExtras)}</span>
        </div>
        <div className="bg-[#f7b98b] rounded-xl p-3 border-2 border-orange-400 text-center shadow-xs">
          <span className="text-[10px] text-orange-950 uppercase tracking-wider font-black block">Custo/SC ({pesoSaco}kg)</span>
          <span className="text-xl font-black text-[#006837] block">{formatCurrency(custoSaco)}</span>
        </div>
        {produto ? (
          <div className={`rounded-xl p-3 border text-center ${
            margem >= 20 ? 'bg-emerald-50 border-emerald-200' : margem >= 10 ? 'bg-amber-50 border-amber-200' : 'bg-red-50 border-red-200'
          }`}>
            <span className={`text-[10px] uppercase tracking-wider font-semibold block ${
              margem >= 20 ? 'text-emerald-600' : margem >= 10 ? 'text-amber-600' : 'text-red-600'
            }`}>Margem ({formatCurrency(precoVenda)})</span>
            <span className={`text-lg font-black block ${
              margem >= 20 ? 'text-emerald-800' : margem >= 10 ? 'text-amber-800' : 'text-red-800'
            }`}>
              {margem.toFixed(1)}%
            </span>
            <span className={`text-[10px] font-medium block ${
              lucroSaco >= 0 ? 'text-emerald-700' : 'text-red-700'
            }`}>
              {lucroSaco >= 0 ? '+' : ''}{formatCurrency(lucroSaco)}/saco
            </span>
          </div>
        ) : (
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 text-center">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold block">Última Atualização</span>
            <span className="text-sm font-bold text-slate-700 block mt-1">{formatDateBR(formula.updated_at)}</span>
          </div>
        )}
      </div>

      {/* ─── Observações ─── */}
      <div>
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <StickyNote size={13} /> Observações
        </h4>
        <textarea
          value={formula.notas || ''}
          onChange={e => updateFormula(f => ({ ...f, notas: e.target.value }))}
          placeholder="Ex: Usar milho seco, substituir soja caso preço supere R$2.00/kg, validade da fórmula até..."
          rows={3}
          className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#006837] focus:outline-hidden bg-white resize-none placeholder:text-slate-400"
        />
      </div>

      {/* Rodapé: PDF + Remover fórmula */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
        <button
          onClick={() => gerarPdfFormula(formula, insumos, produto)}
          className="inline-flex items-center gap-1.5 text-xs text-[#006837] hover:text-[#00522c] font-semibold transition bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg"
        >
          <FileDown size={14} />
          Baixar PDF da Fórmula
        </button>
        <button
          onClick={onDelete}
          className="inline-flex items-center gap-1 text-xs text-red-500 hover:text-red-700 font-medium transition"
        >
          <Trash2 size={13} />
          Remover esta fórmula
        </button>
      </div>
    </div>
  );
};


// ═══════════════════════════════════════════════════════════════
// 3) SEÇÃO: VISÃO GERAL DE CUSTOS
// ═══════════════════════════════════════════════════════════════
interface VisaoGeralSectionProps {
  formulas: FormulaRacao[];
  insumos: Insumo[];
  produtos: Produto[];
}

const VisaoGeralSection: React.FC<VisaoGeralSectionProps> = ({ formulas, insumos, produtos }) => {
  if (formulas.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center text-slate-400 shadow-2xs">
        <BarChart3 size={36} className="mx-auto mb-2 text-slate-300" />
        <p className="text-sm font-medium">Nenhuma fórmula cadastrada ainda.</p>
        <p className="text-xs mt-1">Cadastre fórmulas na aba anterior para visualizar o painel de custos.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div>
        <h3 className="font-bold text-slate-800 text-base">Visão Geral de Custos × Preços de Venda</h3>
        <p className="text-xs text-slate-500">Comparativo entre custo de produção e preço de venda para todos os produtos formulados.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {formulas.map(formula => {
          const prod = produtos.find(p => p.id === formula.produto_id);
          const custoInsumosTon = calcCustoInsumosTon(formula.itens, insumos);
          const custoExtrasTon = calcCustosExtras(formula.custos_extras, custoInsumosTon);
          const custoTotalTon = custoInsumosTon + custoExtrasTon;
          const custoKg = custoTotalTon / 1000;
          const pesoSaco = prod?.peso_unitario || 30;
          const custoSaco = custoKg * pesoSaco;
          const precoVenda = prod?.preco_base || 0;
          const margem = precoVenda > 0 ? ((precoVenda - custoSaco) / precoVenda) * 100 : 0;
          const lucroSaco = precoVenda - custoSaco;

          const margemColor =
            margem >= 25 ? 'emerald' :
            margem >= 15 ? 'green' :
            margem >= 5 ? 'amber' : 'red';

          const bgCard = {
            emerald: 'bg-emerald-50/50 border-emerald-200',
            green: 'bg-green-50/50 border-green-200',
            amber: 'bg-amber-50/50 border-amber-200',
            red: 'bg-red-50/50 border-red-200'
          }[margemColor];

          return (
            <div key={formula.id} className={`rounded-2xl border p-4 shadow-2xs ${bgCard}`}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{formula.produto_nome}</h4>
                  <span className="text-[11px] text-slate-500">
                    {formula.itens.length} insumos • {formula.custos_extras.length} custos extras
                  </span>
                </div>
                <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-black ${
                  margem >= 15 ? 'bg-emerald-100 text-emerald-800' : margem >= 5 ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                }`}>
                  {margem >= 15 ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                  {margem.toFixed(1)}%
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <span className="text-[10px] text-slate-500 block">Custo/Saco</span>
                  <span className="text-sm font-black text-slate-900">{formatCurrency(custoSaco)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Preço Venda</span>
                  <span className="text-sm font-black text-[#006837]">{formatCurrency(precoVenda)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Lucro/Saco</span>
                  <span className={`text-sm font-black ${lucroSaco >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                    {lucroSaco >= 0 ? '+' : ''}{formatCurrency(lucroSaco)}
                  </span>
                </div>
              </div>

              {/* Barra visual de margem */}
              <div className="mt-3">
                <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      margem >= 15 ? 'bg-emerald-500' : margem >= 5 ? 'bg-amber-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${Math.max(0, Math.min(100, margem))}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
