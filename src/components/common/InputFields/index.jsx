import { ReactSearchAutocomplete } from 'react-search-autocomplete';
import Select from 'react-select';
import { handleAddToListClick, handleClear, handleOnFill, updateProductDetails } from "../../Helper/AddProductHandler";
import { storeData } from "../../Helper/storeData";
import Alert from "../../Libs/Alert";
import UseContext from '../../contexts/UseContext';

const InputFields = ({ modifiedProductList, productDetails, options, productType }) => {
    const { alertMessage } = UseContext();

    const formatResult = (item) => {
        return (
            <>
                <span style={{ display: 'block', textAlign: 'left' }} className='bg-gray-200'>{item.label + ' (' + item.quantity + ')' + (item.quantityHome ? ' (' + item.quantityHome + ')' : '')}</span>
            </>
        )
    }

    return (
        <form className="space-y-4 md:w-96">
            <div>
                <label htmlFor="productName" className="block font-medium">
                    Product Name
                </label>
                <div className='productNameContainer'>
                    <div>
                        <ReactSearchAutocomplete
                            items={modifiedProductList}
                            onSearch={(string) => {
                                updateProductDetails('label', string)
                            }}
                            onSelect={handleOnFill}
                            autoFocus
                            formatResult={formatResult}
                            showIcon={false}
                            onClear={handleClear}
                            styling={{ borderRadius: '4px', border: '2px solid black', position: 'relative', zIndex: 1888888 }}
                        />
                    </div>
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
                productType !== 'stock' && (
                    <>
                        <div>
                            <label htmlFor="stock" className="block font-medium">
                                Stock
                            </label>
                            <input
                                id="stock"
                                type="text"
                                value={productDetails?.stock || ''}
                                onChange={(event) => updateProductDetails('stock', event.target.value)}
                                className="font-bold bg-white py-1 px-2 rounded-md border-gray-600 my-1 border-2 text-amber-500 w-full"
                            />
                        </div>
                        <div>
                            <label htmlFor="mrp" className="block font-medium">
                                MRP
                            </label>
                            <input
                                id="mrp"
                                type="text"
                                value={productDetails?.mrp || ''}
                                onChange={(event) => updateProductDetails('mrp', event.target.value)}
                                className="font-bold bg-white py-1 px-2 rounded-md border-gray-600 my-1 border-2 text-amber-500 w-full"
                            />
                        </div>
                        <div>
                            <label htmlFor="lpr" className="block font-medium">
                                Last Purchase Price
                            </label>
                            <input
                                id="lpr"
                                type="text"
                                value={productDetails?.lpr || ''}
                                onChange={(event) => updateProductDetails('lpr', event.target.value)}
                                className="font-bold bg-white py-1 px-2 rounded-md border-gray-600 my-1 border-2 text-amber-500 w-full"
                            />
                        </div>
                        <div>
                            <label className="label cursor-pointer">
                                <span className="label-text">From Market</span>
                                <input type="checkbox" checked={productDetails.market !== undefined ? productDetails.market : true} onChange={(e) => updateProductDetails('market', e.target.checked)} className="checkbox checkbox-primary" />
                            </label>
                        </div>

                    </>
                )
            }
            {
                productType === 'stock' && (
                    <>
                        <div>
                            <label htmlFor="quantityHome" className="block font-medium">
                                Quantity (Home)
                            </label>
                            <input
                                id="quantityHome"
                                type="number"
                                value={productDetails?.quantityHome || 0}
                                onChange={(event) => updateProductDetails('quantityHome', Number(event.target.value))}
                                className="font-bold bg-white py-1 px-2 rounded-md border-gray-600 my-1 border-2 text-amber-500 w-full"
                            />
                        </div>
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
                                    ? (productDetails?.extraDiscount || '')
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