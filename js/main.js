//
// Copyright 2016 Art. Lebedev Studio. All Rights Reserved.
// Created on 2016.03.22
//
// This source code follows Google JavaScript Style Guide
// http://google-styleguide.googlecode.com/svn/trunk/javascriptguide.xml
//

/**
 * @author Evgeny Kuleshov (egroont@gmail.com)
 */

var g = g || {};

g.Main = function(root) {
  /**
   * @type {jQuery}
   * @private
   */
  this.root_ = root;

  /**
   * @type {jQuery}
   * @private
   */
  this.elems_ = this.root_.find('.elem');

  /**
   * @type {jQuery}
   * @private
   */
  this.holes_ = this.elems_.find('.hole');

  /**
   * @type {number}
   * @private
   */
  this.count_ = this.elems_.size();

  /**
   * @type {Array.<number>}
   * @private
   */
  this.targets_ = [];

  /**
   * @type {Array.<number>}
   * @private
   */
  this.blocked_ = [];

  /**
   * @type {boolean}
   * @private
   */
  this.isFinished_ = false;

  this.init_();
  this.attachEvents_();
};


/**
 * @private
 */
g.Main.prototype.init_ = function() {

  var that = this;

  this.elems_.css('background-size', window.innerWidth + 'px auto');

  var elemWidth = this.elems_.eq(0).width();

  this.elems_.each(function(i) {
    var value = g.randomInteger(0, window.innerWidth);
    $(this)[0].style.backgroundPosition = - value + 'px' + ' ' + 0;
    $(this).attr('data-correct', - i * elemWidth);
    that.targets_.push(i);
  });

  this.targets_.sort(function() {
    return .5 - Math.random();
  });
};


/**
 * @private
 */
g.Main.prototype.attachEvents_ = function() {
  var that = this;

  this.elems_.bind('mousewheel DOMMouseScroll touchmove', function(e) {
    if (that.isFinished_) {
      return;
    }

    var e0 = e.originalEvent,
        delta = e0.wheelDelta || -e0.detail;

    var target = that.elems_.eq(
        that.getTargetId_(parseInt($(this).attr('data-id')), 10));

    // var elem = $(target)[0];

    // var elem = e.target;

    var elems = that.elems_;
    // var epicenter = elems.indexOf(e.target);
    var epicenter = Array.prototype.indexOf.call(elems, e.target);

    var k;
    var coeff = 10;
    var shiftCoeff = 2;
    var blocked = that.blocked_;

    for (var i = 0; i < elems.length; i++) {
      var elem = elems[i];
      if (!blocked.includes(i)){
        if (i < epicenter){
          k = epicenter - i;
          k = shiftCoeff * k / coeff;
        }
        if (i > epicenter){
          k = i - epicenter;
          k = shiftCoeff * k / coeff;
        }
        if (i == epicenter){
          k = 1 / coeff;
        }
          var value = parseInt(elem.style.backgroundPosition, 10);

          elem.style.backgroundPosition = value + ((delta < 0) ? 1 : -1) * coeff * k + 'px 0';

          that.checkFinish_(elem);
          e.preventDefault();
      }
    }

    // for (var i = 0; i < that.elems_.length; i++) {
    //   var elem = that.elems_[i];
    //   if (elem == e.target){
    //     foundIndex = -foundIndex;
    //   } else {
    //     var value = parseInt(elem.style.backgroundPosition, 10);

    //     epicenter *= foundIndex * 2;

    //     elem.style.backgroundPosition = value + ((delta < 0) ? 1 : -1) * 30 * (i + 1) / epicenter + 'px 0';

    //     that.checkFinish_(elem);
    //   }
    //     e.preventDefault();
    // }

    // var value = parseInt(elem.style.backgroundPosition, 10);

    // elem.style.backgroundPosition = value + ((delta < 0) ? 1 : -1) * 30 + 'px 0';

    // that.checkFinish_(elem);
    // e.preventDefault();
  });


  this.elems_.bind("click", function(e) {
    if (that.isFinished_) {
      return;
    }

    var blocked = that.blocked_;
    var index = Array.prototype.indexOf.call(that.elems_, e.target);
    var indexInBlockedArray = Array.prototype.indexOf.call(blocked, index);
    
    if (indexInBlockedArray > -1){
      that.blocked_.splice(indexInBlockedArray, 1);
    } else{
      that.blocked_.push(index);
    }

  });

};


/**
 * @private
 */
g.Main.prototype.getTargetId_ = function(id) {
  return this.targets_[id];
};


/**
 * @private
 */
g.Main.prototype.checkFinish_ = function(root) {

  var current = parseInt(root.style.backgroundPosition);
  var correct = parseInt($(root).attr('data-correct'));

  while (current > window.innerWidth) {
    current -= window.innerWidth;
  }

  while (current < - window.innerWidth) {
    current += window.innerWidth;
  }

  if (current >= correct - 50 && current <= correct + 50) {
    $(root).attr('data-done', true);
  } else {
    $(root).attr('data-done', false);
  }


  var done = true;

  for (var i = 0, len = this.elems_.size(); i < len; i++) {
    if ($(this).attr('data-done') !== 'true') {
      done = false;
      break;
    }
  }

  if (done) {
    this.finished_();
  }
};



/**
 * @private
 */
g.Main.prototype.finished_ = function() {
  this.isFinished_ = true;

  this.elems_.each(function () {
    var correct = parseInt($(this).attr('data-correct'));

    $(this)[0].style.backgroundPosition = correct + 'px 0';
  });
};



/**
 * @param {number} from  Integer minimum.
 * @param {number} to  Integer maximum.
 * @return {number}
 */
g.randomInteger = function(from, to) {
  return Math.round(from + Math.random() * (to - from));
};




new g.Main($('.maze'));