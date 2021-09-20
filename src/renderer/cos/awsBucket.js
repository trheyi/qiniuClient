import { util } from '../service/index'
import baseBucket from './baseBucket'
import brand from './brand'

const fs = require('fs')

class Bucket extends baseBucket {
  constructor(name, cos) {
    super(name, cos, 'aws')
  }

  /**
   * 获取bucket访问权限
   * 获取资源
   * @param vm => page
   */
  bindPage(vm) {
    this.vm = vm
    this.paging = this.vm.paging

    this.getACL()
    // this.getDomains();
  }

  /**
   * 获取Bucket访问权限状态
   * https://docs.aws.amazon.com/AmazonS3/latest/API/API_GetBucketAcl.html
   * https://docs.aws.amazon.com/AmazonS3/latest/API/API_Grant.html
   */
  getACL() {
    this.getLocalPermission()
    this.getResources()

    // BucketAcl 策略看不懂😂...
    /*this.cos.getBucketAcl({Bucket: this.name}, (err, data) => {
            console.log(err, data);
            if (err) {
                console.log("Error", err);
            } else if (data) {
                console.log("Success", data.Grants);
                this.setPermission('FULL_CONTROL' === data.Grants[0].Permission ? 0 : 1);
                this.getResources();

                // 获取策略
                /!*this.cos.getBucketPolicy({Bucket: this.name}, (err, data) => {
                    console.log(err, JSON.parse(data.Policy));
                });*!/
            }
        });*/
  }

  createFile(_param, type, callback) {
    let params = {
      Bucket: this.name,
      Key: _param.key,
      Body: fs.createReadStream(_param.path),
      ContentLength: fs.statSync(_param.path).size
    }
    this.cos
      .upload(params, function(err, data) {
        callback(err, { key: _param.key })
      })
      .on('httpUploadProgress', progress => {
        console.log(progress)
        _param.progressCallback(parseInt((progress.loaded / progress.total) * 100))
      })
  }

  async removeFile(items, callback) {
    let params = {
      Bucket: this.name,
      Delete: {
        Objects: []
      }
    }
    for (let file of items) {
      params.Delete.Objects.push({ Key: file.key })
    }
    await this.cos.deleteObjects(params).promise()
    callback && callback()
  }

  async renameFile(items, callback) {
    for (let file of items) {
      await this.cos
        .copyObject({
          CopySource: encodeURIComponent('/' + this.name + '/' + file.key), //bucket name + key
          Bucket: this.name,
          Key: file._key
        })
        .promise()
      await this.cos
        .deleteObject({
          Bucket: this.name,
          Key: file.key
        })
        .promise()
    }
    callback && callback()
  }

  async getResources(option = {}) {
    await super.preResources()
    //delimiter
    let params = {
      Bucket: this.name
    }

    this._handleParams(params, option, {
      prefix: 'Prefix',
      delimiter: 'Delimiter',
      marker: 'ContinuationToken',
      limit: 'MaxKeys'
    })

    this.cos
      .listObjectsV2(params)
      .promise()
      .then(data => {
        let files = []
        data.Contents.forEach(item => {
          if (parseInt(item.Size) !== 0) {
            console.log('getResources item:', item)
            try {
              files.push(util.convertMeta(item, 'aws'))
            } catch (e) {
              console.log('getResources Item Error:', e)
            }
          }
        })

        data.CommonPrefixes &&
          data.CommonPrefixes.forEach(item => {
            files.push(this._getFolder(item.Prefix))
          })

        this.postResources(
          {
            items: files,
            marker: data.NextContinuationToken
          },
          option
        )
      })
      .catch(e => {
        console.error(e)
      })
  }

  /**
   * 返回资源真实链接
   * @param index
   * @param key
   * @param deadline  私有模式,文件有效期
   * @returns {*}
   */
  generateUrl(key, deadline) {
    let params = { Bucket: this.name, Key: key, Expires: deadline }
    let url = `${this.cos.endpoint.href}${this.name}/${key}`

    if (this.permission === 1) {
      url = this.cos.getSignedUrl('getObject', params)
    }

    return super.generateUrl(url)
  }
}

export default Bucket
