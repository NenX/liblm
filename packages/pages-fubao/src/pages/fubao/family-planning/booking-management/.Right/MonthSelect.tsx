import dayjs from 'dayjs';
import React, { useMemo } from 'react';
import { IBaseProps } from '.';
import DropContainer from '../components/drop-continer';
import { OPERATION_NAME_MAP, START_HOUR } from '../constant';
import { checkDisabledHalfDay, getOperationNum, handleIsBefore } from '../util';
interface IProps extends IBaseProps {}
export default function DateSelect(props: IProps) {
  const { findColor2, dd, selectedDate, setSelectedDate, setMode, scheduleArr } = props;

  const staticDataSouce = useMemo(() => {
    const firstDayOfMonth = selectedDate.clone().startOf('month');
    const firstDayOfFirstWeek = firstDayOfMonth.startOf('week');

    return Array(6)
      .fill(0)
      .map((zero, row) => {
        const startMoment = firstDayOfFirstWeek
          .clone()
          .add(7 * row, 'day')
          .set({ hour: START_HOUR });
        return { startMoment, endMoment: startMoment, row };
      });
  }, [selectedDate]);

  const rowHeight = `${100 / 6}%`;
  return (
    <div style={{ flex: 1, display: 'flex', justifyContent: 'center', overflowY: 'scroll' }}>
      <table width="98%" style={{ height: '100%' }} cellSpacing={0} cellPadding={0} border={1} borderColor="#EDEEF6">
        <tr style={{ height: 30, backgroundColor: '#F9F9FC' }}>
          {Array(7)
            .fill(0)
            .map((_, colIndex) => {
              return (
                <td style={{ textAlign: 'center' }}>
                  <span style={{ height: 1, lineHeight: '1px', color: '#8A96A0' }}>
                    {staticDataSouce[0].startMoment.clone().add(colIndex, 'day').format('dddd')}
                  </span>
                </td>
              );
            })}
        </tr>

        {staticDataSouce.map(({ startMoment, endMoment }, rowIndex) => {
          return (
            <tr key={rowIndex} style={{ height: rowHeight }}>
              {Array(7)
                .fill(0)
                .map((_, colIndex) => {
                  const targetStartMoment = startMoment.clone().add(colIndex, 'day');

                  const scheduling = scheduleArr.find((_) => _.schedulingDate.isSame(targetStartMoment, 'day'));
                  const disabled = checkDisabledHalfDay(scheduling, '上午') && checkDisabledHalfDay(scheduling, '下午');
                  const isInThisMonth = targetStartMoment.isSame(selectedDate, 'month');
                  const { left: dayLeft, isOpen: isDayOpen } = getOperationNum(scheduling);

                  return (
                    <td rowSpan={1} key={colIndex} style={{ position: 'relative' }}>
                      <div
                        style={{ position: 'relative', height: '100%', cursor: 'pointer' }}
                        onClick={() => {
                          setSelectedDate(targetStartMoment);
                          setMode('day');
                        }}
                      >
                        <DropContainer
                          mode={'month'}
                          scheduling={scheduling}
                          appointmentDate={targetStartMoment}
                          appointmentMorningOrAfternoon="上午"
                          dd={dd}
                          isDisabled={disabled}
                        >
                          <div
                            style={{
                              userSelect: 'none',
                              padding: '6px 8px',
                              opacity: isInThisMonth ? 1 : 0.4,
                            }}
                            className={`month-item ${targetStartMoment.isSame(dayjs(), 'day') ? 'today' : ''}`}
                          >
                            <div className="head-line">
                              <div>
                                <span className="day-num">{targetStartMoment.date()}</span>
                              </div>
                              <div>
                                <span style={{ fontSize: 12, color: '#828C99' }} hidden={!isDayOpen}>
                                  {handleIsBefore(targetStartMoment) >= 0 && dayLeft
                                    ? `剩余可预约${dayLeft}个号源`
                                    : ''}
                                </span>
                              </div>
                              {/* <Row gutter={44}>
                                <Col>
                                  <span className="day-num">{targetStartMoment.date()}</span>
                                </Col>
                                <Col>
                                  <span style={{ fontSize: 12, color: '#828C99' }} hidden={!isDayOpen}>
                                    {handleIsBefore(targetStartMoment) >= 0 && dayLeft
                                      ? `剩余可预约${dayLeft}个号源`
                                      : ''}
                                  </span>
                                </Col>
                              </Row> */}
                            </div>

                            {Object.entries(OPERATION_NAME_MAP).map(([title, key]) => {
                              const [backgroundColor, fontColor, textColor] = findColor2(title as any);
                              const { isOpen, reserved, all } = getOperationNum(scheduling, title as any);

                              return isOpen ? (
                                <div style={{ lineHeight: '20px' }}>
                                  <span
                                    style={{
                                      color: `${fontColor !== '#ddd' ? '#828C99' : fontColor}`,
                                      fontSize: 12,
                                      display: 'inline-block',
                                      verticalAlign: 'middle',
                                      maxWidth: '62%',
                                    }}
                                  >
                                    {title}
                                  </span>
                                  <span style={{ float: 'right', color: textColor, fontSize: 12 }}>
                                    <span style={{ color: `${textColor !== '#ccc' ? '#333' : textColor}` }}>
                                      {reserved}
                                    </span>{' '}
                                    /{' '}
                                    <span style={{ color: `${textColor !== '#ccc' ? '#828c99' : textColor}` }}>
                                      {all}
                                    </span>
                                  </span>
                                </div>
                              ) : null;
                            })}
                          </div>
                        </DropContainer>
                      </div>
                    </td>
                  );
                })}
            </tr>
          );
        })}
      </table>
    </div>
  );
}
