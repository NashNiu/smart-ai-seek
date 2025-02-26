module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    plugins: [require("@tailwindcss/typography")],
    theme: {
        extend: {
            typography: {
                DEFAULT: {
                    css: {
                        '--tw-prose-quotes': '#666666',
                    }
                }
            }
        }
    }
};