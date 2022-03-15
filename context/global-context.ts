import React, { createContext, useContext } from "react";
import { Cluster } from "@solana/web3.js";
import { AccountRestoreForm, AccountInfo } from "../utils/account-service";
import { TokenInfo } from "@solana/spl-token-registry";

export interface DropAccount {
  wallet: string;
  drop: number;
}

export type DropMode = "SOL" | "NFT" | "Token";

export const FakeToken: TokenInfo = {
  address: "Test",
  name: "... loading ...",
  chainId: 1,
  decimals: 0,
  symbol: "LOADING",
};

export type GlobalContextType = {
  cluster: Cluster;
  setCluster: React.Dispatch<React.SetStateAction<Cluster>>;

  mode: DropMode;
  setMode(mode: DropMode): void;

  token: TokenInfo;
  setToken(token: TokenInfo): void;
  tokens: TokenInfo[];

  accountId: string | null;
  setAccountId(accountId: string): void;

  accountInfo: AccountInfo | null;

  dropAccounts: DropAccount[];
  setDropAccounts: (accounts: DropAccount[]) => void;

  balance: number;
  beforeMap: { [key in string]: number };
  afterMap: { [key in string]: number };

  dropDev(): Promise<number>;
  mineDev(): Promise<number>;
  refreshBalance(): Promise<number>;
  restoreAccount(form: AccountRestoreForm): Promise<AccountInfo>;
  createAccount(): Promise<AccountInfo>;
  drop(): Promise<string>;
};

export const GlobalContext = createContext<GlobalContextType>({
  cluster: "devnet",
  setCluster: () => null,

  mode: "SOL",
  setMode: () => null,
  setToken: () => null,

  token: FakeToken,
  tokens: [FakeToken],

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
  drop: () => Promise.resolve(""),

  dropDev: () => Promise.resolve(0),
  mineDev: () => Promise.resolve(0),
});

export const useGlobalState = () => useContext(GlobalContext);
