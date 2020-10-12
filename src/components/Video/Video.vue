<template>
    <div class="vt__video-container" :style="{ width }" @click="setFocused(id)">
        <div class="vt__video" :style="containerStyles">
            <div
                class="vt__video-loading"
                v-if="isLoading || video.networkState === 2"
                aria-label="loading"
                aria-busy="true"
            >
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
            <video
                :id="id"
                @click="playPause()"
                @mousemove="displayControls()"
                @canplay="isLoading = false"
                @play="isPlaying = true"
                @pause="isPlaying = false"
                @timeupdate="updateCurrentTime()"
                @volumechange="updateVolume()"
                @progress="videoBuffer($event)"
                @focus="
                    setFocused(id);
                    displayControls();
                "
                :poster="videoPoster"
                :style="styles"
                :src="src"
                :aria-label="videoTitle"
                tabindex="0"
                ref="video"
            >
                Your browser doesn't support the video element.
            </video>
            <transition name="vt__play">
                <Play
                    v-if="!isPlaying && !isLoading && video.networkState !== 2"
                    @click="video.play()"
                    @keyup.enter="video.play()"
                    class="vt__video-play-main"
                    role="button"
                    aria-label="play"
                    tabindex="0"
                />
            </transition>
            <Controls
                v-if="!isLoading"
                :video="video"
                :videoPlaying="isPlaying"
                :videoCurrentTime="videoCurrentTime"
                :videoVolume="videoVolume"
                :videoBuffered="videoBuffered"
                :timeTags="timeTags"
                :buttonStyles="buttonStyles"
                :thumbStyles="thumbStyles"
                :trackColor="trackColor"
                @mousemove="displayControls()"
                @video-focused="displayControls()"
            />
        </div>
    </div>
</template>

<script>
import focusedStore from '../js/focused';
import Play from './svg/Play';
import Controls from './Controls';

export default {
    name: 'Video',

    components: { Play, Controls },

    props: {
        width: { type: String, default: '100%' },
        videoSrc: String,
        videoTitle: String,
        videoPoster: String,
        timeTags: Array,
        contextmenu: { type: Boolean, default: true },
        styles: { type: Object, default: {} },
        containerStyles: { type: Object, default: {} },
        buttonStyles: { type: Object, default: {} },
        thumbStyles: { type: Object, default: {} },
        trackColor: String,
    },

    setup() {
        const { setFocused } = focusedStore();

        return { setFocused };
    },

    data() {
        return {
            id: Math.random() * 100,
            video: null,
            videoCurrentTime: 0,
            videoBuffered: 0,
            videoVolume: 1,
            isLoading: true,
            src: this.videoSrc || 'Null',
            isPlaying: false,
            hideControlsTimeout: null,
        };
    },

    watch: {
        videoSrc(val) {
            // Async src
            this.src = val;
        },
    },

    methods: {
        playPause() {
            this.isPlaying = !this.isPlaying;
            this.video.paused ? this.video.play() : this.video.pause();
        },
        displayControls() {
            const sibling = this.video.nextSibling.nextSibling;
            const controls = sibling.firstChild;

            clearTimeout(this.hideControlsTimeout);

            if (!controls || !this.video || !sibling) return;

            controls.style.opacity = '1';
            controls.style.transform = 'translateY(0px)';
            sibling.style.opacity = '1';
            this.video.style.cursor = 'default';

            this.hideControlsTimeout = setTimeout(() => {
                controls.style.opacity = '0';
                controls.style.transform = 'translateY(10px)';
                sibling.style.opacity = '0';
                this.video.style.cursor = 'none';
            }, 3000);
        },
        updateCurrentTime() {
            this.videoCurrentTime = this.video.currentTime;
        },
        updateVolume() {
            this.videoVolume = this.video.volume;
        },
        videoBuffer(e) {
            if (e.target.buffered.length !== 0)
                this.videoBuffered =
                    (e.target.buffered.end(e.target.buffered.length - 1) / e.target.duration) * 100;
        },
        setMaxHeight() {
            // Set video ratio
            this.video.style.maxHeight = this.video.offsetWidth * 0.575 + 'px';
        },
    },

    mounted() {
        this.video = this.$refs.video;
        this.video.addEventListener('contextmenu', e => {
            if (!this.contextmenu) e.preventDefault();
        });
        window.addEventListener('resize', this.setMaxHeight);
    },
};
</script>

