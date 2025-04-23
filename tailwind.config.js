/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      backgroundImage: {
        'custom-gradient': 'linear-gradient(90deg, #3e9dfe, #9369fd)',
      },
      backgroundColor: {
        'login-button-color':
          'light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-6))',
      },
    },
  },
  plugins: [],
  corePlugins: {
    // preflight: false,
  },
};
