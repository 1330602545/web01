Page({
  data: {
    tabs: ['全部评价', '我的评价'],
    currentTab: 0
  },
  onLoad() {
    this.getList(0)
  },
  // 选中顶部导航栏
  selectTab(event) {
    let index = event.currentTarget.dataset.index
    console.log("用户点击了", index)
    this.setData({
      currentTab: index
    })
    this.getList(index)
  },
  // 获取评价列表数据
  getList(index) {
    // index 0全部评价，1我的评价
    if (index == 1) {
      // 小程序端 调用数据库权限比较低
      wx.cloud.database().collection('pinglun').get()
        .then(res => {
          console.log('我的评价列表', res)
          this.setData({
            list: res.data
          })
        })
    } else {
      // 云函数端 调用数据库拥有最高权限
      wx.cloud.callFunction({
        name: 'getpinglun2'
      }).then(res => {
        console.log('全部的评价列表', res)
        this.setData({
          list: res.result.data
        })
      })
    }


  }
})