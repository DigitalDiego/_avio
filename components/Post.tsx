import React, { useState, useEffect } from "react";
import { IPost } from "@/types";
import moment from "moment";
import { client } from "@/utils";
import { FaRegCommentDots } from "react-icons/fa";
import { AiOutlineHeart } from "react-icons/ai";
import Link from "next/link";
import { IComment, ILike } from "@/types";
import { fetchComments, fetchLikes } from "@/utils/queries";

export default function Post(props: IPost) {
  const [comments, setComments] = useState<Array<IComment> | null>(null);
  const [likes, setLikes] = useState<Array<ILike> | null>(null);

  const getComents = async (id: string) => {
    await client
      .fetch(fetchComments(id))
      .then((data) => {
        setComments(data);
      })
      .catch((error) => console.error(error));
  };

  const getLikes = async (id: string) => {
    await client
      .fetch(fetchLikes(id))
      .then((data) => {
        setLikes(data);
      })
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    getComents(props?._id);
  }, []);
  useEffect(() => {
    getLikes(props?._id);
  }, []);
  return (
    <Link
      href={"/posts/" + props?._id}
      className="w-full lg:w-2/5 px-4 py-2 rounded-lg bg-gray-100"
    >
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
      {props?.content !== "null" && <p>{props?.content}</p>}
      {props?.image !== "null" && (
        <div className="w-full h-[300px] grid place-items-center">
          <img
            className="w-full h-[280px] object-contain"
            src={props?.image}
            alt={"image uploaded by" + props?.user}
          />
        </div>
      )}
      <div className="w-full flex justify-end items-center text-sm gap-4">
        <div className="flex items-center gap-1">
          <AiOutlineHeart />
          <p>{likes?.length}</p>
        </div>
        <div className="flex items-center gap-1">
          <FaRegCommentDots />
          <p>{comments?.length}</p>
        </div>
      </div>
    </Link>
  );
}
