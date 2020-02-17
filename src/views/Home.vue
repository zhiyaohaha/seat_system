<template>
  <div class="home">
    <logIn></logIn>
  </div>
</template>

<script>
// @ is an alias to /src
import logIn from '../components/logIn'
export default {
  name: 'Home',
  components: {
    logIn
  }
}
</script>
