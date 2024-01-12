import { ReactSearchAutocomplete } from 'react-search-autocomplete';
import Select from 'react-select';
import { handleAddToListClick, handleClear, handleOnFill, updateProductDetails } from "../../Helper/AddProductHandler";
import { storeData } from "../../Helper/storeData";
import Alert from "../../Libs/Alert";
import UseContext from '../../contexts/UseContext';
import { useEffect, useState } from 'react';
import fetchData from '../../Helper/HandleApi';

function removeDuplicates(data) {
    let uniqueNames = {};

    let uniqueData = data.filter(item => {
        if (!uniqueNames[item?.name?.toLowerCase()?.trim()]) {
            uniqueNames[item?.name?.toLowerCase()?.trim()] = true;
            return true;
        }
        return false;
    });
    return uniqueData;
}

const InputFields = ({ modifiedProductList, productDetails, options, productType }) => {
    const { alertMessage, stockProduct, user } = UseContext();
    const [dbLoading, setDbLoading] = useState(false);
    const [dbProducts, setDbProducts] = useState([]);
    const [matchProduct, setMatchProduct] = useState([]);

    useEffect(() => {
        (async () => {
            setDbLoading(true);
            const response = await fetchData('dbProducts', 'GET', {}, {});
            if (response.status === 'success') {
                const withId = response.data.map(item => {
                    //remove _id from the object and add id to the object with the value of _id
                    const { _id, ...rest } = item;
                    return { ...rest, id: _id, dbId: _id };
                });
                setDbProducts(withId);
            }
            setDbLoading(false);
        })();
    }, []);

    const addDummyData = async () => {
        const response = await fetchData('dummyData', 'GET', {}, {});
        if (response.status === 'success') {
            console.log(response.data);
        }
    }


    const formatResult = (item) => {
        if (item.quantity) {
            return (
                <>
                    <span style={{ display: 'block', textAlign: 'left' }} className='bg-gray-200'>{item.label + ' (' + item.quantity + ')' + (item.quantityHome ? ' (' + item.quantityHome + ')' : '')}</span>
                </>
            )
        } else {
            return (
                <>
                    <span style={{ display: 'block', textAlign: 'left' }} className='bg-green-200'>{item.label}</span>
                </>
            )
        }
    }

    return (
        <form className="space-y-4 md:w-96">
            <div>
                {
                    matchProduct.length > 0 && (
                        <div className='bg-gray-200 p-2 rounded-md'>
                            <p className='text-center'>Matched Product</p>
                            <ul className='list-disc pl-4'>
                                {matchProduct.slice(0, 5).map((item, index) => <li key={index}>{item}</li>)}
                            </ul>
                        </div>
                    )
                }
                <label htmlFor="productName" className="block font-medium">
                    Product Name
                </label>
                <div className='productNameContainer'>
                    <div>
                        <ReactSearchAutocomplete
                            items={removeDuplicates([...modifiedProductList, ...dbProducts])}
                            onSearch={(string) => {
                                if (string.length > 0) {
                                    const stockQuantity = stockProduct.filter(item => item.name?.toLowerCase().includes(string?.toLowerCase())).map(item => {
                                        return item.name + ' (' + item.quantity + ')' + (item.quantityHome ? ' (' + item.quantityHome + ')' : '');
                                    });
                                    setMatchProduct(stockQuantity);
                                } else {
                                    setMatchProduct([]);
                                }
                                updateProductDetails('label', string)
                            }}
                            onSelect={handleOnFill}
                            autoFocus
                            formatResult={formatResult}
                            showIcon={false}
                            onClear={handleClear}
                            styling={{ borderRadius: '4px', border: '2px solid black', position: 'relative', zIndex: 1888888 }}
                        />
                    </div>
                </div>
            </div>
            <div>
                <label htmlFor="company" className="block font-medium">
                    Select Company
                </label>
                <Select
                    id="company"
                    value={productDetails?.company || storeData.companyList[0]}
                    onChange={(value) => updateProductDetails('company', value)}
                    className="font-bold bg-white py-1 px-2 rounded-md border-gray-600 my-1 border-2 text-amber-500 w-full"
                    options={options}
                />
            </div>
            <div>
                <label htmlFor="quantity" className="block font-medium">
                    Quantity
                </label>
                <input
                    id="quantity"
                    type="number"
                    value={productDetails?.quantity || ''}
                    onChange={(event) => updateProductDetails('quantity', Number(event.target.value))}
                    className="font-bold bg-white py-1 px-2 rounded-md border-gray-600 my-1 border-2 text-amber-500 w-full"
                />
            </div>
            {
                productType !== 'stock' && (
                    <>
                        <div>
                            <label htmlFor="stock" className="block font-medium">
                                Stock
                            </label>
                            <input
                                id="stock"
                                type="text"
                                value={productDetails?.stock || ''}
                                onChange={(event) => updateProductDetails('stock', event.target.value)}
                                className="font-bold bg-white py-1 px-2 rounded-md border-gray-600 my-1 border-2 text-amber-500 w-full"
                            />
                        </div>
                        <div>
                            <label htmlFor="mrp" className="block font-medium">
                                MRP
                            </label>
                            <input
                                id="mrp"
                                type="text"
                                value={productDetails?.mrp || ''}
                                onChange={(event) => updateProductDetails('mrp', event.target.value)}
                                className="font-bold bg-white py-1 px-2 rounded-md border-gray-600 my-1 border-2 text-amber-500 w-full"
                            />
                        </div>
                        <div>
                            <label htmlFor="lpp" className="block font-medium">
                                Last Purchase Price
                            </label>
                            <input
                                id="lpp"
                                type="text"
                                value={productDetails?.lpp || ''}
                                onChange={(event) => updateProductDetails('lpp', event.target.value)}
                                className="font-bold bg-white py-1 px-2 rounded-md border-gray-600 my-1 border-2 text-amber-500 w-full"
                            />
                        </div>
                        {/* <div>
                            <label className="label cursor-pointer">
                                <span className="label-text">From Market</span>
                                <input type="checkbox" checked={productDetails.market !== undefined ? productDetails.market : true} onChange={(e) => updateProductDetails('market', e.target.checked)} className="checkbox checkbox-primary" />
                            </label>
                        </div> */}

                    </>
                )
            }
            {
                productType === 'stock' && (
                    <>
                        <div>
                            <label htmlFor="quantityHome" className="block font-medium">
                                Quantity (Home)
                            </label>
                            <input
                                id="quantityHome"
                                type="number"
                                value={productDetails?.quantityHome || 0}
                                onChange={(event) => updateProductDetails('quantityHome', Number(event.target.value))}
                                className="font-bold bg-white py-1 px-2 rounded-md border-gray-600 my-1 border-2 text-amber-500 w-full"
                            />
                        </div>
                        <div>
                            <label htmlFor="price" className="block font-medium">
                                MRP Price
                            </label>
                            <input
                                id="price"
                                type="number"
                                value={productDetails?.price || ''}
                                onChange={(event) => updateProductDetails('price', Number(event.target.value))}
                                className="font-bold bg-white py-1 px-2 rounded-md border-gray-600 my-1 border-2 text-amber-500 w-full"
                            />
                        </div>
                        <div>
                            <label htmlFor="invoiceDiscount" className="block font-medium">
                                invoice discount %
                            </label>
                            <input
                                id="invoiceDiscount"
                                type="number"
                                value={productDetails?.invoiceDiscount || ''}
                                onChange={(event) => updateProductDetails('invoiceDiscount', Number(event.target.value))}
                                className="font-bold bg-white py-1 px-2 rounded-md border-gray-600 my-1 border-2 text-amber-500 w-full"
                            />
                        </div>
                        <div>
                            <label htmlFor="extraDiscount" className="block font-medium">
                                Extra Discount %
                            </label>
                            <input
                                id="extraDiscount"
                                type="number"
                                value={productDetails?.extraDiscount !== null
                                    ? (productDetails?.extraDiscount || '')
                                    : ''}
                                onChange={(event) => updateProductDetails('extraDiscount', Number(event.target.value))}
                                className="font-bold bg-white py-1 px-2 rounded-md border-gray-600 my-1 border-2 text-amber-500 w-full"
                            />
                        </div>
                    </>

                )
            }
            {alertMessage.type === 'error' && <Alert message={alertMessage.message} className="bg-red-500" />}
            {alertMessage.type === 'success' && <Alert message={alertMessage.message} className="bg-green-600" />}
            <div className="text-center">
                <input
                    type="submit"
                    onClick={handleAddToListClick}
                    value="Add to List"
                    className="py-2 px-4 w-full border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                />
            </div>
            {/* <div className="text-center">
                {
                    user.email === 'rashed@rmc.com' && (
                        <button className='bg-blue-500 text-white p-2 rounded-md' onClick={addDummyData}>Add Dummy Data</button>
                    )
                }
            </div> */}
        </form>
    )
}

export default InputFields;