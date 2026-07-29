# ⚡ ContaFlash — Contas Digitais com 1 Mês de Acesso

Site institucional e de vendas da **ContaFlash**. Produto em destaque: **ChatGPT Plus (1 Mês) por R$ 29,90**.

> Vendemos o **produto pronto** (conta com 1 mês já pago) — não é assinatura recorrente.

---

## 🚀 Deploy na Vercel

### Opção A — Pelo site (mais fácil)
1. Suba esta pasta para um repositório no GitHub.
2. Acesse [vercel.com/new](https://vercel.com/new) e importe o repositório.
3. Em **Framework Preset**, selecione **Other**.
4. Deixe *Build Command* e *Output Directory* **em branco** (é site estático).
5. Clique em **Deploy**. Pronto ✅

### Opção B — Pela CLI
```bash
npm i -g vercel
vercel login
vercel --prod
```

### Após o deploy
Atualize o domínio real em dois arquivos:
- `robots.txt` → linha do `Sitemap:`
- `sitemap.xml` → todas as tags `<loc>`

---

## 🔗 Canais de venda

| Canal | Link | Status |
|---|---|---|
| **Stripe** ⭐ | `https://buy.stripe.com/6oUbJ2e7m2H429o3T3fnO01` | **Recomendado** — aprovação instantânea |
| GGMax | `https://ggmax.com.br/anuncio/conta-chatgpt-plus-mensal-acesso-exclusivo` | Alternativa com intermediação |
| WhatsApp | `(31) 98292-4858` | Atendimento humano |
| Instagram | `@contaf1sh` | Novidades e reposições |
| Telegram | — | Indisponível no momento |

---

## 📦 Gerenciar o estoque

Todo o catálogo é controlado por um único objeto em `js/main.js`:

```js
const STOCK_DATA = {
  'chatgpt-plus': {
    stock: 14,          // ← altere a quantidade
    inStock: true,      // ← true = à venda | false = esgotado
    price: 'R$ 29,90',
    badge: '🔥 14 unidades em estoque',
    stripeUrl: STRIPE_CHECKOUT_URL
  },
  ...
}
```

**Ao marcar `inStock: false`**, o site automaticamente:
- troca a imagem pelo **banner ContaFlash**;
- muda o selo para `🚫 Esgotado`;
- transforma o botão em `🔔 Falar com Suporte`.

Para **adicionar um produto novo**, basta criar a entrada no `STOCK_DATA` e um card com
`data-product-id="seu-id"` em `pages/produtos.html`.

---

## 🛡️ Garantia

**Garantia Imediata de 24 horas** — o acesso é testado junto com o cliente no
momento da entrega. Qualquer falha de login nesse período é trocada na hora,
sem formulário e sem espera. O suporte segue disponível o mês todo para dúvidas de uso.

---

## 💬 Chatbot de Suporte

Widget flutuante `💬 Suporte 24h` com base de conhecimento própria que responde sobre:
preço, formas de pagamento, prazo de entrega, estoque, garantia, funcionamento,
diferença de assinatura e canais de contato — sempre indicando o **Stripe como opção recomendada**.

### Conectar a uma API externa (opcional)
Em `js/main.js`, defina o endpoint:
```js
const WEBHOOK_SUPPORT_ENDPOINT = 'https://sua-api.com/suporte';
```
O chat envia `POST { message, phone }` e espera `{ reply: "texto" }`.
Se a API falhar, o motor interno assume automaticamente.

---

## 🎬 Animações

Todas as animações usam curvas lentas e suaves (`cubic-bezier(.22,1,.36,1)`):

| Elemento | Duração |
|---|---|
| Scroll reveal | 1s + stagger de 110ms |
| Gradiente do hero | 34s |
| Marquee de marcas | 55s |
| Contadores | 2,8s |
| Slider de depoimentos | 7,5s |

O reveal **remove suas próprias classes ao terminar**, eliminando o conflito de
`transform` com o `:hover` dos cards (causa dos tremores anteriores).
Também respeita `prefers-reduced-motion`.

---

## 📁 Estrutura

```
├── index.html                  # Home
├── 404.html                    # Página de erro
├── pages/
│   ├── produto-chatgpt.html    # Página do produto
│   ├── produtos.html           # Catálogo
│   ├── sobre.html
│   ├── faq.html
│   └── contato.html
├── css/style.css               # Design system completo
├── js/main.js                  # Estoque, chatbot, animações
├── vercel.json                 # Headers, cache, redirects
├── manifest.json               # PWA
├── robots.txt · sitemap.xml    # SEO
└── README.md
```

## 🔒 Segurança (via `vercel.json`)
CSP com allowlist do Stripe · HSTS · X-Frame-Options · nosniff ·
Referrer-Policy · Permissions-Policy · sanitização de inputs contra XSS.

---

**ContaFlash** · Instagram [@contaf1sh](https://instagram.com/contaf1sh) · WhatsApp (31) 98292-4858
