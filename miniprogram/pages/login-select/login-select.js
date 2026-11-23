const { api } = require('../../util/request')

Page({
  data: {
    navTotal: 64,
    agreed: false
  },

  onLoad: function() {
    if (wx.getStorageSync('userToken')) {
      wx.switchTab({ url: '/pages/index/index' })
      return
    }
    this.setData({ navTotal: getApp().getNavMetrics().total })
  },

  toggleAgree: function() {
    this.setData({ agreed: !this.data.agreed })
  },

  showAgreement: function() {
    wx.showModal({
      title: '用户协议与隐私政策',
      content: '本系统仅对用户上传的乳腺超声图像进行分析，图像与检测结果仅保存在用户本人账号下。检测结果仅供参考，不作为临床诊断依据。',
      showCancel: false,
      confirmText: '我知道了'
    })
  },

  checkAgree: function() {
    if (this.data.agreed) return true
    wx.showToast({ title: '请先阅读并同意用户协议和隐私政策', icon: 'none' })
    return false
  },

  goToPhoneLogin: function() {
    if (!this.checkAgree()) return
    wx.navigateTo({ url: '/pages/login/login' })
  },

  goToWechatLogin: function() {
    if (!this.checkAgree()) return
    wx.showLoading({ title: '登录中', mask: true })
    wx.login({
      success: (res) => {
        api.loginWechat({ code: res.code }).then((data) => {
          wx.setStorageSync('userToken', data.token)
          wx.setStorageSync('userInfo', data.userInfo)
          wx.switchTab({ url: '/pages/index/index' })
        }).catch(function() {})
      },
      fail: () => {
        wx.hideLoading()
        wx.showToast({ title: '微信登录失败', icon: 'none' })
      }
    })
  }
})
