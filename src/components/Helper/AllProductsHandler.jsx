import fetchData from "./HandleApi"
import { storeData } from "./storeData"

class ProductHandler {
    updateAllProductConstructor = (
        selectedCompany,
        setSelectedCompany,
        products,
        setProducts,
        productList,
        setProductList,
        TextareaValue,
        setTextareaValue,
        selectedProducts,
        setSelectedProducts,
        setAlertMessage,
        setIsTableLoading,
        setToggleClearRows,
        editableRowData,
        setEditableRowData,
        user,
        type,
    ) => {
        this.selectedCompany = selectedCompany
        this.setSelectedCompany = setSelectedCompany
        this.products = products
        this.setProducts = setProducts
        this.productList = productList
        this.setProductList = setProductList
        this.TextareaValue = TextareaValue
        this.setTextareaValue = setTextareaValue
        this.selectedProducts = selectedProducts
        this.setSelectedProducts = setSelectedProducts
        this.setAlertMessage = setAlertMessage
        this.setIsTableLoading = setIsTableLoading
        this.setToggleClearRows = setToggleClearRows
        this.editableRowData = editableRowData
        this.setEditableRowData = setEditableRowData
        this.user = user
        this.type = type
    }

    handleCompanyChange = () => {
        if (this.selectedCompany?.value === '') {
            this.setProducts(this.productList)
        }

        if (this.selectedCompany && this.selectedCompany?.value !== '') {
            const filteredProducts = this.productList.filter(product => product.company === this.selectedCompany.value)
            this.setProducts(filteredProducts)
        }
    }

    prepareTextareaValue = () => {
        if (!this.selectedProducts || this.selectedProducts?.length === 0) {
            return
        }
        const selectedProductList = this.selectedProducts.map(product => {
            return (
                `${product.label} -- ${product.quantity}`
            )
        })
        this.setTextareaValue(selectedProductList.join('\n'))
    }

    handleSelection = ({ selectedRows }) => {
        this.setSelectedProducts(selectedRows)
    };

    handleTextarea = (event) => {
        this.setTextareaValue(event.target.value)
    }

    handleCopy = () => {
        navigator.clipboard.writeText(this.TextareaValue)
        this.setAlertMessage({ message: 'Copied to clipboard', type: 'success' })
    }

    handleUpdate = async (isMarket) => {
        this.setIsTableLoading(true);
        if (window.confirm('Want to update the status')) {
            const updateProperty = isMarket ? 'market' : 'status';

            const list = this.selectedProducts.map(product => {
                return {
                    _id: product._id,
                    [updateProperty]: isMarket ? !product.market : (product.status === 'complete' ? 'pending' : 'complete')
                }
            });

            const response = await fetchData('addProduct', 'POST', { productsCollection: list }, { type: this.type === 'short' ? 'product' : 'stock', user: this.user.email });

            if (response.status === 'success') {
                const historyData = this.selectedProducts.map(pd => {
                    return {
                        productId: pd._id,
                        label: pd.label,
                        date: new Date().toISOString(),
                        user: this.user.email,
                        operation: 'update',
                        rId: pd.rId,
                        productData: {
                            [updateProperty]: isMarket ? !pd.market : [pd.status, pd.status === 'complete' ? 'pending' : 'complete']
                        }
                    };
                });

                const historyEndpoint = this.type === 'short' ? 'addHistory' : 'addStockHistory';
                fetchData(historyEndpoint, 'POST', historyData);

                this.setSelectedProducts([]);
                this.setTextareaValue(null);
                this.setToggleClearRows(true);
                this.setAlertMessage({ message: `${response.data.modifiedCount} Status updated successfully`, type: 'success' });

                // Update products based on selected products
                const updatedProductList = this.productList.map(product => {
                    const selectedProduct = this.selectedProducts.find(selectedProduct => selectedProduct._id === product._id);
                    if (selectedProduct) {
                        return {
                            ...product,
                            [updateProperty]: isMarket ? !selectedProduct.market : (selectedProduct.status === 'complete' ? 'pending' : 'complete')
                        };
                    }
                    return product;
                });

                const updatedProducts = this.products.map(product => {
                    const selectedProduct = this.selectedProducts.find(selectedProduct => selectedProduct._id === product._id);
                    if (selectedProduct) {
                        return {
                            ...product,
                            [updateProperty]: isMarket ? !selectedProduct.market : (selectedProduct.status === 'complete' ? 'pending' : 'complete')
                        };
                    }
                    return product;
                });

                this.setProducts(updatedProducts);
                this.setProductList(updatedProductList);
                this.setSelectedCompany(this.selectedCompany);
            } else {
                this.setAlertMessage({ message: response.message, type: 'error' });
            }
        }
        this.setIsTableLoading(false);
    };


