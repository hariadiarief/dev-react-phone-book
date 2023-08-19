import { gql, useQuery } from '@apollo/client'

const GET_CONTACT_DETAIL = gql`
    query GetContactDetail($id: Int!) {
        contact_by_pk(id: $id) {
            last_name
            id
            first_name
            created_at
            phones {
                number
            }
        }
    }
`

export const useContactDetail = (id: number) => {
    const { data, error, loading } = useQuery(GET_CONTACT_DETAIL, {
        variables: {
            id,
        },
    })

    return {
        data,
        error,
        loading,
    }
}
