import { OracleReportModule, OracleReportItem } from '../types';

export const ORACLE_REPORT_MODULES: OracleReportModule[] = [
  // ==========================================
  // MODULE 1: SALES ANALYTICS (10 REPORTS)
  // ==========================================
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
        oracleCode: 'sales_report.py',
        endpointUrl: '/sales-report/',
        description: 'Hierarchical division breakdown by production plant (p.plant_code), sales revenue (invh_fc_val * invh_exge_rate), and weight (invi_qty * iu_item_net_wt) with >> item drill-down.',
        summaryStats: [
          { label: 'Total Weight', value: '184,250.000 KGS', sublabel: 'Across all plants' },
          { label: 'Total Revenue', value: 'AED 4,820,400.00', sublabel: 'Net Invoiced AED' },
          { label: 'Filter Support', value: 'From / To Date & Plant', sublabel: 'Sort by Qty or AED' }
        ],
        columns: [
          { key: 'divisionCode', label: 'Div #', type: 'text', align: 'center' },
          { key: 'divisionName', label: 'Production Division / Plant', type: 'text' },
          { key: 'itemCode', label: 'Item Code', type: 'text' },
          { key: 'itemDesc', label: 'Item Description', type: 'text' },
          { key: 'uom', label: 'UOM', type: 'text', align: 'center' },
          { key: 'weightKgs', label: 'Qty / Weight (KGS)', type: 'number', align: 'right' },
          { key: 'amountAed', label: 'Amount (AED)', type: 'currency', align: 'right' }
        ],
        sampleData: [
          { divisionCode: '01', divisionName: 'Adhesives & Sealants Plant', itemCode: 'FCL-ADH-088-18L', itemDesc: 'Falcon Contact Adhesive 88 (18L Drum)', uom: 'DRM', weightKgs: '33,120.000', amountAed: '202,400.00' },
          { divisionCode: '01', divisionName: 'Adhesives & Sealants Plant', itemCode: 'FCL-PVA-055-20K', itemDesc: 'Falcon PVA Wood Glue 55 (20kg Pail)', uom: 'PAL', weightKgs: '18,400.000', amountAed: '52,440.00' },
          { divisionCode: '02', divisionName: 'Construction Chemicals Plant', itemCode: 'FCL-PRF-100-20K', itemDesc: 'Falcon Proof 100 Waterproofing (20kg)', uom: 'PAL', weightKgs: '29,000.000', amountAed: '108,750.00' },
          { divisionCode: '03', divisionName: 'Industrial Coatings Plant', itemCode: 'FCL-HTP-600-20L', itemDesc: 'Falcon Heat Resistant 600C (20L Tin)', uom: 'TIN', weightKgs: '6,800.000', amountAed: '112,200.00' },
          { divisionCode: '04', divisionName: 'Epoxy & Polyurethane Plant', itemCode: 'FCL-EPX-2K-20K', itemDesc: 'Falcon Epoxy Floor 2K Industrial Kit', uom: 'KIT', weightKgs: '12,800.000', amountAed: '164,800.00' }
        ]
      },
      {
        id: 'ora_sales_avg_analysis',
        moduleId: 'sales_analytics',
        moduleName: 'Sales Analytics',
        title: 'Average Sales Analysis',
        status: 'LIVE',
        oracleCode: 'formulation_costing.py (/sales-analysis/)',
        endpointUrl: '/sales-analysis/',
        description: '12-Month rolling period backwards lookup via FM_ACNT_PERIOD, today\'s WAC from OS_COST_GROUP_CURR_VAL, sales AED & Qty, unit price, historic WAC from OS_STK_LEDGER, and interactive projection slider with chart.',
        summaryStats: [
          { label: 'Today WAC', value: 'AED 7.4520', sublabel: 'Cost Group NF' },
          { label: '12-Month Rolling', value: '12 Accounting Periods', sublabel: 'FM_ACNT_PERIOD' },
          { label: 'Projection Slider', value: '0% to 100%', sublabel: 'Projected WAC Model' }
        ],
        columns: [
          { key: 'fromDate', label: 'From Date', type: 'date' },
          { key: 'toDate', label: 'To Date', type: 'date' },
          { key: 'monthName', label: 'Accounting Month', type: 'text' },
          { key: 'salesAed', label: 'Total (AED)', type: 'currency', align: 'right' },
          { key: 'qty', label: 'Qty Sold', type: 'number', align: 'right' },
          { key: 'historicWac', label: 'Historic WAC', type: 'number', align: 'right' },
          { key: 'unitPrice', label: 'Unit Price (AED)', type: 'currency', align: 'right' }
        ],
        sampleData: [
          { fromDate: '01-08-2026', toDate: '31-08-2026', monthName: 'August 2026', salesAed: '184,250.00', qty: '24,500.000', historicWac: '7.4520', unitPrice: '7.5204' },
          { fromDate: '01-07-2026', toDate: '31-07-2026', monthName: 'July 2026', salesAed: '196,400.00', qty: '26,200.000', historicWac: '7.4200', unitPrice: '7.4962' },
          { fromDate: '01-06-2026', toDate: '30-06-2026', monthName: 'June 2026', salesAed: '172,800.00', qty: '23,100.000', historicWac: '7.3850', unitPrice: '7.4805' },
          { fromDate: '01-05-2026', toDate: '31-05-2026', monthName: 'May 2026', salesAed: '210,500.00', qty: '28,000.000', historicWac: '7.3600', unitPrice: '7.5178' },
          { fromDate: '01-04-2026', toDate: '30-04-2026', monthName: 'April 2026', salesAed: '165,300.00', qty: '22,400.000', historicWac: '7.3200', unitPrice: '7.3794' }
        ]
      },
      {
        id: 'ora_sales_customer_date',
        moduleId: 'sales_analytics',
        moduleName: 'Sales Analytics',
        title: 'Customerwise Sales & Date',
        status: 'SOON',
        oracleCode: 'REP_CUST_DATE_03.RDF',
        endpointUrl: '#',
        description: 'Chronological sales log per customer account segmented by invoice issue date.'
      },
      {
        id: 'ora_sales_cust_supp_master',
        moduleId: 'sales_analytics',
        moduleName: 'Sales Analytics',
        title: 'Customer / Supplier Master',
        status: 'LIVE',
        oracleCode: 'customer_supplier.py',
        endpointUrl: '/customer-supplier-master/',
        description: 'Complete commercial registry from OM_CUSTOMER / OM_SUPPLIER, OM_ADDRESS, FM_MAIN_ACCOUNT. Real-time search, customer credit terms, main A/C details, and transaction history from OT_INVOICE_HEAD/OT_GR_HEAD with infinite scroll & item filter.',
        summaryStats: [
          { label: 'Mode Toggle', value: 'Customer / Supplier', sublabel: 'OM_CUSTOMER / OM_SUPPLIER' },
          { label: 'Profile Master', value: 'Address, Tel, Main A/C', sublabel: 'FM_MAIN_ACCOUNT' },
          { label: 'Transaction Feed', value: '30 rows/page infinite scroll', sublabel: 'Unit price & live totals' }
        ],
        columns: [
          { key: 'date', label: 'Date', type: 'date' },
          { key: 'txnCode', label: 'TXN', type: 'badge', align: 'center' },
          { key: 'docNo', label: 'Doc No.', type: 'text' },
          { key: 'itemCode', label: 'Item Code', type: 'text' },
          { key: 'itemName', label: 'Item Name / Description', type: 'text' },
          { key: 'uom', label: 'UOM', type: 'text', align: 'center' },
          { key: 'qty', label: 'Qty', type: 'number', align: 'right' },
          { key: 'curr', label: 'Curr.', type: 'text', align: 'center' },
          { key: 'total', label: 'Total (AED)', type: 'currency', align: 'right' },
          { key: 'unitPrice', label: 'Unit Price', type: 'number', align: 'right' }
        ],
        sampleData: [
          { date: '16-08-2026', txnCode: 'INV', docNo: 'INV-8801', itemCode: 'FCL-ADH-088', itemName: 'Falcon Contact Adhesive 88 (18L Drum)', uom: 'DRM', qty: '320.00', curr: 'AED', total: '35,200.00', unitPrice: '110.00' },
          { date: '15-08-2026', txnCode: 'INV', docNo: 'INV-8794', itemCode: 'FCL-PRF-100', itemName: 'Falcon Proof 100 Waterproofing (20kg Pail)', uom: 'PAL', qty: '650.00', curr: 'AED', total: '48,750.00', unitPrice: '75.00' },
          { date: '12-08-2026', txnCode: 'INV', docNo: 'INV-8750', itemCode: 'FCL-PVA-055', itemName: 'Falcon PVA Wood Glue 55 (20kg Pail)', uom: 'PAL', qty: '400.00', curr: 'AED', total: '22,800.00', unitPrice: '57.00' },
          { date: '08-08-2026', txnCode: 'INV', docNo: 'INV-8712', itemCode: 'FCL-HTP-600', itemName: 'Falcon Heat Resistant 600C (20L Tin)', uom: 'TIN', qty: '80.00', curr: 'AED', total: '26,400.00', unitPrice: '330.00' }
        ]
      },
      {
        id: 'ora_sales_product_ig',
        moduleId: 'sales_analytics',
        moduleName: 'Sales Analytics',
        title: 'Sales by Product (IG-wise)',
        status: 'SOON',
        oracleCode: 'REP_PROD_IG_05.RDF',
        endpointUrl: '#',
        description: 'Industry Group (IG) segmentation of polymer and adhesive sales.'
      },
      {
        id: 'ora_sales_salesman_rep',
        moduleId: 'sales_analytics',
        moduleName: 'Sales Analytics',
        title: 'Salesmanwise Sales Report',
        status: 'LIVE',
        oracleCode: 'salesman_sales_report.py',
        endpointUrl: '/salesman-sales-report/',
        description: 'Nested hierarchical aggregation: Salesman (INVH_SM_CODE) -> Division (INVH_COMP_CODE) -> Customer (CUST_NAME) -> Invoice Lines with Base Qty, UOM, Weight (Kgs), and Value (AED). Dedicated Landscape Print view.',
        summaryStats: [
          { label: 'Hierarchy', value: 'SM → Division → Customer', sublabel: 'Nested Subtotals' },
          { label: 'Base UOM & Weight', value: 'Qty in Drums/Cans * Net Wt', sublabel: 'IU_MAX_LOOSE_1 * IU_ITEM_NET_WT' },
          { label: 'Filter Options', value: 'From / To Date + Salesman', sublabel: 'ALL or Specific SM_CODE' }
        ],
        columns: [
          { key: 'invoiceRef', label: 'Invoice #', type: 'text' },
          { key: 'invhDt', label: 'SO Date', type: 'date' },
          { key: 'itemCode', label: 'Item Code', type: 'text' },
          { key: 'itemName', label: 'Item Description', type: 'text' },
          { key: 'qty', label: 'Qty', type: 'number', align: 'right' },
          { key: 'uom', label: 'UOM', type: 'text', align: 'center' },
          { key: 'weight', label: 'Wt (Kgs)', type: 'number', align: 'right' },
          { key: 'value', label: 'Value (AED)', type: 'currency', align: 'right' }
        ],
        sampleData: [
          { invoiceRef: 'INV-8801', invhDt: '16-Aug-2026', itemCode: 'FCL-ADH-088', itemName: 'Falcon Contact Adhesive 88 (18L Drum)', qty: '320.00', uom: 'DRM', weight: '5,760.00', value: '35,200.00' },
          { invoiceRef: 'INV-8802', invhDt: '15-Aug-2026', itemCode: 'FCL-PVA-055', itemName: 'Falcon PVA Wood Glue 55 (20kg Pail)', qty: '400.00', uom: 'PAL', weight: '8,000.00', value: '22,800.00' },
          { invoiceRef: 'INV-8803', invhDt: '14-Aug-2026', itemCode: 'FCL-PRF-100', itemName: 'Falcon Proof 100 Waterproofing (20kg)', qty: '650.00', uom: 'PAL', weight: '13,000.00', value: '48,750.00' },
          { invoiceRef: 'INV-8804', invhDt: '12-Aug-2026', itemCode: 'FCL-EPX-2K', itemName: 'Falcon Epoxy Floor 2K Industrial Kit', qty: '120.00', uom: 'KIT', weight: '2,400.00', value: '30,900.00' }
        ]
      },
      {
        id: 'ora_sales_salesman_analysis',
        moduleId: 'sales_analytics',
        moduleName: 'Sales Analytics',
        title: 'Salesmanwise Sales Analysis',
        status: 'LIVE',
        oracleCode: 'sales_report.py (/reports/salesman-contribution)',
        endpointUrl: '/reports/salesman-contribution',
        description: 'Salesman Contribution Report querying SALE.OT_INVOICE_HEAD & SALE.OT_INVOICE_ITEM. Displays salesman revenue, weight in Kgs, percentage contribution, and interactive Chart.js pie chart.',
        summaryStats: [
          { label: 'Total Weight', value: '142,650.00 Kgs', sublabel: 'All Active Reps' },
          { label: 'Total Sales Value', value: 'AED 3,420,800.00', sublabel: 'Invoiced Period' },
          { label: 'Pie Chart Visual', value: 'Weight & AED Distribution', sublabel: 'Chart.js Interactive' }
        ],
        columns: [
          { key: 'salesman', label: 'Salesman Code / Name', type: 'text' },
          { key: 'weightKgs', label: 'Weight (Kgs)', type: 'number', align: 'right' },
          { key: 'valueAed', label: 'Value (AED)', type: 'currency', align: 'right' },
          { key: 'pctContribution', label: '% Contribution', type: 'badge', align: 'center' }
        ],
        sampleData: [
          { salesman: 'SM-01 (Farhan Siddiqui)', weightKgs: '48,200.00', valueAed: '1,156,800.00', pctContribution: '33.8%' },
          { salesman: 'SM-02 (Bilal Al-Masri)', weightKgs: '36,400.00', valueAed: '873,600.00', pctContribution: '25.5%' },
          { salesman: 'SM-03 (Kareem Mansoor)', weightKgs: '32,150.00', valueAed: '771,600.00', pctContribution: '22.6%' },
          { salesman: 'SM-04 (Ramesh Patel)', weightKgs: '25,900.00', valueAed: '618,800.00', pctContribution: '18.1%' }
        ]
      },
      {
        id: 'ora_sales_return_item',
        moduleId: 'sales_analytics',
        moduleName: 'Sales Analytics',
        title: 'Sales Return Item Report',
        status: 'LIVE',
        oracleCode: 'sales_return_report.py',
        endpointUrl: '/sales-return-report/',
        description: 'Sales return audit querying OT_CUST_SALE_RET_HEAD & OT_CUST_SALE_RET_ITEM where TXN_CODE=\'SR\'. Nested: Country -> Division -> Document (CSRH_NO, CSRH_DT, CSRH_ANNOTATION) -> Line items with Return Qty, UOM, Return Wt Kgs, Value AED. Dedicated Landscape Print view.',
        summaryStats: [
          { label: 'Return Document Flow', value: 'CSRH_NO & CSRH_DT', sublabel: 'Includes Remarks / Annotation' },
          { label: 'Weight & Currency', value: 'Qty * Net Wt (Kgs)', sublabel: 'IU_ITEM_NET_WT' },
          { label: 'Hierarchy', value: 'Country → Division → Return Doc', sublabel: 'Subtotals on Value & Weight' }
        ],
        columns: [
          { key: 'docNo', label: 'Return Doc #', type: 'text' },
          { key: 'docDt', label: 'Return Date', type: 'date' },
          { key: 'customer', label: 'Customer Name', type: 'text' },
          { key: 'itemDesc', label: 'Item Description', type: 'text' },
          { key: 'qty', label: 'Return Qty', type: 'number', align: 'right' },
          { key: 'uom', label: 'UOM', type: 'text', align: 'center' },
          { key: 'weight', label: 'Return Wt (Kgs)', type: 'number', align: 'right' },
          { key: 'value', label: 'Value (AED)', type: 'currency', align: 'right' }
        ],
        sampleData: [
          { docNo: 'SR-2026-0041', docDt: '14-08-2026', customer: 'Arabian Construction Co (ACC)', itemDesc: 'Falcon Contact Adhesive 88 (18L Drum)', qty: '12.00', uom: 'DRM', weight: '216.00', value: '1,320.00' },
          { docNo: 'SR-2026-0042', docDt: '10-08-2026', customer: 'Al Habtoor Engineering LLC', itemDesc: 'Falcon Proof 100 Waterproofing (20kg)', qty: '8.00', uom: 'PAL', weight: '160.00', value: '600.00' },
          { docNo: 'SR-2026-0043', docDt: '04-08-2026', customer: 'Gulf Joinery & Woodworks LLC', itemDesc: 'Falcon PVA Wood Glue 55 (20kg Pail)', qty: '5.00', uom: 'PAL', weight: '100.00', value: '285.00' }
        ]
      },
      {
        id: 'ora_sales_pending_orders',
        moduleId: 'sales_analytics',
        moduleName: 'Sales Analytics',
        title: 'Pending Sales Order - Product Wise',
        status: 'LIVE',
        oracleCode: 'pending_so_report.py',
        endpointUrl: '/pending-so-report/',
        description: 'Real-time pending SO tracking querying PEND_SO, OT_SO_HEAD, OM_ITEM_UOM, OS_LOCN_CURR_STK, OM_ITEM. Groups by Item Group (ITEM_IG_CODE) -> Product -> SO Lines (SO #, Date, Txn, Item Description, Customer, Salesman, B.Qty, D.Qty, P.Qty, Current Stock). Dedicated Landscape Print view.',
        summaryStats: [
          { label: 'Grouping Level', value: 'Item Group → Product → SOs', sublabel: 'ITEM_IG_CODE' },
          { label: 'Stock Cross-Check', value: 'B.Qty, D.Qty, P.Qty vs Stock', sublabel: 'OS_LOCN_CURR_STK.LCS_STK_QTY_BU' },
          { label: 'Filter Support', value: 'From / To Date & Division', sublabel: 'SO_DT range' }
        ],
        columns: [
          { key: 'soNo', label: 'SO #', type: 'text' },
          { key: 'soDate', label: 'SO Date', type: 'date' },
          { key: 'txn', label: 'Txn', type: 'badge', align: 'center' },
          { key: 'itemDesc', label: 'Item Description', type: 'text' },
          { key: 'uom', label: 'UOM', type: 'text', align: 'center' },
          { key: 'customer', label: 'Customer Name', type: 'text' },
          { key: 'salesman', label: 'Salesman', type: 'text' },
          { key: 'bQty', label: 'B.Qty (Booked)', type: 'number', align: 'right' },
          { key: 'dQty', label: 'D.Qty (Dispatched)', type: 'number', align: 'right' },
          { key: 'pendQty', label: 'P.Qty (Pending)', type: 'number', align: 'right' },
          { key: 'currentStock', label: 'Current Stock', type: 'number', align: 'right' }
        ],
        sampleData: [
          { soNo: 'SO-2026-9901', soDate: '15-Aug-2026', txn: 'SO', itemDesc: 'Falcon Contact Adhesive 88 (18L Drum)', uom: 'DRM', customer: 'Emirates Precast Concrete', salesman: 'SM-01', bQty: '500.00', dQty: '200.00', pendQty: '300.00', currentStock: '1,420.00' },
          { soNo: 'SO-2026-9902', soDate: '14-Aug-2026', txn: 'SO', itemDesc: 'Falcon Proof 100 Waterproofing (20kg Pail)', uom: 'PAL', customer: 'Arabian Construction Co (ACC)', salesman: 'SM-02', bQty: '800.00', dQty: '350.00', pendQty: '450.00', currentStock: '2,100.00' },
          { soNo: 'SO-2026-9903', soDate: '12-Aug-2026', txn: 'SO', itemDesc: 'Falcon PVA Wood Glue 55 (20kg Pail)', uom: 'PAL', customer: 'Gulf Joinery & Woodworks LLC', salesman: 'SM-03', bQty: '400.00', dQty: '150.00', pendQty: '250.00', currentStock: '950.00' }
        ]
      },
      {
        id: 'ora_sales_analytics_multidim',
        moduleId: 'sales_analytics',
        moduleName: 'Sales Analytics',
        title: 'Sales Analytics (Multi-Dimension)',
        status: 'LIVE',
        oracleCode: 'sales_analytics_report.py',
        endpointUrl: '/sales-analytics-report/',
        description: 'Recursive dimensional hierarchy builder supporting grouping by Country, Item Group, Customer, and Salesman. Computes Qty, UOM, Net Weight (Kgs), and Invoiced Value (AED) with subtotal tree nodes. Dedicated Landscape Print view.',
        summaryStats: [
          { label: 'Dimensional Tree', value: 'Country, IG, Customer, Salesman', sublabel: 'Recursive N-Level Nesting' },
          { label: 'Presets', value: 'By Country, IG, Customer, SM', sublabel: 'One-click quick filters' },
          { label: 'Aggregation', value: 'Qty, Weight Kgs, Value AED', sublabel: 'Summed tree subtotals' }
        ],
        columns: [
          { key: 'dimensionNode', label: 'Group / Dimension Node', type: 'text' },
          { key: 'itemDesc', label: 'Item Description', type: 'text' },
          { key: 'qty', label: 'Qty', type: 'number', align: 'right' },
          { key: 'uom', label: 'UOM', type: 'text', align: 'center' },
          { key: 'weight', label: 'Weight (Kgs)', type: 'number', align: 'right' },
          { key: 'value', label: 'Value (AED)', type: 'currency', align: 'right' }
        ],
        sampleData: [
          { dimensionNode: 'United Arab Emirates (ARE)', itemDesc: 'Falcon Contact Adhesive 88 (18L Drum)', qty: '1,840.00', uom: 'DRM', weight: '33,120.00', value: '202,400.00' },
          { dimensionNode: 'United Arab Emirates (ARE)', itemDesc: 'Falcon Proof 100 Waterproofing (20kg)', qty: '1,450.00', uom: 'PAL', weight: '29,000.00', value: '108,750.00' },
          { dimensionNode: 'Saudi Arabia (SAU - Export)', itemDesc: 'Falcon Heat Resistant 600C (20L Tin)', qty: '340.00', uom: 'TIN', weight: '6,800.00', value: '112,200.00' },
          { dimensionNode: 'Oman (OMN - Export)', itemDesc: 'Falcon PVA Wood Glue 55 (20kg Pail)', qty: '920.00', uom: 'PAL', weight: '18,400.00', value: '52,440.00' }
        ]
      }
    ]
  },

  // ==========================================
  // MODULE 2: DISPATCH & LOGISTICS (3 REPORTS)
  // ==========================================
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
        oracleCode: 'dispatch_report.py',
        endpointUrl: '/dispatch-report/',
        description: 'Daily warehouse dispatch report querying ot_invoice_head & ot_invoice_item with om_item_uom. Groups by division (item_ig_code) with DO Date, DO No, Item Description, UOM, Qty, Item Wt, Net Wt (Kgs), and AED Amount.',
        summaryStats: [
          { label: 'Date Filter', value: 'From dt1 to dt2', sublabel: 'Flatpickr Datepicker' },
          { label: 'Division Filter', value: 'ALL or Active Division', sublabel: 'm.item_ig_code' },
          { label: 'Calculation', value: 'Qty * iu_item_net_wt', sublabel: 'Total Net Weight' }
        ],
        columns: [
          { key: 'doDate', label: 'DO Date', type: 'date' },
          { key: 'doNo', label: 'DO Nos.', type: 'text' },
          { key: 'itemDesc', label: 'Item Description', type: 'text' },
          { key: 'uom', label: 'UOM', type: 'text', align: 'center' },
          { key: 'qty', label: 'Qty', type: 'number', align: 'right' },
          { key: 'itemWt', label: 'Item Wt', type: 'number', align: 'right' },
          { key: 'netWt', label: 'Net Wt (Kgs)', type: 'number', align: 'right' }
        ],
        sampleData: [
          { doDate: '16-08-2026', doNo: 'INV 8801', itemDesc: 'Falcon Proof 100 Waterproofing (20kg Pail)', uom: 'PAL', qty: '650.000', itemWt: '20.000', netWt: '13,000.000' },
          { doDate: '16-08-2026', doNo: 'INV 8802', itemDesc: 'Falcon Contact Adhesive 88 (18L Drum)', uom: 'DRM', qty: '320.000', itemWt: '18.000', netWt: '5,760.000' },
          { doDate: '15-08-2026', doNo: 'INV 8803', itemDesc: 'Falcon PVA Wood Glue 55 (20kg Pail)', uom: 'PAL', qty: '400.000', itemWt: '20.000', netWt: '8,000.000' },
          { doDate: '15-08-2026', doNo: 'INV 8804', itemDesc: 'Falcon Concrete Admixture HR (1000L IBC)', uom: 'IBC', qty: '12.000', itemWt: '1,000.000', netWt: '12,000.000' }
        ]
      },
      {
        id: 'ora_dispatch_do_tracking',
        moduleId: 'dispatch_logistics',
        moduleName: 'Dispatch & Logistics',
        title: 'DO & Invoice Tracking',
        status: 'SOON',
        oracleCode: 'REP_DO_TRACK_02.RDF',
        endpointUrl: '#',
        description: 'Tracking delivery order numbers against final commercial sales invoice issuance.'
      },
      {
        id: 'ora_dispatch_bay_status',
        moduleId: 'dispatch_logistics',
        moduleName: 'Dispatch & Logistics',
        title: 'Dispatch Loading Bay',
        status: 'SOON',
        oracleCode: 'REP_BAY_STATUS_03.RDF',
        endpointUrl: '#',
        description: 'Real-time loading bay allocation and vehicle dispatch schedules.'
      }
    ]
  },

  // ==========================================
  // MODULE 3: PROCUREMENT & PURCHASE (3 REPORTS)
  // ==========================================
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
        oracleCode: 'REP_PUR_FOREIGN_01.RDF',
        endpointUrl: '#',
        description: 'International monomer, polymer and raw material import purchase orders.'
      },
      {
        id: 'ora_proc_pending_po',
        moduleId: 'procurement_purchase',
        moduleName: 'Procurement & Purchase',
        title: 'Pending Purchase Orders',
        status: 'SOON',
        oracleCode: 'REP_PUR_PEND_PO_02.RDF',
        endpointUrl: '#',
        description: 'Open purchase orders awaiting supplier delivery and customs clearance.'
      },
      {
        id: 'ora_proc_pending_lpo_approval',
        moduleId: 'procurement_purchase',
        moduleName: 'Procurement & Purchase',
        title: 'Pending LPOs for Approval',
        status: 'SOON',
        oracleCode: 'REP_PUR_LPO_APP_03.RDF',
        endpointUrl: '#',
        description: 'Internal purchase requisitions pending executive management authorization.'
      }
    ]
  },

  // ==========================================
  // MODULE 4: PRODUCTION & MANUFACTURING (3 REPORTS)
  // ==========================================
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
        oracleCode: 'formulation_costing.py',
        endpointUrl: '/formulation-costing/',
        description: 'Interactive Batch Card Costing Screen (web port of legacy VB6 Form17). Finished good typeahead, active BOM explosion from OV_BOM/OV_BOM_ITEM_DETAIL, raw material weigh sheet with live WAC & stock balance check, purchase history LoV, FCT persistence to OM_FCT_HEAD/OM_FCT_ITEM, and export to PDF, Word (docx), and Excel (xlsx).',
        summaryStats: [
          { label: 'Batch Card Engine', value: 'OV_BOM & OM_FCT_HEAD', sublabel: 'Active BOM Explosion' },
          { label: 'Weigh Sheet', value: 'Live WAC, Stock & Balance', sublabel: 'Auto-detects shortages' },
          { label: 'Export Options', value: 'PDF, Word (docx), Excel (xlsx)', sublabel: 'WeasyPrint & python-docx' }
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
      {
        id: 'ora_prod_raw_mat_division',
        moduleId: 'production_manufacturing',
        moduleName: 'Production & Manufacturing',
        title: 'Raw Material by Division',
        status: 'SOON',
        oracleCode: 'REP_PROD_RAW_02.RDF',
        endpointUrl: '#',
        description: 'Raw chemical material consumption and allocations segmented by manufacturing plant.'
      },
      {
        id: 'ora_prod_history',
        moduleId: 'production_manufacturing',
        moduleName: 'Production & Manufacturing',
        title: 'Production History',
        status: 'SOON',
        oracleCode: 'REP_PROD_HIST_03.RDF',
        endpointUrl: '#',
        description: 'Historical reactor batch outputs, lead chemist approvals, and quality assurance logs.'
      }
    ]
  },

  // ==========================================
  // MODULE 5: TAXATION & VAT (2 REPORTS)
  // ==========================================
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
        oracleCode: 'REP_VAT_OUTPUT_01.RDF',
        endpointUrl: '#',
        description: 'Federal Tax Authority (FTA) 5% output VAT register on domestic commercial sales.'
      },
      {
        id: 'ora_tax_credit_note_print',
        moduleId: 'taxation_vat',
        moduleName: 'Taxation & VAT',
        title: 'TAX Credit Note Print',
        status: 'SOON',
        oracleCode: 'REP_TAX_CN_02.RDF',
        endpointUrl: '#',
        description: 'Tax credit note print generation for returned goods and price adjustments.'
      }
    ]
  },

  // ==========================================
  // MODULE 6: FINANCE & ACCOUNTS (2 REPORTS)
  // ==========================================
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
        oracleCode: 'REP_FIN_BANK_01.RDF',
        endpointUrl: '#',
        description: 'Bank payment and receipt vouchers with cheque / wire transfer references.'
      },
      {
        id: 'ora_fin_employee_records',
        moduleId: 'finance_accounts',
        moduleName: 'Finance & Accounts',
        title: 'Employee Records',
        status: 'SOON',
        oracleCode: 'REP_FIN_EMP_02.RDF',
        endpointUrl: '#',
        description: 'Corporate employee roster, department allocations, and WPS payroll registration.'
      }
    ]
  }
];

export const ALL_ORACLE_REPORTS: OracleReportItem[] = ORACLE_REPORT_MODULES.flatMap(m => m.reports);
export const DEFAULT_ALL_ORACLE_REPORT_IDS: string[] = ALL_ORACLE_REPORTS.map(r => r.id);
