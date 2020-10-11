import Button from './Button.vue';
import Burger from './Burger.vue';
import Hoverbox from './Hoverbox.vue';
import Loading from './Loading.vue';
import Modal from './Modal.vue';
import Navbar from './Navbar.vue';
import Pagination from './Pagination.vue';
import Popup from './Popup.vue';
import Scrolltop from './Scrolltop.vue';
import Searchbar from './Searchbar.vue';
import Toggle from './Toggle.vue';
import Tooltip from './Tooltip.vue';
import Video from './Video/Video.vue';

// Tab outline
import accessibilityTab from './js/tab';
export const vtAccessibility = accessibilityTab;

export const VTButton = Button;
export const VTBurger = Burger;
export const VTHoverbox = Hoverbox;
export const VTLoading = Loading;
export const VTModal = Modal;
export const VTNavbar = Navbar;
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
        vtAccessibility: accessibilityTab,
        'vt-button': VTButton,
        'vt-burger': VTBurger,
        'vt-hoverbox': VTHoverbox,
        'vt-loading': VTLoading,
        'vt-modal': VTModal,
        'vt-navbar': VTNavbar,
        'vt-pagination': VTPagination,
        'vt-popup': VTPopup,
        'vt-scrolltop': VTScrolltop,
        'vt-searchbar': VTSearchbar,
        'vt-toggle': VTToggle,
        'vt-tooltip': VTTooltip,
        'vt-video': VTVideo,
    };
}
