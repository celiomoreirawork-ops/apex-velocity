import { useMemo } from 'react';

/**
 * Custom hook to centralize all data transformations and aggregations.
 * This prevents logic duplication and improves performance via memoization.
 */
export function useDashboardAggregations(rawData) {
  
  // 1. Structural Mapping
  const sales = useMemo(() => {
    if (!rawData || !Array.isArray(rawData)) return [];
    return rawData.map(item => ({
      seller:   item.vendedor        || 'Desconhecido',
      model:    item.carro           || 'Desconhecido',
      category: item.categoria       || 'Outros',
      type:     item.tipo            || 'Outros',
      price:    item.precoUnitario   || 0,
      qty:      item.quantidadeVendida || 0,
      revenue:  item.receitaTotal    || 0,
    }));
  }, [rawData]);

  const hasData = sales.length > 0;

  // 2. Aggregate Totals
  const aggregations = useMemo(() => {
    if (!hasData) return {
      sellerTotals: {},
      sellerVolume: {},
      modelVolume: {},
      categoryRevenue: {},
      typeRevenue: {},
      typeVolume: {},
      biggestSale: null,
      topSeller: ['Sem Vendas', 0],
      leaderVolume: ['Ninguém', 0],
      topModel: ['Nenhum', 0]
    };

    const sellerTotals = {};
    const sellerVolume = {};
    const modelVolume = {};
    const categoryRevenue = {};
    const typeRevenue = {};
    const typeVolume = {};

    sales.forEach(s => {
      // Seller
      sellerTotals[s.seller] = (sellerTotals[s.seller] || 0) + s.revenue;
      sellerVolume[s.seller] = (sellerVolume[s.seller] || 0) + s.qty;
      
      // Model
      modelVolume[s.model]   = (modelVolume[s.model]   || 0) + s.qty;
      
      // Distribution
      categoryRevenue[s.category] = (categoryRevenue[s.category] || 0) + s.revenue;
      typeRevenue[s.type]         = (typeRevenue[s.type]         || 0) + s.revenue;
      typeVolume[s.category]      = (typeVolume[s.category]      || 0) + s.qty;
    });

    const topSeller    = Object.entries(sellerTotals).sort((a, b) => b[1] - a[1])[0];
    const leaderVolume = Object.entries(sellerVolume).sort((a, b) => b[1] - a[1])[0];
    const topModel     = Object.entries(modelVolume).sort((a, b) => b[1] - a[1])[0];
    const biggestSale  = [...sales].sort((a, b) => b.revenue - a.revenue)[0];

    return {
      sellerTotals,
      sellerVolume,
      modelVolume,
      categoryRevenue,
      typeRevenue,
      typeVolume,
      biggestSale,
      topSeller,
      leaderVolume,
      topModel
    };
  }, [sales, hasData]);

  // 3. Top Seller Specific Data
  const topSellerStats = useMemo(() => {
    if (!hasData || !aggregations.topSeller) return null;
    
    const name = aggregations.topSeller[0];
    const items = sales.filter(s => s.seller === name);
    
    const biggestSingleSale = items.length 
      ? [...items].sort((a, b) => b.revenue - a.revenue)[0] 
      : null;
      
    const totalCars = items.reduce((sum, s) => sum + s.qty, 0);
    const carsByClass = items.reduce((acc, s) => {
      acc[s.type] = (acc[s.type] || 0) + s.qty;
      return acc;
    }, {});

    return {
      name,
      revenue: aggregations.topSeller[1],
      biggestSingleSale,
      totalCars,
      carsByClass
    };
  }, [sales, hasData, aggregations.topSeller]);

  return {
    sales,
    hasData,
    ...aggregations,
    topSellerStats
  };
}
