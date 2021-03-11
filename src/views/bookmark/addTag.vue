<template>
  <el-dialog
    center
    :title="title"
    :visible.sync="dialogFormVisible"
    width="500px"
    @close="close"
    ><el-form
      :model="tagdata"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      v-loading="saveloading"
    >
      <el-form-item label="名称" prop="name">
        <el-input
          v-model="tagdata.name"
          placeholder="请输入内容"
          clearable
        ></el-input>
      </el-form-item>

      <el-form-item label="目录" prop="pid">
        <el-select v-model="tagdata.pid" placeholder="请选择" style="width:100%">
          <el-option
            v-for="item in tagOptions"
            :key="'tag' + item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
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
      title: '添加书签',
      saveloading: false,
      isedit: false,
      dialogFormVisible: false,
      tagOptions: [],
      tagdata: {
        id: -1,
        name: '',
        pid: ''
      },
      rules: {
        name: [{ required: true, message: '请输入目录名', trigger: 'blur' }],
        pid: [{ required: true, message: '请选择目录', trigger: 'change' }]
      }
    }
  },

  created () {},
  mounted () {},
  methods: {
    /**
     * 显示界面
     */
    showAddTag (tag) {
      if (this.$refs.ruleForm) this.$refs.ruleForm.clearValidate()
      if (tag) {
        // this.bookmarkdata = JSON.parse(JSON.stringify(bookmarkitem))
        this.tagdata.id = tag.id
        this.tagdata.name = tag.name
        this.tagdata.pid = tag.pid
        this.title = '编辑目录'

        this.isedit = true
      } else {
        this.title = '添加目录'
        this.isedit = false
        //  this.fatherTagid = null
        // this.tagdata.id = ''
        this.tagdata.name = ''
        this.tagdata.pid = -1
      }
      this.getTags(-1)
      this.dialogFormVisible = true
    },

    close () {
      this.dialogFormVisible = false
      this.$emit('closemoule', false)
    },
    /**
     * 获取目录
     */
    getTags (pid) {
      api.GetTags(pid).then(re => {
        const roottag = {
          id: -1,
          name: '/',
          pid: -1
        }
        this.tagOptions = [roottag].concat(re)
      })
    },

    /**
     * 保存数据
     */
    save () {
      console.log(this.isedit)
      this.saveloading = true
      if (!this.isedit) {
        this.tagdata.id = ''
        // 新增
        api
          .InsertBookmarkTag(this.tagdata)
          .then(re => {
            this.saveloading = false
            this.dialogFormVisible = false
            this.$emit('closemoule', true, this.tagdata)
            this.$message({
              message: '新增目录成功',
              type: 'success'
            })
          })
          .catch(e => {
            console.log(e)
            this.saveloading = false
          })
      } else {
        api
          .UpdateTag(this.tagdata)
          .then(re => {
            this.saveloading = false
            this.dialogFormVisible = false
            this.$emit('closemoule', true, this.tagdata)
            this.$message({
              message: '修改目录成功',
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
    }
  }
}
</script>
<style scoped></style>
