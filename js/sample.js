// пример получения далнных для модели при помощи JSONP
var Artist = Backbone.Model.extend();

var Artists = Backbone.Collection.extend({
    model : Artist,
    //url: 'http://api.nestoria.co.uk/api?country=uk&pretty=1&action=search_listings&encoding=json&listing_type=buy&page=1&place_name=leeds',
    url: 'http://api.nestoria.co.uk/api?country=uk&pretty=1&action=search_listings&encoding=json&listing_type=buy&page=1&place_name=leeds',
    sync : function(method, collection, options) {
        // By setting the dataType to "jsonp", jQuery creates a function
        // and adds it as a callback parameter to the request, e.g.:
        // [url]&callback=jQuery19104472605645155031_1373700330157&q=bananarama
        // If you want another name for the callback, also specify the
        // jsonpCallback option.
        // After this function is called (by the JSONP response), the script tag
        // is removed and the parse method is called, just as it would be
        // when AJAX was used.
        options.dataType = "jsonp";
        return Backbone.sync(method, collection, options);
    },
    parse : function(response) {
        return response.data;
    }
});

var artists = new Artists();

artists.fetch({
    data : {
        q : "bananarama"
    },
    success : function(collection, response, options) {
        console.log('collection:', collection);
        console.log('response:', response);
        console.log('options', options);
    },
    error : function(collection, response, options) {
        console.log('response.statusText', response.statusText);
    },
    // A timeout is the only way to get an error event for JSONP calls!
    timeout : 5000
});

//======================================================================================================================

(function() {
    var httpURL = 'http://api.nestoria.co.uk/api?country=uk&pretty=1&action=search_listings&encoding=json&listing_type=buy&page=1&place_name=leeds';
    $.ajax({
        url: httpURL,

        // The name of the callback parameter, as specified by the YQL service
        jsonp: "callback",

        // Tell jQuery we're expecting JSONP
        dataType: "jsonp",

        // Tell YQL what we want and that we want JSON
        data: {
            q: "select title,abstract,url from search.news where query=\"cat\"",
            format: "json"
        },

        // Work with the response
        success: function( response ) {
            console.log('$.ajax', response ); // server response
        }
    });
})();



$(document).ready(function () {
    var httpURL = 'http://api.nestoria.co.uk/api?country=uk&pretty=1&action=search_listings&encoding=json&listing_type=buy&page=1&place_name=leeds';
    $.ajax({
        //url: 'http://www.domain.com/user/' + $('#Id').val() + '?callback=?',
        url: httpURL,
        type: "POST",
        //data: formData,
        dataType: "jsonp",
        jsonpCallback: "localJsonpCallback"
    });

    function localJsonpCallback(json) {
        if (!json.Error) {
            //$('#resultForm').submit();
            console.log('json:', json);
        }
        else {
            console.log('json:', json);
            //$('#loading').hide();
            //$('#userForm').show();
            //alert(json.Message);
        }
    }
});


//  http://savvateev.org/blog/51/  - пример работы с jsonp из $
//http://stackoverflow.com/questions/5943630/basic-example-of-using-ajax-with-jsonp