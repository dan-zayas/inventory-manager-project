import { useEffect, useState } from "react";
import { axiosRequest } from "../../utils/functions";
import { PurchaseSummaryUrl } from "../../utils/network";
import { Spin } from "antd";

const Purchase = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const getTopSellData = async () => {
    const response = await axiosRequest({
      url: PurchaseSummaryUrl,
      hasAuth: true,
    });

    if (response) {
      const data = response.data;
      setData(data);
    }

    setLoading(false);
  };

  useEffect(() => {
    getTopSellData();
  }, []);

  return (
    <div className="card">
      <h3>Purchases</h3>

      {loading ? (
        <Spin />
      ) : (
        <div className="puchases">
          <div className="content">
            <div className="title">{data?.price}</div>
            <div className="info">(price)</div>
          </div>
          <br />
          <div className="content">
            <div className="title">{data?.count}</div>
            <div className="info">(count)</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Purchase;
