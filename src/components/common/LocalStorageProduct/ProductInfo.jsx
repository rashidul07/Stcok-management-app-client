const productInfo = ({ product }) => {
    return (
        <>
            <p className={`text-sm font-bold text-black w-2/4 truncate 	text-transform: capitalize ${product._id ? 'text-blue-700' : ''}`}>{product.label}</p>
            <p className="text-sm text-black w-1/4 truncate">{product.company}</p>
            {
                product.price && (
                    <>
                        <p className="text-sm text-black w-16 text-center">{product.price}</p>
                        <p className="text-sm text-black w-12 text-center">{product.invoiceDiscount}</p>
                        <p className="text-sm text-black w-8 text-center">{product.extraDiscount}</p>
                    </>
                )
            }
            <p className={`text-sm text-black text-center ${product.price ? 'w-6' : 'w-10'}`}>{product.quantity}</p>
            <p className={`text-sm text-black text-center ${product.price ? 'w-6' : 'w-10'}`}>{product?.stock || 0}</p>
            <input
                type="checkbox"
                readOnly
                checked={product.market}
                style={product.market === false ? { border: '1px solid #ccc' } : {}}
                className="bg-white text-sm px-2 rounded-md border-gray-600 border-0 text-center checkbox checkbox-primary" />
        </>
    )
}

export default productInfo;