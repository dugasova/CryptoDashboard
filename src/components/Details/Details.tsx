import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getCoinDetails } from '../../services/cryptos';
import './Details.scss';

// Define a specific interface for the data returned by the /coins/{id} endpoint
interface CoinDetailsData {
  id: string;
  symbol: string;
  name: string;
  // Define image as an object with thumb property
  image: { thumb: string; small?: string; large?: string };
  // Define current_price as an object with string keys and number values
  current_price: { [key: string]: number };
  market_cap_rank: number;
  market_cap: number | null; // market_cap can be null
  total_volume: number | null; // total_volume can be null
  description: { en: string };
  genesis_date?: string; // Add genesis_date and make it optional
  // Add other properties from the details endpoint as needed
  // homepage: string[];
  // sentiment_votes_up_percentage: number;
  // sentiment_votes_down_percentage: number;
  // etc.
}

const Details: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [coinDetails, setCoinDetails] = useState<CoinDetailsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const data = await getCoinDetails(id);
        if (data) {
          setCoinDetails(data);
        } else {
          setError('Cryptocurrency details not found.');
        }
      } catch (err) {
        setError('Failed to fetch cryptocurrency details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]); // Re-run effect when the ID changes

  if (loading) {
    return <div>Loading details...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!coinDetails) {
    return <div>No details available.</div>;
  }
  console.log(coinDetails);

  return (
    <div className="details-container">
      <div className="details-header">
        {/* Access the thumb property from the image object */}
        <img src={coinDetails.image?.thumb} alt={coinDetails.name} width="50" height="50" />
        <h2>{coinDetails.name} ({coinDetails.symbol.toUpperCase()})</h2>
      </div>

      <div className="details-info">
        <p><strong>Rank:</strong> {coinDetails.market_cap_rank}</p>
        {/* Access the USD price and provide a fallback if null, undefined, or 0 */}
        <p><strong>Current Price:</strong> ${coinDetails.current_price?.usd }</p>
        {/* Provide a fallback for Market Cap if null or 0 */}
        <p><strong>Market Cap:</strong> ${coinDetails.market_cap ? coinDetails.market_cap: 'N/A'}</p>
        {/* Provide a fallback for 24h Volume if null or 0 */}
        <p><strong>24h Volume:</strong> ${coinDetails.total_volume ? coinDetails.total_volume : 'N/A'}</p>
        {/* Add more details as needed */}
        {coinDetails.description?.en && (
          <div className="details-description">
            <h3>Description</h3>
            <p>{coinDetails.description.en}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Details;
