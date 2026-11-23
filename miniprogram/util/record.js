const { getAssetUrl } = require('./request')

var STATE_TEXT = {
  normal: { label: '未见明显病灶', chip: '正常' },
  benign: { label: '良性倾向', chip: '良性' },
  malignant: { label: '恶性倾向', chip: '恶性' },
  pending: { label: '待诊断', chip: '未完成' }
}

function recordState(item) {
  if (item.status === 'model_not_configured' || !STATE_TEXT[item.result]) return 'pending'
  return item.result
}

function decorate(item) {
  var state = recordState(item)
  return Object.assign({}, item, {
    state: state,
    stateLabel: STATE_TEXT[state].label,
    stateChip: STATE_TEXT[state].chip
  })
}

// 把一条检测记录转成结果页参数
function toResultParam(item) {
  return encodeURIComponent(JSON.stringify({
    status: item.status || 'completed',
    recordId: item.id,
    imageId: item.imageId || '',
    imagePath: getAssetUrl(item.imageUrl || ''),
    maskUrl: item.imageId ? getAssetUrl('/uploads/' + item.imageId + '-mask.png') : '',
    result: item.result || '',
    resultLabel: item.resultLabel || '',
    hasCancer: item.result === 'malignant',
    confidence: item.confidence || 0,
    analysis: item.analysis || '',
    suggestion: item.suggestion || '',
    modelVersion: item.modelVersion || '',
    createdAt: item.createdAt || ''
  }))
}

module.exports = {
  STATE_TEXT: STATE_TEXT,
  decorate: decorate,
  toResultParam: toResultParam
}
