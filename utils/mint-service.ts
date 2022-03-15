import {
  createMint,
  getOrCreateAssociatedTokenAccount,
  mintTo,
} from "@solana/spl-token";
import {
  Cluster,
  clusterApiUrl,
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";

const mintDev = async (cluster: Cluster, account: Keypair) => {
  const payer = account;
  const mintAuthority = account;
  const freezeAuthority = account;

  const connection = new Connection(clusterApiUrl(cluster), "confirmed");

  console.log("Creating mint");

  const mint = await createMint(
    connection,
    payer,
    mintAuthority.publicKey,
    freezeAuthority.publicKey,
    9
  );

  console.log("Creating token Account");

  const tokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    payer,
    mint,
    payer.publicKey
  );

  console.log("Minting to Token Account");

  await mintTo(
    connection,
    payer,
    mint,
    tokenAccount.address,
    mintAuthority,
    LAMPORTS_PER_SOL
  );
  console.log(mint.toBase58());

  return LAMPORTS_PER_SOL;
};

export const MintService = { mintDev };
