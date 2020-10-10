<template>
    <div class="vt__hoverbox-container" :style="containerStyles" ref="container">
        <svg
            class="vt__hoverbox"
            :width="hoverboxWidth"
            :height="hoverboxHeight"
            :style="styles"
            ref="hoverbox"
        >
            <rect :width="hoverboxWidth" :height="hoverboxHeight" :fill="fill" />
        </svg>
        <div class="vt__slot-container">
            <slot />
        </div>
    </div>
</template>

<script>
import { ref, onMounted } from 'vue';

export default {
    name: 'Hoverbox',

    props: {
        styles: { type: Object, default: {} },
        containerStyles: Object,
        width: Number,
        height: Number,
        fill: { type: String, default: 'rgba(255, 255, 255, 0.5)' },
    },

    setup(props) {
        const container = ref(null);
        const hoverbox = ref(null);
        const hoverboxWidth = ref(props.width);
        const hoverboxHeight = ref(props.height);

        const hoverboxMouseover = () => {
            if (!hoverbox.value) return;
            hoverbox.value.style.transform = 'rotateY(0deg) scale(1)';
            hoverbox.value.style.opacity = '1';
        };
        const hoverboxMouseout = () => {
            if (!hoverbox.value) return;
            hoverbox.value.style.transform = 'rotateY(30deg) scale(0.8)';
            hoverbox.value.style.opacity = '0';
        };

        onMounted(() => {
            if (props.width === undefined && container.value) {
                hoverboxWidth.value = container.value.offsetWidth + 20;
            }
            if (props.height === undefined && container.value) {
                hoverboxHeight.value = container.value.offsetHeight + 10;
            }

            container.value.addEventListener('mouseover', hoverboxMouseover);
            container.value.addEventListener('mouseout', hoverboxMouseout);
        });

        window.addEventListener('resize', () => {
            if (props.width || props.height || !container.value) return;
            hoverboxWidth.value = container.value.offsetWidth + 20;
            hoverboxHeight.value = container.value.offsetHeight + 10;
        });

        return { hoverbox, container, hoverboxWidth, hoverboxHeight };
    },
};
</script>

<style lang="scss">
.vt__hoverbox-container {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    width: fit-content;

    .vt__hoverbox {
        pointer-events: none;
        position: absolute;
        transform: rotateY(30deg) scale(0.8);
        opacity: 0;
        border-radius: 5px;
        transition: all 0.3s cubic-bezier(0.215, 0.61, 0.355, 1);
        z-index: 0;
    }

    .vt__slot-container {
        z-index: 1;
    }
}
</style>
