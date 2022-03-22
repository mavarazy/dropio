import {
  DropAccountBalance,
  PopulatedDropAccount,
  useGlobalState,
} from "../../context";
import { Cluster } from "@solana/web3.js";
import { TokenUtils } from "../../utils/token-utils";
import {
  AutoSizer,
  List,
  ListRowProps,
  Table,
  Column,
  WindowScroller,
} from "react-virtualized";
import { useCallback } from "react";
import { classNames } from "../../utils/class-names";

const AddressLink = ({
  address,
  cluster,
}: {
  address: string;
  cluster: Cluster;
}) => (
  <a
    href={`https://explorer.solana.com/address/${address}?cluster=${cluster}`}
    target="_blank"
    className="hover:text-indigo-500"
    rel="noreferrer"
  >
    {address}
  </a>
);

const TokenAddressLink: React.FC<{
  account: PopulatedDropAccount;
  cluster: Cluster;
}> = ({ account: { before, after }, cluster }) => {
  if (!before && !after) {
    return <span>Loading</span>;
  }
  if (before === "missing" && !after) {
    return <span>missing</span>;
  }

  const address = after?.address ?? (before as DropAccountBalance)?.address;

  return (
    <span className="text-xs">
      Address:&nbsp;
      <AddressLink address={address} cluster={cluster} />
    </span>
  );
};

export function DropTable() {
  const {
    state: { dropPopulatedAccounts, cluster, token, mode },
  } = useGlobalState();

  const renderItem = useCallback(
    (props: ListRowProps) => {
      const account = dropPopulatedAccounts[props.index];
      return (
        <div
          key={account.wallet}
          style={props.style}
          className={classNames(
            props.index % 2 === 0 ? "bg-gray-100" : "bg-white",
            "flex flex-1 w-full text-sm font-medium"
          )}
        >
          <div className="text-gray-900 w-20 px-2 flex items-center justify-start">
            {props.index + 1}
          </div>
          <div className="text-gray-900 px-2 flex flex-1 flex-col justify-center">
            <AddressLink address={account.wallet} cluster={cluster} />
            <TokenAddressLink account={account} cluster={cluster} />
          </div>
          <div className="px-4 text-gray-500 w-24 flex items-center">
            {TokenUtils.getHumanAmount(account.drop, "SOL", token)}
          </div>
          <div className="px-4 text-gray-500 w-48 flex flex-col justify-center">
            <span
              className={
                account.before === "missing" ||
                account.before?.amount === BigInt(0)
                  ? "text-gray-300"
                  : ""
              }
            >
              {account.before &&
                account.before !== "missing" &&
                TokenUtils.getHumanAmount(account.before.amount, mode, token)}
            </span>
            {account.after && (
              <span className={account.after ? "" : "text-gray-300"}>
                after:
                {account.after &&
                  TokenUtils.getHumanAmount(account.after.amount, mode, token)}
              </span>
            )}
          </div>
        </div>
      );
    },
    [dropPopulatedAccounts, cluster, mode, token]
  );

  return (
    <div className="mt-2 flex flex-col flex-1 mb-10">
      <div className="bg-gray-50 flex text-xl rounded-t-lg text-gray-500">
        <div className="w-20 py-3 pl-4 text-left text-xs uppercase font-medium tracking-wide  flex items-center justify-start">
          #
        </div>
        <div className="px-2 flex flex-1 flex-col justify-center py-3 pl-4 pr-3 text-left text-xs uppercase">
          Wallet
        </div>
        <div className="px-4 w-24 flex items-center py-3 pl-4 pr-3 text-left text-xs uppercase">
          Drop
        </div>
        <div className="px-4 w-48 flex flex-col justify-center py-3 pl-4 pr-3 text-left text-xs uppercase">
          Balance
        </div>
      </div>
      <WindowScroller>
        {({ height, isScrolling, onChildScroll, scrollTop, width }) => (
          <List
            autoHeight
            height={height}
            isScrolling={isScrolling}
            onScroll={onChildScroll}
            scrollTop={scrollTop}
            rowCount={dropPopulatedAccounts.length}
            rowRenderer={renderItem}
            rowHeight={48}
            autoWidth
            width={width}
          />
        )}
      </WindowScroller>
    </div>
  );
}
