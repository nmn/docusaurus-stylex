/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import _ from 'lodash';
import { mergeTranslations } from '@docusaurus/utils';
function getNavbarTranslationFile(navbar) {
    var _a;
    // TODO handle properly all the navbar item types here!
    function flattenNavbarItems(items) {
        var subItems = items.flatMap(function (item) {
            var _a;
            var allSubItems = [(_a = item.items) !== null && _a !== void 0 ? _a : []].flat();
            return flattenNavbarItems(allSubItems);
        });
        return __spreadArray(__spreadArray([], items, true), subItems, true);
    }
    var allNavbarItems = flattenNavbarItems(navbar.items);
    var navbarItemsTranslations = Object.fromEntries(allNavbarItems
        .filter(function (navbarItem) { return navbarItem.label; })
        .map(function (navbarItem) { return [
        "item.label.".concat(navbarItem.label),
        {
            message: navbarItem.label,
            description: "Navbar item with label ".concat(navbarItem.label),
        },
    ]; }));
    var titleTranslations = navbar.title
        ? { title: { message: navbar.title, description: 'The title in the navbar' } }
        : {};
    var logoAlt = ((_a = navbar.logo) === null || _a === void 0 ? void 0 : _a.alt)
        ? {
            'logo.alt': {
                message: navbar.logo.alt,
                description: 'The alt text of navbar logo',
            },
        }
        : {};
    return mergeTranslations([
        titleTranslations,
        logoAlt,
        navbarItemsTranslations,
    ]);
}
function translateNavbar(navbar, navbarTranslations) {
    var _a, _b, _c, _d, _e;
    if (!navbarTranslations) {
        return navbar;
    }
    var logo = navbar.logo
        ? __assign(__assign({}, navbar.logo), { alt: (_b = (_a = navbarTranslations["logo.alt"]) === null || _a === void 0 ? void 0 : _a.message) !== null && _b !== void 0 ? _b : (_c = navbar.logo) === null || _c === void 0 ? void 0 : _c.alt }) : undefined;
    return __assign(__assign({}, navbar), { title: (_e = (_d = navbarTranslations.title) === null || _d === void 0 ? void 0 : _d.message) !== null && _e !== void 0 ? _e : navbar.title, logo: logo, 
        //  TODO handle properly all the navbar item types here!
        items: navbar.items.map(function (item) {
            var _a, _b, _c;
            var subItems = (_a = item.items) === null || _a === void 0 ? void 0 : _a.map(function (subItem) {
                var _a, _b;
                return (__assign(__assign({}, subItem), { label: (_b = (_a = navbarTranslations["item.label.".concat(subItem.label)]) === null || _a === void 0 ? void 0 : _a.message) !== null && _b !== void 0 ? _b : subItem.label }));
            });
            return __assign(__assign(__assign({}, item), { label: (_c = (_b = navbarTranslations["item.label.".concat(item.label)]) === null || _b === void 0 ? void 0 : _b.message) !== null && _c !== void 0 ? _c : item.label }), (subItems ? { items: subItems } : undefined));
        }) });
}
function isMultiColumnFooterLinks(links) {
    return links.length > 0 && 'title' in links[0];
}
function getFooterTranslationFile(footer) {
    var _a;
    var footerLinkTitles = Object.fromEntries((isMultiColumnFooterLinks(footer.links)
        ? footer.links.filter(function (link) { return link.title; })
        : []).map(function (link) { return [
        "link.title.".concat(link.title),
        {
            message: link.title,
            description: "The title of the footer links column with title=".concat(link.title, " in the footer"),
        },
    ]; }));
    var footerLinkLabels = Object.fromEntries((isMultiColumnFooterLinks(footer.links)
        ? footer.links.flatMap(function (link) { return link.items; }).filter(function (link) { return link.label; })
        : footer.links.filter(function (link) { return link.label; })).map(function (link) {
        var _a;
        return [
            "link.item.label.".concat(link.label),
            {
                message: link.label,
                description: "The label of footer link with label=".concat(link.label, " linking to ").concat((_a = link.to) !== null && _a !== void 0 ? _a : link.href),
            },
        ];
    }));
    var copyright = footer.copyright
        ? {
            copyright: {
                message: footer.copyright,
                description: 'The footer copyright',
            },
        }
        : {};
    var logoAlt = ((_a = footer.logo) === null || _a === void 0 ? void 0 : _a.alt)
        ? {
            'logo.alt': {
                message: footer.logo.alt,
                description: 'The alt text of footer logo',
            },
        }
        : {};
    return mergeTranslations([
        footerLinkTitles,
        footerLinkLabels,
        copyright,
        logoAlt,
    ]);
}
function translateFooter(footer, footerTranslations) {
    var _a, _b, _c, _d, _e;
    if (!footerTranslations) {
        return footer;
    }
    var links = isMultiColumnFooterLinks(footer.links)
        ? footer.links.map(function (link) {
            var _a, _b;
            return (__assign(__assign({}, link), { title: (_b = (_a = footerTranslations["link.title.".concat(link.title)]) === null || _a === void 0 ? void 0 : _a.message) !== null && _b !== void 0 ? _b : link.title, items: link.items.map(function (linkItem) {
                    var _a, _b;
                    return (__assign(__assign({}, linkItem), { label: (_b = (_a = footerTranslations["link.item.label.".concat(linkItem.label)]) === null || _a === void 0 ? void 0 : _a.message) !== null && _b !== void 0 ? _b : linkItem.label }));
                }) }));
        })
        : footer.links.map(function (link) {
            var _a, _b;
            return (__assign(__assign({}, link), { label: (_b = (_a = footerTranslations["link.item.label.".concat(link.label)]) === null || _a === void 0 ? void 0 : _a.message) !== null && _b !== void 0 ? _b : link.label }));
        });
    var copyright = (_b = (_a = footerTranslations.copyright) === null || _a === void 0 ? void 0 : _a.message) !== null && _b !== void 0 ? _b : footer.copyright;
    var logo = footer.logo
        ? __assign(__assign({}, footer.logo), { alt: (_d = (_c = footerTranslations["logo.alt"]) === null || _c === void 0 ? void 0 : _c.message) !== null && _d !== void 0 ? _d : (_e = footer.logo) === null || _e === void 0 ? void 0 : _e.alt }) : undefined;
    return __assign(__assign({}, footer), { links: links, copyright: copyright, logo: logo });
}
export function getTranslationFiles(_a) {
    var themeConfig = _a.themeConfig;
    var translationFiles = [
        { path: 'navbar', content: getNavbarTranslationFile(themeConfig.navbar) },
        themeConfig.footer
            ? {
                path: 'footer',
                content: getFooterTranslationFile(themeConfig.footer),
            }
            : undefined,
    ];
    return translationFiles.filter(Boolean);
}
export function translateThemeConfig(_a) {
    var _b, _c;
    var themeConfig = _a.themeConfig, translationFiles = _a.translationFiles;
    var translationFilesMap = _.keyBy(translationFiles, function (f) { return f.path; });
    return __assign(__assign({}, themeConfig), { navbar: translateNavbar(themeConfig.navbar, (_b = translationFilesMap.navbar) === null || _b === void 0 ? void 0 : _b.content), footer: themeConfig.footer
            ? translateFooter(themeConfig.footer, (_c = translationFilesMap.footer) === null || _c === void 0 ? void 0 : _c.content)
            : undefined });
}
