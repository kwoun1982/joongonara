onDocument = function (eventType, handler) {
    return $(document).on(eventType, handler);
};

onMouseUp = _.partial(onDocument, 'mouseup');
onMouseUp(function (e) {
    console.log(Math.floor((Math.random() * 100)));
});
