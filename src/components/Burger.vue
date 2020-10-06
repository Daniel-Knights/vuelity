<template>
    <div @click="toggle($event)" class="dk__burger-container" :style="styles">
        <div class="dk__burger">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
        </div>
    </div>
</template>

<script>
import { ref } from 'vue';

export default {
    name: 'Burger',

    props: {
        styles: { type: Object, default: {} },
    },

    setup(props, { emit }) {
        const open = ref(false);

        const toggle = e => {
            open.value = !open.value;
            e.target.classList.toggle('dk__burger-open');
            emit('open', open);
        };

        return { open, toggle };
    },
};
</script>

<style lang="scss">
.dk__burger-container {
    cursor: pointer;
    pointer-events: all;
    @include flex-x(center, center);
    position: absolute;
    padding: 10px;
    height: 50px;
    background: $primary;
    border-radius: 50%;
    box-shadow: 0 0 7px -3px $black;
    box-sizing: border-box;
    transition: all 0.25s;

    .dk__burger {
        pointer-events: none;
        position: relative;
        width: 30px;
        height: 20px;
        transform: translate3d(0, 2px, 0);

        span {
            display: block;
            position: absolute;
            height: 2px;
            width: 100%;
            left: 0;
            border-radius: 2px;
            background: $white;
            opacity: 1;
            transform: rotate(0deg);
            transition: all 0.25s ease-in-out;
        }

        $top: 0, 7, 7, 7, 14;

        @for $i from 1 through 5 {
            span:nth-child(#{$i}) {
                top: nth($top, $i) + px;
            }
        }
    }

    &.dk__burger-open span {
        background: $white;

        &:nth-of-type(1),
        &:nth-of-type(5) {
            transform: rotate(0deg) scaleY(0);
            top: 9px;
        }
        &:nth-of-type(2) {
            transform: rotate(45deg);
        }
        &:nth-of-type(3) {
            transform: rotate(-45deg);
        }
        &:nth-of-type(4) {
            transform: rotate(0deg) scaleY(0);
        }
    }

    &:hover {
        background: darken($primary, 10%);
    }
}
</style>
