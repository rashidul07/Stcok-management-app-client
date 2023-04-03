import { BsFillTrashFill } from "react-icons/bs";
import { FaRegEdit } from "react-icons/fa";
import { handleDelete } from "../../Helper/AddProductHandler";
const Buttons = ({ handleEdit, product }) => {
    return (
        <>
            <p className="text-lg font-bold text-black w-10 pl-2" onClick={() => handleEdit(product.rId)}><FaRegEdit /></p>
            <p className="text-lg font-bold text-black w-10 pl-2" onClick={() => handleDelete(product.rId)}><BsFillTrashFill /></p>
        </>
    )
}

export default Buttons;