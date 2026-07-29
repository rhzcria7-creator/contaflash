# ⚡ ContaFlash

Site profissional **multipage** para venda de serviços digitais premium (streaming, IA, música, jogos) com **checkout automatizado via Stripe** e deploy na **Vercel**.

Design editorial estilo ChatGPT/OpenAI: fundo neutro quente, tipografia Inter + Instrument Serif, acento verde `#10A37F`, animações suaves. Construído com **HTML5, CSS3 e JavaScript puro** no front + **funções serverless Node** para pagamento.

---

## 📁 Estrutura

```
contaflash/
├── index.html            # Home
├── css/style.css         # Design system
├── js/main.js            # Interatividade + checkout Stripe
├── pages/
│   ├── produtos.html     # Catálogo (compra via Stripe Checkout)
│   ├── sobre.html
│   ├── faq.html
│   ├── contato.html
│   └── sucesso.html      # Pós-pagamento (retorno do Stripe)
├── api/
│   ├── checkout.js       # Cria sessão do Stripe Checkout
│   └── webhook.js        # Confirmação de pagamento (webhook)
├── package.json          # Dependência: stripe
├── vercel.json           # Headers de segurança + funções
├── manifest.json         # PWA
├── .env.example          # Variáveis de ambiente (modelo)
└── .gitignore
```

---

## 💳 Fluxo de compra (Stripe Checkout)

1. Cliente clica em **"Assinar Agora"** em um produto.
2. `js/main.js` faz `POST /api/checkout` enviando **apenas o `productId`**.
3. `api/checkout.js` valida o ID contra uma **whitelist no servidor** (preço nunca vem do cliente) e cria uma sessão do **Stripe Checkout**.
4. Cliente é redirecionado para a página hospedada do Stripe (cartão → **PCI-DSS 100% com o Stripe**).
5. Pago → retorna para `pages/sucesso.html`. Cancelado → volta para `produtos.html?cancelado=1` (mostra aviso).
6. Stripe chama `api/webhook.js` (com **assinatura verificada**) para confirmar e entregar o produto.

### 🔐 Por que é seguro
- Preços e nomes vivem **somente no servidor** (`api/checkout.js`); o cliente não pode adulterar valores.
- Dados de cartão **nunca tocam seu servidor** (Stripe Checkout hospedado).
- Webhook com **verificação de assinatura** (`STRIPE_WEBHOOK_SECRET`).
- Rate limit simples por IP + headers de segurança (CSP, HSTS, etc.) no `vercel.json`.
- Sanitização contra XSS no front (`textContent` em toasts, escape em formulários).

---

## 🚀 Deploy na Vercel (passo a passo)

### 1. Suba o código
```bash
git init && git add . && git commit -m "ContaFlash"
git remote add origin https://github.com/SEU_USUARIO/contaflash.git
git push -u origin main
```

### 2. Configure as chaves do Stripe
No [Stripe Dashboard](https://dashboard.stripe.com) → **Developers → API Keys**, copie a **Secret key** (`sk_live_...`).

### 3. Importe na Vercel
1. Acesse [vercel.com](https://vercel.com) → **Add New → Project** → importe o repositório.
2. A Vercel detecta as funções em `api/` automaticamente.
3. Em **Settings → Environment Variables**, adicione:
   | Variável | Valor |
   |----------|-------|
   | `STRIPE_SECRET_KEY` | `sk_live_sua_chave` |
   | `STRIPE_WEBHOOK_SECRET` | `whsec_...` (passo 4) |
4. **Deploy**.

### 4. Crie o Webhook no Stripe
1. Stripe Dashboard → **Developers → Webhooks → Add endpoint**.
2. URL: `https://SEU-DOMINIO.vercel.app/api/webhook`
3. Eventos: `checkout.session.completed`
4. Copie o **Signing secret** (`whsec_...`) e adicione como `STRIPE_WEBHOOK_SECRET` na Vercel.
5. **Redeploy** para a variável fazer efeito.

### 5. Teste
- Use o cartão de teste `4242 4242 4242 4242` (qualquer data/CVV futuros) com as chaves `sk_test_...` durante os testes.

> **Entrega automática:** em `api/webhook.js`, no bloco `checkout.session.completed`, chame sua rotina de envio de credenciais (e-mail/WhatsApp/API de contas).

---

## 🎨 Personalizar

**Preços/produtos:** edite a whitelist `PRODUCTS` em `api/checkout.js` (valores em **centavos**: R$ 19,90 = `1990`) e os cards em `pages/produtos.html` (atributo `data-product` deve bater com a chave da whitelist).

**Cores:** variáveis em `:root` no `css/style.css` (`--bg`, `--ink`, `--accent`).

**WhatsApp:** número `5531982924858` nos links `wa.me` e em `pages/sucesso.html`.

---

## 🏃 Rodar localmente

O checkout **exige servidor** (funções serverless). Use o CLI da Vercel:
```bash
npm install
npm i -g vercel
vercel login
vercel dev        # sobe o site + /api em http://localhost:3000
```
> Sem o Vercel CLI, as páginas navegam normalmente, mas o botão de compra precisa do backend.

---

## 📱 PWA & SEO
`manifest.json` (instalável) + meta tags, Open Graph e `theme-color` em cada página.

© 2026 ContaFlash. Feito com 💚 no Brasil.
