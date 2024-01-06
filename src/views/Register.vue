<template>
    <main class="page hire-me-page">
        <section class="portfolio-block hire-me" style="padding: 50px 0px;">
            <div class="container">
                <div class="heading"></div>
                <form class="border rounded border-0 shadow-lg p-3 p-md-5" data-bs-theme="light">
                    <p class="d-lg-flex justify-content-lg-center align-items-lg-center"
                        style="font-weight: bold;font-size: 35px;">注册</p>
                    <div class="mb-3"><label class="form-label" for="subject">昵称</label>
                        <input class="form-control" type="text" v-model="name">
                    </div>
                    <div class="mb-3">
                        <label class="form-label" for="email">联系电话</label>
                        <input class="form-control"  id="email" v-model="phone">
                    </div>
                    <div class="mb-3">
                        <label class="form-label" for="varify">验证码</label>
                        <input class="form-control" id="varify" v-model="varifyCode">
                        <button class="btn btn-primary" type="button" style="margin-top: 36px;padding-bottom: 10px;margin-bottom: 22px;" @click="getVarifyCode">获取验证码</button>
                    </div>
                    <div class="mb-3">
                        <label class="form-label" for="message">密码</label>
                        <input class="form-control" type="password" v-model="pwd">
                        <label class="form-label" for="message" >确认密码</label>
                        <input class="form-control" type="password" v-model="pwd2">
                    </div>
                    <div class="mb-3">
                        <div class="row d-lg-flex justify-content-lg-center">
                            <div class="col-md-6 d-lg-flex justify-content-lg-center align-items-lg-center"><button
                                    class="btn btn-primary flex-fill" type="button" style="font-size: 17px;" @click="register">确认</button>
                            </div>
                            <div class="col d-lg-flex justify-content-lg-center align-items-lg-center">
                                <button
                                    class="btn btn-primary flex-fill" type="button">
                                        <router-link to="/login" class="d-lg-flex flex-grow-1 justify-content-lg-center align-items-lg-center" style="color: rgb(255,255,255);font-size: 16px;font-weight: bold;">
                                            已有账号，我要登录</router-link>
                                </button>
                            </div>
                        </div>
                    </div>
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
</template>

<script setup>
import axios from 'axios';
import bcrypt from 'bcryptjs'; 
import { ref } from 'vue';

const name = ref('');
const phone = ref('');
const varifyCode = ref('');
const pwd = ref('');
const pwd2 = ref('');

const baseUrl="http://8.130.77.190:8090";
var returnNumber = "";
var verifyCode = "";
const getVarifyCode = async() => {
    let getVerifyCodeUrl = baseUrl + "/send";

    axios.get(getVerifyCodeUrl, {
        params: {
            "phone": phone.value
        }
    })
    .then(response => {
        if(response.status==200){
            alert("验证码已发送");
            var data=response.data;
            returnNumber = data.data.user_phone;
            verifyCode = data.data.verification_code;
        }else{
            alert("验证码发送失败");
        }
    })
    .catch(error => {
        console.error('请求出错', error);
    });

}

const register = async() => {
    let registerUrl = baseUrl + "/user/register";

    if(pwd.value!=pwd2.value){
        alert("两次密码不一致");
        return;
    }    
    if(phone.value!=returnNumber){
        console.log(phone.value);
        console.log(returnNumber);
        alert("手机号不一致");
        return;
    }
    if(varifyCode.value!=verifyCode){
        alert("验证码不一致");
        return;
    }

    const hashedPassword = await bcrypt.hash(pwd.value, 10);
    // console.log(hashedPassword);
    axios.post(registerUrl, {
        "username": name.value,
        "phone": phone.value,
        "pwd": hashedPassword,
        "code": varifyCode.value
    })
    .then(response => {
        if(response.status==200){
            alert("注册成功");

        }else{
            alert("注册失败");
        }
    })
    .catch(error => {
        console.error('请求出错', error);
    });

}
</script>