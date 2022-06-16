let app = getApp()
const db = wx.cloud.database()
Page({
  data: {
    tabs: ['待上餐', '待评价', '已完成', '已取消', ],
    currentTab: 0,
    list:[]
  },
  // 选中顶部导航栏
  selectTab(event) {
    let index = event.currentTarget.dataset.index
    console.log("用户点击了", index)
    this.setData({
      currentTab: index
    })
    if (index == 3) { //已取消的订单
      index = -1
    }
    this.getList(index)
  },
  
  onLoad() {  
    this.getList(0)

  },
  onShow:function(){
  
    console.log('onShow')
  },
  getList(status) {
    console.log("相应的订单状态值", status)
    db.collection('order')
      .where({
        status: status //订单状态 -1订单取消,0新下单待上餐,1待用户评价,2订单已完成
      })
      .get()
      .then(res => {
        console.log('请求到的订单列表', res)
        this.setData({
          list: res.data
        })
        console.log(res.data)
      })
      .catch(res => {
        console.log('请求订单列表失败', res)
      })
  },
  // 取消订单
  quxiao(e) {
    let id = e.currentTarget.dataset.id
    db.collection('order').doc(id)
      .update({
        data: {
          //订单状态 -1订单取消,0新下单待上餐,1待用户评价,2订单已完成
          status: -1
        }
      }).then(res => {
        console.log('取消订单的结果', res)
        this.getList(0)
      }).catch(res => {
        console.log('取消订单失败', res)
      })
  },
  // 去评价店铺
  pingjia(e) {
    let id = e.currentTarget.dataset.id
    console.log('id', id)
    let user = wx.getStorageSync('user')
    console.log('用户信息', user)
    wx.showModal({
      title: '输入评价内容',
      editable: true,
      cancelColor: '取消',
      success: res => {
        if (res.confirm) {
          console.log('用户的输入内容', res.content)
          if (res.content) {
            db.collection('pinglun').add({
              data: {
                name: user.nickName,
                orderId: id,
                avatarUrl: user.avatarUrl,
                content: res.content,
                time: app.getCurrentTime()
              }
            }).then(res => {
              console.log('提评价成功', res)
              db.collection('order').doc(id)
                .update({
                  data: {
                    //订单状态 -1订单取消,0新下单待上餐,1待用户评价,2订单已完成
                    status: 2
                  }
                }).then(res => {
                  console.log('评价订单的结果', res)
                  this.getList(0)
                }).catch(res => {
                  console.log('评价订单失败', res)
                })
              wx.showToast({
                title: '提交成功',
              })
            })
          } else {
            wx.showToast({
              icon: 'error',
              title: '内容为空',
            })
          }
        } else {
          console.log('用户点击了取消')
        }
      }
    })
  },
  // 跳转到评价列表页
  chankanpingjia() {
    wx.navigateTo({
      url: '/pages/mycomment/mycomment',
    })
  }
})