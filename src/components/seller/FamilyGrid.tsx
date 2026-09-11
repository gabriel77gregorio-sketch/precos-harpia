import React from 'react';
import type { Produto } from '../../types/database';
import { getFamiliaColorConfig, matchProdutoFamilia } from '../../lib/utils';
import { ChevronRight, Layers, Sparkles } from 'lucide-react';

interface FamilyGridProps {
  produtos: Produto[];
  onSelectFamily: (familyId: string) => void;
  onViewAll: () => void;
}

export const FamilyGrid: React.FC<FamilyGridProps> = ({
  produtos,
  onSelectFamily,
  onViewAll
}) => {
  const families = [
    {
      id: 'Harmilk',
      nome: 'Harmilk',
      subtitulo: 'Bovinos de Leite',
      descricao: 'Lactação, Bezerras, Novilhas, Pré Parto e Concentrado Ouro',
      destaque: '8 produtos'
    },
    {
      id: 'Harbeef',
      nome: 'Harbeef',
      subtitulo: 'Bovinos de Corte',
      descricao: 'Engorda, Confinamento, Multi Pasto, TIP e Concentrados',
      destaque: '10 produtos'
    },
    {
      id: 'Harphos',
      nome: 'Harphos',
      subtitulo: 'Minerais & Suplementos',
      descricao: 'Pe 20, Pe 30, Proteico 40 e Mineral Seca',
      destaque: '4 produtos'
    },
    {
      id: 'Harpig',
      nome: 'Harpig',
      subtitulo: 'Suinocultura',
      descricao: 'Inicial, Crescimento/Terminação, Gestação/Lactação e Concentrado',
      destaque: '4 produtos'
    },
    {
      id: 'Aves',
      nome: 'Harpia Aves',
      subtitulo: 'Avicultura Comercial & Caipira',
      descricao: 'Inicial, Engorda, Postura e Concentrados de 10kg, 20kg e 40kg',
      destaque: '8 produtos'
    },
    {
      id: 'H Horse',
      nome: 'H Horse',
      subtitulo: 'Equinos & Alta Performance',
      descricao: 'Equilíbrio, Premium, Multicampo e Concentrado Mix',
      destaque: '5 produtos'
    },
    {
      id: 'Harsheep',
      nome: 'Harsheep',
      subtitulo: 'Ovinocultura',
      descricao: 'Manutenção, Creep Feeding e Confinamento sem Cobre',
      destaque: '3 produtos'
    }
  ];

  return (
    <div className="space-y-4">
      {/* Título de Orientação */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#006837] flex items-center gap-1">
            <Sparkles size={12} />
            Catálogo por Linha de Nutrição
          </span>
          <h3 className="text-base sm:text-lg font-black text-slate-900">
            Selecione uma Família de Rações:
          </h3>
        </div>

        <button
          onClick={onViewAll}
          className="self-start sm:self-auto text-xs font-bold text-[#006837] hover:text-[#00522c] bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 px-3 py-1.5 rounded-xl transition flex items-center gap-1 shadow-2xs"
        >
          <Layers size={13} />
          <span>Ver todas as 42 rações</span>
        </button>
      </div>

      {/* Grade de Cards de Família */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {families.map((fam) => {
          const colorConfig = getFamiliaColorConfig(fam.id);
          const count = produtos.filter(
            (p) => p.ativo && matchProdutoFamilia(p, fam.id)
          ).length;

          return (
            <div
              key={fam.id}
              onClick={() => onSelectFamily(fam.id)}
              className="group relative bg-white rounded-2xl border-2 border-slate-200/80 hover:border-slate-300 hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden p-4 sm:p-5 flex flex-col justify-between active:scale-[0.99] select-none"
            >
              {/* Barra superior de cor da família */}
              <div className={`absolute top-0 left-0 right-0 h-1.5 ${colorConfig.accentBar}`} />

              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span
                    className={`text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${colorConfig.bgBadge} ${colorConfig.textBadge} ${colorConfig.borderBadge}`}
                  >
                    Linha {fam.nome}
                  </span>

                  <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                    {count || fam.destaque}
                  </span>
                </div>

                <h4 className="text-lg font-black text-slate-900 group-hover:text-[#006837] transition-colors">
                  {fam.nome}
                </h4>

                <p className="text-xs font-semibold text-slate-600 mt-0.5">
                  {fam.subtitulo}
                </p>

                <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                  {fam.descricao}
                </p>
              </div>

              {/* Rodapé do Card */}
              <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#006837]">
                <span>Acessar produtos</span>
                <div className="w-6 h-6 rounded-full bg-emerald-50 group-hover:bg-[#006837] group-hover:text-white flex items-center justify-center transition-colors">
                  <ChevronRight size={14} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
