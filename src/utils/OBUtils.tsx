import { ORDER_TYPES } from "../etc/constants";

export const sortOrders = (
  orders: Array<Array<number>>,
  orderType: ORDER_TYPES
) => {
  return orders.sort(([aPrice, aSize], [bPrice, bSize]) => {
    if (orderType === ORDER_TYPES.ASK) {
      return aPrice - bPrice;
    } else {
      return bPrice - aPrice;
    }
  });
};

//
// combine the data from prices 1000 and 1000.5 and display it under a single level in the
// orderbook with the price 100

export const groupOrders = (orders: Array<Array<number>>, tickSize: number) => {
  let tickMap = new Map();

  for (const order of orders) {
    let price = order[0];
    let size = order[1];

    let tick = Math.floor(price / tickSize) * tickSize;

    if (!tickMap.has(tick)) {
      tickMap.set(tick, 0);
    }

    tickMap.set(tick, tickMap.get(tick) + size);
  }

  return Array.from(tickMap);
};

