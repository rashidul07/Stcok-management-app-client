import { useEffect, useState } from "react";
import DisplayProduct from "../../common/DisplayProduct";
import UseContext from "../../contexts/UseContext";
import { handleCompanyChange, prepareTextareaValue, updateAllProductConstructor } from "../../Helper/AllProductsHandler";

const AllProducts = () => {
    const { productList, user, getProductList, setProductList, alertMessage, setAlertMessage } = UseContext()
    const [selectedCompany, setSelectedCompany] = useState(null)
    const [products, setProducts] = useState(productList)
    const [selectedProducts, setSelectedProducts] = useState([])
    const [TextareaValue, setTextareaValue] = useState(null)
    const [isTableLoading, setIsTableLoading] = useState(false)
    const [toggledClearRows, setToggleClearRows] = useState(false);
    const [editableRowData, setEditableRowData] = useState({})

    useEffect(() => {
        updateAllProductConstructor(
            selectedCompany,
            setSelectedCompany,
            products,
            setProducts,
            productList,
            setProductList,
            TextareaValue,
            setTextareaValue,
            selectedProducts,
            setSelectedProducts,
            setAlertMessage,
            setIsTableLoading,
            setToggleClearRows,
            editableRowData,
            setEditableRowData,
            user
        )
    }, [selectedCompany, products, TextareaValue, productList, selectedProducts, editableRowData])

    useEffect(() => { getProductList() }, [user]);

    useEffect(() => { if (selectedCompany === null) setProducts(productList) }, [productList])

    useEffect(() => { handleCompanyChange() }, [selectedCompany])

    useEffect(() => { if (toggledClearRows === true) setToggleClearRows(false) }, [toggledClearRows])

    useEffect(() => { prepareTextareaValue() }, [selectedProducts])

    return (
        <DisplayProduct
            products={products}
            selectedProducts={selectedProducts}
            selectedCompany={selectedCompany}
            toggledClearRows={toggledClearRows}
            TextareaValue={TextareaValue}
            isTableLoading={isTableLoading}
            editableRowData={editableRowData}
        />
    )
}

export default AllProducts;