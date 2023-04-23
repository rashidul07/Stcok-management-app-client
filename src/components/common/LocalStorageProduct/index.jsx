import { useState } from "react";
import Buttons from "./Buttons";
import DeleteHandlerBtn from "./DeleteHandlerBtn";
import EditableField from "./EditableField";
import ProductInfo from "./ProductInfo";
import './localStorage.css';

const LocalStorageProduct = ({ localProducts, storageName, setLocalProducts, buttonText, btnOnClick, isLoading }) => {
    const [editingProduct, setEditingProduct] = useState(null);

    const handleEdit = (id) => {
        if (editingProduct === id) {
            setEditingProduct(null);
            return;
        }
        setEditingProduct(id);
    }

    return (
        localProducts.length > 0 &&
        (
            <>
                <div className="mt-8 localStorageValue">
                    <h3 className="font-semibold mb-4 text-center bg-gray-700 border-4 border-amber-300 p-1 text-white rounded-md">{storageName === 'deletedProduct' ? 'Deleted' : 'Added'} Product <span className="text-amber-500 pl-2">{localProducts.length}</span></h3>
                    <div className="space-y-2 md:w-96">
                        {localProducts.map((product, index) => (
                            <div key={index} className="flex items-center">
                                {editingProduct === product.rId ? (
                                    <EditableField product={product} localProducts={localProducts} setLocalProducts={setLocalProducts} storageName={storageName} />
                                ) : (
                                    <ProductInfo product={product} />
                                )}
                                {
                                    storageName !== 'deletedProduct' && (
                                        <Buttons handleEdit={handleEdit} product={product} />
                                    )
                                }

                                {
                                    storageName === 'deletedProduct' && (
                                        <DeleteHandlerBtn product={product} />
                                    )
                                }
                            </div>
                        ))}
                    </div>
                </div>
                <div className="text-center mt-4">
                    <button className={`btn btn-outline btn-primary h-9 min-h-fit w-48 ${(isLoading && (storageName === 'productList' || "stockList")) ? 'loading' : ''}`} onClick={btnOnClick}>{buttonText}</button>
                </div>
            </>
        )
    )
}

export default LocalStorageProduct;