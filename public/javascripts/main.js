// function to set a given theme/color-scheme
function setTheme(themeName) {
    localStorage.setItem('theme', themeName);
    document.documentElement.className = themeName;
}

// function to toggle between light and dark theme
function toggleTheme() {
    if (localStorage.getItem('theme') === 'theme-dark') {
        setTheme('theme-light');
    } else {
        setTheme('theme-dark');
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

function add_fields() {
    document.getElementById('wrapper').innerHTML += '<br><span>Field:<input type="text" id="field" name="field"/> Data:<input type="text" id="data" name="data"></span>\r\n';
}
function countFields() {
    console.log(document.getElementById("count").value=document.querySelectorAll('[id^=field]').length)

}
function fun () {

    var x = document.getElementById(`newProject`);
    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
}
function showFileForm () {

    var x = document.getElementById(`newFile`);
    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
}
function showReturnForm () {

    var x = document.getElementById(`newReturn`);
    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
}

