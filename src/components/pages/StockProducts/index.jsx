import { useEffect } from "react";
import DisplayProduct from "../../common/DisplayProduct";
import UseContext from "../../contexts/UseContext";

const StockProducts = () => {
    const { user } = UseContext();
    //redirect if user not admin
    useEffect(() => {
        if (user.email !== 'rashed@rmc.com') {
            window.location.pathname = '/';
        }
    }, [user]);
    return (
        <DisplayProduct type="stock" />
    )
}

export default StockProducts;