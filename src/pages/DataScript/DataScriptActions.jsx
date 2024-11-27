import React from "react";
import DuplicateProperties from "./DuplicateProperties";

const DataScriptActions = () => {
  return (
    <div className="p-4 flex flex-col gap-7">
      <h1 className="text-xl font-bold">Data Script Actions</h1>
      <div>
        <DuplicateProperties />
      </div>
    </div>
  );
};

export default DataScriptActions;
