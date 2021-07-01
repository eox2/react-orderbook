import React, {
  createContext,
  useEffect,
  useState,
  MouseEventHandler,
  useCallback,
  Dispatch,
  SetStateAction,
} from "react";
import {
  EVENTS,
  FEEDS,
  WS_URL,
  PRODUCT_IDS,
  Currency,
} from "../../etc/constants";

import DATA_STORE from "../../etc/dataStore";

export const WebsocketContext = createContext<Partial<WSContextProps>>({});

type WSContextProps = {
  closeWS: (arg0: boolean) => void;
  connectWS: () => void;
  selectedCurrency: Currency;
  toggleCurrency: MouseEventHandler;
  wsConnected: boolean;
  wsError: WSErrorType;
  setForceRefresh: Dispatch<SetStateAction<boolean>>;
  forceRefresh: boolean;
};

type CFOrderData = {
  feed: string;
  product_id?: string;
  bids?: Array<[number, number]>;
  asks?: Array<[number, number]>;
};

type WSErrorType = {
  error: boolean;
  message: any;
};

let ws: WebSocket | null = null;

const WebsocketProvider: React.FC = (props) => {
  const [forceRefresh, setForceRefresh] = useState(false);

  const [wsConnected, setWSConnected] = useState(false);

  const [wsError, setWSError] = useState<WSErrorType | undefined>(undefined);

  const [selectedCurrency, setSelectedCurrency] = useState(PRODUCT_IDS.XBT);

  const updateOrderMap = useCallback(
    (message: CFOrderData) => {
      if (message.asks) {
        for (const ask of message.asks) {
          let askPrice = ask[0];
          let askSize = ask[1];

          if (askSize === 0) {
            DATA_STORE.asks.delete(askPrice);
          } else {
            DATA_STORE.asks.set(askPrice, askSize);
          }
        }
      }

      if (message.bids) {
        for (const bid of message.bids) {
          let bidPrice = bid[0];
          let bidSize = bid[1];

          if (bidSize === 0) {
            DATA_STORE.bids.delete(bidPrice);
          } else {
            DATA_STORE.bids.set(bidPrice, bidSize);
          }
        }
      }
    },
    [DATA_STORE]
  );

  const handleMessage = useCallback(
    (evt: WebSocketEventMap["message"]) => {
      const message = JSON.parse(evt.data);
      if (message.event === "subscribed") {
        console.log("subscribed to feed", message);
      } else if (message.feed === "book_ui_1_snapshot") {
        DATA_STORE.asks.clear();
        DATA_STORE.bids.clear();
        updateOrderMap(message);
        setForceRefresh(true);
      } else if (message.feed === "book_ui_1") {
        updateOrderMap(message);
      } else if (message.event === "error") {
        console.error(
          "encountered error when processing incoming feed messages",
          message
        );
        setWSError({
          error: true,
          message: message.message,
        });
      } else if (message.event === "info") {
        console.info("WS INFO", message);
      } else {
        console.warn("unexpected message, ignoring", message);
      }
    },
    [updateOrderMap]
  );

  const subscribeCurrency = useCallback(
    (currKey: string) => {
      console.log("subscribing", currKey);
      if (ws) {
        ws.send(
          JSON.stringify({
            event: EVENTS.SUBSCRIBE,
            feed: FEEDS.BOOK_UI_1,
            product_ids: [currKey],
          })
        );
      } else {
        console.error("websocket not valid on subscribe.");
      }
    },
    [ws]
  );

  const unsubscribeCurrency = useCallback(() => {
    let currKey = selectedCurrency.key;
    console.log("unsubscribing", currKey);
    if (ws) {
      ws.send(
        JSON.stringify({
          event: EVENTS.UNSUBSCRIBE,
          feed: FEEDS.BOOK_UI_1,
          product_ids: [currKey],
        })
      );

      DATA_STORE.asks.clear();
      DATA_STORE.bids.clear();
    } else {
      console.error("websocket not valid on unsubscribe.");
    }
  }, [ws, selectedCurrency]);

  useEffect(() => {
    if (wsConnected) {
      subscribeCurrency(selectedCurrency.key);
    }
  }, [subscribeCurrency, wsConnected, selectedCurrency]);

  const connectWS = useCallback(() => {
    setWSError(undefined);

    ws = new WebSocket(WS_URL);

    ws.onerror = (event: WebSocketEventMap["error"]) => {
      console.error("WebSocket error observed:", event);

      setWSError({
        error: true,
        message: event,
      });

      setWSConnected(false);
    };

    ws.onclose = (evt: WebSocketEventMap["close"]) => {
      setWSConnected(false);
      console.error("WebSocket close observed:", evt);
    };

    ws.onopen = (evt: WebSocketEventMap["open"]) => {
      console.log("WebSocket open observed");
      setWSConnected(true);
    };

    ws.onmessage = (evt: WebSocketEventMap["message"]) => {
      handleMessage(evt);
    };
  }, [handleMessage]);

  const closeWS = useCallback((simulateError: boolean) => {
    if (ws && ws) {
      ws.close();

      if (simulateError && ws.onerror) {
        ws.onerror(new ErrorEvent("Some error"));
        ws = null;
      }
    }
  }, []);

  const toggleCurrency = useCallback(() => {
    unsubscribeCurrency();

    let newCurr =
      selectedCurrency.key === PRODUCT_IDS.XBT.key
        ? PRODUCT_IDS.ETH
        : PRODUCT_IDS.XBT;

    setSelectedCurrency(newCurr);
  }, [subscribeCurrency, unsubscribeCurrency]);

  useEffect(() => {
    if (wsConnected) {
      return;
    }

    connectWS();
    return () => {
      closeWS(false);
    };
  }, [connectWS, closeWS]);

  return (
    <WebsocketContext.Provider
      value={{
        closeWS,
        connectWS,
        selectedCurrency,
        toggleCurrency,
        wsConnected,
        wsError,
        setForceRefresh,
        forceRefresh,
      }}
    >
      {props.children}
    </WebsocketContext.Provider>
  );
};

export default WebsocketProvider;
