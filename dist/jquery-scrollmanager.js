
/*
 $.scrollmanager
 smooth scrolling and highlight some element with scrolling

 @author   Naoki Sekiguchi (http:#likealunatic.jp)
 @url      https://github.com/seckie/jquery-scrollmanager
 @license  http:#www.opensource.org/licenses/mit-license.html  MIT License
 @since    2011-12-17
 */

(function() {
  'use strict';
  var Scrollmanager;

  $.fn.scrollmanager = function(opt) {
    opt = opt || {};
    opt.element = this;
    this.data('scrollmanager', new Scrollmanager(opt));
    return this;
  };

  Scrollmanager = (function() {
    function Scrollmanager() {
      console.log('passed option:', arguments);
      this.opt = {};
      $.extend(this.opt, this.defaultOptions, arguments[0]);
      this.element = arguments[0].element;
      this.targets = [];
      this._create();
    }

    Scrollmanager.prototype.defaultOptions = {
      element: {},
      delay: 500,
      className: 'on',
      easing: 'swing',
      duration: 750,
      vertical: true,
      horizontal: true,
      offsetX: 0,
      offsetY: 0,
      complete: function(target, trigger) {}
    };

    Scrollmanager.prototype._create = function() {
      var opt, self, timer;
      self = this;
      timer = {};
      opt = this.opt;
      if (!opt.vertical && !opt.horizontal) {
        return;
      }
      this.element.each(function(i, anchor) {
        var target;
        target = self._getTarget(anchor);
        if (!target) {
          return;
        }
        $.data(anchor, 'target', target);
        return $.data(target, 'trigger', anchor);
      });
      this.element.on("click.scrollmanager", function(e) {
        var clickedAnchor, style, target, trigger, x, y;
        trigger = e.currentTarget;
        target = $.data(trigger, 'target');
        if (!target || !self.$body) {
          return true;
        }
        x = Math.floor($(target).offset().left) + opt.offsetX;
        y = Math.floor($(target).offset().top) + opt.offsetY;
        style = {};
        if (opt.horizontal) {
          style.scrollLeft = x;
        }
        if (opt.vertical) {
          style.scrollTop = y;
        }
        $.data(window, 'preventHighlight', 1);
        self.$body.animate(style, {
          easing: opt.easing,
          duration: opt.duration,
          complete: (function() {
            var _target, _trigger;
            _target = target;
            _trigger = trigger;
            return function() {
              opt.complete(_target, _trigger);
              _target = null;
              _trigger = null;
              return setTimeout(function() {
                return $.removeData(window, 'preventHighlight');
              }, opt.delay + 250);
            };
          })()
        });
        clickedAnchor = this;
        self.element.each(function(i, anchor) {
          if (anchor === clickedAnchor) {
            return self._focus($.data(anchor, 'target'), anchor);
          } else {
            return self._blur($.data(anchor, 'target'), anchor);
          }
        });
        return e.preventDefault();
      });
      $(window).on('scroll.scrollmanager', function() {
        clearTimeout(timer);
        return timer = setTimeout(function() {
          if ($.data(window, 'preventHighlight')) {
            return;
          }
          return self._detectScroll();
        }, opt.delay);
      });
      this._detectScrollBody();
      return this._detectScroll();
    };

    Scrollmanager.prototype._detectScrollBody = function() {
      var $win, currentScrollTop;
      $win = $(window);
      currentScrollTop = $win.scrollTop();
      $win.scrollTop(currentScrollTop + 1);
      if ($('html').scrollTop() > 0) {
        this.$body = $('html');
      } else if ($('body').scrollTop() > 0) {
        this.$body = $('body');
      } else {
        this.$body = $('html, body');
      }
      return $win.scrollTop(currentScrollTop);
    };

    Scrollmanager.prototype._getTarget = function(linkElement) {
      var hash, href;
      href = $(linkElement).attr('href');
      if (!href) {
        return false;
      }
      hash = href.slice(href.lastIndexOf('#'));
      if (hash.charAt(0) !== '#') {
        return false;
      }
      if (hash) {
        return $(hash)[0];
      }
    };

    Scrollmanager.prototype._detectScroll = function() {
      var opt, scrollX, scrollY, self, winCenterX, winCenterY, x, y;
      self = this;
      opt = this.opt;
      scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
      scrollY = document.documentElement.scrollTop || document.body.scrollTop;
      winCenterX = Math.floor($(window).width() / 2);
      winCenterY = Math.floor($(window).height() / 2);
      x = scrollX + winCenterX;
      y = scrollY + winCenterY;
      return this.element.each(function(i, trigger) {
        var $target, judgeX, judgeY, target;
        target = $.data(trigger, 'target');
        if (!target) {
          return;
        }
        $target = $(target);
        judgeX = null;
        judgeY = null;
        if (opt.horizontal) {
          judgeX = x >= $target.offset().left && x < ($target.offset().left + $target.outerWidth());
        } else {
          judgeX = true;
        }
        if (opt.vertical) {
          judgeY = y >= $target.offset().top && y < ($target.offset().top + $target.outerHeight());
        } else {
          judgeY = true;
        }
        if (judgeX && judgeY) {
          self._focus(target, trigger);
          return opt.complete(target, trigger);
        } else {
          return self._blur(target, trigger);
        }
      });
    };

    Scrollmanager.prototype._focus = function(target, trigger) {
      $(target).addClass(this.opt.className);
      return $(trigger).addClass(this.opt.className);
    };

    Scrollmanager.prototype._blur = function(target, trigger) {
      $(target).removeClass(this.opt.className);
      return $(trigger).removeClass(this.opt.className);
    };

    return Scrollmanager;

  })();

}).call(this);
