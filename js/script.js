console.log(env.THIS_IS_SECRET);
const init = () => {
    var navigation = document.querySelector(".navigation");
    var screens = document.querySelectorAll(".section")

    var socialInfo = document.querySelector(".social-info");

    var workList = document.querySelector(".work-list");
    var scrollThumb = document.querySelector(".scroll-thumb");
    var scrollBar = document.querySelector(".scroll-bar");
    var workListScrollMax;
    var scrollThumbLeftMax;
    var mouseDownOnScrollThumb = false;

    var shadowLeft = document.querySelector(".shadow-left");
    var shadowRight = document.querySelector(".shadow-right");
    var contactForm = document.querySelector(".contact-form form");
    var requestStatusBox = document.querySelector(".request-status-box");
    var currentScreen = 0;
    var iniPos = 0;
    var a;

    scrollThumb.style.width = (scrollBar.scrollWidth - 4) / (workList.scrollWidth / workList.offsetWidth)
    scrollThumbLeftMax = scrollBar.scrollWidth - 4 - scrollThumb.offsetWidth
    workListScrollMax = workList.scrollWidth - workList.offsetWidth

    workList.addEventListener('DOMContentLoaded', e => {
        console.log(e);
    });

    scrollThumb.onmousedown = () => {
        mouseDownOnScrollThumb = true;
        workList.style.scrollBehavior = 'unset';
    }
    document.onmouseup = () => {
        mouseDownOnScrollThumb = false;
        workList.style.scrollBehavior = 'smooth';
    }

    document.onmousemove = e => {
        if(mouseDownOnScrollThumb) {
            var leftValue = Number(getComputedStyle(scrollThumb).left.slice(0, -2)) + e.movementX;
            if(leftValue > 0 && leftValue < scrollThumbLeftMax) {
                scrollThumb.style.left = leftValue;
            } else if (leftValue < 0) { 
                scrollThumb.style.left = 0;
            } else if (leftValue > scrollThumbLeftMax) {
                scrollThumb.style.left = scrollThumbLeftMax;
            }
        }

        workList.scroll((Number(getComputedStyle(scrollThumb).left.slice(0, -2)) * workListScrollMax) / scrollThumbLeftMax, 0)
    }

    workList.onscroll = () => {
        scrollThumb.style.left = Math.ceil((workList.scrollLeft * scrollThumbLeftMax) / workListScrollMax);
    }

    // events
    navigation.onclick = event => {
        if(event.target.classList.contains("nav-button")
            || event.target.parentElement.classList.contains("nav-button")
        ) {
            var nthMenu;

            if(event.target.classList.contains("nav-button")) {
                nthMenu = isNthChild(event.target)
            } else if (event.target.parentElement.classList.contains("nav-button")) {
                nthMenu = isNthChild(event.target.parentElement)
            }

            scroll(0, screens[nthMenu].offsetTop)

            setTimeout(() => {
                screens[currentScreen].style.height = `${visualViewport.height}px`;
                scroll(0, screens[nthMenu].offsetTop)
            }, 500);
        }
    }

    onscroll = () => {
        if(Math.floor(scrollY / (screens[0].offsetTop + (visualViewport.height*0.7))) < navigation.children.length) {
            currentScreen = Math.floor(scrollY / (screens[0].offsetTop + (visualViewport.height*0.7)));
        }
        
        for(var i = 0; i < navigation.children.length; i++ ) {
            navigation.children[i].classList.remove("active");
        }
        navigation.children[currentScreen].classList.add("active");
        
        screens[currentScreen].style.height = `${visualViewport.height}px`;
    }
            
    visualViewport.onresize = () => {
        screens[currentScreen].style.height = `${visualViewport.height}px`;
    }

    socialInfo.onclick = event => {
        a = event.target;
        if((visualViewport.width < 768) && (event.target.tagName === "SPAN")) {
        
            if(event.target.nextElementSibling.className === "visible") {
                event.target.nextElementSibling.classList.remove("visible");
            } else {
                for(var i = 0; i < event.path[2].children.length; i++){
                    event.path[2].children[i].children[1].classList.remove("visible");
                }
                
                document.documentElement.style.setProperty('--left', "-" + event.target.nextElementSibling.offsetWidth - 1);
                event.target.nextElementSibling.className = "visible";
            }
        }
    }

    contactForm[2].oninput = () => {
        if(contactForm[2].value.length > contactForm[2].attributes["max-length"].value) {
            contactForm[2].value = contactForm[2].value.slice(0, Number(contactForm[2].attributes["max-length"].value));
        }
    }

    contactForm[3].onclick = () => {
        hideFormValidationErrors()
        validateForm();
        return false;
    }


    function isNthChild(el) {
        for(var i = 0; i < el.parentElement.children.length; i++){
            if(el.parentElement.children[i] === el) {
                return i;
            }
        }
    }

    function showFormValidationErrors(errorArray) {
        for (var i = 0; i < errorArray.length; i++) {
            if (errorArray[i] === 0) {
                contactForm[i].nextElementSibling.classList.add("show", "mb-00p");
            } else if (errorArray[i] === 1) {
                contactForm[i].nextElementSibling.classList.add("show", "mb-01p");
            }
        }
    }

    function hideFormValidationErrors() {
        for (var i = 0; i < contactForm.length - 1; i++){
            contactForm[i].nextElementSibling.classList.remove("show", "mb-00p", "mb-01p");
        }
    }

    function validateForm() {
        var a;
        var errorArray = [-1, -1, -1];
        
        for (var i = 0; i < contactForm.length - 1; i++) {
            if(contactForm[i].validity.valueMissing) {
                errorArray[i] = 0;
            } else if (!RegExp(contactForm[i].pattern).test(contactForm[i].value)) {
                errorArray[i] = 1;
            }
        }
        
        for (var i = 0; i < errorArray.length; i++) {
            if(errorArray[i] > -1) {
                showFormValidationErrors(errorArray);
                return false;
            }
        }
        
        sendData();
    }



    function sendData() {
        var formData = {};
        var ajax = new XMLHttpRequest();

        for (var i = 0; i < contactForm.length - 1; i++) {
            formData[contactForm[i].name] = contactForm[i].value
        }
        

        ajax.open('POST', 'https://afternoon-sea-14560.herokuapp.com/', true);
        ajax.setRequestHeader('Content-Type', 'application/json');
        
        ajax.send(JSON.stringify(formData));

        ajax.onload = function () {
        let result;
            
            if(ajax.readyState == 4 && ajax.status == 200){
                result = JSON.parse(ajax.responseText);		
                
                requestStatusBox.classList.add("response-came", result.message);
            
                setTimeout(() => {
                    requestStatusBox.classList.remove("response-came");
                }, 2000);

                setTimeout(() => {
                    requestStatusBox.classList.remove(result.message);
                }, 2500);

            } else {
                result = "failure";
            }
        }
    }
}

document.documentElement.style.setProperty('--vh', `${visualViewport.height}px`);
document.documentElement.style.setProperty('--mh', `${visualViewport.height}px`);
