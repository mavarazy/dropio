import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useGlobalState } from "../../context";
import { TokenLogo } from "../token-logo";

export function TokenAccountPanel() {
  const { tokens, accountBalance } = useGlobalState();

  console.log(accountBalance.tokens);

  return (
    <>
      <ul
        role="list"
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {accountBalance.tokens.map((token) => {
          const info = tokens.find((t) => t.address === token.address);

          return (
            <li
              key={token.address}
              className="col-span-1 bg-white rounded-lg shadow divide-y divide-gray-200"
            >
              <div className="w-full flex items-center justify-between p-6 space-x-6">
                <div className="flex-1 truncate">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-gray-900 text-sm font-medium truncate">
                      {info?.name ?? token.address}
                    </h3>
                  </div>
                  <p className="font-semibold text-indigo-600 text-2xl truncate">
                    {Number(token.amount) / LAMPORTS_PER_SOL}
                  </p>
                </div>
                <TokenLogo
                  logoURI={info?.logoURI}
                  size={40}
                  className="bg-gray-200 rounded-full flex-shrink-0 h-10 w-10"
                />
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}
