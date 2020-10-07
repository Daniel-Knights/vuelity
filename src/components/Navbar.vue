<template>
    <header
        class="vt__navbar"
        :class="{ 'vt__navbar-slider': slider }"
        ref="nav"
        :style="containerStyles"
    >
        <div class="vt__navbar-inner" :style="styles">
            <slot></slot>
            <VTBurger v-if="slider" @open="slideNav($event)" :style="burgerPosition()"></VTBurger>
        </div>
    </header>
</template>

<script>
import { onMounted, ref } from 'vue';

import VTBurger from './Burger';

export default {
    name: 'Navbar',

    components: { VTBurger },

    props: {
        position: {
            type: String,
            default: 'top',
            validator(position) {
                return ['top', 'bottom', 'left', 'right'].indexOf(position) > -1;
            },
        },
        styles: { type: Object, default: {} },
        containerStyles: { type: Object, default: {} },
        burgerStyles: { type: Object, default: {} },
        slider: { type: Boolean, default: false },
    },

    setup(props) {
        const nav = ref(null);

        const slideNav = e => {
            if (!nav) return;
            // Toggle open/closed state
            nav.value.classList.toggle('vt__navbar-slider-open');
        };

        onMounted(() => {
            // Set position
            nav.value.classList.add(`vt__navbar-${props.position}`);
            // Allow for transition delay
            setTimeout(() => (nav.value.style.transition = 'all 0.25s'), 250);
        });

        return { nav, slideNav };
    },

    methods: {
        burgerPosition() {
            const position = {
                top: {
                    bottom: '-5px',
                    right: '5px',
                    transform: 'translateY(100%)',
                },
                left: {
                    top: '5px',
                    right: '-5px',
                    transform: 'translateX(100%)',
                },
                right: {
                    top: '5px',
                    left: '-5px',
                    transform: 'translateX(-100%)',
                },
                bottom: {
                    top: '-5px',
                    right: '5px',
                    transform: 'translateY(-100%)',
                },
            };

            return { ...position[this.position], ...this.burgerStyles };
        },
    },
};
</script>

<style lang="scss">
@mixin vertical($shadow: -5px) {
    position: fixed;
    width: auto;

    .vt__navbar-inner {
        flex-direction: column;
        position: relative;
        width: 200px;
        height: 100vh;
        box-shadow: $shadow 0 10px 5px $black;
    }
}

.vt__navbar {
    position: relative;
    width: 100%;
    z-index: 10;

    &.vt__navbar-slider.vt__navbar-slider-open {
        transform: translate(0, 0);
    }
}

.vt__navbar-inner {
    @include flex-x(space-between, center);
    right: 0;
    left: 0;
    padding: 10px;
    min-height: 100px;
    text-align: left;
    font-family: $font_primary;
    color: $white;
    background-color: $primary;
    box-shadow: 0 -5px 10px 5px $black;
    z-index: 1;
}

.vt__navbar-top {
    top: 0;

    &.vt__navbar-slider {
        transform: translateY(-100%);
    }
}
.vt__navbar-bottom {
    position: fixed;
    bottom: 0;

    .vt__navbar-inner {
        box-shadow: 0 5px 10px 5px $black;
    }

    &.vt__navbar-slider {
        transform: translateY(100%);
    }
}
.vt__navbar-left {
    left: 0;
    @include vertical;

    &.vt__navbar-slider {
        transform: translateX(-100%);
    }
}
.vt__navbar-right {
    right: 0;
    @include vertical(5px);

    &.vt__navbar-slider {
        transform: translateX(100%);
    }
}
</style>
