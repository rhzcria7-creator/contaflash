/**
 * ContaFlash AI Sales Agent - Vercel Serverless Function
 * 
 * Recebe mensagens do chat do site e responde como vendedora profissional.
 * Usa OpenRouter (compatível com OpenAI) pra gerar respostas inteligentes.
 * 
 * ENV Vars necessárias no Vercel:
 * - OPENROUTER_API_KEY: Chave da API do OpenRouter (openrouter.ai)
 * - TELEGRAM_BOT_TOKEN: Token do bot Telegram (opcional, pra notificações)
 * - TELEGRAM_CHAT_ID: Seu chat ID no Telegram (opcional)
 * - SITE_URL: URL do site (ex: https://contaflash.com)
 */

// ==========================================
// DATABASE EM MEMÓRIA DE CONVERSAS
// (produção: usar Supabase/Redis)
// ==========================================
const conversations = new Map();

// ==========================================
// DADOS DOS PRODUTOS (espelho do STOCK_DATA do frontend)
// ==========================================
const PRODUCTS = {
  'chatgpt-plus': {
    id: 'chatgpt-plus',
    title: 'ChatGPT Plus (1 Mês de Acesso)',
    category: 'ferramentas',
    price: 'R$ 29,90',
    originalPrice: 'R$ 50,00',
    discount: '40% OFF',
    stock: 14,
    inStock: true,
    icon: '🤖',
    stripeUrl: 'https://buy.stripe.com/6oUbJ2e7m2H429o3T3fnO01',
    features: [
      'Acesso ao GPT-4 e GPT-4o liberado',
      'Geração de Imagens DALL-E 3',
      '1 Mês Pago sem cobrança recorrente',
      'Ativação imediata no WhatsApp ou Stripe',
      'Garantia de 30 dias'
    ],
    description: 'Conta individual pronta com 1 Mês de ChatGPT Plus ativado. Acesso total ao GPT-4, GPT-4o, DALL-E 3 e análise avançada.'
  },
  'netflix-4k': {
    id: 'netflix-4k', title: 'Netflix Premium 4K (1 Mês)', category: 'streaming',
    price: 'R$ 19,90', stock: 0, inStock: false, icon: '📺'
  },
  'spotify-premium': {
    id: 'spotify-premium', title: 'Spotify Premium (1 Mês)', category: 'musica',
    price: 'R$ 9,90', stock: 0, inStock: false, icon: '🎵'
  },
  'disney-plus': {
    id: 'disney-plus', title: 'Disney+ Premium (1 Mês)', category: 'streaming',
    price: 'R$ 14,90', stock: 0, inStock: false, icon: '🏰'
  },
  'xbox-gamepass': {
    id: 'xbox-gamepass', title: 'Xbox Game Pass Ultimate (1 Mês)', category: 'jogos',
    price: 'R$ 24,90', stock: 0, inStock: false, icon: '🎮'
  },
  'midjourney-pro': {
    id: 'midjourney-pro', title: 'Midjourney Pro (1 Mês)', category: 'ferramentas',
    price: 'R$ 34,90', stock: 0, inStock: false, icon: '🎨'
  },
  'hbo-max': {
    id: 'hbo-max', title: 'Max (HBO Max) (1 Mês)', category: 'streaming',
    price: 'R$ 14,90', stock: 0, inStock: false, icon: '🎬'
  },
  'canva-pro': {
    id: 'canva-pro', title: 'Canva Pro (1 Mês)', category: 'produtividade',
    price: 'R$ 12,90', stock: 0, inStock: false, icon: '🎯'
  },
  'deezer-premium': {
    id: 'deezer-premium', title: 'Deezer Premium (1 Mês)', category: 'musica',
    price: 'R$ 8,90', stock: 0, inStock: false, icon: '🎧'
  }
};

// ==========================================
// SISTEMA DE NOTIFICAÇÃO TELEGRAM
// ==========================================
async function notifyTelegram(message) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  
  if (!token || !chatId) return; // Silencioso se não configurado
  
  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML'
      })
    });
  } catch (err) {
    console.error('Telegram notify error:', err);
  }
}

