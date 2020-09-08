const purgecss = require("@fullhuman/postcss-purgecss")({
    content: ["./src/**/*.html", "./src/**/*.svelte"],
    whitelist: ['text-green-500'],
whitelistPatterns: [/svelte-/, /text-[^-]*/, /bg-(.*)-500/],
    defaultExtractor: content => content.match(/[A-Za-z0-9-_:/]+/g) || [],
})

const production = !process.env.ROLLUP_WATCH

module.exports = {
    plugins: [require("tailwindcss"), ...(production ? [purgecss] : [])],
}
