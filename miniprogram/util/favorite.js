// 文章收藏，保存在本机
var KEY = 'favoriteArticles'

function list() {
  try {
    return wx.getStorageSync(KEY) || []
  } catch (e) {
    return []
  }
}

function has(id) {
  return list().some(function(a) { return String(a.id) === String(id) })
}

// 返回切换后的收藏状态
function toggle(article) {
  var items = list()
  var index = items.findIndex(function(a) { return String(a.id) === String(article.id) })
  if (index > -1) {
    items.splice(index, 1)
  } else {
    items.unshift({
      id: article.id,
      title: article.title,
      tag: article.tag,
      date: article.date || article.createdAt || '',
      savedAt: Date.now()
    })
  }
  wx.setStorageSync(KEY, items)
  return index === -1
}

function remove(id) {
  wx.setStorageSync(KEY, list().filter(function(a) { return String(a.id) !== String(id) }))
}

module.exports = { KEY: KEY, list: list, has: has, toggle: toggle, remove: remove }
