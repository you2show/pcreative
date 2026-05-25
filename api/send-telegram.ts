/**
 * Vercel Serverless Function: POST /api/send-telegram
 *
 * Proxies messages to the Telegram Bot API using server-side credentials.
 * The bot token never reaches the browser.
 *
 * Required environment variables (set in Vercel project settings):
 *   TELEGRAM_BOT_TOKEN — Telegram bot API token
 *   TELEGRAM_CHAT_ID   — Target chat/group ID
 *
 * Request body (JSON):
 *   text {string} — The formatted message text to send
 *
 * Responses:
 *   200 { ok: true }
 *   400 Bad request (missing text)
 *   503 Server not configured (missing env vars)
 *   502 Telegram API error
 */

interface Req {
  method?: string;
  body?: unknown;
}

interface Res {
  status: (code: number) => Res;
  json: (data: unknown) => void;
  setHeader: (name: string, value: string) => Res;
}

export default async function handler(req: Req, res: Res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).json({ ok: true });
  }

  if (req.method !== 'POST') {
    return res.status(400).json({ error: 'Only POST is allowed' });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    return res.status(503).json({ error: 'Telegram not configured on server' });
  }

  const body = req.body as { text?: string } | undefined;
  if (!body || !body.text || typeof body.text !== 'string') {
    return res.status(400).json({ error: 'Missing "text" in request body' });
  }

  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: body.text,
        parse_mode: 'Markdown',
      }),
    });

    const data = await response.json();
    if (data.ok) {
      return res.status(200).json({ ok: true });
    } else {
      return res.status(502).json({ error: 'Telegram API error', detail: data.description });
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return res.status(502).json({ error: 'Failed to reach Telegram', detail: message });
  }
}
