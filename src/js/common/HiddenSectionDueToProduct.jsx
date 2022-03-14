import React from "react";

export default function HiddenSectionDueToProduct(props) {
  return (
    <div className="row" key="quantity section">
      <div className="col-sm-2">
        <h1>{props.sectionName}</h1>
      </div>
      <div className="col-sm-10 hidden-section-text">
        <h3>
          <b>Please add at least one inventory to activate this section</b>
        </h3>
      </div>
    </div>
  );
}
