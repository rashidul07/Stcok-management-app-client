import ModalField from "../common/ModalField";
import { handleProductEdit } from "../Helper/AllProductsHandler";

const ProductEditModal = ({ product, isTableLoading }) => {
    return (
        <>
            {/* The button to open modal */}
            {/* <label htmlFor="my-modal" className="btn">open modal</label> */}

            {/* Put this part before </body> tag */}
            <input type="checkbox" id="my-modal" className="modal-toggle" />
            <div className="modal">
                <div className="modal-box bg-slate-500 p-4">
                    <ModalField product={product} />
                    <div className="modal-action mt-2 justify-center">
                        <label htmlFor="my-modal" className={`btn min-h-0 h-10 ${isTableLoading ? 'loading' : ''}`}>Cancel</label>
                        <button htmlFor="my-modal" className={`btn btn-primary min-h-0 h-10 ${isTableLoading ? 'loading' : ''}`} onClick={handleProductEdit}>Update</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ProductEditModal;