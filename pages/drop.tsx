import React, { useEffect } from "react";
import { NextPage } from "next";
import { useGlobalState } from "../context";
import { useRouter } from "next/router";
import { refreshBalance, handleAirdrop } from "../utils";
import DropTable from "../components/drop-table/drop-table";
import { SendPanel } from "../components/send-panel";

const Drop: NextPage = () => {
  const { network, account, balance, setBalance } = useGlobalState();

  const router = useRouter();

  useEffect(() => {
    if (!account) {
      router.push("/");
      return;
    }
    refreshBalance(network, account)
      .then((updatedBalance) => {
        setBalance(updatedBalance);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [account, router, network]);

  const airdrop = async () => {
    const updatedBalance = await handleAirdrop(network, account);
    if (typeof updatedBalance === "number") {
      setBalance(updatedBalance);
    }
  };

  const displayAddress = (address: string) =>
    `${address.slice(0, 4)}...${address.slice(-4)}`;

  return (
    <div className="flex flex-col">
      {account && (
        <div>
          <h1>Dashboard</h1>
          <p>{`Account: ${displayAddress(account.publicKey.toString())}`}</p>
          <p>
            Connected to{" "}
            {network &&
              (network === "mainnet-beta"
                ? network.charAt(0).toUpperCase() + network.slice(1, 7)
                : network.charAt(0).toUpperCase() + network.slice(1))}
          </p>
          {balance} <span>SOL</span>
          {network === "devnet" && account && (
            <>
              <button
                onClick={airdrop}
                className="px-5 py-2 border-2 rounded-full"
              >
                Airdrop
              </button>
            </>
          )}
        </div>
      )}
      <DropTable />
      <SendPanel />
    </div>
  );
};

export default Drop;
