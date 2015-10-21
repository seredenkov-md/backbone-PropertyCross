// Коллекция результатов поиска

/*global Backbone */
var app = app || {};

(function () {
    'use strict';

    // Results Collection
    // ---------------

    var messages = {
        NEED_CHOOSE: 'Выбирите из списка подходящее место поиска.',
        ERROR_BAD_LOCATION: 'По Вашему запросу не удалось определить место. Пожалуйста, измените запрос.',
        ERROR_SERVER: 'Ошибка сервера',
        ERROR_TIMEOUT: 'Превышено время ожидания ответа от сервера',
        ERROR_NOT_FOUND: 'На данный момент по вашему запросу нет объявлений',
        ERROR_OTHER: 'Непонятная ошибка ]:>' // ошибки связанные с не определением апи, или ошибочным запросом (900-999)
    };

    app.Results = Backbone.Collection.extend({

        model: app.Offer,

        search: function(query) {
            console.log('Тут отправляем запрос к API для получения списка объявлений по запросу', location);

            //  http://api.nestoria.co.uk/api?
            //  country=uk&pretty=0
            //  action=search_listings
            //  listing_type=buy
            //  encoding=json&
            //  page=1                  // меняем страницы
            //  place_name=' + query;   // меняем place_name

            var httpURL = 'http://api.nestoria.co.uk/api' +
                '?country=uk&pretty=1&action=search_listings&encoding=json' +
                '&listing_type=buy' +
                '&number_of_results=' + app.resultInfo.pageSize +
                '&page=' + app.resultInfo.currentPage +
                //'&sort=price_highlow' + //'&sort=price_lowhigh' +
                '&place_name=' + query;

            var self = this;
            $.ajax({
                url: httpURL,
                timeout: 5000,
                jsonp: "callback",
                dataType: "jsonp",
                data: {
                    format: "json"
                },
                success: self.processingOfResponse.bind(self),
                error: self.processingOfError.bind(self)
            });
        },

        processingOfResponse: function(response) {
            var code,
                response_text,
                results,
                error_text = '',
                state = '',
                location;

            console.log('response', response); // server response
            console.log('request', response.response.listings); // server response
            console.log('application_response_code:', response.response.application_response_code);
            console.log('application_response_text:', response.response.application_response_text);

            code = response.response.application_response_code;
            response_text = response.response.application_response_test;
            // возможно, коды ответов хорошо бы вынести в констаны, но пока для простоты будет так,
            // чтобы не выдумывать имена всем кодам
            if (code === '111') {
                console.log('Получен ответ на запрос объявления по guid');
                // todo: обрабатываем результат запроса
                // если total_results: >=1, тогда в результате ответа можно получить данные (в массиве locations)
                state = 'OK'
            } else if (code === '100' || code === '110') {
                // 100 - ответ однозначный
                // 110 - ответ однозначный, но общее число результатов больше 1000

                // todo: формируем массив результатов, и перенаправляем страницу к результатам
                results = response.response.listings; //...
                state = 'OK';
            } else if (code === '101') {
                // вернулся ответ, место указано не однозначно, но выбрано наиболее подходящее.
                // список мест для уточнения в массиве locations

                // формируем массив результатов.
                // Предлагаем список наиболее подходящих мест?
                // ..следуя спецификации PropertyCross можно объеденить 100 101 110
                results = response.response.listings;
                state = 'OK';
            } else if (code === '200' || code === '202') {
                // 200 - не удалось опрделеить место, но предложен список возможных мест (в массие locations)
                // 202 - вероятно опечатка в названии, предложен список вероятных мест (не понял в чем отличие от 200)

                // todo: ...
                // по запросу 'Albury' api вернет массив предпологаемых трех объектов (мест)
                // их нужно вывести в списке внизу, для выбора и поиска по ним

                // todo: предложить пользователю выбрать наиболее подходящее место из списка,
                // поскольку не удалось однозначно определить что он хотел
                // после выбора из списка, выбраное местополжение попадает в текстовое поле поиска,
                //  и сразу же выполняется поиск
                // todo: ОДНАКО! Поиск выполняется не по тексту в поле поиска а по ключу, соответствующему этому полю
                // ключ должен сохраняться для следующих поисков.
                app.posLocation.reset(response.response.locations);
                state = 'OK';
            } else if (code === '201') {
                // 201 - место не может быть найдено... нужно изменить запрос
                // todo: предложить пользователю изменить запрос, т.к. прошлый запрос не дал результата...
                error_text = messages.ERROR_BAD_LOCATION;
            } else if (code === '210') {
                // 210 - ошибка координат
                // пока что ника кне обрабатываем, т.к. не ищем по координатам.
            } else if (code === '900' || code === '901' || code === '902') {
                // 900 - ошибочный запрос:  к примеру пытаемся получить сразу и список объвлений по месту, и по duid
                // 901 - разбивка на страницы вне диапазона (должно быть 1..n)
                // 902 - ели пытаемся получить страницу с записями превышаемые допустимые 1000 записей
                console.log('вероятно ошибка в формировании запроса...');
                error_text = messages.ERROR_OTHER + '\n' + code + '\n' + response_text ;
            } else if (code === '910' || code === '911') {
                // 910 911 - не известная или не поддреживаемая версия апи
                console.log('не известная или не поддреживаемая версия апи');
                error_text = messages.ERROR_OTHER + '\n' + code + '\n' + response_text ;
            } else if (code === '500') {
                // 500 internal Nestoria error... тупит сервер Нестории
                console.log(' internal Nestoria error... тупит сервер Нестории');
                error_text = messages.ERROR_SERVER;
            } else {
                console.log(' случилось что-то, что не было предусмотрено ...');
                error_text = messages.ERROR_OTHER + '\n' + code + '\n' + response_text ;
            }

            // по итогу, мы  можем получить следующие состояния:
            // 1) автоматический переход к результатам поиска
            // 2) предложение выбрать место из списка
            // 3) сообщение об ошибке errorMessage

            if (results) {
                if (results.length > 0) {
                    // обновляем историю поиска (список истории)
                    location = app.locations.findWhere({place_name: response.request.location });
                    if (!location) {
                        app.locations.create({
                            // добавляем этот поиск в историю поиска
                            place_name: response.request.location,
                            //long_title: response.response,
                            total_results: response.response.total_results
                        });

                    } else {
                        console.log('!!!! обновлена дата для ' + location.get('place_name'));
                        location.save({'time': new Date()});
                    }

                    app.resultInfo.currentPage = parseInt(response.request.page);
                    app.resultInfo.totalResults = response.response.total_results;
                    app.resultInfo.placeName = response.request.location;
                    // при переходе на страницу результатов, нужно добавить в data-key location результата..
                    this.add(results);        // обновляем коллекцию результатов
                    if (app.resultInfo.currentPage == 1) {
                        Backbone.history.navigate('#/results'); // 1)
                    } else {
                        Backbone.trigger('results:next');
                    }
                    /*
                    // для случая добавляения объявлений будем генерировать собиыте, которое слушает вьюха результатов
                    Backbone.trigger('results:new', results);
                    //Backbone.trigger('results:next', results);
                    */
                } else {
                    console.log('ОТВЕТ ПРИШЕЛ, НО ОН ПУСТОЙ!!!');
                    error_text = messages.ERROR_NOT_FOUND;
                    app.errorText = error_text;
                }
            }

            if (state !== 'OK') {
                console.log('error_text', error_text);
                app.errorText = error_text;
            }
            app.mainView.render();  // 2/3
        },

        processingOfError: function(jqXHR, textStatus) {
            var error_text = '';
            if (textStatus === 'timeout') {
                //вывести сообщение о превышении времени ожидания ответа
                //do something. Try again perhaps?
                console.log('Failed from timeout');
                error_text = messages.ERROR_TIMEOUT;
            } else {
                // вывести сообщение об ошибке.
                alert('Something is wrong');
                console.log('textStatus', textStatus);
                console.log('jqXHR:', jqXHR.status, jqXHR.statusText);
                // тут может быть 404 или любая другая ошибка от сервера, не от API
                // todo: добавить более точное определдение ошибок, и сообщения о них.
                error_text = messages.ERROR_OTHER;
            }
            app.errorText = error_text;
            app.mainView.render();
        }
    });
})();

