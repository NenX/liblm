// import { GetProps } from "react-redux";

type omg = ((...args: any) => any) | (abstract new (...args: any) => any)
export type GetProps<T extends omg> = T extends (abstract new (...args: any) => any) ? ConstructorParameters<T>['0'] : (T extends ((...args: any) => any) ? Parameters<T>['0'] : any)

