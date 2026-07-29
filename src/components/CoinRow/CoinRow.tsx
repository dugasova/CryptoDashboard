import React from 'react';
import { LineChart, Line, YAxis, ResponsiveContainer } from 'recharts';
import type { CoinData } from '../../types/cryptoTypes';

interface CoinRowProps {
  coin: CoinData;
  username: string | null;
  onRowClick: (coinId: string) => void;
  onAddCoin: (coin: CoinData) => void;
}

// `value && value > 0` would treat 0 (flat) and null (no data) as falsy and
// color both red, as if the price had dropped. Only an actual negative change
// should read as red; a missing value should fall back to the default text color.
function priceChangeColor(value: number | null | undefined): string | undefined {
  if (value == null) return undefined;
  return value >= 0 ? 'green' : 'red';
}

const CoinRow: React.FC<CoinRowProps> = ({ coin, username, onRowClick, onAddCoin }) => {
  const sparkline = coin.sparkline_in_7d?.price;

  return (
    <tr onClick={() => onRowClick(coin.id)} className="clickable-row">
      <td>{coin.market_cap_rank}</td>
      <td>
        <img src={coin.image} alt={coin.name} width="20" height="20" />
        {coin.name} ({coin.symbol.toUpperCase()})
      </td>
      <td>${coin.current_price.toLocaleString()}</td>
      <td style={{ color: priceChangeColor(coin.price_change_percentage_1h_in_currency) }}>
        {coin.price_change_percentage_1h_in_currency?.toFixed(2)}%
      </td>
      <td style={{ color: priceChangeColor(coin.price_change_percentage_24h_in_currency) }}>
        {coin.price_change_percentage_24h_in_currency?.toFixed(2)}%
      </td>
      <td style={{ color: priceChangeColor(coin.price_change_percentage_7d_in_currency) }}>
        {coin.price_change_percentage_7d_in_currency?.toFixed(2)}%
      </td>
      <td>${coin.total_volume.toLocaleString()}</td>
      <td>${coin.market_cap.toLocaleString()}</td>
      <td>
        {sparkline && (
          <ResponsiveContainer width="100%" height={70}>
            <LineChart data={sparkline.map((price: number, index: number) => ({ price, day: index }))}>
              <YAxis hide domain={['dataMin', 'dataMax']} />
              <Line
                type="monotone"
                dataKey="price"
                stroke={sparkline[sparkline.length - 1] >= sparkline[0] ? 'green' : 'red'}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </td>
      <td>
        <button
          onClick={(e) => { e.stopPropagation(); onAddCoin(coin); }}
          disabled={!username}
          title={username ? undefined : 'Log in to save coins to My Crypto'}
        >
          Add to My Crypto
        </button>
      </td>
    </tr>
  );
};

export default React.memo(CoinRow);
