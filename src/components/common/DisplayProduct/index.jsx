import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import Select from 'react-select';
import { handleCompanyChange, handleCopy, handleRowClicked, handleSelectedProductDelete, handleSelection, handleSetCompany, handleTextarea, handleUpdate, prepareTextareaValue, updateAllProductConstructor } from '../../Helper/AllProductsHandler';
import { storeData } from '../../Helper/storeData';
import Alert from '../../Libs/Alert';
import { Indicator } from "../../Libs/Indicator";
import ProductEditModal from '../../Libs/ProductEditModal';
import Spinner from "../../Libs/Spinner";
import UseContext from "../../contexts/UseContext";
import TableSettings from '../../pages/AllProducts/TableSettings';

const DisplayProduct = () => {
    const { user, alertMessage, setAlertMessage, isLoading, productType, setProductType, stockProduct, shortProduct, setShortProduct, setStockProduct, setIsLoading } = UseContext()
    const [mode, setMode] = useState('Delete Mode');
    const [selectedCompany, setSelectedCompany] = useState(null)
    const [products, setProducts] = useState(productType === 'short' ? shortProduct : stockProduct)
    const [selectedProducts, setSelectedProducts] = useState([])
    const [TextareaValue, setTextareaValue] = useState(null)
    const [isTableLoading, setIsTableLoading] = useState(false)
    const [toggledClearRows, setToggleClearRows] = useState(false);
    const [editableRowData, setEditableRowData] = useState({})
    const [footer, setFooter] = useState({})

    const handleProductType = () => {
        if (selectedProducts.length > 0) {
            setAlertMessage({ message: "You can't change the product type when you have some product in the list", type: 'error' });
            return;
        }
        setIsLoading(true);
        if (productType === 'short')
            setProductType('stock');
        else
            setProductType('short');
        setTimeout(() => {
            setIsLoading(false);
        })
    }

    useEffect(() => {
        updateAllProductConstructor(
            selectedCompany,
            setSelectedCompany,
            products,
            setProducts,
            productType === 'short' ? shortProduct : stockProduct,
            productType === 'short' ? setShortProduct : setStockProduct,
            TextareaValue,
            setTextareaValue,
            selectedProducts,
            setSelectedProducts,
            setAlertMessage,
            setIsTableLoading,
            setToggleClearRows,
            editableRowData,
            setEditableRowData,
            user,
            productType,
        )
    }, [selectedCompany, products, shortProduct, stockProduct, TextareaValue, selectedProducts, editableRowData, productType])

    useEffect(() => { if (selectedCompany === null) setProducts(productType === 'short' ? shortProduct : stockProduct) }, [shortProduct, stockProduct])

    useEffect(() => {
        if (productType === 'stock' && products.length > 0) {
            if (selectedCompany === null || selectedCompany === '') {
                const footer = {
                    label: '-Total-',
                    quantity: products.reduce((acc, item) => acc + (item.company !== 'rashu' ? item.quantity + (item.quantityHome || 0) : 0), 0),
                    company: '-',
                    price: Math.round(products.reduce((acc, item) => acc + (item.company !== 'rashu' ? item.price : 0), 0)),
                    invoiceDiscountPrice: Math.round(products.reduce((acc, item) => acc + (item.company !== 'rashu' ? item.invoiceDiscountPrice : 0), 0)),
                    extraDiscountPrice: Math.round(products.reduce((acc, item) => acc + (item.company !== 'rashu' ? item.extraDiscountPrice : 0), 0)),
                    totalPrice: Math.round(products.reduce((acc, item) => acc + (item.company !== 'rashu' ? item.totalPrice : 0), 0)),
                }
                setFooter(footer)
            } else {
                const footer = {
                    label: '-Total-',
                    quantity: products.reduce((acc, item) => acc + (item.quantity + (item.quantityHome || 0)), 0),
                    company: '-',
                    price: Math.round(products.reduce((acc, item) => acc + item.price, 0)),
                    invoiceDiscountPrice: Math.round(products.reduce((acc, item) => acc + item.invoiceDiscountPrice, 0)),
                    extraDiscountPrice: Math.round(products.reduce((acc, item) => acc + item.extraDiscountPrice, 0)),
                    totalPrice: Math.round(products.reduce((acc, item) => acc + item.totalPrice, 0)),
                }
                setFooter(footer)
            }
        }
    }, [products])

    useEffect(() => { handleCompanyChange() }, [selectedCompany])

    useEffect(() => { if (toggledClearRows === true) setToggleClearRows(false) }, [toggledClearRows])

    useEffect(() => { prepareTextareaValue() }, [selectedProducts])

    useEffect(() => {
        setProducts(productType === 'short' ? shortProduct : stockProduct)
        setSelectedCompany(null)
    }, [productType])

    const handleModeChange = (event) => {
        if (event.target.checked === false) {
            setMode('Delete Mode')
        } else {
            setMode('Update Mode')
        }
    };

    return (
        isLoading ?
            <div className="w-full md:w-2/3 lg:w-2/3 flex flex-col items-center justify-center overflow-hidden">
                <Spinner />
            </div>
            :
            (
                <div className="w-full md:w-2/3 lg:w-2/3 flex flex-col items-center overflow-hidden">
                    <h1 className="text-2xl text-black text-center font-bold mt-4 mb-2">
                        All {productType === 'short' ? 'Short' : 'Stock'} Products <Indicator item={products.length} />
                        {selectedProducts.length > 0 && <Indicator item={selectedProducts.length} className='bg-indigo-600 ml-2' />}
                    </h1>
                    {
                        <Select
                            id="company"
                            value={selectedCompany || storeData.companyList[0]}
                            onChange={(value) => handleSetCompany(value)}
                            className="font-bold bg-white py-1 px-2 rounded-md border-gray-600 my-2 border-2 text-amber-500 w-72"
                            options={productType === 'short' ? storeData.companyList : storeData.stockCompanyList}
                        />
                    }
                    {
                        products.length > 0 && (
                            <div className="form-control jus">
                                <label className="cursor-pointer label">
                                    <span className="label-text text-black mr-2">{mode}</span>
                                    <input type="checkbox" className="toggle toggle-info mr-2" onChange={handleModeChange} checked={mode === "Update Mode" ? true : false} />
                                    <span className="label-text text-black mr-2">{productType === 'short' ? "Short Product" : "Stock Product"}</span>
                                    <input type="checkbox" className="toggle toggle-info" onChange={handleProductType} checked={productType === 'short' ? true : false} />
                                </label>
                            </div>
                        )
                    }
                    <DataTable
                        columns={productType === 'short' ? TableSettings.shortProductColumns : TableSettings.stockProductColumns}
                        data={(products.length && productType === 'stock' && Object.keys(footer).length > 0) ? [...products, footer] : products}
                        keyField="_id"
                        expandableRows
                        expandableRowsComponent={TableSettings.ExpandedComponent}
                        className={productType === 'short' ? 'shortListTable' : 'stockListTable'}
                        selectableRows
                        selectableRowsHighlight
                        onSelectedRowsChange={handleSelection}
                        clearSelectedRows={toggledClearRows}
                        conditionalRowStyles={TableSettings.conditionalRowStyles}
                        onRowClicked={handleRowClicked}
                    />
                    {alertMessage.type === 'error' && <Alert message={alertMessage.message} className="bg-red-500" />}
                    {alertMessage.type === 'success' && <Alert message={alertMessage.message} className="bg-green-600" />}
                    {
                        selectedProducts.length > 0 &&
                        <div className="relative w-3/4 mb-3">
                            <textarea className="textarea relative textarea-primary bg-white text-black my-4 w-full resize-y" value={TextareaValue || ''} onChange={handleTextarea} ></textarea>
                            <button className="btn btn-circle copyButton order-none" style={{ backgroundColor: "transparent", borderColor: "transparent", boxShadow: "none", color: "inherit", outline: "none" }} onClick={handleCopy}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 6H5a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-4M16 2H9a2 2 0 00-2 2v12a2 2 0 002 2h7m5-5H9a2 2 0 00-2 2m2-2h2m-2 2h2m-2 2h2m5-5a2 2 0 01-2 2m-2-2h2m-2 2h2" />
                                </svg>
                            </button>
                            <button className={`btn w-full btn-primary outline ${isTableLoading ? "loading" : ""}`} onClick={mode === 'Update Mode' ? handleUpdate : handleSelectedProductDelete}>{mode === 'Update Mode' ? 'Update Status' : 'Delete Products'}</button>
                        </div>
                    }
                    <ProductEditModal product={editableRowData} isTableLoading={isTableLoading} />
                </div>
            )

    )
}

export default DisplayProduct;