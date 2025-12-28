import { ModelService } from "../../../ModelService"

export interface IMchc_Dictionaries {
    id: number
    module: string
    type: number
    key: string
    name: string
    note: string
    enumerations: IMchc_Dictionaries_Enumeration[]
}
export interface IMchc_Dictionaries_Enumeration {
    id: number
    label: string
    note: string
    value: number
}


export const SMchc_Dictionaries = new ModelService<IMchc_Dictionaries>({
    n: '/dictionaries',
})