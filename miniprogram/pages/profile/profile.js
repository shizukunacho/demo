const { api } = require('../../util/request')

Page({
  data: {
    userInfo: {
      name: '',
      id: '',
      avatar: ''
    },
    initial: '我',
    stats: {
      totalTests: 0,
      benignResults: 0,
      suspiciousResults: 0,
      pendingResults: 0
    }
  },

  onShow: function() {
    if (!wx.getStorageSync('userToken')) {
      wx.reLaunch({ url: '/pages/login-select/login-select' })
      return
    }
    this.loadProfile()
  },

  loadProfile: function() {
    api.getUserInfo().then((userInfo) => {
      var name = (userInfo && userInfo.name) || ''
      this.setData({
        userInfo: userInfo || {},
        initial: name ? name.charAt(0) : '我'
      })
    })
    api.getUserStats().then((stats) => {
      this.setData({ stats: stats })
    })
  },

  goToHistory: function() {
    wx.navigateTo({ url: '/pages/history/history' })
  },

  goToGuide: function() {
    wx.navigateTo({ url: '/pages/guide/guide' })
  },

  goToFavorite: function() {
    wx.navigateTo({ url: '/pages/favorites/favorites' })
  },

  goToSettings: function() {
    wx.navigateTo({ url: '/pages/settings/settings' })
  },

  goToHelp: function() {
    wx.navigateTo({ url: '/pages/help/help' })
  },

  goToFeedback: function() {
    wx.navigateTo({ url: '/pages/feedback/feedback' })
  },

  goToAbout: function() {
    wx.navigateTo({ url: '/pages/about/about' })
  },

  logout: function() {
    wx.showModal({
      title: '确认退出',
      content: '确定要退出登录吗？',
      success: function(res) {
        if (res.confirm) {
          api.logout().finally(function() {
            wx.removeStorageSync('userToken')
            wx.removeStorageSync('userInfo')
            wx.reLaunch({ url: '/pages/login-select/login-select' })
          })
        }
      }
    })
  }
})
