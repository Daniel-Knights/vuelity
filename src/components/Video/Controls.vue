<template>
    <div class="vt__video-controls-container">
        <div class="vt__video-controls">
            <PlayPause
                :video="video"
                :videoId="videoId"
                :videoFocused="videoFocused"
                :videoPlaying="videoPlaying"
                :buttonStyles="buttonStyles"
            />
            <Time
                :video="video"
                :videoId="videoId"
                :videoFocused="videoFocused"
                :videoCurrentTime="videoCurrentTime"
                :videoBuffered="videoBuffered"
                :timeTags="timeTags"
                :fullscreenClick="fullscreenClick"
                :thumbStyles="thumbStyles"
                :trackColor="trackColor"
            />
            <Volume
                :video="video"
                :videoId="videoId"
                :videoFocused="videoFocused"
                :videoVolume="videoVolume"
                :trackColor="trackColor"
            />
            <Fullscreen
                :video="video"
                :buttonStyles="buttonStyles"
                @click.native="fullscreenClick = !fullscreenClick"
            />
        </div>
    </div>
</template>

<script>
import PlayPause from './PlayPause';
import Time from './Time';
import Volume from './Volume';
import Fullscreen from './Fullscreen';

export default {
    name: 'Controls',

    props: {
        video: HTMLVideoElement,
        videoId: String,
        videoFocused: String,
        videoPlaying: Boolean,
        videoCurrentTime: Number,
        videoVolume: Number,
        videoBuffered: Number,
        timeTags: Array,
        buttonStyles: { type: Object, default: {} },
        thumbStyles: { type: Object, default: {} },
        trackColor: String,
    },

    components: {
        PlayPause,
        Time,
        Volume,
        Fullscreen,
    },

    data() {
        return {
            fullscreenClick: false,
        };
    },
};
</script>

<style lang="scss">
.vt__controls-enter-active,
.vt__controls-leave-active {
    transition: all 0.1s cubic-bezier(0.215, 0.61, 0.355, 1);
}
.vt__controls-enter,
.vt__controls-leave-to {
    opacity: 0;
}

.vt__video {
    &-controls-container {
        display: block;
        position: relative;
        padding-top: 8px;
        width: 100%;
        height: 63px;
        background: $black;
        margin-top: -63px;
        transform: translateY(0px);
        transition: all 0.8s cubic-bezier(0.215, 0.61, 0.355, 1);
    }

    &-controls {
        display: grid;
        grid-template-columns: minmax(50px, 0.5fr) 7fr minmax(50px, 0.5fr) minmax(50px, 0.5fr);
        align-items: center;
        margin: -10px auto 0;
        width: 95%;
        height: 64px;
        color: $white;
        opacity: 1;
        z-index: 1;
        transition: all 0.5s cubic-bezier(0.215, 0.61, 0.355, 1);
    }

    .vt__control {
        svg {
            cursor: pointer;
            display: block;
            margin: auto;
            padding: 6px;
            width: 33px;
            height: 33px;
            border: 1px solid rgba($white, 0.8);
            border-radius: 2px;
            transition: all 0.3s cubic-bezier(0.215, 0.61, 0.355, 1);
        }

        input {
            cursor: pointer;
            border: none;
        }

        svg:hover {
            filter: brightness(0.8);
        }
    }

    // .time inside Time.vue

    .vt__volume {
        @include flex-x(false, flex-end);
        justify-self: center;
        position: relative;
        max-width: 80%;

        svg {
            padding: 10px 0;
            height: 40px;
            object-fit: cover;
            border: none;
            background: none;
        }

        svg:hover ~ input,
        svg:hover ~ .vt__volume-track,
        input:hover,
        input:hover ~ .vt__volume-track {
            display: block;
            opacity: 1;
        }
    }

    &-controls-container::before {
        content: '';
        display: block;
        margin: 0 auto;
        width: 95%;
        height: 1px;
        transform: translateY(-8px);
        background: linear-gradient(
            to right,
            transparent,
            rgba($white, 0.8),
            rgba($white, 0.8),
            transparent
        );
    }

    @media only screen and (max-width: 500px) {
        .vt__video-controls-container {
            margin-top: -49px;
            height: 50px;
            padding-top: 2px;
        }
        .vt__video-controls-container::before {
            transform: translateY(-2px);
        }
        .vt__video-controls {
            grid-template-columns: 7fr minmax(50px, 0.5fr);
        }
        .vt__play-pause {
            display: none;
        }
        .vt__time span {
            font-size: 12px;
        }
        .vt__tag-title {
            display: none;
        }
        .vt__video-tooltip {
            display: none;
        }
        .vt__volume {
            display: none;
        }
        .vt__fullscreen {
            svg {
                width: 25px;
                height: 25px;
            }
        }
    }
}
</style>
