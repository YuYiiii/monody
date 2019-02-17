<template>
    <el-card class="box">
        <!-- 面包屑 -->
        <cus-bread level1="权限管理" level2="权限列表"></cus-bread>
        <el-button @click="addRolesMsgBox()" class="btn" type="primary" plain>添加角色</el-button>
        <!-- 表格 -->
        <el-table height="500px" :data="list" style="width: 100%">
            <el-table-column type="index" label="#" width="160">
            </el-table-column>
            <el-table-column prop="roleName" label="角色名称" width="200">
            </el-table-column>
            <el-table-column prop="roleDesc" label="角色描述" width="200">
            </el-table-column>
            <el-table-column prop="path" label="操作" width="200">
                <!-- 操作部分 -->
                <template slot-scope="scope">
                    <el-button @click="showOpenRole(scope.row)" type="primary" icon="el-icon-edit" circle plain size="mini"></el-button>
                    <el-button @click="showMsgBox(scope.row)" type="danger" icon="el-icon-delete" circle plain size="mini"></el-button>
                    <el-button @click="showSetRole(scope.row)" type="success" icon="el-icon-check" circle plain size="mini"></el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 添加角色对话框 -->
        <el-dialog title="添加角色" :visible.sync="dialogFormVisible">
            <el-form>
                <el-form-item label="角色名称" :label-width="formLabelWidth">
                    <el-input v-model="formdata.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" :label-width="formLabelWidth">
                    <el-input v-model="formdata.roleDesc"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="addRoles()">确 定</el-button>

            </div>
        </el-dialog>

        <!-- 编辑角色对话框 -->
        <el-dialog title="编辑角色" :visible.sync="dialogRoleVisible">
            <el-form>
                <el-form-item label="角色名称" :label-width="formLabelWidth" disabled>
                    <el-input v-model="formdata.roleName" disabled></el-input>
                </el-form-item>
                <el-form-item label="角色描述" :label-width="formLabelWidth">
                    <el-input v-model="formdata.roleDesc"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogRoleVisible = false">取 消</el-button>
                <el-button type="primary" @click="showEditRole()">确 定</el-button>
            </div>
        </el-dialog>

    </el-card>
</template>

<script>
export default {
  data() {
    return {
      list: [],
      dialogFormVisible: false,
      dialogRoleVisible: false,
      formLabelWidth: "80px",
      formdata: {
        roleName: "",
        roleDesc: ""
      }
    };
  },
  created() {
    this.getRolesData();
  },
  methods: {
    //   修改角色具体信息
    showSetRole() {},

    //   编辑--对话框
    async showEditRole() {
      const res = await this.$http.put(
        `roles/${this.formdata.id}`,
        this.formdata
      );
      this.dialogRoleVisible = false;
      this.$message({
        type: "success",
        message: "编辑成功(*/ω＼*)!"
      });
      this.getRolesData();
    },

    //   编辑--打开对话框
    async showOpenRole(user) {
      this.dialogRoleVisible = true;
      //   获取当前用户数据赋值给表单
      this.formdata.id = user.id;
      this.formdata.roleName = user.roleName;
      this.formdata.roleDesc = user.roleDesc;
    },

    //   删除角色
    async showMsgBox(user) {
      this.$confirm("是否确认删除该用户(￣▽￣)／", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          // 发送删除请求
          const res = await this.$http.delete(`roles/${user.id}`);

          const { meta: { msg, status } } = res.data;
          if (status == 200) {
            this.$message({
              type: "success",
              message: "删除成功(*/ω＼*)!"
            });
            this.getRolesData();
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除(〃'▽'〃)"
          });
        });
    },

    //   添加角色
    async addRoles() {
      this.dialogFormVisible = false;
      const res = await this.$http.post(`roles`, this.formdata);
      this.formdata = {};
      this.getRolesData();
    },
    //   打开添加角色对话框
    addRolesMsgBox() {
      this.dialogFormVisible = true;
    },
    //   获取列表
    async getRolesData() {
      const res = await this.$http.get(`roles`);
      const { meta: { msg, status }, data } = res.data;
      if (status === 200) {
        this.list = data;
      }
    }
  }
};
</script>

<style>
.btn {
  margin-top: 20px;
}
</style>
