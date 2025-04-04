import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {},
    },
    plugins: [daisyui],

    daisyui: {
        themes: [
            "light", // Default light theme
            {
                myblack: { // Custom theme name (avoid using "black" to prevent conflicts)
                    primary: "rgb(29, 155, 240)",
                    secondary: "rgb(24, 24, 24)",
                    accent: "#1f2937",
                    neutral: "#111111",
                    "base-100": "#000000",
                    info: "#3abff8",
                    success: "#36d399",
                    warning: "#fbbf24",
                    error: "#f87272",
                },
            },
        ],
    },
};
