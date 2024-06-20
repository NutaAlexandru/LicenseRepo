const BASE_URL = 'http://localhost:5000';
export const STOCKS_URL = BASE_URL+'/api/stocks';
export const STOCK_SEARCH_URL = STOCKS_URL+'/search/';
export const STOCK_BY_ID_URL = STOCKS_URL+'/';
export const STOCK_HISTORIC=STOCKS_URL+'/historical/';
export const STOCK_LOGO_URL=STOCKS_URL+'/company-logo/';
export const STOCK_TOOGLE_FAVORITE_URL=STOCKS_URL+'/toggle-favorite/';
export const STOCK_FAVORITES_URL=STOCKS_URL+'/favorites';

export const MARKET_BIGGEST_GAINERS_URL=STOCKS_URL+'/stock-market-gainers';
export const MARKET_BIGGEST_LOOSER_URL=STOCKS_URL+'/stock-market-losers';
export const MARKET_MOST_ACTIVE_URL=STOCKS_URL+'/stock-market-actives';


export const COMPANYINFO=STOCKS_URL+'/company-profile/';
export const STOCKMARKETDATA=STOCKS_URL+'/market-data/';
export const STOCKPRICECHANGE=STOCKS_URL+'/stock-price-change/';
export const STOCKPRICE=STOCKS_URL+'/stock-price/';

export const TRANSACTION_INFO=BASE_URL+'/api/transactions';
export const TRANSACTION_INFO_CREATE=TRANSACTION_INFO+'/create';
export const TRANSACTION_INFO_UPDATE=TRANSACTION_INFO+'/update-balance';
export const TRANSACTION_INFO_GET_ALL=TRANSACTION_INFO+'/user/';

export const PURCHASE_INFO=BASE_URL+'/api/orders';
export const PURCHASE_INFO_CREATE=PURCHASE_INFO+'/purchase-orders';
export const PURCHASE_INFO_GET_ALL_URL=PURCHASE_INFO+'/user/purchase-orders/';

export const PORTOFOLIO_INFO_GET_ALL_URL=PURCHASE_INFO+'/user/portofolio/';
export const PORTOFOLIO_SELL_URL=PURCHASE_INFO+'/portfolio/sell';
export const PORTOFOLIO_INFO_GET_ALL=PURCHASE_INFO+'/user/portfolio/stats/';

export const CRYPTO_URL = BASE_URL+'/api/cryptos';
export const CRYPTO_SEARCH_URL = CRYPTO_URL+'/crypto/search/';
export const CRYPTO_BY_ID_URL = CRYPTO_URL+'/';
export const CRYPTO_HISTORIC=CRYPTO_URL+'/historical/';
export const CRYPTO_DATA_URL=CRYPTO_URL+'/quote/';

export const USER_LOGIN_URL = BASE_URL+'/api/users/login';
export const USER_REGISTER_URL = BASE_URL+'/api/users/register';
export const USER_UPDATE_URL=BASE_URL+'/api/users/update-user/';
export const USER_DATA_URL=BASE_URL+'/api/users/return-user/';
export const USER_SWITCH_TO_DEMO_URL =BASE_URL+ '/api/users/switch-to-demo';
export const USER_SWITCH_TO_REAL_URL=BASE_URL+'/api/users/switch-to-real';

export const NEWS_URL=BASE_URL+'/api/news';
export const DIVIDENTS_URL=BASE_URL+'/api/dividents'

export const MARKET_STATUS_URL=BASE_URL+'/api/marketstatus/market-status/';

export const USER_LOGIN_WITH_GOOGLE_URL=BASE_URL+'/api/users/google/login';