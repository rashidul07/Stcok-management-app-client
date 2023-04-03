import { Indicator } from "../../Libs/Indicator";
import InputFields from "../InputFields";
const InputFieldsContainer = ({
    title,
    productLength,
    modifiedProductList,
    productDetails,
    setProductDetails,
    options,
    children
}) => {
    return (
        <div className="p-12 md:m-auto md:border-2 max-sm:w-screen">
            <h1 className="text-2xl font-bold mb-4 text-center text-black">Add {title} <Indicator item={productLength} /></h1>
            <InputFields
                modifiedProductList={modifiedProductList}
                productDetails={productDetails}
                setProductDetails={setProductDetails}
                options={options}
                title={title}
            />
            {children}
        </div>
    );
}

export default InputFieldsContainer;
