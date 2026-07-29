/**
 * ContaFlash Admin - Conversas API
 * 
 * Retorna as conversas ativas pra visualização no painel admin.
 * Protegido por senha simples (em produção: usar auth real).
 */

// Database em memória (mesmo do chat.js)
// Em produção: usar Supabase/Redis
const conversations = new Map();

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Auth simples (senha via query param ou header)
  const authHeader = req.headers.authorization;
  const queryKey = req.query.key;
  const ADMIN_KEY = process.env.ADMIN_KEY || 'contaflash2024';
  
  if (queryKey !== ADMIN_KEY && authHeader !== `Bearer ${ADMIN_KEY}`) {
    return res.status(401).json({ error: 'Não autorizado' });
  }

  if (req.method === 'GET') {
    // Lista todas as conversas
    const allConversations = [];
    
    for (const [sessionId, messages] of conversations) {
      allConversations.push({
        sessionId,
        messages: messages.slice(-20), // Últimas 20 msgs
        lastMessage: messages[messages.length - 1],
        messageCount: messages.length,
        startedAt: messages[0]?.time,
        lastActivity: messages[messages.length - 1]?.time
      });
    }

    // Ordena por atividade mais recente
    allConversations.sort((a, b) => (b.lastActivity || 0) - (a.lastActivity || 0));

    return res.status(200).json({
      total: allConversations.length,
      conversations: allConversations
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
