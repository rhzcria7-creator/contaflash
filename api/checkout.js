/**
 * ContaFlash — Cria uma sessão do Stripe Checkout.
 * Endpoint: POST /api/checkout  { "productId": "netflix" }
 *
 * Segurança:
 *  - O cliente envia APENAS o productId. Preços e nomes NUNCA vêm do cliente
 *    (evita adulteração de valor). Tudo é validado contra uma whitelist no servidor.
 *  - O cartão nunca toca nosso servidor (PCI-DSS fica 100% com o Stripe).
 */
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Whitelist de produtos (fonte única da verdade no servidor).
// unit_amount em CENTAVOS (R$ 14,90 = 1490).
const PRODUCTS = {
  netflix:   { name: 'Netflix Premium 4K',        desc: '4K Ultra HD, 4 telas - 30 dias',          amount: 1990 },
  disney:    { name: 'Disney+ Premium',           desc: '4K + HDR, downloads - 30 dias',           amount: 1490 },
  spotify:   { name: 'Spotify Premium',           desc: 'Sem anúncios, offline - 30 dias',         amount: 990 },
  chatgpt:   { name: 'ChatGPT Plus',              desc: 'GPT-4 + DALL-E 3 - 30 dias',              amount: 2990 },
  xbox:      { name: 'Xbox Game Pass Ultimate',   desc: 'Console + PC + Cloud - 30 dias',          amount: 2490 },
  midjourney:{ name: 'Midjourney Pro',            desc: 'Geração ilimitada - 30 dias',             amount: 3490 },
  max:       { name: 'Max (HBO Max)',             desc: 'HBO originais, 4K HDR - 30 dias',         amount: 1490 },
  canva:     { name: 'Canva Pro',                 desc: 'Templates premium - 30 dias',             amount: 1290 },
  deezer:    { name: 'Deezer Premium',            desc: 'HiFi, letras, mix IA - 30 dias',          amount: 890 }
};

// Rate limit simples em memória (por IP). Vercel pode reciclar instâncias,
// então é uma camada extra — a proteção principal fica por conta do Stripe.
const hits = new Map();
function rateLimited(ip) {
  const now = Date.now();
  const last = hits.get(ip) || 0;
  if (now - last < 1000) return true; // máx 1 req/seg por IP
  hits.set(ip, now);
  return false;
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido' });

  if (!process.env.STRIPE_SECRET_KEY) {
    return res.status(500).json({ error: 'Stripe não configurado. Defina STRIPE_SECRET_KEY.' });
  }

  const ip = req.headers['x-forwarded-for'] || 'unknown';
  if (rateLimited(ip)) return res.status(429).json({ error: 'Muitas requisições. Aguarde.' });

  const { productId } = req.body || {};
  const product = PRODUCTS[productId];
  if (!product) return res.status(400).json({ error: 'Produto inválido.' });

  try {
    const origin = req.headers.origin || 'https://contaflash.vercel.app';
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'brl',
          product_data: { name: product.name, description: product.desc },
          unit_amount: product.amount
        },
        quantity: 1
      }],
      success_url: `${origin}/pages/sucesso.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pages/produtos.html?cancelado=1`,
      metadata: { productId },
      automatic_tax: { enabled: false }
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('Erro ao criar sessão Stripe:', err.message);
    return res.status(500).json({ error: 'Falha ao iniciar o checkout.' });
  }
};
