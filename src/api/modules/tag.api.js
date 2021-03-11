// 目前有两种方式可以通过get请求：
// 第一种：

// import request from '@/plugin/axios'
// export function get(params = {}) {
//   return request({
//     url: '/get',
//     method: 'get',
//     params
//   })
// }
// 第二种（因为这个项目是默认采用json方式发送数据，但是如果后端是通过字段接受需要使用qs来转换一下）：

// import request from '@/plugin/axios'
// import qs from 'qs'

// export function get(data) {
//   console.log(data)
//   return request({
//     url: '/get',
//     method: 'get',
//     transformRequest: [function (data) {
//       return qs.stringify(data)
//     }],
//     data: data
//   })
// }
// 请注意，如果在前端控制台发现数据是成功发送的但是后端接受数据为空的话，请务必修改data为data={}
export default ({ service, request, faker, tools }) => ({
  /**
   * @description 新增书签目录
   */
  InsertBookmarkTag (data) {
    console.log(data)
    return request({
      url: '/Tag/InsertBookmarkTag',
      method: 'post',
      data
    })
  },
  /**
   * @description 新增笔记目录
   * @param {Object} id 父id
   */
  InsertNoteTag (data) {
    return request({
      url: '/Tag/InsertNoteTag',
      method: 'post',
      data
    })
  },
  /**
   * @description 修改目录
   */
  UpdateTag (data) {
    return request({
      url: '/Tag/UpdateTag',
      method: 'post',
      data
    })
  },
  /**
   * @description 删除目录
   */
  DeleteTag (id) {
    return request({
      url: '/Tag/DeleteTag',
      method: 'post',
      data: `"${id}"`
    })
  }
})
