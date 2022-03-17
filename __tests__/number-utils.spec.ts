import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { render, screen } from "@testing-library/react";
import { NumberUtils } from "../utils/number-utils";

xtest("parsing 0.1", () => {
  expect(NumberUtils.parseLamport("1")).toEqual(LAMPORTS_PER_SOL);
  expect(NumberUtils.parseLamport("10")).toEqual(BigInt(10 * LAMPORTS_PER_SOL));
  expect(NumberUtils.parseLamport("0.1")).toEqual(
    BigInt(LAMPORTS_PER_SOL / 10)
  );
  expect(NumberUtils.parseLamport("0.01")).toEqual(
    BigInt(LAMPORTS_PER_SOL / 100)
  );
  expect(NumberUtils.parseLamport("0.001")).toEqual(
    BigInt(LAMPORTS_PER_SOL / 1000)
  );
  expect(NumberUtils.parseLamport("0.0001")).toEqual(
    BigInt(LAMPORTS_PER_SOL / 10000)
  );
  expect(NumberUtils.parseLamport("0.00001")).toEqual(
    BigInt(LAMPORTS_PER_SOL / 100000)
  );
});
