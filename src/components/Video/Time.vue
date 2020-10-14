<template>
    <div class="vt__time vt__control">
        <div class="vt__current-time">
            <span>{{ convertMilliseconds(videoCurrentTime) }} </span>
        </div>
        <div class="vt__video-tooltip">
            <span ref="tooltip" class="vt__video-tip">{{ timeValueHover }}</span>
        </div>
        <div
            class="vt__video-range-container"
            @mousemove="calculateTimeHover($event)"
            @mouseover="tooltipShow($event)"
            @mouseout="tooltipHide()"
        >
            <div
                class="vt__video-thumb-container"
                :style="{ transform: 'translateX(' + playedPixels + 'px)' }"
                aria-hidden="true"
                ref="thumbContainer"
            >
                <div class="vt__video-thumb" :style="thumbStyles" ref="thumb"></div>
            </div>
            <div
                class="vt__video-track-container"
                @mousedown="scrubStart($event)"
                @mouseover="scaleTrackUp()"
                @mouseout="scaleTrackDown()"
                @focus="$emit('video-focused')"
                tabindex="0"
                ref="videoTrackContainer"
            >
                <div class="vt__video-track" ref="videoTrack">
                    <div
                        class="vt__video-played"
                        :style="{ maxWidth: playedPercent + '%', backgroundColor: trackColor }"
                        @focus="$emit('video-focused')"
                        role="progressbar"
                        aria-label="video time range"
                        aria-valuemin="0"
                        :aria-valuemax="video.duration"
                        :aria-valuenow="videoCurrentTime"
                        :aria-valuetext="convertMilliseconds(videoCurrentTime)"
                        ref="played"
                    ></div>
                    <div
                        class="vt__video-buffered"
                        :style="{ maxWidth: videoBuffered + '%' }"
                        role="progressbar"
                        aria-hidden="true"
                    ></div>
                </div>
            </div>
        </div>
        <div class="vt__video-duration">
            <span>{{ convertMilliseconds(video.duration) }}</span>
        </div>
    </div>
</template>

<script>
import focusedStore from '../js/focused';

