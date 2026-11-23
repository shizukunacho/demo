const { api } = require('../../util/request')

Page({
  data: {
    categories: ['功能建议', '使用问题', '检测结果', '其他'],
    category: '功能建议',
    content: '',
    contact: '',
    submitting: false
  },

  onCategory: function(e) {
    this.setData({ category: e.currentTarget.dataset.value })
  },

  onContent: function(e) {
    this.setData({ content: e.detail.value })
  },

  onContact: function(e) {
    this.setData({ contact: e.detail.value })
  },

  submit: function() {
    var content = this.data.content.trim()
    if (content.length < 5) {
      wx.showToast({ title: '请至少填写 5 个字', icon: 'none' })
      return
    }
    if (this.data.submitting) return
    this.setData({ submitting: true })
    api.submitFeedback({
      category: this.data.category,
      content: content,
      contact: this.data.contact.trim()
    }).then(() => {
      wx.showToast({ title: '提交成功，感谢反馈', icon: 'none' })
      setTimeout(function() {
        wx.navigateBack()
      }, 1200)
    }).catch(() => {
      this.setData({ submitting: false })
    })
  }
})
