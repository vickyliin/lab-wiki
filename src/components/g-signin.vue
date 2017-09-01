<template>
  <div :id="id"></div>
</template>

<script>
  export default{
    data(){return{
      id: new Date().valueOf()
    }},
    mounted(){

    },
  }
</script>