import {
  AccountLayout,
  createTransferCheckedInstruction,
  getMint,
  getOrCreateAssociatedTokenAccount,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { TokenInfo } from "@solana/spl-token-registry";
import {
  Cluster,
  clusterApiUrl,
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  sendAndConfirmTransaction,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import {
  WalletBallance,
  DropAccount,
  TokenAccount,
  DropMode,
  DropAccountBalance,
  PopulatedDropAccount,
} from "../context";

const getTokens = async (
  cluster: Cluster,
  accountId: string
): Promise<TokenAccount[]> => {
  const connection = new Connection(clusterApiUrl(cluster), "confirmed");

  const tokenAccounts = await connection.getTokenAccountsByOwner(
    new PublicKey(accountId),
    {
      programId: TOKEN_PROGRAM_ID,
    }
  );

  return tokenAccounts.value.reduce(
    (agg: Promise<TokenAccount[]>, accountBuffer) => {
      const accountInfo = AccountLayout.decode(accountBuffer.account.data);

      return agg.then(async (accounts: TokenAccount[]) => {
        const mint = await getMint(connection, accountInfo.mint);

        const token: TokenInfo = {
          chainId: -1,
          address: mint.address.toString(),
          name: mint.address.toString(),
          decimals: mint.decimals,
          symbol: "string;",
        };

        const account: TokenAccount = {
          token,
          amount: accountInfo.amount,
        };

        return accounts.concat(account);
      });
    },
    Promise.resolve([])
  );
};

const getSolBalance = async (
  cluster: Cluster,
  accountId: string
): Promise<bigint> => {
  try {
    const connection = new Connection(clusterApiUrl(cluster), "confirmed");
    const publicKey = new PublicKey(accountId);
    const balance = await connection.getBalance(publicKey);

    return BigInt(balance);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown Error";

    throw new Error(`Balance refresh failed: ${errorMessage}`);
  }
};

const getTokenBalance = async (
  cluster: Cluster,
  dropAccount: DropAccount,
  tokenAddress: string
): Promise<DropAccountBalance | "missing"> => {
  try {
    const connection = new Connection(clusterApiUrl(cluster), "confirmed");
    const mint = new PublicKey(tokenAddress);

    const tokenAccount = await connection.getTokenAccountsByOwner(
      new PublicKey(dropAccount.wallet),
      {
        mint,
      }
    );

    if (tokenAccount.value.length === 0) {
      return "missing";
    }

    const address = tokenAccount.value[0].pubkey.toString();
    const accountInfo = AccountLayout.decode(
      tokenAccount.value[0].account.data
    );

    return {
      ...dropAccount,
      address,
      amount: accountInfo.amount,
    };
  } catch (error) {
    return "missing";
  }
};

const getWalletBalance = async (
  cluster: Cluster,
  accountId: string
): Promise<WalletBallance> => {
  const sol = getSolBalance(cluster, accountId);
  const tokens = getTokens(cluster, accountId);
  return Promise.all([sol, tokens]).then(([sol, tokens]) => ({
    id: accountId,
    sol,
    tokens,
  }));
};

const getDropAccountBalance = async (
  cluster: Cluster,
  dropAccount: DropAccount,
  mode: DropMode,
  tokenAddress: string
): Promise<DropAccountBalance | "missing"> => {
  if (mode === "SOL") {
    return getSolBalance(cluster, dropAccount.wallet).then((amount) => ({
      ...dropAccount,
      address: dropAccount.wallet,
      amount,
    }));
  }
  return getTokenBalance(cluster, dropAccount, tokenAddress);
};

const dropSol = async (
  cluster: Cluster,
  account: Keypair,
  dropAccounts: DropAccount[]
) => {
  const connection = new Connection(clusterApiUrl(cluster), "confirmed");

  const transaction = new Transaction();
  dropAccounts.forEach(({ wallet: accountId, drop }) => {
    transaction.add(
      SystemProgram.transfer({
        fromPubkey: account.publicKey,
        toPubkey: new PublicKey(accountId),
        lamports: Number(drop),
      })
    );
  });

  const signers = [
    {
      publicKey: account.publicKey,
      secretKey: account.secretKey,
    },
  ];

  return await sendAndConfirmTransaction(connection, transaction, signers);
};

const dropTokens = async (
  cluster: Cluster,
  wallet: Keypair,
  tokenAddress: string,
  accounts: PopulatedDropAccount[]
) => {
  const connection = new Connection(clusterApiUrl(cluster), "confirmed");
  const mint = new PublicKey(tokenAddress);

  const mintAccount = await getMint(connection, mint);

  const tokenDropAccounts: DropAccountBalance[] = await accounts.reduce(
    (agg: Promise<DropAccountBalance[]>, account: PopulatedDropAccount) => {
      return agg.then(async (accounts: DropAccountBalance[]) => {
        if (account.before && account.before !== "missing") {
          const dropTokenAccount: DropAccountBalance = {
            ...account,
            address: account.before.address,
            amount: account.drop,
          };
          return accounts.concat(dropTokenAccount);
        } else {
          const toTokenAccount = await getOrCreateAssociatedTokenAccount(
            connection,
            wallet,
            mint,
            new PublicKey(account.wallet)
          );

          const dropTokenAccount: DropAccountBalance = {
            ...account,
            address: toTokenAccount.address.toString(),
            amount: account.drop,
          };

          return accounts.concat(dropTokenAccount);
        }
      });
    },
    Promise.resolve([])
  );

  const transaction = new Transaction({
    feePayer: wallet.publicKey,
  });

  const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    wallet,
    mint,
    wallet.publicKey
  );

  tokenDropAccounts.forEach((tokenDropAccount) => {
    const transferInstruction = createTransferCheckedInstruction(
      fromTokenAccount.address,
      mint,
      new PublicKey(tokenDropAccount.address),
      wallet.publicKey,
      tokenDropAccount.drop / BigInt(Math.pow(10, 9 - mintAccount.decimals)),
      mintAccount.decimals
    );
    transaction.add(transferInstruction);
  });

  const signers = [
    {
      publicKey: wallet.publicKey,
      secretKey: wallet.secretKey,
    },
  ];

  return await sendAndConfirmTransaction(connection, transaction, signers);
};

const drop = async (
  cluster: Cluster,
  account: Keypair,
  dropAccounts: PopulatedDropAccount[],
  mode: DropMode,
  tokenAddress: string
): Promise<string> => {
  if (mode === "SOL") {
    return dropSol(cluster, account, dropAccounts);
  }

  return dropTokens(cluster, account, tokenAddress, dropAccounts);
};

export const BalanceService = {
  getWalletBalance,
  getDropAccountBalance,
  drop,
};
