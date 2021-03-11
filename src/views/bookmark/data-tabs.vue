<template>
  <div>
    <div shadow="always" style=" height: 100%;  text-align:center;">
      <div
        v-for="(item, index) in option"
        :key="index"
        style=" display: inline-block; width:160px;height:70px;margin:5px; border-radius:5px;  box-shadow: darkgrey 1px 1px 10px 1px"
        :class="{'mousehover':index == hoverIndex,'mouseout':index!=hoverIndex}"
        @click="urlclick(item)"
        @mouseenter="bookmarkmouseover(item,index)" @mouseleave="bookmarkmouseout()"
      >
        <el-tooltip
          :content="item.title"
          placement="bottom"
          effect="light"
          :open-delay=1000
        >

          <div style="height:70px;outline:0 !important">
            <div style="margin:5px 0 0 5px">
              <el-image
                :src="item.favicon"
                style="width: 32px; height: 32px; margin-right:5px;  border-radius:50%;box-shadow: 0 0 2px #7C55FB"
                fit="fill"
              >
                <div
                  slot="error"
                  style=" font-size:20px;line-height:35px;  color:white; text-align: center; background:#7C55FB; cursor:default"
                >
                  {{ item.title.substr(0, 1) }}
                </div>
              </el-image>
              <div class="box">
                <div class="wrap" style="cursor:default">
                  {{ item.title }}
                </div>
              </div>
            </div>

            <div
              style=" height:15px;padding:2px 0 0 5px;  overflow: hidden; font-size:12px; text-align: left; cursor:default"
            >
              {{  bottomTxt(item) }}
            </div>
          </div>

        </el-tooltip>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/api'
export default {
  name: 'DataTabs',
  components: {},
  props: {
    option: {
      type: Array,
      default: null
    }
  },
  data () {
    return {
      active: '',
      hoverIndex: -1
    }
  },

  methods: {
    bottomTxt (item) {
    // "点击次数：" + item.clickCount + "  "+item.description
      if (item.description) {
        return item.clickCount + '#' + item.description
      } else {
        return '点击次数：' + item.clickCount
      }
    },
    urlclick (item) {
      window.open(item.url, '_blank')
      api.BookmarkClick(item.id).then(re => {
        if (re > 0) {
          item.clickCount++
        }
      })
    },
    /**
   * 鼠标停留书签  向父组件传值
   */
    mouseStayToFather (item) {
      this.$emit('listentochildevent', item)
    },
    /**
   * 鼠标经过
   */
    bookmarkmouseover (item, index) {
      this.mouseStayToFather(item)
      this.hoverIndex = index
    },
    /**
   * 鼠标离开
   */
    bookmarkmouseout () {
      this.mouseStayToFather(null)
      this.hoverIndex = -1
    }
  }

}
</script>

<style lang="scss" scoped>
.box {
  display: inline-block;
  width: 110px;
  height: 35px;
  overflow: hidden;
  font-family: inherit;
  font-size: 14px;
  font-style: normal;
  text-align: left;
  //border: 1px solid #fff;
}

.wrap {
  display: table-cell;
  vertical-align: middle;
}
.mousehover{
  background: #cccccc
}
.mouseout{
  background:#CCFFFF
}
</style>
