<template>
  <div class="container">
    <div class="overlay"></div>
    <div class="options">
      <div
        class="options_sf music-off"
        :class="{ 'music-on': config.audioSwitch }"
        @click="toggleSound"
      >
        <img src="/icons/sfIcon2.png" />
      </div>
      <div
        class="options_bg music-off"
        :class="{ 'music-on': config.sfxSwitch }"
        @click="toggleMusic"
      >
        <img src="/icons/bgIcon2.png" />
      </div>
    </div>
    <div class="main">
      <div class="main_inner">
        <div class="main_inner__loading" :class="{ loaded: start }">
          <div class="bg">
            <img src="/mars_sunburst.png" />
          </div>
          <div class="loader" @click="startQuiz">
            <div class="text">
              <span>V</span>
              <span>i</span>
              <span>d</span>
              <span>e</span>
              <span>o</span>
              <div class="s">
                <span>a</span>
                <span>n</span>
                <span>i</span>
                <span>m</span>
                <span>e</span>
                <span>q</span>
                <span>u</span>
                <span>i</span>
                <span>z</span>
              </div>
            </div>
            <p>
              <button>Click anywhere to play</button>
            </p>
          </div>
        </div>
        <div
          class="main_inner__modalOverlay"
          :class="{ 'd-block': modal }"
        ></div>
        <div class="main_inner__modal" :class="{ 'd-block': modal }"></div>
        <div class="main_inner__modalContent" :class="{ 'd-block': modal }">
          <h1>Quiz complete!</h1>
          <p class="score">You got 7 out of 8 correct!</p>
          <p>
            Don't forget to follow the talented bunch that contributed to this
            pen. They are:
          </p>
          <button class="share" @click="initQuiz">Jogar Novamente</button>
        </div>
        <div class="main_inner__title">
          <h1>In what popular video game would you find this?</h1>
          <p>Click on an answer</p>
          <a @click="hint = !hint">Need a hint?</a>
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
            v-for="answer in answers"
            :key="answer"
            class="answer"
            @mouseover="playSound(music.buttonClick)"
            @click="verifyAnswer(answer)"
          >
            {{ answer }}
          </div>
        </div>
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
import { Grain } from '~/components/Grain.js';

export default Vue.extend({
  data: () => ({
    start: false,
    modal: false,
    hint: false,
    transitioning: false,
    progress: 0,
    answer: '',
    answers: [],
    breadcrumbs: [
      {
        classe: '',
        status: false
      }
    ],
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
    scenes: [
      {
        answer: 'Crash Bandicoot',
        backgroundColor: 'rgb(67, 34, 56)',
        photo:
          'https://vignette.wikia.nocookie.net/naruto/images/8/8d/UchihaItachi.png/revision/latest/scale-to-width-down/310?cb=20180420021356&path-prefix=pt-br',
        hint: 'UKA UKA is FREEEEE!'
      },
      {
        answer: 'Kirby',
        backgroundColor: 'rgb(218, 68, 103)',
        photo:
          'https://vignette.wikia.nocookie.net/naruto/images/8/8d/UchihaItachi.png/revision/latest/scale-to-width-down/310?cb=20180420021356&path-prefix=pt-br',
        hint: 'A Nintendo classic'
      },
      {
        answer: 'Broken Age',
        backgroundColor: '#ea894f',
        photo:
          'https://vignette.wikia.nocookie.net/naruto/images/8/8d/UchihaItachi.png/revision/latest/scale-to-width-down/310?cb=20180420021356&path-prefix=pt-br',
        hint: 'An animated puzzle adventure'
      },
      {
        answer: 'Final Fantasy',
        backgroundColor: '#3fde9d',
        photo:
          'https://vignette.wikia.nocookie.net/naruto/images/8/8d/UchihaItachi.png/revision/latest/scale-to-width-down/310?cb=20180420021356&path-prefix=pt-br',
        hint: 'Kupo!'
      },
      {
        answer: 'Mario Brothers',
        backgroundColor: '#fb741e',
        photo:
          'https://vignette.wikia.nocookie.net/naruto/images/8/8d/UchihaItachi.png/revision/latest/scale-to-width-down/310?cb=20180420021356&path-prefix=pt-br',
        hint: 'Letsa gooooooo!'
      },
      {
        answer: 'Final Fantsy 7',
        backgroundColor: '#4d352f',
        photo:
          'https://vignette.wikia.nocookie.net/naruto/images/8/8d/UchihaItachi.png/revision/latest/scale-to-width-down/310?cb=20180420021356&path-prefix=pt-br',
        hint: '1997 JRPG for PS1!'
      }
    ],
    videoGames: [
      'Pong',
      'Zork',
      'Space Invaders',
      'Asteroids',
      'Pac-Man',
      'Defender',
      'Donkey Kong',
      'Frogger',
      'Galaga',
      'Joust',
      'Ms. Pac-Man',
      'Pitfall!',
      'Tetris',
      'Gauntlet',
      'Super Mario Bros.',
      'The Legend of Zelda',
      'Contra',
      'Double DrvideoGamesagon',
      'Grand Theft Auto',
      'Half-Life 2',
      'Katamari Damacy',
      'Metal Gear Solid 3',
      'World of Warcraft',
      'Civilization IV',
      'Devil May Cry 3',
      'God of War',
      'Guitar Hero',
      'Resident Evil 4',
      'Shadow of the Colossus',
      'Tom Clancys Splinter Cell',
      'The Elder Scrolls IV',
      'Gears of War',
      'Ōkami',
      'Spiderman',
      'Tomb Raider',
      'Wii Sports',
      'BioShock',
      'Call of Duty 4: Modern Warfare'
    ],
    config: {
      audio: true,
      audioSwitch: true,
      sfxSwitch: true
    },
    music: {
      soundtrack: new Audio('/music/naruto/11.mp3'),
      buttonClick: new Audio('/music/effect/buttonclick.mp3'),
      correct: new Audio('/music/effect/correct.mp3'),
      slide: new Audio('/music/effect/slideslow.mp3'),
      wrong: new Audio('/music/effect/wrong.mp3')
    }
  }),
  computed: {
    getHint() {
      const { hint = '' } = this.scenes[this.progress] || {};
      return hint;
    }
  },
  mounted() {
    this.initQuiz();
  },
  methods: {
    initQuiz() {
      this.music.wrong.volume = 0.2;
      this.setUp();
      new Grain();
      this.initScene();
    },
    initScene() {
      this.setBreadcrumbs('active');
      this.hint = false;
      const rand = Math.floor(Math.random() * (this.videoGames.length - 1));
      const { answer, photo } = this.scenes[this.progress];
      this.circle.background = `url(${photo}) no-repeat`;
      this.answer = answer;
      const itens = [answer, this.videoGames[rand], this.videoGames[rand - 1]];
      const shuffleArray = (arr: Array<string>) =>
        arr
          .map((a) => [Math.random(), a])
          .sort((a: any, b: any) => a[0] - b[0])
          .map((a: any) => a[1]);
      this.answers = shuffleArray(itens) as never[];
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
    async verifyAnswer(answer: string) {
      if (this.transitioning) return;
      this.transitioning = true;
      if (this.answer === answer) {
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

        this.circle.background = '#fb741e';

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
        body.style.background = this.scenes[this.progress].backgroundColor;
        body.style.overflow = 'hidden';
      }
    }
  }
});
</script>

<style lang="scss" scoped>
@import '~/assets/components/quiz.scss';
</style>
