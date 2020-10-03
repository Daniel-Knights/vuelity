<template>
    <header class="dk__navbar" :class="`dk__navbar-${position}`">
        <div class="dk__navbar-inner" :style="styles">
            <slot></slot>
        </div>
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
    min-height: 100px;
    text-align: left;
    font-family: $font_primary;
    color: $white;
    background-color: $primary;
    box-shadow: 0 -5px 10px 5px $black;
    z-index: 1;
}

.dk__navbar-top {
    top: 0;
}
.dk__navbar-bottom {
    position: fixed;
    bottom: 0;

    .dk__navbar-inner {
        box-shadow: 0 5px 10px 5px $black;
    }
}
</style>
