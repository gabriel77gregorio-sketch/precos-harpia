import type { UnidadeTipo, Produto, VendedorKey } from '../types/database';

/**
 * Formata um valor numérico para Real brasileiro (R$ 0,00)
 */
export function formatCurrency(value: number | null | undefined): string {
  if (value === null || value === undefined || isNaN(value)) {
    return 'R$ 0,00';
  }
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
}

/**
 * Formata porcentagem (ex: 5.5 -> "5,5%")
 */
export function formatPercent(value: number | null | undefined): string {
  if (value === null || value === undefined || isNaN(value)) {
    return '0%';
  }
  return `${value.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 2 })}%`;
}

/**
 * Retorna o rótulo legível e visual para o tipo de unidade
 */
export function getUnidadeLabel(tipo: UnidadeTipo, peso?: number | null): string {
  switch (tipo) {
    case 'bag':
      return peso ? `Big Bag (${peso >= 1000 ? (peso / 1000) + 't' : peso + 'kg'})` : 'Big Bag';
    case 'saco':
      return peso ? `Saco ${peso}kg` : 'Saco';
    case 'ton':
      return 'Tonelada (1.000kg)';
    case 'kg':
      return 'Quilo (kg)';
    default:
      return tipo;
  }
}

/**
 * Retorna o preço do produto para o vendedor atual.
 * Se houver tabela específica em precos_vendedores, usa-a;
 * caso contrário, calcula o desconto da tabela do vendedor sobre o preco_base.
 */
export function getPrecoVendedor(produto: Produto, vendedorKey?: VendedorKey): number {
  if (!vendedorKey || vendedorKey === 'balcao') {
    return produto.precos_vendedores?.balcao ?? produto.preco_base;
  }

  if (produto.precos_vendedores && produto.precos_vendedores[vendedorKey] !== undefined) {
    return produto.precos_vendedores[vendedorKey];
  }

  // Descontos padrão caso o produto não tenha a chave exata
  const descontos: Record<VendedorKey, number> = {
    balcao: 0,
    loja: 0.12,
    luciano: 0.08,
    wendel: 0.06,
    harpia: 0.04
  };

  const desconto = descontos[vendedorKey] || 0;
  return Number((produto.preco_base * (1 - desconto)).toFixed(2));
}

export interface FamiliaColorConfig {
  nome: string;
  bgBadge: string;
  textBadge: string;
  borderBadge: string;
  accentBar: string;
  dotColor: string;
  lightBg: string;
}

/**
 * Configuração visual de cores por família de produtos
 */
export function getFamiliaColorConfig(familia?: string | null): FamiliaColorConfig {
  const normalized = (familia || '').trim().toLowerCase();

  if (normalized.includes('harmilk') || normalized.includes('leite')) {
    return {
      nome: 'Harmilk',
      bgBadge: 'bg-blue-50',
      textBadge: 'text-blue-700',
      borderBadge: 'border-blue-200',
      accentBar: 'bg-blue-500',
      dotColor: 'bg-blue-500',
      lightBg: 'bg-blue-50/50'
    };
  }

  if (normalized.includes('harbeef') || normalized.includes('corte - rações')) {
    return {
      nome: 'Harbeef',
      bgBadge: 'bg-rose-50',
      textBadge: 'text-rose-700',
      borderBadge: 'border-rose-200',
      accentBar: 'bg-rose-500',
      dotColor: 'bg-rose-500',
      lightBg: 'bg-rose-50/50'
    };
  }

  if (normalized.includes('harphos') || normalized.includes('mineral') || normalized.includes('minerais')) {
    return {
      nome: 'Harphos',
      bgBadge: 'bg-teal-50',
      textBadge: 'text-teal-700',
      borderBadge: 'border-teal-200',
      accentBar: 'bg-teal-500',
      dotColor: 'bg-teal-500',
      lightBg: 'bg-teal-50/50'
    };
  }

  if (normalized.includes('harpig') || normalized.includes('suíno') || normalized.includes('suino')) {
    return {
      nome: 'Harpig',
      bgBadge: 'bg-fuchsia-50',
      textBadge: 'text-fuchsia-700',
      borderBadge: 'border-fuchsia-200',
      accentBar: 'bg-fuchsia-500',
      dotColor: 'bg-fuchsia-500',
      lightBg: 'bg-fuchsia-50/50'
    };
  }

  if (normalized.includes('aves') || normalized.includes('frango') || normalized.includes('galinha')) {
    return {
      nome: 'Aves',
      bgBadge: 'bg-amber-50',
      textBadge: 'text-amber-800',
      borderBadge: 'border-amber-200',
      accentBar: 'bg-amber-500',
      dotColor: 'bg-amber-500',
      lightBg: 'bg-amber-50/50'
    };
  }

  if (normalized.includes('horse') || normalized.includes('equino')) {
    return {
      nome: 'H Horse',
      bgBadge: 'bg-purple-50',
      textBadge: 'text-purple-700',
      borderBadge: 'border-purple-200',
      accentBar: 'bg-purple-500',
      dotColor: 'bg-purple-500',
      lightBg: 'bg-purple-50/50'
    };
  }

  if (normalized.includes('sheep') || normalized.includes('ovino') || normalized.includes('harsheep')) {
    return {
      nome: 'Harsheep',
      bgBadge: 'bg-emerald-50',
      textBadge: 'text-emerald-700',
      borderBadge: 'border-emerald-200',
      accentBar: 'bg-emerald-500',
      dotColor: 'bg-emerald-500',
      lightBg: 'bg-emerald-50/50'
    };
  }

  if (normalized.includes('insumo') || normalized.includes('matéria') || normalized.includes('materia')) {
    return {
      nome: 'Insumos',
      bgBadge: 'bg-orange-50',
      textBadge: 'text-orange-800',
      borderBadge: 'border-orange-200',
      accentBar: 'bg-orange-500',
      dotColor: 'bg-orange-500',
      lightBg: 'bg-orange-50/50'
    };
  }

  // Padrão
  return {
    nome: 'Geral',
    bgBadge: 'bg-slate-100',
    textBadge: 'text-slate-700',
    borderBadge: 'border-slate-200',
    accentBar: 'bg-[#006837]',
    dotColor: 'bg-[#006837]',
    lightBg: 'bg-slate-50'
  };
}

