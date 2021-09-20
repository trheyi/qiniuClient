const AWS = require('aws-sdk')
import AWSBucket from './awsBucket'
import aws from './aws'

let s3

function init(param) {
  let options = { apiVersion: '2006-03-01' }

  AWS.config = new AWS.Config({
    accessKeyId: param.access_key,
    secretAccessKey: param.secret_key,
    region: param.region,
    endpoint: `https://s3.iqka.com`,
    s3ForcePathStyle: true,
    signatureVersion: 'v4'
  })

  console.log('AWS.config', AWS.config)
  s3 = new AWS.S3(options)
}

function getBuckets(callback) {
  aws._getBuckets(s3, callback)
}

function generateBucket(name) {
  console.log('generateBucket:', name)
  return new AWSBucket(name, s3)
}

export default { init, getBuckets, generateBucket }
