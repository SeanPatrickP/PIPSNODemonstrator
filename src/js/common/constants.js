export const SITE_NAME = "PIP Supply & Offtake Editor";

export const SUPPORT_EMAIL = "seanpatrick@live.co.uk";

export const SUPPLY_AND_OFFTAKE = "Supply and Offtake";
export const PARK_AND_LOAN = "Park and Loan";

export const EMPTY_CT = "Commod PIP CT Base";

export const INVENTORY_CT = "Commod PIP CT SnO Inventory";
export const INV_PERIOD_CT = "Commod PIP CT SnO Inv Period";
export const INV_PX_AVG_CT = "Commod PIP CT SnO Inv Px Avg";
export const INV_PX_RND_CT = "Commod PIP CT SnO Inv Px Rnd";
export const INV_PX_CMP_CT = "Commod PIP CT SnO Inv Px Cmp";
export const INV_PRICE_CT = "Commod PIP CT SnO Inv Price";
export const INV_PRD_SPEC_CT = "Commod PIP CT SnO Inv Prd Spec";
export const INV_GRD_ADJ_CT = "Commod PIP CT SnO Inv Grd Adj";
export const INV_QUANTITY_CT = "Commod PIP CT SnO Inv Quantity";
export const INV_ANC_STD_CT = "Commod PIP CT Inv Anc Std";
export const INV_PRODUCT_CT = "Commod PIP CT SnO Inv Product";
export const COLLAT_TBL_CT = "Commod PIP CT Collat Tbl";
export const COLLAT_ROW_CT = "Commod PIP CT Collat Row";
export const GRD_ADJ_ROW_CT = "Commod PIP CT SnO Grd Adj Row";
export const WATERFALL_ROW_CT = "Commod PIP CT Waterfall Row";
export const WC_FEE_RATE_CT = "Commod PIP CT SnO WC Fee Rate";
export const SETTLEMENT_TIERS_CT = "Commod PIP CT Settlement Tiers";
export const TERM_KNOT_CT = "Commod PIP CT Term Knot";
export const NOM_EVENT_CT = "Commod PIP CT Norm Event";
export const BREAKUP_KNOT_CT = "Commod PIP CT Breakup Knot";
export const MISC_FEES_CT = "Commod PIP CT Misc Fees";
export const WATERFALL_TBL_CT = "Commod PIP CT Waterfall Tbl";
export const SETTINGS_CT = "Commod PIP CT SnO Settings";
export const NETTING_CMPNT_CT = "Commod PIP CT Netting Cmpnt";
export const TERMINATION_CT = "Commod PIP CT Termination";

export const WORKING_CAPITAL_FEE = "Commod PIP CT SnO WC Fee";
export const ROLL_FEE = "Commod PIP CT SnO Roll Fee";
export const PRODUCT_DIFF_FEE = "Commod PIP CT SnO Prd Diff Fee";
export const FIXED_FEE = "Commod PIP CT SnO Fixed Fee";
export const MONTHLY_FIXED_FEE = "Commod PIP CT SnO Mth Fix Fee";
export const DEFERRED_PAYMENT_FEE = "Commod PIP CT SnO Ofer Pay Fee";
export const PER_BARREL_FEE = "Commod PIP CT SnO Per Bbl Fee";
export const PER_BARREL_MULTI_FEE = "Commod PIP CT SnO PB Mult Fee";

export const WORKING_CAPITAL_FEES_TEXT = "Working Capital Fees";
export const ROLL_FEES_TEXT = "Roll Fees";
export const PRODUCT_DIFF_FEES_TEXT = "Product Diff Fees";
export const FIXED_FEES_TEXT = "Fixed Fees";
export const MONTHLY_FIXED_FEES_TEXT = "Monthly Fixed Fees";
export const DEFERRED_PAYMENT_FEES_TEXT = "Deferred Payment Fees";
export const PER_BARREL_FEES_TEXT = "Per Barrel Fees";
export const PER_BARREL_MULTI_FEES_TEXT = "Per Barrel Multi Fees";

export const EMPTY_CT_OBJECT = {
  __type: EMPTY_CT,
};

