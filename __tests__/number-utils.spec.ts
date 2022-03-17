import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { NumberUtils } from "../utils/number-utils";

describe("Parsing numbers", () => {
  it("should parse integer number", () => {
    expect(NumberUtils.parseLamport("1")).toEqual(BigInt(LAMPORTS_PER_SOL));
    expect(NumberUtils.parseLamport("10")).toEqual(
      BigInt(10 * LAMPORTS_PER_SOL)
    );
    expect(NumberUtils.parseLamport("102")).toEqual(
      BigInt(102 * LAMPORTS_PER_SOL)
    );
  });

  it("should parse float numbers", () => {
    expect(NumberUtils.parseLamport("0.1")).toEqual(BigInt(100_000_000));
    expect(NumberUtils.parseLamport("0.12342")).toEqual(BigInt(123_420_000));
    expect(NumberUtils.parseLamport("0.232343535354")).toEqual(
      BigInt(232_343_535)
    );
  });
});
