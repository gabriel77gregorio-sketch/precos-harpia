import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import type { Produto } from '../types/database';
import { getPrecoVendedor } from '../lib/utils';
import { useAuth } from './AuthContext';

export interface SellerPricingData {
  markupPercent: number;
  customPrices: Record<string, number>;
}

export interface SellerPricingContextType {
  markupPercent: number;
  customPrices: Record<string, number>;
  customPricesCount: number;
  hasCustomizations: boolean;
  getPrecoCusto: (produto: Produto) => number;
  getPrecoPraticado: (produto: Produto) => number;
  isCustomPrice: (produtoId: string) => boolean;
  setMarkupPercent: (percent: number) => void;
  setCustomPrice: (produtoId: string, price: number) => void;
  removeCustomPrice: (produtoId: string) => void;
  resetAllPricing: () => void;
}

const SellerPricingContext = createContext<SellerPricingContextType | undefined>(undefined);

export const SellerPricingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { profile } = useAuth();
  const vendedorKey = profile?.vendedor_key || 'luciano';
  const storageKey = `harpia_seller_pricing_${vendedorKey}`;

  const [pricingState, setPricingState] = useState<SellerPricingData>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Erro ao carregar preços praticados do vendedor:', e);
    }
    return { markupPercent: 0, customPrices: {} };
  });

  // Recarregar dados ao trocar de vendedor demo
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setPricingState(JSON.parse(saved));
      } else {
        setPricingState({ markupPercent: 0, customPrices: {} });
      }
    } catch (e) {
      setPricingState({ markupPercent: 0, customPrices: {} });
    }
  }, [storageKey]);

  // Salvar no localStorage sempre que mudar
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(pricingState));
    } catch (e) {
      console.warn('Erro ao salvar preços praticados:', e);
    }
  }, [pricingState, storageKey]);

  const getPrecoCusto = useCallback((produto: Produto): number => {
    return getPrecoVendedor(produto, profile?.vendedor_key);
  }, [profile?.vendedor_key]);

  const getPrecoPraticado = useCallback((produto: Produto): number => {
    // 1. Se tem preço customizado individual para esse produto, usa-o
    if (pricingState.customPrices[produto.id] && pricingState.customPrices[produto.id] > 0) {
      return pricingState.customPrices[produto.id];
    }

    const custo = getPrecoCusto(produto);

    // 2. Se tem porcentagem geral definida em cima de todos
    if (pricingState.markupPercent > 0) {
      return Number((custo * (1 + pricingState.markupPercent / 100)).toFixed(2));
    }

    // 3. Caso contrário, o preço praticado é o preço de custo dele
    return custo;
  }, [pricingState, getPrecoCusto]);

  const isCustomPrice = useCallback((produtoId: string): boolean => {
    return Boolean(pricingState.customPrices[produtoId] && pricingState.customPrices[produtoId] > 0);
  }, [pricingState.customPrices]);

  const setMarkupPercent = useCallback((percent: number) => {
    const valid = Math.max(0, Number(percent) || 0);
    setPricingState(prev => ({
      ...prev,
      markupPercent: Number(valid.toFixed(2))
    }));
  }, []);

  const setCustomPrice = useCallback((produtoId: string, price: number) => {
    const valid = Math.max(0, Number(price) || 0);
    setPricingState(prev => ({
      ...prev,
      customPrices: {
        ...prev.customPrices,
        [produtoId]: Number(valid.toFixed(2))
      }
    }));
  }, []);

  const removeCustomPrice = useCallback((produtoId: string) => {
    setPricingState(prev => {
      const nextCustom = { ...prev.customPrices };
      delete nextCustom[produtoId];
      return {
        ...prev,
        customPrices: nextCustom
      };
    });
  }, []);

  const resetAllPricing = useCallback(() => {
    setPricingState({ markupPercent: 0, customPrices: {} });
  }, []);

  const customPricesCount = useMemo(() => {
    return Object.keys(pricingState.customPrices).length;
  }, [pricingState.customPrices]);

  const hasCustomizations = pricingState.markupPercent > 0 || customPricesCount > 0;

  return (
    <SellerPricingContext.Provider
      value={{
        markupPercent: pricingState.markupPercent,
        customPrices: pricingState.customPrices,
        customPricesCount,
        hasCustomizations,
        getPrecoCusto,
        getPrecoPraticado,
        isCustomPrice,
        setMarkupPercent,
        setCustomPrice,
        removeCustomPrice,
        resetAllPricing
      }}
    >
      {children}
    </SellerPricingContext.Provider>
  );
};

export const useSellerPricing = () => {
  const context = useContext(SellerPricingContext);
  if (!context) {
    throw new Error('useSellerPricing deve ser usado dentro de um SellerPricingProvider');
  }
  return context;
};
