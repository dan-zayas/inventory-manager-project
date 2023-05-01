// Import necessary hooks and components from external libraries
import { ReactElement, useEffect, useState } from "react";
import { Inventory, Group, Client, UserGroup } from "../../assets/svgs/svgs";
import { axiosRequest } from "../../utils/functions";
import { SummaryUrl } from "../../utils/network";
import { Spin } from "antd";

// Define the properties for the SummaryData component
interface SummaryDataProps {
  [key: string]: {
    title: string;
    count: number;
    icon: ReactElement;
  };
}

// Define initial state for summary data
const tempSummary: SummaryDataProps = {
  total_inventory: {
    title: "Total Items",
    count: 0,
    icon: (
      <span className="dashIcon inventory">
        <Inventory />
      </span>
    ),
  },
  total_group: {
    title: "Total Groups",
    count: 0,
    icon: (
      <span className="dashIcon group">
        <Group />
      </span>
    ),
  },
  total_client: {
    title: "Total Clients",
    count: 0,
    icon: (
      <span className="dashIcon shop">
        <Client />
      </span>
    ),
  },
  total_users: {
    title: "Total Users",
    count: 0,
    icon: (
      <span className="dashIcon user">
        <UserGroup />
      </span>
    ),
  },
};

// Create the SummaryData component
const SummaryData = () => {
  // Define the state variables for summary data and loading status
  const [summaryData, setSummaryData] = useState(tempSummary);
  const [loading, setLoading] = useState(true);

  // Define an async function to fetch the summary data
  const getSummaryData = async () => {
    const response = await axiosRequest({
      url: SummaryUrl,
      hasAuth: true,
    });
    setLoading(false);
    if (response) {
      const result = response.data as { [key: string]: number };
      const _tempData = { ...summaryData };
      Object.keys(result).map((item) => {
        _tempData[item].count = result[item];
        return null;
      });
      setSummaryData(_tempData);
    }
  };

  // Call the getSummaryData function when the component mounts
  useEffect(() => {
    getSummaryData();
  }, []);

  // Render the SummaryData component
  return (
    <div className="summaryContainer">
      {Object.values(summaryData).map((item, index) => (
        <div key={index} className="card summaryContent">
          <div className="info">
            <div className="title">{item.title}</div>
            <div className="count">
              {loading ? <Spin /> : item.count}
            </div>
          </div>
          <div className="icon">{item.icon}</div>
        </div>
      ))}
    </div>
  );
};

// Export the SummaryData component as the default export
export default SummaryData;
