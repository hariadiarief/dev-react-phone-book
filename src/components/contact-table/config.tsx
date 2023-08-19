import { IContact } from 'constant/form-contant'
import {
    DeleteOutlined,
    EditOutlined,
    HeartFilled,
    HeartOutlined,
} from '@ant-design/icons'
import { css } from '@emotion/react'
import { Button, Space, Tag } from 'antd'
import { ColumnsType } from 'antd/lib/table'
import { useNavigate } from 'react-router-dom'

interface IProps {
    handleFavoriteToggle: (record: IContact) => void
    handleDelete: (id: string) => Promise<void>
    refetchContactsCount: () => void
}

export const Config = ({
    handleDelete,
    handleFavoriteToggle,
    refetchContactsCount,
}: IProps): ColumnsType<IContact> => {
    let navigate = useNavigate()

    return [
        {
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'First Name',
            dataIndex: 'first_name',
            key: 'first_name',
        },
        {
            title: 'Last Name',
            dataIndex: 'last_name',
            key: 'last_name',
        },
        {
            title: 'Phone Number',
            dataIndex: 'phones',
            key: 'phones',
            render: (phones: { number: string }[]) => (
                <>
                    {phones.map((item) => {
                        return (
                            <Tag color='green' key={item.number}>
                                {item.number}
                            </Tag>
                        )
                    })}
                </>
            ),
        },
        {
            title: 'Favorite',
            dataIndex: 'is_favorite',
            key: 'is_favorite',
            render: (is_favorite: boolean, record: IContact) => (
                <>
                    {is_favorite ? (
                        <HeartFilled
                            onClick={() => handleFavoriteToggle(record)}
                            css={css`
                                font-size: 24px;
                                color: #ff7f7f;
                                cursor: pointer;
                            `}
                        />
                    ) : (
                        <HeartOutlined
                            onClick={() => handleFavoriteToggle(record)}
                            css={css`
                                font-size: 24px;
                                cursor: pointer;
                            `}
                        />
                    )}
                </>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (_: any, record: IContact) => (
                <Space
                    css={css`
                        flex-wrap: wrap;
                    `}
                    size='middle'
                >
                    <Button
                        onClick={() => navigate(`/form/${record.id}`)}
                        icon={<EditOutlined />}
                        shape='round'
                    >
                        Edit
                    </Button>
                    <Button
                        icon={<DeleteOutlined />}
                        shape='round'
                        onClick={() =>
                            handleDelete(record.id).then(() =>
                                refetchContactsCount()
                            )
                        }
                        danger
                    >
                        Delete
                    </Button>
                </Space>
            ),
        },
    ].filter((item) => item.key !== 'id')
}
