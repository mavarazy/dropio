import { Keypair } from "@solana/web3.js";
import * as Bip39 from "bip39";

export interface AccountInfo {
  account: Keypair;
  mnemonic: string;
}

const create = async (): Promise<AccountInfo> => {
  const mnemonic = Bip39.generateMnemonic();

  const seed = Bip39.mnemonicToSeedSync(mnemonic).slice(0, 32);
  const account = Keypair.fromSeed(seed);

  return { account, mnemonic };
};

export interface AccountRestoreForm {
  mnemonic: string;
}

const restore = async ({
  mnemonic,
}: AccountRestoreForm): Promise<AccountInfo> => {
  const inputMnemonic = mnemonic.trim().toLowerCase();

  const seed = Bip39.mnemonicToSeedSync(inputMnemonic).slice(0, 32);

  return { mnemonic: inputMnemonic, account: Keypair.fromSeed(seed) };
};

export interface IAccountService {
  create(): Promise<AccountInfo>;
  restore(form: AccountRestoreForm): Promise<AccountInfo>;
}

export const AccountService: IAccountService = {
  create,
  restore,
};
