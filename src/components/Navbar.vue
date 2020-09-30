<template>
    <div class="dk__navbar" :style="navbarStyles" :class="`dk__navbar-${position}`">
        <slot></slot>
    </div>
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
    data() {
        return {
            navbarStyles: {
                ...this.styles,
            },
        };
    },
};
</script>
<style lang="scss" scoped>
.dk__navbar {
    @include flex-x(space-between, center);
    position: absolute;
    right: 0;
    left: 0;
    padding: 10px;
    text-align: left;
    background-color: #fcf6cd;
    color: #f6a623;
    z-index: 2;
}
.dk__navbar-top {
    top: 0;
}
.dk__navbar-bottom {
    position: fixed;
    bottom: 0;
}
</style>
