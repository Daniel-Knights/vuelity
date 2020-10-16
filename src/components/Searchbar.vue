<template>
    <div class="vt__search-container" role="search" ref="container">
        <transition name="vt__cross">
            <div
                v-if="search.length > 0 && crossEnabled"
                @click="search = ''"
                class="vt__search-cross"
            >
                <Cross
                    @keyup.enter="search = ''"
                    role="button"
                    aria-label="clear input"
                    tabindex="0"
                />
            </div>
        </transition>
        <form @submit.prevent="searchSubmit()" :class="{ 'vt__icon-enabled': iconEnabled }">
            <input
                type="text"
                :placeholder="defaultPlaceholder"
                name="searchbar"
                v-model="search"
                :style="styles"
                @input="$emit('search-value', search)"
                @focus="focusHandler()"
                @blur="blurHandler()"
                role="searchbox"
                aria-label="search"
            />
            <div class="vt__search-submit" role="button" aria-label="submit search">
                <slot>
                    <SearchIcon @click="searchSubmit()" />
                </slot>
            </div>
        </form>
    </div>
</template>

<script>
import { onMounted, ref } from 'vue';

import Cross from './svg/Cross';
import SearchIcon from './svg/SearchIcon';

export default {
    name: 'Searchbar',

    components: { Cross, SearchIcon },

    props: {
        styles: { type: Object, default: {} },
        placeholder: String,
        crossEnabled: { type: Boolean, default: true },
        iconEnabled: { type: Boolean, default: true },
        contrast: { type: Boolean, default: false },
        primary: { type: String, default: '#ffffff' },
        secondary: { type: String, default: '#5bd0b9' },
    },

    setup(props, { emit }) {
        const container = ref(null);
        const search = ref('');
        const defaultPlaceholder = ref(props.placeholder || 'Search...');

        const setColor = (property, color) => container.value.style.setProperty(property, color);
        const searchSubmit = () => {
            if (!search.value) defaultPlaceholder.value = 'Invalid Search';
            else defaultPlaceholder.value = props.placeholder || 'Search...';

            emit('search-submit', search.value);
        };
        const focusHandler = () => {
            if (props.contrast) {
                setColor('--primary-shift', props.primary);
            } else setColor('--primary-shift', props.secondary);
        };
        const blurHandler = () => {
            if (props.contrast) {
                setColor('--primary-shift', props.secondary);
            } else setColor('--primary-shift', props.primary);
        };

        onMounted(() => {
            setColor.value = (property, color) =>
                container.value.style.setProperty(property, color);

            if (props.contrast) {
                setColor.value('--primary-static', props.secondary);
                setColor.value('--primary-shift', props.secondary);
                setColor.value('--secondary', props.primary);
            } else {
                setColor.value('--primary-static', props.primary);
                setColor.value('--primary-shift', props.primary);
                setColor.value('--secondary', props.secondary);
            }
        });

        return {
            container,
            search,
            defaultPlaceholder,
            setColor,
            searchSubmit,
            focusHandler,
            blurHandler,
        };
    },

    watch: {
        primary(val) {
            if (this.contrast) {
                this.setColor('--secondary', val);
            } else {
                this.setColor('--primary-static', val);
                this.setColor('--primary-shift', val);
            }
        },
        secondary(val) {
            if (this.contrast) {
                this.setColor('--primary-static', val);
                this.setColor('--primary-shift', val);
            } else this.setColor('--secondary', val);
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
    --primary-static: #ffffff;
    --primary-shift: #ffffff;
    --secondary: #5bd0b9;

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
                fill: var(--primary-static);
                transition: all 0.25s;
            }
        }
    }

    [type='text'] {
        padding: 0 15px;
        max-width: 18rem;
        height: 35px;
        font: 500 14px $font_primary;
        color: var(--primary-shift);
        border: none;
        border-bottom: 1px solid var(--primary-static);
        background-color: transparent;
        background: linear-gradient(to bottom, var(--secondary) 50%, var(--primary-static) 50%);
        background-position: 0 0;
        background-size: 200% 200%;
        transition: all 0.5s;
        outline: none;
        -webkit-appearance: none;

        &:focus {
            color: var(--primary-shift);
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
                fill: var(--primary-shift);
                transition: fill 0.25s 0.1s;
            }

            &:hover {
                transform: scale(1);
            }
        }
    }

    @mixin placeholder {
        color: var(--primary-shift);
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
