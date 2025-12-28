import { mchcEnv, mchcStore, mchcUtils } from "@lm_fe/env"
import { IMchc_User } from "../../mchc"
import { SLocal_SystemConfig } from "../SystemConfig"
import { getSearchParamsValue } from "@lm_fe/utils"








export const SLocal_State = {
  getUserData() {
    return this.userData
  },
  get userData() {
    return mchcEnv.userData as IMchc_User
  },
  get isDev() {

    const isTestMode = SLocal_SystemConfig.get('systemMode') === 'test'
    return mchcEnv.isDev || isTestMode
  },
  get isAdmin() {
    return mchcEnv.isAdmin

  }

}