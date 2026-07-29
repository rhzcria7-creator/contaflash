/**
 * ContaFlash — Webhook do Stripe (confirmação de pagamento).
 * Configure no Stripe Dashboard: Developers > Webhooks > Add endpoint
 *   URL: https://SEU-DOMINIO.vercel.app/api/webhook
 *   Eventos: checkout.session.completed
 *
 * Segurança: a assinatura é verificada com STRIPE_WEBHOOK_SECRET.
 * Sem assinatura válida o evento é rejeitado (não confiamos em ninguém).
 */
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido' });

  const signature = req.headers['stripe-signature'];
  let event;

  try {
    // req.rawBody está disponível nas funções Node da Vercel
    event = stripe.webhooks.constructEvent(req.rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook: assinatura inválida →', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const productId = session.metadata ? session.metadata.productId : 'n/a';

    // >>> PONTO DE AUTOMAÇÃO <<<
    // Aqui você entrega o produto (envia credenciais por e-mail/WhatsApp,
    // chama sua API de contas, etc). Ex:
    // await enviarCredenciais(session.customer_details.email, productId);
    console.log(`Pagamento confirmado: ${session.id} | produto: ${productId} | valor: ${session.amount_total}`);
  }

  return res.status(200).json({ received: true });
};
