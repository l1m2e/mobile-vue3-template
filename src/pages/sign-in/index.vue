<script lang="ts" setup>
const msg = $ref('hello')
import { getUserAtnApi } from '~/api';
const fn = async () =>{
  const param = {
    cardID:'20001'
  }
  const res = await getUserAtnApi(param)
  console.log(res);
}
fn()
</script>

<template>
<div btn @click="">{{msg}}</div>
</template>

<style scoped></style>
