import { Combobox, Transition } from "@headlessui/react";
import { CheckIcon, SelectorIcon } from "@heroicons/react/outline";
import { TokenInfo } from "@solana/spl-token-registry";
import { Fragment, useMemo, useState } from "react";
import { useThrottle } from "react-use";
import { useGlobalState } from "../../context";
import { matchSorter } from "match-sorter";

function useTokenFilter(clusterTokens: TokenInfo[], term: string) {
  const throttledTerm = useThrottle(term, 200);
  return useMemo(
    () =>
      term.trim() === "" || term.length < 3
        ? clusterTokens
        : matchSorter(clusterTokens, term, {
            keys: [(item) => item.name],
          }),
    [throttledTerm]
  );
}

export const TokenPicker = () => {
  const { cluster, tokens } = useGlobalState();
  const clusterTokens = useMemo(() => {
    const tokenList = tokens
      .filterByClusterSlug(cluster)
      .getList()
      .filter((tokenInfo) => tokenInfo.decimals > 0);
    tokenList.sort((a, b) => a.name.localeCompare(b.name));
    console.log(tokenList.length);
    return tokenList;
  }, [cluster, tokens]);

  const [selected, setSelected] = useState<TokenInfo>(clusterTokens[0]);
  const [query, setQuery] = useState("");

  const filteredTokens = useTokenFilter(clusterTokens, query);

  return (
    <div className="w-72 mx-2">
      <Combobox value={selected} onChange={setSelected}>
        <div className="relative mt-1">
          <div className="relative w-full text-left bg-white rounded-lg shadow-md cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-teal-300 focus-visible:ring-offset-2 sm:text-sm overflow-hidden">
            <Combobox.Input
              className="w-full border-none focus:ring-0 py-2 pl-3 pr-10 text-sm leading-5 text-gray-900"
              displayValue={(token: TokenInfo) => token.name}
              onChange={(event) => setQuery(event.target.value)}
            />
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
              <SelectorIcon
                className="w-5 h-5 text-gray-400"
                aria-hidden="true"
              />
            </Combobox.Button>
          </div>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => setQuery("")}
          >
            <Combobox.Options className="absolute w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {filteredTokens && filteredTokens.length === 0 && query !== "" ? (
                <div className="cursor-default select-none relative py-2 px-4 text-gray-700">
                  Nothing found.
                </div>
              ) : (
                filteredTokens &&
                filteredTokens.map((token) => (
                  <Combobox.Option
                    key={token.address}
                    className={({ active }) =>
                      `cursor-default select-none relative py-2 pl-10 pr-4 ${
                        active ? "text-white bg-teal-600" : "text-gray-900"
                      }`
                    }
                    value={token}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={`block truncate ${
                            selected ? "font-medium" : "font-normal"
                          }`}
                        >
                          {token.name}
                        </span>
                        {selected ? (
                          <span
                            className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                              active ? "text-white" : "text-teal-600"
                            }`}
                          >
                            <CheckIcon className="w-5 h-5" aria-hidden="true" />
                          </span>
                        ) : (
                          <span
                            className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                              active ? "text-white" : "text-teal-600"
                            }`}
                          >
                            {token.logoURI && (
                              <img
                                src={token.logoURI}
                                width={20}
                                height={20}
                                className="rounded-full max-w-5 max-h-5"
                              />
                            )}
                          </span>
                        )}
                      </>
                    )}
                  </Combobox.Option>
                ))
              )}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
    </div>
  );
};
