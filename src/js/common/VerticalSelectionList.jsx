import React, { useEffect, useState } from "react";
import { Tabs, Tab } from "@react/tabs";
import { ACTIVE, INACTIVE } from "./constants";

export default function VerticalSelectionList(props) {
  const [selectedSection, setSelectedSection] = useState("");

  const getOptionTabs = () => {
    let options = [];

    props.sections.forEach((section) => {
      let iconName = "check";
      let className = "check-class";

      let title = props.tooltipPopulated || ACTIVE;

      if (
        props.populatedSections &&
        props.populatedSections.indexOf(section.toUpperCase()) === -1
      ) {
        iconName = "clear";
        className = "clear-class";
        title = props.tooltipUnpopulated || INACTIVE;
      }

      options.push(
        <Tab
          key={`${section} section selector`}
          tabKey={section}
          title={section}
          leadingIcon={{ name: iconName, type: "outlined", title: title }}
          classes={{ leadinglcon: className }}
        />
      );
    });

    return options;
  };

  const getDefaultSelectedOption = () => {
    if (props.sections.length) {
      return props.sections[0];
    }

    return "";
  };

  const setNewOption = (option) => {
    props.setSelectedSection(option);
  };

  useEffect(() => {
    props.setSelectedSection(selectedSection);
  }, [selectedSection]);

  useEffect(() => {
    const defaultOption = getDefaultSelectedOption();
    props.setSelectedSection(defaultOption);
    setSelectedSection(defaultOption);
  }, []);

  useEffect(() => {
    setSelectedSection(props.selectedSection);
  }, [props.selectedSection]);

  return (
    <div className="nav-tabs-vertical">
      <Tabs
        variant="tabs"
        activeTabKey={selectedSection}
        onSelect={setNewOption}
        vertical
        contentUnderneath={false}
      >
        {getOptionTabs()}
      </Tabs>
    </div>
  );
}
