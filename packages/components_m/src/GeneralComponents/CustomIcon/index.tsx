import { createFromIconfontCN, QuestionCircleOutlined } from '@ant-design/icons';
import { isFunction } from 'lodash';
import React from 'react';
// import * as scriptUrl from './iconfont.js';
let CustomIconCache: typeof defaultC
function defaultC(porps: { className?: string, type: string }) {

  return CustomIconCache ? <CustomIconCache {...porps} /> : <QuestionCircleOutlined />
}
export const CustomIcon = defaultC
export function configCustomIcon(scriptUrl: any) {
  if (!scriptUrl) return
  if (isFunction(scriptUrl)) {
    scriptUrl().then((u: any) => {
      CustomIconCache = createFromIconfontCN({
        scriptUrl: u,
      }) as any;
    })
  }
  CustomIconCache = createFromIconfontCN({
    scriptUrl,
  }) as any;
}
// export * from '@ant-design/icons';
