'use strict';
var str = {
    's_str': "",
    'searchBy': "0",
    'text': "내용검색"
};
var pages = 1;

$(document).ready(function () {
    chrome.storage.sync.get(str, function (obj) {
        if (obj.s_str != undefined && obj.s_str != "") {
            $("#s_str").val(obj.s_str);

            console.log("searchBy :: " + obj.searchBy);
            console.log("text :: " + obj.text);
            $("#btn_searchBy").attr("searchBy", obj.searchBy);
            $("#btn_searchBy").html(obj.text);
            pages = 1;
            search(pages);
        }
    });
    $("#close_popup").on("click", function () {
        close_popup();
    });
    $("a[name=searchBy]").on("click", function () {
        str = {
            's_str': $("#s_str").val(),
            'searchBy': $(this).attr("searchBy"),
            'text': $(this).attr("text")
        };

        $("#f_naver_temp").empty();
        $("#f_naver_contens").empty();
        $("#f_naver").empty();

        $("#btn_searchBy").html(str.text);
        $("#btn_searchBy").attr("searchBy", str.searchBy);

        pages = 1;
        search(pages);

    });
    $("#go_naver").on("click", function () {
        go_naver();
    });
    $("#s_str").keydown(function (key) {
        if (key.keyCode == 13) {
            pages = 1;
            search(pages);
        }
    });

    $(window).bind('mousewheel', function (event) {
        if (isModalShow) {
            return;
        } else {
            if (event.originalEvent.wheelDelta >= 0) {
                // console.log('Scroll up');
            } else {
                if (temp_height == $(document).scrollTop()) {
                    if (isSerching) {
                    } else {
                        isSerching = true;
                        setTimeout(function () {
                            pages = pages + 1;
                            search(pages);
                        }, 500);
                    }
                } else {
                    temp_height = $(document).scrollTop();
                }
            }
        }
    });

    $("#m_contens").on("show.bs.modal", function () {
        isModalShow = true;
    });
    $("#m_contens").on("hide.bs.modal", function () {
        isModalShow = false;
    });

});
var temp_height = 0;
var isSerching = false;
var isModalShow = false;
function close_popup() {
    $("#m_contens").modal("hide");
    $("#f_contens").empty();
}

function search(page) {
    // 페이지 위치 초기화
    temp_height = 0;

    // 검색 URL 셋팅
    $("#s_str").val($("#s_str").val().trim());

    var param = {};
    param["search.query"] = $("#s_str").val().trim();
    param["search.menuid"] = "";
    param["search.searchBy"] = $("#btn_searchBy").attr("searchBy");
    param["search.sortBy"] = "date";
    param["search.clubid"] = 10050146;
    param["search.option"] = 0;
    param["search.defaultValue"] = "";
    param["search.page"] = page;

    console.log(JSON.stringify(param, "", "    "));

    // 검색어 작성
    var src = "http://m.cafe.naver.com/ArticleSearchListAjax.nhn?" + decodeURI($.param(param));
    console.log(src);

    // 검색어 저장
    str = {
        's_str': $("#s_str").val(),
        'searchBy': $("#btn_searchBy").attr("searchBy"),
        'text': $("#btn_searchBy").html()
    };
    chrome.storage.sync.set(str, function () {
        util_ajax(src
            , function (data) {
                search_callback(param, data)

            }, function () {
                $("#s_str").focus();
                isSerching = false;
                $("#f_naver_temp").empty();
            }
        )
    });
}

