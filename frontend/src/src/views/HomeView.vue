<script setup>
import { ref, computed } from 'vue';
import axios from "axios"
import { ElMessage } from 'element-plus'

const uid = ref('')
const fliter = ref('')

const author_name = ref('未知')
const isload = ref(false)
const isshow = ref(false)

const comments_num = ref(0)
const comments_data = ref([])

const data_filter = computed(() => {
  const fliter_text = fliter.value
  return comments_data.value.filter(ele => ele.reply_text.includes(fliter_text) || ele.author_name.includes(fliter_text) || ele.reply_time.includes(fliter_text) || ele.author_id.includes(fliter_text) || ele.author_uid.includes(fliter_text))
})

function submitQuery() {
  isload.value = true
  if (uid.value.length > 16) {
    ElMessage.error("请输入合法uid！")
    isload.value = false
    return
  }

  axios.get(`${window._TEST_SERVER}/Fuzzy/${uid.value}`).then(
    (res) => {
      if (res.status != 200) {
        ElMessage.error("查询失败，请输入合法uid")
        return
      }

      if (res.data.length == 0) {
        ElMessage.info("未找到相关记录")
        isload.value = false
        isshow.value = false
        return
      }

      const arr = res.data.map(ele => ele["reply_id"])

      let query_arr = {
        arr: arr
      }

      console.log(res.data.map(ele => ele["reply_id"]))

      axios.post(`${window._TEST_SERVER}/BatchExist`, query_arr).then(
        (res) => {
          let index = 0
          for (const tid of res.data) {
            comments_data.value[index].tid = tid
            index++
          }
        }
      )

      comments_num.value = res.data.length
      comments_data.value = res.data

      isload.value = false
      isshow.value = true

      if (comments_num != 0) {
        author_name.value = res.data[0]["author_name"]
      }


    }
  )

}
</script>

<template>
  <el-main>
    <h2 style="text-align: center;">豆瓣魂组-公示管理记录模糊查询(2023年5月前)</h2>
    <el-row>
      <el-input placeholder="模糊搜索将根据用户名与文本进行查询" v-model="uid"></el-input>
    </el-row>
    <el-row justify="center">
      <el-button type="info" :loading="isload" style="text-align: center;margin-top: 10px;" size="large"
        @click="submitQuery">点击查询</el-button>
    </el-row>

    <div v-if="isshow" style="text-align:center">

      <h2>相关记录：</h2>

      <el-input v-model="fliter" style="display: inline-block;width:300px" placeholder="记录模糊过滤">
      </el-input>

      <el-table :data="data_filter" height="1000" style="width: 100%">
        <el-table-column prop="author_name" label="回帖人id" />
        <el-table-column prop="reply_text" label="回复内容" />
        <el-table-column prop="reply_time" label="日期" />
        <el-table-column prop="tid" label="原帖" />
      </el-table>
    </div>

  </el-main>
</template>
