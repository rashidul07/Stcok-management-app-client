
const API = {
    productList: `${import.meta.env.VITE_SERVER_URL}/getProducts`,
    addProduct: `${import.meta.env.VITE_SERVER_URL}/addProducts`,
    productDelete: `${import.meta.env.VITE_SERVER_URL}/deleteProducts`,
    addHistory: `${import.meta.env.VITE_SERVER_URL}/addHistory`,
    addStockHistory: `${import.meta.env.VITE_SERVER_URL}/addStockHistory`,
    getHistory: `${import.meta.env.VITE_SERVER_URL}/getHistory`,
    getStockHistory: `${import.meta.env.VITE_SERVER_URL}/getStockHistory`,
    getProductsLength: `${import.meta.env.VITE_SERVER_URL}/getProductsLength`,
    modifyProduct: `${import.meta.env.VITE_SERVER_URL}/modifyProducts`,
    allUsers: `${import.meta.env.VITE_SERVER_URL}/allUsers`,
    dbProducts: `${import.meta.env.VITE_SERVER_URL}/getDbProducts`,
}

export default async function fetchData(url, method, body = {}, params = {}) {
    method = method?.toUpperCase() || 'GET';
    url = API[url] || url;
    const fetchOptions = {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        }
    };

    if (method === 'POST' || method === 'PUT' || method === 'DELETE') {
        fetchOptions.body = JSON.stringify(body);
        if (Object.keys(params).length > 0) {
            url = new URL(url);
            Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
        }
    } else if (method === 'GET') {
        url = new URL(url);
        Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
    }

    const apiResponse = {
        status: "",
        data: "",
    }

    try {
        const response = await fetch(url, fetchOptions);
        const data = await response.json();
        apiResponse.status = 'success';
        apiResponse.data = data;
        apiResponse.message = "API Response Success";
        return apiResponse;
    } catch (error) {
        apiResponse.status = 'error';
        apiResponse.message = "API Response Failed";
        return apiResponse;
    }
}
