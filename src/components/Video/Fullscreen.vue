<template>
	<div class="dk__fullscreen dk__control">
		<Maximise
			v-if="!videoFullscreen"
			@click.native="enterFullscreen()"
			:style="buttonStyles"
		/>
		<Minimise v-else @click.native="leaveFullscreen()" :style="buttonStyles" />
	</div>
</template>

<script>
import Maximise from './svg/Maximise';
import Minimise from './svg/Minimise';

export default {
	name: 'Fullscreen',

	components: {
		Maximise,
		Minimise,
	},

	props: {
		video: HTMLVideoElement,
		buttonStyles: Object,
	},

	data() {
		return {
			videoFullscreen: false,
		};
	},

	methods: {
		enterFullscreen() {
			const videoContainer = this.video.parentNode;

			if (videoContainer.requestFullscreen) {
				videoContainer.requestFullscreen();
			} else if (videoContainer.mozRequestFullScreen) {
				/* Firefox */
				videoContainer.mozRequestFullScreen();
			} else if (videoContainer.webkitRequestFullscreen) {
				/* Chrome, Safari and Opera */
				videoContainer.webkitRequestFullscreen();
			} else if (videoContainer.msRequestFullscreen) {
				/* IE/Edge */
				videoContainer.msRequestFullscreen();
			}

			this.videoFullscreen = true;
		},
		leaveFullscreen() {
			if (document.exitFullscreen) {
				document.exitFullscreen();
			} else if (document.mozCancelFullScreen) {
				/* Firefox */
				document.mozCancelFullScreen();
			} else if (document.webkitExitFullscreen) {
				/* Chrome, Safari and Opera */
				document.webkitExitFullscreen();
			} else if (document.msExitFullscreen) {
				/* IE/Edge */
				document.msExitFullscreen();
			}

			this.videoFullscreen = false;
		},
	},

	created() {
		// Detect fullscreen
		document.addEventListener('fullscreenchange', e => {
			if (
				document.fullscreenElement === this.video.parentNode ||
				document.mozFullScreenElement === this.video.parentNode
			) {
				this.videoFullscreen = true;
			} else {
				this.videoFullscreen = false;
			}
		});

		// Safari
		document.addEventListener('webkitfullscreenchange', e => {
			this.videoFullscreen =
				document.webkitFullscreenElement === this.video.parentNode
					? true
					: false;
		});
	},
};
</script>
