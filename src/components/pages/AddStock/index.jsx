import React, { useEffect, useState } from 'react';
import InputFieldsContainer from '../../common/InputFieldsContainer';
import LocalStorageProduct from '../../common/LocalStrorageProduct';
import UseContext from '../../contexts/UseContext';
import { handleProductSubmit, margeArray, updateTheConstructor } from '../../Helper/AddProductHandler';
import { storeData } from '../../Helper/storeData';

export default function AddStock() {
  const [productDetails, setProductDetails] = useState({ quantity: 1, invoiceDiscount: 14.20, extraDiscount: 0 });
  const [modifiedProductList, setModifiedProductList] = useState([]);
  const [localProducts, setLocalProducts] = useState([]);
  const [deletedProduct, setDeletedProduct] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { productList, user, getStockProductList, setProductList, alertMessage, setAlertMessage } = UseContext()
  const productLength = productList.length

  // initial state to check the local storage for product list and deleted product list
  useEffect(() => {
    setLocalProducts(JSON.parse(localStorage.getItem("stockList")) || []);
  }, []);

  useEffect(() => {
    getStockProductList();
  }, [user]);

  // to show the alert if the product is not filled
  useEffect(() => {
    setAlertMessage({ message: '', type: '' });
  }, [productDetails]);

  useEffect(() => {
    setModifiedProductList(margeArray(localProducts, productList));
  }, [productList]);

  useEffect(() => {
    setModifiedProductList(margeArray(localProducts, modifiedProductList));
  }, [localProducts])

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
      'stock'
    );
  }, [productDetails, localProducts, deletedProduct, alertMessage, user, productList])

  return (
    <>
      <InputFieldsContainer
        title="Stock"
        productLength={productLength}
        options={storeData.stockCompanyList}
        productDetails={productDetails}
        setProductDetails={setProductDetails}
        modifiedProductList={modifiedProductList}
      >
        <LocalStorageProduct localProducts={localProducts} storageName="stockList" setLocalProducts={setLocalProducts} buttonText="Submit" isLoading={isLoading} btnOnClick={handleProductSubmit} />
      </InputFieldsContainer>
    </>
  )
}

