import TableRow from "./tableRow";
import TableColumn from "./tableColumn";

import { NumberUtils } from "../../utils/index";
import { COLORS, ORDER_TYPES } from "../../etc/constants";

type PriceProps = {
  price: number;
};

type OrderTableProps = {
  data: Array<Array<number>>;
  type: ORDER_TYPES;
  isMobile: boolean;
  max: number;
  noHeader?: boolean;
};

const PriceColumn = ({ price }: PriceProps) => {
  return (
    <TableColumn className="text-green-400">
      {NumberUtils.formatCurrency(Number.parseFloat(price.toFixed(2)))}
    </TableColumn>
  );
};

const OrderTable = (props: OrderTableProps) => {
  let data = props.data;
  let total = 0;

  let showingBids = props.type === ORDER_TYPES.BID;
  let showingAsks = props.type === ORDER_TYPES.ASK;

  let columns =
    showingAsks || props.isMobile
      ? ["Price", "Size", "Total"]
      : ["Total", "Size", "Price"];

  if (props.isMobile && showingAsks) {
    data = data.reverse();
  }

  let rows = data.map(([price, size], idx) => {
    total += size;

    let width = (total / props.max) * 100;

    let columns = [
      <PriceColumn
        key={`${props.type}-price-${price.toString()}`}
        price={price}
      />,
      <TableColumn key={`${props.type}-size-${size.toString()}`}>
        {NumberUtils.formatNumber(size)}
      </TableColumn>,
      <TableColumn key={`${props.type}-total-${total.toString()}`}>
        {NumberUtils.formatNumber(total)}
      </TableColumn>,
    ];

    if (showingBids && !props.isMobile) {
      columns = columns.reverse();
    }

    let color = showingBids ? COLORS.BID : COLORS.ASK;
    let fillDirection = showingBids || props.isMobile ? "left" : "right";

    return (
      <TableRow
        key={`${idx}`}
        style={{
          background: `linear-gradient(to ${fillDirection}, ${color} ${width}%, transparent ${width}%)`,
        }}
      >
        {columns}
      </TableRow>
    );
  });

  return (
    <table className={`w-full`}>
      <tbody>
        {!props.noHeader && (
          <TableRow isHeader={true}>
            {columns.map((colName) => (
              <TableColumn
                key={`${props.type}-hdr-${colName}`}
                isHeaderColumn={true}
              >
                {colName}
              </TableColumn>
            ))}
          </TableRow>
        )}

        {props.isMobile && props.type === ORDER_TYPES.BID
          ? rows.reverse()
          : rows}
      </tbody>
    </table>
  );
};

export default OrderTable;
