import React, { useState, useEffect, FormEvent } from "react";
import { client, urlFor } from "@/utils";
import { fetchComments, fetchLikes, fetchPost } from "@/utils/queries";
import { IComment, IPost, ILike } from "@/types";
import { GetServerSidePropsContext } from "next";
import moment from "moment";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { getFromStorage } from "@/utils";
import { useRouter } from "next/router";
import { Comment } from "@/components";
import Head from "next/head";

interface IProps {
  data: [IPost];
  comments: [IComment];
  likes: [ILike];
}

export default function Post({ data, comments, likes }: IProps) {
  const [comment, setComment] = useState("");
  const user = getFromStorage("isAuth");
  const router = useRouter();

  const liked = !!(likes?.filter((like) => like?.from === user)).length;

  const likeId = likes?.filter(
    (like) => like?.postId === data[0]?._id && like?.from === user
  );

  const createComment = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const doc = {
      _type: "comment",
      postId: data[0]?._id,
      user: user,
      content: comment,
    };
    await client.create(doc).then(() => {
      router.reload();
    });
  };

  const createLike = async () => {
    const doc = {
      _type: "like",
      postId: data[0]?._id,
      from: user,
    };
    await client.create(doc).then(() => {
      router.reload();
    });
  };

  const removeLike = async (id: string) => {
    await client.delete(id).then(() => {
      router.reload();
    });
  };
  return (
    <>
      <Head>
        <title>Avio - {data[0]?.user}&#39;s Post</title>
      </Head>
      <div className="w-full flex justify-center items-center gap-4 flex-col">
        <div className="w-2/5 flex justify-start items-start flex-col gap-4 bg-gray-100 px-4 py-2 rounded-lg">
          <div className="w-full flex justify-between items-center">
            <p className="font-bold">{data[0]?.user}</p>
            <p className="text-xs text-gray-400">
              {moment(data[0]?._createdAt).fromNow()}
            </p>
          </div>
          {data[0]?.content !== "null" && <p>{data[0]?.content}</p>}
          {data[0]?.image !== "null" && (
            <div className="w-full h-[300px] grid place-items-center">
              <img
                className="w-full h-[280px] object-contain"
                src={data[0]?.image}
                alt={"image by" + data[0]?.user}
              />
            </div>
          )}
          <div className="w-full flex justify-end items-center text-sm">
            {liked ? (
              <AiFillHeart
                className="text-rose-800 cursor-pointer"
                onClick={() => removeLike(likeId[0]?._id)}
              />
            ) : (
              <AiOutlineHeart className="cursor-pointer" onClick={createLike} />
            )}
          </div>
          <form
            className="w-full flex justify-between items-center p-2 bg-gray-200 rounded-lg gap-2"
            onSubmit={createComment}
          >
            <input
              className="w-full outline-none border-none bg-transparent"
              type="text"
              placeholder="Comment"
              onChange={(e) => setComment(e.target.value)}
              value={comment}
            />
            <button
              className="px-4 py-1 bg-teal-800 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              type="submit"
              disabled={comment.replace(/\s/g, "").length === 0}
            >
              Post
            </button>
          </form>
        </div>
        {comments?.map((comment) => (
          <Comment {...comment} key={comment?._id} />
        ))}
      </div>
    </>
  );
}

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const id = context?.params?.id;
  const data = await client.fetch(fetchPost(id));
  const comments = await client.fetch(fetchComments(id));
  const likes = await client.fetch(fetchLikes(id));

  return {
    props: {
      data,
      comments,
      likes,
    },
  };
};
