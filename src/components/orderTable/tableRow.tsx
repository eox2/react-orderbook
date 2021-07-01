import React from "react";

type TableRowProps = {
  className?: string;
  isHeader?: boolean;
  style?: React.CSSProperties;
};

const TableRow: React.FC<TableRowProps> = (props) => {
  let rowStyle = "flex flex-row py-2 xl:px-10 w-full";

  if (props.isHeader) {
    rowStyle += " text-gray-400";
  } else {
    rowStyle += " text-white";
  }

  if (props.className) {
    rowStyle += ` ${props.className}`;
  }

  return (
    <tr style={props.style} className={rowStyle}>
      {props.children}
    </tr>
  );
};

export default TableRow;
