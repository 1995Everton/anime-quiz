<template>
  <div class="main_inner" :class="{ 'd-block': value }">
    <div class="main_inner__modalOverlay"></div>
    <div class="main_inner__modal"></div>
    <div class="main_inner__modalContent">
      <h1>Quiz completado!</h1>
      <p class="score">Você acertou {{ score }} em 5!</p>
      <p>
        Muito obrigado por jogar, volte sempre que quiser testar seu
        conhecimento em Naruto
      </p>
      <button class="share" @click="$emit('click')">Jogar Novamente</button>
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
    },
    score: {
      type: Number,
      default: 0
    }
  }
});
</script>

<style lang="scss" scoped>
.main_inner {
  display: none;
  &__modal,
  &__modalContent {
    text-align: center;
    button {
      opacity: 1;
      border: none;
      background: #00b3ff;
      padding: 20px 30px 17px 30px;
      color: white;
      border-radius: 7px;
      font-size: 17px;
      margin-top: 30px;
      font-family: 'Retrocycles';
    }
    h1 {
      font-family: 'Retrocycles';
      font-size: 50px;
      margin: 0;
      color: #3a2132;
    }
    position: fixed;
    -webkit-animation: squiggly-anim 0.3s linear infinite,
      scale_bounce_expo 1s 0s forwards;
    animation: squiggly-anim 0.3s linear infinite;
    width: 500px;
    background: white;
    padding: 50px;
    border-radius: 20px;
    left: 0;
    right: 0;
    margin: auto;
    z-index: 3;
    height: 450px;
    top: 50%;
    -webkit-transform: translateY(-50%);
    transform: translateY(-50%);

    .score {
      font-size: 30px;
      color: #bd2b2b;
    }

    a {
      display: block;
      margin: 10px 0;
      font-weight: 700;
      color: #3a2031;
      text-decoration: underline;
    }

    @media only screen and (max-width: 650px) {
      width: calc(100% - 50px);
    }
  }

  &__modalContent {
    animation: none;
    background: transparent !important;
  }

  &__modalOverlay {
    position: fixed;
    height: 100%;
    width: 100%;
    background: rgba(39, 33, 86, 0.7686274509803922);
    left: 0;
    top: 0;
    z-index: 2;
  }
}
</style>
