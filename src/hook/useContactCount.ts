import { gql, useQuery } from '@apollo/client'

const GET_CONTACT_COUNT = gql`
    query GetContactCount(
        $distinct_on: [contact_select_column!]
        $limit: Int
        $offset: Int
        $order_by: [contact_order_by!]
        $where: contact_bool_exp
    ) {
        contact_aggregate(
            distinct_on: $distinct_on
            limit: $limit
            offset: $offset
            order_by: $order_by
            where: $where
        ) {
            aggregate {
                count
            }
        }
    }
`

export const useContactCount = () => {
    const { data, error, loading, refetch } = useQuery(GET_CONTACT_COUNT)

    const refetchContactsCount = () => {
        refetch()
    }

    return {
        data,
        error,
        loading,
        refetchContactsCount,
    }
}
