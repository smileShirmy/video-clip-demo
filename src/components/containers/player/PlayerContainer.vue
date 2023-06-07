<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { FFmpegController } from './FFmpegController';

let loaded = ref(false);
let audioPath = ref('');
let ffmpeg: FFmpegController;

onMounted(async () => {
  ffmpeg = new FFmpegController()
  await ffmpeg.init();
  loaded.value = true;
})

const splitAudioFromVideo = async () => {
  const fileDir = ffmpeg.paths.resource;
  const videoName = 'video-2'
  const format = 'mp4'
  const fileUrl = '/video/video-2.mp4'
  // 获取 /public/ 下的 video/video-2.mp4 并且写入到内存中
  await ffmpeg.writeFile(fileDir, `${videoName}.${format}`, fileUrl);
  const res = await ffmpeg.splitAudioFromVideo(videoName, format)
// ffmpeg.getFileUrl(ffmpeg.paths.audio, '')
}
</script>

<template>
  <aside>
    <button :disabled="!loaded" @click="splitAudioFromVideo()">从视频中分离音频</button>
  </aside>
  <audio :src="audioPath" controls></audio>
</template>

<style scoped lang="scss">
.button-group {
  display: flex;
}
</style>