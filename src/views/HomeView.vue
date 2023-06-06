<script setup lang="ts">
import PlayerContainer from '@/components/containers/player/PlayerContainer.vue';

</script>

<template>
  <PlayerContainer />
</template>

<style scoped lang="scss">
.home-main {
  display: flex;
  background: var(--app-background-color);

  .editor-wrapper {
    flex-shrink: 0;
    color: black;

    .player-container {
      display: flex;
      justify-content: flex-start;
    }
  }
}
</style>