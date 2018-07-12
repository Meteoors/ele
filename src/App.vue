<template>
  <div>
    <ele-header :seller='seller'></ele-header>
    <div class='tab'>
      <div class='tab-item'>
        <router-link to='/goods'>商品</router-link>
      </div>
      <div class='tab-item'>
        <router-link to='/ratings'>评价</router-link>
      </div>
      <div class='tab-item'>
        <router-link to='/seller'>商家</router-link>
      </div>
    </div>
    <keep-alive>
      <router-view :seller='seller'></router-view>
    </keep-alive>
  </div>
</template>

<script>
  import header from './components/header/header.vue'
  import axios from 'axios'

  export default {
    components:{
      'ele-header': header
    },

    data(){
      return {
        seller:{}
      }
    },

    created(){
      setTimeout(() => {
        axios.get('/api2/seller')
            .then(response => {
              const result = response.data
              if(result.code === 0){
                this.seller = result.data
                console.log(this.seller)
              }
            })
            .catch(error => {
              console.log(error)
            })
      },1000)

      // this.$http.get('/api/seller').then((response) => {
      //   if(response.body.errno === 0){
      //     this.seller=response.body.data
      //   }
      //   console.log(this.seller)
      // })
    }
  }
</script>

<style lang='stylus' rel='stylesheet/stylus'>
  @import "./common/stylus/mixins.styl"

  .tab
    display flex
    width: 100%
    height: 40px
    line-height: 40px
    border-1px(rgba(1,17,27,0.1))
    .tab-item
      flex: 1
      text-align: center
      &>a
        display: block
        font-size: 14px
        color: rgb(77,85,93)
        &.active
          color:rgb(240,20,20)
</style>
