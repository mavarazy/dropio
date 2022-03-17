import { faRaindrops, faSync } from "@fortawesome/pro-light-svg-icons";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useGlobalState } from "../../context";
import { TokenUtils } from "../../utils/token-utils";
import { Button } from "../button";

export const SendPanel = () => {
  const {
    state: { balance, mode, token, dropAccounts },
    accountInfo,
    drop,
    refreshBalance,
  } = useGlobalState();

  const humanSol = balance.sol / LAMPORTS_PER_SOL;

  const availableAmount =
    mode === "SOL"
      ? humanSol
      : TokenUtils.getHumanAmount(
          balance.tokens.find((t) => t.token.address === token.address)
            ?.amount ?? 0,
          mode,
          token
        );

  const dropAmount = dropAccounts.reduce(
    (agg, { drop: amount }) => agg + amount,
    0
  );

  return (
    <dl className="mt-5 grid grid-cols-1 rounded-lg bg-white overflow-hidden border divide-y divide-gray-200 md:grid-cols-3 md:divide-y-0 md:divide-x">
      <div className="px-4 py-5 sm:p-6">
        <dt className="text-base font-normal text-gray-900">SOL</dt>
        <dd className="mt-1 flex justify-between items-baseline md:block lg:flex">
          <div className="flex items-baseline text-2xl font-semibold text-indigo-600">
            {humanSol}
          </div>
          <div className="flex space-x-1">
            <Button icon={faSync} onClick={() => refreshBalance()} />
          </div>
        </dd>
      </div>
      <div className="px-4 py-5 sm:p-6">
        <dt className="text-base font-normal text-gray-900 flex">
          <span className="flex flex-1">Drop Amount</span>{" "}
          <span className="bg-green-500 text-white rounded-full px-3">
            {mode === "SOL" ? "SOL" : token.name.substring(0, 10)}
          </span>
        </dt>
        <dd className="mt-1 flex justify-between items-baseline md:block lg:flex">
          <div className="flex flex-1 items-baseline text-2xl font-semibold text-indigo-600">
            <span className="flex flex-1">{dropAmount}</span>
            <span className="text-xl px-3">{availableAmount}</span>
          </div>
        </dd>
      </div>

      <div className="px-4 py-5 sm:p-6">
        <dt className="text-base font-normal text-gray-900">Send</dt>
        <dd className="mt-1 flex items-baseline md:block lg:flex">
          {availableAmount > dropAmount && dropAmount > 0 && accountInfo ? (
            <Button icon={faRaindrops} text="Drop" onClick={drop} />
          ) : (
            <div className="flex items-baseline text-2xl font-semibold">
              {dropAmount === 0 ? (
                <span className="text-green-600">All good</span>
              ) : dropAmount > availableAmount ? (
                <span className="text-red-600">
                  {(dropAmount - availableAmount).toPrecision(5)}
                </span>
              ) : (
                <span className="text-red-600">Need your mnemonic</span>
              )}
            </div>
          )}
        </dd>
      </div>
    </dl>
  );
};
