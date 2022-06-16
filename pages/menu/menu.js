let windowHeight = 0
const db = wx.cloud.database()
let searchKey = ''
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shuzu: [],
    zongyuan: 0,
    zongjian: 0,
    maskFlag: true,
    heightArr: [],
    menuArr: [],
    leftActiveNum: 0,
    Tab: 0,
    cartList: [],
  },
  getSearch(e) {
    searchKey = e.detail.value
  },
  goSearch() {
    console.log('dianji')
    if (searchKey && searchKey.length > 0) {
      db.collection('foods').where({
          name: db.RegExp({
            regexp: searchKey,
            options: 'i'
          })
        }).get()
        .then(res => {
          var a = res.data
          var list = a.map((item, index) => {
            return Object.assign(item, {
              'num': 0
            })
          })
          list.forEach(item => {
            if (app.globalData.menuArr && app.globalData.menuArr.length > 0) {
              let result = app.globalData.menuArr.find(cart => {
                return cart._id == item._id;
              })
              if (result) {
                item.num = result.num
              }
            }
          })
          this.setData({
            menuArr: list
          })

        })

    }
  },
  close() {
    this.setData({
      maskFlag: true,
    })
    console.log(this.data.maskFlag)
  },
  open() {

    this.setData({
      maskFlag: false
    })
    console.log(this.data.maskFlag)
  },

  /*
 
购物车

 */
  // 增加
  addCount(e) {
    let cartList = []
    let id = e.currentTarget.dataset.id
    let list = this.data.menuArr
    let zongjian = this.data.zongjian
    let zongyuan = this.data.zongyuan
    cartList = this.data.cartList
    console.log(list)
    list.forEach(item => {
      if (item._id == id) {
        if(item.kucun>item.num){
        item.num += 1
        zongjian += 1
        zongyuan += item.jiage
        // 增加菜品bug
        if (cartList && cartList.length > 0) {
          var result = cartList.find(cart => {
            return cart._id == id;
          })
          if (cartList === undefined) {
            cartList = []
          }
          if (!result) {
            cartList.push(item)
          } else {
            cartList.num = item.num
          }
        } else {

          cartList = []
          cartList.push(item)
        }
      }
      else{
        wx.showToast({
          title: '对不起，我们已经被榨干了',
          icon: 'none'
        })
      }
      }
    })
    app.globalData.cartList = cartList
    app.globalData.menuArr = list
    console.log('++', cartList)
    this.setData({
      menuArr: list,
      zongjian,
      zongyuan,
      cartList
    })

  },
  // 减少
  minusCount(e) {
    let id = e.currentTarget.dataset.id
    let list = this.data.menuArr
    let zongjian = this.data.zongjian
    let zongyuan = this.data.zongyuan
    let cartList = this.data.cartList
    list.forEach(item => {
      if (item._id == id) {
        if (item.num > 0) {
          item.num -= 1
          zongjian -= 1
          zongyuan -= item.jiage
          var index = cartList.findIndex(cart => {
            return cart._id == id;
          })
          if (index > -1) {
            cartList[index].num = item.num
          }
          if (item.num == 0) {
            cartList.splice(index, 1) //删除下标为index的元素
          }
        } else {
          wx.showToast({
            title: '数量不能小于0',
            icon: 'none'
          })
        }
      }
    })
    app.globalData.cartList = cartList
    app.globalData.menuArr = list
    console.log("--", cartList)
    this.setData({
      menuArr: list,
      zongjian,
      zongyuan,
      cartList
    })
  },
  clearcart() {
    let menuArr = this.data.menuArr
    menuArr.forEach(item => {
      item.num = 0
    })
    this.setData({
      menuArr,
      cartList: [],
      zongyuan: 0,
      zongjian: 0
    })
    app.globalData.cartList = null
    app.globalData.menuArr = menuArr
  },
  more_click(e) {
    console.log('huancun', e)
    var a = e.currentTarget.dataset.item
    getApp().globalData.shoppinglist = a
    getApp().globalData.zongjian = this.data.zongjian
    getApp().globalData.zongji = this.data.zongyuan
    wx.setStorageSync('list', a)
    if (a && a.length > 0) {
      var model = JSON.stringify(a);
      wx.navigateTo({
        url: '../daifukuan/daifukuan?model=' + encodeURIComponent(model),
      })
    } else {
      wx.showToast({
        title: '您的购物车空空如也，快去选商品吧！',
        icon: 'none'
      })
    }
  },

  /*
  
  分类

  */


  // 左侧点击事件
  leftClickFn(e) {
    console.log(e)
    this.setData({
      leftActiveNum: e.target.dataset.myid,
      Tab: e.target.dataset.myid
    })
    console.log('点击了')
    console.log(e.target.dataset.myid)
  },

  //右侧滚动时触发这个事件
  rightScrollFn(e) {
    //避免部分机型上有问题，给出一个误差范围
    let st = e.detail.scrollTop;
    let myArr = this.data.heightArr;
    for (let i = 0; i < myArr.length; i++) {
      //找出是滚动到了第一个栏目，然后设置栏目选中状态
      if (st >= myArr[i] && st < myArr[i + 1] - wucha) {
        console.log("找到的i", i)
        this.setData({
          leftActiveNum: i + 1
        });
        return;
      } else if (st < myArr[0] - wucha) {
        this.setData({
          leftActiveNum: 0
        });
      }

    }
  },
  // 请求服务器获取商品清单
  onLoad: function (e) {
    getApp().globalData.yesorno = e.id
    console.log('dabao', e.id)
    this.setData({
      cartList: app.globalData.cartList
    })
    wx.cloud.database().collection("foods").get()
      .then(res => {
        let zongjian = this.data.zongjian
        let zongyuan = this.data.zongyuan
        let cartList = this.data.cartList
        let list = res.data
        let a = app.globalData.cartList
        if (list && list.length > 0) {
          list.forEach((item,index) => {
            if(item.kucun==0){
             list.splice(index,1) 
            }
            else if (cartList && cartList.length > 0) {
              let resule = cartList.find(cart => {
                return cart._id == item._id;
              })
              if (resule) {
                item.num = resule.num
                zongjian += item.num
                zongyuan += item.jiage * item.num
              } else {
                item.num = 0
              }
            } else {
              item.num = 0
            }

          })
          this.setData({
            menuArr: list,
            cartList: a,
            zongyuan: zongyuan,
            zongjian: zongjian
          })
        }
      })
    // 筛选获得新的数组用于类别判断

    wx.cloud.database().collection("foods").get()
      .then(res => {
        var that = this
        console.log("商品列表", res)
        for (var i = 0; i < res.data.length; i++) {
          var newarry = {
            leibie: res.data[i].leibie
          };
          that.data.shuzu = that.data.shuzu.concat(newarry);
          var hash = [];
          that.data.shuzu = that.data.shuzu.reduce(function (x, y) {
            hash[y['leibie']] ? '' : hash[y['leibie']] = true && x.push(y);
            return x;
          }, []);
          that.setData({
            shuzu: that.data.shuzu
          })
        }
      })

  },

  onShow: function (res) {
    console.log('quanju', app.globalData.cartList)
    console.log('quan', app.globalData.menuArr)
    if (app.globalData.cartList) {
      this.setData({
        cartList: app.globalData.cartList
      })
    }
    let a = this.data.cartList
    console.log('缓存', app.globalData.cartList)
    console.log('当前cartList', a)
  },

  onShareAppMessage: function () {},
  handleTabsItemChange(e) {
    const {
      index
    } = e.detail;
    let {
      tabs
    } = this.data;
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);
    this.setData({
      tabs
    })
  },

})