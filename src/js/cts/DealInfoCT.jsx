import React, { useEffect, useState } from "react";
import BulkFieldsInput from "../common/BulkFieldsInput";
import { Typeahead } from "react-bootstrap-typeahead";
import { changeHandlerBasic } from "../common/useDeepObject";
import {
  CHECKBOX,
  DATE_INPUT,
  DOUBLE_INPUT,
  FIRST_MONTH_START_DATE,
  LAST_MONTH_END_DATE,
  TEXT_INPUT,
} from "../common/constants";

export default function DeallnfoCT(props) {
  const [sellerEntities, setSellerEntities] = useState([]);

  const bulkFieldInputsCommon = [
    {
      title: "Buyer",
      fieldPath: "buyer",
      type: TEXT_INPUT,
      disabled: true,
      //The buyer is currently hard coded to be "J. Aron and Company" for all such deals, so this input field has been disabled
    },
    {
      title: "Start date",
      fieldPath: "start date",
      type: DATE_INPUT,
      linkedDate: "end date",
    },
    {
      title: "End date",
      fieldPath: "end date",
      type: DATE_INPUT,
      linkedDate: "start date",
    },
    {
      title: "Initial payment date",
      fieldPath: "initial payment date",
      type: DATE_INPUT,
      linkedDate: "closing payment date",
    },
    {
      title: "Closing payment date",
      fieldPath: "closing payment date",
      type: DATE_INPUT,
      linkedDate: "initial payment date",
    },
    {
      title: "Funding cap",
      fieldPath: "funding cap",
      type: DOUBLE_INPUT,
    },
    {
      title: "Granular provisional pricing periods",
      fieldPath: "granular pricing",
      type: CHECKBOX,
    },
    {
      title: FIRST_MONTH_START_DATE,
      fieldPath: FIRST_MONTH_START_DATE.toLowerCase(),
      type: DATE_INPUT,
      linkedDate: LAST_MONTH_END_DATE.toLowerCase(),
    },
    {
      title: LAST_MONTH_END_DATE,
      fieldPath: LAST_MONTH_END_DATE.toLowerCase(),
      type: DATE_INPUT,
      linkedDate: FIRST_MONTH_START_DATE.toLowerCase(),
    },
  ];

  const bulkFieldInputsProvisionalDatesOptional = [
    {
      title: "Initial provisional payment date",
      fieldPath: "initial provisional payment date",
      type: DATE_INPUT,
      linkedDate: "closing provisional payment date",
    },
    {
      title: "Closing provisional payment date",
      fieldPath: "closing provisional payment date",
      type: DATE_INPUT,
      linkedDate: "initial provisional payment date",
    },
  ];

  const getBulkFields = () => {
    let bulkFieldNames = [];

    bulkFieldNames = bulkFieldNames.concat(bulkFieldInputsCommon);

    if (props.showPalProvisionals) {
      bulkFieldNames = bulkFieldNames.concat(
        bulkFieldInputsProvisionalDatesOptional
      );
    }

    return bulkFieldNames;
  };

  const getEntityNames = () => {
    fetch(
      `/api/contract-terms-editor/entity-list?toplevelCtName=${encodeURIComponent(
        "Commod PIP CT SnO Deal"
      )}`
    )
      .then((response) => (response.ok && response.json()) || Promise.reject())
      .then((response) => {
        let entities = response && response.types;

        if (entities.indexOf(props.contents.seller) === -1) {
          entities.push(props.contents.seller);
        }
        setSellerEntities(entities);
      });
  };

  const onSelectedOption = (selectedOption) => {
    if (selectedOption.length === 1) {
      changeHandlerBasic(
        props.dispatch,
        props.path,
        "seller",
        selectedOption[0]
      );
    }
  };

  useEffect(() => {
    getEntityNames();
  }, []);

  return (
    <div className="container">
      <div className="row">
        <div className="col-sm-3">Seller:</div>
        <div className="col-sm-8">
          <Typeahead
            id="seller typeahead"
            defaultSeIected={[props.contents.seller]}
            options={sellerEntities}
            onChange={(selectedOption) => {
              onSelectedOption(selectedOption);
            }}
            placeholder="Search for a seller..."
          />
        </div>
      </div>
      <BulkFieldsInput
        fieldNames={getBulkFields()}
        values={props.contents}
        dispatch={props.dispatch}
        path={props.path}
      />
      <div className="row">
        <div className="col-sm-3">Other terms:</div>
        <div className="col-sm-8">
          <textarea
            className="form-control"
            style={{ resize: "vertical", height: "l00px" }}
            value={props.contents["free text"]}
            onChange={(event) =>
              changeHandlerBasic(
                props.dispatch,
                props.path,
                "free text",
                event.target.value
              )
            }
          />
        </div>
      </div>
    </div>
  );
}
