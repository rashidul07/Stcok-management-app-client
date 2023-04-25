import DisplayProduct from "../../common/DisplayProduct";
import UseContext from "../../contexts/UseContext";

const AllProducts = () => {
    const { productType } = UseContext();
    return (
        <DisplayProduct />
    )
}

export default AllProducts;