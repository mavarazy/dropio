import { useGlobalState } from "../../context";
import { TokenCard } from "./token-card";

export function TokenAccountPanel() {
  const {
    state: { mode, token: selected, balance },
    setToken,
  } = useGlobalState();

  return (
    <div
      role="list"
      className={"grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"}
    >
      {balance.tokens.map(({ token, amount }) => (
        <TokenCard
          key={token.address}
          token={token}
          amount={amount}
          selected={mode === "Token" && token.address === selected.address}
          onSelect={() => setToken(token)}
        />
      ))}
    </div>
  );
}
