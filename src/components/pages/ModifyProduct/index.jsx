import { useEffect, useState } from "react";
import AddedProductList from "./AddedProductList";
import RemoveForm from "./RemoveForm";

const ModifyProduct = () => {
    const [localProducts, setLocalProducts] = useState([]);
    const [productType, setProductType] = useState(null);
    const [totalPrice, setTotalPrice] = useState(0);
    useEffect(() => {
        if (productType && productType.value !== '') {
            setLocalProducts([]);
            const storageModifiedData = JSON.parse(localStorage.getItem(`modified${productType.value}List`));
            if (storageModifiedData && storageModifiedData.length > 0) {
                setLocalProducts(storageModifiedData);
            }
        }
    }, [productType?.value])

    useEffect(() => {
        if (productType && productType.value !== '') {
            localStorage.setItem(`modified${productType.value}List`, JSON.stringify(localProducts));
        }
        if (productType?.value === 'stock') {
            let total = 0;
            localProducts.forEach(product => {
                total += product.extraDiscountPrice * product.quantity;
            });
            setTotalPrice(total);
        }
    }, [localProducts])

    return (
        <div className="p-12 md:m-auto md:border-2 max-sm:w-screen">
            <h1 className="text-2xl font-bold mb-4 text-center text-black">Modify Product</h1>
            <RemoveForm localProducts={localProducts} setLocalProducts={setLocalProducts} productType={productType} setProductType={setProductType} />
            <AddedProductList localProducts={localProducts} setLocalProducts={setLocalProducts} productType={productType} totalPrice={totalPrice} />
        </div>
    );
}

export default ModifyProduct;