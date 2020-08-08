

// function to set a given theme/color-scheme
function setTheme(themeName) {
    localStorage.setItem('theme', themeName);
    document.documentElement.className = themeName;

}
function setFont(fontName) {
    localStorage.setItem('font', fontName);
    document.documentElement.className = fontName;
}

// function to toggle between light and dark theme
function toggleTheme() {
    if (localStorage.getItem('theme') === 'theme-dark') {
        setTheme('theme-light');
    } else {
        setTheme('theme-dark');
    }

}

function toggleFont() {
    if (localStorage.getItem('font') === 'font-sans') {
        setFont('font-mono');
    } else {
        setFont('font-sans');
    }

}
function setSans() {
    if (localStorage.getItem('font') === 'font-mono') {
        setFont('font-sans');
    }
    else {
        setFont('font-sans');
    }

}
function setMono() {
    if (localStorage.getItem('font') === 'font-sans') {
        setFont('font-mono');
    }
    else {
        setFont('font-mono');
    }

}


// Immediately invoked function to set the theme on initial load
(function () {
    if (localStorage.getItem('theme') === 'theme-dark') {
        setTheme('theme-dark');
        document.getElementById('slider').checked = false;
    } else {
        setTheme('theme-light');
        document.getElementById('slider').checked = true;
    }
})();


(function () {
    if (localStorage.getItem('font') === 'font-sans') {
        setFont('font-sans');
        document.getElementById('font-slider').checked = false
    } else {
        setFont('font-mono');
        document.getElementById('font-slider').checked = true
    }
})();


function add_fields() {
    document.getElementById('wrapper').innerHTML += '<br><span>Field:<input type="text" id="field" name="field"/> Data:<input type="text" id="data" name="data"></span>\r\n';
}
function countFields() {
    console.log(document.getElementById("count").value=document.querySelectorAll('[id^=field]').length)

}

