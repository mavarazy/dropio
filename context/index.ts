import React, { createContext, useContext } from "react";
import { Keypair, Cluster } from "@solana/web3.js";

export interface DropAccount {
  accountId: string;
  amount: number;
}

export type GlobalContextType = {
  network: Cluster;
  account: Keypair | null;
  mnemonic: string | null;
  balance: number | null;
  setNetwork: React.Dispatch<React.SetStateAction<Cluster>>;
  setBalance: React.Dispatch<React.SetStateAction<number | null>>;
  dropAccounts: DropAccount[];
  setDropAccounts: (accounts: DropAccount[]) => void;
  beforeMap: { [key in string]: number };
  afterMap: { [key in string]: number };
  createAccount(): Promise<Keypair>;
  drop(dropAccounts: DropAccount[]): Promise<string>;
};

export const GlobalContext = createContext<GlobalContextType>({
  network: "devnet",
  setNetwork: () => null,
  account: null,
  mnemonic: null,
  balance: null,
  setBalance: () => null,
  dropAccounts: [],
  setDropAccounts: () => null,
  beforeMap: {},
  afterMap: {},
  createAccount: () => Promise.resolve(Keypair.generate()),
  drop: () => Promise.resolve(""),
});

export const useGlobalState = () => useContext(GlobalContext);
