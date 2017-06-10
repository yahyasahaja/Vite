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
    
    //getContentData();
    setupScrollMenu();
    checkForUser();
    getContentData();
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
            $('#user-menu').css('display', 'block');
            $('#signin-button').css('display', 'none');
            $('#user-name').html("Hi, " + data.name + "!");
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
    $.get('/api/vitelist', function(res) {
        inivtationData = res;
        for (var i in res.invitation) 
        for (var j in res.invitation[i]) 
        contentInvitation.append(addData(res.invitation[i][j], j, 'wedding'));
        
        $('#anim-invitation').css('display', 'none');
    });

    // $.get('/json/greetings.json', function(res) {
    //     greetingsData = res;
    //     for (var i in res) contentGreetings.append(addData(res[i], i));
    //     $('#anim-greetings').css('display', 'none');
    // });
}

function addData(data, i, type) {
    var container = $('<div></div>');
    var top = $('<div></div>');
    var middle = $('<div></div>');
    var bottom = $('<div></div>');
    var img = $('<div></div>');
    var editBtn = $('<div></div>');
    var editAnchor = $('<a></a>');
    var editSpan = $('<span></span>');
    var facebook = $('<a></a>');
    var twitter = $('<a></a>');
    var instagram = $('<a></a>');
    var facebookSpan = $('<span></span>');
    var twitterSpan = $('<span></span>');
    var instagramSpan = $('<span></span>');
    var bottomA = $('<a></a>');
    var h1 = $('<h1></h1>')
    var p = $('<p></p>')

    container.append(top);
    container.append(middle);
    container.append(bottom);

    top.append(img);
    top.append(editBtn);
    editBtn.append(editAnchor);
    editAnchor.append(editSpan);

    middle.append(facebook);
    middle.append(twitter);
    middle.append(instagram);
    facebook.append(facebookSpan);
    twitter.append(twitterSpan);
    instagram.append(instagramSpan);

    bottom.append(bottomA);
    bottomA.append(h1);
    bottomA.append(p);

    container.css('animation-delay', i * .1 + 's');
    container.addClass('card-anim item-container');

    top.addClass('item-up-container');
    img.addClass('item-img');
    editBtn.addClass('item-edit-button');
    editAnchor.attr('href', `/user/edit/${type}?link=${data.link}`);
    editSpan.addClass('fa fa-gears');

    middle.addClass('item-middle-container');
    facebook.attr('href', 'www.facebook.com');
    twitter.attr('href', 'www.facebook.com');
    instagram.attr('href', 'www.facebook.com');
    facebook.addClass('icon facebook');
    twitter.addClass('icon twitter');
    instagram.addClass('icon instagram');
    facebookSpan.addClass('fa fa-facebook');
    twitterSpan.addClass('fa fa-twitter');
    instagramSpan.addClass('fa fa-instagram');

    bottom.addClass('item-bottom-container');
    bottomA.attr('href', `/user/edit/${type}?link=${data.link}`);
    bottomA.css('text-decoration', 'none');
    h1.html(data.name);
    p.html(type == 'wedding' ? 'Wedding' : 'Birthday');

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
            if (!$(hash)) return;
            event.preventDefault();
            
            var hash = this.hash;

            $('html, body').animate(
                {
                    scrollTop: $(hash).offset().top - 100
                }, 
                {
                    duration: 800, 
                    easing: "easeOutCirc",
                    complete: function(){
                        window.location.hash = hash;
                        window.scrollTo(window.scrollX, $(hash).offset().top - 100);
                    }
                }
            );
        }
    });
    
    loc1 = $(".menu-content a");
    for(i = 0; i < loc1.length; i++) if (loc1.eq(i)[0].hash !== "") {
        allMenu.push(loc1.eq(i));
        allMenuTarget.push($(loc1.eq(i)[0].hash));
    }

    onScrollHandler();
}