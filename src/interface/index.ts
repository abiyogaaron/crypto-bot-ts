export enum EHTTP_METHOD {
  POST = 'POST',
  GET = 'GET',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

export enum ECOMMAND_LIST {
  MARKET_DEPTH = '/checkmarketdepth',
  ORDER_BOOK = '/checktrades',
  MA_CROSSING = '/macross',
  RSI_ALERT = '/rsialert',
}

export type TCommandList = ECOMMAND_LIST;