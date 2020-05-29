<template>
  <div class="container">
    <div class="overlay"></div>
    <div class="options">
      <div
        class="options_sf music-off"
        :class="{ 'music-on': config.audioSwitch }"
        @click="toggleSound"
      >
        <img src="/anime-quiz/icons/sfIcon2.png" />
      </div>
      <div
        class="options_bg music-off"
        :class="{ 'music-on': config.sfxSwitch }"
        @click="toggleMusic"
      >
        <img src="/anime-quiz/icons/bgIcon2.png" />
      </div>
    </div>
    <div class="main">
      <div class="main_inner">
        <div class="main_inner__loading" :class="{ loaded: start }">
          <div class="bg">
            <img src="/anime-quiz/mars_sunburst.png" />
          </div>
          <div class="loader" @click="startQuiz">
            <div class="text">
              <span>V</span>
              <span>i</span>
              <span>d</span>
              <span>e</span>
              <span>o</span>
              <div class="s">
                <span>n</span>
                <span>a</span>
                <span>r</span>
                <span>u</span>
                <span>t</span>
                <span>o</span>
                <span>q</span>
                <span>u</span>
                <span>i</span>
                <span>z</span>
              </div>
            </div>
            <p>
              <button>Clique aqui para jogar</button>
            </p>
          </div>
        </div>
        <modal
          v-model="modal"
          :score="
            breadcrumbs.filter(({ classe }) => classe === 'correct').length
          "
          @click="initQuiz"
        />
        <loading v-if="loading"></loading>
        <template v-else>
          <div class="main_inner__title">
            <h1>{{ getQuestion }}</h1>
            <p>Clique em uma resposta</p>
            <a @click="hint = !hint">Precisa do nome do personagem?</a>
            <div v-show="hint" class="hint">{{ getHint }}</div>
          </div>
          <div class="main_inner__circle" :style="circle"></div>
          <div
            class="main_inner__feedback"
            :style="feedback.style"
            :class="feedback.classe"
          >
            {{ feedback.text }}
          </div>
          <div class="main_inner__answers">
            <div
              v-for="{ id, name } in answers"
              :key="id"
              class="answer"
              @mouseover="playSound(music.buttonClick)"
              @click="verifyAnswer(id)"
            >
              {{ name }}
            </div>
          </div>
        </template>

        <div class="main_inner__breadcrumbs">
          <div
            v-for="({ classe, status }, index) in breadcrumbs"
            :key="index"
            class="breadcrumb"
            :class="{ [classe]: status }"
          ></div>
        </div>
      </div>
    </div>
    <canvas class="grain"></canvas>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Loading from '~/components/global/Loading.vue';
import Modal from '~/components/global/Modal.vue';
import { Grain, Answers, Quiz } from '~/models';

