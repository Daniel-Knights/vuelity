<template>
    <button
        @click="scroll($event)"
        @keyup.enter="scroll($event)"
        @mouseup="container.blur()"
        class="vt__scrolltop-container"
        :style="styles"
        aria-label="scroll to top"
        tabindex="0"
        ref="container"
    >
        <div class="vt__scrolltop" aria-hidden="true">
            <slot>
                <Chevron />
            </slot>
        </div>
    </button>
</template>

<script>
import { computed, onMounted, ref } from 'vue';
import rippleHandler from './js/ripple';
import Chevron from './svg/Chevron';

export default {
    name: 'Scrolltop',

    components: { Chevron },

    props: {
        styles: { type: Object, default: {} },
        target: { type: String, default: 'html' },
        smooth: { type: Boolean, default: true },
        ripple: { type: Boolean, default: true },
        background: { type: String, default: '#47cab1' },
        hoverBackground: { type: String, default: '#6fd6c1' },
        iconColor: { type: String, default: '#ffffff' },
        iconHoverColor: { type: String, default: '#ffffff' },
    },

    setup(props) {
        const container = ref(null);
        const target = computed(() => document.querySelector(props.target));

        const scroll = e => {
            target.value.scroll(0, 0);
            if (props.ripple) rippleHandler(e, container.value);
        };
        const setColor = (property, color) => {
            container.value.style.setProperty(property, color);
        };

        onMounted(() => {
            setColor('--bg', props.background);
            setColor('--bg-hover', props.hoverBackground);
            setColor('--icon', props.iconColor);
            setColor('--icon-hover', props.iconHoverColor);

            // Set scroll behaviour
            if (props.smooth) target.value.style.scrollBehavior = 'smooth';
        });

        return { container, open, scroll, setColor };
    },

    watch: {
        background(val) {
            this.setColor('--bg', val);
        },
        hoverBackground(val) {
            this.setColor('--bg-hover', val);
        },
        iconColor(val) {
            this.setColor('--icon', val);
        },
        iconHoverColor(val) {
            this.setColor('--icon-hover', val);
        },
    },
};
</script>

<style lang="scss">
.vt__scrolltop-container {
    --bg: #47cab1;
    --bg-hover: #6fd6c1;
    --icon: #ffffff;
    --icon-hover: #ffffff;

    cursor: pointer;
    pointer-events: all;
    @include flex-x(center, center);
    position: fixed;
    right: 50px;
    bottom: 30px;
    padding: 10px;
    height: 50px;
    background: var(--bg);
    border: none;
    border-radius: 50%;
    box-shadow: 0 0 7px -3px $black;
    overflow: hidden;
    box-sizing: border-box;
    transition: all 0.25s;
    z-index: 1000;

    .vt__scrolltop {
        pointer-events: none;
        position: relative;
        width: 30px;
        height: 20px;

        svg {
            width: 100%;
            height: 100%;
            transition: all 0.25s;

            path {
                fill: var(--icon);
            }
        }
    }

    &:hover,
    &:focus {
        background: var(--bg-hover);

        svg {
            transform: scale(1.2);

            path {
                fill: var(--icon-hover);
            }
        }
    }
}
</style>
