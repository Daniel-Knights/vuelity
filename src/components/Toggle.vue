<template>
    <div @click="toggled()" class="dk__toggle-container" :style="{ backgroundColor, boxShadow }">
        <div
            class="dk__toggle"
            :class="{ 'dk__toggle-on': toggleOn }"
            :style="{ backgroundColor: toggleColor }"
        ></div>
    </div>
</template>

<script>
import { ref } from 'vue';

export default {
    name: 'Toggle',

    props: {
        backgroundColor: String,
        toggleColor: String,
        boxShadow: String,
    },

    setup(props, context) {
        const toggleOn = ref(false);
        const toggled = () => {
            toggleOn.value = !toggleOn.value;
            context.emit('toggled', toggleOn.value);
        };

        return { toggleOn, toggled };
    },
};
</script>

<style lang="scss">
.dk__toggle-container {
    cursor: pointer;
    @include flex-x(false, center);
    position: relative;
    padding: 0 2px;
    margin: 0 5px;
    height: 19px;
    width: 40px;
    border-radius: 15px;
    background: $black;
    box-shadow: 0 0 2px $black;

    .dk__toggle {
        display: block;
        position: relative;
        height: 15px;
        width: 15px;
        border-radius: 50%;
        background: $white;
        transition: all 0.1s ease;

        &.dk__toggle-on {
            transform: translate(21px);
        }
    }
    &:hover > .dk__toggle {
        background: rgba($white, 0.9);
    }
}
</style>
