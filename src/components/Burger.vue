<template>
    <div @click="toggle($event)" class="vt__burger-container" :style="styles">
        <div class="vt__burger">
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
            e.target.classList.toggle('vt__burger-open');
            emit('open', open);
        };

        return { open, toggle };
    },
};
</script>

<style lang="scss">
.vt__burger-container {
    cursor: pointer;
    pointer-events: all;
    @include flex-x(center, center);
    position: absolute;
    padding: 10px;
    height: 50px;
    background: darken($primary, 5%);
    border-radius: 50%;
    box-shadow: 0 0 7px -3px $black;
    box-sizing: border-box;
    transition: all 0.25s;

    .vt__burger {
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

    &.vt__burger-open span {
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
        background: lighten($primary, 5%);
    }
}
</style>
