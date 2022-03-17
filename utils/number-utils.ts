import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import repeat from "lodash.repeat";

const parsePart = (part: string | null) => {
  if (!part) {
    return BigInt(0);
  }
  const lastDigitsOfPart = part.substring(0, 9);
  if (lastDigitsOfPart.length === 9) {
    return BigInt(lastDigitsOfPart);
  } else {
    return BigInt(part + repeat("0", 9 - lastDigitsOfPart.length));
  }
};

const parseLamport = (str: string): bigint => {
  const [full, part] = str.trim().split(".");
  return BigInt(parseInt(full) * LAMPORTS_PER_SOL) + parsePart(part);
};

export const NumberUtils = {
  parseLamport,
};
