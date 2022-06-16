
const app = getApp()

Page({
  data: {
  img:[]
  },
  onLoad : function(){
    let img = this.data.img
    wx.cloud.database().collection("lunbotu").get()
      .then(res => {
       console.log(res.data)
       img = res.data
       console.log(img)
       this.setData({
         img:img
       })
      })
  }

})
