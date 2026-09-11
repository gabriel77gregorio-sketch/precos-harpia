import type { Produto, VendedorKey } from './database';

export interface CartItem {
  produto: Produto;
  quantidade: number;
  precoUnitario: number;
  vendedorKey?: VendedorKey;
  subtotal: number;
  comissaoSubtotal: number;
  pesoTotalKg: number;
}

export interface CartContextType {
  items: CartItem[];
  addToCart: (produto: Produto, quantidade?: number, vendedorKey?: VendedorKey) => void;
  updateQuantity: (produtoId: string, quantidade: number) => void;
  removeFromCart: (produtoId: string) => void;
  clearCart: () => void;
  getItemQuantity: (produtoId: string) => number;
  totalItems: number;
  totalValor: number;
  totalPesoKg: number;
  totalComissao: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}
