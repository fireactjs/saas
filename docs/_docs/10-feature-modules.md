---
title: "Feature Modules"
permalink: /docs/feature-modules/
excerpt: "Develop features as modules"
last_modified_at: 2022-07-15
---

In Fireact, SaaS features should be developed separated from the Fireact repository and be imported to Fireact as git submodules. To trial the demo feature module, run `git submodule add [git@github.com](mailto:git@github.com):chaoming/fireact-demo-feature.git ./src/features/demo`

## Feature module folder structure

Each feature should be in a folder named with the feature under the `/src/features` folder. For example, the demo feature module is `/src/features/demo`. Fireact will import the module into the user interface. Here are the minimum files inside the module folder.

module-name/
├── FeatureRoutes.js
├── FeatureMenu.js
└── package.json

## FeatureRoutes.js

This is the file for routing your feature pages. Your feature could have multiple pages and the page routes should be coded in this file. See [https://github.com/chaoming/fireact-demo-feature/blob/main/FeatureRoutes.js](https://github.com/chaoming/fireact-demo-feature/blob/main/FeatureRoutes.js) for an example with three routes points to `<Demo />`, `<DemoSecondary />` and `<DemoAnother />` components.

In the example, there are three routes:

- `/account/{accountId}/` - map to the component `<Demo />` in the `index.js` file.
- `/account/{accountId}/secondary` - map to the component`<DemoSecondary />` <Demo /> in the `secondary.js` file.
- `/account/{accountId}/another` - map to the component `<DemoAnother />` in the `Another.js` file.

## FeatureMenu.js

This is the file to insert menu items to the main menu so that the users can access your feature pages via the main menu. See [https://github.com/chaoming/fireact-demo-feature/blob/main/FeatureMenu.js](https://github.com/chaoming/fireact-demo-feature/blob/main/FeatureMenu.js) for an example to insert three menu items into the main menu.

![Feature menu screenshot](/assets/images/feature_menu.png)

Feature menu screenshot

## Other files

You can develop the features as more files and folders, and use `npm install` to install the dependencies in the module folder.