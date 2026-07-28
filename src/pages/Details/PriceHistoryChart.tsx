import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { getCoinMarketChart, ApiError } from '../../services/cryptos';
import './PriceHistoryChart.scss';

interface PriceHistoryChartProps {
  coinId: string;
}

const PERIODS: { label: string; days: number }[] = [
  { label: '24H', days: 1 },
  { label: '7D', days: 7 },
  { label: '30D', days: 30 },
  { label: '1Y', days: 365 },
];

interface PricePoint {
  timestamp: number;
  price: number;
}

const PriceHistoryChart: React.FC<PriceHistoryChartProps> = ({ coinId }) => {
  const [days, setDays] = useState(7);
  const [data, setData] = useState<PricePoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const fetchChart = async () => {
      setLoading(true);
      setError(null);
      try {
        const chart = await getCoinMarketChart(coinId, days);
        if (cancelled) return;
        setData(chart.prices.map(([timestamp, price]) => ({ timestamp, price })));
      } catch (err) {
        if (cancelled) return;
        const message = err instanceof ApiError ? err.message : 'Failed to fetch price history.';
        setError(message);
        console.error(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchChart();
    return () => {
      cancelled = true;
    };
  }, [coinId, days, retryCount]);

  const formatXAxis = (timestamp: number) => {
    const date = new Date(timestamp);
    return days <= 1
      ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <div className="price-history-chart">
      <div className="price-history-chart__periods">
        {PERIODS.map((period) => (
          <button
            key={period.days}
            className={period.days === days ? 'active' : ''}
            onClick={() => setDays(period.days)}
          >
            {period.label}
          </button>
        ))}
      </div>

      {error ? (
        <div className="price-history-chart__error">
          <p>Error: {error}</p>
          <button onClick={() => setRetryCount((count) => count + 1)}>Retry</button>
        </div>
      ) : loading ? (
        <p>Loading price history...</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <XAxis dataKey="timestamp" tickFormatter={formatXAxis} minTickGap={40} />
            <YAxis
              domain={['auto', 'auto']}
              tickFormatter={(value: number) => `$${value.toLocaleString()}`}
              width={80}
            />
            <Tooltip
              labelFormatter={(timestamp: number) => new Date(timestamp).toLocaleString()}
              formatter={(value: number) => [`$${value.toLocaleString()}`, 'Price']}
            />
            <Line type="monotone" dataKey="price" stroke="#8884d8" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default PriceHistoryChart;
