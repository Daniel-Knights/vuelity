<template>
    <div
        v-if="valid"
        class="vt__pages"
        :style="containerStyles"
        role="toolbar"
        aria-label="pagination"
        ref="pages"
    >
        <div class="vt__pagination-block-container vt__left" :style="blockStyles">
            <div
                @click="paginateLeft($event)"
                @keyup.enter="paginateLeft($event)"
                class="vt__pagination vt__pagination-block"
                :class="{ 'vt__disabled-pagination': disabledLeft }"
                :disabled="disabledLeft"
                style="transform: rotate(180deg)"
                role="button"
                aria-label="left navigation"
                :aria-disabled="disabledLeft"
                tabindex="0"
            >
                <slot><Arrow :disabled="disabledLeft"/></slot>
            </div>
        </div>
        <div class="vt__page-container">
            <div
                v-if="overflow && paginateCurrentPage >= 2"
                @click="
                    paginateCurrentPage = 1;
                    $emit('page-change', paginateCurrentPage);
                "
                @keyup.enter="
                    paginateCurrentPage = 1;
                    $emit('page-change', paginateCurrentPage);
                "
                :style="blockStyles"
                class="vt__page vt__selectable vt__pagination-block"
                role="button"
                tabindex="0"
            >
                {{ 1 }}
            </div>
            <div v-if="enterPageOne" class="vt__page" :style="blockStyles">
                <input
                    v-model="enterPageOneValue"
                    @keyup.enter="enterPageHandler($event)"
                    @blur="enterPageOne = false"
                    class="vt__pagination-block"
                    data-enter="1"
                    type="number"
                    placeholder="pg."
                    :max="lastPage"
                    role="searchbox"
                    aria-label="page number input"
                    ref="inputOne"
                />
            </div>
            <div
                @click="enterPageOneHandler($event)"
                @keyup.enter="enterPageOneHandler($event)"
                v-if="overflow && paginateCurrentPage > 2 && !enterPageOne"
                :style="blockStyles"
                class="vt__page vt__pagination-block"
                role="button"
                aria-label="reveal page number input"
                tabindex="0"
            >
                ...
            </div>
            <div
                class="vt__page vt__selectable vt__pagination-block"
                :style="blockStyles"
                aria-label="current page"
            >
                {{ paginateCurrentPage }}
            </div>
            <div
                @click="enterPageTwoHandler($event)"
                @keyup.enter="enterPageTwoHandler($event)"
                v-if="overflow && paginateCurrentPage < lastPage - 1 && !enterPageTwo"
                :style="blockStyles"
                class="vt__page vt__pagination-block"
                role="button"
                aria-label="reveal page number input"
                tabindex="0"
            >
                ...
            </div>
            <div v-if="enterPageTwo" class="vt__page" :style="blockStyles">
                <input
                    v-model="enterPageTwoValue"
                    @keyup.enter="enterPageHandler($event)"
                    @blur="enterPageTwo = false"
                    class="vt__pagination-block"
                    data-enter="2"
                    type="number"
                    placeholder="pg."
                    :max="lastPage"
                    role="searchbox"
                    aria-label="page number input"
                    ref="inputTwo"
                />
            </div>
            <div
                v-if="overflow && paginateCurrentPage !== lastPage"
                @click="
                    paginateCurrentPage = lastPage;
                    $emit('page-change', paginateCurrentPage);
                "
                @keyup.enter="
                    paginateCurrentPage = lastPage;
                    $emit('page-change', paginateCurrentPage);
                "
                :style="blockStyles"
                class="vt__page vt__selectable vt__pagination-block"
                role="button"
                tabindex="0"
            >
                {{ lastPage }}
            </div>
        </div>
        <div class="vt__pagination-block-container vt__right" :style="blockStyles">
            <div
                @click="paginateRight($event)"
                @keyup.enter="paginateRight($event)"
                class="vt__pagination vt__pagination-block"
                :class="{ 'vt__disabled-pagination': disabledRight }"
                :disabled="disabledRight"
                role="button"
                aria-label="right navigation"
                :aria-disabled="disabledRight"
                tabindex="0"
            >
                <slot><Arrow :disabled="disabledRight"/></slot>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, computed, watch, onMounted } from 'vue';
