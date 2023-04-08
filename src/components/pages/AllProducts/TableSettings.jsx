const caseInsensitiveSort = (rowA, rowB) => {
    const a = rowA.name.toLowerCase();
    const b = rowB.name.toLowerCase();

    if (a > b) {
        return 1;
    }

    if (b > a) {
        return -1;
    }

    return 0;
};
const TableSettings = {
    ExpandedComponent: ({ data }) => {
        return (
            <div className="flex flex-col mr-2 ml-2">
                <div className="flex flex-row justify-between">
                    <div className="flex flex-col">
                        <p className="text-xs">{(new Date(data.time)).toString().slice(0, 25)}</p>
                        <p className="text-xs">{data?.created_by ? data.created_by : ''}</p>
                    </div>
                    {
                        (data?.updated_at && data.time !== data?.updated_at) ?
                            <div className="flex flex-col">
                                <p className="text-xs">{(new Date(data.updated_at)).toString().slice(0, 25)}</p>
                                <p className="text-xs">{data.updated_by}</p>
                            </div> : ''
                    }
                </div>
            </div>
        )
    },
    stockProductExpandedComponent: ({ data }) => { },
    shortProductColumns: [
        {
            name: 'Name',
            selector: row => row.name,
            sortable: true,
            sortFunction: caseInsensitiveSort,
            className: 'table-column name',
        },
        {
            name: 'Company',
            selector: row => row.company,
            className: 'table-column company',
        },
        {
            name: 'Q',
            selector: row => row.quantity,
            className: 'table-column quantity',
        }
    ],
    stockProductColumns: [
        {
            name: 'Name',
            selector: row => row.name,
            sortable: true,
            sortFunction: caseInsensitiveSort,
            className: 'table-column name',
        },
        {
            name: 'Company',
            selector: row => row.company,
            className: 'table-column company',
        },
        {
            name: 'Q',
            selector: row => row.quantityHome ? (row.quantity + row.quantityHome + ' (' + row.quantityHome + ')') : row.quantity,
            className: 'table-column quantity',
        },
        {
            name: 'price',
            selector: row => row.price,
            className: 'table-column price',
        },
        {
            name: 'P.A I/D',
            selector: row => row.invoiceDiscount ? (row.invoiceDiscountPrice + ' (' + row.invoiceDiscount + ')') : row.invoiceDiscountPrice,
            className: 'table-column invoice',
        },
        {
            name: 'P.A E/D',
            selector: row => row.extraDiscount ? (row.extraDiscountPrice + ' (' + row.extraDiscount + ')') : row.extraDiscountPrice,
            className: 'table-column extra',
        },
        {
            name: 'Total',
            selector: row => row.totalPrice,
            className: 'table-column extra',
        }
    ],
    conditionalRowStyles: [
        {
            when: row => row?.status === 'complete',
            style: {
                backgroundColor: '#ABC4AA',
                color: 'white',
            },
        },
    ]
}

export default TableSettings;
