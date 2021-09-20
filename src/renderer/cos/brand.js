/**
 * urlUpload                    通过url直接上传文件
 *
 * customDomain                 有些云没有获取域名的接口,就只能手动填写域名
 * --qiniu                      授权账号获取域名为空,需要手动拼写 https://github.com/willnewii/qiniuClient/issues/11
 * --upyun                      有api,但node-sdk未实现
 *
 * imageStyle                   图片样式处理
 * --tencent                    (未处理)https://cloud.tencent.com/document/product/436/44879
 *
 * manualPrivateBucket          手动设置私有存储桶.七牛未提供api获取存储桶状态.aws&jd&minio 类似,看不懂~
 *
 * paging                       分页
 */

export default {
  // qiniu: {
  //   key: 'qiniu',
  //   name: '七牛云',
  //   features: ['urlUpload', 'customDomain', 'imageStyle', 'manualPrivateBucket', 'paging', 'refreshCDN']
  // },
  // tencent: {
  //   key: 'tencent',
  //   name: '腾讯云',
  //   features: ['urlUpload', 'paging']
  // },
  // qingstor: {
  //   key: 'qingstor',
  //   name: '青云',
  //   features: ['urlUpload', 'paging']
  // },
  // aliyun: {
  //   key: 'aliyun',
  //   name: '阿里云',
  //   features: ['paging']
  // },
  // upyun: {
  //   key: 'upyun',
  //   name: '又拍云',
  //   features: ['customDomain']
  // },
  // aws: {
  //   key: 'aws',
  //   name: '亚马逊S3',
  //   features: ['paging', 'manualPrivateBucket']
  // },
  // jd: {
  //   key: 'jd',
  //   name: '京东云',
  //   features: ['paging', 'manualPrivateBucket']
  // },

  // ks3: {
  //   key: 'ks3',
  //   name: '金山云',
  //   features: ['paging']
  // },
  // minio: {
  //   key: 'minio',
  //   name: 'MinIO',
  //   features: ['paging', 'manualPrivateBucket']
  // },
  xiang: {
    key: 'xiang',
    name: '象传智慧',
    features: ['manualPrivateBucket']
  }
}
