# ⚡ ContaFlash - Serviços Digitais Premium (1 Mês de Acesso)

Plataforma multipage completa para a **ContaFlash**, especializada na venda de contas prontas com **1 Mês Pago** (produtos únicos, não assinaturas recorrentes).

## 🚀 Requisitos e Tecnologias

- **HTML5**, **CSS3** e **JavaScript PURO**
- **Design System Editorial / ChatGPT-Inspired** (fundo quente, tipografia refinada)
- **Link Direto Stripe Checkout com Desconto**: `https://buy.stripe.com/6oUbJ2e7m2H429o3T3fnO01`
- **Gerenciador de Estoque Autônomo** (`STOCK_DATA`)
- **Suporte Autônomo Interativo** (Chat de Suporte com respostas imediatas 24/7 + suporte a Webhook)
- **Redes Sociais Oficiais**:
  - 📸 **Instagram**: `@contaf1sh` (`https://instagram.com/contaf1sh`)
  - 💬 **WhatsApp**: `(31) 98292-4858` (`https://wa.me/5531982924858`)
  - ✈️ **Telegram**: `Indisponível no momento`
- **Pronto para Deploy na Vercel** com `vercel.json` configurado

## 📁 Estrutura do Projeto

```
├── index.html                 # Página principal com produto em destaque
├── pages/
│   ├── produto-chatgpt.html   # Página individual do ChatGPT Plus (1 Mês)
│   ├── produtos.html          # Catálogo completo com estoque autônomo
│   ├── sobre.html             # Proposta, valores e transparência
│   ├── faq.html               # Dúvidas sobre Stripe, 1 Mês e Estoque
│   └── contato.html           # Formulário de atendimento do Suporte
├── css/
│   └── style.css              # Design System, Suporte Chat e Modais
├── js/
│   └── main.js                # Lógica JS, Gerenciador de Estoque e Suporte Engine
├── manifest.json              # PWA Manifest
├── vercel.json                # CSP e segurança Vercel
└── README.md                  # Documentação
```

## ✨ Funcionalidades Principais

1. **Venda de Produtos Únicos (Sem Assinaturas)**:
   - Esclarecimento direto de que o produto é uma conta pronta de 1 mês pago.
   - Sem fidelidade, renovação automática ou cobranças surpresa no cartão.

2. **Página Dedicada do Produto**:
   - `pages/produto-chatgpt.html` com apresentação visual, preço promocional (`De R$ 50,00 por R$ 29,90`), contador de estoque e botão direto de compra.

3. **Gerenciador Autônomo de Estoque (`STOCK_DATA`)**:
   - Atualmente, **ChatGPT Plus** está em estoque (14 un.) liberado para compra com desconto.
   - Produtos esgotados exibem tag `🚫 Esgotado` e botão `🔔 Falar com Suporte`.

4. **Suporte Autônomo Interativo**:
   - Botão flutuante `💬 Suporte 24h` abre a janela de chat em tempo real.
   - Respostas inteligentes e imediatas sobre compras, estoques, link do Stripe e transferência para o WhatsApp.
   - Suporte a webhook externo caso seja configurada uma API de suporte.

5. **Contato e Redes Sociais Atualizadas**:
   - Instagram: `@contaf1sh`
   - WhatsApp: `(31) 98292-4858`
   - Telegram indicado como indisponível no momento.
   - Discord completamente removido.

---

Feito com ❤️ para a **ContaFlash** | Instagram: `@contaf1sh` | WhatsApp: `(31) 98292-4858`
