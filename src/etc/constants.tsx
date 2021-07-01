export const WS_URL = "wss://www.cryptofacilities.com/ws/v1";

export const EVENTS = {
  SUBSCRIBE: "subscribe",
  UNSUBSCRIBE: "unsubscribe",
};

export const FEEDS = {
  BOOK_UI_1: "book_ui_1",
};

export type Currency = {
  key: string;
  groupings: Array<String>;
};

export const PRODUCT_IDS = {
  XBT: { key: "PI_XBTUSD", groupings: ["0.5", "1", "2.5"] },
  ETH: { key: "PI_ETHUSD", groupings: ["0.05", "0.1", "0.25"] },
};

export const DISPLAYED_ROWS_COUNT = 15;

export enum ORDER_TYPES {
  BID,
  ASK,
}

/** Rate at which UI updates whats shown on screen */
export enum UI_REFRESH_RATE {
  // Less load on mobile devices
  MOBILE = 1500,
  DESKTOP = 500,
}

export enum COLORS {
  /* usually green is buy and red is sell but in provided screenshot, red looks like buy side as prices are from high to low,
  According to investorpedia: The top of the book is where you'll find the highest bid and lowest ask prices.  */
  BID = "#103839",
  ASK = "#3E212C",
}
