import Burger from './Burger.vue';
import Button from './Button.vue';
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
import tabber from './js/tabber';
export const vtTabber = tabber;

// Toast notifications
import toast from './Toast/toast';
export const VTToast = toast;

export const VTBurger = Burger;
export const VTButton = Button;
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
        'vt-burger': VTBurger,
        'vt-button': VTButton,
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
        VTToast,
        vtTabber: tabber,
    };
}
