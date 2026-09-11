import React from 'react';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../lib/utils';
import { ShoppingCart } from 'lucide-react';

export const CartFloatingButton: React.FC = () => {
  const { totalItems, totalValor, setIsCartOpen } = useCart();

  if (totalItems === 0) return null;

  return (
    <div
      className="fixed right-4 sm:right-6 z-40 animate-in fade-in slide-in-from-bottom-4 duration-200"
      style={{ bottom: 'calc(1rem + env(safe-area-inset-bottom, 0px))' }}
    >
      <button
        onClick={() => setIsCartOpen(true)}
        className="group bg-[#006837] hover:bg-[#00522c] text-white px-4 py-3 sm:px-5 sm:py-3.5 rounded-2xl shadow-xl hover:shadow-2xl border-2 border-emerald-400/40 flex items-center gap-3 transition-all duration-200 active:scale-95"
      >
        <div className="relative">
          <ShoppingCart size={22} className="text-white group-hover:scale-110 transition-transform" />
          <span className="absolute -top-2 -right-2 bg-amber-400 text-slate-950 text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-xs border border-white">
            {totalItems > 99 ? '99+' : totalItems}
          </span>
        </div>

        <div className="text-left leading-tight">
          <span className="text-[10px] text-emerald-200 uppercase tracking-wider font-bold block">
            Ver Pedido ({totalItems} {totalItems === 1 ? 'saco' : 'sacos'})
          </span>
          <span className="text-sm sm:text-base font-black text-white">
            {formatCurrency(totalValor)}
          </span>
        </div>
      </button>
    </div>
  );
};