/*
    ====== Описание кода ответа =====
    application_response_code:

    100 - вернулся ответ, место указано однозначно
    101 - вернулся ответ, место указано не однозначно, но выбрано наиболее подходящее.
        список мест для уточнения в массиве locations

    110 - корректно указано место, но ответ слишком большой (получить можно не более 1000 записей)
    111 - результат на запрос определенного объявления (по его айди)
        даже если айди неправильный, ответ будет 111. В этом случае надо проверять
        total_results: >=1 (в зависимости от числа запрашиваемых объявлений)


    200 - не удалось опрделеить место, но предложен список возможных мест (в массие locations)
    201 - место не может быть найдено... нужно изменить запрос
    202 - вероятно опечатка в названии, предложен список вероятных мест (не понял в чем отличие от 200)

    210 - ошибка координат

    900 - ощибочный запрос:  к при меру пытаемся получить сразу и список объвлений по месту, и по duid
    901 - разбивка на страницы вне диапазона (должно быть 1..n)
    902 - ели пытаемся получить страницу с запясями превышаемые допустимые 1000 записей

    500 internal Nestoria error... тупит сервер Нестории

    910 911 - не известная или не поддреживаемая версия апи


 response

 все ответы апи содержат поля:
 status_code	The HTTP status code
 status_text	The code as text
 но они нам не инетресны, т.к обработки результата запроса есть специальные поля, описанные ниже.

 для запросов "search-listings", ответ от апи всегда будет содержать следующие поля:
 application_response_code: "100",
 application_response_text: "one unambiguous location",

 page
 total_pages

 locations - список мест можно (нужно) использовать для предложения пользовтелю выбрать место из списка:
 "did you mean?"
 Иногда выбрать из списка необходимо, т.у. нельзя по запросы отдать предпочтение какому либо месту из списка
 .. пример с деревней "Albury"


 "locations" : [
 {
 "center_lat" : "51.209119",
 "center_long" : "-0.489769",
 "long_title" : "Albury, Guildford",
 "place_name" : "albury_guildford",
 "title" : "Albury"
 },
 {
 "center_lat" : "51.739892",
 "center_long" : "-1.052779",
 "long_title" : "Albury, Thame",
 "place_name" : "albury_thame",
 "title" : "Albury"
 },
 {
 "center_lat" : "51.904418",
 "center_long" : "0.088967",
 "long_title" : "Albury, Ware",
 "place_name" : "albury_ware",
 "title" : "Albury"
 }
 ],

 long_title  - эти названия предлагаем пользователю для уточнения
 place_name

 http://1.l.uk.nestoria.nestimg.com/cs4.2.png

 request

    number_of_results=50 - число объявлений в результате 20 - 50.

    pretty      - 1 / 0 нужно ли форматировать ответ для читабельности
    callback	Name of function to wrap the JSON in
    encoding	How the results will be encoded, 'xml' or 'json'

    поиск определденных объявлений по из айди:
    http://api.nestoria.co.uk/api?&action=search_listings&pretty=0&encoding=json&guid=g1-zNtEDO5cDNyY,g1-TOtk2Lpx3cpRmbvcjM5MzM5IwL==

    параметры для поиска:
    http://www.nestoria.co.uk/help/api-search-listings
    // можно установить различные критерии отбора

*/
// TODO: +  1) Добавить кнопку удаления из избранного
// TODO: +  2) кнопку добавления в избранное сделать переключаотелем (убрать/добавить)
// TODO: +  3) Добаивть создание коллекции предлагаемых путей, реализовать возможность запуска поиска по выбранному пути
// TODO: +  4) реализовать создание коллекции последних поисков. Коллекция должна храниться в  LocalStorage
// TODO: +  5) Добавить возможность поиска по нажатию ENTER
