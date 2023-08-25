import React from 'react';
import {
    BarElement,
    CategoryScale,
    Chart,
    Legend,
    LinearScale,
    Title,
    Tooltip
} from "chart.js";
import { Bar } from 'react-chartjs-2';

const ChartComponent = ({ chartData }) => {
    const dates = Object.keys(chartData);
    const insertCounts = dates.map(date => chartData[date].insert);
    const updateCounts = dates.map(date => chartData[date].update);
    const deleteCounts = dates.map(date => chartData[date].delete);

    Chart.register(
        CategoryScale,
        LinearScale,
        BarElement,
        Title,
        Tooltip,
        Legend
    );

    const data = {
        labels: dates,
        datasets: [
            {
                label: 'Insert',
                data: insertCounts,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
            {
                label: 'Update',
                data: updateCounts,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
            },
            {
                label: 'Delete',
                data: deleteCounts,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
            },
        ],
    };

    const options = {
        scales: {
            x: {
                type: 'category', // Use 'time' axis type for time-based data
                time: {
                    unit: 'day', // Display by day
                },
            },
            y: {
                beginAtZero: true,
            },
        },
    };

    return (
        <div>
            <h2>Daily Operation Counts</h2>
            <Bar
                data={data}
                options={options}
            />
        </div>
    );
};

export default ChartComponent;
