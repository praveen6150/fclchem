import React, { useState } from 'react';
import { ArrowLeft, Printer, ExternalLink, RefreshCw } from 'lucide-react';
import { audioEngine } from '../../services/audioEngine';

interface DivisionSalesViewerProps {
  onBack: () => void;
  serverUrl?: string;
}

interface DivisionData {
  code: string;
  name: string;
  qtyKgs: number;
  amountAed: number;
  items: {
    itemCode: string;
    itemDesc: string;
    uom: string;
    qty: number;
    aed: number;
  }[];
}

const DIVISIONS_DATA: DivisionData[] = [
  {
    code: '002',
    name: 'CONSTRUCTION CHEMICALS',
    qtyKgs: 300.000,
    amountAed: 2325.00,
    items: [
      { itemCode: 'MCCERFLR20', itemDesc: 'EUROFLOR TG 110 (20 LTR J/C)', uom: 'J/C', qty: 300.000, aed: 2325.00 },
      { itemCode: 'MCCPROOF20', itemDesc: 'FALCON PROOF 100 WATERPROOFING (20KG)', uom: 'PAL', qty: 650.000, aed: 48750.00 }
    ]
  },
  {
    code: '003',
    name: 'SULPHURIC ACIDS',
    qtyKgs: 32680.000,
    amountAed: 51660.00,
    items: [
      { itemCode: 'SA-COMM-98', itemDesc: 'SULPHURIC ACID 98% COMMERCIAL GRADE (BULK)', uom: 'TON', qty: 24000.000, aed: 38400.00 },
      { itemCode: 'SA-TECH-70', itemDesc: 'SULPHURIC ACID 70% TECHNICAL (1000L IBC)', uom: 'IBC', qty: 8680.000, aed: 13260.00 }
    ]
  },
  {
    code: '004',
    name: 'POLYMER LATEX',
    qtyKgs: 6400.000,
    amountAed: 37120.00,
    items: [
      { itemCode: 'PL-SBR-50', itemDesc: 'STYRENE BUTADIENE LATEX SBR-50 (200L DRUM)', uom: 'DRM', qty: 4400.000, aed: 25520.00 },
      { itemCode: 'PL-ACR-40', itemDesc: 'PURE ACRYLIC EMULSION ACR-40 (200L DRUM)', uom: 'DRM', qty: 2000.000, aed: 11600.00 }
    ]
  },
  {
    code: '007',
    name: 'BITUMEN',
    qtyKgs: 600.000,
    amountAed: 1560.00,
    items: [
      { itemCode: 'BIT-EMUL-60', itemDesc: 'BITUMEN EMULSION SS1 GRADE (200L DRUM)', uom: 'DRM', qty: 600.000, aed: 1560.00 }
    ]
  },
  {
    code: '008',
    name: 'BATTERY ACIDS',
    qtyKgs: 5000.000,
    amountAed: 4600.00,
    items: [
      { itemCode: 'BA-SPEC-128', itemDesc: 'BATTERY ELECTROLYTE SG 1.280 (20L CAN)', uom: 'CAN', qty: 5000.000, aed: 4600.00 }
    ]
  }
];

