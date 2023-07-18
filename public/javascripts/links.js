const ytbtn = document.getElementById('yt');
const fbbtn = document.getElementById('fb');
const xbtn = document.getElementById('exit');
const burger = document.getElementById('burger');
const mobilemenu = document.getElementsByClassName('mobile-menu')[0];
const email_input = document.getElementById('email_input');
const submit_button = document.getElementById('submit_button');
const circle_loader = document.getElementsByClassName('circle-loader')[0];
const checkmark = document.getElementsByClassName('checkmark')[0];

const isEmail = (email) => {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
}


ytbtn.addEventListener('click', () => {
    window.open('https://www.youtube.com/@StMargaretsChurch-Chicago')
});

fbbtn.addEventListener('click', () => {
    window.open('https://www.facebook.com/p/St-Margarets-Episcopal-Church-100064668490475/')
});

xbtn.addEventListener('click', () => {
    mobilemenu.classList.remove('animate-open')
    mobilemenu.classList.add('animate-close')
});

burger.addEventListener('click', () => {
    mobilemenu.classList.remove('close')
    mobilemenu.classList.add('open')
    mobilemenu.classList.remove('animate-close')
    mobilemenu.classList.add('animate-open')
});

submit_button.addEventListener('click', () => {
    const clientStatus = document.getElementsByClassName('reg-status')[0];
    clientStatus.classList.remove('reg-active');
    circle_loader.classList.add('cl-hidden');
    circle_loader.classList.remove('cl-active');
    checkmark.style.display = 'none';
    circle_loader.classList.remove('load-complete');



    if (!isEmail(email_input.value)) {
        clientStatus.textContent = "Please enter a valid email";
        clientStatus.classList.add("reg-active");
    } else {

        const options = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                "email": email_input.value
            })

        };

        fetch("https://cloakapi.herokuapp.com/smecemail", options)
            .then((res) => {
                if (!res.ok) {
                    clientStatus.textContent = "Error registering email, try again later.";
                    clientStatus.style.color = "red"
                    clientStatus.classList.add("reg-active");
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                return res.json();
            })
            .then((data) => {
                console.log(data.status)
                if (data.status === "Already Registered") {
                    clientStatus.textContent = "This emaill is already registered.";
                    clientStatus.style.color = "red"
                    clientStatus.classList.add("reg-active");
                } else {
                    circle_loader.classList.remove('cl-hidden')
                    circle_loader.classList.add('cl-active')
                    setTimeout(() => {
                        circle_loader.classList.add('load-complete')
                        checkmark.style.display = 'block';
                    }, 500);

                    clientStatus.textContent = "Registration Successful";
                    clientStatus.style.color = "green"
                    clientStatus.classList.add("reg-active");

                }
            }).catch((err) => {
                clientStatus.textContent = "Error registering email, try again later.";
                clientStatus.style.color = "red"
                clientStatus.classList.add("reg-active");
                console.log(err);
            })
    }
});


