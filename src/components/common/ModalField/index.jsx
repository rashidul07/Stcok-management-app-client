import Select from 'react-select';
import { updateProductPrice } from '../../Helper/AddProductHandler';
import { handleSetEditableRowData } from '../../Helper/AllProductsHandler';
import { storeData } from "../../Helper/storeData";
export default function ModalField({ product }) {
    const customStyles = {
        control: (base, state) => ({
            ...base,
            borderRadius: "6px",
            border: "none",
            minHeight: "unset",
            height: "15px",
            boxShadow: state.isFocused ? null : null,
            borderColor: state.isFocused ? "#80bdff" : base.borderColor,
            "&:hover": {
                borderColor: state.isFocused ? "#80bdff" : base.borderColor
            },
        }),
        indicatorSeparator: () => ({
            display: "none"
        }),
        dropdownIndicator: () => ({
            display: "none"
        })
    };
    return (
        <>
            <div className="flex items-center">
                <input
                    type="text"
                    value={product.name || ""}
                    onChange={(e) => {
                        const updatedProduct = { ...product, label: e.target.value, name: e.target.value };
                        handleSetEditableRowData(updatedProduct);
                    }}
                    className="text-lg text-black bg-white px-2 rounded-md border-gray-600 border-0 w-3/6 mx-1 h-8"
                />
                <Select
                    styles={customStyles}
                    value={product.totalPrice === undefined ? storeData.companyList.find(company => company.value === product.company) : storeData.stockCompanyList.find(company => company.value === product.company)}
                    onChange={(company) => {
                        const updatedProduct = { ...product, company: company.value };
                        handleSetEditableRowData(updatedProduct);
                    }}
                    options={!product.totalPrice === undefined ? storeData.companyList.slice(1) : storeData.stockCompanyList.slice(1)}
                    className="bg-white rounded-md border-gray-600 border-0 w-1/4 mx-1 h-8 min-h-8"
                />
                {
                    product.totalPrice === undefined && (
                        <input
                            type="number"
                            value={product.quantity || ""}
                            onChange={(e) => {
                                const updatedProduct = { ...product, quantity: e.target.value };
                                handleSetEditableRowData(updatedProduct);
                            }}
                            className={`bg-white text-sm px-2 rounded-md border-gray-600 border-0 text-center w-10 h-8`}
                        />
                    )
                }
                {
                    product.totalPrice !== undefined && (
                        <input
                            type="number"
                            value={product.price || ""}
                            onChange={(e) => {
                                const modifiedProduct = { ...product, price: Number(e.target.value) };
                                const updatedProduct = updateProductPrice(modifiedProduct)
                                handleSetEditableRowData(updatedProduct);
                            }}
                            className="bg-white text-sm px-2 rounded-md border-gray-600 border-0 text-center w-20 h-8"
                        />
                    )
                }
            </div>
            {
                product.totalPrice !== undefined && (
                    <div className='flex items-center mt-2'>
                        <input
                            type="number"
                            value={product.invoiceDiscount || ""}
                            placeholder={product.invoiceDiscount === 0 ? "0" : ""}
                            onChange={(e) => {
                                const modifiedProduct = { ...product, invoiceDiscount: Number(e.target.value) };
                                const updatedProduct = updateProductPrice(modifiedProduct)
                                handleSetEditableRowData(updatedProduct);
                            }}
                            className="bg-white text-sm px-2 mr-2 rounded-md border-gray-600 border-0 text-center w-20 h-8"
                        />
                        <input
                            type="number"
                            value={product.extraDiscount || ""}
                            placeholder={product.extraDiscount === 0 ? "0" : ""}
                            onChange={(e) => {
                                const modifiedProduct = { ...product, extraDiscount: Number(e.target.value) };
                                const updatedProduct = updateProductPrice(modifiedProduct)
                                handleSetEditableRowData(updatedProduct);
                            }}
                            className="bg-white text-sm px-2 mr-2 rounded-md border-gray-600 border-0 text-center w-20 h-8"
                        />
                        <input
                            type="number"
                            value={product.quantity || ""}
                            placeholder={product.quantity === 0 ? "0" : ""}
                            onChange={(e) => {
                                const modifiedProduct = { ...product, quantity: Number(e.target.value) };
                                const updatedProduct = updateProductPrice(modifiedProduct)
                                handleSetEditableRowData(updatedProduct);
                            }}
                            className={`bg-white text-sm px-2 mr-2 rounded-md border-gray-600 border-0 text-center w-10 h-8`}
                        />
                        <input
                            type="number"
                            value={product.quantityHome || ""}
                            placeholder={product.quantityHome === 0 ? "0" : ""}
                            onChange={(e) => {
                                const modifiedProduct = { ...product, quantityHome: Number(e.target.value) };
                                const updatedProduct = updateProductPrice(modifiedProduct)
                                handleSetEditableRowData(updatedProduct);
                            }}
                            className={`bg-white text-sm px-2 rounded-md border-gray-600 border-0 text-center w-10 h-8`}
                        />
                    </div>
                )
            }
        </>
    )
}