import { useEffect, useState } from "react";
import { ReactSearchAutocomplete } from 'react-search-autocomplete';
import Select from 'react-select';
import { storeData } from "../../Helper/storeData";
import Alert from "../../Libs/Alert";
import Spinner from "../../Libs/Spinner";
import UseContext from "../../contexts/UseContext";

const RemoveForm = ({ localProducts, setLocalProducts, productType, setProductType, modifiedProductList, setModifiedProductList }) => {
    const [productDetails, setProductDetails] = useState({ quantity: 1 });
    const { productList, user, setProductList, getStockProductList, getProductList, alertMessage, setAlertMessage, changeFieldData, setChangeFieldData, isLoading } = UseContext();
    const updateProductDetails = (key, value) => {
        setProductDetails({ ...productDetails, [key]: value });
    }

    const handleAddToListClick = (e) => {
        e.preventDefault();
        if (!user?.email) {
            setAlertMessage({ message: 'Please login first', type: 'error' });
            return;
        }
        if (!productType?.value) {
            setAlertMessage({ message: 'Please select a product type', type: 'error' });
            return;
        }
        if (!productDetails?._id) {
            setAlertMessage({ message: 'Please select a Product', type: 'error' });
            return;
        }

        if (productDetails?.quantity > productDetails?.oldQuantity) {
            setAlertMessage({ message: 'Quantity can not be greater than the available quantity', type: 'error' });
            return;
        }
        document.querySelector('.clear-icon').click();

        setLocalProducts([...localProducts, productDetails]);
        setProductDetails({ quantity: 1 });
    }

    useEffect(() => {
        if (productType?.value === 'stock')
            getStockProductList();
        else if (productType?.value === 'product')
            getProductList();
    }, [productType])

    useEffect(() => {
        if (productType?.value) {
            let id = 0;
            const modifiedData = productList.map(product => {
                //check if product is already in localProducts
                const isAlreadyAdded = localProducts.find(pd => pd._id === product._id);
                console.log('isAlreadyAdded', isAlreadyAdded, product);
                if (!isAlreadyAdded) {
                    if (!product.label) {
                        return {
                            ...product,
                            id: id++,
                            label: product.name + ' (' + product.quantity + ')',
                        }
                    } else {
                        return {
                            ...product,
                            id: id++,
                            label: product.label + ' (' + product.quantity + ')',
                            name: product.label
                        }
                    }
                }

            })
            setModifiedProductList(modifiedData)
            setProductDetails({ quantity: 1 })
        }
    }, [productList, productType?.value, localProducts])
    console.log('localProducts', modifiedProductList);

    const handleOnSearch = (string, results) => {
        if (!productType || !productType.value) {
            setAlertMessage({ message: 'Please select a product type', type: 'error' });
            return
        }
    }

    const handleOnSelect = (value) => {
        if (productType.value === 'product') {
            setProductDetails({
                _id: value._id,
                label: value.label ? value.label : value.name,
                oldQuantity: value.quantity,
                quantity: 1,
                rId: value.rId
            });
        } else {
            setProductDetails({
                ...value,
                oldQuantity: value.quantity,
                quantity: 1,
            });
        }

    }

    const formatResult = (item) => {
        return (
            <>
                <span style={{ display: 'block', textAlign: 'left' }}>{item.label ? item.label : item.name}</span>
            </>
        )
    }

    return (
        <form className="space-y-4 md:w-96">
            <div>
                <label htmlFor="productType" className="block font-medium">
                    Product Type
                </label >
                <Select
                    id="productType"
                    value={productType || storeData.productType[0]}
                    onChange={(value) => setProductType(value)}
                    className="font-bold bg-white py-1 px-2 rounded-md border-gray-600 my-1 border-2 text-amber-500 w-full"
                    options={storeData.productType}
                />
            </div >
            {
                isLoading ?
                    <div className="w-full md:w-2/3 lg:w-2/3 mt-12 flex flex-col items-center justify-center overflow-hidden">
                        <Spinner />
                    </div> :
                    <>
                        <div>
                            <label htmlFor="productName" className="block font-medium">
                                Product Name
                            </label>
                            <div className='productNameContainer'>
                                <div>
                                    <ReactSearchAutocomplete
                                        items={modifiedProductList}
                                        onSearch={handleOnSearch}
                                        onSelect={handleOnSelect}
                                        autoFocus
                                        formatResult={formatResult}
                                        showIcon={false}
                                        styling={{ borderRadius: '4px', border: '2px solid black' }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div>
                            <label htmlFor="quantity" className="block font-medium">
                                Quantity
                            </label>
                            <input
                                id="quantity"
                                type="text"
                                value={productDetails?.quantity || ''}
                                onChange={(event) => updateProductDetails('quantity', event.target.value)}
                                className="font-bold bg-white py-1 px-2 rounded-md border-gray-600 my-1 border-2 text-amber-500 w-full"
                            />
                        </div>
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
                    </>
            }
        </form >
    )
}

export default RemoveForm;