export default Vue.extend({
  components: {
    Loading,
    Modal
  },
  data: (): Quiz => ({
    start: false,
    modal: false,
    hint: false,
    transitioning: false,
    loading: false,
    progress: 0,
    answers: [],
    breadcrumbs: [],
    scenes: [],
    circle: {
      background: '#fb741e',
      transform: 'translateY(-50%) scale(1)',
      transitionDuration: 'unset'
    },
    feedback: {
      text: '',
      classe: {
        correct: false,
        wrong: false
      },
      style: {
        transform: 'translateY(-50%) scale(0) rotate(20deg)'
      }
    },
    config: {
      audio: true,
      audioSwitch: true,
      sfxSwitch: true
    },
    music: {
      soundtrack: new Audio('/anime-quiz/music/naruto/11.mp3'),
      buttonClick: new Audio('/anime-quiz/music/effect/buttonclick.mp3'),
      correct: new Audio('/anime-quiz/music/effect/correct.mp3'),
      slide: new Audio('/anime-quiz/music/effect/slideslow.mp3'),
      wrong: new Audio('/anime-quiz/music/effect/wrong.mp3')
    },
    colors: [
      'rgb(67, 34, 56)',
      'rgb(218, 68, 103)',
      '#ea894f',
      '#3fde9d',
      '#4d352f'
    ]
  }),
  computed: {
    getQuestion() {
      const { question = { question: '' } } = this.scenes[this.progress] || {};
      return question.question;
    },
    getHint() {
      const { tip = '' } = this.scenes[this.progress] || {};
      return tip;
    }
  },
  mounted() {
    this.initQuiz();
  },
  methods: {
    async initQuiz() {
      try {
        this.loading = true;
        this.scenes = await this.$axios.$get<Answers[]>('/quiz');
        this.music.wrong.volume = 0.2;
        this.setUp();
        new Grain();
        this.initScene();
      } catch (error) {
      } finally {
        this.loading = false;
      }
    },
    async checkAnswer(answer_id: number): Promise<boolean> {
      try {
        this.loading = true;
        const { id, question, photo } = this.scenes[this.progress];
        const { correct } = await this.$axios.$post('/verify', {
          question: question.id,
          character: question.id === 1 ? photo : id,
          answer: answer_id
        });
        return correct;
      } catch (error) {
        return false;
      } finally {
        this.loading = false;
      }
    },
    initScene() {
      this.setBreadcrumbs('active');
      this.hint = false;
      const { answers, photo } = this.scenes[this.progress];
      this.circle.background = `url(${photo}) no-repeat`;
      this.answers = answers;
    },
    setUp() {
      this.modal = false;
      this.progress = 0;
      this.transitioning = false;
      this.breadcrumbs = [];
      this.hint = false;
      this.changeColorBody();
      this.scenes.forEach(() => {
        this.breadcrumbs.push({
          classe: '',
          status: true
        });
      });
    },
    async verifyAnswer(answer_id: number) {
      if (this.transitioning) return;
      this.transitioning = true;
      if (await this.checkAnswer(answer_id)) {
        this.playSound(this.music.correct);
        this.feedback.text = 'Correct';
        this.feedback.classe.correct = true;
        this.feedback.classe.wrong = false;
        this.setBreadcrumbs('correct');
      } else {
        this.playSound(this.music.wrong);
        this.feedback.text = 'Wrong';
        this.feedback.classe.correct = false;
        this.feedback.classe.wrong = true;
        this.setBreadcrumbs('wrong');
      }

      this.feedback.style.transform = 'translateY(-50%) scale(1) rotate(0deg)';

      if (this.progress === this.scenes.length - 1) {
        this.modal = true;
        this.feedback.style.transform =
          'translateY(-50%) scale(0) rotate(20deg)';
      } else {
        this.progress++;

        await this.timer(230);

        this.circle.transform = `translateY(-50%) scale(10)`;

        this.circle.background = '#7f1919';

        await this.timer(640);

        this.changeColorBody();

        this.circle.transform = `translateY(-50%) scale(0)`;

        this.circle.transitionDuration = '0ms';

        this.feedback.style.transform =
          'translateY(-50%) scale(0) rotate(20deg)';

        await this.timer(100);

        if (window.innerWidth > 1000) {
          this.circle.transform = 'translateY(-50%) scale(1)';
        } else {
          this.circle.transform = 'translateY(calc(-50% - 110px)) scale(0.6)';
        }

        this.circle.transitionDuration = '500ms';
        this.playSound(this.music.slide);
        this.initScene();
        this.transitioning = false;
      }
    },
    timer(ms: number) {
      return new Promise((resolve) => setTimeout(() => resolve(), ms));
    },
    startQuiz() {
      this.start = true;
      this.playAudio(this.music.soundtrack);
    },
    setBreadcrumbs(classe: string, status = true) {
      this.breadcrumbs[this.progress] = {
        classe,
        status
      };
    },
    playSound(sound: HTMLAudioElement) {
      if (this.config.audio) {
        sound.play();
      }
    },
    playAudio(sound: HTMLAudioElement) {
      sound.loop = true;
      sound.volume = 0.7;
      sound.play();
    },
    toggleMusic() {
      const { audio, sfxSwitch } = this.config;
      this.config.audio = !audio;
      this.config.sfxSwitch = !sfxSwitch;
    },
    toggleSound() {
      this.config.audioSwitch = !this.config.audioSwitch;
      if (this.config.audioSwitch) {
        this.music.soundtrack.volume = 0.7;
      } else {
        this.music.soundtrack.volume = 0;
      }
    },
    changeColorBody() {
      const body = document.querySelector('body');
      if (body) {
        body.style.background = this.colors[this.progress];
        body.style.overflow = 'hidden';
      }
    }
  }
});
</script>

<style lang="scss">
@import '~/assets/components/quiz.scss';
</style>
