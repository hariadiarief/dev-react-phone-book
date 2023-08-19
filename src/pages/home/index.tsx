/** @jsxImportSource @emotion/react */

import { useEffect, useState } from 'react'
import { useMutation } from '@apollo/client'
import { message } from 'antd'

import { IContact } from 'constant/form-contant'
import { Favorite, List, Config } from 'components'
import { useContactLists, useContactCount, useDebounce } from 'hook'
import { DELETE_CONTACT, CREATE_CONTACT } from 'apollo-client/mutations'

const PAGE_SIZE = 10

export default function Home() {
    const [searchVal, setSearchVal] = useState('')
    const [query, setQuery] = useState('')
    const [favContactList, setFavContactList] = useState<IContact[]>([])
    const [currentPage, setCurrentPage] = useState(1)

    const { data, error, loading, fetchMore, refetchContacts } =
        useContactLists(query)

    const {
        data: dataCount,
        error: errorCount,
        loading: loadingCount,
        refetchContactsCount,
    } = useContactCount()

    const [createContact] = useMutation(CREATE_CONTACT, {
        onCompleted: () => {
            refetchContacts()
        },
    })

    const [deleteContact] = useMutation(DELETE_CONTACT, {
        onCompleted: () => {
            refetchContacts()
        },
    })

    const sortedContactsAlphabetic = data?.contact
        ? [...data.contact].sort((a: IContact, b: IContact) =>
              a.first_name.localeCompare(b.first_name)
          )
        : []

    const handleFavoritePageChange = (page: number) => {
        setCurrentPage(page)
    }

    useEffect(() => {
        const initialData = localStorage.getItem('favContactList')

        setFavContactList(initialData ? JSON.parse(initialData) : [])
    }, [])

    useDebounce(
        () => {
            setQuery(searchVal)
        },
        [searchVal],
        500
    )

    const startIndex = (currentPage - 1) * PAGE_SIZE
    const endIndex = startIndex + PAGE_SIZE
    const displayedContacts = favContactList.slice(startIndex, endIndex)

    const handleFavoriteToggle = async (record: IContact) => {
        const isFavorite = favContactList.some(
            (contact) => contact.id === record.id
        )

        if (isFavorite) {
            const updatedFavorites = favContactList.filter(
                (contact) => contact.id !== record.id
            )
            const item = favContactList.find(
                (contact) => contact.id === record.id
            )
            const createVar = {
                first_name: item?.first_name,
                last_name: item?.last_name,
                phones: item?.phones.map((phone) => ({ number: phone.number })),
            }

            try {
                const response = await createContact({
                    variables: createVar,
                })
                if (response.data) {
                    message.success('Contact added to regular successfully.')
                    localStorage.setItem(
                        'favContactList',
                        JSON.stringify(updatedFavorites)
                    )
                    setFavContactList(updatedFavorites)
                    refetchContactsCount()
                }
            } catch (error) {
                message.success('Failed to add regular.')
            }
        } else {
            const updatedFavorites = [
                ...favContactList,
                { ...record, is_favorite: true },
            ]
            localStorage.setItem(
                'favContactList',
                JSON.stringify(updatedFavorites)
            )
            setFavContactList(updatedFavorites)
            handleDelete(record.id, true).then(() => refetchContactsCount())
        }
    }

    const handleDelete = async (id: string, isFavorite?: boolean) => {
        try {
            const response = await deleteContact({ variables: { id } })
            if (response.data) {
                message.success(
                    `Contact ${
                        isFavorite ? 'added to favorite' : 'deleted'
                    } successfully.`
                )
            }
        } catch (error) {
            message.error(
                `Failed to ${isFavorite ? 'add favorite' : 'delete'} a contact.`
            )
        }
    }

    const columns = Config({
        handleDelete,
        handleFavoriteToggle,
        refetchContactsCount,
    })

    const handlePageChange = (page: number, pageSize?: number) => {
        const offset = (page - 1) * (pageSize || PAGE_SIZE)

        fetchMore({
            variables: {
                offset,
                limit: pageSize || PAGE_SIZE,
            },
            updateQuery: (prev, { fetchMoreResult }) => {
                if (!fetchMoreResult) return prev
                return fetchMoreResult
            },
        })
    }

    const count = dataCount?.contact_aggregate.aggregate?.count

    return (
        <div className='container pt-8'>
            <List
                loading={loading}
                loadingCount={loadingCount}
                sortedContactsAlphabetic={sortedContactsAlphabetic}
                columns={columns}
                searchVal={searchVal}
                setSearchVal={setSearchVal}
                handlePageChange={handlePageChange}
                count={count}
                handleDelete={handleDelete}
                PAGE_SIZE={PAGE_SIZE}
            />

            <hr />

            <Favorite
                PAGE_SIZE={PAGE_SIZE}
                favContactList={favContactList}
                columns={columns}
                currentPage={currentPage}
                handleFavoritePageChange={handleFavoritePageChange}
                displayedContacts={displayedContacts}
            />
        </div>
    )
}
