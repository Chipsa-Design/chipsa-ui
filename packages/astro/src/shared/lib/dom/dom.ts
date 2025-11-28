import { NO_SCROLL_CLASS } from "./config/const";


export function lockBodyScroll() {
    document.documentElement.classList.add(NO_SCROLL_CLASS);
}

export function unlockBodyScroll() {
    document.documentElement.classList.remove(NO_SCROLL_CLASS);
}
