import React, { useEffect, useMemo, useReducer, useRef, useState } from "react";
import { Cluster } from "@solana/web3.js";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import {
  WalletBallance,
  DropAccount,
  DropMode,
  DefaultToken,
  GlobalContext,
  AppState,
  DropAccountBalance,
  TransactionFee,
  AccountCreationFee,
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
      type: "SET_TOKEN";
      payload: TokenInfo;
    }
  | {
      type: "SET_OFFICIAL_TOKENS";
      payload: TokenInfo[];
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
  switch (action.type) {
    case "SET_DROP_ACCOUNT":
      return {
        ...state,
        fee:
          TransactionFee + AccountCreationFee * BigInt(action.payload.length),
        dropAccounts: action.payload,
        dropPopulatedAccounts: action.payload,
      };
    case "SET_CLUSTER":
      return {
        ...state,
        mode: "SOL",
        token: DefaultToken,
        cluster: action.payload,
        balance: {
          id: state.balance.id,
          sol: BigInt(0),
          tokens: [],
        },
        dropPopulatedAccounts: state.dropAccounts,
      };
    case "SET_OFFICIAL_TOKENS": {
      return {
        ...state,
        token: action.payload[0],
        officialTokens: action.payload,
      };
    }
    case "SET_TOKEN": {
      return {
        ...state,
        mode: "Token",
        token: action.payload,
        dropPopulatedAccounts: state.dropAccounts,
      };
    }
    case "SET_MODE": {
      return {
        ...state,
        mode: action.payload,
        token: state.officialTokens[0], // Set to SOL token to keep decimals working
        dropPopulatedAccounts: state.dropAccounts,
      };
    }
    case "SET_DROP_ACCOUNT_BEFORE": {
      const updatedPopulatedAccounts = state.dropPopulatedAccounts.map((drop) =>
        drop.wallet === action.payload.wallet
          ? { ...drop, before: action.payload.balance }
          : drop
      );
      const numDropAccountsWithAddress = updatedPopulatedAccounts.reduce(
        (agg, account) =>
          agg + (account.before && account.before !== "missing" ? 0 : 1),
        0
      );
      return {
        ...state,
        fee:
          TransactionFee +
          AccountCreationFee * BigInt(numDropAccountsWithAddress),
        dropPopulatedAccounts: updatedPopulatedAccounts,
      };
    }
    case "SET_DROP_ACCOUNT_AFTER": {
      const updatedPopulatedAccounts = state.dropPopulatedAccounts.map((drop) =>
        drop.wallet === action.payload.wallet
          ? { ...drop, after: action.payload }
          : drop
      );
      const numDropAccountsWithAddress = updatedPopulatedAccounts.reduce(
        (agg, account) => agg + (account.after ? 0 : 1),
        0
      );
      return {
        ...state,
        fee:
          TransactionFee +
          AccountCreationFee * BigInt(numDropAccountsWithAddress),
        dropPopulatedAccounts: updatedPopulatedAccounts,
      };
    }
    case "SET_BALANCE": {
      const balance = {
        ...action.payload,
        tokens: action.payload.tokens.map((tokenAccount) => {
          const officialToken = state.officialTokens.find(
            (token) => token.address === tokenAccount.token.address
          );
          return officialToken
            ? {
                token: officialToken,
                amount: tokenAccount.amount,
              }
            : tokenAccount;
        }),
      };

      return {
        ...state,
        balance,
      };
    }
    case "SET_WALLET": {
      return {
        ...state,
        balance: {
          id: action.payload,
          sol: BigInt(0),
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
    token: DefaultToken,
    officialTokens: [],
    balance: {
      id: "CQD3KBgZ8r4TrS2LbU2fEHJm7gf8csQv4LJd2XypntvH",
      sol: BigInt(0),
      tokens: [],
    },
    fee: BigInt(0),
    dropAccounts: [],
    dropPopulatedAccounts: [],
  });

  const [accountInfo, setAccountInfo] = useState<AccountInfo | null>(null);

  const router = useRouter();

  const tokenCatalogue = useMemo(() => new TokenListProvider().resolve(), []);

  useEffect(() => {
    const timeout = setTimeout(() => refreshBalance(), 1000);
    return () => clearTimeout(timeout);
  }, [state.balance.id, state.cluster]);

  useEffect(() => {
    state.dropAccounts.forEach(async (dropAccount) => {
      try {
        const balance = await BalanceService.getDropAccountBalance(
          state.cluster,
          dropAccount,
          state.mode,
          state.token.address
        );

        dispatch({
          type: "SET_DROP_ACCOUNT_BEFORE",
          payload: {
            wallet: dropAccount.wallet,
            balance,
          },
        });
      } catch (error) {
        notificationRef.current?.error(error);
      }
    });
  }, [
    accountInfo,
    state.cluster,
    state.dropAccounts,
    state.mode,
    state.token.address,
  ]);

  useEffect(() => {
    tokenCatalogue.then((tokens) => {
      const officialTokens = tokens
        .filterByClusterSlug(state.cluster)
        .getList()
        .filter((token) => token.decimals > 0);

      officialTokens.sort((a, b) => a.name.localeCompare(b.name));
      dispatch({ type: "SET_OFFICIAL_TOKENS", payload: officialTokens });
    });
  }, [state.cluster, tokenCatalogue]);

  const drop = async () => {
    if (!accountInfo) {
      return;
    }

    try {
      await BalanceService.drop(
        state.cluster,
        accountInfo.account,
        state.dropPopulatedAccounts,
        state.mode,
        state.token.address
      );

      refreshBalance();

      state.dropAccounts.forEach(async (account) => {
        if (accountInfo) {
          const balance = await BalanceService.getDropAccountBalance(
            state.cluster,
            account,
            state.mode,
            state.token.address
          );

          if (balance !== "missing") {
            dispatch({
              type: "SET_DROP_ACCOUNT_AFTER",
              payload: balance,
            });
          }
        }
      });
    } catch (error) {
      notificationRef.current?.error(error);
    }
  };

  const createAccount = async () => {
    try {
      const accountInfo = await AccountService.create();

      setAccountInfo(accountInfo);

      router.push(`/drop/${accountInfo.account.publicKey.toString()}`);
    } catch (error) {
      notificationRef.current?.error(error);
    }
  };

  const refreshBalance = async () => {
    try {
      const balance = await BalanceService.getWalletBalance(
        state.cluster,
        state.balance.id
      );
      dispatch({ type: "SET_BALANCE", payload: balance });
    } catch (error) {
      notificationRef.current?.error(error);
    }
  };

  const restoreAccount = async (form: AccountRestoreForm) => {
    try {
      const accountInfo = await AccountService.restore(form);
      setAccountInfo(accountInfo);

      router.push(`/drop/${accountInfo.account.publicKey.toString()}`);
    } catch (error) {
      notificationRef.current?.error(error);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => refreshBalance(), 1000);
    return () => clearTimeout(timeout);
  }, [state.balance.id, state.cluster]);

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
        setToken: (token: TokenInfo) =>
          dispatch({ type: "SET_TOKEN", payload: token }),
        setDropAccounts: (dropAccounts: DropAccount[]) =>
          dispatch({ type: "SET_DROP_ACCOUNT", payload: dropAccounts }),

        onError: (error) => notificationRef.current?.error(error),
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
