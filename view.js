onDocument = function (eventType, handler) {
    return $(document).on(eventType, handler);
};

onMouseUp = _.partial(onDocument, 'mouseup');
onMouseUp(function (e) {

});
