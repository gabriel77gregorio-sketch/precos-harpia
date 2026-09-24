import type { Insumo } from '../types/formulacao';

const hoje = '2026-09-23T20:00:00.000Z';

export const initialInsumos: Insumo[] = [
  // ─── MACRO (19 itens) ────────────────────────────────────────
  {
    id: 'ins-macro-milho-moido-granel',
    categoria: 'MACRO',
    nome: 'Milho Moído Granel',
    preco_kg: 1.20,
    preco_tonelada: 1200,
    ativo: true,
    created_at: hoje,
    updated_at: hoje
  },
  {
    id: 'ins-macro-sorgo-moido',
    categoria: 'MACRO',
    nome: 'Sorgo Moído',
    preco_kg: 1.00,
    preco_tonelada: 1000,
    ativo: true,
    created_at: hoje,
    updated_at: hoje
  },
  {
    id: 'ins-macro-farelo-milho-ddgs',
    categoria: 'MACRO',
    nome: "Farelo de Milho (DDG's)",
    preco_kg: 1.50,
    preco_tonelada: 1500,
    ativo: true,
    created_at: hoje,
    updated_at: hoje
  },
  {
    id: 'ins-macro-farelo-soja-46',
    categoria: 'MACRO',
    nome: 'Farelo de Soja 46%',
    preco_kg: 2.35,
    preco_tonelada: 2350,
    ativo: true,
    created_at: hoje,
    updated_at: hoje
  },
  {
    id: 'ins-macro-aveia',
    categoria: 'MACRO',
    nome: 'Aveia',
    preco_kg: 1.05,
    preco_tonelada: 1050,
    ativo: true,
    created_at: hoje,
    updated_at: hoje
  },
  {
    id: 'ins-macro-farelo-algodao',
    categoria: 'MACRO',
    nome: 'Farelo de Algodão',
    preco_kg: 1.70,
    preco_tonelada: 1700,
    ativo: true,
    created_at: hoje,
    updated_at: hoje
  },
  {
    id: 'ins-macro-caroco-algodao',
    categoria: 'MACRO',
    nome: 'Caroço De Algodão',
    preco_kg: 1.75,
    preco_tonelada: 1750,
    ativo: true,
    created_at: hoje,
    updated_at: hoje
  },
  {
    id: 'ins-macro-farelo-arroz',
    categoria: 'MACRO',
    nome: 'Farelo de Arroz',
    preco_kg: 1.10,
    preco_tonelada: 1100,
    ativo: true,
    created_at: hoje,
    updated_at: hoje
  },
  {
    id: 'ins-macro-farelo-trigo',
    categoria: 'MACRO',
    nome: 'Farelo de Trigo',
    preco_kg: 1.10,
    preco_tonelada: 1100,
    ativo: true,
    created_at: hoje,
    updated_at: hoje
  },
  {
    id: 'ins-macro-casquinha-soja',
    categoria: 'MACRO',
    nome: 'Casquinha de Soja',
    preco_kg: 1.40,
    preco_tonelada: 1400,
    ativo: true,
    created_at: hoje,
    updated_at: hoje
  },
  {
    id: 'ins-macro-polpa-citrica-moipel',
    categoria: 'MACRO',
    nome: 'Polpa Citrica (Moi/Pel)',
    preco_kg: 1.10,
    preco_tonelada: 1100,
    ativo: true,
    created_at: hoje,
    updated_at: hoje
  },
  {
    id: 'ins-macro-polpa-citrica-moida',
    categoria: 'MACRO',
    nome: 'Polpa Citrica Moída',
    preco_kg: 1.10,
    preco_tonelada: 1100,
    ativo: true,
    created_at: hoje,
    updated_at: hoje
  },
  {
    id: 'ins-macro-fosfato-bicalcico',
    categoria: 'MACRO',
    nome: 'Fosfato Bicalcico',
    preco_kg: 7.80,
    preco_tonelada: 7800,
    ativo: true,
    created_at: hoje,
    updated_at: hoje
  },
  {
    id: 'ins-macro-calcario-calcitico',
    categoria: 'MACRO',
    nome: 'Calcario Calcitico',
    preco_kg: 0.60,
    preco_tonelada: 600,
    ativo: true,
    created_at: hoje,
    updated_at: hoje
  },
  {
    id: 'ins-macro-sal-comum',
    categoria: 'MACRO',
    nome: 'Sal Comum',
    preco_kg: 0.80,
    preco_tonelada: 800,
    ativo: true,
    created_at: hoje,
    updated_at: hoje
  },
  {
    id: 'ins-macro-ureia-pecuaria',
    categoria: 'MACRO',
    nome: 'Ureia Pecuaria',
    preco_kg: 5.00,
    preco_tonelada: 5000,
    ativo: true,
    created_at: hoje,
    updated_at: hoje
  },
  {
    id: 'ins-macro-oxido-magnesio',
    categoria: 'MACRO',
    nome: 'Oxido de Magnésio',
    preco_kg: 3.50,
    preco_tonelada: 3500,
    ativo: true,
    created_at: hoje,
    updated_at: hoje
  },
  {
    id: 'ins-macro-farelo-amendoim',
    categoria: 'MACRO',
    nome: 'Farelo de Amendoim',
    preco_kg: 1.76,
    preco_tonelada: 1760,
    ativo: true,
    created_at: hoje,
    updated_at: hoje
  },
  {
    id: 'ins-macro-farelo-amendoim-162',
    categoria: 'MACRO',
    nome: 'Farelo de Amendoim (R$ 1,62)',
    preco_kg: 1.62,
    preco_tonelada: 1620,
    ativo: true,
    created_at: hoje,
    updated_at: hoje
  },
  {
    id: 'ins-macro-sorgo-114',
    categoria: 'MACRO',
    nome: 'Sorgo Moído (R$ 1,14)',
    preco_kg: 1.14,
    preco_tonelada: 1140,
    ativo: true,
    created_at: hoje,
    updated_at: hoje
  },
  {
    id: 'ins-macro-bicarbonato',
    categoria: 'MACRO',
    nome: 'Bicarbonato',
    preco_kg: 5.00,
    preco_tonelada: 5000,
    ativo: true,
    created_at: hoje,
    updated_at: hoje
  },

  // ─── MICRO (16 itens) ────────────────────────────────────────
  {
    id: 'ins-micro-cloreto-amonia',
    categoria: 'MICRO',
    nome: 'Cloreto de Amonia',
    preco_kg: 7.35,
    preco_tonelada: 7350,
    ativo: true,
    created_at: hoje,
    updated_at: hoje
  },
  {
    id: 'ins-micro-nc-focus-42565-bov-corte-harpia',
    categoria: 'MICRO',
    nome: 'NC FOCUS 42565 BOV CORTE HARPIA',
    preco_kg: 5.69,
    preco_tonelada: 5690,
    ativo: true,
    created_at: hoje,
    updated_at: hoje
  },
  {
    id: 'ins-micro-px-mineral-corte-s-harpia',
    categoria: 'MICRO',
    nome: 'PX Mineral Corte S Harpia',
    preco_kg: 5.29,
    preco_tonelada: 5290,
    ativo: true,
    created_at: hoje,
    updated_at: hoje
  },
  {
    id: 'ins-micro-px-focus-32619-bovc-vit-mon',
    categoria: 'MICRO',
    nome: 'PX Focus 32619 BOVC Vit Mon',
    preco_kg: 4.78,
    preco_tonelada: 4780,
    ativo: true,
    created_at: hoje,
    updated_at: hoje
  },
  {
    id: 'ins-micro-px-vitaminico-corte-harpia',
    categoria: 'MICRO',
    nome: 'Px Vitaminico Corte Harpia',
    preco_kg: 4.39,
    preco_tonelada: 4390,
    ativo: true,
    created_at: hoje,
    updated_at: hoje
  },
  {
    id: 'ins-micro-nc-agmilk-ind-tech-02-m-bio',
    categoria: 'MICRO',
    nome: 'Nc Agmilk Ind Tech 0.2% M Bio',
    preco_kg: 20.44,
    preco_tonelada: 20440,
    ativo: true,
    created_at: hoje,
    updated_at: hoje
  },
  {
    id: 'ins-micro-flavofix-sp-mp',
    categoria: 'MICRO',
    nome: 'Flavofix SP MP',
    preco_kg: 19.13,
    preco_tonelada: 19130,
    ativo: true,
    created_at: hoje,
    updated_at: hoje
  },
  {
    id: 'ins-micro-prote-n',
    categoria: 'MICRO',
    nome: 'Prote-N',
    preco_kg: 9.65,
    preco_tonelada: 9650,
    ativo: true,
    created_at: hoje,
    updated_at: hoje
  },
  {
    id: 'ins-micro-prelacto-ionic-400',
    categoria: 'MICRO',
    nome: 'Prelacto Ionic 400',
    preco_kg: 8.42,
    preco_tonelada: 8420,
    ativo: true,
    created_at: hoje,
    updated_at: hoje
  },
  {
    id: 'ins-micro-px-sui-crescimento-industrial-tech',
    categoria: 'MICRO',
    nome: 'Px Sui Crescimento Industrial Tech',
    preco_kg: 7.98,
    preco_tonelada: 7980,
    ativo: true,
    created_at: hoje,
    updated_at: hoje
  },
  {
    id: 'ins-micro-nc-agrohorse-ind-tech-05',
    categoria: 'MICRO',
    nome: 'Nc Agrohorse Ind Tech 0.5%',
    preco_kg: 10.38,
    preco_tonelada: 10380,
    ativo: true,
    created_at: hoje,
    updated_at: hoje
  },
  {
    id: 'ins-micro-px-aves-corte-cresc-ind-tech',
    categoria: 'MICRO',
    nome: 'Px Aves Corte Cresc Ind Tech',
    preco_kg: 23.21,
    preco_tonelada: 23210,
    ativo: true,
    created_at: hoje,
    updated_at: hoje
  },
  {
    id: 'ins-micro-px-aves-corte-inicial-industrial-tech',
    categoria: 'MICRO',
    nome: 'Px Aves Corte Inicial Industrial Tech',
    preco_kg: 23.15,
    preco_tonelada: 23150,
    ativo: true,
    created_at: hoje,
    updated_at: hoje
  },
  {
    id: 'ins-micro-px-aves-postura-ind-tech-mp',
    categoria: 'MICRO',
    nome: 'PX Aves Postura Ind Tech MP',
    preco_kg: 13.02,
    preco_tonelada: 13020,
    ativo: true,
    created_at: hoje,
    updated_at: hoje
  },
  {
    id: 'ins-micro-nutronmilk-reproducao-t',
    categoria: 'MICRO',
    nome: 'Nutronmilk Reprodução T',
    preco_kg: 7.36,
    preco_tonelada: 7360,
    ativo: true,
    created_at: hoje,
    updated_at: hoje
  },
  {
    id: 'ins-micro-nc-agro-ovinos',
    categoria: 'MICRO',
    nome: 'NC Agro Ovinos',
    preco_kg: 6.95,
    preco_tonelada: 6950,
    ativo: true,
    created_at: hoje,
    updated_at: hoje
  },

  // ─── ADITIVO (2 itens) ───────────────────────────────────────
  {
    id: 'ins-aditivo-dbr-sacch-probiotico',
    categoria: 'ADITIVO',
    nome: 'DBR SACCH PROBIÓTICO',
    preco_kg: 28.50,
    preco_tonelada: 28500,
    ativo: true,
    created_at: hoje,
    updated_at: hoje
  },
  {
    id: 'ins-aditivo-ad-consulado-leite-standard',
    categoria: 'ADITIVO',
    nome: 'Ad Consulado Leite - Standard',
    preco_kg: 9.00,
    preco_tonelada: 9000,
    ativo: true,
    created_at: hoje,
    updated_at: hoje
  },

  // ─── PMH (7 itens) ───────────────────────────────────────────
  {
    id: 'ins-pmh-pmh-ag-milk-bio',
    categoria: 'PMH',
    nome: 'PMH Ag Milk Bio',
    preco_kg: 3.90,
    preco_tonelada: 3900,
    ativo: true,
    created_at: hoje,
    updated_at: hoje
  },
  {
    id: 'ins-pmh-pmh-h-horse',
    categoria: 'PMH',
    nome: 'PMH H HORSE',
    preco_kg: 6.89,
    preco_tonelada: 6890,
    ativo: true,
    created_at: hoje,
    updated_at: hoje
  },
  {
    id: 'ins-pmh-pmh-aves-corte-inicial-ind-tech-28kg',
    categoria: 'PMH',
    nome: 'PMH AVES CORTE INICIAL IND TECH - 28 kg',
    preco_kg: 7.518,
    preco_tonelada: 7518,
    ativo: true,
    created_at: hoje,
    updated_at: hoje
  },
  {
    id: 'ins-pmh-pmh-aves-engorda-26kg',
    categoria: 'PMH',
    nome: 'PMH AVES ENGORDA - 26 KG',
    preco_kg: 7.896,
    preco_tonelada: 7896,
    ativo: true,
    created_at: hoje,
    updated_at: hoje
  },
  {
    id: 'ins-pmh-pmh-aves-postura',
    categoria: 'PMH',
    nome: 'PMH Aves Postura',
    preco_kg: 5.351,
    preco_tonelada: 5351,
    ativo: true,
    created_at: hoje,
    updated_at: hoje
  },
  {
    id: 'ins-pmh-pmh-bovinos-1',
    categoria: 'PMH',
    nome: 'PMH BOVINOS (1)',
    preco_kg: 5.95,
    preco_tonelada: 5950,
    ativo: true,
    created_at: hoje,
    updated_at: hoje
  },
  {
    id: 'ins-pmh-pmh-bovinos-2',
    categoria: 'PMH',
    nome: 'PMH BOVINOS (2)',
    preco_kg: 6.66,
    preco_tonelada: 6660,
    ativo: true,
    created_at: hoje,
    updated_at: hoje
  },
  {
    id: 'ins-pmh-pmh-bovinos-2-513',
    categoria: 'PMH',
    nome: 'PMH BOVINOS (2) (R$ 5,13)',
    preco_kg: 5.13,
    preco_tonelada: 5130,
    ativo: true,
    created_at: hoje,
    updated_at: hoje
  },

  // ─── SAS (6 itens) ───────────────────────────────────────────
  {
    id: 'ins-sas-nucleo-terminacao-jc-0',
    categoria: 'SAS',
    nome: 'Nucleo Terminação JC = 0',
    preco_kg: 2.00,
    preco_tonelada: 2000,
    ativo: true,
    created_at: hoje,
    updated_at: hoje
  },
  {
    id: 'ins-sas-nucleo-recria',
    categoria: 'SAS',
    nome: 'Nucleo Recria',
    preco_kg: 2.00,
    preco_tonelada: 2000,
    ativo: true,
    created_at: hoje,
    updated_at: hoje
  },
  {
    id: 'ins-sas-probeef-dolce-mix',
    categoria: 'SAS',
    nome: 'Probeef dolce Mix',
    preco_kg: 2.00,
    preco_tonelada: 2000,
    ativo: true,
    created_at: hoje,
    updated_at: hoje
  },
  {
    id: 'ins-sas-probeef-lyt',
    categoria: 'SAS',
    nome: 'Probeef LYT',
    preco_kg: 2.00,
    preco_tonelada: 2000,
    ativo: true,
    created_at: hoje,
    updated_at: hoje
  },
  {
    id: 'ins-sas-guabinucleo-wagyu-recria-jc',
    categoria: 'SAS',
    nome: 'Guabinucleo Wagyu Recria JC',
    preco_kg: 2.00,
    preco_tonelada: 2000,
    ativo: true,
    created_at: hoje,
    updated_at: hoje
  },
  {
    id: 'ins-sas-guabinucleo-wagyu-terminacao-jc',
    categoria: 'SAS',
    nome: 'Guabinucleo Wagyu Terminacão JC',
    preco_kg: 2.00,
    preco_tonelada: 2000,
    ativo: true,
    created_at: hoje,
    updated_at: hoje
  },

  // ─── PINHALZINHO (6 itens) ───────────────────────────────────
  {
    id: 'ins-pinhalzinho-sacsom',
    categoria: 'PINHALZINHO',
    nome: 'Sacsom',
    preco_kg: 2.00,
    preco_tonelada: 2000,
    ativo: true,
    created_at: hoje,
    updated_at: hoje
  },
  {
    id: 'ins-pinhalzinho-parasit-100',
    categoria: 'PINHALZINHO',
    nome: 'Parasit 100',
    preco_kg: 2.00,
    preco_tonelada: 2000,
    ativo: true,
    created_at: hoje,
    updated_at: hoje
  },
  {
    id: 'ins-pinhalzinho-coequi-plus',
    categoria: 'PINHALZINHO',
    nome: 'Coequi Plus',
    preco_kg: 2.00,
    preco_tonelada: 2000,
    ativo: true,
    created_at: hoje,
    updated_at: hoje
  },
  {
    id: 'ins-pinhalzinho-fosbovi-30',
    categoria: 'PINHALZINHO',
    nome: 'Fosbovi 30',
    preco_kg: 2.00,
    preco_tonelada: 2000,
    ativo: true,
    created_at: hoje,
    updated_at: hoje
  },
  {
    id: 'ins-pinhalzinho-ovinofos',
    categoria: 'PINHALZINHO',
    nome: 'Ovinofos',
    preco_kg: 2.00,
    preco_tonelada: 2000,
    ativo: true,
    created_at: hoje,
    updated_at: hoje
  },
  {
    id: 'ins-pinhalzinho-flavotech',
    categoria: 'PINHALZINHO',
    nome: 'Flavotech',
    preco_kg: 2.00,
    preco_tonelada: 2000,
    ativo: true,
    created_at: hoje,
    updated_at: hoje
  }
];

export const CATEGORIAS_INSUMOS = [
  'MACRO',
  'MICRO',
  'ADITIVO',
  'PMH',
  'SAS',
  'PINHALZINHO'
] as const;

export type CategoriaInsumo = (typeof CATEGORIAS_INSUMOS)[number];
