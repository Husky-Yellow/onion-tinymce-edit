<template>
  <div class="grid-container">
    <div class="left-column">
      <Tinymce ref="tinyMceChildRef" :editorId="'problemBody'" v-model:value="val" />
      <button @click="submit" style="margin: 10px">提交</button>
      <button @click="tranformValue" style="margin: 10px">回显</button>
    </div>
    <div class="right-column">
      <PreviewIframe :problemDetail="JSON.parse(JSON.stringify(targetValue))" />
    </div>
  </div>
</template>

<script setup>
import 'katex/dist/katex.css'
import Tinymce from "./components/Tinymce.vue";
import PreviewIframe from './components/PreviewIframe.vue'
import { ref, computed } from 'vue';
import { formTranFormValue, processLatexInBody } from "./utils/form";
const val = ref("");
const target = ref('<p>111 $1\times 2\, =\, 2$<dot>111111111</dot></p>')
const tinyMceChildRef = ref();

const targetValue = computed(() => formTranFormValue(val.value))

const tranformValue = async () => {
  const body = target.value;
  let newStr = await processLatexInBody(body);
  newStr = newStr.replace(/<dot>(.*?)<\/dot>/g, "&lt;dot&gt;$1&lt;/dot&gt;")
  val.value = newStr;
  tinyMceChildRef.value.setContent(newStr);
}
const submit = () => {
  console.log(targetValue.value)
}
</script>

<style scoped>
.grid-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* 一行两列 */
  grid-gap: 10px; /* 可选的列间距 */
}

.left-column {
  padding: 10px; /* 可选的内边距 */
  min-width: 600px;
}

.right-column {
  padding: 10px; /* 可选的内边距 */
  min-width: 500px;
}

</style>