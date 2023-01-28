<script setup lang="ts">
import { useClient } from "villus";
useClient({
  url: "http://localhost:4000/graphql", // your endpoint.
});
</script>

<template>
  <LockScreen />
  <RouterView />
</template>
