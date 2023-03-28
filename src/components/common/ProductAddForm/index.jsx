import { Hint } from 'react-autocomplete-hint';
import Select from 'react-select';
import { handleAddToListClick, handleOnFill, updateProductDetails } from "../../Helper/AddProductHandler";
import { storeData } from "../../Helper/storeData";
import Alert from "../../Libs/Alert";

const ProductAddForm = ({ modifiedProductList, productDetails, setProductDetails, warningMessage }) => {
    const handleClear = (e) => {
        e.preventDefault();
        setProductDetails({ quantity: 1 })
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
                            onChange={(event) => updateProductDetails('label', event.target.value, productDetails, setProductDetails)}
                            className="font-bold bg-white py-1 px-2 rounded-md border-gray-600 my-1 border-2 text-amber-500 w-full"
                        >
                        </input>
                    </Hint>
                    <button className="btn btn-circle btn-outline clear-button border-none" onClick={handleClear}>
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
                    onChange={(value) => updateProductDetails('company', value, productDetails, setProductDetails)}
                    className="font-bold bg-white py-1 px-2 rounded-md border-gray-600 my-1 border-2 text-amber-500 w-full"
                    options={storeData.companyList}
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
                    onChange={(event) => updateProductDetails('quantity', Number(event.target.value), productDetails, setProductDetails)}
                    className="font-bold bg-white py-1 px-2 rounded-md border-gray-600 my-1 border-2 text-amber-500 w-full"
                />
            </div>
            {warningMessage.type === 'error' && <Alert message={warningMessage.message} className="bg-red-500" />}
            {warningMessage.type === 'success' && <Alert message={warningMessage.message} className="bg-green-600" />}
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

export default ProductAddForm;