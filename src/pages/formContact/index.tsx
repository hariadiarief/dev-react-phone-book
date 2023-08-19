/** @jsxImportSource @emotion/react */
import { useEffect, useState } from 'react'

import { css } from '@emotion/react'
import { Button, Form, Input, message } from 'antd'
import { ApolloError, useMutation } from '@apollo/client'
import { useNavigate, useParams } from 'react-router-dom'

import { IContact, IPhone } from 'constant/form-contant'
import { PhoneField } from 'components'

import {
    CREATE_CONTACT,
    EDIT_CONTACT,
    EDIT_PHONE_NUMBER,
} from 'apollo-client/mutations'

import { useContactDetail, useContactLists, useContactCount } from 'hook'

import { ArrowLeftOutlined } from '@ant-design/icons'
import FIELDS from 'constant/form-field'

export default function FormContact() {
    const [form] = Form.useForm()
    const { contactID } = useParams()
    let navigate = useNavigate()

    const id = Number(contactID)

    const [mode, setMode] = useState('create')
    const {
        data: dataDetail,
        error: errorDetail,
        loading: loadingDetail,
    } = useContactDetail(id)

    const { refetchContacts } = useContactLists()
    const { refetchContactsCount } = useContactCount()
    const [createContact, { loading }] = useMutation(CREATE_CONTACT, {
        onCompleted: () => {
            refetchContacts()
            refetchContactsCount()
        },
    })
    const [editContact] = useMutation(EDIT_CONTACT)
    const [editPhoneNumber] = useMutation(EDIT_PHONE_NUMBER)
    const modeCapitalize = mode.charAt(0).toUpperCase() + mode.slice(1)

    useEffect(() => {
        if (dataDetail?.contact_by_pk) {
            setMode('edit')
            form.setFieldsValue({
                first_name: dataDetail.contact_by_pk.first_name,
                last_name: dataDetail.contact_by_pk.last_name,
                phones: dataDetail.contact_by_pk.phones.map(
                    (item: IPhone) => item.number
                ),
            })
        }
    }, [dataDetail])

    const onFinish = async (values: IContact) => {
        values.phones = values.phones?.map((item: IPhone, i) => ({
            number: item as unknown as string,
            index: i,
        }))
        const formInput = {
            first_name: values.first_name,
            last_name: values.last_name,
            phones: values.phones,
        }

        if (mode === 'create') {
            try {
                const createVar = {
                    ...formInput,
                    phones: values.phones.map((item: IPhone) => {
                        return { number: item.number }
                    }),
                }
                const response = await createContact({
                    variables: createVar,
                })
                if (response.data) {
                    message.success('Contact created successfully.')
                    form.resetFields()
                    navigate('/')
                }
            } catch (error) {
                if (error instanceof ApolloError) {
                    if (
                        error.graphQLErrors.some((graphQLError) =>
                            graphQLError.message.includes('phone_number_key')
                        )
                    ) {
                        message.error(
                            'Error creating contact: Phone number already exists'
                        )
                    } else {
                        console.error('Error creating contact:', error.message)
                    }
                }
            }
        } else if (mode === 'edit') {
            const editVar = {
                first_name: formInput.first_name,
                last_name: formInput.last_name,
            }
            try {
                const contactResult = await editContact({
                    variables: { id: id, _set: editVar },
                })
                if (contactResult.data) {
                    message.success('Contact edited successfully.')
                    navigate('/')
                    const changedPhoneIndices = formInput.phones.filter(
                        (formPhone, index) => {
                            const phone = dataDetail.contact_by_pk.phones[index]
                            return phone && formPhone.number !== phone.number
                        }
                    )

                    for (const phone of changedPhoneIndices) {
                        const phoneVar = {
                            pk_columns: {
                                contact_id: id,
                                number: dataDetail.contact_by_pk.phones[
                                    phone.index!
                                ].number,
                            },
                            new_phone_number: phone.number,
                        }
                        try {
                            await editPhoneNumber({
                                variables: phoneVar,
                            })
                        } catch (error) {
                            message.error(
                                'There are some error with the contact.'
                            )
                        }
                    }
                }
            } catch (error) {
                message.error('There are some error with the contact.')
            }
        }
    }

    if (errorDetail && mode === 'edit') return <div>Something went error.</div>

    return (
        <div
            css={css`
                height: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                object-fit: contain;
                background-repeat: no-repeat;
                background-size: cover;
                padding-top: 50px;
            `}
        >
            <div
                css={css`
                    padding: 1rem;
                    margin: 0 1rem;
                    width: 450px;
                    box-shadow: 6px 8px 16px -7px rgba(110, 110, 110, 1);
                    border-radius: 8px;
                    background-color: #ffffff;
                `}
            >
                <h1>
                    <ArrowLeftOutlined onClick={() => navigate('/')} />{' '}
                    {modeCapitalize} Contact
                </h1>
                <Form
                    layout='vertical'
                    form={form}
                    disabled={loadingDetail}
                    name='control-hooks'
                    onFinish={onFinish}
                    css={css`
                        max-width: 100%;
                        padding: 1rem;
                        background: #ffffff;
                        border-radius: 8px;
                    `}
                >
                    {FIELDS.map((item, i) => (
                        <Form.Item
                            key={i}
                            name={item.name}
                            label={item.label}
                            rules={item.rules}
                        >
                            <Input
                                onKeyPress={(event) => {
                                    if (!/^[A-Za-z0-9]*$/.test(event.key)) {
                                        event.preventDefault()
                                    }
                                }}
                            />
                        </Form.Item>
                    ))}
                    <PhoneField mode={mode} />
                    <Form.Item
                        css={css`
                            text-align: right;
                        `}
                    >
                        <Button
                            loading={loading}
                            type='primary'
                            shape='round'
                            htmlType='submit'
                        >
                            Submit {mode === 'edit' && modeCapitalize}
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
}
