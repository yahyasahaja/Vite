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
var userData;

function setup() {
    win.on('scroll', onScrollHandler);
    menu = $('#menu');
    logo = $('.logo');
    currentMenu = $('.menu-home');
    contentInvitation = $('.content-invitation');
    contentGreetings = $('.content-greetings');
    
    //getContentData();
    setupScrollMenu();
    checkForUser();
}

function setContent() {
    if (window.location.pathname.indexOf('/edit') == -1) {
        $('#save-button').html('Publish');
        $('#view-button').css('display', 'none');
        return;
    }
    
    $('#save-button').html('Save');
    var link = getParameterByName('link');

    $.ajax({
        type: "GET",
        url: window.location.origin + "/api/vitelist",
        error: function() {
            $('#info').html('<p>An error has occurred</p>');
        },
        success: function(vitelist) {
            var wedding = vitelist.invitation.wedding;
            var data;

            for (var i = 0; i < wedding.length; i++) {
                if (wedding[i].link == link) {
                    data = wedding[i];
                }
            }

            $('#linksource').val(getParameterByName('link'));
            $('#name').val(data.name);
            $('#groom').val(data.groom);
            $('#bride').val(data.bride);
            $('#date').val((new Date(data.date)).toISOString().slice(0,10).replace(/-/g,"/"));
            $('#location').val(data.location);
            $('#link').val(data.link);
            $('#view-button').attr('href', window.location.origin + '/view/' +  userData.username + '/' + data.link);
        }
    });
}

function getCookie(name) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length == 2) return parts.pop().split(";").shift();
}

function checkForUser() {
    $.ajax({
        type: "GET",
        url: window.location.origin + "/api/userdata",
        error: function() {
            $('#info').html('<p>An error has occurred</p>');
        },
        success: function(data) {
            userData = data;
            $('#user-menu').css('display', 'block');
            $('#signin-button').css('display', 'none');
            $('#user-name').html("Hi, " + data.name + "!");
            $('#link-text').html(window.location.origin + '/view/' +  data.username + '/');
            setContent();
        }
    });
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function getContentData() {
    $.get('/json/invitation.json', function(res) {
        inivtationData = res;
        for (var i in res) contentInvitation.append(addData(res[i], i));
        $('#anim-invitation').css('display', 'none');
    });

    $.get('/json/greetings.json', function(res) {
        greetingsData = res;
        for (var i in res) contentGreetings.append(addData(res[i], i));
        $('#anim-greetings').css('display', 'none');
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

    container.css('animation-delay', i * .3 + 's');
    container.addClass('card-anim');
    container.addClass('card');
    container.addClass('column-12');
    if (i % 2 == 0) container.addClass('content-ganjil');

    textContainer.addClass('card-text');
    textContainer.addClass('column-12');
    textContainer.addClass('column-6-m');
    textContainer.addClass('column-6-s');

    btn.addClass('button');
    anchor.attr('href', '/login');
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