import { Hint } from 'react-autocomplete-hint';
import Select from 'react-select';
import UseContext from '../../contexts/UseContext';
import { handleAddToListClick, handleOnFill, updateProductDetails } from "../../Helper/AddProductHandler";
import { storeData } from "../../Helper/storeData";
import Alert from "../../Libs/Alert";

const InputFields = ({ modifiedProductList = [], productDetails = {}, setProductDetails = () => { }, options, title }) => {
    const { alertMessage } = UseContext();

    const handleClear = (e) => {
        e.preventDefault();
        // give a alert to confirm the clear action
        if (window.confirm('Are you sure you want to clear the fields?')) {
            if (title === 'Product') {
                setProductDetails({
                    quantity: 1
                });
            }
            if (title === 'Stock') {
                setProductDetails({ quantity: 1, invoiceDiscount: 14.20, extraDiscount: 0 });
            }
        }
    }

    return (
        <form className="space-y-4 md:w-96">
            <div>
                <label htmlFor="productName" className="block font-medium">
                    Product Name
                </label>
                <div className='productNameContainer'>
                    <Hint options={modifiedProductList} allowTabFill onFill={handleOnFill}>
                        <input
                            id="productName"
                            type="text"
                            value={productDetails?.label || ''}
                            onChange={(event) => {
                                updateProductDetails('label', event.target.value)
                            }}
                            className="font-bold bg-white py-1 px-2 rounded-md border-gray-600 my-1 border-2 text-amber-500 w-full"
                        >
                        </input>
                    </Hint>
                    <button className="btn btn-circle btn-outline clear-button border-none" style={{ backgroundColor: "transparent", borderColor: "transparent", boxShadow: "none", color: "inherit", outline: "none" }} onClick={handleClear}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
            </div>
            <div>
                <label htmlFor="company" className="block font-medium">
                    Select Company
                </label>
                <Select
                    id="company"
                    value={productDetails?.company || storeData.companyList[0]}
                    onChange={(value) => updateProductDetails('company', value)}
                    className="font-bold bg-white py-1 px-2 rounded-md border-gray-600 my-1 border-2 text-amber-500 w-full"
                    options={options}
                />
            </div>
            <div>
                <label htmlFor="quantity" className="block font-medium">
                    Quantity
                </label>
                <input
                    id="quantity"
                    type="number"
                    value={productDetails?.quantity || ''}
                    onChange={(event) => updateProductDetails('quantity', Number(event.target.value))}
                    className="font-bold bg-white py-1 px-2 rounded-md border-gray-600 my-1 border-2 text-amber-500 w-full"
                />
            </div>
            {
                title === 'Stock' && (
                    <>
                        <div>
                            <label htmlFor="price" className="block font-medium">
                                MRP Price
                            </label>
                            <input
                                id="price"
                                type="number"
                                value={productDetails?.price || ''}
                                onChange={(event) => updateProductDetails('price', Number(event.target.value))}
                                className="font-bold bg-white py-1 px-2 rounded-md border-gray-600 my-1 border-2 text-amber-500 w-full"
                            />
                        </div>
                        <div>
                            <label htmlFor="invoiceDiscount" className="block font-medium">
                                invoice discount %
                            </label>
                            <input
                                id="invoiceDiscount"
                                type="number"
                                value={productDetails?.invoiceDiscount || ''}
                                onChange={(event) => updateProductDetails('invoiceDiscount', Number(event.target.value))}
                                className="font-bold bg-white py-1 px-2 rounded-md border-gray-600 my-1 border-2 text-amber-500 w-full"
                            />
                        </div>
                        <div>
                            <label htmlFor="extraDiscount" className="block font-medium">
                                Extra Discount %
                            </label>
                            <input
                                id="extraDiscount"
                                type="number"
                                value={productDetails?.extraDiscount !== null
                                    ? productDetails?.extraDiscount
                                    : ''}
                                onChange={(event) => updateProductDetails('extraDiscount', Number(event.target.value))}
                                className="font-bold bg-white py-1 px-2 rounded-md border-gray-600 my-1 border-2 text-amber-500 w-full"
                            />
                        </div>
                    </>

                )
            }
            {alertMessage.type === 'error' && <Alert message={alertMessage.message} className="bg-red-500" />}
            {alertMessage.type === 'success' && <Alert message={alertMessage.message} className="bg-green-600" />}
            <div className="text-center">
                <input
                    type="submit"
                    onClick={handleAddToListClick}
                    value="Add to List"
                    className="py-2 px-4 w-full border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                />
            </div>
        </form>
    )
}

export default InputFields;