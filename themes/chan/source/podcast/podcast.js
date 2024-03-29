var API_GET_CURRENT_EP = "https://pw9hp8mso2.execute-api.us-east-1.amazonaws.com/default/td-podcast-get-current-episode"
$(document).ready(function() {
    $('.loading-div').show();
    if (document.title == "Random Podcast"){
            $.ajax({
                    url: API_GET_CURRENT_EP,
                    type: 'GET',
                    success: function(response) {
                        // $("#title").append(response.title)
                        // $("#station").append(response.station)
                        var intro = "Welcome to my random podcast page, each time an episode is finished, another random episode will be replaced (after refresh) by my td-podcast serverless app. For more information about the app please see <a href='https://blog.tdinvoke.net/2019/09/22/my-random-podcast/'>this post</a>. <br><br>Current episode is <strong>"+(response.title)+"</strong> from <strong>"+(response.station)+"</strong>.<br><br>"
                        $("#current-podcast").prepend(intro)
                        $("#current-podcast").append("<br><p><strong>Description:</strong> "+response.description+"</p>")
                        $("#audio-source").attr('src',response.episode_url);
                        $("#audio").attr('style','display:block');
                        $("#audio").trigger('load')
                    },
                    complete: function(){
                        $(".loading-div").hide();
                    },
                    error: function() {
                        alert("error");
                    }
                    });
            }});
if (document.title == "Random Podcast"){
var aud = document.getElementById("audio");
var API_GEN_RAN_EP = "https://pw9hp8mso2.execute-api.us-east-1.amazonaws.com/default/td-podcast-gen-random-episode"
aud.onended = function() {
    $.ajax({
            url: API_GEN_RAN_EP,
            type: 'GET',
            success: function(response) {
                console("gen_ran_ep")
            },
            error: function() {
                        alert("error");
                    }
            });
            window.setTimeout(function(){location.reload();}, 5000);
    };
}
