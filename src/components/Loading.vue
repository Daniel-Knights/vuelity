<template>
    <div
        class="vt__loading-container"
        :style="containerStyles"
        aria-busy="true"
        aria-label="loading"
        aria-live="polite"
    >
        <slot>
            <div v-if="default" :style="styles" aria-hidden="true">
                <div class="vt__loading"></div>
                <div class="vt__loading"></div>
                <div class="vt__loading"></div>
                <div class="vt__loading"></div>
                <div class="vt__loading"></div>
            </div>
            <div v-else :style="styles" class="vt__spinner" aria-hidden="true">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        </slot>
    </div>
</template>

<script>
export default {
    name: 'Loading',

    props: {
        styles: { type: Object, default: {} },
        containerStyles: { type: Object, default: {} },
        default: { type: Boolean, default: true },
    },
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

    .vt__spinner {
        display: inline-block;
        position: relative;
        width: 120px;
        height: 120px;

        > * {
            box-sizing: border-box;
            display: block;
            position: absolute;
            margin: 8px;
            width: 100px;
            height: 100px;
            border: 3px solid;
            border-radius: 50%;
            border-color: $white transparent transparent transparent;
            animation: vt__spinner 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;

            &:nth-child(1) {
                animation-delay: -0.45s;
            }
            &:nth-child(2) {
                animation-delay: -0.3s;
            }
            &:nth-child(3) {
                animation-delay: -0.15s;
            }
        }

        @keyframes vt__spinner {
            to {
                transform: rotate(360deg);
            }
        }
    }
}
</style>
