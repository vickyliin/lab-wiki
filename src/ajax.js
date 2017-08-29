function XhrWrapper(opt){
  let xhr = this.xhr = new XMLHttpRequest()
  xhr.onreadystatechange = (e => {
    if(xhr.readyState === 4 && opt.ready){
      opt.ready(xhr.response, xhr.status)
    }
  })
  xhr.responseType = opt.resType || 'json'
  xhr.open(opt.type, opt.url, true)
  if(opt.contentType) xhr.setRequestHeader('Content-type', opt.contentType)
  xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')
  xhr.withCredentials = true;
  this.send = data => xhr.send(data)
}
export default {
  params(data){
    let parameters
    if(data !== undefined){
      parameters = Object.entries(data)
          .map(pair => `${encodeURI(pair[0])}=${encodeURI(pair[1])}`)
          .join('&')
    }
    else{
      parameters = ''
    }
    return parameters
  },
  get(opt){
    opt.resType = opt.type
    opt.type = 'GET'
    opt.url = `${opt.url}?${this.params(opt.data)}`
    let xhr = new XhrWrapper(opt)
    xhr.send()
  },
  post(opt){
    opt.contentType = opt.contentType || 'application/x-www-form-urlencoded'
    opt.resType = opt.type
    opt.type = 'POST'
    let xhr = new XhrWrapper(opt)
    xhr.send(this.params(opt.data))
  }
}
