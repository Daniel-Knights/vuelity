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
