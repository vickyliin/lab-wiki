
export default {
  get: (opt) => {
    var parameters
    if(opt.data !== undefined){
      parameters = Object.entries(opt.data)
          .map(pair => `${encodeURI(pair[0])}=${encodeURI(pair[1])}`)
          .join('&')
    }
    else{
      parameters = ''
    }
    let url = `${opt.url}?${parameters}`
    let xhr = opt.xhr || new XMLHttpRequest()
    xhr.onreadystatechange = (e => {
      let xhr = e.target
      if(xhr.readyState === 4) opt.ready(xhr.response, xhr.status)
    })
    xhr.responseType = opt.type
    xhr.open('GET', url)
    xhr.send()
  },
}