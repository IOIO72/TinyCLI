// Author: Tamio Patrick Honma <tamio@honma.de>
// License: MIT

(function app() {

    class Clipboard {
        // Adapted to class construction from https://www.lucidchart.com/techblog/2014/12/02/definitive-guide-copying-pasting-javascript/
        constructor($el = $('body')) {
            if (!(window.jQuery)) {
                throw new Error('Please include jQuery to use the RSS class.');
            }
            this.$el = $el;
            this.$el.append(`<input id="input-clipboard" class="hidden" type="text" value="" />`);
            this.$clipboardInput = $('#input-clipboard');
            this.userInput = "";
            this.hiddenInputListener = function(text) {};
            this.setEvents();
            $(document).mouseup(this.focusHiddenArea);
        }

        static create($el) {
            const isIe = (navigator.userAgent.toLowerCase().indexOf("msie") != -1 || navigator.userAgent.toLowerCase().indexOf("trident") != -1);
            const ChildClass = isIe ? IEClipboard : DefaultClipboard;
            return new ChildClass($el);
        }

        setEvents() {
            this.$clipboardInput.on('input', () => {
                const isSafari = navigator.appVersion.search('Safari') != -1 && navigator.appVersion.search('Chrome') == -1 && navigator.appVersion.search('CrMo') == -1 && navigator.appVersion.search('CriOS') == -1;
                this.userInput += this.$clipboardInput.val();
                this.hiddenInputListener(this.userInput);
                // There is a bug (sometimes) with Safari and the input area can't be updated during
                // the input event, so we update the input area after the event is done being processed
                if (isSafari) {
                    this.$clipboardInput.focus();
                    setTimeout(this.focusHiddenArea, 0);
                } else {
                    this.focusHiddenArea();
                }
            });
            this.clipboardListener();
        }

        clipboardListener() {
            // Set clipboard event listeners on the document.
            ['cut', 'copy', 'paste'].forEach(function(event) {
                document.addEventListener(event, function(e) {
                    console.log(event);
                    this.clipboardEvent(event, e);
                    this.focusHiddenArea();
                    e.preventDefault();
                })
            })
        }

        focusHiddenArea() {
            // In order to ensure that the browser will fire clipboard events, we always need to have something selected
            this.$clipboardInput.val(' ');
            this.$clipboardInput.focus().select();
        }

        clipboardEvent(clipboardEvent, event, copyData = {}) {
            const clipboardData = event.clipboardData,
                textToCopy = (copyData.hasOwnProperty('textData')) ? copyData.textData : '',
                htmlToCopy = (copyData.hasOwnProperty('htmlData')) ? copyData.htmlData : '';
            if (clipboardEvent == 'cut' || clipboardEvent == 'copy') {
                clipboardData.setData('text/plain', textToCopy);
                clipboardData.setData('text/html', htmlToCopy);
            }
            if (clipboardEvent == 'paste') {
                console.log('Clipboard Plain Text: ' + clipboardData.getData('text/plain'));
                console.log('Clipboard HTML: ' + clipboardData.getData('text/html'));
            }
        }

    }

    class IEClipboard extends Clipboard {
        constructor($el = $('body')) {
            super($el);
            this.$el.append(`<div id="ie-clipboard" class="hidden" contenteditable="true"></div>`);
            this.$clipboardIE = $('#ie-clipboard');
            document.addEventListener('beforepaste', () => {
                if (this.$clipboardInput.is(':focus')) {
                    this.focusIEArea();
                }
            }, true);
        }

        clipboardListener() {
            // Set clipboard event listeners on the document.
            ['cut', 'copy', 'paste'].forEach(function(event) {
                document.addEventListener(event, function(e) {
                    console.log(event);
                    this.clipboardEvent(event);
                })
            })
        }

        focusIEArea() {
            // Focuses an element to be ready for copy/paste (used exclusively for IE)
            this.$clipboardIE.focus();
            const range = document.createRange();
            range.selectNodeContents((this.$clipboardIE.get(0)));
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
        }

        clipboardEvent(clipboardEvent, event = undefined, copyData = {}) {
            // For IE, we can get/set Text or URL just as we normally would, but to get HTML, we need to let the browser perform the copy or paste
            // in a contenteditable div.
            const clipboardData = window.clipboardData,
                textToCopy = (copyData.hasOwnProperty('textData')) ? copyData.textData : '',
                htmlToCopy = (copyData.hasOwnProperty('htmlData')) ? copyData.htmlData : '';
            if (clipboardEvent == 'cut' || clipboardEvent == 'copy') {
                clipboardData.setData('Text', textToCopy);
                this.$clipboardIE.html(htmlToCopy);
                this.focusIEArea();
                setTimeout(function() {
                    this.focusHiddenArea();
                    this.$clipboardIE.empty();
                }, 0);
            }
            if (clipboardEvent == 'paste') {
                const clipboardText = clipboardData.getData('Text');
                this.$clipboardIE.empty();
                setTimeout(function() {
                    console.log('Clipboard Plain Text: ' + clipboardText);
                    console.log('Clipboard HTML: ' + this.$clipboardIE.html());
                    this.$clipboardIE.empty();
                    this.focusHiddenArea();
                }, 0);
            }
        };
    }

    class DefaultClipboard extends Clipboard {

    }

    class LoadJSON {
        constructor($el, options = {}) {
            if (!(window.jQuery)) {
                throw new Error('Please include jQuery to use the RSS class.');
            }
            this.$el = $el;
            this.eventNames = {
                onLoad: (options.hasOwnProperty('onLoad')) ? options.onLoad : 'json:loaded'
            };
        }

        static decodeHtmlEntity(str) {
            return str.replace(/&#(\d+);/g, function(match, dec) {
                return String.fromCharCode(dec);
            });
        }

        static encodeHtmlEntity(str) {
            var buf = [];
            for (var i=str.length-1;i>=0;i--) {
                buf.unshift(['&#', str[i].charCodeAt(), ';'].join(''));
            }
            return buf.join('');
        }
    }

    class BBS extends LoadJSON {
        constructor($el, options = {}) {
            super($el, options);
            if (!(window.showdown)) {
                throw new Error('Please include showdown.min.js to use the BBS class.');
            }
            const outFn = (options.hasOwnProperty('outFn')) ? options.outFn : console.info;
            this.markdown = new showdown.Converter();
            this.eventNames.onLoad = (options.hasOwnProperty('onLoad')) ? options.onLoad : 'bbs:loaded';
            this.eventNames.onArticleLoad = (options.hasOwnProperty('onArticleLoad')) ? options.onArticleLoad : 'bbs:article';
            this.tocJSON = (options.hasOwnProperty('tocJSON')) ? options.tocJSON : "assets/articles/_toc.json";
            this.baseUrl = (options.hasOwnProperty('baseUrl')) ? options.baseUrl : "assets/articles/";
            this.boards = (options.hasOwnProperty('boards')) ? options.boards : {};
            if (this.tocJSON.length > 0 && $.isEmptyObject(this.boards)) {
                this.$el.on(this.eventNames.onLoad, this.onLoad.bind(this));
                this.getToc();
            }
            this.$el.on(this.eventNames.onArticleLoad,
                (e, d) => {
                    outFn(d);
                }
            );
        }

        onLoad(e, d) {
            this.boards = d.toc;
        }

        getToc(jsonUrl = this.tocJSON) {
            if (typeof jsonUrl === 'undefined' || jsonUrl === 'undefined' || jsonUrl.length === 0) {
                return false;
            } else {
                try {
                    $.getJSON(jsonUrl, (data) => {
                        this.$el.trigger(this.eventNames.onLoad, data);
                    }, "json");
                } catch(e) {
                    return `Error: Couldn't get '${jsonUrl}' to load BBS table of contents.`
                }
            }
        }

        getArticle(name, baseUrl = this.baseUrl) {
            let out = '';
            try {
                if (name.length) {
                    $.get(baseUrl + name, (data) => {
                        this.$el.trigger(this.eventNames.onArticleLoad, this.markdown.makeHtml(data));
                    }, "text");
                } else {
                    out = `Error: Article not found.`;
                }
            } catch(e) {
                out = `Error: Invalid article name '${name}'.<br><i>(${e})</i>`;
            }
            return out;
        }

        listArticles(bbsArticles, prefix = '') {
            let out = '';
            $.each(bbsArticles, (i, item) => {
                out = `${out}${prefix}<b>${item.name}</b><br>`;
            });
            return out;
        }

        listBoards(bbsBoards = this.boards) {
            let out = '';
            if (bbsBoards) {
                $.each(bbsBoards, (i, item) => {
                    out = `${out}<br><small>Chapter '${item.name}'</small><br>`;
                    if (item.articles.length>0) {
                        out = `${out}${this.listArticles(item.articles, '&nbsp;&nbsp;&nbsp;&nbsp;')}`;
                    }
                });
            } else {
                out = `Error: No bulletin board data available.`
            }
            return out;
        }

    }

    class RSS extends LoadJSON {
        constructor($el, options = {}) {
            super($el, options);
            this.eventNames.onLoad = (options.hasOwnProperty('onLoad')) ? options.onLoad : 'feed:loaded';
            const outFn = (options.hasOwnProperty('outFn')) ? options.outFn : console.info;
            this.$el.on(this.eventNames.onLoad,
                (e, d) => {
                    outFn(this.getFeedArticles(d));
                }
            );
        }

        getFeedArticles(json) {
            let out = '';
            try {
                if ($.isArray(json.query.results.item)) {
                    $.each(json.query.results.item, (i, item) => {
                        out = `${out}<a href="${item.link}" title="${RSS.encodeHtmlEntity(item.description)}">${item.title}</a><br>`;
                    });
                } else {
                    out = 'Error: No feed articles found.';
                }
            } catch(e) {
                out = `Error: Invalid feed. Please use a valid url.<br><i>(${e})</i>`;
            }
            return out;
        }

        getFeedYQL(url) {
            if (typeof url === 'undefined' || url === 'undefined' || url.length === 0) {
                return false;
            } else {
                const yql = `https://query.yahooapis.com/v1/public/yql?q=select%20title%2Clink%2Cdescription%20from%20rss%20where%20url%3D%22${encodeURI(url)}%3Fformat%3Dxml%22&format=json&diagnostics=true&callback=`;
                $.getJSON(yql, (data) => {
                    this.$el.trigger(this.eventNames.onLoad, data);
                }, "jsonp");
                return true;
            }
        }

    }

    let myBBS,
        myRSS,
        myClipboard;

    const event = {

        init() {
            myBBS = new BBS(view.$prompt, { outFn: view.outputCommandResult.bind(view) });
            myRSS = new RSS(view.$prompt, { outFn: view.outputCommandResult.bind(view) });
            myClipboard = Clipboard.create($('body'));
            view.$body.on('keyup', this.onKeyUp)
                .on('keydown', this.onKeyDown)
                .on('keypress', this.onKeyPress);
            this.initPrompt();
            view.$window.on('scroll touchmove mousewheel', this.onScroll);
            view.initCursor();
            this.executeHashInTerminal();
        },

        initPrompt() {
            view.$prompt.on('ctrlChar', this.onCtrlChar)
                .on('command', this.onCommand);
        },

        executeHashInTerminal() {
            const hash = location.hash.substr(1);
            if (hash) {
                controller.executePresetString(hash);
            }
        },

        onCommand(e, c) {
            e.preventDefault();
            view.outputCommandResult(controller.executeCommand(c));
        },

        onCtrlChar(e, t) {
            e.preventDefault();
            //console.log(`codename: ${t}`);
            switch (t.toLowerCase()) {
                case 'backspace':
                    view.deleteChar();
                    break;
                case 'delete':
                    view.moveCursorForward();
                    view.deleteChar();
                    break;
                case 'arrowleft':
                    view.moveCursorBack();
                    break;
                case 'arrowright':
                    view.moveCursorForward();
                    break;
                case 'arrowup':
                    view.promptHistory(true);
                    break;
                case 'arrowdown':
                    view.promptHistory(false);
                    break;
                case 'end':
                    view.removeCursor();
                    view.moveCursor(view.$prompt.text().length);
                    break;
                case 'home':
                    view.moveCursor(0);
                    break;
                case 'pagedown':
                    view.scrollPage(1);
                    break;
                case 'pageup':
                    view.scrollPage(-1);
                    break;
                case 'enter':
                    view.enterCommandLine();
                    break;
                case 'undefined':
                    view.printTerminal(`<b>Error: Key not defined.</b><br><i>It seems, your browser doesn't support the required feature.<br>Support may be given in a later version of this CLI.</i>`, "output error");
                    break;
            }
        },

        onKeyUp(e) {
            e.preventDefault();
        },

        onKeyDown(e) {
            e.preventDefault();
            //console.log(`key: ${e.key} keycode: ${e.keyCode} charCode: ${e.charCode} which: ${e.which}`);
            //console.log(e);
            if (controller.executeModifierCommand(e) === false) {
                view.typeChar(controller.triggerCtrlCodes(e.key));
            }
        },

        onKeyPress(e) {
            e.preventDefault();
        },

        onScroll(e) {
            if (view.isScrolling === true) {
                e.preventDefault();
                e.stopPropagation();
            }
        }
    };

    const view = {

        init() {
            this.$document = $(document);
            this.$window = $(window);
            this.$scroll = $('html, body');
            this.$body = $('body');
            this.$terminal = $('#terminal');
            if (this.$terminal.length===0) {
                this.$body.append('<div id="terminal"></div>');
                this.$terminal = $('#terminal');
            }
            this.initTerminal();
        },

        initTerminal() {
            this.$cli = $('#cli');
            if (this.$cli.length===0) {
                this.clearTerminal();
            }
            this.$prompt = $('#prompt');
            this.$history = false;
            this.curPos = 0;
            this.isScrolling = false;
            this.scrollSpeed = 800;
        },

        clearTerminal() {
            this.$terminal.html(`<div class="print"></div><div id="cli"><span class="label"></span><span id="prompt"></span></div>`);
            this.initTerminal();
            event.initPrompt();
        },

        typeChar(keyName) {
            if (keyName != '') {
                this.removeCursor();
                let p = this.$prompt.html();
                let pright = (this.curPos == p.length) ?
                    this.getCursor() :
                    this.getCursor(p.substring(this.curPos, this.curPos+1)) +
                    p.substring(this.curPos+1);
                this.$prompt.html(p.substring(0, this.curPos) + keyName + pright);
                this.curPos = this.curPos + 1;
            }
        },

        deleteChar() {
            if (this.curPos > 0) {
                this.removeCursor();
                let p = this.$prompt.html();
                this.$prompt.html(p.substring(0, this.curPos-1) + p.substring(this.curPos));
                this.curPos = this.curPos - 1;
                this.setCursor();
            }
        },

        moveCursorBack() {
            if (this.curPos > 0) {
                this.removeCursor();
                this.curPos = this.curPos - 1;
                this.setCursor();
            }
        },

        moveCursorForward() {
            this.removeCursor();
            if (this.curPos < this.$prompt.text().length) {
                this.curPos = this.curPos + 1;
            }
            this.setCursor();
        },

        moveCursor(pos = 0) {
            this.curPos = pos;
            this.setCursor();
        },

        initCursor(char = "&nbsp;") {
            this.removeCursor();
            this.curPos = 0;
            this.$history = false;
            this.$prompt.html(this.getCursor(char));
        },

        setCursor() {
            if (this.curPos >= 0) {
                this.removeCursor();
                let p = this.$prompt.html();
                this.$prompt.html(
                    p.substring(0, this.curPos) + (
                        (this.curPos == p.length) ?
                            this.getCursor() :
                            this.getCursor(p.substring(this.curPos, this.curPos+1))
                    ) + p.substring(this.curPos+1)
                );
            } else {
                if (p.length === 0) {
                    this.initCursor();
                }
            }
        },

        getCursor(char = "&nbsp;") {
            return `<span class="cursor">${char}</span>`;
        },

        removeCursor() {
            let $cur = this.$prompt.children('.cursor');
            let chr = $cur.html();
            if (chr == "&nbsp;") {
                $cur.remove();
            } else {
                this.$prompt.html(this.$prompt.text());
            }
        },

        printTerminal(txt, cssClasses="command") {
            this.$cli.prev().append(`<div class="${cssClasses}">${txt}</div>`);
            this.$terminal.scrollTop(this.$terminal[0].scrollHeight);
        },

        enterCommandLine() {
            let p = $.trim(this.$prompt.text());
            this.printTerminal(p, "command label");
            controller.triggerCommand(p);
            this.initCursor();
        },

        outputCommandResult(out) {
            this.printTerminal(out, "command output");
        },

        promptHistory(prev = true) {
            if (this.$history === false) {
                this.$history = (prev) ? $("#terminal .print .command.label").last() : $("#terminal .print .command.label").first();
            } else {
                this.$history = (prev) ? this.$history.prevAll(".command.label").first() : this.$history.nextAll(".command.label").first();
            }
            if (this.$history.length) {
                const h = this.$history.text();
                this.$prompt.html(h);
                this.moveCursor(h.length);
            } else {
                this.initCursor();
            }
        },

        scrollPage(direction) {
            if (this.isScrolling === false) {
                this.isScrolling = true;
                direction = ($.isNumeric(direction) && Math.abs(direction) === 1) ? direction : 1;
                let th = this.$terminal[0].scrollHeight,
                    ch = this.$terminal.height(),
                    offset = this.$terminal.scrollTop() + ch * direction,
                    adjusted = (offset < 0) ? 0 : (offset + ch > th) ? th - ch : offset;
                    view.$terminal.animate({
                        scrollTop: adjusted
                    },
                    (offset !== adjusted) ? Math.floor(this.scrollSpeed / 6.6666) : this.scrollSpeed,
                    () => {
                        this.isScrolling = false
                    }
                );
            }
        },

        scrollDocumentPage(direction) {
            if (this.isScrolling === false) {
                this.isScrolling = true;
                direction = ($.isNumeric(direction) && Math.abs(direction) === 1) ? direction : 1;
                let dh = this.$document.height(),
                    wh = this.$window.height(),
                    offset = this.$window.scrollTop() + wh * direction,
                    adjusted = (offset < 0) ? 0 : (offset + wh > dh) ? dh - wh : offset;
                    view.$scroll.animate({
                        scrollTop: adjusted
                    },
                    (offset !== adjusted) ? Math.floor(this.scrollSpeed / 6.6666) : this.scrollSpeed,
                    () => {
                        this.isScrolling = false
                    }
                );
            }
        }
    };

    const controller = {

        triggerCtrlCodes(codename) {
            let r = '';
            if (typeof codename === 'undefined') {
                codename = 'undefined';
            }
            if (codename.length > 1) {
                view.$prompt.trigger('ctrlChar', [codename]);
            } else {
                r = codename;
            }
            return r;
        },

        triggerCommand(prompt = '') {
            view.$prompt.trigger('command', this.getCommand(prompt));
        },

        executeModifierCommand(e) {
            console.log(`key command`);
            let r = false;
            if (typeof e === 'object') {
                console.log(e);
                switch (e.key.toLowerCase()) {
                    case 'v':
                        if (e.metaKey || e.ctrlKey) {
                            r = true;
                            console.log(`COPY (metakey: ${e.metaKey}; ctrlkey: ${e.ctrlKey})`);
                        }
                        break;
                }
            }
            return r;
        },

        executeCommand(cmd = {}) {
            let out = '';
            switch (cmd.command) {
                case '':
                    break;
                case 'cls':
                    view.clearTerminal();
                    break;
                case 'exit':
                    view.$terminal.remove();
                    window.history.back();
                    break;
                case 'about':
                    out = `Made by Tamio Patrick Honma (<a href="https://about.me/honma" target="_blank">about.me</a>)<br>MIT License (MIT) Copyright (c) 2016 Tamio Honma<br>Use the command 'licences' to see all licences of this website.`;
                    break;
                case 'licences':
                case 'licence':
                case 'legal':
                case 'terms':
                    out = `<b>TinyCLI</b>, <b>Bulletin Board CLI</b> are MIT licensed by Tamio Honma<br>
                        <b>keyboardevent-key-polyfill</b> by Chris van Wiemeersch und MIT<br>
                        <b>Efecto Matrix en 40 líneas</b> by 0utKast (http://codepen.io/0utKast/pen/GpzobR)`;
                    break;
                case '?':
                case 'h':
                case 'help':
                    out = `Commands:<br>
                        bbs <small>[contents of this site]</small><br>
                        calc &lt;simple math&gt; <small>[simple math calculator]</small><br>
                        len &lt;text&gt; <small>[length of text]</small><br>
                        ucase &lt;text&gt; <small>[upper case text]</small><br>
                        lcase &lt;text&gt; <small>[lower case text]</small><br>
                        rss &lt;url&gt; <small>[list contents of an rss feed]</small><br>
                        search &lt;phrase&gt; <small>[search the web]</small><br>
                        web &lt;url&gt; <small>[go to url]</small><br>
                        loadwb <small>[dive into nostalgia]</small><br>
                        shirt <small>[express nostalgia]</small><br>
                        cls <small>[clear screen]</small><br>
                        about, licences, help<br>
                        exit`;
                    break;
                case 'eval':
                case 'calc':
                    out = `${eval(cmd.arguments.join(' '))}`;
                    break;
                case 'length':
                case 'len':
                    out = cmd.arguments.join(' ').length;
                    break;
                case 'upper':
                case 'uppercase':
                case 'ucase':
                    out = cmd.arguments.join(' ').toLocaleUpperCase();
                    break;
                case 'lower':
                case 'lowercase':
                case 'lcase':
                    out = cmd.arguments.join(' ').toLocaleLowerCase();
                    break;
                case 'google':
                    this.openUrl(encodeURI(`https://www.google.com/search?q=${cmd.arguments.join(' ')}`));
                    break;
                case 'search':
                    this.openUrl(encodeURI(`http://www.goosh.org/#${cmd.arguments.join(' ')}`));
                    break;
                case 'goto':
                case 'web':
                    if (this.openUrl(encodeURI(`${cmd.arguments[0]}`))) {
                        out = `Opened '${cmd.arguments[0]}'`;
                    } else {
                        out = 'Usage: web &lt;url&gt;';
                    }
                    break;
                case 'rss':
                    if (myRSS.getFeedYQL(cmd.arguments[0])) {
                        out = `Trying to open '${cmd.arguments[0]}' `;
                    } else {
                        out = 'Usage: rss &lt;url&gt;';
                    }
                    break;
                case 'bbs':
                    if (cmd.arguments.length === 0) {
                        out = myBBS.listBoards();
                        out = `${out}<br>Type 'bbs &lt;article name&gt;' to read an article.`;
                    } else {
                        myBBS.getArticle(cmd.arguments[0]);
                    }
                    break;
                case 'loadwb':
                    this.openUrl("http://pnacl-amiga-emulator.appspot.com/");
                    break;
                case 'shirt':
                    this.openUrl("http://lemon.spreadshirt.co.uk/de/shell-A8380690/customize/color/317");
                    break;
                default:
                    out = `Command '${cmd.command}' not found`;
                    break;
            }
            return out;
        },

        executePresetString(str) {
            if (str) {
                view.$prompt.html(str);
                view.moveCursor(str.length);
                view.enterCommandLine();
            }
        },

        getCommand(prompt = '') {
            let arrPrompt = prompt.split(' ');
            return {
                'command': arrPrompt.shift().toLowerCase(),
                'arguments': arrPrompt.filter((arg) => {return arg.length > 0;})
            }
        },

        openUrl(url) {
            if (typeof url === 'undefined' || url === 'undefined' || url.length === 0) {
                return false;
            } else {
                window.open(url, '_blank');
                return true;
            }
        }
    };

    (function init() {
        $(document).ready(
            () => {
                window.keyboardeventKeyPolyfill.polyfill();
                view.init();
                event.init();
            }
        )
    }());

}());
