import React, { useEffect, useRef, useState } from "react";
import { Cluster } from "@solana/web3.js";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import { DropAccount, GlobalContext } from "../context";
import { Layout } from "../components/layout";
import { Notification, NotificationProps } from "../components/notification";
import { useRouter } from "next/router";
import {
  AccountService,
  AccountInfo,
  AccountRestoreForm,
} from "../utils/account-service";
import { BalanceService } from "../utils/balance-service";

function MyApp({ Component, pageProps }: AppProps) {
  const notificationRef = useRef<NotificationProps>(null);

  const [cluster, setCluster] = useState<Cluster>("devnet");
  const [accountInfo, setAccountInfo] = useState<AccountInfo | null>(null);

  const [accountId, setAccountId] = useState<string | null>(null);

  const [balance, setBalance] = useState<number>(0);
  const [dropAccounts, setDropAccounts] = useState<DropAccount[]>([]);
  const [beforeMap, setBeforeMap] = useState<{ [key in string]: number }>({});
  const [afterMap, setAfterMap] = useState<{ [key in string]: number }>({});

  const router = useRouter();

  useEffect(() => {
    setBeforeMap({});
    setAfterMap({});
    dropAccounts.reduce(async (agg, { wallet: accountId }) => {
      const balanceMap = await agg;
      const balance = await BalanceService.getBalance(cluster, accountId);
      setBeforeMap({ ...balanceMap, [accountId]: balance });

      return { ...balanceMap, [accountId]: balance };
    }, Promise.resolve({}));
  }, [cluster]);

  const onDropAccountSet = (accounts: DropAccount[]) => {
    setDropAccounts(accounts);

    accounts.reduce(async (agg, { wallet: accountId }) => {
      const balanceMap = await agg;
      const balance = await BalanceService.getBalance(cluster, accountId);
      setBeforeMap({ ...balanceMap, [accountId]: balance });

      return { ...balanceMap, [accountId]: balance };
    }, Promise.resolve({}));
  };

  const onDrop = async () => {
    if (!accountInfo) {
      return "";
    }
    const signature = await BalanceService.drop(
      cluster,
      accountInfo.account,
      dropAccounts
    );

    refreshBalance();

    dropAccounts.reduce(async (agg, { wallet: accountId }) => {
      const balanceMap = await agg;
      const balance = await BalanceService.getBalance(cluster, accountId);
      setAfterMap({ ...balanceMap, [accountId]: balance });

      return { ...balanceMap, [accountId]: balance };
    }, Promise.resolve({}));
    return signature;
  };

  const createAccount = async () => {
    const accountInfo = await AccountService.create();

    setAccountInfo(accountInfo);
    setAccountId(accountId);

    router.push(`/drop/${accountInfo.account.publicKey.toString()}`);
    return accountInfo;
  };

  const refreshBalance = async () => {
    if (accountId) {
      const balance = await BalanceService.getBalance(cluster, accountId);
      setBalance(balance);
      return balance;
    }
    return 0;
  };

  const restoreAccount = async (form: AccountRestoreForm) => {
    const accountInfo = await AccountService.restore(form);
    setAccountInfo(accountInfo);

    refreshBalance();

    router.push(`/drop/${accountInfo.account.publicKey.toString()}`);

    return accountInfo;
  };

  const airdrop = async () => {
    if (accountInfo?.account) {
      const balance = await BalanceService.dropDev(
        cluster,
        accountInfo?.account
      );
      setBalance(balance);
      return balance;
    }
    return 0;
  };

  return (
    <GlobalContext.Provider
      value={{
        cluster,
        setCluster,
        accountInfo,
        accountId,
        setAccountId,
        createAccount,
        balance,
        refreshBalance,
        dropAccounts,
        restoreAccount,
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
