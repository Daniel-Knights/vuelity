<template>
    <div class="dk__hoverbox-container" :style="containerStyles" ref="hoverboxContainer">
        <svg
            class="dk__hoverbox"
            :width="hoverboxWidth"
            :height="hoverboxHeight"
            :style="styles"
            ref="hoverbox"
        >
            <rect :width="hoverboxWidth" :height="hoverboxHeight" :fill="fill" />
        </svg>
        <slot />
    </div>
</template>

<script>
export default {
    name: 'Hoverbox',

    props: {
        width: Number,
        height: Number,
        styles: Object,
        containerStyles: Object,
        fill: {
            type: String,
            default: 'rgba(255, 255, 255, 0.5)',
        },
    },

    data() {
        return {
            hoverboxWidth: 0,
            hoverboxHeight: 0,
        };
    },

    methods: {
        hoverboxMouseover() {
            if (!this.$refs.hoverbox) return;
            this.$refs.hoverbox.style.transform = 'rotateY(0deg) scale(1)';
            this.$refs.hoverbox.style.opacity = '1';
        },
        hoverboxMouseout() {
            if (!this.$refs.hoverbox) return;
            this.$refs.hoverbox.style.transform = 'rotateY(30deg) scale(0.8)';
            this.$refs.hoverbox.style.opacity = '0';
        },
    },

    mounted() {
        const container = this.$refs.hoverboxContainer;

        if (!container) return;

        if (this.width) this.hoverboxWidth = this.width;
        if (this.height) this.hoverboxHeight = this.height;
        if (this.width == undefined) this.hoverboxWidth = container.offsetWidth + 20;
        if (this.height == undefined) this.hoverboxHeight = container.offsetHeight + 10;

        container.addEventListener('mouseover', this.hoverboxMouseover);
        container.addEventListener('mouseout', this.hoverboxMouseout);

        window.addEventListener('resize', () => {
            if (this.width || this.height) return;
            this.hoverboxWidth = container.offsetWidth + 20;
            this.hoverboxHeight = container.offsetHeight + 10;
        });
    },
};
</script>

<style lang="scss">
.dk__hoverbox-container {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    width: fit-content;

    .dk__hoverbox {
        pointer-events: none;
        position: absolute;
        transform: rotateY(30deg) scale(0.8);
        opacity: 0;
        border-radius: 5px;
        transition: all 0.3s cubic-bezier(0.215, 0.61, 0.355, 1);
        z-index: -100;
    }
}
</style>
