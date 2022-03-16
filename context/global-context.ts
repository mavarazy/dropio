import React, { createContext, useContext } from "react";
import { Cluster } from "@solana/web3.js";
import { AccountRestoreForm, AccountInfo } from "../utils/account-service";
import { TokenInfo } from "@solana/spl-token-registry";

export interface DropAccount {
  wallet: string;
  drop: number;
}

export interface DropAccountBalance {
  wallet: string;
  drop: number;
  address: string;
  amount: number;
}

export interface PopulatedDropAccount {
  wallet: string;
  drop: number;
  address?: string;
  before?: number;
  after?: number;
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

export interface AppState {
  cluster: Cluster;
  mode: DropMode;
  tokenAddress: string;
  balance: WalletBallance;
  dropAccounts: DropAccount[];
  dropPopulatedAccounts: PopulatedDropAccount[];
}

export type GlobalContextType = {
  state: AppState;

  setCluster(cluster: Cluster): void;
  setMode(mode: DropMode): void;
  setTokenAddress(token: string): void;
  setDropAccounts: (accounts: DropAccount[]) => void;

  tokens: TokenInfo[];

  setWalletId(walletId: string): void;

  accountInfo: AccountInfo | null;

  dropDev(): Promise<number>;
  mineDev(): Promise<void>;
  refreshBalance(): Promise<void>;
  restoreAccount(form: AccountRestoreForm): Promise<AccountInfo>;
  createAccount(): Promise<AccountInfo>;
  drop(): Promise<string>;
};

export const GlobalContext = createContext<GlobalContextType>({
  state: {
    cluster: "devnet",
    mode: "SOL",
    balance: {
      id: "test",
      sol: 0,
      tokens: [],
    },
    dropAccounts: [],
    dropPopulatedAccounts: [],
    tokenAddress: "",
  },

  setCluster: () => null,
  setMode: () => null,
  setTokenAddress: () => null,
  setDropAccounts: () => null,

  tokens: [FakeToken],

  accountInfo: null,
  setWalletId: () => null,

  restoreAccount: () => Promise.reject(),
  refreshBalance: () => Promise.reject(),
  createAccount: () => Promise.reject(),

  drop: () => Promise.resolve(""),

  dropDev: () => Promise.resolve(0),
  mineDev: () => Promise.resolve(),
});

export const useGlobalState = () => useContext(GlobalContext);
