import { createApp } from 'vue';
import DKButton from '@/components/Button.vue';
import DKNavbar from '@/components/Navbar.vue';
import DKPopup from '@/components/Popup.vue';
import DKPagination from '@/components/Pagination.vue';
import DKVideo from '@/components/Video/Video.vue';
import DKSearchbar from '@/components/Searchbar/Searchbar.vue';
import DKTooltip from '@/components/Tooltip.vue';
import DKHoverbox from '@/components/Hoverbox.vue';

const app = createApp();

const Components = {
    DKButton,
    DKNavbar,
    DKPopup,
    DKPagination,
    DKVideo,
    DKSearchbar,
    DKTooltip,
    DKHoverbox,
};

Object.keys(Components).forEach(name => {
    app.component(name, Components[name]);
});

export default Components;
