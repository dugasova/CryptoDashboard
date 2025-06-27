import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getCoinDetails } from '../../services/cryptos';
import './Details.scss';
import { Tooltip } from 'react-tooltip';

interface CoinDetailsData {
  id: string;
  symbol: string;
  name: string;
  image: { thumb: string; small?: string; large?: string };
  market_data: {
    current_price: { [key: string]: number };
    market_cap_rank: number;
    market_cap: { [key: string]: number | null } | null;
    fully_diluted_valuation: { [key: string]: number | null } | null;
    total_volume: { [key: string]: number | null } | null;
    circulating_supply: number | null;
  };
  description: { en: string };
  genesis_date?: string;
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
  }, [id]);

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
        <img src={coinDetails.image?.thumb} alt={coinDetails.name} width="50" height="50" />
        <h2>{coinDetails.name} {coinDetails.symbol.toUpperCase()}
          <span>${coinDetails.market_data.current_price?.usd}</span>
        </h2>
      </div>
      <br />
      <hr />
      <div className="details-info">
        <div>
          <strong data-tooltip-id="marketCapTooltip"
            data-tooltip-content="Market Cap = Current Price x Circulating Supply Refers to the total market value of a cryptocurrency's 
            circulating supply. It is similar to the stock market's measurement of multiplying price per share by shares readily
             available in the market (not held & locked by insiders, governments)">
            Market Cap:
          </strong>
          ${coinDetails.market_data.market_cap?.usd ? coinDetails.market_data.market_cap.usd : 'N/A'}
        </div>
        <br />
        <hr />
        <div>
          <strong
            data-tooltip-id="fdvTooltip"
            data-tooltip-content="Fully Diluted Valuation (FDV) = Current Price x Total Supply 
            Fully Diluted Valuation (FDV) is the theoretical market capitalization of a coin if the 
            entirety of its supply is in circulation, based on its current market price. The FDV value is theoretical 
            as increasing the circulating supply of a coin may impact its market price. Also depending on the tokenomics, 
            emission schedule or lock-up period of a coin's supply, it may take a significant time before its entire supply is 
            eleased into circulation.">
            Fully Diluted Valuation:
          </strong>
          ${coinDetails.market_data.fully_diluted_valuation?.usd ? coinDetails.market_data.fully_diluted_valuation.usd : 'N/A'}
        </div>
        <br />
        <hr />
        <div>
          <strong
            data-tooltip-id="circulatingSupplyTooltip"
            data-tooltip-content="The amount of coins that are circulating in the market and 
            are tradeable by the public. It is comparable to looking at shares readily available in the 
            market (not held & locked by insiders, governments)">
            Circulating Supply:
          </strong>
          {coinDetails.market_data.circulating_supply}
        </div>
        <br />
        <hr />
        <div>
          <div>
            <strong
              data-tooltip-id="tradingVolTooltip"
              data-tooltip-content="A measure of a cryptocurrency trading volume across all tracked 
              platforms in the last 24 hours. This is tracked on a rolling 24-hour basis with 
              no open/closing times.">
              24 Hour Trading Vol:
            </strong>
            ${coinDetails.market_data.total_volume?.usd ? coinDetails.market_data.total_volume.usd : 'N/A'}
          </div>
        </div>
        <hr />
        {/* Description Section */}
        <div>
          <div className="details-description">
            <h3>Description</h3>
            <span>{coinDetails.description?.en}</span>
          </div>
        </div>
      </div>
      <Tooltip id="marketCapTooltip" classNameArrow="example-arrow" />
      <Tooltip id="fdvTooltip" />
      <Tooltip id="circulatingSupplyTooltip" />
      <Tooltip id="tradingVolTooltip" />
    </div>
  );
};

export default Details;
