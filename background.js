'use strict';


$(document).ready(function () {
    chrome.storage.sync.get('s_str', function (obj) {
        if (obj.s_str != "") {
            search(obj.s_str);
        }
    });
});

function search(s_str) {
    // =================================
    // 검색어 작성
    // =================================
    var src = "http://m.cafe.naver.com/ArticleSearchList.nhn?" +
        "search.menuid=&search.searchBy=1&search.sortBy=date&search.clubid=10050146&search.option=0&search.defaultValue=1" +
        "&search.query=" + s_str;

    // =================================
    // 조회
    // =================================
    $.ajax({
        url: src
    }).done(function (data) {
        data = data.substr(data.indexOf("articleList"), data.indexOf("moreButtonArea") - data.indexOf("search_list"));
        $("#f_naver_temp").html(data);
        $(".list_tit > li").each(function (index) {

            var href = $(this).find("a").attr("href").trim();
            var title = $(this).find("h3").text().trim();
            var time = $(this).find(".time").text().trim();

            if (index == 0) {
                chrome.storage.sync.get('lastTitle', function (obj) {
                    if (obj.lastTitle != undefined
                        && obj.lastTitle != ""
                        && obj.lastTitle != title) {

                        var popupData = {
                            title: "중고나라",
                            message: title
                        };
                        showWarning(popupData);

                        chrome.storage.sync.set({'lastTitle': title}, function () {

                        });
                    }
                });

                setTimeout(function () {
                    chrome.storage.sync.get('s_str', function (obj) {
                        search(obj.s_str);
                    });
                }, 5000);
            }
        });
        $("#f_naver_temp").html("")
    });
}

var warningId = 'notification.warning';
function hideWarning(done) {
    chrome.notifications.clear(warningId, function () {
        if (done) done();
    });
}

function showWarning(popupData) {
    hideWarning(function () {
        chrome.notifications.create(warningId, {
            iconUrl: chrome.runtime.getURL('icon.png'),
            title: popupData.title,
            type: 'basic',
            message: popupData.message,
            buttons: [
                {title: 'Learn More1 '},
                {title: 'Learn More1 '}
            ],
            isClickable: true,
            priority: 1
        }, function () {
        });
    });
}