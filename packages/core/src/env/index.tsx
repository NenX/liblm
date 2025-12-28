import {
    configCustomIcon,
    MyLazyComponent,
    MountMchcModal as OldMountMchcModal
} from '@lm_fe/components_m';
import { mchcBoot, mchcDriver, MchcRouterContainer, mchcRouterContainer__, MchcTypes } from "@lm_fe/env";
import { MountMchcModal } from '@lm_fe/pages';
import { fubaoRoutes } from '@lm_fe/pages-fubao';
import { mchcRoutes } from '@lm_fe/pages-mchc';
import { IMchc_User, SMchc_Common, SMchc_User } from "@lm_fe/service";
import { AnyObject, appEnv, makeEventStore } from "@lm_fe/utils";
import { FC, FunctionComponentElement } from 'react';
import ReactDOM from 'react-dom';
import { Store } from 'redux';
import { ReloadButton } from './ReloadButton';
import { runTask } from "./tasks";
export interface IGlobalStoreData {
    loggedIn: boolean
    user?: IMchc_User
}
export const globalStore = makeEventStore<IGlobalStoreData>(appEnv.appName)
export async function passwordLogin(data: Parameters<typeof SMchc_Common.fk_login>[0]) {
    await SMchc_Common.fk_login(data)
    const user = await SMchc_User.getOne(data.username)
    globalStore.bus.data = { user, loggedIn: true }
}
export async function logout() {
    appEnv.removeToken()
    globalStore.bus.data = { user: undefined, loggedIn: false }
}
export async function boot(config: {
    store?: Store
    app?: FunctionComponentElement<any> | FunctionComponentElement<any>[],
    App?: FC<{ routerContainer?: MchcRouterContainer }>,
    scriptUrl?: any,
    name?: MchcTypes,
    taskDisabled?: boolean,
    routesData?: AnyObject
}) {
    const { scriptUrl, name, app, App, routesData = {}, taskDisabled, store } = config
    configCustomIcon(scriptUrl)
    await mchcBoot({ name, store })
    mchcDriver.connect()
    if (!taskDisabled)
        runTask()

    mchcRouterContainer__.init(routesData, mchcRoutes, fubaoRoutes)

    const r_node = App ? <App routerContainer={mchcRouterContainer__} /> : null
    const _app = app ?? r_node

    ReactDOM.render(
        <>
            <ReloadButton />
            {_app}
            <MyLazyComponent fallback=''>
                <MountMchcModal />
                <OldMountMchcModal />
            </MyLazyComponent>
        </>,
        document.getElementById('root')
    );


}
