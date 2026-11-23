document.addEventListener("DOMContentLoaded", function () {
    const $searchMask = document.getElementById("search-mask");
    const $searchDialog = document.querySelector("#algolia-search .search-dialog");

    let searchReady;
    window.openSearch = () => {
        utils.animateIn($searchMask, "to_show 0.5s");
        $searchDialog.style.display = "flex";
        document.addEventListener("keydown", function f(event) {
            if (event.code === "Escape") {
                closeSearch();
                document.removeEventListener("keydown", f);
            }
        });
        fixSafariHeight();
        window.addEventListener("resize", fixSafariHeight);
        if (!searchReady) {
            const hits = document.getElementById("algolia-hits");
            hits.textContent = GLOBAL_CONFIG.lang.search.loading;
            searchReady = startSearch().catch(error => {
                searchReady = undefined;
                hits.textContent = "搜索加载失败，请重试。";
                throw error;
            });
        }
        return searchReady.then(() => {
            if (!utils.isHidden($searchDialog)) {
                document.querySelector("#algolia-search .ais-SearchBox-input")?.focus();
            }
            return true;
        }).catch(error => {
            console.error("Could not start Algolia search", error);
            return false;
        });
    };

    const closeSearch = () => {
        utils.animateOut($searchDialog, "search_close .5s");
        utils.animateOut($searchMask, "to_hide 0.5s");
        window.removeEventListener("resize", fixSafariHeight);
    };

    const fixSafariHeight = () => {
        if (window.innerWidth < 768) {
            $searchDialog.style.setProperty("--search-height", window.innerHeight + "px");
        }
    };

    const addEventCtrlK = () => {
        document.addEventListener("keydown", function (event) {
            if (event.ctrlKey && event.key === "k") {
                event.preventDefault();
                openSearch();
            }
        });
    }

    addEventCtrlK()

    const searchClickFn = () => {
        utils.addEventListenerPjax(document.querySelector("#search-button > .search"), "click", openSearch);

        GLOBAL_CONFIG.right_menu && document.getElementById("menu-search").addEventListener("click", async function () {
            rm.hideRightMenu();
            if (!await openSearch()) return;
            const t = document.querySelector("#algolia-search .ais-SearchBox-input");
            if (!t) return;
            let evt = document.createEvent('HTMLEvents');
            evt.initEvent('input', true,true)
            t.value = selectTextNow
            t.dispatchEvent(evt)
        })
    };

    const searchFnOnce = () => {
        $searchMask.addEventListener("click", closeSearch);
        document.querySelector("#algolia-search .search-close-button").addEventListener("click", closeSearch);
    };

    searchClickFn();
    searchFnOnce();

    window.addEventListener("pjax:complete", () => {
        if (!utils.isHidden($searchMask)) closeSearch();
        searchClickFn();
    });

    async function startSearch() {
        const algolia = GLOBAL_CONFIG.algolia;
        const isAlgoliaValid = algolia.appId && algolia.apiKey && algolia.indexName;
        if (!isAlgoliaValid) {
            throw new Error("Algolia setting is invalid");
        }

        await Promise.all(algolia.libraries.map(url => utils.getScript(url)));

        const search = instantsearch({
            indexName: algolia.indexName,
            searchClient: algoliasearch.algoliasearch(algolia.appId, algolia.apiKey),
            searchFunction(helper) {
                if (helper.state.query) {
                    let innerLoading = `<div class="loading">${GLOBAL_CONFIG.lang.search.loading}</div>`;
                    document.getElementById("algolia-hits").innerHTML = innerLoading;
                    helper.search();
                } else {
                    document.getElementById("algolia-hits").innerHTML = '';
                }
            },
        });

        const configure = instantsearch.widgets.configure({
            hitsPerPage: algolia.hits.per_page || 5,
        });

        const searchBox = instantsearch.widgets.searchBox({
            container: "#algolia-search-input",
            showReset: false,
            showSubmit: false,
            placeholder: GLOBAL_CONFIG.lang.search.placeholder,
            showLoadingIndicator: false,
            searchAsYouType: true,
        });

        const hits = instantsearch.widgets.hits({
            container: "#algolia-hits",
            templates: {
                item(data) {
                    const link = data.permalink ? data.permalink : GLOBAL_CONFIG.root + data.path;
                    const result = data._highlightResult;
                    const loadingLogo = document.querySelector("#algolia-hits .loading");
                    if (loadingLogo) {
                        loadingLogo.style.display = "none";
                    }
                    setTimeout(() => {
                        document.querySelector("#algolia-search .ais-SearchBox-input").focus();
                    }, 200);
                    return `
              <a href="${link}" class="algolia-hit-item-link">
              <span class="algolia-hits-item-title">${result.title.value || "no-title"}</span>
              </a>`;
                },
                empty: function (data) {
                    const loadingLogo = document.querySelector("#algolia-hits .loading");
                    if (loadingLogo) {
                        loadingLogo.style.display = "none";
                    }
                    setTimeout(() => {
                        document.querySelector("#algolia-search .ais-SearchBox-input").focus();
                    }, 200);
                    return (
                        '<div id="algolia-hits-empty">' +
                        GLOBAL_CONFIG.lang.search.empty.replace(/\$\{query}/, data.query) +
                        "</div>"
                    );
                },
            },
            cssClasses: {
                item: "algolia-hit-item",
            },
        });

        const pagination = instantsearch.widgets.pagination({
            container: "#algolia-pagination",
            totalPages: algolia.hits.per_page ?? 5,
            scrollTo: false,
            showFirstLast: false,
            templates: {
                first: '<i class="Eureka fas fa-angles-left"></i>',
                last: '<i class="Eureka fas fa-angles-right"></i>',
                previous: '<i class="Eureka fas fa-angle-left"></i>',
                next: '<i class="Eureka fas fa-angle-right"></i>',
            },
            cssClasses: {
                root: "pagination",
                item: "pagination-item",
                link: "page-number",
                active: "current",
                disabled: "disabled-item",
            },
        });

        const stats = instantsearch.widgets.stats({
            container: "#algolia-tips > #algolia-stats",
            templates: {
                text: function (data) {
                    const stats = GLOBAL_CONFIG.lang.search.hit
                        .replace(/\$\{hits}/, data.nbHits)
                        .replace(/\$\{time}/, data.processingTimeMS);
                    return `<hr>${stats}`;
                },
            },
        });

        search.addWidgets([configure, searchBox, stats, hits, pagination]);

        document.getElementById("algolia-hits").textContent = "";
        search.start();

        window.pjax &&
        search.on("render", () => {
            window.pjax.refresh(document.getElementById("algolia-hits"));
        });
    }
});
