import { request } from "@lm_fe/utils"
import { Mchc_Doctor_Service } from "../../../mchc"








class Yxfy_Doctor_Service extends Mchc_Doctor_Service {


    async getVisitEmrEditable(visitId: number) {
        const ret = await request.get<boolean>('/api/doctor/getVisitEmrEditable', { params: { visitId } })
        return ret.data
    }
}

export const SYxfy_Doctor = new Yxfy_Doctor_Service


