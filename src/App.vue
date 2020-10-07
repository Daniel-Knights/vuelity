<template>
    <VTNavbar :styles="navbarStyles" position="top" :slider="true">
        <h1>Vuelity</h1>
        <VTSearchbar
            :searchFunction="searchFunction"
            :styles="searchbarStyles"
            iconColor="#fff"
            background="rgba(0,0,0,0.5)"
            @search-value="searchValue($event)"
        />
        <VTHoverbox :width="100" :height="50">
            Home
        </VTHoverbox>
        <div class="auth-btns">
            <VTHoverbox :containerStyles="hoverboxContainerStyles">
                <VTButton :styles="btnStyles" :onlyBorder="true">Login</VTButton>
            </VTHoverbox>
            <VTButton :styles="btnStyles" :shine="true">Signup</VTButton>
        </div>
    </VTNavbar>

    {{ search }}

    <VTToggle
        @toggle="logValue($event)"
        :containerStyles="toggleContainerStyles"
        :toggleStyles="toggleStyles"
        :initialState="true"
    />

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
            :styles="{ borderRadius: '50%' }"
            >CRAZY</VTButton
        >
    </VTTooltip>

    <VTBurger @open="logValue($event)" :styles="{ right: '0' }" />

    <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore, vitae corporis? Earum
        quos
        <VTTooltip text="An unknown word">
            <span style="text-decoration: underline;">quibusdam</span>
        </VTTooltip>
        , perferendis nesciunt nostrum ea laboriosam cumque.
    </p>

    <VTPagination
        :currentPage="1"
        :lastPage="10"
        @page-changed="logValue($event)"
        :blockStyles="{ background: 'green' }"
        currentColor="red"
        currentBackground="blue"
    >
        ►
    </VTPagination>

    <VTVideo
        :videoSrc="testSrc"
        :containerStyles="videoContainerStyles"
        videoPoster="https://a.storyblok.com/f/87848/800x800/a97f990693/sudhith-xavier-iun1o500lmi-unsplash-1.jpg"
    />
    <VTVideo
        width="50vw"
        v-for="video in videos"
        :key="video._uid"
        :videoId="String(video._uid)"
        :videoSrc="require('@/assets/video.mp4')"
        :videoTitle="video.title"
        :videoFocused="videoFocused"
        :videoPoster="video.poster ? video.poster.filename : ''"
        :timeTags="video.tags"
        :buttonStyles="videoButtonStyles"
        :thumbStyles="videoThumbStyles"
        :containerStyles="videoContainerStyles"
        :contextmenu="false"
        trackColor="red"
        @click="videoFocused = String(video._uid)"
        @video-focused="videoFocused = String(video._uid)"
    />

    <VTPopup :styles="popupStyles" crossColor="black" :cookie="true">Hey there!</VTPopup>
</template>

<script>
import Axios from 'axios';

import * as VT from './components';

export default {
    components: {
        VTButton: VT.VTButton,
        VTNavbar: VT.VTNavbar,
        VTPopup: VT.VTPopup,
        VTPagination: VT.VTPagination,
        VTVideo: VT.VTVideo,
        VTSearchbar: VT.VTSearchbar,
        VTTooltip: VT.VTTooltip,
        VTHoverbox: VT.VTHoverbox,
        VTToggle: VT.VTToggle,
        VTBurger: VT.VTBurger,
    },

    data() {
        return {
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
                overflow: 'hidden',
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
    },
};
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Lato:100,100italic,300,300italic,regular,italic,700,700italic,900,900italic');

body {
    margin: 0;
    min-height: 100vh;
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
