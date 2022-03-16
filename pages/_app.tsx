import React, { useEffect, useMemo, useRef, useState } from "react";
import { Cluster } from "@solana/web3.js";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import {
  WalletBallance,
  DropAccount,
  DropMode,
  FakeToken,
  GlobalContext,
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
import { MintService } from "../utils/mint-service";

function MyApp({ Component, pageProps }: AppProps) {
  const notificationRef = useRef<NotificationProps>(null);
  const [cluster, setCluster] = useState<Cluster>("devnet");
  const [mode, setMode] = useState<DropMode>("SOL");

  const [tokenAddress, setTokenAddress] = useState<string>("Token");
  const [tokens, setTokens] = useState<TokenInfo[]>([FakeToken]);
  const [accountInfo, setAccountInfo] = useState<AccountInfo | null>(null);

  const [wallet, setWallet] = useState<WalletBallance>({
    id: "...loading...",
    sol: 0,
    tokens: [],
  });

  const [dropAccounts, setDropAccounts] = useState<DropAccount[]>([]);
  const [beforeMap, setBeforeMap] = useState<{
    [key in string]: WalletBallance;
  }>({});
  const [afterMap, setAfterMap] = useState<{ [key in string]: WalletBallance }>(
    {}
  );

  const router = useRouter();

  const tokenCatalogue = useMemo(() => new TokenListProvider().resolve(), []);

  useEffect(() => {
    tokenCatalogue.then((tokens) => {
      const clusterTokens = tokens
        .filterByClusterSlug(cluster)
        .getList()
        .filter((token) => token.decimals > 0);

      clusterTokens.sort((a, b) => a.name.localeCompare(b.name));
      if (clusterTokens.length > 0) {
        setTokenAddress(clusterTokens[0].address);
        setTokens(clusterTokens);
      }
    });

    setBeforeMap({});
    setAfterMap({});

    dropAccounts.reduce(async (agg, { wallet }) => {
      const balanceMap = await agg;
      const balance = await BalanceService.getWalletBalance(cluster, wallet);
      setBeforeMap({ ...balanceMap, [wallet]: balance });

      return { ...balanceMap, [wallet]: balance };
    }, Promise.resolve({}));
  }, [cluster]);

  const onDropAccountSet = (accounts: DropAccount[]) => {
    setDropAccounts(accounts);

    accounts.reduce(async (agg, { wallet }) => {
      const balanceMap = await agg;
      const balance = await BalanceService.getWalletBalance(cluster, wallet);
      setBeforeMap({ ...balanceMap, [wallet]: balance });

      return { ...balanceMap, [wallet]: balance };
    }, Promise.resolve({}));
  };

  const drop = async () => {
    if (!accountInfo) {
      return "";
    }

    const signature = await BalanceService.drop(
      cluster,
      accountInfo.account,
      dropAccounts,
      mode,
      tokenAddress
    );

    refreshBalance();

    dropAccounts.reduce(async (agg, { wallet }) => {
      const balanceMap = await agg;
      const balance = await BalanceService.getWalletBalance(cluster, wallet);
      setAfterMap({ ...balanceMap, [wallet]: balance });

      return { ...balanceMap, [wallet]: balance };
    }, Promise.resolve({}));
    return signature;
  };

  const createAccount = async () => {
    const accountInfo = await AccountService.create();

    setAccountInfo(accountInfo);
    setWallet({
      id: wallet.id,
      sol: 0,
      tokens: [],
    });

    router.push(`/drop/${accountInfo.account.publicKey.toString()}`);
    return accountInfo;
  };

  const refreshBalance = async () => {
    if (wallet.id) {
      const balance = await BalanceService.getWalletBalance(cluster, wallet.id);
      setWallet(balance);
    }
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
      refreshBalance();
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

  const doSetWalletId = async (accountId: string) => {
    setWallet({
      id: accountId,
      sol: 0,
      tokens: [],
    });
    const balance = await BalanceService.getWalletBalance(cluster, accountId);
    setWallet(balance);
  };

  console.log("Rendering");

  return (
    <GlobalContext.Provider
      value={{
        accountInfo,
        setWalletId: doSetWalletId,
        balance: wallet,
        cluster,
        setCluster,
        mode,
        setMode,
        tokenAddress,
        setTokenAddress,
        tokens: tokens,
        createAccount,
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
