// Import necessary hooks, utility functions, and components from external libraries
import { useEffect, useState } from "react";
import { axiosRequest } from "../../utils/functions";
import { ClientSaleUrl } from "../../utils/network";
import { Pie } from "react-chartjs-2";

// Define the properties for the SaleByShop component
interface SaleByClientProps {
  amount_total: number;
  name: string;
}

// Create the SaleByClient component
const SaleByClient = () => {
  // Define the state variables for data and loading status
  const [data, setData] = useState<SaleByClientProps[]>([]);
  const [loading, setLoading] = useState(true);

  // Define an async function to fetch the sales data by shop
  const getData = async () => {
    const response = await axiosRequest<SaleByClientProps[]>({
      url: ClientSaleUrl,
      hasAuth: true,
    });
    setLoading(false);
    if (response) {
      // Update the data state with the received data
      const data = response.data;
      setData(data);
    }
  };

  // Call the getData function when the component mounts
  useEffect(() => {
    getData();
  }, []);

  // Define a function to create the chart data based on the received data
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

  // Define the pie chart options
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

  // Render the SaleByShop component
  return (
    <div className="card">
      <h3>Sales By Client</h3>
      <div className="pieUI">
        {/* Conditionally render the Pie chart or a loading spinner */}
        {loading ? <div className="spinner" /> : <Pie data={getChartData()} options={pieOptions} />}
      </div>
    </div>
  );
};

// Export the SaleByShop component as the default export
export default SaleByClient;
