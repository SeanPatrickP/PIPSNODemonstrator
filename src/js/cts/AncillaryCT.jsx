import React, { useState } from "react";
import OptionalCT from "../common/OptionalCT";
import BulkFieldsInput from "../common/BulkFieldsInput";

import { useStringChoices } from "../common/StringChoicesContext";
import {
  INV_ANC_STD_CT,
  STRING_CHOICES_SELECTOR_INPUT,
  TEXT_INPUT,
} from "../common/constants";

export default function AncillaryCT(props) {
  const [hasAncillaryCT, setHasAncillaryCT] = useState(false);

  const baseAncillaryCT = {
    __type: INV_ANC_STD_CT,
  };

  const bulkFieldInputs = [
    {
      title: "Estimating party",
      fieldPath: "estimating party",
      type: TEXT_INPUT,
    },
    {
      title: "Reimbursing party",
      fieldPath: "reimbursing party",
      type: TEXT_INPUT,
    },
    {
      title: "Currency",
      fieldPath: "currency",
      type: STRING_CHOICES_SELECTOR_INPUT,
    },
  ];

  const stringChoices = useStringChoices(
    { __type: INV_ANC_STD_CT },
    [],
    ["currency"]
  );

  return (
    <div className="container">
      <OptionalCT
        {...props}
        baseCT={baseAncillaryCT}
        context={setHasAncillaryCT}
      />
      {hasAncillaryCT && (
        <BulkFieldsInput
          fieldNames={bulkFieldInputs}
          values={props.contents}
          dispatch={props.dispatch}
          path={props.path}
          stringChoices={stringChoices}
        />
      )}
    </div>
  );
}
