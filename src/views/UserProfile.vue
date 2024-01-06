<template>
    <main class="page">
        <section class="portfolio-block">
            <div class="container" style="display:flex; flex-direction:column ;justify-content:center; align-items: center;">
                
                <div class="heading">
                    <h2>个人信息</h2>
                </div>
                <div class="border rounded border-0 shadow-lg p-3 p-md-5" style="width: 50%;">
                    
                    <div class="mb-3">
                        <label class="form-label" for="subject" >昵称</label>
                        <input class="form-control" type="text" id="name" v-model="name">
                    </div>
                    <div class="mb-3">
                        <label class="form-label" for="email">联系电话</label>
                        <input class="form-control" type="email" id="email" v-model="phone">
                    </div>
                   
                   
                    <div class="mb-3"></div>
                    <div class="mb-3">
                        <div class="row d-lg-flex flex-column justify-content-lg-center align-items-lg-center">
                            <div class="col-md-6 d-lg-flex justify-content-lg-center align-items-lg-center" style="margin-bottom:20px;">
                                <button 
                                    id="changeInfoButton"  
                                    class="btn btn-primary  flex-fill justify-content-lg-center align-items-lg-center"
                                    style="font-size: 16px;font-weight: bold; color:aliceblue" 
                                    @click="changeInfo">
                                    修改信息
                                </button>
                                <div id="ChangeInfoEnsureButtons" style="display:none; font-size: 16px;font-weight: bold;">
                                    <button 
                                        class="btn btn-primary  flex-fill justify-content-lg-center align-items-lg-center"
                                        style="font-size: 16px;font-weight: bold; color:aliceblue" 
                                        @click="changeEnsure">
                                    确认</button>
                                    <button 
                                        class="btn btn-primary  flex-fill justify-content-lg-center align-items-lg-center"
                                        style="font-size: 16px;font-weight: bold; color:aliceblue" 
                                        @click="changeCancel">
                                    取消</button>
                                </div>
                            </div>

                            <div class="col-md-6 d-lg-flex justify-content-lg-center align-items-lg-center">
                                <button
                                    class="btn btn-primary d-lg-flex flex-fill justify-content-lg-center align-items-lg-center"
                                    type="button">
                                    <router-link to="/login" @click ="logout" class="btn-outline-primary" style="font-size: 16px;font-weight: bold; color:aliceblue">
                                            退出登录</router-link>
                                </button>                           
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>
        </section>
        <section class="portfolio-block" style="display:flex; flex-direction:column;">
            <div class="heading">
                <h2>历史记录</h2>
                <div v-for="history in historyList" :key="history.picture" @click="clickHistory(history.picture,history.time)">
                    <img :src="aliUrl+history.picture" style="width: 100px;height: 100px;">
                    <p>{{history.type}}</p>
                    <p>{{history.time}}</p>
                </div>
            </div>
            <div style="display:flex; flex-direction:row;justify-content:center; align-items: center;">
                <div style="margin-right : 50px">
                    <img id="originPicture" style="width:200px; height:200px;">
                    <p id="dealTime"></p>
                    <p id="dealType"></p>
                    <p id="dealConfidence"></p>
                    <p id="dealSatiafaction"></p>
                </div>
                <div style="display:flex;flex-direction:column;">
                    <h2>处理结果</h2>

                    <div v-for="result in resultPictures"  style="display:flex; flex-direction:row; justify-content: center;align-items: center;">
                        <!-- <h1>{{ result }}</h1> -->
                        <img :src="aliUrl+result" style="width: 100px;height: 100px;" alt="暂无图片信息">
                    </div>
                </div>
            </div>
        </section>
    </main>
    <footer class="page-footer py-3 border-top">
        <div class="container my-4">
            <div class="links">
                <a href="#">项目说明</a>
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
import axios from 'axios';
import {reactive, ref, toRef} from 'vue';
const baseUrl="http://8.130.77.190:8090";



const name= ref(localStorage.getItem("userName"));
const phone = ref(localStorage.getItem("userPhone"));

