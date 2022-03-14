import React from "react";
import type { NextPage } from "next";
import Head from "next/head";
import { WalletPanel } from "../components/wallet-panel";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta charSet="utf-8" />
        <title>Tiny Drop</title>
        <meta
          name="description"
          content="Web3 tutorial for Solana crypto wallet."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex flex-1">
        <WalletPanel />
      </div>
    </>
  );
};

export default Home;