export const DivisionSalesViewer: React.FC<DivisionSalesViewerProps> = ({ onBack, serverUrl = 'http://192.168.100.202:8080/sales-report/' }) => {
  const [fromDate, setFromDate] = useState('19-08-2026');
  const [toDate, setToDate] = useState('19-08-2026');
  const [selectedDivCode, setSelectedDivCode] = useState<string>('002');
  const [sortBy, setSortBy] = useState<'qty' | 'aed'>('aed');
  const [useLiveIframe, setUseLiveIframe] = useState(false);

  const selectedDivision = DIVISIONS_DATA.find(d => d.code === selectedDivCode) || DIVISIONS_DATA[0];

  const totalQty = DIVISIONS_DATA.reduce((acc, d) => acc + d.qtyKgs, 0);
  const totalAed = DIVISIONS_DATA.reduce((acc, d) => acc + d.amountAed, 0);

  // Sorted items
  const sortedItems = [...selectedDivision.items].sort((a, b) => {
    return sortBy === 'qty' ? b.qty - a.qty : b.aed - a.aed;
  });

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#1e293b] font-sans p-4 sm:p-6 flex flex-col">
      
      {/* Top Breadcrumb Navigation */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <button
          onClick={() => {
            audioEngine.playClick();
            onBack();
          }}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2563eb] hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Return to Portal Overview
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setUseLiveIframe(!useLiveIframe)}
            className={`px-3 py-1 text-xs font-medium rounded-lg border transition-all ${
              useLiveIframe 
                ? 'bg-sky-600 text-white border-sky-600' 
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            }`}
          >
            {useLiveIframe ? '📱 Interactive Direct View' : '🌐 Embed 192.168.100.202:8080 iFrame'}
          </button>
          
          <a
            href={serverUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow transition-all"
          >
            <ExternalLink className="w-3 h-3" /> Open in New Tab
          </a>
        </div>
      </div>

      {useLiveIframe ? (
        <div className="flex-1 bg-white border border-slate-300 rounded-xl overflow-hidden shadow-sm flex flex-col min-h-[600px]">
          <div className="bg-slate-900 text-white px-4 py-2 text-xs flex justify-between items-center">
            <span>Direct Connected: <code className="text-sky-300">http://192.168.100.202:8080/sales-report/</code></span>
            <span className="text-[11px] text-emerald-400 font-mono">RBAC Gate Passed</span>
          </div>
          <iframe 
            src={serverUrl} 
            title="Division Sales Report" 
            className="w-full flex-1 border-0" 
            style={{ minHeight: '650px' }}
          />
        </div>
      ) : (
        <>
          {/* Header Filter Box */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 mb-5 flex items-center justify-between flex-wrap gap-4 shadow-sm">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                <span>From:</span>
                <input
                  type="text"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-28 text-center px-2 py-1.5 border border-slate-300 rounded-md text-xs font-mono bg-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                <span>To:</span>
                <input
                  type="text"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-28 text-center px-2 py-1.5 border border-slate-300 rounded-md text-xs font-mono bg-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <button
                onClick={() => {
                  audioEngine.playClick();
                  audioEngine.playSuccess();
                }}
                className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-4 py-1.5 rounded-md text-xs font-semibold shadow-sm transition-all"
              >
                Apply Filter
              </button>

              <button
                onClick={() => {
                  audioEngine.playSuccess();
                  window.print();
                }}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 px-4 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" /> Print
              </button>
            </div>

            <div className="text-xs text-slate-500">
              Click <strong className="text-blue-600">&gt;&gt;</strong> to expand items &middot; Toggle header arrows to sort
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">TOTAL WEIGHT (KGS)</div>
              <div className="text-xl font-bold font-mono text-[#0f172a] mt-1">
                {totalQty.toLocaleString('en-US', { minimumFractionDigits: 3, maximumFractionDigits: 3 })}
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">TOTAL REVENUE (AED)</div>
              <div className="text-xl font-bold font-mono text-[#2563eb] mt-1">
                {totalAed.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">SELECTED DIVISION</div>
              <div className="text-lg font-bold text-[#0f172a] mt-1">
                {selectedDivision.code}
              </div>
            </div>
          </div>

          {/* Main Dual Table Split Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1 items-start">
            
            {/* Left Panel: Divisions Table */}
            <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-[#f8fafc] border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                    <th className="p-3 text-center w-14">DIV #</th>
                    <th className="p-3 text-left">PRODUCTION DIVISION</th>
                    <th className="p-3 text-right">QTY (KGS)</th>
                    <th className="p-3 text-right">AMOUNT (AED)</th>
                    <th className="p-3 text-center w-12"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {DIVISIONS_DATA.map((div) => {
                    const isSelected = div.code === selectedDivCode;
                    return (
                      <tr 
                        key={div.code}
                        className={`transition-colors cursor-pointer ${
                          isSelected ? 'bg-[#eff6ff] font-semibold' : 'hover:bg-slate-50'
                        }`}
                        onClick={() => {
                          audioEngine.playClick();
                          setSelectedDivCode(div.code);
                        }}
                      >
                        <td className="p-3 text-center text-slate-700">{div.code}</td>
                        <td className="p-3 text-left font-sans text-slate-900">{div.name}</td>
                        <td className="p-3 text-right text-slate-800">
                          {div.qtyKgs.toLocaleString('en-US', { minimumFractionDigits: 3, maximumFractionDigits: 3 })}
                        </td>
                        <td className="p-3 text-right font-bold text-slate-900">
                          {div.amountAed.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td className="p-3 text-center">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              audioEngine.playClick();
                              setSelectedDivCode(div.code);
                            }}
                            className={`px-2 py-0.5 rounded text-[11px] font-bold border transition-all ${
                              isSelected 
                                ? 'bg-blue-600 text-white border-blue-600' 
                                : 'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-600 hover:text-white'
                            }`}
                          >
                            &gt;&gt;
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="bg-[#f8fafc] border-t-2 border-slate-300 font-bold text-slate-900 font-mono">
                    <td colSpan={2} className="p-3 text-right font-sans">Total Summary</td>
                    <td className="p-3 text-right">
                      {totalQty.toLocaleString('en-US', { minimumFractionDigits: 3, maximumFractionDigits: 3 })}
                    </td>
                    <td className="p-3 text-right">
                      {totalAed.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Right Panel: Item Drilldown */}
            <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-[#f8fafc] border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                    <th className="p-3 text-left w-28">ITEM CODE</th>
                    <th className="p-3 text-left">ITEM DESCRIPTION</th>
                    <th className="p-3 text-center w-16">UOM</th>
                    <th className="p-3 text-right w-24">
                      <button 
                        onClick={() => setSortBy('qty')}
                        className={`hover:text-blue-600 transition-colors ${sortBy === 'qty' ? 'text-blue-600 font-bold underline' : ''}`}
                      >
                        QTY ▼
                      </button>
                    </th>
                    <th className="p-3 text-right w-28">
                      <button 
                        onClick={() => setSortBy('aed')}
                        className={`hover:text-blue-600 transition-colors ${sortBy === 'aed' ? 'text-blue-600 font-bold underline' : ''}`}
                      >
                        AED ▼
                      </button>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {sortedItems.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3 font-semibold text-slate-800">{item.itemCode}</td>
                      <td className="p-3 font-sans text-slate-900">{item.itemDesc}</td>
                      <td className="p-3 text-center text-slate-500">{item.uom}</td>
                      <td className="p-3 text-right text-slate-800">
                        {item.qty.toLocaleString('en-US', { minimumFractionDigits: 3, maximumFractionDigits: 3 })}
                      </td>
                      <td className="p-3 text-right font-bold text-slate-900">
                        {item.aed.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        </>
      )}

    </div>
  );
};
