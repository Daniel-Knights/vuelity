<template>
    <div
        class="vt__popup"
        v-if="popupOpen"
        @click="removePopup()"
        :style="{ ...styles, animationDelay: delay }"
        ref="popup"
    >
        <div class="vt__popup-message">
            <slot></slot>
        </div>
    </div>
</template>

<script>
import { onMounted, ref } from 'vue';

export default {
    name: 'Popup',

    props: {
        styles: { type: Object, default: {} },
        cookie: { type: Boolean, default: false },
        hoverColor: String,
        hoverBackground: String,
        delay: { type: String, default: '2s' },
    },

    setup(props) {
        const popup = ref(null);
        const popupOpen = ref(true);
        let cookieCheck = document.cookie.split('vt__popup-closed=')[1];

        const removePopup = () => {
            popupOpen.value = false;
            if (props.cookie) document.cookie = 'vt__popup-closed=true';
        };
        const setColors = () => {
            if (props.hoverColor) popup.value.style.setProperty('--hover-color', props.hoverColor);
            if (props.hoverBackground)
                popup.value.style.setProperty('--hover-background', props.hoverBackground);
        };

        if (cookieCheck) cookieCheck = cookieCheck.split(';')[0];
        if (cookieCheck === 'true') popupOpen.value = false;

        onMounted(() => setColors());

        return { popup, popupOpen, removePopup, setColors };
    },

    watch: {
        hoverColor() {
            this.setColors();
        },
        hoverBackground() {
            this.setColors();
        },
    },
};
</script>

<style lang="scss">
.vt__popup {
    --hover-color: #ffffff;
    --hover-background: #83dbca;

    cursor: pointer;
    position: fixed;
    bottom: 0;
    right: 50px;
    padding: 10px;
    color: $white;
    font: 500 20px $font_primary;
    background-color: $primary;
    border-radius: 5px 5px 0 0;
    box-shadow: 0px 1px 5px -2px $black;
    transform: translateY(101%);
    transition: all 0.2s;
    animation: popup 1s forwards cubic-bezier(0.215, 0.61, 0.355, 1);
    z-index: 1000;

    .vt__popup-message {
        @include flex-x(center, center);
        margin: 10px;
        max-width: 190px;
        min-width: 100px;
        min-height: 30px;
    }

    &:hover {
        color: var(--hover-color) !important;
        background-color: var(--hover-background) !important;
    }

    @media only screen and (max-width: 700px) {
        .vt__popup-container {
            @include flex-x(center);
        }
        .vt__popup {
            right: unset;
        }
    }

    @keyframes popup {
        to {
            transform: translateY(0);
        }
    }
}
</style>