function search_callback(param, data) {
    data = data.replaceAll('\n', '');
    data = data.replaceAll('\t', '');
    data = data.replaceAll('\r', '');
    // console.log(data);
    $("#f_naver_temp").html(data);
    var html_title = "";
    if (param["search.searchBy"] == 0) {
        $(".lst_section > li").each(function (index) {
            var href = $(this).find("a").attr("href");
            var temp_seleYN = $(this).find(".icon_txt").text();
            var saleYN = temp_seleYN == "" ? "" : "[" + temp_seleYN + "] ";
            var saleYN_class = "";
            if (temp_seleYN.indexOf("완료") > -1) {
                saleYN_class = "text-danger";
            } else {
                saleYN_class = "text-success";
            }
            var title = $(this).find("h3").text();
            var time = $(this).find(".time").text();
            var img = $(this).find("img").attr("src");
            var contens = $(this).find(".post_area").text();
            var name = $(this).find(".name").text();
            html_title += '<li class="list-group-item" src="http://m.cafe.naver.com' + href + '" time="' + time + '" title="' + title + '">';
            html_title += '    <div class="media-left">';
            html_title += '         <img class="media-object" src="' + img + '" style="width: 64px; height: 64px;">';
            html_title += '    </div>';
            html_title += '    <div class="media-body">';
            html_title += '        <h4 class="media-heading ' + saleYN_class + '"><span class="badge">' + time + '</span>' + saleYN + title + '</h4>';
            html_title += contens;
            html_title += '    </div>';
            html_title += '</li>';
        });

        $("#f_naver_contens").append(html_title);
        if ($("#f_naver_contens").html() == "") {
            $("#f_naver_contens").html("<h1>내용검색은 네이버 로그인 후 이용 가능합니다. <br>검색 결과가 없습니다.</h1>")
        }
    } else {
        // 제목 검색시
        $(".list_tit > li").each(function (index) {
            var href = $(this).find("a").attr("href");
            var title = $(this).find("h3").text();
            var time = $(this).find(".time").text();
            html_title += '<li class="list-group-item" src="http://m.cafe.naver.com' + href + '" time="' + time + '" title="' + title + '"><span class="badge">' + time + '</span>' + title + '</li>'
        });
        $("#f_naver").append(html_title);
        if ($("#f_naver").html() == "") {
            $("#f_naver").html("<h1>검색 결과가 없습니다.</h1>");
        }
    }

    // 팝업 열기
    $(".list-group-item").on("click", function () {
        openPop(this)
    });
}

// 팝업 :: 네이버에서 보기 버튼
function go_naver() {
    chrome.tabs.create(
        {
            url: $("#go_naver").attr("src").replace("http://m.", "http://")
        }, function () {

        }
    );
}

// 팝업 :: 상세 화면
function openPop(obj) {
    $("#m_contens").modal("show");

    var src = $(obj).attr("src");
    var time = $(obj).attr("time");
    var title = $(obj).attr("title");

    $("#go_naver").attr("src", src);
    util_ajax(src, function (data) {
        htmlParse(data, title, time);
    });
}

// 팝업 :: 상세 화면 용 Parse
function htmlParse(data, title, time) {
    // data = data.substr(data.indexOf("NHN_Writeform_Main") + 19, data.indexOf("end_sns_area") - data.indexOf("NHN_Writeform_Main"));
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

    // 가격설정
    var price = $("#f_naver_temp").find(".price").html();
    if ($("#f_naver_temp").find(".price").html() == undefined) {
        price = "";
    } else {
        price = "<span class=\'text-primary\'>" + price + " </span>";
    }

    if (title !== undefined) {
        title = title.replaceAll(": 네이버 카페", "");
        $("#m_title").html("(" + time + ") " + price + title);
    }

    console.log("[" + $("#f_naver_temp").html().trim() + "]");

    // 작성자가 모바일,PC 에서 작성했는지 구분값
    $("#f_naver_temp").find("img").each(function (index) {
        $(this).attr("style", "max-width: 400px; height: auto;");
    });

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
        str += "<h4> 2. 네이버에서 보기를 선택 하신 후 로그인 후 다시 이용하세요. </h4><br>";
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

function util_ajax(src, callback, complete) {
    $.ajax({
        url: src,
        success: function (res) {
            callback(res);
        },
        beforeSend: function () {
            $("#loading").show();
        },
        complete: function () {
            setTimeout(function () {
                $("#loading").hide();
                if (typeof complete == "function") {
                    complete();
                }
            }, 500);
        },
        error: function (e) {

        }, timeout: 10000
    });

}