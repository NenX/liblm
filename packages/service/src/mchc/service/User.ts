import { ModelService } from "../../ModelService"



export interface IMchc_Permission {
    active: boolean
    icon: string
    id: number
    key: string /// eg. /knowledge/list
    name: string
    parentid: number
    sort: number
    type: "menu" | "route"

}

export interface IMchc_Group {
    authorities: { name: string }[]
    groupdesc: string
    id: number
    name: string
    nickname: string
    permissions: IMchc_Permission[]
    groupRanks?: {
        "id": 2,
        "name": "组员",
        "administrator": 1,
        "rankSort": 1,
        "groupId": 1
    }[]
}


export interface IMchc_User {
    activated: true
    authorities: null
    config: null
    createdBy: string
    createdDate: string
    email: string
    firstName: string
    groups: IMchc_Group[]
    id: number
    imageUrl: null
    langKey: string
    lastModifiedBy: string
    lastModifiedDate: string
    lastName: null
    login: string
    overdueDate: string
    password: null
    userType: null
    wards: null
}

export const SMchc_User = new ModelService<IMchc_User>({
    n: '/users',
})