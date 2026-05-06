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

export const getTelegramConfig = (): TelegramConfig | null => {
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
