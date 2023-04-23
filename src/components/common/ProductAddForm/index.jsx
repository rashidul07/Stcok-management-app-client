import { useEffect, useState } from "react";
import { deletePermanently, handleProductSubmit, margeArray, updateTheConstructor } from "../../Helper/AddProductHandler";
import { storeData } from "../../Helper/storeData";
import UseContext from "../../contexts/UseContext";
import InputFieldsContainer from "../InputFieldsContainer";
import LocalStorageProduct from "../LocalStorageProduct";

const ProductAddForm = ({ productType }) => {
    const [productDetails, setProductDetails] = useState(productType === 'stock' ? { quantity: 1, quantityHome: 0, invoiceDiscount: 14.20, extraDiscount: 0 } : { quantity: 1 });
    const [localProducts, setLocalProducts] = useState([]);
    const [deletedProduct, setDeletedProduct] = useState([]);
    const [modifiedProductList, setModifiedProductList] = useState([]);
    const { productList, user, setProductList, getStockProductList, getProductList, alertMessage, setAlertMessage, changeFieldData, setChangeFieldData } = UseContext();
    const [isLoading, setIsLoading] = useState(false);
    const productLength = productList.length

    // initial state to check the local storage for product list and deleted product list
    useEffect(() => {
        if (productType === 'stock')
            setLocalProducts(JSON.parse(localStorage.getItem("stockList")) || []);
        else {
            setLocalProducts(JSON.parse(localStorage.getItem("productList")) || []);
            setDeletedProduct(JSON.parse(localStorage.getItem("deletedProduct")) || []);
        }
    }, []);

    useEffect(() => {
        if (productType === 'stock')
            getStockProductList();
        else
            getProductList();
    }, [user]);

    // if product details change then alert message will be empty
    useEffect(() => {
        setAlertMessage({ message: '', type: '' });
    }, [productDetails]);

    // if local product list change then update the modified product list for the autocomplete
    useEffect(() => {
        if (localProducts.length > 0)
            setModifiedProductList(margeArray(localProducts, modifiedProductList));
    }, [localProducts])

    //set modified product list for the autocomplete initially
    useEffect(() => {
        setModifiedProductList(margeArray(localProducts, productList));
    }, [productList]);

    // to update the constructor dependency array 
    useEffect(() => {
        updateTheConstructor(
            productDetails,
            setProductDetails,
            setAlertMessage,
            localProducts,
            setLocalProducts,
            deletedProduct,
            setDeletedProduct,
            setIsLoading,
            user,
            productList,
            setProductList,
            productType,
            modifiedProductList,
            setModifiedProductList,
            changeFieldData,
            setChangeFieldData
        );
    }, [productDetails, localProducts, deletedProduct, alertMessage, user, productList])
    console.log(localProducts);
    return (
        <InputFieldsContainer
            title={productType === 'stock' ? 'Stock' : 'Product'}
            productLength={productLength}
            options={productType === 'stock' ? storeData.stockCompanyList : storeData.companyList}
            productDetails={productDetails}
            setProductDetails={setProductDetails}
            modifiedProductList={modifiedProductList}
        >
            {
                productType === 'stock' ?
                    <>
                        <LocalStorageProduct localProducts={localProducts} storageName="stockList" setLocalProducts={setLocalProducts} buttonText="Submit" isLoading={isLoading} btnOnClick={handleProductSubmit} />
                        <p className="text-center mt-6">
                            Total Product Price : {localProducts.reduce((total, product) => total + (product.totalPrice), 0).toFixed(2)}
                        </p>
                    </>
                    : (
                        <>
                            <LocalStorageProduct localProducts={localProducts} storageName="productList" setLocalProducts={setLocalProducts} buttonText="Submit" btnOnClick={handleProductSubmit} isLoading={isLoading} />
                            <LocalStorageProduct localProducts={deletedProduct} storageName="deletedProduct" setLocalProducts={setDeletedProduct} buttonText="Delete permanently" btnOnClick={deletePermanently} isLoading={isLoading} />
                        </>
                    )
            }
        </InputFieldsContainer>
    )
}

export default ProductAddForm;