// ========================================
// USERNAME PRO - RESULTS
// ========================================


let generation =
    JSON.parse(
        sessionStorage.getItem(
            "currentResults"
        ) || "null"
    );


let allResults =
    generation?.results || [];


let visibleResults =
    [...allResults];


let favorites =
    JSON.parse(
        localStorage.getItem(
            "usernameFavorites"
        ) || "[]"
    );


let favoritesOnly = false;


// ---------- THEME ----------

const themeBtn =
    document.getElementById("themeBtn");


function loadTheme(){

    const theme =
        localStorage.getItem(
            "usernameTheme"
        );


    if(theme === "light"){

        document.body.classList.add("light");

        if(themeBtn){

            themeBtn.textContent = "☀️";

        }

    }

}


function toggleTheme(){

    document.body.classList.toggle("light");


    const light =
        document.body.classList.contains(
            "light"
        );


    localStorage.setItem(
        "usernameTheme",
        light ? "light" : "dark"
    );


    if(themeBtn){

        themeBtn.textContent =
            light ? "☀️" : "🌙";

    }

}


if(themeBtn){

    themeBtn.addEventListener(
        "click",
        toggleTheme
    );

}


loadTheme();


// ---------- TOAST ----------

let toastTimer;


function showToast(
    message,
    icon = "✓"
){

    const toast =
        document.getElementById("toast");


    if(!toast) return;


    document.getElementById(
        "toastMessage"
    ).textContent = message;


    document.getElementById(
        "toastIcon"
    ).textContent = icon;


    toast.classList.add("show");


    clearTimeout(toastTimer);


    toastTimer =
        setTimeout(() => {

            toast.classList.remove(
                "show"
            );

        }, 2500);

}


// ---------- FAVORITES ----------

function saveFavorites(){

    localStorage.setItem(
        "usernameFavorites",
        JSON.stringify(favorites)
    );

}


function isFavorite(username){

    return favorites.includes(
        username
    );

}


function toggleFavorite(username){

    if(isFavorite(username)){

        favorites =
            favorites.filter(
                item =>
                    item !== username
            );

        showToast(
            "Removed from Favorites.",
            "💔"
        );

    }

    else{

        favorites.push(username);

        showToast(
            "Added to Favorites.",
            "❤️"
        );

    }


    saveFavorites();

    renderResults();

    updateStatistics();

}


// ---------- RENDER ----------

function renderResults(){

    const list =
        document.getElementById(
            "usernameList"
        );


    const empty =
        document.getElementById(
            "emptyState"
        );


    list.innerHTML = "";


    if(!visibleResults.length){

        empty.style.display =
            "block";

    }

    else{

        empty.style.display =
            "none";

    }


    visibleResults.forEach(
        username => {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "username-item";


            const text =
                document.createElement(
                    "div"
                );


            text.className =
                "username-text";


            text.textContent =
                username;


            const actions =
                document.createElement(
                    "div"
                );


            actions.className =
                "username-actions";


            // Copy

            const copyBtn =
                document.createElement(
                    "button"
                );


            copyBtn.textContent =
                "📋";


            copyBtn.title =
                "Copy";


            copyBtn.addEventListener(
                "click",
                () => copyUsername(username)
            );


            // Favorite

            const favoriteBtn =
                document.createElement(
                    "button"
                );


            favoriteBtn.className =
                "favorite";


            if(isFavorite(username)){

                favoriteBtn.classList.add(
                    "active"
                );

                favoriteBtn.textContent =
                    "❤️";

            }

            else{

                favoriteBtn.textContent =
                    "♡";

            }


            favoriteBtn.title =
                "Favorite / Unfavorite";


            favoriteBtn.addEventListener(
                "click",
                () =>
                    toggleFavorite(username)
            );


            actions.appendChild(
                copyBtn
            );


            actions.appendChild(
                favoriteBtn
            );
            const checkBtn = document.createElement("button");

checkBtn.textContent = "🔎";
checkBtn.title = "Check Username";
checkBtn.className = "check-btn"

checkBtn.addEventListener("click", function () {
    checkUsernameAvailability(username);
});

actions.appendChild(checkBtn);


            item.appendChild(text);

            item.appendChild(actions);


            list.appendChild(item);

        }
    );


    document.getElementById(
        "visibleCount"
    ).textContent =
        visibleResults.length;

}


// ---------- COPY ONE ----------

async function copyUsername(username){

    try{

        await navigator.clipboard.writeText(
            username
        );


        showToast(
            "Username copied.",
            "📋"
        );

    }

    catch{

        showToast(
            "Copy failed.",
            "!"
        );

    }

}
function checkUsernameAvailability(username) {

    if (!username) {
        showToast("Username not found.", "!");
        return;
    }

    if (username.length < 3) {
        showToast("Username is too short.", "!");
        return;
    }

    if (username.length > 30) {
        showToast("Username is too long.", "!");
        return;
    }

    if (allResults.includes(username)) {
        showToast(
            `"${username}" is valid as a generated username.`,
            "✓"
        );
    } else {
        showToast(
            "Username is not in the current results.",
            "!"
        );
    }
}


