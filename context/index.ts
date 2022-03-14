import React, { createContext, useContext } from "react";
import { Keypair, Cluster } from "@solana/web3.js";

export interface DropAccount {
  accountId: string;
  amount: number;
}

export type GlobalContextType = {
  network: Cluster;
  setNetwork: React.Dispatch<React.SetStateAction<Cluster>>;
  accountId: string | null;
  setAccountId(accountId: string): void;
  account: Keypair | null;
  mnemonic: string | null;
  balance: number;
  dropAccounts: DropAccount[];
  setDropAccounts: (accounts: DropAccount[]) => void;
  beforeMap: { [key in string]: number };
  afterMap: { [key in string]: number };

  dropDev(): Promise<number>;
  refreshBalance(): Promise<number>;
  restoreAccount(mnemonicForm: { mnemonic: string }): Promise<Keypair>;
  createAccount(): Promise<Keypair>;
  drop(): Promise<string>;
};

export const GlobalContext = createContext<GlobalContextType>({
  network: "devnet",
  setNetwork: () => null,
  accountId: null,
  setAccountId: () => null,
  account: null,
  mnemonic: null,
  balance: 0,
  dropAccounts: [],
  setDropAccounts: () => null,
  beforeMap: {},
  afterMap: {},
  restoreAccount: () => Promise.resolve(Keypair.generate()),
  refreshBalance: () => Promise.resolve(0),
  createAccount: () => Promise.resolve(Keypair.generate()),
  dropDev: () => Promise.resolve(0),
  drop: () => Promise.resolve(""),
});

export const useGlobalState = () => useContext(GlobalContext);
