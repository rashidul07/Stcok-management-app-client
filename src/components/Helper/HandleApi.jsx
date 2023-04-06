const API = {
    productList: 'https://rmcserver.cyclic.app/getProducts',
    addProduct: 'https://rmcserver.cyclic.app/addProducts',
    productDelete: 'https://rmcserver.cyclic.app/deleteProducts',
    stockList: 'https://rmcserver.cyclic.app/getStockProducts',
    addStockProduct: 'https://rmcserver.cyclic.app/addStockProduct',
}
// const API = {
//     productList: 'http://localhost:5000/getProducts',
//     addProduct: 'http://localhost:5000/addProducts',
//     productDelete: 'http://localhost:5000/deleteProducts',
//     stockList: 'http://localhost:5000/getStockProducts',
//     addStockProduct: 'http://localhost:5000/addStockProduct',
// }

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
