<template>
    <div class="dk__pages" :style="paginationStyles">
        <div class="dk__paginate-left-container">
            <div
                @click="paginateLeft($event)"
                class="dk__pagination dk__left dk__pagination-block"
                :class="{ 'dk__disabled-pagination': disabledLeft }"
                style="transform: rotate(180deg)"
            >
                <slot></slot>
            </div>
        </div>
        <div class="dk__page-container">
            <div
                v-if="overflow && (paginateCurrentPage > 3 || paginateCurrentPage === 2)"
                @click="
                    paginateCurrentPage = 1;
                    $emit('page-changed', paginateCurrentPage);
                "
                class="dk__page dk__selectable dk__pagination-block"
            >
                {{ 1 }}
            </div>
            <div v-if="enterPageOne" class="dk__page">
                <input
                    v-model="enterPageOneValue"
                    @keydown.enter="enterPageHandler"
                    @blur="enterPageOne = false"
                    class="dk__pagination-block"
                    data-enter="1"
                    type="number"
                    placeholder="pg."
                />
            </div>
            <div
                @mouseup="enterPageOneHandler($event)"
                v-if="overflow && paginateCurrentPage > 2 && !enterPageOne"
                class="dk__page dk__pagination-block"
            >
                ...
            </div>
            <div class="dk__page dk__selectable dk__pagination-block">
                {{ paginateCurrentPage }}
            </div>
            <div
                @mouseup="enterPageTwoHandler($event)"
                v-if="overflow && paginateCurrentPage < lastPage - 1 && !enterPageTwo"
                class="dk__page dk__pagination-block"
            >
                ...
            </div>
            <div v-if="enterPageTwo" class="dk__page">
                <input
                    v-model="enterPageTwoValue"
                    @keydown.enter="enterPageHandler"
                    @blur="enterPageTwo = false"
                    class="dk__pagination-block"
                    data-enter="2"
                    type="number"
                    placeholder="pg."
                />
            </div>
            <div
                v-if="overflow && paginateCurrentPage !== lastPage"
                @click="
                    paginateCurrentPage = lastPage;
                    $emit('page-changed', paginateCurrentPage);
                "
                class="dk__page dk__selectable dk__pagination-block"
            >
                {{ lastPage }}
            </div>
        </div>
        <div class="dk__paginate-right-container">
            <div
                @click="paginateRight($event)"
                class="dk__pagination dk__right dk__pagination-block"
                :class="{ 'dk__disabled-pagination': disabledRight }"
            >
                <slot></slot>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'Page',
    props: {
        currentPage: {
            type: Number,
            default: 1,
        },
        lastPage: Number,
        styles: {
            type: Object,
            default: () => ({
                color: '#000',
            }),
        },
        blockStyles: {
            type: Object,
            default: () => ({}),
        },
    },
    data() {
        return {
            overflow: false,
            enterPageOne: false,
            enterPageTwo: false,
            enterPageOneValue: '',
            enterPageTwoValue: '',
            paginateCurrentPage: this.currentPage,
            paginationStyles: { ...this.styles },
        };
    },
    computed: {
        disabledLeft: function() {
            return this.paginateCurrentPage === 1;
        },
        disabledRight: function() {
            return this.paginateCurrentPage === this.lastPage;
        },
    },
    methods: {
        selectedPage() {
            let pages = document.querySelectorAll('.dk__page');

            pages.forEach(page => {
                if (this.paginateCurrentPage === Number(page.innerText)) {
                    page.className = 'dk__page dk__pagination-block dk__selected';
                } else page.className = 'dk__page dk__pagination-block dk__selectable';
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
            setTimeout(() => {
                e.target.firstChild.focus();
            }, 1);
        },
        enterPageTwoHandler(e) {
            this.enterPageTwo = true;
            setTimeout(() => {
                e.target.firstChild.focus();
            }, 1);
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
            const style = document.createElement('style');
            let blockStyleList = [];

            for (let i in this.blockStyles) {
                let formatted = i.replace(/([A-Z])/g, g => `-${g[0].toLowerCase()}`);
                formatted += `:${this.blockStyles[i]};`;

                blockStyleList.push(formatted);
            }

            style.type = 'text/css';
            style.innerHTML = `.dk__pagination-block { ${String(blockStyleList)
                .split(';,')
                .join(';')} }`;
            document.getElementsByTagName('head')[0].appendChild(style);
        },
    },
    mounted() {
        this.selectedPage();
        this.pageOverflow();
        this.blockStyling();
    },
    updated() {
        this.selectedPage();
    },
};
</script>
<style scoped lang="scss">
.dk__pages {
    @include flex-x(space-between, center);
    margin: 10px auto;
    width: 300px;
    user-select: none;
}
.dk__disabled-pagination {
    visibility: hidden;
}
.dk__pagination {
    cursor: pointer;
    @include flex-x(center, center);
    height: 30px;
    width: 30px;
    transition: background-color 0.2s;
}
.dk__pagination:hover {
    background-color: rgba($black, 0.2);
}
.dk__page-container {
    display: flex;
}
.dk__page,
input {
    @include flex-x(center, center);
    width: 30px;
    height: 30px;
}
.dk__selected {
    color: $white;
    background-color: $black;
}
// Page number input
.dk__selectable {
    cursor: pointer;
    transition: background-color 0.2s;
}
.dk__selectable:hover {
    background-color: rgba($black, 0.2);
}
input {
    outline: none;
    border-width: 0;
    text-align: center;
    color: $white;
    background-color: lighten($black, 10%);
    transition: background-color 0.2s;
}
input:focus {
    background-color: lighten($black, 20%);
}
::placeholder {
    /* Chrome, Firefox, Opera, Safari 10.1+ */
    color: darken(white, 20%);
    opacity: 1; /* Firefox */
}
:-ms-input-placeholder {
    /* Internet Explorer 10-11 */
    color: darken(white, 20%);
}
::-ms-input-placeholder {
    /* Microsoft Edge */
    color: darken(white, 20%);
}
::-webkit-inner-spin-button {
    appearance: none;
}
</style>
