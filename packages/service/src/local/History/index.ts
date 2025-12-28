import { mchcEnv, mchcStore, mchcUtils } from "@lm_fe/env"







function resolveSpPath(path: string) {
    const isSp = mchcEnv.isSp
    if (!isSp) return path
    const isIncludeMask = path?.includes?.('?')
    return isIncludeMask ? `${path}&sp=1` : `${path}?sp=1`
}

export const SLocal_History = {
    closeCurrentTab() {
        const isSp = mchcEnv.isSp
        if (isSp) {
            window.close()
        } else {
            mchcStore.deleteCurrentTab()
        }

    },
    safe_history_push(path: any, props?: any) {
        let history = props?.history

        if (history?.push) {

            return history.push(path);
        }

        return this.historyPush(path)
    },
    historyPush(path: any, state?: any) {
        if (!path) return
        const history = mchcUtils.getGlobalHistory()
        const isSp = mchcEnv.isSp
        let _url = resolveSpPath(path)
        if (isSp) {
            window.open(_url)
        } else {
            window.mchc_modal?.destroyAll?.()
            return history.push(_url, state)
        }
    },
    historyReplace(path: any, state?: any) {
        const isSp = mchcEnv.isSp
        if (isSp) {
            location.replace(path)
        } else {
            const history = mchcUtils.getGlobalHistory()
            history.replace(path, state)
        }
    },
    closeAndPush(path: any, state?: any) {
        this.closeCurrentTab()
        this.historyPush(path, state)
    },
    closeAndReplace(path: any, state?: any) {
        this.closeCurrentTab()
        this.historyPush(path, state)
    },
}