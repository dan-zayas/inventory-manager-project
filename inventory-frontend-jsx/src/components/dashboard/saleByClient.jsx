import { useEffect, useState } from "react";
import { axiosRequest } from "../../utils/functions";
import { ClientSaleUrl } from "../../utils/network";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";


ChartJS.register(ArcElement, Tooltip, Legend);

const SaleByClient = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const getData = async () => {
    const response = await axiosRequest({
      url: ClientSaleUrl,
      hasAuth: true,
    });

    setLoading(false);

    if (response) {
      const data = response.data;
      setData(data);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const getChartData = () => {
    const colorList = data.map(
      (item) => "#" + ((Math.random() * 0xffffff) << 0).toString(16)
    );

    return {
      labels: data.map((item) => item.name),
      datasets: [
        {
          data: data.map((item) => item.amount_total),
          backgroundColor: colorList,
          borderColor: colorList,
          borderWidth: 1,
        },
      ],
    };
  };

  const pieOptions = {
    plugins: {
      legend: {
        display: true,
        labels: {
          font: {
            size: 12,
          },
        },
      },
    },
  };

  return (
    <div className="card">
      <h3>Sales By Client</h3>
      <div className="pieUI">
        {loading ? (
          <div className="spinner" />
        ) : (
          <Pie data={getChartData()} options={pieOptions} />
        )}
      </div>
    </div>
  );
};

export default SaleByClient;
