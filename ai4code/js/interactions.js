var theme;

document.documentElement.setAttribute("data-theme", "light");
document.getElementById("highlight_css").href = "//cdnjs.cloudflare.com/ajax/libs/highlight.js/11.5.1/styles/base16/humanoid-light.min.css";

document.getElementById("color_theme_toggle").addEventListener("change", (event) => {
    if (document.getElementById("color_theme_toggle").checked == true) {
        theme = "dark"
        document.getElementById("highlight_css").href = "//cdnjs.cloudflare.com/ajax/libs/highlight.js/11.5.1/styles/base16/humanoid-dark.min.css";
    } else {
        theme = "light";
        document.getElementById("highlight_css").href = "//cdnjs.cloudflare.com/ajax/libs/highlight.js/11.5.1/styles/base16/humanoid-light.min.css";
    }
    document.documentElement.setAttribute("data-theme", theme);
    
});

function openFullscreen() {

    document.getElementById("openFull").style.display = "none";
    document.getElementById("unFull").style.display = "flex";

    if (document.body.requestFullscreen) {
        document.body.requestFullscreen();
    } else if (document.body.webkitRequestFullscreen) {
        /* Safari */
        document.body.webkitRequestFullscreen();
    } else if (document.body.msRequestFullscreen) {
        /* IE11 */
        document.body.msRequestFullscreen();
    }
}

function undoFullscreen() {

    document.getElementById("unFull").style.display = "none";
    document.getElementById("openFull").style.display = "flex";

    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
        /* Safari */
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
        /* IE11 */
        document.msExitFullscreen();
    }
}


$(".split_screen button").on('click', function () {
    $(".split_screen button.active").removeClass("active");
    $(this).addClass("active");

    if (this.value == "split") {
        $(".vis").width("calc(50% - 1px)");
    } else {
        $(".vis").width("6px");
        $("#" + this.value).width("calc(100% - 10px)");
    }

    rescale_window();
});

//function walkthrough() {
//
//    //remove all previously shown walkthrough
//    document.querySelectorAll(".show_walkthrough").forEach(function (n) {
//        n.classList.remove("show_walkthrough");
//    })
//
//    if (w_step >= w_step_max) {
//        document.getElementById("walkthrough").style.display = "none";
//        document.getElementById("rewalkthrough").style.display = "block";
//        document.getElementById("continuewalkthrough").style.display = "none";
//        w_step = 1;
//
//    } else {
//        document.getElementById("walkthrough").style.display = "flex";
//        document.getElementById("rewalkthrough").style.display = "none";
//        document.getElementById("continuewalkthrough").style.display = "inline-block";
//        document.querySelector("#walkthrough_" + w_step).classList.add("show_walkthrough");
//        w_step++;
//
//        if (w_step == w_step_max) {
//            document.getElementById("continuewalkthrough").innerHTML = "explore dashboard";
//        } else {
//            document.getElementById("continuewalkthrough").innerHTML = "next";
//        }
//    };
//}
//
//document.onclick = function () {
//    _idleSecondsCounter = 0;
//};
//document.onmousemove = function () {
//    _idleSecondsCounter = 0;
//};
//document.onkeypress = function () {
//    _idleSecondsCounter = 0;
//};
//
//window.setInterval(CheckIdleTime, 60000); //check idle time per minute
//
//function CheckIdleTime() {
//    _idleSecondsCounter++;
//    if (_idleSecondsCounter >= IDLE_TIMEOUT) {
//        console.log("UI restarted")
//        w_step = 1;
//        walkthrough();
//    }
//}
//
//walkthrough();

compute();
