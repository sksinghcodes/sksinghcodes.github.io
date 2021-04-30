var navigation = document.querySelector(".navigation");
var screens = document.querySelectorAll(".section")
var socialInfo = document.querySelector(".social-info");
var workList = document.querySelector(".work-list");
var scrollThumb = document.querySelector(".scroll-thumb");
var shadowLeft = document.querySelector(".shadow-left");
var shadowRight = document.querySelector(".shadow-right");
var contactForm = document.querySelector(".contact-form form");
var requestStatusBox = document.querySelector(".request-status-box");
var shadowInitWidth = shadowRight.offsetWidth;
var scrollBarInner = scrollThumb.parentElement;
var scrollBar = scrollThumb.parentElement.parentElement;
var scrollThumbWidth = Math.floor((workList.offsetWidth * (scrollBar.offsetWidth - 3))/workList.scrollWidth);
var scrollPercent = (workList.scrollLeft / (workList.scrollWidth - workList.offsetWidth)) * 100;
var mouseDownOnThumb = false;
var mouseOverWorkList = false;
var currentScreen = 0;
var iniPos = 0;
var a;

scrollBar.style.paddingLeft = scrollThumbWidth + 1;
scrollThumb.style.width = scrollThumbWidth;
document.documentElement.style.setProperty('--vh', `${visualViewport.height}px`);
document.documentElement.style.setProperty('--mh', `${visualViewport.height}px`);

// events
navigation.onclick = event => {
	if(event.target.classList.contains("nav-button")) {
		var nthMenu = isNthChild(event.target)

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

workList.onwheel = event => {	
    if(event.deltaY > 0) { workList.scrollBy(400, 0); }
	else if(event.deltaY < 0) { workList.scrollBy(-400, 0) }
	scrollPercent = (workList.scrollLeft / (workList.scrollWidth - workList.offsetWidth)) * 100;
	return false;
}



workList.onscroll = event => {
	if(!mouseDownOnThumb && mouseOverWorkList) {
		scrollBarInner.style.width = String((workList.scrollLeft / (workList.scrollWidth - workList.offsetWidth)) * 100) + "%";
	}
	
	if (workList.scrollLeft < shadowInitWidth) {
		shadowLeft.style.width = workList.scrollLeft;
	}
	
	if ((workList.scrollWidth - workList.offsetWidth) - workList.scrollLeft < shadowInitWidth) {
		shadowRight.style.width = (workList.scrollWidth - workList.offsetWidth) - workList.scrollLeft;
	}
}

// workList.onwheel = event => {
//     if(event.deltaY > 0 && per >= 0 && per < 100) {
//         per++;
        
//     } else if(event.deltaY < 0 && per <= 100 && per > 0) {
//         per--;
//     }
//     console.log(per);
//     return false;
// }



onmousemove = event => {
    if(mouseDownOnThumb) {
        scrollBarInner.style.width = scrollBarInner.offsetWidth + event.movementX;
		if(scrollBarInner.offsetWidth + event.movementX < 0) {
			scrollBarInner.style.width = 0
		}
		workList.scrollLeft = ((scrollBarInner.offsetWidth + event.movementX) * (workList.scrollWidth - workList.offsetWidth)) /(scrollBar.offsetWidth - 2 - scrollThumbWidth)
    }
}

scrollThumb.onmousedown = event => {
	workList.style.scrollBehavior = "unset"
    mouseDownOnThumb = true;
	iniPos = event.screenX;
}

onmouseup = () => {
	workList.style.scrollBehavior = "smooth"
    mouseDownOnThumb = false;
}

workList.onmouseenter = () => {
	mouseOverWorkList = true;
}

workList.onmouseleave = () => {
	mouseOverWorkList = false;
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
    

    ajax.open('POST', 'https://backend-sksinghcodes.vercel.app/', true);
    ajax.setRequestHeader('Content-Type', 'application/json');

    ajax.send(JSON.stringify(formData));

    ajax.onload = function () {
		let result;
		
		console.log(ajax.readyState);
		console.log(ajax.status);
	
		
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
			console.log("a");
		}
    }
}
