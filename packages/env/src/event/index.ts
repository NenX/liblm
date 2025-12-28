import { EventEmitter } from "@lm_fe/utils";
import { IMyForm_Event } from "./types/my_form";
import { IOutpatient_Event } from "./types/outpatient";
import { IService_info } from "./types/service_info";
import { IWs_Event } from "./types/ws";
import { IBaseList_Event } from "./types/components/BaseList";

export * from './MchcDriver';

export const mchcEvent = new EventEmitter<{
    print_modal: [{
        url?: string;
        requestData?: any;
        width?: string | number;
        printData?: string
        size?: string;
        isNewEdition?: boolean;
    }]
    my_form: IMyForm_Event
    BaseList_hook: IBaseList_Event
    service_info: IService_info
    custom_msg: [{ readonly type: any, data?: any }]
    outpatient: IOutpatient_Event
    ws_event: IWs_Event
}>();

