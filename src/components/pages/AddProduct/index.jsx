import React, { useEffect, useState } from "react";
import InputFieldsContainer from "../../common/InputFieldsContainer";
import LocalStorageProduct from "../../common/LocalStrorageProduct";
import UseContext from "../../contexts/UseContext";
import { deletePermanently, handleProductSubmit, margeArray, updateTheConstructor } from "../../Helper/AddProductHandler";
import { storeData } from "../../Helper/storeData";
function AddProductPage() {
    const [productDetails, setProductDetails] = useState({ quantity: 1 });
    const [localProducts, setLocalProducts] = useState([]);
    const [deletedProduct, setDeletedProduct] = useState([]);
    const [modifiedProductList, setModifiedProductList] = useState([]); // only for testing purpose .. need to change the name to label of database product
    const { productList, user, setProductList, getProductList } = UseContext()
    const productLength = productList.length
    const [warningMessage, setWarningMessage] = useState({ message: '', type: '' });
    const [isLoading, setIsLoading] = useState(false);

    // initial state to check the local storage for product list and deleted product list
    useEffect(() => {
        setLocalProducts(JSON.parse(localStorage.getItem("productList")) || []);
        setDeletedProduct(JSON.parse(localStorage.getItem("deletedProduct")) || []);
    }, []);

    useEffect(() => {
        getProductList();
    }, [user]);

    // to show the alert if the product is not filled
    useEffect(() => {
        setWarningMessage('');
    }, [productDetails]);

    // remove the alert after 3 seconds
    useEffect(() => {
        if (warningMessage.type === 'error') {
            setTimeout(() => {
                setWarningMessage({ message: '', type: '' });
            }, 3000);
        }

        if (warningMessage.type === 'success') {
            setTimeout(() => {
                setWarningMessage({ message: '', type: '' });
                window.location.reload();
            }, 10000);
        }
    }, [warningMessage.message]);

    useEffect(() => {
        const modifiedData = productList.map(product => {
            return (
                {
                    ...product,
                    label: product.name
                }
            )
        })
        setModifiedProductList(margeArray(localProducts, modifiedData));
    }, [productList]);

    // demo product list for testing purpose will be updated with the database product list
    useEffect(() => {
        setModifiedProductList(margeArray(localProducts, modifiedProductList));
    }, [localProducts])

    // to update the constructor dependency array 
    useEffect(() => {
        updateTheConstructor(
            productDetails,
            setProductDetails,
            setWarningMessage,
            localProducts,
            setLocalProducts,
            deletedProduct,
            setDeletedProduct,
            setIsLoading,
            user,
            productList,
            setProductList
        );
    }, [productDetails, localProducts, deletedProduct, warningMessage, user, productList])

    return (
        <InputFieldsContainer
            title="Product"
            productLength={productLength}
            modifiedProductList={modifiedProductList}
            productDetails={productDetails}
            setProductDetails={setProductDetails}
            warningMessage={warningMessage}
            handleProductSubmit={handleProductSubmit}
            options={storeData.companyList}
        >
            <>
                <LocalStorageProduct localProducts={localProducts} storageName="productList" setLocalProducts={setLocalProducts} buttonText="Submit" isLoading={isLoading} btnOnClick={handleProductSubmit} />
                <LocalStorageProduct localProducts={deletedProduct} storageName="deletedProduct" setLocalProducts={setDeletedProduct} buttonText="Delete permanently" btnOnClick={deletePermanently} isLoading={isLoading} />
            </>
        </InputFieldsContainer>
    );
}

export default AddProductPage;
