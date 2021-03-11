// import { find, assign } from 'lodash'

// const users = [
//   { username: 'admin', password: 'admin', uuid: 'admin-uuid', name: 'Admin' },
//   { username: 'editor', password: 'editor', uuid: 'editor-uuid', name: 'Editor' },
//   { username: 'user1', password: 'user1', uuid: 'user1-uuid', name: 'User1' }
// ]

export default ({ service, request, faker, tools }) => ({
  /**
   * @description 登录
   * @param {Object} data 登录携带的信息
   */
  SYS_USER_LOGIN (data = {}) {
    // 模拟数据
    // mock
    //   .onAny('/login')
    //   .reply(config => {
    //     const user = find(users, tools.parse(config.data))
    //     return user
    //       ? tools.responseSuccess(assign({}, user, { token: faker.random.uuid() }))
    //       : tools.responseError({}, '账号或密码不正确')
    //   })
    // 接口请求

    return request({
      url: '/User/Login',
      method: 'post',
      data
    })
  },
  /**
   * 修改密码
   * @param {} data
   */
  ModifyPwd (newpwd) {
    return request({
      url: '/User/ModifyPwd',
      method: 'post',
      data: `'${newpwd}'`
    })
  }
})
