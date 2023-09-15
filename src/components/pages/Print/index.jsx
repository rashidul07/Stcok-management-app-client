import { useEffect, useState } from "react";
import fetchData from "../../Helper/HandleApi";
import Spinner from "../../Libs/Spinner";
const Print = () => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)

    const getData = async () => {
        const res = await fetchData('productList', 'GET', {}, { type: 'product' })
        const companyMap = {};
        res?.data.forEach(product => {
            const { company, ...rest } = product;
            if (!companyMap[company]) {
                companyMap[company] = { company, product: [] };
            }
            companyMap[company].product.push({ ...rest });
        });
        const productsData = []
        Object.entries(companyMap).map((key) => {
            productsData.push({ type: 'title', label: key[0] })
            for (const { label, quantity, name, status } of key[1].product) {
                productsData.push({ type: 'product', label: label ? label : name, quantity, status })
            }
        })
        setData(productsData)
        setLoading(false)
    }
    useEffect(() => {
        getData();
    }, [])

    return (
        loading ?
            <div className="w-full md:w-2/3 lg:w-2/3 flex flex-col items-center justify-center overflow-hidden">
                <Spinner />
            </div>
            : (
                !data.length ? <div className="w-full md:w-2/3 lg:w-2/3 flex flex-col items-center justify-center overflow-hidden">
                    <h3>No data found</h3>
                </div> :
                    <div style={{ margin: "10px", textAlign: 'center' }}>
                        {
                            data.map(({ type, label, quantity, status }, i) => {
                                return type === "title" ? <span key={i} className="print-product-item title"><span>{label}</span> </span> : <span key={i} className="print-product-item info"><span className={status === 'complete' ? 'line-through' : ''}>{label} -- {quantity}</span></span>
                            })
                        }
                    </div>

            )
    );
}

export default Print;