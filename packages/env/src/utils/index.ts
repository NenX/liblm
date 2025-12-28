import { checkBloodPressure, checkPulse, checkTemperature } from './medical_examination'
import { getDictionaries, getDictionariesEnumerations, getDictionaryLabel, getDictionaryValue } from './dictionary'
import * as State from './state'

import { getUserData } from './user_data'
import * as func from './func'
export * from './dynamicScriptCtx'
export * from './MchcRouterContainer'
export * from './history'
export * from './runtime_ctx'
import * as checkIdNO from './checkIdNO'
export const mchcUtils = {
    checkBloodPressure,
    checkSphygmus: checkPulse,
    checkTemperature,
    getDictionariesEnumerations,
    getDictionaryLabel,
    getDictionaryValue,

    getDictionaries,
    getUserData,
    ...checkIdNO,
    ...func,
    ...State
}