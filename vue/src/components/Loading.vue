<template>
  <div @touchmove.prevent class="loading" v-if="show">
    <div class="spinner">
      <div class="bounce" />
    </div>
  </div>
</template>

<script>
export default {
    name: 'loading',
    props: {
        show: {
            type: Boolean,
            default: false,
        },
    }
};
</script>

<style>
.loading {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  max-height: 100vh;
  background: transparent;
  display: flex;
  align-items: center;
}
  .spinner {
    width: 0.4rem;
    height: 0.4rem;
    position: relative;
    margin: 0 auto;
  }

  .bounce,
  .spinner::before,
  .spinner::after {
    width: 0.4rem;
    height: 0.4rem;
    background-color: rgba(0, 0, 0, 0.514);
    border-radius: 100%;
    animation: bouncedelay 1.4s infinite ease-in-out;
    animation-fill-mode: both;
  }

  .spinner::before {
    content: " ";
    position: absolute;
    top: 0;
    left: -0.6rem;
    animation-delay: -0.32s;
  }

  .bounce {
    animation-delay: -0.16s;
  }

  .spinner::after {
    content: " ";
    position: absolute;
    top: 0;
    right: -0.6rem;
  }

  @keyframes bouncedelay {
    0%,
    80%,
    100% {
      transform: scale(0);
    }
    40% {
      transform: scale(1);
    }
  }

</style>
