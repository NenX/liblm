import { AnyObject, expect_array, getSearchParamsValue, MyLog, safe_json_parse } from "@noah-libjs/utils";
import { TOKEN_KEY } from "../constant";
const tokenPrefix = ['Bearer', 'captcha']

function isStartWithTokenPrefix(token?: string) {
    if (!token) return false
    return tokenPrefix.some(_ => token.startsWith(`${_} `))
}
export class AppEnv<T = string> {
    static get singleton(): AppEnv {
        return window.mchc_env ?? appEnv
    }
    _appName?: T;
    _globalCache: { [x: string]: any; } = {};
    defineGlobalCacheProperty(k: string, d: PropertyDescriptor) {

        Object.defineProperty(this._globalCache, k, { ...d, configurable: true })
    }
    getGlobalCache<C extends Object>(k: string): any {
        const a = this._globalCache[k] as C | null;
        return a
    }
    setGlobalCache(k: string, v: any) {
        this._globalCache[k] = v;
    }

    tail_global_cache(k: string,) {
        let cache: AnyObject[] = this._globalCache[k] = this._globalCache[k] ?? []
        let len = cache.length
        if (!len) return null
        return cache[len - 1]
    }
    push_global_cache(k: string, v: AnyObject) {
        let cache: AnyObject[] = this._globalCache[k] = this._globalCache[k] ?? []
        return cache.push(v)
    }
    pop_global_cache(k: string,) {
        let cache: AnyObject[] = this._globalCache[k] = this._globalCache[k] ?? []
        return cache.pop()
    }

    _isDev?: boolean;
    public is(type: T) {
        return this.appName === type;
    }
    public in(types: T[]) {
        return types.includes(this.appName!);
    }
    public get isSp() {
        const sp = getSearchParamsValue('sp') ?? getSearchParamsValue('SP') ?? location.pathname.startsWith('/view') ?? location.pathname.startsWith('/single')
        return !!sp
    }
    public get isDev() {
        return this._isDev || false;
    }
    public set isDev(value: boolean) {
        this._isDev = value
    }
    public get appName() {
        return this._appName;
    }
    public set appName(value: T | undefined) {
        this._appName = value;
        this.logger = new MyLog(this._appName as string)
    }
    public logger = new MyLog('AppEnv')
    get store() {
        return window.mchcStorage
    }
    get tokenKey() {
        return `${this.appName}_${TOKEN_KEY}`
    }
    get loginRememberKey() {
        return `${this.appName}_login`
    }
    constructor(appName?: T,) {
        this.appName = appName
    }
    get loginRemember(): AnyObject | undefined | null {
        const str = expect_array<number[]>(this.store.get(this.loginRememberKey)).map((_) => String.fromCharCode(~_)).join('')
        return safe_json_parse(str)
    }
    set loginRemember(value) {
        if (!value) {
            this.store.set(this.loginRememberKey, null)
            return
        }

        const str = JSON.stringify(value).split('').map(_ => ~_.charCodeAt(0))
        this.store.set(this.loginRememberKey, str)
    }
    get token(): string | null {
        const value = this.getToken()
        if (!value) return null
        return isStartWithTokenPrefix(value) ? value : `Bearer ${value}`
    }
    set token(value) {
        const arr = value?.split(' ')?.slice(-1) || []
        const target = arr[0]
        if (target) {
            this.store.set(this.tokenKey, target)
        }
    }
    get rawToken() {
        const value = this.getToken()
        if (!value) return ''
        return isStartWithTokenPrefix(value) ? value.split(' ').slice(-1) : value
    }
    reload(path?: string) {
        if (path) {
            window.location.href = path
        } else {
            location.reload()
        }
    }
    open(url?: string | URL, target?: string, features?: string) {
        return window.open(url, target, features)
    }
    logout(path?: string) {
        const login_cache = this.loginRemember
        this.store.clearAll()
        this.loginRemember = login_cache
        this.reload(path)
    }
    logout_clean(path?: string) {
        this.store.clearAll()
        this.reload(path)
    }
    getToken(): string | null {

        return this.store.get(this.tokenKey) || this.getTokenFromSearchParam()
    }
    getTokenFromSearchParam() {
        const url = new URL(location.toString())
        return url.searchParams.get(this.tokenKey)
    }
    setTokenToSearchParam(url: URL) {
        url.searchParams.set(this.tokenKey, this.getToken() || '')
        return url
    }
    removeToken() {
        this.store.remove(this.tokenKey)
    }
    get is_fullscreen() {
        return !!document.fullscreenElement
    }
};
export const appEnv = new AppEnv<'mchc_env'>('mchc_env',);

(window as any).appEnv = appEnv;

