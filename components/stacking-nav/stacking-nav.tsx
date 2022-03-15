import { RadioGroup } from "@headlessui/react";
import Image from "next/image";
import { useState } from "react";
import { classNames } from "../../utils/class-names";
import { TokenPicker } from "./token-picker";
import SolImg from "./images/sol.svg";
import NFTImg from "./images/nft.svg";

const STACKING_TABS: Array<{ name: string; href: string; current: boolean }> = [
  { name: "SOL", href: "/sol", current: false },
  { name: "Token", href: "/token", current: false },
  { name: "NFT", href: "/nft", current: true },
];

export function StackingPicker() {
  const [mem, setMem] = useState(STACKING_TABS[2]);

  return (
    <RadioGroup value={mem} onChange={setMem} className="mt-2">
      <div className="grid grid-cols-4 gap-4">
        <RadioGroup.Option
          value="SOL"
          className={({ active, checked }) =>
            classNames(
              "cursor-pointer focus:outline-none",
              active ? "ring-2 ring-offset-2 ring-indigo-500" : "",
              checked
                ? "bg-indigo-500 border-transparent text-white hover:bg-indigo-700"
                : "bg-white border-gray-200 text-gray-900 hover:bg-gray-50",
              "border rounded-md py-2 px-2 flex items-center justify-center text-sm font-medium uppercase sm:flex-1"
            )
          }
        >
          <RadioGroup.Label as="div" className="flex">
            <Image src={SolImg} width={42} height={42} />
            <span className="items-center self-center ml-4">SOL</span>
          </RadioGroup.Label>
        </RadioGroup.Option>
        <RadioGroup.Option
          value="Token"
          className={({ active, checked }) =>
            classNames(
              "cursor-pointer focus:outline-none col-span-2",
              active ? "ring-2 ring-offset-2 ring-indigo-500" : "",
              checked
                ? "bg-indigo-500 border-transparent text-white hover:bg-indigo-700"
                : "bg-white border-gray-200 text-gray-900 hover:bg-gray-50",
              "border rounded-md py-2 px-2 flex items-center justify-center text-sm font-medium uppercase sm:flex-1"
            )
          }
        >
          <RadioGroup.Label as="div">
            <label>Token</label>
            <TokenPicker />
          </RadioGroup.Label>
        </RadioGroup.Option>
        <RadioGroup.Option
          value="NFT"
          className={({ active, checked }) =>
            classNames(
              "opacity-25 cursor-not-allowed",
              active ? "ring-2 ring-offset-2 ring-indigo-500" : "",
              checked
                ? "bg-indigo-500 border-transparent text-white hover:bg-indigo-700"
                : "bg-white border-gray-200 text-gray-900 hover:bg-gray-50",
              "border rounded-md py-2 px-2 flex items-center justify-center text-sm font-medium uppercase sm:flex-1"
            )
          }
          disabled
        >
          <RadioGroup.Label as="div" className="flex">
            <Image src={NFTImg} width={42} height={42} />
            <span className="items-center self-center ml-4">NFT</span>
          </RadioGroup.Label>
        </RadioGroup.Option>
      </div>
    </RadioGroup>
  );
}
