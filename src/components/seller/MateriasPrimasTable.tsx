import React, { useState, useMemo } from 'react';
import type { Insumo } from '../../types/formulacao';
import { initialInsumos, CATEGORIAS_INSUMOS } from '../../data/initialInsumos';
import { formatCurrency, getCategoriaBadgeStyle, formatDateBR } from '../../lib/utils';
import {
  Search,
  Calendar,
  Layers,
  Wheat,
  ArrowUpDown,
  CheckCircle2,
  Share2
} from 'lucide-react';

interface MateriasPrimasTableProps {
  insumos?: Insumo[];
  onUpdateInsumos?: (insumos: Insumo[]) => void;
}

export const MateriasPrimasTable: React.FC<MateriasPrimasTableProps> = ({
  insumos: propsInsumos
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoria, setSelectedCategoria] = useState<string>('TODAS');
  const [sortField, setSortField] = useState<'nome' | 'preco' | 'categoria' | 'data'>('categoria');
  const [sortAsc, setSortAsc] = useState<boolean>(true);

  // Lista de insumos
  const listInsumos = useMemo(() => {
    if (propsInsumos && propsInsumos.length > 0) {
      return propsInsumos;
    }
    try {
      const cached = localStorage.getItem('harpia_insumos_v2');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Erro ao carregar insumos:', e);
    }
    return initialInsumos;
  }, [propsInsumos]);

  // Contagem por categoria
  const countsByCategoria = useMemo(() => {
    const map: Record<string, number> = { TODAS: listInsumos.length };
    CATEGORIAS_INSUMOS.forEach(cat => {
      map[cat] = listInsumos.filter(i => (i.categoria || '').toUpperCase() === cat).length;
    });
    return map;
  }, [listInsumos]);

  // Filtragem e ordenação
  const filteredInsumos = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    let result = listInsumos.filter(item => {
      const matchesCategory =
        selectedCategoria === 'TODAS' ||
        (item.categoria || '').toUpperCase() === selectedCategoria;

      const matchesSearch =
        !term ||
        item.nome.toLowerCase().includes(term) ||
        (item.categoria && item.categoria.toLowerCase().includes(term));

      return matchesCategory && matchesSearch;
    });

    result.sort((a, b) => {
      let comp = 0;
      if (sortField === 'nome') {
        comp = a.nome.localeCompare(b.nome);
      } else if (sortField === 'categoria') {
        const catA = a.categoria || 'OUTROS';
        const catB = b.categoria || 'OUTROS';
        comp = catA.localeCompare(catB) || a.nome.localeCompare(b.nome);
      } else if (sortField === 'preco') {
        const precoA = a.preco_kg ?? (a.preco_tonelada / 1000);
        const precoB = b.preco_kg ?? (b.preco_tonelada / 1000);
        comp = precoA - precoB;
      } else if (sortField === 'data') {
        comp = (a.updated_at || '').localeCompare(b.updated_at || '');
      }
      return sortAsc ? comp : -comp;
    });

    return result;
  }, [listInsumos, selectedCategoria, searchTerm, sortField, sortAsc]);

  const handleSort = (field: 'nome' | 'preco' | 'categoria' | 'data') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const handleShareWhatsApp = () => {
    const header = `*TABELA DE MATÉRIAS-PRIMAS - HARPIA NUTRIÇÃO ANIMAL*\n_Atualizada em: ${formatDateBR(new Date().toISOString())}_\n\n`;
    const linhas = filteredInsumos
      .map(i => {
        const precoKg = i.preco_kg ?? (i.preco_tonelada / 1000);
        return `• *[${i.categoria || 'GERAL'}]* ${i.nome}: ${formatCurrency(precoKg)}/kg`;
      })
      .join('\n');
    
    const texto = `${header}${linhas}\n\n_Consulte condições e disponibilidades._`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(texto)}`, '_blank');
  };

  return (
    <div className="space-y-4">
      {/* Banner de Apresentação das Matérias-Primas */}
      <div className="bg-gradient-to-r from-emerald-800 via-[#006837] to-teal-800 rounded-2xl p-4 sm:p-5 text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none flex items-center pr-4">
          <Layers size={140} />
        </div>
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-emerald-400/20 text-emerald-200 border border-emerald-400/30 text-[10px] sm:text-xs font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                Base de Formulação Oficial
              </span>
              <span className="text-emerald-200 text-xs flex items-center gap-1">
                <Calendar size={13} />
                {formatDateBR()}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black mt-1 tracking-tight">
              Preços de Matérias-Primas
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/90 max-w-xl mt-0.5">
              Tabela de matérias-primas por categoria, preço por quilo (R$/kg) e última atualização para controle e formulação.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleShareWhatsApp}
              className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 active:scale-95 text-white border border-white/20 px-3 py-2 rounded-xl text-xs font-bold transition shadow-xs"
              title="Compartilhar lista no WhatsApp"
            >
              <Share2 size={14} />
              <span>Compartilhar</span>
            </button>
          </div>
        </div>

        {/* Estatísticas Rápidas */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 pt-3 border-t border-emerald-600/40">
          <div className="bg-white/10 backdrop-blur-xs rounded-xl p-2.5">
            <span className="text-[10px] text-emerald-200 uppercase font-bold block">Total de Insumos</span>
            <span className="text-base sm:text-lg font-black">{listInsumos.length} itens</span>
          </div>
          <div className="bg-white/10 backdrop-blur-xs rounded-xl p-2.5">
            <span className="text-[10px] text-emerald-200 uppercase font-bold block">Categorias</span>
            <span className="text-base sm:text-lg font-black">{CATEGORIAS_INSUMOS.length} grupos</span>
          </div>
          <div className="bg-white/10 backdrop-blur-xs rounded-xl p-2.5">
            <span className="text-[10px] text-emerald-200 uppercase font-bold block">Menor Preço/kg</span>
            <span className="text-base sm:text-lg font-black">
              {formatCurrency(Math.min(...listInsumos.map(i => i.preco_kg ?? i.preco_tonelada / 1000)))}
            </span>
          </div>
          <div className="bg-white/10 backdrop-blur-xs rounded-xl p-2.5">
            <span className="text-[10px] text-emerald-200 uppercase font-bold block">Maior Preço/kg</span>
            <span className="text-base sm:text-lg font-black">
              {formatCurrency(Math.max(...listInsumos.map(i => i.preco_kg ?? i.preco_tonelada / 1000)))}
            </span>
          </div>
        </div>
      </div>

      {/* Barra de Filtros e Busca */}
      <div className="bg-white rounded-2xl p-3 sm:p-4 border border-slate-200 shadow-2xs space-y-3">
        {/* Campo de Busca */}
        <div className="relative">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Buscar matéria-prima por nome (ex: Milho, Farelo de Soja, Ureia, Núcleo...)"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#006837] focus:ring-2 focus:ring-[#006837]/20 outline-hidden transition"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
            >
              Limpar
            </button>
          )}
        </div>

        {/* Abas / Pills de Categorias */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 pt-0.5">
          <button
            onClick={() => setSelectedCategoria('TODAS')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition flex items-center gap-1.5 border ${
              selectedCategoria === 'TODAS'
                ? 'bg-[#006837] text-white border-[#006837] shadow-xs'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <span>Todas</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
              selectedCategoria === 'TODAS' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
            }`}>
              {countsByCategoria['TODAS'] || 0}
            </span>
          </button>

          {CATEGORIAS_INSUMOS.map(cat => {
            const isSelected = selectedCategoria === cat;
            const badge = getCategoriaBadgeStyle(cat);
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategoria(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition flex items-center gap-1.5 border ${
                  isSelected
                    ? `${badge.bg} ${badge.text} ${badge.border} ring-2 ring-[#006837]/40 shadow-xs font-black`
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${badge.dot}`} />
                <span>{cat}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                  isSelected ? 'bg-white/60 text-slate-900' : 'bg-slate-100 text-slate-500'
                }`}>
                  {countsByCategoria[cat] || 0}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TABELA DE MATÉRIAS-PRIMAS */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50/90 border-b border-slate-200 text-slate-500 font-bold uppercase text-[11px] tracking-wider">
              <tr>
                <th
                  onClick={() => handleSort('categoria')}
                  className="px-4 py-3.5 cursor-pointer hover:text-slate-800 transition select-none w-36"
                >
                  <div className="flex items-center gap-1">
                    <span>CATEGORIA</span>
                    <ArrowUpDown size={12} className={sortField === 'categoria' ? 'text-[#006837]' : 'text-slate-400'} />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('nome')}
                  className="px-4 py-3.5 cursor-pointer hover:text-slate-800 transition select-none"
                >
                  <div className="flex items-center gap-1">
                    <span>MATÉRIA PRIMA</span>
                    <ArrowUpDown size={12} className={sortField === 'nome' ? 'text-[#006837]' : 'text-slate-400'} />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('preco')}
                  className="px-4 py-3.5 text-right cursor-pointer hover:text-slate-800 transition select-none w-36"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>PREÇO DO KG</span>
                    <ArrowUpDown size={12} className={sortField === 'preco' ? 'text-[#006837]' : 'text-slate-400'} />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('data')}
                  className="px-4 py-3.5 text-center cursor-pointer hover:text-slate-800 transition select-none w-40"
                >
                  <div className="flex items-center justify-center gap-1">
                    <span>ÚLTIMA ATUALIZAÇÃO</span>
                    <ArrowUpDown size={12} className={sortField === 'data' ? 'text-[#006837]' : 'text-slate-400'} />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInsumos.length > 0 ? (
                filteredInsumos.map((item, index) => {
                  const badge = getCategoriaBadgeStyle(item.categoria);
                  const precoKg = item.preco_kg ?? (item.preco_tonelada / 1000);
                  const precoTon = item.preco_tonelada ?? (precoKg * 1000);

                  return (
                    <tr
                      key={item.id || index}
                      className="hover:bg-emerald-50/30 transition-colors group"
                    >
                      {/* 1. CATEGORIA */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-black border uppercase tracking-wide ${badge.bg} ${badge.text} ${badge.border}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                          {item.categoria || 'MACRO'}
                        </span>
                      </td>

                      {/* 2. MATÉRIA PRIMA */}
                      <td className="px-4 py-3.5">
                        <div className="font-bold text-slate-900 group-hover:text-[#006837] transition-colors">
                          {item.nome}
                        </div>
                        <div className="text-[11px] text-slate-400 font-medium">
                          Equiv. {formatCurrency(precoTon)} / Tonelada
                        </div>
                      </td>

                      {/* 3. PREÇO DO KG */}
                      <td className="px-4 py-3.5 text-right whitespace-nowrap">
                        <span className="font-black text-slate-950 text-sm sm:text-base">
                          {formatCurrency(precoKg)}
                        </span>
                        <span className="text-[11px] text-slate-500 font-semibold ml-1">/kg</span>
                      </td>

                      {/* 4. ÚLTIMA ATUALIZAÇÃO */}
                      <td className="px-4 py-3.5 text-center whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 bg-slate-100/90 border border-slate-200/70 px-2.5 py-1 rounded-lg">
                          <Calendar size={12} className="text-slate-400" />
                          {formatDateBR(item.updated_at)}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={4} className="px-4 py-12 text-center text-slate-500">
                    <Wheat size={32} className="mx-auto text-slate-300 mb-2" />
                    <p className="font-semibold text-sm">Nenhuma matéria-prima encontrada</p>
                    <p className="text-xs text-slate-400 mt-0.5">Tente outro termo de busca ou selecione outra categoria.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Rodapé da Tabela */}
        <div className="bg-slate-50/70 px-4 py-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <span>
            Mostrando <strong>{filteredInsumos.length}</strong> de <strong>{listInsumos.length}</strong> matérias-primas cadastradas
          </span>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
              <CheckCircle2 size={14} />
              Base Oficial Atualizada
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
