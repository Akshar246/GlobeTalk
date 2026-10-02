const ALERT = "ALERT";
const REFETCH_CHATS = "REFETCH_CHATS";

const NEW_ATTACHMENT = "NEW_ATTACHMENT";
const NEW_MESSAGE_ALERT = "NEW_MESSAGE_ALERT";

const NEW_REQUEST = "NEW_REQUEST";
const NEW_MESSAGE = "NEW_MESSAGE";

const START_TYPING = "START_TYPING";
const STOP_TYPING = "STOP_TYPING";

const CHAT_JOINED = "CHAT_JOINED";
const CHAT_LEAVED = "CHAT_LEAVED";

const ONLINE_USERS = "ONLINE_USERS";

// ── Read Receipts ─────────────────────────────────────────────────────────────
// Client emits MESSAGE_READ when user opens a chat.
// Server emits MESSAGES_SEEN back to the original sender with the chatId,
// so their UI can update the tick from ✓ to ✓✓.
const MESSAGE_READ   = "MESSAGE_READ";
const MESSAGES_SEEN  = "MESSAGES_SEEN";

export {
  ALERT,
  REFETCH_CHATS,
  NEW_ATTACHMENT,
  NEW_MESSAGE_ALERT,
  NEW_REQUEST,
  NEW_MESSAGE,
  START_TYPING,
  STOP_TYPING,
  CHAT_JOINED,
  CHAT_LEAVED,
  ONLINE_USERS,
  MESSAGE_READ,
  MESSAGES_SEEN,
};