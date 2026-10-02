// ========================================
// USERNAME PRO - MAIN APP
// ========================================


// ---------- THEME ----------

const themeBtn = document.getElementById("themeBtn");


function loadTheme(){

    const theme =
        localStorage.getItem("usernameTheme");

    if(theme === "light"){

        document.body.classList.add("light");

        if(themeBtn){
            themeBtn.textContent = "☀️";
        }

    }

}


function toggleTheme(){

    document.body.classList.toggle("light");

    const isLight =
        document.body.classList.contains("light");

    localStorage.setItem(
        "usernameTheme",
        isLight ? "light" : "dark"
    );

    if(themeBtn){

        themeBtn.textContent =
            isLight ? "☀️" : "🌙";

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


function showToast(message, icon = "✓"){

    const toast =
        document.getElementById("toast");

    if(!toast) return;


    const messageBox =
        document.getElementById("toastMessage");

    const iconBox =
        document.getElementById("toastIcon");


    messageBox.textContent = message;

    iconBox.textContent = icon;


    toast.classList.add("show");


    clearTimeout(toastTimer);


    toastTimer = setTimeout(() => {

        toast.classList.remove("show");

    }, 2500);

}


// ---------- FEATURE MODAL ----------

// ========================================
// FAST / SMART / PRIVATE
// ========================================

function runFeature(type) {

    // ⚡ FAST
    if (type === "fast") {

        const generateBtn =
            document.getElementById("generateBtn");

        if (generateBtn) {
            generateBtn.click();
        }

        return;
    }


    // ✨ SMART
    if (type === "smart") {

        const format =
            document.getElementById("format");

        if (format) {
            format.value = "all";
        }

        const generateBtn =
            document.getElementById("generateBtn");

        if (generateBtn) {
            generateBtn.click();
        }

        return;
    }


    // 🔒 PRIVATE
    if (type === "private") {

        showToast(
            "Private Mode: Everything runs locally in your browser.",
            "🔒"
        );

        return;
    }
}


function closeFeature(event){

    const modal =
        document.getElementById("featureModal");


    if(
        event &&
        event.target !== modal
    ){

        return;

    }


    modal.classList.remove("show");

}


document.addEventListener(
    "keydown",
    function(event){

        if(event.key === "Escape"){

            const modal =
                document.getElementById("featureModal");

            if(modal){

                modal.classList.remove("show");

            }

        }

    }
);


// ---------- HELPERS ----------

function clean(value){

    return value
        .trim()
        .replace(/\s+/g, "");

}


function capitalize(value){

    if(!value) return "";

    return value.charAt(0).toUpperCase()
        + value.slice(1).toLowerCase();

}


// ---------- GENERATOR ----------

function generateUsernames(){

    const rank =
        clean(
            document.getElementById("rank").value
        );


    const name =
        clean(
            document.getElementById("name").value
        );


    const symbols =
        document.getElementById("symbols")
            .value || "_-.";


    const numbers =
        document.getElementById("numbers")
            .value || "1234567890";


    const maxLength =
        Number(
            document.getElementById("length").value
        );


    const numberMode =
        document.getElementById("numberMode").value;


    const format =
        document.getElementById("format").value;

    const usernameStyle =
    document.getElementById("usernameStyle").value;

    const limit =
        Number(
            document.getElementById("resultLimit").value
        );


    if(!rank && !name){

        showToast(
            "Enter a name or prefix first.",
            "!"
        );

        return;

    }


    const resultSet = new Set();


    const symbolList =
        [...symbols];


    const numberList =
        [...numbers];


    function addFormatted(value){

        if(!value) return;


        let variants = [];


        if(format === "lower"){

            variants = [
                value.toLowerCase()
            ];

        }

        else if(format === "upper"){

            variants = [
                value.toUpperCase()
            ];

        }

        else if(format === "capital"){

            variants = [
                capitalize(value)
            ];

        }

        else{

            variants = [

                value,

                value.toLowerCase(),

                value.toUpperCase(),

                capitalize(value)

            ];

        }


        variants.forEach(item => {

            if(
                !maxLength ||
                item.length <= maxLength
            ){

                resultSet.add(item);

            }

        });

    }


    function addWithNumbers(base){

        if(numberMode === "none"){

            addFormatted(base);

        }


        if(numberMode === "end"){

            numberList.forEach(number => {

                addFormatted(
                    base + number
                );

            });

        }


        if(numberMode === "start"){

            numberList.forEach(number => {

                addFormatted(
                    number + base
                );

            });

        }


        if(numberMode === "both"){

            numberList.forEach(first => {

                numberList.forEach(last => {

                    addFormatted(
                        first +
                        base +
                        last
                    );

                });

            });

        }

    }


    const bases = [];


    if(rank && name){

        bases.push(

            rank + name,

            name + rank

        );

    }


    if(name){

        bases.push(name);

    }


    if(rank){

        bases.push(rank);

    }


    bases.forEach(base => {

        addWithNumbers(base);


        symbolList.forEach(symbol => {

            addWithNumbers(
                base + symbol
            );


            addWithNumbers(
                symbol + base
            );

        });

    });


    if(rank && name){

        symbolList.forEach(symbol => {

            addWithNumbers(
                rank + symbol + name
            );

            addWithNumbers(
                name + symbol + rank
            );

        });

    }


    const results =
        [...resultSet]
            .sort(() => Math.random() - 0.5)
            .slice(0, limit);


    if(!results.length){

        showToast(
            "No usernames generated.",
            "!"
        );

        return;

    }


    const generation = {

        id: Date.now(),

        results: results,

        created:
            new Date().toLocaleString(),

        info: {

            rank: rank,

            name: name,

            numberMode: numberMode,

            format: format,

            style: usernameStyle,

            limit: limit

        }

    };


    sessionStorage.setItem(
        "currentResults",
        JSON.stringify(generation)
    );


    // ---------- HISTORY ----------

    let history =
        JSON.parse(
            localStorage.getItem(
                "usernameHistory"
            ) || "[]"
        );


    history.unshift(generation);


    if(history.length > 10){

        history =
            history.slice(0, 10);

    }


    localStorage.setItem(
        "usernameHistory",
        JSON.stringify(history)
    );


    // ---------- TOTAL STATISTICS ----------

    const oldTotal =
        Number(
            localStorage.getItem(
                "totalGenerated"
            ) || 0
        );


    localStorage.setItem(
        "totalGenerated",
        oldTotal + results.length
    );


    window.location.href =
        "results.html";

}


// ---------- GENERATE ----------

const generateBtn =
    document.getElementById("generateBtn");


if(generateBtn){

    generateBtn.addEventListener(
        "click",
        generateUsernames
    );

}


// ---------- RANDOMIZE ----------

const randomBtn =
    document.getElementById("randomBtn");


if(randomBtn){

    randomBtn.addEventListener(
        "click",
        function(){

            const prefixes = [

                "King",
                "Pro",
                "Mr",
                "The",
                "Its",
                "Real",
                "Official",
                "Dark",
                "Cool",
                "Neo"

            ];


            const names = [

                "Fahim",
                "Shadow",
                "Nova",
                "Tiger",
                "Rider",
                "Hunter",
                "Legend",
                "Storm",
                "Ghost",
                "Hero"

            ];


            const randomPrefix =
                prefixes[
                    Math.floor(
                        Math.random() *
                        prefixes.length
                    )
                ];


            const randomName =
                names[
                    Math.floor(
                        Math.random() *
                        names.length
                    )
                ];


            document.getElementById("rank")
                .value = randomPrefix;


            document.getElementById("name")
                .value = randomName;


            showToast(
                "Random values added.",
                "🎲"
            );

        }
    );

}


// ---------- CLEAR ----------

const clearBtn =
    document.getElementById("clearBtn");


if(clearBtn){

    clearBtn.addEventListener(
        "click",
        function(){

            document.getElementById("rank")
                .value = "";

            document.getElementById("name")
                .value = "";

            document.getElementById("symbols")
                .value = "_-.";

            document.getElementById("numbers")
                .value = "1234567890";


            showToast(
                "Form cleared.",
                "🧹"
            );

        }
    );

}


// ---------- DASHBOARD ----------

function updateDashboard(){

    const total =
        Number(
            localStorage.getItem(
                "totalGenerated"
            ) || 0
        );


    const favorites =
        JSON.parse(
            localStorage.getItem(
                "usernameFavorites"
            ) || "[]"
        );


    const history =
        JSON.parse(
            localStorage.getItem(
                "usernameHistory"
            ) || "[]"
        );


    const totalElement =
        document.getElementById(
            "totalGenerated"
        );


    const favoriteElement =
        document.getElementById(
            "favoriteCount"
        );


    const historyElement =
        document.getElementById(
            "historyCount"
        );


    if(totalElement){

        totalElement.textContent =
            total;

    }


    if(favoriteElement){

        favoriteElement.textContent =
            favorites.length;

    }


    if(historyElement){

        historyElement.textContent =
            history.length;

    }

}


updateDashboard();


// ---------- ENTER KEY ----------

document.addEventListener(
    "keydown",
    function(event){

        if(
            event.key === "Enter" &&
            document.activeElement.tagName !== "SELECT"
        ){

            const nameInput =
                document.getElementById("name");


            if(
                document.activeElement ===
                nameInput
            ){

                generateUsernames();

            }

        }

    }
);

// ---------- USERNAME PREVIEW ----------

const nameInput =
    document.getElementById("name");

const rankInput =
    document.getElementById("rank");

const styleSelect =
    document.getElementById("usernameStyle");

const previewUsername =
    document.getElementById("previewUsername");


function updateUsernamePreview(){

    if(!previewUsername) return;

    let name =
        nameInput ? nameInput.value.trim() : "";

    let rank =
        rankInput ? rankInput.value.trim() : "";

    let style =
        styleSelect ? styleSelect.value : "classic";


    if(!name && !rank){

        previewUsername.textContent =
            "YourUsername";

        return;

    }


    let username =
        rank + name;


    if(style === "gaming"){

        username =
            "x" + username + "X";

    }

    else if(style === "minimal"){

        username =
            name || rank;

    }

    else if(style === "cool"){

        username =
            "The" + username;

    }

    else if(style === "pro"){

        username =
            "Pro" + username;

    }


    previewUsername.textContent =
        username;

}


if(nameInput){

    nameInput.addEventListener(
        "input",
        updateUsernamePreview
    );

}


if(rankInput){

    rankInput.addEventListener(
        "input",
        updateUsernamePreview
    );

}


if(styleSelect){

    styleSelect.addEventListener(
        "change",
        updateUsernamePreview
    );

}


updateUsernamePreview();