import fetchData from "./HandleApi";
import { storeData } from "./storeData";
class AddProductHandler {

    updateTheConstructor = (productDetails, setProductDetails, setWarningMessage, localProducts, setLocalProducts, deletedProduct, setDeletedProduct, setIsLoading, user) => {
        this.productDetails = productDetails;
        this.setProductDetails = setProductDetails;
        this.setWarningMessage = setWarningMessage;
        this.localProducts = localProducts;
        this.setLocalProducts = setLocalProducts;
        this.deletedProduct = deletedProduct;
        this.setDeletedProduct = setDeletedProduct;
        this.setIsLoading = setIsLoading;
        this.user = user;
    }

    updateProductDetails = (fieldName, value) => {
        const newProductDetails = { ...this.productDetails, [fieldName]: value };
        this.setProductDetails(newProductDetails);
    }

    handleAddToListClick = (e) => {

        e.preventDefault();
        if (!this.user?.email) {
            this.setWarningMessage({ message: 'Please login first', type: 'error' });
            return;
        }
        if (!this.productDetails?.label || !this.productDetails?.company?.value || !this.productDetails?.quantity) {
            this.setWarningMessage({ message: 'Please fill up all the fields', type: 'error' });
            return;
        }
        let productList;
        if (this.productDetails._id) {
            productList =
                [...this.localProducts,
                {
                    ...this.productDetails,
                    label: this.productDetails.label.trim(),
                    name: this.productDetails.label.trim(),
                    company: this.productDetails.company.value,
                    updated_at: new Date().toISOString(),
                    updated_by: this.user.email,
                }
                ];
        } else {
            const id = `${Math.random().toString(36).replace('0.', '')}${Date.now().toString(36)}`;
            productList =
                [...this.localProducts,
                {
                    rId: id, ...this.productDetails,
                    label: this.productDetails.label.trim(),
                    name: this.productDetails.label.trim(),
                    company: this.productDetails.company.value,
                    time: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    created_by: this.user.email,
                    updated_by: this.user.email,
                    status: 'pending'
                }
                ];
        }

        localStorage.setItem("productList", JSON.stringify(productList));
        this.setLocalProducts(productList);
        this.setProductDetails({
            label: '',
            company: storeData.companyList[0],
            quantity: 1
        });
    }

    handleDelete = (id) => {
        const removedProduct = this.localProducts.find(p => p.rId === id);
        const confirmBox = window.confirm(`Are you sure to delete ${removedProduct.label}?`);
        if (confirmBox === true) {
            const updatedProducts = this.localProducts.filter(p => p.rId !== id);
            this.setLocalProducts(updatedProducts);
            localStorage.setItem('productList', JSON.stringify(updatedProducts));
            const deletedProductList = [...this.deletedProduct, removedProduct];
            localStorage.setItem('deletedProduct', JSON.stringify(deletedProductList));
            this.setDeletedProduct(deletedProductList);
        }
    }

    deletePermanently = () => {
        // show confirm box
        this.setIsLoading(true);
        const confirmBox = window.confirm(`Are you sure to delete all the products?`);
        if (confirmBox === true) {
            localStorage.removeItem('deletedProduct');
            this.setDeletedProduct([]);
        }
        this.setIsLoading(false);

    }

    handleProductSubmit = async () => {
        this.setIsLoading(true);
        const confirmBox = window.confirm(`Submit All Products?`);
        if (confirmBox === true) {
            const response = await fetchData('addProduct', 'POST', { productsCollection: this.localProducts })
            if (response.status === 'success') {
                this.setWarningMessage({ message: `New ${response.data?.insertedCount || 0} & Updated ${response.data?.modifiedCount || 0} added.`, type: 'success' });
                localStorage.removeItem('productList');
                this.setLocalProducts([]);
            }
            else {
                this.setWarningMessage({ message: response.message, type: 'error' });
            }
            this.setIsLoading(false);
        }
    }

    handleOnFill = (value) => {
        const company = storeData.companyList.find(c => c.value === value.company);
        this.setProductDetails({
            ...value,
            company,
        });
    }

    handleRestore = (product) => {
        const updatedAddedProducts = [...this.localProducts, product];
        localStorage.setItem('productList', JSON.stringify(updatedAddedProducts));
        this.setLocalProducts(updatedAddedProducts);
        const updatedDeletedProducts = this.deletedProduct.filter(p => p.rId !== product.rId);
        localStorage.setItem('deletedProduct', JSON.stringify(updatedDeletedProducts));
        this.setDeletedProduct(updatedDeletedProducts);
    }
}

export const {
    updateTheConstructor,
    updateProductDetails,
    handleAddToListClick,
    handleDelete,
    deletePermanently,
    handleProductSubmit,
    handleOnFill,
    handleRestore } = new AddProductHandler();

