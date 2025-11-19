import react from '@astrojs/react';
import starlight from '@astrojs/starlight';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';
import astrobook from 'astrobook';

export default defineConfig({
    trailingSlash: 'always',
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
        astrobook({
            subpath: '/playground/',
            directory: 'src/astrobook',
        }),
    ],
    vite: {
        plugins: [tailwindcss()],
        optimizeDeps: {
            include: ['@chipsa-ui/core'],
        },
    },
});
