<template>
  <div class="container">
    <div class="overlay"></div>
    <div class="options">
      <div
        class="options_sf"
        :class="{ 'music-on': audioSwitch, 'music-off': !audioSwitch }"
        @click="toggleSound"
      >
        <img
          src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/217233/sfIcon2.png"
        />
      </div>
      <div
        class="options_bg"
        :class="{ 'music-on': sfxSwitch, 'music-off': !sfxSwitch }"
        @click="toggleMusic"
      >
        <img
          src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/217233/bgIcon2.png"
        />
      </div>
    </div>
    <div class="main">
      <div class="main_inner">
        <div class="main_inner__loading" :class="{ loaded: start }">
          <div class="bg">
            <img
              src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/217233/mars_sunburst.png"
            />
          </div>
          <div class="loader" @click="startQuiz">
            <div class="text">
              <span>V</span>
              <span>i</span>
              <span>d</span>
              <span>e</span>
              <span>o</span>
              <div class="s">
                <span>g</span>
                <span>a</span>
                <span>m</span>
                <span>e</span>
                <span></span>
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
        <!-- <modal v-model="modal">
          <h1>Quiz complete!</h1>
          <p class="score">You got {{ countCorrect }} out of 6 correct!</p>
          <button class="share" @click="initQuiz">Jogar Novamente</button>
        </modal> -->
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
        <div class="main_inner__logo">
          <a href="">
            <img
              src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/217233/vgqlogo.svg"
            />
          </a>
        </div>
        <div class="main_inner__title">
          <h1>In what popular video game would you find this?</h1>
          <p>Click on an answer or use the number keys</p>
          <a @click="hint = !hint">Need a hint?</a>
          <div v-show="hint" class="hint">{{ getHint }}</div>
        </div>
        <div ref="circle" class="main_inner__circle" :style="circleColor"></div>
        <div
          ref="feedback"
          class="main_inner__feedback"
          :class="{ wrong, correct }"
        >
          {{ correct ? 'Correct' : 'Wrong' }}
        </div>
        <div class="main_inner__scenes">
          <div ref="scene-akuaku" class="scene akuaku">
            <div class="container">
              <div class="feather"></div>
              <div class="feather"></div>
              <div class="feather"></div>
              <div class="feather"></div>
              <div class="body"></div>
              <div class="eyebrows"></div>
              <div class="eyebrows"></div>
              <div class="eye"></div>
              <div class="eye"></div>
              <div class="nose"></div>
              <div class="lip"></div>
              <div class="lip"></div>
              <div class="beard"></div>
              <div class="beard"></div>
            </div>
          </div>
        </div>
        <div class="main_inner__answers">
          <div
            v-for="answer in answers"
            :key="answer"
            class="answer"
            @mouseover="playSound(buttonClick)"
            @click="verifyAnswer(answer)"
          >
            {{ answer }}
          </div>
        </div>
        <div class="main_inner__breadcrumbs" style="width: 170px;">
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
// import Modal from '~/components/global/Modal.vue';

