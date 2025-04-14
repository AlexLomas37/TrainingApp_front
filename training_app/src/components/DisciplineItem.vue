<template>
    <div class="card" @click="navigate">
        <div class="card-header" :style="{ '--bg-image': 'url(' + imageLink + ')' }">
            <div>
                <h3>{{ title }} ,eneekezfnjozfeonzefoj</h3>
            </div>
        </div>
        <div class="card-body">
            <p>{{ content }}</p>
        </div>
    </div>
</template>

<script>
export default {
    name: "DisciplineItem",
    props: {
        id: {
            type: Number,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        imageLink: {
            type: String,
            required: true,
        },
    },
    methods: {
        navigate() {
            this.$router.push(`/discipline/${this.id}`);
        }
    },
};
</script>

<style scoped>
.card {
    border: 1px solid var(--color-border);
    border-radius: 8px;
    padding: 16px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    background-color: var(--color-background-soft);
    width: 300px;
    height: 400px;
    margin: 16px auto;
    text-align: center;
}

.card-header {
    position: relative;
    height: 150px;
    border-bottom: 1px solid var(--color-border); 
    margin: 0 -16px 16px -16px;
    transition: transform 0.2s, box-shadow 0.2s;
}

.card-header::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: no-repeat center/cover;
    filter: blur(4px) brightness(0.7);
    z-index: -1;
}

/* New: use flex on the inner container to center the content */
.card-header > div {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    position: relative;
    z-index: 1;
}

/* Update: remove absolute centering for the title */
.card-header h3 {
    margin: 0;
    color: #fff;
}

.card:hover {
    cursor: pointer;
    transform: scale(1.03);
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.1);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:not(:hover) {
    transform: scale(1);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card-body p {
    margin: 0;
    font-size: 1rem;
    color: #A1A1AA;
    height: 200px;
}

.logo_front {
    width: 100px; /* reduced size */
    height: auto;
    border-radius: 15px;
}

/* Mobile view overrides */
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
    .card-header > div {
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
    .logo_front {
        width: 40px;
        border-radius: 5px;
    }
    .card-header h3 {
        margin: 0;
        font-size: 1rem;
    }
}
</style>