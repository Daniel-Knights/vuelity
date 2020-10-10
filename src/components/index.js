import Button from './Button.vue';
import Burger from './Burger.vue';
import Hoverbox from './Hoverbox.vue';
import Navbar from './Navbar.vue';
import Modal from './Modal.vue';
import Pagination from './Pagination.vue';
import Popup from './Popup.vue';
import Scrolltop from './Scrolltop.vue';
import Searchbar from './Searchbar.vue';
import Toggle from './Toggle.vue';
import Tooltip from './Tooltip.vue';
import Video from './Video/Video.vue';

export const VTButton = Button;
export const VTBurger = Burger;
export const VTHoverbox = Hoverbox;
export const VTNavbar = Navbar;
export const VTModal = Modal;
export const VTPagination = Pagination;
export const VTPopup = Popup;
export const VTScrolltop = Scrolltop;
export const VTSearchbar = Searchbar;
export const VTToggle = Toggle;
export const VTTooltip = Tooltip;
export const VTVideo = Video;

// CDN compatibility
if (window !== undefined && window.Vue) {
    window.Vuelity = {
        'vt-button': VTButton,
        'vt-burger': VTBurger,
        'vt-hoverbox': VTHoverbox,
        'vt-navbar': VTNavbar,
        'vt-modal': VTModal,
        'vt-pagination': VTPagination,
        'vt-popup': VTPopup,
        'vt-scrolltop': VTScrolltop,
        'vt-searchbar': VTSearchbar,
        'vt-toggle': VTToggle,
        'vt-tooltip': VTTooltip,
        'vt-video': VTVideo,
    };
}
