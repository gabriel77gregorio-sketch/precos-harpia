import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import type { CartItem, CartContextType } from '../types/cart';
import type { Produto, VendedorKey } from '../types/database';
import { getPrecoVendedor, calculateCommission } from '../lib/utils';
import { useAuth } from './AuthContext';

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { profile } = useAuth();
  const comissaoPorcentagem = profile?.comissao_porcentagem || 8.0;

  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('harpia_cart_items_v1');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Erro ao ler carrinho do cache:', e);
    }
    return [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  // Salvar no localStorage sempre que o carrinho mudar
  useEffect(() => {
    try {
      localStorage.setItem('harpia_cart_items_v1', JSON.stringify(items));
    } catch (e) {
      console.warn('Erro ao salvar carrinho:', e);
    }
  }, [items]);

  const addToCart = (
    produto: Produto,
    quantidade = 1,
    customVendedorKey?: VendedorKey,
    precoVendaPraticado?: number
  ) => {
    const vKey = customVendedorKey || profile?.vendedor_key || 'luciano';
    const precoCusto = getPrecoVendedor(produto, vKey);
    const preco = precoVendaPraticado !== undefined && precoVendaPraticado > 0 ? precoVendaPraticado : precoCusto;
    const comissaoUnit = calculateCommission(preco, comissaoPorcentagem);
    const lucroUnit = Math.max(0, preco - precoCusto);
    const pesoUnit = produto.peso_unitario || 0;

    setItems((prev) => {
      const index = prev.findIndex((i) => i.produto.id === produto.id);
      if (index >= 0) {
        const updated = [...prev];
        const novaQtd = updated[index].quantidade + quantidade;
        // Se foi passado novo preço praticado, usa ele; senão mantém o anterior
        const precoItem = precoVendaPraticado !== undefined && precoVendaPraticado > 0
          ? precoVendaPraticado
          : updated[index].precoUnitario || preco;
        const lucroAtualUnit = Math.max(0, precoItem - (updated[index].precoCusto || precoCusto));

        updated[index] = {
          ...updated[index],
          quantidade: novaQtd,
          precoUnitario: precoItem,
          precoCusto: updated[index].precoCusto || precoCusto,
          subtotal: precoItem * novaQtd,
          comissaoSubtotal: comissaoUnit * novaQtd,
          lucroSubtotal: lucroAtualUnit * novaQtd,
          pesoTotalKg: pesoUnit * novaQtd
        };
        return updated;
      }

      return [
        ...prev,
        {
          produto,
          quantidade,
          precoUnitario: preco,
          precoCusto,
          vendedorKey: vKey,
          subtotal: preco * quantidade,
          comissaoSubtotal: comissaoUnit * quantidade,
          lucroSubtotal: lucroUnit * quantidade,
          pesoTotalKg: pesoUnit * quantidade
        }
      ];
    });
  };

  const updateQuantity = (produtoId: string, quantidade: number) => {
    if (quantidade <= 0) {
      removeFromCart(produtoId);
      return;
    }

    setItems((prev) =>
      prev.map((item) => {
        if (item.produto.id === produtoId) {
          const comissaoUnit = calculateCommission(item.precoUnitario, comissaoPorcentagem);
          const lucroUnit = Math.max(0, item.precoUnitario - (item.precoCusto || item.precoUnitario));
          const pesoUnit = item.produto.peso_unitario || 0;
          return {
            ...item,
            quantidade,
            subtotal: item.precoUnitario * quantidade,
            comissaoSubtotal: comissaoUnit * quantidade,
            lucroSubtotal: lucroUnit * quantidade,
            pesoTotalKg: pesoUnit * quantidade
          };
        }
        return item;
      })
    );
  };

  const removeFromCart = (produtoId: string) => {
    setItems((prev) => prev.filter((i) => i.produto.id !== produtoId));
  };

  const clearCart = () => {
    setItems([]);
  };

  const getItemQuantity = (produtoId: string) => {
    const item = items.find((i) => i.produto.id === produtoId);
    return item ? item.quantidade : 0;
  };

  const totalItems = useMemo(() => items.reduce((acc, i) => acc + i.quantidade, 0), [items]);
  const totalValor = useMemo(() => items.reduce((acc, i) => acc + i.subtotal, 0), [items]);
  const totalPesoKg = useMemo(() => items.reduce((acc, i) => acc + i.pesoTotalKg, 0), [items]);
  const totalComissao = useMemo(() => items.reduce((acc, i) => acc + i.comissaoSubtotal, 0), [items]);
  const totalLucro = useMemo(() => items.reduce((acc, i) => acc + (i.lucroSubtotal || 0), 0), [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        getItemQuantity,
        totalItems,
        totalValor,
        totalPesoKg,
        totalComissao,
        totalLucro,
        isCartOpen,
        setIsCartOpen
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart deve ser usado dentro de um CartProvider');
  }
  return context;
};