export default {
    name: 'Time',

    props: {
        video: HTMLVideoElement,
        videoCurrentTime: Number,
        videoBuffered: Number,
        timeTags: Array,
        fullscreenClick: Boolean,
        thumbStyles: { type: Object, default: {} },
        trackColor: String,
    },

    data() {
        return {
            timeValueHover: 0,
            playedPercent: 0,
            playedPixels: 0,
            dragging: false,
            videoPlaying: false,
            videoLoading: false,
            videoEnded: false,
        };
    },

    methods: {
        scaleTrackUp() {
            // Scale track
            this.$refs.videoTrack.style.transform = 'scaleY(5.1)';
            // Scale thumb
            this.$refs.thumb.style.transform = 'scale(1)';
            // Check for borderRadius in thumbStyles
            if (this.thumbStyles && !this.thumbStyles.borderRadius)
                this.$refs.thumb.style.borderRadius = '50%';
            else if (!this.thumbStyles) this.$refs.thumb.style.borderRadius = '50%';
            // Scale tags
            document.querySelectorAll('.vt__tag').forEach(tag => {
                // Ensure tags are unique to current element
                if (tag.parentNode.parentNode.parentNode.parentNode !== this.$el) return;
                tag.style.transform = 'scaleY(5.1)';
            });
        },
        scaleTrackDown() {
            // Scale track
            this.$refs.videoTrack.style.transform = 'scaleY(1)';
            // Scale thumb
            this.$refs.thumb.style.transform = 'scaleX(0.5) scaleY(0.2)';
            // Check for borderRadius in thumbStyles
            if (this.thumbStyles && !this.thumbStyles.borderRadius)
                this.$refs.thumb.style.borderRadius = '0%';
            else if (!this.thumbStyles) this.$refs.thumb.style.borderRadius = '0%';
            // Scale tags
            document.querySelectorAll('.vt__tag').forEach(tag => {
                // Ensure tags are unique to current element
                if (tag.parentNode.parentNode.parentNode.parentNode !== this.$el) return;
                tag.style.transform = 'scaleY(1)';
            });
        },
        calculateTimeHover(e) {
            const durationFormatted = parseInt(this.video.duration, 10);

            const timeValue = (e.offsetX / this.$refs.videoTrack.clientWidth) * durationFormatted;

            if (timeValue > 0 && timeValue < durationFormatted)
                this.timeValueHover = this.convertMilliseconds(timeValue);

            // Check if target is a time-tag
            if (!e.target.dataset.tag) this.$refs.tooltip.style.left = e.offsetX - 28 + 'px';
        },
        tooltipShow(e) {
            if (!this.$refs.tooltip) return;
            if (!e.target.dataset.tag) this.$refs.tooltip.style.opacity = '1';
            else this.tooltipHide();
        },
        tooltipHide() {
            if (!this.$refs.tooltip) return;
            this.$refs.tooltip.style.opacity = '0';
        },
        convertMilliseconds(ms) {
            let h, m, s;
            h = Math.floor((ms * 1000) / 1000 / 60 / 60);
            m = Math.floor(((ms * 1000) / 1000 / 60 / 60 - h) * 60);
            s = Math.floor((((ms * 1000) / 1000 / 60 / 60 - h) * 60 - m) * 60);

            s < 10 ? (s = `0${s}`) : (s = `${s}`);
            m < 10 ? (m = `0${m}`) : (m = `${m}`);
            h < 10 ? (h = `0${h}`) : (h = `${h}`);

            if (h > 0) return `${h}:${m}:${s}`;
            else return `${m}:${s}`;
        },
        createTimeTags() {
            if (!this.timeTags) return;
            this.timeTags.forEach(timeTag => {
                const tagContainer = document.createElement('div');
                const tag = document.createElement('div');
                const tagTitle = document.createElement('div');

                tagContainer.className = 'vt__time-tag';
                tag.className = 'vt__tag';
                tagTitle.className = 'vt__tag-title';
                // data-tag prevents normal tooltip
                tagTitle.innerHTML = `<span data-tag="${true}">${timeTag.title}</span>`;
                tagTitle.setAttribute('data-tag', true);
                tag.setAttribute('data-tag', true);
                tag.addEventListener('click', () => {
                    this.video.currentTime = this.convertTimestamp(timeTag.timestamp);
                });
                tagContainer.appendChild(tag);
                tagContainer.appendChild(tagTitle);
                tagContainer.style.left =
                    (this.convertTimestamp(timeTag.timestamp) / this.video.duration) * 100 + '%';

                this.$refs.videoTrackContainer.appendChild(tagContainer);
            });
        },
        convertTimestamp(time) {
            if (time.length > 5) {
                const hours = parseFloat(time.split(':')[0]);
                const minutes = parseFloat(time.split(':')[1]);
                const seconds = parseFloat(time.split(':')[2]);

                return hours * 60 * 60 + minutes * 60 + seconds;
            } else if (time.length > 3) {
                const minutes = parseFloat(time.split(':')[0]);
                const seconds = parseFloat(time.split(':')[1]);

                return minutes * 60 + seconds;
            } else if (time.split(':')[1]) return parseFloat(time.split(':')[1]);
            else return parseFloat(time);
        },
        setThumbPosition() {
            // Continual update when playing
            if (!this.$refs.played || !this.videoPlaying || this.dragging) return;
            this.playedPixels = this.$refs.played.offsetWidth;

            setTimeout(this.setThumbPosition, 10);
        },
        setTrackPosition() {
            // Continual update when playing
            if (!this.videoPlaying || this.dragging || this.videoLoading) return;
            this.playedPercent = (this.videoCurrentTime / this.video.duration) * 100;

            setTimeout(this.setTrackPosition, 10);
        },
        setTransitionDuration() {
            if (!this.$refs.thumbContainer || !this.$refs.played || !this.videoPlaying) return;

            // If duration is too low thumb lags behind
            if (this.video.duration > 30) this.$refs.thumbContainer.style.transitionDuration = '1s';
            this.$refs.played.style.transitionDuration = '1s';
        },
        removeTransitionDuration() {
            if (!this.$refs.thumbContainer || !this.$refs.played) return;

            this.$refs.thumbContainer.style.transitionDuration = '0s';
            this.$refs.played.style.transitionDuration = '0s';
        },
        scrubStart(e) {
            // Ensure transition duration set if scrubbing back from end
            this.videoEnded = false;

            // Detect right click
            if (e.which === 3 || e.button === 2) return;

            const trackX = this.$refs.videoTrackContainer.getBoundingClientRect().x;
            const eventPlayed = (e.pageX - trackX) / this.$refs.videoTrackContainer.offsetWidth;

            this.videoLoading = true;
            this.dragging = true;
            this.removeTransitionDuration();

            // Set video time
            this.video.currentTime = eventPlayed * this.video.duration;
            // Set played track position
            this.playedPercent = eventPlayed * 100;
            // Set thumb position
            setTimeout(() => (this.playedPixels = this.$refs.played.offsetWidth), 1);
        },
        scrubbing(e) {
            if (!this.dragging) return;
            const trackX = this.$refs.videoTrackContainer.getBoundingClientRect().x;
            const eventPlayed = (e.pageX - trackX) / this.$refs.videoTrackContainer.offsetWidth;

            this.videoLoading = true;
            if (eventPlayed < 0) {
                // Set video time
                this.video.currentTime = 0;
                // Set played track position
                this.playedPercent = 0;
            } else {
                this.video.currentTime = eventPlayed * this.video.duration;
                this.playedPercent = eventPlayed * 100;
            }

            // Set thumb position
            this.playedPixels = this.$refs.played.offsetWidth;
        },
        scrubEnd() {
            this.dragging = false;
            if (this.$refs.played) this.playedPixels = this.$refs.played.offsetWidth;

            // Reset state if not loading
            const resetStateInterval = setInterval(() => {
                if (this.videoLoading) return;
                this.setTrackPosition();
                this.setThumbPosition();
                if (!this.videoEnded) this.setTransitionDuration();

                clearInterval(resetStateInterval);
            }, 100);
        },
        playHandler() {
            this.videoPlaying = true;
            this.setThumbPosition();
            this.setTrackPosition();

            if (this.videoEnded) {
                const endedInterval = setInterval(() => {
                    if (this.playedPixels > 10) return;
                    this.videoEnded = false;
                    this.setTransitionDuration();

                    clearInterval(endedInterval);
                }, 100);
            } else this.setTransitionDuration();
        },
        skipHandler() {
            let currentMillisecond = 0;
            this.videoEnded = false;

            const trackInterval = setInterval(() => {
                // Determine if video is able to play consistently
                const ready =
                    this.videoPlaying &&
                    this.video.readyState !== 1 &&
                    this.video.networkState !== 2 &&
                    !this.videoLoading;

                currentMillisecond += 100;
                this.playedPercent = (this.videoCurrentTime / this.video.duration) * 100;

                if (this.$refs.played) {
                    setTimeout(() => (this.playedPixels = this.$refs.played.offsetWidth), 1);
                }

                if (!this.videoEnded && ready) this.setTransitionDuration();
                if (ready || currentMillisecond > 3000) clearInterval(trackInterval);
            }, 100);
        },
    },
    created() {
        // Toggle thumb position function on play/pause
        let playPauseTimeout;

        this.video.addEventListener('play', () => {
            clearTimeout(playPauseTimeout);
            this.playHandler();
        });
        this.video.addEventListener('pause', () => {
            playPauseTimeout = setTimeout(() => (this.videoPlaying = false), 1000);
        });
        this.video.addEventListener('canplay', e => (this.videoLoading = false));
        this.video.addEventListener('ended', () => {
            this.videoEnded = true;
            this.removeTransitionDuration();
        });
        // Scrubbing
        document.addEventListener('mousemove', e => this.scrubbing(e));
        document.addEventListener('mouseup', () => this.scrubEnd());
        window.addEventListener('resize', () => {
            // Prevent thumb/track transition on resize/fullscreen
            this.removeTransitionDuration();
            if (this.$refs.played) this.playedPixels = this.$refs.played.offsetWidth;

            setTimeout(() => this.setTransitionDuration(), 100);
        });
        // 5 second time skips on left/right arrow keys

        document.addEventListener('keydown', e => {
            if (this.video.id !== focusedStore().focused.value) return;
            if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
            e.preventDefault();
            this.$emit('video-focused');
        });
        document.addEventListener('keyup', e => {
            if (this.video.id !== focusedStore().focused.value) return;
            if (e.key === 'ArrowRight') this.video.currentTime += 5;
            else if (e.key === 'ArrowLeft') this.video.currentTime -= 5;
            else return;
            this.removeTransitionDuration();
            this.skipHandler();
        });
    },
    mounted() {
        this.createTimeTags();
    },
};
</script>

