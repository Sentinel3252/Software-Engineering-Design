<template>
    <main class="page lanidng-page">
        <section class="portfolio-block block-intro">
            <div class="container">
                <div class="d-lg-flex flex-row justify-content-lg-center align-items-lg-center"
                    style="margin-bottom: 27px;">
                    <div style="margin-top:200px"></div>
                    <input type="file" ref="fileRef" class="btn btn-outline-primary">
                    <button @click="handleUpload" class="btn btn-outline-primary">上传</button>
                </div>
                <img  id="originPicture" style="height: 500px;width: 500px;" src="../assets/img/avatars/origin.jpg"
                    width="133" height="100">
                <div class="d-lg-flex flex-row justify-content-lg-center align-items-lg-center about-me"
                    style="margin-top: 30px;margin-bottom: 30px;">
                    <input type="text" style="margin: 28px 0px 22px;margin-top: 0;padding-bottom: 1px;margin-bottom: 0;"
                        placeholder="请输入置信度" v-model="accuracy">
                    <button class="btn btn-primary" type="button">确认</button>
                </div>
            </div>
            <div class="container d-lg-flex flex-row justify-content-lg-center align-items-lg-center">
                <div class="row" style="width: 629px;">
                    <div class="col-md-6">
                        <button class="btn btn-primary" type="button" @click="handleImgProcess">图像识别</button>
                    </div>
                    <div class="col-md-6">
                        <button class="btn btn-primary" type="button" @click="handleImgProcess">图像分割</button>
                    </div>
                </div>
            </div>
            <div class="d-flex justify-content-center align-items-center content"></div>
        </section>

        <div style="display:flex;flex-direction:row; box-shadow: 0px -1px 5px 0px var(--bs-secondary-color);align-items: center; justify-content: center;">
            <section v-if="!selectedType" class="d-lg-flex flex-column justify-content-lg-center align-items-lg-center portfolio-block photography" style="margin-right:20px;">
                <p class="d-lg-flex justify-content-lg-center align-items-lg-center" style="font-size: 20px;margin-top: 25px;margin-bottom: 24px;">处理结果</p>
                <div>
                    <img id="identifyResult" style="width: 500px;height: 500px;" src="../assets/img/avatars/result.jpg">
                </div>
                <button class="btn btn-primary" type="button" style="margin-top: 36px;padding-bottom: 10px;margin-bottom: 22px;">原图</button>
            </section>

            <section v-if="selectedType" class="d-lg-flex flex-column justify-content-lg-center align-items-lg-center portfolio-block photography" style="margin-right:20px;">
                <input v-model="rateFlitered" type="text" placeholder="输入置信度" />
                <button @click="handleFilter">筛选</button>

                <!-- 第二行：不确定的行和列 -->
                <div v-for="module in segmentationResultArray_Filtered" :key="module.name" class="module">
                    <img :src="module.url" alt="图片" />
                    <p>置信度: {{ module.confidence }}</p>
                    <button @click="downloadImage(module.url)">下载</button>
                </div>
            </section>
        </div>
        <div class="d-flex justify-content-lg-center align-items-lg-center">
            <label>你对本次识别结果是否满意：</label>
            <input type="radio" id="satisfied" name="satisfaction" value="1" v-model="satisfaction" />
            <label for="satisfied">满意</label>
            <input type="radio" id="unsatisfied" name="satisfaction" value="0" v-model="satisfaction" />
            <label for="unsatisfied">不满意</label>
        </div>

    </main>
    <footer class="page-footer py-3 border-top">
        <div class="container my-4">
            <div class="links">
                <a href="#">项目说明</a>
                <!-- <router-link to="/contact-us"></router-link> -->
                <a href="#">联系开发人员</a>
                <a href="#"></a>
            </div>
            <div class="social-icons">
                <a class="me-3" href="#">
                    <i class="far fa-star"></i>
                </a>
                <a class="me-3" href="#">
                    <i class="far fa-star"></i>
                </a>
                <a class="me-3" href="#">
                    <i class="far fa-star"></i>
                </a>
            </div>
        </div>
    </footer>
</template>

<script setup>
import { reactive, ref, watch } from 'vue';
import axios from 'axios';


const fileRef = ref();

