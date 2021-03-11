<template>
  <el-dropdown size="small" class="d2-mr">
    <span class="btn-text">{{info.name ? `你好 ${info.name}` : '未登录'}}</span>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item @click.native="modifypwd">
        <d2-icon name="power-off" class="d2-mr-5"/>
        修改密码
      </el-dropdown-item>
       <el-dropdown-item @click.native="logOff">
        <d2-icon name="power-off" class="d2-mr-5"/>
        注销
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import api from '@/api'
export default {
  computed: {
    ...mapState('d2admin/user', [
      'info'
    ])
  },
  methods: {
    ...mapActions('d2admin/account', [
      'logout'
    ]),
    /**
     * @description 登出
     */
    logOff () {
      this.logout({
        confirm: true
      })
    },
    modifypwd () {
      this.$prompt('请输入新密码', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        const str = (value + '').trim()
        if (value === null || str === '') {
          return
        }
        api.ModifyPwd(value).then(re => {
          if (re) {
            this.$message({
              type: 'success',
              message: '修改成功 '
            })
          } else {
            this.$message({
              type: 'warning',
              message: '修改失败 '
            })
          }
        })
      })
    }
  }
}
</script>
