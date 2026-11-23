const { uploadDiagnosisImage, getAssetUrl } = require('../../util/request')

Page({
  data: {
    imagePath: '',
    analyzing: false
  },

  onLoad: function(options) {
    var imagePath = wx.getStorageSync('uploadImage')
    this.setData({ imagePath: imagePath || '' })
    wx.removeStorageSync('uploadImage')
    // 从首页“拍照检测/相册上传”进入时直接打开选择
    if (options && (options.source === 'camera' || options.source === 'album')) {
      this.pick(options.source)
    }
  },

  chooseSource: function() {
    if (this.data.analyzing) return
    wx.showActionSheet({
      itemList: ['拍照', '从相册选择'],
      success: (res) => {
        this.pick(res.tapIndex === 0 ? 'camera' : 'album')
      }
    })
  },

  goBack: function() {
    wx.navigateBack()
  },

  pick: function(source) {
    if (this.data.analyzing) return
    var that = this
    var sourceType = source === 'camera' ? ['camera'] : ['album']
    if (wx.chooseMedia) {
      wx.chooseMedia({
        count: 1,
        mediaType: ['image'],
        sizeType: ['compressed'],
        sourceType: sourceType,
        success: function(res) {
          that.setData({ imagePath: res.tempFiles[0].tempFilePath })
        }
      })
      return
    }
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: sourceType,
      success: function(res) {
        that.setData({ imagePath: res.tempFilePaths[0] })
      }
    })
  },

  previewImage: function() {
    if (!this.data.imagePath || this.data.analyzing) return
    wx.previewImage({ urls: [this.data.imagePath] })
  },

  clearImage: function() {
    this.setData({ imagePath: '' })
  },

  handleUpload: function() {
    var that = this
    if (this.data.analyzing) return
    if (!this.data.imagePath) {
      wx.showToast({ title: '请先选择图像', icon: 'none' })
      return
    }
    this.setData({ analyzing: true })

    uploadDiagnosisImage(this.data.imagePath).then(function(response) {
      var data = response.data || {}
      var resultData = {
        status: data.status || 'completed',
        recordId: data.recordId || data.id || '',
        imageId: data.imageId || '',
        imageUrl: data.imageUrl || '',
        maskUrl: getAssetUrl(data.maskUrl || ''),
        imagePath: that.data.imagePath,
        result: data.result || '',
        resultLabel: data.resultLabel || '',
        hasCancer: data.result === 'malignant',
        confidence: data.confidence || 0,
        probabilities: data.probabilities || {},
        analysis: data.analysis || '',
        suggestion: data.suggestion || '',
        modelVersion: data.modelVersion || '',
        device: data.device || '',
        message: response.message || ''
      }
      wx.redirectTo({
        url: '/pages/result/result?data=' + encodeURIComponent(JSON.stringify(resultData))
      })
    }).catch(function() {
      that.setData({ analyzing: false })
    })
  }
})
