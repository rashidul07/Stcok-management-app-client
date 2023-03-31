import fetchData from "./HandleApi";
import { storeData } from "./storeData";
class AddProductHandler {

    updateTheConstructor = (
        productDetails,
        setProductDetails,
        setWarningMessage,
        localProducts,
        setLocalProducts,
        deletedProduct,
        setDeletedProduct,
        setIsLoading,
        user,
        productList,
        setProductList,
        type = 'product'
    ) => {

        this.productDetails = productDetails;
        this.setProductDetails = setProductDetails;
        this.setWarningMessage = setWarningMessage;
        this.localProducts = localProducts;
        this.setLocalProducts = setLocalProducts;
        this.deletedProduct = deletedProduct;
        this.setDeletedProduct = setDeletedProduct;
        this.setIsLoading = setIsLoading;
        this.user = user;
        this.productList = productList;
        this.setProductList = setProductList;
        this.type = type;
    }

    /*if any product is available both local and modified product list then remove 
        the product from modified product list and keep the local product list */
    margeArray = (localProducts, modifiedProducts) => {
        const mergedProductList = [];
        localProducts.forEach(localProductItem => {
            const modifiedProductIndex = modifiedProducts.findIndex(modifiedProductItem => modifiedProductItem.rId === localProductItem.rId);

            if (modifiedProductIndex !== -1) {
                modifiedProducts.splice(modifiedProductIndex, 1);
            }
            mergedProductList.push(localProductItem);
        });

        mergedProductList.push(...modifiedProducts);
        return mergedProductList;
    }

    updateProductDetails = (fieldName, value) => {
        const newProductDetails = { ...this.productDetails, [fieldName]: value };
        this.setProductDetails(newProductDetails);
        console.log(newProductDetails, '2');
    }

    updateProductDataForServer = (type) => {
        if (type === 'databaseProduct') {
            const productList =
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
            return productList;
        } else if (type === 'localProduct') {
            const updatedProductIndex = this.localProducts.findIndex(p => p.rId === this.productDetails.rId);
            const updatedProductList = [...this.localProducts];
            updatedProductList[updatedProductIndex] = {
                ...this.productDetails,
                label: this.productDetails.label.trim(),
                name: this.productDetails.label.trim(),
                company: this.productDetails.company.value,
                updated_at: new Date().toISOString(),
                updated_by: this.user.email,
            }
            return updatedProductList;
        } else {
            const id = `${Math.random().toString(36).replace('0.', '')}${Date.now().toString(36)}`;
            const productList =
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
            return productList;
        }
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
        if (this.type === 'stock') {
            if (this.productDetails?.price === undefined || this.productDetails?.price === 0) {
                this.setWarningMessage({ message: 'Please fill up all the fields', type: 'error' });
                return
            }
        }

        let productList;
        //find index in localProducts array by _id
        const productIndex = this.localProducts.findIndex(p => p._id === this.productDetails._id);
        if (this.productDetails._id && productIndex === -1) {
            productList = this.updateProductDataForServer('databaseProduct');
        } else if (this.productDetails.rId) {
            productList = this.updateProductDataForServer('localProduct');
        } else {
            productList = this.updateProductDataForServer('newProduct');
        }

        this.setLocalProducts(productList);

        if (this.type === 'stock') {
            localStorage.setItem("stockList", JSON.stringify(productList));
            this.setProductDetails({
                label: '',
                company: this.productDetails.company,
                quantity: this.productDetails.quantity,
                price: this.productDetails.price,
                invoiceDiscount: this.productDetails.invoiceDiscount,
                extraDiscount: this.productDetails.extraDiscount,
            });
        }

        if (this.type === 'product') {
            localStorage.setItem("productList", JSON.stringify(productList));
            this.setProductDetails({
                label: '',
                company: this.productDetails.company,
                quantity: 1
            });
        }
    }

    handleDelete = (id) => {
        const removedProduct = this.localProducts.find(p => p.rId === id);
        const confirmBox = window.confirm(`Are you sure to delete ${removedProduct.label}?`);
        if (confirmBox === true) {
            const updatedProducts = this.localProducts.filter(p => p.rId !== id);
            this.setLocalProducts(updatedProducts);
            if (this.type === 'stock') {
                localStorage.setItem("stockList", JSON.stringify(updatedProducts));
            } else if (this.type === 'product') {
                localStorage.setItem('productList', JSON.stringify(updatedProducts));
                const deletedProductList = [...this.deletedProduct, removedProduct];
                localStorage.setItem('deletedProduct', JSON.stringify(deletedProductList));
                this.setDeletedProduct(deletedProductList);
            }
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
            const response = await fetchData(this.type === "product" ? 'addProduct' : 'addStockProduct', 'POST', { productsCollection: this.localProducts })
            if (response.status === 'success') {
                this.setProductList(this.margeArray(this.localProducts, this.productList));
                this.setWarningMessage({ message: `New ${response.data?.insertedCount || 0} & Updated ${response.data?.modifiedCount || 0} added.`, type: 'success' });
                localStorage.removeItem(this.type === "product" ? 'productList' : 'stockList');
                this.setLocalProducts([]);
            }
            else {
                this.setWarningMessage({ message: response.message, type: 'error' });
            }
        }
        this.setIsLoading(false);
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
    margeArray,
    handleRestore } = new AddProductHandler();

