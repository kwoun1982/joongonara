'use strict';

$(document).ready(function () {
    chrome.storage.sync.get('s_str', function (obj) {
        if (obj.s_str != "") {
            $("#s_str").val(obj.s_str);
            search();
        }
    });
    $("#close_popup").on("click", function () {
        close_popup();
    });
    $("#go_naver").on("click", function () {
        go_naver();
    });
    $("#s_str").keydown(function (key) {
        if (key.keyCode == 13) {
            search();
        }
    });
});

function close_popup() {
    $("#m_contens").modal("hide");
    $("#f_contens").empty();
}

function search() {
    // 검색어 작성
    var src = "http://m.cafe.naver.com/ArticleSearchList.nhn?" +
        "search.menuid=&search.searchBy=1&search.sortBy=date&search.clubid=10050146&search.option=0&search.defaultValue=1" +
        "&search.query=" + $("#s_str").val();

    // 검색어 저장
    chrome.storage.sync.set({'s_str': $("#s_str").val()}, function () {

    });

    // 조회
    $.ajax({
        url: src
    }).done(function (data) {
        if (console && console.log) {
// console.log(data);
            data = data.substr(data.indexOf("articleList"), data.indexOf("moreButtonArea") - data.indexOf("search_list"));
            $("#f_naver_temp").html(data);
            var html_title = "";
            $(".list_tit > li").each(function (index) {
                var href = $(this).find("a").attr("href");
                var title = $(this).find("h3").text();
                var time = $(this).find(".time").text();
                html_title += '<li class="list-group-item" src="http://m.cafe.naver.com' + href + '" time="' + time + '" title="' + title + '"><span class="badge">' + time + '</span>' + title + '</li>'
            });
            $("#f_naver").html(html_title);
            $("#f_naver_temp").html("");
            $("#s_str").focus();

            if ($("#f_naver").html() == "") {
                $("#f_naver").html("<h1>검색 결과가 없습니다.</h1>")
            }

            // 팝업 열기
            $(".list-group-item").on("click", function () {
                openPop(this)
            });
        }
    });
}

function go_naver() {
    chrome.tabs.create(
        {
            url: $("#go_naver").attr("src").replace("http://m.", "http://")
        }, function () {

        }
    );
}

function openPop(obj) {
    $("#m_contens").modal("show");

    var src = $(obj).attr("src");
    var time = $(obj).attr("time");
    var title = $(obj).attr("title");

    $("#go_naver").attr("src", src);

    $.ajax({
        url: src
    }).done(function (data) {
        if (console && console.log) {
            // htmlParse(data);
            htmlParse(data, title, time);
        }
    });
}

function htmlParse(data, title, time) {


    data = data.substr(data.indexOf("NHN_Writeform_Main") + 19, data.indexOf("end_sns_area") - data.indexOf("NHN_Writeform_Main"));
    $("#f_naver_temp").html(data);
    data = $("#f_naver_temp").html();
    data = data.replaceAll('\n', '');
    data = data.replaceAll('\t', '');
    data = data.replaceAll('&gt;', '');
    data = data.replace('tml', '');
    data = data.replace('<hr>', '');
    data = data.replace('<hr>', '');
    $("#f_naver_temp").html(data);

    // 제목 설정
    $("#m_title").html("(" + time + ") " + title);
    title = $("#f_naver_temp").find("title").html();
    if (title !== undefined) {
        title = title.replaceAll(": 네이버 카페", "");
        $("#m_title").html("(" + time + ") " + title);
    }

    console.log("[" + $("#f_naver_temp").html().trim() + "]");

    // 작성자가 모바일,PC 에서 작성했는지 구분값
    if ($("#postContent").length == 0) {
        pc();
    } else {
        mobile();
    }

    // Temp 삭제
    $("#f_naver_temp").empty();

    // 로그인을 안한경우
    if ($("#f_contens").html().trim() == "") {
        var str = "<h1> 알림 </h1><br>";
        str += "<h4> 상세 내용을 표시할수 없습니다</h4>";
        str += "<h4> 1. 네이버에 로그인을 하셔야 상세 내역을 볼수 있습니다. </h4>";
        str += "<h4>    네이버에서 보기를 선택 하신 후 로그인 후 다시 이용하세요. </h4><br>";
        str += "<h4> 2.  네이버에서 보기를 선택 하신 후 로그인 후 다시 이용하세요. </h4><br>";
        $("#f_contens").html(str);
    }

    // 안먹히는 경우가 생겨 Timeout 설정함
    setTimeout(function () {
        $("#f_contens").scrollTop(0);
    }, 100);
}

function mobile() {
    $("#f_contens").html($("#f_naver_temp").find("#postContent").html());
}

function pc() {
    $("#f_naver_temp > p").find("img").each(function (index) {
        $(this).remove();
    });
    $("#f_naver_temp").find("img").each(function (index) {
        $(this).attr("style", "max-width: 90%; height: auto;");
    });
    // // 필요없는 정보 삭제
    // ,#sideMenuLayer,#sideMenuContainer, #dimmedLayer,.post_title, #RegisterNewArticleLayer, #SellerInfoLayer, #SoldOutLayer, #fontZoomTooltip,.NHN_Writeform_Main
    $("#f_naver_temp").find("title, head, script, link, meta, header,.post,.product_name,.sale_status,.product_info, .end_sns_area, .u_skip").each(function (index) {
        $(this).remove();
    });
    $("#f_naver_temp > p > a[target=_blank]").each(function (index) {
        $(this).remove();
    });
    $("#f_naver_temp > p > strong > font[color='#c2c2c2']").each(function (index) {
        $(this).remove();
    });

    $("#f_naver_temp > p").each(function (index) {
        if ($(this).text() == "") {
            $(this).remove();
        }
    });
    $("#f_naver_temp > div > a[target=_blank]").each(function (index) {
        $(this).remove();
    });

    // 처음 공백 제거
    var emptySpace = [];
    var isRuning = true;
    $("#f_naver_temp > p").each(function (index) {
        // console.log($(this).html());
        if ($(this).text().indexOf("판매 상품 사진 및 상세 설명을 적어주세요") > -1) {
            emptySpace.push(this);
            isRuning = false;
        } else {
            if (isRuning) {
                emptySpace.push(this);
            }
        }
    });
    for (var i = 0; i < emptySpace.length; i++) {
        if (!isRuning) {
            $(emptySpace[i]).remove();
        }
    }
    $("#f_contens").html($("#f_naver_temp").html().trim());
}

String.prototype.replaceAll = function (token, newToken, ignoreCase) {
    if (typeof token == "string") {
        var _token;
        var str = this + "";
        var i = -1;
        if (typeof token === "string") {
            if (ignoreCase) {
                _token = token.toLowerCase();
                while ((
                    i = str.toLowerCase().indexOf(
                        token, i >= 0 ? i + newToken.length : 0
                    )) !== -1) {
                    str = str.substring(0, i) +
                        newToken +
                        str.substring(i + token.length);
                }
            } else {
                return this.split(token).join(newToken);
            }
        }
    }
    return str;
};
