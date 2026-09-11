# Harpia Nutrição Animal — App Mobile-First de Preços & Comissões (PWA)

Sistema web mobile-first com suporte a PWA (Progressive Web App) desenvolvido para a fábrica de ração animal **Harpia Nutrição Animal**.

---

## 🚀 Funcionalidades Principais

- **Portal do Vendedor / Consultor (Mobile-First):**
  - Catálogo completo com 59 produtos oficiais (Leite, Corte Rações, Minerais Harphos, Equinos, Aves, Suínos, Ovinos e Insumos).
  - Exibição de **Preço de Tabela**, padrão da embalagem (Sacos 25kg, 30kg, 40kg, 50kg ou Big Bag 1.000kg), indicações de uso e consumo recomendado.
  - Cálculo automático da **comissão individual** do vendedor em percentual (%) e valor líquido (R$).
  - Simulador de propostas em campo com cálculo de total do pedido e comissão.
  - Compartilhamento instantâneo de orçamentos técnicos pelo **WhatsApp**.
  - Busca instantânea e filtros rápidos por categorias.

- **Painel de Gestão da Fábrica (Administrador):**
  - Cadastro e edição de produtos, preços de tabela, piso mínimo negociável, sacarias e dosagens.
  - Gestão de vendedores com configuração da **porcentagem individual de comissão**.
  - Gestão de categorias de ração.

- **Tecnologia PWA (Instalável no Celular):**
  - Instalável em smartphones **Android** e **iOS (iPhone/iPad)** via Safari.
  - Suporte a **Modo Offline** com cache de dados (Service Worker via Workbox).

- **Backend Supabase:**
  - Banco de dados PostgreSQL com Row Level Security (RLS).
  - Sincronização em nuvem na região de São Paulo (`sa-east-1`).

---

## 🛠️ Stack Tecnológica

- **Frontend:** React 19 + TypeScript + Vite
- **Estilização:** Tailwind CSS v4
- **Ícones:** Lucide React
- **PWA:** `vite-plugin-pwa` (Workbox Service Worker & Web Manifest)
- **Manipulação de Imagens:** Sharp
- **Backend & Banco de Dados:** Supabase (PostgreSQL + Auth + RLS)

---

## 💻 Como Rodar Localmente

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/gabriel77gregorio-sketch/precos-harpia.git
   cd precos-harpia
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente:**
   Copie `.env.example` para `.env`:
   ```bash
   cp .env.example .env
   ```

4. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev -- --host
   ```
   Acesse em: `http://localhost:5173/`

5. **Build de Produção:**
   ```bash
   npm run build
   ```

---

## 📄 Licença
Propriedade da Harpia Nutrição Animal. Todos os direitos reservados.
