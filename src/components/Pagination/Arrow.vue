<template>
    <svg
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        preserveAspectRatio="xMidYMid meet"
        viewBox="255.9622548493317 112.44786478136979 81.35367041849639 69.72646364857121"
        width="77.35"
        height="65.73"
    >
        <defs>
            <path
                d="M332.42 150.93C334.95 148.32 334.95 144.17 332.42 141.56C325.56 134.5 312.66 121.21 306.59 114.95C303.51 111.78 298.14 113.96 298.14 118.38C298.14 120.14 298.14 124.55 298.14 131.6C278.7 131.6 266.56 131.6 261.7 131.6C259.08 131.6 256.96 133.72 256.96 136.34C256.96 141.26 256.96 151.29 256.96 156.21C256.96 158.83 259.08 160.95 261.7 160.95C266.56 160.95 278.7 160.95 298.14 160.95C298.14 168.09 298.14 172.55 298.14 174.34C298.14 178.67 303.41 180.81 306.43 177.7C312.54 171.41 325.56 157.99 332.42 150.93Z"
                id="e57m1rNmfT"
            ></path>
        </defs>
        <g>
            <g><use xlink:href="#e57m1rNmfT" opacity="1" :fill="fill" fill-opacity="1"></use></g>
        </g>
    </svg>
</template>

<script>
import { computed } from 'vue';

export default {
    name: 'Arrow',

    props: { disabled: { type: Boolean, default: true } },

    setup(props) {
        const fill = computed(() => (props.disabled ? '#d4dadd' : '#f5fafd'));

        return { fill };
    },
};
</script>
