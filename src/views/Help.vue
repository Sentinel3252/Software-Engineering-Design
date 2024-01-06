<template>
    <main class="page hire-me-page">
        <section class="portfolio-block hire-me" style="padding: 50px 0px;">
            <div class="container">
                <div class="heading"></div>
                <form class="border rounded border-0 shadow-lg p-3 p-md-5" data-bs-theme="light">
                    <div class="mb-3">
                        <label class="form-label" for="email">联系电话</label>
                        <input class="form-control"  id="email" v-model="phone">
                    </div>
                    <div class="mb-3">
                        <label class="form-label" for="varify">验证码</label>
                        <input class="form-control" id="varify" v-model="varifyCode">
                        <button 
                            class="btn btn-primary" 
                            type="button" 
                            style="margin-top: 36px;padding-bottom: 10px;margin-bottom: 22px;" 
                            @click="getVarifyCode">
                            获取验证码</button>
                    </div>
                    <div class="mb-3">
                        <div class="row d-lg-flex justify-content-lg-center">
                            <div class="col-md-6 d-lg-flex justify-content-lg-center align-items-lg-center">
                                <button
                                    class="btn btn-primary flex-fill" type="button" style="font-size: 17px;" @click = "ensure">确认</button>
                            </div>
                        </div>
                    </div>
                    <small class="form-text"></small>
                </form>
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
import router from '@/router/router.js';
import {ref} from 'vue';
const phone = ref('');
const varifyCode = ref('');
const baseUrl="http://8.130.77.190:8090";


var returnNumber=''
var returnVarifyCode=''
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
            returnVarifyCode = data.data.verification_code;
        }else{
            alert("验证码发送失败");
        }
    })
    .catch(error => {
        console.error('请求出错', error);
    });
}

const ensure = () =>{
    if(phone.value != returnNumber){
        alert("手机号不一致")
        return ;
    }
    if(varifyCode.value != returnVarifyCode){
        alert("验证码不一致")
        return ;
    }
    router.push('/image-processing');
}
</script>