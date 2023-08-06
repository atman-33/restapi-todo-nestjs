## install

### NX 

```shell
nx g @nx/react:setup-tailwind --project=web
```

> if not use nx, sample is following  
```shell
yarn add -D tailwindcss postcss autoprefixer
yarn add -D prettier prettier-plugin-tailwindcss
npx tailwindcss init -p
```

## add corePlugins to tailwind.config.js
```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  ...,
  corePlugins: {
    preflight: false,
  }
};
```

## setup global.css

*global.css*
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

install vscode extension  
- Tailwind CSS IntelliSense

change vscode settings.json
```json
{
  "files.associations": {
    "*.css": "tailwindcss"
  }
}
```