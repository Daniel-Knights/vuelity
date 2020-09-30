<template>
	<div class="dk__popup" v-if="popupOpen" :style="popupStyles">
		<div class="dk__popup-message">
			<span @click="removePopup" :style="{ color: popupColor }">&times;</span>
			<slot></slot>
		</div>
	</div>
</template>
<script>
export default {
	name: 'Popup',
	props: {
		styles: {
			type: Object,
			default: () => ({}),
		},
		cookie: {
			type: Boolean,
			default: false,
		},
		crossColor: String,
	},
	data() {
		return {
			popupOpen: true,
			popupStyles: { ...this.styles },
			popupColor: this.crossColor,
		};
	},
	methods: {
		removePopup() {
			this.popupOpen = false;
			if (this.cookie === true) document.cookie = 'dk__popup-closed=true';
		},
	},
	created() {
		let cookieCheck = document.cookie.split('dk__popup-closed=')[1];
		if (cookieCheck) cookieCheck = cookieCheck.split(';')[0];
		if (cookieCheck === 'true') this.popupOpen = false;
	},
};
</script>
<style scoped lang="scss">
.dk__popup {
	position: fixed;
	padding: 10px;
	right: 50px;
	bottom: -100%;
	background-color: $white;
	border: 2px solid $primary;
	border-bottom: none;
	border-radius: 10px 10px 0 0;
	box-shadow: 0px 1px 5px -2px $black;
	animation: popup 1s 3s forwards cubic-bezier(0.215, 0.61, 0.355, 1);
	z-index: 1000;
}
span {
	cursor: pointer;
	position: absolute;
	margin-right: 5px;
	top: -3px;
	right: 3px;
	font-size: 35px;
	color: $primary;
	transition: color 0.3s;
}
span:hover {
	color: lighten($primary, 20%);
}
.dk__popup-message {
	@include flex-x(center, center);
	margin: 10px;
	max-width: 190px;
	min-width: 100px;
	min-height: 30px;
	font-family: $font_primary;
}
@media only screen and (max-width: 700px) {
	.dk__popup-container {
		@include flex-x(center);
	}
	.dk__popup {
		right: unset;
	}
}
@keyframes popup {
	0% {
		bottom: -100%;
	}
	100% {
		bottom: 0;
	}
}
</style>
