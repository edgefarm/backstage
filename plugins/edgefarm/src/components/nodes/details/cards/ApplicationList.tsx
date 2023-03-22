import { Link, Table, TableColumn } from '@backstage/core-components'
import React from 'react'


type Props = {}

const ApplicationList = (props: Props) => {
    const dummyData = ['Application 1', 'Application 2', 'Application 3', 'Application 4', 'Application 5']
        .map((item) => { return { title: <Link to={`/default/component/${item}`}>{item}</Link> } })
    const columns: TableColumn[] = [
        {
            title: 'Name',
            field: 'title',
            highlight: true,
        },
    ];

    return (
        <Table
            title="Applications"
            options={{ paging: false, padding: 'dense', search: false, sorting: false }}
            data={dummyData}
            columns={columns}
        />
    )
}

export default ApplicationList
