App({
  globalData: {
    nav: null
  },

  // 计算自定义导航栏尺寸：状态栏高度 + 与右上角胶囊按钮对齐的标题栏
  getNavMetrics: function() {
    if (this.globalData.nav) return this.globalData.nav
    var statusBarHeight = 20
    var windowWidth = 375
    try {
      var info = wx.getWindowInfo ? wx.getWindowInfo() : wx.getSystemInfoSync()
      statusBarHeight = info.statusBarHeight || 20
      windowWidth = info.windowWidth || 375
    } catch (e) {}
    var barHeight = 44
    var capsuleSpace = 96
    try {
      var rect = wx.getMenuButtonBoundingClientRect()
      if (rect && rect.height) {
        barHeight = (rect.top - statusBarHeight) * 2 + rect.height
        capsuleSpace = windowWidth - rect.left + 8
      }
    } catch (e) {}
    this.globalData.nav = {
      statusBarHeight: statusBarHeight,
      barHeight: barHeight,
      total: statusBarHeight + barHeight,
      capsuleSpace: capsuleSpace
    }
    return this.globalData.nav
  }
})
