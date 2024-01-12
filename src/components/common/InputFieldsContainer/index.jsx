import { Indicator } from "../../Libs/Indicator";
import UseContext from "../../contexts/UseContext";
import InputFields from "../InputFields";
const InputFieldsContainer = ({
    modifiedProductList,
    productDetails,
    setProductDetails,
    options,
    localProducts,
    children
}) => {
    const { productType, setProductType, stockProduct, shortProduct, setAlertMessage } = UseContext();
    const handleProductType = () => {
        if (localProducts.length > 0) {
            setAlertMessage({ message: "You can't change the product type when you have some product in the list", type: 'error' });
            return;
        }
        if (productType === 'short')
            setProductType('stock');
        else
            setProductType('short');
    }

    return (
        <div className="p-12 md:m-auto md:border-2 max-sm:w-screen">
            <h1 className="text-2xl font-bold mb-4 text-center text-black">
                {productType === 'short' ? 'Short' : "Stock"} Product <Indicator item={productType === 'stock' ? stockProduct.length : shortProduct.length} />
            </h1>
            {/* <label className="cursor-pointer label justify-center gap-2 bg-cyan-200 mb-4">
                <span className="label-text text-black">{productType === 'short' ? "Short Product" : "Stock Product"}</span>
                <input type="checkbox" className="toggle toggle-info" onChange={handleProductType} checked={productType === 'short' ? true : false} />
            </label> */}
            <InputFields
                modifiedProductList={modifiedProductList}
                productDetails={productDetails}
                setProductDetails={setProductDetails}
                options={options}
                productType={productType}
            />
            {children}
        </div>
    );
}

export default InputFieldsContainer;
