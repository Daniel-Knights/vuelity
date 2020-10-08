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
        hoverColor: String,
        hoverBackground: String,
        hoverEnabled: { type: Boolean, default: true },
        ripple: { type: Boolean, default: true },
        shine: { type: Boolean, default: false },
        rainbow: { type: Boolean, default: false },
        onlyBorder: { type: Boolean, default: false },
        fillBorder: { type: Boolean, default: false },
    },

    setup(props) {
        const button = ref(null);
        const content = ref(null);
        const ripple = rippleHandler;
        const background = ref('');
        const color = ref('');

        const setColors = () => {
            if (props.hoverColor) button.value.style.setProperty('--hover-color', props.hoverColor);
            if (props.hoverBackground)
                button.value.style.setProperty('--hover-background', props.hoverBackground);
        };

        onMounted(() => {
            if (props.ripple) {
                button.value.addEventListener('click', e => rippleHandler(e, content.value));
            }
        });

        return { button, content, background, color, setColors };
    },

    watch: {
        hoverColor() {
            this.setColors();
        },
        hoverBackground() {
            this.setColors();
        },
    },

    mounted() {
        // Randomize shine animation delay
        if (this.shine) this.$refs.shine.style.animationDelay = Math.random() * 1 + 's';

        // Set CSS border-radius variable
        if (this.styles.borderRadius) {
            this.$el.style.setProperty('--border-radius', this.styles.borderRadius);
        }

        // Store colors for hover
        this.background = this.$el.style.backgroundColor;
        this.color = this.$el.style.color;

        // Safari ripple
        if (navigator.vendor.match(/apple/i))
            this.$el.style.webkitMaskImage = 'radial-gradient(white, black)';
    },
};
</script>

<style lang="scss">
@import '../sass/ripple';

.vt__component {
    --hover-color: #ffffff;
    --hover-background: #83dbca;
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
        outline: none;
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
        background-color: $primary;
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

    &:hover {
        color: var(--hover-color);
        background-color: var(--hover-background);
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
