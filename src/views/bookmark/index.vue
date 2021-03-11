<template>
  <d2-container style="height: 100%; ">
    <el-row :gutter="2" style="height: 100%; ">
      <el-col :span="5" style="height: 100%; ">
        <!-- 主目录 -->
        <el-card
          class="d2-card"
          shadow="always"
          style="min-height: 100%; text-align:center;  box-shadow: darkgrey 10px 10px 30px 5px"
          :body-style="{ padding: '10px 0px' }"

        >
          <el-button
            v-for="(item, i) in fatherTagList"
            :key="i"
            plain
            size="mini"
            type="primary"
            class="tagitem"
            :class="{ buttonClickBack: fatherClickIndex === i }"
            @click="fatherTagClick(i)"
            @mouseenter.native="tagMouseEnter(item, i)"
            @mouseleave.native="tagMouseLeave()"
          >
            {{ item.name }}
          </el-button>
        </el-card>
      </el-col>

      <el-col :span="19">
        <!-- 子目录 -->
        <el-card
          shadow="always"
          style="height: 100%; text-align:left;   box-shadow: darkgrey 10px 10px 30px 5px"
        >
          <el-button
            v-for="(item, i) in sonTagList"
            :key="i"
            plain
            size="mini"
            type="primary"
            class="tagitem"
            :class="{ buttonClickBack: sonClickIndex === i }"
            @click="sonTagClick(i)"
            @mouseenter.native="tagMouseEnter(item, i)"
            @mouseleave.native="tagMouseLeave()"
          >
            {{ item.name }}
          </el-button>
        </el-card>
        <el-card
          shadow="hover"
          class="d2-card"
          style="height:20px"
          :body-style="{ padding: '0 0 0 40px' }"
        >
          <div style="display: inline-block;" @click="insertTag">
            <el-tooltip content="添加目录" placement="bottom" effect="light">
              <d2-icon-svg name="addTag" style="height:20px; width:18px;  " />
            </el-tooltip>
          </div>
          <div style="display: inline-block;" @click="insertBookmark">
            <el-tooltip content="添加书签" placement="bottom" effect="light">
              <d2-icon-svg
                name="addBookmark"
                style="height:20px; width:18px; margin-left:10px"
              />
            </el-tooltip>
          </div>
          <el-tooltip content="目录顺序调整" placement="bottom" effect="light">
            <d2-icon-svg
              name="tagOrder"
              style="height:20px; width:18px; margin-left:10px"
            />
          </el-tooltip>

          <div style="display: inline-block;" @click="onAddDataSort">
            <el-tooltip
              content="按添加日期排序"
              placement="bottom"
              effect="light"
            >
              <d2-icon-svg
                name="order_date"
                style="height:20px; width:18px; margin-left:40px"
              />
            </el-tooltip>
          </div>

          <div style="display: inline-block;" @click="onClickCountSort">
            <el-tooltip
              content="按点击次数排序"
              placement="bottom"
              effect="light"
            >
              <d2-icon-svg
                name="order_click"
                style="height:20px; width:18px; margin-left:10px"
              />
            </el-tooltip>
          </div>

          <div style="display: inline-block;" @click="onLastClickSort">
            <el-tooltip
              content="按最后点击时间排序"
              placement="bottom"
              effect="light"
            >
              <d2-icon-svg
                name="order_lastclick"
                style="height:20px; width:18px; margin-left:10px"
              />
            </el-tooltip>
          </div>
        </el-card>
        <el-card shadow="hover" class="d2-card" v-loading="getbookmarkloading">
          <!-- <el-table
            v-show="remarkShowTable"
            :show-header="false"
            :data="todoList"
            style="width: 100%"
          >
            <el-table-column width="40">
              <template slot-scope="scope">
                <el-checkbox v-model="scope.row.status" />
              </template>
            </el-table-column>
            <el-table-column>
              <template slot-scope="scope">
                <div
                  :class="{ 'todo-item-del': scope.row.status }"
                  class="todo-item"
                >
                  {{ scope.row.title }}
                </div>
              </template>
            </el-table-column>
            <el-table-column width="60">
              <template>
                <i class="el-icon-edit"></i>
                <i class="el-icon-delete"></i>
              </template>
            </el-table-column>
          </el-table> -->

          <data-tabs
            :option="bookmarkList"
            @listentochildevent="mouseStayItem"
          />

          <el-pagination
            :background="true"
            :current-page="currentpage"
            :layout="layout"
            :page-size="pagesize"
            :total="totalcount"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
          ></el-pagination>
        </el-card>
      </el-col>
    </el-row>
    <addBookmark
      ref="editbookmark"
      @closemoule="closewindowbookmark"
      v-hotkey="keymapbookmark"
    ></addBookmark>
    <addTag
      ref="edittag"
      @closemoule="closewindowTag"
      v-hotkey="keymaptag"
    ></addTag>
  </d2-container>
