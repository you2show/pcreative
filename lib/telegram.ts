export interface TelegramConfig {
  botToken: string;
  chatId: string;
  /**
   * Optional: the Telegram user_id of the admin.
   * When set, the polling fallback (strategy 3) only accepts messages
   * from this specific user, eliminating false-positive matches from
   * other group members.  Find your user ID via @userinfobot in Telegram.
   */
  adminUserId?: number;
}

export interface TelegramMessage {
  message_id: number;
  from?: { id: number; is_bot: boolean; first_name?: string };
  date: number;
  text?: string;
  caption?: string;
  reply_to_message?: { message_id: number };
  /** Present in forum supergroups; identifies the topic thread. */
  message_thread_id?: number;
}

export interface TelegramUpdate {
  update_id: number;
  /** Set for group/supergroup messages. */
  message?: TelegramMessage;
  /** Set for channel posts. */
  channel_post?: TelegramMessage;
}

/** Escape HTML special characters so user input is safe inside HTML-formatted Telegram messages. */
export const escapeHtml = (s: string): string =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export const getTelegramConfig = (): TelegramConfig | null => {
  // 1. Vercel / build-time environment variables (VITE_TELEGRAM_BOT_TOKEN + VITE_TELEGRAM_CHAT_ID + VITE_TELEGRAM_ADMIN_USER_ID)
  const envToken = import.meta.env.VITE_TELEGRAM_BOT_TOKEN as string | undefined;
  const envChatId = import.meta.env.VITE_TELEGRAM_CHAT_ID as string | undefined;
  if (envToken && envChatId) {
    const envAdminId = import.meta.env.VITE_TELEGRAM_ADMIN_USER_ID as string | undefined;
    const parsedEnvAdminId = envAdminId ? parseInt(envAdminId, 10) : NaN;
    return {
      botToken: envToken,
      chatId: envChatId,
      adminUserId: !isNaN(parsedEnvAdminId) && parsedEnvAdminId > 0 ? parsedEnvAdminId : undefined,
    };
  }

  // 2. Fallback: admin-configured value saved in localStorage
  const raw = localStorage.getItem('telegram_chat_config');
  if (!raw) return null;
  try {
    const cfg = JSON.parse(raw);
    if (cfg.botToken && cfg.chatId) {
      const rawId = cfg.adminUserId !== undefined ? parseInt(String(cfg.adminUserId), 10) : NaN;
      return {
        botToken: cfg.botToken,
        chatId: cfg.chatId,
        adminUserId: !isNaN(rawId) && rawId > 0 ? rawId : undefined,
      };
    }
    return null;
  } catch {
    return null;
  }
};

export const sendTelegramMessage = async (
  config: TelegramConfig,
  text: string,
  replyToMessageId?: number,
  forceReply?: boolean
): Promise<number | undefined> => {
  const url = `https://api.telegram.org/bot${config.botToken}/sendMessage`;

  const sendRequest = (msgText: string, parseMode?: string): Promise<Response> => {
    const body: Record<string, unknown> = { chat_id: config.chatId, text: msgText };
    if (parseMode) body.parse_mode = parseMode;
    if (replyToMessageId) body.reply_to_message_id = replyToMessageId;
    // force_reply prompts the admin to reply using Telegram's Reply feature,
    // which guarantees reply_to_message is set and strategy-1 matching works.
    if (forceReply) body.reply_markup = { force_reply: true, input_field_placeholder: 'Reply to user…' };
    return fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  };

  // First attempt: HTML parse mode for bold formatting
  let res = await sendRequest(text, 'HTML');

  // If Telegram rejected the HTML (e.g. parse error), retry as plain text
  if (!res.ok && res.status === 400) {
    const plainText = text
      .replace(/<\/?b>/g, '')   // remove only the <b> bold tags we emit
      .replace(/&amp;/g, '&');  // restore & so names like "Web & App" display correctly
    res = await sendRequest(plainText);
  }

  if (!res.ok) {
    const errBody = await res.text().catch(() => '');
    throw new Error(`Telegram API error ${res.status}: ${errBody}`);
  }
  const data = await res.json();
  return data.result?.message_id as number | undefined;
};

/**
 * Validate a TelegramConfig by calling getMe (token check) then sending a test
 * message (chat ID check). Returns { ok, botName } on success or { ok, error } on failure.
 */
export const testTelegramConnection = async (
  config: TelegramConfig
): Promise<{ ok: boolean; botName?: string; error?: string }> => {
  try {
    // 1. Validate bot token
    const meRes = await fetch(`https://api.telegram.org/bot${config.botToken}/getMe`);
    const meData = await meRes.json();
    if (!meData.ok) {
      return { ok: false, error: `Invalid bot token: ${meData.description || 'unknown error'}` };
    }
    const botName: string = meData.result?.username || meData.result?.first_name || 'Bot';

    // 2. Validate chat ID by sending a test message
    const msgRes = await fetch(`https://api.telegram.org/bot${config.botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: config.chatId,
        text: '✅ PCreative Live Chat — Test connection successful!',
      }),
    });
    const msgData = await msgRes.json();
    if (!msgData.ok) {
      return { ok: false, error: `Bot @${botName} is valid, but chat error: ${msgData.description || 'unknown'}` };
    }
    return { ok: true, botName };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Network error' };
  }
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
