<template>
    <div class="vt__search-container" ref="container">
        <transition name="vt__cross">
            <div
                v-if="search.length > 0 && crossEnabled"
                @click="search = ''"
                class="vt__search-cross"
            >
                <SearchCross />
            </div>
        </transition>
        <form
            @submit.prevent="searchSubmit()"
            :class="{ 'vt__icon-enabled': iconEnabled && submitEnabled }"
        >
            <input
                type="text"
                :placeholder="defaultPlaceholder"
                name="searchbar"
                v-model="search"
                :style="styles"
                @keyup="$emit('search-value', search)"
                @focus="setColor('--color', focusColor)"
                @blur="setColor('--color', color)"
            />
            <div class="vt__search-submit" v-if="submitEnabled">
                <slot>
                    <SearchIcon @click.native="searchSubmit()" />
                </slot>
            </div>
        </form>
    </div>
</template>

<script>
import { onMounted, ref } from 'vue';

import SearchCross from './SearchCross';
import SearchIcon from './SearchIcon';

export default {
    name: 'Searchbar',

    components: { SearchCross, SearchIcon },

    props: {
        styles: { type: Object, default: {} },
        placeholder: String,
        crossEnabled: { type: Boolean, default: true },
        iconEnabled: { type: Boolean, default: true },
        submitEnabled: { type: Boolean, default: true },
        color: { type: String, default: '#5bd0b9' },
        focusColor: { type: String, default: '#ffffff' },
        backgroundColor: { type: String, default: '#ffffff' },
        backgroundFocusColor: { type: String, default: '#b2eee3' },
    },

    setup(props, { emit }) {
        const container = ref(null);
        const search = ref('');
        const defaultPlaceholder = ref(props.placeholder || 'Search...');

        let setColor = ref(() => {});
        const searchSubmit = () => {
            if (!props.submitEnabled) return;
            if (!search.value) defaultPlaceholder.value = 'Invalid Search';
            else defaultPlaceholder.value = props.placeholder || 'Search...';

            emit('search-submit', search.value);
        };

        onMounted(() => {
            setColor.value = (property, color) =>
                container.value.style.setProperty(property, color);
            setColor.value('--primary', props.color);
            setColor.value('--color', props.color);
            setColor.value('--bg', props.backgroundColor);
            setColor.value('--focus-bg', props.backgroundFocusColor);
        });

        return { container, search, defaultPlaceholder, setColor, searchSubmit };
    },

    watch: {
        color(val) {
            this.setColor('--primary', this.color);
            this.setColor('--color', this.color);
        },
        backgroundColor(val) {
            this.setColor('--bg', this.backgroundColor);
        },
        backgroundFocusColor(val) {
            this.setColor('--focus-bg', this.backgroundFocusColor);
        },
    },
};
</script>

<style lang="scss">
.vt__cross-enter-active,
.vt__cross-leave-active {
    opacity: 1;
    transform: scaleY(1) translateX(0);
    transition: all 0.15s cubic-bezier(0.215, 0.61, 0.355, 1);
}
.vt__cross-enter-from,
.vt__cross-leave-to {
    opacity: 0;
    transform: scaleY(0) translateX(-100%);
}

.vt__search-container {
    --primary: #5bd0b9;
    --color: #5bd0b9;
    --bg: #ffffff;
    --focus-bg: #b2eee3;

    @include flex-x(center, center);
    position: relative;
    width: fit-content;
    box-sizing: border-box;

    form {
        @include flex-x(false, center);

        &.vt__icon-enabled {
            [type='text'] {
                padding: 0 45px 0 15px;
            }

            .vt__search-submit {
                @include flex-x(false, center);
                position: absolute;
                right: 0;
                width: 36px;
                height: 36px;
            }
        }
    }

    .vt__search-cross {
        cursor: pointer;
        position: absolute;
        left: -20px;

        svg {
            height: 10px;
            width: 10px;

            path {
                fill: var(--color);
                transition: all 0.25s;
            }
        }

        &:hover path {
            fill: var(--focus-bg);
        }
    }

    [type='text'] {
        padding: 0 15px;
        max-width: 18rem;
        height: 35px;
        font: 500 14px $font_primary;
        color: var(--color);
        border: none;
        border-bottom: 1px solid var(--primary);
        background-color: transparent;
        background: linear-gradient(to bottom, var(--bg) 50%, var(--focus-bg) 50%);
        background-position: 0 0;
        background-size: 200% 200%;
        transition: all 0.5s;
        outline: none;
        -webkit-appearance: none;

        &:focus {
            color: var(--color);
            background-position: 0 100%;
        }
    }

    .vt__search-submit {
        display: none;

        svg {
            cursor: pointer;
            width: 20px;
            height: 20px;
            text-align: center;
            font-size: 14px;
            z-index: 1;
            transform: scale(0.8);
            border-radius: unset;
            transition: transform 0.3s;

            path {
                fill: var(--color);
                transition: fill 0.25s 0.1s;
            }

            &:hover {
                transform: scale(1);
            }
        }
    }

    @mixin placeholder {
        color: var(--color);
        font: 500 13px $font_primary;
        transition: color 0.25s 0.1s;
    }
    ::placeholder {
        @include placeholder;
    }
    :-ms-input-placeholder {
        /* Internet Explorer 10-11 */
        @include placeholder;
    }
    ::-ms-input-placeholder {
        /* Microsoft Edge */
        @include placeholder;
    }
}
</style>
