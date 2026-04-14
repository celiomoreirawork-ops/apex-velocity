import { useState, useEffect } from 'react';
import Layout from './components/layout/Layout';
import TopSellerCard from './components/dashboard/TopSellerCard';
import RankingChart from './components/dashboard/ChartsSection/RankingChart';
import MetaVisualization from './components/dashboard/ChartsSection/MetaVisualization';
import MixDistribution from './components/dashboard/ChartsSection/MixDistribution';
import Highlights from './components/dashboard/Highlights';
import SalesTable from './components/dashboard/SalesTable';

import { useDashboardData } from './hooks/useDashboardData';
import { useDashboardAggregations } from './hooks/useDashboardAggregations';
import { useCardShine } from './hooks/useCardShine';

import { formatBRL } from './utils/formatters';
import { STORAGE_KEYS } from './constants/storage';

import anime from 'animejs';

const GAP = 8; // tokens: gap between every card

export default function App() {
  useCardShine();

  const { data: rawData, totais, sheetTitle, status } = useDashboardData();
  const { sales, top3SellersStats, leaderVolume, topModel, biggestSale } = useDashboardAggregations(rawData);

  const [targetConfig, setTargetConfig] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.META_MENSAL);
    return saved ? parseInt(saved, 10) : 2_000_000;
  });

  const handleTargetChange = (newVal) => {
    setTargetConfig(newVal);
    localStorage.setItem(STORAGE_KEYS.META_MENSAL, newVal.toString());
  };

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    anime({
      targets: '.dashboard-card',
      translateY: [10, 0],
      opacity: [0, 1],
      duration: 260,
      easing: 'cubicBezier(0.22, 1, 0.36, 1)',
      delay: anime.stagger(50)
    });
  }, []);

  const progressPercent = totais.receita > 0 ? (totais.receita / targetConfig) * 100 : 0;

  return (
    <Layout sheetTitle={sheetTitle} status={status}>

      {/* Row 1 — Executive highlight + Monthly goal */}
      <div className="dashboard-card" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: GAP }}>
        <div style={{ minHeight: 360 }}>
          {top3SellersStats.length > 0 && (
            <TopSellerCard
              sellersStats={top3SellersStats}
              leaderVolumeId={leaderVolume[0]}
              biggestSaleId={biggestSale?.revenue}
              salesData={sales}
            />
          )}
        </div>
        <div style={{ minHeight: 360 }}>
          <MetaVisualization
            percent={progressPercent}
            realized={formatBRL(totais.receita)}
            baseTarget={formatBRL(targetConfig)}
            rawRealized={totais.receita}
            rawTarget={targetConfig}
            onTargetChange={handleTargetChange}
            avgTicket={formatBRL(totais.ticketMedio)}
            topModel={topModel[0]}
          />
        </div>
      </div>

      {/* Row 2 — Ranking (full width) */}
      <div className="dashboard-card">
        <RankingChart salesData={sales} />
      </div>

      {/* Row 3 — Mix + Highlights */}
      <div className="dashboard-card" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: GAP, alignItems: 'stretch' }}>
        <MixDistribution salesData={sales} />
        <Highlights
          biggestSale={biggestSale?.model ?? '--'}
          biggestSaleVal={biggestSale ? formatBRL(biggestSale.revenue) : 'R$ 0'}
          biggestSaleQty={biggestSale?.qty}
          leaderVolume={leaderVolume[0].split(' ')[0]}
          leaderVolumeCount={leaderVolume[1]}
          topModel={topModel[0]}
          topModelCount={topModel[1]}
          avgTicket={formatBRL(totais.ticketMedio)}
          receitaAtual={formatBRL(totais.receita)}
          fatAtingido={`${progressPercent.toFixed(0)}%`}
        />
      </div>

      {/* Row 4 — Table */}
      <div className="dashboard-card" style={{ marginBottom: 0 }}>
        <SalesTable salesData={sales} />
      </div>

    </Layout>
  );
}
