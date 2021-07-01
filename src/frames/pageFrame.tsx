import React from "react";

const PageFrame: React.FC = (props) => {
  return (
    <div className="flex flex-col bg-gray-600 bg-auto bg-cover w-screen h-screen overflow-y-auto">
      <div className="flex flex-1 h-screen justify-start px-2 xl:px-10 py-4">
        {props.children}
      </div>
    </div>
  );
};

export default PageFrame;