// ---------- SEARCH ----------

const searchInput =
    document.getElementById(
        "searchInput"
    );


if(searchInput){

    searchInput.addEventListener(
        "input",
        function(){

            const query =
                this.value
                    .trim()
                    .toLowerCase();


            visibleResults =
                allResults.filter(
                    username => {

                        const match =
                            username
                                .toLowerCase()
                                .includes(query);


                        if(
                            favoritesOnly &&
                            !isFavorite(username)
                        ){

                            return false;

                        }


                        return match;

                    }
                );


            renderResults();

        }
    );

}


// ---------- FAVORITE FILTER ----------

const favoriteFilter =
    document.getElementById(
        "favoriteFilter"
    );


if(favoriteFilter){

    favoriteFilter.addEventListener(
        "click",
        function(){

            favoritesOnly =
                !favoritesOnly;


            this.classList.toggle(
                "active",
                favoritesOnly
            );


            applyFilters();


        }
    );

}


function applyFilters(){

    const query =
        searchInput
            ? searchInput.value
                .trim()
                .toLowerCase()
            : "";


    visibleResults =
        allResults.filter(
            username => {

                const searchMatch =
                    username
                        .toLowerCase()
                        .includes(query);


                const favoriteMatch =
                    !favoritesOnly ||
                    isFavorite(username);


                return (
                    searchMatch &&
                    favoriteMatch
                );

            }
        );


    renderResults();

}


// ---------- SHUFFLE ----------

const shuffleBtn =
    document.getElementById(
        "shuffleBtn"
    );


if(shuffleBtn){

    shuffleBtn.addEventListener(
        "click",
        function(){

            for(
                let i = allResults.length - 1;
                i > 0;
                i--
            ){

                const j =
                    Math.floor(
                        Math.random() *
                        (i + 1)
                    );


                [
                    allResults[i],
                    allResults[j]
                ] =
                [
                    allResults[j],
                    allResults[i]
                ];

            }


            applyFilters();


            showToast(
                "Results shuffled.",
                "🔀"
            );

        }
    );

}


// ---------- COPY FILTERED ----------

const copyAllBtn =
    document.getElementById(
        "copyAllBtn"
    );


if(copyAllBtn){

    copyAllBtn.addEventListener(
        "click",
        async function(){

            if(!visibleResults.length){

                showToast(
                    "No results to copy.",
                    "!"
                );

                return;

            }


            try{

                await navigator.clipboard.writeText(
                    visibleResults.join("\n")
                );


                showToast(
                    `${visibleResults.length} usernames copied.`,
                    "📋"
                );

            }

            catch{

                showToast(
                    "Copy failed.",
                    "!"
                );

            }

        }
    );

}


// ---------- COPY ALL ----------

const copyEverythingBtn =
    document.getElementById("copyEverythingBtn");


if(copyEverythingBtn){

    copyEverythingBtn.addEventListener(
        "click",
        function(){

            if(!allResults || allResults.length === 0){

                showToast(
                    "No results to copy.",
                    "!"
                );

                return;

            }


            const textToCopy =
                allResults.join("\n");


            // Try modern clipboard first

            if(
                navigator.clipboard &&
                window.isSecureContext
            ){

                navigator.clipboard.writeText(
                    textToCopy
                )
                .then(function(){

                    showToast(
                        `${allResults.length} usernames copied.`,
                        "📋"
                    );

                })
                .catch(function(){

                    fallbackCopy(
                        textToCopy
                    );

                });

            }

            else{

                fallbackCopy(
                    textToCopy
                );

            }

        }
    );

}


// ---------- COPY FALLBACK ----------

function fallbackCopy(text){

    const textarea =
        document.createElement("textarea");


    textarea.value = text;


    textarea.style.position =
        "fixed";

    textarea.style.left =
        "-9999px";

    textarea.style.top =
        "0";

    textarea.style.width =
        "1px";

    textarea.style.height =
        "1px";


    document.body.appendChild(
        textarea
    );


    textarea.focus();

    textarea.select();

    textarea.setSelectionRange(
        0,
        textarea.value.length
    );


    let success = false;


    try{

        success =
            document.execCommand(
                "copy"
            );

    }

    catch(error){

        console.error(
            "Fallback copy error:",
            error
        );

    }


    document.body.removeChild(
        textarea
    );


    if(success){

        showToast(
            `${allResults.length} usernames copied.`,
            "📋"
        );

    }

    else{

        showToast(
            "Copy failed. Please try again.",
            "!"
        );

    }

}


// ---------- DOWNLOAD ----------

const downloadBtn =
    document.getElementById(
        "downloadBtn"
    );


