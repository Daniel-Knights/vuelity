<template>
    <div
        @click="toggled()"
        @keyup.enter="toggled()"
        @focus="addToggleFocus()"
        @blur="removeToggleFocus()"
        class="vt__toggle-container"
        :style="containerStyles"
        role="switch"
        :aria-checked="toggleOn"
        aria-label="toggle"
        ref="container"
        tabindex="0"
    >
        <div class="vt__toggle-inner" aria-hidden="true" ref="toggle">
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
        state: { type: Boolean, default: false },
        hoverColor: { type: String, default: '#ededed' },
    },

    setup(props, { emit }) {
        const container = ref(null);
        const toggle = ref(null);
        const toggleFocus = ref(null);
        const toggleOn = ref(props.initialState);

        const addToggleFocus = () => {
            if (!toggleFocus.value) return;
            toggleFocus.value.style.transform = 'scale(2)';
            toggleFocus.value.style.opacity = '1';
        };
        const removeToggleFocus = () => {
            if (!toggleFocus.value) return;
            toggleFocus.value.style.transform = 'scale(1)';
            toggleFocus.value.style.opacity = '0';
        };
        const setTogglePosition = () => {
            if (toggleOn.value) {
                const width = container.value.offsetWidth - toggle.value.offsetWidth - 2;
                toggle.value.style.transform = `translateX(${width}px)`;
            } else {
                toggle.value.style.transform = `translateX(2px)`;
            }
        };
        const toggled = () => {
            toggleOn.value = !toggleOn.value;
            addToggleFocus();
            setTogglePosition();
            emit('toggle', toggleOn.value);
        };
        const setColor = (property, color) => {
            container.value.style.setProperty(property, color);
        };

        onMounted(() => {
            window.addEventListener('click', e => {
                if (e.target === container.value) return;
                removeToggleFocus();
            });

            setTogglePosition();

            setColor('--hover-color', props.hoverColor);
        });

        return {
            container,
            toggle,
            toggleFocus,
            toggleOn,
            addToggleFocus,
            removeToggleFocus,
            setTogglePosition,
            toggled,
            setColor,
        };
    },

    watch: {
        hoverColor(val) {
            this.setColor('--hover-color', this.hoverColor);
        },
        state(val) {
            this.toggleOn = val;
            this.setTogglePosition();
        },
    },
};
</script>

<style lang="scss">
.vt__toggle-container {
    --hover-color: #ededed;

    cursor: pointer;
    @include flex-x(false, center);
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
        transform: translateX(2px);
        transition: all 0.1s ease;
    }

    .vt__toggle {
        height: 15px;
        width: 15px;
        border-radius: 50%;
        background: $white;
        transition: all 0.1s ease;
    }

    .vt__toggle-focus {
        position: absolute;
        width: 100%;
        height: 100%;
        background: radial-gradient(transparent, rgba($white, 0.5));
        border-radius: 50%;
        transition: all 0.1s ease;
    }

    &:hover .vt__toggle,
    &:focus .vt__toggle {
        background: var(--hover-color);
    }
}
</style>
