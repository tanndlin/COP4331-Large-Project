/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            height: {
                '1/10': '10%',
                '2/10': '20%',
                '3/10': '30%',
                '4/10': '40%',
                '5/10': '50%',
                '6/10': '60%',
                '7/10': '70%',
                '8/10': '80%',
                '9/10': '90%',
                'minus-header': 'calc(100% - 4rem)',
                'calendar': 'calc((100vh - 4rem) * 9/10 * 4/5)',
            },
            width: {
                '1/10': '10%',
                '2/10': '20%',
                '3/10': '30%',
                '4/10': '40%',
                '5/10': '50%',
                '6/10': '60%',
                '7/10': '70%',
                '8/10': '80%',
                '9/10': '90%',
            },
            minHeight: {
                '1/2': '50%',
                '1/3': '33.3%',
                '1/4': '25%',
                '1/5': '20%',
                '9/10': '90%',
                'minus-header': 'calc(100% - 4rem)',
            }
        },
    },
    plugins: [],
}