import React from "react";
import { useForm } from "react-hook-form";
import { useGlobalState } from "../../context";
import { AccountRestoreForm } from "../../utils/account-service";
import { classNames } from "../../utils/class-names";

export function RestoreDropForm() {
  const { restoreAccount } = useGlobalState();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<AccountRestoreForm>();

  return (
    <form
      className="sm:flex sm:items-center"
      onSubmit={handleSubmit(restoreAccount)}
    >
      <div className="w-full sm:max-w-xs">
        <label htmlFor="email" className="sr-only">
          Mnemonic
        </label>
        <input
          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md py-2 px-2"
          placeholder="Mnemonic"
          {...register("mnemonic")}
        />
      </div>
      <button
        type="submit"
        className={classNames(
          isSubmitting
            ? "text-indigo-600 bg-white"
            : "text-white bg-indigo-600",
          "w-full inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
        )}
      >
        Restore
      </button>
    </form>
  );
}
