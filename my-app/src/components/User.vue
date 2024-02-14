<template>
  <div class="user" @click="onClick" :class="{ selected: selected }">
    <div class="container">
      <div class="image">
        <img src="https://img.icons8.com/color/64/000000/test-account.png" />
      </div>
      <div>
        <div class="name">
          <div v-if="user.hasNewMessages" class="new-messages">!</div>
          {{ user.username }} {{ user.self ? " (yourself)" : "" }}
        </div>
        <div class="status">
          <status-icon :connected="user.connected" />{{ status }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import StatusIcon from "./StatusIcon";
export default {
  name: "User",
  components: { StatusIcon },
  props: {
    user: Object,
    selected: Boolean,
  },
  methods: {
    onClick() {
      this.$emit("select");
    },
  },
  computed: {
    status() {
      return this.user.connected ? "online" : "offline";
    },
  },
};
</script>

<style scoped>
.selected {
  background: #efefef;
}

.user {
  padding: 10px;
}

.user:hover {
  background: #efefef;
  cursor: pointer;
}

.description {
  display: inline-block;
}

.status {
  color: #92959e;
}

.new-messages {
  color: white;
  background-color: red;
  width: 20px;
  border-radius: 5px;
  text-align: center;
  float: right;
  margin-left: 10px;
}

nav {
  height: 400px;
  overflow: hidden;
  overflow-y: scroll;
}

.container {
  display: flex;
  align-items: center;
}

img {
  max-width: 60%;
}

.image {
  flex-basis: 40%;
}
</style>