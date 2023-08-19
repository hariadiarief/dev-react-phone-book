import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'
import { css } from '@emotion/react'
import { Button, Form, Input } from 'antd'

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 24 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 24 },
    },
}

const formItemLayoutWithOutLabel = {
    wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 24, offset: 0 },
    },
}

interface IProps {
    mode: string
}

export const PhoneField = (props: IProps) => {
    const { mode } = props
    return (
        <Form.List
            name='phones'
            rules={[
                {
                    validator: async (_, names) => {
                        if (!names || names.length < 1) {
                            return Promise.reject(
                                new Error(
                                    'Please input at least 1 phone number'
                                )
                            )
                        }
                    },
                },
            ]}
        >
            {(fields, { add, remove }, { errors }) => (
                <>
                    {fields.map((field, index) => (
                        <Form.Item
                            {...(index === 0
                                ? formItemLayout
                                : formItemLayoutWithOutLabel)}
                            label={index === 0 ? 'Phone Number' : ''}
                            required={false}
                            key={field.key}
                        >
                            <Form.Item
                                {...field}
                                validateTrigger={['onChange', 'onBlur']}
                                rules={[
                                    {
                                        required: true,
                                        whitespace: true,
                                        message:
                                            'Please phone number or delete this field.',
                                    },
                                ]}
                                noStyle
                            >
                                <Input
                                    onKeyPress={(event) => {
                                        if (!/[0-9]/.test(event.key)) {
                                            event.preventDefault()
                                        }
                                    }}
                                    placeholder='phone number'
                                    css={css`
                                        width: 60%;
                                        margin-right: 1rem;
                                    `}
                                />
                            </Form.Item>
                            {fields.length > 1 && mode !== 'edit' ? (
                                <MinusCircleOutlined
                                    key={Math.random()}
                                    onClick={() => remove(field.name)}
                                />
                            ) : null}
                        </Form.Item>
                    ))}
                    {mode === 'create' ? (
                        <Form.Item>
                            <Button
                                type='dashed'
                                onClick={() => add()}
                                css={css`
                                    width: 100%;
                                `}
                                icon={<PlusOutlined />}
                            >
                                Add phone number field
                            </Button>
                            <Form.ErrorList errors={errors} />
                        </Form.Item>
                    ) : null}
                </>
            )}
        </Form.List>
    )
}
