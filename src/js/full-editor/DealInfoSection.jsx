import React from "react";
import DealInfoCT from "../cts/DealInfoCT";
import AdvancedSettings from "./AdvancedSettings";
import NettingTermsSettings from "./NettingTermsSettings";
import TerminationTermsSettings from "./TerminationTermsSettings";

export default function DealInfoSection(props) {
  return (
    <div className="row">
      <div className="col-sm-2">
        <h1>Deal information</h1>
        <AdvancedSettings
          contents={props.contents["settings ct"]}
          allProductNames={props.allProductNames}
          dispatch={props.dispatch}
          path={[...props.path, "settings ct"]}
        />
        <NettingTermsSettings
          contents={props.contents["settings ct"]}
          allProductNames={props.allProductNames}
          dispatch={props.dispatch}
          path={[...props.path, "settings ct"]}
        />
        <TerminationTermsSettings
          contents={props.contents["termination ct"]}
          allProductNames={props.allProductNames}
          dispatch={props.dispatch}
          path={[...props.path, "termination ct"]}
        />
      </div>
      <div className="col-sm-10">
        <DealInfoCT
          contents={props.contents["deal info ct"]}
          dispatch={props.dispatch}
          path={[...props.path, "deal info ct"]}
          showPalProvisionals={props.showPalProvisionals}
        />
      </div>
    </div>
  );
}
