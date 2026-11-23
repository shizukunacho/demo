const favorite = require('../../util/favorite')

Page({
  data: {
    list: []
  },

  onShow: function() {
    this.setData({ list: favorite.list() })
  },

  openArticle: function(e) {
    wx.navigateTo({ url: '/pages/knowledge-detail/knowledge-detail?id=' + e.currentTarget.dataset.id })
  },

  removeItem: function(e) {
    var id = e.currentTarget.dataset.id
    wx.showModal({
      title: '提示',
      content: '确定取消收藏这篇文章吗？',
      success: (res) => {
        if (!res.confirm) return
        favorite.remove(id)
        this.setData({ list: favorite.list() })
      }
    })
  },

  goToKnowledge: function() {
    wx.switchTab({ url: '/pages/knowledge/knowledge' })
  }
})
