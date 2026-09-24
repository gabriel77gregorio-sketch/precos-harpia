import type { FormulaRacao } from '../types/formulacao';

const hoje = '2026-09-24T08:38:00.000Z';

export const initialFormulas: FormulaRacao[] = [
  // =========================================================================
  // LINHA HARPIG (SUÍNOS)
  // =========================================================================

  // ─── 1) HARPIG INICIAL (1047) ──────────────────────────────────
  {
    id: 'formula-harpig-inicial-1047',
    codigo: '1047',
    produto_id: 'prod-harpig-inicial-1047',
    produto_nome: 'HARPIG INICIAL (1047)',
    batida_padrao_kg: 1000,
    peso_saco_kg: 40,
    itens: [
      { insumo_id: 'ins-macro-milho-moido-granel', quantidade_kg: 629.5 },
      { insumo_id: 'ins-macro-farelo-soja-46', quantidade_kg: 239.0 },
      { insumo_id: 'ins-macro-calcario-calcitico', quantidade_kg: 33.0 },
      { insumo_id: 'ins-micro-flavofix-sp-mp', quantidade_kg: 3.0 },
      { insumo_id: 'ins-macro-fosfato-bicalcico', quantidade_kg: 5.5 },
      { insumo_id: 'ins-macro-sal-comum', quantidade_kg: 5.0 },
      { insumo_id: 'ins-macro-farelo-trigo', quantidade_kg: 80.0 },
      { insumo_id: 'ins-micro-px-sui-crescimento-industrial-tech', quantidade_kg: 5.0 }
    ],
    custos_extras: [
      {
        id: 'custo-ps-sac-1047',
        descricao: 'P.S/SAC (Produção + Saco)',
        valor: 100.00,
        tipo: 'fixo'
      }
    ],
    notas: 'Batida padrão de 1 Tonelada (1.000 kg). Custo operacional P.S/SAC de R$ 100,00/ton.',
    created_at: hoje,
    updated_at: hoje
  },

  // ─── 2) HARPIG CT (1011) ──────────────────────────────────────
  {
    id: 'formula-harpig-ct-1011',
    codigo: '1011',
    produto_id: 'prod-harpig-ct-1011',
    produto_nome: 'HARPIG CT (1011)',
    batida_padrao_kg: 1000,
    peso_saco_kg: 40,
    itens: [
      { insumo_id: 'ins-macro-milho-moido-granel', quantidade_kg: 651.0 },
      { insumo_id: 'ins-macro-farelo-arroz', quantidade_kg: 100.0 },
      { insumo_id: 'ins-macro-farelo-soja-46', quantidade_kg: 211.0 },
      { insumo_id: 'ins-macro-calcario-calcitico', quantidade_kg: 28.0 },
      { insumo_id: 'ins-macro-sal-comum', quantidade_kg: 5.0 },
      { insumo_id: 'ins-micro-px-sui-crescimento-industrial-tech', quantidade_kg: 5.0 }
    ],
    custos_extras: [
      {
        id: 'custo-ps-sac-1011',
        descricao: 'P.S/SAC (Produção + Saco)',
        valor: 100.00,
        tipo: 'fixo'
      }
    ],
    notas: 'Batida padrão de 1 Tonelada (1.000 kg). Custo operacional P.S/SAC de R$ 100,00/ton.',
    created_at: hoje,
    updated_at: hoje
  },

  // ─── 3) HARPIG CONCENTRADO - 20 KG (1063) ─────────────────────
  {
    id: 'formula-harpig-concentrado-1063',
    codigo: '1063',
    produto_id: 'prod-harpig-04',
    produto_nome: 'HARPIG CONCENTRADO - 20 KG (1063)',
    batida_padrao_kg: 1000,
    peso_saco_kg: 20,
    itens: [
      { insumo_id: 'ins-macro-farelo-soja-46', quantidade_kg: 714.30 },
      { insumo_id: 'ins-macro-farelo-arroz', quantidade_kg: 150.00 },
      { insumo_id: 'ins-macro-farelo-trigo', quantidade_kg: 80.00 },
      { insumo_id: 'ins-macro-calcario-calcitico', quantidade_kg: 15.00 },
      { insumo_id: 'ins-micro-px-sui-crescimento-industrial-tech', quantidade_kg: 16.70 },
      { insumo_id: 'ins-macro-sal-comum', quantidade_kg: 15.00 },
      { insumo_id: 'ins-macro-fosfato-bicalcico', quantidade_kg: 9.00 }
    ],
    custos_extras: [
      {
        id: 'custo-ps-sac-1063',
        descricao: 'P.S/SAC (Produção + Saco)',
        valor: 100.00,
        tipo: 'fixo'
      }
    ],
    notas: 'Batida padrão de 1 Tonelada (1.000 kg). Saco de 20kg (50 sc/ton). Custo operacional P.S/SAC de R$ 100,00/ton.',
    created_at: hoje,
    updated_at: hoje
  },

  // =========================================================================
  // LINHA HARMILK (BOVINOS DE LEITE)
  // =========================================================================

  // ─── 4) HARMILK LAC 22 OURO (1650) ────────────────────────────
  {
    id: 'formula-harmilk-lac-22-ouro-1650',
    codigo: '1650',
    produto_id: 'prod-harmilk-01',
    produto_nome: 'HARMILK LAC 22 OURO (1650)',
    batida_padrao_kg: 1000,
    peso_saco_kg: 40,
    itens: [
      { insumo_id: 'ins-macro-milho-moido-granel', quantidade_kg: 532.6 },
      { insumo_id: 'ins-macro-farelo-milho-ddgs', quantidade_kg: 50.0 },
      { insumo_id: 'ins-macro-farelo-soja-46', quantidade_kg: 359.0 },
      { insumo_id: 'ins-macro-calcario-calcitico', quantidade_kg: 24.0 },
      { insumo_id: 'ins-macro-bicarbonato', quantidade_kg: 10.0 },
      { insumo_id: 'ins-macro-sal-comum', quantidade_kg: 5.0 },
      { insumo_id: 'ins-macro-fosfato-bicalcico', quantidade_kg: 7.5 },
      { insumo_id: 'ins-micro-flavofix-sp-mp', quantidade_kg: 4.0 },
      { insumo_id: 'ins-macro-oxido-magnesio', quantidade_kg: 5.0 },
      { insumo_id: 'ins-aditivo-dbr-sacch-probiotico', quantidade_kg: 0.5 },
      { insumo_id: 'ins-micro-nc-agmilk-ind-tech-02-m-bio', quantidade_kg: 2.4 }
    ],
    custos_extras: [
      {
        id: 'custo-ps-sac-1650',
        descricao: 'P.S/SAC (Produção + Saco)',
        valor: 100.00,
        tipo: 'fixo'
      }
    ],
    notas: 'Batida padrão de 1 Tonelada (1.000 kg). Saco de 40kg (25 sc/ton). Custo operacional P.S/SAC de R$ 100,00/ton.',
    created_at: hoje,
    updated_at: hoje
  },

  // ─── 5) HARMILK LAC 22 D (1305) ───────────────────────────────
  {
    id: 'formula-harmilk-lac-22-d-1305',
    codigo: '1305',
    produto_id: 'prod-harmilk-02',
    produto_nome: 'HARMILK LAC 22 D (1305)',
    batida_padrao_kg: 1000,
    peso_saco_kg: 40,
    itens: [
      { insumo_id: 'ins-macro-milho-moido-granel', quantidade_kg: 519.0 },
      { insumo_id: 'ins-macro-farelo-trigo', quantidade_kg: 80.0 },
      { insumo_id: 'ins-macro-farelo-soja-46', quantidade_kg: 151.0 },
      { insumo_id: 'ins-macro-farelo-algodao', quantidade_kg: 50.0 },
      { insumo_id: 'ins-macro-farelo-milho-ddgs', quantidade_kg: 160.0 },
      { insumo_id: 'ins-macro-ureia-pecuaria', quantidade_kg: 10.0 },
      { insumo_id: 'ins-pmh-pmh-ag-milk-bio', quantidade_kg: 30.0 }
    ],
    custos_extras: [
      {
        id: 'custo-ps-sac-1305',
        descricao: 'P.S/SAC (Produção + Saco)',
        valor: 100.00,
        tipo: 'fixo'
      }
    ],
    notas: 'Batida padrão de 1 Tonelada (1.000 kg). Saco de 40kg (25 sc/ton). Custo operacional P.S/SAC de R$ 100,00/ton.',
    created_at: hoje,
    updated_at: hoje
  },

  // ─── 6) HARMILK LAC 24 D (1322) ───────────────────────────────
  {
    id: 'formula-harmilk-lac-24-d-1322',
    codigo: '1322',
    produto_id: 'prod-harmilk-03',
    produto_nome: 'HARMILK LAC 24 D (1322)',
    batida_padrao_kg: 1000,
    peso_saco_kg: 40,
    itens: [
      { insumo_id: 'ins-macro-milho-moido-granel', quantidade_kg: 460.0 },
      { insumo_id: 'ins-macro-polpa-citrica-moipel', quantidade_kg: 50.0 },
      { insumo_id: 'ins-macro-farelo-soja-46', quantidade_kg: 270.0 },
      { insumo_id: 'ins-macro-farelo-algodao', quantidade_kg: 50.0 },
      { insumo_id: 'ins-macro-farelo-milho-ddgs', quantidade_kg: 120.0 },
      { insumo_id: 'ins-macro-ureia-pecuaria', quantidade_kg: 10.0 },
      { insumo_id: 'ins-macro-oxido-magnesio', quantidade_kg: 0.5 },
      { insumo_id: 'ins-macro-bicarbonato', quantidade_kg: 9.5 },
      { insumo_id: 'ins-pmh-pmh-ag-milk-bio', quantidade_kg: 30.0 }
    ],
    custos_extras: [
      {
        id: 'custo-ps-sac-1322',
        descricao: 'P.S/SAC (Produção + Saco)',
        valor: 100.00,
        tipo: 'fixo'
      }
    ],
    notas: 'Batida padrão de 1 Tonelada (1.000 kg). Saco de 40kg (25 sc/ton). Custo operacional P.S/SAC de R$ 100,00/ton.',
    created_at: hoje,
    updated_at: hoje
  },

  // ─── 7) HARMILK LAC 27 D (1266) ───────────────────────────────
  {
    id: 'formula-harmilk-lac-27-d-1266',
    codigo: '1266',
    produto_id: 'prod-harmilk-04',
    produto_nome: 'HARMILK LAC 27 D (1266)',
    batida_padrao_kg: 1000,
    peso_saco_kg: 40,
    itens: [
      { insumo_id: 'ins-macro-milho-moido-granel', quantidade_kg: 310.0 },
      { insumo_id: 'ins-macro-farelo-milho-ddgs', quantidade_kg: 200.0 },
      { insumo_id: 'ins-macro-polpa-citrica-moipel', quantidade_kg: 90.0 },
      { insumo_id: 'ins-macro-farelo-soja-46', quantidade_kg: 255.0 },
      { insumo_id: 'ins-macro-caroco-algodao', quantidade_kg: 90.0 },
      { insumo_id: 'ins-macro-ureia-pecuaria', quantidade_kg: 15.0 },
      { insumo_id: 'ins-macro-oxido-magnesio', quantidade_kg: 0.5 },
      { insumo_id: 'ins-macro-bicarbonato', quantidade_kg: 9.5 },
      { insumo_id: 'ins-pmh-pmh-ag-milk-bio', quantidade_kg: 30.0 }
    ],
    custos_extras: [
      {
        id: 'custo-ps-sac-1266',
        descricao: 'P.S/SAC (Produção + Saco)',
        valor: 100.00,
        tipo: 'fixo'
      }
    ],
    notas: 'Batida padrão de 1 Tonelada (1.000 kg). Saco de 40kg (25 sc/ton). Custo operacional P.S/SAC de R$ 100,00/ton.',
    created_at: hoje,
    updated_at: hoje
  },

  // ─── 8) HARMILK BEZERROS (1023) ───────────────────────────────
  {
    id: 'formula-harmilk-bezerros-1023',
    codigo: '1023',
    produto_id: 'prod-harmilk-05',
    produto_nome: 'HARMILK BEZERROS (1023)',
    batida_padrao_kg: 1000,
    peso_saco_kg: 40,
    itens: [
      { insumo_id: 'ins-macro-milho-moido-granel', quantidade_kg: 428.5 },
      { insumo_id: 'ins-macro-farelo-soja-46', quantidade_kg: 207.0 },
      { insumo_id: 'ins-macro-farelo-trigo', quantidade_kg: 150.0 },
      { insumo_id: 'ins-macro-farelo-arroz', quantidade_kg: 80.0 },
      { insumo_id: 'ins-macro-aveia', quantidade_kg: 50.0 },
      { insumo_id: 'ins-macro-farelo-milho-ddgs', quantidade_kg: 40.0 },
      { insumo_id: 'ins-macro-calcario-calcitico', quantidade_kg: 26.0 },
      { insumo_id: 'ins-macro-fosfato-bicalcico', quantidade_kg: 7.5 },
      { insumo_id: 'ins-macro-sal-comum', quantidade_kg: 5.0 },
      { insumo_id: 'ins-micro-flavofix-sp-mp', quantidade_kg: 3.0 },
      { insumo_id: 'ins-micro-nc-agmilk-ind-tech-02-m-bio', quantidade_kg: 2.0 },
      { insumo_id: 'ins-aditivo-dbr-sacch-probiotico', quantidade_kg: 1.0 }
    ],
    custos_extras: [
      {
        id: 'custo-ps-sac-1023',
        descricao: 'P.S/SAC (Produção + Saco)',
        valor: 100.00,
        tipo: 'fixo'
      }
    ],
    notas: 'Batida padrão de 1 Tonelada (1.000 kg). Saco de 40kg (25 sc/ton). Custo operacional P.S/SAC de R$ 100,00/ton.',
    created_at: hoje,
    updated_at: hoje
  },

  // ─── 9) HARMILK NOVILHAS (1029) ───────────────────────────────
  {
    id: 'formula-harmilk-novilhas-1029',
    codigo: '1029',
    produto_id: 'prod-harmilk-06',
    produto_nome: 'HARMILK NOVILHAS (1029)',
    batida_padrao_kg: 1000,
    peso_saco_kg: 40,
    itens: [
      { insumo_id: 'ins-macro-milho-moido-granel', quantidade_kg: 737.05 },
      { insumo_id: 'ins-macro-polpa-citrica-moipel', quantidade_kg: 120.0 },
      { insumo_id: 'ins-macro-farelo-soja-46', quantidade_kg: 83.0 },
      { insumo_id: 'ins-macro-ureia-pecuaria', quantidade_kg: 20.0 },
      { insumo_id: 'ins-macro-fosfato-bicalcico', quantidade_kg: 8.5 },
      { insumo_id: 'ins-macro-sal-comum', quantidade_kg: 4.45 },
      { insumo_id: 'ins-macro-calcario-calcitico', quantidade_kg: 25.0 },
      { insumo_id: 'ins-micro-nc-agmilk-ind-tech-02-m-bio', quantidade_kg: 2.0 }
    ],
    custos_extras: [
      {
        id: 'custo-ps-sac-1029',
        descricao: 'P.S/SAC (Produção + Saco)',
        valor: 100.00,
        tipo: 'fixo'
      }
    ],
    notas: 'Batida padrão de 1 Tonelada (1.000 kg). Saco de 40kg (25 sc/ton). Custo operacional P.S/SAC de R$ 100,00/ton.',
    created_at: hoje,
    updated_at: hoje
  },

  // ─── 10) HARMILK PRÉ PARTO (1030) ─────────────────────────────
  {
    id: 'formula-harmilk-pre-parto-1030',
    codigo: '1030',
    produto_id: 'prod-harmilk-07',
    produto_nome: 'HARMILK PRÉ PARTO (1030)',
    batida_padrao_kg: 1000,
    peso_saco_kg: 40,
    itens: [
      { insumo_id: 'ins-macro-milho-moido-granel', quantidade_kg: 364.0 },
      { insumo_id: 'ins-macro-farelo-soja-46', quantidade_kg: 456.5 },
      { insumo_id: 'ins-macro-farelo-trigo', quantidade_kg: 59.0 },
      { insumo_id: 'ins-micro-prote-n', quantidade_kg: 5.5 },
      { insumo_id: 'ins-macro-ureia-pecuaria', quantidade_kg: 15.0 },
      { insumo_id: 'ins-micro-prelacto-ionic-400', quantidade_kg: 100.0 }
    ],
    custos_extras: [
      {
        id: 'custo-ps-sac-1030',
        descricao: 'P.S/SAC (Produção + Saco)',
        valor: 100.00,
        tipo: 'fixo'
      }
    ],
    notas: 'Batida padrão de 1 Tonelada (1.000 kg). Saco de 40kg (25 sc/ton). Custo operacional P.S/SAC de R$ 100,00/ton.',
    created_at: hoje,
    updated_at: hoje
  },

  // ─── 11) HARMILK CONCENTRADO OURO (1678) ──────────────────────
  {
    id: 'formula-harmilk-concentrado-ouro-1678',
    codigo: '1678',
    produto_id: 'prod-harmilk-08',
    produto_nome: 'HARMILK CONCENTRADO OURO (1678)',
    batida_padrao_kg: 1000,
    peso_saco_kg: 40,
    itens: [
      { insumo_id: 'ins-macro-farelo-soja-46', quantidade_kg: 740.13 },
      { insumo_id: 'ins-macro-farelo-milho-ddgs', quantidade_kg: 107.0 },
      { insumo_id: 'ins-macro-fosfato-bicalcico', quantidade_kg: 10.0 },
      { insumo_id: 'ins-macro-calcario-calcitico', quantidade_kg: 40.0 },
      { insumo_id: 'ins-macro-bicarbonato', quantidade_kg: 30.0 },
      { insumo_id: 'ins-macro-sal-comum', quantidade_kg: 20.0 },
      { insumo_id: 'ins-macro-oxido-magnesio', quantidade_kg: 15.0 },
      { insumo_id: 'ins-micro-prote-n', quantidade_kg: 30.0 },
      { insumo_id: 'ins-aditivo-ad-consulado-leite-standard', quantidade_kg: 2.0 },
      { insumo_id: 'ins-aditivo-dbr-sacch-probiotico', quantidade_kg: 1.0 },
      { insumo_id: 'ins-micro-nc-agmilk-ind-tech-02-m-bio', quantidade_kg: 4.87 }
    ],
    custos_extras: [
      {
        id: 'custo-ps-sac-1678',
        descricao: 'P.S/SAC (Produção + Saco)',
        valor: 100.00,
        tipo: 'fixo'
      }
    ],
    notas: 'Batida padrão de 1 Tonelada (1.000 kg). Saco de 40kg (25 sc/ton). Custo operacional P.S/SAC de R$ 100,00/ton.',
    created_at: hoje,
    updated_at: hoje
  },

  // =========================================================================
  // LINHA HARPIA AVES
  // =========================================================================

  // ─── 12) HARPIA AVES INICIAL 20 KG (2050) ─────────────────────
  {
    id: 'formula-harpia-aves-inicial-20kg-2050',
    codigo: '2050',
    produto_id: 'prod-aves-01',
    produto_nome: 'HARPIA AVES INICIAL 20 KG (2050)',
    batida_padrao_kg: 1000,
    peso_saco_kg: 20,
    itens: [
      { insumo_id: 'ins-macro-milho-moido-granel', quantidade_kg: 572.0 },
      { insumo_id: 'ins-macro-farelo-soja-46', quantidade_kg: 390.0 },
      { insumo_id: 'ins-macro-calcario-calcitico', quantidade_kg: 10.0 },
      { insumo_id: 'ins-pmh-pmh-aves-corte-inicial-ind-tech-28kg', quantidade_kg: 28.0 }
    ],
    custos_extras: [
      {
        id: 'custo-ps-sac-2050',
        descricao: 'P.S/SAC (Produção + Saco)',
        valor: 100.00,
        tipo: 'fixo'
      }
    ],
    notas: 'Batida padrão de 1 Tonelada (1.000 kg). Saco de 20kg (50 sc/ton). Custo operacional P.S/SAC de R$ 100,00/ton.',
    created_at: hoje,
    updated_at: hoje
  },

  // ─── 13) HARPIA AVES INICIAL 10 KG (1542) ─────────────────────
  {
    id: 'formula-harpia-aves-inicial-10kg-1542',
    codigo: '1542',
    produto_id: 'prod-aves-02',
    produto_nome: 'HARPIA AVES INICIAL 10 KG (1542)',
    batida_padrao_kg: 1000,
    peso_saco_kg: 10,
    itens: [
      { insumo_id: 'ins-macro-milho-moido-granel', quantidade_kg: 572.0 },
      { insumo_id: 'ins-macro-farelo-soja-46', quantidade_kg: 390.0 },
      { insumo_id: 'ins-macro-calcario-calcitico', quantidade_kg: 10.0 },
      { insumo_id: 'ins-pmh-pmh-aves-corte-inicial-ind-tech-28kg', quantidade_kg: 28.0 }
    ],
    custos_extras: [
      {
        id: 'custo-ps-sac-1542',
        descricao: 'P.S/SAC (Produção + Saco)',
        valor: 100.00,
        tipo: 'fixo'
      }
    ],
    notas: 'Batida padrão de 1 Tonelada (1.000 kg). Saco de 10kg (100 sc/ton). Custo operacional P.S/SAC de R$ 100,00/ton.',
    created_at: hoje,
    updated_at: hoje
  },

  // ─── 14) PMH AVES CORTE INICIAL IND TECH - 28 kg ──────────────
  {
    id: 'formula-pmh-aves-corte-inicial-28kg',
    codigo: 'PMH-28',
    produto_nome: 'PMH AVES CORTE INICIAL IND TECH - 28 kg',
    batida_padrao_kg: 28,
    peso_saco_kg: 28,
    itens: [
      { insumo_id: 'ins-macro-calcario-calcitico', quantidade_kg: 10.0 },
      { insumo_id: 'ins-macro-fosfato-bicalcico', quantidade_kg: 8.0 },
      { insumo_id: 'ins-macro-sal-comum', quantidade_kg: 4.0 },
      { insumo_id: 'ins-micro-px-aves-corte-inicial-industrial-tech', quantidade_kg: 6.0 }
    ],
    custos_extras: [],
    notas: 'Ficha técnica da pré-mistura PMH de Aves Corte Inicial (28 kg por batida de 1t).',
    created_at: hoje,
    updated_at: hoje
  },

  // ─── 15) HARPIA AVES ENGORDA 20 KG (2049) ─────────────────────
  {
    id: 'formula-harpia-aves-engorda-20kg-2049',
    codigo: '2049',
    produto_id: 'prod-aves-03',
    produto_nome: 'HARPIA AVES ENGORDA 20 KG (2049)',
    batida_padrao_kg: 1000,
    peso_saco_kg: 20,
    itens: [
      { insumo_id: 'ins-macro-milho-moido-granel', quantidade_kg: 700.8 },
      { insumo_id: 'ins-macro-farelo-trigo', quantidade_kg: 19.0 },
      { insumo_id: 'ins-macro-farelo-soja-46', quantidade_kg: 200.0 },
      { insumo_id: 'ins-macro-farelo-algodao', quantidade_kg: 16.0 },
      { insumo_id: 'ins-macro-farelo-milho-ddgs', quantidade_kg: 32.0 },
      { insumo_id: 'ins-macro-calcario-calcitico', quantidade_kg: 6.2 },
      { insumo_id: 'ins-pmh-pmh-aves-engorda-26kg', quantidade_kg: 26.0 }
    ],
    custos_extras: [
      {
        id: 'custo-ps-sac-2049',
        descricao: 'P.S/SAC (Produção + Saco)',
        valor: 100.00,
        tipo: 'fixo'
      }
    ],
    notas: 'Batida padrão de 1 Tonelada (1.000 kg). Saco de 20kg (50 sc/ton). Custo operacional P.S/SAC de R$ 100,00/ton.',
    created_at: hoje,
    updated_at: hoje
  },

  // ─── 16) HARPIA AVES ENGORDA - 10 KG (1541) ───────────────────
  {
    id: 'formula-harpia-aves-engorda-10kg-1541',
    codigo: '1541',
    produto_id: 'prod-aves-04',
    produto_nome: 'HARPIA AVES ENGORDA - 10 KG (1541)',
    batida_padrao_kg: 1000,
    peso_saco_kg: 10,
    itens: [
      { insumo_id: 'ins-macro-milho-moido-granel', quantidade_kg: 700.8 },
      { insumo_id: 'ins-macro-farelo-trigo', quantidade_kg: 19.0 },
      { insumo_id: 'ins-macro-farelo-soja-46', quantidade_kg: 200.0 },
      { insumo_id: 'ins-macro-farelo-algodao', quantidade_kg: 16.0 },
      { insumo_id: 'ins-macro-farelo-milho-ddgs', quantidade_kg: 32.0 },
      { insumo_id: 'ins-macro-calcario-calcitico', quantidade_kg: 6.2 },
      { insumo_id: 'ins-pmh-pmh-aves-engorda-26kg', quantidade_kg: 26.0 }
    ],
    custos_extras: [
      {
        id: 'custo-ps-sac-1541',
        descricao: 'P.S/SAC (Produção + Saco)',
        valor: 100.00,
        tipo: 'fixo'
      }
    ],
    notas: 'Batida padrão de 1 Tonelada (1.000 kg). Saco de 10kg (100 sc/ton). Custo operacional P.S/SAC de R$ 100,00/ton.',
    created_at: hoje,
    updated_at: hoje
  },

  // ─── 17) PMH AVES ENGORDA - 26 KG ─────────────────────────────
  {
    id: 'formula-pmh-aves-engorda-26kg',
    codigo: 'PMH-26',
    produto_nome: 'PMH AVES ENGORDA - 26 KG',
    batida_padrao_kg: 26,
    peso_saco_kg: 26,
    itens: [
      { insumo_id: 'ins-macro-calcario-calcitico', quantidade_kg: 8.80 },
      { insumo_id: 'ins-macro-fosfato-bicalcico', quantidade_kg: 7.40 },
      { insumo_id: 'ins-macro-sal-comum', quantidade_kg: 3.80 },
      { insumo_id: 'ins-micro-px-aves-corte-cresc-ind-tech', quantidade_kg: 6.00 }
    ],
    custos_extras: [],
    notas: 'Ficha técnica da pré-mistura PMH de Aves Engorda (26 kg por batida de 1t).',
    created_at: hoje,
    updated_at: hoje
  },

  // ─── 18) HARPIA AVES POSTURA - 20 KG (2047) ───────────────────
  {
    id: 'formula-harpia-aves-postura-20kg-2047',
    codigo: '2047',
    produto_id: 'prod-aves-05',
    produto_nome: 'HARPIA AVES POSTURA - 20 KG (2047)',
    batida_padrao_kg: 1000,
    peso_saco_kg: 20,
    itens: [
      { insumo_id: 'ins-macro-milho-moido-granel', quantidade_kg: 664.0 },
      { insumo_id: 'ins-macro-farelo-trigo', quantidade_kg: 18.0 },
      { insumo_id: 'ins-macro-farelo-soja-46', quantidade_kg: 158.0 },
      { insumo_id: 'ins-macro-farelo-algodao', quantidade_kg: 9.0 },
      { insumo_id: 'ins-macro-farelo-milho-ddgs', quantidade_kg: 30.0 },
      { insumo_id: 'ins-macro-calcario-calcitico', quantidade_kg: 96.0 },
      { insumo_id: 'ins-pmh-pmh-aves-postura', quantidade_kg: 25.0 }
    ],
    custos_extras: [
      {
        id: 'custo-ps-sac-2047',
        descricao: 'P.S/SAC (Produção + Saco)',
        valor: 100.00,
        tipo: 'fixo'
      }
    ],
    notas: 'Batida padrão de 1 Tonelada (1.000 kg). Saco de 20kg (50 sc/ton). Custo operacional P.S/SAC de R$ 100,00/ton.',
    created_at: hoje,
    updated_at: hoje
  },

  // ─── 19) HARPIA AVES POSTURA - 10 KG (1540) ───────────────────
  {
    id: 'formula-harpia-aves-postura-10kg-1540',
    codigo: '1540',
    produto_id: 'prod-aves-06',
    produto_nome: 'HARPIA AVES POSTURA - 10 KG (1540)',
    batida_padrao_kg: 1000,
    peso_saco_kg: 10,
    itens: [
      { insumo_id: 'ins-macro-milho-moido-granel', quantidade_kg: 664.0 },
      { insumo_id: 'ins-macro-farelo-trigo', quantidade_kg: 18.0 },
      { insumo_id: 'ins-macro-farelo-soja-46', quantidade_kg: 158.0 },
      { insumo_id: 'ins-macro-farelo-algodao', quantidade_kg: 9.0 },
      { insumo_id: 'ins-macro-farelo-milho-ddgs', quantidade_kg: 30.0 },
      { insumo_id: 'ins-macro-calcario-calcitico', quantidade_kg: 96.0 },
      { insumo_id: 'ins-pmh-pmh-aves-postura', quantidade_kg: 25.0 }
    ],
    custos_extras: [
      {
        id: 'custo-ps-sac-1540',
        descricao: 'P.S/SAC (Produção + Saco)',
        valor: 100.00,
        tipo: 'fixo'
      }
    ],
    notas: 'Batida padrão de 1 Tonelada (1.000 kg). Saco de 10kg (100 sc/ton). Custo operacional P.S/SAC de R$ 100,00/ton.',
    created_at: hoje,
    updated_at: hoje
  },

  // ─── 20) PMH Aves Postura - 25 KG ─────────────────────────────
  {
    id: 'formula-pmh-aves-postura-25kg',
    codigo: 'PMH-25',
    produto_nome: 'PMH Aves Postura - 25 KG',
    batida_padrao_kg: 25,
    peso_saco_kg: 25,
    itens: [
      { insumo_id: 'ins-macro-calcario-calcitico', quantidade_kg: 8.00 },
      { insumo_id: 'ins-macro-fosfato-bicalcico', quantidade_kg: 9.50 },
      { insumo_id: 'ins-macro-sal-comum', quantidade_kg: 3.50 },
      { insumo_id: 'ins-micro-px-aves-postura-ind-tech-mp', quantidade_kg: 4.00 }
    ],
    custos_extras: [],
    notas: 'Ficha técnica da pré-mistura PMH de Aves Postura (25 kg por batida de 1t).',
    created_at: hoje,
    updated_at: hoje
  },

  // ─── 21) HARPIA AVES CONCENTRADO POSTURA - 20 KG (1579) ───────
  {
    id: 'formula-harpia-aves-concentrado-postura-20kg-1579',
    codigo: '1579',
    produto_id: 'prod-aves-07',
    produto_nome: 'HARPIA AVES CONCENTRADO POSTURA - 20 KG (1579)',
    batida_padrao_kg: 1000,
    peso_saco_kg: 20,
    itens: [
      { insumo_id: 'ins-macro-farelo-soja-46', quantidade_kg: 516.0 },
      { insumo_id: 'ins-macro-farelo-arroz', quantidade_kg: 150.0 },
      { insumo_id: 'ins-macro-calcario-calcitico', quantidade_kg: 303.0 },
      { insumo_id: 'ins-macro-fosfato-bicalcico', quantidade_kg: 11.0 },
      { insumo_id: 'ins-macro-sal-comum', quantidade_kg: 10.0 },
      { insumo_id: 'ins-micro-px-aves-postura-ind-tech-mp', quantidade_kg: 10.0 }
    ],
    custos_extras: [
      {
        id: 'custo-ps-sac-1579',
        descricao: 'P.S/SAC (Produção + Saco)',
        valor: 100.00,
        tipo: 'fixo'
      }
    ],
    notas: 'Batida padrão de 1 Tonelada (1.000 kg). Saco de 20kg (50 sc/ton). Custo operacional P.S/SAC de R$ 100,00/ton.',
    created_at: hoje,
    updated_at: hoje
  },

  // ─── 22) HARPIA AVES CONCENTRADO INICIAL/ENGORDA - 20 KG (1578)
  {
    id: 'formula-harpia-aves-concentrado-inicial-engorda-20kg-1578',
    codigo: '1578',
    produto_id: 'prod-aves-08',
    produto_nome: 'HARPIA AVES CONCENTRADO INICIAL/ENGORDA - 20 KG (1578)',
    batida_padrao_kg: 1000,
    peso_saco_kg: 20,
    itens: [
      { insumo_id: 'ins-macro-calcario-calcitico', quantidade_kg: 87.0 },
      { insumo_id: 'ins-macro-sal-comum', quantidade_kg: 12.0 },
      { insumo_id: 'ins-macro-farelo-milho-ddgs', quantidade_kg: 7.45 },
      { insumo_id: 'ins-macro-farelo-soja-46', quantidade_kg: 861.55 },
      { insumo_id: 'ins-macro-fosfato-bicalcico', quantidade_kg: 15.0 },
      { insumo_id: 'ins-micro-px-aves-corte-cresc-ind-tech', quantidade_kg: 17.0 }
    ],
    custos_extras: [
      {
        id: 'custo-ps-sac-1578',
        descricao: 'P.S/SAC (Produção + Saco)',
        valor: 100.00,
        tipo: 'fixo'
      }
    ],
    notas: 'Batida padrão de 1 Tonelada (1.000 kg). Saco de 20kg (50 sc/ton). Custo operacional P.S/SAC de R$ 100,00/ton.',
    created_at: hoje,
    updated_at: hoje
  },

  // =========================================================================
  // LINHA HARPHOS (BOVINOS DE CORTE - MINERAIS & PROTEICOS)
  // =========================================================================

  // ─── 23) HARPHOS PE 20 (1041) ─────────────────────────────────
  {
    id: 'formula-harphos-pe-20-1041',
    codigo: '1041',
    produto_id: 'prod-harphos-01',
    produto_nome: 'HARPHOS PE 20 (1041)',
    batida_padrao_kg: 1000,
    peso_saco_kg: 30,
    itens: [
      { insumo_id: 'ins-macro-milho-moido-granel', quantidade_kg: 649.50 },
      { insumo_id: 'ins-macro-farelo-soja-46', quantidade_kg: 162.00 },
      { insumo_id: 'ins-macro-ureia-pecuaria', quantidade_kg: 20.00 },
      { insumo_id: 'ins-macro-sal-comum', quantidade_kg: 60.00 },
      { insumo_id: 'ins-macro-calcario-calcitico', quantidade_kg: 3.00 },
      { insumo_id: 'ins-macro-fosfato-bicalcico', quantidade_kg: 34.50 },
      { insumo_id: 'ins-macro-farelo-milho-ddgs', quantidade_kg: 59.00 },
      { insumo_id: 'ins-micro-px-focus-32619-bovc-vit-mon', quantidade_kg: 4.00 },
      { insumo_id: 'ins-micro-px-mineral-corte-s-harpia', quantidade_kg: 8.00 }
    ],
    custos_extras: [
      {
        id: 'custo-ps-sac-1041',
        descricao: 'P.S/SAC (Produção + Saco)',
        valor: 100.00,
        tipo: 'fixo'
      }
    ],
    notas: 'Batida padrão de 1 Tonelada (1.000 kg). Saco de 30kg (33,3 sc/ton). Custo operacional P.S/SAC de R$ 100,00/ton.',
    created_at: hoje,
    updated_at: hoje
  },

  // ─── 24) HARPHOS PE 30 (1042) ─────────────────────────────────
  {
    id: 'formula-harphos-pe-30-1042',
    codigo: '1042',
    produto_id: 'prod-harphos-02',
    produto_nome: 'HARPHOS PE 30 (1042)',
    batida_padrao_kg: 1000,
    peso_saco_kg: 30,
    itens: [
      { insumo_id: 'ins-macro-milho-moido-granel', quantidade_kg: 306.00 },
      { insumo_id: 'ins-macro-farelo-milho-ddgs', quantidade_kg: 210.00 },
      { insumo_id: 'ins-macro-farelo-soja-46', quantidade_kg: 200.00 },
      { insumo_id: 'ins-macro-sal-comum', quantidade_kg: 150.00 },
      { insumo_id: 'ins-macro-ureia-pecuaria', quantidade_kg: 40.00 },
      { insumo_id: 'ins-macro-farelo-trigo', quantidade_kg: 40.00 },
      { insumo_id: 'ins-macro-fosfato-bicalcico', quantidade_kg: 20.00 },
      { insumo_id: 'ins-macro-calcario-calcitico', quantidade_kg: 20.00 },
      { insumo_id: 'ins-micro-px-mineral-corte-s-harpia', quantidade_kg: 10.00 },
      { insumo_id: 'ins-macro-oxido-magnesio', quantidade_kg: 4.00 }
    ],
    custos_extras: [
      {
        id: 'custo-ps-sac-1042',
        descricao: 'P.S/SAC (Produção + Saco)',
        valor: 100.00,
        tipo: 'fixo'
      }
    ],
    notas: 'Batida padrão de 1 Tonelada (1.000 kg). Saco de 30kg (33,3 sc/ton). Custo operacional P.S/SAC de R$ 100,00/ton.',
    created_at: hoje,
    updated_at: hoje
  },

  // ─── 25) HARPHOS AGUAS (1038) ─────────────────────────────────
  {
    id: 'formula-harphos-aguas-1038',
    codigo: '1038',
    produto_id: 'prod-harphos-05',
    produto_nome: 'HARPHOS AGUAS (1038)',
    batida_padrao_kg: 1000,
    peso_saco_kg: 30,
    itens: [
      { insumo_id: 'ins-macro-milho-moido-granel', quantidade_kg: 129.00 },
      { insumo_id: 'ins-macro-farelo-soja-46', quantidade_kg: 233.00 },
      { insumo_id: 'ins-macro-farelo-milho-ddgs', quantidade_kg: 200.00 },
      { insumo_id: 'ins-macro-sal-comum', quantidade_kg: 150.00 },
      { insumo_id: 'ins-macro-calcario-calcitico', quantidade_kg: 29.00 },
      { insumo_id: 'ins-macro-fosfato-bicalcico', quantidade_kg: 57.00 },
      { insumo_id: 'ins-macro-sorgo-moido', quantidade_kg: 100.00 },
      { insumo_id: 'ins-macro-farelo-arroz', quantidade_kg: 80.00 },
      { insumo_id: 'ins-micro-px-mineral-corte-s-harpia', quantidade_kg: 16.00 },
      { insumo_id: 'ins-micro-px-focus-32619-bovc-vit-mon', quantidade_kg: 6.00 }
    ],
    custos_extras: [
      {
        id: 'custo-ps-sac-1038',
        descricao: 'P.S/SAC (Produção + Saco)',
        valor: 100.00,
        tipo: 'fixo'
      }
    ],
    notas: 'Batida padrão de 1 Tonelada (1.000 kg). Saco de 30kg (33,3 sc/ton). Custo operacional P.S/SAC de R$ 100,00/ton.',
    created_at: hoje,
    updated_at: hoje
  },

  // ─── 26) HARPHOS Proteico 40 (1043) ───────────────────────────
  {
    id: 'formula-harphos-proteico-40-1043',
    codigo: '1043',
    produto_id: 'prod-harphos-03',
    produto_nome: 'HARPHOS Proteico 40 (1043)',
    batida_padrao_kg: 1000,
    peso_saco_kg: 30,
    itens: [
      { insumo_id: 'ins-macro-milho-moido-granel', quantidade_kg: 257.00 },
      { insumo_id: 'ins-macro-farelo-milho-ddgs', quantidade_kg: 210.00 },
      { insumo_id: 'ins-macro-farelo-soja-46', quantidade_kg: 209.00 },
      { insumo_id: 'ins-macro-sal-comum', quantidade_kg: 150.00 },
      { insumo_id: 'ins-micro-prote-n', quantidade_kg: 50.00 },
      { insumo_id: 'ins-macro-farelo-trigo', quantidade_kg: 40.00 },
      { insumo_id: 'ins-macro-ureia-pecuaria', quantidade_kg: 30.00 },
      { insumo_id: 'ins-macro-fosfato-bicalcico', quantidade_kg: 20.00 },
      { insumo_id: 'ins-macro-calcario-calcitico', quantidade_kg: 20.00 },
      { insumo_id: 'ins-micro-px-mineral-corte-s-harpia', quantidade_kg: 10.00 },
      { insumo_id: 'ins-macro-oxido-magnesio', quantidade_kg: 4.00 }
    ],
    custos_extras: [
      {
        id: 'custo-ps-sac-1043',
        descricao: 'P.S/SAC (Produção + Saco)',
        valor: 100.00,
        tipo: 'fixo'
      }
    ],
    notas: 'Batida padrão de 1 Tonelada (1.000 kg). Saco de 30kg (33,3 sc/ton). Custo operacional P.S/SAC de R$ 100,00/ton.',
    created_at: hoje,
    updated_at: hoje
  },

  // ─── 27) HARPHOS SECA (1044) ──────────────────────────────────
  {
    id: 'formula-harphos-seca-1044',
    codigo: '1044',
    produto_id: 'prod-harphos-04',
    produto_nome: 'HARPHOS SECA (1044)',
    batida_padrao_kg: 1000,
    peso_saco_kg: 30,
    itens: [
      { insumo_id: 'ins-macro-milho-moido-granel', quantidade_kg: 236.00 },
      { insumo_id: 'ins-macro-sal-comum', quantidade_kg: 249.30 },
      { insumo_id: 'ins-macro-ureia-pecuaria', quantidade_kg: 149.50 },
      { insumo_id: 'ins-macro-fosfato-bicalcico', quantidade_kg: 133.50 },
      { insumo_id: 'ins-macro-farelo-soja-46', quantidade_kg: 114.00 },
      { insumo_id: 'ins-macro-farelo-arroz', quantidade_kg: 61.00 },
      { insumo_id: 'ins-micro-px-mineral-corte-s-harpia', quantidade_kg: 30.00 },
      { insumo_id: 'ins-micro-px-focus-32619-bovc-vit-mon', quantidade_kg: 26.70 }
    ],
    custos_extras: [
      {
        id: 'custo-ps-sac-1044',
        descricao: 'P.S/SAC (Produção + Saco)',
        valor: 100.00,
        tipo: 'fixo'
      }
    ],
    notas: 'Batida padrão de 1 Tonelada (1.000 kg). Saco de 30kg (33,3 sc/ton). Custo operacional P.S/SAC de R$ 100,00/ton.',
    created_at: hoje,
    updated_at: hoje
  },

  // =========================================================================
  // LINHA HARBEEF (BOVINOS DE CORTE)
  // =========================================================================

  // ─── 28) HARBEEF ENGORDA OURO (2044) (40kg) ───────────────────
  {
    id: 'formula-harbeef-engorda-ouro-2044',
    codigo: '2044',
    produto_id: 'prod-harbeef-01',
    produto_nome: 'HARBEEF ENGORDA OURO (2044) (40kg)',
    batida_padrao_kg: 1000,
    peso_saco_kg: 40,
    itens: [
      { insumo_id: 'ins-macro-milho-moido-granel', quantidade_kg: 702.9 },
      { insumo_id: 'ins-macro-farelo-milho-ddgs', quantidade_kg: 100.0 },
      { insumo_id: 'ins-macro-farelo-soja-46', quantidade_kg: 80.0 },
      { insumo_id: 'ins-macro-polpa-citrica-moida', quantidade_kg: 50.0 },
      { insumo_id: 'ins-macro-calcario-calcitico', quantidade_kg: 25.0 },
      { insumo_id: 'ins-macro-sal-comum', quantidade_kg: 6.0 },
      { insumo_id: 'ins-pmh-pmh-bovinos-1', quantidade_kg: 11.1 },
      { insumo_id: 'ins-macro-ureia-pecuaria', quantidade_kg: 20.0 },
      { insumo_id: 'ins-macro-fosfato-bicalcico', quantidade_kg: 5.0 }
    ],
    custos_extras: [
      {
        id: 'custo-ps-sac-2044',
        descricao: 'P.S/SAC (Produção + Saco)',
        valor: 100.00,
        tipo: 'fixo'
      }
    ],
    notas: 'Batida padrão de 1 Tonelada (1.000 kg). Saco de 40kg (25 sc/ton). Custo operacional P.S/SAC de R$ 100,00/ton.',
    created_at: hoje,
    updated_at: hoje
  },

  // ─── 29) Harbeef CONFINAMENTO OURO (2043) ─────────────────────
  {
    id: 'formula-harbeef-confinamento-ouro-2043',
    codigo: '2043',
    produto_id: 'prod-harbeef-02',
    produto_nome: 'Harbeef CONFINAMENTO OURO (2043)',
    batida_padrao_kg: 1000,
    peso_saco_kg: 40,
    itens: [
      { insumo_id: 'ins-macro-milho-moido-granel', quantidade_kg: 646.9 },
      { insumo_id: 'ins-macro-farelo-milho-ddgs', quantidade_kg: 177.0 },
      { insumo_id: 'ins-macro-aveia', quantidade_kg: 60.0 },
      { insumo_id: 'ins-macro-calcario-calcitico', quantidade_kg: 20.0 },
      { insumo_id: 'ins-macro-ureia-pecuaria', quantidade_kg: 15.0 },
      { insumo_id: 'ins-macro-fosfato-bicalcico', quantidade_kg: 5.0 },
      { insumo_id: 'ins-macro-sal-comum', quantidade_kg: 5.0 },
      { insumo_id: 'ins-pmh-pmh-bovinos-1', quantidade_kg: 11.1 },
      { insumo_id: 'ins-macro-polpa-citrica-moida', quantidade_kg: 60.0 }
    ],
    custos_extras: [
      {
        id: 'custo-ps-sac-2043',
        descricao: 'P.S/SAC (Produção + Saco)',
        valor: 100.00,
        tipo: 'fixo'
      }
    ],
    notas: 'Batida padrão de 1 Tonelada (1.000 kg). Saco de 40kg (25 sc/ton). Custo operacional P.S/SAC de R$ 100,00/ton.',
    created_at: hoje,
    updated_at: hoje
  },

  // ─── 30) HARBEEF CONCENTRADO ENGORDA OURO (2114) ──────────────
  {
    id: 'formula-harbeef-concentrado-engorda-ouro-2114',
    codigo: '2114',
    produto_id: 'prod-harbeef-03',
    produto_nome: 'HARBEEF CONCENTRADO ENGORDA OURO (2114)',
    batida_padrao_kg: 1000,
    peso_saco_kg: 40,
    itens: [
      { insumo_id: 'ins-macro-farelo-milho-ddgs', quantidade_kg: 371.7 },
      { insumo_id: 'ins-macro-farelo-soja-46', quantidade_kg: 250.0 },
      { insumo_id: 'ins-macro-calcario-calcitico', quantidade_kg: 100.0 },
      { insumo_id: 'ins-macro-sal-comum', quantidade_kg: 20.0 },
      { insumo_id: 'ins-macro-ureia-pecuaria', quantidade_kg: 65.0 },
      { insumo_id: 'ins-macro-polpa-citrica-moida', quantidade_kg: 160.0 },
      { insumo_id: 'ins-pmh-pmh-bovinos-1', quantidade_kg: 33.3 }
    ],
    custos_extras: [
      {
        id: 'custo-ps-sac-2114',
        descricao: 'P.S/SAC (Produção + Saco)',
        valor: 100.00,
        tipo: 'fixo'
      }
    ],
    notas: 'Batida padrão de 1 Tonelada (1.000 kg). Saco de 40kg (25 sc/ton). Custo operacional P.S/SAC de R$ 100,00/ton.',
    created_at: hoje,
    updated_at: hoje
  },

  // ─── 31) HARBEEF ZERO FORRAGEM (1597) ─────────────────────────
  {
    id: 'formula-harbeef-zero-forragem-1597',
    codigo: '1597',
    produto_id: 'prod-harbeef-04',
    produto_nome: 'HARBEEF ZERO FORRAGEM (1597)',
    batida_padrao_kg: 1000,
    peso_saco_kg: 40,
    itens: [
      { insumo_id: 'ins-macro-milho-moido-granel', quantidade_kg: 572.4 },
      { insumo_id: 'ins-macro-aveia', quantidade_kg: 140.0 },
      { insumo_id: 'ins-macro-caroco-algodao', quantidade_kg: 120.0 },
      { insumo_id: 'ins-macro-farelo-milho-ddgs', quantidade_kg: 70.0 },
      { insumo_id: 'ins-macro-farelo-soja-46', quantidade_kg: 38.5 },
      { insumo_id: 'ins-macro-farelo-trigo', quantidade_kg: 20.0 },
      { insumo_id: 'ins-macro-calcario-calcitico', quantidade_kg: 15.0 },
      { insumo_id: 'ins-pmh-pmh-bovinos-1', quantidade_kg: 11.1 },
      { insumo_id: 'ins-macro-bicarbonato', quantidade_kg: 8.0 },
      { insumo_id: 'ins-macro-ureia-pecuaria', quantidade_kg: 5.0 }
    ],
    custos_extras: [
      {
        id: 'custo-ps-sac-1597',
        descricao: 'P.S/SAC (Produção + Saco)',
        valor: 200.00,
        tipo: 'fixo'
      }
    ],
    notas: 'Batida padrão de 1 Tonelada (1.000 kg). Saco de 40kg (25 sc/ton). Custo operacional P.S/SAC de R$ 200,00/ton (R$ 8,00/sc).',
    created_at: hoje,
    updated_at: hoje
  },

  // ─── 32) HARBEEF CONCENTRADO ZF (1672) ────────────────────────
  {
    id: 'formula-harbeef-concentrado-zf-1672',
    codigo: '1672',
    produto_id: 'prod-harbeef-05',
    produto_nome: 'HARBEEF CONCENTRADO ZF (1672)',
    batida_padrao_kg: 1000,
    peso_saco_kg: 40,
    itens: [
      { insumo_id: 'ins-macro-farelo-milho-ddgs', quantidade_kg: 446.8 },
      { insumo_id: 'ins-macro-aveia', quantidade_kg: 170.0 },
      { insumo_id: 'ins-macro-farelo-trigo', quantidade_kg: 120.0 },
      { insumo_id: 'ins-macro-caroco-algodao', quantidade_kg: 120.0 },
      { insumo_id: 'ins-macro-calcario-calcitico', quantidade_kg: 50.0 },
      { insumo_id: 'ins-macro-fosfato-bicalcico', quantidade_kg: 40.0 },
      { insumo_id: 'ins-macro-bicarbonato', quantidade_kg: 16.0 },
      { insumo_id: 'ins-macro-sal-comum', quantidade_kg: 15.0 },
      { insumo_id: 'ins-pmh-pmh-bovinos-1', quantidade_kg: 22.2 }
    ],
    custos_extras: [
      {
        id: 'custo-ps-sac-1672',
        descricao: 'P.S/SAC (Produção + Saco)',
        valor: 200.00,
        tipo: 'fixo'
      }
    ],
    notas: 'Batida padrão de 1 Tonelada (1.000 kg). Saco de 40kg (25 sc/ton). Custo operacional P.S/SAC de R$ 200,00/ton (R$ 8,00/sc).',
    created_at: hoje,
    updated_at: hoje
  },

  // ─── 33) Harbeef Multi Pasto (1570) ───────────────────────────
  {
    id: 'formula-harbeef-multi-pasto-1570',
    codigo: '1570',
    produto_id: 'prod-harbeef-06',
    produto_nome: 'Harbeef Multi Pasto (1570)',
    batida_padrao_kg: 1000,
    peso_saco_kg: 40,
    itens: [
      { insumo_id: 'ins-macro-farelo-milho-ddgs', quantidade_kg: 280.0 },
      { insumo_id: 'ins-macro-farelo-soja-46', quantidade_kg: 245.0 },
      { insumo_id: 'ins-macro-milho-moido-granel', quantidade_kg: 152.5 },
      { insumo_id: 'ins-macro-polpa-citrica-moida', quantidade_kg: 90.0 },
      { insumo_id: 'ins-macro-sal-comum', quantidade_kg: 75.0 },
      { insumo_id: 'ins-macro-fosfato-bicalcico', quantidade_kg: 35.0 },
      { insumo_id: 'ins-macro-calcario-calcitico', quantidade_kg: 70.0 },
      { insumo_id: 'ins-macro-ureia-pecuaria', quantidade_kg: 30.0 },
      { insumo_id: 'ins-macro-oxido-magnesio', quantidade_kg: 4.0 },
      { insumo_id: 'ins-pmh-pmh-bovinos-2-513', quantidade_kg: 18.5 }
    ],
    custos_extras: [
      {
        id: 'custo-ps-sac-1570',
        descricao: 'P.S/SAC (Produção + Saco)',
        valor: 100.00,
        tipo: 'fixo'
      }
    ],
    notas: 'Batida padrão de 1 Tonelada (1.000 kg). Saco de 40kg (25 sc/ton). Custo operacional P.S/SAC de R$ 100,00/ton.',
    created_at: hoje,
    updated_at: hoje
  },

  // ─── 34) HARBEEF MULTI PASTO AGUAS ────────────────────────────
  {
    id: 'formula-harbeef-multi-pasto-aguas',
    codigo: 'HARBEEF-MP-AGUAS',
    produto_id: 'prod-harbeef-08',
    produto_nome: 'HARBEEF MULTI PASTO AGUAS',
    batida_padrao_kg: 1000,
    peso_saco_kg: 40,
    itens: [
      { insumo_id: 'ins-macro-milho-moido-granel', quantidade_kg: 222.5 },
      { insumo_id: 'ins-macro-farelo-milho-ddgs', quantidade_kg: 280.0 },
      { insumo_id: 'ins-macro-farelo-soja-46', quantidade_kg: 205.0 },
      { insumo_id: 'ins-macro-calcario-calcitico', quantidade_kg: 50.0 },
      { insumo_id: 'ins-macro-polpa-citrica-moida', quantidade_kg: 80.0 },
      { insumo_id: 'ins-macro-fosfato-bicalcico', quantidade_kg: 60.0 },
      { insumo_id: 'ins-macro-sal-comum', quantidade_kg: 80.0 },
      { insumo_id: 'ins-macro-oxido-magnesio', quantidade_kg: 4.0 },
      { insumo_id: 'ins-pmh-pmh-bovinos-2', quantidade_kg: 18.5 }
    ],
    custos_extras: [
      {
        id: 'custo-ps-sac-mp-aguas',
        descricao: 'P.S/SAC (Produção + Saco)',
        valor: 100.00,
        tipo: 'fixo'
      }
    ],
    notas: 'Batida padrão de 1 Tonelada (1.000 kg). Saco de 40kg (25 sc/ton). Custo operacional P.S/SAC de R$ 100,00/ton.',
    created_at: hoje,
    updated_at: hoje
  },

  // ─── 35) HARBEEF MULTI PASTO AGUAS (SUGESTÃO 15/09) ───────────
  {
    id: 'formula-harbeef-multi-pasto-aguas-sugestao',
    codigo: 'HARBEEF-MP-AGUAS-SUG',
    produto_id: 'prod-harbeef-08',
    produto_nome: 'HARBEEF MULTI PASTO AGUAS (SUGESTÃO 15/09)',
    batida_padrao_kg: 1000,
    peso_saco_kg: 40,
    itens: [
      { insumo_id: 'ins-macro-calcario-calcitico', quantidade_kg: 72.5 },
      { insumo_id: 'ins-macro-sal-comum', quantidade_kg: 80.0 },
      { insumo_id: 'ins-macro-farelo-milho-ddgs', quantidade_kg: 280.0 },
      { insumo_id: 'ins-macro-farelo-soja-46', quantidade_kg: 200.0 },
      { insumo_id: 'ins-macro-fosfato-bicalcico', quantidade_kg: 35.0 },
      { insumo_id: 'ins-macro-milho-moido-granel', quantidade_kg: 230.0 },
      { insumo_id: 'ins-macro-polpa-citrica-moipel', quantidade_kg: 80.0 },
      { insumo_id: 'ins-macro-oxido-magnesio', quantidade_kg: 4.0 },
      { insumo_id: 'ins-pmh-pmh-bovinos-2', quantidade_kg: 18.5 }
    ],
    custos_extras: [
      {
        id: 'custo-ps-sac-mp-aguas-sug',
        descricao: 'P.S/SAC (Produção + Saco)',
        valor: 100.00,
        tipo: 'fixo'
      }
    ],
    notas: 'Batida padrão de 1 Tonelada (1.000 kg). Saco de 40kg (25 sc/ton). Sugestão de fórmula formulada em 15/09.',
    created_at: hoje,
    updated_at: hoje
  },

  // ─── 36) Harbeef Multi Pasto Secas (1879) ─────────────────────
  {
    id: 'formula-harbeef-multi-pasto-secas-1879',
    codigo: '1879',
    produto_id: 'prod-harbeef-09',
    produto_nome: 'Harbeef Multi Pasto Secas (1879)',
    batida_padrao_kg: 1000,
    peso_saco_kg: 40,
    itens: [
      { insumo_id: 'ins-macro-farelo-soja-46', quantidade_kg: 265.0 },
      { insumo_id: 'ins-macro-farelo-milho-ddgs', quantidade_kg: 287.5 },
      { insumo_id: 'ins-macro-milho-moido-granel', quantidade_kg: 60.0 },
      { insumo_id: 'ins-macro-farelo-trigo', quantidade_kg: 120.0 },
      { insumo_id: 'ins-macro-polpa-citrica-moida', quantidade_kg: 60.0 },
      { insumo_id: 'ins-macro-sal-comum', quantidade_kg: 75.0 },
      { insumo_id: 'ins-macro-ureia-pecuaria', quantidade_kg: 40.0 },
      { insumo_id: 'ins-macro-calcario-calcitico', quantidade_kg: 50.0 },
      { insumo_id: 'ins-macro-fosfato-bicalcico', quantidade_kg: 20.0 },
      { insumo_id: 'ins-macro-oxido-magnesio', quantidade_kg: 4.0 },
      { insumo_id: 'ins-pmh-pmh-bovinos-2-513', quantidade_kg: 18.5 }
    ],
    custos_extras: [
      {
        id: 'custo-ps-sac-1879',
        descricao: 'P.S/SAC (Produção + Saco)',
        valor: 100.00,
        tipo: 'fixo'
      }
    ],
    notas: 'Batida padrão de 1 Tonelada (1.000 kg). Saco de 40kg (25 sc/ton). Custo operacional P.S/SAC de R$ 100,00/ton.',
    created_at: hoje,
    updated_at: hoje
  },

  // ─── 37) Harbeef Multi Pasto TIP (1874) ───────────────────────
  {
    id: 'formula-harbeef-multi-pasto-tip-1874',
    codigo: '1874',
    produto_id: 'prod-harbeef-10',
    produto_nome: 'Harbeef Multi Pasto TIP (1874)',
    batida_padrao_kg: 1000,
    peso_saco_kg: 40,
    itens: [
      { insumo_id: 'ins-macro-milho-moido-granel', quantidade_kg: 633.9 },
      { insumo_id: 'ins-macro-aveia', quantidade_kg: 108.0 },
      { insumo_id: 'ins-macro-caroco-algodao', quantidade_kg: 90.0 },
      { insumo_id: 'ins-macro-farelo-soja-46', quantidade_kg: 50.0 },
      { insumo_id: 'ins-macro-farelo-trigo', quantidade_kg: 30.0 },
      { insumo_id: 'ins-macro-calcario-calcitico', quantidade_kg: 30.0 },
      { insumo_id: 'ins-macro-farelo-milho-ddgs', quantidade_kg: 30.0 },
      { insumo_id: 'ins-macro-ureia-pecuaria', quantidade_kg: 12.0 },
      { insumo_id: 'ins-macro-sal-comum', quantidade_kg: 5.0 },
      { insumo_id: 'ins-pmh-pmh-bovinos-1', quantidade_kg: 11.1 }
    ],
    custos_extras: [
      {
        id: 'custo-ps-sac-1874',
        descricao: 'P.S/SAC (Produção + Saco)',
        valor: 100.00,
        tipo: 'fixo'
      }
    ],
    notas: 'Batida padrão de 1 Tonelada (1.000 kg). Saco de 40kg (25 sc/ton). Custo operacional P.S/SAC de R$ 100,00/ton.',
    created_at: hoje,
    updated_at: hoje
  },

  // ─── 38) Harbeef Engorda CCL (1776) ───────────────────────────
  {
    id: 'formula-harbeef-engorda-ccl-1776',
    codigo: '1776',
    produto_id: 'prod-harbeef-11',
    produto_nome: 'Harbeef Engorda CCL (1776)',
    batida_padrao_kg: 1000,
    peso_saco_kg: 40,
    itens: [
      { insumo_id: 'ins-macro-milho-moido-granel', quantidade_kg: 308.7 },
      { insumo_id: 'ins-macro-farelo-milho-ddgs', quantidade_kg: 295.0 },
      { insumo_id: 'ins-macro-aveia', quantidade_kg: 140.0 },
      { insumo_id: 'ins-macro-caroco-algodao', quantidade_kg: 120.0 },
      { insumo_id: 'ins-macro-farelo-trigo', quantidade_kg: 80.0 },
      { insumo_id: 'ins-macro-calcario-calcitico', quantidade_kg: 20.0 },
      { insumo_id: 'ins-macro-bicarbonato', quantidade_kg: 10.0 },
      { insumo_id: 'ins-macro-sal-comum', quantidade_kg: 8.0 },
      { insumo_id: 'ins-macro-fosfato-bicalcico', quantidade_kg: 7.0 },
      { insumo_id: 'ins-macro-oxido-magnesio', quantidade_kg: 5.0 },
      { insumo_id: 'ins-micro-px-mineral-corte-s-harpia', quantidade_kg: 1.7 },
      { insumo_id: 'ins-micro-px-focus-32619-bovc-vit-mon', quantidade_kg: 2.1 },
      { insumo_id: 'ins-aditivo-ad-consulado-leite-standard', quantidade_kg: 1.7 },
      { insumo_id: 'ins-aditivo-dbr-sacch-probiotico', quantidade_kg: 0.8 }
    ],
    custos_extras: [
      {
        id: 'custo-ps-sac-1776',
        descricao: 'P.S/SAC (Produção + Saco)',
        valor: 100.00,
        tipo: 'fixo'
      }
    ],
    notas: 'Batida padrão de 1 Tonelada (1.000 kg). Saco de 40kg (25 sc/ton). Custo operacional P.S/SAC de R$ 100,00/ton.',
    created_at: hoje,
    updated_at: hoje
  },

  // ─── 39) HARBEEF ENGORDA BRONZE (ATUAL) ───────────────────────
  {
    id: 'formula-harbeef-engorda-bronze-atual',
    codigo: 'HARBEEF-BRONZE-ATUAL',
    produto_id: 'prod-harbeef-12',
    produto_nome: 'HARBEEF ENGORDA BRONZE (ATUAL)',
    batida_padrao_kg: 1000,
    peso_saco_kg: 40,
    itens: [
      { insumo_id: 'ins-macro-milho-moido-granel', quantidade_kg: 100.0 },
      { insumo_id: 'ins-macro-farelo-trigo', quantidade_kg: 80.0 },
      { insumo_id: 'ins-macro-aveia', quantidade_kg: 50.0 },
      { insumo_id: 'ins-macro-polpa-citrica-moipel', quantidade_kg: 70.0 },
      { insumo_id: 'ins-macro-farelo-amendoim-162', quantidade_kg: 180.0 },
      { insumo_id: 'ins-macro-ureia-pecuaria', quantidade_kg: 10.0 },
      { insumo_id: 'ins-macro-calcario-calcitico', quantidade_kg: 50.0 },
      { insumo_id: 'ins-macro-sal-comum', quantidade_kg: 6.0 },
      { insumo_id: 'ins-macro-sorgo-114', quantidade_kg: 450.0 },
      { insumo_id: 'ins-micro-px-mineral-corte-s-harpia', quantidade_kg: 4.0 }
    ],
    custos_extras: [
      {
        id: 'custo-ps-sac-bronze-atual',
        descricao: 'P.S/SAC (Produção + Saco)',
        valor: 100.00,
        tipo: 'fixo'
      }
    ],
    notas: 'Batida padrão de 1 Tonelada (1.000 kg). Saco de 40kg (25 sc/ton). Versão atual de Engorda Bronze.',
    created_at: hoje,
    updated_at: hoje
  },

  // ─── 40) HARBEEF ENGORDA BRONZE (NOVA VERSÃO) ──────────────────
  {
    id: 'formula-harbeef-engorda-bronze-nova',
    codigo: 'HARBEEF-BRONZE-NOVA',
    produto_id: 'prod-harbeef-13',
    produto_nome: 'HARBEEF ENGORDA BRONZE (NOVA VERSÃO)',
    batida_padrao_kg: 1000,
    peso_saco_kg: 40,
    itens: [
      { insumo_id: 'ins-macro-milho-moido-granel', quantidade_kg: 100.0 },
      { insumo_id: 'ins-macro-farelo-trigo', quantidade_kg: 40.0 },
      { insumo_id: 'ins-macro-aveia', quantidade_kg: 50.0 },
      { insumo_id: 'ins-macro-polpa-citrica-moipel', quantidade_kg: 80.0 },
      { insumo_id: 'ins-macro-farelo-amendoim-162', quantidade_kg: 190.0 },
      { insumo_id: 'ins-macro-ureia-pecuaria', quantidade_kg: 10.0 },
      { insumo_id: 'ins-macro-calcario-calcitico', quantidade_kg: 50.0 },
      { insumo_id: 'ins-macro-sal-comum', quantidade_kg: 6.0 },
      { insumo_id: 'ins-macro-sorgo-114', quantidade_kg: 470.0 },
      { insumo_id: 'ins-micro-px-mineral-corte-s-harpia', quantidade_kg: 4.0 }
    ],
    custos_extras: [
      {
        id: 'custo-ps-sac-bronze-nova',
        descricao: 'P.S/SAC (Produção + Saco)',
        valor: 100.00,
        tipo: 'fixo'
      }
    ],
    notas: 'Batida padrão de 1 Tonelada (1.000 kg). Saco de 40kg (25 sc/ton). Nova formulação Bronze com 190kg de amendoim e 470kg de sorgo.',
    created_at: hoje,
    updated_at: hoje
  },

  // =========================================================================
  // LINHA HARSHEEP (OVINOS)
  // =========================================================================

  // ─── 41) HARSHEEP MANUTENÇÃO - 40 KG (1201) ───────────────────
  {
    id: 'formula-harsheep-manutencao-1201',
    codigo: '1201',
    produto_id: 'prod-harsheep-01',
    produto_nome: 'HARSHEEP MANUTENÇÃO - 40 KG (1201)',
    batida_padrao_kg: 1000,
    peso_saco_kg: 40,
    itens: [
      { insumo_id: 'ins-macro-milho-moido-granel', quantidade_kg: 470.50 },
      { insumo_id: 'ins-macro-farelo-trigo', quantidade_kg: 120.00 },
      { insumo_id: 'ins-macro-farelo-soja-46', quantidade_kg: 330.00 },
      { insumo_id: 'ins-micro-nc-agro-ovinos', quantidade_kg: 40.00 },
      { insumo_id: 'ins-macro-calcario-calcitico', quantidade_kg: 30.00 },
      { insumo_id: 'ins-macro-sal-comum', quantidade_kg: 5.00 },
      { insumo_id: 'ins-aditivo-dbr-sacch-probiotico', quantidade_kg: 3.50 },
      { insumo_id: 'ins-aditivo-ad-consulado-leite-standard', quantidade_kg: 1.00 }
    ],
    custos_extras: [
      {
        id: 'custo-ps-sac-harsheep-manut-1201',
        descricao: 'P.S/SAC (Produção + Saco)',
        valor: 100.00,
        tipo: 'fixo'
      }
    ],
    notas: 'Batida padrão de 1 Tonelada (1.000 kg). Saco de 40kg (25 sc/ton). Custo operacional P.S/SAC de R$ 100,00/ton.',
    created_at: hoje,
    updated_at: hoje
  },

  // ─── 42) HARSHEEP CREEP - 40 KG (1069) ────────────────────────
  {
    id: 'formula-harsheep-creep-1069',
    codigo: '1069',
    produto_id: 'prod-harsheep-02',
    produto_nome: 'HARSHEEP CREEP - 40 KG (1069)',
    batida_padrao_kg: 1000,
    peso_saco_kg: 40,
    itens: [
      { insumo_id: 'ins-macro-milho-moido-granel', quantidade_kg: 514.00 },
      { insumo_id: 'ins-macro-farelo-soja-46', quantidade_kg: 360.00 },
      { insumo_id: 'ins-macro-aveia', quantidade_kg: 80.00 },
      { insumo_id: 'ins-micro-nc-agro-ovinos', quantidade_kg: 25.00 },
      { insumo_id: 'ins-macro-calcario-calcitico', quantidade_kg: 10.00 },
      { insumo_id: 'ins-aditivo-dbr-sacch-probiotico', quantidade_kg: 10.00 },
      { insumo_id: 'ins-micro-flavofix-sp-mp', quantidade_kg: 1.00 }
    ],
    custos_extras: [
      {
        id: 'custo-ps-sac-harsheep-creep-1069',
        descricao: 'P.S/SAC (Produção + Saco)',
        valor: 100.00,
        tipo: 'fixo'
      }
    ],
    notas: 'Batida padrão de 1 Tonelada (1.000 kg). Saco de 40kg (25 sc/ton). Custo operacional P.S/SAC de R$ 100,00/ton.',
    created_at: hoje,
    updated_at: hoje
  },

  // ─── 43) HARSHEEP CONFINAMENTO - 40 KG (1069) ─────────────────
  {
    id: 'formula-harsheep-confinamento-1069',
    codigo: '1069-CONF',
    produto_id: 'prod-harsheep-03',
    produto_nome: 'HARSHEEP CONFINAMENTO - 40 KG (1069)',
    batida_padrao_kg: 1000,
    peso_saco_kg: 40,
    itens: [
      { insumo_id: 'ins-macro-milho-moido-granel', quantidade_kg: 580.50 },
      { insumo_id: 'ins-macro-farelo-soja-46', quantidade_kg: 200.00 },
      { insumo_id: 'ins-macro-farelo-milho-ddgs', quantidade_kg: 160.00 },
      { insumo_id: 'ins-micro-nc-agro-ovinos', quantidade_kg: 40.00 },
      { insumo_id: 'ins-macro-calcario-calcitico', quantidade_kg: 10.00 },
      { insumo_id: 'ins-macro-sal-comum', quantidade_kg: 5.00 },
      { insumo_id: 'ins-aditivo-dbr-sacch-probiotico', quantidade_kg: 3.50 },
      { insumo_id: 'ins-aditivo-ad-consulado-leite-standard', quantidade_kg: 1.00 }
    ],
    custos_extras: [
      {
        id: 'custo-ps-sac-harsheep-conf-1069',
        descricao: 'P.S/SAC (Produção + Saco)',
        valor: 100.00,
        tipo: 'fixo'
      }
    ],
    notas: 'Batida padrão de 1 Tonelada (1.000 kg). Saco de 40kg (25 sc/ton). Custo operacional P.S/SAC de R$ 100,00/ton.',
    created_at: hoje,
    updated_at: hoje
  },

  // =========================================================================
  // LINHA H HORSE (EQUINOS)
  // =========================================================================

  // ─── 44) H HORSE EQUILÍBRIO (1004) ────────────────────────────
  {
    id: 'formula-h-horse-equilibrio-1004',
    codigo: '1004',
    produto_id: 'prod-horse-01',
    produto_nome: 'H HORSE EQUILÍBRIO (1004)',
    batida_padrao_kg: 1000,
    peso_saco_kg: 40,
    itens: [
      { insumo_id: 'ins-macro-milho-moido-granel', quantidade_kg: 500.0 },
      { insumo_id: 'ins-macro-farelo-trigo', quantidade_kg: 240.0 },
      { insumo_id: 'ins-macro-farelo-soja-46', quantidade_kg: 200.0 },
      { insumo_id: 'ins-macro-calcario-calcitico', quantidade_kg: 26.0 },
      { insumo_id: 'ins-pmh-pmh-h-horse', quantidade_kg: 34.0 }
    ],
    custos_extras: [
      {
        id: 'custo-ps-sac-horse-equil-1004',
        descricao: 'P.S/SAC (Produção + Saco)',
        valor: 100.00,
        tipo: 'fixo'
      }
    ],
    notas: 'Batida padrão de 1 Tonelada (1.000 kg). Saco de 40kg (25 sc/ton). Custo operacional P.S/SAC de R$ 100,00/ton.',
    created_at: hoje,
    updated_at: hoje
  },

  // ─── 45) H HORSE EQUILÍBRIO 12 (1615) ─────────────────────────
  {
    id: 'formula-h-horse-equilibrio-12-1615',
    codigo: '1615',
    produto_id: 'prod-horse-02',
    produto_nome: 'H HORSE EQUILÍBRIO 12 (1615)',
    batida_padrao_kg: 1000,
    peso_saco_kg: 40,
    itens: [
      { insumo_id: 'ins-macro-milho-moido-granel', quantidade_kg: 454.0 },
      { insumo_id: 'ins-macro-aveia', quantidade_kg: 100.0 },
      { insumo_id: 'ins-macro-farelo-arroz', quantidade_kg: 100.0 },
      { insumo_id: 'ins-macro-farelo-soja-46', quantidade_kg: 68.0 },
      { insumo_id: 'ins-macro-farelo-trigo', quantidade_kg: 200.0 },
      { insumo_id: 'ins-macro-calcario-calcitico', quantidade_kg: 50.0 },
      { insumo_id: 'ins-macro-fosfato-bicalcico', quantidade_kg: 18.0 },
      { insumo_id: 'ins-macro-sal-comum', quantidade_kg: 5.0 },
      { insumo_id: 'ins-micro-nc-agrohorse-ind-tech-05', quantidade_kg: 5.0 }
    ],
    custos_extras: [
      {
        id: 'custo-ps-sac-horse-equil12-1615',
        descricao: 'P.S/SAC (Produção + Saco)',
        valor: 100.00,
        tipo: 'fixo'
      }
    ],
    notas: 'Batida padrão de 1 Tonelada (1.000 kg). Saco de 40kg (25 sc/ton). Custo operacional P.S/SAC de R$ 100,00/ton.',
    created_at: hoje,
    updated_at: hoje
  },

  // ─── 46) H HORSE PREMIUM (1007) ───────────────────────────────
  {
    id: 'formula-h-horse-premium-1007',
    codigo: '1007',
    produto_id: 'prod-horse-03',
    produto_nome: 'H HORSE PREMIUM (1007)',
    batida_padrao_kg: 1000,
    peso_saco_kg: 40,
    itens: [
      { insumo_id: 'ins-macro-milho-moido-granel', quantidade_kg: 527.0 },
      { insumo_id: 'ins-macro-farelo-trigo', quantidade_kg: 200.0 },
      { insumo_id: 'ins-macro-farelo-soja-46', quantidade_kg: 230.0 },
      { insumo_id: 'ins-macro-calcario-calcitico', quantidade_kg: 9.0 },
      { insumo_id: 'ins-pmh-pmh-h-horse', quantidade_kg: 34.0 }
    ],
    custos_extras: [
      {
        id: 'custo-ps-sac-horse-prem-1007',
        descricao: 'P.S/SAC (Produção + Saco)',
        valor: 100.00,
        tipo: 'fixo'
      }
    ],
    notas: 'Batida padrão de 1 Tonelada (1.000 kg). Saco de 40kg (25 sc/ton). Custo operacional P.S/SAC de R$ 100,00/ton.',
    created_at: hoje,
    updated_at: hoje
  },

  // ─── 47) Harpia Concentrado Mix - 40KG (1013) ─────────────────
  {
    id: 'formula-harpia-concentrado-mix-1013',
    codigo: '1013',
    produto_id: 'prod-horse-04',
    produto_nome: 'Harpia Concentrado Mix - 40KG (1013)',
    batida_padrao_kg: 1000,
    peso_saco_kg: 40,
    itens: [
      { insumo_id: 'ins-macro-milho-moido-granel', quantidade_kg: 630.00 },
      { insumo_id: 'ins-macro-farelo-soja-46', quantidade_kg: 200.00 },
      { insumo_id: 'ins-macro-farelo-trigo', quantidade_kg: 160.00 },
      { insumo_id: 'ins-macro-calcario-calcitico', quantidade_kg: 10.00 }
    ],
    custos_extras: [
      {
        id: 'custo-ps-sac-harpia-mix-1013',
        descricao: 'P.S/SAC (Produção + Saco)',
        valor: 100.00,
        tipo: 'fixo'
      }
    ],
    notas: 'Batida padrão de 1 Tonelada (1.000 kg). Saco de 40kg (25 sc/ton). Custo operacional P.S/SAC de R$ 100,00/ton.',
    created_at: hoje,
    updated_at: hoje
  },

  // ─── 48) H HORSE MULTI CAMPO (2109) ───────────────────────────
  {
    id: 'formula-h-horse-multi-campo-2109',
    codigo: '2109',
    produto_id: 'prod-horse-05',
    produto_nome: 'H HORSE MULTI CAMPO (2109)',
    batida_padrao_kg: 1000,
    peso_saco_kg: 30,
    itens: [
      { insumo_id: 'ins-macro-milho-moido-granel', quantidade_kg: 120.00 },
      { insumo_id: 'ins-macro-farelo-trigo', quantidade_kg: 80.00 },
      { insumo_id: 'ins-macro-farelo-milho-ddgs', quantidade_kg: 100.00 },
      { insumo_id: 'ins-macro-farelo-soja-46', quantidade_kg: 265.00 },
      { insumo_id: 'ins-macro-calcario-calcitico', quantidade_kg: 100.00 },
      { insumo_id: 'ins-macro-fosfato-bicalcico', quantidade_kg: 155.00 },
      { insumo_id: 'ins-macro-sal-comum', quantidade_kg: 150.00 },
      { insumo_id: 'ins-micro-nc-agrohorse-ind-tech-05', quantidade_kg: 30.00 }
    ],
    custos_extras: [
      {
        id: 'custo-ps-sac-horse-multicampo-2109',
        descricao: 'P.S/SAC (Produção + Saco)',
        valor: 100.00,
        tipo: 'fixo'
      }
    ],
    notas: 'Batida padrão de 1 Tonelada (1.000 kg). Saco de 30kg (33,3 sc/ton). Custo operacional P.S/SAC de R$ 100,00/ton.',
    created_at: hoje,
    updated_at: hoje
  }
];
