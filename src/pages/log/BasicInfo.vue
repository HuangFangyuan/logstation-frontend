<template>
  <section class="basic-info-container">
    <div class="row">
        <div class="wrapper-1">
          <div class="today-icon" @mouseover="over($refs.today)" ref="today" @mouseout="out($refs.today)" ></div>
          <div class="text">
            <p class="time">今日</p>
            <p class="amount">{{ today }}</p>
          </div>
        </div>
        <div class="wrapper-2">
          <div class="all-icon"></div>
          <div class="text">
            <p class="time">全部</p>
            <p class="amount">{{ total }}</p>
          </div>
        </div>
    </div>
  </section>
</template>

<script>
  export default {
    data(){
      return {
      }
    },
    methods:{
      over(dom) {
//        dom.style['transition'] = 'all 0.5s ease-in-out';
        dom.style.transition = 'all 1.5s ease-in-out'
      },
      out(dom) {

      }
    },
    props:{
      total:{
        type:Number,
        default:0
      },
      today:{
        type:Number,
        default:0
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/css/common";
  $icon-h: 50px;
  $icon-w: 50px;
  .basic-info-container {
    width: 1100px;
    font-size: 10px;
    .row {
      display: flex;
      .wrapper-1 {
        height: 100px;
        width: 250px;
        background-color: #ff879d;
        border-radius: 5px;
        display: flex;
        align-items: center;
      }
      .wrapper-2 {
        @extend .wrapper-1;
        background-color: #f0977e;
        margin-left: 50px;
      }
      .today-icon {
        background-image: url("../../assets/svg/sun.svg");
        background-size: $icon-w $icon-h;
        @include width-height($icon-w, $icon-h);
        display: inline-block;
        margin-left: 40px;
        &:hover{
          transform:rotate(360deg);
        }
      }
      .all-icon {
        background-image: url("../../assets/svg/moon.svg");
        background-size: 70px 70px;
        @include width-height(70px, 70px);
        @extend .today-icon;
        &:hover{
        transform:rotate(260deg);
      }
      }
      .text {
        margin-left: auto;
        margin-right: 40px;
        .time {
          margin-left:10px;
          @include size-color(1.2rem, $font-color-1);
          height: 0.8rem;
          color: white;
        }
        .amount {
          margin-left:10px;
          @include size-color(2rem, $font-color-1);
          height: 1rem;
          color: white;
        }
      }

    }
  }
</style>
