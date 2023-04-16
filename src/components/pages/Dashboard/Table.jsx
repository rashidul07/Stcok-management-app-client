import DataTable from "react-data-table-component"
import UseContext from "../../contexts/UseContext"
import TableSettings from "../AllProducts/TableSettings"

const Table = ({ type }) => {
    const { stockProductHistory, productHistory } = UseContext()
    return (
        <DataTable
            columns={TableSettings.dashBoardShortProduct}
            data={type === 'stock' ? stockProductHistory : productHistory}
            keyField="_id"
            className="my-4"
        //expandableRows
        //expandableRowsComponent={TableSettings.ExpandedComponent}
        //className={type === 'product' ? 'shortListTable' : 'stockListTable'}
        //selectableRows
        //selectableRowsHighlight
        // onSelectedRowsChange={handleSelection}
        // clearSelectedRows={toggledClearRows}
        //conditionalRowStyles={TableSettings.conditionalRowStyles}
        //onRowClicked={handleRowClicked}
        />
    )
}

export default Table