import React, { useState } from "react";
import { getGroups } from "../utils/functions";
import ContentLayout from "../components/ContentLayout";
import AddGroupForm from "../components/AddGroupForm";
import { useGetGroups } from "../utils/hooks";

const Groups = () => {
  const [modalState, setModalState] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [groups, setGroups] = useState([]);

  // Fetch the groups and update the state when the component is mounted
  useGetGroups(setGroups, setFetching);

  // Define the columns for the table
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Belongs To (Another Group)",
      dataIndex: "belongsTo",
      key: "belongsTo",
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
    },
    {
      title: "Total Items",
      dataIndex: "total_items",
      key: "total_items",
    },
    {
      title: "Actions",
      dataIndex: "action",
      key: "action",
    },
  ];

  // Function to handle the creation of a new group
  const onCreateGroup = () => {
    setModalState(false);
    setFetching(true);
    getGroups(setGroups, setFetching);
  };

  // Render the ContentLayout with the table and AddGroupForm
  return (
    <ContentLayout
      pageTitle="Group"
      setModalState={setModalState}
      dataSource={groups}
      columns={columns}
      fetching={fetching}
    >
      <AddGroupForm
        onSuccessCallBack={onCreateGroup}
        isVisible={modalState}
        onClose={() => setModalState(false)}
        groups={groups}
      />
    </ContentLayout>
  );
};

export default Groups;
