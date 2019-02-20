<template>
  <el-card class="box">
    <!-- 面包屑 -->
    <cus-bread level1='商品管理' level2='商品列表'></cus-bread>
    <!-- 提示消息 -->
    <el-alert class="alert" title="添加商品信息" type="info" center show-icon></el-alert>
    <!-- 步骤条 -->
    <el-steps :active="active*1" align-center>
      <el-step title="基本信息"></el-step>
      <el-step title="商品参数"></el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="商品图片"></el-step>
      <el-step title="商品内容"></el-step>
    </el-steps>
    <!-- tab切换栏 -->
    <el-form class="form" label-position="top" label-width="80px" :model="form">
      <el-tabs v-model="active" @tab-click="changeTab()" tab-position="left">
        <el-tab-pane name="1" label="基本信息">
          <el-form-item label="商品名称">
            <el-input v-model="form.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input v-model="form.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model="form.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input v-model="form.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            <el-cascader clearable="" expand-trigger="hover" :options="options" v-model="selectedOptions" @change="handleChange" :props="defaultProp">
            </el-cascader>
          </el-form-item>
        </el-tab-pane>
        <!-- 动态 -->
        <el-tab-pane name="2" label="商品参数">
          <el-form-item :label="item1.attr_name" v-for="item1 in arrDy " :key="item1.attr_id">

            <el-checkbox-group v-model="item1.attr_vals">
              <el-checkbox border :label="item2" v-for="(item2,i) in item1.attr_vals" :key="i"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>

        </el-tab-pane>
        <el-tab-pane name="3" label="商品属性">
          <el-form-item v-for="item in arrStatic" :key="item.attr_id" :label="item.attr_name">
            <el-input v-model="item.attr_vals"></el-input>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane name="4" label="商品图片">
          <el-form-item label="添加图片">

            <!-- dsandksadhasod -->
            <el-upload :headers="headers" action="http://localhost:8888/api/private/v1/upload" :on-remove="handleRemove" :on-success="handleSuccess" list-type="picture">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane name="5" label="商品内容">

          <el-form-item>
            <el-button @click="addGoods()" plain type="success">添加商品</el-button>
            <quill-editor v-model="form.goods_introduce"></quill-editor>
          </el-form-item>

        </el-tab-pane>
      </el-tabs>
    </el-form>
  </el-card>
</template>

<script>
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

import { quillEditor } from "vue-quill-editor";

export default {
  components: {
    quillEditor
  },
  data() {
    return {
      active: "1",
      // 将来发送添加商品请求时的请求题
      form: {
        goods_name: "",
        goods_cat: "",
        goods_price: "",
        goods_number: "",
        goods_weight: "",
        goods_introduce: "",
        pics: [],
        attrs: []
      },
      //   级联配置的数据
      options: [],
      selectedOptions: [1, 3, 6],
      defaultProp: {
        label: "cat_name",
        value: "cat_id",
        children: "children"
      },
      //   动态参数的数组
      arrDy: [],
      //   动态参数的数组
      arrStatic: [],
      headers: {
        Authorization: localStorage.getItem("token")
      }
    };
  },
  created() {
    this.getGoodsCate();
  },
  methods: {
    // 添加商品
    async addGoods() {
      // const res = await this.$http.post(`goods`,this.form)
      this.form.goods_cat = this.selectedOptions.join(",");

      // 动态的处理
      const obj1 = { attr_id: "", attr_value: "" };
      const arr1 = [];

      this.arrDy.forEach(item => {
        obj1.attr_id = item.attr_id;
        obj1.attr_value = item.attr_vals;
        arr1.push(obj1);
      });

      // 静态处理
      const obj2 = { attr_id: "", attr_value: "" };
      const arr2 = [];
      this.arrStatic.forEach(item => {
        obj2.attr_id = item.attr_id;
        obj2.attr_value = item.attr_vals;
        arr2.push(obj2);
      });

      this.form.attrs = [...arr1, ...arr2];
      const res = await this.$http.post(`goods`, this.form);
      console.log(res);
      const { meta: { msg, status } } = res.data;
      if (status === 201) {
        this.$router.push({
          name: "goods"
        });
      } else {
        this.$message.error(msg + "(；´д｀)ゞ");
      }
    },
    // 移除图片
    handleRemove(file, filwList) {
      // file.response.data.tmp_path
      const Index = this.form.pics.map(item => {
        return item.pic === file.response.data.tmp_path;
      });
      this.form.pics.splice(Index, 1);
    },
    //上传(假)
    handleSuccess(res, file, filwList) {
      // 图片上传的临时路径
      // res.data.data.tmp_path
      const tmpPath = res.data.tmp_path;
      this.form.pics.push({
        pic: tmpPath
      });
    },

    async changeTab() {
      if (this.active === "2" || this.active === "3") {
        if (this.selectedOptions.length !== 3) {
          this.$message.error("请先选择三级分类٩(๑>◡<๑)۶ ");
          if (this.active === "2") {
            this.arrDy = [];
          } else {
            this.arrStatic = [];
          }
          return;
        }
        if (this.active === "2") {
          // 获取动态数据
          const res = await this.$http.get(
            `categories/${this.selectedOptions[2]}/attributes?sel=many`
          );
          const { meta: { msg, status }, data } = res.data;
          if (status === 200) {
            this.arrDy = data;
            this.arrDy.forEach(item => {
              item.attr_vals =
                item.attr_vals.length === 0
                  ? []
                  : item.attr_vals.trim().split(",");
            });
            console.log(this.arrDy);
          }
        }

        if (this.active === "3") {
          // 获取静态数据
          const res = await this.$http.get(
            `categories/${this.selectedOptions[2]}/attributes?sel=only`
          );
          const { meta: { msg, status }, data } = res.data;
          if (status === 200) {
            this.arrStatic = data;
          }
        }
      }
    },
    //   获取三级分类的数据
    async getGoodsCate() {
      // type的值
      const res = await this.$http.get(`categories?type=3`);
      const { meta: { msg, status }, data } = res.data;
      if (status === 200) {
        this.options = data;
        // console.log(this.options);
      }
    },
    handleChange() {}
  }
};
</script>

<style>
.box {
  height: 100%;
}
.alert {
  margin-top: 20px;
  margin-bottom: 20px;
}
.form {
  height: 500px;
  overflow: auto;
}
.ql-editor,
.ql-blank {
  min-height: 300px;
}
</style>
