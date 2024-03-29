var navigation = document.querySelector(".navigation");
var screens = document.querySelectorAll(".section")

var socialInfo = document.querySelector(".social-info");
var workDuration = document.querySelector(".workDuration");
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
var loader = document.querySelector(".loader");
var currentScreen = 0;
var iniPos = 0;
var a;

workDuration.textContent = getDuration1((new Date() - new Date('2020/09/23')) / (1000 * 60 * 60 * 24 * 30))


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

onscroll = () => getCurrentScreen();
        
visualViewport.onresize = () => {
    screens[currentScreen].style.height = `${visualViewport.height}px`;
}

socialInfo.onclick = event => {
    a = event.target;

    if((visualViewport.width < 768) && (event.target.tagName === "SPAN")) {
    
        if(event.target.nextElementSibling.className === "visible") {
            event.target.nextElementSibling.classList.remove("visible");
        } else {
            for(var i = 0; i < event.target.closest('.social-info').children.length; i++){
                event.target.closest('.social-info').children[i].children[1].classList.remove("visible");
            }
            
            document.documentElement.style.setProperty('--left', `-${event.target.nextElementSibling.offsetWidth + 1}px`);
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

function getCurrentScreen() {
    if(Math.floor(scrollY / (screens[0].offsetTop + (visualViewport.height*0.7))) < navigation.children.length) {
        currentScreen = Math.floor(scrollY / (screens[0].offsetTop + (visualViewport.height*0.7)));
    }
    
    for(var i = 0; i < navigation.children.length; i++ ) {
        navigation.children[i].classList.remove("active");
    }
    navigation.children[currentScreen].classList.add("active");
    
    screens[currentScreen].style.height = `${visualViewport.height}px`;
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
    

    ajax.open('POST', 'https://sk-api-64qq.onrender.com/api/add-data', true);
    ajax.setRequestHeader('Content-Type', 'application/json');
    
    ajax.send(JSON.stringify({
        key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhU291cmNlIjoie1wic291cmNlXCI6XCJodHRwczovL3Nrc2luZ2hjb2Rlcy5naXRodWIuaW8vXCIsXCJoZWFkaW5nc1wiOltcImZ1bGxfbmFtZVwiLFwiZW1haWxfYWRkcmVzc1wiLFwibWVzc2FnZVwiXSxcIl9pZFwiOlwiNjQwYjlmNTc3NzgzNDMzODQ1OTkyMmVmXCIsXCJ1c2VySWRcIjpcIjY0MDVjYzBiOWI5YmNhYWYxMzRmNzBiY1wifSIsImlhdCI6MTY3ODQ4MzI4N30.ZtDpun_4NHybK-4KgF-4o1jr8hsgPVf1NjaTxZpdUZg',
        data: formData,
    }));

    loader.style.display = 'block';

    ajax.onload = function () {
    let result;
    
        if(ajax.readyState == 4 && ajax.status == 200){
            result = JSON.parse(ajax.responseText);		
            
            if(result.success){
                requestStatusBox.classList.add("response-came", 'success');
            } else {
                requestStatusBox.classList.add("response-came", 'failure');
            }
            
        
            setTimeout(() => {
                requestStatusBox.classList.remove("response-came");
            }, 2000);

            setTimeout(() => {
                requestStatusBox.classList.remove(result.message);
            }, 2500);

            loader.style.display = 'none';
        } else {
            result = "failure";
            loader.style.display = 'none';
        }
    }
}

function getDuration1(durInMonths){
    let returnString = '';

    if(durInMonths >= 12) {
        let yearsString = `${Math.floor(durInMonths / 12)} ${Math.floor(durInMonths / 12) < 2 ? 'Year' : 'Years'}`;
        returnString += yearsString
    }

    if(durInMonths % 12 >= 1) {
        returnString += `${returnString ? ' and ' : ''}${Math.floor(durInMonths % 12)} ${Math.floor(durInMonths % 12) < 2 ? 'Month' : 'Months'}`;
    }
    
    return returnString;
}

document.documentElement.style.setProperty('--vh', `${visualViewport.height}px`);
document.documentElement.style.setProperty('--mh', `${visualViewport.height}px`);
