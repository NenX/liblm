import { mchcLogger, mchcMacro } from '@lm_fe/env';
import { request } from '@lm_fe/utils';
import { Spin, message } from 'antd';
import { isString, map } from 'lodash';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { IPdfFrameView_Props, IPdfFrameView_Res_Data } from './types';
import { get_PdfFrameView_version, handlePrintData, handleRes } from './utils';
interface IPDFApp {
  open: any,
  initialized: boolean
  initializedPromise?: Promise<any>
  appConfig: {
    defaultUrl: string,
    viewerCssTheme: 0 | 1 | 2,
    toolbar?: { [x: string]: HTMLDivElement }
  }
  run(config: any): void
}


export default function PdfFrameView_Inner(props: IPdfFrameView_Props) {
  const { requestData, printData, filepath, version, requestConfig, callback, PDFAppConfig } = props
  const _request = useMemo(() => props.request ?? request, [props])
  const el = useRef<HTMLIFrameElement>(null)

  const _vsersion = version || get_PdfFrameView_version()

  const [pdfdata, setPdfdata] = useState<any>()
  const [pdfApp, setPdfApp] = useState<IPDFApp>()
  const pdfAppRef = useRef<IPDFApp>()
  const pdfdataRef = useRef<any>()

  useEffect(() => {
    getPDF();
  }, [filepath, printData]);


  useEffect(() => {
    setPdfApp(undefined)
  }, [version]);



  const getPDF = async () => {
    let printConfig: { images?: string[], pdf?: any } = {}


    if (filepath) {
      printConfig.pdf = filepath
    }

    if (printData && isString(printData)) {
      printConfig.pdf = handlePrintData(printData)
    }

    try {
      if (requestData) {
        const { url, method = 'POST', ...others } = requestData
        const submitData = {
          template: '',
          version: '',
          note: '',
          ...others
        }
        const res = method === 'POST'
          ? await _request.post<IPdfFrameView_Res_Data>(url, submitData, {})
          : await _request.get<IPdfFrameView_Res_Data>(url, { params: submitData },);
        printConfig = handleRes(res.data)
      }

      if (requestConfig) {
        requestConfig.method = requestConfig.method ?? 'POST'
        const res = await _request.ins(requestConfig)
        printConfig = handleRes(res.data)
      }
    } catch (e) {
      message.warning(e)
    }
    const data = printConfig.pdf
    callback?.(data)
    setPdfdata(data)
    pdfdataRef.current = data
    pdf_open()


  };


  useEffect(() => {

    pdf_open()

    return () => {


    }
  }, [pdfApp])

  function pdf_open() {
    if (!pdfApp) return

    const initializedPromise = pdfApp.initializedPromise ?? new Promise((res, rej) => setTimeout(res, 1000))

    initializedPromise.then(() => {
      setTimeout(() => {
        pdfApp.open(pdfdataRef.current)
      }, 200);

    })

  }

  const docUrl = `${mchcMacro.PUBLIC_PATH}lm_pdfjs/${_vsersion}/web/viewer.html`

  mchcLogger.log('pdfjs', { docUrl, version, _vsersion })
  return (
    <div style={{ height: '100%', overflow: 'hidden' }}>

      {
        (!pdfdata)
          ? <Spin style={{ width: '100%', marginTop: 230 }} size="large" />
          : <iframe
            style={{ border: 'none', padding: 0, margin: 0 }}
            onLoad={(e) => {
              const target: any = e.target
              const app = target?.contentWindow?.PDFViewerApplication as IPDFApp
              // app!.appConfig!.viewerCssTheme = 1;
              const toolbar = app?.appConfig?.toolbar! ?? {}
              map(toolbar, (a, b) => {
                if (!['print', 'download', PDFAppConfig?.hidenToolbar ? '' : 'container'].includes(b)) {

                  a!.hidden = true
                }
              })
              setPdfApp(app)
              pdfAppRef.current = app
            }}
            ref={el}
            title="pdfView"
            width={'100%'}
            src={docUrl}
            height="100%"
          />
      }


    </div>
  );

};