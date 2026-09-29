// ═══════════════════════════════════════════════════════════════════
//  GlobeTalk Design Tokens — Premium Indigo-Gold Design System
//  Two complete themes: LIGHT and DARK
// ═══════════════════════════════════════════════════════════════════

// ── Brand Palette ──────────────────────────────────────────────────
export const BRAND_INDIGO   = "#4F46E5"; // Primary CTA, active states
export const BRAND_VIOLET   = "#7C3AED"; // Gradient partner
export const BRAND_GOLD     = "#F59E0B"; // Premium accent
export const BRAND_EMERALD  = "#10B981"; // Online, success

// ── Light Theme Tokens ──────────────────────────────────────────────
export const LT_BG          = "#F5F6FA"; // Page background
export const LT_SURFACE     = "#FFFFFF"; // Cards, dialogs
export const LT_SIDEBAR     = "#FFFFFF"; // Sidebar background
export const LT_CHAT_BG     = "#EEEAF4"; // Chat area — soft lavender mist
export const LT_INPUT_BAR   = "#F0F2F7"; // Input row at bottom of chat
export const LT_BORDER      = "#E5E7EB"; // Subtle dividers
export const LT_TEXT_1      = "#111827"; // Primary text
export const LT_TEXT_2      = "#6B7280"; // Secondary / muted text
export const LT_SENT_BUBBLE = "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)"; // Sent
export const LT_RECV_BUBBLE = "#FFFFFF"; // Received

// ── Dark Theme Tokens ───────────────────────────────────────────────
export const DK_BG          = "#0F0F1A"; // Page background
export const DK_SURFACE     = "#1A1B2E"; // Cards, dialogs
export const DK_SIDEBAR     = "#14152A"; // Sidebar
export const DK_CHAT_BG     = "#0F0F1A"; // Chat area
export const DK_INPUT_BAR   = "#1A1B2E"; // Input row
export const DK_BORDER      = "#2D2F4A"; // Dividers
export const DK_TEXT_1      = "#F1F0FF"; // Primary text
export const DK_TEXT_2      = "#8B8FA8"; // Secondary text
export const DK_SENT_BUBBLE = "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)"; // Sent
export const DK_RECV_BUBBLE = "#1E2140"; // Received

// ── Header gradient (both themes share the same branded header) ─────
export const HEADER_GRADIENT = "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)";

// ── Legacy aliases (keep old imports working) ────────────────────────
export const orange      = "#4F46E5";   // was #ea7070 — redirect to brand
export const orangeLight = "rgba(79,70,229,0.15)";
export const grayColor   = LT_CHAT_BG;
export const lightBlue   = "#7C3AED";
export const matBlack    = "#0F0F1A";
export const bgGradient  = HEADER_GRADIENT;
export const purple      = "rgba(79,70,229,1)";
export const purpleLight = "rgba(79,70,229,0.2)";