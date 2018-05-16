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

init_page = () => {
    w = page[0].offsetWidth;

    // 3D page 4면체 위치 정의
    for (var i = 0; i < page.length; i++) {
        page[i].style.transform = 'rotateY(' + page_angle + 'deg) translateZ(' + (w / 2) + 'px)';
        page_angle += 90;
    }

    // page wrapper 정면으로 초기화
    wrapper.style.transform = 'translateZ(' + (-w / 2) + 'px) rotateY(' + yDeg + 'deg)';
};

// 인디케이터 초기화
init_indicator = () => {
    // 인디케이터 표시
    for (var i = 0; i < indicator_length; i++) {
        indicator.innerHTML += '<li>' + (i + 1) + '</li>';
    }

    indicator_li = indicator.querySelectorAll('li'); // 목록
    change_page(indicator_num);
};

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
    pageNum[indicator_num - 1].innerHTML = indicator_num;
}

/* ---------------------------------------------------------------- */
init_page();
init_indicator();

({
    // 여기에 설정 값(설정 상수)들을 정의할 수 있다.
    maxwidth: 600,
    maxheight: 400,

    // 유틸리티 메서드 또한 정의할 수 있다.
    gimmeMax: function () {
        return this.maxwidth + ' * ' + this.maxheight;
    },
    startsWith: () => {
        if (typeof String.prototype.startsWith != 'function') {
            String.prototype.startsWith = function (str) {
                return this.toLowerCase().slice(0, str.length) == str;
            };
        }
    },


    // 초기화
    init: function () {
        this.startsWith();
        // 더 많은 초기화 작업들을 작성할 수 있다.
    }
}).init();
/* ------------------- 이벤트 리스너 ------------------------------ */
for (let item of indicator_li) {
    item.addEventListener('click', function(){
        indicator_num = parseInt(this.innerText);
        change_page(indicator_num);
    });
}

const clearInputElement = (ele) => {
    for(let item of document.querySelectorAll(`${ele}`)){
        item.value = '';

    }
};


const addBookmark = (e) => {
    e.preventDefault();
    const elements = (() => {
        let _url = document.querySelector('#url').value,
            _name = document.querySelector('#name').value;
        const _getUrl = ()=>{
            return _url.startsWith('http') ? _url :  `http://${_url}`
        };
        const _clearInputElement = () => {
            document.querySelector('#url').value = '';
            document.querySelector('#name').value = '';
        };
        return {
            url: _getUrl(),
            name: _name,
            clearInputElement: _clearInputElement(),
            defaultFaviconPath: `${_getUrl()}/favicon.ico`,
            faviconPathWhenError: `http://grabicon.com/${_getUrl()}`
        }
    })();

    let targetUl = page[indicator_num - 1].querySelector('ul');

    const pushIcon = ()=>{
        targetUl.insertAdjacentHTML("beforeend", `
        <li>
            <a href="${elements.url}">
                <img src="${elements.defaultFaviconPath}" onError="this.onerror=null;this.src='${elements.faviconPathWhenError}'">
            </a>
            <span>${elements.name}</span>
        </li>`);
        location.href="#close";
    }
    return pushIcon();
};

myForm.addEventListener('submit', addBookmark);

close.addEventListener('click',  function(){
    clearInputElement('.inputToPush');
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
};