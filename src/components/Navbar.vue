<template>
    <nav class="navbar navbar-expand-lg fixed-top portfolio-navbar gradient navbar-dark">
        <div class="container"><a class="navbar-brand logo" href="#">玻璃幕墙图像识别分割处理</a><button data-bs-toggle="collapse"
                class="navbar-toggler" data-bs-target="#navbarNav">
                <span class="visually-hidden">Toggle
                    navigation</span>
                    <span class="navbar-toggler-icon">

                    </span>
                </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item">
                        <router-link to="/image-processing" class="nav-link">图像处理</router-link>
                    </li>
                    <li class="nav-item">
                        <router-link to="/glass-glue-identification" class="nav-link">结构胶识别算法</router-link>
                    </li>
                    <li class="nav-item">
                        <router-link to="/user-profile" class="nav-link">个人中心</router-link>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</template>

<script>
import { defineComponent } from 'vue';
export default defineComponent({
    name: 'Navbar',
});
</script>