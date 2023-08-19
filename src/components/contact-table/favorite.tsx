import { IContact } from 'constant/form-contant'
// import sortData from '@/src/utility/sort'
import { css } from '@emotion/react'
import { Grid, Table } from 'antd'
import { ColumnsType } from 'antd/lib/table'
import React from 'react'

const { useBreakpoint } = Grid

interface IProps {
    columns: ColumnsType<IContact>
    displayedContacts: IContact[]
    favContactList: IContact[]
    handleFavoritePageChange: (page: number) => void
    currentPage: number
    PAGE_SIZE: number
}

export const Favorite = (props: IProps) => {
    const {
        columns,
        displayedContacts,
        handleFavoritePageChange,
        currentPage,
        PAGE_SIZE,
        favContactList,
    } = props
    const mq = useBreakpoint()
    return (
        <div
            css={css`
                background-color: #ffffff;
                padding: 1rem 0;
                border-radius: 8px;
                margin-top: 4rem;
                box-shadow: 6px 8px 16px -7px rgba(110, 110, 110, 1);
            `}
        >
            <h1
                css={css`
                    margin: 0.5rem 1rem;
                `}
            >
                Favorite Contact List
            </h1>
            <Table
                scroll={{ x: 300 }}
                columns={columns.filter((item) => item.key !== 'action')}
                // dataSource={sortData(displayedContacts)}
                dataSource={displayedContacts}
                rowKey='id'
                footer={
                    mq.xs
                        ? () => (
                              <span
                                  css={css`
                                      color: #91e3a9;
                                      font-weight: 900;
                                  `}
                              >
                                  This table is scrollable / swipeable
                              </span>
                          )
                        : undefined
                }
                pagination={{
                    onChange: handleFavoritePageChange,
                    current: currentPage,
                    total: favContactList.length,
                    pageSize: PAGE_SIZE,
                    showSizeChanger: false,
                    style: {
                        padding: '1.5rem 1rem',
                        borderRadius: '0 0 8px 8px',
                        margin: 0,
                        backgroundColor: '#FFFFFF',
                    },
                }}
            />
        </div>
    )
}
