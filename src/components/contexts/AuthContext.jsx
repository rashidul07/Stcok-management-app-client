import { createUserWithEmailAndPassword, getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from "firebase/auth";
import React, { createContext, useEffect, useState } from 'react';
import fetchData from "../Helper/HandleApi";
import firebaseInit from './firebase';
export const AuthContext = createContext();

firebaseInit();
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({})
  const [error, setError] = useState('')
  const auth = getAuth();
  const [isLoading, setIsLoading] = useState(true)
  const [productList, setProductList] = useState([])

  const getProductList = async () => {
    if (user.email) {
      const response = await fetchData('productList', 'GET')
      if (response.status === 'success') {
        setProductList(response.data)
      }
      if (response.status === 'error') {
        setError(response);
      }
    }
  }

  const getStockProductList = async () => {
    if (user.email) {
      const response = await fetchData('stockList', 'GET')
      if (response.status === 'success') {
        setProductList(response.data)
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

  const value = {
    error,
    user,
    logOut,
    login,
    isLoading,
    googleLogin,
    createUser,
    productList,
    setProductList,
    getProductList,
    getStockProductList
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
