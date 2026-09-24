import React, { useState } from 'react';
import type { Produto, Categoria, Profile, UnidadeTipo } from '../../types/database';
import { supabase } from '../../lib/supabase';
import { formatCurrency, formatPercent, getUnidadeLabel } from '../../lib/utils';
import { FormulacaoView } from './FormulacaoView';
import {
  Package,
  Users,
  FolderTree,
  FlaskConical,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  RefreshCw,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface AdminViewProps {
  produtos: Produto[];
  categorias: Categoria[];
  vendedores: Profile[];
  loading: boolean;
  onRefresh: () => void;
}

export const AdminView: React.FC<AdminViewProps> = ({
  produtos,
  categorias,
  vendedores,
  loading,
  onRefresh
}) => {
  const [activeTab, setActiveTab] = useState<'produtos' | 'vendedores' | 'categorias' | 'formulacao'>('produtos');
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Estados para Produto Modal
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Produto | null>(null);
  const [productForm, setProductForm] = useState({
    nome: '',
    sku: '',
    categoria_id: '',
    unidade_tipo: 'saco' as UnidadeTipo,
    peso_unitario: 30,
    preco_base: 0,
    preco_minimo: 0,
    indicacoes: '',
    consumo_recomendado: '',
    descricao: '',
    ativo: true
  });

  // Estados para Vendedor Modal / Edição rápida
  const [isSellerModalOpen, setIsSellerModalOpen] = useState(false);
  const [sellerForm, setSellerForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    comissao_porcentagem: 5.0,
    role: 'seller' as const
  });
  const [editingCommissionId, setEditingCommissionId] = useState<string | null>(null);
  const [tempCommission, setTempCommission] = useState<number>(0);

  // Estados para Categorias
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setFeedbackMsg({ type, text });
    setTimeout(() => setFeedbackMsg(null), 3500);
  };

  // Salvar Produto (Novo ou Edição)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        const { error } = await supabase
          .from('produtos')
          .update({
            nome: productForm.nome,
            sku: productForm.sku || null,
            categoria_id: productForm.categoria_id || null,
            unidade_tipo: productForm.unidade_tipo,
            peso_unitario: Number(productForm.peso_unitario) || null,
            preco_base: Number(productForm.preco_base) || 0,
            preco_minimo: Number(productForm.preco_minimo) || 0,
            indicacoes: productForm.indicacoes || null,
            consumo_recomendado: productForm.consumo_recomendado || null,
            descricao: productForm.descricao || null,
            ativo: productForm.ativo,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingProduct.id);

        if (error) throw error;
        showToast('Produto atualizado com sucesso!');
      } else {
        const { error } = await supabase
          .from('produtos')
          .insert({
            nome: productForm.nome,
            sku: productForm.sku || null,
            categoria_id: productForm.categoria_id || null,
            unidade_tipo: productForm.unidade_tipo,
            peso_unitario: Number(productForm.peso_unitario) || null,
            preco_base: Number(productForm.preco_base) || 0,
            preco_minimo: Number(productForm.preco_minimo) || 0,
            indicacoes: productForm.indicacoes || null,
            consumo_recomendado: productForm.consumo_recomendado || null,
            descricao: productForm.descricao || null,
            ativo: productForm.ativo
          });

        if (error) throw error;
        showToast('Novo produto cadastrado!');
      }

      setIsProductModalOpen(false);
      setEditingProduct(null);
      onRefresh();
    } catch (err: any) {
      showToast(err.message || 'Erro ao salvar produto', 'error');
    }
  };

  // Excluir Produto
  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Deseja realmente desativar este produto?')) return;
    try {
      const { error } = await supabase
        .from('produtos')
        .update({ ativo: false })
        .eq('id', id);

      if (error) throw error;
      showToast('Produto desativado');
      onRefresh();
    } catch (err: any) {
      showToast(err.message || 'Erro ao desativar', 'error');
    }
  };

  // Salvar Comissão de Vendedor
  const handleSaveCommission = async (vendedorId: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          comissao_porcentagem: Number(tempCommission),
          updated_at: new Date().toISOString()
        })
        .eq('id', vendedorId);

      if (error) throw error;
      showToast('Porcentagem de comissão atualizada!');
      setEditingCommissionId(null);
      onRefresh();
    } catch (err: any) {
      showToast(err.message || 'Erro ao atualizar comissão', 'error');
    }
  };

  // Salvar Novo Vendedor
  const handleCreateSeller = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('profiles')
        .insert({
          id: crypto.randomUUID(),
          full_name: sellerForm.full_name,
          email: sellerForm.email,
          phone: sellerForm.phone || null,
          comissao_porcentagem: Number(sellerForm.comissao_porcentagem) || 0,
          role: 'seller',
          ativo: true
        });

      if (error) throw error;
      showToast('Vendedor cadastrado com sucesso!');
      setIsSellerModalOpen(false);
      setSellerForm({
        full_name: '',
        email: '',
        phone: '',
        comissao_porcentagem: 5.0,
        role: 'seller'
      });
      onRefresh();
    } catch (err: any) {
      showToast(err.message || 'Erro ao criar vendedor', 'error');
    }
  };

  // Criar Categoria
  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    try {
      const { error } = await supabase
        .from('categorias')
        .insert({
          nome: newCategoryName.trim(),
          ativo: true,
          ordem: categorias.length + 1
        });

      if (error) throw error;
      showToast('Categoria criada com sucesso!');
      setNewCategoryName('');
      setIsCategoryModalOpen(false);
      onRefresh();
    } catch (err: any) {
      showToast(err.message || 'Erro ao criar categoria', 'error');
    }
  };

  return (
    <div className="space-y-5">
      {/* Toast Feedback */}
      {feedbackMsg && (
        <div
          className={`fixed bottom-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg border text-sm font-medium animate-in slide-in-from-bottom duration-200 ${
            feedbackMsg.type === 'success'
              ? 'bg-emerald-600 text-white border-emerald-500'
              : 'bg-red-600 text-white border-red-500'
          }`}
        >
          {feedbackMsg.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span>{feedbackMsg.text}</span>
        </div>
      )}

      {/* Top Header Admin */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600">
            Painel de Gestão da Fábrica
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            Administração Harpia
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Controle oficial de produtos, tabela de preços, embalagens, dosagens recomendadas e comissões dos vendedores.
          </p>
        </div>

        <button
          onClick={onRefresh}
          className="inline-flex items-center gap-1.5 self-start sm:self-auto text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 px-3 py-2 rounded-xl transition"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          <span>Atualizar Dados</span>
        </button>
      </div>

      {/* Abas de Navegação */}
      <div className="flex border-b border-slate-200 gap-2 sm:gap-4 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('produtos')}
          className={`flex items-center gap-2 pb-3 px-2 text-sm font-bold border-b-2 transition shrink-0 ${
            activeTab === 'produtos'
              ? 'border-[#006837] text-[#006837]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Package size={17} />
          <span>Produtos & Preços ({produtos.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('vendedores')}
          className={`flex items-center gap-2 pb-3 px-2 text-sm font-bold border-b-2 transition shrink-0 ${
            activeTab === 'vendedores'
              ? 'border-[#006837] text-[#006837]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users size={17} />
          <span>Vendedores & Comissões ({vendedores.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('categorias')}
          className={`flex items-center gap-2 pb-3 px-2 text-sm font-bold border-b-2 transition shrink-0 ${
            activeTab === 'categorias'
              ? 'border-[#006837] text-[#006837]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FolderTree size={17} />
          <span>Categorias ({categorias.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('formulacao')}
          className={`flex items-center gap-2 pb-3 px-2 text-sm font-bold border-b-2 transition shrink-0 ${
            activeTab === 'formulacao'
              ? 'border-[#006837] text-[#006837]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FlaskConical size={17} />
          <span>Formulação & Custos</span>
        </button>
      </div>

      {/* CONTEÚDO DA ABA 1: PRODUTOS */}
      {activeTab === 'produtos' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-base">Tabela de Preços e Padrões Oficiais</h3>
            <button
              onClick={() => {
                setEditingProduct(null);
                setProductForm({
                  nome: '',
                  sku: '',
                  categoria_id: categorias[0]?.id || '',
                  unidade_tipo: 'saco',
                  peso_unitario: 30,
                  preco_base: 0,
                  preco_minimo: 0,
                  indicacoes: '',
                  consumo_recomendado: '',
                  descricao: '',
                  ativo: true
                });
                setIsProductModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 bg-[#006837] hover:bg-[#00522c] text-white text-xs sm:text-sm font-semibold px-3.5 py-2 rounded-xl shadow-xs transition"
            >
              <Plus size={16} />
              <span>Novo Produto</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[11px] tracking-wider">
                  <tr>
                    <th className="px-4 py-3">Produto</th>
                    <th className="px-3 py-3">Categoria</th>
                    <th className="px-3 py-3">Embalagem</th>
                    <th className="px-3 py-3">Indicação & Consumo</th>
                    <th className="px-3 py-3 text-right">Preço Base</th>
                    <th className="px-3 py-3 text-right">Piso Mínimo</th>
                    <th className="px-3 py-3 text-center">Status</th>
                    <th className="px-4 py-3 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {produtos.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/60 transition">
                      <td className="px-4 py-3">
                        <span className="font-bold text-slate-900 block">{p.nome}</span>
                        {p.sku && <span className="text-[11px] font-mono text-slate-400">{p.sku}</span>}
                      </td>
                      <td className="px-3 py-3 text-slate-600">
                        {p.categoria?.nome || '—'}
                      </td>
                      <td className="px-3 py-3">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-medium">
                          {getUnidadeLabel(p.unidade_tipo, p.peso_unitario)}
                        </span>
                      </td>
                      <td className="px-3 py-3 max-w-[200px]">
                        {p.consumo_recomendado ? (
                          <span className="text-[11px] text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded block truncate">
                            {p.consumo_recomendado}
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-400">A consultar</span>
                        )}
                      </td>
                      <td className="px-3 py-3 text-right font-black text-slate-900">
                        {formatCurrency(p.preco_base)}
                      </td>
                      <td className="px-3 py-3 text-right text-slate-500">
                        {p.preco_minimo ? formatCurrency(p.preco_minimo) : '—'}
                      </td>
                      <td className="px-3 py-3 text-center">
                        <span
                          className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                            p.ativo
                              ? 'bg-emerald-100 text-[#006837]'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {p.ativo ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => {
                              setEditingProduct(p);
                              setProductForm({
                                nome: p.nome,
                                sku: p.sku || '',
                                categoria_id: p.categoria_id || '',
                                unidade_tipo: p.unidade_tipo,
                                peso_unitario: p.peso_unitario || 0,
                                preco_base: p.preco_base,
                                preco_minimo: p.preco_minimo || 0,
                                indicacoes: p.indicacoes || '',
                                consumo_recomendado: p.consumo_recomendado || '',
                                descricao: p.descricao || '',
                                ativo: p.ativo
                              });
                              setIsProductModalOpen(true);
                            }}
                            className="p-1.5 text-slate-500 hover:text-[#006837] hover:bg-emerald-50 rounded-lg transition"
                            title="Editar Produto"
                          >
                            <Edit2 size={15} />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                            title="Desativar"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* CONTEÚDO DA ABA 2: VENDEDORES & COMISSÕES */}
      {activeTab === 'vendedores' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-800 text-base">Representantes e Vendedores</h3>
              <p className="text-xs text-slate-500">
                Configure a porcentagem de comissão individual que cada vendedor recebe sobre as vendas.
              </p>
            </div>
            <button
              onClick={() => setIsSellerModalOpen(true)}
              className="inline-flex items-center gap-1.5 bg-[#006837] hover:bg-[#00522c] text-white text-xs sm:text-sm font-semibold px-3.5 py-2 rounded-xl shadow-xs transition"
            >
              <Plus size={16} />
              <span>Novo Vendedor</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[11px] tracking-wider">
                  <tr>
                    <th className="px-4 py-3">Vendedor</th>
                    <th className="px-3 py-3">Contato</th>
                    <th className="px-3 py-3 text-center">Comissão Individual (%)</th>
                    <th className="px-3 py-3 text-center">Status</th>
                    <th className="px-4 py-3 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {vendedores.map((v) => {
                    const isEditingThis = editingCommissionId === v.id;
                    return (
                      <tr key={v.id} className="hover:bg-slate-50/60 transition">
                        <td className="px-4 py-3">
                          <span className="font-bold text-slate-900 block">{v.full_name}</span>
                          <span className="text-[11px] text-slate-400">{v.email}</span>
                        </td>
                        <td className="px-3 py-3 text-slate-600">
                          {v.phone || 'Não informado'}
                        </td>
                        <td className="px-3 py-3 text-center">
                          {isEditingThis ? (
                            <div className="inline-flex items-center gap-1">
                              <input
                                type="number"
                                step="0.1"
                                min="0"
                                max="100"
                                value={tempCommission}
                                onChange={(e) => setTempCommission(Number(e.target.value))}
                                className="w-16 px-2 py-1 text-center font-bold text-xs bg-white border border-[#006837] rounded-md focus:outline-hidden"
                              />
                              <span className="text-xs font-bold">%</span>
                              <button
                                onClick={() => handleSaveCommission(v.id)}
                                className="p-1 bg-[#006837] text-white rounded hover:bg-[#00522c]"
                                title="Salvar"
                              >
                                <Check size={14} />
                              </button>
                              <button
                                onClick={() => setEditingCommissionId(null)}
                                className="p-1 bg-slate-200 text-slate-600 rounded hover:bg-slate-300"
                                title="Cancelar"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          ) : (
                            <div className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
                              <span className="text-xs font-black text-[#006837]">
                                {formatPercent(v.comissao_porcentagem)}
                              </span>
                            </div>
                          )}
                        </td>
                        <td className="px-3 py-3 text-center">
                          <span
                            className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                              v.ativo ? 'bg-emerald-100 text-[#006837]' : 'bg-red-100 text-red-700'
                            }`}
                          >
                            {v.ativo ? 'Ativo' : 'Inativo'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          {!isEditingThis && (
                            <button
                              onClick={() => {
                                setEditingCommissionId(v.id);
                                setTempCommission(v.comissao_porcentagem);
                              }}
                              className="text-xs font-semibold text-[#006837] hover:underline"
                            >
                              Alterar %
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* CONTEÚDO DA ABA 3: CATEGORIAS */}
      {activeTab === 'categorias' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-base">Categorias de Ração e Suplementos</h3>
            <button
              onClick={() => setIsCategoryModalOpen(true)}
              className="inline-flex items-center gap-1.5 bg-[#006837] hover:bg-[#00522c] text-white text-xs sm:text-sm font-semibold px-3.5 py-2 rounded-xl shadow-xs transition"
            >
              <Plus size={16} />
              <span>Nova Categoria</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {categorias.map((c) => (
              <div
                key={c.id}
                className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between"
              >
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{c.nome}</h4>
                  <span className="text-xs text-slate-400">
                    {produtos.filter((p) => p.categoria_id === c.id).length} produtos vinculados
                  </span>
                </div>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-1 rounded-md">
                  Ordem {c.ordem}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CONTEÚDO DA ABA 4: FORMULAÇÃO & CUSTOS */}
      {activeTab === 'formulacao' && (
        <FormulacaoView produtos={produtos} />
      )}

      {/* MODAL CRIAR/EDITAR PRODUTO */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-lg">
                {editingProduct ? 'Editar Produto' : 'Cadastrar Novo Produto'}
              </h3>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="py-4 space-y-3.5 text-xs sm:text-sm">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nome do Produto *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: HARMILK LAC 22"
                  value={productForm.nome}
                  onChange={(e) => setProductForm({ ...productForm, nome: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#006837] focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Código SKU
                  </label>
                  <input
                    type="text"
                    placeholder="HAR-MILK-01"
                    value={productForm.sku}
                    onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#006837] focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Categoria
                  </label>
                  <select
                    value={productForm.categoria_id}
                    onChange={(e) => setProductForm({ ...productForm, categoria_id: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#006837] focus:outline-hidden"
                  >
                    <option value="">Sem categoria</option>
                    {categorias.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nome}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Padrão de Embalagem / Unidade */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Padrão / Embalagem *
                  </label>
                  <select
                    value={productForm.unidade_tipo}
                    onChange={(e) => setProductForm({ ...productForm, unidade_tipo: e.target.value as UnidadeTipo })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#006837] focus:outline-hidden"
                  >
                    <option value="saco">Saco</option>
                    <option value="bag">Big Bag</option>
                    <option value="kg">Quilo (kg)</option>
                    <option value="ton">Tonelada</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Peso da Sacaria (kg)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    placeholder="Ex: 25, 30, 40, 50, 1000"
                    value={productForm.peso_unitario}
                    onChange={(e) => setProductForm({ ...productForm, peso_unitario: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#006837] focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Indicações e Consumo Recomendado */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Indicação de Uso (Catálogo)
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Ração pronta para uso..."
                    value={productForm.indicacoes}
                    onChange={(e) => setProductForm({ ...productForm, indicacoes: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#006837] focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Consumo Recomendado (Catálogo)
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: 1kg para cada 3kg de leite..."
                    value={productForm.consumo_recomendado}
                    onChange={(e) => setProductForm({ ...productForm, consumo_recomendado: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#006837] focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Preços */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Preço de Tabela (R$) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="89.50"
                    value={productForm.preco_base}
                    onChange={(e) => setProductForm({ ...productForm, preco_base: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-[#006837] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Piso Mínimo Negociável (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="85.00"
                    value={productForm.preco_minimo}
                    onChange={(e) => setProductForm({ ...productForm, preco_minimo: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#006837] focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="prod_ativo"
                  checked={productForm.ativo}
                  onChange={(e) => setProductForm({ ...productForm, ativo: e.target.checked })}
                  className="w-4 h-4 text-[#006837] rounded border-slate-300 focus:ring-[#006837]"
                />
                <label htmlFor="prod_ativo" className="font-semibold text-slate-800">
                  Produto Ativo na Tabela de Preços
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-600 rounded-xl hover:bg-slate-50 font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#006837] hover:bg-[#00522c] text-white font-semibold rounded-xl shadow-xs"
                >
                  Salvar Produto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL NOVO VENDEDOR */}
      {isSellerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-lg">Novo Vendedor / Representante</h3>
              <button
                onClick={() => setIsSellerModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateSeller} className="py-4 space-y-3.5 text-xs sm:text-sm">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nome Completo *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Carlos Eduardo Mendes"
                  value={sellerForm.full_name}
                  onChange={(e) => setSellerForm({ ...sellerForm, full_name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#006837] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">E-mail de Acesso *</label>
                <input
                  type="email"
                  required
                  placeholder="vendedor@harpia.com.br"
                  value={sellerForm.email}
                  onChange={(e) => setSellerForm({ ...sellerForm, email: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#006837] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">WhatsApp / Telefone</label>
                <input
                  type="text"
                  placeholder="(16) 99876-5432"
                  value={sellerForm.phone}
                  onChange={(e) => setSellerForm({ ...sellerForm, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#006837] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Porcentagem de Comissão (%) *
                </label>
                <input
                  type="number"
                  step="0.1"
                  required
                  placeholder="5.0"
                  value={sellerForm.comissao_porcentagem}
                  onChange={(e) => setSellerForm({ ...sellerForm, comissao_porcentagem: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl font-bold text-[#006837] focus:ring-2 focus:ring-[#006837] focus:outline-hidden"
                />
                <span className="text-[11px] text-slate-400 mt-0.5 block">
                  Percentual que este vendedor receberá em cada produto consultado.
                </span>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsSellerModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-600 rounded-xl hover:bg-slate-50 font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#006837] hover:bg-[#00522c] text-white font-semibold rounded-xl shadow-xs"
                >
                  Cadastrar Vendedor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL NOVA CATEGORIA */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl p-5 shadow-2xl border border-slate-200">
            <h3 className="font-bold text-slate-900 text-base mb-3">Nova Categoria de Produto</h3>
            <form onSubmit={handleCreateCategory} className="space-y-3">
              <input
                type="text"
                required
                placeholder="Ex: Ovinos & Caprinos"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#006837] focus:outline-hidden"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 border border-slate-300 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-[#006837] rounded-lg"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
