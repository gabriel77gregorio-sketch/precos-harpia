import type { Produto, VendedorKey } from './database';

export interface CartItem {
  produto: Produto;
  quantidade: number;
  precoUnitario: number; // Preço praticado de venda
  precoCusto?: number; // Preço de custo da fábrica para o vendedor
  vendedorKey?: VendedorKey;
  subtotal: number;
  comissaoSubtotal: number;
  lucroSubtotal?: number; // Lucro do vendedor sobre a venda
  pesoTotalKg: number;
}

export interface CartContextType {
  items: CartItem[];
  addToCart: (produto: Produto, quantidade?: number, vendedorKey?: VendedorKey, precoVendaPraticado?: number) => void;
  updateQuantity: (produtoId: string, quantidade: number) => void;
  removeFromCart: (produtoId: string) => void;
  clearCart: () => void;
  getItemQuantity: (produtoId: string) => number;
  totalItems: number;
  totalValor: number;
  totalPesoKg: number;
  totalComissao: number;
  totalLucro: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}
