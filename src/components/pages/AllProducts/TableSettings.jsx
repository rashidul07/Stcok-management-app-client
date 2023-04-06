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
            selector: row => row.quantity,
            className: 'table-column quantity',
        },
        {
            name: 'price',
            selector: row => row.price,
            className: 'table-column price',
        },
        {
            name: 'PA I/D',
            selector: row => row.invoiceDiscountPrice + '(' + row.invoiceDiscount + ')',
            className: 'table-column invoice',
        },
        {
            name: 'PA A/D',
            selector: row => row.extraDiscountPrice,
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
