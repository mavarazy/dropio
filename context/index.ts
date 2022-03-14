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
  setAccount: React.Dispatch<React.SetStateAction<Keypair | null>>;
  mnemonic: string | null;
  setMnemonic: React.Dispatch<React.SetStateAction<string | null>>;
  balance: number | null;
  setBalance: React.Dispatch<React.SetStateAction<number | null>>;
  dropAccounts: DropAccount[];
  setDropAccounts: (accounts: DropAccount[]) => void;
  beforeMap: { [key in string]: number };
  afterMap: { [key in string]: number };
  drop(dropAccounts: DropAccount[]): Promise<string>;
};

export const GlobalContext = createContext<GlobalContextType>({
  network: "devnet",
  setNetwork: () => null,
  account: null,
  setAccount: () => null,
  mnemonic: null,
  setMnemonic: () => null,
  balance: null,
  setBalance: () => null,
  dropAccounts: [],
  setDropAccounts: () => null,
  beforeMap: {},
  afterMap: {},
  drop: () => Promise.resolve(""),
});

export const useGlobalState = () => useContext(GlobalContext);
