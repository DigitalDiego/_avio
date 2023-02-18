import React from "react";
import { removefromStorage } from "@/utils";
import { useRouter } from "next/router";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase.config";
import Link from "next/link";

export default function Navbar() {
  const router = useRouter();

  const logout = async () => {
    await signOut(auth).then(() => {
      removefromStorage();
      router.push("/auth/login");
    });
  };
  return (
    <div className="w-full lg:w-3/5 h-[8vh] flex justify-between items-center mx-auto mb-4 px-4 lg:px-0">
      <Link href="/" className="text-2xl font-bold">
        Avio
      </Link>
      <button
        className="px-4 py-1 bg-rose-800 text-white rounded-lg"
        onClick={logout}
      >
        Log out
      </button>
    </div>
  );
}