// 获取上传签名
const getOssData = async () => {
    // 这是上面 Nest 服务端生成签名信息的接口地址
    const res = await axios.get('http://8.130.77.190:8090/oss/policy');
    // console.log(res);
    return res.data;
}

var dealedFileName;
// 生成文件名，作为 key 使用
const generateFileName = (ossData, file) => {
    dealedFileName = randomString() +"."+file.name.substr(file.name.lastIndexOf('.') + 1)
    const suffix = dealedFileName.slice(dealedFileName.lastIndexOf('.'));
    const filename = Date.now() + suffix;
    return ossData.data.dir + filename;
}
var aliFileName;
// 使用 OSS 上传图片
const handleUpload = async () => {
    var img = document.getElementById("originPicture");
    img.src = URL.createObjectURL(fileRef.value.files[0]);

    const file = fileRef.value.files[0];

    const ossData = await getOssData();

    const key = generateFileName(ossData, file);

    // const key = aliFileName;
    aliFileName = key;
    // const fileName = fileRef.value.files[0].name;
    // aliFileName = randomString() +"."+fileName.substr(fileName.lastIndexOf('.') + 1)
    console.log(aliFileName)

    const formdata = new FormData();

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
    if (res.status === 200) {
        alert('文件上传成功')
    }
}


const accuracy = ref(0.5);

const aliUrl = "https://se-project-tongji.oss-cn-shanghai.aliyuncs.com/";
const baseUrl= "http://8.130.77.190:8090";

var selectedType = ref(false);
const handleImgProcess = (event) => {
  const button = event.target || event.srcElement;
  const action = button.textContent || button.innerText;

  if (action === '图像识别') {
    // 调用图像识别的函数并传递参数
    imageRecognitionFunction();
    selectedType.value = false;
  } else if (action === '图像分割') {
    // 调用图像分割的函数并传递参数
    imageSegmentationFunction();
    selectedType.value = true;
  }
}

var identifyResultName;
var identifyResultUrl = "";

var processTime;
function imageRecognitionFunction() {
    // 处理图像识别的逻辑
    const indentifyUrl = baseUrl+ "/picture/seg";
    const fileName = fileRef.value.files[0].name;
    const fileExtension = fileName.substr(fileName.lastIndexOf('.') + 1);
    // console.log(localStorage.getItem("userPhone"))
    // console.log(fileExtension)
    // console.log(accuracy.value)
    // console.log(aliFileName)
    // "picturename":aliFileName+"."+fileExtension,
    axios.post(indentifyUrl, {
        "phone": localStorage.getItem("userPhone"),
        "picturename":aliFileName,
        "types":1,
        "accuracy": accuracy.value
    })
    .then(response=>{
        const data=response.data;
        if(data.status==200){
            identifyResultName = data.data.data;
            identifyResultUrl = aliUrl + identifyResultName;
            const img = document.getElementById("identifyResult");
            img.src = identifyResultUrl;

            var history = data.data.history;
            //数据库建表的时候，将上传时间作为主键，所以后面满意度提交的时候也需要用到
            let formattedDateTime = history.data.uploadtime;
                 
            // 将T替换为空格
            formattedDateTime = formattedDateTime.replace("T", " ");
            let dateTimeWithoutMillis = formattedDateTime.split(".")[0];
            // console.log(dateTimeWithoutMillis)
            processTime = dateTimeWithoutMillis
        }else{
            console.log("图像识别失败");
        }
    })
    .catch(error=>{
        console.error('请求出错', error);
    })
}

var segmentationResultName;

var segmentationResultArray = new Array();
var segmentationResultArray_Filtered = reactive([]);

