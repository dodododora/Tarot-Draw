/**
 * shareCard.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Generates a 1080×1080px share card image using the Canvas API.
 * No external dependencies — renders directly from state data.
 */

export interface ShareCardCard {
  nameCN: string;
  nameEN: string;
  isReversed: boolean;
  positionName: string;
  emoji?: string;
}

export interface ShareCardOptions {
  spreadName: string;
  question: string;
  cards: ShareCardCard[];
  mode: 'tarot' | 'thoth' | 'lenormand';
}

// ─── Constants ───────────────────────────────────────────────────────────────

const W = 1080;
const H = 1080;
const PADDING = 72;

// Palette
const COL = {
  bg1:       '#0b0a14',
  bg2:       '#1a1630',
  gold:      '#f5c842',
  goldDim:   '#c9a227',
  text:      '#f0ece8',
  textDim:   '#a09880',
  reversed:  '#f87171',
  green:     '#4ade80',
  teal:      '#2dd4bf',
  purple:    '#a78bfa',
  border:    'rgba(245,200,66,0.18)',
  cardBg:    'rgba(255,255,255,0.05)',
};

const MODE_ACCENT: Record<string, string> = {
  tarot:      COL.gold,
  thoth:      COL.purple,
  lenormand:  COL.teal,
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fillRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number,
  r: number
) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  ctx.fill();
}

function strokeRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number,
  r: number
) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  ctx.stroke();
}

/** Wraps text at maxWidth, returns array of lines */
function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const chars = [...text]; // Unicode-safe split
  const lines: string[] = [];
  let current = '';

  for (const ch of chars) {
    const test = current + ch;
    if (ctx.measureText(test).width > maxWidth && current.length > 0) {
      lines.push(current);
      current = ch;
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);
  return lines;
}

// ─── Main export ─────────────────────────────────────────────────────────────

/**
 * Draw the share card and return a PNG data URL.
 * Call with the current draw state; no DOM dependency required beyond canvas.
 */
