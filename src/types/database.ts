export type AppRole = 'admin' | 'seller';

export type UnidadeTipo = 'bag' | 'saco' | 'kg' | 'ton';

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  role: AppRole;
  phone?: string | null;
  comissao_porcentagem: number; // Ex: 5.5 = 5.5%
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export interface Categoria {
  id: string;
  nome: string;
  descricao?: string | null;
  ordem: number;
  ativo: boolean;
  created_at: string;
}

export interface Produto {
  id: string;
  nome: string;
  descricao?: string | null;
  sku?: string | null;
  categoria_id?: string | null;
  unidade_tipo: UnidadeTipo;
  peso_unitario?: number | null; // Em kg (ex: 25, 30, 40, 50, 1000)
  preco_base: number; // Preço oficial de tabela da fábrica
  preco_minimo?: number | null; // Preço piso para negociação
  indicacoes?: string | null; // Indicação de uso (ex: lactação, bezerros)
  consumo_recomendado?: string | null; // Ex: 1kg a cada 3kg de leite
  imagem_url?: string | null;
  ativo: boolean;
  created_at: string;
  updated_at: string;
  categoria?: Categoria | null;
}
