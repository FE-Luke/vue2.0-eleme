<template>
  <div>
    <v-header :seller="seller"></v-header>
    <v-tab></v-tab>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
  import header from '@/components/header/header';
  import tab from '@/components/tab/tab';
  import {mapMutations, mapGetters} from 'vuex';
  const XHR_OK = 0;
  export default {
    name: 'index',
    async created () {
      try {
        let {data} = await this.$http.get('/api/seller');
        if (data.code === XHR_OK) {
          this.SET_SELLER(data.data);
        }
      } catch (e) {
        console.log(e.response);
      }
    },
    methods: {
      ...mapMutations(['SET_SELLER'])
    },
    computed: {
      ...mapGetters(['seller'])
    },
    components: {
      'v-header': header,
      'v-tab': tab
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