let upLoadFileName = "";
function imageSegmentationFunction() {
    // 处理图像分割的逻辑
    const segmentationUrl = baseUrl+ "/picture/seg";
    const fileName = fileRef.value.files[0].name;
    const fileExtension = fileName.substr(fileName.lastIndexOf('.') + 1);
    upLoadFileName = randomString()+"."+fileExtension;
    axios.post(segmentationUrl, {
        "phone": localStorage.getItem("userPhone"),
        "picturename": aliFileName,
        "types":2,
        "accuracy": accuracy.value
    })
    .then(response=>{
        const data = response.data;
        if(data.status==200){
            segmentationResultArray = [];
            segmentationResultName = data.data.data;
            // console.log(data)
            // console.log(segmentationResultName)
            for(var i=0;i<segmentationResultName.length;i++){
                var segmentationResult ={
                    "name":'',
                    "url":'',
                    "confidence":'',
                };
                segmentationResult.name = dealSegmentResult(segmentationResultName[i]).itemName;
                segmentationResult.confidence = dealSegmentResult(segmentationResultName[i]).confidence;
                segmentationResult.url = aliUrl + segmentationResultName[i];
                segmentationResultArray.push(segmentationResult);
                var history = data.data.history;
                //数据库建表的时候，将上传时间作为主键，所以后面满意度提交的时候也需要用到
                let formattedDateTime = history.data.uploadtime;
                 
                // 将T替换为空格
                formattedDateTime = formattedDateTime.replace("T", " ");
                let dateTimeWithoutMillis = formattedDateTime.split(".")[0];
                // console.log(dateTimeWithoutMillis)
                processTime = dateTimeWithoutMillis
            }
            handleFilter();
            console.log("图像分割成功")
            // console.log(segmentationResultArray);
        }else{
            console.log("图像分割失败");
        }
    })
    .catch(error=>{
        console.error('请求出错', error);
    })
}

var rateFlitered = ref(null);
function handleFilter() {
    if(rateFlitered==null){
        segmentationResultArray_Filtered = segmentationResultArray;
        console.log("置信度为空");
        return;
    }
    console.log("置信度为"+rateFlitered.value);
    segmentationResultArray_Filtered.splice(0,segmentationResultArray_Filtered.length);
    for(var i=0;i<segmentationResultArray.length;i++){
        // console.log(segmentationResultArray[i].confidence);
        // console.log(rateFlitered.value);
        if(segmentationResultArray[i].confidence>=rateFlitered.value){
            // segmentationResultArray_Filtered.push(segmentationResultArray[i]);
            segmentationResultArray_Filtered.splice(0,0,segmentationResultArray[i]);
            // console.log("push:"+segmentationResultArray[i].confidence)
        }
    }
}

function dealSegmentResult(result) {
    const pattern = /(\d{4}-\d{2}-\d{2})\d+\.(?:png|jpg)-.*?(\w+)\s(\d+\.\d+)\.(?:jpg|png)/;
  const match = result.match(pattern);
  
  if (match) {
    const itemName = match[2]; // 物品名
    const confidence = match[3]; // 置信度
    return { itemName, confidence };
  } else {
    // 如果匹配不成功，可以进行错误处理
    return { itemName: "N/A", confidence: "N/A" };
  }
}

// const resultString = "ARVAssTSFa.jpg.glass 0.79.jpg";
// const resultInfo = dealSegmentResult(resultString);
// console.log(resultInfo.itemName);
// console.log(resultInfo.confidence);

const letters = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M','N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
let history = [];
function randomString() {
    let randomStr = '';
    for (let i = 0; i < 10; i++) {
        randomStr += letters[Math.floor(Math.random() * letters.length)];
    }
    
    if (!history.includes(randomStr)) {
        history.push(randomStr); //将新生成的字符串添加到历史记录中
        return randomStr;
    } else {
        //如果生成的随机字符串已存在于历史记录中，则递归调用该函数重新生成
        return randomString();
    }
}

const downloadImage = (url) =>{
    const link = document.createElement('a');
    link.href = url;
    link.download = 'image.jpg'; // 下载文件的名称
    link.click();
}


const satisfaction = ref(null);
watch(satisfaction, (newValue) => {
    if(aliFileName==""){
        alert("请先进行图像分割");
        return;
    }
    // console.log(processTime)
    // console.log(aliFileName)
    // console.log(localStorage.getItem("userPhone"))
    // console.log(newValue)
    axios.post(baseUrl + "/user/changeMark", {
        "timeStr": processTime,
        "picturename": aliFileName,
        "phone": localStorage.getItem("userPhone"),
        "satisfaction": newValue
    })
    .then(response=>{
        const data=response.data;
        // console.log(response)
        if(data.status==200){
            console.log("满意度提交成功");
        }else{
            console.log("满意度提交失败");
        }
    })
    .catch(error=>{
        console.error('请求出错', error);
    })
})

</script>