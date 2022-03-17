import { createContext, useContext } from "react";
import { Cluster } from "@solana/web3.js";
import { AccountRestoreForm, AccountInfo } from "../utils/account-service";
import { TokenInfo } from "@solana/spl-token-registry";

export interface DropAccount {
  wallet: string;
  drop: bigint;
}

export interface DropAccountBalance {
  wallet: string;
  drop: bigint;
  address: string;
  amount: bigint;
}

export interface PopulatedDropAccount {
  wallet: string;
  drop: bigint;
  before?: DropAccountBalance | "missing";
  after?: DropAccountBalance;
}

export type TokenAccount = { token: TokenInfo; amount: bigint };

export interface WalletBallance {
  id: string;
  sol: bigint;
  tokens: TokenAccount[];
}

export type DropMode = "SOL" | "Token";

export const DefaultToken: TokenInfo = {
  chainId: 101,
  address: "HKfs24UEDQpHS5hUyKYkHd9q7GY5UQ679q2bokeL2whu",
  symbol: "TINY",
  name: "TinyBits",
  decimals: 6,
  logoURI: "https://tinycolony.io/tinycolonytoken.png",
};

export const TransactionFee = BigInt(5000);
export const AccountCreationFee = BigInt(2044280);
export interface AppState {
  cluster: Cluster;
  mode: DropMode;
  token: TokenInfo;
  officialTokens: TokenInfo[];
  balance: WalletBallance;
  fee: bigint;
  dropAccounts: DropAccount[];
  dropPopulatedAccounts: PopulatedDropAccount[];
}

export type GlobalContextType = {
  state: AppState;

  setCluster(cluster: Cluster): void;
  setMode(mode: DropMode): void;
  setToken(token: TokenInfo): void;
  setDropAccounts: (accounts: DropAccount[]) => void;

  accountInfo: AccountInfo | null;
  setWalletId(walletId: string): void;

  onError: (error: unknown) => void;

  refreshBalance(): Promise<void>;
  restoreAccount(form: AccountRestoreForm): Promise<void>;
  createAccount(): Promise<void>;
  drop(): Promise<void>;
};

export const GlobalContext = createContext<GlobalContextType>({
  state: {
    cluster: "devnet",
    mode: "SOL",
    balance: {
      id: "test",
      sol: BigInt(0),
      tokens: [],
    },
    fee: TransactionFee,
    officialTokens: [],
    dropAccounts: [],
    dropPopulatedAccounts: [],
    token: DefaultToken,
  },

  setCluster: () => null,
  setMode: () => null,
  setToken: () => null,
  setDropAccounts: () => null,

  accountInfo: null,
  setWalletId: () => null,

  onError: (error: unknown) => null,

  restoreAccount: () => Promise.reject(),
  refreshBalance: () => Promise.reject(),
  createAccount: () => Promise.reject(),
  drop: () => Promise.reject(),
});

export const useGlobalState = () => useContext(GlobalContext);
