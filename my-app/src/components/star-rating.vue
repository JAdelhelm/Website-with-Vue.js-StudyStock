<template>
<!-- /**
 * Author: Jörg Adelhelm
 * Reviewed by: Niklas Kümmel
 */ -->

 <!-- Review Kommentar:
    Der Name der Vue-Datei sollte aufgebaut sein, wie bei den anderen Vue-Komponenten.
    Dies würde bedeuten, dass z.B. "StarRating.vue" eher zur restlichen Namensgebung passen würde.
  -->
  <div
    :class="[
      'vue-star-rating',
      { 'vue-star-rating-rtl': rtl },
      { 'vue-star-rating-inline': inline },
    ]"
  > 
    <div class="sr-only">
      <slot name="screen-reader" :rating="selectedRating" :stars="maxRating">
        <span>Rated {{ selectedRating }} stars out of {{ maxRating }}</span>
      </slot>
    </div>

    <div class="vue-star-rating" @mouseleave="resetRating">
      <span
        v-for="n in maxRating"
        :key="n"
        :class="[
          { 'vue-star-rating-pointer': !readOnly },
          'vue-star-rating-star',
        ]"
        :style="{ 'margin-right': margin + 'px' }"
      >
        <star
          :fill="fillLevel[n - 1]"
          :size="starSize"
          :points="starPoints"
          :star-id="n"
          :step="step"
          :active-color="currentActiveColor"
          :inactive-color="inactiveColor"
          :border-color="borderColor"
          :active-border-color="currentActiveBorderColor"
          :border-width="borderWidth"
          :rounded-corners="roundedCorners"
          :rtl="rtl"
          :glow="glow"
          :glow-color="glowColor"
          :animate="animate"
          @star-selected="setRating($event, true)"
          @star-mouse-move="setRating"
        />
      </span>
      <span
         v-if="showRating"
        :class="['vue-star-rating-rating-text', textClass]"
      > {{ formattedRating }}
        
      </span>

  


      </div> 
  </div>
 
  <!-- Review Kommentar:
    Für die Übersichtlichkeit wäre es besser,
    wenn eine oder mehrere Zeilen Platz zwischen dem "</template>"-Tag und dem folgenden "<script>"-Tag gelassen werden.
  -->
</template>
<script type="text/javascript">
import Star from './star.vue'
// import RatingService from "../services/RatingService";
import { setRatingMiddle, getRating } from '../services/RatingService'
import store from '../store'


