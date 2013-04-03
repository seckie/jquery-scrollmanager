/**
 * $.scrollmanager
 * smooth scrolling and highlight some element with scrolling
 *
 * @author     Naoki Sekiguchi (http://likealunatic.jp)
 * @copyright  Naoki Sekiguchi (http://likealunatic.jp)
 * @license    http://www.opensource.org/licenses/mit-license.html  MIT License
 * @version    Release: 1.0
 * @since      2011-12-17
 */

;(function($, window, document, undefined) {

$.fn.scrollmanager = function (options) {
	var opt = options || {};
	opt.element = this;
	this.data('scrollmanager', new Scrollmanager(opt));
	return this;
};
function Scrollmanager() {
	// extend default options
	this.options = {};
	$.extend(this.options, this.defaultOptions, arguments[0]);
	this.element = arguments[0].element;
	// to save target element
	this.targets = [];
	// initialize
	this._create();
}
Scrollmanager.prototype = {
	defaultOptions: {
		element: {},
		delay: 500,
		className: 'on',
		easing: 'swing',
		duration: 750,
		vertical: true,
		horizontal: true
	},
	_create: function () {
		var self = this;
		var timer = {};
		var options = this.options;
		if (!options.vertical && !options.horizontal) { return; }

		this.element.each(function (i, anchor) {
			var target = self._getTarget(anchor);
			if (!target) { return; }
			// store each target data
			$.data(anchor, 'target', target);
			$.data(target, 'trigger', anchor);
		});

		this.element.on("click.scrollmanager", function(e) {
			var target = $.data(this, 'target');
			if (!target) { return; }
			var x = Math.floor($(target).offset().left);
			var y = Math.floor($(target).offset().top);
			var style = {};
			if (options.horizontal) { style.scrollLeft = x; }
			if (options.vertical) { style.scrollTop = y; }
			// to prevent highlight
			$.data(window, 'preventHighlight', 1);
			$('html, body').animate(style, {
				easing: options.easing,
				duration: options.duration,
				complete: function () {
					// clear preventing highlight with some delay
					setTimeout(function () {
						$.removeData(window, 'preventHighlight');
					}, options.delay + 250);
				}
			});
			// controll focus & blur
			var clickedAnchor = this;
			self.element.each(function (i, anchor) {
				if (anchor === clickedAnchor) {
					self._focus($.data(anchor, 'target'), anchor);
				} else {
					self._blur($.data(anchor, 'target'), anchor);
				}
			});
			e.preventDefault();
		});

		$(window).on('scroll.scrollmanager', function () {
			clearTimeout(timer);
			timer = setTimeout(function () {
				// if 'preventHighLight' flag is enabled, do nothing
				if ($.data(window, 'preventHighlight')) { return; }
				self._detectScroll();
			}, options.delay);
		});

		// initialize
		self._detectScroll();
	},
	_getTarget: function (linkElement) {
		var href = $(linkElement).attr('href');
		if (!href) { return false; }
		var hash = href.slice(href.lastIndexOf('#'));
		if (hash.charAt(0) != '#') {
			// This link has no hash
			return false;
		}
		if (hash) { return $(hash)[0]; }
	},
	_detectScroll: function () {
		var self = this;
		// get document scroll top position
		var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
		var scrollY = document.documentElement.scrollTop || document.body.scrollTop;
		// get window center position
		var winCenterX = Math.floor($(window).width() / 2);
		var winCenterY = Math.floor($(window).height() / 2);
		// compute target position
		var x = scrollX + winCenterX;
		var y = scrollY + winCenterY;

		this.element.each(function (i, trigger) {
			var target = $.data(trigger, 'target');
			if (!target) { return; }
			var $target = $(target);
			var judgeX, judgeY;
			if (self.options.horizontal) {
				judgeX = (x >= $target.offset().left &&
					x < ($target.offset().left + $target.outerWidth()));
			} else {
				// if no "horizontal" option, go threw X-axis judge
				judgeX = true;
			}
			if (self.options.vertical) {
				judgeY = (y >= $target.offset().top &&
					y < ($target.offset().top + $target.outerHeight()));
			} else {
				// if no "vertical" option, go threw Y-axis judge
				judgeY = true;
			}
			if (judgeX && judgeY) {
				self._focus(target, trigger);
			} else {
				self._blur(target, trigger)
			}
		});
	},
	_focus: function (target, trigger) {
		$(target).addClass(this.options.className);
		$(trigger).addClass(this.options.className);
	},
	_blur: function (target, trigger) {
		$(target).removeClass(this.options.className);
		$(trigger).removeClass(this.options.className);
	}
};

})(jQuery, this, this.document);
