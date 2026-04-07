"use client";

import { useEffect, useMemo, useRef } from "react";
import { usePlanStore } from "../../state/planStore";
import { buildChartData } from "../../utils/scoreEngine";

type GapChartProps = {
  planStartDate: string | null;
  totalDays: number;
  currentDay: number;
};

export function GapChart({ planStartDate, totalDays, currentDay }: GapChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dailyScores = usePlanStore((s) => s.dailyScores);

  const chartData = useMemo(
    () => (planStartDate ? buildChartData(dailyScores ?? {}, planStartDate, totalDays) : []),
    [dailyScores, planStartDate, totalDays],
  );

  const progressPct = Math.min(100, Math.round((currentDay / Math.max(1, totalDays)) * 100));
  const todayClose = chartData.length > 0 ? chartData[chartData.length - 1].close : 0;
  const yesterdayClose = chartData.length > 1 ? chartData[chartData.length - 2].close : 0;
  const rawDelta = Math.round((todayClose - yesterdayClose) * 100);
  const deltaSign = rawDelta >= 0 ? "↑" : "↓";
  const deltaPct = Math.abs(rawDelta);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !planStartDate) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const W = canvas.clientWidth || 320;
    const H = canvas.clientHeight || 160;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, W, H);

    const PAD_L = 4;
    const PAD_R = 32;
    const PAD_TOP = 6;
    const chartH = H * 0.68;
    const chartW = W - PAD_L - PAD_R;
    const labelY = H - 4;

    const minVal = 0;
    const maxVal = 1.0;
    const toY = (v: number) =>
      PAD_TOP + chartH - ((Math.max(minVal, Math.min(maxVal, v)) - minVal) / (maxVal - minVal)) * chartH;
    const toX = (dayIdx: number) => PAD_L + (dayIdx / Math.max(1, totalDays - 1)) * chartW;

    // ── Grid lines (25%, 50%, 75%, 100%) ──
    ctx.lineWidth = 0.5;
    [0.25, 0.50, 0.75, 1.0].forEach((pct) => {
      const y = toY(pct);
      ctx.strokeStyle = "rgba(255,255,255,0.05)";
      ctx.beginPath();
      ctx.moveTo(PAD_L, y);
      ctx.lineTo(PAD_L + chartW, y);
      ctx.stroke();
    });

    // ── 100% goal line (dashed, prominent) ──
    const goalY = toY(1.0);
    ctx.strokeStyle = "rgba(200,255,0,0.25)";
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(PAD_L, goalY);
    ctx.lineTo(PAD_L + chartW, goalY);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = "rgba(200,255,0,0.40)";
    ctx.font = `600 7px 'JetBrains Mono', monospace`;
    ctx.textAlign = "left";
    ctx.fillText("GOAL", PAD_L + chartW + 6, goalY + 3);

    // ── 50% reference label ──
    const midY = toY(0.5);
    ctx.fillStyle = "rgba(120,155,195,0.22)";
    ctx.font = `400 6px 'JetBrains Mono', monospace`;
    ctx.textAlign = "left";
    ctx.fillText("50%", PAD_L + chartW + 6, midY + 3);

    // ── Historical data: line chart (connect close values) ──
    const data = chartData;
    if (data.length > 0) {
      // Filled area under the line
      ctx.beginPath();
      ctx.moveTo(toX(0), toY(data[0].close));
      data.forEach((d, i) => ctx.lineTo(toX(i), toY(d.close)));
      ctx.lineTo(toX(data.length - 1), toY(0));
      ctx.lineTo(toX(0), toY(0));
      ctx.closePath();
      const grad = ctx.createLinearGradient(0, toY(1), 0, toY(0));
      grad.addColorStop(0, "rgba(45,212,192,0.18)");
      grad.addColorStop(1, "rgba(45,212,192,0)");
      ctx.fillStyle = grad;
      ctx.fill();

      // Line itself
      ctx.beginPath();
      ctx.moveTo(toX(0), toY(data[0].close));
      data.forEach((d, i) => ctx.lineTo(toX(i), toY(d.close)));
      ctx.strokeStyle = "rgba(45,212,192,0.85)";
      ctx.lineWidth = 1.5;
      ctx.lineJoin = "round";
      ctx.stroke();

      // Today dot
      const todayIdx = data.length - 1;
      const todayX = toX(todayIdx);
      const todayY = toY(data[todayIdx].close);

      // Glow
      const glow = ctx.createRadialGradient(todayX, todayY, 0, todayX, todayY, 10);
      glow.addColorStop(0, "rgba(200,255,0,0.35)");
      glow.addColorStop(1, "rgba(200,255,0,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(todayX - 10, todayY - 10, 20, 20);

      ctx.beginPath();
      ctx.arc(todayX, todayY, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = "#C8FF00";
      ctx.fill();
      ctx.strokeStyle = "#060912";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // "TODAY" label above dot
      ctx.fillStyle = "rgba(200,255,0,0.60)";
      ctx.font = `600 6px 'JetBrains Mono', monospace`;
      ctx.textAlign = "center";
      ctx.fillText("TODAY", todayX, todayY - 10);

      // Activity dots under the line for days with volume
      data.forEach((d, i) => {
        if (d.vol > 0) {
          const dx = toX(i);
          const dy = toY(0) + 8;
          ctx.beginPath();
          ctx.arc(dx, dy, d.isToday ? 2.5 : 1.5, 0, Math.PI * 2);
          ctx.fillStyle = d.isToday ? "rgba(200,255,0,0.70)" : "rgba(45,212,192,0.40)";
          ctx.fill();
        }
      });
    }

    // ── Projection line (from today to goal at end) ──
    const lastClose = data.length > 0 ? data[data.length - 1].close : 0;
    const projStartIdx = data.length - 1;
    const projEndIdx = totalDays - 1;

    if (projStartIdx < projEndIdx) {
      ctx.strokeStyle = "rgba(200,255,0,0.20)";
      ctx.lineWidth = 1.25;
      ctx.setLineDash([3, 5]);
      ctx.beginPath();
      ctx.moveTo(toX(projStartIdx), toY(lastClose));
      // Curve toward 1.0 (100% goal) using a few intermediate points
      const steps = 6;
      for (let s = 1; s <= steps; s++) {
        const t = s / steps;
        const dayIdx = projStartIdx + t * (projEndIdx - projStartIdx);
        const val = lastClose + (1.0 - lastClose) * (1 - Math.pow(1 - t, 2));
        ctx.lineTo(toX(dayIdx), toY(val));
      }
      ctx.stroke();
      ctx.setLineDash([]);

      // Goal dot at the end
      const goalX = toX(projEndIdx);
      ctx.beginPath();
      ctx.arc(goalX, goalY, 3, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(200,255,0,0.50)";
      ctx.fill();
    }

    // ── X-axis month labels ──
    const startDate = new Date(planStartDate);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + totalDays - 1);

    const months: { text: string; dayIdx: number }[] = [];
    const cursor = new Date(startDate);
    // First label: plan start month
    months.push({
      text: cursor.toLocaleDateString("en-US", { month: "short" }),
      dayIdx: 0,
    });
    // Subsequent month boundaries
    cursor.setMonth(cursor.getMonth() + 1);
    cursor.setDate(1);
    while (cursor <= endDate) {
      const dayDiff = Math.floor((cursor.getTime() - startDate.getTime()) / 86400000);
      if (dayDiff >= 0 && dayDiff < totalDays) {
        months.push({
          text: cursor.toLocaleDateString("en-US", { month: "short" }),
          dayIdx: dayDiff,
        });
      }
      cursor.setMonth(cursor.getMonth() + 1);
    }
    // Last label: GOAL
    months.push({ text: "GOAL", dayIdx: totalDays - 1 });

    ctx.fillStyle = "rgba(120,155,195,0.35)";
    ctx.font = `400 7px 'JetBrains Mono', monospace`;
    months.forEach(({ text, dayIdx }, idx) => {
      const cx = toX(dayIdx);
      ctx.textAlign = idx === 0 ? "left" : idx === months.length - 1 ? "right" : "center";
      ctx.fillText(text, cx, labelY);
    });
  }, [chartData, planStartDate, totalDays]);

  return (
    <section
      style={{
        position: "relative",
        background: "rgba(255,255,255,0.07)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: "1px solid rgba(255,255,255,0.14)",
        borderRadius: 20,
        padding: "16px 16px 14px",
        overflow: "hidden",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: 0, left: 0, right: 0, height: 1,
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)",
        }}
      />

      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 8 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
          <span
            style={{
              fontFamily: "var(--font-barlow-condensed), sans-serif",
              fontWeight: 700,
              fontSize: 38,
              lineHeight: 1,
              color: "#C8FF00",
              letterSpacing: "-0.03em",
            }}
          >
            {progressPct}%
          </span>
          <span
            style={{
              fontFamily: "var(--font-body), Georgia, serif",
              fontWeight: 400,
              fontSize: 13,
              color: "rgba(120,155,195,0.75)",
              paddingBottom: 3,
            }}
          >
            complete
          </span>
        </div>
        <div style={{ textAlign: "right", paddingBottom: 3 }}>
          <span
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: 7,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "rgba(120,155,195,0.40)",
              display: "block",
              marginBottom: 2,
            }}
          >
            Day {currentDay} of {totalDays}
          </span>
          <span
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: 12,
              letterSpacing: "0.05em",
              color: rawDelta >= 0 ? "#4CAF7D" : "#FF5555",
              display: "block",
            }}
          >
            {deltaSign} {deltaPct}% today
          </span>
        </div>
      </div>

      <div
        style={{
          height: 2,
          background: "rgba(255,255,255,0.08)",
          borderRadius: 2,
          marginBottom: 10,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${progressPct}%`,
            height: "100%",
            background: "linear-gradient(90deg, rgba(45,212,192,0.8), #C8FF00)",
            borderRadius: 2,
            transition: "width 0.6s ease",
          }}
        />
      </div>

      <canvas
        ref={canvasRef}
        style={{ width: "100%", height: 200, display: "block" }}
      />
    </section>
  );
}