if(downloadBtn){

    downloadBtn.addEventListener(
        "click",
        function(){

            if(!visibleResults.length){

                showToast(
                    "No results to download.",
                    "!"
                );

                return;

            }


            const content =
                visibleResults.join("\n");


            const blob =
                new Blob(
                    [content],
                    {
                        type:
                        "text/plain"
                    }
                );


            const url =
                URL.createObjectURL(
                    blob
                );


            const link =
                document.createElement(
                    "a"
                );


            link.href = url;

            link.download =
                "username-results.txt";


            link.click();


            URL.revokeObjectURL(url);


            showToast(
                "Results downloaded.",
                "⬇️"
            );

        }
    );

}


// ---------- CLEAR RESULTS ----------

const clearResultsBtn =
    document.getElementById(
        "clearResultsBtn"
    );


if(clearResultsBtn){

    clearResultsBtn.addEventListener(
        "click",
        function(){

            allResults = [];

            visibleResults = [];


            sessionStorage.removeItem(
                "currentResults"
            );


            renderResults();

            updateStatistics();


            showToast(
                "Current results cleared.",
                "🗑️"
            );

        }
    );

}


// ---------- HISTORY ----------

function getHistory(){

    return JSON.parse(
        localStorage.getItem(
            "usernameHistory"
        ) || "[]"
    );

}


function renderHistory(){

    const historyList =
        document.getElementById(
            "historyList"
        );


    const history =
        getHistory();


    historyList.innerHTML = "";


    if(!history.length){

        historyList.innerHTML =
            `
            <div class="empty-history">
                No generation history yet.
            </div>
            `;

        return;

    }


    history.forEach(
        (item,index) => {

            const box =
                document.createElement(
                    "div"
                );


            box.className =
                "history-item";


            const info =
                document.createElement(
                    "div"
                );


            const title =
                document.createElement(
                    "strong"
                );


            title.textContent =
                `${item.results.length} usernames`;


            const date =
                document.createElement(
                    "small"
                );


            date.textContent =
                item.created || "Unknown time";


            info.appendChild(title);

            info.appendChild(date);


            const loadBtn =
                document.createElement(
                    "button"
                );


            loadBtn.className =
                "history-load";


            loadBtn.textContent =
                "Load";


            loadBtn.addEventListener(
                "click",
                function(){

                    loadHistory(
                        index
                    );

                }
            );


            box.appendChild(info);

            box.appendChild(loadBtn);


            historyList.appendChild(box);

        }
    );

}


// ---------- LOAD HISTORY ----------

function loadHistory(index){

    const history =
        getHistory();


    const item =
        history[index];


    if(!item) return;


    generation = item;


    allResults =
        [...item.results];


    visibleResults =
        [...allResults];


    favoritesOnly = false;


    if(favoriteFilter){

        favoriteFilter.classList.remove(
            "active"
        );

    }


    sessionStorage.setItem(
        "currentResults",
        JSON.stringify(item)
    );


    if(searchInput){

        searchInput.value = "";

    }


    renderResults();

    updateStatistics();


    showToast(
        "Previous results loaded.",
        "🔄"
    );

}


// ---------- CLEAR HISTORY ----------

const clearHistoryBtn =
    document.getElementById(
        "clearHistoryBtn"
    );


if(clearHistoryBtn){

    clearHistoryBtn.addEventListener(
        "click",
        function(){

            localStorage.removeItem(
                "usernameHistory"
            );


            renderHistory();


            showToast(
                "History cleared.",
                "🗑️"
            );

        }
    );

}


// ---------- STATISTICS ----------

function updateStatistics(){

    const count =
        document.getElementById(
            "resultCount"
        );


    const favoriteCount =
        document.getElementById(
            "pageFavoriteCount"
        );


    const average =
        document.getElementById(
            "averageLength"
        );


    if(count){

        count.textContent =
            allResults.length;

    }


    if(favoriteCount){

        favoriteCount.textContent =
            favorites.length;

    }


    if(average){

        if(!allResults.length){

            average.textContent =
                "0";

        }

        else{

            const total =
                allResults.reduce(
                    (
                        sum,
                        username
                    ) =>
                        sum +
                        username.length,
                    0
                );


            average.textContent =
                (
                    total /
                    allResults.length
                ).toFixed(1);

        }

    }


    const info =
        document.getElementById(
            "resultInfo"
        );


    if(info && generation){

        const name =
            generation.info?.name ||
            "";


        const rank =
            generation.info?.rank ||
            "";


        if(name || rank){

            info.textContent =
                `Generated for ${
                    rank
                } ${
                    name
                } • ${
                    allResults.length
                } usernames`;

        }

    }

}


// ---------- BACK ----------

const backBtn =
    document.getElementById(
        "backBtn"
    );


if(backBtn){

    backBtn.addEventListener(
        "click",
        function(){

            window.location.href =
                "index.html";

        }
    );

}


// ---------- INITIAL LOAD ----------

renderResults();

updateStatistics();

renderHistory();