import React, { MouseEventHandler, ReactNode } from "react";

type ButtonProps = {
  onClick: MouseEventHandler,
  className?: string,
  icon: ReactNode
};

const Button: React.FC<ButtonProps> = (props) => {
  let className = "flex flex-row text-white py-2 px-2 xl:px-6 items-center";

  if (props.className) {
    className += " " + props.className;
  }

  return (
    <button className={className} onClick={props.onClick}>
      <div className="mr-1 xl:mr-2 xl:p-2">{props.icon && props.icon}</div>
      {props.children}
    </button>
  );
};

export default Button;
