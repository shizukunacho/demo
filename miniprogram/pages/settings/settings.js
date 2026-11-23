const { api } = require('../../util/request')

// 清除缓存时保留登录状态
var KEEP_KEYS = ['userToken', 'userInfo']

Page({
  data: {
    cacheSize: '0 KB',
    version: '1.0.0'
  },

  onShow: function() {
    this.updateCacheSize()
    try {
      this.setData({ version: wx.getAccountInfoSync().miniProgram.version || '1.0.0' })
    } catch (e) {}
  },

  updateCacheSize: function() {
    try {
      var info = wx.getStorageInfoSync()
      this.setData({ cacheSize: info.currentSize + ' KB' })
    } catch (e) {}
  },

  clearCache: function() {
    wx.showModal({
      title: '清除缓存',
      content: '将清除本地缓存（包括收藏的文章），不影响检测记录和登录状态。',
      success: (res) => {
        if (!res.confirm) return
        var info = wx.getStorageInfoSync()
        info.keys.forEach(function(key) {
          if (KEEP_KEYS.indexOf(key) === -1) wx.removeStorageSync(key)
        })
        this.updateCacheSize()
        wx.showToast({ title: '已清除', icon: 'success' })
      }
    })
  },

  showAgreement: function() {
    wx.showModal({
      title: '用户协议与隐私政策',
      content: '本系统仅对用户上传的乳腺超声图像进行分析，图像与检测结果仅保存在用户本人账号下，不会用于其他用途。检测结果仅供参考，不作为临床诊断依据。',
      showCancel: false,
      confirmText: '我知道了'
    })
  },

  goToAbout: function() {
    wx.navigateTo({ url: '/pages/about/about' })
  },

  logout: function() {
    wx.showModal({
      title: '确认退出',
      content: '确定要退出登录吗？',
      success: function(res) {
        if (!res.confirm) return
        api.logout().catch(function() {}).then(function() {
          wx.removeStorageSync('userToken')
          wx.removeStorageSync('userInfo')
          wx.reLaunch({ url: '/pages/login-select/login-select' })
        })
      }
    })
  }
})
