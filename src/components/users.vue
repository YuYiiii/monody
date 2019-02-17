<template>
  <el-card class="box">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索框 -->
    <el-row class="searchBox">
      <el-col>
        <el-input @clear="getAllUsers()" clearable class="searchInput" placeholder="请输入内容" v-model="query">
          <el-button @click="searchUser()" slot="append" icon="el-icon-search"></el-button>
        </el-input>
        <el-button type="success" plain @click="showDiaAddUser()">添加用户</el-button>
      </el-col>
    </el-row>

    <!-- 表格 -->
    <el-table :data="list" style="width: 100%">
      <el-table-column prop="id" label="#" width="80">
      </el-table-column>
      <el-table-column prop="username" label="姓名" width="100">
      </el-table-column>
      <el-table-column prop="email" label="邮箱" width="140">
      </el-table-column>
      <el-table-column prop="mobile" label="电话" width="140">
      </el-table-column>

      <el-table-column label="创建日期" width="200">
        <!-- 会报错 -->
        <!-- {{create_time | fmtdate}} -->
        <template slot-scope="scope">
          {{scope.row.create_time | fmtdate}}
        </template>
      </el-table-column>

      <el-table-column label="用户状态" width="120">

        <template slot-scope="scope">
          <el-switch @change="changeState(scope.row)" v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949">
          </el-switch>
        </template>

      </el-table-column>
      <el-table-column label="操作" width="200">

        <template slot-scope="scope">
          <el-button @click="showDiaEditUser(scope.row)" type="primary" icon="el-icon-edit" circle plain size="mini"></el-button>
          <el-button @click="showMsgBox(scope.row)" type="danger" icon="el-icon-delete" circle plain size="mini"></el-button>
          <el-button @click="showDiaSetRole(scope.row)" type="success" icon="el-icon-check" circle plain size="mini"></el-button>
        </template>

      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <!-- size-change  每页条数改变时
            current-change  原来是第一页，点击2页时候触发
            current-page    当前页码 
            total  总条数-->
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagenum" :page-sizes="[2, 4, 6, 8]" :page-size="2" layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>

    <!-- 对话框组件-------------添加用户对话框 -->
    <el-dialog title="添加用户" :visible.sync="dialogFormVisibleAdd">
      <el-form label-position="left" label-width="80px" :model="formdata">
        <el-form-item label="用户名">
          <el-input v-model="formdata.username"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="formdata.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="formdata.email"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="formdata.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
        <el-button type="primary" @click="addUser()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 对话框-编辑 -->
    <el-dialog title="编辑用户" :visible.sync="dialogFormVisibleEdit">
      <el-form label-position="left" label-width="80px" :model="formdata">
        <el-form-item label="用户名">
          <el-input v-model="formdata.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="formdata.email"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="formdata.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
        <el-button type="primary" @click="editUser()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 对话框 - --- -- 角色分配 -->
    <el-dialog title="分配角色" :visible.sync="dialogFormVisibleRole">
      <el-form :model="formdata" label-position="left" label-width="80px">
        <el-form-item label="用户名">
          {{currUsername}}
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="selectVal" placeholder="请选择角色名称">
            <el-option label="请选择" :value="-1"></el-option>
            <!-- 其余5个option是动态生成的 -->
            <!-- item后边的i参数因es格式问题暂时拿掉，需要再传+处理 -->
            <el-option :label="item.roleName" :value="item.id" v-for="(item) in roles" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleRole = false">取 消</el-button>
        <el-button type="primary" @click="setRole()">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>
