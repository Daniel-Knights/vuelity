<template>
    <header
        class="dk__navbar"
        :class="{ 'dk__navbar-slider': slider }"
        ref="nav"
        :style="containerStyles"
    >
        <div class="dk__navbar-inner" :style="styles">
            <slot></slot>
            <DKBurger
                v-if="slider"
                @open="slideNav($event)"
                :style="burgerPosition()"
                :styles="burgerStyles"
            ></DKBurger>
        </div>
    </header>
</template>

<script>
import { onMounted, ref } from 'vue';

import DKBurger from './Burger';

export default {
    name: 'Navbar',

    components: { DKBurger },

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
            nav.value.classList.toggle('dk__navbar-slider-open');
        };

        onMounted(() => {
            // Set position
            nav.value.classList.add(`dk__navbar-${props.position}`);
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

            return position[this.position];
        },
    },
};
</script>

<style lang="scss">
@mixin vertical($shadow: -5px) {
    position: fixed;
    width: auto;

    .dk__navbar-inner {
        flex-direction: column;
        width: 200px;
        height: 100vh;
        box-shadow: $shadow 0 10px 5px $black;
    }
}

.dk__navbar {
    position: relative;
    width: 100%;
    z-index: 10;

    &.dk__navbar-slider.dk__navbar-slider-open {
        transform: translate(0, 0);
    }
}

.dk__navbar-inner {
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

.dk__navbar-top {
    top: 0;

    &.dk__navbar-slider {
        transform: translateY(-100%);
    }
}
.dk__navbar-bottom {
    position: fixed;
    bottom: 0;

    .dk__navbar-inner {
        box-shadow: 0 5px 10px 5px $black;
    }

    &.dk__navbar-slider {
        transform: translateY(100%);
    }
}
.dk__navbar-left {
    left: 0;
    @include vertical;

    &.dk__navbar-slider {
        transform: translateX(-100%);
    }
}
.dk__navbar-right {
    right: 0;
    @include vertical(5px);

    &.dk__navbar-slider {
        transform: translateX(100%);
    }
}
</style>
