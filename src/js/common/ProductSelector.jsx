import React, { useEffect, useState } from "react";
import { Tabs, Tab } from "@react/tabs";

export default function ProductSelector(props) {
  const [selectedProduct, setSelectedProduct] = useState(
    props.selectedProductIndex
  );

  let productMapByIndex = {};
  let productMapByName = {};

  props.allProductNames.map((productName, index) => {
    productMapByIndex[index] = productName;
    productMapByName[productName] = index;
  });

  const setNewProduct = (productName) => {
    props.setSelectedProductIndex(productMapByName[productName]);
  };

  const getOptionTabs = () => {
    let options = [];

    Object.keys(productMapByName).forEach((productName) => {
      options.push(
        <Tab
          key={`${productName} product selector`}
          tabKey={productName}
          title={productName}
        />
      );
    });

    return options;
  };

  useEffect(() => {
    setSelectedProduct(props.selectedProductIndex);
  }, [props.selectedProductIndex]);

  return (
    <div className="selector">
      <Tabs
        variant="tabs"
        activeTabKey={productMapByIndex[selectedProduct]}
        onSelect={setNewProduct}
        contentUnderneath={false}
      >
        {getOptionTabs()}
      </Tabs>
    </div>
  );
}
