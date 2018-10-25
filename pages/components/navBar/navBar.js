Component({
  properties: {
    shadowFlag: {
      type: Number,
      value: 0,
    },
    index:{
      type: Number,
      value: 0
    }
  },
  data: {
    icons: [
      ['../../asset/images/tabBar-index.png', '../../asset/images/tabBar-index-active.png'],
      ['../../asset/images/tabBar-message.png', '../../asset/images/tabBar-message-active.png'],
      ['../../asset/images/tabBar-mine.png','../../asset/images/tabBar-mine-active.png']
    ]
  },
  methods: {
    turnToPage (e) {
      let url = e.currentTarget.dataset.url
      url = "/pages/" + url + "/" + url;
      
      wx.redirectTo({
        url: url
      })
    }
  }
})