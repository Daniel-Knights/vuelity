<template>
    <div class="dk__play-pause dk__control">
        <transition name="dk__controls" mode="out-in" :duration="10">
            <Play
                v-if="!videoPlaying"
                @click.native="video.play()"
                :key="videoPlaying"
                :style="buttonStyles"
            />
            <Pause v-else @click.native="video.pause()" :key="videoPlaying" :style="buttonStyles" />
        </transition>
    </div>
</template>

<script>
import Play from './svg/Play';
import Pause from './svg/Pause';

export default {
    name: 'PlayPause',

    components: {
        Play,
        Pause,
    },

    props: {
        video: HTMLVideoElement,
        videoId: String,
        videoPlaying: Boolean,
        videoFocused: String,
        buttonStyles: { type: Object, default: {} },
    },

    created() {
        // Play/pause on space
        document.addEventListener('keydown', e => {
            if (e.key !== ' ') return;
            e.preventDefault();

            if (this.videoId !== this.videoFocused) return;

            this.videoPlaying ? this.video.pause() : this.video.play();
        });
    },
};
</script>