const changeInfo = () =>{
    var changeInfoButton = document.getElementById("changeInfoButton");
    var changeInfoEnsureButtons = document.getElementById("ChangeInfoEnsureButtons");
    changeInfoButton.style.display = "none";
    changeInfoEnsureButtons.style.display = "flex";
}
const changeEnsure = () =>{
    // console.log(localStorage.getItem("userId"))
    // console.log(name.value);
    // console.log(phone.value);
    axios.post(baseUrl+'/user/changeInfo',{
        "userId":localStorage.getItem("userId"),
        "name":name.value,
        "phone":phone.value,
    }).then(response=>{
        if(response.status==200){
            alert("修改成功");
            const nameInput = document.getElementById("name");
            const phoneInput = document.getElementById("email");
            nameInput.value = name.value;
            phoneInput.value = phone.value;
        }else{
            alert("修改失败");
        }
        const changeInfoButton = document.getElementById("changeInfoButton");
        const changeInfoEnsureButtons = document.getElementById("ChangeInfoEnsureButtons");
        changeInfoButton.style.display = "block";
        changeInfoEnsureButtons.style.display = "none";
    })
}

const changeCancel = () =>{
    const changeInfoButton = document.getElementById("changeInfoButton");
    const changeInfoEnsureButtons = document.getElementById("ChangeInfoEnsureButtons");
    changeInfoButton.style.display = "block";
    changeInfoEnsureButtons.style.display = "none";
}

const aliUrl = "https://se-project-tongji.oss-cn-shanghai.aliyuncs.com/";
var historyList= reactive([]);

//先展示出历史信息，然后根据点击某一历史信息获取图片
const getHistory = () =>{
    
    axios.get(baseUrl+'/findHistory',{
        params:{
            "phone":phone.value
        }
    }).then(response=>{
        if(response.status==200){
            console.log("getHistory success")
            var data = response.data.data;
            // console.log(data)
            for(var i = 0;i <data.length;i++){
                var historyData ={
                    picture:'',
                    time:'',
                    type:''
                }
                historyData.picture = data[i].picturename;
                historyData.time = data[i].uploadtime.replace("T", " ");               
                if(data[i].types == 1){
                    historyData.type='图片识别'
                }else if(data[i].types == 2){
                    historyData.type='图片分割'
                }else{
                    historyData.type='玻璃胶识别'
                }
                historyList.push(historyData);
            }
            // console.log(historyList)
        }else{
            alert("获取历史记录失败");
        }
    })
}
getHistory();

let resultPictures = reactive([]);
const clickHistory = (picture,time) =>{
    // console.log(picture);
    // console.log(time);
    axios.get(baseUrl + '/findOneHistory',{
        params:{
            "uploadTime":time,
            "picturename":picture
        }
    })
    .then(response=>{
        if(response.status==200){
            resultPictures.splice(0,resultPictures.length);
            var data = response.data.data;
            // console.log(data);
            var originPicture = document.getElementById("originPicture");
            originPicture.src = aliUrl + data.originPicture;
            var dealTime = document.getElementById("dealTime");
            dealTime.innerHTML = "处理时间"+data.uploadTime.replace("T", " ");
            var dealType = document.getElementById("dealType");
            if(data.types == 1){
                dealType.innerHTML = "处理类型:图片识别";
            }else if(data.types == 2){
                dealType.innerHTML = "处理类型:图片分割";
            }else{
                dealType.innerHTML = "处理类型:玻璃胶识别";
            }
            // var dealConfidence = document.getElementById("dealConfidence");
            // dealConfidence.innerHTML = data.confidence;
            var satisfaction = document.getElementById("dealSatiafaction");
            if(data.satisfaction == 1){
                satisfaction.innerHTML = "是否满意:满意";
            }else{
                satisfaction.innerHTML = "是否满意:不满意";
            }
            // resultPictures = data.picture;
            for(var i = 0;i < data.picture.length;i++){
                resultPictures.splice(0, 0, data.picture[i]);
            }
            // resultPictures.splice(0, 0, data.picture);           
            console.log(resultPictures);
        }else{
            alert("获取历史记录失败");
        }
    })
}

const logout = () =>{
    localStorage.removeItem("userPhone");
    localStorage.removeItem("userType");
    localStorage.removeItem("userName");
    localStorage.removeItem("userId");
}
</script>