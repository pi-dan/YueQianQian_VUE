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
   * @description 获取目录
   * @param {Object} id 父id
   */
  GetTags (id = -1) {
    return request({
      url: '/Tag/Tags',
      method: 'get',
      params: { pid: id }
    })
  },
  GetBookmarks (data) {
    return request({
      url: '/Bookmark/GetBookmarks',
      method: 'post',
      data
    })
  },
  BookmarkClick (id) {
    return request({
      url: '/Bookmark/BookmarkClick',
      method: 'post',
      params: { id: id }
    })
  },
  BookmarkTitle (url) {
    return request({
      url: '/Bookmark/GetWebTitle',
      method: 'post',
      data: `"${url}"`
    })
  },
  InsertBookmark (data) {
    return request({
      url: '/Bookmark/InsertBookmark',
      method: 'post',
      data
    })
  },
  UpdateBookmark (data) {
    return request({
      url: '/Bookmark/UpdateBookmark',
      method: 'post',
      data
    })
  },
  /**
   * 删除书签
   * @param {} url
   */
  DeleteBookmark (id) {
    return request({
      url: '/Bookmark/DeleteBookmark',
      method: 'post',
      data: `"${id}"`
    })
  },
  /**
   * 根据书签id查询书签的目录
   * @param {*} id
   */
  GetTagFromBookmarkid (id = -1) {
    return request({
      url: '/Bookmark/GetTagFromBookmarkid',
      method: 'get',
      params: { id: id }
    })
  },
  /**
   * 搜索书签
   * @param {} data
   */
  SearchBookmark (searchText) {
    console.log(searchText)
    return request({
      url: '/Bookmark/SearchBookmark',
      method: 'post',
      data: `'${searchText}'`
    })
  }
})
