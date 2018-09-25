module.exports = {
  globalConfig: {
    nullClick: '#app',
    useragent: 'ncw-cappuccino-test',
    nightmareConfig: {
      defaultTimeout: 30000,
      loadTimeout: 12000
    }
  },
  gnb: {
    header: '.ncsoft.gnb-header',
    footer: '.ncsoft.gnb-footer',
    imgBasePath: "static.ncsoft.com/global/img/gnb.jpg",
    loginPage: {
      email: '#loginForm #id',
      password: '#loginForm #password',
      btn: '#loginForm .login-input .wrapButton > a.button.squareSingle'
    },
    games: [
      {
        url: 'http://na.aiononline.com/en/',
        cookies: [
          {
            name: 'webLang',
            value: 'us'
          }
        ]
      },
      {
        url: 'http://www.bladeandsoul.com/en/',
        cookies: [
          {
            name: 'nc-bs-lang',
            value: 'en'
          }
        ]
      },
      {
        url: 'http://www.lineage2.com/en/',
        cookies: [
          {
            name: 'lang',
            value: 'en-US'
          }
        ]
      },
      {
        url: 'http://www.wildstar-online.com/en/',
        cookies: [
          {
            name: 'free_to_play_announce_visited',
            value: 'true'
          }
        ]
      }
    ]
  }
}
