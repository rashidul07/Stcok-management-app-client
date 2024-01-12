import { useEffect, useState } from "react";
import Spinner from "../../Libs/Spinner";
import UseContext from "../../contexts/UseContext";
// import StatisticsCardData from "./StatisticsCardData";
import Table from "./Table";
import { Indicator } from "../../Libs/Indicator";
import ChartComponent from "./Chart";
import Select from "react-select";
import fetchData from "../../Helper/HandleApi";
const Dashboard = () => {
    const [chartData, setChartData] = useState({});
    let [totalPage, setTotalPage] = useState(null);
    const [page, setPage] = useState(1);
    const [users, setUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState();
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

    useEffect(() => {
        if (user.email) {
            setCurrentUser({
                email: user.email,
            })
        }
    }, [user]);

    const OPERATION_TYPES = ['insert', 'update', 'delete'];

    const handleChangeUser = (user) => {
        setCurrentUser({
            email: user.value,
        })
        setPage(1);
        getHistory({
            email: user.value,
        }, 100, productType, 1, false, true);
    }

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
        getHistory(currentUser, 100, productType, page + 1, true);
        setPage(page + 1);
    }

    useEffect(() => {
        (async () => {
            const users = await fetchData('allUsers', 'GET');
            if (users.status === 'success' && users.data?.length) {
                const options = users.data.map(user => {
                    return {
                        value: user,
                        //get label from email with split @ and get first part and capitalize it
                        label: user.split('@')[0].charAt(0).toUpperCase() + user.split('@')[0].slice(1)
                    }
                })
                options.push({
                    value: 'all',
                    label: 'All Users'
                })
                setUsers(options);
            }
        })()
    }, []);

    return (
        <div className="p-12 md:m-auto md:border-2 max-sm:w-screen">
            <h1 className="text-2xl font-bold mb-4 text-center text-black">
                {productType === 'short' ? 'Short' : "Stock"} History <Indicator item={productType === 'short' ? shortHistoryLength : stockHistoryLength} />
            </h1>
            {/* <label className="cursor-pointer label justify-center gap-2 bg-cyan-200 mb-4">
                <span className="label-text text-black">{productType === 'short' ? "Short History" : "Stock History"}</span>
                <input type="checkbox" className="toggle toggle-info" onChange={handleProductType} checked={productType === 'short' ? true : false} />
            </label> */}
            {
                user.email === 'romel@mrh.com' ? <div>
                    <Select
                        id="user"
                        value={currentUser?.email ? { value: currentUser.email, label: currentUser.email.split('@')[0].charAt(0).toUpperCase() + currentUser.email.split('@')[0].slice(1) } : null}
                        onChange={(value) => handleChangeUser(value)}
                        className="font-bold bg-white py-1 px-2 rounded-md border-gray-600 my-1 border-2 text-amber-500 w-full"
                        options={users}
                    />
                </div > : ''
            }
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