export default {
  name: 'VueStarRating',
  components: {
    Star,
  },
  props: {
    increment: {
      type: Number,
      default: 1,
    },
    /**
     * Author: Jörg Adelhelm
     * Hier noch das Rating-System eingebunden, so dass das Avg_rating immer fix
     * mit den Sternen angezeigt wird
     */

    //Review Kommentar:
    // Der eingebaute Kommentar ist sehr gut und hilft beim Lesen des Codes zu verstehen, was die folgenden Funktionen bewirken.
             
    rating: {
      type: Number,
      async default() {
        const queryString = window.location.search
        const urlParams = new URLSearchParams(queryString)
        const angebot_id = urlParams.get('id')
        var defaultV = await getRating(angebot_id).then(function (result) {
          return result[0].avg_rating
        })
        try{

        console.log(defaultV)
        this.rating = defaultV
        return defaultV
        }
        catch{
          console.log("Rerenders")
        }

      },
    },
    roundStartRating: {
      type: Boolean,
      default: true,
    },
    activeColor: {
      type: [String, Array],
      default: '#ffd055',
    },
    inactiveColor: {
      type: String,
      default: '#d8d8d8',
    },
    maxRating: {
      type: Number,
      default: 5,
    },
    starPoints: {
      type: Array,
      default() {
        return []
      },
    },
    // Hier Größe Stars verändern
    starSize: {
      type: Number,
      default: 30,
    },
    showRating: {
      type: Boolean,
      default: true,
    },
    readOnly: {
      type: Boolean,
      default: false,
    },
    textClass: {
      type: String,
      default: '',
    },
    inline: {
      type: Boolean,
      default: false,
    },
    borderColor: {
      type: String,
      default: '#999',
    },
    activeBorderColor: {
      type: [String, Array],
      default: null,
    },
    borderWidth: {
      type: Number,
      default: 0,
    },
    roundedCorners: {
      type: Boolean,
      default: true,
    },
    padding: {
      type: Number,
      default: 0,
    },
    rtl: {
      type: Boolean,
      default: false,
    },
    fixedPoints: {
      type: Number,
      default: null,
    },
    glow: {
      type: Number,
      default: 0,
    },
    glowColor: {
      type: String,
      default: '#fff',
    },
    clearable: {
      type: Boolean,
      default: false,
    },
    activeOnClick: {
      type: Boolean,
      default: false,
    },
    animate: {
      type: Boolean,
      default: true,
    },
  },
  emits: ['update:rating', 'hover:rating'],

  data() {
    return {
      step: 0,
      fillLevel: [],
      currentRating: 0,
      selectedRating: 0,
      ratingSelected: false,
      user_id: 0,
      angebot_id: 0,
      user: [],
      avg_rating: 0,

 
    }
  },
  computed: {
    formattedRating() {
      return this.fixedPoints === null
        ? this.currentRating
        : this.currentRating.toFixed(this.fixedPoints)
    },
    shouldRound() {
      return this.ratingSelected || this.roundStartRating
    },
    margin() {
      return this.padding + this.borderWidth
    },
    activeColors() {
      if (Array.isArray(this.activeColor)) {
        return this.padColors(
          this.activeColor,
          this.maxRating,
          this.activeColor.slice(-1)[0],
        )
      }

      return new Array(this.maxRating).fill(this.activeColor)
    },
    currentActiveColor() {
      if (!this.activeOnClick) {
        return this.currentRating > 0
          ? this.activeColors[Math.ceil(this.currentRating) - 1]
          : this.inactiveColor
      }
      return this.selectedRating > 0
        ? this.activeColors[Math.ceil(this.selectedRating) - 1]
        : this.inactiveColor
    },
    activeBorderColors() {
      if (Array.isArray(this.activeBorderColor)) {
        return this.padColors(
          this.activeBorderColor,
          this.maxRating,
          this.activeBorderColor.slice(-1)[0],
        )
      }
      let borderColor = this.activeBorderColor
        ? this.activeBorderColor
        : this.borderColor
      return new Array(this.maxRating).fill(borderColor)
    },
    currentActiveBorderColor() {
      if (!this.activeOnClick) {
        return this.currentRating > 0
          ? this.activeBorderColors[Math.ceil(this.currentRating) - 1]
          : this.borderColor
      }
      return this.selectedRating > 0
        ? this.activeBorderColors[Math.ceil(this.selectedRating) - 1]
        : this.borderColor
    },
    roundedRating() {
      let inv = 1.0 / this.increment
      return Math.min(this.maxRating, Math.ceil(this.currentRating * inv) / inv)
    },
  },
  watch: {
    rating(val) {
      this.currentRating = val
      this.selectedRating = val
      this.createStars(this.shouldRound)
    },
  },
  created() {
    this.step = this.increment * 100
    this.currentRating = this.rating
    this.selectedRating = this.currentRating
    this.createStars(this.roundStartRating)
  },
  methods: {
    setRating($event, persist) {
      if (!this.readOnly) {
        const position = this.rtl
          ? (100 - $event.position) / 100
          : $event.position / 100
        this.currentRating = ($event.id + position - 1).toFixed(2)
        this.currentRating =
          this.currentRating > this.maxRating
            ? this.maxRating
            : this.currentRating
        if (persist) {
          this.createStars(true, true)
          this.selectedRating =
            this.clearable && this.currentRating === this.selectedRating
              ? 0
              : this.currentRating
          this.$emit('update:rating', this.selectedRating)
          this.ratingSelected = true
          /**
           * Author: Jörg Adelhelm
           * Algorithmus der überprüft ob der Benutzer bereits bewertet hat.
           * Mehrzeilige benutzer id funktioniert ebenfalls
           */

          //Review Kommentar:
          //Wieder eine schöne und kurze Beschreibugn des folgenden Codes.
          
          try {
            const queryString = window.location.search
            const urlParams = new URLSearchParams(queryString)
            const angebot_id = urlParams.get('id')
            const user_id = store.getters.getUserID


            const ratingCredentials = {
              selectedRating: this.selectedRating,
              angebot_id: angebot_id,
              user_id: user_id,
            }
            getRating(angebot_id).then(function (result) {

              //Review Kommentar:
              //Nach finaler Fertigstellung der Komponente wäre es gut, nicht genutzten Code nicht nur auszukommentieren,
              //sondern zu löschen, um Übersichtlichkeit des Codes zu verbessern.
             
              let alreadyRated = false
              let temp = ''

              for (var i = 0; i < result[0].rated.length; i++) {
                temp += result[0].rated[i]
                // console.log(temp);
                if (temp == user_id) {
                  console.log('Already rated!')
                  // let word = "Already rated!"
                  // this.msg = word;
                  // this.message = "Already rated!";
                  alreadyRated = true
                  break
                }
                if (result[0].rated[i] == ',') {
                  temp = ''
                }
              }
              if (alreadyRated == false) {
                console.log('Noch nicht bewertet')
                setRatingMiddle(ratingCredentials)
              }
              // Automatischer reload der Seite
            
           
              window.location.reload()
            })
          } catch (error) {
            console.log(error)
            console.log('Error Daten zur Middleware')
          }
          //
          //
        } else {
          this.createStars(true, !this.activeOnClick)
          this.$emit('hover:rating', this.currentRating)
        }
      }
    },
    resetRating() {
      if (!this.readOnly) {
        this.currentRating = this.selectedRating
        this.createStars(this.shouldRound)
      }
    },
    createStars(round = true, applyFill = true) {
      this.currentRating = round ? this.roundedRating : this.currentRating
      for (let i = 0; i < this.maxRating; i++) {
        let level = 0
        if (i < this.currentRating) {
          level =
            this.currentRating - i > 1 ? 100 : (this.currentRating - i) * 100
        }
        if (applyFill) {
          this.fillLevel[i] = Math.round(level)
        }
      }
    },
    padColors(array, minLength, fillValue) {
      return Object.assign(new Array(minLength).fill(fillValue), array)
    },
  },
}
//Review Kommentar:
//Auch an diser Stelle wären eine oder mehrere Zeilen abstand zwischen dem Ende des Skripts und dem Anfang des Stylings besser für die Lesbarkeit.
//Außerdem würde es beim Differenzieren der Vue-Funktionstypen innerhalb von "export default {}" helfen, wenn diese über größere Abstände verfügen würden,
//zum Beispiel zwischen "watch: {}", "created() {}" und "methods: {}" (Zeile 274 bis 284).
</script>
<style scoped>
.vue-star-rating-star {
  display: inline-block;
  -webkit-tap-highlight-color: transparent;
}

.vue-star-rating-pointer {
  cursor: pointer;
}

.vue-star-rating {
  display: flex;
  align-items: center;
}

.vue-star-rating-inline {
  display: inline-flex;
}

.vue-star-rating-rating-text {
  margin-left: 7px;
}

.vue-star-rating-rtl {
  direction: rtl;
}

.vue-star-rating-rtl .vue-star-rating-rating-text {
  margin-right: 10px;
  direction: rtl;
}

.sr-only {
  position: absolute;
  left: -10000px;
  top: auto;
  width: 1px;
  height: 1px;
  overflow: hidden;
}
</style>
