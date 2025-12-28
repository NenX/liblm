import { FC } from "react";
type TBase<PROPS = any, V = any, D = { disabled?: boolean, value?: V, onChange?(v?: V | null): void, isDisplay?: boolean } & PROPS> = FC<D>

export type TCommonComponentDisplay<PROPS = any, V = any> = TBase<PROPS, V>
export type TCommonComponent<PROPS = any, V = any,> = TBase<PROPS, V> & { DisplayFC?: TBase<PROPS, V> }