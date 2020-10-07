<template>
    <div class="vt__popup" v-if="popupOpen" :style="popupStyles">
        <div class="vt__popup-message">
            <span @click="removePopup()" :style="{ color: popupColor }">&times;</span>
            <slot></slot>
        </div>
    </div>
</template>

<script>
import { onMounted, ref } from 'vue';

export default {
    name: 'Popup',

    props: {
        styles: {
            type: Object,
            default: {},
        },
        cookie: {
            type: Boolean,
            default: false,
        },
        crossColor: String,
    },

    setup(props) {
        const popupOpen = ref(true);
        const popupStyles = ref(props.styles);
        const popupColor = ref(props.crossColor);
        let cookieCheck = document.cookie.split('vt__popup-closed=')[1];

        const removePopup = () => {
            popupOpen.value = false;
            if (props.cookie) document.cookie = 'vt__popup-closed=true';
        };

        if (cookieCheck) cookieCheck = cookieCheck.split(';')[0];
        if (cookieCheck === 'true') popupOpen.value = false;

        return { popupOpen, popupStyles, popupColor, removePopup };
    },
};
</script>

<style lang="scss">
.vt__popup {
    position: fixed;
    padding: 10px;
    right: 50px;
    bottom: -100%;
    background-color: $white;
    border: 2px solid $primary;
    border-bottom: none;
    border-radius: 5px 5px 0 0;
    box-shadow: 0px 1px 5px -2px $black;
    animation: popup 1s 3s forwards cubic-bezier(0.215, 0.61, 0.355, 1);
    z-index: 1000;

    span {
        cursor: pointer;
        position: absolute;
        margin-right: 5px;
        top: -5px;
        right: 3px;
        font-size: 30px;
        color: $primary;
        transition: color 0.3s;

        &:hover {
            color: lighten($primary, 20%);
        }
    }

    .vt__popup-message {
        @include flex-x(center, center);
        margin: 10px;
        max-width: 190px;
        min-width: 100px;
        min-height: 30px;
        font-family: $font_primary;
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
        0% {
            bottom: -100%;
        }
        100% {
            bottom: 0;
        }
    }
}
</style>
