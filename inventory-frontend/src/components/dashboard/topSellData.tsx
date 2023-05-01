// Import necessary hooks and components from external libraries
import { useEffect, useState } from "react";
import { axiosRequest } from "../../utils/functions";
import { TopSellUrl } from "../../utils/network";
import { Spin } from "antd";
import { InventoryProps } from "../../utils/types";

// Create the TopSell component
const TopSell = () => {
  // Define the state variables for top-selling items data and loading status
  const [data, setData] = useState<InventoryProps[]>([]);
  const [loading, setLoading] = useState(true);

  // Define an async function to fetch the top-selling items data
  const getTopSellData = async () => {
    const response = await axiosRequest<InventoryProps[]>({
      url: TopSellUrl,
      hasAuth: true,
    });
    setLoading(false);
    if (response) {
      // Process the received data and update the state
      const data = response.data.map((item: any) => ({
        ...item,
        groupInfo: item.group.name,
        photoInfo: item.photo,
      }));
      setData(data);
    }
  };

  // Call the getTopSellData function when the component mounts
  useEffect(() => {
    getTopSellData();
  }, []);

  // Render the TopSell component
  return (
    <div className="card">
      <h3>Top Selling Items</h3>
      <div className="topSellContainer">
        {loading ? (
          <Spin />
        ) : (
          data.map((item, index) => (
            <div key={index} className="topSellItem">
              <div className="imageCon">
                <img src={item.photo} alt="" />
              </div>
              <h3>{item.name}</h3>
              <h4>
                <span>Total Sold: </span>
                {item.total}
              </h4>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// Export the TopSell component as the default export
export default TopSell;
