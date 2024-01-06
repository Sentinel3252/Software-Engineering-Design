<template>
    <div class="outer-container">
        <h2>筛选图片</h2>
        <div>
            <h4>满意度</h4>
            <input type="radio" id="saticfied" name="satisfaction" value=1 v-model="satisfaction">
            <label for="satisfied">满意</label>
            <input type="radio" id="unsaticfied" name="satisfaction" value=0 v-model="satisfaction">
            <label for="unsatisfied">不满意</label>
        </div>
        

        <div>
            <h4>上传时间</h4>
            <el-date-picker
                value-format="YYYY-MM-DD"
                class="time-picker"
                v-model="timeStart"
                type="date"
                placeholder="开始日期">
            </el-date-picker>
            <el-date-picker
                value-format="YYYY-MM-DD"
                class="time-picker"
                v-model="timeEnd"
                type="date"
                placeholder="结束日期">
            </el-date-picker>
        </div>
        <div style="display:flex; flex-direction:column; justify-content: center; align-items:center">
            <p class="promptMessage"></p>
            <el-button type="primary" @click="search">搜索</el-button>
        </div>
    </div>
    <div v-for="result in results" :key="result">
        <img :src="aliUrl+result" alt="图片加载失败" style="width:100px;height:100px">
        <button @click="download(aliUrl + result)">下载</button>
    </div>
</template>


<script setup>
import axios from 'axios';
import { reactive, ref } from 'vue';
const satisfaction = ref(null);
const timeStart = ref(null);
const timeEnd = ref(null);

const aliUrl = "https://se-project-tongji.oss-cn-shanghai.aliyuncs.com/";
const baseUrl="http://8.130.77.190:8090";


const results = reactive([]);

const search = () => {
    if(satisfaction == null){
        document.getElementsByClassName("promptMessage")[0].innerHTML = "请选择满意度";
        return ;
    }
    // const startTime = new Date(timeStart);
    // const endTime = new Date(timeEnd);
    const startTime = timeStart._value;
    const endTime = timeEnd._value;
    // console.log("original time")
    // console.log(timeStart);
    // console.log(timeEnd);
    // console.log("converted time")
    // console.log(startTime);
    // console.log(endTime);

    if(startTime!=null && endTime!=null){
        if(startTime > endTime){
            document.getElementsByClassName("promptMessage")[0].innerHTML = "开始时间不能大于结束时间";
            setTimeout(function() {
                document.getElementsByClassName("promptMessage")[0].innerHTML = "";
            }, 3000);
            return ;
        }
    }
    

    axios.get(baseUrl+'/admin/search',{
        params:{
            "satisfaction":satisfaction.value,
            "startTime":startTime,
            "endTime":endTime
        }
    })
    .then(response=>{
        if(response.status==200){
            results.splice(0,results.length);
            // console.log(response)
            var data=response.data.data;
            for(var i = 0; i<data.length; i++){
                results.splice(0,0,data[i])
            }
            // console.log(results)
        }else{
            alert("搜索失败");
        }
    })
    .catch(error=>{
        console.error('请求出错', error);
    })
}

const download = (downloadUrl) =>{
    var a = document.createElement('a');
    a.href = downloadUrl;
    a.download = 'download.jpg';
    a.click();
}
</script>

<style scoped>
.outer-container{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 100px;
}

.time-picker{
    margin: 10px;
}

.promptMessage{
    color: red;
    height:50px;
}

</style>