/* ==========================================================================
   PitchCraft Studio — 16:9 High-DPI HTML5 Canvas Chart Engine (1600x900)
   ========================================================================== */

(function (global) {
  const W = 1600;
  const H = 900;
  const FONT_FAMILY = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

  function hexToRgba(hex, alpha) {
    const clean = hex.replace("#", "");
    const num = parseInt(clean, 16);
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  function roundRectPath(ctx, x, y, w, h, r) {
    const radius = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + w, y, x + w, y + h, radius);
    ctx.arcTo(x + w, y + h, x, y + h, radius);
    ctx.arcTo(x, y + h, x, y, radius);
    ctx.arcTo(x, y, x + w, y, radius);
    ctx.closePath();
  }

  function fillRoundRect(ctx, x, y, w, h, r, fillStyle, strokeStyle, lineWidth = 1.5) {
    roundRectPath(ctx, x, y, w, h, r);
    if (fillStyle) {
      ctx.fillStyle = fillStyle;
      ctx.fill();
    }
    if (strokeStyle) {
      ctx.strokeStyle = strokeStyle;
      ctx.lineWidth = lineWidth;
      ctx.stroke();
    }
  }

  function getWrappedLines(ctx, text, maxWidth) {
    if (!text) return [""];
    const words = String(text).split(/\s+/);
    const lines = [];
    let current = "";
    for (let i = 0; i < words.length; i++) {
      const test = current ? current + " " + words[i] : words[i];
      if (ctx.measureText(test).width > maxWidth && current) {
        lines.push(current);
        current = words[i];
      } else {
        current = test;
      }
    }
    if (current) lines.push(current);
    return lines;
  }

  function drawWrappedText(ctx, text, x, y, maxWidth, lineHeight, maxLines = 4, align = "left") {
    const lines = getWrappedLines(ctx, text, maxWidth).slice(0, maxLines);
    ctx.textAlign = align;
    lines.forEach((line, idx) => {
      let output = line;
      if (idx === maxLines - 1 && getWrappedLines(ctx, text, maxWidth).length > maxLines) {
        output = output.slice(0, Math.max(0, output.length - 3)) + "...";
      }
      ctx.fillText(output, x, y + idx * lineHeight);
    });
    return lines.length;
  }

  function drawHeader(ctx, title, subtitle, projectTitle, theme) {
    // Top subtle accent bar
    ctx.fillStyle = theme.primary;
    roundRectPath(ctx, 64, 52, 6, 62, 3);
    ctx.fill();

    // Title
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    ctx.font = `700 34px ${FONT_FAMILY}`;
    ctx.fillStyle = theme.text;
    ctx.fillText(title || "Sunum Grafiği", 86, 82);

    // Subtitle
    ctx.font = `400 18px ${FONT_FAMILY}`;
    ctx.fillStyle = theme.muted;
    ctx.fillText(subtitle || "", 86, 114);

    // Project tag pill on top right
    if (projectTitle) {
      ctx.font = `600 15px ${FONT_FAMILY}`;
      const label = `${projectTitle}`;
      const textW = ctx.measureText(label).width;
      const pillW = Math.min(280, textW + 34);
      fillRoundRect(
        ctx,
        W - 64 - pillW,
        58,
        pillW,
        36,
        18,
        hexToRgba(theme.primary, 0.14),
        hexToRgba(theme.primary, 0.35),
        1.5
      );
      ctx.fillStyle = theme.primary;
      ctx.textAlign = "center";
      ctx.fillText(label, W - 64 - pillW / 2, 81);
    }

    // Subtle divider
    ctx.strokeStyle = hexToRgba(theme.border, 0.8);
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(64, 142);
    ctx.lineTo(W - 64, 142);
    ctx.stroke();
  }

  function drawArrowHead(ctx, x, y, angle, color, size = 12) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-size, -size * 0.52);
    ctx.lineTo(-size * 0.72, 0);
    ctx.lineTo(-size, size * 0.52);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
    ctx.restore();
  }

  function drawChevronArrow(ctx, cx, cy, w, h, dir, fill, stroke) {
    const hw = w / 2;
    const hh = h / 2;
    const notch = w * 0.42;
    ctx.save();
    ctx.translate(cx, cy);
    if (dir === "left") ctx.scale(-1, 1);
    ctx.beginPath();
    ctx.moveTo(-hw, -hh);
    ctx.lineTo(hw - notch, -hh);
    ctx.lineTo(hw, 0);
    ctx.lineTo(hw - notch, hh);
    ctx.lineTo(-hw, hh);
    ctx.lineTo(-hw + notch, 0);
    ctx.closePath();
    if (fill) {
      ctx.fillStyle = fill;
      ctx.fill();
    }
    if (stroke) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = 1.8;
      ctx.stroke();
    }
    ctx.restore();
  }

  function formatMoney(value, currency = "$") {
    const abs = Math.round(value);
    return `${currency}${abs.toLocaleString("tr-TR")}`;
  }

  /* ========================================================================
     1. CORE LOOP RENDERER
     ======================================================================== */
  function renderCoreLoop(ctx, chartData, projectTitle, theme) {
    drawHeader(ctx, chartData.title, chartData.subtitle, projectTitle, theme);

    const nodes = chartData.nodes && chartData.nodes.length ? chartData.nodes : [];
    const n = nodes.length;
    const cx = 800;
    const cy = 520;
    const rx = n <= 4 ? 410 : 475;
    const ry = n <= 4 ? 215 : 235;

    const cardW = n <= 4 ? 295 : n <= 6 ? 275 : 240;
    const cardH = n <= 6 ? 122 : 108;

    // Subtle outer orbital guide ring
    ctx.save();
    ctx.setLineDash([8, 8]);
    ctx.strokeStyle = hexToRgba(theme.primary, 0.25);
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    // Calculate node center positions starting from top (-PI/2)
    const positions = nodes.map((_, i) => {
      const angle = -Math.PI / 2 + (i * Math.PI * 2) / n;
      return {
        x: cx + rx * Math.cos(angle),
        y: cy + ry * Math.sin(angle),
        angle
      };
    });

    // Draw connecting curved arrows between node i and node i+1
    if (n > 1) {
      for (let i = 0; i < n; i++) {
        const a1 = positions[i].angle;
        let a2 = positions[(i + 1) % n].angle;
        if (a2 <= a1) a2 += Math.PI * 2;
        const midAngle = (a1 + a2) / 2;

        // Slightly trim start/end angle so arrow clears card bounds nicely
        const trim = Math.min(0.32, (a2 - a1) * 0.26);
        const startA = a1 + trim;
        const endA = a2 - trim;

        const sx = cx + rx * Math.cos(startA);
        const sy = cy + ry * Math.sin(startA);
        const ex = cx + rx * Math.cos(endA);
        const ey = cy + ry * Math.sin(endA);

        const ctrlR = 1.07;
        const ctrlX = cx + rx * ctrlR * Math.cos(midAngle);
        const ctrlY = cy + ry * ctrlR * Math.sin(midAngle);

        const color = theme.accents[i % theme.accents.length];
        ctx.strokeStyle = color;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.quadraticCurveTo(ctrlX, ctrlY, ex, ey);
        ctx.stroke();

        const arrowAngle = Math.atan2(ey - ctrlY, ex - ctrlX);
        drawArrowHead(ctx, ex, ey, arrowAngle, color, 15);
      }
    }

    // Center Medallion
    fillRoundRect(
      ctx,
      cx - 125,
      cy - 70,
      250,
      140,
      24,
      theme.cardBg,
      hexToRgba(theme.primary, 0.55),
      2.5
    );
    ctx.textAlign = "center";
    ctx.font = `700 14px ${FONT_FAMILY}`;
    ctx.fillStyle = theme.primary;
    ctx.fillText("OYNANIŞ DÖNGÜSÜ", cx, cy - 26);

    ctx.font = `800 22px ${FONT_FAMILY}`;
    ctx.fillStyle = theme.text;
    ctx.fillText(chartData.centerTitle || "TEMEL DÖNGÜ", cx, cy + 8);

    ctx.font = `500 15px ${FONT_FAMILY}`;
    ctx.fillStyle = theme.muted;
    ctx.fillText(chartData.centerSub || "", cx, cy + 36);

    // Draw Node Cards
    positions.forEach((pos, idx) => {
      const node = nodes[idx];
      const accent = theme.accents[idx % theme.accents.length];
      const x = pos.x - cardW / 2;
      const y = pos.y - cardH / 2;

      // Shadow
      ctx.save();
      ctx.shadowColor = theme.isDark ? "rgba(0,0,0,0.45)" : "rgba(15,23,42,0.10)";
      ctx.shadowBlur = 18;
      ctx.shadowOffsetY = 6;
      fillRoundRect(ctx, x, y, cardW, cardH, 16, theme.cardBg, theme.border, 1.5);
      ctx.restore();

      // Left accent bar inside card
      ctx.fillStyle = accent;
      roundRectPath(ctx, x + 8, y + 12, 5, cardH - 24, 3);
      ctx.fill();

      // Step badge
      fillRoundRect(ctx, x + 22, y + 14, 28, 28, 9, hexToRgba(accent, 0.16), null);
      ctx.textAlign = "center";
      ctx.font = `700 14px ${FONT_FAMILY}`;
      ctx.fillStyle = accent;
      ctx.fillText(String(idx + 1), x + 36, y + 33);

      // Icon + Title
      ctx.textAlign = "left";
      ctx.font = `700 17px ${FONT_FAMILY}`;
      ctx.fillStyle = theme.text;
      const titleLabel = `${node.icon ? node.icon + " " : ""}${node.title || "Adım"}`;
      drawWrappedText(ctx, titleLabel, x + 58, y + 33, cardW - 72, 20, 1, "left");

      // Description
      ctx.font = `400 13.5px ${FONT_FAMILY}`;
      ctx.fillStyle = theme.muted;
      drawWrappedText(ctx, node.desc || "", x + 24, y + 60, cardW - 38, 18, 2, "left");
    });
  }

  /* ========================================================================
     2. ROADMAP / MILESTONE TIMELINE RENDERER
     ======================================================================== */
  function renderRoadmap(ctx, chartData, projectTitle, theme) {
    drawHeader(ctx, chartData.title, chartData.subtitle, projectTitle, theme);

    const phases = chartData.phases && chartData.phases.length ? chartData.phases : [];
    const n = phases.length;
    if (!n) return;

    const marginX = 76;
    const gap = 24;
    const totalW = W - marginX * 2;
    const cardW = (totalW - gap * (n - 1)) / n;
    const spineY = 230;
    const cardY = 286;
    const cardH = 540;

    // Spine track
    const firstCx = marginX + cardW / 2;
    const lastCx = marginX + (n - 1) * (cardW + gap) + cardW / 2;
    ctx.strokeStyle = hexToRgba(theme.border, 0.95);
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(firstCx, spineY);
    ctx.lineTo(lastCx, spineY);
    ctx.stroke();

    // Active progress line up to last non-zero progress phase
    let activeIdx = 0;
    phases.forEach((p, idx) => {
      if ((p.progress || 0) > 0) activeIdx = idx;
    });
    const activeEndX = marginX + activeIdx * (cardW + gap) + cardW / 2;
    ctx.strokeStyle = theme.primary;
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(firstCx, spineY);
    ctx.lineTo(activeEndX, spineY);
    ctx.stroke();

    phases.forEach((phase, idx) => {
      const x = marginX + idx * (cardW + gap);
      const cx = x + cardW / 2;
      const accent = theme.accents[idx % theme.accents.length];

      let statusColor = theme.muted;
      if (phase.status === "Tamamlandı") statusColor = "#10b981";
      else if (phase.status === "Devam Ediyor") statusColor = theme.primary;

      // Vertical connector from spine to card
      ctx.strokeStyle = statusColor;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(cx, spineY);
      ctx.lineTo(cx, cardY);
      ctx.stroke();

      // Date badge above spine
      ctx.font = `700 15px ${FONT_FAMILY}`;
      ctx.textAlign = "center";
      ctx.fillStyle = theme.text;
      ctx.fillText(phase.date || `Faz ${idx + 1}`, cx, spineY - 34);

      // Node circle on spine
      ctx.beginPath();
      ctx.arc(cx, spineY, 18, 0, Math.PI * 2);
      ctx.fillStyle = theme.cardBg;
      ctx.fill();
      ctx.lineWidth = 4;
      ctx.strokeStyle = statusColor;
      ctx.stroke();

      ctx.font = `700 14px ${FONT_FAMILY}`;
      ctx.fillStyle = statusColor;
      ctx.fillText(String(idx + 1), cx, spineY + 5);

      // Card body
      ctx.save();
      ctx.shadowColor = theme.isDark ? "rgba(0,0,0,0.4)" : "rgba(15,23,42,0.08)";
      ctx.shadowBlur = 16;
      ctx.shadowOffsetY = 6;
      fillRoundRect(ctx, x, cardY, cardW, cardH, 18, theme.cardBg, theme.border, 1.5);
      ctx.restore();

      // Top colored header strip
      ctx.fillStyle = accent;
      roundRectPath(ctx, x + 20, cardY + 20, cardW - 40, 6, 3);
      ctx.fill();

      // Status pill
      const statusText = phase.status || "Planlandı";
      ctx.font = `700 13px ${FONT_FAMILY}`;
      const pillW = ctx.measureText(statusText).width + 26;
      fillRoundRect(
        ctx,
        x + 22,
        cardY + 42,
        pillW,
        28,
        14,
        hexToRgba(statusColor, 0.15),
        hexToRgba(statusColor, 0.4),
        1
      );
      ctx.textAlign = "center";
      ctx.fillStyle = statusColor;
      ctx.fillText(statusText, x + 22 + pillW / 2, cardY + 61);

      // Phase Title
      ctx.textAlign = "left";
      ctx.font = `800 22px ${FONT_FAMILY}`;
      ctx.fillStyle = theme.text;
      drawWrappedText(ctx, phase.name || "Aşama", x + 22, cardY + 104, cardW - 44, 26, 2, "left");

      // Progress Bar
      const prog = Math.max(0, Math.min(100, Number(phase.progress || 0)));
      const barY = cardY + 158;
      ctx.font = `600 13px ${FONT_FAMILY}`;
      ctx.fillStyle = theme.muted;
      ctx.fillText(`İlerleme: %${prog}`, x + 22, barY - 8);
      fillRoundRect(ctx, x + 22, barY, cardW - 44, 10, 5, theme.cardAlt, null);
      if (prog > 0) {
        fillRoundRect(ctx, x + 22, barY, ((cardW - 44) * prog) / 100, 10, 5, statusColor, null);
      }

      // Deliverables list
      ctx.font = `700 13px ${FONT_FAMILY}`;
      ctx.fillStyle = theme.muted;
      ctx.fillText("HEDEFLER & ÇIKTILAR", x + 22, barY + 42);

      const items = phase.items || [];
      let curY = barY + 72;
      items.slice(0, 6).forEach((item) => {
        if (curY > cardY + cardH - 36) return;
        ctx.fillStyle = accent;
        ctx.beginPath();
        ctx.arc(x + 28, curY - 5, 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.font = `500 15.5px ${FONT_FAMILY}`;
        ctx.fillStyle = theme.text;
        const used = drawWrappedText(ctx, item, x + 42, curY, cardW - 64, 21, 3, "left");
        curY += used * 21 + 14;
      });
    });
  }

  /* ========================================================================
     3. 2x2 COMPETITOR MATRIX RENDERER
     ======================================================================== */
  function renderCompetitorMatrix(ctx, chartData, projectTitle, theme) {
    drawHeader(ctx, chartData.title, chartData.subtitle, projectTitle, theme);

    const plotX = 295;
    const plotY = 200;
    const plotW = 680;
    const plotH = 580;
    const midX = plotX + plotW / 2;
    const midY = plotY + plotH / 2;

    // Matrix Background Box
    fillRoundRect(ctx, plotX, plotY, plotW, plotH, 16, theme.cardBg, theme.border, 2);

    // Highlight Top-Right Target Quadrant
    ctx.save();
    roundRectPath(ctx, midX, plotY, plotW / 2, plotH / 2, 14);
    ctx.fillStyle = hexToRgba(theme.primary, 0.10);
    ctx.fill();
    ctx.restore();

    // Target Quadrant Label Pill
    const targetTxt = chartData.targetLabel || "Hedef Fırsat Alanı";
    ctx.font = `700 13px ${FONT_FAMILY}`;
    const tW = ctx.measureText(targetTxt).width + 24;
    fillRoundRect(
      ctx,
      plotX + plotW - tW - 14,
      plotY + 14,
      tW,
      28,
      14,
      hexToRgba(theme.primary, 0.2),
      hexToRgba(theme.primary, 0.45),
      1
    );
    ctx.textAlign = "center";
    ctx.fillStyle = theme.primary;
    ctx.fillText(targetTxt, plotX + plotW - tW / 2 - 14, plotY + 33);

    // Subtle Grid Lines (25% / 75%)
    ctx.strokeStyle = hexToRgba(theme.border, 0.55);
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    [0.25, 0.75].forEach((f) => {
      ctx.beginPath();
      ctx.moveTo(plotX + plotW * f, plotY);
      ctx.lineTo(plotX + plotW * f, plotY + plotH);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(plotX, plotY + plotH * f);
      ctx.lineTo(plotX + plotW, plotY + plotH * f);
      ctx.stroke();
    });
    ctx.setLineDash([]);

    // Main Cross Axes
    ctx.strokeStyle = theme.muted;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(plotX, midY);
    ctx.lineTo(plotX + plotW, midY);
    ctx.moveTo(midX, plotY);
    ctx.lineTo(midX, plotY + plotH);
    ctx.stroke();

    // Axis Arrowheads
    drawArrowHead(ctx, plotX + plotW, midY, 0, theme.muted, 11);
    drawArrowHead(ctx, plotX, midY, Math.PI, theme.muted, 11);
    drawArrowHead(ctx, midX, plotY, -Math.PI / 2, theme.muted, 11);
    drawArrowHead(ctx, midX, plotY + plotH, Math.PI / 2, theme.muted, 11);

    // Axis Labels
    ctx.font = `700 16px ${FONT_FAMILY}`;
    ctx.fillStyle = theme.text;
    ctx.textAlign = "center";
    ctx.fillText(`▲ ${chartData.axisTop || "Yüksek Değer"}`, midX, plotY - 16);
    ctx.fillText(`▼ ${chartData.axisBottom || "Düşük Değer"}`, midX, plotY + plotH + 34);

    // Left Axis Label
    drawWrappedText(ctx, `◄ ${chartData.axisLeft || "Sol"}`, plotX - 18, midY - 6, 200, 20, 3, "right");
    // Right Axis Label
    drawWrappedText(ctx, `${chartData.axisRight || "Sağ"} ►`, plotX + plotW + 18, midY - 6, 185, 20, 3, "left");

    // Plot Competitors
    const comps = chartData.competitors || [];
    comps.forEach((c, idx) => {
      const px = plotX + (Math.max(4, Math.min(96, Number(c.x))) / 100) * plotW;
      const py = plotY + plotH - (Math.max(4, Math.min(96, Number(c.y))) / 100) * plotH;
      const color = c.isOurs ? theme.primary : theme.accents[(idx + 1) % theme.accents.length];

      if (c.isOurs) {
        // Halo ring
        ctx.beginPath();
        ctx.arc(px, py, 28, 0, Math.PI * 2);
        ctx.fillStyle = hexToRgba(color, 0.22);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(px, py, 16, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.lineWidth = 3;
        ctx.strokeStyle = theme.bg;
        ctx.stroke();

        ctx.textAlign = "center";
        ctx.font = `700 13px ${FONT_FAMILY}`;
        ctx.fillStyle = "#ffffff";
        ctx.fillText("★", px, py + 5);
      } else {
        ctx.beginPath();
        ctx.arc(px, py, 11, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = theme.bg;
        ctx.stroke();
      }

      // Label pill above dot
      ctx.font = c.isOurs ? `800 15px ${FONT_FAMILY}` : `600 13.5px ${FONT_FAMILY}`;
      const lbl = c.name || "Rakip";
      const lblW = ctx.measureText(lbl).width + 18;
      const lblY = py - (c.isOurs ? 46 : 36);
      fillRoundRect(
        ctx,
        px - lblW / 2,
        lblY,
        lblW,
        24,
        12,
        c.isOurs ? color : theme.cardAlt,
        c.isOurs ? color : theme.border,
        1
      );
      ctx.textAlign = "center";
      ctx.fillStyle = c.isOurs ? "#ffffff" : theme.text;
      ctx.fillText(lbl, px, lblY + 17);
    });

    // Right-Side Legend & Takeaway Panel
    const legX = 1195;
    const legY = 200;
    const legW = 340;
    const legH = 580;
    fillRoundRect(ctx, legX, legY, legW, legH, 18, theme.cardBg, theme.border, 1.5);

    ctx.textAlign = "left";
    ctx.font = `700 18px ${FONT_FAMILY}`;
    ctx.fillStyle = theme.text;
    ctx.fillText("Konumlandırma Özeti", legX + 24, legY + 42);

    ctx.font = `400 13.5px ${FONT_FAMILY}`;
    ctx.fillStyle = theme.muted;
    drawWrappedText(
      ctx,
      "Projemiz sağ üst hedef kadranında konumlanarak rakiplerin kapsamadığı kullanıcı ihtiyacını hedefler.",
      legX + 24,
      legY + 72,
      legW - 48,
      19,
      3,
      "left"
    );

    let rowY = legY + 156;
    comps.slice(0, 8).forEach((c, idx) => {
      const color = c.isOurs ? theme.primary : theme.accents[(idx + 1) % theme.accents.length];
      fillRoundRect(
        ctx,
        legX + 20,
        rowY,
        legW - 40,
        44,
        10,
        c.isOurs ? hexToRgba(theme.primary, 0.14) : theme.cardAlt,
        c.isOurs ? theme.primary : null,
        1.5
      );
      ctx.beginPath();
      ctx.arc(legX + 38, rowY + 22, 7, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();

      ctx.font = c.isOurs ? `700 14px ${FONT_FAMILY}` : `600 13.5px ${FONT_FAMILY}`;
      ctx.fillStyle = theme.text;
      ctx.textAlign = "left";
      ctx.fillText(c.name || "Rakip", legX + 54, rowY + 27);

      ctx.font = `600 12px ${FONT_FAMILY}`;
      ctx.fillStyle = theme.muted;
      ctx.textAlign = "right";
      ctx.fillText(`(${c.x}, ${c.y})`, legX + legW - 32, rowY + 26);

      rowY += 52;
    });
  }

  /* ========================================================================
     4. RADAR CHART RENDERER
     ======================================================================== */
  function renderRadarChart(ctx, chartData, projectTitle, theme) {
    drawHeader(ctx, chartData.title, chartData.subtitle, projectTitle, theme);

    const axes = chartData.axes && chartData.axes.length ? chartData.axes : [];
    const n = axes.length;
    if (n < 3) return;

    const cx = 500;
    const cy = 515;
    const radius = 245;

    // Draw concentric web levels (20..100)
    const levels = 5;
    for (let l = 1; l <= levels; l++) {
      const r = (radius * l) / levels;
      ctx.beginPath();
      for (let i = 0; i < n; i++) {
        const angle = -Math.PI / 2 + (i * Math.PI * 2) / n;
        const x = cx + r * Math.cos(angle);
        const y = cy + r * Math.sin(angle);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fillStyle = l % 2 === 0 ? hexToRgba(theme.cardAlt, 0.35) : hexToRgba(theme.cardBg, 0.55);
      ctx.fill();
      ctx.strokeStyle = theme.border;
      ctx.lineWidth = 1.25;
      ctx.stroke();

      // Percentage label on top axis
      ctx.font = `600 11px ${FONT_FAMILY}`;
      ctx.fillStyle = theme.muted;
      ctx.textAlign = "center";
      ctx.fillText(`${l * 20}`, cx + 16, cy - r + 4);
    }

    // Axis Spokes & Labels
    axes.forEach((ax, i) => {
      const angle = -Math.PI / 2 + (i * Math.PI * 2) / n;
      const ex = cx + radius * Math.cos(angle);
      const ey = cy + radius * Math.sin(angle);

      ctx.strokeStyle = theme.border;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(ex, ey);
      ctx.stroke();

      const lx = cx + (radius + 36) * Math.cos(angle);
      const ly = cy + (radius + 36) * Math.sin(angle);
      ctx.font = `700 15.5px ${FONT_FAMILY}`;
      ctx.fillStyle = theme.text;
      const cos = Math.cos(angle);
      if (Math.abs(cos) < 0.2) ctx.textAlign = "center";
      else if (cos > 0) ctx.textAlign = "left";
      else ctx.textAlign = "right";

      ctx.fillText(ax.label || `Eksen ${i + 1}`, lx, ly + 5);
    });

    // Optional Benchmark Polygon
    if (chartData.showBenchmark) {
      const benchColor = theme.accents[2] || "#f59e0b";
      ctx.beginPath();
      axes.forEach((ax, i) => {
        const val = Math.max(0, Math.min(100, Number(ax.benchmark || 0)));
        const r = (radius * val) / 100;
        const angle = -Math.PI / 2 + (i * Math.PI * 2) / n;
        const x = cx + r * Math.cos(angle);
        const y = cy + r * Math.sin(angle);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.closePath();
      ctx.fillStyle = hexToRgba(benchColor, 0.14);
      ctx.fill();
      ctx.save();
      ctx.setLineDash([7, 5]);
      ctx.strokeStyle = benchColor;
      ctx.lineWidth = 2.5;
      ctx.stroke();
      ctx.restore();
    }

    // Primary Polygon
    ctx.beginPath();
    const pts = axes.map((ax, i) => {
      const val = Math.max(0, Math.min(100, Number(ax.value || 0)));
      const r = (radius * val) / 100;
      const angle = -Math.PI / 2 + (i * Math.PI * 2) / n;
      return {
        x: cx + r * Math.cos(angle),
        y: cy + r * Math.sin(angle),
        val
      };
    });
    pts.forEach((p, i) => {
      if (i === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    });
    ctx.closePath();
    ctx.fillStyle = hexToRgba(theme.primary, 0.28);
    ctx.fill();
    ctx.strokeStyle = theme.primary;
    ctx.lineWidth = 3.5;
    ctx.stroke();

    // Data point dots
    pts.forEach((p) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 7, 0, Math.PI * 2);
      ctx.fillStyle = theme.primary;
      ctx.fill();
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = theme.bg;
      ctx.stroke();
    });

    // Right Executive Breakdown Panel
    const px = 955;
    const py = 185;
    const pw = 580;
    const ph = 650;
    fillRoundRect(ctx, px, py, pw, ph, 20, theme.cardBg, theme.border, 1.5);

    // Legend Row
    ctx.textAlign = "left";
    fillRoundRect(ctx, px + 26, py + 24, 16, 16, 4, theme.primary, null);
    ctx.font = `700 15px ${FONT_FAMILY}`;
    ctx.fillStyle = theme.text;
    ctx.fillText(chartData.primaryLabel || "Projemiz", px + 50, py + 38);

    if (chartData.showBenchmark) {
      const benchColor = theme.accents[2] || "#f59e0b";
      fillRoundRect(ctx, px + 240, py + 24, 16, 16, 4, benchColor, null);
      ctx.fillStyle = theme.muted;
      ctx.fillText(chartData.benchmarkLabel || "Tür Ortalaması", px + 264, py + 38);
    }

    // Horizontal Bars per Axis
    let by = py + 78;
    axes.slice(0, 8).forEach((ax, i) => {
      const val = Math.max(0, Math.min(100, Number(ax.value || 0)));
      const bench = Math.max(0, Math.min(100, Number(ax.benchmark || 0)));
      const barW = pw - 56;

      ctx.font = `600 14.5px ${FONT_FAMILY}`;
      ctx.fillStyle = theme.text;
      ctx.textAlign = "left";
      ctx.fillText(ax.label || "", px + 28, by);

      ctx.textAlign = "right";
      ctx.fillStyle = theme.primary;
      ctx.fillText(`${val}/100`, px + pw - 28, by);

      fillRoundRect(ctx, px + 28, by + 10, barW, 10, 5, theme.cardAlt, null);
      fillRoundRect(ctx, px + 28, by + 10, (barW * val) / 100, 10, 5, theme.primary, null);

      if (chartData.showBenchmark) {
        const markerX = px + 28 + (barW * bench) / 100;
        ctx.fillStyle = theme.accents[2] || "#f59e0b";
        ctx.fillRect(markerX - 1.5, by + 6, 3, 18);
      }

      by += 52;
    });

    // Insight Box at bottom of panel
    const insY = py + ph - 142;
    fillRoundRect(
      ctx,
      px + 24,
      insY,
      pw - 48,
      116,
      14,
      hexToRgba(theme.primary, 0.1),
      hexToRgba(theme.primary, 0.35),
      1.5
    );
    ctx.textAlign = "left";
    ctx.font = `700 15px ${FONT_FAMILY}`;
    ctx.fillStyle = theme.primary;
    ctx.fillText(`💡 ${chartData.insightTitle || "Özet"}`, px + 40, insY + 30);

    ctx.font = `400 14.5px ${FONT_FAMILY}`;
    ctx.fillStyle = theme.text;
    drawWrappedText(ctx, chartData.insightText || "", px + 40, insY + 56, pw - 80, 21, 3, "left");
  }

  /* ========================================================================
     5. BUDGET & BREAK-EVEN RENDERER
     ======================================================================== */
  function renderBudgetBreakEven(ctx, chartData, projectTitle, theme) {
    drawHeader(ctx, chartData.title, chartData.subtitle, projectTitle, theme);

    const cur = chartData.currency || "$";
    const slices = chartData.slices && chartData.slices.length ? chartData.slices : [];
    const totalBudget = slices.reduce((acc, s) => acc + Math.max(0, Number(s.amount || 0)), 0);

    // LEFT PANEL: Budget Donut
    const lx = 64;
    const ly = 180;
    const lw = 680;
    const lh = 660;
    fillRoundRect(ctx, lx, ly, lw, lh, 20, theme.cardBg, theme.border, 1.5);

    ctx.textAlign = "left";
    ctx.font = `700 21px ${FONT_FAMILY}`;
    ctx.fillStyle = theme.text;
    ctx.fillText("Geliştirme Bütçesi Dağılımı", lx + 28, ly + 44);

    const dcx = lx + 205;
    const dcy = ly + 315;
    const outerR = 152;
    const innerR = 92;

    if (totalBudget > 0) {
      let startA = -Math.PI / 2;
      slices.forEach((s, idx) => {
        const val = Math.max(0, Number(s.amount || 0));
        const angleSpan = (val / totalBudget) * Math.PI * 2;
        const color = theme.accents[idx % theme.accents.length];

        ctx.beginPath();
        ctx.arc(dcx, dcy, outerR, startA, startA + angleSpan);
        ctx.arc(dcx, dcy, innerR, startA + angleSpan, startA, true);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
        ctx.strokeStyle = theme.cardBg;
        ctx.lineWidth = 3;
        ctx.stroke();

        startA += angleSpan;
      });
    } else {
      ctx.beginPath();
      ctx.arc(dcx, dcy, outerR, 0, Math.PI * 2);
      ctx.arc(dcx, dcy, innerR, Math.PI * 2, 0, true);
      ctx.fillStyle = theme.cardAlt;
      ctx.fill();
    }

    // Total Budget in center of Donut
    ctx.textAlign = "center";
    ctx.font = `600 13px ${FONT_FAMILY}`;
    ctx.fillStyle = theme.muted;
    ctx.fillText("TOPLAM BÜTÇE", dcx, dcy - 10);

    ctx.font = `800 26px ${FONT_FAMILY}`;
    ctx.fillStyle = theme.text;
    ctx.fillText(formatMoney(totalBudget, cur), dcx, dcy + 22);

    // Slice Legend List on right side of Left Panel
    let legY = ly + 115;
    slices.slice(0, 7).forEach((s, idx) => {
      const val = Math.max(0, Number(s.amount || 0));
      const pct = totalBudget > 0 ? Math.round((val / totalBudget) * 100) : 0;
      const color = theme.accents[idx % theme.accents.length];

      fillRoundRect(ctx, lx + 382, legY, 272, 68, 12, theme.cardAlt, theme.border, 1);
      fillRoundRect(ctx, lx + 394, legY + 14, 8, 40, 4, color, null);

      ctx.textAlign = "left";
      ctx.font = `600 14.5px ${FONT_FAMILY}`;
      ctx.fillStyle = theme.text;
      drawWrappedText(ctx, s.label || "Kalem", lx + 412, legY + 26, 226, 18, 1, "left");

      ctx.font = `700 14.5px ${FONT_FAMILY}`;
      ctx.fillStyle = color;
      ctx.fillText(`${formatMoney(val, cur)}`, lx + 412, legY + 51);

      ctx.textAlign = "right";
      ctx.fillStyle = theme.muted;
      ctx.font = `700 14px ${FONT_FAMILY}`;
      ctx.fillText(`%${pct}`, lx + 640, legY + 51);

      legY += 78;
    });

    // RIGHT PANEL: Break-Even Analysis
    const rx = 772;
    const ry = 180;
    const rw = 764;
    const rh = 660;
    fillRoundRect(ctx, rx, ry, rw, rh, 20, theme.cardBg, theme.border, 1.5);

    ctx.textAlign = "left";
    ctx.font = `700 21px ${FONT_FAMILY}`;
    ctx.fillStyle = theme.text;
    ctx.fillText("Başa Baş Noktası (Break-Even) Projeksiyonu", rx + 28, ry + 44);

    const price = Math.max(0, Number(chartData.unitPrice || 0));
    const feePct = Math.max(0, Math.min(99, Number(chartData.platformFeePct || 0)));
    const netUnit = price * (1 - feePct / 100);
    const breakEvenUnits = netUnit > 0 ? Math.ceil(totalBudget / netUnit) : 0;

    // 4 KPI Cards
    const kpis = [
      { label: "Birim Fiyat", val: `${cur}${price.toFixed(2)}`, accent: theme.text },
      { label: "Platform/Vergi", val: `%${feePct}`, accent: theme.muted },
      { label: "Net Birim Gelir", val: `${cur}${netUnit.toFixed(2)}`, accent: theme.accents[2] || "#10b981" },
      {
        label: "Başa Baş Hedefi",
        val: breakEvenUnits > 0 ? `${breakEvenUnits.toLocaleString("tr-TR")} Adet` : "—",
        accent: theme.primary
      }
    ];
    const kw = (rw - 56 - 36) / 4;
    kpis.forEach((k, idx) => {
      const kx = rx + 28 + idx * (kw + 12);
      const isHighlight = idx === 3;
      fillRoundRect(
        ctx,
        kx,
        ry + 68,
        kw,
        74,
        12,
        isHighlight ? hexToRgba(theme.primary, 0.14) : theme.cardAlt,
        isHighlight ? theme.primary : theme.border,
        1.5
      );
      ctx.textAlign = "left";
      ctx.font = `600 12.5px ${FONT_FAMILY}`;
      ctx.fillStyle = theme.muted;
      ctx.fillText(k.label, kx + 14, ry + 92);

      ctx.font = `800 18.5px ${FONT_FAMILY}`;
      ctx.fillStyle = k.accent;
      ctx.fillText(k.val, kx + 14, ry + 123);
    });

    // Break-Even Line Chart Area
    const gx = rx + 96;
    const gy = ry + 186;
    const gw = rw - 134;
    const gh = 400;

    const maxUnits = Math.max(100, Math.ceil(breakEvenUnits * 1.65));
    const maxRevenue = Math.max(totalBudget * 1.65, maxUnits * netUnit, 1000);

    // Chart Grid
    for (let i = 0; i <= 4; i++) {
      const yLine = gy + gh - (gh * i) / 4;
      ctx.strokeStyle = hexToRgba(theme.border, 0.8);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(gx, yLine);
      ctx.lineTo(gx + gw, yLine);
      ctx.stroke();

      ctx.font = `500 12px ${FONT_FAMILY}`;
      ctx.fillStyle = theme.muted;
      ctx.textAlign = "right";
      ctx.fillText(formatMoney((maxRevenue * i) / 4, cur), gx - 10, yLine + 4);
    }

    // Axes lines
    ctx.strokeStyle = theme.muted;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(gx, gy);
    ctx.lineTo(gx, gy + gh);
    ctx.lineTo(gx + gw, gy + gh);
    ctx.stroke();

    // X-axis unit labels
    [0, 0.25, 0.5, 0.75, 1].forEach((f) => {
      const ux = gx + gw * f;
      const unitsLbl = Math.round(maxUnits * f).toLocaleString("tr-TR");
      ctx.font = `500 12px ${FONT_FAMILY}`;
      ctx.fillStyle = theme.muted;
      ctx.textAlign = "center";
      ctx.fillText(unitsLbl, ux, gy + gh + 24);
    });
    ctx.font = `600 13px ${FONT_FAMILY}`;
    ctx.fillText("Satış Adedi (Kopya / Abone)", gx + gw / 2, gy + gh + 48);

    // Coordinates helper
    const costY = gy + gh - (totalBudget / maxRevenue) * gh;
    const endRevY = gy + gh - ((maxUnits * netUnit) / maxRevenue) * gh;

    if (breakEvenUnits > 0 && netUnit > 0) {
      const beX = gx + (breakEvenUnits / maxUnits) * gw;
      const beY = costY;

      // Profit shaded triangle after Break-Even
      ctx.beginPath();
      ctx.moveTo(beX, beY);
      ctx.lineTo(gx + gw, endRevY);
      ctx.lineTo(gx + gw, costY);
      ctx.closePath();
      ctx.fillStyle = hexToRgba("#10b981", 0.18);
      ctx.fill();

      // Cost horizontal line
      ctx.strokeStyle = "#f43f5e";
      ctx.lineWidth = 3;
      ctx.setLineDash([8, 6]);
      ctx.beginPath();
      ctx.moveTo(gx, costY);
      ctx.lineTo(gx + gw, costY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Net Revenue diagonal line
      ctx.strokeStyle = "#10b981";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(gx, gy + gh);
      ctx.lineTo(gx + gw, endRevY);
      ctx.stroke();

      // Vertical drop from Break-Even
      ctx.strokeStyle = hexToRgba(theme.primary, 0.5);
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(beX, beY);
      ctx.lineTo(beX, gy + gh);
      ctx.stroke();
      ctx.setLineDash([]);

      // Intersection Dot
      ctx.beginPath();
      ctx.arc(beX, beY, 10, 0, Math.PI * 2);
      ctx.fillStyle = theme.primary;
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = theme.cardBg;
      ctx.stroke();

      // Callout Pill
      const callTxt = `Başa Baş: ${breakEvenUnits.toLocaleString("tr-TR")} Adet`;
      ctx.font = `700 13.5px ${FONT_FAMILY}`;
      const cW = ctx.measureText(callTxt).width + 24;
      const pillX = Math.min(gx + gw - cW - 10, Math.max(gx + 10, beX - cW / 2));
      const pillY = Math.max(gy + 8, beY - 46);
      fillRoundRect(ctx, pillX, pillY, cW, 30, 15, theme.primary, null);
      ctx.textAlign = "center";
      ctx.fillStyle = "#ffffff";
      ctx.fillText(callTxt, pillX + cW / 2, pillY + 20);

      // Legend tags inside top-left of chart
      ctx.textAlign = "left";
      ctx.font = `600 12.5px ${FONT_FAMILY}`;
      ctx.fillStyle = "#f43f5e";
      ctx.fillText("--- Sabit Maliyet (Bütçe)", gx + 14, gy + 18);
      ctx.fillStyle = "#10b981";
      ctx.fillText("─── Net Gelir & Kâr Alanı", gx + 195, gy + 18);
    }
  }

  /* ========================================================================
     6. MOSCOW SCOPE MATRIX RENDERER
     ======================================================================== */
  function renderMoscowMatrix(ctx, chartData, projectTitle, theme) {
    drawHeader(ctx, chartData.title, chartData.subtitle, projectTitle, theme);

    const quadrants = [
      {
        key: "must",
        badge: "M",
        title: "MUST HAVE — Olmazsa Olmaz",
        sub: "1.0 çıkışı için kritik çekirdek özellikler",
        color: "#e11d48",
        items: chartData.must || []
      },
      {
        key: "should",
        badge: "S",
        title: "SHOULD HAVE — Olması Önemli",
        sub: "Yüksek değer katan ancak alternatifli özellikler",
        color: theme.primary,
        items: chartData.should || []
      },
      {
        key: "could",
        badge: "C",
        title: "COULD HAVE — Zaman Kalırsa",
        sub: "Cilalama (polish) ve bonus içerikler",
        color: "#10b981",
        items: chartData.could || []
      },
      {
        key: "wont",
        badge: "W",
        title: "WON'T HAVE — İlk Sürümde Yok",
        sub: "Kapsam kaymasını önlemek için ertelenenler",
        color: theme.muted,
        items: chartData.wont || []
      }
    ];

    const startX = 64;
    const startY = 178;
    const gap = 24;
    const cardW = (W - startX * 2 - gap) / 2;
    const cardH = (H - startY - 46 - gap) / 2;

    quadrants.forEach((q, idx) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const x = startX + col * (cardW + gap);
      const y = startY + row * (cardH + gap);

      ctx.save();
      ctx.shadowColor = theme.isDark ? "rgba(0,0,0,0.35)" : "rgba(15,23,42,0.06)";
      ctx.shadowBlur = 14;
      ctx.shadowOffsetY = 4;
      fillRoundRect(ctx, x, y, cardW, cardH, 18, theme.cardBg, theme.border, 1.5);
      ctx.restore();

      // Header band
      fillRoundRect(ctx, x + 16, y + 16, cardW - 32, 62, 12, hexToRgba(q.color, 0.12), null);

      // Letter Badge
      fillRoundRect(ctx, x + 28, y + 27, 40, 40, 10, q.color, null);
      ctx.textAlign = "center";
      ctx.font = `800 20px ${FONT_FAMILY}`;
      ctx.fillStyle = "#ffffff";
      ctx.fillText(q.badge, x + 48, y + 54);

      // Quadrant Title + Sub
      ctx.textAlign = "left";
      ctx.font = `800 18px ${FONT_FAMILY}`;
      ctx.fillStyle = theme.text;
      ctx.fillText(q.title, x + 82, y + 45);

      ctx.font = `500 13px ${FONT_FAMILY}`;
      ctx.fillStyle = theme.muted;
      ctx.fillText(q.sub, x + 82, y + 66);

      // Items
      let iy = y + 108;
      q.items.slice(0, 6).forEach((item) => {
        if (iy > y + cardH - 22) return;
        ctx.beginPath();
        ctx.arc(x + 34, iy - 5, 4.5, 0, Math.PI * 2);
        ctx.fillStyle = q.color;
        ctx.fill();

        ctx.font = `500 16px ${FONT_FAMILY}`;
        ctx.fillStyle = theme.text;
        const used = drawWrappedText(ctx, item, x + 50, iy, cardW - 76, 22, 2, "left");
        iy += used * 22 + 12;
      });
    });
  }

  /* ========================================================================
     7. COMPETITORS CORE ANALYSIS (NESTED ONION LAYERS DIAGRAM)
     ======================================================================== */
  function renderCoreAnalysis(ctx, chartData, projectTitle, theme) {
    drawHeader(ctx, chartData.title, chartData.subtitle, projectTitle, theme);

    const games = (chartData.games || []).slice(0, 3);
    const labels = chartData.layerLabels || {};
    const useClassic = chartData.useClassicColors !== false;

    const palette = useClassic
      ? {
          progBg: "#bae6fd",
          progText: "#0c4a6e",
          collBg: "#fb923c",
          collText: "#431407",
          sideBg: "#fde68a",
          sideText: "#422006",
          coreBg: "#9333ea",
          coreText: "#ffffff",
          ringStroke: "rgba(255,255,255,0.45)"
        }
      : {
          progBg: hexToRgba(theme.accents[0] || theme.primary, 0.22),
          progText: theme.text,
          collBg: hexToRgba(theme.accents[3] || "#f59e0b", 0.42),
          collText: theme.text,
          sideBg: hexToRgba(theme.accents[2] || "#10b981", 0.55),
          sideText: theme.isDark ? "#f8fafc" : "#1f2937",
          coreBg: theme.primary,
          coreText: "#ffffff",
          ringStroke: hexToRgba(theme.border, 0.8)
        };

    const centersX = games.length === 1 ? [800] : games.length === 2 ? [500, 1100] : [295, 800, 1305];
    const bottomY = 556;
    const layers = [
      { key: "progression", label: labels.progression || "PROGRESSION", r: 172, bg: palette.progBg, fg: palette.progText, labelY: 235, valY: 255, maxW: 185, fontSize: 13.5, labelSize: 11.5, maxLines: 2 },
      { key: "collectibles", label: labels.collectibles || "COLLECTIBLES", r: 132, bg: palette.collBg, fg: palette.collText, labelY: 314, valY: 334, maxW: 162, fontSize: 13, labelSize: 11.5, maxLines: 2 },
      { key: "side", label: labels.side || "SIDE MECHANICS", r: 94, bg: palette.sideBg, fg: palette.sideText, labelY: 390, valY: 409, maxW: 134, fontSize: 12.5, labelSize: 11, maxLines: 2 },
      { key: "core", label: labels.core || "CORE MECHANIC", r: 56, bg: palette.coreBg, fg: palette.coreText, labelY: 474, valY: 495, maxW: 92, fontSize: 12.5, labelSize: 10.5, maxLines: 3 }
    ];

    games.forEach((g, idx) => {
      const cx = centersX[idx];
      const isOurs = Boolean(g.isOurs);

      // Game Title Pill / Header above circles
      ctx.font = `800 19px ${FONT_FAMILY}`;
      const titleTxt = isOurs ? `★ ${g.name || "Our Game"}` : g.name || `Rakip ${idx + 1}`;
      const pillW = Math.min(420, ctx.measureText(titleTxt).width + 36);
      fillRoundRect(
        ctx,
        cx - pillW / 2,
        162,
        pillW,
        36,
        18,
        isOurs ? hexToRgba(theme.primary, 0.18) : theme.cardBg,
        isOurs ? theme.primary : theme.border,
        isOurs ? 2 : 1.5
      );
      ctx.textAlign = "center";
      ctx.fillStyle = isOurs ? theme.primary : theme.text;
      ctx.fillText(titleTxt, cx, 187);

      // Draw 4 bottom-aligned tangent nested circles (outer to inner)
      layers.forEach((layer, lIdx) => {
        const cy = bottomY - layer.r;
        ctx.save();
        if (lIdx === 0) {
          ctx.shadowColor = theme.isDark ? "rgba(0,0,0,0.45)" : "rgba(15,23,42,0.10)";
          ctx.shadowBlur = 18;
          ctx.shadowOffsetY = 6;
        }
        ctx.beginPath();
        ctx.arc(cx, cy, layer.r, 0, Math.PI * 2);
        ctx.fillStyle = layer.bg;
        ctx.fill();
        ctx.restore();

        ctx.beginPath();
        ctx.arc(cx, cy, layer.r, 0, Math.PI * 2);
        ctx.strokeStyle = isOurs && lIdx === 0 ? theme.primary : palette.ringStroke;
        ctx.lineWidth = isOurs && lIdx === 0 ? 3 : 1.5;
        ctx.stroke();

        // Layer heading (e.g., PROGRESSION)
        ctx.textAlign = "center";
        ctx.font = `800 ${layer.labelSize}px ${FONT_FAMILY}`;
        ctx.fillStyle = layer.fg;
        ctx.globalAlpha = 0.85;
        ctx.fillText(layer.label, cx, layer.labelY);
        ctx.globalAlpha = 1;

        // Game-specific mechanic inside layer
        ctx.font = `${lIdx === 3 ? "700" : "600"} ${layer.fontSize}px ${FONT_FAMILY}`;
        ctx.fillStyle = layer.fg;
        drawWrappedText(ctx, g[layer.key] || "", cx, layer.valY, layer.maxW, 16, layer.maxLines, "center");
      });

      // Audience & Why Play Analysis Card below circles
      const cardW = 436;
      const cardH = 192;
      const cardX = cx - cardW / 2;
      const cardY = 574;
      fillRoundRect(
        ctx,
        cardX,
        cardY,
        cardW,
        cardH,
        16,
        theme.cardBg,
        isOurs ? hexToRgba(theme.primary, 0.65) : theme.border,
        isOurs ? 2 : 1.5
      );

      ctx.textAlign = "left";
      ctx.font = `700 13px ${FONT_FAMILY}`;
      ctx.fillStyle = theme.primary;
      ctx.fillText("🎯 HEDEF KİTLE & OYUNCU TİPİ", cardX + 20, cardY + 30);

      ctx.font = `500 14px ${FONT_FAMILY}`;
      ctx.fillStyle = theme.text;
      drawWrappedText(ctx, g.audience || "-", cardX + 20, cardY + 52, cardW - 40, 19, 2, "left");

      ctx.font = `700 13px ${FONT_FAMILY}`;
      ctx.fillStyle = theme.accents[2] || "#10b981";
      ctx.fillText("💡 NEDEN OYNANIYOR & DESTEK", cardX + 20, cardY + 112);

      ctx.font = `400 13.5px ${FONT_FAMILY}`;
      ctx.fillStyle = theme.muted;
      drawWrappedText(ctx, g.whyPlay || "-", cardX + 20, cardY + 134, cardW - 40, 19, 2, "left");
    });

    // Bottom Guiding Questions Banner
    if (chartData.footerNote) {
      fillRoundRect(
        ctx,
        64,
        784,
        W - 128,
        74,
        14,
        hexToRgba(theme.primary, 0.08),
        hexToRgba(theme.primary, 0.25),
        1.5
      );
      ctx.textAlign = "left";
      ctx.font = `700 13.5px ${FONT_FAMILY}`;
      ctx.fillStyle = theme.primary;
      ctx.fillText("🧭 SUNUMDA CEVAPLANACAK SORULAR", 88, 812);

      ctx.font = `500 14.5px ${FONT_FAMILY}`;
      ctx.fillStyle = theme.text;
      drawWrappedText(ctx, chartData.footerNote, 88, 837, W - 176, 20, 1, "left");
    }
  }

  /* ========================================================================
     8. DETAILED BRANCHING GAME LOOP FLOWCHART
     ======================================================================== */
  function renderGameLoopFlow(ctx, chartData, projectTitle, theme, isTransparent) {
    const isClassic = chartData.classicWireframe !== false;

    if (isClassic && !isTransparent) {
      ctx.fillStyle = "#f4f4f2";
      ctx.fillRect(0, 0, W, H);
    }

    const style = isClassic
      ? {
          titleColor: "#141413",
          subColor: "#2e2e2c",
          boxFill: "#a6a6a6",
          boxSubFill: "#b3b3b3",
          boxStroke: "#2f2f2e",
          boxText: "#141413",
          lineColor: "#262625",
          chevronFill: "#a6a6a6",
          chevronStroke: "#262625",
          condFill: "#a6a6a6",
          actFill: "#a6a6a6",
          endFill: "#a6a6a6",
          resFill: "#a6a6a6",
          dotFill: "#a6a6a6"
        }
      : {
          titleColor: theme.text,
          subColor: theme.muted,
          boxFill: theme.cardBg,
          boxSubFill: theme.cardAlt,
          boxStroke: theme.border,
          boxText: theme.text,
          lineColor: theme.muted,
          chevronFill: theme.primary,
          chevronStroke: theme.primary,
          condFill: hexToRgba(theme.accents[2] || theme.primary, 0.16),
          actFill: hexToRgba(theme.primary, 0.18),
          endFill: theme.primary,
          resFill: theme.cardAlt,
          dotFill: theme.primary
        };

    // Header
    if (isClassic) {
      ctx.textAlign = "center";
      ctx.textBaseline = "alphabetic";
      ctx.font = `700 34px ${FONT_FAMILY}`;
      ctx.fillStyle = style.titleColor;
      ctx.fillText(chartData.title || "Game loop", W / 2, 84);

      if (chartData.subtitle) {
        ctx.font = `italic 400 18px ${FONT_FAMILY}`;
        ctx.fillStyle = style.subColor;
        ctx.fillText(chartData.subtitle, W / 2, 122);
      }
    } else {
      drawHeader(ctx, chartData.title, chartData.subtitle, projectTitle, theme);
    }

    const steps = chartData.steps && chartData.steps.length ? chartData.steps.slice(0, 5) : [{ title: "Start", subItems: [] }];
    const branches = chartData.branches && chartData.branches.length ? chartData.branches.slice(0, 4) : [];

    // Horizontal Layout Geometry
    const k = steps.length;
    const stepBoxH = 54;
    const subBoxH = 44;
    const subGap = 11;
    const spineY = 485;

    const maxSpineTotalW = 680;
    const firstGap = k > 1 ? 42 : 0;
    const otherGaps = Math.max(0, k - 2) * 14;
    const stepW = Math.min(188, Math.floor((maxSpineTotalW - firstGap - otherGaps) / k));
    const spineTotalW = k * stepW + firstGap + otherGaps;

    const condW = 192;
    const condToActGap = 24;
    const actW = 192;
    const forkOffset = branches.length ? 36 : 0;
    const branchBlockW = branches.length ? forkOffset + condW + condToActGap + actW + 38 : 34;
    const mergeToEndGap = 54;
    const endW = 170;

    const totalDiagramW = spineTotalW + branchBlockW + mergeToEndGap + endW;
    const startX = Math.max(56, Math.round((W - totalDiagramW) / 2));

    // Compute Spine Step Positions
    let cursorX = startX;
    const stepBoxes = steps.map((s, idx) => {
      const box = { x: cursorX, y: spineY - stepBoxH / 2, w: stepW, h: stepBoxH, step: s };
      cursorX += stepW + (idx === 0 ? firstGap : 14);
      return box;
    });
    const lastStepRight = stepBoxes[stepBoxes.length - 1].x + stepW;

    // Connectors between spine steps
    for (let i = 0; i < stepBoxes.length - 1; i++) {
      const a = stepBoxes[i];
      const b = stepBoxes[i + 1];
      ctx.strokeStyle = style.lineColor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(a.x + a.w, spineY);
      ctx.lineTo(b.x, spineY);
      ctx.stroke();

      if (i === 0) {
        drawChevronArrow(ctx, (a.x + a.w + b.x) / 2, spineY, 24, 34, "right", style.chevronFill, style.chevronStroke);
      }
    }

    // Draw Main Spine Step Boxes + Stacked Sub-Items
    stepBoxes.forEach((b) => {
      fillRoundRect(ctx, b.x, b.y, b.w, b.h, 8, style.boxFill, style.boxStroke, 1.8);
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = `600 16.5px ${FONT_FAMILY}`;
      ctx.fillStyle = style.boxText;
      const titleLines = getWrappedLines(ctx, b.step.title || "Adım", b.w - 16).slice(0, 2);
      const titleStartY = spineY - ((titleLines.length - 1) * 18) / 2;
      titleLines.forEach((ln, li) => ctx.fillText(ln, b.x + b.w / 2, titleStartY + li * 18));

      const subs = (b.step.subItems || []).slice(0, 4);
      subs.forEach((sub, sIdx) => {
        const sy = b.y + b.h + 12 + sIdx * (subBoxH + subGap);
        fillRoundRect(ctx, b.x, sy, b.w, subBoxH, 8, style.boxSubFill, style.boxStroke, 1.5);
        ctx.font = `500 14.5px ${FONT_FAMILY}`;
        ctx.fillStyle = style.boxText;
        const subLines = getWrappedLines(ctx, sub, b.w - 16).slice(0, 2);
        const subStartY = sy + subBoxH / 2 - ((subLines.length - 1) * 16) / 2;
        subLines.forEach((ln, li) => ctx.fillText(ln, b.x + b.w / 2, subStartY + li * 16));
      });
    });

    // Branches & Merge
    const endX = startX + totalDiagramW - endW;
    const mergeX = endX - mergeToEndGap;
    const actX = lastStepRight + forkOffset + condW + condToActGap;
    const condX = lastStepRight + forkOffset;
    const forkX = lastStepRight + 18;

    if (branches.length > 0) {
      const m = branches.length;
      let rowOffsets;
      if (m === 1) rowOffsets = [0];
      else if (m === 2) rowOffsets = [-76, 76];
      else if (m === 3) rowOffsets = [-94, 0, 94];
      else rowOffsets = [-138, -46, 46, 138];

      const rowYs = rowOffsets.map((off) => spineY + off);
      const topBranchY = rowYs[0];
      const botBranchY = rowYs[rowYs.length - 1];

      // Spine -> Fork vertical line
      ctx.strokeStyle = style.lineColor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(lastStepRight, spineY);
      ctx.lineTo(forkX, spineY);
      ctx.moveTo(forkX, topBranchY);
      ctx.lineTo(forkX, botBranchY);
      ctx.stroke();

      // Merge vertical line
      const resCenterY = m === 1 ? spineY + 86 : botBranchY;
      ctx.beginPath();
      ctx.moveTo(mergeX, topBranchY);
      ctx.lineTo(mergeX, resCenterY);
      ctx.stroke();

      // Draw each branch row
      branches.forEach((br, idx) => {
        const ry = rowYs[idx];
        const bH = 54;
        const topY = ry - bH / 2;

        // Horizontal connector from fork to condition, condition to action, action to merge
        ctx.strokeStyle = style.lineColor;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(forkX, ry);
        ctx.lineTo(condX, ry);
        ctx.moveTo(condX + condW, ry);
        ctx.lineTo(actX, ry);
        ctx.moveTo(actX + actW, ry);
        ctx.lineTo(mergeX, ry);
        ctx.stroke();

        // Condition Box
        fillRoundRect(ctx, condX, topY, condW, bH, 8, style.condFill, style.boxStroke, 1.8);
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = `600 15.5px ${FONT_FAMILY}`;
        ctx.fillStyle = style.boxText;
        const condLines = getWrappedLines(ctx, br.condition || "Koşul", condW - 18).slice(0, 2);
        const condStartY = ry - ((condLines.length - 1) * 18) / 2;
        condLines.forEach((ln, li) => ctx.fillText(ln, condX + condW / 2, condStartY + li * 18));

        // Action Box
        fillRoundRect(ctx, actX, topY, actW, bH, 8, style.actFill, style.boxStroke, 1.8);
        const actLines = getWrappedLines(ctx, br.action || "Eylem", actW - 18).slice(0, 2);
        const actStartY = ry - ((actLines.length - 1) * 18) / 2;
        actLines.forEach((ln, li) => ctx.fillText(ln, actX + actW / 2, actStartY + li * 18));
      });

      // Optional Result Box at bottom merge
      if (chartData.resultLabel && chartData.resultLabel.trim()) {
        const resW = 156;
        const resH = 52;
        const resX = Math.max(actX + actW + 18, mergeX - 24);
        const resY = resCenterY - resH / 2;
        fillRoundRect(ctx, resX, resY, resW, resH, 8, style.resFill, style.boxStroke, 1.8);
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = `600 16px ${FONT_FAMILY}`;
        ctx.fillStyle = style.boxText;
        ctx.fillText(chartData.resultLabel, resX + resW / 2, resCenterY);
      }

      // Merge line to End Box + Circle Dot + Chevron
      ctx.strokeStyle = style.lineColor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(mergeX, spineY);
      ctx.lineTo(endX, spineY);
      ctx.stroke();

      // Merge node dot
      ctx.beginPath();
      ctx.arc(mergeX, spineY, 8, 0, Math.PI * 2);
      ctx.fillStyle = style.dotFill;
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = style.lineColor;
      ctx.stroke();

      drawChevronArrow(ctx, (mergeX + endX) / 2 + 2, spineY, 24, 34, "right", style.chevronFill, style.chevronStroke);
    } else {
      ctx.strokeStyle = style.lineColor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(lastStepRight, spineY);
      ctx.lineTo(endX, spineY);
      ctx.stroke();
      drawChevronArrow(ctx, (lastStepRight + endX) / 2, spineY, 24, 34, "right", style.chevronFill, style.chevronStroke);
    }

    // End Box (Next player / Sonraki Tur)
    const endY = spineY - stepBoxH / 2;
    fillRoundRect(ctx, endX, endY, endW, stepBoxH, 8, style.endFill, isClassic ? style.boxStroke : style.endFill, 1.8);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `700 17px ${FONT_FAMILY}`;
    ctx.fillStyle = isClassic ? style.boxText : "#ffffff";
    ctx.fillText(chartData.endLabel || "Next player", endX + endW / 2, spineY);

    // Overhead Return Feedback Loop Line
    const loopStartX = endX + endW / 2;
    const loopEndX = stepBoxes[0].x + stepW / 2;
    const loopTopY = 232;

    ctx.strokeStyle = style.lineColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(loopStartX, endY);
    ctx.lineTo(loopStartX, loopTopY);
    ctx.lineTo(loopEndX, loopTopY);
    ctx.lineTo(loopEndX, stepBoxes[0].y);
    ctx.stroke();

    // Left-pointing ribbon chevron on top return line
    drawChevronArrow(ctx, (loopStartX + loopEndX) / 2, loopTopY, 28, 38, "left", style.chevronFill, style.chevronStroke);

    // Bottom-right credit/footer tag
    ctx.textBaseline = "alphabetic";
    if (chartData.footerTag) {
      ctx.textAlign = "right";
      ctx.font = `700 14px ${FONT_FAMILY}`;
      ctx.fillStyle = isClassic ? "#141413" : theme.muted;
      ctx.fillText(chartData.footerTag, W - 56, H - 34);
    }
  }

  /* ========================================================================
     PUBLIC DISPATCHER
     ======================================================================== */
  function renderChartToCanvas(canvas, state, activeChart, transparentOverride = null) {
    if (!canvas || !state) return;
    const ctx = canvas.getContext("2d");
    const theme = CHART_THEMES[state.chartTheme] || CHART_THEMES["notion-light"];
    const isTransparent = transparentOverride !== null ? transparentOverride : Boolean(state.transparentBg);

    ctx.clearRect(0, 0, W, H);
    if (!isTransparent) {
      ctx.fillStyle = theme.bg;
      ctx.fillRect(0, 0, W, H);
    }

    const chartData = state.charts[activeChart];
    if (!chartData) return;

    switch (activeChart) {
      case "coreLoop":
        renderCoreLoop(ctx, chartData, state.projectTitle, theme);
        break;
      case "gameLoopFlow":
        renderGameLoopFlow(ctx, chartData, state.projectTitle, theme, isTransparent);
        break;
      case "roadmap":
        renderRoadmap(ctx, chartData, state.projectTitle, theme);
        break;
      case "matrix":
        renderCompetitorMatrix(ctx, chartData, state.projectTitle, theme);
        break;
      case "coreAnalysis":
        renderCoreAnalysis(ctx, chartData, state.projectTitle, theme);
        break;
      case "radar":
        renderRadarChart(ctx, chartData, state.projectTitle, theme);
        break;
      case "budget":
        renderBudgetBreakEven(ctx, chartData, state.projectTitle, theme);
        break;
      case "moscow":
        renderMoscowMatrix(ctx, chartData, state.projectTitle, theme);
        break;
      default:
        renderCoreLoop(ctx, chartData, state.projectTitle, theme);
    }
  }

  global.PitchCharts = {
    renderChartToCanvas
  };
})(window);
