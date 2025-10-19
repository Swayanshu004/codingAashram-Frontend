"use client";
import React from "react";
import Link from "next/link";
import { FaUser } from "react-icons/fa";

const Header = () => {
  return (
    <header className="border-[1px] border-black bg-neutral-200 bg-opacity-25 text-white flex items-center justify-between rounded-xl my-4 mx-10 py-4 px-7">
      <Link href="/">
        <div className="text-2xl md:text-4xl font-bold">
          coding<span className="text-[#ff4d00]">आश्रम</span>
        </div>
      </Link>
      <Link href="/profile">
        <div className="h-6 w-6 md:h-10 md:w-10 bg-neutral-600 rounded-full flex items-center justify-center">
          <FaUser />
        </div>
      </Link>
    </header>
  );
};

export default Header;