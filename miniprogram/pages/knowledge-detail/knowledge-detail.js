const { api } = require('../../util/request')
const favorite = require('../../util/favorite')

// 后端正文以空行分段；“一、”“二、”开头的短段落视为小标题
function toBlocks(content) {
  return (content || '')
    .split(/\n\s*\n/)
    .map(function(s) { return s.trim() })
    .filter(Boolean)
    .map(function(text) {
      var isHeading = /^[一二三四五六七八九十]+、/.test(text) && text.length <= 24
      return { type: isHeading ? 'h' : 'p', text: text }
    })
}

Page({
  data: {
    article: {
      tag: '',
      date: '',
      title: '',
      summary: '',
      content: ''
    },
    blocks: [],
    showLead: false,
    favorited: false
  },

  onLoad: function(options) {
    var articleId = options.id || '1'
    this.loadArticle(articleId)
  },

  loadArticle: function(id) {
    api.getKnowledgeDetail(id).then((article) => {
      var summary = (article.summary || '').trim()
      var content = (article.content || '').trim()
      this.setData({
        article: article,
        favorited: favorite.has(article.id),
        blocks: toBlocks(article.content),
        // 摘要和正文开头重复时不再单独展示导语
        showLead: !!summary && content.indexOf(summary.slice(0, 12)) !== 0
      })
    })
  },

  toggleFavorite: function() {
    var on = favorite.toggle(this.data.article)
    this.setData({ favorited: on })
    wx.showToast({ title: on ? '已收藏' : '已取消收藏', icon: 'none' })
  },

  onShareAppMessage: function() {
    return {
      title: this.data.article.title || '乳腺健康科普',
      path: '/pages/knowledge-detail/knowledge-detail?id=' + this.data.article.id
    }
  },

  goBack: function() {
    wx.navigateBack()
  }
})
