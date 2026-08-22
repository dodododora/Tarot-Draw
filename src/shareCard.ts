import { MODE_ACCENT } from './constants';
import type { ShareCardOptions } from './shareCard';

// ─── Interfaces ──────────────────────────────────────────────────────────────

export interface ShareCardCard {
  nameCN: string;
  nameEN: string;
  isReversed: boolean;
  positionName: string;
  emoji?: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Wraps text at maxWidth, returns array of lines */
function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const chars = [...text];
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
 * Redesigned for premium, classical aesthetic.
 */
export async function generateShareCard(opts: ShareCardOptions): Promise<string> {
  const { spreadName, question, cards, mode } = opts;
  const isLenormand = mode === 'lenormand';

  // Aesthetic Proportions: IG Story / Mobile Poster
  const W = 1080;
  const H = 1920;
  
  const canvas = document.createElement('canvas');
  canvas.width  = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;

  // 1. Background: Deep Obsidian / Void
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, '#0F0C16');
  grad.addColorStop(0.5, '#0A0812');
  grad.addColorStop(1, '#050408');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // Subtle ambient glow in the center
  const glow = ctx.createRadialGradient(W / 2, H / 3, 0, W / 2, H / 3, W);
  glow.addColorStop(0, 'rgba(212, 175, 55, 0.05)');
  glow.addColorStop(1, 'transparent');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);

  // 2. Elegant Hairline Frame
  const margin = 64;
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.15)';
  ctx.lineWidth = 1;
  ctx.strokeRect(margin, margin, W - margin * 2, H - margin * 2);
  
  // Corner accents (+)
  const crossSize = 8;
  ctx.beginPath();
  const corners = [
    [margin, margin], [W - margin, margin],
    [margin, H - margin], [W - margin, H - margin]
  ];
  for (const [cx, cy] of corners) {
    ctx.moveTo(cx - crossSize, cy); ctx.lineTo(cx + crossSize, cy);
    ctx.moveTo(cx, cy - crossSize); ctx.lineTo(cx, cy + crossSize);
  }
  ctx.stroke();

  // 3. Header Typography
  const modeLabel = { waite: '偉特塔羅', thoth: '托特塔羅', lenormand: '雷諾曼' }[mode] ?? '塔羅占卜';

  ctx.textAlign = 'center';
  
  // App Title
  ctx.font = '300 48px "Cinzel", "Times New Roman", serif';
  ctx.fillStyle = 'rgba(212, 175, 55, 0.9)';
  // Fallback for letterSpacing
  if ('letterSpacing' in ctx) {
    (ctx as any).letterSpacing = '12px';
  }
  ctx.fillText('TAROT DRAW', W / 2, 180);
  if ('letterSpacing' in ctx) {
    (ctx as any).letterSpacing = '0px';
  }

  // Subtitle
  ctx.font = '300 22px "Cinzel", "Noto Serif TC", "Songti TC", serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
  if ('letterSpacing' in ctx) {
    (ctx as any).letterSpacing = '4px';
  }
  ctx.fillText(`tarot-draw.app  ·  ${modeLabel}`, W / 2, 230);
  if ('letterSpacing' in ctx) {
    (ctx as any).letterSpacing = '0px';
  }

  // Divider Star
  ctx.font = '20px serif';
  ctx.fillStyle = 'rgba(212, 175, 55, 0.5)';
  ctx.fillText('✦', W / 2, 320);

  // 4. Spread Name
  ctx.font = '500 42px "Noto Serif TC", "Songti TC", "PMingLiU", serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.fillText(spreadName, W / 2, 400);

  // 5. Question
  let listTop = 480;
  if (question.trim()) {
    ctx.font = 'italic 300 32px "Noto Serif TC", "Songti TC", "PMingLiU", serif';
    ctx.fillStyle = 'rgba(212, 175, 55, 0.7)';
    const qLines = wrapText(ctx, `「${question.trim()}」`, W - margin * 2 - 80);
    qLines.forEach((line, i) => {
      ctx.fillText(line, W / 2, 480 + i * 46);
    });
    listTop = 480 + qLines.length * 46 + 60;
  }

  // 6. Card List (Table of Contents Style)
  const maxCards = Math.min(cards.length, 36);
  const availableH = H - listTop - 180;
  const rowH = Math.min(64, availableH / maxCards);
  const fontSize = Math.min(30, rowH * 0.6);
  const labelFontSize = Math.min(26, fontSize * 0.9);

  for (let i = 0; i < maxCards; i++) {
    const card = cards[i];
    const cy = listTop + i * rowH + rowH / 2;

    const posStr = `${i + 1}. ${card.positionName}`;
    const nameStr = isLenormand ? `${card.nameCN}` : card.nameCN;
    const isRev = card.isReversed;

    // Left: Position
    ctx.font = `300 ${labelFontSize}px "Noto Serif TC", "Songti TC", serif`;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.textAlign = 'left';
    ctx.fillText(posStr, margin + 40, cy);
    const posWidth = ctx.measureText(posStr).width;

    // Right: Card Name
    let revWidth = 0;
    if (isRev) {
      ctx.font = `300 ${labelFontSize}px "Noto Serif TC", "Songti TC", serif`;
      revWidth = ctx.measureText(' (逆)').width;
    }
    
    ctx.font = `400 ${fontSize}px "Noto Serif TC", "Songti TC", serif`;
    const nameWidth = ctx.measureText(nameStr).width;

    // Draw Dot Leaders (Dashed line)
    ctx.save();
    ctx.setLineDash([2, 12]);
    ctx.lineCap = 'round';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(margin + 40 + posWidth + 24, cy - fontSize * 0.3);
    ctx.lineTo(W - margin - 40 - nameWidth - revWidth - 24, cy - fontSize * 0.3);
    ctx.stroke();
    ctx.restore();

    // Draw Card Name
    ctx.fillStyle = isRev ? 'rgba(212, 175, 55, 0.8)' : 'rgba(255, 255, 255, 0.9)';
    ctx.textAlign = 'right';
    ctx.fillText(nameStr, W - margin - 40 - revWidth, cy);

    // Draw Reversed Tag
    if (isRev) {
      ctx.font = `300 ${labelFontSize}px "Noto Serif TC", "Songti TC", serif`;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.fillText(' (逆)', W - margin - 40, cy);
    }
  }

  if (cards.length > 36) {
    ctx.font = '300 24px "Noto Serif TC", serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.textAlign = 'center';
    ctx.fillText(`…還有 ${cards.length - 36} 張牌`, W / 2, listTop + maxCards * rowH + 40);
  }

  // 7. Footer
  ctx.font = '300 22px "Noto Serif TC", "Songti TC", serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
  ctx.textAlign = 'center';
  if ('letterSpacing' in ctx) {
    (ctx as any).letterSpacing = '6px';
  }
  ctx.fillText('牌卡只是指引，真正的答案在你的內心', W / 2, H - margin - 30);
  if ('letterSpacing' in ctx) {
    (ctx as any).letterSpacing = '0px';
  }

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