<style lang="scss">
.vt__video-container {
    margin: 10px auto;
    min-width: 280px;
    font-family: Helvetica, Arial, sans-serif;

    * {
        box-sizing: border-box;
    }

    .vt__video {
        @include flex-y(center, center);
        position: relative;
        width: 100%;
        height: 100%;
        background-color: #000;
    }

    video {
        height: 100%;
        width: 100%;
        max-width: 100%;
    }

    .vt__video-play-main {
        cursor: pointer;
        position: absolute;
        padding: 25px 25px 25px 30px;
        width: 100px;
        height: 100px;
        background: rgba($black, 0.5);
        border-radius: 5px;
        overflow: visible;
        transition: all 0.1s cubic-bezier(0.215, 0.61, 0.355, 1), filter 0.2s;
    }

    .vt__video-play-main:hover {
        filter: brightness(0.9);
    }

    .vt__play-enter,
    .vt__play-leave-to {
        transform: scale(0.9);
        opacity: 0;
    }

    .vt__video-loading {
        position: absolute;
        width: 80px;
        height: 80px;
        background-color: rgba($black, 0.5);
        border-radius: 5px;
        div {
            position: absolute;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: $white;
            animation: grid 1.2s linear infinite;
            &:nth-child(1) {
                top: 8px;
                left: 8px;
                animation-delay: 0s;
            }
            &:nth-child(2) {
                top: 8px;
                left: 32px;
                animation-delay: -0.4s;
            }
            &:nth-child(3) {
                top: 8px;
                left: 56px;
                animation-delay: -0.8s;
            }
            &:nth-child(4) {
                top: 32px;
                left: 8px;
                animation-delay: -0.4s;
            }
            &:nth-child(5) {
                top: 32px;
                left: 32px;
                animation-delay: -0.8s;
            }
            &:nth-child(6) {
                top: 32px;
                left: 56px;
                animation-delay: -1.2s;
            }
            &:nth-child(7) {
                top: 56px;
                left: 8px;
                animation-delay: -0.8s;
            }
            &:nth-child(8) {
                top: 56px;
                left: 32px;
                animation-delay: -1.2s;
            }
            &:nth-child(9) {
                top: 56px;
                left: 56px;
                animation-delay: -1.6s;
            }
        }
        @keyframes grid {
            0%,
            100% {
                opacity: 1;
            }
            50% {
                opacity: 0.5;
            }
        }
    }
    @media only screen and (max-width: 500px) {
        .vt__video-play-main {
            width: 50px;
            height: 50px;
            padding: 12.5px 12.5px 12.5px 15px;
        }
        .vt__video-loading {
            width: 40px;
            height: 40px;
            div {
                width: 8px;
                height: 8px;
                &:nth-child(1) {
                    top: 4px;
                    left: 4px;
                    animation-delay: 0s;
                }
                &:nth-child(2) {
                    top: 4px;
                    left: 16px;
                    animation-delay: -0.4s;
                }
                &:nth-child(3) {
                    top: 4px;
                    left: 28px;
                    animation-delay: -0.8s;
                }
                &:nth-child(4) {
                    top: 16px;
                    left: 4px;
                    animation-delay: -0.4s;
                }
                &:nth-child(5) {
                    top: 16px;
                    left: 16px;
                    animation-delay: -0.8s;
                }
                &:nth-child(6) {
                    top: 16px;
                    left: 28px;
                    animation-delay: -1.2s;
                }
                &:nth-child(7) {
                    top: 28px;
                    left: 4px;
                    animation-delay: -0.8s;
                }
                &:nth-child(8) {
                    top: 28px;
                    left: 16px;
                    animation-delay: -1.2s;
                }
                &:nth-child(9) {
                    top: 28px;
                    left: 28px;
                    animation-delay: -1.6s;
                }
            }
        }
    }
}
</style>
