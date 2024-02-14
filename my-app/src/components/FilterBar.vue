<template>
  <nav class="navbar navbar-expand-lg" style="margin-top: 35px">
    <div
      class="navbar-collapse collapse"
      id="navbar5"
      style="align-self: center"
    >
      <ul class="navbar-nav">
        <div
          class="nav-item"
          style="align-self: center; margin-left: 50px; margin-bottom: 10px"
        >
          <div class="row">
            <div class="input-group-prepend" style="width: 80px">Sort by:</div>
            <select
              style="width: 140px"
              class="btn btn-sm btn-outline-secondary"
              v-model="selectedSortBy"
              @change="sortByHandler"
            >
              <option
                v-for="sortBy in sortByCollection"
                v-bind:value="{ id: sortBy.id, value: sortBy.value }"
                :key="sortBy.id"
              >
                {{ sortBy.value }}
              </option>
            </select>
          </div>
        </div>

        <div
          class="nav-item"
          style="align-self: center; margin-left: 50px; margin-bottom: 10px"
        >
          <div class="row">
            <div class="input-group-prepend" style="width: 80px">Price:</div>
            <select
              style="width: 140px"
              class="btn btn-sm btn-outline-secondary"
              v-model="selectedPrice"
              @change="priceHandler"
            >
              <option
                v-for="price in priceCollection"
                v-bind:value="{ id: price.id, value: price.value }"
                :key="price.id"
              >
                {{ price.value }}
              </option>
            </select>
          </div>
        </div>
        <div
          class="nav-item"
          style="align-self: center; margin-left: 50px; margin-bottom: 10px"
        >
          <div class="row">
            <div class="input-group-prepend" style="width: 80px">
              File-Type:
            </div>
            <select
              style="width: 140px"
              class="btn btn-sm btn-outline-secondary"
              v-model="selectedType"
              @change="typeHandler"
            >
              <option
                v-for="type in typeCollection"
                v-bind:value="{ id: type.id, value: type.value }"
                :key="type.id"
              >
                {{ type.value }}
              </option>
            </select>
          </div>
        </div>
        <div
          class="nav-item"
          style="align-self: center; margin-left: 50px; margin-bottom: 10px"
        ></div>
      </ul>
    </div>
  </nav>
</template>

<script>
export default {
  name: "FilterBar",
  components: {},
  data() {
    return {
      selectedSortBy: "",
      selectedPrice: "",
      selectedType: "",
      query: "",
      sortByCollection: [
        { id: 1, value: "Latest" },
        { id: 2, value: "Oldest" },
        { id: 3, value: "Best rated" },
        { id: 4, value: "Lowest price" },
        { id: 5, value: "Highest price" },
      ],
      priceCollection: [
        { id: 1, value: "All" },
        { id: 2, value: "Free" },
        { id: 3, value: "Under 10 Euro" },
        { id: 4, value: "Under 50 Euro" },
        { id: 5, value: "Under 100 Euro" },
      ],
      typeCollection: [
        { id: 1, value: "All" },
        { id: 2, value: "Audio" },
        { id: 3, value: "Video" },
        { id: 4, value: "Image" },
        { id: 5, value: "Service" },
        { id: 6, value: "GLB" },
      ],
    };
  },
  methods: {
    sortByHandler() {
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      this.query = urlParams.get("query");
      if (this.query == null) {
        this.query = "";
      }
      this.$router.push({
        path: "/search",
        query: {
          query: this.query,
          sortBy: this.selectedSortBy.value,
          price: this.selectedPrice.value,
          type: this.selectedType.value,
        },
      });
    },
    priceHandler() {
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      this.query = urlParams.get("query");
      if (this.query == null) {
        this.query = "";
      }
      this.$router.push({
        path: "/search",
        query: {
          query: this.query,
          sortBy: this.selectedSortBy.value,
          price: this.selectedPrice.value,
          type: this.selectedType.value,
        },
      });
    },
    typeHandler() {
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      this.query = urlParams.get("query");
      if (this.query == null) {
        this.query = "";
      }
      this.$router.push({
        path: "/search",
        query: {
          query: this.query,
          sortBy: this.selectedSortBy.value,
          price: this.selectedPrice.value,
          type: this.selectedType.value,
        },
      });
    },
  },
  mounted() {},
  created() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    const sortBy = urlParams.get("sortBy");
    const price = urlParams.get("price");
    const type = urlParams.get("type");

    const sortByResult = this.sortByCollection.find(
      (selected) => selected.value === sortBy
    );

    if (sortByResult == undefined) {
      this.selectedSortBy = this.sortByCollection[0];
    } else {
      this.selectedSortBy = sortByResult;
    }

    const sortByPrice = this.priceCollection.find(
      (selected) => selected.value === price
    );

    if (sortByPrice == undefined) {
      this.selectedPrice = this.priceCollection[0];
    } else {
      this.selectedPrice = sortByPrice;
    }

    const typeResult = this.typeCollection.find(
      (selected) => selected.value === type
    );

    if (typeResult == undefined) {
      this.selectedType = this.typeCollection[0];
    } else {
      this.selectedType = typeResult;
    }
  },
};
</script>

<style>
.btn-outline-secondary:hover {
  color: #fff;
  background-color: rgb(2, 143, 65) !important;
  border-color: #6c757d;
}
</style>

