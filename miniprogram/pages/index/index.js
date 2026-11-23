const { api } = require('../../util/request')
const { decorate, toResultParam } = require('../../util/record')

Page({
  data: {
    historyList: [],
    articles: []
  },

  onShow: function() {
    if (!wx.getStorageSync('userToken')) {
      wx.reLaunch({ url: '/pages/login-select/login-select' })
      return
    }
    this.loadData()
  },

  onPullDownRefresh: function() {
    this.loadData().then(function() {
      wx.stopPullDownRefresh()
    })
  },

  loadData: function() {
    var history = api.getHistoryList({ page: 1, size: 3 }).then((data) => {
      this.setData({ historyList: (data.list || []).map(decorate) })
    }).catch(function() {})
    var articles = api.getKnowledgeList({ page: 1, size: 3 }).then((data) => {
      this.setData({ articles: data.list || [] })
    }).catch(function() {})
    return Promise.all([history, articles])
  },

  openRecord: function(e) {
    var item = this.data.historyList[e.currentTarget.dataset.index]
    if (!item) return
    wx.navigateTo({ url: '/pages/result/result?from=history&data=' + toResultParam(item) })
  },

  selectImage: function(e) {
    var source = (e && e.currentTarget && e.currentTarget.dataset.source) || ''
    wx.navigateTo({ url: '/pages/upload/upload' + (source ? '?source=' + source : '') })
  },

  goToHistory: function() {
    wx.navigateTo({ url: '/pages/history/history' })
  },

  goToGuide: function() {
    wx.navigateTo({ url: '/pages/guide/guide' })
  },

  goToKnowledge: function() {
    wx.switchTab({ url: '/pages/knowledge/knowledge' })
  },

  goToArticle: function(e) {
    wx.navigateTo({ url: '/pages/knowledge-detail/knowledge-detail?id=' + e.currentTarget.dataset.id })
  },

  goToHelp: function() {
    wx.navigateTo({ url: '/pages/help/help' })
  }
})
