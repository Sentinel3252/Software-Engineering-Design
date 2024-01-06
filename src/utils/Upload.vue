<template>
    <div style="margin-top:200px"></div>
    <input type="file" ref="fileRef"  class ="btn btn-outline-primary">
    <button @click="handleUpload"  class ="btn btn-outline-primary">{{ text }}</button>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios'

const fileRef = ref()

// 获取上传签名
const getOssData = async () => {
  // 这是上面 Nest 服务端生成签名信息的接口地址
  const res = await axios.get('http://8.130.77.190:8080/oss/policy')
  // console.log(res)
  return res.data
}

// 生成文件名，作为 key 使用
const generateFileName = (ossData, file) => {
  const suffix = file.name.slice(file.name.lastIndexOf('.'));
  const filename = Date.now() + suffix;
  return ossData.data.dir + filename;
}

// 使用 OSS 上传图片
const handleUpload = async () => {
  const file = fileRef.value.files[0]

  const ossData = await getOssData()

  const key = generateFileName(ossData, file)

  const formdata = new FormData()

  // 注意参数的顺序，key 必须是第一位，表示OSS存储文件的路径
  formdata.append('key', key)
  formdata.append('OSSAccessKeyId', ossData.data.accessid)
  const decodedPolicy = ossData.data.policy;
  // const decodedPolicy = atob(ossData.data.policy);
  // console.log(decodedPolicy)
  // 将解码后的 policy 添加到 formdata 中
  formdata.append('policy', decodedPolicy);
  formdata.append('signature', ossData.data.signature)

  // 文件上传成功默认返回 204 状态码，可根据需要修改为 200
  formdata.append('success_action_status', '200')
  // file 必须放在最后一位
  formdata.append('file', file)


  const res = await axios.post(ossData.data.host, formdata);
  if(res.status === 200) {
    alert('文件上传成功')
  }
}
</script>

<script>
export default {
  name: 'Upload',
  props: {
    text: {
      type: String,
      default: '上传'
    }
  },
}
</script>