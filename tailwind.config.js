/** @type {import('tailwindcss').Config} */

module.exports = {
    /** Remember docs said DO NOT include s[ac]ss or css type files */
    content: ['./dist/**/*.{html,js}', './src/**/*.{ts,tsx,js,jsx}'],
    theme: {
        extend: {},
    },
    variants: {
        extend: {},
    },
    plugins: [
        require("@tailwindcss/container-queries")
    ],
}