import { ref, computed } from 'vue';

const focused = ref('');

// Determine which video is in focus
export default function focusedStore() {
    const setFocused = id => (focused.value = String(id));

    return { focused: computed(() => focused.value), setFocused };
}
