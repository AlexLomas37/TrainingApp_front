<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import HeaderItem from './components/HeaderItem.vue'
</script>

<template>
  <div class="app-container">
    <header>
      <HeaderItem/>
    </header>
    <main>
      <RouterView/>
    </main>
  </div>
</template>

<style scoped>
  .app-container {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    width: 100%; /* Changed from 100vw to prevent horizontal overflow */
    overflow-x: hidden; /* Added to hide horizontal overflow */
  }

  header {
    width: 100%;
  }

  main {
    flex: 1;
    display: flex;
    flex-direction: column; /* Ajouté pour empiler verticalement */
    align-items: flex-start; /* auparavant "center" */
    justify-content: flex-start; /* auparavant "center" */
  }

  .logo {
    display: block;
    margin: 0 auto 2rem;
  }

  nav {
    width: 100%;
    font-size: 12px;
    text-align: center;
    margin-top: 2rem;
  }

  nav a.router-link-exact-active {
    color: var(--color-text);
  }

  nav a.router-link-exact-active:hover {
    background-color: transparent;
  }

  nav a {
    display: inline-block;
    padding: 0 1rem;
    border-left: 1px solid var(--color-border);
  }

  nav a:first-of-type {
    border: 0;
  }

  @media (min-width: 1024px) {
    header {
      display: flex;
      justify-content: center; /* Centrage horizontal */
      align-items: center;
      /* padding-right supprimé */
    }

    .logo {
      margin: 0 2rem 0 0;
    }

    header .wrapper {
      display: flex;
      place-items: flex-start;
      flex-wrap: wrap;
    }

    nav {
      text-align: left;
      margin-left: -1rem;
      font-size: 1rem;
      padding: 1rem 0;
      margin-top: 1rem;
    }
  }
</style>