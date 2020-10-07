<template>
    <div @click="toggled()" class="vt__toggle-container" :style="containerStyles" ref="toggle">
        <div class="vt__toggle-inner" :class="{ 'vt__toggle-on': toggleOn }">
            <div class="vt__toggle-focus" ref="toggleFocus"></div>
            <div class="vt__toggle" :style="toggleStyles"></div>
        </div>
    </div>
</template>

<script>
import { onMounted, ref } from 'vue';

export default {
    name: 'Toggle',

    props: {
        containerStyles: { type: Object, default: {} },
        toggleStyles: { type: Object, default: {} },
        initialState: { type: Boolean, default: false },
    },

    setup(props, { emit }) {
        const toggle = ref(null);
        const toggleFocus = ref(null);
        const toggleOn = ref(props.initialState);

        let toggled = ref(() => {});

        onMounted(() => {
            toggled.value = () => {
                toggleOn.value = !toggleOn.value;

                if (toggleFocus.value) {
                    toggleFocus.value.style.transform = 'scale(2)';
                    toggleFocus.value.style.opacity = '1';
                }

                emit('toggle', toggleOn.value);
            };

            window.addEventListener('click', e => {
                if (e.target !== toggle.value && toggleFocus.value) {
                    toggleFocus.value.style.transform = 'scale(1)';
                    toggleFocus.value.style.opacity = '0';
                }
            });
        });

        return { toggle, toggleFocus, toggleOn, toggled };
    },
};
</script>

<style lang="scss">
.vt__toggle-container {
    cursor: pointer;
    @include flex-x(false, center);
    position: relative;
    margin: 0 5px;
    height: 19px;
    width: 40px;
    border-radius: 15px;
    background: darken($primary, 10%);
    box-shadow: 0 0 2px $black;

    * {
        pointer-events: none;
    }

    .vt__toggle-inner {
        @include flex-x(center, center);
        position: absolute;
        right: 100%;
        transform: translateX(calc(100% + 2px));
        transition: all 0.1s ease !important;

        &.vt__toggle-on {
            right: 2px;
            transform: translateX(0);
        }
    }

    .vt__toggle {
        height: 15px;
        width: 15px;
        border-radius: 50%;
        background: $white;
        transition: all 0.1s ease !important;
    }

    .vt__toggle-focus {
        position: absolute;
        width: 100%;
        height: 100%;
        background: radial-gradient(transparent, rgba($white, 0.5));
        border-radius: 50%;
        transition: all 0.1s ease !important;
    }

    &:hover .vt__toggle {
        background: rgba($white, 0.9);
    }
}
</style>
