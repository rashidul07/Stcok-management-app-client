import {
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    Title,
    Tooltip
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export const labels = [
    new Date().toLocaleString("en-US", {
        timeZone: "Asia/Dhaka",
        dateStyle: "short"
    }),
    new Date(new Date().getTime() - 1 * 24 * 60 * 60 * 1000).toLocaleString(
        "en-US",
        {
            timeZone: "Asia/Dhaka",
            dateStyle: "short"
        }
    ),
    new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000).toLocaleString(
        "en-US",
        {
            timeZone: "Asia/Dhaka",
            dateStyle: "short"
        }
    ),
    new Date(new Date().getTime() - 3 * 24 * 60 * 60 * 1000).toLocaleString(
        "en-US",
        {
            timeZone: "Asia/Dhaka",
            dateStyle: "short"
        }
    ),
    new Date(new Date().getTime() - 4 * 24 * 60 * 60 * 1000).toLocaleString(
        "en-US",
        {
            timeZone: "Asia/Dhaka",
            dateStyle: "short"
        }
    ),
    new Date(new Date().getTime() - 5 * 24 * 60 * 60 * 1000).toLocaleString(
        "en-US",
        {
            timeZone: "Asia/Dhaka",
            dateStyle: "short"
        }
    ),
    new Date(new Date().getTime() - 6 * 24 * 60 * 60 * 1000).toLocaleString(
        "en-US",
        {
            timeZone: "Asia/Dhaka",
            dateStyle: "short"
        }
    )
];

const Chart = ({ data = [], title }) => {
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: "top"
            },
            title: {
                display: true,
                text: title
            }
        }
    };
    return (
        <Bar options={options} data={data} />
    )
}

export default Chart;