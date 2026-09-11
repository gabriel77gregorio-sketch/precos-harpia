import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import {
  formatCurrency,
  getFamiliaColorConfig,
  getUnidadeLabel
} from '../../lib/utils';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingCart,
  Send,
  Package,
  Weight,
  User
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    items,
    updateQuantity,
    removeFromCart,
    clearCart,
    totalItems,
    totalValor,
    totalPesoKg,
    totalComissao,
    isCartOpen,
    setIsCartOpen
  } = useCart();

  const { profile } = useAuth();
  const [clienteNome, setClienteNome] = useState('');
  const [condicaoPagamento, setCondicaoPagamento] = useState('À vista / 30 dias');
  const [observacoes, setObservacoes] = useState('');

  if (!isCartOpen) return null;

  const totalToneladas = totalPesoKg > 0 ? (totalPesoKg / 1000).toFixed(2) : '0.00';

  const handleSendWhatsApp = () => {
    if (items.length === 0) return;

    const dataHoje = new Date().toLocaleDateString('pt-BR');
    const consultorNome = profile?.full_name || 'Consultor Harpia';
    const tabelaVendedor = profile?.vendedor_key ? profile.vendedor_key.toUpperCase() : 'BALCÃO';

    let msg = `*PEDIDO DE COMPRA - HARPIA NUTRIÇÃO ANIMAL* 🌱\n`;
    msg += `==================================\n`;
    msg += `*Consultor:* ${consultorNome} (${tabelaVendedor})\n`;
    if (clienteNome.trim()) {
      msg += `*Cliente / Fazenda:* ${clienteNome.trim()}\n`;
    }
    msg += `*Condição de Pagamento:* ${condicaoPagamento}\n`;
    msg += `*Data:* ${dataHoje}\n\n`;

    msg += `*ITENS DO PEDIDO:*` + `\n`;
    items.forEach((item, index) => {
      const unidade = getUnidadeLabel(item.produto.unidade_tipo, item.produto.peso_unitario);
      const pesoItemKg = (item.produto.peso_unitario || 0) * item.quantidade;
      const pesoStr = pesoItemKg > 0 ? ` (${pesoItemKg >= 1000 ? (pesoItemKg / 1000).toFixed(2) + 't' : pesoItemKg + 'kg'})` : '';

      msg += `${index + 1}. *${item.produto.nome}* [${unidade}]\n`;
      msg += `   • Qtd: *${item.quantidade} ${item.produto.unidade_tipo === 'saco' ? 'sacos' : 'un'}*${pesoStr}\n`;
      msg += `   • Unitário: ${formatCurrency(item.precoUnitario)}\n`;
      msg += `   • Subtotal: *${formatCurrency(item.subtotal)}*\n\n`;
    });

    msg += `==================================\n`;
    msg += `*RESUMO DO CARREGAMENTO:*\n`;
    msg += `📦 *Total de Volumes:* ${totalItems} sacos/unidades\n`;
    if (totalPesoKg > 0) {
      msg += `⚖️ *Peso Total:* ${totalPesoKg.toLocaleString('pt-BR')} kg (${totalToneladas} ton)\n`;
    }
    msg += `💰 *VALOR TOTAL DO PEDIDO:* *${formatCurrency(totalValor)}*\n`;

    if (observacoes.trim()) {
      msg += `\n*Observações:* _${observacoes.trim()}_`;
    }

    msg += `\n\n_Pedido gerado via Aplicativo Oficial de Vendas Harpia_`;

    const encoded = encodeURIComponent(msg);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      {/* Backdrop para fechar */}
      <div className="fixed inset-0" onClick={() => setIsCartOpen(false)} />

      {/* Painel do Carrinho */}
      <div className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-250">
        
        {/* Cabeçalho */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-[#006837] to-[#004d28] text-white flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/10 rounded-xl">
              <ShoppingCart size={20} className="text-emerald-200" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black leading-tight">
                Carrinho de Pedidos
              </h2>
              <span className="text-xs text-emerald-100">
                {totalItems} {totalItems === 1 ? 'item selecionado' : 'itens selecionados'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {items.length > 0 && (
              <button
                onClick={() => {
                  if (confirm('Deseja realmente limpar todos os itens do carrinho?')) {
                    clearCart();
                  }
                }}
                className="text-xs text-emerald-200 hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-white/10 transition flex items-center gap-1"
                title="Limpar carrinho"
              >
                <Trash2 size={14} />
                <span className="hidden sm:inline">Limpar</span>
              </button>
            )}
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-white/80 hover:text-white rounded-full hover:bg-white/10 transition"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Conteúdo rolável */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {items.length === 0 ? (
            <div className="py-16 text-center text-slate-500">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
                <ShoppingCart size={30} />
              </div>
              <h4 className="font-bold text-slate-700 text-base">Seu carrinho está vazio</h4>
              <p className="text-xs text-slate-400 max-w-xs mx-auto mt-1">
                Adicione produtos da lista de rações ou insumos para montar e enviar seu pedido.
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="mt-4 px-4 py-2 bg-[#006837] text-white text-xs font-bold rounded-xl shadow-2xs hover:bg-[#00522c] transition"
              >
                Explorar Catálogo de Produtos
              </button>
            </div>
          ) : (
            <>
              {/* Informações Rápidas do Cliente */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2.5">
                <div className="text-[11px] uppercase tracking-wider font-bold text-slate-500 flex items-center gap-1.5">
                  <User size={13} className="text-[#006837]" />
                  <span>Dados do Pedido / Destinatário</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Nome do Cliente / Fazenda"
                    value={clienteNome}
                    onChange={(e) => setClienteNome(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-[#006837]"
                  />
                  <input
                    type="text"
                    placeholder="Condição (ex: 30 dias / À vista)"
                    value={condicaoPagamento}
                    onChange={(e) => setCondicaoPagamento(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-[#006837]"
                  />
                </div>
              </div>

              {/* Lista dos Itens */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs font-bold text-slate-600 px-1">
                  <span>Itens no Carrinho ({items.length})</span>
                  <span>Subtotal</span>
                </div>

                {items.map((item) => {
                  const colorConfig = getFamiliaColorConfig(item.produto.familia || item.produto.categoria?.nome);
                  const unidadeTexto = getUnidadeLabel(item.produto.unidade_tipo, item.produto.peso_unitario);
                  const pesoItemKg = (item.produto.peso_unitario || 0) * item.quantidade;

                  return (
                    <div
                      key={item.produto.id}
                      className="bg-white rounded-xl border border-slate-200 p-3 shadow-2xs hover:border-slate-300 transition flex flex-col gap-2.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                            <span className={`text-[10px] font-bold uppercase px-1.5 py-0.2 rounded ${colorConfig.bgBadge} ${colorConfig.textBadge} border ${colorConfig.borderBadge}`}>
                              {colorConfig.nome}
                            </span>
                            <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded">
                              {unidadeTexto}
                            </span>
                          </div>
                          <h4 className="font-bold text-slate-900 text-xs sm:text-sm leading-snug">
                            {item.produto.nome}
                          </h4>
                          <span className="text-[11px] text-slate-500">
                            Unitário: <strong>{formatCurrency(item.precoUnitario)}</strong>
                          </span>
                        </div>

                        {/* Subtotal e Excluir */}
                        <div className="text-right shrink-0">
                          <span className="text-sm font-black text-slate-900 block">
                            {formatCurrency(item.subtotal)}
                          </span>
                          {pesoItemKg > 0 && (
                            <span className="text-[10px] text-slate-400 block">
                              {pesoItemKg >= 1000 ? (pesoItemKg / 1000).toFixed(2) + 't' : pesoItemKg + 'kg'}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Controle de Quantidade */}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => updateQuantity(item.produto.id, item.quantidade - 1)}
                            className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition active:scale-95"
                          >
                            <Minus size={13} />
                          </button>
                          <input
                            type="number"
                            min="1"
                            max="10000"
                            value={item.quantidade}
                            onChange={(e) => updateQuantity(item.produto.id, Math.max(1, Number(e.target.value) || 1))}
                            className="w-14 text-center font-bold text-xs bg-slate-50 border border-slate-200 rounded-lg py-1 focus:outline-hidden focus:ring-1 focus:ring-[#006837]"
                          />
                          <button
                            onClick={() => updateQuantity(item.produto.id, item.quantidade + 1)}
                            className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition active:scale-95"
                          >
                            <Plus size={13} />
                          </button>
                          <span className="text-[11px] text-slate-500 font-medium ml-1">
                            {item.produto.unidade_tipo === 'saco' ? 'sacos' : 'un'}
                          </span>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.produto.id)}
                          className="text-slate-400 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-50 transition"
                          title="Remover do pedido"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Observação opcional */}
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">
                  Observações do Frete ou Entrega (Opcional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Ex: Entregar na sede da fazenda até sexta-feira..."
                  value={observacoes}
                  onChange={(e) => setObservacoes(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-[#006837]"
                />
              </div>
            </>
          )}
        </div>

        {/* Rodapé Fixo com Totais e Botão WhatsApp */}
        {items.length > 0 && (
          <div
            className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 space-y-3 shrink-0"
            style={{ paddingBottom: 'calc(1.25rem + env(safe-area-inset-bottom, 0px))' }}
          >
            {/* Resumo da Carga */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-white p-2.5 rounded-xl border border-slate-200/80">
                <span className="text-[10px] uppercase font-bold text-slate-400 block flex items-center gap-1">
                  <Package size={11} />
                  Volumes
                </span>
                <span className="text-sm font-black text-slate-800">
                  {totalItems} sacos
                </span>
              </div>

              <div className="bg-white p-2.5 rounded-xl border border-slate-200/80">
                <span className="text-[10px] uppercase font-bold text-slate-400 block flex items-center gap-1">
                  <Weight size={11} />
                  Peso da Carga
                </span>
                <span className="text-sm font-black text-slate-800">
                  {totalToneladas} ton ({totalPesoKg.toLocaleString('pt-BR')} kg)
                </span>
              </div>
            </div>

            {/* Total Financeiro */}
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-3 rounded-xl border border-emerald-200/80 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-800 block">
                  Valor Total do Pedido
                </span>
                <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {formatCurrency(totalValor)}
                </span>
              </div>

              {totalComissao > 0 && (
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-emerald-700 block">
                    Comissão Estimada
                  </span>
                  <span className="text-sm font-black text-[#006837]">
                    +{formatCurrency(totalComissao)}
                  </span>
                </div>
              )}
            </div>

            {/* Botão Enviar Pedido via WhatsApp */}
            <button
              onClick={handleSendWhatsApp}
              className="w-full bg-[#006837] hover:bg-[#00522c] active:scale-[0.99] text-white py-3 px-4 rounded-xl font-black text-sm flex items-center justify-center gap-2 shadow-md transition"
            >
              <Send size={16} />
              <span>Enviar Pedido via WhatsApp</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
