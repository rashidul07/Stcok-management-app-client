import { createUserWithEmailAndPassword, getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from "firebase/auth";
import React, { createContext, useEffect, useState } from 'react';
import fetchData from "../Helper/HandleApi";
import firebaseInit from './firebase';
export const AuthContext = createContext();

firebaseInit();
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({})
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [shortProduct, setShortProduct] = useState([])
  const [stockProduct, setStockProduct] = useState([])
  const [productType, setProductType] = useState('short')
  const [productList, setProductList] = useState([])
  const [currentDataType, setCurrentDataType] = useState('')
  const [alertMessage, setAlertMessage] = useState({ message: '', type: '' });
  const [changeFieldData, setChangeFieldData] = useState(JSON.parse(localStorage.getItem(`${productType}changeFieldData`)) || []);
  const [productHistory, setProductHistory] = useState([]);
  const [stockProductHistory, setStockProductHistory] = useState([]);
  const [productLength, setProductLength] = useState({});
  const auth = getAuth();

  const getAllProduct = async () => {
    if (!user.email) {
      setError('Please login first')
      return;
    }

    setIsLoading(true)
    const response = await fetchData('productList', 'GET', {}, { type: 'product', user: user.email })
    if (response.status === 'success') {
      const modifiedData = response.data.map(product => {
        if (!product.label) {
          return { ...product, label: product.name, id: product._id }
        } else if (!product.name) {
          return { ...product, name: product.label, id: product._id }
        } else {
          return { ...product, id: product._id };
        }
      })
      setShortProduct(modifiedData)
    }
    if (response.status === 'error') {
      setError(response);
    }
    const stockResponse = await fetchData('productList', 'GET', {}, { type: 'stock', user: user.email })
    if (stockResponse.status === 'success') {
      const modifiedData = stockResponse.data.map(product => {
        if (!product.label) {
          return { ...product, label: product.name, id: product._id }
        } else if (!product.name) {
          return { ...product, name: product.label, id: product._id }
        } else {
          return { ...product, id: product._id };
        }
      })
      setStockProduct(modifiedData)
    }
    if (stockResponse.status === 'error') {
      setError(stockResponse);
    }
    setIsLoading(false)
  }



  const getProductList = async () => {
    if (user.email && currentDataType !== 'product') {
      setProductList([])
      setIsLoading(true)
      const response = await fetchData('productList', 'GET', {}, { type: 'product', user: user.email })
      if (response.status === 'success') {
        const modifiedData = response.data.map(product => {
          if (!product.label)
            return { ...product, label: product.name, id: product._id }
          return { ...product, id: product._id }
        })
        setProductList(modifiedData)
        setCurrentDataType('product')
      }
      if (response.status === 'error') {
        setError(response);
      }
      setIsLoading(false)
    }
  }

  const getStockProductList = async () => {
    if (user.email && currentDataType !== 'stock') {
      setProductList([])
      setIsLoading(true)
      const response = await fetchData('productList', 'GET', {}, { type: 'stock', user: user.email })
      if (response.status === 'success') {
        setProductList(response.data)
        setCurrentDataType('stock')
      }
      if (response.status === 'error') {
        setError(response);
      }
      setIsLoading(false)
    }
  }

  const getAllHistory = async () => {
    //call both getHistory and getStockHistory api and set the data
    if (user.email) {
      setIsLoading(true)
      const response = await fetchData('getHistory', 'GET', {}, { user: user.email })
      if (response.status === 'success') {
        setProductHistory(response.data)
      }
      if (response.status === 'error') {
        setError(response);
      }
      const stockResponse = await fetchData('getStockHistory', 'GET', {}, { user: user.email })
      if (stockResponse.status === 'success') {
        setStockProductHistory(stockResponse.data)
      }
      if (stockResponse.status === 'error') {
        setError(stockResponse);
      }
      setIsLoading(false)
    }
  }

  const getProductsLength = async () => {
    if (user.email) {
      const response = await fetchData('getProductsLength', 'GET', {}, { user: user.email })
      if (response.status === 'success') {
        setProductLength(response.data)
      }
      if (response.status === 'error') {
        setError(response);
      }
    }
  }

  const logOut = () => {
    signOut(auth)
      .then(res => {
        //user signOut
        setError('')
      })
      .catch(err => {
        setError(err.message)
      })
  }

  const login = (email, password) => {
    setIsLoading(true)
    signInWithEmailAndPassword(auth, email, password)
      .then(res => {
        setUser(res.user)
        setError('')
        setIsLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setUser('')
        setIsLoading(false)
      })
  }

  const googleProvider = new GoogleAuthProvider();

  const googleLogin = () => {
    return signInWithPopup(auth, googleProvider)
  }

  const createUser = (email, password, userName) => {
    setIsLoading(true)
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log('user created');
        const user = userCredential.user;
        //update user name
        updateProfile(auth.currentUser, {
          displayName: userName
        }).then(() => {
          console.log('user name updated');
          setIsLoading(false)
        }).catch((error) => {
          setError(error.message)
          setIsLoading(false)
        });
      })
      .catch((error) => {
        setError(error.message)
        setIsLoading(false)
      });
  }

  useEffect(() => {
    if (user.email) {
      getAllProduct();
    }
  }, [user])

  useEffect(() => {
    setChangeFieldData(JSON.parse(localStorage.getItem(`${productType}changeFieldData`)) || [])
  }, [productType])

  useEffect(() => {
    setIsLoading(true)
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setError('')
        setUser(user)
        setIsLoading(false)
      } else {
        setUser('')
        setIsLoading(false)
      }
    });
  }, [auth])

  useEffect(() => {
    if (alertMessage.type === 'error') {
      setTimeout(() => {
        setAlertMessage({ message: '', type: '' });
      }, 3000);
    }

    if (alertMessage.type === 'success') {
      setTimeout(() => {
        setAlertMessage({ message: '', type: '' });
      }, 10000);
    }
  }, [alertMessage.message]);

  const value = {
    error,
    user,
    logOut,
    login,
    isLoading,
    setIsLoading,
    googleLogin,
    createUser,
    productList,
    setProductList,
    getProductList,
    getStockProductList,
    alertMessage,
    setAlertMessage,
    changeFieldData,
    setChangeFieldData,
    productHistory,
    stockProductHistory,
    getAllHistory,
    getProductsLength,
    productLength,
    shortProduct,
    setShortProduct,
    stockProduct,
    setStockProduct,
    productType,
    setProductType,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
