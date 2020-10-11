<template>
    <div class="vt__play-pause vt__control">
        <transition name="vt__controls" mode="out-in" :duration="10">
            <Play
                v-if="!videoPlaying"
                @click="video.play()"
                @keyup.enter="video.play()"
                @focus="$emit('video-focused')"
                :key="videoPlaying"
                :style="buttonStyles"
                role="button"
                aria-label="play"
                tabindex="0"
            />
            <Pause
                v-else
                @click="video.pause()"
                @keyup.enter="video.pause()"
                @focus="$emit('video-focused')"
                :key="videoPlaying"
                :style="buttonStyles"
                role="button"
                aria-label="pause"
                tabindex="0"
            />
        </transition>
    </div>
</template>

<script>
import focusedStore from '../js/focused';
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
        videoPlaying: Boolean,
        videoFocused: Boolean,
        buttonStyles: { type: Object, default: {} },
    },

    created() {
        // Play/pause on space
        document.addEventListener('keydown', e => {
            if (e.key !== ' ') return;
            e.preventDefault();
            if (this.video.id !== focusedStore().focused.value) return;

            this.videoPlaying ? this.video.pause() : this.video.play();
        });
    },
};
</script>
