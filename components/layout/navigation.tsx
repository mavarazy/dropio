import { Disclosure } from "@headlessui/react";
import { MenuIcon, XIcon } from "@heroicons/react/outline";
import LogoImg from "./images/logo.png";
import Image from "next/image";
import { NetworkNavigation } from "./network-navigation";
import { useGlobalState } from "../../context";

const navs: Array<{ name: string; link: string }> = [];

export function Navigation() {
  const { network, setNetwork } = useGlobalState();

  return (
    <Disclosure as="nav" className="bg-white shadow">
      {({ open }) => (
        <>
          <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
            <div className="relative flex justify-between h-16">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button */}
                <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex-shrink-0 flex items-center">
                  <Image
                    className="block lg:hidden h-8 w-8"
                    src={LogoImg}
                    width={32}
                    height={32}
                    alt="Dropio"
                  />
                  <div className="ml-2 flex flex-col">
                    <span className="text-xl font-bold">Dropio</span>
                    <span className="text-xs">Solana AirDrop tool</span>
                  </div>
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  {navs.map(({ name, link }) => (
                    <a
                      key={name}
                      href={link}
                      className="border-indigo-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                    >
                      {name}
                    </a>
                  ))}
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                <NetworkNavigation network={network} setNetwork={setNetwork} />
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="pt-2 pb-4 space-y-1">
              {navs.map(({ link, name }) => (
                <Disclosure.Button
                  key={name}
                  as="a"
                  href={link}
                  className="bg-indigo-50 border-indigo-500 text-indigo-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                >
                  {name}
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
