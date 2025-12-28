

export interface IMchc_Doctor_BuildExamTimeAxis {
    gestationalWeekStart: string
    gestationalWeekEnd: string
    enumName: string
    arrived: boolean
    inCurrentGestationalWeek: boolean
    lackReports: string[]
    groups: {
        groupDate: string
        reports: {
            itemInfosAbnormal: boolean
            reportTitle: string
            itemInfos: {
                abnormal: any
                description:string
            }[]
        }[]
    }[]

}