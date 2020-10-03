<template>
    <button
        :style="styles"
        @mouseover="addHoverColor()"
        @mouseout="removeHoverColor()"
        class="dk__component dk__btn"
        @click="rippleHandler($event)"
    >
        <div v-if="shine" ref="shine" class="dk__shine"></div>
        <slot></slot>
    </button>
</template>

<script>
export default {
    name: 'Button',

    props: {
        styles: Object,
        hoverColor: String,
        hoverBackground: String,
        ripple: {
            type: Boolean,
            default: true,
        },
        shine: {
            type: Boolean,
            default: false,
        },
        rainbow: {
            type: Boolean,
            default: false,
        },
        onlyBorder: {
            type: Boolean,
            default: false,
        },
        fillBorder: {
            type: Boolean,
            default: false,
        },
    },

    methods: {
        rippleHandler(e) {
            const rect = e.target.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            let rippleEl = document.createElement('div');
            rippleEl.setAttribute('class', 'dk__ripple');

            rippleEl.style.left = `${x}px`;
            rippleEl.style.top = `${y}px`;

            if (this.ripple) this.$el.appendChild(rippleEl);

            setTimeout(() => rippleEl.remove(), 500);
        },
        addHoverColor() {
            this.$el.style.color = this.hoverColor;
            this.$el.style.backgroundColor = this.hoverBackground;
        },
        removeHoverColor() {
            this.$el.style.backgroundColor = this.background;
            this.$el.style.color = this.color;
        },
    },

    mounted() {
        // Randomize shine animation delay
        if (this.shine) this.$refs.shine.style.animationDelay = Math.random() * 1 + 's';

        // Rainbow button
        if (this.rainbow) {
            this.$el.style.background = 'transparent';
            this.$el.classList.add('dk__rainbow-after');
        }

        // Inner fill
        if (this.onlyBorder) this.$el.classList.add('dk__only-border');

        // Single color/transparent animation fill
        if (this.fillBorder) {
            this.$el.style.background = 'transparent';
            this.$el.classList.add('dk__fill');
        }

        // Set CSS border-radius variable
        if (this.$el.style.borderRadius) {
            this.$el.style.setProperty('--border-radius', this.$el.style.borderRadius);
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
.dk__component {
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
        z-index: -2;
        animation: dk__background-shift 5s linear infinite;
    }

    &.dk__btn {
        cursor: pointer;
        display: block;
        position: relative;
        height: 40px;
        width: 125px;
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

        &:hover {
            background-color: $primary;
        }
    }

    .dk__ripple {
        pointer-events: none !important;
        position: absolute !important;
        margin: 0 !important;
        padding: 0 !important;
        background-color: $white;
        transform: translate(-50%, -50%) !important;
        border-radius: 50% !important;
        height: 55rem !important;
        width: 15rem !important;
        animation: dk__ripple-out 0.5s cubic-bezier(0.4, 0, 0.6, 1) forwards !important;
    }

    .dk__shine {
        position: absolute;
        top: 0;
        left: -50%;
        height: 50px;
        width: 10px;
        opacity: 0;
        background-color: rgba($white, 0.9);
        transform: skew(-10deg);
        animation: dk__shine 5s cubic-bezier(0.95, 0.05, 0.795, 1) infinite;
    }

    &.dk__only-border.dk__btn::before {
        content: '';
        display: block;
        position: absolute;
        left: 3px;
        top: 3px;
        width: calc(100% - 6px);
        height: calc(100% - 6px);
        border-radius: var(--border-radius);
        background-color: #000;
        z-index: -1;
    }

    &.dk__rainbow-after.dk__btn::after {
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

    &.dk__fill.dk__btn::after {
        @include scrim-gradient($primary, 'to right');
        @include after;
    }

    @keyframes dk__shine {
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
    @keyframes dk__ripple-out {
        0% {
            opacity: 0;
            max-height: 0rem;
            max-width: 0rem;
        }
        50% {
            opacity: 0.3;
        }
        90% {
            opacity: 0.1;
        }
        100% {
            opacity: 0;
            max-height: 10rem;
            max-width: 10rem;
        }
    }
    @keyframes dk__background-shift {
        0% {
            background-position: 0% 50%;
        }
        100% {
            background-position: 200% 50%;
        }
    }
}
</style>