// ==========================================
// SYSTEM PROMPT - PERSONA VENDEDORA
// ==========================================
function buildSystemPrompt() {
  const stockInfo = Object.values(PRODUCTS).map(p => 
    `- ${p.icon} ${p.title}: ${p.inStock ? `✅ ${p.stock} em estoque | ${p.price}` : '❌ Esgotado'}`
  ).join('\n');

  return `Você é a IA vendedora da ContaFlash — uma loja digital que vende contas prontas com 1 mês de acesso (NÃO assinaturas recorrentes).

## SUA IDENTIDADE
- Nome: ContaFlash AI
- Papel: Vendedora profissional — direta, honesta, eficiente
- Tom: Brusco/curto, técnico-respeitoso. Nada de "oi tudo bem!! 😍" — direto ao ponto.
- Nunca fala como robô. Fala como gente que entende do assunto.
- Máximo 3-4 linhas por resposta. Chat curto.

## PRODUTOS E ESTOQUE ATUAL
${stockInfo}

## REGRAS DE VENDA
1. Se o cliente pergunta sobre um produto → fala preço, estoque e manda o link de checkout
2. Se o produto está em estoque → informa quantidade + manda link Stripe com desconto
3. Se está esgotado → fala que está fora, oferece notificação quando voltar ou sugere alternativa
4. Se quer comprar → manda direto pro checkout Stripe, não enrola
5. Se tem dúvida → responde curto e direciona pro WhatsApp se precisar
6. NUNCA invente estoque que não existe. Só fala o que está nos dados.
7. Garantia: 30 dias em todos os produtos
8. Pagamento: Stripe Checkout (PIX ou Cartão com desconto)

## LINKS IMPORTANTES
- Stripe Checkout (ChatGPT Plus): https://buy.stripe.com/6oUbJ2e7m2H429o3T3fnO01
- WhatsApp: https://wa.me/5531982924858
- Instagram: https://instagram.com/contaf1sh

## COMO RESPONDER
- Curto (2-4 linhas máximo)
- Sem rodeio
- Sem emojis excessivos (0-1 por mensagem)
- Se cliente quer comprar → manda link imediato
- Se cliente tem objeção → responde com fatos e manda pro checkout
- Se não sabe algo → diz que vai confirmar no WhatsApp

## EXEMPLO DE RESPOSTA IDEAL
Cliente: "quanto tá o chatgpt plus?"
Você: "ChatGPT Plus 1 mês: R$ 29,90 (40% OFF, era R$ 50). 14 em estoque agora.\n\n👉 Paga aqui e recebe na hora: https://buy.stripe.com/6oUbJ2e7m2H429o3T3fnO01

Cliente: "tem netflix?"
Você: "Netflix tá fora no momento. Posso te avisar quando voltar? Ou se quiser, temos ChatGPT Plus por R$ 29,90 com 40% OFF."

Cliente: "é assinatura?"
Você: "Não! É conta pronta com 1 mês pago. Sem renovação automática, sem surpresa no cartão. Paga uma vez e usa."`;
}

// ==========================================
// HANDLER PRINCIPAL
// ==========================================
export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, sessionId, conversationHistory = [] } = req.body;
    
    if (!message || !sessionId) {
      return res.status(400).json({ error: 'Missing message or sessionId' });
    }

    // Monta histórico da conversa
    const history = conversationHistory.slice(-10); // Últimas 10 mensagens
    const messages = [
      { role: 'system', content: buildSystemPrompt() },
      ...history.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content
      })),
      { role: 'user', content: message }
    ];

    // Chama a IA (OpenRouter - compatível com OpenAI)
    const apiKey = process.env.OPENROUTER_API_KEY;
    
    if (!apiKey) {
      // FALLBACK: resposta inteligente sem API
      return res.status(200).json({
        reply: fallbackResponse(message),
        source: 'fallback'
      });
    }

    const aiResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.SITE_URL || 'https://contaflash.com',
        'X-Title': 'ContaFlash AI Sales'
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o-mini', // Barato e bom. Mudar se quiser.
        messages,
        max_tokens: 200,
        temperature: 0.7
      })
    });

    if (!aiResponse.ok) {
      const err = await aiResponse.text();
      console.error('AI API error:', err);
      return res.status(200).json({
        reply: fallbackResponse(message),
        source: 'fallback'
      });
    }

    const data = await aiResponse.json();
    const reply = data.choices?.[0]?.message?.content || fallbackResponse(message);

    // Salva na memória de conversas
    if (!conversations.has(sessionId)) {
      conversations.set(sessionId, []);
    }
    const conv = conversations.get(sessionId);
    conv.push({ role: 'user', content: message, time: Date.now() });
    conv.push({ role: 'assistant', content: reply, time: Date.now() });
    
    // Limita a 50 mensagens por conversa
    if (conv.length > 50) {
      conversations.set(sessionId, conv.slice(-50));
    }

    // Notifica Telegram (async, não bloqueia resposta)
    const lowerMsg = message.toLowerCase();
    const isPurchaseIntent = lowerMsg.includes('comprar') || lowerMsg.includes('checkout') || 
                              lowerMsg.includes('pagar') || lowerMsg.includes('stripe') ||
                              lowerMsg.includes('quero ') || lowerMsg.includes('manda o link');
    
    if (isPurchaseIntent || conv.length <= 2) {
      notifyTelegram(
        `💬 <b>Novo chat no site!</b>\n\n` +
        `👤 Cliente: ${message}\n` +
        `🤖 IA respondeu: ${reply.substring(0, 200)}\n\n` +
        `🔗 <a href="${process.env.SITE_URL || 'https://contaflash.com'}">Ver site</a>`
      );
    }

    return res.status(200).json({ reply, source: 'ai' });

  } catch (err) {
    console.error('Chat handler error:', err);
    return res.status(200).json({
      reply: 'Tive um problema técnico. Fala direto comigo no WhatsApp: https://wa.me/5531982924858',
      source: 'error'
    });
  }
}

