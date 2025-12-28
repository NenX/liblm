import { ICommonOption } from "../select_options"

export interface ISystemConfig {
    id: number
    systemName: string
    systemMode: "devlopment" | "test" | "production"
    systemTheme: string
    expireTime: number
    openWebsocket: boolean
    websocketAddress: "ws://127.0.0.1:8087/Laputa",
    auditRestriction: boolean
    openIntro: boolean
    fetalMonitor: string
    openHighriskSign: boolean
    highriskVersion: number
    curveVersion: "nichd",
    prenatalDiagnosis: boolean
    CaseReport: boolean
    FetalMonitor: boolean
    InformedConsent: boolean
    nurseDeskVoucher: boolean
    pregnancyInitial: 'tab' | 'vertical'
    isOpenDiabetes: boolean
    diagnosisStyle: "tab",
    diagnosisFollowUpRecord: boolean
    diagnosisLaboratoryReport: boolean
    diagnosisPrenatalVisit: boolean
    tablePrintBtn: boolean
    homeStatistics: boolean
    highriskStatistics: boolean
    customerService: true
    highriskType: string
    禁止编辑高危等级: boolean
    系统环境: any
    护士端_禁止编辑高危因素_传染病: boolean
    医生端_模块隐藏: ICommonOption[] // the old version is string[]
    doctorOpenWebsocket: boolean
    VTE预防用药筛查表: string
    nurseHide: ICommonOption[] // the old version is string[]
    medicalHide: ICommonOption[] // the old version is string[]
    PDF预览组件版本?: string
    老人模式?: boolean
    列表一页显示条数?: number
    医生端_检验检查时间轴隐藏?: boolean
    医生端_复诊按钮浮动?: boolean
    医生端_复诊左侧隐藏?: boolean
    医生端_复诊编辑控制?: boolean
    顶部工具栏隐藏?: boolean

}

interface ITab {


    closable: boolean
    key: string
    lastSearch: string
    path: string
    search: string
    title: string

}
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

export interface IState {
    system: {
        config: ISystemConfig
        collapsed: boolean
        socketState: boolean
    }
    tabs: {
        activeKey: string
        tabs: ITab[]
        tabsMapping: {
            [x: string]: ITab
        }
    }
    user: {
        userData: IMchc_User
        basicInfo: any
        allMenuTree: any[]
        menuTree: any[]
        permissionsMapping: { x: string }
    }
    dictionaries: { [x: string]: IDictionaries, } & { initDictionaries: IDictionaries[] }
}

export interface IDictionaries {
    id: number
    module: string
    type: number
    key: string
    name: string
    note: string
    enumerations: IDictionaries_Enumeration[]
}
export interface IDictionaries_Enumeration {
    id: number
    label: string
    note: string
    value: number
}