export default Vue.extend({
  // components: {
  //   Modal
  // },
  data: () => ({
    start: false,
    wrong: false,
    correct: false,
    modal: false,
    hint: false,
    transitioning: false,
    progress: 0,
    countCorrect: 0,
    sceneDelay: 870,
    breadcrumbs: [
      {
        classe: '',
        status: false
      }
    ],
    circleScale: 10,
    audioSwitch: true,
    sfxSwitch: true,
    answer: '',
    answers: [],
    scenes: [
      {
        name: 'akuaku', // Must mirror class name
        author: 'João Santos', // Your name
        codepenprofile: 'jotavejv', // Your Codepen profile link
        twitterprofile: '_jotavejv', // Your Codepen profile link
        answer: 'Crash Bandicoot', // The correct game, we can obfuscate this later if we want to hide answers
        backgroundColor: 'rgb(67, 34, 56)', // Page background color for your scene
        hint: 'UKA UKA is FREEEEE!'
      },
      {
        name: 'kirby', // Must mirror class name
        author: 'Katherine Kato', // Your name
        codepenprofile: 'kathykato', // Your Codepen profile link
        twitterprofile: 'kato_katherine', // Your Codepen profile link
        answer: 'Kirby', // The correct game, we can obfuscate this later if we want to hide answers
        backgroundColor: 'rgb(218, 68, 103)', // Page background color for your scene
        hint: 'A Nintendo classic'
      },
      {
        name: 'hexipal', // Must mirror class name
        author: 'Kristopher Van Sant', // Your name
        codepenprofile: 'KristopherVanSant', // Your Codepen profile link
        twitterprofile: 'KristopherVanSant', // Your Codepen profile link
        answer: 'Broken Age', // The correct game, we can obfuscate this later if we want to hide answers
        backgroundColor: '#ea894f', // Page background color for your scene
        hint: 'An animated puzzle adventure'
      },
      {
        name: 'moogle', // Must mirror class name
        author: 'Jasmine Wright', // Your name
        codepenprofile: 'jnwright', // Your Codepen profile link
        twitterprofile: 'salsaverde', // Your Codepen profile link
        answer: 'Final Fantasy', // The correct game, we can obfuscate this later if we want to hide answers
        backgroundColor: '#3fde9d', // Page background color for your scene
        hint: 'Kupo!'
      },
      {
        name: 'mario', // Must mirror class name
        author: 'Klara Miffili', // Your name
        codepenprofile: 'miffili', // Your Codepen profile link
        twitterprofile: 'KlaraMiffili', // Your Codepen profile link
        answer: 'Mario Brothers', // The correct game, we can obfuscate this later if we want to hide answers
        backgroundColor: '#fb741e', // Page background color for your scene
        hint: 'Letsa gooooooo!'
      },
      {
        name: 'buster', // Must mirror class name
        author: 'Jamie Coulter', // Your name
        codepenprofile: 'jcoulterdesign', // Your Codepen profile link
        twitterprofile: 'jamiecoulter89', // Your Codepen profile link
        answer: 'Final Fantsy 7', // The correct game, we can obfuscate this later if we want to hide answers
        backgroundColor: '#4d352f', // Page background color for your scene
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
    globals: {
      audio: true
    },
    buttonClick: new Audio(
      'https://s3-us-west-2.amazonaws.com/s.cdpn.io/217233/Buttonclick.mp3'
    ),
    featured: new Audio(
      'https://s3-us-west-2.amazonaws.com/s.cdpn.io/217233/featured.mp3'
    ),
    slideSlow: new Audio(
      'https://s3-us-west-2.amazonaws.com/s.cdpn.io/217233/slideSlow.mp3'
    ),
    wrongSound: new Audio(
      'https://s3-us-west-2.amazonaws.com/s.cdpn.io/217233/Wrong.mp3'
    ),
    bg: new Audio('/music/naruto/11.mp3')
  }),
  computed: {
    getHint() {
      return this.scenes[this.progress].hint;
    },
    circleColor() {
      const color = [
        '#fb741e',
        '#fb741e',
        '#3fde9d',
        '#ea894f',
        'rgb(218, 68, 103)',
        'rgb(67, 34, 56)'
      ];
      return {
        background: color[this.progress]
      };
    }
  },
  mounted() {
    this.initQuiz();
  },
  methods: {
    initQuiz() {
      this.wrongSound.volume = 0.2;
      this.setUp();
      const el = document.querySelector('.grain');
      // eslint-disable-next-line no-new
      new Grain(el);
      this.initScene();
    },
    initScene() {
      this.setBreadcrumbs('active');
      this.hint = false;
      const rand = Math.floor(Math.random() * (this.videoGames.length - 1));
      const scenes = this.scenes.find(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        (el, index) => index === this.progress
      );
      if (!scenes) return;
      const itens = [
        scenes.answer as string,
        this.videoGames[rand],
        this.videoGames[rand - 1]
      ];
      const shuffleArray = (arr: Array<string>) =>
        arr
          .map((a) => [Math.random(), a])
          .sort((a: any, b: any) => a[0] - b[0])
          .map((a: any) => a[1]);
      this.answers = shuffleArray(itens) as never[];
      this.answer = this.answers.find((el) => el === scenes.answer) || '';
    },
    setUp() {
      this.modal = false;
      this.progress = 0;
      this.countCorrect = 0;
      this.transitioning = false;
      this.breadcrumbs = [];
      this.hint = false;
      this.scenes.forEach(() => {
        this.breadcrumbs.push({
          classe: '',
          status: true
        });
      });
      const body = document.querySelector('body');
      if (body) {
        body.style.background = this.scenes[this.progress].backgroundColor;
        body.style.overflow = 'hidden';
      }
    },
    verifyAnswer(answer: string) {
      if (!this.transitioning) {
        this.transitioning = true; // Check if not mid transition
        if (this.checkAnswer(answer)) {
          this.playSound(this.featured);
          this.wrong = false;
          this.correct = true;
          this.countCorrect++;
          this.setBreadcrumbs('correct');
        } else {
          this.playSound(this.wrongSound);
          this.wrong = true;
          this.correct = false;
          this.setBreadcrumbs('wrong');
        }
        const feedback = this.$refs.feedback as HTMLElement;
        feedback.style.transform = 'translateY(-50%) scale(1) rotate(0deg)';
        this.progress++;

        if (this.progress === this.scenes.length) {
          this.modal = true;
          feedback.style.transform = 'translateY(-50%) scale(0) rotate(20deg)';
        } else {
          const circle = this.$refs.circle as HTMLElement;

          setTimeout(() => {
            circle.style.transform = `translateY(-50%) scale(${this.circleScale})`;
          }, 230);

          setTimeout(() => {
            const body = document.querySelector('body');
            if (body) {
              body.style.background = this.scenes[
                this.progress
              ].backgroundColor;
            }

            circle.style.transform = `translateY(-50%) scale(0)`;
            circle.style.transitionDuration = '0ms';

            feedback.style.transform =
              'translateY(-50%) scale(0) rotate(20deg)';
          }, this.sceneDelay);

          setTimeout(() => {
            if (window.innerWidth > 1000) {
              circle.style.transform = 'translateY(-50%) scale(1)';
            } else {
              circle.style.transform =
                'translateY(calc(-50% - 110px)) scale(0.6)';
            }
            circle.style.transitionDuration = '500ms';

            this.playSound(this.slideSlow);

            this.initScene();
            this.transitioning = false;
          }, this.sceneDelay + 100);
        }
      }
    },
    checkAnswer(answer: string) {
      return this.answer === answer;
    },
    startQuiz() {
      this.start = true;
      // this.playAudio(this.bg);
    },
    setBreadcrumbs(classe: string, status = true) {
      this.breadcrumbs[this.progress] = {
        classe,
        status
      };
    },
    playSound(sound: HTMLAudioElement) {
      if (this.globals.audio) {
        sound.play(); // Play sound
      }
    },
    playAudio(sound: HTMLAudioElement) {
      sound.loop = true;
      sound.volume = 0.7;
      sound.play(); // Play sound
    },
    toggleMusic() {
      this.globals.audio = !this.globals.audio;
      this.sfxSwitch = !this.sfxSwitch;
    },
    toggleSound() {
      this.audioSwitch = !this.audioSwitch;
      if (this.audioSwitch) {
        this.bg.volume = 0.7;
      } else {
        this.bg.volume = 0;
      }
    },
    lightenDarkenColor(col: any, amt: any) {
      let usePound = false;
      if (col[0] === '#') {
        col = col.slice(1);
        usePound = true;
      }
      const num = parseInt(col, 16);
      let r = (num >> 16) + amt;
      if (r > 255) r = 255;
      else if (r < 0) r = 0;
      // eslint-disable-next-line prettier/prettier
        let b = ((num >> 8) & 0x00FF) + amt;
      if (b > 255) b = 255;
      else if (b < 0) b = 0;
      // eslint-disable-next-line prettier/prettier
        let g = (num & 0x0000FF) + amt;
      if (g > 255) g = 255;
      else if (g < 0) g = 0;
      return (usePound ? '#' : '') + (g | (b << 8) | (r << 16)).toString(16);
    }
  }
});
</script>

<style lang="scss" scoped>
@import '~/assets/components/quiz.scss';
.music-on {
  opacity: 1;
}
.music-off {
  opacity: 0.4;
}
.answer {
  animation: mymove;
  animation-duration: 1000ms;
  animation-delay: 0ms;
}
.scene {
  display: block !important;
}

@keyframes mymove {
  0% {
    left: 200px;
    opacity: 0;
  }
  100% {
    left: 0;
    opacity: 1;
  }
}
</style>
