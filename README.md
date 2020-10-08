# Vuelity

> [Interactive Docs](https://vuelity.netlify.app/)

> [Codepen Demo](https://codepen.io/daniel-knights/pen/jOrOVXX)

## Install

### CLI

```bash
npm i vuelity
```

### CDN

```html
<script src="https://unpkg.com/vue@3.0.0/dist/vue.global.js"></script>
<script src="https://unpkg.com/vuelity/dist/vuelity.umd.min.js"></script>
```

## Import

### CLI

```js
import { VTButton } from 'vuelity';

export default {
    components: { VTButton };
}
```

Or register all at once in main.js:

```js
import * as Vuelity from 'vuelity';

Object.keys(Vuelity).forEach(el => {
    app.component(el, Vuelity[el]);
});
```

### CDN

```js
app.component('vt-button', Vuelity['vt-button']);
```

Or register all at once:

```js
Object.keys(Vuelity).forEach(el => {
    app.component(el, Vuelity[el]);
});
```

## Examples

```vue
<template>
    <VTNavbar :styles="{}" position="left" :slider="true" :burgerStyles="{}">
        <h1>Bonjour</h1>
        <VTHoverbox :width="100" :height="50">
            Home
        </VTHoverbox>
    </VTNavbar>

    <VTSearchbar
        :searchFunction="searchFunction"
        :styles="searchbarStyles"
        iconColor="#fff"
        background="rgba(0,0,0,0.5)"
        @search-value="searchValue($event)"
    />
    {{ search }}

    <div class="auth-btns">
        <VTButton :styles="{}" :onlyBorder="true">Login</VTButton>
        <VTButton :styles="{}" :ripple="false" :shine="true">Signup</VTButton>
    </div>

    <VTToggle @toggled="logValue($event)" :containerStyles="{}" :toggleStyles="{}" />

    <VTHoverbox :styles="{}" fill="red">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo commodi necessitatibus id
        cupiditate eum, quas nulla esse nesciunt veniam error.
    </VTHoverbox>

    <VTButton :rainbow="true" :shine="true" :ripple="false" :hoverEnabled="false" :styles="{}"
        >CRAZY</VTButton
    >

    <VTBurger @open="logValue($event)" :styles="{}" />

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
        :styles="{}"
        :blockStyles="{}"
    />

    <VTVideo
        :videoSrc="testSrc"
        :containerStyles="videoContainerStyles"
        videoPoster="require('@/assets/poster.jpg')"
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
        :buttonStyles="{}"
        :thumbStyles="{}"
        :containerStyles="{}"
        :contextmenu="false"
        trackColor="#5bd0b9"
        @click="videoFocused = String(video._uid)"
        @video-focused="videoFocused = String(video._uid)"
    />

    <VTPopup :styles="{}" crossColor="black" :cookie="true">Hey there!</VTPopup>
</template>
```
