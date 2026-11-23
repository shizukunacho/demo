const { api } = require('../../util/request')

Page({
  data: {
    phone: '',
    password: '',
    showPassword: false,
    loading: false
  },

  goBack: function() {
    wx.navigateBack()
  },

  onPhoneInput: function(e) {
    this.setData({ phone: e.detail.value })
  },

  onPasswordInput: function(e) {
    this.setData({ password: e.detail.value })
  },

  togglePassword: function() {
    this.setData({ showPassword: !this.data.showPassword })
  },

  handleLogin: function() {
    if (!this.data.phone) {
      wx.showToast({ title: '请输入手机号', icon: 'none' })
      return
    }
    if (!this.data.password) {
      wx.showToast({ title: '请输入密码', icon: 'none' })
      return
    }
    
    if (!/^1\d{10}$/.test(this.data.phone)) {
      wx.showToast({ title: '手机号格式不正确', icon: 'none' })
      return
    }
    this.setData({ loading: true })

    api.login({
      phone: this.data.phone,
      password: this.data.password
    }).then((data) => {
      wx.setStorageSync('userToken', data.token)
      wx.setStorageSync('userInfo', data.userInfo)
      wx.switchTab({ url: '/pages/index/index' })
    }).finally(() => {
      this.setData({ loading: false })
    })
  },

  goToForget: function() {
    wx.showModal({
      title: '忘记密码',
      content: '请联系客服核实身份后重置密码，或使用微信一键登录。',
      confirmText: '联系客服',
      success: function(res) {
        if (res.confirm) wx.navigateTo({ url: '/pages/help/help' })
      }
    })
  },

  goToRegister: function() {
    wx.navigateTo({
      url: '/pages/register/register'
    })
  }
})