export const ALL_FEE_TYPES = {
  [WORKING_CAPITAL_FEES_TEXT]: WORKING_CAPITAL_FEE,
  [ROLL_FEES_TEXT]: ROLL_FEE,
  [PRODUCT_DIFF_FEES_TEXT]: PRODUCT_DIFF_FEE,
  [FIXED_FEES_TEXT]: FIXED_FEE,
  [MONTHLY_FIXED_FEES_TEXT]: MONTHLY_FIXED_FEE,
  [DEFERRED_PAYMENT_FEES_TEXT]: DEFERRED_PAYMENT_FEE,
  [PER_BARREL_FEES_TEXT]: PER_BARREL_FEE,
  [PER_BARREL_MULTI_FEES_TEXT]: PER_BARREL_MULTI_FEE,
};

export const DATE_INTERVAL_TYPE = "Date::Interval";

export const FEE_DATE_OFFSET_TYPE = "Commod PIP::Fee Date Offset";

export const INITIAL_EXCHANGE = "Initial Exchange";
export const INTERIM_EXCHANGE = "Interim Exchange";
export const CLOSING_EXCHANGE = "Closing Exchange";
export const PROVISIONAL = "Provisional";
export const PREPAY_PROVISIONAL = "Prepay Provisional";

export const PROVISIONAL_GATHERED = "Provisional Gathered";
export const PROVISIONAL_GROUP_A = "Provisional Group A";
export const PROVISIONAL_GROUP_B = "Provisional Group B";
export const COMPANY_SALES_SALE = "Company Sales Sale";
export const COMPANY_SALES_PURCHASE = "Company Sales Purchase";
export const MONTH_END_EXCHANGE = "Month End Exchange";

export const MONTH_END_REVERSAL = "Month End Reversal";
export const FLOW_EXCHANGE = "Flow Exchange";
export const INITIAL_PROVISIONAL = "Initial Provisional";
export const CLOSING_PROVISIONAL = "Closing Provisional";

export const ALL_PERIOD_NAMES = [
  INITIAL_EXCHANGE,

  INTERIM_EXCHANGE,
  CLOSING_EXCHANGE,
  PROVISIONAL,
  PREPAY_PROVISIONAL,
  PROVISIONAL_GATHERED,
  PROVISIONAL_GROUP_A,
  PROVISIONAL_GROUP_B,
  COMPANY_SALES_SALE,
  COMPANY_SALES_PURCHASE,
  MONTH_END_EXCHANGE,
  MONTH_END_REVERSAL,
  FLOW_EXCHANGE,
];

export const PROVISIONAL_PERIOD_NAMES = [
  PROVISIONAL,
  PREPAY_PROVISIONAL,
  PROVISIONAL_GATHERED,
  PROVISIONAL_GROUP_A,
  PROVISIONAL_GROUP_B,
];

export const BASE_VOLUME_FORMULA = "Base Volume Formula";

export const ALL_FORMULA_NAMES = [
  BASE_VOLUME_FORMULA,
  "Nomination Change Formula",
  "FIFO Current Excess Formula",
  "FIFO Current Deficit Formula",
  "FIFO Previous Formula",
  "FIFO Previous Excess Formula",
  "FIFO Previous Deficit Formula",
  "Flex Volume Formula",
  "Grade Adjustment",
  PROVISIONAL,
];

export const UN_NAMED_FORMULA = "UN-NAMED FORMULA";

export const GRADE_ADJUST_FORMULA_NAME = "Grade Adjustment";

export const TEXT_INPUT = "TEXT_INPUT";
export const DATE_INPUT = "DATE_INPUT";
export const DOUBLE_INPUT = "DOUBLE_INPUT";
export const SELECTION_INPUT = "SELECTION_INPUT";
export const STRING_CHOICES_SELECTOR_INPUT = "STRING_CHOICES_SELECTOR_INPUT";

export const START_END_DATE = "START_END_DATE";

export const LIST = "LIST";

export const CHECKBOX = "CHECKBOX";

export const CURVE = "CURVE";
export const DATE = "DATE";
export const SETTLEMENT_TIERS_TABLE = "SETTLEMENT_TIERS_TABLE";
export const PRICE_COMPONENTS_TABLE = "PRICE_COMPONENTS_TABLE";
export const DOUBLE_INPUT_CURVE = "DOUBLE_INPUT_CURVE";

