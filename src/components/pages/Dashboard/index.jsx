import { useEffect, useState } from "react";
import Spinner from "../../Libs/Spinner";
import UseContext from "../../contexts/UseContext";
import StatisticsCardData from "./StatisticsCardData";
import Table from "./Table";

const Dashboard = () => {
    const [last7DaysCount, setLast7DaysCount] = useState({});
    const {
        getAllHistory,
        getProductsLength,
        isLoading,
        user,
        productHistory,
        stockProductHistory,
    } = UseContext();

    useEffect(() => {
        getProductsLength();
        getAllHistory();
    }, [user]);

    return (
        isLoading ?
            <div className="w-full md:w-2/3 lg:w-2/3 flex flex-col items-center justify-center overflow-hidden">
                <Spinner />
            </div>
            :
            <div className="my-12 mx-2">
                <StatisticsCardData last7DaysCount={last7DaysCount} setLast7DaysCount={setLast7DaysCount} />
                <Table type={'product'} />

            </div>
    )

}

export default Dashboard

// <div className="w-full md:w-2/3 lg:w-2/3 flex flex-col items-center overflow-hidden">
                //     <Table type={'product'} />
                // </div>