export async function generateShareCard(opts: ShareCardOptions): Promise<string> {
  const { spreadName, question, cards, mode } = opts;
  const accent = MODE_ACCENT[mode] ?? COL.gold;

  const canvas = document.createElement('canvas');
  canvas.width  = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;

  // ── Background gradient ──────────────────────────────────────────────────
  const grad = ctx.createRadialGradient(W / 2, H * 0.3, 0, W / 2, H / 2, W * 0.8);
  grad.addColorStop(0,   '#1e1a38');
  grad.addColorStop(0.6, COL.bg2);
  grad.addColorStop(1,   COL.bg1);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // Subtle star-noise texture
  ctx.save();
  for (let i = 0; i < 140; i++) {
    const sx = Math.random() * W;
    const sy = Math.random() * H;
    const sr = Math.random() * 1.2;
    const sa = Math.random() * 0.5 + 0.1;
    ctx.fillStyle = `rgba(255,255,255,${sa})`;
    ctx.beginPath();
    ctx.arc(sx, sy, sr, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // Border frame
  ctx.strokeStyle = COL.border;
  ctx.lineWidth = 2;
  strokeRoundRect(ctx, 32, 32, W - 64, H - 64, 32);

  // Inner subtle glow ring near top
  const glowGrad = ctx.createRadialGradient(W / 2, 140, 10, W / 2, 140, 260);
  glowGrad.addColorStop(0,   `${accent}22`);
  glowGrad.addColorStop(1,   'transparent');
  ctx.fillStyle = glowGrad;
  ctx.fillRect(0, 0, W, 360);

  // ── Logo / header ────────────────────────────────────────────────────────
  const modeEmoji = { tarot: '🔮', thoth: '🌌', lenormand: '🃏' }[mode] ?? '🔮';
  const modeLabel = { tarot: '偉特塔羅', thoth: '托特塔羅', lenormand: '雷諾曼' }[mode] ?? '';

  ctx.font = `bold 52px "Apple Color Emoji", "Segoe UI Emoji", sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText(modeEmoji, W / 2, PADDING + 60);

  ctx.font = `900 52px "PingFang SC", "Noto Sans TC", "Microsoft JhengHei", sans-serif`;
  ctx.fillStyle = accent;
  ctx.textAlign = 'center';
  ctx.fillText('Tarot Draw', W / 2, PADDING + 128);

  ctx.font = `500 26px "PingFang SC", "Noto Sans TC", sans-serif`;
  ctx.fillStyle = COL.textDim;
  ctx.fillText(`${modeLabel}  ·  tarot-draw.app`, W / 2, PADDING + 164);

  // Divider
  const divY = PADDING + 190;
  const divGrad = ctx.createLinearGradient(PADDING, divY, W - PADDING, divY);
  divGrad.addColorStop(0,   'transparent');
  divGrad.addColorStop(0.5, accent);
  divGrad.addColorStop(1,   'transparent');
  ctx.strokeStyle = divGrad;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(PADDING, divY);
  ctx.lineTo(W - PADDING, divY);
  ctx.stroke();

  // ── Spread name ──────────────────────────────────────────────────────────
  ctx.font = `700 38px "PingFang SC", "Noto Sans TC", sans-serif`;
  ctx.fillStyle = COL.text;
  ctx.textAlign = 'center';
  ctx.fillText(spreadName, W / 2, divY + 52);

  // ── Question ─────────────────────────────────────────────────────────────
  if (question.trim()) {
    ctx.font = `400 26px "PingFang SC", "Noto Sans TC", sans-serif`;
    ctx.fillStyle = COL.textDim;
    const qLines = wrapText(ctx, `「${question}」`, W - PADDING * 2 - 40);
    qLines.slice(0, 2).forEach((line, i) => {
      ctx.fillText(line, W / 2, divY + 96 + i * 36);
    });
  }

  // ── Card list ─────────────────────────────────────────────────────────────
  const listTop = divY + (question.trim() ? 160 : 96);
  const maxCards = Math.min(cards.length, 10);
  const cardH = Math.min(68, (H - listTop - PADDING - 100) / maxCards);
  const cardW = W - PADDING * 2;

  for (let i = 0; i < maxCards; i++) {
    const card = cards[i];
    const cy = listTop + i * (cardH + 8);

    // Row background
    ctx.fillStyle = COL.cardBg;
    fillRoundRect(ctx, PADDING, cy, cardW, cardH, 12);

    // Left accent strip
    ctx.fillStyle = card.isReversed ? COL.reversed : accent;
    fillRoundRect(ctx, PADDING, cy, 5, cardH, 4);

    // Position label (left)
    ctx.font = `500 ${Math.round(cardH * 0.3)}px "PingFang SC", "Noto Sans TC", sans-serif`;
    ctx.fillStyle = COL.textDim;
    ctx.textAlign = 'left';
    const posLabel = `${i + 1}. ${card.positionName}`;
    ctx.fillText(posLabel, PADDING + 20, cy + cardH * 0.52);

    // Card name (right-ish, bold)
    const nameX = W / 2 + 20;
    ctx.font = `700 ${Math.round(cardH * 0.33)}px "PingFang SC", "Noto Sans TC", sans-serif`;
    ctx.fillStyle = card.isReversed ? COL.reversed : COL.text;
    ctx.textAlign = 'left';

    const emoji = card.emoji ?? '';
    const nameStr = `${emoji ? emoji + ' ' : ''}${card.nameCN}`;
    ctx.fillText(nameStr, nameX, cy + cardH * 0.52);

    // Reversed badge
    if (card.isReversed) {
      const badgeX = W - PADDING - 56;
      const badgeY = cy + cardH * 0.5 - 14;
      ctx.fillStyle = 'rgba(248,113,113,0.2)';
      fillRoundRect(ctx, badgeX, badgeY, 48, 28, 8);
      ctx.font = `bold 16px "PingFang SC", sans-serif`;
      ctx.fillStyle = COL.reversed;
      ctx.textAlign = 'center';
      ctx.fillText('逆位', badgeX + 24, badgeY + 19);
    } else if (mode !== 'lenormand') {
      const badgeX = W - PADDING - 56;
      const badgeY = cy + cardH * 0.5 - 14;
      ctx.fillStyle = 'rgba(74,222,128,0.12)';
      fillRoundRect(ctx, badgeX, badgeY, 48, 28, 8);
      ctx.font = `bold 16px "PingFang SC", sans-serif`;
      ctx.fillStyle = COL.green;
      ctx.textAlign = 'center';
      ctx.fillText('正位', badgeX + 24, badgeY + 19);
    }
  }

  if (cards.length > 10) {
    ctx.font = `400 22px "PingFang SC", sans-serif`;
    ctx.fillStyle = COL.textDim;
    ctx.textAlign = 'center';
    ctx.fillText(`…還有 ${cards.length - 10} 張牌`, W / 2, listTop + 10 * (cardH + 8) + 28);
  }

  // ── Footer ────────────────────────────────────────────────────────────────
  const footY = H - PADDING + 12;
  ctx.font = `400 22px "PingFang SC", "Noto Sans TC", sans-serif`;
  ctx.fillStyle = COL.textDim;
  ctx.textAlign = 'center';
  ctx.fillText('牌卡只是指引，真正的答案在你的內心', W / 2, footY);

  // ── Export ───────────────────────────────────────────────────────────────
  return canvas.toDataURL('image/png');
}

/** Trigger download of the share card PNG */
export async function downloadShareCard(opts: ShareCardOptions, filename = 'tarot-draw.png') {
  const dataUrl = await generateShareCard(opts);
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = filename;
  a.click();
}
