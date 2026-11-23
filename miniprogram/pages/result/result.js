var LABELS = {
  normal: '未见明显病灶',
  benign: '良性倾向',
  malignant: '恶性倾向'
}

var THEME = {
  normal: { color: '#19A974', bg: 'linear-gradient(180deg, #19A974 0%, #3CC291 100%)', icon: '✓' },
  benign: { color: '#FF9A1F', bg: 'linear-gradient(180deg, #FF9A1F 0%, #FFB54D 100%)', icon: '!' },
  malignant: { color: '#F04B3C', bg: 'linear-gradient(180deg, #F04B3C 0%, #FF6F5E 100%)', icon: '!' },
  pending: { color: '#999999', bg: 'linear-gradient(180deg, #8C96A8 0%, #A9B1C0 100%)', icon: '?' }
}

var DISCLAIMER = '本结果仅供科研和辅助参考，不能替代医生诊断。'

function toNumber(v) {
  var n = Number(v)
  return isNaN(n) ? 0 : n
}

Page({
  data: {
    status: '',
    hasResult: false,
    result: '',
    verdict: '',
    resultShort: '',
    theme: THEME.pending,
    hasCancer: false,
    confidence: 0,
    classes: [],
    hasProbabilities: false,
    imagePath: '',
    maskUrl: '',
    maskFailed: false,
    modelVersion: '',
    device: '',
    createdAt: '',
    analysis: '',
    suggestion: '',
    message: '',
    summaryContent: '',
    fromHistory: false
  },

  onLoad: function(options) {
    if (!options || !options.data) return
    try {
      var data = JSON.parse(decodeURIComponent(options.data))
      var hasResult = data.status !== 'model_not_configured' && !!data.result
      var probs = data.probabilities || {}
      var hasProbabilities = ['normal', 'benign', 'malignant'].some(function(k) {
        return toNumber(probs[k]) > 0
      })
      var classes = ['normal', 'benign', 'malignant'].map(function(k) {
        var value = toNumber(probs[k])
        return {
          key: k,
          name: k === 'normal' ? '正常' : (k === 'benign' ? '良性' : '恶性'),
          value: Math.round(value * 10) / 10,
          width: Math.max(2, Math.min(100, value)),
          active: data.result === k
        }
      })
      var theme = THEME[hasResult ? data.result : 'pending'] || THEME.pending
      wx.setNavigationBarColor({ frontColor: '#ffffff', backgroundColor: theme.color })
      var analysis = (data.analysis || '').replace(DISCLAIMER, '').trim()
      var summaryContent = hasResult
        ? (analysis || ('模型判断为' + (LABELS[data.result] || '') + '，请结合临床症状和其他检查结果综合判断。'))
        : (data.message || '模型暂未配置，无法生成判断。')

      this.setData({
        status: data.status || '',
        hasResult: hasResult,
        result: data.result || '',
        verdict: LABELS[data.result] || data.resultLabel || '',
        theme: theme,
        resultShort: { normal: '正常', benign: '良性', malignant: '恶性' }[data.result] || '',
        hasCancer: !!data.hasCancer,
        confidence: data.confidence || 0,
        classes: classes,
        hasProbabilities: hasProbabilities,
        imagePath: data.imagePath || '',
        maskUrl: data.maskUrl || '',
        modelVersion: data.modelVersion || '',
        device: data.device || '',
        createdAt: data.createdAt || '',
        analysis: analysis,
        suggestion: data.suggestion || '',
        message: data.message || '',
        summaryContent: summaryContent,
        fromHistory: options.from === 'history'
      })
    } catch (e) {
      console.error('解析数据失败', e)
    }
  },

  onMaskError: function() {
    this.setData({ maskFailed: true })
  },

  previewImage: function(e) {
    var current = e.currentTarget.dataset.src
    var urls = [this.data.imagePath]
    if (this.data.maskUrl && !this.data.maskFailed) urls.push(this.data.maskUrl)
    wx.previewImage({ current: current, urls: urls.filter(Boolean) })
  },

  goBack: function() {
    wx.navigateBack()
  },

  goToKnowledge: function() {
    wx.switchTab({ url: '/pages/knowledge/knowledge' })
  },

  goToUpload: function() {
    wx.redirectTo({ url: '/pages/upload/upload' })
  },

  goToExpert: function() {
    wx.showToast({ title: '专家解读功能开发中', icon: 'none' })
  },

  goToHome: function() {
    if (this.data.fromHistory) {
      wx.navigateBack()
      return
    }
    wx.switchTab({ url: '/pages/index/index' })
  }
})
