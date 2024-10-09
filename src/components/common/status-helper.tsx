import React from "react";

const StatusHelper = () => {
  return (
    <div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          <div className="size-3 border border-gray-700 rounded-full bg-yellow-500" />
          <p className="text-[14px] text-gray-500">Pending</p>
        </div>
        <div className="flex items-center gap-1">
          <div className="size-3 border border-gray-700 rounded-full bg-blue-500" />
          <p className="text-[14px] text-gray-500">In Progress</p>
        </div>
        <div className="flex items-center gap-1">
          <div className="size-3 border border-gray-700 rounded-full bg-green-500" />
          <p className="text-[14px] text-gray-500">Completed</p>
        </div>
      </div>
    </div>
  );
};

export default StatusHelper;
