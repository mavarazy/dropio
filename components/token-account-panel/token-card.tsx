import { TokenInfo } from "@solana/spl-token-registry";
import { useGlobalState } from "../../context";
import { classNames } from "../../utils/class-names";
import { TokenUtils } from "../../utils/token-utils";
import { TokenLogo } from "../token-logo";

interface TokenCardProps {
  token: TokenInfo;
  amount: bigint;
  selected: boolean;
  onSelect: () => void;
}

export const TokenCard = ({
  token,
  amount,
  selected,
  onSelect,
}: TokenCardProps) => (
  <div
    className={classNames(
      selected
        ? "bg-indigo-500 hover:bg-indigo-600"
        : "bg-white hover:bg-gray-50",
      "col-span-1 rounded-lg shadow divide-y divide-gray-200 cursor-pointer "
    )}
    onClick={onSelect}
  >
    <div className="w-full flex items-center justify-between p-6 space-x-6">
      <div className="flex-1 truncate">
        <div className="flex items-center space-x-3">
          <h3
            className={classNames(
              selected ? "text-white" : "text-gray-900",
              "text-sm font-medium truncate"
            )}
          >
            {token?.name ?? token.address}
          </h3>
        </div>
        <p
          className={classNames(
            selected ? "text-white" : "text-indigo-600",
            "font-semibold text-2xl truncate"
          )}
        >
          {TokenUtils.getHumanAmount(amount, "Token", token).toLocaleString()}
        </p>
      </div>
      <TokenLogo
        logoURI={token?.logoURI}
        size={40}
        className="bg-white rounded-full flex-shrink-0 h-12 w-12"
      />
    </div>
  </div>
);
