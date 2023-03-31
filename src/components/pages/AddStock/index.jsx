import React, { useEffect, useState } from 'react';
import InputFieldsContainer from '../../common/InputFieldsContainer';
import LocalStorageProduct from '../../common/LocalStrorageProduct';
import UseContext from '../../contexts/UseContext';
import { handleProductSubmit, margeArray, updateTheConstructor } from '../../Helper/AddProductHandler';
import { storeData } from '../../Helper/storeData';

export default function AddStock() {
  const [productDetails, setProductDetails] = useState({ quantity: 1, invoiceDiscount: 14.20, extraDiscount: 0 });
  const [modifiedProductList, setModifiedProductList] = useState([]);
  const [warningMessage, setWarningMessage] = useState({ message: '', type: '' });
  const [localProducts, setLocalProducts] = useState([]);
  const [deletedProduct, setDeletedProduct] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { productList, user, getStockProductList, setProductList } = UseContext()
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
    setModifiedProductList(margeArray(localProducts, productList));
  }, [productList]);

  useEffect(() => {
    setModifiedProductList(margeArray(localProducts, modifiedProductList));
  }, [localProducts])

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
      setProductList,
      'stock'
    );
  }, [productDetails, localProducts, deletedProduct, warningMessage, user, productList])

  return (
    <>
      <InputFieldsContainer
        title="Stock"
        productLength={productLength}
        options={storeData.stockCompanyList}
        productDetails={productDetails}
        setProductDetails={setProductDetails}
        modifiedProductList={modifiedProductList}
        warningMessage={warningMessage}
      >
        <LocalStorageProduct localProducts={localProducts} storageName="stockList" setLocalProducts={setLocalProducts} buttonText="Submit" isLoading={isLoading} btnOnClick={handleProductSubmit} />
      </InputFieldsContainer>
    </>
  )
}

