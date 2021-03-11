<template>
  <el-dialog
    center
    :title="title"
    :visible.sync="dialogFormVisible"
    width="600px"
    @close="close"
    ><el-form
      :model="bookmarkdata"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      v-loading="saveloading"
    >
      <el-form-item label="链接" prop="url">
        <el-input
          v-model="bookmarkdata.url"
          placeholder="请输入内容"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="标题" prop="title">
        <el-input
          v-model="bookmarkdata.title"
          placeholder="请输入内容"
          clearable
          v-loading="titleloading"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="getUrlTitle"
          ></el-button>
        </el-input>
      </el-form-item>

      <el-form-item label="目录"  required>
        <el-row>
          <el-col :span="12">
            <el-form-item prop="fatherTagid">
              <el-select
                style="width: 100%;"
                v-model="bookmarkdata.fatherTagid"
                placeholder="请选择一级目录"
                filterable
                clearable
                @change="onFatherTagChange"
              >
                <el-option
                  v-for="item in fatherOptions"
                  :key="'father' + item.id"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="tagId">
              <el-select
                style="width: 100%;"
                v-model="bookmarkdata.tagId"
                placeholder="请选择二级目录"
                filterable
                clearable
              >
                <el-option
                  v-for="item in sonOptions"
                  :key="'son' + item.id"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form-item>

      <el-form-item label="描述">
        <el-input
          v-model="bookmarkdata.description"
          placeholder="请输入内容"
          clearable
          type="textarea"
        ></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="submitForm('ruleForm')"
        >确 定</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
import api from '@/api'

export default {
  data () {
    return {
      bookmarkid: null,
      title: '添加书签',
      dialogFormVisible: false,
      titleloading: false, // 获取标题等待
      saveloading: false, // 保存等待
      isedit: false, // 是否新增
      bookmarkdata: {
        url: '',
        title: '',
        description: '',
        tagId: '', // 二级目录id
        fatherTagid: '', // 一级目录id
        id: ''
      },
      // fatherTagid: '', // 一级目录id
      fatherOptions: [], // 一级目录
      sonOptions: [], // 二级目录
      rules: {
        url: [{ required: true, message: '请输入网址', trigger: 'blur' }],
        title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
        tagId: [{ required: true, message: '请选择目录', trigger: 'change' }],
        fatherTagid: [{ required: true, message: '请选择目录', trigger: 'change' }]
      }
    }
  },

  created () {},
  mounted () {},
  methods: {
    /**
     * 显示界面
     */
    showAddBookmark (bookmarkitem) {
      if (this.$refs.ruleForm) this.$refs.ruleForm.clearValidate()
      if (bookmarkitem) {
        // this.bookmarkdata = JSON.parse(JSON.stringify(bookmarkitem))
        this.bookmarkdata.url = bookmarkitem.url
        this.bookmarkdata.title = bookmarkitem.title
        this.bookmarkdata.tagId = bookmarkitem.tagId
        this.bookmarkdata.id = bookmarkitem.id
        this.bookmarkdata.fatherTagid = ''
        this.title = '编辑书签'
        this.GetTagFromBookmarkid(bookmarkitem.id)
        this.isedit = true
      } else {
        this.title = '添加书签'
        this.isedit = false
        //  this.fatherTagid = null
        this.bookmarkdata.url = ''
        this.bookmarkdata.title = ''
        this.bookmarkdata.tagId = ''
        this.bookmarkdata.id = ''
        this.bookmarkdata.fatherTagid = ''
      }
      this.getTags(-1, true)
      this.dialogFormVisible = true
    },

    close () {
      this.dialogFormVisible = false
      this.$emit('closemoule', false)
    },
    /**
     * 获取url标题
     */
    async getUrlTitle () {
      this.titleloading = true
      await api
        .BookmarkTitle(this.bookmarkdata.url)
        .then(re => {
          this.bookmarkdata.title = re
          this.titleloading = false
        })
        .catch(e => {
          this.titleloading = false
        })
    },
    /**
     * 获取目录
     */
    getTags (pid, isfather) {
      api.GetTags(pid).then(re => {
        if (isfather) {
          this.fatherOptions = re
        } else {
          const fa = this.fatherOptions.find(it => it.id === pid)
          const target = JSON.parse(JSON.stringify(fa))
          target.name = '/'
          this.sonOptions = [target].concat(re)

          if (!this.isedit) {
            // 新增
            // this.bookmarkdata.tagId = pid
          }
        }
      })
    },
    /**
     * 父目录选择发生改变
     */
    onFatherTagChange () {
      this.sonOptions = []
      this.getTags(this.bookmarkdata.fatherTagid, false)
      this.bookmarkdata.tagId = this.bookmarkdata.fatherTagid
    },
    /**
     * 保存数据
     */
    save () {
      const target = JSON.parse(JSON.stringify(this.bookmarkdata))
      delete target.fatherTagid
      this.saveloading = true
      if (!target.id) {
        // 新增
        api
          .InsertBookmark(target)
          .then(re => {
            this.saveloading = false
            this.dialogFormVisible = false
            this.$emit('closemoule', true)
            this.$message({
              message: '新增书签成功',
              type: 'success'
            })
          })
          .catch(e => {
            this.saveloading = false
          })
      } else {
        api
          .UpdateBookmark(target)
          .then(re => {
            this.saveloading = false
            this.dialogFormVisible = false
            this.$emit('closemoule', true)
            this.$message({
              message: '修改书签成功',
              type: 'success'
            })
          })
          .catch(e => {
            this.saveloading = false
          })
      }
    },
    /**
     * 表单校验
     */
    submitForm (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.save()
        } else {
          return false
        }
      })
    },
    /**
     * 根据书签id查询书签所在的目录
     */
    GetTagFromBookmarkid (id) {
      api.GetTagFromBookmarkid(id).then(re => {
        if (re.pid === -1) {
          this.bookmarkdata.fatherTagid = re.id
          this.bookmarkdata.tagId = re.id
        } else {
          this.bookmarkdata.fatherTagid = re.pid
          this.bookmarkdata.tagId = re.id
        }
        this.getTags(this.bookmarkdata.fatherTagid, false)
      })
    }
  }
}
</script>
<style scoped></style>
