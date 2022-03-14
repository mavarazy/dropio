import React, { useEffect, useRef, useState } from "react";
import { Cluster, Keypair } from "@solana/web3.js";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import { DropAccount, GlobalContext } from "../context";
import { Layout } from "../components/layout";
import { createAccount, drop, dropDev, getBalance } from "../utils";
import { Notification, NotificationProps } from "../components/notification";
import { useRouter } from "next/router";

function MyApp({ Component, pageProps }: AppProps) {
  const notificationRef = useRef<NotificationProps>(null);

  const [network, setNetwork] = useState<Cluster>("devnet");
  const [account, setAccount] = useState<Keypair | null>(null);

  const [accountId, setAccountId] = useState<string | null>(null);

  const [mnemonic, setMnemonic] = useState<string | null>(null);
  const [balance, setBalance] = useState<number>(0);
  const [dropAccounts, setDropAccounts] = useState<DropAccount[]>([]);
  const [beforeMap, setBeforeMap] = useState<{ [key in string]: number }>({});
  const [afterMap, setAfterMap] = useState<{ [key in string]: number }>({});

  const router = useRouter();

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

  const onDrop = async () => {
    if (!account) {
      return "";
    }
    const signature = await drop(network, account, dropAccounts);

    doRefreshBalance();

    dropAccounts.reduce(async (agg, { accountId }) => {
      const balanceMap = await agg;
      const balance = await getBalance(network, accountId);
      setAfterMap({ ...balanceMap, [accountId]: balance });

      return { ...balanceMap, [accountId]: balance };
    }, Promise.resolve({}));
    return signature;
  };

  const createNewAccount = async () => {
    const { account, mnemonic } = await createAccount();
    setAccount(account);
    setAccountId(accountId);
    setMnemonic(mnemonic);

    router.push(`/drop/${account.publicKey.toString()}`);

    return account;
  };

  const doRefreshBalance = async () => {
    if (accountId) {
      const balance = await getBalance(network, accountId);
      setBalance(balance);
      return balance;
    }
    return 0;
  };

  const airdrop = async () => {
    const balance = await dropDev(network, account);
    setBalance(balance);
    return balance;
  };

  return (
    <GlobalContext.Provider
      value={{
        network,
        setNetwork,
        account,
        accountId,
        setAccountId,
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
