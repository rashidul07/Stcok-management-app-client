import { MdRestore } from 'react-icons/md';
import { handleRestore } from '../../Helper/AddProductHandler';
const DeleteHandlerBtn = ({ product }) => {
    return (
        <MdRestore
            className="text-sm font-bold text-black w-10 pl-2"
            onClick={() => { handleRestore(product) }}
        />
    )
}

export default DeleteHandlerBtn;