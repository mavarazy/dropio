import React, { createContext, useContext } from "react";
import { Keypair, Cluster } from "@solana/web3.js";

export interface DropAccount {
  accountId: string;
  amount: number;
}

export type GlobalContextType = {
  network: Cluster;
  setNetwork: React.Dispatch<React.SetStateAction<Cluster>>;
  account: Keypair | null;
  mnemonic: string | null;
  balance: number;
  dropAccounts: DropAccount[];
  setDropAccounts: (accounts: DropAccount[]) => void;
  beforeMap: { [key in string]: number };
  afterMap: { [key in string]: number };

  dropDev(): Promise<number>;
  refreshBalance(): Promise<number>;
  createAccount(): Promise<Keypair>;
  drop(): Promise<string>;
};

export const GlobalContext = createContext<GlobalContextType>({
  network: "devnet",
  setNetwork: () => null,
  account: null,
  mnemonic: null,
  balance: 0,
  dropAccounts: [],
  setDropAccounts: () => null,
  beforeMap: {},
  afterMap: {},
  refreshBalance: () => Promise.resolve(0),
  createAccount: () => Promise.resolve(Keypair.generate()),
  dropDev: () => Promise.resolve(0),
  drop: () => Promise.resolve(""),
});

export const useGlobalState = () => useContext(GlobalContext);
