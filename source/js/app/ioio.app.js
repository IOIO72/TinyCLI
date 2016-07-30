// Author: Tamio Patrick Honma <tamio@honma.de>
// License: MIT

(function app() {
    const event = {
        init() {
            $(document).ready(this.onDomReady);
        },
        onDomReady() {
        }
    };
    const view = {
        init() {
            this.$document = $(document);
            this.$window = $(window);
            this.$scroll = $('html, body');
            this.$body = $('body');
        }
    };
    const controller = {
    };
    (function init() {
        view.init();
        event.init();
    }());
}());
