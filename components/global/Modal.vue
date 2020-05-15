<template>
  <div class="modal-wrapper" :class="{ open: value }">
    <div class="modal">
      <div class="head">
        <a class="btn-close trigger" @click="$emit('input', false)">
          <i class="fa fa-times" aria-hidden="true"></i>
        </a>
      </div>
      <div class="content">
        <slot />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  props: {
    value: {
      type: Boolean,
      default: false
    }
  }
});
</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css?family=Montserrat:400,700');

.blur-it {
  filter: blur(4px);
}

.modal-wrapper {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(41, 171, 164, 0.8);
  visibility: hidden;
  opacity: 0;
  transition: all 0.25s ease-in-out;
}

.modal-wrapper.open {
  opacity: 1;
  visibility: visible;
}

.modal {
  width: 600px;
  height: 400px;
  display: block;
  margin: 50% 0 0 -300px;
  position: relative;
  top: 50%;
  left: 50%;
  background: #fff;
  opacity: 0;
  transition: all 0.5s ease-in-out;
}

.modal-wrapper.open .modal {
  margin-top: -200px;
  opacity: 1;
}

.head {
  height: 54px;
  padding: 12px 30px;
  overflow: hidden;
  background: #e2525c;
}

.btn-close {
  font-size: 28px;
  display: block;
  float: right;
  color: #fff;
}

.content {
  padding: 10%;
}

.good-job {
  text-align: center;
  font-family: 'Montserrat', Arial, Helvetica, sans-serif;
  color: #e2525c;
}
.good-job .fa-thumbs-o-up {
  font-size: 60px;
}
.good-job h1 {
  font-size: 45px;
}
</style>
