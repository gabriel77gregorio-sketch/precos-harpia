import type { UnidadeTipo } from '../types/database';

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
    `Preço de Tabela: *${formatCurrency(preco)}*\n`;

  if (indicacoes) {
    mensagem += `Indicação: _${indicacoes}_\n`;
  }
  if (consumoRecomendado) {
    mensagem += `Consumo Recomendado: _${consumoRecomendado}_\n`;
  }

  mensagem += `\n` +
    (vendedorNome ? `Consultor: *${vendedorNome}*\n` : '') +
    `_Consulte condições especiais de frete e prazos para o seu lote._`;

  window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(mensagem)}`, '_blank');
}
