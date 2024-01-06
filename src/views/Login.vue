<template>
    <main class="page hire-me-page">
        <section class="portfolio-block hire-me" style="padding: 50px 0px;">
            <div class="container">
                <div class="heading"></div>
                <form class="border rounded border-0 shadow-lg p-3 p-md-5" data-bs-theme="light">
                    <p class="d-lg-flex justify-content-lg-center align-items-lg-center"
                        style="font-weight: bold;font-size: 35px;">登录</p>
                    <div class="mb-3"><label class="form-label" for="email">联系电话</label>
                        <input class="form-control" v-model="phone">
                    </div>
                    <div class="mb-3"><label class="form-label" for="message">密码</label>
                        <input class="form-control" type="password" v-model="pwd">
                    </div>
                    <div class="mb-3">
                        <label style="margin-right:20px; margin-bottom: 20px;">
                            <input type="checkbox" name="identity" value="admin" v-model="ifAdmin">
                            管理员身份
                        </label>

                        <div class="row d-lg-flex justify-content-lg-center">
                            <div class="col-md-6 d-lg-flex justify-content-lg-center align-items-lg-center"><button
                                    class="btn btn-primary flex-fill" type="button" style="font-size: 17px;" @click="login">确认</button>
                            </div>
                            <div class="col d-lg-flex">
                                <button class="btn btn-primary flex-fill" type="button">
                                        <router-link to="/register" class="d-lg-flex flex-grow-1 justify-content-lg-center align-items-lg-center" style="color: rgb(255,255,255);font-size: 16px;font-weight: bold;">
                                            没有账号，我要注册</router-link>
                                </button>
                            </div>
                        </div>
                    </div>
                    <small class="form-text">
                        <router-link to="/help">忘记密码</router-link>
                    </small>
                </form>
            </div>
        </section>
    </main>
    <footer class="page-footer py-3 border-top">
        <div class="container my-4">
            <div class="links"><a href="#">项目说明</a><a href="#">联系开发人员</a><a href="#"></a></div>
            <div class="social-icons"><a class="me-3" href="#"><i class="far fa-star"></i></a><a class="me-3"
                    href="#"><i class="far fa-star"></i></a><a class="me-3" href="#"><i class="far fa-star"></i></a>
            </div>
        </div>
    </footer>
    <!-- <img src="https://se-project-tongji.oss-cn-shanghai.aliyuncs.com/533cd42e-3265-4784-8340-f1ba4c4464b3.jpg"> -->
</template>

<script setup>
import axios from 'axios';
import bcrypt from 'bcryptjs';
import { watch } from 'vue';
import { ref } from 'vue';
import router from '@/router/router.js'
const phone = ref('');
const pwd = ref('');
const ifAdmin = ref(false);
var type = ref(0);

watch(ifAdmin, newVal => {
    if(newVal){
        console.log("管理员身份");
        type.value = 1;
    }else{
        console.log("普通用户");
        type.value = 0;
    }
});

const baseUrl="http://8.130.77.190:8090";



const login = async () => {
    const hashedPassword = await bcrypt.hash(pwd.value, 10);
    if(type.value == 0){
        
        axios.post(baseUrl+'/user/login',{
            "phone":phone.value,
            "types":type.value //TODO 0为普通用户，1为管理员
        })
        .then(response => {
            // console.log(response);
            const data = response.data;
            const status = data.status;
            const resultPwd = data.data.pwd;
            if (status === 200) {
                if(bcrypt.compare(pwd.value, resultPwd)){
                    console.log('登录成功');
                    localStorage.setItem("userPhone",phone.value)
                    localStorage.setItem("userType",type.value)
                    localStorage.setItem("userName",data.data.name)
                    localStorage.setItem("userId",data.data.userid)
                    router.push('/image-processing');
                }
            } else {
                console.log('登录出错');
                // console.log(data);
            }
        })
        .catch(error => {
            console.error('请求出错', error);
        });
    }else{
        axios.post(baseUrl+'/admin/login',{
            "phone":phone.value,
            "types":type.value //TODO 0为普通用户，1为管理员
        })
        .then(response => {
           
            const data = response.data;
            const status = data.status;
            const resultPwd = data.data.pwd;
            if (status === 200) {
                if(bcrypt.compare(pwd.value, resultPwd)){
                    console.log('登录成功');
                    localStorage.setItem("userPhone",phone.value)
                    localStorage.setItem("userType",type.value)
                    localStorage.setItem("userName",data.data.name)
                    localStorage.setItem("userId",data.data.userid)
                    router.push('/image-processing');
                }
            } else {
                console.log('登录出错');
                // console.log(data);
            }
        })
        .catch(error => {
            console.error('请求出错', error);
        });
    }
    
}

</script>