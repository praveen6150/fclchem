import { OracleReportModule, OracleReportItem } from '../types';

export const ORACLE_REPORT_MODULES: OracleReportModule[] = [
  {
    id: 'sales_analytics',
    name: 'Sales Analytics',
    order: 1,
    reports: [
      {
        id: 'ora_sales_div_drilldown',
        moduleId: 'sales_analytics',
        moduleName: 'Sales Analytics',
        title: 'Division Sales (Item Drill-Down)',
        status: 'LIVE',
        oracleCode: 'REP_SALES_DIV_01.RDF',
        description: 'Hierarchical division breakdown by product line, sales revenue, and volume quantities.',
        summaryStats: [
          { label: 'Division Revenue', value: 'AED 4,820,400', sublabel: 'Current Fiscal Period' },
          { label: 'Top Division', value: 'Adhesives & Sealants', sublabel: '64.2% Contribution' }
        ],
        columns: [
          { key: 'division', label: 'Division', type: 'text' },
          { key: 'itemCode', label: 'Item Code', type: 'text' },
          { key: 'description', label: 'Product Name', type: 'text' },
          { key: 'qtySold', label: 'Qty Sold', type: 'text', align: 'right' },
          { key: 'grossAmount', label: 'Gross (AED)', type: 'currency', align: 'right' },
          { key: 'netMargin', label: 'Margin %', type: 'badge', align: 'center' }
        ],
        sampleData: [
          { division: 'Adhesives & Glues', itemCode: 'FCL-ADH-088', description: 'Falcon Contact Adhesive 88 (18L)', qtySold: '1,840 Drums', grossAmount: '202,400', netMargin: '31.4%' },
          { division: 'Adhesives & Glues', itemCode: 'FCL-PVA-055', description: 'Falcon PVA Wood Glue 55 (20kg)', qtySold: '920 Pails', grossAmount: '52,440', netMargin: '28.6%' },
          { division: 'Construction Chemicals', itemCode: 'FCL-PRF-100', description: 'Falcon Proof 100 Waterproofing (20kg)', qtySold: '1,450 Pails', grossAmount: '108,750', netMargin: '34.2%' },
          { division: 'Industrial Coatings', itemCode: 'FCL-HTP-600', description: 'Falcon Heat Resistant 600C (20L)', qtySold: '340 Tins', grossAmount: '112,200', netMargin: '38.0%' }
        ]
      },
      {
        id: 'ora_sales_avg_analysis',
        moduleId: 'sales_analytics',
        moduleName: 'Sales Analytics',
        title: 'Average Sales Analysis',
        status: 'LIVE',
        oracleCode: 'REP_SALES_AVG_02.RDF',
        description: 'Monthly and quarterly rolling averages per sales channel, territory, and product group.',
        summaryStats: [
          { label: 'Daily Avg Sales', value: 'AED 162,500', sublabel: 'Last 30 Days' },
          { label: 'Order Size Avg', value: 'AED 14,800', sublabel: 'Direct B2B' }
        ],
        columns: [
          { key: 'period', label: 'Period / Month', type: 'text' },
          { key: 'channel', label: 'Sales Channel', type: 'text' },
          { key: 'totalOrders', label: 'Total Orders', type: 'number', align: 'center' },
          { key: 'avgOrderVal', label: 'Avg Order (AED)', type: 'currency', align: 'right' },
          { key: 'monthlyRunRate', label: 'Run Rate (AED)', type: 'currency', align: 'right' }
        ],
        sampleData: [
          { period: 'August 2026 (MTD)', channel: 'Direct Construction & Contractors', totalOrders: '124', avgOrderVal: '18,400', monthlyRunRate: '2,281,600' },
          { period: 'August 2026 (MTD)', channel: 'GCC Export Distributors (KSA/Oman)', totalOrders: '38', avgOrderVal: '44,200', monthlyRunRate: '1,679,600' },
          { period: 'August 2026 (MTD)', channel: 'Joinery & Woodwork OEM Supply', totalOrders: '86', avgOrderVal: '9,800', monthlyRunRate: '842,800' }
        ]
      },
      {
        id: 'ora_sales_customer_date',
        moduleId: 'sales_analytics',
        moduleName: 'Sales Analytics',
        title: 'Customerwise Sales & Date',
        status: 'SOON',
        oracleCode: 'REP_CUST_DATE_03.RDF',
        description: 'Date-wise chronological ledger of invoices dispatched to individual commercial clients.'
      },
      {
        id: 'ora_sales_cust_supp_master',
        moduleId: 'sales_analytics',
        moduleName: 'Sales Analytics',
        title: 'Customer / Supplier Master',
        status: 'LIVE',
        oracleCode: 'REP_MASTER_04.RDF',
        description: 'Enterprise master registry of approved B2B buyers, chemical suppliers, VAT TRN, and credit terms.',
        summaryStats: [
          { label: 'Active B2B Clients', value: '142 Verified', sublabel: 'Dubai, Abu Dhabi, Sharjah, GCC' },
          { label: 'Chemical Suppliers', value: '48 Partners', sublabel: 'SABIC, Denka, Kuraray, Heubach' }
        ],
        columns: [
          { key: 'code', label: 'Master ID', type: 'text' },
          { key: 'type', label: 'Entity Type', type: 'badge', align: 'center' },
          { key: 'name', label: 'Company Name', type: 'text' },
          { key: 'trn', label: 'VAT TRN Number', type: 'text' },
          { key: 'city', label: 'Jurisdiction / City', type: 'text' },
          { key: 'creditDays', label: 'Payment Terms', type: 'text', align: 'center' },
          { key: 'status', label: 'Status', type: 'badge', align: 'center' }
        ],
        sampleData: [
          { code: 'CUST-1001', type: 'Customer', name: 'Arabian Construction Co (ACC)', trn: '100293819200003', city: 'Dubai Industrial City', creditDays: '60 Days PDC', status: 'ACTIVE' },
          { code: 'CUST-1002', type: 'Customer', name: 'Al Habtoor Engineering LLC', trn: '100481920100003', city: 'Dubai Marina', creditDays: '45 Days LC', status: 'ACTIVE' },
          { code: 'CUST-1003', type: 'Customer', name: 'Gulf Joinery & Woodworks LLC', trn: '100918230100003', city: 'Sharjah Industrial 10', creditDays: '30 Days', status: 'ACTIVE' },
          { code: 'SUPP-2001', type: 'Supplier', name: 'SABIC Petrochemicals', trn: '300491829100003', city: 'Riyadh, KSA', creditDays: '30 Days TT', status: 'ACTIVE' },
          { code: 'SUPP-2002', type: 'Supplier', name: 'Denka Performance Elastomer', trn: 'JP-994821039', city: 'Tokyo, Japan', creditDays: 'LC at Sight', status: 'ACTIVE' }
        ]
      },
      {
        id: 'ora_sales_product_ig',
        moduleId: 'sales_analytics',
        moduleName: 'Sales Analytics',
        title: 'Sales by Product (IG-wise)',
        status: 'SOON',
        oracleCode: 'REP_PROD_IG_05.RDF',
        description: 'Industry Group (IG) segmentation of polymer and adhesive sales.'
      },
      {
        id: 'ora_sales_salesman_rep',
        moduleId: 'sales_analytics',
        moduleName: 'Sales Analytics',
        title: 'Salesmanwise Sales Report',
        status: 'LIVE',
        oracleCode: 'REP_SALESMAN_06.RDF',
        description: 'Target achievement, quarterly commission base, and total bookings per corporate sales representative.',
        summaryStats: [
          { label: 'Active Field Reps', value: '8 Executives', sublabel: 'UAE & GCC Territories' },
          { label: 'Team Target Hit', value: '104.8%', sublabel: 'Exceeded August Target' }
        ],
        columns: [
          { key: 'repId', label: 'Rep Code', type: 'text' },
          { key: 'repName', label: 'Sales Executive', type: 'text' },
          { key: 'territory', label: 'Territory', type: 'text' },
          { key: 'monthlyTarget', label: 'Target (AED)', type: 'currency', align: 'right' },
          { key: 'achievedAmount', label: 'Achieved (AED)', type: 'currency', align: 'right' },
          { key: 'ratio', label: '% Target', type: 'badge', align: 'center' }
        ],
        sampleData: [
          { repId: 'SR-04', repName: 'Farhan Siddiqui', territory: 'Dubai & Northern Emirates', monthlyTarget: '500,000', achievedAmount: '542,000', ratio: '108.4%' },
          { repId: 'SR-02', repName: 'Bilal Al-Masri', territory: 'Abu Dhabi & Al Ain', monthlyTarget: '450,000', achievedAmount: '468,500', ratio: '104.1%' },
          { repId: 'SR-07', repName: 'Kareem Mansoor', territory: 'KSA & Oman Export', monthlyTarget: '600,000', achievedAmount: '630,000', ratio: '105.0%' },
          { repId: 'SR-09', repName: 'Ramesh Patel', territory: 'Sharjah & Ajman OEM', monthlyTarget: '350,000', achievedAmount: '358,200', ratio: '102.3%' }
        ]
      },
      {
        id: 'ora_sales_salesman_analysis',
        moduleId: 'sales_analytics',
        moduleName: 'Sales Analytics',
        title: 'Salesmanwise Sales Analysis',
        status: 'LIVE',
        oracleCode: 'REP_SALESMAN_AN_07.RDF',
        description: 'Deep performance metric analytics, client retention rate, and gross profit generation per representative.',
        summaryStats: [
          { label: 'Avg Margin Generated', value: '32.6%', sublabel: 'Gross Profit' },
          { label: 'New Accounts Added', value: '14 B2B Clients', sublabel: 'This Quarter' }
        ],
        columns: [
          { key: 'repName', label: 'Sales Representative', type: 'text' },
          { key: 'clientCount', label: 'Active Accounts', type: 'number', align: 'center' },
          { key: 'totalRevenue', label: 'Total Sales (AED)', type: 'currency', align: 'right' },
          { key: 'grossProfit', label: 'Gross Profit (AED)', type: 'currency', align: 'right' },
          { key: 'retentionRate', label: 'Client Retention', type: 'badge', align: 'center' }
        ],
        sampleData: [
          { repName: 'Farhan Siddiqui', clientCount: '28', totalRevenue: '542,000', grossProfit: '178,860', retentionRate: '96.4%' },
          { repName: 'Bilal Al-Masri', clientCount: '22', totalRevenue: '468,500', grossProfit: '154,600', retentionRate: '95.0%' },
          { repName: 'Kareem Mansoor', clientCount: '16', totalRevenue: '630,000', grossProfit: '207,900', retentionRate: '100.0%' },
          { repName: 'Ramesh Patel', clientCount: '24', totalRevenue: '358,200', grossProfit: '114,620', retentionRate: '92.8%' }
        ]
      },
      {
        id: 'ora_sales_return_item',
        moduleId: 'sales_analytics',
        moduleName: 'Sales Analytics',
        title: 'Sales Return Item Report',
        status: 'LIVE',
        oracleCode: 'REP_SALES_RET_08.RDF',
        description: 'Credit note adjustments, returned goods logs, inspection reason codes, and warehouse restocking.',
        summaryStats: [
          { label: 'Return Ratio', value: '0.14%', sublabel: 'Extremely Low Standard' },
          { label: 'Pending Inspection', value: '0 Lots', sublabel: 'All Restocked / Scrapped' }
        ],
        columns: [
          { key: 'crnNo', label: 'Credit Note #', type: 'text' },
          { key: 'invRef', label: 'Original Inv #', type: 'text' },
          { key: 'customer', label: 'Customer', type: 'text' },
          { key: 'product', label: 'Returned Product', type: 'text' },
          { key: 'qty', label: 'Qty', type: 'text', align: 'right' },
          { key: 'amount', label: 'Credit (AED)', type: 'currency', align: 'right' },
          { key: 'reason', label: 'Reason Code', type: 'badge', align: 'center' }
        ],
        sampleData: [
          { crnNo: 'CRN-2026-042', invRef: 'INV-2026-8610', customer: 'Al Habtoor Engineering', product: 'Falcon Contact Adhesive 88 (18L)', qty: '4 Drums', amount: '440', reason: 'Packaging Dent' },
          { crnNo: 'CRN-2026-043', invRef: 'INV-2026-8702', customer: 'Gulf Joinery & Woodworks', product: 'Falcon PVA Wood Glue 55 (20kg)', qty: '2 Pails', amount: '114', reason: 'Order Over-Shipment' }
        ]
      },
      {
        id: 'ora_sales_pending_orders',
        moduleId: 'sales_analytics',
        moduleName: 'Sales Analytics',
        title: 'Pending Sales Order - Product Wise',
        status: 'LIVE',
        oracleCode: 'REP_PENDING_SO_09.RDF',
        description: 'Unfulfilled customer purchase orders pending warehouse dispatch or factory batch release.',
        summaryStats: [
          { label: 'Backlog Orders', value: '12 Orders', sublabel: 'AED 385,000 Value' },
          { label: 'Avg Dispatch Lead', value: '24 Hours', sublabel: 'Fast Turnaround' }
        ],
        columns: [
          { key: 'soNo', label: 'SO Number', type: 'text' },
          { key: 'customer', label: 'Customer', type: 'text' },
          { key: 'product', label: 'Product Ordered', type: 'text' },
          { key: 'orderedQty', label: 'Order Qty', type: 'text', align: 'right' },
          { key: 'pendingQty', label: 'Pending Qty', type: 'text', align: 'right' },
          { key: 'value', label: 'Order Value (AED)', type: 'currency', align: 'right' },
          { key: 'stage', label: 'Production / Picking Stage', type: 'badge', align: 'center' }
        ],
        sampleData: [
          { soNo: 'SO-2026-9901', customer: 'Emirates Precast Concrete', product: 'Falcon Concrete Admixture HR (IBC)', orderedQty: '10 IBCs', pendingQty: '4 IBCs', value: '32,000', stage: 'In Blending' },
          { soNo: 'SO-2026-9902', customer: 'Arabian Construction Co', product: 'Falcon Proof 100 (20kg)', orderedQty: '800 Pails', pendingQty: '300 Pails', value: '60,000', stage: 'Warehouse Staging' },
          { soNo: 'SO-2026-9903', customer: 'Saudi Arabian Chemical Supply', product: 'Falcon Heat Resistant 600C (20L)', orderedQty: '120 Tins', pendingQty: '120 Tins', value: '39,600', stage: 'Customs Clearance' }
        ]
      },
      {
        id: 'ora_sales_analytics_multidim',
        moduleId: 'sales_analytics',
        moduleName: 'Sales Analytics',
        title: 'Sales Analytics (Multi-Dimension)',
        status: 'LIVE',
        oracleCode: 'REP_SALES_MULTI_10.RDF',
        description: 'Multi-dimensional pivot cube by SKU, payment terms, geographical territory, and client tier.',
        summaryStats: [
          { label: 'Active Multi-Cubes', value: '6 Dimensions', sublabel: 'Region, SKU, Rep, Tier' },
          { label: 'Data Freshness', value: 'Real-time Oracle', sublabel: 'Synced with Oracle DB' }
        ],
        columns: [
          { key: 'dimension', label: 'Primary Dimension', type: 'text' },
          { key: 'category', label: 'Category / Slice', type: 'text' },
          { key: 'units', label: 'Volume (L/Kg)', type: 'text', align: 'right' },
          { key: 'revenue', label: 'Total Revenue (AED)', type: 'currency', align: 'right' },
          { key: 'cagr', label: 'YoY Growth', type: 'badge', align: 'center' }
        ],
        sampleData: [
          { dimension: 'Regional Territory', category: 'Dubai Industrial City & JAFZA', units: '245,000 L', revenue: '1,420,000', cagr: '+16.8%' },
          { dimension: 'Regional Territory', category: 'Abu Dhabi & Western Region', units: '180,000 L', revenue: '980,000', cagr: '+12.4%' },
          { dimension: 'Export Markets', category: 'Kingdom of Saudi Arabia (KSA)', units: '310,000 L', revenue: '1,650,000', cagr: '+24.1%' },
          { dimension: 'Export Markets', category: 'Sultanate of Oman & Qatar', units: '120,000 L', revenue: '770,400', cagr: '+9.5%' }
        ]
      }
    ]
  },
  {
    id: 'dispatch_logistics',
    name: 'Dispatch & Logistics',
    order: 2,
    reports: [
      {
        id: 'ora_dispatch_daily_report',
        moduleId: 'dispatch_logistics',
        moduleName: 'Dispatch & Logistics',
        title: 'Daily Despatch Report',
        status: 'LIVE',
        oracleCode: 'REP_DISP_DAILY_01.RDF',
        description: 'Daily warehouse gate passes, truck manifest, delivery orders (DO), and driver route assignments.',
        summaryStats: [
          { label: 'Today Dispatches', value: '24 Truckloads', sublabel: '42,800 Liters / Kg' },
          { label: 'On-Time Delivery', value: '99.1%', sublabel: 'Dubai & Sharjah Fleet' }
        ],
        columns: [
          { key: 'gatePass', label: 'Gate Pass #', type: 'text' },
          { key: 'time', label: 'Exit Time', type: 'text', align: 'center' },
          { key: 'vehicleNo', label: 'Truck Plate', type: 'text' },
          { key: 'driver', label: 'Driver Name', type: 'text' },
          { key: 'destination', label: 'Delivery Location', type: 'text' },
          { key: 'packages', label: 'Total Pkgs', type: 'text', align: 'right' },
          { key: 'status', label: 'Status', type: 'badge', align: 'center' }
        ],
        sampleData: [
          { gatePass: 'GP-2026-8801', time: '08:15 AM', vehicleNo: 'DXB-54210 (10T)', driver: 'Rashid Khan', destination: 'Arabian Construction Co - DIC Site', packages: '650 Pails', status: 'Delivered' },
          { gatePass: 'GP-2026-8802', time: '09:30 AM', vehicleNo: 'DXB-38192 (7T)', driver: 'Gurpreet Singh', destination: 'Al Habtoor Engineering - Marina', packages: '320 Drums', status: 'Delivered' },
          { gatePass: 'GP-2026-8803', time: '11:00 AM', vehicleNo: 'SHJ-88219 (5T)', driver: 'Ali Al-Husseini', destination: 'Gulf Joinery - Sharjah Ind 10', packages: '400 Pails', status: 'In Transit' },
          { gatePass: 'GP-2026-8804', time: '01:45 PM', vehicleNo: 'DXB-99182 (Trailer)', driver: 'Tariq Mehmood', destination: 'Saudi Border - Al Batha Customs', packages: '1,200 Packages', status: 'Dispatched' }
        ]
      },
      {
        id: 'ora_dispatch_do_invoice_track',
        moduleId: 'dispatch_logistics',
        moduleName: 'Dispatch & Logistics',
        title: 'DO & Invoice Tracking',
        status: 'SOON',
        oracleCode: 'REP_DO_TRACK_02.RDF',
        description: 'Tracking Delivery Order sign-off sheets against posted Oracle financial invoices.'
      },
      {
        id: 'ora_dispatch_loading_bay',
        moduleId: 'dispatch_logistics',
        moduleName: 'Dispatch & Logistics',
        title: 'Dispatch Loading Bay',
        status: 'SOON',
        oracleCode: 'REP_BAY_SCHEDULE_03.RDF',
        description: 'Real-time dock scheduling for DIC Warehouse Bays 1 through 6.'
      }
    ]
  },
  {
    id: 'procurement_purchase',
    name: 'Procurement & Purchase',
    order: 3,
    reports: [
      {
        id: 'ora_proc_foreign_purchase',
        moduleId: 'procurement_purchase',
        moduleName: 'Procurement & Purchase',
        title: 'Foreign Purchase Report',
        status: 'SOON',
        oracleCode: 'REP_PURCH_IMPORT_01.RDF',
        description: 'Import shipments from Japan, Germany, Saudi Arabia, and Europe with customs tariffs and LC tracking.'
      },
      {
        id: 'ora_proc_pending_po',
        moduleId: 'procurement_purchase',
        moduleName: 'Procurement & Purchase',
        title: 'Pending Purchase Orders',
        status: 'SOON',
        oracleCode: 'REP_PENDING_PO_02.RDF',
        description: 'Open supplier Purchase Orders for raw chemical solvents, rubber chips, and steel drums.'
      },
      {
        id: 'ora_proc_pending_lpo_approval',
        moduleId: 'procurement_purchase',
        moduleName: 'Procurement & Purchase',
        title: 'Pending LPOs for Approval',
        status: 'SOON',
        oracleCode: 'REP_LPO_APPRV_03.RDF',
        description: 'Local Purchase Orders awaiting management signature and commercial approval.'
      }
    ]
  },
  {
    id: 'production_manufacturing',
    name: 'Production & Manufacturing',
    order: 4,
    reports: [
      {
        id: 'ora_prod_formulation_costing',
        moduleId: 'production_manufacturing',
        moduleName: 'Production & Manufacturing',
        title: 'Formulation Costing',
        status: 'LIVE',
        oracleCode: 'REP_FORM_COST_01.RDF',
        description: 'Bill of Materials (BOM) cost breakdown, chemical raw material ratios, and unit manufacturing cost per liter.',
        summaryStats: [
          { label: 'Avg Blending Cost', value: 'AED 4.85 / L', sublabel: 'Standard Adhesives' },
          { label: 'Direct Labor Ratio', value: '6.2%', sublabel: 'High Automation' }
        ],
        columns: [
          { key: 'formId', label: 'Formula Code', type: 'text' },
          { key: 'product', label: 'Product Description', type: 'text' },
          { key: 'bomCost', label: 'Raw Material BOM (AED/Unit)', type: 'currency', align: 'right' },
          { key: 'overhead', label: 'Labor & Utilities (AED)', type: 'currency', align: 'right' },
          { key: 'totalUnitCost', label: 'Total Unit Cost (AED)', type: 'currency', align: 'right' },
          { key: 'standardPrice', label: 'Selling Price (AED)', type: 'currency', align: 'right' },
          { key: 'margin', label: 'Gross Margin', type: 'badge', align: 'center' }
        ],
        sampleData: [
          { formId: 'FM-ADH-088', product: 'Falcon Contact Adhesive 88 (18L Drum)', bomCost: '72.50', overhead: '8.40', totalUnitCost: '80.90', standardPrice: '110.00', margin: '26.5%' },
          { formId: 'FM-PVA-055', product: 'Falcon PVA Wood Glue 55 (20kg Pail)', bomCost: '36.80', overhead: '5.20', totalUnitCost: '42.00', standardPrice: '57.00', margin: '26.3%' },
          { formId: 'FM-PRF-100', product: 'Falcon Proof 100 Waterproofing (20kg)', bomCost: '44.20', overhead: '6.10', totalUnitCost: '50.30', standardPrice: '75.00', margin: '32.9%' },
          { formId: 'FM-HTP-600', product: 'Falcon Heat Resistant 600C (20L Tin)', bomCost: '185.00', overhead: '18.00', totalUnitCost: '203.00', standardPrice: '330.00', margin: '38.5%' }
        ]
      },
      {
        id: 'ora_prod_raw_mat_division',
        moduleId: 'production_manufacturing',
        moduleName: 'Production & Manufacturing',
        title: 'Raw Material by Division',
        status: 'SOON',
        oracleCode: 'REP_RM_DIV_02.RDF',
        description: 'Consumption analysis of bulk solvents and resins assigned to specific production divisions.'
      },
      {
        id: 'ora_prod_history',
        moduleId: 'production_manufacturing',
        moduleName: 'Production & Manufacturing',
        title: 'Production History',
        status: 'SOON',
        oracleCode: 'REP_PROD_HIST_03.RDF',
        description: 'Historical yield archive across 5,000L and 10,000L reactor runs.'
      }
    ]
  },
  {
    id: 'taxation_vat',
    name: 'Taxation & VAT',
    order: 5,
    reports: [
      {
        id: 'ora_tax_vat_output_main',
        moduleId: 'taxation_vat',
        moduleName: 'Taxation & VAT',
        title: 'VAT Output - Main A/c Report',
        status: 'SOON',
        oracleCode: 'REP_VAT_MAIN_01.RDF',
        description: 'Detailed UAE Federal Tax Authority (FTA) 5% output tax ledger matching audited sales invoices.'
      },
      {
        id: 'ora_tax_credit_note_print',
        moduleId: 'taxation_vat',
        moduleName: 'Taxation & VAT',
        title: 'TAX Credit Note Print',
        status: 'SOON',
        oracleCode: 'REP_TAX_CRN_PRINT_02.RDF',
        description: 'Official FTA-compliant tax credit note template generator with electronic verification stamp.'
      }
    ]
  },
  {
    id: 'finance_accounts',
    name: 'Finance & Accounts',
    order: 6,
    reports: [
      {
        id: 'ora_fin_bank_voucher',
        moduleId: 'finance_accounts',
        moduleName: 'Finance & Accounts',
        title: 'Bank Voucher Report',
        status: 'SOON',
        oracleCode: 'REP_BANK_VOUCH_01.RDF',
        description: 'Bank payment vouchers (BPV), bank receipt vouchers (BRV), and cheque clearing registers.'
      },
      {
        id: 'ora_fin_employee_records',
        moduleId: 'finance_accounts',
        moduleName: 'Finance & Accounts',
        title: 'Employee Records',
        status: 'SOON',
        oracleCode: 'REP_EMP_RECORDS_02.RDF',
        description: 'Plant operations payroll allocations, chemical safety training records, and HR directory.'
      }
    ]
  }
];

// Helper array of all Oracle report items for RBAC lookups
export const ALL_ORACLE_REPORTS: OracleReportItem[] = ORACLE_REPORT_MODULES.flatMap(m => m.reports);

// Helper default permissions for roles
export const DEFAULT_ALL_ORACLE_REPORT_IDS = ALL_ORACLE_REPORTS.map(r => r.id);
