import {
  createMint,
  getMint,
  getOrCreateAssociatedTokenAccount,
  Mint,
  mintTo,
} from "@solana/spl-token";
import {
  Cluster,
  clusterApiUrl,
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";

const mint = async (cluster: Cluster, account: Keypair): Promise<Mint> => {
  const payer = account;
  const mintAuthority = account;
  const freezeAuthority = account;

  const connection = new Connection(clusterApiUrl(cluster), "confirmed");

  const mint = await createMint(
    connection,
    payer,
    mintAuthority.publicKey,
    freezeAuthority.publicKey,
    9
  );

  const tokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    payer,
    mint,
    payer.publicKey
  );

  await mintTo(
    connection,
    payer,
    mint,
    tokenAccount.address,
    mintAuthority,
    100 * LAMPORTS_PER_SOL
  );

  return getMint(connection, mint);
};

const drop = async (
  cluster: Cluster,
  account: Keypair | null
): Promise<void> => {
  // This line ensures the function returns before running if no account has been set
  if (!account || cluster !== "devnet") return;

  try {
    const connection = new Connection(clusterApiUrl(cluster), "confirmed");
    const publicKey = account.publicKey;
    const airdropSignature = await connection.requestAirdrop(
      publicKey,
      LAMPORTS_PER_SOL
    );
    await connection.confirmTransaction(airdropSignature, "confirmed");
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown Error";
    throw new Error(`Airdrop failed: ${errorMessage}`);
  }
};

export const DevService = { mint, drop };
