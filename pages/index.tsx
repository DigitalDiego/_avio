import React, { FormEvent, useState, useEffect } from "react";
import Head from "next/head";
import { getFromStorage } from "@/utils";
import { client } from "../utils";
import {
  AiFillFileImage,
  AiOutlineUpload,
  AiOutlineLoading,
  AiOutlinePlus,
} from "react-icons/ai";
import Image from "next/image";
import { BsFillTrash2Fill } from "react-icons/bs";
import { Post } from "../components";
import { IPost } from "../types";
import { fetchPosts } from "@/utils/queries";
import { useRouter } from "next/router";

export default function Home() {
  const [posts, setPosts] = useState<Array<IPost> | null>(null);
  const [content, setContent] = useState("");
  const [imageDiv, setImageDiv] = useState(false);
  const [imageAsset, setImageAsset] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const user = getFromStorage("isAuth");
  const router = useRouter();

  const uploadImage = (e: any) => {
    const selectedFile = e.target.files[0];
    // uploading asset to sanity
    if (
      selectedFile.type === "image/png" ||
      selectedFile.type === "image/svg" ||
      selectedFile.type === "image/jpeg" ||
      selectedFile.type === "image/gif" ||
      selectedFile.type === "image/tiff"
    ) {
      setLoading(true);
      client.assets
        .upload("image", selectedFile, {
          contentType: selectedFile.type,
          filename: selectedFile.name,
        })
        .then((document: any) => {
          setImageAsset(document);
          setLoading(false);
        })
        .catch((error) => {
          console.log("Upload failed:", error.message);
        });
    } else {
      setLoading(false);
    }
  };

  const createPost = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const doc = {
      _type: "post",
      user: user,
      content: content.replace(/\s/g, "").length === 0 ? "null" : content,
      image: !imageAsset ? "null" : imageAsset?.url,
    };
    await client.create(doc).then(() => {
      router.reload();
    });
  };

  const getPosts = async () => {
    await client
      .fetch(fetchPosts)
      .then((data) => {
        setPosts(data);
      })
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    getPosts();
  }, []);
  return (
    <>
      <Head>
        <title>Avio - {user}</title>
      </Head>
      <div className="px-4 lg:px-0 w-full flex justify-start items-center flex-col gap-4 py-4 2xl:max-w-7xl 2xl:mx-auto">
        <form
          className="w-full lg:w-2/5 bg-gray-100 flex flex-col gap-2 px-4 py-2 rounded-lg"
          onSubmit={createPost}
        >
          <div className="w-full flex items-center gap-2">
            <input
              className="w-full border-none outline-none bg-transparent"
              type="text"
              placeholder="What&#39;s on your mind?"
              onChange={(e) => setContent(e.target.value)}
              value={content}
            />
            <button
              className="p-2 rounded-lg bg-teal-800 text-white"
              onClick={() => setImageDiv(!imageDiv)}
              type="button"
            >
              {imageDiv ? (
                <AiOutlinePlus className="rotate-45" />
              ) : (
                <AiFillFileImage />
              )}
            </button>
            <button
              className="px-4 py-1 bg-teal-800 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={content.replace(/\s/g, "").length === 0}
              type="submit"
            >
              Post
            </button>
          </div>
          {imageDiv && (
            <div className="w-full h-[300px]">
              {!imageAsset && !loading ? (
                <label className="w-full h-full grid place-items-center text-2xl relative">
                  <input
                    className="w-0 h0 absolute"
                    type="file"
                    onChange={uploadImage}
                  />
                  <AiOutlineUpload />
                </label>
              ) : loading ? (
                <div className="w-full h-full grid place-items-center">
                  <AiOutlineLoading className="text-2xl animate-spin" />
                </div>
              ) : (
                imageAsset && (
                  <div className="w-full h-full grid place-items-center relative">
                    <button
                      className="absolute top-2 right-2 bg-rose-800 text-white p-2 rounded-lg"
                      onClick={() => setImageAsset(null)}
                    >
                      <BsFillTrash2Fill />
                    </button>
                    <Image
                      className="w-full h-[280px] object-contain"
                      src={imageAsset?.url}
                      alt="uploaded image"
                      width={500}
                      height={500}
                    />
                  </div>
                )
              )}
            </div>
          )}
        </form>
        {!posts ? (
          <div className="w-full grid place-items-center">
            <AiOutlineLoading className="animate-spin" />
          </div>
        ) : (
          posts?.map((post) => <Post {...post} key={post?._id} />)
        )}
      </div>
    </>
  );
}
