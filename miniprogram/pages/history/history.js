const { api } = require('../../util/request')
const { decorate, toResultParam } = require('../../util/record')

var PAGE_SIZE = 10

Page({
  data: {
    list: [],
    page: 1,
    total: 0,
    loading: false,
    finished: false
  },

  onLoad: function() {
    this.reload()
  },

  onPullDownRefresh: function() {
    this.reload().then(function() {
      wx.stopPullDownRefresh()
    })
  },

  onReachBottom: function() {
    if (!this.data.finished && !this.data.loading) {
      this.loadPage(this.data.page + 1)
    }
  },

  reload: function() {
    this.setData({ list: [], page: 1, finished: false })
    return this.loadPage(1)
  },

  loadPage: function(page) {
    this.setData({ loading: true })
    return api.getHistoryList({ page: page, size: PAGE_SIZE }).then((data) => {
      var items = (data.list || []).map(decorate)
      var list = page === 1 ? items : this.data.list.concat(items)
      this.setData({
        list: list,
        page: page,
        total: data.total || list.length,
        finished: items.length < PAGE_SIZE
      })
    }).catch(function() {}).then(() => {
      this.setData({ loading: false })
    })
  },

  openRecord: function(e) {
    var item = this.data.list[e.currentTarget.dataset.index]
    if (!item) return
    wx.navigateTo({ url: '/pages/result/result?from=history&data=' + toResultParam(item) })
  },

  onLongPress: function(e) {
    var index = e.currentTarget.dataset.index
    var item = this.data.list[index]
    if (!item) return
    wx.showActionSheet({
      itemList: ['删除该记录'],
      itemColor: '#F04B3C',
      success: () => {
        wx.showModal({
          title: '提示',
          content: '删除后不可恢复，确定删除吗？',
          success: (res) => {
            if (!res.confirm) return
            api.deleteHistory(item.id).then(() => {
              var list = this.data.list.slice()
              list.splice(index, 1)
              this.setData({ list: list, total: Math.max(0, this.data.total - 1) })
              wx.showToast({ title: '已删除', icon: 'success' })
            })
          }
        })
      }
    })
  },

  goToUpload: function() {
    wx.navigateTo({ url: '/pages/upload/upload' })
  }
})
