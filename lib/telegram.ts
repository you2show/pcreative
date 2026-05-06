export interface TelegramConfig {
  botToken: string;
  chatId: string;
}

export interface TelegramMessage {
  message_id: number;
  from?: { is_bot: boolean; first_name?: string };
  date: number;
  text?: string;
  caption?: string;
  reply_to_message?: { message_id: number };
}

export interface TelegramUpdate {
  update_id: number;
  message?: TelegramMessage;
}

/** Escape HTML special characters so user input is safe inside HTML-formatted Telegram messages. */
export const escapeHtml = (s: string): string =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export const getTelegramConfig = (): TelegramConfig | null => {
  // 1. Vercel / build-time environment variables (VITE_TELEGRAM_BOT_TOKEN + VITE_TELEGRAM_CHAT_ID)
  const envToken = import.meta.env.VITE_TELEGRAM_BOT_TOKEN as string | undefined;
  const envChatId = import.meta.env.VITE_TELEGRAM_CHAT_ID as string | undefined;
  if (envToken && envChatId) return { botToken: envToken, chatId: envChatId };

  // 2. Fallback: admin-configured value saved in localStorage
  const raw = localStorage.getItem('telegram_chat_config');
  if (!raw) return null;
  try {
    const cfg = JSON.parse(raw);
    if (cfg.botToken && cfg.chatId) return cfg;
    return null;
  } catch {
    return null;
  }
};

export const sendTelegramMessage = async (
  config: TelegramConfig,
  text: string,
  replyToMessageId?: number
): Promise<number | undefined> => {
  const url = `https://api.telegram.org/bot${config.botToken}/sendMessage`;
  const body: Record<string, unknown> = {
    chat_id: config.chatId,
    text,
    parse_mode: 'HTML',
  };
  if (replyToMessageId) {
    body.reply_to_message_id = replyToMessageId;
  }
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Telegram API error ${res.status}: ${body}`);
  }
  const data = await res.json();
  return data.result?.message_id as number | undefined;
};

/**
 * Try to read TelegramConfig from site-data.json hosted on GitHub (public raw URL).
 * Used at app startup to sync config across devices without requiring localStorage.
 */
export const getTelegramConfigFromGitHub = async (
  username: string,
  repo: string,
  branch: string
): Promise<TelegramConfig | null> => {
  try {
    const url = `https://raw.githubusercontent.com/${username}/${repo}/${branch}/site-data.json?t=${Date.now()}`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    const cfg = data.telegramConfig;
    if (cfg?.botToken && cfg?.chatId) return { botToken: cfg.botToken, chatId: cfg.chatId };
    return null;
  } catch {
    return null;
  }
};

export const getTelegramUpdates = async (
  config: TelegramConfig,
  offset?: number
): Promise<TelegramUpdate[]> => {
  const params = new URLSearchParams({ timeout: '0' });
  if (offset !== undefined) params.set('offset', String(offset));
  const res = await fetch(
    `https://api.telegram.org/bot${config.botToken}/getUpdates?${params}`
  );
  if (!res.ok) return [];
  const data = await res.json();
  return data.ok ? data.result : [];
};
