import DataTable from "react-data-table-component"

const Table = ({ data }) => {
    if (data.length === 0) return null;
    data = data.map((row, index) => {
        return { ...row, id: index }
    })
    const columns = [
        {
            name: 'label',
            selector: row => row.label,
            width: "100px",
            style: { paddingLeft: "5px", paddingRight: "5px" }
        },
        {
            name: "user",
            selector: row => row.user.split('@')[0],
            width: "60px",
            style: { paddingLeft: "5px", paddingRight: "5px" }
        }
    ]
    return (
        <DataTable
            columns={columns}
            data={data}
            expandableRows
            className="mt-4 w-full overflow-hidden"
            expandableRowsComponent={({ data }) => {
                return (
                    <div className="flex flex-col mr-2 ml-2">
                        {
                            data.operation === 'insert' ? <p className="text-xs">Added {data.productData.quantity} product at {(new Date(data.date)).toString().slice(0, 25)}. </p> : ''
                        }
                        {
                            data.operation === 'delete' ? <p className="text-xs">Deleted {Array.isArray(data.productData.quantity) ? data.productData.quantity[0] :
                                data.productData.quantity} product at {(new Date(data.date)).toString().slice(0, 25)}.</p> : ''
                        }
                        {
                            data.operation === 'update' ?
                                Object.keys(data.productData).map((key, index) => {
                                    return typeof data.productData[key][1] === 'string' ? <p key={index} className="text-xs">{key}: {data.productData[key][0]} to {data.productData[key][1]}  at {(new Date(data.date)).toString().slice(0, 25)} </p> :
                                        (data.productData[key][1] > 0 ? <p key={index} className="text-xs">Increase Quantity by {data.productData[key][1]} - previous {data.productData[key][0]} now - {
                                            Number(data.productData[key][0]) + Number(data.productData[key][1])}  at {(new Date(data.date)).toString().slice(0, 25)}</p> : (data.productData[key][1] < 0 ? <p key={index} className="text-xs">Decrease Quantity by {data.productData[key][1]} - previous {data.productData[key][0]} now - {
                                                data.productData[key][0] + data.productData[key][1]}  at {(new Date(data.date)).toString().slice(0, 25)} </p> : ''))
                                }) : ''
                        }
                    </div>
                )
            }}
            conditionalRowStyles={[{
                when: row => row.operation === 'insert',
                style: {
                    backgroundColor: '#c6f1d6',
                    color: 'black',
                },
            },
            {
                when: row => (row.operation === 'update' && row.productData.quantity?.[1] < 0), // decrease number
                style: {
                    backgroundColor: '#ea9f9f',
                    color: '#0e1a2a',
                },
            },
            {
                when: row => (row.operation === 'update' && row.productData.quantity?.[1] > 0), // increase number
                style: {
                    backgroundColor: '#E8F6EF',
                    color: 'blue',
                },
            },
            {
                when: row => (row.operation === 'update' && row.productData["status"]?.[1]), // string
                style: {
                    backgroundColor: '#E8F6EF',
                    color: 'magenta',
                },
            },
            {
                when: row => (row.operation === 'update' && row.productData["company"]?.[1]), // string
                style: {
                    backgroundColor: '#E8F6EF',
                    color: 'magenta',
                },
            },
            {
                when: row => row.operation === 'delete',
                style: {
                    backgroundColor: '#a30a0a',
                    color: '#ecf0ec',
                },
            }
            ]}
        />
    )
}

export default Table