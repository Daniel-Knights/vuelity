<template>
    <button
        :style="styles"
        class="vt__component vt__btn"
        :class="{
            'vt__fill-border': fillBorder,
            vt__rainbow: rainbow,
            'vt__only-border': onlyBorder || fillBorder,
            'vt__hover-enabled': hoverEnabled,
        }"
        tabindex="0"
        ref="button"
    >
        <div v-if="shine" ref="shine" class="vt__shine"></div>
        <div class="vt__btn-content" ref="content">
            <slot>SUBMIT</slot>
        </div>
    </button>
</template>

<script>
import { onMounted, ref } from 'vue';
import rippleHandler from './ripple';

export default {
    name: 'Button',

    props: {
        styles: { type: Object, default: {} },
        rainbow: { type: Boolean, default: false },
        fillBorder: { type: Boolean, default: false },
        onlyBorder: { type: Boolean, default: false },
        ripple: { type: Boolean, default: true },
        shine: { type: Boolean, default: false },
        hoverEnabled: { type: Boolean, default: true },
        hoverColor: { type: String, default: '#ffffff' },
        hoverBackground: { type: String, default: '#5bd0b9' },
    },

    setup(props) {
        const button = ref(null);
        const content = ref(null);

        const setProp = (property, color) => {
            button.value.style.setProperty(property, color);
        };

        onMounted(() => {
            setProp('--hover-color', props.hoverColor);
            setProp('--hover-bg', props.hoverBackground);

            // Set ripple effect
            if (props.ripple) {
                button.value.addEventListener('click', e => rippleHandler(e, content.value));
            }

            // Set CSS border-radius variable
            if (props.styles.borderRadius) {
                setProp('--border-radius', props.styles.borderRadius);
            }

            // Safari ripple
            if (navigator.vendor.match(/apple/i)) {
                button.value.style.webkitMaskImage = 'radial-gradient(white, black)';
            }
        });

        return { button, content, setProp };
    },

    watch: {
        hoverColor(val) {
            this.setProp('--hover-color', val);
        },
        hoverBackground(val) {
            this.setProp('--hover-bg', val);
        },
    },

    mounted() {
        // Randomize shine animation delay
        if (this.shine) this.$refs.shine.style.animationDelay = Math.random() * 1 + 's';
    },
};
</script>

<style lang="scss">
@import '../sass/ripple';

.vt__component {
    --hover-color: #ffffff;
    --hover-bg: #5bd0b9;
    --border-radius: 5px;

    font-family: 'Lato', Helvetica, sans-serif;

    @mixin after {
        content: '';
        display: block;
        position: absolute;
        left: -50%;
        top: -50%;
        width: 200%;
        height: 200%;
        background-size: 200% 200%;
        transform: skew(40deg);
        z-index: 0;
        animation: vt__background-shift 5s linear infinite;
    }

    &.vt__btn {
        cursor: pointer;
        display: block;
        position: relative;
        height: 40px;
        min-width: 125px;
        font: 18px bold $font_primary;
        border: none;
        border-width: 3px;
        border-radius: var(--border-radius);
        color: $white;
        background-color: darken($primary, 10%);
        box-shadow: 0px 0px 5px -2px $black;
        overflow: hidden;
        transition: all 0.25s;
    }

    .vt__btn-content {
        position: relative;
        z-index: 1;
    }

    .vt__shine {
        position: absolute;
        top: 0;
        left: -50%;
        height: 50px;
        width: 10px;
        opacity: 0;
        background-color: rgba($white, 0.9);
        transform: skew(-10deg);
        animation: vt__shine 5s cubic-bezier(0.95, 0.05, 0.795, 1) infinite;
        z-index: 3;
    }

    &.vt__hover-enabled:hover {
        color: var(--hover-color);
        background-color: var(--hover-bg);
    }

    &.vt__only-border::before {
        content: '';
        display: block;
        position: absolute;
        left: 3px;
        top: 3px;
        width: calc(100% - 6px);
        height: calc(100% - 6px);
        border-radius: var(--border-radius);
        background-color: #000;
        z-index: 1;
    }

    &.vt__rainbow {
        background: transparent;

        &::after {
            background: linear-gradient(
                to right,
                #f79533,
                #f37055,
                #ef4e7b,
                #a166ab,
                #5073b8,
                #1098ad,
                #07b39b,
                #6fba82,
                #f79533
            );
            @include after;
        }
    }

    &.vt__fill-border {
        background: transparent;

        &::after {
            @include scrim-gradient($primary, 'to right');
            @include after;
        }
    }

    @keyframes vt__shine {
        0%,
        100% {
            left: -50%;
            opacity: 0;
        }
        25% {
            left: 100%;
            opacity: 1;
        }
        30% {
            opacity: 0;
            left: 200%;
        }
    }
    @keyframes vt__background-shift {
        0% {
            background-position: 0% 50%;
        }
        100% {
            background-position: 200% 50%;
        }
    }
}
</style>
