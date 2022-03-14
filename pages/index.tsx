import React from "react";
import type { NextPage } from "next";
import Head from "next/head";
import { WalletPanel } from "../components/wallet-panel";
import DropTable from "../components/drop-table/drop-table";
import { SendPanel } from "../components/send-panel";

const Home: NextPage = () => {
  return (
    <main className="flex flex-1 flex-col">
      <WalletPanel />
    </main>
  );
};

export default Home;
