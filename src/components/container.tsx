import React from "react";

type ContainerProps = {
  className?: string;
};

const Container: React.FC<ContainerProps> = (props) => {
  let className = "flex container mx-auto bg-gray-800 p-4 border-solid border-4 border-gray-600";

  if (props.className) {
    className += ` ${props.className}`;
  }

  return <div className={className}>{props.children}</div>;
};

export default Container;