<script>
export default {
  data() {
    return {
      query: "",
      list: [],
      pagenum: 1, //请求数据时第几页
      pagesize: 2, //每页显示几条数据
      total: -1,
      dialogFormVisibleAdd: false,
      dialogFormVisibleEdit: false,
      dialogFormVisibleRole: false,
      //   添加表单数据
      formdata: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      selectVal: -1,
      roles: [],
      currUsername: "",
      currUserId: -1
    };
  },
  created() {
    this.getTableData();
  },

  methods: {
    async setRole() {
      const res = await this.$http.put(`users/${this.currUserId}/role`, {
        rid: this.selectVal
      });
      const { meta: { msg, status } } = res.data;
      if (status === 200) {
        this.$message.success(msg);
        this.dialogFormVisibleRole = false;
      }
      console.log(res);
    },
    //   分配角色 - 显示对话框
    async showDiaSetRole(user) {
      // this.formdata = user
      // 给data中的数据赋值
      this.currUserId = user.id;
      this.currUsername = user.username;
      this.dialogFormVisibleRole = true;
      const res = await this.$http.get(`roles`);
      const { meta: { msg, status }, data } = res.data;
      if (status === 200) {
        this.roles = data;
        console.log(this.roles);
        // 30 31 34 39 40
      }
      // 获取当前用户的角色id
      const res2 = await this.$http.get(`users/${user.id}`);
      // const { meta: { msg2, status2 }, data2 } = res2.data;
      // if (status2 === 200) {
      this.selectVal = res2.data.data.rid;
      // }
    },

    //   修改用户状态
    async changeState(user) {
      const res = await this.$http.put(
        `users/${user.id}/state/${user.mg_state}`
      );
      const { meta: { status, msg } } = res.data;
      if (status === 200) {
        this.$message.success(msg);
      }
    },
    //   编辑---发送请求
    async editUser() {
      // id   用户id
      //   点击编辑发送请求获取
      //   点击确定发送请求修改

      // 当点击确定的时候再发送put请求修改数据加载列表
      // 加载用户列表
      const res = await this.$http.put(
        `users/${this.formdata.id}`,
        this.formdata
      );

      const { meta: { msg, status } } = res.data;
      if (status == 200) {
        this.dialogFormVisibleEdit = false;
        this.pagenum = 1;
        this.getTableData();
      }
    },

    //   编辑-------显示对话框
    async showDiaEditUser(user) {
      // 点击编辑按钮--发送get请求获取所需用户数据
      const res = await this.$http.get(`users/${user.id}`);

      //          得到数据渲染在弹出的框中
      this.formdata = res.data.data;

      this.dialogFormVisibleEdit = true;
    },
    showMsgBox(user) {
      this.$confirm("是否确认删除该用户(￣▽￣)／", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          // 发送删除请求
          const res = await this.$http.delete(`users/${user.id}`);
          const { meta: { msg, status } } = res.data;
          if (status == 200) {
            this.pagenum = 1;
            this.getTableData();
            this.$message({
              type: "success",
              message: "删除成功(*/ω＼*)!"
            });
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除(〃'▽'〃)"
          });
        });
    },
    //   添加用户-发送请求
    async addUser() {
      const res = await this.$http.post(`users`, this.formdata);
      this.dialogFormVisibleAdd = false;
      this.getTableData();
      const { status } = res;
      if (status == 200) {
        this.$message({
          type: "success",
          message: "添加成功!"
        });
      }
    },
    //   展示对话框
    showDiaAddUser() {
      this.formdata = {};
      this.dialogFormVisibleAdd = true;
    },
    getAllUsers() {
      this.getTableData();
    },
    searchUser() {
      this.pagenum = 1;
      this.getTableData();
    },
    //   分页相关方法
    handleSizeChange(val) {
      this.pagenum = 1;
      this.pagesize = val;
      this.getTableData();
    },
    handleCurrentChange(val) {
      this.pagenum = val;
      this.getTableData();
    },
    async getTableData() {
      const AUTH_TOKEN = localStorage.getItem("token");
      this.$http.defaults.headers.common["Authorization"] = AUTH_TOKEN;
      const res = await this.$http.get(
        `users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${
          this.pagesize
        }`
      );
      const { data, meta: { status, msg } } = res.data;
      if (status === 200) {
        this.total = data.total;
        this.list = data.users;
      }
    }
  }
};
</script>

<style>
.searchBox {
  margin-top: 20px;
}
.searchInput {
  width: 400px;
}
</style>
