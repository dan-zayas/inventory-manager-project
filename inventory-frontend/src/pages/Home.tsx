import { FC } from "react";
import Purchase from "../components/dashboard/purchases";
import SaleByClient from "../components/dashboard/saleByClient";
import SummaryData from "../components/dashboard/summaryData";
import TopSell from "../components/dashboard/topSellData";

const Home: FC = () => {
  // Render the home component with various dashboard components
  return (
    <div>
      {/* Summary data component displays a summary of sales and purchases */}
      <SummaryData />
      <br />
      <div className="dashboard-ui-st">
        {/* TopSell component shows the top-selling products */}
        <TopSell />
        <div>
          {/* SaleByShop component displays sales by shop */}
          <SaleByClient />
          <br />
          {/* Purchase component displays purchase information */}
          <Purchase />
        </div>
      </div>
    </div>
  );
};

export default Home;
