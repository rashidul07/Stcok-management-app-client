import { useEffect, useState } from "react";
import fetchData from "../../Helper/HandleApi";
import Spinner from "../../Libs/Spinner";

function generateCodeFromNumber(price) {
    if (!price) return '';
    const alphabet = 'ABCDEFGHIJ';
    const priceString = price.toString();
    let code = '';

    for (let i = 0; i < priceString.length; i++) {
        const digit = parseInt(priceString[i]);
        code += alphabet[digit];
    }

    return code;
}

const Print = ({ isMarket }) => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)

    const getData = async () => {
        setLoading(true)
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
            for (const { label, quantity, name, status, market, lpp, info } of key[1].product) {
                if (isMarket) {
                    if (market) {
                        productsData.push({ type: 'product', label: label ? label : name, quantity, info, status, lpp: generateCodeFromNumber(Number(lpp) || 0) })
                    }
                } else {
                    productsData.push({ type: 'product', label: label ? label : name, quantity, info, status, lpp: generateCodeFromNumber(Number(lpp) || 0) })
                }
            }
        })
        setData(productsData)
        setLoading(false)
    }
    useEffect(() => {
        getData();
    }, [isMarket])

    const lengthOfData = data.filter(({ type }) => type === 'product').length;
    return (
        loading ?
            <div className="w-full md:w-2/3 lg:w-2/3 flex flex-col items-center justify-center overflow-hidden">
                <Spinner />
            </div>
            : (
                !data.length ? <div className="w-full md:w-2/3 lg:w-2/3 flex flex-col items-center justify-center overflow-hidden">
                    <h3>No data found</h3>
                </div> :
                    <div style={{ margin: "0 10px" }}>
                        {
                            data.map(({ type, label, quantity, status, market, lpp, info }, i) => {
                                return type === "title" ? <span key={i} >{i ? <br /> : ''}<p className={`print-product-item title`}><span>{label}</span> </p></span> : <span key={i} className="print-product-item info"><span className={status === 'complete' ? 'line-through' : ''}>{label}{info ? ` (${info})` : ''} -- {quantity} {lpp ? ('--' + lpp) : ''}</span></span>
                            })
                        }
                        <span className="print-product-item info"><span>Total: {lengthOfData}</span></span>
                    </div>

            )
    );
}

export default Print;