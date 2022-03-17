import React, { useEffect, useMemo, useReducer, useRef, useState } from "react";
import { Cluster } from "@solana/web3.js";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import {
  WalletBallance,
  DropAccount,
  DropMode,
  FakeToken,
  GlobalContext,
  AppState,
  DropAccountBalance,
} from "../context";
import { Layout } from "../components/layout";
import { Notification, NotificationProps } from "../components/notification";
import { useRouter } from "next/router";
import {
  AccountService,
  AccountInfo,
  AccountRestoreForm,
} from "../utils/account-service";
import { BalanceService } from "../utils/balance-service";
import { TokenInfo, TokenListProvider } from "@solana/spl-token-registry";

type AppAction =
  | {
      type: "SET_CLUSTER";
      payload: Cluster;
    }
  | {
      type: "SET_TOKEN_ADDRESS";
      payload: string;
    }
  | {
      type: "SET_DROP_ACCOUNT_BEFORE";
      payload: {
        wallet: string;
        balance: DropAccountBalance | "missing";
      };
    }
  | {
      type: "SET_DROP_ACCOUNT_AFTER";
      payload: DropAccountBalance;
    }
  | {
      type: "SET_MODE";
      payload: DropMode;
    }
  | {
      type: "SET_DROP_ACCOUNT";
      payload: DropAccount[];
    }
  | {
      type: "SET_BALANCE";
      payload: WalletBallance;
    }
  | {
      type: "SET_WALLET";
      payload: string;
    };

function reducer(state: AppState, action: AppAction): AppState {
  console.log(action.type);
  switch (action.type) {
    case "SET_DROP_ACCOUNT":
      return {
        ...state,
        dropAccounts: action.payload,
        dropPopulatedAccounts: action.payload,
      };
    case "SET_CLUSTER":
      return {
        ...state,
        mode: "SOL",
        cluster: action.payload,
        dropAccounts: state.dropAccounts.map((acc) => ({
          wallet: acc.wallet,
          drop: acc.drop,
        })),
      };
    case "SET_TOKEN_ADDRESS": {
      return {
        ...state,
        mode: "Token",
        tokenAddress: action.payload,
        dropPopulatedAccounts: state.dropAccounts,
      };
    }
    case "SET_MODE": {
      return {
        ...state,
        mode: action.payload,
        dropPopulatedAccounts: state.dropAccounts,
      };
    }
    case "SET_DROP_ACCOUNT_BEFORE": {
      return {
        ...state,
        dropPopulatedAccounts: state.dropPopulatedAccounts.map((drop) =>
          drop.wallet === action.payload.wallet
            ? { ...drop, before: action.payload.balance }
            : drop
        ),
      };
    }
    case "SET_DROP_ACCOUNT_AFTER": {
      return {
        ...state,
        dropPopulatedAccounts: state.dropPopulatedAccounts.map((drop) =>
          drop.wallet === action.payload.wallet
            ? { ...drop, after: action.payload }
            : drop
        ),
      };
    }
    case "SET_BALANCE": {
      return {
        ...state,
        balance: action.payload,
      };
    }
    case "SET_WALLET": {
      return {
        ...state,
        balance: {
          id: action.payload,
          sol: 0,
          tokens: [],
        },
      };
    }
    default:
      throw new Error();
  }
}

function MyApp({ Component, pageProps }: AppProps) {
  const notificationRef = useRef<NotificationProps>(null);
  const [state, dispatch] = useReducer(reducer, {
    cluster: "devnet",
    mode: "SOL",
    tokenAddress: "CQD3KBgZ8r4TrS2LbU2fEHJm7gf8csQv4LJd2XypntvH",
    balance: {
      id: "CQD3KBgZ8r4TrS2LbU2fEHJm7gf8csQv4LJd2XypntvH",
      sol: 0,
      tokens: [],
    },
    dropAccounts: [],
    dropPopulatedAccounts: [],
  });

  const [tokens, setTokens] = useState<TokenInfo[]>([FakeToken]);
  const [accountInfo, setAccountInfo] = useState<AccountInfo | null>(null);

  const router = useRouter();

  const tokenCatalogue = useMemo(() => new TokenListProvider().resolve(), []);

  useEffect(() => {
    const timeout = setTimeout(() => refreshBalance(), 1000);
    return () => clearTimeout(timeout);
  }, [state.balance.id, state.cluster]);

  useEffect(() => {
    state.dropAccounts.forEach(async (dropAccount) => {
      const balance = await BalanceService.getDropAccountBalance(
        state.cluster,
        dropAccount,
        state.mode,
        state.tokenAddress
      );

      dispatch({
        type: "SET_DROP_ACCOUNT_BEFORE",
        payload: {
          wallet: dropAccount.wallet,
          balance,
        },
      });
    });
  }, [
    accountInfo,
    state.cluster,
    state.dropAccounts,
    state.mode,
    state.tokenAddress,
  ]);

  useEffect(() => {
    tokenCatalogue.then((tokens) => {
      const clusterTokens = tokens
        .filterByClusterSlug(state.cluster)
        .getList()
        .filter((token) => token.decimals > 0);

      clusterTokens.sort((a, b) => a.name.localeCompare(b.name));
      setTokens(clusterTokens);
    });
  }, [state.cluster, tokenCatalogue]);

  const drop = async () => {
    if (!accountInfo) {
      return "";
    }

    const signature = await BalanceService.drop(
      state.cluster,
      accountInfo.account,
      state.dropPopulatedAccounts,
      state.mode,
      state.tokenAddress
    );

    refreshBalance();

    state.dropAccounts.forEach(async (account) => {
      if (accountInfo) {
        const balance = await BalanceService.getDropAccountBalance(
          state.cluster,
          account,
          state.mode,
          state.tokenAddress
        );

        if (balance !== "missing") {
          dispatch({
            type: "SET_DROP_ACCOUNT_AFTER",
            payload: balance,
          });
        }
      }
    });
    return signature;
  };

  const createAccount = async () => {
    const accountInfo = await AccountService.create();

    setAccountInfo(accountInfo);

    router.push(`/drop/${accountInfo.account.publicKey.toString()}`);
    return accountInfo;
  };

  const refreshBalance = async () => {
    const balance = await BalanceService.getWalletBalance(
      state.cluster,
      state.balance.id
    );
    dispatch({ type: "SET_BALANCE", payload: balance });
  };

  const restoreAccount = async (form: AccountRestoreForm) => {
    const accountInfo = await AccountService.restore(form);
    setAccountInfo(accountInfo);

    router.push(`/drop/${accountInfo.account.publicKey.toString()}`);

    return accountInfo;
  };

  return (
    <GlobalContext.Provider
      value={{
        state,
        accountInfo,
        setWalletId: (accountId: string) =>
          dispatch({ type: "SET_WALLET", payload: accountId }),
        setCluster: (cluster: Cluster) =>
          dispatch({ type: "SET_CLUSTER", payload: cluster }),
        setMode: (mode: DropMode) =>
          dispatch({ type: "SET_MODE", payload: mode }),
        setTokenAddress: (tokenAddress: string) =>
          dispatch({ type: "SET_TOKEN_ADDRESS", payload: tokenAddress }),
        setDropAccounts: (dropAccounts: DropAccount[]) =>
          dispatch({ type: "SET_DROP_ACCOUNT", payload: dropAccounts }),
        tokens: tokens,

        createAccount,
        restoreAccount,
        refreshBalance,
        drop,
      }}
    >
      <Layout>
        <Component {...pageProps} />
      </Layout>
      <Notification ref={notificationRef} />
    </GlobalContext.Provider>
  );
}
export default MyApp;
