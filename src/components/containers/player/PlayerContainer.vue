<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { FFmpegController } from './FFmpegController';

let loaded = ref(false);
let ffmpegController: FFmpegController;

onMounted(async () => {
  ffmpegController = new FFmpegController()
  await ffmpegController.init();
  loaded.value = true;
})

const splitAudioFromVideo = () => {
  ffmpegController.splitAudioFromVideo()
}
</script>

<template>
  <aside>
    <button :disabled="!loaded" @click="splitAudioFromVideo()">从视频中分离音频</button>
  </aside>
</template>

<style scoped lang="scss">
.button-group {
  display: flex;
}
</style>