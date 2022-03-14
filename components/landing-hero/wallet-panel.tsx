import React from "react";
import { useGlobalState } from "../../context";
import { Button } from "../button";

export const WalletPanel = () => {
  const { createAccount } = useGlobalState();

  return (
    <div className="bg-white flex flex-1 items-center">
      <div className="max-w-7xl mx-auto text-center py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          <span className="block">AirDrop for Solana</span>
          <span className="block">Open Source, Secure, Free.</span>
        </h2>
        <div className="mt-8 flex justify-center">
          <div className="inline-flex">
            <Button onClick={createAccount}>
              <span className="px-6 font-light py-1 text-xl">New</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
