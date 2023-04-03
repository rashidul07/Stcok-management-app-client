import { useEffect, useState } from "react";
import DataTable from 'react-data-table-component';
import Select from 'react-select';
import UseContext from "../../contexts/UseContext";
import fetchData from "../../Helper/HandleApi";
import { storeData } from "../../Helper/storeData";
import Alert from "../../Libs/Alert";
import { Indicator } from "../../Libs/Indicator";
import Spinner from "../../Libs/Spinner";
import TableSettings from "./TableSettings";

const AllProducts = () => {
    const { productList, user, getProductList, isLoading, setProductList, alertMessage, setAlertMessage } = UseContext()
    const [selectedCompany, setSelectedCompany] = useState(null)
    const [products, setProducts] = useState(productList)
    const [mode, setMode] = useState('Order Mode');
    const [selectedProducts, setSelectedProducts] = useState([])
    const [TextareaValue, setTextareaValue] = useState(null)
    const [copyButtonText, setCopyButtonText] = useState('Copy & Update')
    const [isTableLoading, setIsTableLoading] = useState(isLoading)
    const [toggledClearRows, setToggleClearRows] = useState(false);

    useEffect(() => {
        getProductList();
    }, [user]);

    useEffect(() => {
        if (products.length === 0) {
            setProducts(productList)
        }
    }, [productList])

    useEffect(() => {
        console.log(selectedCompany, productList.length);
        if (selectedCompany?.value === '') {
            setProducts(productList)
        }

        if (selectedCompany && selectedCompany.value !== '') {
            const filteredProducts = productList.filter(product => product.company === selectedCompany.value)
            setProducts(filteredProducts)
        }
    }, [selectedCompany])

    useEffect(() => {
        if (toggledClearRows === true) {
            setToggleClearRows(false)
        }
    }, [toggledClearRows])

    const handleSelection = ({ selectedRows }) => {
        setCopyButtonText('Copy & Update')
        setSelectedProducts(selectedRows)
    };

    const handleModeChange = (event) => {
        if (event.target.checked === false) {
            setMode('Update Mode')
        } else {
            setMode('Order Mode')
        }
    };

    const handleTextarea = (event) => {
        setCopyButtonText('Copy & Update')
        setTextareaValue(event.target.value)
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(TextareaValue)
        setAlertMessage({ message: 'Copied to clipboard', type: 'success' })
        setCopyButtonText('Update')
        console.log(selectedProducts);
    }

    const handleUpdate = async () => {
        setIsTableLoading(true);
        if (window.confirm('Want to update the status')) {
            const list = selectedProducts.map(product => {
                return {
                    _id: product._id,
                    status: product.status === 'complete' ? 'pending' : 'complete'
                }
            })
            const response = await fetchData('statusUpdate', 'PUT', list)
            console.log(response);
            if (response.status === 'success') {
                setCopyButtonText('Copied & Updated')
                setSelectedProducts([])
                setTextareaValue(null)
                setToggleClearRows(true)
                setAlertMessage({ message: `${response.data.nModified} Status updated successfully`, type: 'success' })
                //change the status of the products as same as selected products
                const updatedProductList = productList.map(product => {
                    const selectedProduct = selectedProducts.find(selectedProduct => selectedProduct._id === product._id)
                    if (selectedProduct) {
                        return {
                            ...product,
                            status: selectedProduct.status === 'complete' ? 'pending' : 'complete'
                        }
                    }
                    return product
                })
                const updatedProducts = products.map(product => {
                    const selectedProduct = selectedProducts.find(selectedProduct => selectedProduct._id === product._id)
                    if (selectedProduct) {
                        return {
                            ...product,
                            status: selectedProduct.status === 'complete' ? 'pending' : 'complete'
                        }
                    }
                    return product
                })
                setProducts(updatedProducts)
                setProductList(updatedProductList)
                setSelectedCompany(selectedCompany)
            }
            else {
                setAlertMessage({ message: response.message, type: 'error' })
            }
        }
        setIsTableLoading(false);
    }


    useEffect(() => {
        //get the product name and quantity from the selected product and set it to the textarea value so show in textarea
        const selectedProductList = selectedProducts.map(product => {
            return (
                `${product.name} : ${product.quantity}`
            )
        })
        setTextareaValue(selectedProductList.join('\n'))
    }, [selectedProducts])


    return (
        isLoading ?
            <div className="w-full md:w-2/3 lg:w-2/3 flex flex-col items-center justify-center overflow-hidden">
                <Spinner />
            </div>
            :
            (
                <div className="w-full md:w-2/3 lg:w-2/3 flex flex-col items-center overflow-hidden">
                    <h1 className="text-2xl text-black text-center font-bold mt-4 mb-2">All Products <Indicator item={products.length} /></h1>
                    {
                        productList.length > 0 && (
                            <>
                                <Select
                                    id="company"
                                    value={selectedCompany || storeData.companyList[0]}
                                    onChange={(value) => setSelectedCompany(value)}
                                    className="font-bold bg-white py-1 px-2 rounded-md border-gray-600 mt-2 border-2 text-amber-500 w-72"
                                    options={storeData.companyList}
                                />
                                <div className="form-control w-52">
                                    <label className="cursor-pointer label">
                                        <span className="label-text text-black">{mode}</span>
                                        <input type="checkbox" className="toggle toggle-info" onChange={handleModeChange} checked={mode === "Order Mode" ? true : false} />
                                        {
                                            selectedProducts.length > 0 && (
                                                <Indicator item={selectedProducts.length} />
                                            )
                                        }
                                    </label>
                                </div>
                            </>
                        )
                    }
                    <DataTable
                        columns={TableSettings.columns}
                        data={products}
                        expandableRows
                        expandableRowsComponent={TableSettings.ExpandedComponent}
                        className="shortListTable"
                        selectableRows
                        selectableRowsHighlight
                        onSelectedRowsChange={handleSelection}
                        clearSelectedRows={toggledClearRows}
                    />
                    {alertMessage.type === 'error' && <Alert message={alertMessage.message} className="bg-red-500" />}
                    {alertMessage.type === 'success' && <Alert message={alertMessage.message} className="bg-green-600" />}
                    {
                        selectedProducts.length > 0 && (
                            <>
                                <textarea className="textarea textarea-primary bg-white text-black my-4 w-3/4 resize-y" value={TextareaValue} onChange={handleTextarea} ></textarea>
                                <button className={`btn btn-wide btn-primary outline ${isTableLoading ? 'loading' : ""}`} onClick={copyButtonText === "Update" ? handleUpdate : handleCopy}>{copyButtonText}</button>
                            </>
                        )
                    }
                </div>
            )

    )
}

export default AllProducts;