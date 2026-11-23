const { api } = require('../../util/request')

function appVersion() {
  try {
    var v = wx.getAccountInfoSync().miniProgram.version
    return v || '1.0.0'
  } catch (e) {
    return '1.0.0'
  }
}

Page({
  data: {
    version: '1.0.0',
    health: null,
    checking: true
  },

  onLoad: function() {
    this.setData({ version: appVersion() })
    this.checkModel()
  },

  checkModel: function() {
    this.setData({ checking: true })
    api.getModelHealth().then((health) => {
      this.setData({ health: health, checking: false })
    }).catch(() => {
      this.setData({ health: null, checking: false })
    })
  }
})
