<template>
    <el-container class="container">
        <!-- 顶部 -->
        <el-header>
            <el-row>
                <el-col :span="4">
                    <img src="@/assets/logo.png" alt="图片加载失败">
                </el-col>
                <el-col :span="19" class="middle">
                    <h2>电商后台管理系统</h2>
                </el-col>
                <el-col :span="1">
                    <a href="#" @click.prevent="handleLoginout()" class="loginout">退出</a>
                </el-col>
            </el-row>
        </el-header>
        <el-container>
            <!-- 侧边导航 -->
            <el-aside class="aside" width="200px">
                <el-menu default-active="1" :router="true" :unique-opened="true">
                    <!-- 用户管理 -->
                    <el-submenu :index="item.order+''" v-for="item in menus" :key="item.id">
                        <template slot="title">
                            <i class="el-icon-location"></i>
                            <span>{{item.authName}}</span>
                        </template>
                        <el-menu-item :index="item1.path" v-for="item1 in item.children" :key="item1.id">
                            <i class="el-icon-menu"></i>
                            {{item.authName}}</el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <!-- 列表区域 -->
            <el-main class="main">
                <router-view>
                </router-view>
            </el-main>
        </el-container>
    </el-container>
</template>
<script>
export default {
  data() {
    return {
      menus: []
    };
  },
  beforeMount() {
    if (!localStorage.getItem("token")) {
      this.$router.push({
        name: "login"
      });
    }
  },
  created() {
    this.getMenus();
  },
  methods: {
    async getMenus() {
      const res = await this.$http.get(`menus`);
      const { meta: { msg, status }, data } = res.data;
      if (status === 200) {
        this.menus = data;
        // console.log(res);
      }
    },
    handleLoginout() {
      localStorage.clear("");
      this.$router.push({
        name: "login"
      });
      this.$message.warning("退出成功٩(๑>₃<)۶");
    }
  }
};
</script>

<style>
.container {
  background-color: #b3c0d1;
  height: 100%;
}
/* .aside {
  background-color: hotpink;
} */
.main {
  background-color: gray;
}
.middle {
  text-align: center;
  line-height: 60px;
  color: #ffffff;
}
.loginout {
  line-height: 60px;
  text-decoration: none;
}
</style>
