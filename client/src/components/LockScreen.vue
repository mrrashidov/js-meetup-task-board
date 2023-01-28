<script>
export default {
  data() {
    return {
      bgImage: "https://source.unsplash.com/random/1920x1080/?city,night",
      pinLength: 4,
      pinInput: [],
      error: null,
    };
  },
  methods: {
    keydownHandler(event, index) {
      event.stopPropagation();
      event.preventDefault();
      this.error = null;
      if (event.keyCode == 8) {
        this.pinInput[index - 1] = "";
        this.pinInput[index - 2] = "";
        this.$nextTick(() => {
          this.goto(index - 1);
        });
      }

      if (
        (event.keyCode >= 48 && event.keyCode <= 57) ||
        (event.keyCode >= 96 && event.keyCode <= 105)
      ) {
        this.pinInput[index - 1] = event.key;
        this.$nextTick(() => {
          this.goto(index + 1);
        });
        if (index === this.pinLength) {
          this.check();
        }
      }

      if (event.keyCode === 39 && index !== pinLength) {
        this.$nextTick(() => {
          goto(index + 1);
        });
      }

      if (event.keyCode === 37) {
        this.$nextTick(() => {
          goto(index - 1);
        });
      }
    },
    reset() {
      document.getElementById("pinForm").reset();
      this.pinInput = new Array(this.pinLength).fill("");
    },
    check() {
      const pin =
        localStorage.getItem("pin") || Array(this.pinLength).fill(0).join("");
      if (this.pinInput.join("") === pin) {
        console.log("Correct!");
      } else {
        console.log("err!");
        this.error = "Wrong PIN number!";
      }
      this.reset();
    },
    goto(n) {
      if (!n || n > this.pinLength) {
        n = 1;
      }
      let el = document.querySelector(`input[name=pin${n}]`);
      el.focus();
    },
  },
  mounted() {
    setInterval(() => {
      // Add a unique query parameter to the image URL
      this.bgImage = `https://source.unsplash.com/random/1920x1080/?city,night&t=${Date.now()}`;
    }, 60000);
  },
};
</script>

<template>
  <section id="login" class="relative">
    <div class="absolute z-0">
      <img :src="data.bgImage" :key="data.bgImage" />
    </div>

    <div
      class="relative z-10 bg-slate-900 bg-opacity-60 flex flex-col h-screen justify-center items-center"
    >
      <div class="h-48">
        <p class="font-semibold text-white text-center text-4xl mb-4">
          Enter PIN Code
        </p>
        <form id="pinForm" class="flex">
          <div v-for="i in data.pinLength" :key="i">
            <input
              type="text"
              :name="'pin' + i"
              @keydown="keydownHandler($event, i)"
              @keydown.ctrl.a.prevent
              @mousemove.prevent.stop
              :value="data.pinInput[i - 1] != '' ? data.pinInput[i - 1] : ''"
              :autofocus="i == 1"
              placeholder=""
              maxlength="1"
              class="bg-slate-800 py-5 mx-1 text-white text-4xl unselectable font-bold rounded border border-sky-500 inline w-20 text-center select-none transition-all focus:outline-none focus:ring focus:ring-sky-300"
            />
          </div>
        </form>
        <div
          v-if="data.error"
          class="bg-rose-900 bg-opacity-50 rounded px-2 m-4 font-bold"
        >
          <p class="text-rose-500 text-center">{{ data.error }}</p>
        </div>
      </div>
    </div>
  </section>
</template>
<style scoped>
#login {
  overflow: hidden;
  background: black;
}
.z-10 {
  /* -webkit-box-shadow: inset 0px 0px 200px 200px rgba(0,0,0,0.75);
  -moz-box-shadow: inset 0px 0px 200px 200px rgba(0,0,0,0.75); */
  box-shadow: inset 0px 0px 800px 200px rgba(0, 0, 0, 0.75);
}
img {
  display: block;
  width: 100vw;
  height: 100vh;
  object-fit: cover; /* or object-fit: contain; */
}
</style>
