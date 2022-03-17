import { RadioGroup } from "@headlessui/react";
import Image from "next/image";
import { classNames } from "../../utils/class-names";
import SolImg from "./images/sol.svg";
import TokenImg from "./images/token.png";
import { DropMode, useGlobalState } from "../../context";
import { TokenPicker } from "./token-picker";

const Modes: Array<{
  mode: DropMode;
  image: string | StaticImageData;
}> = [
  { mode: "SOL", image: SolImg },
  { mode: "Token", image: TokenImg },
];

export function StackingPicker() {
  const {
    state: { mode },
    setMode,
  } = useGlobalState();

  return (
    <RadioGroup value={mode} onChange={setMode} className="mt-4">
      <div className="grid grid-cols-4 gap-4">
        {Modes.map(({ mode, image }) => (
          <RadioGroup.Option
            key={mode}
            value={mode}
            className={({ active, checked }) =>
              classNames(
                "cursor-pointer focus:outline-none",
                active ? "ring-2 ring-offset-2 ring-indigo-500" : "",
                checked
                  ? "bg-indigo-500 border-transparent text-white hover:bg-indigo-700"
                  : "bg-white border-gray-200 text-gray-900 hover:bg-gray-50",
                "border rounded-md py-0 px-2 flex items-center justify-center text-sm font-medium uppercase sm:flex-1"
              )
            }
          >
            <RadioGroup.Label as="div" className="flex">
              <Image src={image} width={42} height={42} />
              <span className="items-center self-center ml-4">{mode}</span>
            </RadioGroup.Label>
          </RadioGroup.Option>
        ))}
        <div className="col-span-2 flex items-center justify-end">
          {mode === "Token" && <TokenPicker />}
        </div>
      </div>
    </RadioGroup>
  );
}
