import { BsFillTrashFill } from "react-icons/bs";
import fetchData from "../../Helper/HandleApi";
import UseContext from "../../contexts/UseContext";

const AddedProductList = ({ localProducts, setLocalProducts, productType, totalPrice }) => {
    const { isLoading, setIsLoading, user, setAlertMessage } = UseContext();
    const handleDelete = (id) => {
        //need window.confirm
        const deletedItem = localProducts.find(product => product._id === id);
        const confirmBox = window.confirm(`Delete ${deletedItem?.label}?`);
        if (confirmBox === true) {
            const newLocalProducts = localProducts.filter(product => product._id !== id);
            setLocalProducts(newLocalProducts);
        }
    }

    const handleModify = async () => {
        setIsLoading(true);
        let finalData = [];
        if (productType.value === 'product') {
            finalData = localProducts.map(product => {
                return {
                    _id: product._id,
                    quantity: product.oldQuantity - product.quantity
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
                        operation: pd.oldQuantity === Number(pd.quantity) ? 'delete' : 'update',
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
    return (
        (localProducts.length > 0 && !isLoading) && (
            <div className="mt-4">
                <h3 className="font-semibold mb-4 text-center bg-gray-700 border-4 border-amber-300 p-1 text-white rounded-md">Added Product <span className="text-amber-500 pl-2">{localProducts.length}</span></h3>
                <div className="space-y-2 md:w-96">
                    {localProducts.map((product, index) => (
                        <div key={index} className="flex items-center" style={{ marginTop: '0px' }}>
                            <p className="text-amber-500 font-semibold text-sm w-9/12">{product.label}</p>
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
            </div>
        )
    )
};

export default AddedProductList;