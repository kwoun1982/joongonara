// var onDocument = function (eventType, handler) {
//     return $(document).on(eventType, handler);
// };
// onMouseUp = _.partial(onDocument, 'mouseup');
// onMouseUp(function (e) {
//     if ($("#__joongonara__").length == 0) {
//         var viewer = $('<iframe>').attr({
//             id: "__joongonara__",
//             src: chrome.extension.getURL('view.html')
//         });
//         viewer.appendTo(document.documentElement);
//     }
// });


// for (var i = 0; i < views.length; i++) {
//     var view = views[i];
//     if (view.location.href == viewTabUrl && !view.imageAlreadySet) {
//         view.imageAlreadySet = true;
//         break; // we're done
//     }
// }


// onDocument = function (eventType, handler) {
//     return $(document).on(eventType, handler);
// };
//
// var temp_keyword = "";
// onMouseUp = _.partial(onDocument, 'mouseup');
// onMouseUp(function (e) {
//     var text = "";
//     if (window.getSelection) {
//         text = window.getSelection().toString();
//     } else if (document.selection && document.selection.type != "Control") {
//         text = document.selection.createRange().text;
//     }
//
//     if (text.trim() !== ""
//         && temp_keyword !== text.trim()) {
//         temp_keyword = text.trim();
//         search_danawa(temp_keyword);
//     }
//
//     $(document)
// });
//
// function search_danawa(keyword) {
//     // var url = "http://search.danawa.com/mobile/dsearch.php?keyword=" + keyword
//     // // 조회
//     // $.ajax({
//     //     url: url,
//     //     crossOrigin: true
//     // }).done(function (data) {
//     //     data = data.replaceAll('\n', '');
//     //     data = data.replaceAll('\t', '');
//     //     data = data.replaceAll('\r', '');
//     //
//     //     console.log(data);
//     //     console.log("-------------------------");
//     //     console.log("-------------------------");
//     //     console.log("-------------------------");
//     //     console.log(url);
//     // });
//     if ($("#__joongonara__").length == 0) {
//         var html = "";
//         html += '<div id="__joongonara__" style="z-index: 999;position: fixed; left: 90%; top: 3px;" >';
//         html += '    <div><img id="loading" src="./loading.gif" style="width: 32px; height: 32px;" hidden></div>';
//         html += '</div>';
//         console.log("-------------------------");
//         console.log("-------------------------");
//         console.log("-------------------------");
//
//         document.body.appendChild(html);
//     }
// }
//
// String.prototype.replaceAll = function (token, newToken, ignoreCase) {
//     if (typeof token == "string") {
//         var _token;
//         var str = this + "";
//         var i = -1;
//         if (typeof token === "string") {
//             if (ignoreCase) {
//                 _token = token.toLowerCase();
//                 while ((
//                     i = str.toLowerCase().indexOf(
//                         token, i >= 0 ? i + newToken.length : 0
//                     )) !== -1) {
//                     str = str.substring(0, i) +
//                         newToken +
//                         str.substring(i + token.length);
//                 }
//             } else {
//                 return this.split(token).join(newToken);
//             }
//         }
//     }
//     return str;
// };
//
