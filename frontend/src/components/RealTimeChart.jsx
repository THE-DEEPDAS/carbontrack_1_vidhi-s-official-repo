import { useState, useEffect, useRef } from 'react';

export default function RealTimeChart({ title, unit, color, theme }) {
  const [data, setData] = useState(Array(50).fill(0).map((_, i) => ({
    timestamp: Date.now() - (49 - i) * 1000,
    value: 50 + Math.random() * 50,
  })));

  const [isRunning, setIsRunning] = useState(true);
  const [chartType, setChartType] = useState("line");

  const canvasRef = useRef(null);
  const tooltipRef = useRef(null);

  const currentValue = data[data.length - 1]?.value || 0;
  const previousValue = data[data.length - 2]?.value || 0;
  const change = currentValue - previousValue;
  const percentChange = ((change / previousValue) * 100) || 0;
  const isPositive = change >= 0;

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setData(prevData => {
        const lastValue = prevData[prevData.length - 1].value;
        const newValue = Math.max(0, lastValue + (Math.random() - 0.5) * 10);

        return [
          ...prevData.slice(1),
          { timestamp: Date.now(), value: newValue }
        ];
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    ctx.clearRect(0, 0, rect.width, rect.height);

    const colors = {
      background: theme === 'dark' ? '#09090b' : '#ffffff',
      text: theme === 'dark' ? '#a1a1aa' : '#71717a',
      grid: theme === 'dark' ? '#27272a' : '#e4e4e7',
      line: color,
      area: color + '33',
    };

    ctx.fillStyle = colors.background;
    ctx.fillRect(0, 0, rect.width, rect.height);

    const values = data.map(d => d.value);
    const minValue = Math.min(...values) * 0.9;
    const maxValue = Math.max(...values) * 1.1;
    const valueRange = maxValue - minValue;

    ctx.strokeStyle = colors.grid;
    ctx.lineWidth = 1;

    for (let i = 0; i <= 4; i++) {
      const y = rect.height * (i / 4);
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(rect.width, y);
      ctx.stroke();

      const value = maxValue - (i / 4) * valueRange;
      ctx.fillStyle = colors.text;
      ctx.font = '12px Inter, sans-serif';
      ctx.fillText(value.toFixed(2) + ` ${unit}`, 5, y - 5);
    }

    const points = data.map((d, i) => ({
      x: (i / (data.length - 1)) * rect.width,
      y: rect.height - ((d.value - minValue) / valueRange) * rect.height
    }));

    if (chartType === 'area') {
      ctx.fillStyle = colors.area;
      ctx.beginPath();
      ctx.moveTo(points[0].x, rect.height);
      points.forEach(point => ctx.lineTo(point.x, point.y));
      ctx.lineTo(points[points.length - 1].x, rect.height);
      ctx.closePath();
      ctx.fill();
    }

    ctx.strokeStyle = colors.line;
    ctx.lineWidth = 2;
    ctx.beginPath();
    points.forEach((point, i) => i === 0 ? ctx.moveTo(point.x, point.y) : ctx.lineTo(point.x, point.y));
    ctx.stroke();

    ctx.fillStyle = colors.line;
    ctx.beginPath();
    ctx.arc(points[points.length - 1].x, points[points.length - 1].y, 4, 0, Math.PI * 2);
    ctx.fill();

  }, [data, theme, chartType]);

  return (
    <div style={{ padding: '1rem', borderRadius: '8px', backgroundColor: theme === 'dark' ? '#1e1e2e' : '#f9f9f9', marginBottom: '1rem' }}>
      <h3 style={{ color: theme === 'dark' ? '#ffffff' : '#000000' }}>{title}</h3>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
        <span style={{ fontSize: '1.25rem', fontWeight: '600' }}>{currentValue.toFixed(2)} {unit}</span>
        <span style={{ color: isPositive ? '#22c55e' : '#ef4444' }}>{isPositive ? '▲' : '▼'} {change.toFixed(2)} ({percentChange.toFixed(2)}%)</span>
      </div>
      <canvas ref={canvasRef} style={{ width: '100%', height: '200px' }} />
    </div>
  );
}
