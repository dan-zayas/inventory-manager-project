import React, { useState } from "react";
import { getInventories } from "../utils/functions";
import ContentLayout from "../components/ContentLayout";
import AddInventoryForm from "../components/AddInventoryForm";
import { Button } from "antd";
import AddInventoryFormCSV from "../components/AddInventoryFormCSV";
import { useGetGroups, useGetInventories } from "../utils/hooks";

// Define the modal state enum
const ModalState = {
  addItem: "addItem",
  addItemCSV: "addItemCSV",
  off: "off",
};

// Function to format inventory photo for display
export const formatInventoryPhoto = (inventories) => {
  return inventories.map((item) => ({
    ...item,
    photoInfo: (
      <div
        className="imageView"
        style={{
          backgroundImage: `url(${item.photo})`,
          width: "50px",
          height: "50px",
        }}
      />
    ),
  }));
};

const Inventories = () => {
  // Set up the component state
  const [modalState, setModalState] = useState(ModalState.off);
  const [fetching, setFetching] = useState(true);
  const [groups, setGroups] = useState([]);
  const [inventories, setInventories] = useState([]);

  // Fetch groups data
  useGetGroups(setGroups, () => null);

  // Set up table columns configuration
  const columns = [
    // ... (The original columns configuration)
  ];

  // Fetch inventories data
  useGetInventories(setInventories, setFetching);

  // Function to update the inventories after adding a new item
  const onCreateInventory = () => {
    setModalState(ModalState.off);
    setFetching(true);
    getInventories(setInventories, setFetching);
  };

  // Render the inventories page with the ContentLayout component
  return (
    <ContentLayout
      pageTitle="Inventory"
      setModalState={() => setModalState(ModalState.addItem)}
      dataSource={formatInventoryPhoto(inventories)}
      columns={columns}
      fetching={fetching}
      customName="Inventories"
      extraButton={
        <Button
          type="primary"
          onClick={() => setModalState(ModalState.addItemCSV)}
        >
          Add items (CSV)
        </Button>
      }
    >
      <AddInventoryForm
        onSuccessCallBack={onCreateInventory}
        isVisible={modalState === ModalState.addItem}
        onClose={() => setModalState(ModalState.off)}
        groups={groups}
      />
      <AddInventoryFormCSV
        onSuccessCallBack={onCreateInventory}
        isVisible={modalState === ModalState.addItemCSV}
        onClose={() => setModalState(ModalState.off)}
      />
    </ContentLayout>
  );
};

export default Inventories;
