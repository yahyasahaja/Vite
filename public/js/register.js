window.onload = function () { setup() };

var passwordMatch;
var password;
var password2;
var isMatch = false;

function setup() {
    password = $('#password');
    password2 = $('#password-2');
    passwordMatch = $('.password-match');
    password.on('change keydown paste input', onPasswordChange);
    password2.on('change keydown paste input', onPasswordChange);
    $('#form').submit(onSubmit);
}

function onPasswordChange(e) {
    var p1 = password.prop('value');
    var p2 = password2.prop('value');
    isMatch = false;

    if (p2.length == 0) {
        passwordMatch.removeClass('password-is-not-match');
        passwordMatch.removeClass('password-is-match');
        password2.css('border-bottom', '');
        
        return;
    }

    if (p1 === p2) {
        passwordMatch.removeClass('password-is-not-match');
        passwordMatch.addClass('password-is-match');
        passwordMatch.text('Password is match');
        password2.css('border-bottom', 'green solid 2px');
        isMatch = true;
    } else {
        passwordMatch.removeClass('password-is-match');
        passwordMatch.addClass('password-is-not-match');
        passwordMatch.text('Password is not match!');
        password2.css('border-bottom', 'red solid 2px');
    }
}

function onSubmit(e) {
    if (!isMatch) return false;
}