import Arrow from './svg/Arrow';
import rippleHandler from './js/ripple';

export default {
    name: 'Page',

    components: { Arrow },

    props: {
        containerStyles: { type: Object, default: {} },
        blockStyles: { type: Object, default: {} },
        ripple: { type: Boolean, default: true },
        color: { type: String, default: '#ffffff' },
        disabledColor: { type: String, default: '#dbdbdb' },
        background: { type: String, default: '#5bd0b9' },
        altBackground: { type: String, default: '#83dbca' },
        currentPage: { type: Number, default: 1 },
        lastPage: Number,
    },

    setup(props) {
        const pages = ref(null);
        const valid = ref(true);
        const overflow = ref(false);
        const enterPageOne = ref(false);
        const enterPageTwo = ref(false);
        const enterPageOneValue = ref('');
        const enterPageTwoValue = ref('');
        const paginateCurrentPage = ref(props.currentPage);
        const disabledLeft = computed(() => paginateCurrentPage.value === 1);
        const disabledRight = computed(() => paginateCurrentPage.value === props.lastPage);

        const setColor = (property, color) => {
            pages.value.style.setProperty(property, color);
        };

        onMounted(() => {
            setColor('--color', props.color);
            setColor('--disabled-color', props.disabledColor);
            setColor('--bg', props.background);
            setColor('--alt-bg', props.altBackground);

            document.querySelectorAll('.vt__pagination-block-container').forEach(block => {
                block.addEventListener('mouseup', e => e.target.blur());

                if (!props.ripple) return;

                // Safari ripple
                if (navigator.vendor.match(/apple/i)) {
                    pages.value.style.webkitMaskImage = 'radial-gradient(white, black)';
                }

                block.addEventListener('mousedown', e => rippleHandler(e, block));
                block.addEventListener('keyup', e => {
                    if (e.key !== 'Enter') return;
                    rippleHandler(e, block);
                });
            });
        });

        return {
            pages,
            valid,
            overflow,
            enterPageOne,
            enterPageTwo,
            enterPageOneValue,
            enterPageTwoValue,
            paginateCurrentPage,
            disabledLeft,
            disabledRight,
            setColor,
        };
    },

    watch: {
        currentPage(val) {
            this.validate();
            if (!this.valid) return;

            this.paginateCurrentPage = val;
        },
        color(val) {
            this.setColor('--color', val);
        },
        disabledColor(val) {
            this.setColor('--disabled-color', val);
        },
        background(val) {
            this.setColor('--bg', val);
        },
        altBackground(val) {
            this.setColor('--alt-bg', val);
        },
    },

    methods: {
        selectedPage() {
            let pages = document.querySelectorAll('.vt__page');

            pages.forEach(page => {
                if (this.paginateCurrentPage === Number(page.innerText)) {
                    page.classList.add('vt__selected');
                } else page.classList.add('vt__selectable');
            });
        },
        pageOverflow() {
            this.overflow = this.lastPage > 3 ? true : false;
        },
        enterPageHandler(e) {
            let oneVal = Number(this.enterPageOneValue);
            let twoVal = Number(this.enterPageTwoValue);

            if (e.target.dataset.enter === '1') {
                if (oneVal < this.lastPage + 1 && oneVal > 0) {
                    this.paginateCurrentPage = oneVal;

                    this.enterPageOne = false;
                    this.enterPageOneValue = '';
                } else if (
                    oneVal > this.lastPage ||
                    oneVal === 0 ||
                    this.enterPageOneValue === ''
                ) {
                    e.target.style.border = '1px solid red';
                    this.enterPageOneValue = '';
                }
            } else {
                if (twoVal < this.lastPage + 1 && twoVal > 0) {
                    this.paginateCurrentPage = twoVal;

                    this.enterPageTwo = false;
                    this.enterPageTwoValue = '';
                } else if (
                    twoVal > this.lastPage ||
                    twoVal === 0 ||
                    this.enterPageTwoValue === ''
                ) {
                    e.target.style.border = '1px solid red';
                    this.enterPageTwoValue = '';
                }
            }

            this.$emit('page-change', this.paginateCurrentPage);
        },
        enterPageOneHandler(e) {
            this.enterPageOne = true;
            setTimeout(() => this.$refs.inputOne.focus(), 1);
        },
        enterPageTwoHandler(e) {
            this.enterPageTwo = true;
            setTimeout(() => this.$refs.inputTwo.focus(), 1);
        },
        paginateLeft(e) {
            if (this.paginateCurrentPage > 1) {
                this.paginateCurrentPage -= 1;
                this.$emit('page-change', this.paginateCurrentPage);
            }
        },
        paginateRight(e) {
            if (this.paginateCurrentPage < this.lastPage) {
                this.paginateCurrentPage += 1;
                this.$emit('page-change', this.paginateCurrentPage);
            }
        },
        validate() {
            if (this.currentPage > this.lastPage) {
                console.error(
                    `Vuelity [Error]: VTPagination: Prop currentPage must be less than or equal to lastPage, received ${this.currentPage}`
                );
                this.valid = false;
            } else if (this.currentPage <= 0) {
                console.error(
                    `Vuelity [Error]: VTPagination: Prop currentPage must be greater than 0, received ${this.currentPage}`
                );
                this.valid = false;
            }
        },
    },

    mounted() {
        this.validate();
        this.selectedPage();
        this.pageOverflow();
    },

    updated() {
        this.selectedPage();
    },
};
</script>

