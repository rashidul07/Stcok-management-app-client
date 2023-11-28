import { BsFillTrashFill } from "react-icons/bs";
import fetchData from "../../Helper/HandleApi";
import UseContext from "../../contexts/UseContext";
import { useState, useEffect } from "react";

const AddedProductList = ({ localProducts, setLocalProducts, productType, totalPrice }) => {
    const { isLoading, setIsLoading, user, setAlertMessage } = UseContext();
    const [supplierWithPrice, setSupplierWithPrice] = useState({})
    const [totalProductPrice, setTotalProductPrice] = useState(0);
    const handleDelete = (id) => {
        //need window.confirm
        const deletedItem = localProducts.find(product => product._id === id);
        const confirmBox = window.confirm(`Delete ${deletedItem?.label}?`);
        if (confirmBox === true) {
            const newLocalProducts = localProducts.filter(product => product._id !== id);
            setLocalProducts(newLocalProducts);
        }
    }

    function getSupplierPrices(data) {
        const supplierPrices = {};

        data.forEach(item => {
            const supplier = item.supplier;
            const quantity = item.quantity;
            const price = item.price;

            if (supplier && price !== null && price !== undefined) {
                const totalPrice = price * quantity;

                if (supplier in supplierPrices) {
                    supplierPrices[supplier] += totalPrice;
                } else {
                    supplierPrices[supplier] = totalPrice;
                }
            }
        });

        return supplierPrices;
    }

    function getTotalPriceFromSupplierPrices(supplierPrices) {
        let totalPrice = 0;

        for (const supplier in supplierPrices) {
            if (supplierPrices.hasOwnProperty(supplier)) {
                totalPrice += supplierPrices[supplier];
            }
        }

        return totalPrice;
    }

    const handleModify = async () => {
        setIsLoading(true);
        let finalData = [];
        if (productType.value === 'product') {
            finalData = localProducts.map(product => {
                return {
                    _id: product._id,
                    quantity: product.oldQuantity - product.quantity,
                    lpp: product.price
                }
            });
        } else {
            finalData = localProducts.map(product => {
                return {
                    _id: product._id,
                    quantity: product.oldQuantity - product.quantity,
                    totalPrice: product.extraDiscountPrice * (product.oldQuantity - product.quantity + (product.quantityHome || 0))
                }
            });
        }

        const confirmBox = window.confirm(`Modify All Products?`);
        if (confirmBox === true) {
            const response = await fetchData('modifyProduct', 'POST', finalData, { type: productType.value })
            if (response.status === 'success') {
                // from localProducts remove all the products which are already in database with _id
                const newProducts = localProducts.map(pd => {
                    return {
                        productId: pd._id,
                        label: pd.label.split(' (')[0],
                        date: new Date().toISOString(),
                        user: user.email,
                        operation: (Number(pd.oldQuantity) === Number(pd.quantity) && productType.value === 'product') ? 'delete' : 'update',
                        rId: pd.rId,
                        productData: {
                            quantity: [pd.oldQuantity, -Number(pd.quantity)]
                        }
                    }
                });

                // save history for new products
                if (productType.value === 'product') {
                    fetchData('addHistory', 'POST', newProducts)
                } else {
                    fetchData('addStockHistory', 'POST', newProducts)
                }

                setLocalProducts([]);
                localStorage.removeItem(productType.value === "product" ? 'modifiedproductList' : 'modifiedstockList');
                setAlertMessage({ message: `Deleted ${response.data?.deletedCount || 0} & Updated ${response.data?.modifiedCount || 0}.`, type: 'success' });
                setLocalProducts([]);
                // give a reload after 5 seconds
                setTimeout(() => {
                    window.location.reload();
                }, 10000);
            }
            else {
                setAlertMessage({ message: response.message, type: 'error' });
            }
        }
        setIsLoading(false);
    }

    useEffect(() => {
        if (productType?.value === 'product') {
            setSupplierWithPrice(getSupplierPrices(localProducts))
        }
    }, [localProducts])

    useEffect(() => {
        setTotalProductPrice(getTotalPriceFromSupplierPrices(supplierWithPrice))
    }, [supplierWithPrice])

    return (
        (localProducts.length > 0 && !isLoading) && (
            <div className="mt-4">
                <h3 className="font-semibold mb-4 text-center bg-gray-700 border-4 border-amber-300 p-1 text-white rounded-md">Added Product <span className="text-amber-500 pl-2">{localProducts.length}</span></h3>
                <div className="space-y-2 md:w-96">
                    {localProducts.map((product, index) => (
                        <div key={index} className="flex justify-stretch items-center" style={{ marginTop: '0px' }}>
                            <p className="text-amber-500 font-semibold text-sm w-6/12">{product.label}</p>
                            {
                                productType?.value === 'product' && (
                                    <>
                                        <p className="text-amber-500 font-semibold mr-4 w-20">{product?.supplier || ''}</p>
                                        <p className="text-amber-500 font-semibold mr-6 w-6">{Math.round(parseFloat(product?.price)) || ''}</p>
                                    </>
                                )
                            }
                            <p className="text-amber-500 font-semibold ml-2 w-6">{product.quantity}</p>
                            <BsFillTrashFill
                                className="text-sm font-bold text-black w-10 pl-2"
                                onClick={() => { handleDelete(product._id) }}
                            />
                        </div>
                    ))}
                </div>
                {
                    productType?.value === 'stock' && (
                        <p className="text-center my-2 text-black">Total Product Amount: {Math.round(totalPrice)}</p>
                    )
                }
                <div className="text-center mt-4">
                    <button className={`btn btn-outline btn-primary h-9 min-h-fit w-48 ${isLoading ? 'loading' : ''}`} onClick={handleModify}>Modify List</button>
                </div>
                {
                    Object.keys(supplierWithPrice)?.length ? (
                        Object.keys(supplierWithPrice).map((key, i) => (
                            <div className="flex justify-center  mt-2" key={i}>
                                <p className="text-black">{key + ' - '}</p>
                                <p className="text-black"> {'  ---  ' + Math.round(supplierWithPrice[key])}</p>
                            </div>
                        ))
                    ) : ''
                }
                {
                    Object.keys(supplierWithPrice)?.length ? (
                        <div className="flex justify-center  mt-2">
                            <p>Total: {Math.round(totalProductPrice)}</p>
                        </div>
                    ) : ''
                }
            </div>
        )
    )
};

export default AddedProductList;