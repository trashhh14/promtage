<script setup lang="ts">
withDefaults(defineProps<{
  /** Primary action on the right (hidden if empty) */
  ctaLabel?: string
  ctaTo?: string
  showCta?: boolean
  /**
   * Stick to viewport while scrolling.
   * Studio keeps this off so the bar scrolls away with content.
   * On mobile sticky is disabled globally (avoids layout jumps with the browser chrome).
   */
  sticky?: boolean
}>(), {
  ctaLabel: 'Открыть студию',
  ctaTo: '/studio',
  showCta: true,
  sticky: true
})

const route = useRoute()
const menuOpen = ref(false)

const links = [
  { to: '/', label: 'Главная', match: 'home' },
  { to: '/projects', label: 'Проекты', match: 'projects' },
  { to: '/studio', label: 'Студия', match: 'studio' }
] as const

function isActive (match: string) {
  if (match === 'home') return route.path === '/'
  if (match === 'projects') return route.path.startsWith('/projects')
  if (match === 'studio') return route.path.startsWith('/studio')
  return false
}

function closeMenu () {
  menuOpen.value = false
}

function toggleMenu () {
  menuOpen.value = !menuOpen.value
}

watch(() => route.fullPath, () => {
  menuOpen.value = false
})

onMounted(() => {
  if (import.meta.client) {
    document.addEventListener('keydown', onKey)
  }
})

onBeforeUnmount(() => {
  if (import.meta.client) {
    document.removeEventListener('keydown', onKey)
  }
})

function onKey (event: KeyboardEvent) {
  if (event.key === 'Escape') menuOpen.value = false
}
</script>

<template>
  <nav
    class="nav-wrap"
    :class="{ 'is-sticky': sticky }"
    aria-label="Навигация"
  >
    <div class="nav" :class="{ 'is-open': menuOpen }">
      <NuxtLink class="brand" to="/" @click="closeMenu">
        Viral Script Studio
      </NuxtLink>

      <div class="links" aria-hidden="false">
        <NuxtLink
          v-for="link in links"
          :key="link.to"
          class="link"
          :class="{ active: isActive(link.match) }"
          :to="link.to"
        >
          {{ link.label }}
        </NuxtLink>
      </div>

      <div class="end">
        <slot name="end" />
        <UiAppButton
          v-if="showCta && ctaLabel && ctaTo"
          class="cta"
          variant="primary"
          :to="ctaTo"
        >
          {{ ctaLabel }}
        </UiAppButton>
        <button
          class="burger"
          type="button"
          :aria-expanded="menuOpen"
          aria-controls="mobile-nav"
          :aria-label="menuOpen ? 'Закрыть меню' : 'Открыть меню'"
          @click="toggleMenu"
        >
          <span class="burger-lines" :class="{ open: menuOpen }" aria-hidden="true" />
        </button>
      </div>
    </div>

    <div
      id="mobile-nav"
      class="mobile-panel"
      :class="{ open: menuOpen }"
      :aria-hidden="!menuOpen"
    >
      <NuxtLink
        v-for="link in links"
        :key="`m-${link.to}`"
        class="mobile-link"
        :class="{ active: isActive(link.match) }"
        :to="link.to"
        @click="closeMenu"
      >
        {{ link.label }}
      </NuxtLink>
      <UiAppButton
        v-if="showCta && ctaLabel && ctaTo"
        class="mobile-cta"
        variant="primary"
        block
        :to="ctaTo"
        @click="closeMenu"
      >
        {{ ctaLabel }}
      </UiAppButton>
    </div>

    <button
      v-if="menuOpen"
      class="scrim"
      type="button"
      aria-label="Закрыть меню"
      @click="closeMenu"
    />
  </nav>
</template>

<style scoped>
.nav-wrap {
  position: relative;
  z-index: 30;
  isolation: isolate;
  /* Reserve a stable height so route changes don't reflow content under the bar */
  min-height: 58px;
  width: min(860px, 100%);
  margin-inline: auto;
}

/* Sticky only on desktop and only when requested */
@media (min-width: 761px) {
  .nav-wrap.is-sticky {
    position: sticky;
    top: 18px;
  }
}

.nav-wrap:has(.mobile-panel.open) {
  z-index: 40;
}

.nav {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 16px;
  min-height: 58px;
  padding: 8px 12px 8px 18px;
  border: 1px solid var(--glass-border-strong);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.54);
  box-shadow: var(--glass-shadow-mid);
  backdrop-filter: blur(20px) saturate(140%);
  -webkit-backdrop-filter: blur(20px) saturate(140%);
  position: relative;
  z-index: 2;
}

