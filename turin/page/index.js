function createChar (text, type) {
    let chat = document.createElement('div'),
        img = document.createElement('img'),
        span = document.createElement('span'),
        content = document.getElementsByClassName("content")[0];
    // 1=>myChat 0=>robChat
    if (type === 1) {
        img.src = './dog.gif';
        img.style.cssFloat = "right";
        img.style.width = 35 + "px";
        img.style.height = 35 + "px";
        img.style.marginRight = 10 + "px";
        img.style.marginLeft = 5 + 'px';
        chat.classList.add('myChar');
    } else {
        img.src = './cat.jpg';
        img.style.cssFloat = "left";
        img.style.width = 35 + "px";
        img.style.height = 35 + "px";
        img.style.marginRight = 10 + "px";
        img.style.marginLeft = 10 + 'px';
        chat.classList.add('robChar');
    }

    span.innerHTML = text;
    chat.appendChild(img);
    chat.appendChild(span);
    content.appendChild(chat);
    document.getElementsByClassName("content-wrapper")[0].scrollTo(0, content.offsetHeight);
}

function send() {
    let inpValue = document.getElementsByClassName("footer-inp")[0].value;
    if (inpValue == null || inpValue == '') {
        return;
    }
    createChar(inpValue, 1);

    // var data = {
    //     "reqType":0,
    //     "perception": {
    //         "inputText": {
    //             "text": inpValue
    //         }
    //     },
    //     "userInfo": {
    //         "apiKey": "e6b92f5b72094f418be1cd8a53323267",
    //         "userId": "123456"
    //     }
    // };

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                createChar(xhr.responseText, 0);
            }
        }
    };

    // http://openapi.tuling123.com/openapi/api/v2
    xhr.open('GET', '/api/chat?text=' + inpValue, true);
    xhr.send();
    document.getElementsByClassName("footer-inp")[0].value = '';
}

document.addEventListener('keydown', function (e) {
    if (e.keyCode === 13) {
        send();
    }
}, false);

