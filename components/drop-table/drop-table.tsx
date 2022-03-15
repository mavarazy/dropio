import { FileInput } from "./file-input";
import Papa from "papaparse";
import {
  DropAccount,
  DropMode,
  useGlobalState,
  WalletBallance,
} from "../../context";
import { useCallback } from "react";

export default function DropTable() {
  const {
    beforeMap,
    afterMap,
    dropAccounts,
    setDropAccounts,
    mode,
    tokenAddress,
  } = useGlobalState();

  const getBallanceFor = useCallback(
    (
      accountId: string,
      balanceMap: { [key in string]: WalletBallance }
    ): number => {
      if (mode === "SOL") {
        return balanceMap[accountId]?.sol ?? 0;
      }
      return (
        balanceMap[accountId]?.tokens.find(
          (token) => token.address === tokenAddress
        )?.amount ?? 0
      );
    },
    [mode, tokenAddress]
  );

  const handleImport = async (files: FileList) => {
    const file = files.item(0);
    if (file === null) {
      return;
    }

    const source = await file.text();

    const result = Papa.parse(source, {
      header: true,
      transform: (value, field) => {
        return field === "drop" ? parseFloat(value) : value;
      },
    });

    setDropAccounts(result.data as DropAccount[]);
  };

  return (
    <div>
      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg flex space-y-1">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="py-3 pl-4 pr-3 text-left text-xs uppercase font-medium tracking-wide text-gray-500 sm:pl-6"
                    >
                      Wallet
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3 text-left text-xs uppercase font-medium tracking-wide text-gray-500"
                    >
                      Drop
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500"
                    >
                      Before
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500"
                    >
                      After
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {dropAccounts.map((account) => (
                    <tr key={account.wallet}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        {account.wallet}
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500">
                        {account.drop}
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500 bg-gray-50">
                        {getBallanceFor(account.wallet, beforeMap)}
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500 bg-gray-100">
                        {getBallanceFor(account.wallet, afterMap)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-1 justify-end mt-4">
        <FileInput onChange={handleImport} />
      </div>
    </div>
  );
}
