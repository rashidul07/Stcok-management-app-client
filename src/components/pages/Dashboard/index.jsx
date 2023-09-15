import { useEffect, useState } from "react";
import Spinner from "../../Libs/Spinner";
import UseContext from "../../contexts/UseContext";
// import StatisticsCardData from "./StatisticsCardData";
import Table from "./Table";
import { Indicator } from "../../Libs/Indicator";
import ChartComponent from "./Chart";
const Dashboard = () => {
    const [chartData, setChartData] = useState({});
    let [totalPage, setTotalPage] = useState(null);
    const [page, setPage] = useState(1);

    const {
        getHistory,
        isLoading,
        user,
        shortHistoryLength,
        stockHistoryLength,
        shortHistory,
        stockHistory,
        productType,
        setProductType
    } = UseContext();

    const OPERATION_TYPES = ['insert', 'update', 'delete'];

    function getDailyOperationCounts(latestHistory) {
        const operationCounts = {};

        // Helper function to initialize a date entry
        const initializeDateEntry = (date) => {
            const entry = {};
            for (const type of OPERATION_TYPES) {
                entry[type] = 0;
            }
            operationCounts[date] = entry;
        };

        for (const entry of latestHistory) {
            // Validate the entry
            if (!entry.date || !entry.operation) {
                console.warn("Invalid entry detected:", entry);
                continue;
            }

            const date = entry.date.split('T')[0];

            // Check if the operation is valid
            if (!OPERATION_TYPES.includes(entry.operation)) {
                console.warn("Unknown operation detected:", entry.operation);
                continue;
            }

            // Initialize or update the count
            if (!operationCounts[date]) {
                initializeDateEntry(date);
            }
            operationCounts[date][entry.operation]++;
        }

        return operationCounts;
    }


    useEffect(() => {
        getHistory(user, 100, productType, page);
    }, [productType, user]);

    const handleProductType = () => {
        setPage(1);
        if (productType === 'short') {
            setProductType('stock');
        }
        else {
            setProductType('short');
        }
    }

    useEffect(() => {
        setTotalPage(Math.ceil((productType === 'short' ? shortHistoryLength : stockHistoryLength) / 100));
    }, [stockHistoryLength, shortHistoryLength, productType]);

    useEffect(() => {
        setChartData(getDailyOperationCounts(productType === 'short' ? shortHistory : stockHistory));
    }, [shortHistory, stockHistory]);

    const handleMoreHistory = () => {
        getHistory(user, 100, productType, page + 1, true);
        setPage(page + 1);
    }

    return (
        <div className="p-12 md:m-auto md:border-2 max-sm:w-screen">
            <h1 className="text-2xl font-bold mb-4 text-center text-black">
                {productType === 'short' ? 'Short' : "Stock"} History <Indicator item={productType === 'short' ? shortHistoryLength : stockHistoryLength} />
            </h1>
            <label className="cursor-pointer label justify-center gap-2 bg-cyan-200 mb-4">
                <span className="label-text text-black">{productType === 'short' ? "Short History" : "Stock History"}</span>
                <input type="checkbox" className="toggle toggle-info" onChange={handleProductType} checked={productType === 'short' ? true : false} />
            </label>
            {
                Object.keys(chartData).length ? <button disabled={totalPage === page} onClick={totalPage === page ? null : handleMoreHistory} className="btn btn-primary w-full">More History [{page}/{totalPage}]</button>
                    : ''
            }

            {
                isLoading ?
                    <div className="w-full md:w-2/3 lg:w-2/3 flex flex-col items-center justify-center overflow-hidden mt-8">
                        <Spinner />
                    </div>
                    :
                    <div className="my-12 mx-2">
                        {
                            Object.keys(chartData).length ? <ChartComponent chartData={chartData} /> : <Spinner />
                        }
                        {
                            Object.keys(chartData).length ? <Table data={productType === 'short' ? shortHistory : stockHistory} /> : ''
                        }
                    </div>
            }
        </div>
    )

}

export default Dashboard
