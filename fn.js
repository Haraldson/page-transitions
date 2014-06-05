$(function()
{
    var pageTransitions = new PageTransitions(
    {
        selector: {
            canvas: '#canvas',
            article: '.article',
            page: '.page'
        },
        hammer: {
            options: {
                dragLockToAxis: true,
                preventDefault: true
            },
            events: 'release dragup dragdown swipeup swipedown'
        }
    });
});
