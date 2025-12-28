import { ARG_URS1_KEY, ARG_URS2_KEY } from "src/constant"
import { AppEnv } from "./AppEnv"
import { identity } from "lodash"
import { getSearchParamsValue } from "@noah-libjs/utils"

export function getHappyConfig(pathname = location.pathname) {
    const url = new URL(location.origin + pathname)

    const arr = pathname.split('/').filter(_ => _)
    const first = arr[0]

    if (first === 'happy' && arr.length > 2) {
        arr.shift()
        const _arg = arr.pop()
        const args = _arg?.split(',') ?? []
        const path = `/${arr.join('/')}`
        return { path, args, search: url.search, [ARG_URS1_KEY]: args[0], [ARG_URS2_KEY]: args[1] }
    }
    return null
}
export function genHappyPath(path: string, arg: string[] = [], search = "") {
    const arr = path.split('/').filter(_ => _)
    let _search = search?.startsWith('?') ? search : `?${search}`
    return `/happy/${arr.join('/')}/${arg.join(',')}${_search}`
}
export function get_global_happy_arg(key: 'usr1' | 'usr2') {
    const happyConfig = getHappyConfig(location.pathname)
    let conf = AppEnv.singleton.tail_global_cache('happy_conf')

    return conf?.[key] || getSearchParamsValue(key) || happyConfig?.[key]
}



export function transmit_happy(path: string, search = "") {
    const happyPath = getHappyConfig()
    return genHappyPath(path, happyPath?.args, search || happyPath?.search)
}

export function transmit_happy_pre(url: string, pre = '') {
    let _pre = pre?.startsWith('/') ? pre : `/${pre}`
    _pre = _pre === '/' ? '' : _pre
    const arr = url.split('?').filter(identity)
    const slash = url.startsWith('/') ? '' : '/'
    return transmit_happy(`${_pre}${slash}${arr[0]}`, arr[1])
}
