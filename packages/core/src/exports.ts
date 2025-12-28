import { mchcModal__, } from '@lm_fe/pages'
import { mchcRoutes, } from '@lm_fe/pages-mchc'
import { mchcEnv, mchcMacro, mchcEvent, MchcRouterContainer, mchcRouterContainer__ } from '@lm_fe/env'

function set_global_ret<T>(m: T, name: string) {
    return (window as any)[name] = m
}
export const mchc_env = set_global_ret(mchcEnv, 'mchc_env') as typeof mchcEnv
export const mchc_modal = set_global_ret(mchcModal__, 'mchc_modal') as typeof mchcModal__
export const mchc_modal1 = set_global_ret(mchcModal__, 'mchc_modal') as typeof mchcModal__
export const mchc_macro = set_global_ret(mchcMacro, 'mchc_macro')
export const mchc_event = set_global_ret(mchcEvent, 'mchc_event')
export const mchc_routes = set_global_ret(mchcRoutes, 'mchc_routes')

export const mchc_routes_container = set_global_ret(mchcRouterContainer__, 'mchc_routes_container')

export const Mchc_Router_Container = set_global_ret(MchcRouterContainer, 'Mchc_Router_Container')



