/**
 * Утилита для обработки кликов вне элемента
 *
 * @param elements - Элемент или массив элементов для проверки
 * @param callback - Функция, которая выполняется при клике вне элемента
 * @returns Функция для удаления обработчика событий
 *
 * @example
 * const cleanup = onOutsideClickAction(element, () => {
 *   console.log('Клик вне элемента');
 * });
 *
 * // Удалить обработчик
 * cleanup();
 */
export function onOutsideClickAction(elements: Element | Element[] | null, callback: () => void): () => void {
    const closeOnOutsideClick = (event: Event) => {
        const target = event.target as HTMLElement;

        if (Array.isArray(elements)) {
            if (
                elements.every((element) => {
                    if (element) {
                        const parentSelector = element.className
                            .split(' ')
                            .map((className) => `.${className}`)
                            .join();
                        const closest = target.closest(parentSelector);

                        return !closest || (closest && closest !== element);
                    }

                    return false;
                })
            ) {
                callback();
            }
        } else if (elements) {
            const parentSelector = elements.className
                .split(' ')
                .map((className) => `.${className}`)
                .join();
            const closest = target.closest(parentSelector);

            if (!closest || (closest && closest !== elements)) {
                callback();
            }
        }
    };

    document.documentElement.addEventListener('click', closeOnOutsideClick);

    return () => document.documentElement.removeEventListener('click', closeOnOutsideClick);
}
