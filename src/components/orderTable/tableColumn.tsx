import React from "react";

type TableColumnProps = {
  className?: string;
  isHeaderColumn?: boolean;
};

const TableColumn: React.FC<TableColumnProps> = (props) => {
  let cn = `flex flex-row w-full px-4 justify-end`;
  if (props.className) {
    cn += ` ${props.className}`;
  }
  if (props.isHeaderColumn) {
    return <th className={cn}>{props.children}</th>;
  } else {
    return <td className={cn}>{props.children}</td>;
  }
};

export default TableColumn;
