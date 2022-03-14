import React, { useEffect, useState } from "react";
import FeeCTList from "../cts/FeeCTList";
import VerticalSelectionList from "../common/VerticalSelectionList";
import {
  ALL_FEE_TYPES,
  FIRST_MONTH_START_DATE,
  LAST_MONTH_END_DATE,
} from "../common/constants";

export default function FeeSection(props) {
  const [selectedSection, setSelectedSection] = useState('"');
  const [populatedSections, setPopulatedSections] = useState([]);

  useEffect(() => {
    let activeSections = [];

    props.contents["fee cts"].forEach((feeSection) => {
      if (feeSection && feeSection.__type) {
        const feeName = Object.keys(ALL_FEE_TYPES).find(
          (key) => ALL_FEE_TYPES[key] === feeSection.__type
        );
        if (feeName && activeSections.indexOf(feeName) === -1) {
          activeSections.push(feeName.toUpperCase());
        }
      }
    });

    setPopulatedSections(activeSections);
  }, [props.contents["fee cts"].length]);

  return (
    <div className="row" key="fee section">
      <div className="col-sm-2">
        <h1>Fees</h1>
        <VerticalSelectionList
          sections={Object.keys(ALL_FEE_TYPES)}
          selectedSection={selectedSection}
          setSelectedSection={setSelectedSection}
          populatedSections={populatedSections}
          tooltipPopulated="Indicates an active fee"
          tooltipUnpopulated="Indicates an inactive fee"
        />
      </div>
      <div className="col-sm-10">
        <FeeCTList
          contents={props.contents["fee cts"]}
          dispatch={props.dispatch}
          path={["fee cts"]}
          selectedSection={selectedSection}
          dealStartDate={props.contents["deal info ct"]["start date"]}
          dealEndDate={props.contents["deal info ct"]["end date"]}
          dealMonthStartDate={
            props.contents["deal info ct"][FIRST_MONTH_START_DATE.toLowerCase()]
          }
          dealMonthEndDate={
            props.contents["deal info ct"][LAST_MONTH_END_DATE.toLowerCase()]
          }
          products={props.allProductNames}
          populatedSections={populatedSections}
        />
      </div>
    </div>
  );
}
