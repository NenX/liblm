import { IMchc_Pregnancy, IMchc_TemplateTree_Item, IMchc_User } from "@lm_fe/service";
interface IMetaInfo { user?: IMchc_User, pregnacy?: IMchc_Pregnancy, item: Partial<IMchc_TemplateTree_Item> }
export interface ITemplateType {
    title: string
    type: number
    getList?(data: IMetaInfo): Promise<Partial<IMchc_TemplateTree_Item>[]>
    delItem?(data: IMetaInfo): Promise<void>
    postItem?(data: IMetaInfo): Promise<void>
    putItem?(data: IMetaInfo): Promise<void>
}
export interface MyDataNode extends Partial<IMchc_TemplateTree_Item> {
    checkable?: boolean;
    children?: MyDataNode[];
    disabled?: boolean;
    disableCheckbox?: boolean;
    isLeaf?: boolean;
    key: string | number;
    title?: React.ReactNode;
    selectable?: boolean;
    className?: string;
    style?: React.CSSProperties;
    value?: number
}

