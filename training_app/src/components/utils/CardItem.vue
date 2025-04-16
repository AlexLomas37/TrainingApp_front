<template>
    <div class="card" @click="redirect">
        <div class="card-header" :style="{ '--custom-logo': `url(${customLogo})` }">
            <div>
                <slot name="header" />
            </div>
        </div>
        <div class="card-body">
            <slot name="body" />
        </div>
        <div class="card-footer">
            <slot name="footer" />
        </div>
    </div>
</template>

<script>

export default {
    name: 'CardItem',
    props: {
        redirectLink: {
            type: String,
            default: null,
        },
        customLogo: {
            type: String,
            default: "/logos/logo.svg",
        },
    },
    methods: {
        redirect() {
            if (this.redirectLink) {
                this.$router.push(this.redirectLink);
            }
        },
    },
};
</script>

<style scoped>
.card {
    border: 1px solid var(--color-border);
    border-radius: 20px;
    padding: 0 16px;
    box-shadow: 0 4px 6px var(--color-border);
    background-color: var(--color-background-soft);
    color: var(--color-text);
    width: 300px;
    height: 400px;
    margin: 16px auto;
    text-align: center;
}

.card-header {
    position: relative;
    border-radius: 20px 20px 0 0;
    padding: 16px;
    height: 150px;
    border-bottom: 1px solid var(--color-border);
    background-color: var(--color-background-secondary);
    margin: 0 -16px 16px -16px;
    transition: transform 0.2s, box-shadow 0.2s;
    overflow: hidden;
}

.card-header::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: var(--custom-logo) no-repeat center/cover;
    filter: blur(4px) brightness(0.7);
    z-index: -1;
}

.card-header > div {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    position: relative;
    z-index: 1;
}

.card-header h3 {
    margin: 0;
    color: var(--color-text-primary);
}

.card:hover {
    cursor: pointer;
    transform: scale(1.03);
    box-shadow: 0 0 10px var(--color-border-hover);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:not(:hover) {
    transform: scale(1);
    box-shadow: 0 4px 6px var(--color-border);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card-body p {
    margin: 0;
    font-size: 1rem;
    color: var(--color-text-secondary);
    height: 200px;
}

.logo_front {
    width: 100px;
    height: auto;
    border-radius: 15px;
}

@media (max-width: 600px) {
    .card {
        width: 100%;
        height: auto;
        margin: 8px 0;
        padding: 8px;
        display: flex;
        flex-direction: row;
        align-items: center;
        text-align: left;
    }

    .card-header {
        height: auto;
        border: none;
        margin: 0;
        flex: 1;
    }

    .card-header>div {
        flex-direction: row;
        gap: 8px;
        justify-content: flex-start;
    }

    .card-body {
        display: none;
    }

    .card-header::before {
        display: none;
    }

    .card-header h3 {
        margin: 0;
        font-size: 1rem;
    }
}
</style>
