import React, { useContext, useState, useEffect, useCallback } from "react";

import OrderTable from "../components/orderTable";

import Select from "../components/select";
import Button from "../components/button";
import Container from "../components/container";

import { FaExchangeAlt, FaInfoCircle } from "react-icons/fa";

import { WebsocketContext } from "../contexts/Websocket";

import {
  ORDER_TYPES,
  PRODUCT_IDS,
  DISPLAYED_ROWS_COUNT,
  UI_REFRESH_RATE,
} from "../etc/constants";

import { useMediaQuery } from "react-responsive";

import DATA_STORE from "../etc/dataStore";

import { OBUtils } from "../utils";

type ShownDataType = {
  asks: Array<Array<number>>;
  bids: Array<Array<number>>;
};

const Orders = () => {
  const {
    connectWS,
    closeWS,
    selectedCurrency,
    toggleCurrency,
    setForceRefresh,
    forceRefresh,
    wsConnected,
    wsError,
  } = useContext(WebsocketContext);

  const isMobile = useMediaQuery({ query: "(max-width: 1280px)" });

  const [selectedTickSize, setSelectedTickSize] = useState<string>(
    PRODUCT_IDS["XBT"].groupings[0]
  );

  const [shownData, setShownData] = useState<ShownDataType>({
    asks: [],
    bids: [],
  });

  const syncData = useCallback(() => {
    let asksArray = Array.from(DATA_STORE.asks);
    let bidsArray = Array.from(DATA_STORE.bids);

    const groupedAsks = OBUtils.groupOrders(
      asksArray,
      Number.parseFloat(selectedTickSize)
    );

    const groupedBids = OBUtils.groupOrders(
      bidsArray,
      Number.parseFloat(selectedTickSize)
    );

    let sortedAsks = OBUtils.sortOrders(groupedAsks, ORDER_TYPES.ASK);

    let sortedBids = OBUtils.sortOrders(groupedBids, ORDER_TYPES.BID);

    let slicedAsks = sortedAsks.slice(0, DISPLAYED_ROWS_COUNT);

    let slicedBids = sortedBids.slice(0, DISPLAYED_ROWS_COUNT);

    let newShownData = {
      asks: slicedAsks,
      bids: slicedBids,
    };

    setShownData(newShownData);
  }, [selectedTickSize]);

  useEffect(() => {
    if (!wsConnected) {
      return;
    }

    const id = setInterval(
      syncData,
      isMobile ? UI_REFRESH_RATE.MOBILE : UI_REFRESH_RATE.DESKTOP
    );

    return () => clearInterval(id);
  }, [wsConnected, isMobile, syncData]);

  useEffect(() => {
    if (forceRefresh && setForceRefresh) {
      setForceRefresh(false);
      syncData();
    }
  }, [forceRefresh]);

  useEffect(() => {
    syncData();
  }, [syncData]);

  if (
    !shownData ||
    !selectedCurrency ||
    !toggleCurrency ||
    !closeWS ||
    !connectWS
  ) {
    return null;
  }

  let bidData = shownData.bids;
  let askData = shownData.asks;

  let totalBid = 0;
  let totalAsk = 0;

  bidData.forEach(([price, size]) => {
    totalBid += size;
  });

  askData.forEach(([price, size]) => {
    totalAsk += size;
  });

  let max = Math.max(totalBid, totalAsk);

  return (
    <div className="bg-gray-600 flex flex-col w-full items-center text-xs xl:text-xl">
      <Container className="flex-row justify-between px-4 xl:px-20 w-full xl:w-8/12">
        <h4 className="text-gray-200">Order Book</h4>
        <h4 className="text-gray-200">
          Currently selected: {selectedCurrency.key}
        </h4>
        <Select
          setNewSelection={setSelectedTickSize}
          name={"tickSize"}
          id={"select-tick"}
          value={selectedTickSize}
          options={selectedCurrency.groupings}
          className=""
        />
      </Container>

      <Container className="w-full xl:w-8/12 flex-col xl:flex-row">
        <OrderTable
          isMobile={isMobile}
          data={bidData}
          type={ORDER_TYPES.BID}
          max={max}
        />
        {isMobile && <div className="my-4"></div>}
        <OrderTable
          noHeader={isMobile}
          isMobile={isMobile}
          data={askData}
          type={ORDER_TYPES.ASK}
          max={max}
        />
      </Container>

      <Container className="flex-row justify-center space-x-1 xl:space-x-4 w-full xl:w-8/12">
        <p className="text-gray-200">
          Status:{" "}
          {wsConnected ? (
            <span className="text-green-500">Connected</span>
          ) : (
            <span className="text-red-700">Not connected</span>
          )}
        </p>

        {wsError && <p className="text-red-700">Error encountered.</p>}
      </Container>

      <Container className="flex-row justify-center space-x-1 xl:space-x-4 w-full xl:w-8/12">
        {!wsError && wsConnected && (
          <Button
            icon={<FaExchangeAlt />}
            onClick={toggleCurrency}
            className="bg-purple-600 hover:bg-purple-900"
          >
            Toggle Feed
          </Button>
        )}
        <Button
          icon={<FaInfoCircle />}
          className="bg-red-600 hover:bg-red-900"
          onClick={() => {
            if (!wsError) {
              closeWS(true);
            } else {
              connectWS();
            }
          }}
        >
          {wsError || !wsConnected ? "Reconnect" : "Kill Feed"}
        </Button>
      </Container>
    </div>
  );
};

export default Orders;
