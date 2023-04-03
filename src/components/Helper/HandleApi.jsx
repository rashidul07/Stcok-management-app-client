
const API = {
    productList: 'http://localhost:5000/products',
    addProduct: 'http://localhost:5000/addProducts',
    addStockProduct: 'http://localhost:5000/addStockProduct',
    stockList: 'http://localhost:5000/stockProducts',
    statusUpdate: 'http://localhost:5000/update',
}

// productList: 'https://rmcserver.cyclic.app/products',
//     addProduct: 'https://rmcserver.cyclic.app/addProducts',
//     addStockProduct: 'https://rmcserver.cyclic.app/addStockProduct',
//     stockList: 'https://rmcserver.cyclic.app/stockProducts',
//statusUpdate: 'https://rmcserver.cyclic.app/update',


export default async function fetchData(url, method, body = {}, params = {}) {
    method = method?.toUpperCase() || 'GET';
    url = API[url] || url;
    const fetchOptions = {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        }
    };

    if (method === 'POST' || method === 'PUT') {
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