</template>

<script>
import DataTabs from './data-tabs'
import addBookmark from './addBookmark'
import addTag from './addTag'
import api from '@/api'
import { CreatePageParm } from '@/utils/PageParm'
export default {
  name: 'bookmark',
  components: { DataTabs, addBookmark, addTag },
  data () {
    return {
      layout: 'total, sizes, prev, pager, next, jumper',
      fatherTagList: [], // 一级目录
      sonTagList: [{ name: '全部', id: -1, pid: -1 }], // 二级目录
      fatherClickIndex: 0, // 一级目录点击的item
      sonClickIndex: 0, // 二级目录点击的item
      bookmarkList: [], // 书签
      remarkShowTable: false, // 书签是否显示成表格样式
      currentPid: -1, // 当前的目录id
      getbookmarkloading: false,

      // 下面为分页参数
      currentpage: 1,
      pagesize: 40,
      totalcount: 0,
      // 下面为排序方式
      orderBy: 'LastClick', // 默认最后一次点击时间
      ascending: false, // 升序
      // 下面为快捷键绑定相关
      opensonwindow: false, // 是否打开子窗体标记
      mouseHoverBookmark: null, // 鼠标处于哪个书签上
      mouseHoverTag: null // 鼠标处于哪个目录上
    }
  },
  computed: {
    keymapbookmark () {
      return {
        i: this.insertBookmark,
        I: this.insertBookmark,
        e: this.updateeditBookmark,
        E: this.updateeditBookmark,
        d: this.DeleteBookmark,
        D: this.DeleteBookmark
      }
    },
    keymaptag () {
      return {
        e: this.editTag,
        E: this.editTag,
        d: this.DeleteTag,
        D: this.DeleteTag
      }
    }
  },

  created () {
    this.getTags(-1)
    this.getBookmark(-1)
  },
  mounted () {},
  methods: {
    handleCurrentChange (val) {
      this.currentpage = val
      this.getBookmark(this.currentPid)
    },
    handleSizeChange (val) {
      this.pagesize = val
      this.getBookmark(this.currentPid)
    },
    /**
     * 鼠标处于哪个书签
     */
    mouseStayItem (item) {
      this.mouseHoverBookmark = item
    },
    /**
     * 获取目录
     */
    getTags (pid) {
      api.GetTags(pid).then(re => {
        var list = re
        list.splice(0, 0, { name: '全部', id: -1, pid: -1 })
        this.fatherTagList = list
      })
    },
    /**
     * 获取书签
     */
    getBookmark (pid) {
      var para = CreatePageParm(
        this.currentpage,
        this.pagesize,
        this.orderBy,
        this.ascending
      )
      para.TagId = pid
      this.getbookmarkloading = true
      api
        .GetBookmarks(para)
        .then(re => {
          this.totalcount = re.totalCount
          this.bookmarkList = re.dataSource
          this.getbookmarkloading = false
        })
        .catch(e => {
          console.log(e)
          this.getbookmarkloading = false
        })
    },
    /**
     * 一级目录点击
     */
    fatherTagClick (index) {
      // if (this.fatherClickIndex === index) {
      //   return
      // }
      this.fatherClickIndex = index
      this.sonClickIndex = 0
      this.currentPid = this.fatherTagList[index].id
      // 获取目录书签
      this.getBookmark(this.currentPid)
      if (index !== 0) {
        // 获取二级目录
        api.GetTags(this.fatherTagList[index].id).then(re => {
          var list = re
          if (list && list.length > 0) {
            list.splice(0, 0, {
              name: this.fatherTagList[index].name + ' /',
              id: this.fatherTagList[index].id,
              pid: this.fatherTagList[index].pid
            })
          } else {
            list[0] = {
              name: this.fatherTagList[index].name + ' /',
              id: this.fatherTagList[index].id,
              pid: this.fatherTagList[index].pid
            }
          }
          this.sonTagList = list
        })
      } else {
        this.sonTagList = [{ name: '全部', id: -1, pid: -1 }]
      }
      // GetBookmarks
    },
    /**
     * 二级目录点击
     */
    sonTagClick (index) {
      if (this.sonClickIndex === index) {
        return
      }
      this.sonClickIndex = index
      this.currentPid = this.sonTagList[index].id
      this.getBookmark(this.sonTagList[index].id)
    },
    /**
     * 目录编辑
     */
    editTag () {
      if (!this.opensonwindow && this.mouseHoverTag) {
        this.opensonwindow = true

        this.$refs.edittag.showAddTag(this.mouseHoverTag)
      }
    },
    /**
     * 目录删除
     */
    DeleteTag () {
      if (!this.mouseHoverTag) {
        return
      }
      const tagcopy = JSON.parse(JSON.stringify(this.mouseHoverTag))
      console.log(tagcopy.id)
      this.$confirm(
        '注意：非空目录将会删除失败',
        '是否删除目录《' + tagcopy.name + '》?',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          api
            .DeleteTag(tagcopy.id)
            .then(re => {
              this.closewindowTag(true, tagcopy)
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
            })
            .catch(e => {

            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    /**
     * 新增目录
     */
    insertTag () {
      if (!this.opensonwindow) {
        this.opensonwindow = true

        this.$refs.edittag.showAddTag()
      }
    },
    /**
     * 关闭目录编辑窗口
     */
    closewindowTag (needupdate, tagdata) {
      this.opensonwindow = false
      if (needupdate) {
        if (tagdata.pid === -1) {
          api.GetTags(tagdata.pid).then(re => {
            var list = re
            list.splice(0, 0, { name: '全部', id: -1, pid: -1 })
            this.fatherTagList = list
          })
          this.fatherTagClick(0)
          console.log('点击')
        } else {
          const ftagindex = this.fatherTagList.findIndex(it => it.id === tagdata.pid)
          this.fatherTagClick(ftagindex)
          console.log('点击' + ftagindex)
        }
      }
    },
    /**
     * 鼠标滑到目录标签
     */
    tagMouseEnter (item, index) {
      this.mouseHoverTag = item
    },
    /**
     * 鼠标离开目录标签
     */
    tagMouseLeave () {
      this.mouseHoverTag = null
    },
    /**
     * 打开书签新增界面
     */
    insertBookmark () {
      if (!this.opensonwindow) {
        this.opensonwindow = true
        // let bookmark = null
        // if (this.mouseHoverBookmark) {
        //   bookmark = this.mouseHoverBookmark
        // }
        this.$refs.editbookmark.showAddBookmark()
      }
    },
    /**
     * 打开书签编辑界面
     */
    updateeditBookmark () {
      if (!this.opensonwindow) {
        let bookmark = null
        if (this.mouseHoverBookmark) {
          bookmark = this.mouseHoverBookmark
          this.$refs.editbookmark.showAddBookmark(bookmark)
          this.opensonwindow = true
        }
      }
    },
    /**
     * 删除鼠标位置当前书签
     */
    DeleteBookmark () {
      if (!this.mouseHoverBookmark) {
        return
      }
      const bookmarkcopy = JSON.parse(JSON.stringify(this.mouseHoverBookmark))
      this.$confirm(
        '此操作将永久删除书签 《' + bookmarkcopy.title + '》',
        '是否继续?',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          console.log(bookmarkcopy)
          api
            .DeleteBookmark(bookmarkcopy.id)
            .then(re => {
              this.getBookmark(this.currentPid)
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
            })
            .catch(e => {
              this.$message({
                type: 'info',
                message: '删除失败'
              })
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 关闭子书签窗口
    closewindowbookmark (needupdate) {
      this.opensonwindow = false
      if (needupdate) {
        this.getBookmark(this.currentPid)
      }
    },
    /**
     * 按添加时间排序
     */
    onAddDataSort () {
      if (this.orderBy === 'CreatedAt') {
        this.ascending = !this.ascending
      } else {
        this.ascending = true
      }
      this.currentpage = 1
      this.orderBy = 'CreatedAt'
      this.getBookmark(this.currentPid)
    },
    /**
     * 按点击次数排序
     */
    onClickCountSort () {
      if (this.orderBy === 'ClickCount') {
        this.ascending = !this.ascending
      } else {
        this.ascending = false
      }
      this.currentpage = 1
      this.orderBy = 'ClickCount'
      this.getBookmark(this.currentPid)
    },
    /**
     * 按最后点击时间排序
     */
    onLastClickSort () {
      if (this.orderBy === 'LastClick') {
        this.ascending = !this.ascending
      } else {
        this.ascending = false
      }
      this.currentpage = 1
      this.orderBy = 'LastClick'
      this.getBookmark(this.currentPid)
    }
  }
}
</script>

<style lang="scss" scoped>
.tagitem {
  margin: 5px 3px 0 0;
  border-radius: 10px;
}
.el-pagination {
  padding: 2px 5px;
  margin: 15px 0 0 0;
  font-weight: normal;
  text-align: center;
}
.buttonClickBack {
  background: #409eff;
  color: #ffffff;
}
</style>
