declare module 'delegate';


interface Window {
    scheduler?: {
        postTask<T>(
            task: () => T,
            options?: { priority?: 'user-blocking' | 'user-visible' | 'background' },
        ): Promise<T>;
        yield(): Promise<void>;
    };
    ymaps3?: any;
    ym?: (...args: any[]) => void;
    gtag?: (...args: any[]) => void;
    dataLayer?: Record<string, any>;
}

