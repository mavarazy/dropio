import React, { useEffect, useMemo, useRef, useState } from "react";
import { Cluster } from "@solana/web3.js";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import { DropAccount, DropMode, FakeToken, GlobalContext } from "../context";
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
import { MintService } from "../utils/mint-service";

function MyApp({ Component, pageProps }: AppProps) {
  const notificationRef = useRef<NotificationProps>(null);

  const [cluster, setCluster] = useState<Cluster>("devnet");

  const [mode, setMode] = useState<DropMode>("SOL");

  const [token, setToken] = useState<TokenInfo>(FakeToken);
  const [tokens, setTokens] = useState<TokenInfo[]>([FakeToken]);

  const [accountInfo, setAccountInfo] = useState<AccountInfo | null>(null);

  const [accountId, setAccountId] = useState<string | null>(null);

  const [balance, setBalance] = useState<number>(0);
  const [dropAccounts, setDropAccounts] = useState<DropAccount[]>([]);
  const [beforeMap, setBeforeMap] = useState<{ [key in string]: number }>({});
  const [afterMap, setAfterMap] = useState<{ [key in string]: number }>({});

  const router = useRouter();

  const tokenCatalogue = useMemo(() => new TokenListProvider().resolve(), []);

  useEffect(() => {
    tokenCatalogue.then((tokens) => {
      const clusterTokens = tokens.filterByClusterSlug(cluster).getList();
      clusterTokens.sort((a, b) => a.name.localeCompare(b.name));
      if (clusterTokens.length > 0) {
        setToken(clusterTokens[0]);
        setTokens(clusterTokens);
      }
    });

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

  const drop = async () => {
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

  const mineDev = async () => {
    if (accountInfo?.account) {
      const balance = await MintService.mintDev(cluster, accountInfo?.account);
      return balance;
    }
    return 0;
  };

  return (
    <GlobalContext.Provider
      value={{
        cluster,
        setCluster,
        mode,
        setMode,
        token,
        setToken,
        tokens: tokens,
        accountInfo,
        accountId,
        setAccountId,
        createAccount,
        balance,
        refreshBalance,
        dropAccounts,
        restoreAccount,
        dropDev: airdrop,
        mineDev,
        setDropAccounts: onDropAccountSet,
        beforeMap,
        afterMap,
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
