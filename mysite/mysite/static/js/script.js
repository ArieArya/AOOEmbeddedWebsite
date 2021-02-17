function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}

$(document).on('submit', '#chat-form', function(e) {
    var inputMessage = $('#chat-msg').val();
    if (inputMessage !== "") {
        e.preventDefault();
        var time = formatAMPM(new Date);
        var message_block = '<li class="w3-animate-right" style="margin:5px;display:inline-block;width:100%;height:auto;"><div id="chat_user"><p><span class="ordinary-text">' + inputMessage + '</span></p><span class="timestamp">' + time + '</span></div></li>';
        $('#msg-list').append(message_block);
        $("#chat-msg").val('');
        $("#chat-content").scrollTop($("#chat-content")[0].scrollHeight);

        $.ajax({
            type: 'POST',
            url: '/post/',
            data: {
                msg: inputMessage,
                src_user: "cur_user",
                cur_time: time,
                csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
            },
            success: function(json) {
                var response_block = '<li class="w3-animate-left" style = "margin:5px;display:inline-block;width:100%;height:auto;"><div id="not_user"><p><span class="ordinary-text">' + json.message + '</span></p><span class="timestamp">' + json.time_received + '</span></div></li>';
                $('#msg-list').append(response_block);
                $("#chat-content").animate({ scrollTop: $('#chat-content').prop("scrollHeight") }, 800);
            }
        });
    }
    return false;
});

$(window).on("load", function() {
    var time = formatAMPM(new Date);
    $('#msg-list').val('');
    initial_block = '<li data-aos="fade-right" data-aos-delay=500 style = "margin:5px;display:inline-block;width:100%;height:auto;"><div id="not_user"><p><span class="ordinary-text">Hello! my name is Arie, I am an AI chatbot designed to answer your questions</span></p><span class="timestamp">' + time + '</span></div></li>';
    $("#msg-list").append(initial_block);
});

var TxtRotate = function(el, toRotate, period) {
    this.toRotate = toRotate;
    this.el = el;
    this.loopNum = 0;
    this.period = parseInt(period, 10) || 2000;
    this.txt = '';
    this.tick();
    this.isDeleting = false;
};

TxtRotate.prototype.tick = function() {
    var i = this.loopNum % this.toRotate.length;
    var fullTxt = this.toRotate[i];

    if (this.isDeleting) {
        if (fullTxt.charAt(this.txt.length) == '>') {
            this.txt = fullTxt.substring(0, this.txt.length - 2);
        } else {
            this.txt = fullTxt.substring(0, this.txt.length - 1);
        }
    } else {
        if (fullTxt.charAt(this.txt.length) == '<') {
            this.txt = fullTxt.substring(0, this.txt.length + 3);
        } else {
            this.txt = fullTxt.substring(0, this.txt.length + 1);
        }
    }



    this.el.innerHTML = '<span class="wrap">' + this.txt + '</span>';

    var that = this;
    var delta = 150 - Math.random() * 50;

    if (this.isDeleting) { delta /= 2; }

    if (!this.isDeleting && this.txt === fullTxt) {
        delta = this.period;
        this.isDeleting = true;
    } else if (this.isDeleting && this.txt === '') {
        this.isDeleting = false;
        this.loopNum++;
        delta = 250;
    }

    setTimeout(function() {
        that.tick();
    }, delta);
};

window.onload = function() {
    var elements = document.getElementsByClassName('txt-rotate');
    for (var i = 0; i < elements.length; i++) {
        var toRotate = elements[i].getAttribute('data-rotate');
        var period = elements[i].getAttribute('data-period');
        if (toRotate) {
            new TxtRotate(elements[i], JSON.parse(toRotate), period);
        }
    }
    // INJECT CSS
    var css = document.createElement("style");
    css.type = "text/css";
    css.innerHTML = ".txt-rotate > .wrap { border-right: 0.08em solid #666 }";
    document.body.appendChild(css);
};