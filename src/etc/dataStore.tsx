/** Store latest state of data received, not necessarily what is on screen  */
const DATA_STORE = {
  asks: new Map(), // red, aka sell offers, ordered from low->high
  bids: new Map(), // green, aka buy offers, ordered from high->low
};

export default DATA_STORE;
