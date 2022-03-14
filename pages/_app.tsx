import React, { useEffect, useRef, useState } from "react";
import { Cluster, Keypair } from "@solana/web3.js";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import { DropAccount, GlobalContext } from "../context";
import { Layout } from "../components/layout";
import {
  createAccount,
  drop,
  dropDev,
  getBalance,
  refreshBalance,
} from "../utils";
import { Notification, NotificationProps } from "../components/notification";

function MyApp({ Component, pageProps }: AppProps) {
  const notificationRef = useRef<NotificationProps>(null);

  function withNotification<A, T>(f: (a: A) => Promise<T>) {
    return async (a: A) => {
      try {
        return await f(a);
      } catch (err) {
        // @ts-ignore
        notificationRef.current?.error(err.message ?? "Internal error");
        return Promise.reject(err);
      }
    };
  }

  const [network, setNetwork] = useState<Cluster>("devnet");
  const [account, setAccount] = useState<Keypair | null>(null);
  const [mnemonic, setMnemonic] = useState<string | null>(null);
  const [balance, setBalance] = useState<number>(0);
  const [dropAccounts, setDropAccounts] = useState<DropAccount[]>([]);
  const [beforeMap, setBeforeMap] = useState<{ [key in string]: number }>({});
  const [afterMap, setAfterMap] = useState<{ [key in string]: number }>({});

  useEffect(() => {
    setBeforeMap({});
    dropAccounts.reduce(async (agg, { accountId }) => {
      const balanceMap = await agg;
      const balance = await getBalance(network, accountId);
      setBeforeMap({ ...balanceMap, [accountId]: balance });

      return { ...balanceMap, [accountId]: balance };
    }, Promise.resolve({}));
  }, [network]);

  const onDropAccountSet = (accounts: DropAccount[]) => {
    setDropAccounts(accounts);

    accounts.reduce(async (agg, { accountId }) => {
      const balanceMap = await agg;
      const balance = await getBalance(network, accountId);
      setBeforeMap({ ...balanceMap, [accountId]: balance });

      return { ...balanceMap, [accountId]: balance };
    }, Promise.resolve({}));
  };

  const onDrop = withNotification(async () => {
    if (!account) {
      return "";
    }
    const signature = await drop(network, account, dropAccounts);

    dropAccounts.reduce(async (agg, { accountId }) => {
      const balanceMap = await agg;
      const balance = await getBalance(network, accountId);
      setAfterMap({ ...balanceMap, [accountId]: balance });

      return { ...balanceMap, [accountId]: balance };
    }, Promise.resolve({}));
    return signature;
  });

  const createNewAccount = withNotification(async () => {
    const { account, mnemonic } = await createAccount();
    setAccount(account);
    setMnemonic(mnemonic);
    return account;
  });

  const doRefreshBalance = withNotification(async () => {
    const balance = await refreshBalance(network, account);
    setBalance(balance);
    return balance;
  });

  const airdrop = withNotification(async () => {
    const balance = await dropDev(network, account);
    setBalance(balance);
    return balance;
  });

  return (
    <GlobalContext.Provider
      value={{
        network,
        setNetwork,
        account,
        mnemonic,
        createAccount: createNewAccount,
        balance,
        refreshBalance: doRefreshBalance,
        dropAccounts,
        dropDev: airdrop,
        setDropAccounts: onDropAccountSet,
        beforeMap,
        afterMap,
        drop: onDrop,
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
