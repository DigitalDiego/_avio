import { useEffect } from "react";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { getFromStorage } from "@/utils";
import { Navbar } from "@/components";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const user = getFromStorage("isAuth");

  useEffect(() => {
    if (!user) router.push("/auth/login");
  }, []);
  return (
    <>
      {router.pathname !== "/auth/login" && <Navbar />}
      <Component {...pageProps} />
    </>
  );
}
