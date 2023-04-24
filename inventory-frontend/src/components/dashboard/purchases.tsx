// Import necessary hooks, utility functions, and components from external libraries
import { useEffect, useState } from "react"
import { axiosRequest } from "../../utils/functions"
import { PurchaseSummaryUrl, TopSellUrl } from "../../utils/network"
import {Spin} from 'antd'
import { InventoryProps } from "../../utils/types"

// Define the properties for the Purchase component
interface PurchaseProps {
    price: number
    count: number
}

// Create the Purchase component
const Purchase = () => {

    // Define the state variables for data and loading status
    const [data, setData] = useState<PurchaseProps>()
    const [loading, setLoading] = useState(true)

    // Define an async function to fetch the top selling data
    const getTopSellData = async () => {
        // Make an authenticated API request using the utility function axiosRequest
        const response = await axiosRequest<PurchaseProps>({
            url: PurchaseSummaryUrl,
            hasAuth: true,
        })
        setLoading(false)
        if(response){
            // Update the data state with the received data
            const data = response.data
            setData(data)
            setLoading(false)
        }
    }

    // Call the getTopSellData function when the component mounts
    useEffect(() => {
        getTopSellData()
    }, [])

    // Render the Purchase component
    return <div className="card">
        <h3>Purchases</h3>

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
    </div>
}

// Export the Purchase component as the default export
export default Purchase
