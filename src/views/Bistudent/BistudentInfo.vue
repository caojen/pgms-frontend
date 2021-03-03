<template>
  <div>
    <div id="image">
      <div id="image-show">
        <img
          :src="`${avatarPrefix}/${info.image}`"
          alt="获取头像失败"
          v-if="info.image !== undefined"
          id="image-show"
        />
        <span style="margin-left: 20px;">
          <a-upload
            :file-list="filelist"
            :before-upload="beforeUploadFile"
            :showUploadList="false"
          >
            <a-button> <a-icon type="upload" /> 更新头像 </a-button>
          </a-upload>
        </span>
      </div>
    </div>
    <div id="info">
      <div class="info-item" v-for="(item, index) in infoRows" :key="index">
        <div class="info-desc">
          {{ item.desc }}:
        </div>
        <span class="info-input">
          <a-input v-model="info[item.dataIndex]" :disabled="!item.editable"/>
        </span>
      </div>
      <div id="upload-confirm">
        <a-button type="primary" @click="updateInfo">
          <a-icon type="plus"/>
          更新信息
        </a-button>
      </div>
    </div>
  </div>
</template>

<script>
import * as api from '@/api/bistudent'
import { prefix } from '@/util/http'

export default {
  name: 'BistudentInfo',
  data () {
    return {
      info: {},
      infoRows: [
        { desc: '姓名', dataIndex: 'name' },
        { desc: '性别', dataIndex: 'gender' },
        { desc: '民族', dataIndex: 'ethnic' },
        { desc: '专业', dataIndex: 'degree' },
        { desc: '类型', dataIndex: 'enrol' },
        { desc: '本科学校', dataIndex: 'graduation_university' },
        { desc: '本科学校类型', dataIndex: 'source' },
        { desc: '本科毕业专业', dataIndex: 'graduation_major' },
        { desc: '是否推免', dataIndex: 'recommended' },
        { desc: '记录成绩', dataIndex: 'score' },
        { desc: '居住地', dataIndex: 'household_register' },
        { desc: '联系邮箱', dataIndex: 'email', editable: true },
        { desc: '联系方式', dataIndex: 'phone', editable: true }
      ],
      avatarPrefix: `${prefix}${api.url.getFile}`,
      filelist: []
    }
  },
  mounted () {
    this.fetch()
  },
  methods: {
    fetch () {
      api.getBistudentInfo()
        .then(res => {
          this.info = {
            ...res.data,
            recommended: res.data.recommended ? '是' : '否'
          }
        })
    },
    updateInfo () {
      const { email, phone } = this.info
      api.updateBistudentInfo({ email, phone })
        .then(() => {
          this.$message.success('修改信息成功')
          this.fetch()
        })
    },
    beforeUploadFile (file) {
      this.filelist = [file]
      api.updateImage(file)
        .then(() => {
          this.$message.success('更新成功')
          this.fetch()
        })
      return false
    }
  }
}
</script>

<style scoped>
#info {
  position: absolute;
  top: 250px;
  width: 100%;
}
.info-desc {
  width: 100px;
  display: inline-block;
}
.info-input {
  display: inline-block;
  max-width: 75%;
  min-width: 75%;
}
.info-item {
  margin-bottom: 10px;
}
#upload-confirm {
  margin-left: 74%;
  margin-top: 10px;
  margin-bottom: 50px;
}
#image-show {
  width: 300px;
  height: 150px;
}
#image-show img {
  width: 120px;
  height: 150px;
}
</style>
