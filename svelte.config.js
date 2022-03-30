import adapter from '@sveltejs/adapter-auto'
import preprocess from 'svelte-preprocess'

import path from 'path'
import houdini from 'houdini-preprocess'

/** @type {import('@sveltejs/kit').Config} */
const config = {
    // Consult https://github.com/sveltejs/svelte-preprocess
    // for more information about preprocessors
    preprocess: [houdini(), preprocess()],

    kit: {
        adapter: adapter(),
        vite: {
            resolve: {
                alias: {
                    $houdini: path.resolve('.', '$houdini'),
                },
            },
            server: {
                fs: {
                    allow: ['.'],
                },
            },
        },
    },
}

export default config
