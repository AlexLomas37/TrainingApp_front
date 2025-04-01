<template>
    <header class="header">
        <!-- Always visible logo -->
        <router-link to="/" class="logo">
            <h1 class="header-title">Training App</h1>
        </router-link>
        <!-- Hamburger button on the right: display cross when menu open -->
        <button class="hamburger" @click="toggleMenu" :class="{ open: isMobileMenuOpen }">
            {{ isMobileMenuOpen ? '✖' : '☰' }}
        </button>
        <!-- Nav links for mobile & desktop -->
        <nav class="navbar" :class="{ open: isMobileMenuOpen }">
            <router-link to="/disciplines">Disciplines</router-link>
            <router-link to="/trainings">S'entrainer</router-link>
        </nav>
    </header>
</template>

<script>
export default {
    name: "HeaderItem",
    data() {
        return {
            isMobileMenuOpen: false
        }
    },
    methods: {
        toggleMenu() {
            this.isMobileMenuOpen = !this.isMobileMenuOpen
        }
    }
}
</script>

<style scoped>
.header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    padding: 0.5rem 1rem;
}

.logo {
    /* Always visible logo; keep styling as desired */
    text-decoration: none;
    color: inherit;
}

.header-title {
    margin: 0;
}

/* Hamburger button */
.hamburger {
    font-size: 2rem;
    background: none;
    border: none;
    cursor: pointer;
    transition: transform 0.3s ease;
    display: none;
}

/* Rotate hamburger when active */
.hamburger.open {
    transform: rotate(90deg);
}

/* Desktop: show nav links inline */
.navbar {
    display: flex;
    align-items: center;
    gap: 1rem;
}

/* Mobile styles */
@media (max-width: 600px) {
    .hamburger {
        display: block;
    }

    /* Hide nav links by default via opacity/transform for animation */
    .navbar {
        position: absolute;
        top: 100%;
        left: 0;
        width: 100%;
        background: var(--color-background);
        flex-direction: column;
        align-items: center;
        padding: 1rem;
        opacity: 0;
        transform: translateY(-10px);
        pointer-events: none;
        transition: opacity 0.3s ease, transform 0.3s ease;
    }

    /* Display menu when open */
    .navbar.open {
        opacity: 1;
        transform: translateY(0);
        pointer-events: auto;
    }
}
</style>