<template>
    <VTNavbar :styles="navbarStyles" position="top" :slider="true">
        <h1>Vuelity</h1>
        <VTSearchbar @search-submit="logValue($event)" @search-value="searchValue($event)" />
        <VTHoverbox :width="100" :height="50">
            Home
        </VTHoverbox>
        <div class="auth-btns">
            <VTHoverbox :containerStyles="hoverboxContainerStyles">
                <VTButton :styles="btnStyles" :onlyBorder="true">Login</VTButton>
            </VTHoverbox>
            <VTButton :styles="btnStyles" :ripple="false" :shine="true">Signup</VTButton>
        </div>
    </VTNavbar>
    <!--
    <VTSearchbar
        :style="{ margin: '100px auto' }"
        :primary="color"
        :secondary="colorTwo"
        :contrast="true"
    />
    <VTSearchbar :style="{ margin: '100px auto' }" :primary="color" :secondary="colorTwo" />
    {{ search }}

    <VTHoverbox :styles="hoverboxStyles" fill="red">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo commodi necessitatibus id
        cupiditate eum, quas nulla esse nesciunt veniam error.
    </VTHoverbox>

    <VTTooltip text="Check" position="right">
        <VTButton
            :rainbow="true"
            :onlyBorder="true"
            :shine="true"
            :ripple="false"
            :hoverEnabled="false"
            hoverColor="red"
            hoverBackground="blue"
            :styles="{ borderRadius: '50%' }"
            >CRAZY</VTButton
        >
    </VTTooltip>

    <VTBurger @open="logValue($event)" :styles="{ right: '0' }" />
    <VTLoading v-if="loading" :fullscreen="true" @click="loading = false" />
    <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore, vitae corporis? Earum
        quos
        <VTTooltip :position="position" :styles="{ width: '30px', minWidth: 'unset' }">
            <span style="text-decoration: underline;">quibusdam</span>
        </VTTooltip>
        , perferendis nesciunt nostrum ea laboriosam cumque.
    </p>
    <select v-model="position">
        <option value="top">top</option>
        <option value="right">right</option>
        <option value="bottom">bottom</option>
        <option value="left">left</option>
    </select> -->
    <div style="background:#000">
        <VTPagination :currentPage="number" :lastPage="10" @page-change="logValue($event)" />
    </div>
    <VTButton @click="state = !state">OPEN MODAL</VTButton>

    <VTToggle :initialState="true" :state="state" @toggle="state = !state" />

    <div style="background:#000">
        <VTBurger :ripple="true" />
    </div>

    <!-- <VTVideo
        :videoSrc="testSrc"
        :containerStyles="videoContainerStyles"
        videoPoster="https://a.storyblok.com/f/87848/800x800/a97f990693/sudhith-xavier-iun1o500lmi-unsplash-1.jpg"
    /> -->
    <!-- <VTVideo
        width="50vw"
        v-for="video in videos"
        :key="video._uid"
        :videoSrc="require('@/assets/video.mp4')"
        :videoTitle="video.title"
        :videoPoster="video.poster ? video.poster.filename : ''"
        :timeTags="video.tags"
        :contextmenu="false"
    />

    <VTPopup :hoverColor="color" :hoverBackground="colorTwo" animationDelay="2s" :cookie="false"
        >You will be automatically logged out in 5s</VTPopup
    > -->
    <!-- <div id="test" style="position: relative; height: 1000px; overflow: scroll;">
        <div style="position: relative; height: 1000vh">
            <VTScrolltop
                :styles="{ position: 'absolute' }"
                iconHoverColor="red"
                target="#test"
                :smooth="false"
            />
        </div>
    </div> -->
</template>

<script>
import Axios from 'axios';
import { ref } from 'vue';

export default {
    data() {
        return {
            state: true,
            loading: true,
            position: 'top',
            modalCondition: false,
            number: 1,
            log: 1,
            color: '#ffffff',
            colorTwo: '#5bd0b9',
            videos: [],
            videoFocused: '',
            search: '',
            hoverboxStyles: {
                borderRadius: '50%',
            },
            hoverboxContainerStyles: {
                display: 'inline-flex',
            },
            toggleContainerStyles: {},
            toggleStyles: {},
            tooltipStyles: {
                fontSize: '12px',
                backgroundColor: 'blue',
                boxShadow: '10px 10px 1px black',
            },
            btnStyles: {},
            navbarStyles: {},
            popupStyles: {},
            videoContainerStyles: {
                borderRadius: '10px',
                boxShadow: '1px 1px 10px -5px black',
            },
            videoButtonStyles: {
                backgroundColor: 'red',
                border: 'none',
            },
            videoThumbStyles: {
                border: '1px solid red',
                borderRadius: '5px',
            },
            searchbarStyles: {
                fontSize: '15px',
                color: 'white',
                borderColor: 'white',
            },
            searchFunction: function(search) {
                console.log(search);
            },
            paginationStyles: {},
            paginationBlockStyles: {},
            testSrc: '',
        };
    },
    methods: {
        searchValue(e) {
            this.search = e;
        },
        logValue(e) {
            this.log = e;
            console.log(e);
        },
    },
    async created() {
        await Axios.get(
            `https://api.storyblok.com/v1/cdn/stories/videos?version=published&token=${process.env.VUE_APP_STORYBLOK_TOKEN}&cv=1596995321`
        ).then(res => {
            this.videos = res.data.story.content.sets[0].videos;

            // Async source loading
            setTimeout(() => {
                this.testSrc = res.data.story.content.sets[0].videos[0].aws_url;
            }, 5000);
        });

        this.$toast('test');
    },
};
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Lato:100,100italic,300,300italic,regular,italic,700,700italic,900,900italic');

body {
    margin: 0;
    min-height: 1000vh;
    width: 100%;
    // background: $primary;
}

#app {
    font-family: Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    width: 100%;
}

.auth-btns {
    display: flex;
}
</style>
