var PageTransitions = function(args)
{
    this.init(args);
};

PageTransitions.prototype = {
    init: function(args)
    {
        var self = this;
        this.args = args;

        // Cache DOM elements
        this.$canvas = $(args.selector.canvas);
        this.$article = this.$canvas.find(args.selector.article);
        this.$pages = this.$article.find(args.selector.page);

        // State
        this.pageHeight = this.$pages.height();
        this.currentPage = 0;
        this.pageCount = this.$pages.length;

        this.setPageDimensions();
        $(window).on('load resize orientationchange', function()
        {
            self.setPageDimensions.call(self);
        });

        new Hammer(this.$canvas[0], args.hammer.options).on(args.hammer.events, function(e)
        {
            self.handler.call(self, e)
        });
    },

    setPageDimensions: function()
    {
        var self = this;
        self.$pages.height(self.pageHeight);
        this.$article.height(this.pageHeight * this.pageCount);
    },

    showPage: function(index, animate)
    {
        this.currentPage = Math.max(0, Math.min(index, this.pageCount - 1));

        var offset = -((100 / this.pageCount) * this.currentPage);
        this.setArticleOffset(offset, animate);
    },

    prev: function() { return this.showPage(this.currentPage - 1, true); },
    next: function() { return this.showPage(this.currentPage + 1, true); },

    setArticleOffset: function(percent, animate)
    {
        this.$article[animate ? 'addClass' : 'removeClass']('animate');
        this.$article.css('transform', 'translate3d(0, ' + percent + '%, 0) scale3d(1, 1, 1)');

        /*
        if(Modernizr.csstransforms3d)
            this.$article.css('transform', 'translate3d(' + percent + '%, 0, 0) scale3d(1, 1, 1)');
        else if(Modernizr.csstransforms)
            this.$article.css('transform', 'translate(' + percent +'%, 0)');
        else
        {
            var px = ((pageHeight * pageCount) / 100) * percent;
            this.$article.css('top', px);
        }*/
    },

    handler: function(e)
    {
        var self = this;

        switch(e.type)
        {
            // Stick to the finger
            case 'dragup':
            case 'dragdown':
                var pageOffset = -(100 / this.pageCount) * this.currentPage;
                var dragOffset = ((100 / this.pageHeight) * e.gesture.deltaY) / this.pageCount;

                self.setArticleOffset(dragOffset + pageOffset);
                break;

            // Just navigate
            case 'swipeup':
                self.next();
                e.gesture.stopDetect();
                break;

            case 'swipedown':
                self.prev();
                e.gesture.stopDetect();
                break;

            // If more then 50% moved, navigate
            case 'release':
                if(Math.abs(e.gesture.deltaY) > this.pageHeight / 2)
                {
                    if(e.gesture.direction == 'down')
                        self.prev();
                    else
                        self.next();
                }
                else
                    self.showPage(this.currentPage, true);

                break;
        }
    }
};
