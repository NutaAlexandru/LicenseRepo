const BASE_URL = 'http://localhost:5000';
export const STOCKS_URL = BASE_URL+'/api/stocks';
export const STOCK_SEARCH_URL = STOCKS_URL+'/search/';
export const STOCK_BY_ID_URL = STOCKS_URL+'/';
export const STOCK_HISTORIC=STOCKS_URL+'/historical/';

export const CRYPTO_URL = BASE_URL+'/api/cryptos';
export const CRYPTO_SEARCH_URL = CRYPTO_URL+'/crypto/search/';
export const CRYPTO_BY_ID_URL = CRYPTO_URL+'/';
export const CRYPTO_HISTORIC=CRYPTO_URL+'/historical/';

export const USER_LOGIN_URL = BASE_URL+'/api/users/login';
export const USER_REGISTER_URL = BASE_URL+'/api/users/register';

export const NEWS_URL=BASE_URL+'/api/news';
export const DIVIDENTS_URL=BASE_URL+'/api/dividents'

export const USER_LOGIN_WITH_GOOGLE_URL=BASE_URL+'/api/users/google/login';