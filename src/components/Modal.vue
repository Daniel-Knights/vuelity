<template>
    <teleport to="body">
        <div
            class="vt__modal-container"
            @click="closeHandler($event, container)"
            :style="containerStyles"
            ref="container"
        >
            <div v-if="notify" class="vt__exit-fullscreen">
                <span>Click outside or press esc to exit fullscreen</span>
            </div>
            <div
                class="vt__modal"
                :style="styles"
                @keyup.enter="closeHandler($event, modal)"
                role="dialog"
                aria-live="polite"
                tabindex="0"
                ref="modal"
            >
                <slot>
                    <h1>VTModal</h1>
                </slot>
            </div>
        </div>
    </teleport>
</template>

<script>
import { ref } from 'vue';

export default {
    name: 'Modal',

    emits: ['close'],

    props: {
        styles: { type: Object, default: {} },
        containerStyles: { type: Object, default: {} },
        notify: { type: Boolean, default: true },
    },

    setup(props, { emit }) {
        const container = ref(null);
        const modal = ref(null);

        const closeHandler = (e, el) => {
            if (e.target !== el) return;
            emit('close');
        };

        document.addEventListener('keyup', e => {
            if (e.key !== 'Escape') return;
            emit('close');
        });

        return { container, modal, closeHandler };
    },
};
</script>

<style lang="scss">
.vt__modal-container {
    cursor: pointer;
    @include flex-x(center, center);
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    font-family: Avenir, Helvetica, Arial, sans-serif;
    color: $white;
    background: rgba(0, 0, 0, 0.5);
    transform: translateZ(0);
    z-index: 1000;

    .vt__exit-fullscreen {
        position: absolute;
        top: 12px;
        left: 12px;
        padding: 10px;
        max-width: calc(100vw - 44px);
        text-align: center;
        font-weight: 500;
        font-size: clamp(15px, 3.5vw, 18px);
        font-family: $font_primary;
        color: $white;
        background-color: rgba($black, 0.7);
        border-radius: 5px;
        box-shadow: 0 0 10px -5px $black;
    }

    .vt__modal {
        cursor: auto;
        @include flex-y(center, center);
        padding: 20px;
        height: 70vh;
        width: 70vw;
        background: $primary;
        border-radius: 10px;
        box-shadow: 0 0 10px -3px $black;
    }

    @media screen and (max-width: 450px) {
        .vt__exit-fullscreen {
            top: 20px;
            left: unset;
        }
    }
}
</style>
