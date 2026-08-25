import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
    plugins: [
        react(),

        VitePWA({
            registerType: 'autoUpdate',

            includeAssets: [
                'favicon.ico'
            ],

            manifest: {
                name: 'Master POS',
                short_name: 'POS',
                description: 'Offline POS System',
                theme_color: '#ffffff',
                background_color: '#ffffff',
                display: 'standalone',
                start_url: '/',
                scope: '/'
            },

            workbox: {
                globPatterns: [
                    '**/*.{js,css,html,ico,png,svg,woff2}'
                ]
            }
        })
    ]
});