// ==========================================
// FALLBACK INTELIGENTE (sem API key)
// ==========================================
function fallbackResponse(message) {
  const lower = message.toLowerCase();
  
  // Intenção: comprar ChatGPT
  if (lower.includes('chatgpt') || lower.includes('gpt') || lower.includes('comprar')) {
    return `ChatGPT Plus 1 mês: R$ 29,90 (40% OFF, era R$ 50). 14 em estoque agora.\n\n👉 Paga aqui e recebe na hora:\nhttps://buy.stripe.com/6oUbJ2e7m2H429o3T3fnO01`;
  }
  
  // Intenção: estoque/disponibilidade
  if (lower.includes('estoque') || lower.includes('disponível') || lower.includes('tem ') || lower.includes('temos')) {
    const inStock = Object.values(PRODUCTS).filter(p => p.inStock);
    const outOfStock = Object.values(PRODUCTS).filter(p => !p.inStock);
    
    let response = '📦 *Estoque atual:*\n\n';
    inStock.forEach(p => {
      response += `✅ ${p.icon} ${p.title}: ${p.stock} un. — ${p.price}\n`;
    });
    if (outOfStock.length) {
      response += '\n❌ Fora: ' + outOfStock.map(p => p.title).join(', ');
    }
    response += '\n\n👉 Compra direta: https://buy.stripe.com/6oUbJ2e7m2H429o3T3fnO01';
    return response;
  }
  
  // Intenção: Netflix/Streaming
  if (lower.includes('netflix') || lower.includes('disney') || lower.includes('hbo') || lower.includes('streaming')) {
    return 'Streaming tá fora no momento. Posso te avisar quando voltar? 📺\n\nEnquanto isso, temos ChatGPT Plus por R$ 29,90 com 40% OFF.';
  }
  
  // Intenção: garantia/segurança
  if (lower.includes('garantia') || lower.includes('seguro') || lower.includes('confio')) {
    return '🔒 Garantia de 30 dias em todos os produtos.\n\nPagamento 100% seguro via Stripe (PIX ou Cartão). Conta pronta, não é assinatura — paga uma vez e usa.';
  }
  
  // Intenção: assinatura/recorrente
  if (lower.includes('assinatura') || lower.includes('recorrente') || lower.includes('mensal')) {
    return 'Não é assinatura! É conta pronta com 1 mês pago. Sem renovação automática, sem surpresa no cartão. Paga uma vez e usa.';
  }
  
  // Intenção: WhatsApp
  if (lower.includes('whatsapp') || lower.includes('zap') || lower.includes('atendente')) {
    return '📱 Fala direto com a gente:\nhttps://wa.me/5531982924858';
  }
  
  // Intenção: preço/desconto
  if (lower.includes('preço') || lower.includes('quanto') || lower.includes('desconto') || lower.includes('valor')) {
    return '💰 Temos ChatGPT Plus por R$ 29,90 (40% OFF, era R$ 50).\n\nÉ conta pronta com 1 mês pago. Sem assinatura.\n\n👉 Compra: https://buy.stripe.com/6oUbJ2e7m2H429o3T3fnO01';
  }
  
  // Intenção: outros produtos
  if (lower.includes('spotify') || lower.includes('canva') || lower.includes('midjourney') || lower.includes('xbox') || lower.includes('deezer')) {
    return 'Esse produto tá fora no momento. 🚫\n\nMas temos ChatGPT Plus por R$ 29,90 com 40% OFF — 14 em estoque agora!\n\n👉 https://buy.stripe.com/6oUbJ2e7m2H429o3T3fnO01';
  }
  
  // Intenção: prazo/entrega
  if (lower.includes('entrega') || lower.includes('demora') || lower.includes('rápido') || lower.includes('quando')) {
    return '⚡ Entrega imediata! Paga pelo Stripe e recebe a conta na hora no WhatsApp.';
  }
  
  // Default
  return 'Oi! Posso te ajudar com nossos produtos digitais. O que você procura?\n\n🔧 ChatGPT Plus: R$ 29,90 (40% OFF)\n📦 Estoque: 14 unidades\n🔒 Garantia: 30 dias\n\n👉 Compra direta: https://buy.stripe.com/6oUbJ2e7m2H429o3T3fnO01';
}
