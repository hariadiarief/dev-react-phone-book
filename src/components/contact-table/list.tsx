import { css } from '@emotion/react'
import React from 'react'
import { Button, Grid, Input, Table } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { IContact } from 'constant/form-contant'
import { ColumnsType } from 'antd/lib/table'
import { useNavigate } from 'react-router-dom'

const { useBreakpoint } = Grid

interface IProps {
    searchVal: string
    setSearchVal: (val: string) => void
    loading: boolean
    loadingCount: boolean
    count: number
    sortedContactsAlphabetic: IContact[]
    handlePageChange: (page: number) => void
    handleDelete: (id: string) => Promise<void>
    PAGE_SIZE: number
    columns: ColumnsType<IContact>
}

export const List = (props: IProps) => {
    let navigate = useNavigate()

    const {
        searchVal,
        setSearchVal,
        loading,
        loadingCount,
        count,
        sortedContactsAlphabetic,
        handlePageChange,
        PAGE_SIZE,
        columns,
    } = props
    const mq = useBreakpoint()
    return (
        <>
            <div
                css={css`
                    display: flex;
                    justify-content: space-between;
                    flex-wrap: wrap;
                    align-items: center;
                    background-color: white;
                    padding: 1rem;
                    border-radius: 8px 8px 0 0;
                    margin-top: 4rem;
                    box-shadow: 6px 8px 16px -7px rgba(110, 110, 110, 1);
                `}
            >
                <h1
                    css={css`
                        margin-bottom: 0;
                    `}
                >
                    Contact List
                </h1>
                <div
                    css={css`
                        display: flex;
                        gap: 8px;
                    `}
                >
                    <Input
                        value={searchVal}
                        css={css`
                            border-radius: 16px;
                        `}
                        onChange={(e) => setSearchVal(e.target.value)}
                        placeholder='Search Name...'
                    />
                    <Button
                        icon={
                            <PlusOutlined
                                css={css`
                                    stroke-width: 3;
                                    stroke: white;
                                `}
                            />
                        }
                        onClick={() => navigate('/form')}
                        shape='round'
                        type='primary'
                    >
                        Add {mq.xs ? '' : 'Contact'}
                    </Button>
                </div>
            </div>
            <Table
                css={css`
                    box-shadow: 6px 8px 16px -7px rgba(110, 110, 110, 1);
                `}
                scroll={{ x: 300 }}
                loading={loading || loadingCount}
                columns={columns}
                dataSource={sortedContactsAlphabetic}
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
                    style: {
                        padding: '1.5rem 1rem',
                        borderRadius: '0 0 8px 8px',
                        margin: 0,
                        backgroundColor: '#FFFFFF',
                    },
                    total: count,
                    defaultPageSize: PAGE_SIZE,
                    onChange: handlePageChange,
                }}
            />
        </>
    )
}
