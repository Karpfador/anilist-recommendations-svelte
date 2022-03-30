/** @type {import('houdini').ConfigFile} */
const config = {
    schemaPath: './schema.graphql',
    sourceGlob: 'src/**/*.svelte',
    module: 'esm',
    framework: 'kit',
    apiUrl: 'https://graphql.anilist.co/',
}

export default config
