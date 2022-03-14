import React, { useEffect, useState } from "react";
import HeaderActionColumn from "../common/HeaderActionColumn";
import ExpandedInventoryPeriod from "../full-editor/ExpandedInventoryPeriod";
import { changeHandlerBasic } from "../common/useDeepObject";
import {
  formatFromDate,
  getNewInventoryPeriod,
  parseSpecialDate,
} from "../common/InputHelper";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { cloneDeep } from "lodash";
import { DATE_KEY } from "../common/constants";

export default function InventoryPeriodCTList(props) {
  const [selectedSection, setSelectedSection] = useState(props.selectedSection);
  const [filteredInventoryPeriods, setFilteredInventoryPeriods] = useState({});

  const addNewInventoryPeriod = () => {
    props.contents.push(
      cloneDeep(getNewInventoryPeriod(selectedSection, "", ""))
    );

    changeHandlerBasic(
      props.dispatch,
      ["inventory cts", props.selectedProductIndex],
      "inventory period cts",
      props.contents
    );
  };

  const sortInventoryPeriods = (currentInventoryPeriods) => {
    return currentInventoryPeriods.sort(
      (inventoryPeriodA, inventoryPeriodB) =>
        new Date(
          formatFromDate(
            inventoryPeriodB &&
              inventoryPeriodB("period start date") &&
              inventoryPeriodB["period start date"][DATE_KEY]
          )
        ) -
        new Date(
          formatFromDate(
            inventoryPeriodA &&
              inventoryPeriodA["period start date"] &&
              inventoryPeriodA["period start date"][DATE_KEY]
          )
        )
    );
  };

  const getFilteredInventoryPeriodsTabs = (currentInventoryPeriods) => {
    let inventoryPeriods = {};

    if (selectedSection) {
      currentInventoryPeriods.forEach((inventoryPeriod, index) => {
        let shallowInventory = {};
        if (
          inventoryPeriod &&
          inventoryPeriod["period name"] &&
          inventoryPeriod["period name"] === selectedSection
        ) {
          shallowInventory.index = index;
          shallowInventory.expanded = false;
          shallowInventory.selectedProductIndex = props.selectedProductIndex;
          shallowInventory.selectedSection = selectedSection;
          inventoryPeriods[index] = shallowInventory;
        }
      });
    }

    return cloneDeep(inventoryPeriods);
  };

  const generateHeaderTitle = (inventoryPeriod) => {
    let startDate = formatFromDate(
      inventoryPeriod &&
        inventoryPeriod["period start date"] &&
        inventoryPeriod["period start date"][DATE_KEY]
    );

    let endDate = formatFromDate(
      inventoryPeriod &&
        inventoryPeriod["period end date"] &&
        inventoryPeriod["period end date"][DATE_KEY]
    );

    const potentialStartDate = parseSpecialDate(startDate, "start");
    const potentialEndDate = parseSpecialDate(endDate, "end");

    if (potentialStartDate.length) {
      startDate = potentialStartDate;
    }

    if (potentialEndDate.length) {
      endDate = potentialEndDate;
    }

    return (
      <>
        {startDate.length > 0 && endDate.length > 0 && (
          <p>
            From: <b>{startDate}</b> To: <b>{endDate}</b>
          </p>
        )}
        {(!startDate.length || !endDate.length) && (
          <p>
            {selectedSection} <i>(Dates Not Set)</i>
          </p>
        )}
      </>
    );
  };

  const compareInventoryPeriodsIndexKeys = (currentPeriods, updatedPeriods) => {
    const currentPeriodsIndexExpansionTuples = Object.values(currentPeriods);
    const updatedPeriodsIndexExpansionTuples = Object.values(updatedPeriods);

    if (
      currentPeriodsIndexExpansionTuples.length !==
      updatedPeriodsIndexExpansionTuples.length
    ) {
      return false;
    }

    for (
      var index = 0;
      index < currentPeriodsIndexExpansionTuples.length;
      index++
    ) {
      if (
        !currentPeriodsIndexExpansionTuples[index] ||
        !updatedPeriodsIndexExpansionTuples[index] ||
        currentPeriodsIndexExpansionTuples[index].index !==
          updatedPeriodsIndexExpansionTuples[index].index ||
        currentPeriodsIndexExpansionTuples[index].selectedProductIndex !==
          updatedPeriodsIndexExpansionTuples[index].selectedProductIndex ||
        currentPeriodsIndexExpansionTuples[index].selectedSection !==
          updatedPeriodsIndexExpansionTuples[index].selectedSection
      ) {
        return false;
      }
    }

    return true;
  };

  useEffect(() => {
    if (props.selectedSection !== selectedSection) {
      setSelectedSection(props.selectedSection);
    }
  }, [props.selectedSection]);

  useEffect(() => {
    //  Sorts by latest start date (from) first

    const sortedInventoryPeriods = sortInventoryPeriods(props.contents);
    const updatedFilteredInventoryPeriods = getFilteredInventoryPeriodsTabs(
      props.contents
    );

    if (sortedInventoryPeriods === props.contents) {
      if (
        compareInventoryPeriodsIndexKeys(
          filteredInventoryPeriods,
          updatedFilteredInventoryPeriods
        )
      ) {
        return;
      }

      return setFilteredInventoryPeriods(updatedFilteredInventoryPeriods);
    }

    changeHandlerBasic(
      props.dispatch,
      ["inventory cts", props.selectedProductIndex],
      "inventory period cts",
      sortedInventoryPeriods
    );
  }, [selectedSection, props.selectedProductIndex, props.contents.length]);

  return (
    <div className="container container-with-bottom-panel">
      {Object.values(filteredInventoryPeriods).map(function (inventoryPeriod) {
        return (
          <div
            className="row"
            key={`inventory period row ${inventoryPeriod.index}`}
          >
            {props.contents.length > inventoryPeriod.index && (
              <>
                <HeaderActionColumn
                  itemName={generateHeaderTitle(
                    props.contents[inventoryPeriod.index]
                  )}
                  index={inventoryPeriod.index}
                  dispatch={props.dispatch}
                  contents={props.contents}
                  setFilteredItems={setFilteredInventoryPeriods}
                  filteredItems={filteredInventoryPeriods}
                  selectedSection={`${selectedSection}-${props.selectedProductIndex}`}
                  path={["inventory cts", props.selectedProductIndex]}
                  fieldName="inventory period cts"
                  showPeriodSettings={true}
                  selectedProductIndex={props.selectedProductIndex}
                  disabled={
                    !props.contents[inventoryPeriod.index]["price cts"].length
                  }
                  dealInfo={props.dealInfo}
                  inventoryPeriodName={selectedSection}
                  copyEnabled={true}
                  disabledTooltip="You must add at least one formula to this inventory period in order to expand it"
                />
                {inventoryPeriod.expanded && (
                  <ExpandedInventoryPeriod
                    index={inventoryPeriod.index}
                    dispatch={props.dispatch}
                    contents={props.contents}
                    path={["inventory cts", props.selectedProductIndex]}
                    formulaCount={
                      props.contents.length +
                      props.contents[inventoryPeriod.index]["price cts"].length
                    }
                    productType={props.productType}
                    inventoryPeriodName={selectedSection}
                    allProductNames={props.allProductNames}
                    selectedProductIndex={props.selectedProductIndex}
                    fieldName="inventory period cts"
                    inventoryPeriodIndex={inventoryPeriod.index}
                  />
                )}
              </>
            )}
          </div>
        );
      })}
      <div className="row bottom" key="inventory period list bottom row">
        <div className="col-sm-3">Add new inventory period:</div>
        <div className="col-sm-8">
          <input
            className="form-control"
            value={selectedSection}
            disabled={true}
          />
        </div>
        <div className="col-sm-1 button-col-right">
          <button
            className="small-action-button"
            onClick={addNewInventoryPeriod}
            title="Add inventory period"
          >
            <FontAwesomeIcon icon={faPlusCircle} className="button-icon" />
          </button>
        </div>
      </div>
    </div>
  );
}