.brand {
  color: var(--color-ink);
  font-family: var(--font-serif);
  font-size: 18px;
  font-weight: 400;
  letter-spacing: -0.02em;
  text-decoration: none;
  color: var(--color-ink, #1a1a1a);
  white-space: nowrap;
}

.links {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px 18px;
  min-width: 0;
}

.link {
  padding: 7px 12px;
  border-radius: var(--radius-pill);
  color: var(--color-fog);
  font-size: 13.5px;
  font-weight: 500;
  text-decoration: none;
  white-space: nowrap;
  transition: color 150ms ease, background 150ms ease;
}

.link:hover {
  background: rgba(255, 255, 255, 0.5);
  color: var(--color-ink);
  text-decoration: none;
}

.link.active {
  background: var(--color-accent-tint);
  color: var(--color-accent);
}

.end {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  min-width: 0;
}

.burger {
  display: none;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  flex-shrink: 0;
  padding: 0;
  border: 1px solid var(--glass-border-strong);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.42);
  cursor: pointer;
}

.burger:hover {
  background: rgba(255, 255, 255, 0.62);
}

.burger-lines {
  position: relative;
  display: block;
  width: 18px;
  height: 2px;
  background: var(--color-ink, #1a1a1a);
  border-radius: 2px;
  transition: background 0.15s ease;
}

.burger-lines::before,
.burger-lines::after {
  content: '';
  position: absolute;
  left: 0;
  width: 18px;
  height: 2px;
  background: var(--color-ink, #1a1a1a);
  border-radius: 2px;
  transition: transform 0.18s ease, top 0.18s ease;
}

.burger-lines::before { top: -6px; }
.burger-lines::after { top: 6px; }

.burger-lines.open {
  background: transparent;
}

.burger-lines.open::before {
  top: 0;
  transform: rotate(45deg);
}

.burger-lines.open::after {
  top: 0;
  transform: rotate(-45deg);
}

.mobile-panel {
  display: none;
}

.scrim {
  display: none;
}

@media (max-width: 900px) {
  .links {
    display: none;
  }

  .nav {
    grid-template-columns: 1fr auto;
  }

  .burger {
    display: inline-flex;
  }

  .mobile-panel {
    display: grid;
    gap: 6px;
    position: absolute;
    left: 0;
    right: 0;
    top: calc(100% + 10px);
    z-index: 3;
    padding: 12px;
    border: 1px solid var(--glass-border-strong);
    border-radius: 24px;
    background: rgba(245, 240, 232, 0.88);
    box-shadow: var(--glass-shadow-strong);
    backdrop-filter: blur(20px) saturate(135%);
    -webkit-backdrop-filter: blur(20px) saturate(135%);
    opacity: 0;
    visibility: hidden;
    transform: translateY(-8px);
    pointer-events: none;
    transition: opacity 0.16s ease, transform 0.16s ease, visibility 0.16s ease;
  }

  .mobile-panel.open {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
    pointer-events: auto;
  }

  .mobile-link {
    display: flex;
    align-items: center;
    min-height: 48px;
    padding: 0 16px;
    border-radius: 14px;
    color: var(--color-ink, #1a1a1a);
    font-size: 16px;
    font-weight: 600;
    text-decoration: none;
  }

  .mobile-link:hover,
  .mobile-link.active {
    background: var(--color-accent-tint);
  }

  .mobile-link.active {
    color: var(--color-accent);
  }

  .mobile-cta {
    margin-top: 6px;
  }

  .scrim {
    display: block;
    position: fixed;
    inset: 0;
    z-index: 1;
    border: 0;
    padding: 0;
    margin: 0;
    background: rgba(26, 46, 31, 0.24);
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    cursor: pointer;
  }

  /* When studio tools fill the end slot, hide the big CTA in the bar — it lives in the panel */
  .nav .cta {
    display: none;
  }
}

@media (max-width: 760px) {
  .nav-wrap {
    min-height: 52px;
  }

  .nav {
    border-radius: 20px;
    padding: 6px 8px 6px 14px;
    min-height: 52px;
    gap: 10px;
  }

  .brand {
    font-size: 13px;
    max-width: 128px;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .end {
    gap: 6px;
    flex-wrap: nowrap;
  }

  .burger {
    width: 40px;
    height: 40px;
  }

  .mobile-panel {
    border-radius: 20px;
  }
}
</style>
