import { useEffect, useState } from "react";
import { deletePermanently, handleProductSubmit, margeArray, updateTheConstructor } from "../../Helper/AddProductHandler";
import { storeData } from "../../Helper/storeData";
import UseContext from "../../contexts/UseContext";
import InputFieldsContainer from "../InputFieldsContainer";
import LocalStorageProduct from "../LocalStorageProduct";

const ProductAddForm = () => {
    const { user, setAlertMessage, changeFieldData, setChangeFieldData, productType, shortProduct, setShortProduct, stockProduct, setStockProduct, isLoading, setIsLoading } = UseContext();
    const [productDetails, setProductDetails] = useState({});
    const [localProducts, setLocalProducts] = useState([]);
    const [deletedProduct, setDeletedProduct] = useState([]);
    const [modifiedProductList, setModifiedProductList] = useState([]);

    // initial state to check the local storage for product list and deleted product list
    useEffect(() => {
        if (productType === 'stock')
            setLocalProducts(JSON.parse(localStorage.getItem("stockList")) || []);
        else {
            setLocalProducts(JSON.parse(localStorage.getItem("productList")) || []);
            setDeletedProduct(JSON.parse(localStorage.getItem("deletedProduct")) || []);
        }
    }, [productType]);

    // if product type change then update the product Details
    useEffect(() => {
        if (productType === 'stock' && stockProduct.length > 0)
            setModifiedProductList(margeArray(localProducts, stockProduct));
        else {
            setModifiedProductList(margeArray(localProducts, shortProduct));
        }
    }, [productType, stockProduct, shortProduct]);

    useEffect(() => {
        setProductDetails(productType === 'stock' ? { quantity: 1, quantityHome: 0, invoiceDiscount: 14.20, extraDiscount: 0 } : { quantity: 1, market: true });
    }, [productType]);

    // if product details change then alert message will be empty
    useEffect(() => {
        setAlertMessage({ message: '', type: '' });
    }, [productDetails]);

    // if local product list change then update the modified product list for the autocomplete
    useEffect(() => {
        if (localProducts.length > 0)
            setModifiedProductList(margeArray(localProducts, modifiedProductList));
    }, [localProducts]);

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
            productType === 'stock' ? stockProduct : shortProduct,
            productType === 'stock' ? setStockProduct : setShortProduct,
            productType,
            changeFieldData,
            setChangeFieldData,
            modifiedProductList,
            setModifiedProductList
        );
    }, [productDetails, localProducts, deletedProduct, user, productType, changeFieldData, modifiedProductList]);

    return (
        <InputFieldsContainer
            modifiedProductList={modifiedProductList}
            productDetails={productDetails}
            setProductDetails={setProductDetails}
            options={productType === 'stock' ? storeData.stockCompanyList : storeData.companyList}
            localProducts={localProducts}
        >
            {
                productType === 'stock' ?
                    <>
                        <LocalStorageProduct localProducts={localProducts} storageName="stockList" setLocalProducts={setLocalProducts} buttonText="Submit" isLoading={isLoading} btnOnClick={handleProductSubmit} />
                        <p className="text-center mt-6">
                            Total Product Price : {localProducts.reduce((total, product) => total + ((product.quantity + (product.quantityHome || 0) - (product.oldQuantity || 0) - (product.oldQuantityHome || 0)) * product.extraDiscountPrice), 0).toFixed(2)}
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