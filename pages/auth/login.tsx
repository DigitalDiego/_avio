import React from "react";
import { saveToStorage } from "@/utils";
import { auth, provider } from "../../firebase.config";
import { useRouter } from "next/router";
import Head from "next/head";
import { signInWithPopup } from "firebase/auth";

export default function Login() {
  const router = useRouter();

  const login = async () => {
    await signInWithPopup(auth, provider).then((result) => {
      saveToStorage("isAuth", auth.currentUser?.displayName);
      router.push("/");
    });
  };
  return (
    <>
      <Head>
        <title>Avio | Login</title>
      </Head>
      <div className="w-full h-screen flex justify-center items-center gap-2 flex-col 2xl:max-w-7xl 2xl:mx-auto">
        <p className="text-5xl">
          Welcome to <span className="font-bold">Avio</span>
        </p>
        <p className="w-4/5 lg:w-2/5 text-center">
          Join a community of people that like to express themselves and
          interact with people on the daily
        </p>
        <button
          className="px-4 py-1 bg-teal-800 text-white rounded-lg"
          onClick={login}
        >
          Login with Google
        </button>
      </div>
    </>
  );
}
