declare module 'slash2';
declare module '*.css';
declare module '*.less';
declare module '*.scss';
declare module '*.sass';
declare module '*.svg';
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.bmp';
declare module '*.tiff';
declare module 'omit.js';


interface Window {

  _store?: {
    getState(): any
  }
  safe_navigate?(url_conf: string, props?: any, params?: any): void
  happy_conf?: any
  mchcEnv?: any
  mchcStorage: StoreJsAPI
  mchc_env?: any
  mchc_modal?: any
  _globalState?: { [x: string]: any }
  _globalHistory?: { push(k: string): void }
  _globalDispatch?: any
  _fdCache?: { [x: string]: { data?: any[], expire?: number } }
  PDFViewerApplication?: {
    appConfig: any
    run?(config: any): Promise<void>
    open?(args: any): void
    _forceCssTheme?(): void
  }
  PDFViewerApplicationOptions?: {
    set?(name: string, val: any): void
  }
}
declare let __DEV__: boolean;
declare let __LOCAL__: boolean;

declare const APP_MACRO: { [x: string]: any }

