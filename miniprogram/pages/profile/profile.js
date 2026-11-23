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

  goToReport: function() {
    wx.showToast({ title: '检测报告功能开发中', icon: 'none' })
  },

  goToFavorite: function() {
    wx.showToast({ title: '收藏夹功能开发中', icon: 'none' })
  },

  goToSettings: function() {
    wx.showToast({ title: '系统设置功能开发中', icon: 'none' })
  },

  goToHelp: function() {
    wx.navigateTo({ url: '/pages/help/help' })
  },

  goToFeedback: function() {
    wx.showToast({ title: '意见反馈功能开发中', icon: 'none' })
  },

  goToAbout: function() {
    wx.showToast({ title: '关于我们功能开发中', icon: 'none' })
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
