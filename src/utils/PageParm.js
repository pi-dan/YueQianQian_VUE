/**
 * 创建分页参数
 * @param {*} pageIndex  第几页  从1开始
 * @param {*} pageSize  每页大小
 * @param {*} orderBy  排序字段
 * @param {*} ascending   是否升序
 */
export function CreatePageParm (pageIndex, pageSize = 20, orderBy = '', ascending = true) {
  return {
    pageIndex: pageIndex,
    pageSize: pageSize,
    orderBy: orderBy,
    ascending: ascending
  }
}
