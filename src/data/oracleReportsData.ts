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
        description: 'Hierarchical division breakdown by production plant (p.plant_code), sales revenue (invh_fc_val * invh_exge_rate), and weight (invi_qty * iu_item_net_wt). Supports >> item sales history popup & customer contact card.'
      },
      {
        id: 'ora_sales_avg_analysis',
        moduleId: 'sales_analytics',
        moduleName: 'Sales Analytics',
        title: 'Average Sales Analysis',
        status: 'LIVE',
        oracleCode: 'formulation_costing.py (/sales-analysis/)',
        endpointUrl: '/sales-analysis/',
        description: '12-Month rolling period backwards lookup via FM_ACNT_PERIOD, today\'s WAC from OS_COST_GROUP_CURR_VAL, sales AED & Qty, unit price, historic WAC from OS_STK_LEDGER, and interactive projection slider with chart.'
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
        description: 'Complete commercial registry from OM_CUSTOMER / OM_SUPPLIER, OM_ADDRESS, FM_MAIN_ACCOUNT. Real-time search, customer credit terms, main A/C details, and transaction history from OT_INVOICE_HEAD/OT_GR_HEAD with infinite scroll & item filter.'
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
        description: 'Nested hierarchical aggregation: Salesman (INVH_SM_CODE) -> Division (INVH_COMP_CODE) -> Customer (CUST_NAME) -> Invoice Lines with Base Qty, UOM, Weight (Kgs), and Value (AED). Dedicated Landscape Print view.'
      },
      {
        id: 'ora_sales_salesman_analysis',
        moduleId: 'sales_analytics',
        moduleName: 'Sales Analytics',
        title: 'Salesmanwise Sales Analysis',
        status: 'LIVE',
        oracleCode: 'sales_report.py (/reports/salesman-contribution)',
        endpointUrl: '/reports/salesman-contribution',
        description: 'Salesman Contribution Report querying SALE.OT_INVOICE_HEAD & SALE.OT_INVOICE_ITEM. Displays salesman revenue, weight in Kgs, percentage contribution, and interactive Chart.js pie chart.'
      },
      {
        id: 'ora_sales_return_item',
        moduleId: 'sales_analytics',
        moduleName: 'Sales Analytics',
        title: 'Sales Return Item Report',
        status: 'LIVE',
        oracleCode: 'sales_return_report.py',
        endpointUrl: '/sales-return-report/',
        description: 'Sales return audit querying OT_CUST_SALE_RET_HEAD & OT_CUST_SALE_RET_ITEM where TXN_CODE=\'SR\'. Nested: Country -> Division -> Document (CSRH_NO, CSRH_DT, CSRH_ANNOTATION) -> Line items with Return Qty, UOM, Return Wt Kgs, Value AED. Dedicated Landscape Print view.'
      },
      {
        id: 'ora_sales_pending_orders',
        moduleId: 'sales_analytics',
        moduleName: 'Sales Analytics',
        title: 'Pending Sales Order - Product Wise',
        status: 'LIVE',
        oracleCode: 'pending_so_report.py',
        endpointUrl: '/pending-so-report/',
        description: 'Real-time pending SO tracking querying PEND_SO, OT_SO_HEAD, OM_ITEM_UOM, OS_LOCN_CURR_STK, OM_ITEM. Groups by Item Group (ITEM_IG_CODE) -> Product -> SO Lines with Division, Customer, and Product dropdown filters.'
      },
      {
        id: 'ora_sales_analytics_multidim',
        moduleId: 'sales_analytics',
        moduleName: 'Sales Analytics',
        title: 'Sales Analytics (Multi-Dimension)',
        status: 'LIVE',
        oracleCode: 'sales_analytics_report.py',
        endpointUrl: '/sales-analytics-report/',
        description: 'Recursive dimensional hierarchy builder supporting 4 grouping levels: Country, Item Group, Customer, and Salesman, with Show Invoice Numbers checkbox. Computes Qty, UOM, Net Weight (Kgs), and Invoiced Value (AED).'
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
        description: 'Daily warehouse dispatch report querying ot_invoice_head & ot_invoice_item with om_item_uom. Groups by division (item_ig_code) with DO Date, DO No, Item Description, UOM, Qty, Item Wt, Net Wt (Kgs), and AED Amount.'
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
  // MODULE 4: PRODUCTION & MANUFACTURING (5 REPORTS)
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
        description: 'Interactive Batch Card Costing Screen (web port of legacy VB6 Form17). Finished good typeahead, active BOM explosion from OV_BOM/OV_BOM_ITEM_DETAIL, raw material weigh sheet with live WAC & stock balance check, purchase history LoV, FCT persistence to OM_FCT_HEAD/OM_FCT_ITEM, and export to PDF, Word (docx), and Excel (xlsx).'
      },
      {
        id: 'ora_prod_stock_adj',
        moduleId: 'production_manufacturing',
        moduleName: 'Production & Manufacturing',
        title: 'Stock Adjustment (Requisition)',
        status: 'LIVE',
        oracleCode: 'stock_adjustment.py',
        endpointUrl: '/stock-adjustment/',
        description: 'Stock Adjustment Requisition (RADJ). Auto-generate adjustment for reversing work orders (OT_PS_HEAD / os_stk_ledger) or manual adjustment with WAC lookup, user assignment (MENU_USER), and print.'
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
        id: 'ora_prod_new_product_info',
        moduleId: 'production_manufacturing',
        moduleName: 'Production & Manufacturing',
        title: 'New Product Information',
        status: 'LIVE',
        oracleCode: 'npi.py',
        endpointUrl: '/new-product-info/',
        description: 'New Product Registration (NPI) Portal. Manufacturing division (OM_PLANT), department, representative (IM_VS_STATIC_VALUE), product item details (OM_NPI_HEAD / OM_NPI_ITEM), search/load previous records, and formal corporate printout.'
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
