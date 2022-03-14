import React, { createContext, useContext } from "react";
import { Cluster } from "@solana/web3.js";
import { AccountRestoreForm, AccountInfo } from "../utils/account-service";

export interface DropAccount {
  accountId: string;
  amount: number;
}

export type GlobalContextType = {
  network: Cluster;
  setNetwork: React.Dispatch<React.SetStateAction<Cluster>>;

  accountId: string | null;
  setAccountId(accountId: string): void;

  accountInfo: AccountInfo | null;

  dropAccounts: DropAccount[];
  setDropAccounts: (accounts: DropAccount[]) => void;

  balance: number;
  beforeMap: { [key in string]: number };
  afterMap: { [key in string]: number };

  dropDev(): Promise<number>;
  refreshBalance(): Promise<number>;
  restoreAccount(form: AccountRestoreForm): Promise<AccountInfo>;
  createAccount(): Promise<AccountInfo>;
  drop(): Promise<string>;
};

export const GlobalContext = createContext<GlobalContextType>({
  network: "devnet",
  setNetwork: () => null,

  accountInfo: null,

  accountId: null,
  setAccountId: () => null,

  balance: 0,

  dropAccounts: [],
  setDropAccounts: () => null,

  beforeMap: {},
  afterMap: {},

  restoreAccount: () => Promise.reject(),
  refreshBalance: () => Promise.reject(),
  createAccount: () => Promise.reject(),
  dropDev: () => Promise.resolve(0),
  drop: () => Promise.resolve(""),
});

export const useGlobalState = () => useContext(GlobalContext);
