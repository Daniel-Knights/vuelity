<template>
    <div class="vt__loading-container">
        <slot>
            <div class="vt__loading"></div>
            <div class="vt__loading"></div>
            <div class="vt__loading"></div>
            <div class="vt__loading"></div>
            <div class="vt__loading"></div>
        </slot>
    </div>
</template>

<script>
export default {
    name: 'Loading',

    props: {},
};
</script>

<style lang="scss">
.vt__loading-container {
    --bg: #5bd0b9;
    --color: #ffffff;

    @include flex-x(center, center);
    position: absolute;
    top: 0;
    left: 0;
    background: var(--bg);
    height: 100%;
    width: 100%;
    transform: translateZ(0);
    z-index: 10000;

    .vt__loading {
        display: inline-block;
        position: relative;
        width: 20px;
        height: 20px;
        background: var(--color);
        box-shadow: 0 0 5px -3px;
        opacity: 0;
        animation: vt__loading 1.2s cubic-bezier(0.5, 2, 0.5, 2) infinite;

        &:nth-of-type(2) {
            animation-delay: 0.1s;
        }
        &:nth-of-type(3) {
            animation-delay: 0.2s;
        }
        &:nth-of-type(4) {
            animation-delay: 0.3s;
        }
        &:nth-of-type(5) {
            animation-delay: 0.4s;
        }

        @keyframes vt__loading {
            0% {
                opacity: 0;
                transform: translate(-10%, -100%) scaleY(0);
            }
            10% {
                border-radius: 0;
            }
            50% {
                border-radius: 50% 0 50% 0;
                opacity: 1;
                transform: translate(0, 0) scaleY(1);
            }
            75% {
                border-radius: 0 50% 0 50%;
            }
            100% {
                border-radius: 0;
                opacity: 0;
                transform: translate(10%, 10%) scaleY(0);
            }
        }
    }
}
</style>
