import { ISystemConfig, mchcConfig, mchcStore, mchcUtils } from "@lm_fe/env"











export const SLocal_SystemConfig = {

  get<T extends keyof ISystemConfig>(key: T) {
    const config = this.getAll()
    const value = config?.[key]
    return value
  },
  getAll() {
    return mchcConfig.getAll()
    // const state = mchcStore.state
    // const config: ISystemConfig | undefined = state?.system?.config
    // return config
  }
}