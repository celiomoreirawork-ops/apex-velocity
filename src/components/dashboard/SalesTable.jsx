import React, { useState, useMemo } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { formatCurrency } from '../../utils/formatters';

const C = { white: '#FFFFFF', gray200: '#D0D1D6', gray400: '#91939F', gray600: '#585B6C', blue400: '#5B9FFF' };


// Card title icon — 20x20px
const IconFileText = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ width: 20, height: 20, flexShrink: 0 }}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);

const sTh = { fontSize: 10, fontWeight: 300, color: C.gray600, letterSpacing: '-0.02em', whiteSpace: 'nowrap', padding: '14px 20px', textAlign: 'left' };
const sThR = { ...sTh, textAlign: 'right' };

const IconDownload = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16 }}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);
const IconSort = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}>
    <polyline points="8 9 12 5 16 9" />
    <polyline points="16 15 12 19 8 15" />
  </svg>
);

const FilterSelect = ({ label, value, onChange, options, placeholder }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
    <label style={{ fontSize: 9, fontWeight: 300, color: C.gray600, letterSpacing: 'normal' }}>{label}</label>
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      style={{
        fontSize: 10, fontWeight: 300, color: C.white, letterSpacing: '-0.02em',
        background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: 6,
        padding: '6px 10px', outline: 'none', cursor: 'pointer', width: '100%',
      }}
    >
      <option value="">{placeholder}</option>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  </div>
);

export default function SalesTable({ salesData }) {
  const [filterSeller,   setFilterSeller]   = useState('');
  const [filterModel,    setFilterModel]     = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterType,     setFilterType]     = useState('');
  const [sortOrder,      setSortOrder]       = useState('desc');

  const sellers    = [...new Set(salesData.map(s => s.seller))].sort();
  const models     = [...new Set(salesData.map(s => s.model))].sort();
  const categories = [...new Set(salesData.map(s => s.category))].sort();
  const types      = [...new Set(salesData.map(s => s.type))].sort();

  const filteredSales = useMemo(() => {
    let filtered = salesData.filter(s =>
      (!filterSeller   || s.seller   === filterSeller)   &&
      (!filterModel    || s.model    === filterModel)    &&
      (!filterCategory || s.category === filterCategory) &&
      (!filterType     || s.type     === filterType)
    );
    filtered.sort((a, b) => sortOrder === 'desc' ? b.revenue - a.revenue : a.revenue - b.revenue);
    return filtered;
  }, [salesData, filterSeller, filterModel, filterCategory, filterType, sortOrder]);

  return (
    <div className="standard-card" style={{ padding: 0, overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <IconFileText />
          <h3 style={{ fontSize: 14, fontWeight: 500, color: C.white, letterSpacing: '-0.02em' }}>Relatório de Vendas</h3>
        </div>
        <button
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', background: 'rgba(255,255,255,0.05)', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 10, fontWeight: 300, color: C.gray400, letterSpacing: '-0.02em' }}
        >
          <IconDownload />
          Exportar CSV
        </button>
      </div>

      {/* Divider */}
      <div className="card-divider" />

      {/* Filters */}
      <div style={{ padding: '12px 20px', background: 'rgba(255,255,255,0.01)', display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, alignItems: 'end' }}>
        <FilterSelect label="Executivo"     value={filterSeller}   onChange={setFilterSeller}   options={sellers}    placeholder="Todos" />
        <FilterSelect label="Modelo"        value={filterModel}    onChange={setFilterModel}    options={models}     placeholder="Todos" />
        <FilterSelect label="Classe"        value={filterCategory} onChange={setFilterCategory} options={categories} placeholder="Todas" />
        <FilterSelect label="Especificação" value={filterType}     onChange={setFilterType}     options={types}      placeholder="Todas" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ fontSize: 9, fontWeight: 300, color: C.gray600, letterSpacing: 'normal' }}>Ordenar</label>
          <button
            onClick={() => setSortOrder(p => p === 'desc' ? 'asc' : 'desc')}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 10px', background: 'rgba(255,255,255,0.05)', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 10, fontWeight: 300, color: C.gray400, letterSpacing: '-0.02em' }}
          >
            <span>{sortOrder === 'desc' ? 'Maior → Menor' : 'Menor → Maior'}</span>
            <IconSort />
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="card-divider" />

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 900 }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
              <th style={sTh}>Executivo</th>
              <th style={sTh}>Modelo</th>
              <th style={sTh}>Classe</th>
              <th style={sTh}>Especificação</th>
              <th style={sThR}>Preço unit.</th>
              <th style={sThR}>Qtd.</th>
              <th style={sThR}>Valor total</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {filteredSales.map((item, idx) => (
                <Motion.tr
                  layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  key={`${item.seller}-${item.model}-${idx}`}
                  style={{ borderTop: '1px solid rgba(88,91,108,0.12)', cursor: 'default' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '14px 20px', fontSize: 13, fontWeight: 500, color: C.white, letterSpacing: '-0.02em' }}>{item.seller}</td>
                  <td style={{ padding: '14px 20px', fontSize: 13, fontWeight: 300, color: C.gray400, letterSpacing: '-0.02em' }}>{item.model}</td>
                  <td style={{ padding: '14px 20px' }}>
                    <span style={{ display: 'inline-block', padding: '3px 8px', borderRadius: 999, background: 'rgba(255,255,255,0.05)', fontSize: 9, fontWeight: 300, color: C.gray600, letterSpacing: 'normal' }}>
                      {item.category}
                    </span>
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <span style={{
                      display: 'inline-block', padding: '3px 8px', borderRadius: 999,
                      background: (item.type === 'Top de Linha' || item.type === 'Top de linha') ? 'rgba(91,159,255,0.12)' : 'rgba(255,255,255,0.03)',
                      fontSize: 9, fontWeight: 300,
                      color: (item.type === 'Top de Linha' || item.type === 'Top de linha') ? C.blue400 : C.gray600,
                      letterSpacing: 'normal',
                    }}>
                      {item.type}
                    </span>
                  </td>
                  <td style={{ padding: '14px 20px', fontSize: 13, fontWeight: 300, color: C.gray400, letterSpacing: '-0.02em', textAlign: 'right' }}>{formatCurrency(item.price)}</td>
                  <td style={{ padding: '14px 20px', fontSize: 13, fontWeight: 300, color: C.gray400, letterSpacing: '-0.02em', textAlign: 'right' }}>{item.qty}</td>
                  <td style={{ padding: '14px 20px', fontSize: 13, fontWeight: 500, color: C.white, letterSpacing: '-0.02em', textAlign: 'right' }}>{formatCurrency(item.revenue)}</td>
                </Motion.tr>
              ))}
            </AnimatePresence>
            {filteredSales.length === 0 && (
              <tr>
                <td colSpan={7} style={{ padding: '40px 20px', textAlign: 'center', fontSize: 13, fontWeight: 300, color: C.gray600, letterSpacing: '-0.02em' }}>
                  Nenhum resultado encontrado
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