export const FEE_DATE_OFFSET = "FEE_DATE_OFFSET";
export const RATE = "RATE";
export const SPREAD = "SPREAD";
export const HIDDEN = "HIDDEN";
export const CANNOT_COPY = "CANNOT_COPY";

export const FORMULA_COMPONENT = "FORMULA_COMPONENT";

export const GRADE_ADJUSTMENT_FORMULA_COMPONENT =
  "GRADE_ADJUSTMENT_FORMULA_COMPONENT";

export const VALIDATION_NUMBER = "Please enter a valid number";

export const OPTIONAL_LIST = "OPTIONAL_LIST";

export const TRUE = "true";
export const OK = "ok";
export const SUCCESS = "success";

export const VALIDATION_ERRORS = "validation errors";
export const VALIDATION_FAILURE = "validation failure";
export const FAIL = "fail";
export const ERROR = "error";
export const CALCULATING = "calculating";
export const REQUIRED = "required";
export const UPDATING = "updating";
export const BOOKMARKING = "bookmarking";
export const KEY_MAP_ERROR = "key map error";

export const FIRST_MONTH_START_DATE = "First month start date";
export const LAST_MONTH_END_DATE = "Last month end date";
export const VALUE = "Value";
export const VALUES = "Values";
export const INDEX = "Index";
export const FIELD = "Field";
export const DATES = "Dates";

export const ROW_INDEX = "rowIndex";

export const INFINITY_KEY = "__infinity__";
export const CURVE_KEY = "__curve__";
export const DATE_KEY = "__date__";
export const RDATE_KEY = "__rdate__";

export const DATE_FORMAT_LONG = "YYYY-MM-DD[T]HH:mm:ss";
export const DATE_FORMAT = "DD-MMM-YYYY";
export const DATE_FORMAT_SHORT_CODE = "d-M-Y";

export const HEARTBEAT = " HEARTBEAT";
export const HEARTBEATS_LOST = "HEARTBEATS_LOST";
export const CLOSED = "CLOSED";
export const CLOSE_EDITOR = "CLOSE_EDITOR";
export const LOADING = "LOADING";
export const NO_DATA = "NO_DATA";
export const BAD_BOOKMARK = "BAD_BOOKMARK";
export const KERBEROS_NOT_DETECTED = "KERBEROS_NOT_DETECTED";
export const RPC_NOT_RESPONDING = "RPC_NOT_RESPONDING";
export const DOLLAR_PRICE = "DOLLAR_PRICE";

export const POST = "POST";

export const DELETE = "Delete";
export const KEEP = "Keep";

export const FUNDING = "Funding";
export const RISK = "Risk";

export const PARK_AND_LOAN_REMOVAL_FIELDS_PRODUCT = {
  "initial haircut rate": INFINITY_KEY,
  "interim haircut rate": INFINITY_KEY,
  "nomination ct": EMPTY_CT_OBJECT,
};

export const PARK_AND_LOAN_FIELDS_QUANTITY = {
  "max increase": INFINITY_KEY,
  "max decrease": INFINITY_KEY,
  "max quantity": KEEP,
  "min quantity": KEEP,
  "base volume": KEEP,
  unit: KEEP,
  application: KEEP,
};

export const PARK_AND_LOAN_BASE = {
  "fee cts": [],
  "waterfall ct": EMPTY_CT_OBJECT,
  "collateral ct": EMPTY_CT_OBJECT,
  "miscellaneous fees ct": EMPTY_CT_OBJECT,
  "ancillary ct": EMPTY_CT_OBJECT,
};

export const DB_SESSION_KEY_LENGTH = 32;

export const DATE_INTERVAL_START_DATE = "31-DEC-2952"; // Remember this is the START date for an empty date interval
export const DATE_INTERVAL_START_DATE_LONG = "2952-12-31T00:00:00";
export const DATE_INTERVAL_END_DATE = "01-JAN-1952"; // Remember this is the END date for an empty date interval
export const DATE_INTERVAL_END_DATE_LONG = "1952-01-01T00:00:00";
export const NO_INDEX = "No Index";

export const ACTIVE = "Active";
export const INACTIVE = "Inactive";
export const INDICATES_AN_ACTIVE_INVENTORY_PERIOD =
  "Indicates an active inventory period";
export const INDICATES_AN_INACTIVE_INVENTORY_PERIOD =
  "Indicates an inactive inventory period";
