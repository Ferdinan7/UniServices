import { Config } from '@stencil/core';
import tailwind from 'stencil-tailwind-plugin'

export const config: Config = {
  namespace: 'uniauth',
  globalStyle: 'src/global/tailwind.css',
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader',
    },
    {
      type: 'dist-custom-elements',
      customElementsExportBehavior: 'auto-define-custom-elements',
      externalRuntime: false,
    },
    {
      type: 'docs-readme',
    },
    {
      type: 'www',
      serviceWorker: null, // disable service workers
    },
  ],
  testing: {
    browserHeadless: "shell",
  },
  plugins: [
    tailwind()
  ],
  devServer: {
    reloadStrategy: 'pageReload'
  }
};
