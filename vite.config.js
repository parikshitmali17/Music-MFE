// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })


// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';
// import federation from '@originjs/vite-plugin-federation';

// export default defineConfig({
//   plugins: [
//     react(),
//     federation({
//       name: 'music',
//       filename: 'remoteEntry.js',
//       exposes: {
//         './MusicLibrary': './src/components/MusicLibrary.jsx',
//       },
//     }),
//   ],
//   build: { target: 'esnext' },
// });


import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
 preview: {
    port: 5174
  },
  plugins: [
    react(),
    federation({
      name: 'music',
      filename: 'remoteEntry.js',
      exposes: {
        './MusicLibrary': './src/components/MusicLibrary.jsx',
      },
      shared: {
        react: {
          singleton: true,
          requiredVersion: "^19.1.0",
          strictVersion: true,
        },
        'react-dom': {
          singleton: true,
          requiredVersion: "^19.1.0",
          strictVersion: true,
        },
      },
       dev: true, // ✅ this enables dynamic federation in dev mode
    }),
  ],
  build: { target: 'esnext' },
  server: {
    port: 5174, // ✅ to avoid default port conflict
    cors: true,
   
    fs: {
      allow: ['.'], // allow current directory to be served
    },
  },
});
