let app = getApp();
Page({
  data: {
    hasNum: null,
    shoppinglist: [],
    zongjian: 0,
    zongji: 0,
    yesorno: ''
  },
  zhifu() {
    let user = wx.getStorageSync('user')
    console.log(user)
    if (!this.data.hasNum) {
      wx.showToast({
        title: '请识别桌号',
        icon: 'error'
      })
    } else if (!user) {
      wx.showToast({
        title: '去个人中心登录',
        icon: 'error'
      })
      setTimeout(() => {
        wx.switchTab({
          url: '/pages/me/me',
        })
      }, 1000)
    }
    else{
      var shoppinglist = this.data.shoppinglist
      console.log('shop',shoppinglist)
    
      shoppinglist.forEach(item=>{
        var kucun = item.kucun - item.num
        wx.cloud.database().collection('foods').doc(item._id)
        .update({
          data:{
            kucun:kucun
          }
        }).then(res=>{
          console.log('更新成功')
        })
        console.log('kucun',kucun)
      })
    
      wx.cloud.database().collection('order')
      .add({
        data:{
          name:user.nickName,
          status:0,//状态
          address:this.data.hasNum,
          orderList:this.data.shoppinglist,
          totalPrice:this.data.zongji,
          yesorno:this.data.yesorno
        }
      }).then(res=>{
        console.log('提交成功')
        app.globalData.menuArr=null
        app.globalData.cartList=null
        wx.switchTab({
          url: '/pages/myOrder/myOrder',
        })
      })
    }
  },
  //在下个页面的onload中获取,
  onLoad: function (options) {
    this.setData({
      yesorno:app.globalData.yesorno
    })
    var a = options.model
    if (a && a.length > 0) {
      var list = JSON.parse(decodeURIComponent(a))
    }
    console.log(list)
    this.setData({
      shoppinglist: list
    })
    let zongjian = this.data.zongjian
    let zongji = this.data.zongji
    let lists = this.data.shoppinglist
    if (lists && lists.length > 0) {
      lists.forEach(item => {
        zongjian += item.num,
          zongji += (item.num * item.jiage)
      })
    }
    this.setData({
      zongji: zongji,
      zongjian: zongjian
    })
  },
  saoma() {
    var that = this
    wx.scanCode({
      success(res) {
        console.log(res.result)
        app.globalData.zhuohao = res.result
        that.setData({
          hasNum: res.result
        })
      }
    })
  },
onShow(){
if(app.globalData.zhuohao){
  this.setData({
    hasNum:app.globalData.zhuohao
  })
}
if(app.globalData.shoppinglist){
  this.setData({
    shoppinglist:app.globalData.shoppinglist
  })
}
if(app.globalData.zongji){
  this.setData({
    zongji:app.globalData.zongji
  })
}
if(app.globalData.zongjian){
  this.setData({
   zongjian:app.globalData.zongjian 
  })
}
}

})