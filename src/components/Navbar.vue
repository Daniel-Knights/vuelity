<template>
    <header class="dk__navbar" :class="`dk__navbar-${position}`">
        <div class="dk__navbar-inner" :style="styles">
            <slot></slot>
        </div>
        <div class="dk__navbar-shadow"></div>
    </header>
</template>

<script>
export default {
    props: {
        position: {
            type: String,
            default: 'top',
            validator(position) {
                return ['top', 'bottom'].indexOf(position) > -1;
            },
        },
        styles: Object,
    },
};
</script>

<style lang="scss">
.dk__navbar {
    position: relative;
    width: 100%;
    z-index: 10;
}

.dk__navbar-inner {
    @include flex-x(space-between, center);
    right: 0;
    left: 0;
    padding: 10px;
    text-align: left;
    font-family: $font_primary;
    color: $white;
    background-color: $primary;
    z-index: 1;
}

.dk__navbar-shadow {
    position: absolute;
    bottom: 0px;
    left: -10px;
    height: 10px;
    width: 110vw;
    box-shadow: 0 0 10px $black;
    z-index: -1;
}

.dk__navbar-top {
    top: 0;
}
.dk__navbar-bottom {
    position: fixed;
    bottom: 0;

    .dk__navbar-shadow {
        top: 0;
    }
}
</style>
