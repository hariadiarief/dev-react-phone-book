import { gql, useQuery } from '@apollo/client'

const GET_CONTACT_LISTS = gql`
    query GetContactList(
        $distinct_on: [contact_select_column!]
        $limit: Int
        $offset: Int
        $order_by: [contact_order_by!]
        $where: contact_bool_exp
    ) {
        contact(
            distinct_on: $distinct_on
            limit: $limit
            offset: $offset
            order_by: $order_by
            where: $where
        ) {
            created_at
            first_name
            id
            last_name
            phones {
                number
            }
        }
    }
`

export const useContactLists = (searchVal = '') => {
    const { data, error, loading, fetchMore, refetch } = useQuery(
        GET_CONTACT_LISTS,
        {
            variables: {
                limit: 10,
                offset: 0,
                where: {
                    _or: [
                        {
                            first_name: {
                                _ilike: `%${searchVal.toLowerCase()}%`,
                            },
                        },
                        {
                            last_name: {
                                _ilike: `%${searchVal.toLowerCase()}%`,
                            },
                        },
                    ],
                },
            },
        }
    )

    const refetchContacts = () => {
        refetch()
    }

    return {
        data,
        error,
        loading,
        fetchMore,
        refetchContacts,
    }
}
