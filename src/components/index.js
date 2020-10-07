import Button from './Button.vue';
import Navbar from './Navbar.vue';
import Popup from './Popup.vue';
import Pagination from './Pagination.vue';
import Video from './Video/Video.vue';
import Searchbar from './Searchbar/Searchbar.vue';
import Tooltip from './Tooltip.vue';
import Hoverbox from './Hoverbox.vue';
import Toggle from './Toggle.vue';
import Burger from './Burger.vue';

export const VTBurger = Burger;
export const VTButton = Button;
export const VTHoverbox = Hoverbox;
export const VTNavbar = Navbar;
export const VTPopup = Popup;
export const VTPagination = Pagination;
export const VTSearchbar = Searchbar;
export const VTTooltip = Tooltip;
export const VTToggle = Toggle;
export const VTVideo = Video;

// CDN compatibility
if (window !== undefined && window.Vue) {
    window.Vuelity = {
        'vt-burger': VTBurger,
        'vt-button': VTButton,
        'vt-hoverbox': VTHoverbox,
        'vt-navbar': VTNavbar,
        'vt-popup': VTPopup,
        'vt-pagination': VTPagination,
        'vt-searchbar': VTSearchbar,
        'vt-tooltip': VTTooltip,
        'vt-toggle': VTToggle,
        'vt-video': VTVideo,
    };
}
