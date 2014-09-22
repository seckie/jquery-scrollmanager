###
 $.scrollmanager
 smooth scrolling and highlight some element with scrolling

 @author   Naoki Sekiguchi (http:#likealunatic.jp)
 @url      https://github.com/seckie/jquery-scrollmanager
 @license  http:#www.opensource.org/licenses/mit-license.html  MIT License
 @since    2011-12-17
###
'use strict'

$.fn.scrollmanager = (opt) ->
  opt = opt || {}
  opt.element = @
  @data('scrollmanager', new Scrollmanager(opt))
  return @

class Scrollmanager
  constructor: () ->
    console.log 'passed option:', arguments
    # extend default opt
    @opt = {}
    $.extend(@opt, @defaultOptions, arguments[0])
    @element = arguments[0].element
    # to save target element
    @targets = []
    # initialize
    @_create()

  defaultOptions:
    element: {},
    delay: 500,
    className: 'on',
    easing: 'swing',
    duration: 750,
    vertical: true,
    horizontal: true,
    offsetX: 0,
    offsetY: 0,
    complete: (target, trigger) ->

  _create: () ->
    self = this
    timer = {}
    opt = @opt
    if !opt.vertical and !opt.horizontal
      return

    @element.each((i, anchor) ->
      target = self._getTarget(anchor)
      if !target
        return
      # store each target data
      $.data(anchor, 'target', target)
      $.data(target, 'trigger', anchor)
    )

    @element.on("click.scrollmanager", (e) ->
      trigger = e.currentTarget
      target = $.data(trigger, 'target')
      if !target or !self.$body
        return true # do nothing
      x = Math.floor($(target).offset().left) + opt.offsetX
      y = Math.floor($(target).offset().top) + opt.offsetY
      style = {}
      if opt.horizontal
        style.scrollLeft = x
      if opt.vertical
        style.scrollTop = y
      # to prevent highlight
      $.data(window, 'preventHighlight', 1)
      self.$body.animate(style,
        easing: opt.easing,
        duration: opt.duration,
        complete: (() ->
          _target = target
          _trigger = trigger
          return () ->
            opt.complete(_target, _trigger)
            _target = null
            _trigger = null
            # clear preventing highlight with some delay
            setTimeout(() ->
              $.removeData(window, 'preventHighlight')
            , opt.delay + 250)
        )()
      )
        # controll focus & blur
      clickedAnchor = this
      self.element.each((i, anchor) ->
        if anchor is clickedAnchor
          self._focus($.data(anchor, 'target'), anchor)
        else
          self._blur($.data(anchor, 'target'), anchor)
      )
      e.preventDefault()
    )

    $(window).on('scroll.scrollmanager', () ->
      clearTimeout(timer)
      timer = setTimeout(() ->
        # if 'preventHighLight' flag is enabled, do nothing
        if ($.data(window, 'preventHighlight'))
          return
        self._detectScroll()
      , opt.delay)
    )
    # initialize
    @_detectScrollBody()
    @_detectScroll()

  _detectScrollBody: () ->
    $win = $(window)
    currentScrollTop = $win.scrollTop()
    $win.scrollTop(currentScrollTop + 1)
    if ($('html').scrollTop() > 0)
      @$body = $('html')
    else if ($('body').scrollTop() > 0)
      @$body = $('body')
    else
      @$body = $('html, body')
    $win.scrollTop(currentScrollTop)

  _getTarget: (linkElement) ->
    href = $(linkElement).attr('href')
    if (!href)
      return false
    hash = href.slice(href.lastIndexOf('#'))
    if hash.charAt(0) isnt '#'
      # This link has no hash
      return false
    if (hash)
      return $(hash)[0]

  _detectScroll: () ->
    self = this
    opt = @opt
    # get document scroll top position
    scrollX = document.documentElement.scrollLeft or document.body.scrollLeft
    scrollY = document.documentElement.scrollTop or document.body.scrollTop
    # get window center position
    winCenterX = Math.floor($(window).width() / 2)
    winCenterY = Math.floor($(window).height() / 2)
    # compute target position
    x = scrollX + winCenterX
    y = scrollY + winCenterY

    @element.each((i, trigger) ->
      target = $.data(trigger, 'target')
      if (!target)
        return
      $target = $(target)
      judgeX = null
      judgeY = null
      if (opt.horizontal)
        judgeX = (x >= $target.offset().left and
          x < ($target.offset().left + $target.outerWidth()))
      else
        # if no "horizontal" option, go threw X-axis judge
        judgeX = true
      if (opt.vertical)
        judgeY = (y >= $target.offset().top and
          y < ($target.offset().top + $target.outerHeight()))
      else
        # if no "vertical" option, go threw Y-axis judge
        judgeY = true
      if (judgeX and judgeY)
        self._focus(target, trigger)
        opt.complete(target, trigger)
      else
        self._blur(target, trigger)
    )

  _focus: (target, trigger) ->
    $(target).addClass(@opt.className)
    $(trigger).addClass(@opt.className)

  _blur: (target, trigger) ->
    $(target).removeClass(@opt.className)
    $(trigger).removeClass(@opt.className)

