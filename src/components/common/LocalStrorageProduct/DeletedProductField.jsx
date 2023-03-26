const DeletedProductField = ({ product }) => {
    return (
        <>
            <p className={`text-sm font-bold text-black w-2/4 truncate 	text-transform: capitalize ${product._id ? 'text-blue-700' : ''}`}>{product.label}</p>
            <p className="text-sm text-black w-1/4 truncate">{product.company}</p>
            <p className="text-sm text-black w-10 text-center">{product.quantity}</p>
        </>
    )
}

export default DeletedProductField;