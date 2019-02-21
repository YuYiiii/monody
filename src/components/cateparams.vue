<template>
  <el-card class="box">
    <!-- 面包屑 -->
    <cus-bread level1='商品管理' level2='分类参数'></cus-bread>

    <!-- 警告消息 -->
    <el-alert class="alert" title="注意:只允许为第三季分类设置参数(;´༎ຶД༎ຶ`)" type="warning" show-icon>
    </el-alert>

    <!-- 级联 -->

    <el-form class="form" label-position="left" label-width="160px" :model="form">
      <el-form-item label="请选择商品分类">
        {{selectedOptions}}
        <el-cascader clearable expand-trigger="hover" :options="options" v-model="selectedOptions" @change="handleChange" :props="defaultProp"></el-cascader>
      </el-form-item>
    </el-form>

    <!-- Tab切换栏 -->
    <el-tabs @tab-click="changeTab()" type="border-card" v-model="active">
      <el-tab-pane name="1" label="动态参数">

        <el-button class="butn" type="success" plain disabled="">设置动态参数( • ̀ω•́ )✧</el-button>
        <!-- 下方表格(　 ´-ω ･)▄︻┻┳══━一 -->
        <el-table height="450px" border stripe :data="arrDy" style="width: 100%">

          <el-table-column type="expand" width="80">
            <template slot-scope="scope">

              <el-tag :key="i" v-for="(attr,i) in scope.row.attr_vals" closable :disable-transitions="false" @close="handleClose(scope.row,attr)">
                {{attr}}
              </el-tag>
              <el-input class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)">
              </el-input>
              <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>

              <!-- <span>٩(๑❛ᴗ❛๑)۶</span> -->
            </template>
          </el-table-column>

          <el-table-column label="#" type="index" width="120"></el-table-column>

          <el-table-column prop="attr_name" label="属性名称" width="300">
          </el-table-column>
          <el-table-column label="操作" width="300">
            <template slot-scope="scope">
              <el-button plain size="mini" type="primary" icon="el-icon-edit" circle></el-button>
              <el-button plain size="mini" type="danger" icon="el-icon-delete" circle></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <!-- 设置静态参数 -->
      <el-tab-pane name="2" label="静态参数">
        <el-button class="butn" type="success" plain disabled="">设置静态参数( • ̀ω•́ )✧</el-button>
        <!-- 下方表格 -->

        <el-table height="450px" border stripe :data="arrStatic" style="width: 100%">

          <el-table-column label="#" type="index" width="120"></el-table-column>

          <el-table-column prop="attr_name" label="属性名称" width="300">
          </el-table-column>

          <el-table-column prop="attr_vals" label="属性值" width="300">
          </el-table-column>

          <el-table-column label="操作" width="300">
            <template slot-scope="scope">
              <el-button plain size="mini" type="primary" icon="el-icon-edit" circle></el-button>
              <el-button plain size="mini" type="danger" icon="el-icon-delete" circle></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      options: [],
      selectedOptions: [],
      defaultProp: {
        label: "cat_name",
        value: "cat_id",
        children: "children"
      },
      form: {},
      active: "1",
      arrDy: [],
      arrStatic: [],
      // 动态tag编辑时的数据
      dynamicTags: ["标签一", "标签二", "标签三"],
      inputVisible: false,
      inputValue: ""
    };
  },
  created() {
    this.getGoodsCate();
  },
  methods: {
    // 动态tag编辑方法
    // 删除attr_Vals中的值
    async handleClose(item, attr) {
      item.attr_vals.splice(item.attr_vals.indexOf(attr), 1);
      // categories/:id/attributes/:attrId
      const res = await this.$http.put(
        `categories/${this.selectedOptions[2]}/attributes/${item.attr_id}`,
        {
          attr_name: item.attr_name,
          attr_sel: "many",
          attr_vals: item.attr_vals.join(",")
        }
      );
    },

    // 动态tag编辑方法
    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    // 动态tag编辑方法
    // 向attr_Vals中添加新的值
    async handleInputConfirm(item) {
      let inputValue = this.inputValue;
      if (inputValue) {
        item.attr_vals.push(inputValue);
        const res = await this.$http.put(
          `categories/${this.selectedOptions[2]}/attributes/${item.attr_id}`,
          {
            attr_name: item.attr_name,
            attr_sel: "many",
            attr_vals: item.attr_vals.join(",")
          }
        );
      }
      this.inputVisible = false;
      this.inputValue = "";
    },

    // 点击级联时对应变化及处理
    handleChange() {
      // console.log("QAQ")
      this.getDyOrStatic();
    },
    changeTab() {
      this.getDyOrStatic();
    },
    // 获取动态/静态数据
    async getDyOrStatic() {
      if (this.selectedOptions.length !== 3) {
        this.$message.warning("请先设置三级分类哟(*❦ω❦)");
        if (this.active === "1") {
          this.arrDy = [];
        }
        if (this.active === "2") {
          this.arrStatic = [];
        }
        return;
      }
      // 获取动态数据
      if (this.active === "1") {
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
      // 获取静态数据
      if (this.active === "2") {
        const res = await this.$http.get(
          `categories/${this.selectedOptions[2]}/attributes?sel=only`
        );
        const { meta: { msg, status }, data } = res.data;
        if (status === 200) {
          this.arrStatic = data;
        }
      }
    },
    // 获取级联数据并复制给选择器
    async getGoodsCate() {
      // type的值
      const res = await this.$http.get(`categories?type=3`);
      const { meta: { msg, status }, data } = res.data;
      if (status === 200) {
        this.options = data;
        // console.log(this.options);
      }
    }
  }
};
</script>

<style>
.box {
  height: 100%;
}
.alert {
  margin-bottom: 20px;
  margin-top: 20px;
}
.butn {
  margin-bottom: 20px;
}
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
