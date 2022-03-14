import React, { ReactElement } from "react";

export const PhraseBox = ({
  mnemonic,
}: {
  mnemonic: string | null;
}): ReactElement => {
  return (
    <div>
      <p>{mnemonic}</p>
    </div>
  );
};

export default PhraseBox;
