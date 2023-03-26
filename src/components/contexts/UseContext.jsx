import { useContext } from 'react';
import { AuthContext } from './AuthContext';

export default function UseContext() {
    const { login,
        user,
        isLoading,
        error,
        logOut,
        googleLogin,
        createUser,
        productList,
        setProductList
    } = useContext(AuthContext);
    console.log(user);
    return {
        error,
        user,
        logOut,
        login,
        isLoading,
        googleLogin,
        createUser,
        productList,
        setProductList
    }
}
