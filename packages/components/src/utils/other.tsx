export function isUrl(string: string) {
    const protocolRE = /^(?:\w+:)?\/\/(\S+)$/
    // const domainRE = /^[^\s\.]+\.\S{2,}$/;
    if (typeof string !== 'string') return false
    return protocolRE.test(string)
  }
  
  export const getArray = (arr: any[], defaultValue = []) => {
    if (Array.isArray(arr)) return arr
    return defaultValue
  }
  
  export function getFormat(format: string) {
    let dateFormat
    switch (format) {
      case 'date':
        dateFormat = 'YYYY-MM-DD'
        break
      case 'time':
        dateFormat = 'HH:mm:ss'
        break
      case 'dateTime':
        dateFormat = 'YYYY-MM-DD HH:mm:ss'
        break
      case 'week':
        dateFormat = 'YYYY-w'
        break
      case 'year':
        dateFormat = 'YYYY'
        break
      case 'quarter':
        dateFormat = 'YYYY-Q'
        break
      case 'month':
        dateFormat = 'YYYY-MM'
        break
      default:
        // dateTime
        if (typeof format === 'string') {
          dateFormat = format
        } else {
          dateFormat = 'YYYY-MM-DD'
        }
    }
    return dateFormat
  }
  
  export function getParamByName(name: string, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&')
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url)
    if (!results) return null
    if (!results[2]) return ''
    return decodeURIComponent(results[2].replace(/\+/g, ' '))
  }
  