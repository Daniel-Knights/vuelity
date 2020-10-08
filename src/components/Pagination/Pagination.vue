<template>
    <div class="vt__pages" :style="styles" v-if="valid">
        <div class="vt__paginate-left-container">
            <div
                @click="paginateLeft($event)"
                class="vt__pagination vt__left vt__pagination-block"
                :class="{ 'vt__disabled-pagination': disabledLeft }"
                style="transform: rotate(180deg)"
            >
                <slot><Arrow :disabled="disabledLeft"/></slot>
            </div>
        </div>
        <div class="vt__page-container">
            <div
                v-if="overflow && (paginateCurrentPage > 3 || paginateCurrentPage === 2)"
                @click="
                    paginateCurrentPage = 1;
                    $emit('page-changed', paginateCurrentPage);
                "
                class="vt__page vt__selectable vt__pagination-block"
            >
                {{ 1 }}
            </div>
            <div v-if="enterPageOne" class="vt__page">
                <input
                    v-model="enterPageOneValue"
                    @keydown.enter="enterPageHandler"
                    @blur="enterPageOne = false"
                    class="vt__pagination-block"
                    data-enter="1"
                    type="number"
                    placeholder="pg."
                    :max="lastPage"
                    ref="inputOne"
                />
            </div>
            <div
                @click="enterPageOneHandler($event)"
                v-if="overflow && paginateCurrentPage > 2 && !enterPageOne"
                class="vt__page vt__pagination-block"
            >
                ...
            </div>
            <div class="vt__page vt__selectable vt__pagination-block">
                {{ paginateCurrentPage }}
            </div>
            <div
                @mouseup="enterPageTwoHandler($event)"
                v-if="overflow && paginateCurrentPage < lastPage - 1 && !enterPageTwo"
                class="vt__page vt__pagination-block"
            >
                ...
            </div>
            <div v-if="enterPageTwo" class="vt__page">
                <input
                    v-model="enterPageTwoValue"
                    @keydown.enter="enterPageHandler"
                    @blur="enterPageTwo = false"
                    class="vt__pagination-block"
                    data-enter="2"
                    type="number"
                    placeholder="pg."
                    :max="lastPage"
                    ref="inputTwo"
                />
            </div>
            <div
                v-if="overflow && paginateCurrentPage !== lastPage"
                @click="
                    paginateCurrentPage = lastPage;
                    $emit('page-changed', paginateCurrentPage);
                "
                class="vt__page vt__selectable vt__pagination-block"
            >
                {{ lastPage }}
            </div>
        </div>
        <div class="vt__paginate-right-container">
            <div
                @click="paginateRight($event)"
                class="vt__pagination vt__right vt__pagination-block"
                :class="{ 'vt__disabled-pagination': disabledRight }"
            >
                <slot><Arrow :disabled="disabledRight"/></slot>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, computed, watch } from 'vue';
import Arrow from './Arrow';

