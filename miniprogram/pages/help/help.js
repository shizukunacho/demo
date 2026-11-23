var FAQS = [
  {
    q: '如何进行检测？',
    a: '在首页点击「超声检测」「拍照检测」或「相册上传」，从相册选择或拍摄乳腺超声图像，确认后点击「开始检测」。'
  },
  {
    q: '检测需要多长时间？',
    a: '一般在数秒内完成。网络较慢或图像较大时用时会增加，分析期间请勿退出页面。'
  },
  {
    q: '支持哪些类型的图像？',
    a: '仅支持乳腺超声灰阶（B 模式）图像，格式为 JPG 或 PNG。钼靶、MRI、病理切片等图像不在适用范围内。'
  },
  {
    q: '检测结果如何解读？',
    a: '结果分为正常、良性、恶性三类。正常表示未发现明确病灶；良性表示病灶特征倾向良性；恶性表示病灶具有恶性特征，建议尽快就诊。置信度表示模型对该分类结果的确定程度。'
  },
  {
    q: '分割结果中的白色区域是什么？',
    a: '白色区域为模型识别出的疑似病灶位置，仅供参考。'
  },
  {
    q: '上传的图像是否安全？',
    a: '上传的图像和检测结果仅保存在您的账号下，用于查看历史记录，不会用于其他用途。'
  }
]

Page({
  data: {
    expandedIndex: -1,
    keyword: '',
    faqs: FAQS
  },

  goBack: function() {
    wx.navigateBack()
  },

  onSearch: function(e) {
    var keyword = (e.detail.value || '').trim()
    var faqs = keyword
      ? FAQS.filter(function(f) { return f.q.indexOf(keyword) > -1 || f.a.indexOf(keyword) > -1 })
      : FAQS
    this.setData({ keyword: keyword, faqs: faqs, expandedIndex: faqs.length === 1 ? 0 : -1 })
  },

  toggleFaq: function(e) {
    var index = Number(e.currentTarget.dataset.index)
    this.setData({
      expandedIndex: this.data.expandedIndex === index ? -1 : index
    })
  },

  callPhone: function() {
    wx.makePhoneCall({ phoneNumber: '4001234567', fail: function() {} })
  },

  copyEmail: function() {
    wx.setClipboardData({ data: 'support@example.com' })
  }
})