<style lang="scss">
.vt__video-container {
    .vt__time {
        @include flex-x(false, center);
        justify-self: center;
        position: relative;
        width: inherit;
        pointer-events: none;
        height: fit-content;
    }
    .vt__current-time,
    .vt__video-duration {
        @include flex-x(false, center);
        padding: 5px;
    }
    span {
        margin: 0 5px;
        width: 45px;
        font-size: 12px;
        white-space: nowrap;
        text-align: right;
    }
    .vt__video-tooltip {
        pointer-events: none;
        position: relative;
        top: -27px;
    }
    .vt__video-tip {
        position: absolute;
        text-align: center;
        font-size: 12px;
        color: $white;
        opacity: 0;
        z-index: 2;
        transition: opacity 0.3s cubic-bezier(0.215, 0.61, 0.355, 1);
    }
    .vt__video-range-container {
        @include flex-x(false, center);
        position: relative;
        width: 100%;
        z-index: 0;
    }
    input {
        width: 100%;
    }
    .vt__video-thumb-container {
        position: relative;
        transition: transform 0s cubic-bezier(0, 1, 1, 1);
    }
    .vt__video-thumb {
        cursor: pointer;
        margin-left: -6.5px;
        width: 15px;
        height: 15px;
        background-color: $white;
        border-radius: 0%;
        transform: scaleX(0.5) scaleY(0.2);
        box-shadow: 0px 0px 5px rgba($black, 0.5);
        transition: transform 0.1s cubic-bezier(0.215, 0.61, 0.355, 1),
            border-radius 0.1s cubic-bezier(0.215, 0.61, 0.355, 1);
    }
    .vt__video-track-container {
        cursor: pointer;
        pointer-events: all;
        position: absolute;
        padding: 10px 0;
        width: 100%;
        z-index: -1;
    }
    .vt__video-track {
        position: relative;
        width: 100%;
        height: 3px;
        background-color: rgba($white, 0.2);
        transition: transform 0.1s cubic-bezier(0.215, 0.61, 0.355, 1);
    }
    .vt__video-played {
        position: absolute;
        width: 100%;
        height: 100%;
        background-color: #5bd0b9;
        transition: max-width 0s cubic-bezier(0.215, 0.61, 0.355, 1);
    }
    .vt__video-buffered {
        position: absolute;
        width: 100%;
        height: 100%;
        max-width: 0%;
        background-color: rgba($white, 0.3);
        transition: all 0.5s;
    }
    .vt__time-tag {
        display: flex;
        flex-direction: column-reverse;
        pointer-events: none;
        position: absolute;
        padding: 5px 0;
        height: 35px;
        transform: translateY(-30px);
        transition: transform 0.1s cubic-bezier(0.215, 0.61, 0.355, 1);

        span {
            width: unset;
        }
    }
    .vt__tag-title {
        pointer-events: none;
        display: flex;
        padding: 2px;
        transform: translate(calc(-50% + 2px), -15px);
        background-color: $white;
        color: $black;
        border-radius: 1px;
        box-shadow: 0px 0px 10px $black;
        opacity: 0;
        transition: all 0.2s cubic-bezier(0.215, 0.61, 0.355, 1);
    }
    .vt__tag {
        pointer-events: all;
        height: 3px;
        width: 5px;
        background-color: rgba($white, 0.6);
        transform: translateX(-25%);
        transition: all 0.1s cubic-bezier(0.215, 0.61, 0.355, 1),
            background-color 0.5s cubic-bezier(0.215, 0.61, 0.355, 1);
    }
    .vt__tag:hover {
        background-color: rgba($white, 1);
    }
    .vt__tag:hover ~ .vt__tag-title {
        opacity: 1;
        transform: translate(calc(-50% + 2px), -6px);
    }
}
</style>