    // handleUpdate = async (isMarket) => {
    //     this.setIsTableLoading(true);
    //     if (window.confirm('Want to update the status')) {
    //         const list = this.selectedProducts.map(product => {
    //             return {
    //                 _id: product._id,
    //                 status: product.status === 'complete' ? 'pending' : 'complete'
    //             }
    //         })
    //         const response = await fetchData('addProduct', 'POST', { productsCollection: list }, { type: this.type === 'short' ? 'product' : 'stock', user: this.user.email })

    //         if (response.status === 'success') {
    //             const historyData = this.selectedProducts.map(pd => {
    //                 return {
    //                     productId: pd._id,
    //                     label: pd.label,
    //                     date: new Date().toISOString(),
    //                     user: this.user.email,
    //                     operation: 'update',
    //                     rId: pd.rId,
    //                     productData: {
    //                         status: [pd.status, pd.status === 'complete' ? 'pending' : 'complete'],
    //                     }
    //                 }
    //             })
    //             if (this.type === 'short') {
    //                 fetchData('addHistory', 'POST', historyData)
    //             } else if (this.type === 'stock') {
    //                 fetchData('addStockHistory', 'POST', historyData)
    //             }
    //             this.setSelectedProducts([])
    //             this.setTextareaValue(null)
    //             this.setToggleClearRows(true)
    //             this.setAlertMessage({ message: `${response.data.modifiedCount} Status updated successfully`, type: 'success' })
    //             //change the status of the products as same as selected products
    //             const updatedProductList = this.productList.map(product => {
    //                 const selectedProduct = this.selectedProducts.find(selectedProduct => selectedProduct._id === product._id)
    //                 if (selectedProduct) {
    //                     return {
    //                         ...product,
    //                         status: selectedProduct.status === 'complete' ? 'pending' : 'complete'
    //                     }
    //                 }
    //                 return product
    //             })

    //             const updatedProducts = this.products.map(product => {
    //                 const selectedProduct = this.selectedProducts.find(selectedProduct => selectedProduct._id === product._id)
    //                 if (selectedProduct) {
    //                     return {
    //                         ...product,
    //                         status: selectedProduct.status === 'complete' ? 'pending' : 'complete'
    //                     }
    //                 }
    //                 return product
    //             })

    //             this.setProducts(updatedProducts)
    //             this.setProductList(updatedProductList)
    //             this.setSelectedCompany(this.selectedCompany)
    //         }
    //         else {
    //             this.setAlertMessage({ message: response.message, type: 'error' })
    //         }
    //     }
    //     this.setIsTableLoading(false);
    // }

    handleSetCompany = (company) => {
        this.setSelectedCompany(company)
    }

    handleRowClicked = (row) => {
        this.setEditableRowData(row);
        //there is a cheekbox wiich id is "my-modal" in the table. I want to click it when a row is clicked. do it react way
        const modal = document.getElementById("my-modal");
        modal.click();
    }

    handleSetEditableRowData = (data) => {
        this.setEditableRowData({ ...data, updated_at: new Date().toISOString(), updated_by: this.user?.email })
    }

    updateChangeableFieldData = () => {
        if (this.editableRowData._id) {
            const product = this.productList.find(p => p._id === this.editableRowData._id);
            const changeFieldData = {
                productId: this.editableRowData._id,
                label: this.editableRowData.label.trim(),
                date: new Date().toISOString(),
                user: this.user.email,
                operation: 'update',
                rId: this.editableRowData.rId,
                productData: {}
            };
            for (const key in product) {
                if (key === 'quantity' || key === 'quantityHome' || product[key] !== this.editableRowData[key]) {

                    //need to ignore some property like name, updated_at and updated_by
                    if (key === 'name' || key === 'updated_at' || key === 'updated_by' ||
                        key === 'extraDiscountPrice' || key === 'invoiceDiscountPrice' || key === 'totalPrice'
                    ) {
                        continue;
                    }
                    if (key === 'company' && product[key] === this.editableRowData[key].value) {
                        continue;
                    }
                    if (key === 'quantity' || key === 'quantityHome') {
                        changeFieldData['productData'][key] = [product[key], this.editableRowData[key] - product[key]];
                        continue;
                    }
                    changeFieldData['productData'][key] = [product[key], this.editableRowData[key]];
                }
            }
            return changeFieldData;
        }
    }

