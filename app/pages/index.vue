<script setup lang="ts">
useHead({ title: 'Viral Script Studio — из идеи в ролик' })
</script>

<template>
  <main class="shell">
    <UiAppNav cta-label="Открыть студию" cta-to="/studio" />

    <!-- Бывшие отдельные страницы → один лендинг -->
    <LandingHero />
    <LandingFlow />
    <LandingChamber />
    <LandingProjects />
    <LandingStudio />
    <LandingPricing />
    <LandingClosing />
  </main>
</template>
