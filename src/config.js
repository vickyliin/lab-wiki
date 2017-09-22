const config = {
  development: {
    routerBase: '/',
    entry: 'http://localhost:3000/api'
  },
  production: {
    routerBase: process.env.WIKI_HOME ? `/${process.env.WIKI_HOME}/` : '/',
    entry: 'api'
  },
  common: {
    routerMode: 'history',
    timeLocaleFormat: 'zh-tw',
    queryInterval: 15000, // ms
    gSuiteDomain: 'nlg.csie.ntu.edu.tw',
    gClientSettings: {
      discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
      clientId: '128291458390-1rjai5msiieuad8ofmeje5eonoplsmf5.apps.googleusercontent.com',
      scope: 'https://www.googleapis.com/auth/drive',
      cookiepolicy: 'single_host_origin'
    },
    gDriveSlidesFolderID: ['0B0PoejLXnl7lU2kyN21UVzFrTk0']
  }
}

module.exports = {
  ...config[process.env.NODE_ENV],
  ...config.common
}
