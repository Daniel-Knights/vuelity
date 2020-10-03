<template>
    <div class="dk__volume dk__control">
        <VolumeMute :key="1" v-if="videoVolume < 0.01" @click.native="mute()" />
        <VolumeLow
            :key="2"
            v-else-if="videoVolume > 0 && videoVolume < 0.33"
            @click.native="mute()"
        />
        <VolumeMedium
            :key="3"
            v-else-if="videoVolume >= 0.33 && videoVolume < 0.66"
            @click.native="mute()"
        />
        <VolumeFull :key="4" v-else @click.native="mute()" />
        <input
            type="range"
            @input="volume($event)"
            min="0"
            max="1"
            step="0.001"
            :value="videoVolume"
        />
        <div
            class="dk__volume-track"
            :style="{ backgroundColor: trackColor, height: trackHeight + 'px' }"
        ></div>
    </div>
</template>

<script>
import VolumeMute from './svg/VolumeMute';
import VolumeLow from './svg/VolumeLow';
import VolumeMedium from './svg/VolumeMedium';
import VolumeFull from './svg/VolumeFull';

export default {
    name: 'Volume',

    components: {
        VolumeMute,
        VolumeLow,
        VolumeMedium,
        VolumeFull,
    },

    props: {
        video: HTMLVideoElement,
        videoId: String,
        videoFocused: String,
        videoVolume: Number,
        trackColor: {
            type: String,
            default: 'rgb(40, 123, 225)',
        },
    },

    computed: {
        trackHeight: function() {
            return this.videoVolume * 99;
        },
    },

    methods: {
        volume(e) {
            this.video.volume = e.target.value;
        },
        mute() {
            this.video.volume = this.videoVolume < 0.01 ? 1 : 0;
        },
    },

    created() {
        // Prevent arrow key scrolling
        document.addEventListener('keydown', e => {
            if (this.videoId !== this.videoFocused) return;
            if (e.key === 'ArrowUp' || e.key === 'ArrowDown') e.preventDefault();
        });
        // Increment/decrement volume on up/down arrow keys
        document.addEventListener('keyup', e => {
            if (e.key !== 'ArrowUp' || this.videoId !== this.videoFocused) return;
            if (this.video.volume < 1) this.video.volume += 0.1;
        });
        document.addEventListener('keyup', e => {
            if (e.key !== 'ArrowDown' || this.videoId !== this.videoFocused) return;
            if (this.video.volume > 0.01) this.video.volume -= 0.1;
        });
    },
};
</script>

<style scoped lang="scss">
.dk__volume {
    .dk__volume-track {
        display: none;
        position: absolute;
        width: 10px;
        visibility: visible;
        opacity: 0;
        filter: brightness(0.5);
        transform: translate(9px, -36px);
        transition: opacity 0.2s, filter 0.3s;
        z-index: 0;
    }
    input[type='range'] {
        display: none;
        position: absolute;
        width: 100px;
        margin: -6px 0 6px; // Safari
        padding: 5px 0;
        opacity: 0;
        background-color: transparent;
        -webkit-appearance: none;
        transform: rotate(270deg) translate(70px, -36px);
        transition: all 0.1s;
        z-index: 1;
    }
    input[type='range']::-webkit-slider-runnable-track {
        background-color: rgba($white, 0.2);
        height: 10px;
    }
    input[type='range']::-webkit-slider-thumb {
        @include range-thumb;
        margin-top: -6px;
        border-radius: 3px;
        transform: translateY(3.5px);
        -webkit-appearance: none;
    }
    input[type='range']::-moz-range-track {
        background-color: rgba($white, 0.2);
        height: 10px;
    }
    input[type='range']::-moz-range-thumb {
        @include range-thumb;
        border-radius: 3px;
    }
    input[type='range']::-ms-track {
        height: 10px;
        color: transparent;
        background: transparent;
        border-color: transparent;
        border-width: 14.5px 0;
    }
    input[type='range']::-ms-fill-lower {
        background-color: rgba($white, 0.2);
        border: 0;
    }
    input[type='range']::-ms-fill-upper {
        background-color: rgba($white, 0.2);
        border: 0;
    }
    input[type='range']::-ms-thumb {
        @include range-thumb;
        border-radius: 3px;
        // Needed to keep the Edge thumb centred
        margin-top: 0px;
    }
    input[type='range']:focus {
        outline: none;
    }
    input[type='range']:focus ~ .dk__volume-track {
        filter: brightness(1);
    }
    svg:focus ~ .dk__volume-track {
        filter: brightness(1);
    }
    @supports (-ms-ime-align: auto) {
        /* Pre-Chromium Edge only styles */
        input[type='range'] {
            margin: 0;
            /*Edge starts the margin from the thumb, not the track*/
        }
    }
}
// Firefox tweak
@-moz-document url-prefix() {
    .dk__volume.dk__control {
        input[type='range'] {
            transform: rotate(270deg) translate(70px, -36px);
        }
        .dk__volume-track {
            transform: translate(9px, -38.5px);
        }
    }
}
</style>
