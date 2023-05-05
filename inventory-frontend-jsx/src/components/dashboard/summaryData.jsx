import { useEffect, useState } from "react";
import { Inventory, Group, Client, UserGroup } from "../../assets/svgs/svgs";
import { axiosRequest } from "../../utils/functions";
import { Spin } from "antd";
import { SummaryUrl } from "../../utils/network";

const SummaryData = () => {
  const tempSummary = {
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

  const [summaryData, setSummaryData] = useState(tempSummary);
  const [loading, setLoading] = useState(true);

  const getSummaryData = async () => {
    setLoading(true);
    const response = await axiosRequest({
      url: SummaryUrl,
      hasAuth: true,
    });
    setLoading(false);
    if (response) {
      const result = response.data;
      const _tempData = { ...summaryData };
      Object.keys(result).map((item) => {
        _tempData[item].count = result[item];
        return null;
      });
      setSummaryData(_tempData);
    }
  };

  useEffect(() => {
    getSummaryData();
  }, []);

  return (
    <div className="summaryContainer">
      {Object.values(summaryData).map((item, index) => (
        <div key={index} className="card summaryContent">
          <div className="info">
            <div className="title">{item.title}</div>
            <div className="count">{loading ? <Spin /> : item.count}</div>
          </div>
          <div className="icon">{item.icon}</div>
        </div>
      ))}
    </div>
  );
};

export default SummaryData;
