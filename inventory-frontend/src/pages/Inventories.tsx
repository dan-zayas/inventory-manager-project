import { FC, useState } from "react";
import { getInventories } from "../utils/functions";
import ContentLayout from "../components/ContentLayout";
import {
  DataProps,
  GroupProps,
  InventoryProps,
} from "../utils/types";
import {
  useGetGroups,
  useGetInventories,
} from "../utils/hooks";
import AddInventoryForm from "../components/AddInventoryForm";
import { Button } from "antd";
import AddInventoryFormCSV from "../components/AddInventoryFormCSV";
import { ColumnsType } from "antd/lib/table/interface";

// Define the modal state enum
enum ModalState {
  addItem,
  addItemCSV,
  off,
}

// Function to format inventory photo for display
export const formatInventoryPhoto = (inventories: InventoryProps[]) => {
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

const Inventories: FC = () => {
  // Set up the component state
  const [modalState, setModalState] = useState<ModalState>(
    ModalState.off
  );
  const [fetching, setFetching] = useState(true);
  const [groups, setGroups] = useState<GroupProps[]>([]);
  const [inventories, setInventories] = useState<InventoryProps[]>([]);

  // Fetch groups data
  useGetGroups(setGroups, () => null);

  // Set up table columns configuration
  const columns: ColumnsType<any> = [
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
      dataSource={
        (formatInventoryPhoto(inventories) as unknown) as DataProps[]
      }
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
