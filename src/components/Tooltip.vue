<template>
    <div class="vt__tooltip-container" :style="containerStyles">
        <div class="vt__tooltip">
            <span class="vt__tip" :class="classPosition" :style="styles" ref="tip">
                {{ text }}
            </span>
        </div>
        <div ref="el" @mouseover="tipShow()" @mouseout="tipHide()">
            <slot></slot>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Tooltip',

    props: {
        text: {
            type: String,
            default: 'Add tooltip text to the "text" attribute',
        },
        position: {
            type: String,
            default: 'top',
        },
        styles: { type: Object, default: {} },
        containerStyles: { type: Object, default: {} },
        arrow: {
            type: Boolean,
            default: true,
        },
    },

    computed: {
        tipPosition: function() {
            return this.position + ': -100%';
        },
        classPosition: function() {
            if (this.arrow) return 'vt__tip-' + this.position;
        },
    },

    methods: {
        top() {
            const tip = this.$refs.tip;

            tip.parentElement.style.transform = `translateY(${-tip.offsetHeight * 1.5}px)`;
        },
        right() {
            const elWidth = this.$refs.el.offsetWidth;
            const elHeight = this.$refs.el.offsetHeight;
            const tipParent = this.$refs.tip.parentElement;
            const tip = this.$refs.tip;

            tipParent.style.transform = `translate(${elWidth + 10}px, ${elHeight / 2 -
                tip.offsetHeight / 2}px)`;
            tipParent.style.justifyContent = 'flex-start';
        },
        bottom() {
            const elHeight = this.$refs.el.offsetHeight;

            this.$refs.tip.parentElement.style.transform = `translateY(${elHeight + 15}px)`;
        },
        left() {
            const elWidth = this.$refs.el.offsetWidth;
            const elHeight = this.$refs.el.offsetHeight;
            const tip = this.$refs.tip;

            tip.parentElement.style.transform = `translate(${-elWidth / 2 -
                tip.offsetWidth / 2 -
                10}px, ${elHeight / 2 - tip.offsetHeight / 2}px)`;
            tip.style.justifyContent = 'flex-end';
        },
        tipShow() {
            if (!this.$refs.tip) return;
            this.$refs.tip.style.opacity = '1';
            this.$refs.tip.style.transform = 'scale(1)';
        },
        tipHide() {
            if (!this.$refs.tip) return;
            this.$refs.tip.style.opacity = '0';
            this.$refs.tip.style.transform = 'scale(0.8)';
        },
    },

    mounted() {
        if (this.position === 'top') this.top();
        if (this.position === 'right') this.right();
        if (this.position === 'bottom') this.bottom();
        if (this.position === 'left') this.left();
    },
};
</script>

<style lang="scss">
@mixin pseudo {
    content: '';
    display: block;
    position: absolute;
}

.vt__tooltip-container {
    display: inline-block;
    width: fit-content;

    .vt__tooltip {
        pointer-events: none;
        @include flex-x(center);
        position: relative;
        width: 100%;
        z-index: 10;
    }

    .vt__tip {
        @include flex-x(center, center);
        position: absolute !important;
        min-width: max-content;
        padding: 5px 10px;
        border-radius: 5px;
        opacity: 0;
        color: $white;
        background-color: rgba($black, 0.9);
        box-shadow: 0px 1px 10px -3px $black;
        transform: scale(0.8);
        transition: all 0.2s cubic-bezier(0.215, 0.61, 0.355, 2);
    }

    .vt__tip::after {
        @include pseudo;
    }

    .vt__tip-top::after {
        bottom: -5px;
        border-left: 5px solid transparent;
        border-right: 5px solid transparent;
        border-top: 5px solid rgba($black, 0.9);
    }
    .vt__tip-right::after {
        left: -5px;
        border-top: 5px solid transparent;
        border-bottom: 5px solid transparent;
        border-right: 5px solid rgba($black, 0.9);
    }
    .vt__tip-bottom::after {
        top: -5px;
        border-left: 5px solid transparent;
        border-right: 5px solid transparent;
        border-bottom: 5px solid rgba($black, 0.9);
    }
    .vt__tip-left::after {
        right: -5px;
        border-top: 5px solid transparent;
        border-bottom: 5px solid transparent;
        border-left: 5px solid rgba($black, 0.9);
    }
}
</style>
