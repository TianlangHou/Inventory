// pages/databaseGuide/databaseGuide.js

const app = getApp()

Page({

  data: {
    step: 1,
    schema:'counters',
    counterId: '',
    openid: '',
    count: null,
    queryResult: '',
    region: ['广东省', '广州市', '海珠区'],
    labelLocation: '地点',
    labelDate: '日期',
    labelOT: 'Hours',
    labelOOT: 'OOT',
    labelId: '联系方式',
    isShowMy: false,
    isShowAll: false,
    allInventory:'点击查看所有盘点',
    isShowShare:false,
    labelOthers:'备注'
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
  },
  onShareAppMessage: function (ops){
    return {
      title: '盘点市场',
      path: 'pages/market/market'
    }
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
  formSubmit: function(e) {
    var flag = true;
  
    if (e.detail.value.OT == "" | e.detail.value.OOT == "" | e.detail.value.date == null | e.detail.value.city == "" | e.detail.value.staffId == ""){
      flag = false
      wx.showToast({
        icon: 'none',
        title: '信息不完整'
      })
    }
    

    
    if(flag == true){
      const db = wx.cloud.database()
      db.collection('counters').add({
        data: {
          OT: e.detail.value.OT,
          city: e.detail.value.city,
          date: e.detail.value.date,
          staffId: e.detail.value.staffId,
          OOT: e.detail.value.OOT,
          sellType: e.detail.value.others,
          grade: new Date()

        },
        success: res => {
          // 在返回结果中会包含新创建的记录的 _id
          this.setData({
            counterId: res._id,
            count: 1,
            isShowShare: true
          })
          wx.showToast({
            title: '新增记录成功',
          })
          console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
          
        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '新增记录失败'
          })
          console.error('[数据库] [新增记录] 失败：', err)
        }
      })
    }
 
  },

  onHideShare:function(){
    this.setData({
      isShowShare:false
    })
  },

  onQuery: function() {
    if(this.data.isShowMy==false){
    this.setData({
      isShowMy: true
      })
  
    const db = wx.cloud.database()
    console.log(this.data.openid)
    // 查询当前用户所有的 counters
    db.collection('counters').where({
      _openid: this.data.openid
    }).get({
      success: res => {
        this.setData({
          //queryResult: JSON.stringify(res.data, null, 2)
          queryResult: res.data
        })
        console.log('[数据库] [查询记录] 成功: ', res)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
    } else {
      this.setData({
        isShowMy: false
      })
    }
  },

  onQueryAll: function() {
    if (this.data.isShowAll == false) {
      this.setData({
        isShowAll: true,
        allInventory:"我要发布盘点"
      })
    const db = wx.cloud.database()
    // 查询所有用户所有的 counters
    db.collection('counters').get({
      success: res => {
        this.setData({
          //queryResult: JSON.stringify(res.data, null, 2)
          queryAllResult: res.data
        })
        console.log('[数据库] [查询记录] 成功: ', res)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
    } else {
      this.setData({
        isShowAll: false,
        allInventory: "点击查看盘点市场"
      })
    }
  },


  onRemove: function(e) {
    
    if (e.target.dataset.operation!=null) {
      const db = wx.cloud.database()
      db.collection('counters').doc(e.target.dataset.operation).remove({
        success: res => {
          wx.showToast({
            title: '删除成功',
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
    this.onQuery()
  },






})