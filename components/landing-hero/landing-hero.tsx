import React from "react";
import { useGlobalState } from "../../context";
import { Button } from "../button";
import { RestoreDropForm } from "./restore-drop-form";

export const LandingHero = () => {
  const { createAccount } = useGlobalState();

  return (
    <>
      <div className="bg-white flex flex-1 items-center">
        <div className="max-w-7xl mx-auto text-center py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
          <h2
            className="text-xl font-extrabold tracking-tight text-gray-900 sm:text-4xl"
            style={{ fontFamily: "Press Start\\ 2P", fontSize: 26 }}
          >
            <span className="block">AirDrop for Solana</span>
            <span className="block">Open Source, Secure, Free.</span>
          </h2>
          <div className="mt-8 justify-center">
            <div className="inline-flex">
              <Button onClick={createAccount}>
                <span className="px-4 py-1 text-xs">New Drop</span>
              </Button>
            </div>
            <div className="relative my-8">
              <div
                className="absolute inset-0 flex items-center"
                aria-hidden="true"
              >
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center">
                <span className="px-2 bg-white text-lg text-gray-400">OR</span>
              </div>
            </div>
            <div className="px-16">
              <RestoreDropForm />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
