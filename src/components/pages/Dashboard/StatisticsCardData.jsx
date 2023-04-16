import React, { useEffect, useState } from 'react';
import { AiFillDelete } from "react-icons/Ai";
import { BiRefresh } from "react-icons/Bi";
import { CgInsertAfter } from "react-icons/cg";
import Spinner from '../../Libs/Spinner';
import UseContext from '../../contexts/UseContext';
import Chart, { labels } from './Chart';
import { calculateLast7Days, updateConstructor } from './StatisticHandel';

const StatisticsCardData = ({ last7DaysCount, setLast7DaysCount }) => {
    const {
        productHistory,
        stockProductHistory,
        productLength,
        isLoading,
    } = UseContext();
    const [cardInfo, setCardInfo] = useState([]);
    const [shortProductData, setShortProductData] = useState({});
    const [stockProductData, setStockProductData] = useState({});
    useEffect(() => {
        updateConstructor(productHistory, stockProductHistory, setLast7DaysCount, last7DaysCount)
        calculateLast7Days();

    }, [isLoading, productLength, productHistory, stockProductHistory]);

    useEffect(() => {
        if (last7DaysCount.today) {
            setCardInfo([
                {
                    title: 'Short Products',
                    value: productLength.shortProduct,
                    color: 'bg-indigo-600',
                    todaysCount: last7DaysCount['today']?.shortProduct || {},
                },
                {
                    title: 'Stock Products',
                    value: productLength.stockProductsLength,
                    color: 'bg-indigo-600',
                    todaysCount: last7DaysCount['today']?.stockProduct || {}
                }])
        }
        const shortProduct = {
            labels,
            datasets: [
                {
                    label: "Insert",
                    data: [...Object.keys(last7DaysCount).map(key => last7DaysCount[key]?.shortProduct?.insertCount.length)],
                    borderWidth: 1,
                    backgroundColor: "rgba(255, 99, 132, 0.5)"
                },
                {
                    label: "Update",
                    data: [...Object.keys(last7DaysCount).map(key => last7DaysCount[key]?.shortProduct?.updateCount.length)],
                    backgroundColor: "rgba(53, 162, 235, 0.5)",
                    borderWidth: 1,

                },
                {
                    label: "Delete",
                    data: [...Object.keys(last7DaysCount).map(key => last7DaysCount[key]?.shortProduct?.deleteCount.length)],
                    backgroundColor: "rgba(24, 12, 245, 0.5)",
                    borderWidth: 1,
                }
            ]
        };

        const stockProduct = {
            labels,
            datasets: [
                {
                    label: "Insert",
                    data: [...Object.keys(last7DaysCount).map(key => last7DaysCount[key]?.stockProduct?.insertCount.length)],
                    borderWidth: 1,
                    backgroundColor: "rgba(255, 99, 132, 0.5)"
                },
                {
                    label: "Update",
                    data: [...Object.keys(last7DaysCount).map(key => last7DaysCount[key]?.stockProduct?.updateCount.length)],
                    backgroundColor: "rgba(53, 162, 235, 0.5)",
                    borderWidth: 1,
                },
                {
                    label: "Delete",
                    data: [...Object.keys(last7DaysCount).map(key => last7DaysCount[key]?.stockProduct?.deleteCount.length)],
                    backgroundColor: "rgba(24, 12, 245, 0.5)",
                    borderWidth: 1,
                }
            ]
        };
        setShortProductData(shortProduct);
        setStockProductData(stockProduct);
    }, [last7DaysCount]);

    return (
        <>
            <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 mx-6">
                {
                    cardInfo.map((item, index) => (
                        <div className="card w-100 bg-neutral-700 text-white shadow-xl" key={index}>
                            <div className="card-body">
                                <h2 className="card-title justify-center">{item.title} : {item.value}</h2>
                                <div className="card-actions justify-evenly">
                                    <div className='flex items-center gap-1'> <CgInsertAfter /> {item.todaysCount?.insertCount?.length || 0}</div>
                                    <div className='flex items-center gap-2'> <BiRefresh /> {item.todaysCount?.updateCount?.length || 0}</div>
                                    <div className='flex items-center gap-1'> <AiFillDelete /> {item.todaysCount?.deleteCount?.length || 0}</div>
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
            {
                Object.keys(shortProductData).length ? <Chart className="h-64" data={shortProductData} title="Short Product" /> : <Spinner />
            }
            {
                Object.keys(stockProductData).length ? <Chart data={stockProductData} title="Stock Product" /> : <Spinner />
            }
        </>
    );
};

export default StatisticsCardData;