// pages/databaseGuide/databaseGuide.js

const app = getApp()

Page({

  data: {
    step: 1,

    counterId: '',
    openid: '',
    count: null,
    queryResult: '',
    region: ['广东省', '广州市', '海珠区'],
    labelLocation: '地点',
    labelDate: '日期',
    labelOT: 'OT',
    labelOOT: 'OOT',
    labelId: '员工号',
    isShowMy: false,
    isShowAll: false,
    allInventory: '点击查看所有盘点',
    isShowShare: false
  },
  onShow: function() {
    this.onQueryAll()
  },

  onLoad: function(options) {

    if (app.globalData.openid) {
      console.log(app.globalData.openid)
      this.setData({
        openid: app.globalData.openid
      })
    } else {
      wx.cloud.callFunction({
        name: 'login',
        data: {},
        success: res => {
          console.log('[云函数] [login] user openid: ', res.result.openid)
          app.globalData.openid = res.result.openid
          this.setData({
            openid: app.globalData.openid
          })
        },
        fail: err => {
          console.error('[云函数] [login] 调用失败', err)
        }
      })
    }
    this.onQueryAll()

  },
  onShareAppMessage: function(ops) {

  },
  bindDateChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },
  bindRegionChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
    })
  },
 

  onQueryAll: function() {
    wx.cloud.callFunction({
      name: 'readAll',
      data: {},
      success: res => {
        console.log('[云函数] [readAll] 调用成功' + res.result.data.length)
        this.setData({
          queryAllResult: res.result.data
        })
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[云函数] [readAll] 调用失败', err)
      }
    })




    // const db = wx.cloud.database()
   
    // const countResult = db.collection('counters').count()
    // console.log("一共有：" + countResult.total)


    // db.collection('counters').get({
    //   success: res => {
    //     this.setData({
          
    //       queryAllResult: res.data
    //     })
    //     console.log('[数据库] [查询记录] 成功: ', res)
    //   },
    //   fail: err => {
    //     wx.showToast({
    //       icon: 'none',
    //       title: '查询记录失败'
    //     })
    //     console.error('[数据库] [查询记录] 失败：', err)
    //   }
    // })

  },


  onRemove: function(e) {

    if (e.target.dataset.operation != null) {
      const db = wx.cloud.database()
      db.collection('counters').doc(e.target.dataset.operation).remove({
        success: res => {
          wx.showToast({
            title: '删除成功',
          })
          this.setData({
            isShowMy: false
          })

        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '删除失败',
          })
          console.error('[数据库] [删除记录] 失败：', err)
        }
      })
    } else {
      wx.showToast({
        title: '无记录可删，请见创建一个记录',
      })
    }
  },






})