<style lang="scss">
.vt__pages {
    --color: #ffffff;
    --disabled-color: #dbdbdb;
    --bg: #5bd0b9;
    --alt-bg: #83dbca;

    user-select: none;
    @include flex-x(space-between, center);
    margin: 10px auto;
    width: 210px;
    color: var(--color);
    background: var(--bg);
    border-radius: 5px;
    box-shadow: 0 0 5px -3px $black;
    font-family: Avenir, Helvetica, Arial, sans-serif;
    font-weight: 500;
    overflow: hidden;

    .vt__pagination-block-container {
        position: relative;
        overflow: hidden;
    }

    .vt__pagination {
        cursor: pointer;
        @include flex-x(center, center);
        height: 30px;
        width: 30px;
        transition: background-color 0.2s;

        &-block {
            &:hover,
            &:focus {
                background-color: var(--alt-bg);
            }
        }
    }

    .vt__page-container {
        display: flex;
    }

    .vt__page,
    input {
        @include flex-x(center, center);
        width: 30px;
        height: 30px;
    }

    .vt__selectable {
        cursor: pointer;
        transition: background-color 0.2s;
    }

    .vt__selected {
        cursor: default;
        background-color: var(--alt-bg);
    }

    input {
        outline: none;
        border-width: 0;
        text-align: center;
        color: var(--color);
        background-color: var(--bg);
        transition: background-color 0.2s;
    }

    .vt__right,
    .vt__left {
        svg {
            pointer-events: none;
            width: 15px;
            height: 15px;
            object-fit: cover;
        }
        path {
            fill: var(--color);
        }
    }

    .vt__disabled-pagination {
        cursor: default;

        path {
            fill: var(--disabled-color);
        }

        &:hover,
        &:focus {
            background-color: var(--bg);
        }
    }

    ::placeholder {
        /* Chrome, Firefox, Opera, Safari 10.1+ */
        color: var(--disabled-color);
        opacity: 1; /* Firefox */
    }
    :-ms-input-placeholder {
        /* Internet Explorer 10-11 */
        color: var(--disabled-color);
    }
    ::-ms-input-placeholder {
        /* Microsoft Edge */
        color: var(--disabled-color);
    }
    ::-webkit-inner-spin-button {
        appearance: none;
    }
}
</style>
