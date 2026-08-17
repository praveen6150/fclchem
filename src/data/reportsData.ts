import { ReportDefinition } from '../types';

export const FALCON_REPORTS: ReportDefinition[] = [
  // ==================== 1. SALES REPORTS ====================
  {
    id: 'rep_sales_daily',
    code: 'FCL-SAL-001',
    title: 'Daily Sales & Dispatch Analysis',
    category: 'sales',
    description: 'Real-time sales invoices, dispatch quantities, customer PO cross-reference, and gross margins across UAE & GCC regions.',
    menuOrder: 1,
    summaryStats: [
      { label: 'Today Total Sales', value: 'AED 184,250', sublabel: '+14.2% vs yesterday' },
      { label: 'Dispatched Volume', value: '42,800 Liters', sublabel: '24 Truckloads' },
      { label: 'Active Invoices', value: '38 Closed', sublabel: '0 Pending Credit Holds' }
    ],
    columns: [
      { key: 'invoiceNo', label: 'Invoice #', type: 'text' },
      { key: 'date', label: 'Date', type: 'date' },
      { key: 'customer', label: 'Customer / Client Name', type: 'text' },
      { key: 'region', label: 'Region / Emirate', type: 'text' },
      { key: 'product', label: 'Chemical Product', type: 'text' },
      { key: 'qty', label: 'Volume / Qty', type: 'text', align: 'right' },
      { key: 'amount', label: 'Net Amount (AED)', type: 'currency', align: 'right' },
      { key: 'status', label: 'Dispatch Status', type: 'badge', align: 'center' }
    ],
    sampleData: [
      { invoiceNo: 'INV-2026-8801', date: '2026-08-16', customer: 'Arabian Construction Co (ACC)', region: 'Dubai - DIC', product: 'Falcon Proof 100 Waterproofing (20kg)', qty: '650 Pails', amount: '48,750', status: 'Dispatched' },
      { invoiceNo: 'INV-2026-8802', date: '2026-08-16', customer: 'Al Habtoor Engineering', region: 'Dubai - Marina', product: 'Falcon Contact Adhesive 88 (18L)', qty: '320 Drums', amount: '35,200', status: 'Delivered' },
      { invoiceNo: 'INV-2026-8803', date: '2026-08-16', customer: 'Gulf Joinery & Woodworks LLC', region: 'Sharjah Ind. 10', product: 'Falcon PVA Wood Glue 55 (20kg)', qty: '400 Pails', amount: '22,800', status: 'Dispatched' },
      { invoiceNo: 'INV-2026-8804', date: '2026-08-15', customer: 'Emirates Precast Concrete', region: 'Abu Dhabi - ICAD', product: 'Falcon Concrete Admixture HR (1000L IBC)', qty: '12 IBCs', amount: '38,400', status: 'Delivered' },
      { invoiceNo: 'INV-2026-8805', date: '2026-08-15', customer: 'Saudi Arabian Chemical Supply', region: 'Riyadh KSA (Export)', product: 'Falcon Heat Resistant 600C', qty: '80 Tins (20L)', amount: '26,400', status: 'Customs Clear' },
      { invoiceNo: 'INV-2026-8806', date: '2026-08-14', customer: 'National Aluminium & Glazing', region: 'Ajman Free Zone', product: 'Falcon Neutral Silicone (600ml)', qty: '1,200 Foils', amount: '12,700', status: 'Delivered' }
    ]
  },
  {
    id: 'rep_sales_customer',
    code: 'FCL-SAL-002',
    title: 'Customer-Wise Sales & Credit Ledger',
    category: 'sales',
    description: 'Cumulative year-to-date sales per commercial account, payment terms, outstanding credit balance, and assigned tier.',
    menuOrder: 2,
    summaryStats: [
      { label: 'YTD Corporate Turnover', value: 'AED 14,820,000', sublabel: 'Across 140+ Accounts' },
      { label: 'Avg Payment Period', value: '42 Days', sublabel: 'Target: 45 Days' },
      { label: 'Top Tier Accounts', value: '18 Platinum', sublabel: 'AED 8.4M Total' }
    ],
    columns: [
      { key: 'accountCode', label: 'Account ID', type: 'text' },
      { key: 'clientName', label: 'Commercial Client', type: 'text' },
      { key: 'tier', label: 'Account Tier', type: 'badge', align: 'center' },
      { key: 'creditLimit', label: 'Credit Limit (AED)', type: 'currency', align: 'right' },
      { key: 'ytdRevenue', label: 'YTD Purchases (AED)', type: 'currency', align: 'right' },
      { key: 'outstanding', label: 'Current Balance (AED)', type: 'currency', align: 'right' },
      { key: 'paymentTerms', label: 'Terms', type: 'text', align: 'center' }
    ],
    sampleData: [
      { accountCode: 'CL-00104', clientName: 'Arabian Construction Co (ACC)', tier: 'Platinum', creditLimit: '500,000', ytdRevenue: '1,840,000', outstanding: '148,200', paymentTerms: '60 Days PDC' },
      { accountCode: 'CL-00189', clientName: 'Al Habtoor Engineering', tier: 'Platinum', creditLimit: '750,000', ytdRevenue: '2,150,000', outstanding: '192,500', paymentTerms: '45 Days LC' },
      { accountCode: 'CL-00244', clientName: 'Gulf Joinery & Woodworks LLC', tier: 'Gold', creditLimit: '250,000', ytdRevenue: '780,000', outstanding: '64,100', paymentTerms: '30 Days' },
      { accountCode: 'CL-00312', clientName: 'Emirates Precast Concrete', tier: 'Platinum', creditLimit: '600,000', ytdRevenue: '1,420,000', outstanding: '115,000', paymentTerms: '45 Days' },
      { accountCode: 'CL-00405', clientName: 'Oman Industrial Coatings SOAG', tier: 'Gold', creditLimit: '300,000', ytdRevenue: '920,000', outstanding: '48,300', paymentTerms: 'Letter of Credit' },
      { accountCode: 'CL-00520', clientName: 'Doha Chemical Logistics WLL', tier: 'Silver', creditLimit: '150,000', ytdRevenue: '450,000', outstanding: '0', paymentTerms: 'Advance TT' }
    ]
  },
  {
    id: 'rep_sales_outstanding_aging',
    code: 'FCL-SAL-003',
    title: 'Outstanding Debtors & Aging Analysis',
    category: 'sales',
    description: 'Aged receivables schedule segmented by 0-30, 31-60, 61-90, and >90 days overdue buckets for financial auditing.',
    menuOrder: 3,
    summaryStats: [
      { label: 'Total Receivables', value: 'AED 1,640,200', sublabel: 'Current active pipeline' },
      { label: 'Current (0-30 Days)', value: 'AED 1,180,000', sublabel: '72% within term' },
      { label: 'Overdue >90 Days', value: 'AED 42,500', sublabel: 'Actioned with Legal' }
    ],
    columns: [
      { key: 'customer', label: 'Debtor / Company', type: 'text' },
      { key: 'totalDue', label: 'Total Due (AED)', type: 'currency', align: 'right' },
      { key: 'current0_30', label: '0-30 Days', type: 'currency', align: 'right' },
      { key: 'days31_60', label: '31-60 Days', type: 'currency', align: 'right' },
      { key: 'days61_90', label: '61-90 Days', type: 'currency', align: 'right' },
      { key: 'over90', label: '>90 Days', type: 'currency', align: 'right' },
      { key: 'action', label: 'Collection Status', type: 'badge', align: 'center' }
    ],
    sampleData: [
      { customer: 'Arabian Construction Co (ACC)', totalDue: '148,200', current0_30: '110,000', days31_60: '38,200', days61_90: '0', over90: '0', action: 'Normal Cycle' },
      { customer: 'Al Habtoor Engineering', totalDue: '192,500', current0_30: '145,000', days31_60: '47,500', days61_90: '0', over90: '0', action: 'Normal Cycle' },
      { customer: 'Gulf Joinery & Woodworks LLC', totalDue: '64,100', current0_30: '42,000', days31_60: '22,100', days61_90: '0', over90: '0', action: 'PDC Deposited' },
      { customer: 'Jebel Ali Marine Services', totalDue: '58,400', current0_30: '12,000', days31_60: '18,400', days61_90: '16,000', over90: '12,000', action: 'Follow-up Call' },
      { customer: 'Apex Industrial Decor', totalDue: '30,500', current0_30: '0', days31_60: '0', days61_90: '0', over90: '30,500', action: 'Legal Notice' }
    ]
  },

  // ==================== 2. INVENTORY & STOCK REPORTS ====================
  {
    id: 'rep_stock_balance',
    code: 'FCL-INV-001',
    title: 'Finished Goods Stock & Warehouse Ledger',
    category: 'inventory',
    description: 'Live physical inventory balance across DIC Main Warehouse, Jebel Ali Buffer, and Sharjah Transit Yard.',
    menuOrder: 4,
    summaryStats: [
      { label: 'Total Valuation', value: 'AED 8,920,400', sublabel: 'Cost Basis FIFO' },
      { label: 'SKU Count', value: '184 SKUs', sublabel: 'Adhesives & Coatings' },
      { label: 'Reorder Warnings', value: '4 Items Low', sublabel: 'Batch Orders Queued' }
    ],
    columns: [
      { key: 'sku', label: 'Item Code', type: 'text' },
      { key: 'name', label: 'Product / Specification', type: 'text' },
      { key: 'warehouse', label: 'Warehouse Location', type: 'text' },
      { key: 'availableStock', label: 'On-Hand Stock', type: 'text', align: 'right' },
      { key: 'allocated', label: 'Allocated / Reserved', type: 'text', align: 'right' },
      { key: 'minThreshold', label: 'Min Level', type: 'text', align: 'right' },
      { key: 'stockStatus', label: 'Stock Health', type: 'badge', align: 'center' }
    ],
    sampleData: [
      { sku: 'FCL-ADH-088-18L', name: 'Falcon Contact Adhesive 88 (18L Drum)', warehouse: 'DIC Warehouse Bay A2', availableStock: '1,420 Drums', allocated: '320 Drums', minThreshold: '400 Drums', stockStatus: 'Optimal' },
      { sku: 'FCL-PVA-055-20K', name: 'Falcon PVA Wood Glue 55 (20kg Pail)', warehouse: 'DIC Warehouse Bay B1', availableStock: '950 Pails', allocated: '240 Pails', minThreshold: '300 Pails', stockStatus: 'Optimal' },
      { sku: 'FCL-PRF-100-20K', name: 'Falcon Proof 100 Waterproofing (20kg)', warehouse: 'DIC Warehouse Bay C4', availableStock: '2,100 Pails', allocated: '650 Pails', minThreshold: '500 Pails', stockStatus: 'High Demand' },
      { sku: 'FCL-SIL-NEU-600', name: 'Falcon Neutral Silicone (600ml Sausage)', warehouse: 'DIC Warehouse Bay D1', availableStock: '220 Foils', allocated: '180 Foils', minThreshold: '600 Foils', stockStatus: 'Reorder Alert' },
      { sku: 'FCL-EPX-2K-20K', name: 'Falcon Epoxy Floor 2K (20kg Industrial Kit)', warehouse: 'Jebel Ali Buffer Staging', availableStock: '640 Kits', allocated: '120 Kits', minThreshold: '200 Kits', stockStatus: 'Optimal' },
      { sku: 'FCL-HTP-600-20L', name: 'Falcon Heat Resistant 600C (20L Tin)', warehouse: 'DIC Flammable Chemical Room', availableStock: '180 Tins', allocated: '80 Tins', minThreshold: '100 Tins', stockStatus: 'Low Stock' }
    ]
  },
  {
    id: 'rep_stock_raw_materials',
    code: 'FCL-INV-002',
    title: 'Raw Material Monomers & Solvent Balance',
    category: 'inventory',
    description: 'Bulk chemical inventory of base resins, polychloroprene rubber, polyols, solvents (Toluene, Ethyl Acetate), and pigments.',
    menuOrder: 5,
    summaryStats: [
      { label: 'Bulk Solvent Tanks', value: '450,000 Liters', sublabel: '6 Dedicated Silos' },
      { label: 'Resin Polymer Reserves', value: '180 Metric Tons', sublabel: '35 Days Production Run' },
      { label: 'Avg Lead Time', value: '18 Days', sublabel: 'Global Imports' }
    ],
    columns: [
      { key: 'matId', label: 'Material ID', type: 'text' },
      { key: 'chemName', label: 'Chemical / CAS Description', type: 'text' },
      { key: 'siloOrBay', label: 'Storage Tank / Silo', type: 'text' },
      { key: 'currentQty', label: 'Quantity Available', type: 'text', align: 'right' },
      { key: 'purityGrade', label: 'Purity / Grade', type: 'text', align: 'center' },
      { key: 'supplier', label: 'Supplier Source', type: 'text' },
      { key: 'safetyClass', label: 'Hazard Classification', type: 'badge', align: 'center' }
    ],
    sampleData: [
      { matId: 'RM-TOL-99', chemName: 'Toluene Industrial Grade (CAS 108-88-3)', siloOrBay: 'Silo Tank #1 (DIC Underground)', currentQty: '72,400 Liters', purityGrade: '99.8% Tech', supplier: 'SABIC Petrochemicals', safetyClass: 'Class 3 Flammable' },
      { matId: 'RM-EA-995', chemName: 'Ethyl Acetate Anhydrous (CAS 141-78-6)', siloOrBay: 'Silo Tank #2 (DIC Underground)', currentQty: '58,000 Liters', purityGrade: '99.5% Tech', supplier: 'Petrochem Middle East', safetyClass: 'Class 3 Flammable' },
      { matId: 'RM-CR-NEO', chemName: 'Polychloroprene Synthetic Rubber Chips', siloOrBay: 'Climate Warehouse Section C', currentQty: '42,000 Kg', purityGrade: 'High Viscosity', supplier: 'Denka Japan', safetyClass: 'Non-Hazardous' },
      { matId: 'RM-PVA-POLY', chemName: 'Polyvinyl Alcohol High Molecular Granules', siloOrBay: 'Dry Bulk Store Bin 4', currentQty: '28,500 Kg', purityGrade: '98.5% Hydrolyzed', supplier: 'Kuraray Europe', safetyClass: 'Non-Hazardous' },
      { matId: 'RM-ZN-PHOS', chemName: 'Active Zinc Phosphate Anti-Rust Pigment', siloOrBay: 'Pigment Staging Area', currentQty: '14,200 Kg', purityGrade: 'Micronized Powder', supplier: 'Heubach Germany', safetyClass: 'Class 9 Eco-Tox' }
    ]
  },

  // ==================== 3. PRODUCTION & PLANT REPORTS ====================
  {
    id: 'rep_prod_reactor_batch',
    code: 'FCL-PRD-001',
    title: 'Daily Reactor Batch Logs & Yield Analysis',
    category: 'production',
    description: 'Automated mixing logs for 5,000L & 10,000L stainless steel chemical reactors with temperature logs and yield efficiency.',
    menuOrder: 6,
    summaryStats: [
      { label: 'Batches Completed', value: '14 Batches', sublabel: 'Target: 12 Batches' },
      { label: 'Plant Yield Ratio', value: '99.3%', sublabel: '0.7% standard residue' },
      { label: 'QC Lab Approval', value: '100% Passed', sublabel: 'Zero Non-Conformances' }
    ],
    columns: [
      { key: 'batchNo', label: 'Batch #', type: 'text' },
      { key: 'reactorId', label: 'Reactor Unit', type: 'text' },
      { key: 'formulation', label: 'Formulation Product', type: 'text' },
      { key: 'batchVolume', label: 'Output Yield', type: 'text', align: 'right' },
      { key: 'cycleTime', label: 'Cycle Time', type: 'text', align: 'center' },
      { key: 'leadChemist', label: 'Lead Chemist', type: 'text' },
      { key: 'qcStatus', label: 'QC Certificate', type: 'badge', align: 'center' }
    ],
    sampleData: [
      { batchNo: 'B-2026-0816-01', reactorId: 'Reactor R-101 (10,000L SS316)', formulation: 'Falcon Contact Adhesive 88', batchVolume: '9,840 Liters', cycleTime: '4h 15m', leadChemist: 'Dr. Tariq Nabeel', qcStatus: 'Approved & Signed' },
      { batchNo: 'B-2026-0816-02', reactorId: 'Reactor R-102 (5,000L High-Shear)', formulation: 'Falcon PVA Wood Glue 55', batchVolume: '4,960 Liters', cycleTime: '3h 30m', leadChemist: 'Eng. Zayd Farooq', qcStatus: 'Approved & Signed' },
      { batchNo: 'B-2026-0816-03', reactorId: 'Reactor R-103 (5,000L Dispersion)', formulation: 'Falcon Proof 100 Waterproofing', batchVolume: '4,920 Liters', cycleTime: '2h 50m', leadChemist: 'Dr. Evelyn Vance', qcStatus: 'Approved & Signed' },
      { batchNo: 'B-2026-0815-04', reactorId: 'Reactor R-104 (PCE Synthesizer)', formulation: 'Falcon Concrete Admixture HR', batchVolume: '9,910 Liters', cycleTime: '5h 10m', leadChemist: 'Dr. Aris Thorne', qcStatus: 'Approved & Signed' },
      { batchNo: 'B-2026-0815-05', reactorId: 'Reactor R-101 (10,000L SS316)', formulation: 'Falcon Epoxy Floor 2K Part A', batchVolume: '4,850 Liters', cycleTime: '3h 45m', leadChemist: 'Dr. Tariq Nabeel', qcStatus: 'Approved & Signed' }
    ]
  }
];
