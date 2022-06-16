// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    isShowUserName: false,
    userInfo: ''
  },
  // login

  daifukuan() {
    if(app.globalData.shoppinglist){
    wx.navigateTo({
      url: `/pages/daifukuan/daifukuan`,
    })
  }
  else{
    wx.showToast({
      title: '你的购物车空空如也，快去选购商品吧！',
      icon: 'none'
    })
    setTimeout(() => {
      wx.navigateTo({
        url: '/pages/menu/menu',
      })
    }, 1000)
  }
  },
  // daiqueren() {
  //   getApp().globalData. currentTab='1'
  //   wx.switchTab({
  //     url: '/pages/myOrder/myOrder',
  //   })
  // },
  // daifahuo() {
  //       getApp().globalData. currentTab='0'
  //       wx.switchTab({
  //         url: '/pages/myOrder/myOrder',
  //       })
  // },
  // daishouhuo() {
  //   getApp().globalData. currentTab='2'
  //   wx.switchTab({
  //     url: '/pages/myOrder/myOrder',
  //   })
  // },
  // tuikuan() {
  //   getApp().globalData. currentTab='3'
  //   wx.switchTab({
  //     url: '/pages/myOrder/myOrder',
  //   })
  // },
  huiyuanma() {
    wx.navigateTo({
      url: '/pages/huiyuanma/huiyuanma',
    })
  },
  gouwuche() {
    wx.navigateTo({
      url: '/pages/menu/menu',
    })
  },

  zengpin() {
    wx.navigateTo({
      url: '/pages/zengpin/zengpin',
    })
  },

  zhanghaoshezhi() {
    wx.navigateTo({
      url: '/pages/zhnaghaoshezhi/zhanghaoshezhi',
    })
  },
  renwuzhongxin() {
    wx.navigateTo({
      url: '/pages/renwuzhongxin/renwuzhongxin',
    })
  },
  chakanquanbudingdan() {
    wx.navigateTo({
      url: '/pages/chakanquanbudingdan/chakanquanbudingdan',
    })
  },
  loging() {
    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log("获取用户信息成功", res)
        let user = res.userInfo
        this.setData({
          isShowUserName: true,
          userInfo: user,
        })
        wx.setStorageSync('user', user)
      },
      fail: res => {
        console.log("获取用户信息失败", res)
      }
    })
  },

  onLoad: function () {
    let a = wx.setStorageSync('user')
    this.setData({
      userInfo: a
    })
  }
})