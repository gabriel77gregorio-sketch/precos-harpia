/**
 * Matéria-prima / Insumo usado na formulação de rações.
 * Ex: Milho Grão, Farelo de Soja 46%, Calcário, etc.
 */
export interface Insumo {
  id: string;
  categoria?: string; // Ex: MACRO, MICRO, ADITIVO, PMH, SAS, PINHALZINHO
  nome: string;
  preco_kg?: number; // Preço em R$/kg
  preco_tonelada: number; // Preço em R$/tonelada
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Item dentro da fórmula de um produto (quantidade de cada insumo).
 */
export interface FormulaItem {
  insumo_id: string;
  quantidade_kg: number; // Kg deste insumo por tonelada de ração produzida
}

/**
 * Custo extra de produção (embalagem, mão de obra, energia, etc.).
 */
export interface CustoExtra {
  id: string;
  descricao: string; // Ex: "Produção", "Embalagem Saco 30kg", "Frete"
  valor: number; // R$ por tonelada (fixo) ou percentual sobre insumos
  tipo: 'fixo' | 'percentual'; // 'fixo' = R$/ton, 'percentual' = % sobre custo de insumos
}

/**
 * Fórmula completa de um produto (composição + custos extras).
 */
export interface FormulaRacao {
  id: string;
  codigo?: string; // Ex: "1047", "1011"
  produto_id?: string;
  produto_nome: string; // Desnormalizado para praticidade (ex: "HARPIG INICIAL (1047)")
  batida_padrao_kg?: number; // Padrão 1000 kg (1 Tonelada)
  peso_saco_kg?: number; // Padrão 40 kg
  itens: FormulaItem[];
  custos_extras: CustoExtra[];
  custo_operacional_ton?: number; // P.S/SAC
  custo_tonelada?: number;
  custo_saco?: number;
  notas?: string;
  created_at: string;
  updated_at: string;
}
