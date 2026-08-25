import { ReportDefinition } from '../types';

export const FALCON_REPORTS: ReportDefinition[] = [
  // ==================== 1. DAILY DESPATCH & LOGISTICS REPORT ====================
  {
    id: 'rep_sales_daily',
    code: 'FCL-DSP-001',
    title: 'Daily Despatch Report',
    category: 'sales',
    description: 'Live warehouse despatch report querying ot_invoice_head & ot_invoice_item with om_item_uom. Grouped by production division.',
    menuOrder: 1,
    summaryStats: [
      { label: 'Total Weight', value: '44,980.000 KGS', sublabel: 'Net weight dispatched' },
      { label: 'Total Revenue', value: 'AED 97,265.00', sublabel: 'Net Invoiced AED' },
      { label: 'Active Divisions', value: '5 Divisions', sublabel: '002, 003, 004, 007, 008' }
    ],
    columns: [
      { key: 'doDate', label: 'DO Date', type: 'date' },
      { key: 'division', label: 'Division', type: 'badge', align: 'center' },
      { key: 'doNo', label: 'DO Nos.', type: 'text' },
      { key: 'itemCode', label: 'Item Code', type: 'text' },
      { key: 'itemDesc', label: 'Item Description', type: 'text' },
      { key: 'uom', label: 'UOM', type: 'text', align: 'center' },
      { key: 'qty', label: 'Qty', type: 'number', align: 'right' },
      { key: 'itemWt', label: 'Item Wt', type: 'number', align: 'right' },
      { key: 'netWt', label: 'Net Wt (Kgs)', type: 'number', align: 'right' },
      { key: 'amountAed', label: 'Amount (AED)', type: 'currency', align: 'right' }
    ],
    sampleData: [
      {
        doDate: '19-08-2026',
        division: 'CONSTRUCTION CHEMICALS',
        doNo: 'INV 8801',
        itemCode: 'MCCERFLR20',
        itemDesc: 'EUROFLOR TG 110 (20 LTR J/C)',
        uom: 'J/C',
        qty: '300.000',
        itemWt: '1.000',
        netWt: '300.000',
        amountAed: '2,325.00'
      },
      {
        doDate: '19-08-2026',
        division: 'SULPHURIC ACIDS',
        doNo: 'INV 8802',
        itemCode: 'SA-COMM-98',
        itemDesc: 'SULPHURIC ACID 98% COMMERCIAL GRADE (BULK)',
        uom: 'TON',
        qty: '24.000',
        itemWt: '1,000.000',
        netWt: '24,000.000',
        amountAed: '38,400.00'
      },
      {
        doDate: '19-08-2026',
        division: 'SULPHURIC ACIDS',
        doNo: 'INV 8803',
        itemCode: 'SA-TECH-70',
        itemDesc: 'SULPHURIC ACID 70% TECHNICAL (1000L IBC)',
        uom: 'IBC',
        qty: '8.680',
        itemWt: '1,000.000',
        netWt: '8,680.000',
        amountAed: '13,260.00'
      },
      {
        doDate: '19-08-2026',
        division: 'POLYMER LATEX',
        doNo: 'INV 8804',
        itemCode: 'PL-SBR-50',
        itemDesc: 'STYRENE BUTADIENE LATEX SBR-50 (200L DRUM)',
        uom: 'DRM',
        qty: '22.000',
        itemWt: '200.000',
        netWt: '4,400.000',
        amountAed: '25,520.00'
      },
      {
        doDate: '19-08-2026',
        division: 'POLYMER LATEX',
        doNo: 'INV 8805',
        itemCode: 'PL-ACR-40',
        itemDesc: 'PURE ACRYLIC EMULSION ACR-40 (200L DRUM)',
        uom: 'DRM',
        qty: '10.000',
        itemWt: '200.000',
        netWt: '2,000.000',
        amountAed: '11,600.00'
      },
      {
        doDate: '19-08-2026',
        division: 'BITUMEN',
        doNo: 'INV 8806',
        itemCode: 'BIT-EMUL-60',
        itemDesc: 'BITUMEN EMULSION SS1 GRADE (200L DRUM)',
        uom: 'DRM',
        qty: '3.000',
        itemWt: '200.000',
        netWt: '600.000',
        amountAed: '1,560.00'
      },
      {
        doDate: '19-08-2026',
        division: 'BATTERY ACIDS',
        doNo: 'INV 8807',
        itemCode: 'BA-SPEC-128',
        itemDesc: 'BATTERY ELECTROLYTE SG 1.280 (20L CAN)',
        uom: 'CAN',
        qty: '250.000',
        itemWt: '20.000',
        netWt: '5,000.000',
        amountAed: '4,600.00'
      }
    ]
  },

  // ==================== 2. DIVISION SALES (ITEM DRILL-DOWN) ====================
  {
    id: 'rep_sales_customer',
    code: 'FCL-DIV-001',
    title: 'Division Sales Summary',
    category: 'sales',
    description: 'Division level sales breakdown by production plant from ot_invoice_head and ot_invoice_item.',
    menuOrder: 2,
    summaryStats: [
      { label: 'Total Weight', value: '44,980.000 KGS', sublabel: 'Production Plants' },
      { label: 'Total Revenue', value: 'AED 97,265.00', sublabel: 'Invoiced Revenue' },
      { label: 'Top Plant', value: '003 SULPHURIC ACIDS', sublabel: 'AED 51,660.00' }
    ],
    columns: [
      { key: 'divisionCode', label: 'Div #', type: 'text', align: 'center' },
      { key: 'divisionName', label: 'Production Division / Plant', type: 'text' },
      { key: 'weightKgs', label: 'Qty (KGS)', type: 'number', align: 'right' },
      { key: 'amountAed', label: 'Amount (AED)', type: 'currency', align: 'right' }
    ],
    sampleData: [
      { divisionCode: '002', divisionName: 'CONSTRUCTION CHEMICALS', weightKgs: '300.000', amountAed: '2,325.00' },
      { divisionCode: '003', divisionName: 'SULPHURIC ACIDS', weightKgs: '32,680.000', amountAed: '51,660.00' },
      { divisionCode: '004', divisionName: 'POLYMER LATEX', weightKgs: '6,400.000', amountAed: '37,120.00' },
      { divisionCode: '007', divisionName: 'BITUMEN', weightKgs: '600.000', amountAed: '1,560.00' },
      { divisionCode: '008', divisionName: 'BATTERY ACIDS', weightKgs: '5,000.000', amountAed: '4,600.00' }
    ]
  },

  // ==================== 3. PENDING SALES ORDERS ====================
  {
    id: 'rep_sales_outstanding_aging',
    code: 'FCL-PSO-001',
    title: 'Pending Sales Orders - Product Wise',
    category: 'sales',
    description: 'Pending sales orders from PEND_SO and OT_SO_HEAD cross-checked with OS_LOCN_CURR_STK.',
    menuOrder: 3,
    summaryStats: [
      { label: 'Total Pending Lines', value: '48 Orders', sublabel: 'Awaiting dispatch' },
      { label: 'Pending Volume', value: '18,400.00 KGS', sublabel: 'Committed to production' }
    ],
    columns: [
      { key: 'soNo', label: 'SO #', type: 'text' },
      { key: 'soDate', label: 'SO Date', type: 'date' },
      { key: 'txn', label: 'Txn', type: 'badge', align: 'center' },
      { key: 'itemDesc', label: 'Item Description', type: 'text' },
      { key: 'uom', label: 'UOM', type: 'text', align: 'center' },
      { key: 'customer', label: 'Customer Name', type: 'text' },
      { key: 'salesman', label: 'Salesman', type: 'text' },
      { key: 'bQty', label: 'B.Qty', type: 'number', align: 'right' },
      { key: 'dQty', label: 'D.Qty', type: 'number', align: 'right' },
      { key: 'pendQty', label: 'P.Qty', type: 'number', align: 'right' },
      { key: 'currentStock', label: 'Current Stock', type: 'number', align: 'right' }
    ],
    sampleData: [
      { soNo: 'SO-2026-9901', soDate: '19-Aug-2026', txn: 'SO', itemDesc: 'EUROFLOR TG 110 (20 LTR J/C)', uom: 'J/C', customer: 'Emirates Precast Concrete', salesman: 'SM-01', bQty: '500.00', dQty: '200.00', pendQty: '300.00', currentStock: '1,420.00' },
      { soNo: 'SO-2026-9902', soDate: '19-Aug-2026', txn: 'SO', itemDesc: 'SULPHURIC ACID 98% COMMERCIAL GRADE', uom: 'TON', customer: 'Arabian Construction Co (ACC)', salesman: 'SM-02', bQty: '50.00', dQty: '26.00', pendQty: '24.00', currentStock: '120.00' },
      { soNo: 'SO-2026-9903', soDate: '18-Aug-2026', txn: 'SO', itemDesc: 'STYRENE BUTADIENE LATEX SBR-50', uom: 'DRM', customer: 'Gulf Joinery & Woodworks LLC', salesman: 'SM-03', bQty: '40.00', dQty: '18.00', pendQty: '22.00', currentStock: '85.00' }
    ]
  },

  // ==================== 4. FORMULATION COSTING ====================
  {
    id: 'rep_stock_balance',
    code: 'FCL-FCT-001',
    title: 'Formulation Costing (Batch Card)',
    category: 'production',
    description: 'Active Bill of Materials explosion with real-time WAC and stock balance check from OM_FCT_HEAD / OM_FCT_ITEM.',
    menuOrder: 4,
    summaryStats: [
      { label: 'Active FCT Records', value: '4,280 Cards', sublabel: 'Technical Dept' },
      { label: 'Cost Group', value: 'NF', sublabel: 'Weighted Average Cost' }
    ],
    columns: [
      { key: 'itemCode', label: 'Item Code', type: 'text' },
      { key: 'itemName', label: 'Raw Material Description', type: 'text' },
      { key: 'uom', label: 'UOM', type: 'text', align: 'center' },
      { key: 'qty', label: 'QTY', type: 'number', align: 'right' },
      { key: 'wac', label: 'WAC', type: 'number', align: 'right' },
      { key: 'value', label: 'Value (AED)', type: 'currency', align: 'right' },
      { key: 'currentStock', label: 'Stock', type: 'number', align: 'right' },
      { key: 'balance', label: 'Balance', type: 'badge', align: 'right' }
    ],
    sampleData: [
      { itemCode: 'RM-TOL-99', itemName: 'Toluene Industrial Grade 99.8%', uom: 'KGS', qty: '420.000', wac: '4.850000', value: '2,037.00', currentStock: '72,400.000', balance: '71,980.000' },
      { itemCode: 'RM-EA-995', itemName: 'Ethyl Acetate Anhydrous 99.5%', uom: 'KGS', qty: '380.000', wac: '5.200000', value: '1,976.00', currentStock: '58,000.000', balance: '57,620.000' },
      { itemCode: 'RM-CR-NEO', itemName: 'Polychloroprene Rubber Chips', uom: 'KGS', qty: '200.000', wac: '18.400000', value: '3,680.00', currentStock: '42,000.000', balance: '41,800.000' }
    ]
  },

  // ==================== 5. SALESMAN CONTRIBUTION ====================
  {
    id: 'rep_prod_batch_logs',
    code: 'FCL-SMC-001',
    title: 'Salesman Contribution Analysis',
    category: 'sales',
    description: 'Sales revenue and weight breakdown per active sales representative.',
    menuOrder: 5,
    summaryStats: [
      { label: 'Total Rep Weight', value: '44,980.000 Kgs', sublabel: 'All Active Reps' },
      { label: 'Total Rep Sales', value: 'AED 97,265.00', sublabel: 'Invoiced Period' }
    ],
    columns: [
      { key: 'salesman', label: 'Salesman Code / Name', type: 'text' },
      { key: 'weightKgs', label: 'Weight (Kgs)', type: 'number', align: 'right' },
      { key: 'valueAed', label: 'Value (AED)', type: 'currency', align: 'right' },
      { key: 'pctContribution', label: '% Contribution', type: 'badge', align: 'center' }
    ],
    sampleData: [
      { salesman: 'SM-01 (Farhan Siddiqui)', weightKgs: '18,400.00', valueAed: '42,800.00', pctContribution: '44.0%' },
      { salesman: 'SM-02 (Bilal Al-Masri)', weightKgs: '14,200.00', valueAed: '28,600.00', pctContribution: '29.4%' },
      { salesman: 'SM-03 (Kareem Mansoor)', weightKgs: '7,380.00', valueAed: '16,265.00', pctContribution: '16.7%' },
      { salesman: 'SM-04 (Ramesh Patel)', weightKgs: '5,000.00', valueAed: '9,600.00', pctContribution: '9.9%' }
    ]
  }
];
