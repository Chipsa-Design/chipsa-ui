import react from '@astrojs/react';
import starlight from '@astrojs/starlight';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';

export default defineConfig({
    server: {
        port: 3000,
    },
    integrations: [
        react(),
        starlight({
            title: 'Chipsa UI',
            sidebar: [
                {
                    slug: '',
                },
                {
                    label: 'Компоненты',
                    items: [{ slug: 'components' }, { slug: 'components/img-sequence' }],
                },
            ],
        }),
    ],
    vite: {
        plugins: [tailwindcss()],
        optimizeDeps: {
            include: ['@chipsa-ui/core'],
        },
    },
});
