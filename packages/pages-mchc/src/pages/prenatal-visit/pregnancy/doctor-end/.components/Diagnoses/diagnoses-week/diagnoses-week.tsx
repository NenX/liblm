
import { IMchc_Doctor_OutpatientHeaderInfo } from '@lm_fe/service';
import React from 'react';
import './index.less';
interface IProps {
  headerInfo: IMchc_Doctor_OutpatientHeaderInfo;
  first: boolean;
}
export default function DiagnosesWeek({ first, headerInfo, ...props }: IProps) {
  return (
    <div className="firstDiag-new">
      <span className="diagNum-new">1</span>G<span className="diagGP-new">{headerInfo.g}</span>P
      <span className="diagGP-new">{headerInfo.p}</span>
      妊娠
      {!first ? (
        <>
          <span className="diagGP-new diagWeek-new">{headerInfo.curgesweek}</span>周
        </>
      ) : (
        <>
          <span className="diagGP-new diagWeek-new">{headerInfo.gesweek}</span>
          周（首检孕周）
        </>
      )}
    </div>
  );
}
