<template>
    <div class="dk__time dk__control">
        <div class="dk__current-time">
            <span>{{ convertMilliseconds(videoCurrentTime) }} </span>
        </div>
        <div class="dk__video-tooltip">
            <span ref="tooltip" class="dk__video-tip">{{ timeValueHover }}</span>
        </div>
        <div
            class="dk__video-range-container"
            @mousemove="calculateTimeHover($event)"
            @mouseover="tooltipShow($event)"
            @mouseout="tooltipHide()"
        >
            <div
                class="dk__video-thumb-container"
                :style="{
                    transform: 'translateX(' + playedPixels + 'px)',
                }"
                ref="thumbContainer"
            >
                <div class="dk__video-thumb" :style="thumbStyles" ref="thumb"></div>
            </div>
            <div
                class="dk__video-track-container"
                @mousedown="scrubStart($event)"
                @mouseover="scaleTrackUp()"
                @mouseout="scaleTrackDown()"
                ref="videoTrackContainer"
            >
                <div class="dk__video-track" ref="videoTrack">
                    <div
                        class="dk__video-played"
                        :style="{
                            maxWidth: playedPercent + '%',
                            backgroundColor: trackColor,
                        }"
                        ref="played"
                    ></div>
                    <div
                        class="dk__video-buffered"
                        :style="{ maxWidth: videoBuffered + '%' }"
                    ></div>
                </div>
            </div>
        </div>
        <div class="dk__video-duration">
            <span> {{ convertMilliseconds(video.duration) }}</span>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Time',

    props: {
        video: HTMLVideoElement,
        videoId: String,
        videoCurrentTime: Number,
        videoFocused: String,
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
            document.querySelectorAll('.dk__tag').forEach(tag => {
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
            document.querySelectorAll('.dk__tag').forEach(tag => {
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

                tagContainer.className = 'dk__time-tag';
                tag.className = 'dk__tag';
                tagTitle.className = 'dk__tag-title';
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
            if (!this.$refs.thumbContainer || !this.$refs.played) return;

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
            setTimeout(() => {
                this.playedPixels = this.$refs.played.offsetWidth;
            }, 1);
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

            const interval = setInterval(() => {
                if (!this.videoLoading) {
                    this.setTrackPosition();
                    this.setThumbPosition();
                    if (!this.videoEnded) this.setTransitionDuration();

                    clearInterval(interval);
                }
            }, 100);
        },
        playHandler() {
            this.videoPlaying = true;
            this.setThumbPosition();
            this.setTrackPosition();

            if (!this.videoEnded) this.setTransitionDuration();
            else {
                this.videoEnded = false;

                setTimeout(() => this.setTransitionDuration(), 1000);
            }
        },
        skipHandler() {
            let currentMillisecond = 0;

            const trackInterval = setInterval(() => {
                this.playedPercent = (this.videoCurrentTime / this.video.duration) * 100;
                if (this.$refs.played) {
                    setTimeout(() => (this.playedPixels = this.$refs.played.offsetWidth), 1);
                }

                if (this.videoPlaying) clearInterval(trackInterval);
            }, 100);

            const transitionInterval = setInterval(() => {
                if (!this.videoPlaying) return;
                this.setTransitionDuration();

                clearInterval(transitionInterval);
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
            playPauseTimeout = setTimeout(() => {
                this.videoPlaying = false;
            }, 1000);
        });
        this.video.addEventListener('canplay', e => {
            this.videoLoading = false;
        });
        this.video.addEventListener('ended', () => {
            this.videoEnded = true;
            this.removeTransitionDuration();
        });
        // Scrubbing
        document.addEventListener('mousemove', e => {
            this.scrubbing(e);
        });
        document.addEventListener('mouseup', () => {
            this.scrubEnd();
        });
        window.addEventListener('resize', () => {
            // Prevent thumb/track transition on resize/fullscreen
            this.removeTransitionDuration();
            if (this.$refs.played) this.playedPixels = this.$refs.played.offsetWidth;

            setTimeout(() => {
                this.setTransitionDuration();
            }, 100);
        });
        // 5 second time skips on left/right arrow keys
        document.addEventListener('keyup', e => {
            if (e.key !== 'ArrowRight' || this.videoId !== this.videoFocused) return;
            this.removeTransitionDuration();
            this.video.currentTime += 5;
            this.skipHandler();
        });
        document.addEventListener('keyup', e => {
            if (e.key !== 'ArrowLeft' || this.videoId !== this.videoFocused) return;
            this.removeTransitionDuration();
            this.video.currentTime -= 5;
            this.skipHandler();
        });
    },
    mounted() {
        this.createTimeTags();
    },
};
</script>

<style lang="scss">
.dk__video-container {
    .dk__time {
        @include flex-x(false, center);
        justify-self: center;
        position: relative;
        width: inherit;
        pointer-events: none;
        height: fit-content;
    }
    .dk__current-time,
    .dk__video-duration {
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
    .dk__video-tooltip {
        pointer-events: none;
        position: relative;
        top: -27px;
    }
    .dk__video-tip {
        position: absolute;
        text-align: center;
        font-size: 12px;
        color: $white;
        opacity: 0;
        z-index: 2;
        transition: opacity 0.3s cubic-bezier(0.215, 0.61, 0.355, 1);
    }
    .dk__video-range-container {
        @include flex-x(false, center);
        position: relative;
        width: 100%;
        z-index: 0;
    }
    input {
        width: 100%;
    }
    .dk__video-thumb-container {
        position: relative;
        transition: transform 0s cubic-bezier(0, 1, 1, 1);
    }
    .dk__video-thumb {
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
    .dk__video-track-container {
        cursor: pointer;
        pointer-events: all;
        position: absolute;
        padding: 10px 0;
        width: 100%;
        z-index: -1;
    }
    .dk__video-track {
        position: relative;
        width: 100%;
        height: 3px;
        background-color: rgba($white, 0.2);
        transition: transform 0.1s cubic-bezier(0.215, 0.61, 0.355, 1);
    }
    .dk__video-played {
        position: absolute;
        width: 100%;
        height: 100%;
        background-color: rgb(40, 123, 225);
        transition: max-width 0s cubic-bezier(0.215, 0.61, 0.355, 1);
    }
    .dk__video-buffered {
        position: absolute;
        width: 100%;
        height: 100%;
        max-width: 0%;
        background-color: rgba($white, 0.3);
        transition: all 0.5s;
    }
    .dk__time-tag {
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
    .dk__tag-title {
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
    .dk__tag {
        pointer-events: all;
        height: 3px;
        width: 5px;
        background-color: rgba($white, 0.6);
        transform: translateX(-25%);
        transition: all 0.1s cubic-bezier(0.215, 0.61, 0.355, 1),
            background-color 0.5s cubic-bezier(0.215, 0.61, 0.355, 1);
    }
    .dk__tag:hover {
        background-color: rgba($white, 1);
    }
    .dk__tag:hover ~ .dk__tag-title {
        opacity: 1;
        transform: translate(calc(-50% + 2px), -6px);
    }
}
</style>
