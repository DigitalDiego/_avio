import React from "react";
import { IComment } from "@/types";
import moment from "moment";

export default function Comment(props: IComment) {
  return (
    <div className="w-2/5 bg-gray-100 rounded-lg px-4 py-2 flex justify-start items-start flex-col gap-4">
      <div className="w-full flex justify-between items-center">
        <p className="font-bold">{props?.user}</p>
        <p className="text-xs text-gray-400">
          {moment(props?._createdAt).fromNow()}
        </p>
      </div>
      <p>{props?.content}</p>
    </div>
  );
}
