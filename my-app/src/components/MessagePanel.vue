<template>
  <div id="chatbox">
    <div class="headerChat">
      <status-icon :connected="user.connected" />{{ user.username }}
    </div>
    <div id="messageBody">
      <ul class="messages">
        <li
          v-for="(message, index) in user.messages"
          :key="index"
          class="message"
        >
          <div class="outgoing" v-if="message.fromSelf">
            {{ message.content }}
            <span class="time">{{ message.time }}</span>
          </div>

          <div class="incoming" v-if="!message.fromSelf">
            {{ message.content }}
            <span class="time">{{ message.time }}</span>
          </div>
        </li>
      </ul>
    </div>

    <form @submit.prevent="onSubmit" class="form">
      <div class="container">
        <textarea
          v-model="input"
          class="form-control"
          placeholder="Your message..."
          maxlength="180"
          v-on:keyup.enter="onSubmit"
          style="height: 40px"
        ></textarea>

        <button
          :disabled="!isValid"
          class="btn btn-outline-info my-2 my-sm-0"
          style="vertical-align: top"
        >
          <i class="fas fa-paper-plane"></i>
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import StatusIcon from "./StatusIcon";

export default {
  name: "MessagePanel",
  components: {
    StatusIcon,
  },
  props: {
    user: Object,
  },
  data() {
    return {
      input: "",
    };
  },
  methods: {
    onSubmit() {
      //Wenn der String eine länge von 0 hat nach der trim methode, enthält der String nur whitespaces => nicht absenden
      if (this.input.trim().length != 0) {
        this.$emit("input", this.input);
        this.input = "";
      }
    },
    displaySender(message, index) {
      return (
        index === 0 ||
        this.user.messages[index - 1].fromSelf !==
          this.user.messages[index].fromSelf
      );
    },
  },
  computed: {
    isValid() {
      return this.input.length > 0;
    },
  },
};
</script>

<style scoped>
#chatbox {
  border-left: 1px solid #dddddd;
  border-right: 1px solid #dddddd;
  overflow-x: hidden;
}

.headerChat {
  line-height: 40px;
  padding: 10px 20px;
  border-bottom: 1px solid #dddddd;
  text-align: center;
  font-size: 24px;
}

.messages {
  margin: 0;
  padding: 20px;
  overflow-wrap: break-word;
}

.message {
  list-style: none;
}
.outgoing {
  padding: 20px;
  right: 0;
  width: 50%;
  height: 100%;
  background: #79c7c5;
  float: right;
  border-radius: 20px;
  margin-bottom: 5px;
}

.incoming {
  width: 50%;
  height: 100%;
  padding: 20px;
  background: #c0bcbc;
  border-radius: 20px;
  margin-bottom: 5px;
  float: left;
}
.time {
  font-size: 0.8rem;
  float: right;
}

.form {
  padding: 10px;
}

.input {
  width: 80%;
  resize: none;
  padding: 10px;
  line-height: 1.5;
  border-radius: 5px;
  border: 1px solid #000;
}
li {
  display: block;
  clear: both;
}
#messageBody {
  height: 450px;
  overflow-y: scroll;
  display: flex;
  flex-direction: column-reverse;
}

.container {
  display: flex;
  align-items: center;
}
</style>