/**
 * Calcula o valor da comissão em reais
 */
export function calculateCommission(precoBase: number, porcentagem: number): number {
  if (!precoBase || !porcentagem) return 0;
  return (precoBase * porcentagem) / 100;
}

/**
 * Gera mensagem formatada para WhatsApp e abre o compartilhamento
 */
export function shareOnWhatsApp(
  produtoNome: string,
  unidadeTexto: string,
  preco: number,
  vendedorNome?: string,
  indicacoes?: string | null,
  consumoRecomendado?: string | null
) {
  let mensagem =
    `*Harpia Nutrição Animal* 🌱\n\n` +
    `Produto: *${produtoNome}*\n` +
    `Padrão / Embalagem: *${unidadeTexto}*\n` +
    `Preço Unitário: *${formatCurrency(preco)}*\n`;

  if (indicacoes) {
    mensagem += `Indicação: _${indicacoes}_\n`;
  }
  if (consumoRecomendado) {
    mensagem += `Consumo Recomendado: _${consumoRecomendado}_\n`;
  }

  mensagem += `\n` +
    (vendedorNome ? `Consultor Harpia: *${vendedorNome}*\n` : '') +
    `_Consulte condições especiais de frete e prazos para o seu lote._`;

  window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(mensagem)}`, '_blank');
}

/**
 * Verifica se o produto possui uma marca comercial da Harpia
 * (Harmilk, Harbeef, Harphos, Harpig, Harpia Aves, H Horse, Harsheep, etc.).
 * Itens como trigo, aveia, polpa, farelos, quirera, sorgo, ureia não têm nome comercial.
 */
export function hasNomeComercial(nome?: string | null): boolean {
  if (!nome) return false;
  const n = nome.trim().toLowerCase();
  return (
    n.startsWith('harmilk') ||
    n.startsWith('harbeef') ||
    n.startsWith('harphos') ||
    n.startsWith('harpig') ||
    n.startsWith('harpia aves') ||
    n.startsWith('harpia concentrado') ||
    n.startsWith('h horse') ||
    n.startsWith('harsheep')
  );
}

/**
 * Determina se um item deve ser classificado como Insumo.
 * Qualquer item que não possua nome comercial (ex: trigo, aveia, polpa, farelos, etc.)
 * é automaticamente considerado e reclassificado como Insumo.
 */
export function isItemInsumo(produto: Produto): boolean {
  if (produto.secao === 'insumos' || produto.familia === 'Insumos') return true;
  return !hasNomeComercial(produto.nome);
}




/**
 * Retorna a família padronizada do produto de forma resiliente.
 * Se já estiver definida, usa-a; caso contrário, deduz pelo nome do produto ou categoria.
 */
export function getProdutoFamilia(produto: Produto): string {
  if (produto.familia && produto.familia !== 'Outros') {
    return produto.familia;
  }

  const nome = (produto.nome || '').trim().toLowerCase();
  const catNome = (produto.categoria?.nome || '').trim().toLowerCase();

  if (nome.includes('harmilk') || catNome.includes('harmilk') || catNome.includes('leite')) {
    return 'Harmilk';
  }
  if (nome.includes('harbeef') || catNome.includes('harbeef') || catNome.includes('corte')) {
    return 'Harbeef';
  }
  if (nome.includes('harphos') || catNome.includes('harphos') || catNome.includes('mineral') || catNome.includes('minerais')) {
    return 'Harphos';
  }
  if (nome.includes('harpig') || catNome.includes('harpig') || catNome.includes('suíno') || catNome.includes('suino')) {
    return 'Harpig';
  }
  if (
    nome.includes('harpia aves') ||
    nome.includes('aves') ||
    catNome.includes('aves') ||
    nome.includes('frango') ||
    nome.includes('postura') ||
    nome.includes('poedeira')
  ) {
    return 'Aves';
  }
  if (
    nome.includes('h horse') ||
    nome.includes('horse') ||
    nome.includes('concentrado mix') ||
    catNome.includes('horse') ||
    catNome.includes('equino')
  ) {
    return 'H Horse';
  }
  if (nome.includes('harsheep') || nome.includes('sheep') || catNome.includes('sheep') || catNome.includes('ovino')) {
    return 'Harsheep';
  }

  if (isItemInsumo(produto)) {
    return 'Insumos';
  }

  return 'Outros';
}

/**
 * Verifica se um produto pertence a uma determinada família selecionada.
 */
export function matchProdutoFamilia(produto: Produto, familyId?: string | null): boolean {
  if (!familyId || familyId === 'todas') return true;

  const fFiltro = familyId.toLowerCase().trim();
  const fam = getProdutoFamilia(produto).toLowerCase();

  if (fam === fFiltro) return true;
  if (fam.includes(fFiltro) || fFiltro.includes(fam)) return true;

  // Verificação direta no nome do produto
  const nome = (produto.nome || '').toLowerCase();
  if (fFiltro === 'harmilk' && (nome.includes('harmilk') || nome.includes('leite'))) return true;
  if (fFiltro === 'harbeef' && (nome.includes('harbeef') || nome.includes('corte'))) return true;
  if (fFiltro === 'harphos' && (nome.includes('harphos') || nome.includes('mineral'))) return true;
  if (fFiltro === 'harpig' && (nome.includes('harpig') || nome.includes('suíno') || nome.includes('suino'))) return true;
  if ((fFiltro === 'aves' || fFiltro.includes('aves')) && (nome.includes('aves') || nome.includes('frango') || nome.includes('postura'))) return true;
  if ((fFiltro === 'h horse' || fFiltro === 'horse') && (nome.includes('horse') || nome.includes('equino') || nome.includes('concentrado mix'))) return true;
  if ((fFiltro === 'harsheep' || fFiltro === 'sheep') && (nome.includes('sheep') || nome.includes('ovino') || nome.includes('harsheep'))) return true;

  return false;
}

/**
 * Retorna os estilos visuais de badge para a categoria da matéria-prima
 */
export function getCategoriaBadgeStyle(cat?: string) {
  const c = (cat || '').toUpperCase().trim();
  switch (c) {
    case 'MACRO':
      return { bg: 'bg-blue-100/80', text: 'text-blue-800', border: 'border-blue-200', dot: 'bg-blue-600' };
    case 'MICRO':
      return { bg: 'bg-purple-100/80', text: 'text-purple-800', border: 'border-purple-200', dot: 'bg-purple-600' };
    case 'ADITIVO':
      return { bg: 'bg-amber-100/80', text: 'text-amber-900', border: 'border-amber-200', dot: 'bg-amber-600' };
    case 'PMH':
      return { bg: 'bg-emerald-100/80', text: 'text-emerald-900', border: 'border-emerald-200', dot: 'bg-emerald-600' };
    case 'SAS':
      return { bg: 'bg-indigo-100/80', text: 'text-indigo-900', border: 'border-indigo-200', dot: 'bg-indigo-600' };
    case 'PINHALZINHO':
      return { bg: 'bg-rose-100/80', text: 'text-rose-900', border: 'border-rose-200', dot: 'bg-rose-600' };
    default:
      return { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-200', dot: 'bg-slate-500' };
  }
}

/**
 * Formata data no formato brasileiro dd/mm/aaaa
 */
export function formatDateBR(dateStr?: string): string {
  if (!dateStr) return '23/09/2026';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch {
    return '23/09/2026';
  }
}
