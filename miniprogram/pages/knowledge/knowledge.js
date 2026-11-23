const { api } = require('../../util/request')

Page({
  data: {
    articles: [],
    shown: [],
    tags: [],
    activeTag: '',
    loaded: false
  },

  onLoad: function() {
    this.loadArticles()
  },

  onPullDownRefresh: function() {
    this.loadArticles().then(function() {
      wx.stopPullDownRefresh()
    })
  },

  loadArticles: function() {
    return api.getKnowledgeList({ page: 1, size: 20 }).then((data) => {
      var articles = data.list || []
      var tags = []
      articles.forEach(function(a) {
        if (a.tag && tags.indexOf(a.tag) === -1) tags.push(a.tag)
      })
      this.setData({ articles: articles, tags: tags, loaded: true })
      this.applyFilter('')
    }).catch(() => {
      this.setData({ loaded: true })
    })
  },

  applyFilter: function(tag) {
    var shown = tag
      ? this.data.articles.filter(function(a) { return a.tag === tag })
      : this.data.articles
    this.setData({ activeTag: tag, shown: shown })
  },

  onTag: function(e) {
    var tag = e.currentTarget.dataset.tag || ''
    this.applyFilter(tag)
  },

  goBack: function() {
    wx.navigateBack()
  },

  goToDetail: function(e) {
    var id = e.currentTarget.dataset.id || '1'
    wx.navigateTo({
      url: '/pages/knowledge-detail/knowledge-detail?id=' + id
    })
  }
})
