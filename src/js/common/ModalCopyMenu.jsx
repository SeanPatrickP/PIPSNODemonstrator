import React, { useState } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "@react/modal";
import { cloneDeep } from "lodash";
import { Checkbox } from "@react/checkbox";
import { Icon } from "@react/icon-font";
import { ACTIVE, INACTIVE } from "./constants";

export default function ModalCopyMenu(props) {
  const [selectAllOptions, setSelectAllOptions] = useState(false);

  const selectDeSelectAllOptions = (selectAll) => {
    let newCheckedOptions = {};

    if (selectAll) {
      props.options.map((optionName) => {
        if (optionName !== props.selectedSection) {
          newCheckedOptions[optionName] = true;
        }
      });
    }

    props.setCheckedOptions(newCheckedOptions);

    setSelectAllOptions(selectAll);
  };

  const selectDeSelectOption = (optionName) => {
    let newCheckedOptions = cloneDeep(props.checkedOptions);

    if (optionName in newCheckedOptions) {
      delete newCheckedOptions[optionName];
    } else {
      newCheckedOptions[optionName] = true;
    }

    if (
      newCheckedOptions &&
      Object.keys(newCheckedOptions).length === props.options.length - 1
    ) {
      setSelectAllOptions(true);
    } else {
      setSelectAllOptions(false);
    }

    props.setCheckedOptions(newCheckedOptions);
  };

  const getOptions = () => {
    let inventoryPeriodOptions = [];

    props.options.map((optionName, index) => {
      if (optionName !== props.selectedSection) {
        let icon = <></>;

        if (props.populatedSections) {
          icon = (
            <Icon
              name="check"
              className="check-class"
              type="filled"
              title={props.tooltipPopulated || ACTIVE}
            />
          );
        }

        if (
          props.populatedSections &&
          props.populatedSections.indexOf(optionName.toUpperCase()) === -1
        ) {
          icon = (
            <Icon
              name="clear"
              className="clear-class"
              type="filled"
              title={props.tooltipUnpopulated || INACTIVE}
            />
          );
        }

        inventoryPeriodOptions.push(
          <div className="row" key={`copy selector ${index}`}>
            <div className="col-sm-5">
              {icon} {optionName}:
            </div>

            <div className="col-sm-1">
              <Checkbox
                checked={optionName in props.checkedOptions}
                onChange={() => selectDeSelectOption(optionName)}
              />
            </div>
          </div>
        );
      }
    });

    if (inventoryPeriodOptions && inventoryPeriodOptions.length) {
      inventoryPeriodOptions.unshift(
        <div className="row" key="copy select all">
          <div className="col-sm-5"></div>

          <div className="col-sm-1">
            <Checkbox
              checked={selectAllOptions}
              onChange={() => selectDeSelectAllOptions(!selectAllOptions)}
            />
          </div>
        </div>
      );
    }

    return inventoryPeriodOptions;
  };

  return (
    <>
      {props.showModal && (
        <>
          <Modal
            visible={props.showModal}
            onVisibilityToggle={props.toggleShowModal}
            placement="center"
            onShow={props.onShow()}
            onBeforeHide={() => setSelectAllOptions(false)}
          >
            <ModalHeader onDismissButtonClick={props.toggleShowModal}>
              {props.header}
            </ModalHeader>

            <ModalBody>
              <div className="container">{getOptions()}</div>
            </ModalBody>

            <ModalFooter className="modal-footer">
              <button
                className="btn btn-primary row-action-button"
                onClick={() => props.copyFunction(props.checkedOptions)}
                disabled={Object.keys(props.checkedOptions).length === 0}
              >
                Copy
              </button>
            </ModalFooter>
          </Modal>
        </>
      )}
    </>
  );
}
