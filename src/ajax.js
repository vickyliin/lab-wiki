function XhrWrapper (opt) {
  let xhr = this.xhr = new XMLHttpRequest()
  xhr.responseType = opt.resType || 'json'
  xhr.open(opt.type, opt.url, true)
  if (opt.contentType) xhr.setRequestHeader('Content-type', opt.contentType)
  xhr.withCredentials = opt.credential === undefined ? true : opt.credential
  this.send = async data => {
    let stateChange = new Promise(resolve => { xhr.onload = resolve })
    xhr.send(data)
    await stateChange
    let { response, status } = xhr
    if (opt.ready) opt.ready(response, status)
    return { response, status }
  }
}
export default {
  params (data) {
    let parameters
    if (data !== undefined) {
      parameters = Object.entries(data)
        .map(pair => pair.map(encodeURIComponent).join('='))
        .join('&')
    } else {
      parameters = ''
    }
    return parameters
  },
  get (opt) {
    opt.resType = opt.type
    opt.type = 'GET'
    opt.url = `${opt.url}?${this.params(opt.data)}`
    let xhr = new XhrWrapper(opt)
    return xhr.send()
  },
  post (opt) {
    opt.contentType = opt.contentType || 'application/x-www-form-urlencoded'
    opt.resType = opt.type
    opt.type = 'POST'
    let xhr = new XhrWrapper(opt)
    return xhr.send(this.params(opt.data))
  },
  delete (opt) {
    opt.type = 'DELETE'
    let xhr = new XhrWrapper(opt)
    return xhr.send()
  }
}
