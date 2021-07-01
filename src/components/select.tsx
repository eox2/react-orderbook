import React, { ChangeEvent, SetStateAction, Dispatch } from "react";

type SelectProps = {
  setNewSelection?: Dispatch<SetStateAction<string>>;
  className?: string;
  id: string;
  name: string;
  value: any;
  options: Array<any>;
};

const Select = (props: SelectProps) => {
  let cn = "px-10 bg-gray-400";

  if (props.className) {
    cn += " " + props.className;
  }

  const onChange = (event: ChangeEvent<HTMLSelectElement>) => {
    if (props.setNewSelection) {
      props.setNewSelection(event.target.value);
    }
  };

  return (
    <select
      onChange={onChange}
      className={cn}
      id={props.id}
      name={props.name}
      value={props.value}
    >
      {props.options.map((x, idx) => {
        return <option key={`${idx}-${x}`} value={x}>{x}</option>;
      })}
    </select>
  );
};

export default Select;