export default {
    name: 'Page',

    components: { Arrow },

    props: {
        currentPage: { type: Number, default: 1 },
        lastPage: Number,
        styles: { type: Object, default: {} },
        blockStyles: { type: Object, default: {} },
        currentColor: { type: String, default: '' },
        currentBackground: { type: String, default: '' },
    },

    watch: {
        currentPage(val) {
            this.validate();
            if (this.valid) this.paginateCurrentPage = val;
        },
    },

    setup(props) {
        const valid = ref(true);
        const overflow = ref(false);
        const enterPageOne = ref(false);
        const enterPageTwo = ref(false);
        const enterPageOneValue = ref('');
        const enterPageTwoValue = ref('');
        const paginateCurrentPage = ref(props.currentPage);
        const disabledLeft = computed(() => paginateCurrentPage.value === 1);
        const disabledRight = computed(() => paginateCurrentPage.value === props.lastPage);

        return {
            valid,
            overflow,
            enterPageOne,
            enterPageTwo,
            enterPageOneValue,
            enterPageTwoValue,
            paginateCurrentPage,
            disabledLeft,
            disabledRight,
        };
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

            this.$emit('page-changed', this.paginateCurrentPage);
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
                this.$emit('page-changed', this.paginateCurrentPage);
            }
        },
        paginateRight(e) {
            if (this.paginateCurrentPage < this.lastPage) {
                this.paginateCurrentPage += 1;
                this.$emit('page-changed', this.paginateCurrentPage);
            }
        },
        blockStyling() {
            if (Object.keys(this.blockStyles).length === 0) return;

            const style = document.createElement('style');
            let blockStyleList = [];

            for (let i in this.blockStyles) {
                let formatted = i.replace(/([A-Z])/g, g => `-${g[0].toLowerCase()}`);
                formatted += `:${this.blockStyles[i]};`;

                blockStyleList.push(formatted);
            }

            style.type = 'text/css';
            style.innerHTML = `.vt__pagination-block { ${String(blockStyleList)
                .split(';,')
                .join(';')} }`;
            document.head.appendChild(style);
        },
        currentStyling() {
            if (!this.currentColor && !this.currentBackground) return;

            const style = document.createElement('style');
            style.type = 'text/css';
            style.innerHTML = `
                .vt__pages .vt__selected {
                    color: ${this.currentColor};
                    background-color: ${this.currentBackground};
                }
            `;

            document.head.appendChild(style);
        },
        validate() {
            if (this.currentPage > this.lastPage) {
                console.error(
                    `Vuelity [Error]: Prop currentPage must be less than or equal to lastPage, received ${this.currentPage}`
                );
                this.valid = false;
            } else if (this.currentPage <= 0) {
                console.error(
                    `Vuelity [Error]: Prop currentPage must be greater than 0, received ${this.currentPage}`
                );
                this.valid = false;
            }
        },
    },

    mounted() {
        this.validate();
        this.selectedPage();
        this.pageOverflow();
        this.blockStyling();
        this.currentStyling();
    },

    updated() {
        this.selectedPage();
    },
};
</script>

<style lang="scss">
.vt__pages {
    user-select: none;
    @include flex-x(space-between, center);
    margin: 10px auto;
    width: 210px;
    color: $white;
    background: $primary;
    border-radius: 5px;
    box-shadow: 0 0 5px -3px $black;
    font-family: Avenir, Helvetica, Arial, sans-serif;
    font-weight: 500;

    .vt__pagination {
        cursor: pointer;
        @include flex-x(center, center);
        height: 30px;
        width: 30px;
        transition: background-color 0.2s;

        &:hover {
            background-color: rgba($primary, 0.2);
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

    .vt__selected {
        color: $white;
        background-color: lighten($primary, 10%);
    }

    // Page number input
    .vt__selectable {
        cursor: pointer;
        transition: background-color 0.2s;

        &:hover {
            background-color: lighten($primary, 20%);
        }
    }

    input {
        outline: none;
        border-width: 0;
        text-align: center;
        color: $white;
        background-color: lighten($primary, 10%);
        transition: background-color 0.2s;

        &:focus {
            background-color: lighten($primary, 10%);
        }
    }

    .vt__right,
    .vt__left {
        border-radius: 0 5px 5px 0;

        svg {
            width: 15px;
        }

        &:hover {
            background-color: lighten($primary, 10%);
        }
    }

    .vt__disabled-pagination {
        cursor: default;
        color: rgba($white, 0.5);

        &:hover {
            background-color: $primary;
        }
    }

    ::placeholder {
        /* Chrome, Firefox, Opera, Safari 10.1+ */
        color: rgba($dark-grey, 0.4);
        opacity: 1; /* Firefox */
    }
    :-ms-input-placeholder {
        /* Internet Explorer 10-11 */
        color: rgba($dark-grey, 0.4);
    }
    ::-ms-input-placeholder {
        /* Microsoft Edge */
        color: rgba($dark-grey, 0.4);
    }
    ::-webkit-inner-spin-button {
        appearance: none;
    }
}
</style>