    handleProductEdit = async () => {
        if (!this.editableRowData.label || !this.editableRowData.quantity || !this.editableRowData.status) {
            alert('Please fill all the fields')
            return
        }
        const changeFieldData = this.updateChangeableFieldData();
        this.setIsTableLoading(true);
        const response = await fetchData('addProduct', 'POST', { productsCollection: [this.editableRowData] }, { type: this.type === 'short' ? 'product' : 'stock', user: this.user.email })
        if (response.status === 'success') {
            this.setAlertMessage({ message: 'Product updated successfully', type: 'success' })
            //change the status of the products as same as selected products
            const updatedProducts = this.products.map(product => {
                if (product._id === this.editableRowData._id) {
                    return this.editableRowData
                }
                return product
            })

            const updatedProductList = this.productList.map(product => {
                if (product._id === this.editableRowData._id) {
                    return this.editableRowData
                }
                return product
            })
            this.setProducts(updatedProducts)
            this.setProductList(updatedProductList)
            const companyDetails = storeData.companyList.find(company => company.value === this.editableRowData.company)
            this.setSelectedCompany(companyDetails)
            this.setEditableRowData({})
            if (this.type === 'short') {
                fetchData('addHistory', 'POST', [changeFieldData])
            } else if (this.type === 'stock') {
                fetchData('addStockHistory', 'POST', [changeFieldData])
            }
            const modal = document.getElementById("my-modal");
            modal.click();
        }
        else {
            this.setAlertMessage({ message: response.message, type: 'error' })
        }
        this.setIsTableLoading(false);
    }

    handleSelectedProductDelete = async () => {
        if (window.confirm(`Want to delete ${this.selectedProducts.length} products`)) {
            this.setIsTableLoading(true);
            const response = await fetchData('productDelete', 'DELETE', this.selectedProducts, { type: this.type === 'short' ? 'product' : 'stock', user: this.user.email })
            if (response.status === 'success') {
                // add history for deleted products
                const historyData = this.selectedProducts.map(pd => {
                    return {
                        productId: pd._id,
                        label: pd.label,
                        date: new Date().toISOString(),
                        user: this.user.email,
                        operation: 'delete',
                        rId: pd.rId,
                        productData: pd
                    }
                })
                if (this.type === 'short') {
                    fetchData('addHistory', 'POST', historyData)
                } else if (this.type === 'stock') {
                    fetchData('addStockHistory', 'POST', historyData)
                }

                this.setAlertMessage({ message: `${response.data.deletedCount} Products deleted successfully`, type: 'success' })
                //change the status of the products as same as selected products
                const updatedProducts = this.products.filter(product => {
                    const selectedProduct = this.selectedProducts.find(selectedProduct => selectedProduct._id === product._id)
                    if (selectedProduct) {
                        return false
                    }
                    return true
                })

                const updatedProductList = this.productList.filter(product => {
                    const selectedProduct = this.selectedProducts.find(selectedProduct => selectedProduct._id === product._id)
                    if (selectedProduct) {
                        return false
                    }
                    return true
                })
                this.setProducts(updatedProducts)
                this.setProductList(updatedProductList)
                this.setSelectedCompany(this.selectedCompany)
                this.setSelectedProducts([])
                this.setTextareaValue(null)
                this.setToggleClearRows(true)
            }
            else {
                this.setAlertMessage({ message: response.message, type: 'error' })
            }
            this.setIsTableLoading(false);
        }
    }
}

export const {
    updateAllProductConstructor,
    handleCompanyChange,
    prepareTextareaValue,
    handleSelection,
    handleTextarea,
    handleCopy,
    handleUpdate,
    handleSetCompany,
    handleRowClicked,
    handleSetEditableRowData,
    handleProductEdit,
    handleSelectedProductDelete
} = new ProductHandler();