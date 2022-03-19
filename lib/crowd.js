"use strict";

var _Element$index;

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

(_Element$index = Element.index) !== null && _Element$index !== void 0 ? _Element$index : -1;
console.clear();
console.log('lsakdfalskjdflnksd');
var config = {
  src: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/175711/open-peeps-sheet.png',
  rows: 15,
  cols: 7
}; // UTILS

var randomRange = function randomRange(min, max) {
  return min + Math.random() * (max - min);
};

var randomIndex = function randomIndex(array) {
  return randomRange(0, array.length) | 0;
};

var removeFromArray = function removeFromArray(array, i) {
  return array.splice(i, 1)[0];
};

var removeItemFromArray = function removeItemFromArray(array, item) {
  return removeFromArray(array, array.indexOf(item));
};

var removeRandomFromArray = function removeRandomFromArray(array) {
  return removeFromArray(array, randomIndex(array));
};

var getRandomFromArray = function getRandomFromArray(array) {
  return array[randomIndex(array) | 0];
}; // TWEEN FACTORIES


var resetPeep = function resetPeep(_ref) {
  var stage = _ref.stage,
      peep = _ref.peep;
  var direction = Math.random() > 0.5 ? 1 : -1; // using an ease function to skew random to lower values to help hide that peeps have no legs

  var offsetY = 100 - 250 * gsap.parseEase('power2.in')(Math.random());
  var startY = stage.height - peep.height + offsetY;
  var startX;
  var endX;

  if (direction === 1) {
    startX = -peep.width;
    endX = stage.width;
    peep.scaleX = 1;
  } else {
    startX = stage.width + peep.width;
    endX = 0;
    peep.scaleX = -1;
  }

  peep.x = startX;
  peep.y = startY;
  peep.anchorY = startY;
  return {
    startX: startX,
    startY: startY,
    endX: endX
  };
};

var normalWalk = function normalWalk(_ref2) {
  var peep = _ref2.peep,
      props = _ref2.props;
  var startX = props.startX,
      startY = props.startY,
      endX = props.endX;
  var xDuration = 10;
  var yDuration = 0.25;
  var tl = gsap.timeline();
  tl.timeScale(randomRange(0.5, 1.5));
  tl.to(peep, {
    duration: xDuration,
    x: endX,
    ease: 'none'
  }, 0);
  tl.to(peep, {
    duration: yDuration,
    repeat: xDuration / yDuration,
    yoyo: true,
    y: startY - 10
  }, 0);
  return tl;
};

var walks = [normalWalk]; // CLASSES

var Peep = /*#__PURE__*/function () {
  function Peep(_ref3) {
    var image = _ref3.image,
        rect = _ref3.rect;

    _classCallCheck(this, Peep);

    this.image = image;
    this.setRect(rect);
    this.x = 0;
    this.y = 0;
    this.anchorY = 0;
    this.scaleX = 1;
    this.walk = null;
  }

  _createClass(Peep, [{
    key: "setRect",
    value: function setRect(rect) {
      this.rect = rect;
      this.width = rect[2];
      this.height = rect[3];
      this.drawArgs = [this.image].concat(_toConsumableArray(rect), [0, 0, this.width, this.height]);
    }
  }, {
    key: "render",
    value: function render(ctx) {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.scale(this.scaleX, 1);
      ctx.drawImage.apply(ctx, _toConsumableArray(this.drawArgs));
      ctx.restore();
    }
  }]);

  return Peep;
}(); // MAIN


var img = document.createElement('img');
img.onload = init;
img.src = config.src;
var canvas = document.querySelector('#canvas');
var ctx = canvas.getContext('2d');
var stage = {
  width: 0,
  height: 0
};
var allPeeps = [];
var availablePeeps = [];
var crowd = [];

function init() {
  createPeeps(); // resize also (re)populates the stage

  resize();
  gsap.ticker.add(render);
  window.addEventListener('resize', resize);
}

function createPeeps() {
  var rows = config.rows,
      cols = config.cols;
  var width = img.naturalWidth,
      height = img.naturalHeight;
  var total = rows * cols;
  var rectWidth = width / rows;
  var rectHeight = height / cols;

  for (var i = 0; i < total; i++) {
    allPeeps.push(new Peep({
      image: img,
      rect: [i % rows * rectWidth, (i / rows | 0) * rectHeight, rectWidth, rectHeight]
    }));
  }
}

function resize() {
  stage.width = canvas.clientWidth;
  stage.height = canvas.clientHeight;
  canvas.width = stage.width * devicePixelRatio;
  canvas.height = stage.height * devicePixelRatio;
  crowd.forEach(function (peep) {
    peep.walk.kill();
  });
  crowd.length = 0;
  availablePeeps.length = 0;
  availablePeeps.push.apply(availablePeeps, allPeeps);
  initCrowd();
}

function initCrowd() {
  while (availablePeeps.length) {
    // setting random tween progress spreads the peeps out
    addPeepToCrowd().walk.progress(Math.random());
  }
}

function addPeepToCrowd() {
  var peep = removeRandomFromArray(availablePeeps);
  var walk = getRandomFromArray(walks)({
    peep: peep,
    props: resetPeep({
      peep: peep,
      stage: stage
    })
  }).eventCallback('onComplete', function () {
    removePeepFromCrowd(peep);
    addPeepToCrowd();
  });
  peep.walk = walk;
  crowd.push(peep);
  crowd.sort(function (a, b) {
    return a.anchorY - b.anchorY;
  });
  return peep;
}

function removePeepFromCrowd(peep) {
  removeItemFromArray(crowd, peep);
  availablePeeps.push(peep);
}

function render() {
  canvas.width = canvas.width;
  ctx.save();
  ctx.scale(devicePixelRatio, devicePixelRatio);
  crowd.forEach(function (peep) {
    peep.render(ctx);
  });
  ctx.restore();
}