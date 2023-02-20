import React from "react";
import { IComment } from "@/types";
import moment from "moment";

export default function Comment(props: IComment) {
  return (
    <div className="w-full lg:w-2/5 bg-gray-100 rounded-lg px-4 py-2 flex justify-start items-start flex-col gap-4">
      <div className="w-full flex justify-between items-center">
        <div className="flex items-center gap-1">
          <img
            className="w-7 h-7 rounded-full object-cover"
            src={props?.avatar}
            alt={props?.user}
          />
          <p className="font-bold">{props?.user}</p>
        </div>
        <p className="text-xs text-gray-400">
          {moment(props?._createdAt).fromNow()}
        </p>
      </div>
      <p>{props?.content}</p>
    </div>
  );
}
