import Select from 'react-select';
import { updateProductPrice } from '../../Helper/AddProductHandler';
import { storeData } from '../../Helper/storeData';
import './localStorage.css';
const EditableField = ({ product, localProducts, setLocalProducts, storageName }) => {

    const customStyles = {
        control: (base, state) => ({
            ...base,
            borderRadius: "none",
            border: "none",
            boxShadow: state.isFocused ? null : null,
            borderColor: state.isFocused ? "#80bdff" : base.borderColor,
            "&:hover": {
                borderColor: state.isFocused ? "#80bdff" : base.borderColor
            }
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
            <input
                type="text"
                value={product.label}
                onChange={(e) => {
                    const updatedProduct = { ...product, label: e.target.value };
                    const updatedProducts = localProducts.map(p => p.rId === product.rId ? updatedProduct : p);
                    localStorage.setItem(storageName, JSON.stringify(updatedProducts));
                    setLocalProducts(updatedProducts);
                }}
                className="text-sm bg-white px-2 rounded-md border-gray-600 border-0 w-2/6 mx-1"
            />
            <Select
                styles={customStyles}
                value={storeData.companyList.find(company => company.value === product.company)}
                onChange={(company) => {
                    const updatedProduct = { ...product, company: company.value };
                    const updatedProducts = localProducts.map(p => p.rId === product.rId ? updatedProduct : p);
                    localStorage.setItem(storageName, JSON.stringify(updatedProducts));
                    setLocalProducts(updatedProducts);
                }}
                options={storeData.companyList.slice(1)}
                className="bg-white text-sm rounded-md border-gray-600 border-0 w-1/4 mx-1"
            />
            {
                product.price && (
                    <>
                        <input
                            type="number"
                            value={product.price || ""}
                            onChange={(e) => {
                                const modifiedProduct = { ...product, price: Number(e.target.value) };
                                const updatedProduct = updateProductPrice(modifiedProduct)
                                const updatedProducts = localProducts.map(p => p.rId === product.rId ? updatedProduct : p);
                                localStorage.setItem(storageName, JSON.stringify(updatedProducts));
                                setLocalProducts(updatedProducts);
                            }}
                            className="bg-white text-sm rounded-md border-gray-600 border-0 w-8 pl-1 mx-1"
                        />
                        <input
                            type="number"
                            value={product.invoiceDiscount || ""}
                            onChange={(e) => {
                                const modifiedProduct = { ...product, invoiceDiscount: Number(e.target.value) };
                                const updatedProduct = updateProductPrice(modifiedProduct)
                                const updatedProducts = localProducts.map(p => p.rId === product.rId ? updatedProduct : p);
                                localStorage.setItem(storageName, JSON.stringify(updatedProducts));
                                setLocalProducts(updatedProducts);
                            }}
                            className="bg-white text-sm rounded-md border-gray-600 border-0 w-8 pl-1 mx-1"
                        />
                        <input
                            type="number"
                            value={product.extraDiscount || ""}
                            onChange={(e) => {
                                const modifiedProduct = { ...product, extraDiscount: Number(e.target.value) };
                                const updatedProduct = updateProductPrice(modifiedProduct)
                                const updatedProducts = localProducts.map(p => p.rId === product.rId ? updatedProduct : p);
                                localStorage.setItem(storageName, JSON.stringify(updatedProducts));
                                setLocalProducts(updatedProducts);
                            }}
                            className="bg-white text-sm rounded-md border-gray-600 border-0 w-6 pl-1 mx-1"
                        />
                    </>
                )
            }
            <input
                type="number"
                value={product.quantity || ''}
                onChange={(e) => {
                    const modifiedProduct = { ...product, quantity: Number(e.target.value) };
                    const updatedProduct = updateProductPrice(modifiedProduct)
                    const updatedProducts = localProducts.map(p => p.rId === product.rId ? updatedProduct : p);
                    localStorage.setItem(storageName, JSON.stringify(updatedProducts));
                    setLocalProducts(updatedProducts);
                }}
                className={`bg-white text-sm px-2 rounded-md border-gray-600 border-0 text-center ${product.price ? 'w-6' : 'w-10'}`}
            />
        </>
    )
}

export default EditableField;