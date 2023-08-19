export interface IPhone {
    number: string
    index?: number
}

export interface IContact {
    id: string
    is_favorite?: boolean
    first_name: string
    last_name: string
    phones: IPhone[]
}
