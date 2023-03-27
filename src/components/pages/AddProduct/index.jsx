import React, { useEffect, useState } from "react";
import LocalStorageProduct from "../../common/LocalStrorageProduct";
import ProductAddForm from "../../common/ProductAddForm";
import UseContext from "../../contexts/UseContext";
import { deletePermanently, handleProductSubmit, margeArray, updateTheConstructor } from "../../Helper/AddProductHandler";
import { Indicator } from "../../Libs/Indicator";

function AddProductPage() {
    const [productDetails, setProductDetails] = useState({ quantity: 1 });
    const [localProducts, setLocalProducts] = useState([]);
    const [deletedProduct, setDeletedProduct] = useState([]);
    const [modifiedProductList, setModifiedProductList] = useState([]); // only for testing purpose .. need to change the name to label of database product
    const { productList, user, setProductList } = UseContext()
    const productLength = productList.length
    const [warningMessage, setWarningMessage] = useState({ message: '', type: '' });
    const [isLoading, setIsLoading] = useState(false);

    // initial state to check the local storage for product list and deleted product list
    useEffect(() => {
        setLocalProducts(JSON.parse(localStorage.getItem("productList")) || []);
        setDeletedProduct(JSON.parse(localStorage.getItem("deletedProduct")) || []);
    }, []);

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
        <div className="p-12 md:m-auto md:border-2 max-sm:w-screen">
            <h1 className="text-2xl font-bold mb-4 text-center text-black">Add Product <Indicator item={productLength} /></h1>
            <ProductAddForm
                modifiedProductList={modifiedProductList}
                productDetails={productDetails}
                setProductDetails={setProductDetails}
                warningMessage={warningMessage}
            />
            <LocalStorageProduct localProducts={localProducts} storageName="productList" setLocalProducts={setLocalProducts} buttonText="Submit" isLoading={isLoading} btnOnClick={handleProductSubmit} />
            <LocalStorageProduct localProducts={deletedProduct} storageName="deletedProduct" setLocalProducts={setDeletedProduct} buttonText="Delete permanently" btnOnClick={deletePermanently} isLoading={isLoading} />
        </div>
    );
}

export default AddProductPage;
