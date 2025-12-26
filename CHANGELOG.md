# Changelog

All notable changes to this project will be documented in this file. See [commit-and-tag-version](https://github.com/absolute-version/commit-and-tag-version) for commit guidelines.

## [0.2.0](https://github.com/isdk/mdast-plus.js/compare/v0.1.3...v0.2.0) (2025-12-26)


### ⚠ BREAKING CHANGES

* sync src changes to docs and implement .data() method

### Features

* add html-readability plugin and enhance plugin ordering logic ([5bd3b07](https://github.com/isdk/mdast-plus.js/commit/5bd3b075c866a48ba8414779cc451068212b5e4e))
* export htmlReadabilityPlugins array for easier usage ([2251836](https://github.com/isdk/mdast-plus.js/commit/2251836f94190267b01803027e94eb70ad4388c0))
* support plugin array in use and useAt methods ([cc51165](https://github.com/isdk/mdast-plus.js/commit/cc5116529c9abee157c339af471607de2b5533a7))
* sync src changes to docs and implement .data() method ([9d4d40b](https://github.com/isdk/mdast-plus.js/commit/9d4d40b45f61179cb84914c2446b38b39d4d32c3))


### Bug Fixes

* **types:** resolve readability property missing error on AST nodes ([4f90223](https://github.com/isdk/mdast-plus.js/commit/4f90223978cfff7c1a8231bb45677e4d469bb4b8))

## [0.1.3](https://github.com/isdk/mdast-plus.js/compare/v0.1.2...v0.1.3) (2025-12-26)


### Features

* add Options passed ([ce6186c](https://github.com/isdk/mdast-plus.js/commit/ce6186cf4fa995aa423c33340269c4d29f79c4dc))
* enhance plugin identification and document behavior ([26fdd1b](https://github.com/isdk/mdast-plus.js/commit/26fdd1bb606481888e9247cabb7acd04dd14f936))


### Bug Fixes

* resolve typescript type hint errors in pipeline.ts ([bacb492](https://github.com/isdk/mdast-plus.js/commit/bacb4922529058fef775e3f4b4e71c98ac1cab17))


### Refactor

* implement unified-native stage-based pipeline architecture and add TSDoc ([3ad805b](https://github.com/isdk/mdast-plus.js/commit/3ad805b596ca94d6626aeac3018ddf3ac5af49d0))

## [0.1.2](https://github.com/isdk/mdast-plus.js/compare/v0.1.1...v0.1.2) (2025-12-24)


### Features

* add support for mark/sub/sup and improve format definitions ([1717131](https://github.com/isdk/mdast-plus.js/commit/17171317517e8b597723295887b17363126f3e23))
* use shell-quote to parse code meta string ([75ee549](https://github.com/isdk/mdast-plus.js/commit/75ee549d3fb31ef4bc1b4a6b3307f6368072874e))

## 0.1.1 (2025-12-24)


### Features

* **docs:** mdast plus spec@0.2.3 ([44a8f82](https://github.com/isdk/mdast-plus.js/commit/44a8f82daf8cbb9fcecba8508f5ee6a132c389b7))
* **docs:** update mdast plus spec ([91c096c](https://github.com/isdk/mdast-plus.js/commit/91c096c6fe9ac019db9b4f356b316b0c3974b893))
* **docs:** update to spec 0.2.2 ([d6d84dd](https://github.com/isdk/mdast-plus.js/commit/d6d84dd61f357d14a4cfab05148ebd5853419c06))
* implement mark, sub and sup support ([6e5a227](https://github.com/isdk/mdast-plus.js/commit/6e5a2270b69c7c6f5788e3b1135024d64632d1c8))
* support arbitrary registered formats and update documentation ([a65e9cf](https://github.com/isdk/mdast-plus.js/commit/a65e9cf13e825bd9090dd928804aaf2e207d0aa5))


### Bug Fixes

* **docs:** mdast plus spec ([b16fe00](https://github.com/isdk/mdast-plus.js/commit/b16fe0014a8670348f7ebcb40b02e7b97090616d))
* **docs:** style correct ([4fb2db5](https://github.com/isdk/mdast-plus.js/commit/4fb2db52ae896eebb64a3d0268c4da6ad473a472))
* plugin sorting logic to correctly handle implicit stages ([2bb9de5](https://github.com/isdk/mdast-plus.js/commit/2bb9de5c341a46f071c829a446895ca0fcb8f972))
