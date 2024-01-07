/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import path from 'path';
import { createRequire } from 'module';
import rtlcss from 'rtlcss';
import { readDefaultCodeTranslationMessages } from '@docusaurus/theme-translations';
import { getTranslationFiles, translateThemeConfig } from './translations';
var requireFromDocusaurusCore = createRequire(require.resolve('@docusaurus/core/package.json'));
var ContextReplacementPlugin = requireFromDocusaurusCore('webpack/lib/ContextReplacementPlugin');
// Need to be inlined to prevent dark mode FOUC
// Make sure the key is the same as the one in `/theme/hooks/useTheme.js`
var ThemeStorageKey = 'theme';
// Support for ?docusaurus-theme=dark
var ThemeQueryStringKey = 'docusaurus-theme';
// Support for ?docusaurus-data-mode=embed&docusaurus-data-myAttr=42
var DataQueryStringPrefixKey = 'docusaurus-data-';
var noFlashColorMode = function (_a) {
    var defaultMode = _a.defaultMode, respectPrefersColorScheme = _a.respectPrefersColorScheme;
    /* language=js */
    return "(function() {\n  var defaultMode = '".concat(defaultMode, "';\n  var respectPrefersColorScheme = ").concat(respectPrefersColorScheme, ";\n\n  function setDataThemeAttribute(theme) {\n    document.documentElement.setAttribute('data-theme', theme);\n  }\n\n  function getQueryStringTheme() {\n    try {\n      return new URLSearchParams(window.location.search).get('").concat(ThemeQueryStringKey, "')\n    } catch(e) {}\n  }\n\n  function getStoredTheme() {\n    try {\n      return localStorage.getItem('").concat(ThemeStorageKey, "');\n    } catch (err) {}\n  }\n\n  var initialTheme = getQueryStringTheme() || getStoredTheme();\n  if (initialTheme !== null) {\n    setDataThemeAttribute(initialTheme);\n  } else {\n    if (\n      respectPrefersColorScheme &&\n      window.matchMedia('(prefers-color-scheme: dark)').matches\n    ) {\n      setDataThemeAttribute('dark');\n    } else if (\n      respectPrefersColorScheme &&\n      window.matchMedia('(prefers-color-scheme: light)').matches\n    ) {\n      setDataThemeAttribute('light');\n    } else {\n      setDataThemeAttribute(defaultMode === 'dark' ? 'dark' : 'light');\n    }\n  }\n})();");
};
/* language=js */
var DataAttributeQueryStringInlineJavaScript = "\n(function() {\n  try {\n    const entries = new URLSearchParams(window.location.search).entries();\n    for (var [searchKey, value] of entries) {\n      if (searchKey.startsWith('".concat(DataQueryStringPrefixKey, "')) {\n        var key = searchKey.replace('").concat(DataQueryStringPrefixKey, "',\"data-\")\n        document.documentElement.setAttribute(key, value);\n      }\n    }\n  } catch(e) {}\n})();\n");
// Duplicated constant. Unfortunately we can't import it from theme-common, as
// we need to support older nodejs versions without ESM support
// TODO: import from theme-common once we only support Node.js with ESM support
// + move all those announcementBar stuff there too
export var AnnouncementBarDismissStorageKey = 'docusaurus.announcement.dismiss';
var AnnouncementBarDismissDataAttribute = 'data-announcement-bar-initially-dismissed';
// We always render the announcement bar html on the server, to prevent layout
// shifts on React hydration. The theme can use CSS + the data attribute to hide
// the announcement bar asap (before React hydration)
/* language=js */
var AnnouncementBarInlineJavaScript = "\n(function() {\n  function isDismissed() {\n    try {\n      return localStorage.getItem('".concat(AnnouncementBarDismissStorageKey, "') === 'true';\n    } catch (err) {}\n    return false;\n  }\n  document.documentElement.setAttribute('").concat(AnnouncementBarDismissDataAttribute, "', isDismissed());\n})();");
function getInfimaCSSFile(direction) {
    return "infima/dist/css/default/default".concat(direction === 'rtl' ? '-rtl' : '', ".css");
}
export default function themeClassic(context, options) {
    var _a = context.i18n, currentLocale = _a.currentLocale, localeConfigs = _a.localeConfigs;
    var themeConfig = context.siteConfig.themeConfig;
    var announcementBar = themeConfig.announcementBar, colorMode = themeConfig.colorMode, additionalLanguages = themeConfig.prism.additionalLanguages;
    var customCss = options.customCss;
    var direction = localeConfigs[currentLocale].direction;
    return {
        name: 'docusaurus-theme-classic',
        getThemePath: function () {
            return '../lib/theme';
        },
        getTypeScriptThemePath: function () {
            return '../src/theme';
        },
        getTranslationFiles: function () { return getTranslationFiles({ themeConfig: themeConfig }); },
        translateThemeConfig: function (params) {
            return translateThemeConfig({
                themeConfig: params.themeConfig,
                translationFiles: params.translationFiles,
            });
        },
        getDefaultCodeTranslationMessages: function () {
            return readDefaultCodeTranslationMessages({
                locale: currentLocale,
                name: 'theme-common',
            });
        },
        getClientModules: function () {
            var modules = [
                require.resolve(getInfimaCSSFile(direction)),
                './prism-include-languages',
                './nprogress',
            ];
            modules.push.apply(modules, customCss.map(function (p) { return path.resolve(context.siteDir, p); }));
            return modules;
        },
        configureWebpack: function () {
            var prismLanguages = additionalLanguages
                .map(function (lang) { return "prism-".concat(lang); })
                .join('|');
            return {
                plugins: [
                    // This allows better optimization by only bundling those components
                    // that the user actually needs, because the modules are dynamically
                    // required and can't be known during compile time.
                    new ContextReplacementPlugin(/prismjs[\\/]components$/, new RegExp("^./(".concat(prismLanguages, ")$"))),
                ],
            };
        },
        configurePostCss: function (postCssOptions) {
            if (direction === 'rtl') {
                var resolvedInfimaFile_1 = require.resolve(getInfimaCSSFile(direction));
                var plugin = {
                    postcssPlugin: 'RtlCssPlugin',
                    prepare: function (result) {
                        var _a;
                        var file = (_a = result.root.source) === null || _a === void 0 ? void 0 : _a.input.file;
                        // Skip Infima as we are using the its RTL version.
                        if (file === resolvedInfimaFile_1) {
                            return {};
                        }
                        return rtlcss(result.root);
                    },
                };
                postCssOptions.plugins.push(plugin);
            }
            return postCssOptions;
        },
        injectHtmlTags: function () {
            return {
                preBodyTags: [
                    {
                        tagName: 'script',
                        innerHTML: "\n".concat(noFlashColorMode(colorMode), "\n").concat(DataAttributeQueryStringInlineJavaScript, "\n").concat(announcementBar ? AnnouncementBarInlineJavaScript : '', "\n            "),
                    },
                ],
            };
        },
    };
}
export { default as getSwizzleConfig } from './getSwizzleConfig';
export { validateThemeConfig, validateOptions } from './options';
