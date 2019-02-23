<template>
  <el-card class="box">
    <!-- 面包屑 -->
    <cus-bread level1="权限管理" level2="角色列表"></cus-bread>
    <el-button @click="addRolesMsgBox()" class="btn" type="primary" plain>添加角色</el-button>
    <!-- 表格 -->
    <el-table height="500px" :data="roles" style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="scope">
          <!-- 行列 -->
          <el-row class="level1" v-for="item1 in scope.row.children" :key="item1.id">
            <el-col :span="4">
              <el-tag closable @close="deleteRights(scope.row,item1)" type="danger">{{item1.authName}}</el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>
            <el-col :span="20">
              <el-row class="level2" v-for="item2 in item1.children" :key="item2.id">
                <el-col :span="6">
                  <el-tag closable @close="deleteRights(scope.row,item2)" type="info">
                    {{item2.authName}}
                  </el-tag>
                  <i class="el-icon-arrow-right"></i>
                </el-col>
                <el-col :span="18">
                  <el-tag closable @close="deleteRights(scope.row,item3)" class="level3" v-for="item3 in item2.children" :key="item3.id" type="success">
                    {{item3.authName}}
                  </el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-row v-if="scope.row.children.length===0">
            <el-col>
              <span>暂未分配权限哦( • ̀ω•́ )✧</span>
            </el-col>
          </el-row>

        </template>
      </el-table-column>
      <el-table-column type="index" label="#" width="160">
      </el-table-column>
      <el-table-column prop="roleName" label="角色名称" width="200">
      </el-table-column>
      <el-table-column prop="roleDesc" label="角色描述" width="200">
      </el-table-column>
      <el-table-column label="操作" width="440">
        <!-- 操作部分 -->
        <template slot-scope="scope">
          <el-button @click="showOpenRole(scope.row)" type="primary" icon="el-icon-edit" circle plain size="mini"></el-button>
          <el-button @click="showMsgBox(scope.row)" type="danger" icon="el-icon-delete" circle plain size="mini"></el-button>
          <el-button @click="showSetRoleBox(scope.row)" type="success" icon="el-icon-check" circle plain size="mini"></el-button>
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

    <!-- 对话框-分配权限 -->
    <el-dialog title="分配权限" :visible.sync="dialogRulerVisible">
      <!-- Element组件部分 -->
      <!-- node-key每个节点的唯一标识,值来源于treedata中的key名 -->
      <el-tree ref="treeDom" default-expand-all :data="treedata" show-checkbox node-key="id" :default-checked-keys="arrCheck" :props="defaultProps">
      </el-tree>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogRulerVisible = false">取 消</el-button>
        <el-button type="primary" @click="showSetRole()">确 定</el-button>
      </div>
    </el-dialog>

  </el-card>
</template>

<script>
export default {
  data() {
    return {
      roles: [],
      dialogFormVisible: false,
      dialogRoleVisible: false,
      dialogRulerVisible: false,
      formLabelWidth: "80px",
      formdata: {
        roleName: "",
        roleDesc: ""
      },
      // 属性结构绑定的数据
      treedata: [],
      // 默认选中的数据[被选中的节点的id]
      arrCheck: [],
      // 配置选项
      defaultProps: {
        // label和children的值来源于树形结构绑定数据treedata中的key名,"label"
        label: "authName",
        children: "children"
      },
      // 当前角色id
      currRoleId: -1
    };
  },
  created() {
    this.getRolesData();
    this.getRoles();
  },
  methods: {
    //   修改角色具体信息
    async showSetRole() {
      const arr1 = this.$refs.treeDom.getCheckedKeys();
      // console.log(arr1);

      // 获取树形结构中半选id
      const arr2 = this.$refs.treeDom.getHalfCheckedKeys();
      // console.log(arr2);

      // ES6 展开操作运算符
      const arr = [...arr1, ...arr2];
      // 发送请求
      // roles/:roleId/rights
      // roleId当前角色id
      const res = await this.$http.post(`roles/${this.currRoleId}/rights`, {
        rids: arr.join(",")
      });
      // console.log(res);
      if (res.data.meta.status === 200) {
        this.dialogRulerVisible = false;
        this.getRoles();
      }
    },

    //   打开修改角色对话框
    async showSetRoleBox(role) {
      this.currRoleId = role.id;
      // 获取所有权限
      const res = await this.$http.get(`rights/tree`);
      // console.log(res);
      const { meta: { msg, status }, data } = res.data;
      if (status === 200) {
        this.treedata = data;
      }

      // 获取当前角色有的权限
      const temp = [];
      role.children.forEach(item1 => {
        item1.children.forEach(item2 => {
          item2.children.forEach(item3 => {
            temp.push(item3.id);
          });
        });
      });
      this.arrCheck = temp;
      this.dialogRulerVisible = true;
    },

    // 删除标签
    async deleteRights(role, rights) {
      const res = await this.$http.delete(
        `roles/${role.id}/rights/${rights.id}`
      );
      const { meta: { msg, status }, data } = res.data;
      if (status === 200) {
        this.$message.success("删除成功( • ̀ω•́ )✧");
        role.children = data;
      }
    },
    // 获取权限列表
    async getRoles() {
      const res = await this.$http.get(`roles`);
      this.roles = res.data.data;
    },

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
      this.formdata = {};
    },
    //   获取列表
    async getRolesData() {
      const res = await this.$http.get(`roles`);

      const { meta: { msg, status }, data } = res.data;
      if (status === 200) {
        this.roles = data;
      }
    }
  }
};
</script>

<style scoped>
.btn {
  margin-top: 20px;
}
.level1,
.level2,
.level3 {
  margin-bottom: 10px;
  margin-right: 20px;
}
</style>
