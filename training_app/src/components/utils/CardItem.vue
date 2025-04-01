<template>
	<div class="card" @click="redirect"> <!-- modification: ajout du gestionnaire de clic -->
		<div class="card-header">
			<div>
				<img :src="logoImage" alt="Logo" class="logo_front">
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
import logoImage from '@/assets/logo.svg'

export default {
	name: 'CardItem',
	props: {
		redirectLink: { // nouvelle prop pour la redirection
			type: String,
			default: null,
		},
	},
	data() {
		return {
			logoImage, // utilise l'import pour le logo
		};
	},
	methods: {
		redirect() { // nouvelle méthode pour gérer la redirection
			if (this.redirectLink) {
				this.$router.push(this.redirectLink);
			}
		},
	},
};
</script>

<style scoped>
.card {
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    padding: 16px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    background-color: rgba(255, 255, 255, .015);
    width: 300px;
    height: 400px;
    margin: 16px auto;
    text-align: center;
}

.card-header {
    position: relative;
    height: 150px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    margin: 0 -16px 16px -16px;
    transition: transform 0.2s, box-shadow 0.2s;
}

/* ajout du pseudo-élément pour le fond flouté identique à DisciplineItem */
.card-header::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url("@/assets/logo.svg") no-repeat center/cover;
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
    .card-header h3 {
        margin: 0;
        font-size: 1rem;
    }
}
</style>
