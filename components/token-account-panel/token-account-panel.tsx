import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useGlobalState } from "../../context";
import { classNames } from "../../utils/class-names";
import { TokenLogo } from "../token-logo";

export function TokenAccountPanel() {
  const {
    tokens,
    state: { mode, tokenAddress, balance },
    setTokenAddress,
  } = useGlobalState();

  return (
    <>
      <ul
        role="list"
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {balance.tokens.map((token) => {
          const info = tokens.find((t) => t.address === token.address);
          const active = mode === "Token" && tokenAddress === token.address;

          return (
            <li
              key={token.address}
              className={classNames(
                active
                  ? "bg-indigo-500 hover:bg-indigo-600"
                  : "bg-white hover:bg-gray-50",
                "col-span-1 rounded-lg shadow divide-y divide-gray-200 cursor-pointer "
              )}
              onClick={() => setTokenAddress(token.address)}
            >
              <div className="w-full flex items-center justify-between p-6 space-x-6">
                <div className="flex-1 truncate">
                  <div className="flex items-center space-x-3">
                    <h3
                      className={classNames(
                        active ? "text-white" : "text-gray-900",
                        "text-sm font-medium truncate"
                      )}
                    >
                      {info?.name ?? token.address}
                    </h3>
                  </div>
                  <p
                    className={classNames(
                      active ? "text-white" : "text-indigo-600",
                      "font-semibold text-2xl truncate"
                    )}
                  >
                    {Number(token.amount) / LAMPORTS_PER_SOL}
                  </p>
                </div>
                <TokenLogo
                  logoURI={info?.logoURI}
                  size={40}
                  className="bg-white rounded-full flex-shrink-0 h-12 w-12"
                />
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}
