window.onload = function () { setup() };
console.log(window);

var win = $(window);
var menu;
var allMenu = [];
var allMenuTarget = [];
var currentMenu;
var onTop = true;
var logo;
var contentInvitation;
var inivtationData;
var contentGreetings;
var greetingsData;

function setup() {
    win.on('scroll', onScrollHandler);
    menu = $('#menu');
    logo = $('.logo');
    currentMenu = $('.menu-home');
    contentInvitation = $('.content-invitation');
    contentGreetings = $('.content-greetings');
    
    getContentData();
    setupScrollMenu();
}

function getContentData() {
    $.get('/json/invitation.json', function(res) {
        inivtationData = res;
        for (var i in res) contentInvitation.append(addData(res[i], i));
    });

    $.get('/json/greetings.json', function(res) {
        greetingsData = res;
        for (var i in res) contentGreetings.append(addData(res[i], i));
    });
}

function addData(data, i) {
    var container = $('<div></div>');
    var textContainer = $('<div></div>');
    var imgContainer = $('<div></div>');
    var title = $('<h1></h1>');
    var des = $('<p></p>');
    var btn = $('<div></div>');
    var anchor = $('<a></a>');
    var img = $('<img></img>');
    
    if (i % 2 == 0) {
        container.append(textContainer);
        container.append(imgContainer);
    } else {
        container.append(imgContainer);
        container.append(textContainer);
    }
    
    textContainer.append(title);
    textContainer.append(des);
    textContainer.append(btn);
    btn.append(anchor);
    imgContainer.append(img);

    container.addClass('card');
    container.addClass('column-12');
    if (i % 2 == 0) container.addClass('content-ganjil');

    textContainer.addClass('card-text');
    textContainer.addClass('column-12');
    textContainer.addClass('column-6-m');
    textContainer.addClass('column-6-s');

    btn.addClass('button');
    anchor.attr('href', '#');
    anchor.text('START NOW');

    imgContainer.addClass('card-img');
    imgContainer.addClass('column-12');
    imgContainer.addClass('column-6-m');
    imgContainer.addClass('column-6-s');

    title.text(data.title);
    des.text(data.description);
    img.attr('src', data.img);
    imgContainer.css('padding', 0);

    return container;
}

function onScrollHandler(e) {
    var winTop = win.scrollTop();
    var winBottom = winTop + win.height();
    
    if (win.scrollTop() > 30) {
        menu.addClass('menu-active');
        menu.removeClass('menu-inactive');
        onTop = false;
    } else {
        menu.removeClass('menu-active');
        menu.addClass('menu-inactive');
        onTop = true;
    }

    for (i = 0; i < allMenuTarget.length; i++) {
        if (onTop) currentMenu.removeClass("menu-actived");
        if (winTop > allMenuTarget[i].offset().top - win.height() / 2)  {
            if (currentMenu != allMenu[i].parent()) {
                currentMenu.removeClass("menu-actived");
                (currentMenu = allMenu[i].parent()).addClass("menu-actived");
            }
        }
    }
}

function setupScrollMenu() {
    var i, loc1 = $("a");
    
    loc1.attr('draggable', false);
    loc1.on('click', function(event) {
        if (this.hash !== "") {
        event.preventDefault();
        
        var hash = this.hash;
        
        $('html, body').animate(
            {scrollTop: $(hash).offset().top - 100}, {duration: 800, easing: "easeOutCirc",
            complete: function(){
                window.location.hash = hash;
                window.scrollTo(window.scrollX, $(hash).offset().top - 100);
            }});
        }
    });
    
    loc1 = $(".menu-content a");
    for(i = 0; i < loc1.length; i++) if (loc1.eq(i)[0].hash !== "") {
        allMenu.push(loc1.eq(i));
        allMenuTarget.push($(loc1.eq(i)[0].hash));
    }

    onScrollHandler();
}