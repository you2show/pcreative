/**
 * Send a message via the server-side Telegram proxy (/api/send-telegram).
 * Falls back to direct Telegram API using localStorage config (for local dev).
 */
export async function sendTelegramMessage(text: string): Promise<boolean> {
  // Try server-side proxy first (production — Vercel)
  try {
    const res = await fetch('/api/send-telegram', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    const data = await res.json();
    if (data.ok) return true;
    // If server says not configured (503), fall through to local config
    if (res.status !== 503) return false;
  } catch {
    // API not available (e.g., local dev without Vercel) — fall through
  }

  // Fallback: use localStorage telegram config (local development)
  try {
    const stored = localStorage.getItem('telegram_config');
    if (stored) {
      const { botToken, chatId } = JSON.parse(stored);
      if (botToken && chatId) {
        const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'Markdown' }),
        });
        const data = await res.json();
        return data.ok === true;
      }
    }
  } catch {
    // ignore
  }

  return false;
}
