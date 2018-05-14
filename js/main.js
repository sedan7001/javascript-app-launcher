// 변수 선언부
var wrapper = document.querySelector('.wrapper'),
    page = document.querySelectorAll('.page'),
    indicator = document.getElementById('indicator'),
    indicator_li = indicator.querySelectorAll('li'),
    addbtn = document.getElementById('save'),
    myForm = document.getElementById('myForm'),
close = document.querySelector('.close');


var yDeg = 0,
    indicator_num = 1,
    indicator_length = page.length,
    w = page[0].offsetWidth,
    page_angle = 0,
    page_vector = 0;

var hammer = new Hammer(wrapper);

// 페이지 초기화
function init_page() {
    w = page[0].offsetWidth;

    // 3D page 4면체 위치 정의
    for (var i = 0; i < page.length; i++) {
        page[i].style.transform = 'rotateY(' + page_angle + 'deg) translateZ(' + (w / 2) + 'px)';
        page_angle += 90;
    }

    // page wrapper 정면으로 초기화
    wrapper.style.transform = 'translateZ(' + (-w / 2) + 'px) rotateY(' + yDeg + 'deg)';
}

// 인디케이터 초기화
function init_indicator() {
    // 인디케이터 표시
    for (var i = 0; i < indicator_length; i++) {
        indicator.innerHTML += '<li>' + (i + 1) + '</li>';
    }

    indicator_li = indicator.querySelectorAll('li'); // 목록
    change_page(indicator_num);
}

// 페이지 전환
function change_page(inum) {
    // 현재 인디케이터 하이라이트 표시
    indicator_li[inum - 1].setAttribute('class', 'active');
    yDeg = -90 * (inum - 1);
    wrapper.style.transform = 'translateZ(' + (-w / 2) + 'px) rotateY(' + yDeg + 'deg)';

    // 인디케이터 표시
    for (var i = 0; i < indicator_li.length; i++) {
        indicator_li[i].removeAttribute('class');
    }
    indicator_li[inum - 1].setAttribute('class', 'active');
    var pageNum = document.querySelectorAll('.pageNum');
    console.log(pageNum);
    pageNum[indicator_num - 1].innerHTML = indicator_num;
}

/* ---------------------------------------------------------------- */
init_page();
init_indicator();


/* ------------------- 이벤트 리스너 ------------------------------ */
for (var i = 0; i < indicator_li.length; i++) {
    indicator_li[i].addEventListener('click', function () {
        indicator_num = parseInt(this.innerText);
        change_page(indicator_num);
    });
}
// addbtn.addEventListener('click' ,function(){
myForm.onsubmit = function () {
    // var address = prompt('추가할 url 을 입력하세요');
    // var name = prompt
    var url = document.querySelector('#url').value,
        name = document.querySelector('#name').value;

    console.log(url);
    console.log(indicator_num);
    var addLi = document.createElement('li');
    var addAnchor = document.createElement('a');
    var addImg = document.createElement('img');
    var addSpan = document.createElement('span');
    if (typeof String.prototype.startsWith != 'function') {
        String.prototype.startsWith = function (str) {
            return this.slice(0, str.length) == str;
        };
    }
    var textHttp = 'http://'
    if (url.startsWith('http') || url.startsWith('HTTP')) {
        addAnchor.setAttribute('href', url);
        console.log('여기');
    }
    else {
        url = textHttp.concat(url);
        addAnchor.setAttribute('href', url);

    }
    console.log(url);

    // var getIcon = "https://www.google.com/s2/favicons?domain_url=";
    var getIcon = "http://grabicon.com/"+url;
    var defaultFavicon = url+"/favicon.ico";
    var src = "this.src='";
    var src2 = "'";

    addImg.setAttribute('src', defaultFavicon);
    // addImg.setAttribute('onError', src.concat(getIcon).concat(src2));
    addImg.setAttribute('onError', `this.src='${getIcon}'`);


    addAnchor.appendChild(addImg);
    addSpan.innerHTML = name;
    addLi.appendChild(addAnchor);
    addLi.appendChild(addSpan);
    var targetUl = page[indicator_num - 1].querySelector('ul')
    console.log(targetUl);
    targetUl.appendChild(addLi);

    document.querySelector('#url').value = '';
    document.querySelector('#name').value = '';

return false;
// });
};

close.addEventListener('click', function(){
    document.querySelector('#url').value = '';
    document.querySelector('#name').value = '';
});

// 터치 swipe left
hammer.on('swipeleft', function (e) {
    // 인디케이터(페이지) 이동 범위 내이면
    if (indicator_num < indicator_length) {
        page_vector = 1;
    } else page_vector = 0;

    indicator_num += page_vector;
    change_page(indicator_num);
});

// 터치 swipe right
hammer.on('swiperight', function (e) {
    if (indicator_num > 1) {
        page_vector = -1;
    } else page_vector = 0;

    indicator_num += page_vector;
    change_page(indicator_num);
});

// 창크기 변경시 페이지 초기화
window.onresize = function () {
    init_page();
}