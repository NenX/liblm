
import { IMchc_Doctor_OutpatientHeaderInfo, IMchc_Pregnancy, TIdTypeCompatible } from '@lm_fe/service';
export interface IHeaderInfoProps {
    // headerInfo?: IMchc_Doctor_OutpatientHeaderInfo;
    pregnancyData?: IMchc_Pregnancy

    getPregnancyData?(id: TIdTypeCompatible): Promise<void>,
    saveHeaderInfo?(v: IMchc_Doctor_OutpatientHeaderInfo): void,

    id: TIdTypeCompatible
    basicInfo?: any
    isNurse?: boolean

    onDobuleClick?(): void
}



