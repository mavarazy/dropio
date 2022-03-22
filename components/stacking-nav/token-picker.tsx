import { Combobox, Transition } from "@headlessui/react";
import { CheckIcon, SelectorIcon } from "@heroicons/react/outline";
import React, { Fragment, useCallback } from "react";
import { useGlobalState } from "../../context";
import { TokenLogo } from "../token-logo";
import { List, ListRowProps } from "react-virtualized";
import truncate from "lodash.truncate";

export const TokenPicker = () => {
  const {
    state: { token, officialTokens },
    setToken,
  } = useGlobalState();

  const renderItem = useCallback(
    (props: ListRowProps) => {
      const token = officialTokens[props.index];
      return (
        <Combobox.Option
          key={token.address}
          className={({ active }) =>
            `cursor-default select-none relative py-2 pl-10 pr-4 ${
              active ? "text-white bg-teal-600" : "text-gray-900"
            }`
          }
          style={props.style}
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
                    <TokenLogo
                      logoURI={token.logoURI}
                      size={20}
                      className="rounded-full max-w-5 max-h-5"
                    />
                  )}
                </span>
              )}
            </>
          )}
        </Combobox.Option>
      );
    },
    [officialTokens]
  );

  return (
    <div className="w-96">
      <Combobox value={token} onChange={setToken}>
        <div className="relative">
          <Combobox.Button className="w-full flex text-left bg-white rounded-lg border sm:text-sm overflow-hidden cursor-pointer">
            <TokenLogo
              logoURI={token?.logoURI}
              className="p-1 rounded-full"
              size={42}
            />
            <span className="flex items-center self-center w-full focus:ring-0 py-2 pl-3 pr-10 text-sm leading-5 text-gray-900">
              {truncate(token?.name ?? token?.address, { length: 30 })}
            </span>
            <span className="self-center inset-y-0 right-0 flex items-center pr-2">
              <SelectorIcon
                className="w-5 h-5 text-gray-400"
                aria-hidden="true"
              />
            </span>
          </Combobox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Combobox.Options className="z-10 absolute w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              <List
                height={360}
                rowCount={officialTokens.length}
                rowRenderer={renderItem}
                rowHeight={36}
                width={384}
              />
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
    </div>
  );
};
