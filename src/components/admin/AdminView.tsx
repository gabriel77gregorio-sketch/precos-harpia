import React, { useState, useMemo } from 'react';
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
  AlertCircle,
  Search,
  Sparkles,
  Filter,
  DollarSign,
  TrendingUp,
  Percent
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
    preco_anterior: 0,
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

  // Estados para Busca e Filtro de Produtos
  const [searchProduct, setSearchProduct] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('todas');
  const [selectedProductIds, setSelectedProductIds] = useState<Set<string>>(new Set());

  // Estados para Busca de Vendedores
  const [searchSeller, setSearchSeller] = useState('');

  // Estados para Reajuste em Massa de Preços
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [bulkType, setBulkType] = useState<'percent' | 'fixed'>('percent');
  const [bulkValue, setBulkValue] = useState<number>(5);
  const [bulkTarget, setBulkTarget] = useState<'all' | 'category' | 'selected'>('all');
  const [bulkCategoryId, setBulkCategoryId] = useState<string>(categorias[0]?.id || '');
  const [bulkUpdatePrecoAnterior, setBulkUpdatePrecoAnterior] = useState(true);
  const [bulkLoading, setBulkLoading] = useState(false);

  // Produtos filtrados na visão admin
  const filteredAdminProdutos = useMemo(() => {
    const term = searchProduct.toLowerCase().trim();
    return produtos.filter(p => {
      const matchesCategory = filterCategory === 'todas' || p.categoria_id === filterCategory;
      if (!matchesCategory) return false;
      if (!term) return true;
      const matchNome = p.nome.toLowerCase().includes(term);
      const matchSku = p.sku ? p.sku.toLowerCase().includes(term) : false;
      const matchUnidade = getUnidadeLabel(p.unidade_tipo, p.peso_unitario).toLowerCase().includes(term);
      const matchCat = p.categoria?.nome ? p.categoria.nome.toLowerCase().includes(term) : false;
      return matchNome || matchSku || matchUnidade || matchCat;
    });
  }, [produtos, searchProduct, filterCategory]);

  // Vendedores filtrados
  const filteredAdminVendedores = useMemo(() => {
    const term = searchSeller.toLowerCase().trim();
    if (!term) return vendedores;
    return vendedores.filter(v =>
      v.full_name.toLowerCase().includes(term) ||
      v.email.toLowerCase().includes(term) ||
      (v.phone && v.phone.toLowerCase().includes(term))
    );
  }, [vendedores, searchSeller]);

  // Produtos selecionados para o lote de reajuste
  const bulkTargetProducts = useMemo(() => {
    return produtos.filter(p => {
      if (bulkTarget === 'selected') return selectedProductIds.has(p.id);
      if (bulkTarget === 'category') return p.categoria_id === bulkCategoryId;
      return true; // 'all'
    });
  }, [produtos, bulkTarget, selectedProductIds, bulkCategoryId]);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setFeedbackMsg({ type, text });
    setTimeout(() => setFeedbackMsg(null), 3500);
  };

  // Aplicação do Reajuste em Massa
  const handleApplyBulkPrice = async () => {
    if (bulkTargetProducts.length === 0) {
      showToast('Nenhum produto selecionado para o reajuste.', 'error');
      return;
    }

    setBulkLoading(true);
    try {
      const updatedMap = new Map<string, { preco_base: number; preco_anterior: number }>();

      bulkTargetProducts.forEach(p => {
        const precoAtual = p.preco_base;
        let novoPreco = precoAtual;
        if (bulkType === 'percent') {
          novoPreco = precoAtual * (1 + bulkValue / 100);
        } else {
          novoPreco = precoAtual + bulkValue;
        }
        novoPreco = Math.max(0.01, Number(novoPreco.toFixed(2)));

        updatedMap.set(p.id, {
          preco_base: novoPreco,
          preco_anterior: bulkUpdatePrecoAnterior ? precoAtual : (p.preco_anterior ?? precoAtual)
        });
      });

      // Atualiza banco Supabase com fallback resiliente
      const promises = Array.from(updatedMap.entries()).map(([id, changes]) =>
        supabase
          .from('produtos')
          .update({
            preco_base: changes.preco_base,
            preco_anterior: changes.preco_anterior,
            updated_at: new Date().toISOString()
          })
          .eq('id', id)
      );

      await Promise.allSettled(promises);

      // Atualiza cache local imediatamente
      try {
        const cached = localStorage.getItem('harpia_cached_produtos_v8');
        if (cached) {
          const parsed: Produto[] = JSON.parse(cached);
          const nextList = parsed.map(prod => {
            const ch = updatedMap.get(prod.id);
            if (ch) {
              return {
                ...prod,
                preco_base: ch.preco_base,
                preco_anterior: ch.preco_anterior
              };
            }
            return prod;
          });
          localStorage.setItem('harpia_cached_produtos_v8', JSON.stringify(nextList));
        }
      } catch (e) {
        console.warn('Erro ao atualizar cache local:', e);
      }

      showToast(`Reajuste aplicado com sucesso a ${bulkTargetProducts.length} produtos!`);
      setIsBulkModalOpen(false);
      setSelectedProductIds(new Set());
      onRefresh();
    } catch (err: any) {
      showToast(err.message || 'Erro ao aplicar reajuste em massa', 'error');
    } finally {
      setBulkLoading(false);
    }
  };

  // Salvar Produto (Novo ou Edição)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const precoAntVal = Number(productForm.preco_anterior) || null;
      const payload: any = {
        nome: productForm.nome,
        sku: productForm.sku || null,
        categoria_id: productForm.categoria_id || null,
        unidade_tipo: productForm.unidade_tipo,
        peso_unitario: Number(productForm.peso_unitario) || null,
        preco_base: Number(productForm.preco_base) || 0,
        preco_anterior: precoAntVal,
        indicacoes: productForm.indicacoes || null,
        consumo_recomendado: productForm.consumo_recomendado || null,
        descricao: productForm.descricao || null,
        ativo: productForm.ativo
      };

      if (editingProduct) {
        payload.updated_at = new Date().toISOString();
        let { error } = await supabase
          .from('produtos')
          .update(payload)
          .eq('id', editingProduct.id);

        // Fallback resiliente se a coluna preco_anterior ainda não existir no Postgres remoto
        if (error && error.message?.includes('preco_anterior')) {
          delete payload.preco_anterior;
          payload.preco_minimo = precoAntVal;
          const retry = await supabase.from('produtos').update(payload).eq('id', editingProduct.id);
          error = retry.error;
        }

        if (error) throw error;
        showToast('Produto atualizado com sucesso!');
      } else {
        let { error } = await supabase
          .from('produtos')
          .insert(payload);

        // Fallback resiliente se a coluna preco_anterior ainda não existir no Postgres remoto
        if (error && error.message?.includes('preco_anterior')) {
          delete payload.preco_anterior;
          payload.preco_minimo = precoAntVal;
          const retry = await supabase.from('produtos').insert(payload);
          error = retry.error;
        }

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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-slate-800 text-base">Tabela de Preços e Padrões Oficiais</h3>
              <p className="text-xs text-slate-500">
                Gerencie preços base, compare com a tabela anterior ou aplique reajustes em massa.
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
              {/* Botão Reajuste em Massa */}
              <button
                type="button"
                onClick={() => setIsBulkModalOpen(true)}
                className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs sm:text-sm font-black px-3.5 py-2 rounded-xl shadow-xs transition active:scale-95"
                title="Alterar preços em massa por porcentagem ou valor fixo"
              >
                <Sparkles size={16} />
                <span>Reajuste em Massa</span>
              </button>

              {/* Botão Novo Produto */}
              <button
                type="button"
                onClick={() => {
                  setEditingProduct(null);
                  setProductForm({
                    nome: '',
                    sku: '',
                    categoria_id: categorias[0]?.id || '',
                    unidade_tipo: 'saco',
                    peso_unitario: 30,
                    preco_base: 0,
                    preco_anterior: 0,
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
          </div>

          {/* BARRA DE PESQUISA & FILTROS DE PRODUTO */}
          <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-2.5">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2.5">
              {/* Campo de Busca */}
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar produto por nome (ex: Lac 22, Ouro), SKU (HAR-MILK), embalagem..."
                  value={searchProduct}
                  onChange={(e) => setSearchProduct(e.target.value)}
                  className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-[#006837] focus:bg-white transition"
                />
                {searchProduct && (
                  <button
                    onClick={() => setSearchProduct('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-md"
                    title="Limpar busca"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Filtro por Categoria */}
              <div className="flex items-center gap-1.5 shrink-0">
                <Filter size={15} className="text-slate-400 hidden sm:block" />
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="w-full sm:w-auto px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-[#006837]"
                >
                  <option value="todas">Todas as Categorias ({produtos.length})</option>
                  {categorias.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nome} ({produtos.filter((p) => p.categoria_id === c.id).length})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Linha de status e seleção rápida */}
            <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100 flex-wrap gap-2">
              <span className="font-medium">
                {filteredAdminProdutos.length === produtos.length
                  ? `Total de ${produtos.length} produtos cadastrados`
                  : `Exibindo ${filteredAdminProdutos.length} de ${produtos.length} produtos`}
              </span>

              {selectedProductIds.size > 0 && (
                <div className="flex items-center gap-2">
                  <span className="font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                    {selectedProductIds.size} selecionado(s)
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setBulkTarget('selected');
                      setIsBulkModalOpen(true);
                    }}
                    className="font-bold text-[#006837] hover:underline"
                  >
                    Reajustar selecionados
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedProductIds(new Set())}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    (Limpar seleção)
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[11px] tracking-wider">
                  <tr>
                    <th className="px-3 py-3 w-10 text-center">
                      <input
                        type="checkbox"
                        checked={
                          filteredAdminProdutos.length > 0 &&
                          filteredAdminProdutos.every((p) => selectedProductIds.has(p.id))
                        }
                        onChange={(e) => {
                          if (e.target.checked) {
                            const newSet = new Set(selectedProductIds);
                            filteredAdminProdutos.forEach((p) => newSet.add(p.id));
                            setSelectedProductIds(newSet);
                          } else {
                            const newSet = new Set(selectedProductIds);
                            filteredAdminProdutos.forEach((p) => newSet.delete(p.id));
                            setSelectedProductIds(newSet);
                          }
                        }}
                        className="w-4 h-4 rounded text-[#006837] border-slate-300 focus:ring-[#006837]"
                        title="Selecionar todos os visíveis"
                      />
                    </th>
                    <th className="px-3 py-3">Produto</th>
                    <th className="px-3 py-3">Categoria</th>
                    <th className="px-3 py-3">Embalagem</th>
                    <th className="px-3 py-3">Indicação & Consumo</th>
                    <th className="px-3 py-3 text-right">Preço Base Atual</th>
                    <th className="px-3 py-3 text-right">Preço Anterior (Comparativo)</th>
                    <th className="px-3 py-3 text-center">Status</th>
                    <th className="px-4 py-3 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredAdminProdutos.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="px-4 py-12 text-center text-slate-500">
                        <AlertCircle size={32} className="mx-auto text-slate-400 mb-2" />
                        <p className="font-bold text-slate-700">Nenhum produto encontrado</p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Tente alterar os termos de busca ou selecionar outra categoria.
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            setSearchProduct('');
                            setFilterCategory('todas');
                          }}
                          className="mt-3 text-xs font-bold text-[#006837] bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition"
                        >
                          Limpar busca e filtros
                        </button>
                      </td>
                    </tr>
                  ) : (
                    filteredAdminProdutos.map((p) => {
                      const precoAnt = p.preco_anterior ?? p.preco_minimo;
                      const diff = precoAnt && p.preco_base ? p.preco_base - precoAnt : 0;
                      const diffPercent = precoAnt && precoAnt > 0 ? (diff / precoAnt) * 100 : 0;
                      const isChecked = selectedProductIds.has(p.id);

                      return (
                        <tr
                          key={p.id}
                          className={`hover:bg-slate-50/60 transition ${
                            isChecked ? 'bg-amber-50/40' : ''
                          }`}
                        >
                          <td className="px-3 py-3 text-center">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) => {
                                const newSet = new Set(selectedProductIds);
                                if (e.target.checked) {
                                  newSet.add(p.id);
                                } else {
                                  newSet.delete(p.id);
                                }
                                setSelectedProductIds(newSet);
                              }}
                              className="w-4 h-4 rounded text-[#006837] border-slate-300 focus:ring-[#006837]"
                            />
                          </td>
                          <td className="px-3 py-3">
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
                          <td className="px-3 py-3 text-right">
                            {precoAnt ? (
                              <div className="flex flex-col items-end">
                                <span className="font-semibold text-slate-700">
                                  {formatCurrency(precoAnt)}
                                </span>
                                {diff !== 0 && (
                                  <span
                                    className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded mt-0.5 inline-flex items-center gap-0.5 ${
                                      diff > 0
                                        ? 'text-amber-800 bg-amber-50 border border-amber-200'
                                        : 'text-emerald-800 bg-emerald-50 border border-emerald-200'
                                    }`}
                                    title={`Diferença em relação à tabela anterior: ${diff > 0 ? '+' : ''}${formatCurrency(diff)}`}
                                  >
                                    {diff > 0 ? `+${diffPercent.toFixed(1)}%` : `${diffPercent.toFixed(1)}%`}
                                  </span>
                                )}
                              </div>
                            ) : (
                              <span className="text-slate-400">—</span>
                            )}
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
                                    preco_anterior: p.preco_anterior ?? p.preco_minimo ?? 0,
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
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* CONTEÚDO DA ABA 2: VENDEDORES & COMISSÕES */}
      {activeTab === 'vendedores' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-slate-800 text-base">Representantes e Vendedores</h3>
              <p className="text-xs text-slate-500">
                Configure a porcentagem de comissão individual que cada vendedor recebe sobre as vendas.
              </p>
            </div>
            <button
              onClick={() => setIsSellerModalOpen(true)}
              className="inline-flex items-center gap-1.5 bg-[#006837] hover:bg-[#00522c] text-white text-xs sm:text-sm font-semibold px-3.5 py-2 rounded-xl shadow-xs transition self-start sm:self-auto"
            >
              <Plus size={16} />
              <span>Novo Vendedor</span>
            </button>
          </div>

          {/* BARRA DE PESQUISA DE VENDEDORES */}
          <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar vendedor por nome, e-mail ou WhatsApp..."
                value={searchSeller}
                onChange={(e) => setSearchSeller(e.target.value)}
                className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-[#006837] focus:bg-white transition"
              />
              {searchSeller && (
                <button
                  onClick={() => setSearchSeller('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-md"
                  title="Limpar busca"
                >
                  <X size={14} />
                </button>
              )}
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
              <span className="font-medium">
                {filteredAdminVendedores.length === vendedores.length
                  ? `Total de ${vendedores.length} vendedores cadastrados`
                  : `Exibindo ${filteredAdminVendedores.length} de ${vendedores.length} vendedores`}
              </span>
            </div>
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
                  {filteredAdminVendedores.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                        Nenhum vendedor encontrado com o termo "{searchSeller}".
                      </td>
                    </tr>
                  ) : (
                    filteredAdminVendedores.map((v) => {
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
                  })
                )}
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
                    Preço Anterior para Comparação (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="85.00"
                    value={productForm.preco_anterior}
                    onChange={(e) => setProductForm({ ...productForm, preco_anterior: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#006837] focus:outline-hidden"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    Visível somente para perfil administrador
                  </span>
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

      {/* MODAL REAJUSTE EM MASSA DE PREÇOS */}
      {isBulkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto">
            {/* Cabeçalho */}
            <div className="bg-gradient-to-r from-emerald-800 to-[#006837] text-white p-5 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-white/10 rounded-xl backdrop-blur-xs border border-white/20">
                  <Sparkles size={22} className="text-amber-300" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base sm:text-lg">Reajuste de Preços em Massa</h3>
                  <p className="text-xs text-emerald-100/90 mt-0.5">
                    Atualize os preços de múltiplos produtos simultaneamente com rapidez e segurança.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsBulkModalOpen(false)}
                className="p-1 rounded-lg text-emerald-100/80 hover:text-white hover:bg-white/10 transition"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-5 sm:p-6 space-y-5 text-xs sm:text-sm">
              {/* 1. Escolha do Escopo */}
              <div>
                <label className="block font-bold text-slate-800 mb-2">1. Escolha quais produtos reajustar:</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setBulkTarget('all')}
                    className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                      bulkTarget === 'all'
                        ? 'border-[#006837] bg-emerald-50/60 ring-2 ring-[#006837]/20 font-bold text-[#006837]'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span className="text-xs font-bold block">Todos os Produtos</span>
                    <span className="text-[11px] text-slate-500 mt-1">{produtos.length} produtos</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setBulkTarget('category')}
                    className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                      bulkTarget === 'category'
                        ? 'border-[#006837] bg-emerald-50/60 ring-2 ring-[#006837]/20 font-bold text-[#006837]'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span className="text-xs font-bold block">Por Categoria</span>
                    <span className="text-[11px] text-slate-500 mt-1">Filtrar por grupo</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setBulkTarget('selected')}
                    className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                      bulkTarget === 'selected'
                        ? 'border-[#006837] bg-emerald-50/60 ring-2 ring-[#006837]/20 font-bold text-[#006837]'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span className="text-xs font-bold block">Selecionados</span>
                    <span className="text-[11px] text-slate-500 mt-1">
                      {selectedProductIds.size} selecionado(s)
                    </span>
                  </button>
                </div>

                {bulkTarget === 'category' && (
                  <div className="mt-2.5 p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Selecione a Categoria:
                    </label>
                    <select
                      value={bulkCategoryId}
                      onChange={(e) => setBulkCategoryId(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-[#006837]"
                    >
                      {categorias.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.nome} ({produtos.filter((p) => p.categoria_id === cat.id).length} itens)
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {bulkTarget === 'selected' && selectedProductIds.size === 0 && (
                  <p className="mt-2 text-xs text-amber-700 bg-amber-50 p-2 rounded-lg border border-amber-200">
                    Nenhum produto marcado com checkbox na tabela. Marque os produtos desejados ou escolha outra opção acima.
                  </p>
                )}
              </div>

              {/* 2. Tipo e Valor do Reajuste */}
              <div>
                <label className="block font-bold text-slate-800 mb-2">2. Regra de Reajuste:</label>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <div className="inline-flex rounded-xl border border-slate-300 p-0.5 bg-slate-100 shrink-0">
                    <button
                      type="button"
                      onClick={() => setBulkType('percent')}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition ${
                        bulkType === 'percent'
                          ? 'bg-white text-[#006837] shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Percent size={14} />
                      <span>Porcentagem (%)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setBulkType('fixed')}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition ${
                        bulkType === 'fixed'
                          ? 'bg-white text-[#006837] shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <DollarSign size={14} />
                      <span>Valor Fixo (R$)</span>
                    </button>
                  </div>

                  <div className="relative flex-1">
                    <input
                      type="number"
                      step={bulkType === 'percent' ? '0.1' : '0.50'}
                      value={bulkValue}
                      onChange={(e) => setBulkValue(Number(e.target.value))}
                      className="w-full px-3 py-2 text-base font-extrabold text-slate-900 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#006837] focus:outline-hidden"
                      placeholder="0"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                      {bulkType === 'percent' ? '%' : 'R$'}
                    </span>
                  </div>
                </div>

                {/* Botões de Atalho */}
                <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                  <span className="text-[11px] text-slate-400 mr-1 font-medium">Atalhos rápidos:</span>
                  {bulkType === 'percent' ? (
                    <>
                      {[3, 5, 8, 10, 12, 15].map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setBulkValue(val)}
                          className="px-2.5 py-1 text-xs font-bold bg-slate-100 hover:bg-emerald-100 hover:text-[#006837] text-slate-700 rounded-lg transition"
                        >
                          +{val}%
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() => setBulkValue(-5)}
                        className="px-2.5 py-1 text-xs font-bold bg-slate-100 hover:bg-red-100 hover:text-red-700 text-slate-700 rounded-lg transition"
                      >
                        -5%
                      </button>
                    </>
                  ) : (
                    <>
                      {[1, 2, 3, 5, 10].map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setBulkValue(val)}
                          className="px-2.5 py-1 text-xs font-bold bg-slate-100 hover:bg-emerald-100 hover:text-[#006837] text-slate-700 rounded-lg transition"
                        >
                          +R$ {val},00
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() => setBulkValue(-2)}
                        className="px-2.5 py-1 text-xs font-bold bg-slate-100 hover:bg-red-100 hover:text-red-700 text-slate-700 rounded-lg transition"
                      >
                        -R$ 2,00
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* 3. Checkbox de Comparativo */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={bulkUpdatePrecoAnterior}
                    onChange={(e) => setBulkUpdatePrecoAnterior(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded text-[#006837] border-slate-300 focus:ring-[#006837]"
                  />
                  <div>
                    <span className="font-bold text-slate-800 block text-xs sm:text-sm">
                      Salvar preço atual como "Preço Anterior" (Comparativo)
                    </span>
                    <span className="text-[11px] text-slate-500 block mt-0.5">
                      Permite que administradores vejam claramente a coluna comparativa (De / Para) e a variação percentual na tabela de produtos.
                    </span>
                  </div>
                </label>
              </div>

              {/* 4. Preview de Amostra */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-700">Prévia de Cálculo (Exemplo de Itens):</span>
                  <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    {bulkTargetProducts.length} produto(s) no lote
                  </span>
                </div>

                {bulkTargetProducts.length === 0 ? (
                  <div className="p-4 bg-slate-50 rounded-xl text-center text-slate-400 text-xs">
                    Nenhum produto selecionado para a prévia.
                  </div>
                ) : (
                  <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 max-h-40 overflow-y-auto">
                    {bulkTargetProducts.slice(0, 4).map((p) => {
                      const atual = p.preco_base;
                      let novo = bulkType === 'percent' ? atual * (1 + bulkValue / 100) : atual + bulkValue;
                      novo = Math.max(0.01, Number(novo.toFixed(2)));
                      const diff = novo - atual;
                      const diffPct = atual > 0 ? (diff / atual) * 100 : 0;
                      return (
                        <div key={p.id} className="p-2.5 flex items-center justify-between text-xs bg-white hover:bg-slate-50">
                          <div className="truncate pr-2">
                            <span className="font-semibold text-slate-900 block truncate">{p.nome}</span>
                            <span className="text-[10px] text-slate-400">
                              {getUnidadeLabel(p.unidade_tipo, p.peso_unitario)}
                            </span>
                          </div>
                          <div className="text-right shrink-0 flex items-center gap-3">
                            <div>
                              <span className="text-[10px] text-slate-400 block line-through">
                                {formatCurrency(atual)}
                              </span>
                              <span className="font-bold text-slate-900 block">
                                {formatCurrency(novo)}
                              </span>
                            </div>
                            <span
                              className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded ${
                                diff >= 0
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {diff >= 0 ? '+' : ''}{diffPct.toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      );
                    })}
                    {bulkTargetProducts.length > 4 && (
                      <div className="p-2 bg-slate-50 text-center text-[11px] text-slate-500 font-medium">
                        ... e mais {bulkTargetProducts.length - 4} outros produtos
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Rodapé com botões de ação */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setIsBulkModalOpen(false)}
                disabled={bulkLoading}
                className="px-4 py-2 border border-slate-300 text-slate-600 rounded-xl hover:bg-white font-medium text-xs sm:text-sm transition"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleApplyBulkPrice}
                disabled={bulkLoading || bulkTargetProducts.length === 0}
                className="inline-flex items-center gap-2 px-5 py-2 bg-[#006837] hover:bg-[#00522c] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-xs transition text-xs sm:text-sm"
              >
                {bulkLoading ? (
                  <>
                    <RefreshCw size={15} className="animate-spin" />
                    <span>Aplicando Reajuste...</span>
                  </>
                ) : (
                  <>
                    <TrendingUp size={15} />
                    <span>Aplicar Reajuste ({bulkTargetProducts.length} itens)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
