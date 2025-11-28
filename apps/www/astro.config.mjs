import react from '@astrojs/react';
import starlight from '@astrojs/starlight';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';
import astrobook from 'astrobook';
import { readdirSync } from 'fs';
import { join } from 'path';

const componentsDir = join(process.cwd(), 'src/content/docs/components');
const componentFiles = readdirSync(componentsDir)
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => {
        const name = file.replace('.mdx', '');
        return name === 'index' ? { slug: 'components' } : { slug: `components/${name}` };
    })
    .sort((a, b) => {
        if (a.slug === 'components') return -1;
        if (b.slug === 'components') return 1;
        return a.slug.localeCompare(b.slug);
    });

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
                    items: componentFiles,
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
    },
});
