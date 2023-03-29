import { Link, Table, TableColumn } from '@backstage/core-components'
import React from 'react'

const NetworkList = () => {
  const dummyData = ['Network 1', 'Network 2', 'Network 3', 'Network 4', 'Network 5']
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
      title="Networks"
      options={{ paging: false, padding: 'dense', search: false, sorting: false }}
      data={dummyData}
      columns={columns}
    />
  )
}

export default NetworkList
