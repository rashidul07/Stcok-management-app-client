import fetchData from "./HandleApi";
import { storeData } from "./storeData";
class AddProductHandler {

    updateTheConstructor = (
        productDetails,
        setProductDetails,
        setAlertMessage,
        localProducts,
        setLocalProducts,
        deletedProduct,
        setDeletedProduct,
        setIsLoading,
        user,
        productList,
        setProductList,
        type,
        changeFieldData,
        setChangeFieldData,
        modifiedProductList,
        setModifiedProductList
    ) => {

        this.productDetails = productDetails;
        this.setProductDetails = setProductDetails;
        this.setAlertMessage = setAlertMessage;
        this.localProducts = localProducts;
        this.setLocalProducts = setLocalProducts;
        this.deletedProduct = deletedProduct;
        this.setDeletedProduct = setDeletedProduct;
        this.setIsLoading = setIsLoading;
        this.user = user;
        this.productList = productList;
        this.setProductList = setProductList;
        this.type = type;
        this.changeFieldData = changeFieldData;
        this.setChangeFieldData = setChangeFieldData;
        this.modifiedProductList = modifiedProductList;
        this.setModifiedProductList = setModifiedProductList;
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

    handleClear = () => {
        // give a alert to confirm the clear action
        if (this.type === 'stock') {
            this.setProductDetails({
                label: '',
                company: this.productDetails.company,
                invoiceDiscount: this.productDetails.invoiceDiscount,
                extraDiscount: this.productDetails.extraDiscount,
                quantity: this.productDetails.quantity,
            });
        }

        if (this.type === 'short') {
            this.setProductDetails({
                label: '',
                company: this.productDetails.company,
                quantity: 1,
                market: true
            });
        }
    }

    updateProductDetails = (fieldName, value) => {
        let newProductDetails;
        if (fieldName === 'company' && value?.value === 'rashu') {
            newProductDetails = { ...this.productDetails, label: 'Rk ' + this.productDetails.label, name: 'Rk ' + this.productDetails.label, [fieldName]: value };
            this.setProductDetails(newProductDetails);
            return;
        }

        if (fieldName === 'label') {
            newProductDetails = { ...this.productDetails, [fieldName]: value, name: value };
        } else {
            newProductDetails = { ...this.productDetails, [fieldName]: value };
        }
        this.setProductDetails(newProductDetails);
    }

    updateProductPrice = (product) => {
        const invoiceDiscountPrice = Number((product.price - (product.price * product.invoiceDiscount / 100)).toFixed(2));
        const extraDiscountPrice = Number((invoiceDiscountPrice - (invoiceDiscountPrice * product.extraDiscount / 100)).toFixed(2));
        const totalPrice = Number((extraDiscountPrice * (product.quantity + (product.quantityHome || 0))).toFixed(2));
        const newProductDetails = { ...product, invoiceDiscountPrice, extraDiscountPrice, totalPrice };
        return newProductDetails;
    }

    updateChangeableFieldData = () => {
        if (this.productDetails._id) {
            const product = this.productList.find(p => p._id === this.productDetails._id);
            const localProduct = this.localProducts.find(p => p._id === this.productDetails._id);
            const changeFieldData = {
                productId: this.productDetails._id,
                label: this.productDetails.label.trim(),
                date: new Date().toISOString(),
                user: this.user.email,
                operation: 'update',
                rId: this.productDetails.rId,
                productData: {}
            };
            for (const key in product) {
                if (key === 'quantity' || key === 'quantityHome' || product[key] !== this.productDetails[key]) {

                    //need to ignore some property like name, updated_at and updated_by
                    if (key === 'name' || key === 'updated_at' || key === 'updated_by' ||
                        key === 'extraDiscountPrice' || key === 'invoiceDiscountPrice' || key === 'totalPrice'
                    ) {
                        continue;
                    }
                    if (key === 'company' && product[key] === this.productDetails[key].value) {
                        continue;
                    }
                    if (key === 'company') {
                        changeFieldData['productData'][key] = [product[key], this.productDetails[key].value];
                        continue;
                    }
                    if (key === 'quantity' || key === 'quantityHome') {
                        changeFieldData['productData'][key] = [product[key], (this.productDetails[key] + (localProduct ? (localProduct[key] - product[key]) : 0))];
                        continue;
                    }
                    changeFieldData['productData'][key] = [product[key], this.productDetails[key]];
                }
            }
            //if this.changeFieldData already contain the changeFieldData then remove the old one and add the new one
            const changeFieldDataIndex = this.changeFieldData.findIndex(c => c.productId === this.productDetails._id);
            if (changeFieldDataIndex !== -1) {
                this.changeFieldData.splice(changeFieldDataIndex, 1);
            }
            this.setChangeFieldData([...this.changeFieldData, changeFieldData]);
            localStorage.setItem(`${this.type}changeFieldData`, JSON.stringify([...this.changeFieldData, changeFieldData]));
        }
    }

    updateProductDataForServer = (type) => {
        // find out the which property is changed and update the changeFieldData
        this.updateChangeableFieldData();
        let productList;
        if (type === 'databaseProduct') {
            if (this.type === 'short') {
                productList =
                    [...this.localProducts,
                    {
                        ...this.productDetails,
                        quantity: this.productDetails.quantity + this.productDetails.oldQuantity,
                        label: this.productDetails.label.trim(),
                        company: this.productDetails.company.value,
                        updated_at: new Date().toISOString(),
                        updated_by: this.user.email,
                    }
                    ];
            } else {
                productList =
                    [...this.localProducts,
                    {
                        ...this.productDetails,
                        quantity: this.productDetails.quantity + this.productDetails.oldQuantity,
                        quantityHome: this.productDetails.quantityHome + this.productDetails.oldQuantityHome,
                        label: this.productDetails.label.trim(),
                        company: this.productDetails.company.value,
                        updated_at: new Date().toISOString(),
                        updated_by: this.user.email,
                    }
                    ];
            }
        } else if (type === 'localProduct') {
            const updatedProductIndex = this.localProducts.findIndex(p => p.rId === this.productDetails.rId);
            productList = [...this.localProducts];
            if (this.type === 'short') {
                productList[updatedProductIndex] = {
                    ...this.productDetails,
                    quantity: this.productDetails.quantity + this.productDetails.oldQuantity,
                    label: this.productDetails.label.trim(),
                    company: this.productDetails.company.value,
                    updated_at: new Date().toISOString(),
                    updated_by: this.user.email,
                }
            } else {
                productList[updatedProductIndex] = {
                    ...this.productDetails,
                    quantity: this.productDetails.quantity + this.productDetails.oldQuantity,
                    quantityHome: this.productDetails.quantityHome + this.productDetails.oldQuantityHome,
                    label: this.productDetails.label.trim(),
                    company: this.productDetails.company.value,
                    updated_at: new Date().toISOString(),
                    updated_by: this.user.email,
                }
            }
        } else {
            const id = `${Math.random().toString(36).replace('0.', '')}${Date.now().toString(36)}`;
            productList =
                [...this.localProducts,
                {
                    rId: id,
                    id: id,
                    ...this.productDetails,
                    label: this.productDetails.label.trim(),
                    company: this.productDetails.company.value,
                    time: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    created_by: this.user.email,
                    updated_by: this.user.email,
                    status: 'pending'
                }
                ];
        }
        if (this.type === 'stock') {
            const lastProductIndex = productList.length - 1;
            const lastProduct = productList[lastProductIndex];
            const invoiceDiscountPrice = (lastProduct.price - (lastProduct.price * lastProduct.invoiceDiscount / 100)).toFixed(2);
            const extraDiscountPrice = (invoiceDiscountPrice - (invoiceDiscountPrice * lastProduct.extraDiscount / 100)).toFixed(2);
            const totalPrice = (extraDiscountPrice * (lastProduct.quantity + (lastProduct.quantityHome || 0))).toFixed(2);
            productList[lastProductIndex] = {
                ...lastProduct,
                invoiceDiscountPrice: Number(invoiceDiscountPrice),
                extraDiscountPrice: Number(extraDiscountPrice),
                totalPrice: Number(totalPrice),
            }
        }
        return productList;
    }

    handleAddToListClick = (e) => {

        e.preventDefault();
        if (!this.user?.email) {
            this.setAlertMessage({ message: 'Please login first', type: 'error' });
            return;
        }
        if (!this.productDetails?.label || !this.productDetails?.company?.value || !this.productDetails?.quantity) {
            this.setAlertMessage({ message: 'Please fill up all the fields', type: 'error' });
            return;
        }
        if (this.type === 'stock') {
            if (this.productDetails?.price === undefined || this.productDetails?.price === 0) {
                this.setAlertMessage({ message: 'Please fill up all the fields', type: 'error' });
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
        }

        if (this.type === 'short') {
            localStorage.setItem("productList", JSON.stringify(productList));
        }
        // click the clear icon to clear the input field and pass false As a parameter
        document.querySelector('.clear-icon').click();
    }

    handleDelete = (id) => {
        const removedProduct = this.localProducts.find(p => p.rId === id);
        const confirmBox = window.confirm(`Are you sure to delete ${removedProduct.label}?`);
        if (confirmBox === true) {
            const updatedProducts = this.localProducts.filter(p => p.rId !== id);
            this.setLocalProducts(updatedProducts);

            //if change field data contain the deleted product then remove it
            const changeFieldDataIndex = this.changeFieldData.findIndex(c => c.rId === id);
            if (changeFieldDataIndex !== -1) {
                this.changeFieldData.splice(changeFieldDataIndex, 1);
                localStorage.setItem(`${this.type}changeFieldData`, JSON.stringify(this.changeFieldData));
            }
            //also remove from modified product list
            if (!removedProduct._id) {
                const updatedModifiedProduct = this.modifiedProductList.filter(p => p?.rId !== id);
                this.setModifiedProductList(updatedModifiedProduct);
            } else {
                //find product to the product list with find method delete current found product and add original product to modified product list
                const originalProduct = this.productList.find(p => p._id === removedProduct._id);
                const updatedModifiedProduct = this.modifiedProductList.filter(p => p.rId !== id);
                this.setModifiedProductList([...updatedModifiedProduct, originalProduct]);
            }

            if (this.type === 'stock') {
                localStorage.setItem("stockList", JSON.stringify(updatedProducts));
            } else if (this.type === 'short') {
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

        const modifiedLocalProducts = this.localProducts.map(p => {
            const { id, oldQuantity, oldQuantityHome, ...rest } = p;
            return rest;
        })

        if (confirmBox === true) {
            const response = await fetchData('addProduct', 'POST', { productsCollection: modifiedLocalProducts }, { type: this.type === 'short' ? 'product' : this.type, user: this.user.email })
            if (response.status === 'success') {
                // from localProducts remove all the products which are already in database with _id
                const newProducts = modifiedLocalProducts.filter(p => !p._id);
                const modifiedNewProduct = newProducts.map(pd => {
                    return {
                        productId: null,
                        label: pd.label,
                        date: new Date().toISOString(),
                        user: this.user.email,
                        operation: 'insert',
                        rId: pd.rId,
                        productData: pd
                    }
                })
                // save history for new products
                if (this.type === 'short' && modifiedNewProduct.length > 0) {
                    fetchData('addHistory', 'POST', modifiedNewProduct)
                } else if (this.type === 'stock' && modifiedNewProduct.length > 0) {
                    fetchData('addStockHistory', 'POST', modifiedNewProduct)
                }

                // save history for already existing products

                if (this.changeFieldData.length > 0) {
                    if (this.type === 'short') {
                        fetchData('addHistory', 'POST', this.changeFieldData)
                    } else {
                        fetchData('addStockHistory', 'POST', this.changeFieldData)
                    }
                    this.setChangeFieldData([]);
                    localStorage.removeItem(`${this.type}changeFieldData`);
                }
                this.setAlertMessage({ message: `New ${response.data?.insertedCount || 0} & Updated ${response.data?.modifiedCount || 0} added.`, type: 'success' });
                this.setProductList(this.margeArray(modifiedLocalProducts, this.productList));
                localStorage.removeItem(this.type === "short" ? 'productList' : 'stockList');
                this.setLocalProducts([]);
                window.location.reload();
            }
            else {
                this.setAlertMessage({ message: response.message, type: 'error' });
            }
        }
        this.setIsLoading(false);
    }

    handleOnFill = (value) => {
        const companyList = this.type === 'short' ? storeData.companyList : storeData.stockCompanyList;
        const company = companyList.find(c => c.value === value.company);
        if (this.type === 'short') {
            this.setProductDetails({
                ...value,
                company,
                oldQuantity: Number(value.quantity),
                quantity: 1,
            });
        } else {
            this.setProductDetails({
                ...value,
                company,
                oldQuantity: Number(value.quantity),
                oldQuantityHome: Number(value.quantityHome || 0),
                quantity: 1,
                quantityHome: 0
            });
        }
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
    handleRestore,
    updateProductPrice,
    handleClear
} = new AddProductHandler();

