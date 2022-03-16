import React, { createContext, useContext } from "react";
import { Cluster } from "@solana/web3.js";
import { AccountRestoreForm, AccountInfo } from "../utils/account-service";
import { TokenInfo } from "@solana/spl-token-registry";

export interface DropAccount {
  wallet: string;
  drop: number;
}

export type TokenAccount = Pick<TokenInfo, "address"> & { amount: number };

export interface WalletBallance {
  id: string;
  sol: number;
  tokens: TokenAccount[];
}

export type DropMode = "SOL" | "Token";

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

  tokenAddress: string;
  setTokenAddress(token: string): void;
  tokens: TokenInfo[];

  balance: WalletBallance;
  setWalletId(walletId: string): void;

  accountInfo: AccountInfo | null;

  dropAccounts: DropAccount[];
  setDropAccounts: (accounts: DropAccount[]) => void;

  beforeMap: { [key in string]: WalletBallance };
  afterMap: { [key in string]: WalletBallance };

  dropDev(): Promise<number>;
  mineDev(): Promise<void>;
  refreshBalance(): Promise<void>;
  restoreAccount(form: AccountRestoreForm): Promise<AccountInfo>;
  createAccount(): Promise<AccountInfo>;
  drop(): Promise<string>;
};

export const GlobalContext = createContext<GlobalContextType>({
  cluster: "devnet",
  setCluster: () => null,

  mode: "SOL",
  setMode: () => null,

  tokenAddress: "stest",
  setTokenAddress: () => null,

  tokens: [FakeToken],

  accountInfo: null,

  balance: {
    id: "test",
    sol: 0,
    tokens: [],
  },
  setWalletId: () => null,

  dropAccounts: [],
  setDropAccounts: () => null,

  beforeMap: {},
  afterMap: {},

  restoreAccount: () => Promise.reject(),
  refreshBalance: () => Promise.reject(),
  createAccount: () => Promise.reject(),

  drop: () => Promise.resolve(""),

  dropDev: () => Promise.resolve(0),
  mineDev: () => Promise.resolve(),
});

export const useGlobalState = () => useContext(GlobalContext);
