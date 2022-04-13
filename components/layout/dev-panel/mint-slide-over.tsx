/* This example requires Tailwind CSS v2.0+ */
import {
  ForwardedRef,
  forwardRef,
  Fragment,
  useImperativeHandle,
  useMemo,
} from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";
import { useToggle } from "react-use";
import { useGlobalState } from "../../../context";
import { DevService } from "../../../utils/dev-service";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPersonDigging } from "@fortawesome/pro-light-svg-icons";
import { DevMintForm, MintForm } from "./mint-form";

export interface MintSlideOverRef {
  open(): void;
}

export const MintSlideOver = forwardRef(
  (_, ref: ForwardedRef<MintSlideOverRef>) => {
    const [open, toggleOpen] = useToggle(false);

    const {
      state: {
        cluster,
        balance: { id, tokens },
      },
      accountInfo,
      onError,
      refreshBalance,
    } = useGlobalState();

    useImperativeHandle(ref, () => ({
      open: toggleOpen,
    }));

    const selfMinted = useMemo(
      () =>
        tokens
          .filter((token) => token.mint.mintAuthority?.toString() === id)
          .map(({ mint }) => mint.address.toString()),
      [id, tokens]
    );

    const handleMint = async (mintForm: DevMintForm) => {
      try {
        if (accountInfo) {
          await DevService.mint(
            cluster,
            accountInfo?.account,
            BigInt(mintForm.amount),
            mintForm.mintId
          );
          await refreshBalance();
        }
      } catch (error) {
        onError(error);
      }
    };

    return (
      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 overflow-hidden"
          onClose={toggleOpen}
        >
          <div className="absolute inset-0 overflow-hidden">
            <Dialog.Overlay className="absolute inset-0" />

            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <div className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                    <div className="px-4 sm:px-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-lg font-medium text-gray-900">
                          <FontAwesomeIcon icon={faPersonDigging} /> MINT ME
                        </Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            onClick={() => toggleOpen(false)}
                          >
                            <span className="sr-only">Close panel</span>
                            <XIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="relative mt-6 flex-1 px-4 sm:px-6">
                      <div className="absolute inset-0 px-4 sm:px-6">
                        <div className="h-full" aria-hidden="true">
                          {selfMinted.map((mintId) => (
                            <MintForm
                              key={mintId}
                              mintId={mintId}
                              onMint={handleMint}
                            />
                          ))}
                          <MintForm onMint={handleMint} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    );
  }
);

MintSlideOver.displayName = "MintSlideOver";
