function isObject$2(obj) {
  return obj !== null && typeof obj === "object" && "constructor" in obj && obj.constructor === Object;
}
function extend$1(target = {}, src = {}) {
  const noExtend = ["__proto__", "constructor", "prototype"];
  Object.keys(src).filter((key) => noExtend.indexOf(key) < 0).forEach((key) => {
    if (typeof target[key] === "undefined") target[key] = src[key];
    else if (isObject$2(src[key]) && isObject$2(target[key]) && Object.keys(src[key]).length > 0) {
      extend$1(target[key], src[key]);
    }
  });
}
const ssrDocument = {
  body: {},
  addEventListener() {
  },
  removeEventListener() {
  },
  activeElement: {
    blur() {
    },
    nodeName: ""
  },
  querySelector() {
    return null;
  },
  querySelectorAll() {
    return [];
  },
  getElementById() {
    return null;
  },
  createEvent() {
    return {
      initEvent() {
      }
    };
  },
  createElement() {
    return {
      children: [],
      childNodes: [],
      style: {},
      setAttribute() {
      },
      getElementsByTagName() {
        return [];
      }
    };
  },
  createElementNS() {
    return {};
  },
  importNode() {
    return null;
  },
  location: {
    hash: "",
    host: "",
    hostname: "",
    href: "",
    origin: "",
    pathname: "",
    protocol: "",
    search: ""
  }
};
function getDocument() {
  const doc = typeof document !== "undefined" ? document : {};
  extend$1(doc, ssrDocument);
  return doc;
}
const ssrWindow = {
  document: ssrDocument,
  navigator: {
    userAgent: ""
  },
  location: {
    hash: "",
    host: "",
    hostname: "",
    href: "",
    origin: "",
    pathname: "",
    protocol: "",
    search: ""
  },
  history: {
    replaceState() {
    },
    pushState() {
    },
    go() {
    },
    back() {
    }
  },
  CustomEvent: function CustomEvent2() {
    return this;
  },
  addEventListener() {
  },
  removeEventListener() {
  },
  getComputedStyle() {
    return {
      getPropertyValue() {
        return "";
      }
    };
  },
  Image() {
  },
  Date() {
  },
  screen: {},
  setTimeout() {
  },
  clearTimeout() {
  },
  matchMedia() {
    return {};
  },
  requestAnimationFrame(callback) {
    if (typeof setTimeout === "undefined") {
      callback();
      return null;
    }
    return setTimeout(callback, 0);
  },
  cancelAnimationFrame(id) {
    if (typeof setTimeout === "undefined") {
      return;
    }
    clearTimeout(id);
  }
};
function getWindow() {
  const win = typeof window !== "undefined" ? window : {};
  extend$1(win, ssrWindow);
  return win;
}
function classesToTokens(classes2 = "") {
  return classes2.trim().split(" ").filter((c2) => !!c2.trim());
}
function deleteProps(obj) {
  const object = obj;
  Object.keys(object).forEach((key) => {
    try {
      object[key] = null;
    } catch (e2) {
    }
    try {
      delete object[key];
    } catch (e2) {
    }
  });
}
function nextTick(callback, delay = 0) {
  return setTimeout(callback, delay);
}
function now() {
  return Date.now();
}
function getComputedStyle$1(el) {
  const window2 = getWindow();
  let style;
  if (window2.getComputedStyle) {
    style = window2.getComputedStyle(el, null);
  }
  if (!style && el.currentStyle) {
    style = el.currentStyle;
  }
  if (!style) {
    style = el.style;
  }
  return style;
}
function getTranslate(el, axis = "x") {
  const window2 = getWindow();
  let matrix;
  let curTransform;
  let transformMatrix;
  const curStyle = getComputedStyle$1(el);
  if (window2.WebKitCSSMatrix) {
    curTransform = curStyle.transform || curStyle.webkitTransform;
    if (curTransform.split(",").length > 6) {
      curTransform = curTransform.split(", ").map((a2) => a2.replace(",", ".")).join(", ");
    }
    transformMatrix = new window2.WebKitCSSMatrix(curTransform === "none" ? "" : curTransform);
  } else {
    transformMatrix = curStyle.MozTransform || curStyle.OTransform || curStyle.MsTransform || curStyle.msTransform || curStyle.transform || curStyle.getPropertyValue("transform").replace("translate(", "matrix(1, 0, 0, 1,");
    matrix = transformMatrix.toString().split(",");
  }
  if (axis === "x") {
    if (window2.WebKitCSSMatrix) curTransform = transformMatrix.m41;
    else if (matrix.length === 16) curTransform = parseFloat(matrix[12]);
    else curTransform = parseFloat(matrix[4]);
  }
  if (axis === "y") {
    if (window2.WebKitCSSMatrix) curTransform = transformMatrix.m42;
    else if (matrix.length === 16) curTransform = parseFloat(matrix[13]);
    else curTransform = parseFloat(matrix[5]);
  }
  return curTransform || 0;
}
function isObject$1(o2) {
  return typeof o2 === "object" && o2 !== null && o2.constructor && Object.prototype.toString.call(o2).slice(8, -1) === "Object";
}
function isNode(node) {
  if (typeof window !== "undefined" && typeof window.HTMLElement !== "undefined") {
    return node instanceof HTMLElement;
  }
  return node && (node.nodeType === 1 || node.nodeType === 11);
}
function extend(...args) {
  const to = Object(args[0]);
  const noExtend = ["__proto__", "constructor", "prototype"];
  for (let i2 = 1; i2 < args.length; i2 += 1) {
    const nextSource = args[i2];
    if (nextSource !== void 0 && nextSource !== null && !isNode(nextSource)) {
      const keysArray = Object.keys(Object(nextSource)).filter((key) => noExtend.indexOf(key) < 0);
      for (let nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex += 1) {
        const nextKey = keysArray[nextIndex];
        const desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
        if (desc !== void 0 && desc.enumerable) {
          if (isObject$1(to[nextKey]) && isObject$1(nextSource[nextKey])) {
            if (nextSource[nextKey].__swiper__) {
              to[nextKey] = nextSource[nextKey];
            } else {
              extend(to[nextKey], nextSource[nextKey]);
            }
          } else if (!isObject$1(to[nextKey]) && isObject$1(nextSource[nextKey])) {
            to[nextKey] = {};
            if (nextSource[nextKey].__swiper__) {
              to[nextKey] = nextSource[nextKey];
            } else {
              extend(to[nextKey], nextSource[nextKey]);
            }
          } else {
            to[nextKey] = nextSource[nextKey];
          }
        }
      }
    }
  }
  return to;
}
function setCSSProperty(el, varName, varValue) {
  el.style.setProperty(varName, varValue);
}
function animateCSSModeScroll({
  swiper,
  targetPosition,
  side
}) {
  const window2 = getWindow();
  const startPosition = -swiper.translate;
  let startTime = null;
  let time;
  const duration = swiper.params.speed;
  swiper.wrapperEl.style.scrollSnapType = "none";
  window2.cancelAnimationFrame(swiper.cssModeFrameID);
  const dir = targetPosition > startPosition ? "next" : "prev";
  const isOutOfBound = (current, target) => {
    return dir === "next" && current >= target || dir === "prev" && current <= target;
  };
  const animate = () => {
    time = (/* @__PURE__ */ new Date()).getTime();
    if (startTime === null) {
      startTime = time;
    }
    const progress = Math.max(Math.min((time - startTime) / duration, 1), 0);
    const easeProgress = 0.5 - Math.cos(progress * Math.PI) / 2;
    let currentPosition = startPosition + easeProgress * (targetPosition - startPosition);
    if (isOutOfBound(currentPosition, targetPosition)) {
      currentPosition = targetPosition;
    }
    swiper.wrapperEl.scrollTo({
      [side]: currentPosition
    });
    if (isOutOfBound(currentPosition, targetPosition)) {
      swiper.wrapperEl.style.overflow = "hidden";
      swiper.wrapperEl.style.scrollSnapType = "";
      setTimeout(() => {
        swiper.wrapperEl.style.overflow = "";
        swiper.wrapperEl.scrollTo({
          [side]: currentPosition
        });
      });
      window2.cancelAnimationFrame(swiper.cssModeFrameID);
      return;
    }
    swiper.cssModeFrameID = window2.requestAnimationFrame(animate);
  };
  animate();
}
function getSlideTransformEl(slideEl) {
  return slideEl.querySelector(".swiper-slide-transform") || slideEl.shadowRoot && slideEl.shadowRoot.querySelector(".swiper-slide-transform") || slideEl;
}
function elementChildren(element, selector = "") {
  const window2 = getWindow();
  const children = [...element.children];
  if (window2.HTMLSlotElement && element instanceof HTMLSlotElement) {
    children.push(...element.assignedElements());
  }
  if (!selector) {
    return children;
  }
  return children.filter((el) => el.matches(selector));
}
function elementIsChildOfSlot(el, slot) {
  const elementsQueue = [slot];
  while (elementsQueue.length > 0) {
    const elementToCheck = elementsQueue.shift();
    if (el === elementToCheck) {
      return true;
    }
    elementsQueue.push(...elementToCheck.children, ...elementToCheck.shadowRoot ? elementToCheck.shadowRoot.children : [], ...elementToCheck.assignedElements ? elementToCheck.assignedElements() : []);
  }
}
function elementIsChildOf(el, parent) {
  const window2 = getWindow();
  let isChild = parent.contains(el);
  if (!isChild && window2.HTMLSlotElement && parent instanceof HTMLSlotElement) {
    const children = [...parent.assignedElements()];
    isChild = children.includes(el);
    if (!isChild) {
      isChild = elementIsChildOfSlot(el, parent);
    }
  }
  return isChild;
}
function showWarning(text) {
  try {
    console.warn(text);
    return;
  } catch (err) {
  }
}
function createElement(tag, classes2 = []) {
  const el = document.createElement(tag);
  el.classList.add(...Array.isArray(classes2) ? classes2 : classesToTokens(classes2));
  return el;
}
function elementOffset(el) {
  const window2 = getWindow();
  const document2 = getDocument();
  const box = el.getBoundingClientRect();
  const body = document2.body;
  const clientTop = el.clientTop || body.clientTop || 0;
  const clientLeft = el.clientLeft || body.clientLeft || 0;
  const scrollTop = el === window2 ? window2.scrollY : el.scrollTop;
  const scrollLeft = el === window2 ? window2.scrollX : el.scrollLeft;
  return {
    top: box.top + scrollTop - clientTop,
    left: box.left + scrollLeft - clientLeft
  };
}
function elementPrevAll(el, selector) {
  const prevEls = [];
  while (el.previousElementSibling) {
    const prev = el.previousElementSibling;
    if (selector) {
      if (prev.matches(selector)) prevEls.push(prev);
    } else prevEls.push(prev);
    el = prev;
  }
  return prevEls;
}
function elementNextAll(el, selector) {
  const nextEls = [];
  while (el.nextElementSibling) {
    const next = el.nextElementSibling;
    if (selector) {
      if (next.matches(selector)) nextEls.push(next);
    } else nextEls.push(next);
    el = next;
  }
  return nextEls;
}
function elementStyle(el, prop) {
  const window2 = getWindow();
  return window2.getComputedStyle(el, null).getPropertyValue(prop);
}
function elementIndex(el) {
  let child = el;
  let i2;
  if (child) {
    i2 = 0;
    while ((child = child.previousSibling) !== null) {
      if (child.nodeType === 1) i2 += 1;
    }
    return i2;
  }
  return void 0;
}
function elementParents(el, selector) {
  const parents = [];
  let parent = el.parentElement;
  while (parent) {
    if (selector) {
      if (parent.matches(selector)) parents.push(parent);
    } else {
      parents.push(parent);
    }
    parent = parent.parentElement;
  }
  return parents;
}
function elementTransitionEnd(el, callback) {
  function fireCallBack(e2) {
    if (e2.target !== el) return;
    callback.call(el, e2);
    el.removeEventListener("transitionend", fireCallBack);
  }
  if (callback) {
    el.addEventListener("transitionend", fireCallBack);
  }
}
function elementOuterSize(el, size, includeMargins) {
  const window2 = getWindow();
  {
    return el[size === "width" ? "offsetWidth" : "offsetHeight"] + parseFloat(window2.getComputedStyle(el, null).getPropertyValue(size === "width" ? "margin-right" : "margin-top")) + parseFloat(window2.getComputedStyle(el, null).getPropertyValue(size === "width" ? "margin-left" : "margin-bottom"));
  }
}
function makeElementsArray(el) {
  return (Array.isArray(el) ? el : [el]).filter((e2) => !!e2);
}
function getRotateFix(swiper) {
  return (v2) => {
    if (Math.abs(v2) > 0 && swiper.browser && swiper.browser.need3dFix && Math.abs(v2) % 90 === 0) {
      return v2 + 1e-3;
    }
    return v2;
  };
}
function setInnerHTML(el, html = "") {
  if (typeof trustedTypes !== "undefined") {
    el.innerHTML = trustedTypes.createPolicy("html", {
      createHTML: (s2) => s2
    }).createHTML(html);
  } else {
    el.innerHTML = html;
  }
}
let support;
function calcSupport() {
  const window2 = getWindow();
  const document2 = getDocument();
  return {
    smoothScroll: document2.documentElement && document2.documentElement.style && "scrollBehavior" in document2.documentElement.style,
    touch: !!("ontouchstart" in window2 || window2.DocumentTouch && document2 instanceof window2.DocumentTouch)
  };
}
function getSupport() {
  if (!support) {
    support = calcSupport();
  }
  return support;
}
let deviceCached;
function calcDevice({
  userAgent
} = {}) {
  const support2 = getSupport();
  const window2 = getWindow();
  const platform = window2.navigator.platform;
  const ua = userAgent || window2.navigator.userAgent;
  const device = {
    ios: false,
    android: false
  };
  const screenWidth = window2.screen.width;
  const screenHeight = window2.screen.height;
  const android = ua.match(/(Android);?[\s\/]+([\d.]+)?/);
  let ipad = ua.match(/(iPad)(?!\1).*OS\s([\d_]+)/);
  const ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/);
  const iphone = !ipad && ua.match(/(iPhone\sOS|iOS)\s([\d_]+)/);
  const windows = platform === "Win32";
  let macos = platform === "MacIntel";
  const iPadScreens = ["1024x1366", "1366x1024", "834x1194", "1194x834", "834x1112", "1112x834", "768x1024", "1024x768", "820x1180", "1180x820", "810x1080", "1080x810"];
  if (!ipad && macos && support2.touch && iPadScreens.indexOf(`${screenWidth}x${screenHeight}`) >= 0) {
    ipad = ua.match(/(Version)\/([\d.]+)/);
    if (!ipad) ipad = [0, 1, "13_0_0"];
    macos = false;
  }
  if (android && !windows) {
    device.os = "android";
    device.android = true;
  }
  if (ipad || iphone || ipod) {
    device.os = "ios";
    device.ios = true;
  }
  return device;
}
function getDevice(overrides = {}) {
  if (!deviceCached) {
    deviceCached = calcDevice(overrides);
  }
  return deviceCached;
}
let browser;
function calcBrowser() {
  const window2 = getWindow();
  const device = getDevice();
  let needPerspectiveFix = false;
  function isSafari() {
    const ua = window2.navigator.userAgent.toLowerCase();
    return ua.indexOf("safari") >= 0 && ua.indexOf("chrome") < 0 && ua.indexOf("android") < 0;
  }
  if (isSafari()) {
    const ua = String(window2.navigator.userAgent);
    if (ua.includes("Version/")) {
      const [major, minor] = ua.split("Version/")[1].split(" ")[0].split(".").map((num) => Number(num));
      needPerspectiveFix = major < 16 || major === 16 && minor < 2;
    }
  }
  const isWebView = /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(window2.navigator.userAgent);
  const isSafariBrowser = isSafari();
  const need3dFix = isSafariBrowser || isWebView && device.ios;
  return {
    isSafari: needPerspectiveFix || isSafariBrowser,
    needPerspectiveFix,
    need3dFix,
    isWebView
  };
}
function getBrowser() {
  if (!browser) {
    browser = calcBrowser();
  }
  return browser;
}
function Resize({
  swiper,
  on,
  emit
}) {
  const window2 = getWindow();
  let observer = null;
  let animationFrame = null;
  const resizeHandler = () => {
    if (!swiper || swiper.destroyed || !swiper.initialized) return;
    emit("beforeResize");
    emit("resize");
  };
  const createObserver = () => {
    if (!swiper || swiper.destroyed || !swiper.initialized) return;
    observer = new ResizeObserver((entries) => {
      animationFrame = window2.requestAnimationFrame(() => {
        const {
          width,
          height
        } = swiper;
        let newWidth = width;
        let newHeight = height;
        entries.forEach(({
          contentBoxSize,
          contentRect,
          target
        }) => {
          if (target && target !== swiper.el) return;
          newWidth = contentRect ? contentRect.width : (contentBoxSize[0] || contentBoxSize).inlineSize;
          newHeight = contentRect ? contentRect.height : (contentBoxSize[0] || contentBoxSize).blockSize;
        });
        if (newWidth !== width || newHeight !== height) {
          resizeHandler();
        }
      });
    });
    observer.observe(swiper.el);
  };
  const removeObserver = () => {
    if (animationFrame) {
      window2.cancelAnimationFrame(animationFrame);
    }
    if (observer && observer.unobserve && swiper.el) {
      observer.unobserve(swiper.el);
      observer = null;
    }
  };
  const orientationChangeHandler = () => {
    if (!swiper || swiper.destroyed || !swiper.initialized) return;
    emit("orientationchange");
  };
  on("init", () => {
    if (swiper.params.resizeObserver && typeof window2.ResizeObserver !== "undefined") {
      createObserver();
      return;
    }
    window2.addEventListener("resize", resizeHandler);
    window2.addEventListener("orientationchange", orientationChangeHandler);
  });
  on("destroy", () => {
    removeObserver();
    window2.removeEventListener("resize", resizeHandler);
    window2.removeEventListener("orientationchange", orientationChangeHandler);
  });
}
function Observer({
  swiper,
  extendParams,
  on,
  emit
}) {
  const observers = [];
  const window2 = getWindow();
  const attach = (target, options = {}) => {
    const ObserverFunc = window2.MutationObserver || window2.WebkitMutationObserver;
    const observer = new ObserverFunc((mutations) => {
      if (swiper.__preventObserver__) return;
      if (mutations.length === 1) {
        emit("observerUpdate", mutations[0]);
        return;
      }
      const observerUpdate = function observerUpdate2() {
        emit("observerUpdate", mutations[0]);
      };
      if (window2.requestAnimationFrame) {
        window2.requestAnimationFrame(observerUpdate);
      } else {
        window2.setTimeout(observerUpdate, 0);
      }
    });
    observer.observe(target, {
      attributes: typeof options.attributes === "undefined" ? true : options.attributes,
      childList: swiper.isElement || (typeof options.childList === "undefined" ? true : options).childList,
      characterData: typeof options.characterData === "undefined" ? true : options.characterData
    });
    observers.push(observer);
  };
  const init = () => {
    if (!swiper.params.observer) return;
    if (swiper.params.observeParents) {
      const containerParents = elementParents(swiper.hostEl);
      for (let i2 = 0; i2 < containerParents.length; i2 += 1) {
        attach(containerParents[i2]);
      }
    }
    attach(swiper.hostEl, {
      childList: swiper.params.observeSlideChildren
    });
    attach(swiper.wrapperEl, {
      attributes: false
    });
  };
  const destroy = () => {
    observers.forEach((observer) => {
      observer.disconnect();
    });
    observers.splice(0, observers.length);
  };
  extendParams({
    observer: false,
    observeParents: false,
    observeSlideChildren: false
  });
  on("init", init);
  on("destroy", destroy);
}
var eventsEmitter = {
  on(events2, handler, priority) {
    const self = this;
    if (!self.eventsListeners || self.destroyed) return self;
    if (typeof handler !== "function") return self;
    const method = priority ? "unshift" : "push";
    events2.split(" ").forEach((event2) => {
      if (!self.eventsListeners[event2]) self.eventsListeners[event2] = [];
      self.eventsListeners[event2][method](handler);
    });
    return self;
  },
  once(events2, handler, priority) {
    const self = this;
    if (!self.eventsListeners || self.destroyed) return self;
    if (typeof handler !== "function") return self;
    function onceHandler(...args) {
      self.off(events2, onceHandler);
      if (onceHandler.__emitterProxy) {
        delete onceHandler.__emitterProxy;
      }
      handler.apply(self, args);
    }
    onceHandler.__emitterProxy = handler;
    return self.on(events2, onceHandler, priority);
  },
  onAny(handler, priority) {
    const self = this;
    if (!self.eventsListeners || self.destroyed) return self;
    if (typeof handler !== "function") return self;
    const method = priority ? "unshift" : "push";
    if (self.eventsAnyListeners.indexOf(handler) < 0) {
      self.eventsAnyListeners[method](handler);
    }
    return self;
  },
  offAny(handler) {
    const self = this;
    if (!self.eventsListeners || self.destroyed) return self;
    if (!self.eventsAnyListeners) return self;
    const index = self.eventsAnyListeners.indexOf(handler);
    if (index >= 0) {
      self.eventsAnyListeners.splice(index, 1);
    }
    return self;
  },
  off(events2, handler) {
    const self = this;
    if (!self.eventsListeners || self.destroyed) return self;
    if (!self.eventsListeners) return self;
    events2.split(" ").forEach((event2) => {
      if (typeof handler === "undefined") {
        self.eventsListeners[event2] = [];
      } else if (self.eventsListeners[event2]) {
        self.eventsListeners[event2].forEach((eventHandler, index) => {
          if (eventHandler === handler || eventHandler.__emitterProxy && eventHandler.__emitterProxy === handler) {
            self.eventsListeners[event2].splice(index, 1);
          }
        });
      }
    });
    return self;
  },
  emit(...args) {
    const self = this;
    if (!self.eventsListeners || self.destroyed) return self;
    if (!self.eventsListeners) return self;
    let events2;
    let data;
    let context;
    if (typeof args[0] === "string" || Array.isArray(args[0])) {
      events2 = args[0];
      data = args.slice(1, args.length);
      context = self;
    } else {
      events2 = args[0].events;
      data = args[0].data;
      context = args[0].context || self;
    }
    data.unshift(context);
    const eventsArray = Array.isArray(events2) ? events2 : events2.split(" ");
    eventsArray.forEach((event2) => {
      if (self.eventsAnyListeners && self.eventsAnyListeners.length) {
        self.eventsAnyListeners.forEach((eventHandler) => {
          eventHandler.apply(context, [event2, ...data]);
        });
      }
      if (self.eventsListeners && self.eventsListeners[event2]) {
        self.eventsListeners[event2].forEach((eventHandler) => {
          eventHandler.apply(context, data);
        });
      }
    });
    return self;
  }
};
function updateSize() {
  const swiper = this;
  let width;
  let height;
  const el = swiper.el;
  if (typeof swiper.params.width !== "undefined" && swiper.params.width !== null) {
    width = swiper.params.width;
  } else {
    width = el.clientWidth;
  }
  if (typeof swiper.params.height !== "undefined" && swiper.params.height !== null) {
    height = swiper.params.height;
  } else {
    height = el.clientHeight;
  }
  if (width === 0 && swiper.isHorizontal() || height === 0 && swiper.isVertical()) {
    return;
  }
  width = width - parseInt(elementStyle(el, "padding-left") || 0, 10) - parseInt(elementStyle(el, "padding-right") || 0, 10);
  height = height - parseInt(elementStyle(el, "padding-top") || 0, 10) - parseInt(elementStyle(el, "padding-bottom") || 0, 10);
  if (Number.isNaN(width)) width = 0;
  if (Number.isNaN(height)) height = 0;
  Object.assign(swiper, {
    width,
    height,
    size: swiper.isHorizontal() ? width : height
  });
}
function updateSlides() {
  const swiper = this;
  function getDirectionPropertyValue(node, label) {
    return parseFloat(node.getPropertyValue(swiper.getDirectionLabel(label)) || 0);
  }
  const params = swiper.params;
  const {
    wrapperEl,
    slidesEl,
    rtlTranslate: rtl,
    wrongRTL
  } = swiper;
  const isVirtual = swiper.virtual && params.virtual.enabled;
  const previousSlidesLength = isVirtual ? swiper.virtual.slides.length : swiper.slides.length;
  const slides = elementChildren(slidesEl, `.${swiper.params.slideClass}, swiper-slide`);
  const slidesLength = isVirtual ? swiper.virtual.slides.length : slides.length;
  let snapGrid = [];
  const slidesGrid = [];
  const slidesSizesGrid = [];
  let offsetBefore = params.slidesOffsetBefore;
  if (typeof offsetBefore === "function") {
    offsetBefore = params.slidesOffsetBefore.call(swiper);
  }
  let offsetAfter = params.slidesOffsetAfter;
  if (typeof offsetAfter === "function") {
    offsetAfter = params.slidesOffsetAfter.call(swiper);
  }
  const previousSnapGridLength = swiper.snapGrid.length;
  const previousSlidesGridLength = swiper.slidesGrid.length;
  const swiperSize = swiper.size - offsetBefore - offsetAfter;
  let spaceBetween = params.spaceBetween;
  let slidePosition = -offsetBefore;
  let prevSlideSize = 0;
  let index = 0;
  if (typeof swiperSize === "undefined") {
    return;
  }
  if (typeof spaceBetween === "string" && spaceBetween.indexOf("%") >= 0) {
    spaceBetween = parseFloat(spaceBetween.replace("%", "")) / 100 * swiperSize;
  } else if (typeof spaceBetween === "string") {
    spaceBetween = parseFloat(spaceBetween);
  }
  swiper.virtualSize = -spaceBetween - offsetBefore - offsetAfter;
  slides.forEach((slideEl) => {
    if (rtl) {
      slideEl.style.marginLeft = "";
    } else {
      slideEl.style.marginRight = "";
    }
    slideEl.style.marginBottom = "";
    slideEl.style.marginTop = "";
  });
  if (params.centeredSlides && params.cssMode) {
    setCSSProperty(wrapperEl, "--swiper-centered-offset-before", "");
    setCSSProperty(wrapperEl, "--swiper-centered-offset-after", "");
  }
  const gridEnabled = params.grid && params.grid.rows > 1 && swiper.grid;
  if (gridEnabled) {
    swiper.grid.initSlides(slides);
  } else if (swiper.grid) {
    swiper.grid.unsetSlides();
  }
  let slideSize;
  const shouldResetSlideSize = params.slidesPerView === "auto" && params.breakpoints && Object.keys(params.breakpoints).filter((key) => {
    return typeof params.breakpoints[key].slidesPerView !== "undefined";
  }).length > 0;
  for (let i2 = 0; i2 < slidesLength; i2 += 1) {
    slideSize = 0;
    const slide2 = slides[i2];
    if (slide2) {
      if (gridEnabled) {
        swiper.grid.updateSlide(i2, slide2, slides);
      }
      if (elementStyle(slide2, "display") === "none") continue;
    }
    if (isVirtual && params.slidesPerView === "auto") {
      if (params.virtual.slidesPerViewAutoSlideSize) {
        slideSize = params.virtual.slidesPerViewAutoSlideSize;
      }
      if (slideSize && slide2) {
        if (params.roundLengths) slideSize = Math.floor(slideSize);
        slide2.style[swiper.getDirectionLabel("width")] = `${slideSize}px`;
      }
    } else if (params.slidesPerView === "auto") {
      if (shouldResetSlideSize) {
        slide2.style[swiper.getDirectionLabel("width")] = ``;
      }
      const slideStyles = getComputedStyle(slide2);
      const currentTransform = slide2.style.transform;
      const currentWebKitTransform = slide2.style.webkitTransform;
      if (currentTransform) {
        slide2.style.transform = "none";
      }
      if (currentWebKitTransform) {
        slide2.style.webkitTransform = "none";
      }
      if (params.roundLengths) {
        slideSize = swiper.isHorizontal() ? elementOuterSize(slide2, "width") : elementOuterSize(slide2, "height");
      } else {
        const width = getDirectionPropertyValue(slideStyles, "width");
        const paddingLeft = getDirectionPropertyValue(slideStyles, "padding-left");
        const paddingRight = getDirectionPropertyValue(slideStyles, "padding-right");
        const marginLeft = getDirectionPropertyValue(slideStyles, "margin-left");
        const marginRight = getDirectionPropertyValue(slideStyles, "margin-right");
        const boxSizing = slideStyles.getPropertyValue("box-sizing");
        if (boxSizing && boxSizing === "border-box") {
          slideSize = width + marginLeft + marginRight;
        } else {
          const {
            clientWidth,
            offsetWidth
          } = slide2;
          slideSize = width + paddingLeft + paddingRight + marginLeft + marginRight + (offsetWidth - clientWidth);
        }
      }
      if (currentTransform) {
        slide2.style.transform = currentTransform;
      }
      if (currentWebKitTransform) {
        slide2.style.webkitTransform = currentWebKitTransform;
      }
      if (params.roundLengths) slideSize = Math.floor(slideSize);
    } else {
      slideSize = (swiperSize - (params.slidesPerView - 1) * spaceBetween) / params.slidesPerView;
      if (params.roundLengths) slideSize = Math.floor(slideSize);
      if (slide2) {
        slide2.style[swiper.getDirectionLabel("width")] = `${slideSize}px`;
      }
    }
    if (slide2) {
      slide2.swiperSlideSize = slideSize;
    }
    slidesSizesGrid.push(slideSize);
    if (params.centeredSlides) {
      slidePosition = slidePosition + slideSize / 2 + prevSlideSize / 2 + spaceBetween;
      if (prevSlideSize === 0 && i2 !== 0) slidePosition = slidePosition - swiperSize / 2 - spaceBetween;
      if (i2 === 0) slidePosition = slidePosition - swiperSize / 2 - spaceBetween;
      if (Math.abs(slidePosition) < 1 / 1e3) slidePosition = 0;
      if (params.roundLengths) slidePosition = Math.floor(slidePosition);
      if (index % params.slidesPerGroup === 0) snapGrid.push(slidePosition);
      slidesGrid.push(slidePosition);
    } else {
      if (params.roundLengths) slidePosition = Math.floor(slidePosition);
      if ((index - Math.min(swiper.params.slidesPerGroupSkip, index)) % swiper.params.slidesPerGroup === 0) snapGrid.push(slidePosition);
      slidesGrid.push(slidePosition);
      slidePosition = slidePosition + slideSize + spaceBetween;
    }
    swiper.virtualSize += slideSize + spaceBetween;
    prevSlideSize = slideSize;
    index += 1;
  }
  swiper.virtualSize = Math.max(swiper.virtualSize, swiperSize) + offsetAfter;
  if (rtl && wrongRTL && (params.effect === "slide" || params.effect === "coverflow")) {
    wrapperEl.style.width = `${swiper.virtualSize + spaceBetween}px`;
  }
  if (params.setWrapperSize) {
    wrapperEl.style[swiper.getDirectionLabel("width")] = `${swiper.virtualSize + spaceBetween}px`;
  }
  if (gridEnabled) {
    swiper.grid.updateWrapperSize(slideSize, snapGrid);
  }
  if (!params.centeredSlides) {
    const newSlidesGrid = [];
    for (let i2 = 0; i2 < snapGrid.length; i2 += 1) {
      let slidesGridItem = snapGrid[i2];
      if (params.roundLengths) slidesGridItem = Math.floor(slidesGridItem);
      if (snapGrid[i2] <= swiper.virtualSize - swiperSize) {
        newSlidesGrid.push(slidesGridItem);
      }
    }
    snapGrid = newSlidesGrid;
    if (Math.floor(swiper.virtualSize - swiperSize) - Math.floor(snapGrid[snapGrid.length - 1]) > 1) {
      snapGrid.push(swiper.virtualSize - swiperSize);
    }
  }
  if (isVirtual && params.loop) {
    const size = slidesSizesGrid[0] + spaceBetween;
    if (params.slidesPerGroup > 1) {
      const groups = Math.ceil((swiper.virtual.slidesBefore + swiper.virtual.slidesAfter) / params.slidesPerGroup);
      const groupSize = size * params.slidesPerGroup;
      for (let i2 = 0; i2 < groups; i2 += 1) {
        snapGrid.push(snapGrid[snapGrid.length - 1] + groupSize);
      }
    }
    for (let i2 = 0; i2 < swiper.virtual.slidesBefore + swiper.virtual.slidesAfter; i2 += 1) {
      if (params.slidesPerGroup === 1) {
        snapGrid.push(snapGrid[snapGrid.length - 1] + size);
      }
      slidesGrid.push(slidesGrid[slidesGrid.length - 1] + size);
      swiper.virtualSize += size;
    }
  }
  if (snapGrid.length === 0) snapGrid = [0];
  if (spaceBetween !== 0) {
    const key = swiper.isHorizontal() && rtl ? "marginLeft" : swiper.getDirectionLabel("marginRight");
    slides.filter((_2, slideIndex) => {
      if (!params.cssMode || params.loop) return true;
      if (slideIndex === slides.length - 1) {
        return false;
      }
      return true;
    }).forEach((slideEl) => {
      slideEl.style[key] = `${spaceBetween}px`;
    });
  }
  if (params.centeredSlides && params.centeredSlidesBounds) {
    let allSlidesSize = 0;
    slidesSizesGrid.forEach((slideSizeValue) => {
      allSlidesSize += slideSizeValue + (spaceBetween || 0);
    });
    allSlidesSize -= spaceBetween;
    const maxSnap = allSlidesSize > swiperSize ? allSlidesSize - swiperSize : 0;
    snapGrid = snapGrid.map((snap) => {
      if (snap <= 0) return -offsetBefore;
      if (snap > maxSnap) return maxSnap + offsetAfter;
      return snap;
    });
  }
  if (params.centerInsufficientSlides) {
    let allSlidesSize = 0;
    slidesSizesGrid.forEach((slideSizeValue) => {
      allSlidesSize += slideSizeValue + (spaceBetween || 0);
    });
    allSlidesSize -= spaceBetween;
    const offsetSize = (offsetBefore || 0) + (offsetAfter || 0);
    if (allSlidesSize + offsetSize < swiperSize) {
      const allSlidesOffset = (swiperSize - allSlidesSize - offsetSize) / 2;
      snapGrid.forEach((snap, snapIndex) => {
        snapGrid[snapIndex] = snap - allSlidesOffset;
      });
      slidesGrid.forEach((snap, snapIndex) => {
        slidesGrid[snapIndex] = snap + allSlidesOffset;
      });
    }
  }
  Object.assign(swiper, {
    slides,
    snapGrid,
    slidesGrid,
    slidesSizesGrid
  });
  if (params.centeredSlides && params.cssMode && !params.centeredSlidesBounds) {
    setCSSProperty(wrapperEl, "--swiper-centered-offset-before", `${-snapGrid[0]}px`);
    setCSSProperty(wrapperEl, "--swiper-centered-offset-after", `${swiper.size / 2 - slidesSizesGrid[slidesSizesGrid.length - 1] / 2}px`);
    const addToSnapGrid = -swiper.snapGrid[0];
    const addToSlidesGrid = -swiper.slidesGrid[0];
    swiper.snapGrid = swiper.snapGrid.map((v2) => v2 + addToSnapGrid);
    swiper.slidesGrid = swiper.slidesGrid.map((v2) => v2 + addToSlidesGrid);
  }
  if (slidesLength !== previousSlidesLength) {
    swiper.emit("slidesLengthChange");
  }
  if (snapGrid.length !== previousSnapGridLength) {
    if (swiper.params.watchOverflow) swiper.checkOverflow();
    swiper.emit("snapGridLengthChange");
  }
  if (slidesGrid.length !== previousSlidesGridLength) {
    swiper.emit("slidesGridLengthChange");
  }
  if (params.watchSlidesProgress) {
    swiper.updateSlidesOffset();
  }
  swiper.emit("slidesUpdated");
  if (!isVirtual && !params.cssMode && (params.effect === "slide" || params.effect === "fade")) {
    const backFaceHiddenClass = `${params.containerModifierClass}backface-hidden`;
    const hasClassBackfaceClassAdded = swiper.el.classList.contains(backFaceHiddenClass);
    if (slidesLength <= params.maxBackfaceHiddenSlides) {
      if (!hasClassBackfaceClassAdded) swiper.el.classList.add(backFaceHiddenClass);
    } else if (hasClassBackfaceClassAdded) {
      swiper.el.classList.remove(backFaceHiddenClass);
    }
  }
}
function updateAutoHeight(speed) {
  const swiper = this;
  const activeSlides = [];
  const isVirtual = swiper.virtual && swiper.params.virtual.enabled;
  let newHeight = 0;
  let i2;
  if (typeof speed === "number") {
    swiper.setTransition(speed);
  } else if (speed === true) {
    swiper.setTransition(swiper.params.speed);
  }
  const getSlideByIndex = (index) => {
    if (isVirtual) {
      return swiper.slides[swiper.getSlideIndexByData(index)];
    }
    return swiper.slides[index];
  };
  if (swiper.params.slidesPerView !== "auto" && swiper.params.slidesPerView > 1) {
    if (swiper.params.centeredSlides) {
      (swiper.visibleSlides || []).forEach((slide2) => {
        activeSlides.push(slide2);
      });
    } else {
      for (i2 = 0; i2 < Math.ceil(swiper.params.slidesPerView); i2 += 1) {
        const index = swiper.activeIndex + i2;
        if (index > swiper.slides.length && !isVirtual) break;
        activeSlides.push(getSlideByIndex(index));
      }
    }
  } else {
    activeSlides.push(getSlideByIndex(swiper.activeIndex));
  }
  for (i2 = 0; i2 < activeSlides.length; i2 += 1) {
    if (typeof activeSlides[i2] !== "undefined") {
      const height = activeSlides[i2].offsetHeight;
      newHeight = height > newHeight ? height : newHeight;
    }
  }
  if (newHeight || newHeight === 0) swiper.wrapperEl.style.height = `${newHeight}px`;
}
function updateSlidesOffset() {
  const swiper = this;
  const slides = swiper.slides;
  const minusOffset = swiper.isElement ? swiper.isHorizontal() ? swiper.wrapperEl.offsetLeft : swiper.wrapperEl.offsetTop : 0;
  for (let i2 = 0; i2 < slides.length; i2 += 1) {
    slides[i2].swiperSlideOffset = (swiper.isHorizontal() ? slides[i2].offsetLeft : slides[i2].offsetTop) - minusOffset - swiper.cssOverflowAdjustment();
  }
}
const toggleSlideClasses$1 = (slideEl, condition, className) => {
  if (condition && !slideEl.classList.contains(className)) {
    slideEl.classList.add(className);
  } else if (!condition && slideEl.classList.contains(className)) {
    slideEl.classList.remove(className);
  }
};
function updateSlidesProgress(translate2 = this && this.translate || 0) {
  const swiper = this;
  const params = swiper.params;
  const {
    slides,
    rtlTranslate: rtl,
    snapGrid
  } = swiper;
  if (slides.length === 0) return;
  if (typeof slides[0].swiperSlideOffset === "undefined") swiper.updateSlidesOffset();
  let offsetCenter = -translate2;
  if (rtl) offsetCenter = translate2;
  swiper.visibleSlidesIndexes = [];
  swiper.visibleSlides = [];
  let spaceBetween = params.spaceBetween;
  if (typeof spaceBetween === "string" && spaceBetween.indexOf("%") >= 0) {
    spaceBetween = parseFloat(spaceBetween.replace("%", "")) / 100 * swiper.size;
  } else if (typeof spaceBetween === "string") {
    spaceBetween = parseFloat(spaceBetween);
  }
  for (let i2 = 0; i2 < slides.length; i2 += 1) {
    const slide2 = slides[i2];
    let slideOffset = slide2.swiperSlideOffset;
    if (params.cssMode && params.centeredSlides) {
      slideOffset -= slides[0].swiperSlideOffset;
    }
    const slideProgress = (offsetCenter + (params.centeredSlides ? swiper.minTranslate() : 0) - slideOffset) / (slide2.swiperSlideSize + spaceBetween);
    const originalSlideProgress = (offsetCenter - snapGrid[0] + (params.centeredSlides ? swiper.minTranslate() : 0) - slideOffset) / (slide2.swiperSlideSize + spaceBetween);
    const slideBefore = -(offsetCenter - slideOffset);
    const slideAfter = slideBefore + swiper.slidesSizesGrid[i2];
    const isFullyVisible = slideBefore >= 0 && slideBefore <= swiper.size - swiper.slidesSizesGrid[i2];
    const isVisible = slideBefore >= 0 && slideBefore < swiper.size - 1 || slideAfter > 1 && slideAfter <= swiper.size || slideBefore <= 0 && slideAfter >= swiper.size;
    if (isVisible) {
      swiper.visibleSlides.push(slide2);
      swiper.visibleSlidesIndexes.push(i2);
    }
    toggleSlideClasses$1(slide2, isVisible, params.slideVisibleClass);
    toggleSlideClasses$1(slide2, isFullyVisible, params.slideFullyVisibleClass);
    slide2.progress = rtl ? -slideProgress : slideProgress;
    slide2.originalProgress = rtl ? -originalSlideProgress : originalSlideProgress;
  }
}
function updateProgress(translate2) {
  const swiper = this;
  if (typeof translate2 === "undefined") {
    const multiplier = swiper.rtlTranslate ? -1 : 1;
    translate2 = swiper && swiper.translate && swiper.translate * multiplier || 0;
  }
  const params = swiper.params;
  const translatesDiff = swiper.maxTranslate() - swiper.minTranslate();
  let {
    progress,
    isBeginning,
    isEnd,
    progressLoop
  } = swiper;
  const wasBeginning = isBeginning;
  const wasEnd = isEnd;
  if (translatesDiff === 0) {
    progress = 0;
    isBeginning = true;
    isEnd = true;
  } else {
    progress = (translate2 - swiper.minTranslate()) / translatesDiff;
    const isBeginningRounded = Math.abs(translate2 - swiper.minTranslate()) < 1;
    const isEndRounded = Math.abs(translate2 - swiper.maxTranslate()) < 1;
    isBeginning = isBeginningRounded || progress <= 0;
    isEnd = isEndRounded || progress >= 1;
    if (isBeginningRounded) progress = 0;
    if (isEndRounded) progress = 1;
  }
  if (params.loop) {
    const firstSlideIndex = swiper.getSlideIndexByData(0);
    const lastSlideIndex = swiper.getSlideIndexByData(swiper.slides.length - 1);
    const firstSlideTranslate = swiper.slidesGrid[firstSlideIndex];
    const lastSlideTranslate = swiper.slidesGrid[lastSlideIndex];
    const translateMax = swiper.slidesGrid[swiper.slidesGrid.length - 1];
    const translateAbs = Math.abs(translate2);
    if (translateAbs >= firstSlideTranslate) {
      progressLoop = (translateAbs - firstSlideTranslate) / translateMax;
    } else {
      progressLoop = (translateAbs + translateMax - lastSlideTranslate) / translateMax;
    }
    if (progressLoop > 1) progressLoop -= 1;
  }
  Object.assign(swiper, {
    progress,
    progressLoop,
    isBeginning,
    isEnd
  });
  if (params.watchSlidesProgress || params.centeredSlides && params.autoHeight) swiper.updateSlidesProgress(translate2);
  if (isBeginning && !wasBeginning) {
    swiper.emit("reachBeginning toEdge");
  }
  if (isEnd && !wasEnd) {
    swiper.emit("reachEnd toEdge");
  }
  if (wasBeginning && !isBeginning || wasEnd && !isEnd) {
    swiper.emit("fromEdge");
  }
  swiper.emit("progress", progress);
}
const toggleSlideClasses = (slideEl, condition, className) => {
  if (condition && !slideEl.classList.contains(className)) {
    slideEl.classList.add(className);
  } else if (!condition && slideEl.classList.contains(className)) {
    slideEl.classList.remove(className);
  }
};
function updateSlidesClasses() {
  const swiper = this;
  const {
    slides,
    params,
    slidesEl,
    activeIndex
  } = swiper;
  const isVirtual = swiper.virtual && params.virtual.enabled;
  const gridEnabled = swiper.grid && params.grid && params.grid.rows > 1;
  const getFilteredSlide = (selector) => {
    return elementChildren(slidesEl, `.${params.slideClass}${selector}, swiper-slide${selector}`)[0];
  };
  let activeSlide;
  let prevSlide;
  let nextSlide;
  if (isVirtual) {
    if (params.loop) {
      let slideIndex = activeIndex - swiper.virtual.slidesBefore;
      if (slideIndex < 0) slideIndex = swiper.virtual.slides.length + slideIndex;
      if (slideIndex >= swiper.virtual.slides.length) slideIndex -= swiper.virtual.slides.length;
      activeSlide = getFilteredSlide(`[data-swiper-slide-index="${slideIndex}"]`);
    } else {
      activeSlide = getFilteredSlide(`[data-swiper-slide-index="${activeIndex}"]`);
    }
  } else {
    if (gridEnabled) {
      activeSlide = slides.find((slideEl) => slideEl.column === activeIndex);
      nextSlide = slides.find((slideEl) => slideEl.column === activeIndex + 1);
      prevSlide = slides.find((slideEl) => slideEl.column === activeIndex - 1);
    } else {
      activeSlide = slides[activeIndex];
    }
  }
  if (activeSlide) {
    if (!gridEnabled) {
      nextSlide = elementNextAll(activeSlide, `.${params.slideClass}, swiper-slide`)[0];
      if (params.loop && !nextSlide) {
        nextSlide = slides[0];
      }
      prevSlide = elementPrevAll(activeSlide, `.${params.slideClass}, swiper-slide`)[0];
      if (params.loop && !prevSlide === 0) {
        prevSlide = slides[slides.length - 1];
      }
    }
  }
  slides.forEach((slideEl) => {
    toggleSlideClasses(slideEl, slideEl === activeSlide, params.slideActiveClass);
    toggleSlideClasses(slideEl, slideEl === nextSlide, params.slideNextClass);
    toggleSlideClasses(slideEl, slideEl === prevSlide, params.slidePrevClass);
  });
  swiper.emitSlidesClasses();
}
const processLazyPreloader = (swiper, imageEl) => {
  if (!swiper || swiper.destroyed || !swiper.params) return;
  const slideSelector = () => swiper.isElement ? `swiper-slide` : `.${swiper.params.slideClass}`;
  const slideEl = imageEl.closest(slideSelector());
  if (slideEl) {
    let lazyEl = slideEl.querySelector(`.${swiper.params.lazyPreloaderClass}`);
    if (!lazyEl && swiper.isElement) {
      if (slideEl.shadowRoot) {
        lazyEl = slideEl.shadowRoot.querySelector(`.${swiper.params.lazyPreloaderClass}`);
      } else {
        requestAnimationFrame(() => {
          if (slideEl.shadowRoot) {
            lazyEl = slideEl.shadowRoot.querySelector(`.${swiper.params.lazyPreloaderClass}`);
            if (lazyEl) lazyEl.remove();
          }
        });
      }
    }
    if (lazyEl) lazyEl.remove();
  }
};
const unlazy = (swiper, index) => {
  if (!swiper.slides[index]) return;
  const imageEl = swiper.slides[index].querySelector('[loading="lazy"]');
  if (imageEl) imageEl.removeAttribute("loading");
};
const preload = (swiper) => {
  if (!swiper || swiper.destroyed || !swiper.params) return;
  let amount = swiper.params.lazyPreloadPrevNext;
  const len = swiper.slides.length;
  if (!len || !amount || amount < 0) return;
  amount = Math.min(amount, len);
  const slidesPerView = swiper.params.slidesPerView === "auto" ? swiper.slidesPerViewDynamic() : Math.ceil(swiper.params.slidesPerView);
  const activeIndex = swiper.activeIndex;
  if (swiper.params.grid && swiper.params.grid.rows > 1) {
    const activeColumn = activeIndex;
    const preloadColumns = [activeColumn - amount];
    preloadColumns.push(...Array.from({
      length: amount
    }).map((_2, i2) => {
      return activeColumn + slidesPerView + i2;
    }));
    swiper.slides.forEach((slideEl, i2) => {
      if (preloadColumns.includes(slideEl.column)) unlazy(swiper, i2);
    });
    return;
  }
  const slideIndexLastInView = activeIndex + slidesPerView - 1;
  if (swiper.params.rewind || swiper.params.loop) {
    for (let i2 = activeIndex - amount; i2 <= slideIndexLastInView + amount; i2 += 1) {
      const realIndex = (i2 % len + len) % len;
      if (realIndex < activeIndex || realIndex > slideIndexLastInView) unlazy(swiper, realIndex);
    }
  } else {
    for (let i2 = Math.max(activeIndex - amount, 0); i2 <= Math.min(slideIndexLastInView + amount, len - 1); i2 += 1) {
      if (i2 !== activeIndex && (i2 > slideIndexLastInView || i2 < activeIndex)) {
        unlazy(swiper, i2);
      }
    }
  }
};
function getActiveIndexByTranslate(swiper) {
  const {
    slidesGrid,
    params
  } = swiper;
  const translate2 = swiper.rtlTranslate ? swiper.translate : -swiper.translate;
  let activeIndex;
  for (let i2 = 0; i2 < slidesGrid.length; i2 += 1) {
    if (typeof slidesGrid[i2 + 1] !== "undefined") {
      if (translate2 >= slidesGrid[i2] && translate2 < slidesGrid[i2 + 1] - (slidesGrid[i2 + 1] - slidesGrid[i2]) / 2) {
        activeIndex = i2;
      } else if (translate2 >= slidesGrid[i2] && translate2 < slidesGrid[i2 + 1]) {
        activeIndex = i2 + 1;
      }
    } else if (translate2 >= slidesGrid[i2]) {
      activeIndex = i2;
    }
  }
  if (params.normalizeSlideIndex) {
    if (activeIndex < 0 || typeof activeIndex === "undefined") activeIndex = 0;
  }
  return activeIndex;
}
function updateActiveIndex(newActiveIndex) {
  const swiper = this;
  const translate2 = swiper.rtlTranslate ? swiper.translate : -swiper.translate;
  const {
    snapGrid,
    params,
    activeIndex: previousIndex,
    realIndex: previousRealIndex,
    snapIndex: previousSnapIndex
  } = swiper;
  let activeIndex = newActiveIndex;
  let snapIndex;
  const getVirtualRealIndex = (aIndex) => {
    let realIndex2 = aIndex - swiper.virtual.slidesBefore;
    if (realIndex2 < 0) {
      realIndex2 = swiper.virtual.slides.length + realIndex2;
    }
    if (realIndex2 >= swiper.virtual.slides.length) {
      realIndex2 -= swiper.virtual.slides.length;
    }
    return realIndex2;
  };
  if (typeof activeIndex === "undefined") {
    activeIndex = getActiveIndexByTranslate(swiper);
  }
  if (snapGrid.indexOf(translate2) >= 0) {
    snapIndex = snapGrid.indexOf(translate2);
  } else {
    const skip = Math.min(params.slidesPerGroupSkip, activeIndex);
    snapIndex = skip + Math.floor((activeIndex - skip) / params.slidesPerGroup);
  }
  if (snapIndex >= snapGrid.length) snapIndex = snapGrid.length - 1;
  if (activeIndex === previousIndex && !swiper.params.loop) {
    if (snapIndex !== previousSnapIndex) {
      swiper.snapIndex = snapIndex;
      swiper.emit("snapIndexChange");
    }
    return;
  }
  if (activeIndex === previousIndex && swiper.params.loop && swiper.virtual && swiper.params.virtual.enabled) {
    swiper.realIndex = getVirtualRealIndex(activeIndex);
    return;
  }
  const gridEnabled = swiper.grid && params.grid && params.grid.rows > 1;
  let realIndex;
  if (swiper.virtual && params.virtual.enabled && params.loop) {
    realIndex = getVirtualRealIndex(activeIndex);
  } else if (gridEnabled) {
    const firstSlideInColumn = swiper.slides.find((slideEl) => slideEl.column === activeIndex);
    let activeSlideIndex = parseInt(firstSlideInColumn.getAttribute("data-swiper-slide-index"), 10);
    if (Number.isNaN(activeSlideIndex)) {
      activeSlideIndex = Math.max(swiper.slides.indexOf(firstSlideInColumn), 0);
    }
    realIndex = Math.floor(activeSlideIndex / params.grid.rows);
  } else if (swiper.slides[activeIndex]) {
    const slideIndex = swiper.slides[activeIndex].getAttribute("data-swiper-slide-index");
    if (slideIndex) {
      realIndex = parseInt(slideIndex, 10);
    } else {
      realIndex = activeIndex;
    }
  } else {
    realIndex = activeIndex;
  }
  Object.assign(swiper, {
    previousSnapIndex,
    snapIndex,
    previousRealIndex,
    realIndex,
    previousIndex,
    activeIndex
  });
  if (swiper.initialized) {
    preload(swiper);
  }
  swiper.emit("activeIndexChange");
  swiper.emit("snapIndexChange");
  if (swiper.initialized || swiper.params.runCallbacksOnInit) {
    if (previousRealIndex !== realIndex) {
      swiper.emit("realIndexChange");
    }
    swiper.emit("slideChange");
  }
}
function updateClickedSlide(el, path) {
  const swiper = this;
  const params = swiper.params;
  let slide2 = el.closest(`.${params.slideClass}, swiper-slide`);
  if (!slide2 && swiper.isElement && path && path.length > 1 && path.includes(el)) {
    [...path.slice(path.indexOf(el) + 1, path.length)].forEach((pathEl) => {
      if (!slide2 && pathEl.matches && pathEl.matches(`.${params.slideClass}, swiper-slide`)) {
        slide2 = pathEl;
      }
    });
  }
  let slideFound = false;
  let slideIndex;
  if (slide2) {
    for (let i2 = 0; i2 < swiper.slides.length; i2 += 1) {
      if (swiper.slides[i2] === slide2) {
        slideFound = true;
        slideIndex = i2;
        break;
      }
    }
  }
  if (slide2 && slideFound) {
    swiper.clickedSlide = slide2;
    if (swiper.virtual && swiper.params.virtual.enabled) {
      swiper.clickedIndex = parseInt(slide2.getAttribute("data-swiper-slide-index"), 10);
    } else {
      swiper.clickedIndex = slideIndex;
    }
  } else {
    swiper.clickedSlide = void 0;
    swiper.clickedIndex = void 0;
    return;
  }
  if (params.slideToClickedSlide && swiper.clickedIndex !== void 0 && swiper.clickedIndex !== swiper.activeIndex) {
    swiper.slideToClickedSlide();
  }
}
var update = {
  updateSize,
  updateSlides,
  updateAutoHeight,
  updateSlidesOffset,
  updateSlidesProgress,
  updateProgress,
  updateSlidesClasses,
  updateActiveIndex,
  updateClickedSlide
};
function getSwiperTranslate(axis = this.isHorizontal() ? "x" : "y") {
  const swiper = this;
  const {
    params,
    rtlTranslate: rtl,
    translate: translate2,
    wrapperEl
  } = swiper;
  if (params.virtualTranslate) {
    return rtl ? -translate2 : translate2;
  }
  if (params.cssMode) {
    return translate2;
  }
  let currentTranslate = getTranslate(wrapperEl, axis);
  currentTranslate += swiper.cssOverflowAdjustment();
  if (rtl) currentTranslate = -currentTranslate;
  return currentTranslate || 0;
}
function setTranslate(translate2, byController) {
  const swiper = this;
  const {
    rtlTranslate: rtl,
    params,
    wrapperEl,
    progress
  } = swiper;
  let x2 = 0;
  let y2 = 0;
  const z2 = 0;
  if (swiper.isHorizontal()) {
    x2 = rtl ? -translate2 : translate2;
  } else {
    y2 = translate2;
  }
  if (params.roundLengths) {
    x2 = Math.floor(x2);
    y2 = Math.floor(y2);
  }
  swiper.previousTranslate = swiper.translate;
  swiper.translate = swiper.isHorizontal() ? x2 : y2;
  if (params.cssMode) {
    wrapperEl[swiper.isHorizontal() ? "scrollLeft" : "scrollTop"] = swiper.isHorizontal() ? -x2 : -y2;
  } else if (!params.virtualTranslate) {
    if (swiper.isHorizontal()) {
      x2 -= swiper.cssOverflowAdjustment();
    } else {
      y2 -= swiper.cssOverflowAdjustment();
    }
    wrapperEl.style.transform = `translate3d(${x2}px, ${y2}px, ${z2}px)`;
  }
  let newProgress;
  const translatesDiff = swiper.maxTranslate() - swiper.minTranslate();
  if (translatesDiff === 0) {
    newProgress = 0;
  } else {
    newProgress = (translate2 - swiper.minTranslate()) / translatesDiff;
  }
  if (newProgress !== progress) {
    swiper.updateProgress(translate2);
  }
  swiper.emit("setTranslate", swiper.translate, byController);
}
function minTranslate() {
  return -this.snapGrid[0];
}
function maxTranslate() {
  return -this.snapGrid[this.snapGrid.length - 1];
}
function translateTo(translate2 = 0, speed = this.params.speed, runCallbacks = true, translateBounds = true, internal) {
  const swiper = this;
  const {
    params,
    wrapperEl
  } = swiper;
  if (swiper.animating && params.preventInteractionOnTransition) {
    return false;
  }
  const minTranslate2 = swiper.minTranslate();
  const maxTranslate2 = swiper.maxTranslate();
  let newTranslate;
  if (translateBounds && translate2 > minTranslate2) newTranslate = minTranslate2;
  else if (translateBounds && translate2 < maxTranslate2) newTranslate = maxTranslate2;
  else newTranslate = translate2;
  swiper.updateProgress(newTranslate);
  if (params.cssMode) {
    const isH = swiper.isHorizontal();
    if (speed === 0) {
      wrapperEl[isH ? "scrollLeft" : "scrollTop"] = -newTranslate;
    } else {
      if (!swiper.support.smoothScroll) {
        animateCSSModeScroll({
          swiper,
          targetPosition: -newTranslate,
          side: isH ? "left" : "top"
        });
        return true;
      }
      wrapperEl.scrollTo({
        [isH ? "left" : "top"]: -newTranslate,
        behavior: "smooth"
      });
    }
    return true;
  }
  if (speed === 0) {
    swiper.setTransition(0);
    swiper.setTranslate(newTranslate);
    if (runCallbacks) {
      swiper.emit("beforeTransitionStart", speed, internal);
      swiper.emit("transitionEnd");
    }
  } else {
    swiper.setTransition(speed);
    swiper.setTranslate(newTranslate);
    if (runCallbacks) {
      swiper.emit("beforeTransitionStart", speed, internal);
      swiper.emit("transitionStart");
    }
    if (!swiper.animating) {
      swiper.animating = true;
      if (!swiper.onTranslateToWrapperTransitionEnd) {
        swiper.onTranslateToWrapperTransitionEnd = function transitionEnd2(e2) {
          if (!swiper || swiper.destroyed) return;
          if (e2.target !== this) return;
          swiper.wrapperEl.removeEventListener("transitionend", swiper.onTranslateToWrapperTransitionEnd);
          swiper.onTranslateToWrapperTransitionEnd = null;
          delete swiper.onTranslateToWrapperTransitionEnd;
          swiper.animating = false;
          if (runCallbacks) {
            swiper.emit("transitionEnd");
          }
        };
      }
      swiper.wrapperEl.addEventListener("transitionend", swiper.onTranslateToWrapperTransitionEnd);
    }
  }
  return true;
}
var translate = {
  getTranslate: getSwiperTranslate,
  setTranslate,
  minTranslate,
  maxTranslate,
  translateTo
};
function setTransition(duration, byController) {
  const swiper = this;
  if (!swiper.params.cssMode) {
    swiper.wrapperEl.style.transitionDuration = `${duration}ms`;
    swiper.wrapperEl.style.transitionDelay = duration === 0 ? `0ms` : "";
  }
  swiper.emit("setTransition", duration, byController);
}
function transitionEmit({
  swiper,
  runCallbacks,
  direction,
  step
}) {
  const {
    activeIndex,
    previousIndex
  } = swiper;
  let dir = direction;
  if (!dir) {
    if (activeIndex > previousIndex) dir = "next";
    else if (activeIndex < previousIndex) dir = "prev";
    else dir = "reset";
  }
  swiper.emit(`transition${step}`);
  if (runCallbacks && dir === "reset") {
    swiper.emit(`slideResetTransition${step}`);
  } else if (runCallbacks && activeIndex !== previousIndex) {
    swiper.emit(`slideChangeTransition${step}`);
    if (dir === "next") {
      swiper.emit(`slideNextTransition${step}`);
    } else {
      swiper.emit(`slidePrevTransition${step}`);
    }
  }
}
function transitionStart(runCallbacks = true, direction) {
  const swiper = this;
  const {
    params
  } = swiper;
  if (params.cssMode) return;
  if (params.autoHeight) {
    swiper.updateAutoHeight();
  }
  transitionEmit({
    swiper,
    runCallbacks,
    direction,
    step: "Start"
  });
}
function transitionEnd(runCallbacks = true, direction) {
  const swiper = this;
  const {
    params
  } = swiper;
  swiper.animating = false;
  if (params.cssMode) return;
  swiper.setTransition(0);
  transitionEmit({
    swiper,
    runCallbacks,
    direction,
    step: "End"
  });
}
var transition = {
  setTransition,
  transitionStart,
  transitionEnd
};
function slideTo(index = 0, speed, runCallbacks = true, internal, initial) {
  if (typeof index === "string") {
    index = parseInt(index, 10);
  }
  const swiper = this;
  let slideIndex = index;
  if (slideIndex < 0) slideIndex = 0;
  const {
    params,
    snapGrid,
    slidesGrid,
    previousIndex,
    activeIndex,
    rtlTranslate: rtl,
    wrapperEl,
    enabled
  } = swiper;
  if (!enabled && !internal && !initial || swiper.destroyed || swiper.animating && params.preventInteractionOnTransition) {
    return false;
  }
  if (typeof speed === "undefined") {
    speed = swiper.params.speed;
  }
  const skip = Math.min(swiper.params.slidesPerGroupSkip, slideIndex);
  let snapIndex = skip + Math.floor((slideIndex - skip) / swiper.params.slidesPerGroup);
  if (snapIndex >= snapGrid.length) snapIndex = snapGrid.length - 1;
  const translate2 = -snapGrid[snapIndex];
  if (params.normalizeSlideIndex) {
    for (let i2 = 0; i2 < slidesGrid.length; i2 += 1) {
      const normalizedTranslate = -Math.floor(translate2 * 100);
      const normalizedGrid = Math.floor(slidesGrid[i2] * 100);
      const normalizedGridNext = Math.floor(slidesGrid[i2 + 1] * 100);
      if (typeof slidesGrid[i2 + 1] !== "undefined") {
        if (normalizedTranslate >= normalizedGrid && normalizedTranslate < normalizedGridNext - (normalizedGridNext - normalizedGrid) / 2) {
          slideIndex = i2;
        } else if (normalizedTranslate >= normalizedGrid && normalizedTranslate < normalizedGridNext) {
          slideIndex = i2 + 1;
        }
      } else if (normalizedTranslate >= normalizedGrid) {
        slideIndex = i2;
      }
    }
  }
  if (swiper.initialized && slideIndex !== activeIndex) {
    if (!swiper.allowSlideNext && (rtl ? translate2 > swiper.translate && translate2 > swiper.minTranslate() : translate2 < swiper.translate && translate2 < swiper.minTranslate())) {
      return false;
    }
    if (!swiper.allowSlidePrev && translate2 > swiper.translate && translate2 > swiper.maxTranslate()) {
      if ((activeIndex || 0) !== slideIndex) {
        return false;
      }
    }
  }
  if (slideIndex !== (previousIndex || 0) && runCallbacks) {
    swiper.emit("beforeSlideChangeStart");
  }
  swiper.updateProgress(translate2);
  let direction;
  if (slideIndex > activeIndex) direction = "next";
  else if (slideIndex < activeIndex) direction = "prev";
  else direction = "reset";
  const isVirtual = swiper.virtual && swiper.params.virtual.enabled;
  const isInitialVirtual = isVirtual && initial;
  if (!isInitialVirtual && (rtl && -translate2 === swiper.translate || !rtl && translate2 === swiper.translate)) {
    swiper.updateActiveIndex(slideIndex);
    if (params.autoHeight) {
      swiper.updateAutoHeight();
    }
    swiper.updateSlidesClasses();
    if (params.effect !== "slide") {
      swiper.setTranslate(translate2);
    }
    if (direction !== "reset") {
      swiper.transitionStart(runCallbacks, direction);
      swiper.transitionEnd(runCallbacks, direction);
    }
    return false;
  }
  if (params.cssMode) {
    const isH = swiper.isHorizontal();
    const t2 = rtl ? translate2 : -translate2;
    if (speed === 0) {
      if (isVirtual) {
        swiper.wrapperEl.style.scrollSnapType = "none";
        swiper._immediateVirtual = true;
      }
      if (isVirtual && !swiper._cssModeVirtualInitialSet && swiper.params.initialSlide > 0) {
        swiper._cssModeVirtualInitialSet = true;
        requestAnimationFrame(() => {
          wrapperEl[isH ? "scrollLeft" : "scrollTop"] = t2;
        });
      } else {
        wrapperEl[isH ? "scrollLeft" : "scrollTop"] = t2;
      }
      if (isVirtual) {
        requestAnimationFrame(() => {
          swiper.wrapperEl.style.scrollSnapType = "";
          swiper._immediateVirtual = false;
        });
      }
    } else {
      if (!swiper.support.smoothScroll) {
        animateCSSModeScroll({
          swiper,
          targetPosition: t2,
          side: isH ? "left" : "top"
        });
        return true;
      }
      wrapperEl.scrollTo({
        [isH ? "left" : "top"]: t2,
        behavior: "smooth"
      });
    }
    return true;
  }
  const browser2 = getBrowser();
  const isSafari = browser2.isSafari;
  if (isVirtual && !initial && isSafari && swiper.isElement) {
    swiper.virtual.update(false, false, slideIndex);
  }
  swiper.setTransition(speed);
  swiper.setTranslate(translate2);
  swiper.updateActiveIndex(slideIndex);
  swiper.updateSlidesClasses();
  swiper.emit("beforeTransitionStart", speed, internal);
  swiper.transitionStart(runCallbacks, direction);
  if (speed === 0) {
    swiper.transitionEnd(runCallbacks, direction);
  } else if (!swiper.animating) {
    swiper.animating = true;
    if (!swiper.onSlideToWrapperTransitionEnd) {
      swiper.onSlideToWrapperTransitionEnd = function transitionEnd2(e2) {
        if (!swiper || swiper.destroyed) return;
        if (e2.target !== this) return;
        swiper.wrapperEl.removeEventListener("transitionend", swiper.onSlideToWrapperTransitionEnd);
        swiper.onSlideToWrapperTransitionEnd = null;
        delete swiper.onSlideToWrapperTransitionEnd;
        swiper.transitionEnd(runCallbacks, direction);
      };
    }
    swiper.wrapperEl.addEventListener("transitionend", swiper.onSlideToWrapperTransitionEnd);
  }
  return true;
}
function slideToLoop(index = 0, speed, runCallbacks = true, internal) {
  if (typeof index === "string") {
    const indexAsNumber = parseInt(index, 10);
    index = indexAsNumber;
  }
  const swiper = this;
  if (swiper.destroyed) return;
  if (typeof speed === "undefined") {
    speed = swiper.params.speed;
  }
  const gridEnabled = swiper.grid && swiper.params.grid && swiper.params.grid.rows > 1;
  let newIndex = index;
  if (swiper.params.loop) {
    if (swiper.virtual && swiper.params.virtual.enabled) {
      newIndex = newIndex + swiper.virtual.slidesBefore;
    } else {
      let targetSlideIndex;
      if (gridEnabled) {
        const slideIndex = newIndex * swiper.params.grid.rows;
        targetSlideIndex = swiper.slides.find((slideEl) => slideEl.getAttribute("data-swiper-slide-index") * 1 === slideIndex).column;
      } else {
        targetSlideIndex = swiper.getSlideIndexByData(newIndex);
      }
      const cols = gridEnabled ? Math.ceil(swiper.slides.length / swiper.params.grid.rows) : swiper.slides.length;
      const {
        centeredSlides,
        slidesOffsetBefore,
        slidesOffsetAfter
      } = swiper.params;
      const bothDirections = centeredSlides || !!slidesOffsetBefore || !!slidesOffsetAfter;
      let slidesPerView = swiper.params.slidesPerView;
      if (slidesPerView === "auto") {
        slidesPerView = swiper.slidesPerViewDynamic();
      } else {
        slidesPerView = Math.ceil(parseFloat(swiper.params.slidesPerView, 10));
        if (bothDirections && slidesPerView % 2 === 0) {
          slidesPerView = slidesPerView + 1;
        }
      }
      let needLoopFix = cols - targetSlideIndex < slidesPerView;
      if (bothDirections) {
        needLoopFix = needLoopFix || targetSlideIndex < Math.ceil(slidesPerView / 2);
      }
      if (internal && bothDirections && swiper.params.slidesPerView !== "auto" && !gridEnabled) {
        needLoopFix = false;
      }
      if (needLoopFix) {
        const direction = bothDirections ? targetSlideIndex < swiper.activeIndex ? "prev" : "next" : targetSlideIndex - swiper.activeIndex - 1 < swiper.params.slidesPerView ? "next" : "prev";
        swiper.loopFix({
          direction,
          slideTo: true,
          activeSlideIndex: direction === "next" ? targetSlideIndex + 1 : targetSlideIndex - cols + 1,
          slideRealIndex: direction === "next" ? swiper.realIndex : void 0
        });
      }
      if (gridEnabled) {
        const slideIndex = newIndex * swiper.params.grid.rows;
        newIndex = swiper.slides.find((slideEl) => slideEl.getAttribute("data-swiper-slide-index") * 1 === slideIndex).column;
      } else {
        newIndex = swiper.getSlideIndexByData(newIndex);
      }
    }
  }
  requestAnimationFrame(() => {
    swiper.slideTo(newIndex, speed, runCallbacks, internal);
  });
  return swiper;
}
function slideNext(speed, runCallbacks = true, internal) {
  const swiper = this;
  const {
    enabled,
    params,
    animating
  } = swiper;
  if (!enabled || swiper.destroyed) return swiper;
  if (typeof speed === "undefined") {
    speed = swiper.params.speed;
  }
  let perGroup = params.slidesPerGroup;
  if (params.slidesPerView === "auto" && params.slidesPerGroup === 1 && params.slidesPerGroupAuto) {
    perGroup = Math.max(swiper.slidesPerViewDynamic("current", true), 1);
  }
  const increment = swiper.activeIndex < params.slidesPerGroupSkip ? 1 : perGroup;
  const isVirtual = swiper.virtual && params.virtual.enabled;
  if (params.loop) {
    if (animating && !isVirtual && params.loopPreventsSliding) return false;
    swiper.loopFix({
      direction: "next"
    });
    swiper._clientLeft = swiper.wrapperEl.clientLeft;
    if (swiper.activeIndex === swiper.slides.length - 1 && params.cssMode) {
      requestAnimationFrame(() => {
        swiper.slideTo(swiper.activeIndex + increment, speed, runCallbacks, internal);
      });
      return true;
    }
  }
  if (params.rewind && swiper.isEnd) {
    return swiper.slideTo(0, speed, runCallbacks, internal);
  }
  return swiper.slideTo(swiper.activeIndex + increment, speed, runCallbacks, internal);
}
function slidePrev(speed, runCallbacks = true, internal) {
  const swiper = this;
  const {
    params,
    snapGrid,
    slidesGrid,
    rtlTranslate,
    enabled,
    animating
  } = swiper;
  if (!enabled || swiper.destroyed) return swiper;
  if (typeof speed === "undefined") {
    speed = swiper.params.speed;
  }
  const isVirtual = swiper.virtual && params.virtual.enabled;
  if (params.loop) {
    if (animating && !isVirtual && params.loopPreventsSliding) return false;
    swiper.loopFix({
      direction: "prev"
    });
    swiper._clientLeft = swiper.wrapperEl.clientLeft;
  }
  const translate2 = rtlTranslate ? swiper.translate : -swiper.translate;
  function normalize(val) {
    if (val < 0) return -Math.floor(Math.abs(val));
    return Math.floor(val);
  }
  const normalizedTranslate = normalize(translate2);
  const normalizedSnapGrid = snapGrid.map((val) => normalize(val));
  const isFreeMode = params.freeMode && params.freeMode.enabled;
  let prevSnap = snapGrid[normalizedSnapGrid.indexOf(normalizedTranslate) - 1];
  if (typeof prevSnap === "undefined" && (params.cssMode || isFreeMode)) {
    let prevSnapIndex;
    snapGrid.forEach((snap, snapIndex) => {
      if (normalizedTranslate >= snap) {
        prevSnapIndex = snapIndex;
      }
    });
    if (typeof prevSnapIndex !== "undefined") {
      prevSnap = isFreeMode ? snapGrid[prevSnapIndex] : snapGrid[prevSnapIndex > 0 ? prevSnapIndex - 1 : prevSnapIndex];
    }
  }
  let prevIndex = 0;
  if (typeof prevSnap !== "undefined") {
    prevIndex = slidesGrid.indexOf(prevSnap);
    if (prevIndex < 0) prevIndex = swiper.activeIndex - 1;
    if (params.slidesPerView === "auto" && params.slidesPerGroup === 1 && params.slidesPerGroupAuto) {
      prevIndex = prevIndex - swiper.slidesPerViewDynamic("previous", true) + 1;
      prevIndex = Math.max(prevIndex, 0);
    }
  }
  if (params.rewind && swiper.isBeginning) {
    const lastIndex = swiper.params.virtual && swiper.params.virtual.enabled && swiper.virtual ? swiper.virtual.slides.length - 1 : swiper.slides.length - 1;
    return swiper.slideTo(lastIndex, speed, runCallbacks, internal);
  } else if (params.loop && swiper.activeIndex === 0 && params.cssMode) {
    requestAnimationFrame(() => {
      swiper.slideTo(prevIndex, speed, runCallbacks, internal);
    });
    return true;
  }
  return swiper.slideTo(prevIndex, speed, runCallbacks, internal);
}
function slideReset(speed, runCallbacks = true, internal) {
  const swiper = this;
  if (swiper.destroyed) return;
  if (typeof speed === "undefined") {
    speed = swiper.params.speed;
  }
  return swiper.slideTo(swiper.activeIndex, speed, runCallbacks, internal);
}
function slideToClosest(speed, runCallbacks = true, internal, threshold = 0.5) {
  const swiper = this;
  if (swiper.destroyed) return;
  if (typeof speed === "undefined") {
    speed = swiper.params.speed;
  }
  let index = swiper.activeIndex;
  const skip = Math.min(swiper.params.slidesPerGroupSkip, index);
  const snapIndex = skip + Math.floor((index - skip) / swiper.params.slidesPerGroup);
  const translate2 = swiper.rtlTranslate ? swiper.translate : -swiper.translate;
  if (translate2 >= swiper.snapGrid[snapIndex]) {
    const currentSnap = swiper.snapGrid[snapIndex];
    const nextSnap = swiper.snapGrid[snapIndex + 1];
    if (translate2 - currentSnap > (nextSnap - currentSnap) * threshold) {
      index += swiper.params.slidesPerGroup;
    }
  } else {
    const prevSnap = swiper.snapGrid[snapIndex - 1];
    const currentSnap = swiper.snapGrid[snapIndex];
    if (translate2 - prevSnap <= (currentSnap - prevSnap) * threshold) {
      index -= swiper.params.slidesPerGroup;
    }
  }
  index = Math.max(index, 0);
  index = Math.min(index, swiper.slidesGrid.length - 1);
  return swiper.slideTo(index, speed, runCallbacks, internal);
}
function slideToClickedSlide() {
  const swiper = this;
  if (swiper.destroyed) return;
  const {
    params,
    slidesEl
  } = swiper;
  const slidesPerView = params.slidesPerView === "auto" ? swiper.slidesPerViewDynamic() : params.slidesPerView;
  let slideToIndex = swiper.getSlideIndexWhenGrid(swiper.clickedIndex);
  let realIndex;
  const slideSelector = swiper.isElement ? `swiper-slide` : `.${params.slideClass}`;
  const isGrid = swiper.grid && swiper.params.grid && swiper.params.grid.rows > 1;
  if (params.loop) {
    if (swiper.animating) return;
    realIndex = parseInt(swiper.clickedSlide.getAttribute("data-swiper-slide-index"), 10);
    if (params.centeredSlides) {
      swiper.slideToLoop(realIndex);
    } else if (slideToIndex > (isGrid ? (swiper.slides.length - slidesPerView) / 2 - (swiper.params.grid.rows - 1) : swiper.slides.length - slidesPerView)) {
      swiper.loopFix();
      slideToIndex = swiper.getSlideIndex(elementChildren(slidesEl, `${slideSelector}[data-swiper-slide-index="${realIndex}"]`)[0]);
      nextTick(() => {
        swiper.slideTo(slideToIndex);
      });
    } else {
      swiper.slideTo(slideToIndex);
    }
  } else {
    swiper.slideTo(slideToIndex);
  }
}
var slide = {
  slideTo,
  slideToLoop,
  slideNext,
  slidePrev,
  slideReset,
  slideToClosest,
  slideToClickedSlide
};
function loopCreate(slideRealIndex, initial) {
  const swiper = this;
  const {
    params,
    slidesEl
  } = swiper;
  if (!params.loop || swiper.virtual && swiper.params.virtual.enabled) return;
  const initSlides = () => {
    const slides = elementChildren(slidesEl, `.${params.slideClass}, swiper-slide`);
    slides.forEach((el, index) => {
      el.setAttribute("data-swiper-slide-index", index);
    });
  };
  const clearBlankSlides = () => {
    const slides = elementChildren(slidesEl, `.${params.slideBlankClass}`);
    slides.forEach((el) => {
      el.remove();
    });
    if (slides.length > 0) {
      swiper.recalcSlides();
      swiper.updateSlides();
    }
  };
  const gridEnabled = swiper.grid && params.grid && params.grid.rows > 1;
  if (params.loopAddBlankSlides && (params.slidesPerGroup > 1 || gridEnabled)) {
    clearBlankSlides();
  }
  const slidesPerGroup = params.slidesPerGroup * (gridEnabled ? params.grid.rows : 1);
  const shouldFillGroup = swiper.slides.length % slidesPerGroup !== 0;
  const shouldFillGrid = gridEnabled && swiper.slides.length % params.grid.rows !== 0;
  const addBlankSlides = (amountOfSlides) => {
    for (let i2 = 0; i2 < amountOfSlides; i2 += 1) {
      const slideEl = swiper.isElement ? createElement("swiper-slide", [params.slideBlankClass]) : createElement("div", [params.slideClass, params.slideBlankClass]);
      swiper.slidesEl.append(slideEl);
    }
  };
  if (shouldFillGroup) {
    if (params.loopAddBlankSlides) {
      const slidesToAdd = slidesPerGroup - swiper.slides.length % slidesPerGroup;
      addBlankSlides(slidesToAdd);
      swiper.recalcSlides();
      swiper.updateSlides();
    } else {
      showWarning("Swiper Loop Warning: The number of slides is not even to slidesPerGroup, loop mode may not function properly. You need to add more slides (or make duplicates, or empty slides)");
    }
    initSlides();
  } else if (shouldFillGrid) {
    if (params.loopAddBlankSlides) {
      const slidesToAdd = params.grid.rows - swiper.slides.length % params.grid.rows;
      addBlankSlides(slidesToAdd);
      swiper.recalcSlides();
      swiper.updateSlides();
    } else {
      showWarning("Swiper Loop Warning: The number of slides is not even to grid.rows, loop mode may not function properly. You need to add more slides (or make duplicates, or empty slides)");
    }
    initSlides();
  } else {
    initSlides();
  }
  const bothDirections = params.centeredSlides || !!params.slidesOffsetBefore || !!params.slidesOffsetAfter;
  swiper.loopFix({
    slideRealIndex,
    direction: bothDirections ? void 0 : "next",
    initial
  });
}
function loopFix({
  slideRealIndex,
  slideTo: slideTo2 = true,
  direction,
  setTranslate: setTranslate2,
  activeSlideIndex,
  initial,
  byController,
  byMousewheel
} = {}) {
  const swiper = this;
  if (!swiper.params.loop) return;
  swiper.emit("beforeLoopFix");
  const {
    slides,
    allowSlidePrev,
    allowSlideNext,
    slidesEl,
    params
  } = swiper;
  const {
    centeredSlides,
    slidesOffsetBefore,
    slidesOffsetAfter,
    initialSlide
  } = params;
  const bothDirections = centeredSlides || !!slidesOffsetBefore || !!slidesOffsetAfter;
  swiper.allowSlidePrev = true;
  swiper.allowSlideNext = true;
  if (swiper.virtual && params.virtual.enabled) {
    if (slideTo2) {
      if (!bothDirections && swiper.snapIndex === 0) {
        swiper.slideTo(swiper.virtual.slides.length, 0, false, true);
      } else if (bothDirections && swiper.snapIndex < params.slidesPerView) {
        swiper.slideTo(swiper.virtual.slides.length + swiper.snapIndex, 0, false, true);
      } else if (swiper.snapIndex === swiper.snapGrid.length - 1) {
        swiper.slideTo(swiper.virtual.slidesBefore, 0, false, true);
      }
    }
    swiper.allowSlidePrev = allowSlidePrev;
    swiper.allowSlideNext = allowSlideNext;
    swiper.emit("loopFix");
    return;
  }
  let slidesPerView = params.slidesPerView;
  if (slidesPerView === "auto") {
    slidesPerView = swiper.slidesPerViewDynamic();
  } else {
    slidesPerView = Math.ceil(parseFloat(params.slidesPerView, 10));
    if (bothDirections && slidesPerView % 2 === 0) {
      slidesPerView = slidesPerView + 1;
    }
  }
  const slidesPerGroup = params.slidesPerGroupAuto ? slidesPerView : params.slidesPerGroup;
  let loopedSlides = bothDirections ? Math.max(slidesPerGroup, Math.ceil(slidesPerView / 2)) : slidesPerGroup;
  if (loopedSlides % slidesPerGroup !== 0) {
    loopedSlides += slidesPerGroup - loopedSlides % slidesPerGroup;
  }
  loopedSlides += params.loopAdditionalSlides;
  swiper.loopedSlides = loopedSlides;
  const gridEnabled = swiper.grid && params.grid && params.grid.rows > 1;
  if (slides.length < slidesPerView + loopedSlides || swiper.params.effect === "cards" && slides.length < slidesPerView + loopedSlides * 2) {
    showWarning("Swiper Loop Warning: The number of slides is not enough for loop mode, it will be disabled or not function properly. You need to add more slides (or make duplicates) or lower the values of slidesPerView and slidesPerGroup parameters");
  } else if (gridEnabled && params.grid.fill === "row") {
    showWarning("Swiper Loop Warning: Loop mode is not compatible with grid.fill = `row`");
  }
  const prependSlidesIndexes = [];
  const appendSlidesIndexes = [];
  const cols = gridEnabled ? Math.ceil(slides.length / params.grid.rows) : slides.length;
  const isInitialOverflow = initial && cols - initialSlide < slidesPerView && !bothDirections;
  let activeIndex = isInitialOverflow ? initialSlide : swiper.activeIndex;
  if (typeof activeSlideIndex === "undefined") {
    activeSlideIndex = swiper.getSlideIndex(slides.find((el) => el.classList.contains(params.slideActiveClass)));
  } else {
    activeIndex = activeSlideIndex;
  }
  const isNext = direction === "next" || !direction;
  const isPrev = direction === "prev" || !direction;
  let slidesPrepended = 0;
  let slidesAppended = 0;
  const activeColIndex = gridEnabled ? slides[activeSlideIndex].column : activeSlideIndex;
  const activeColIndexWithShift = activeColIndex + (bothDirections && typeof setTranslate2 === "undefined" ? -slidesPerView / 2 + 0.5 : 0);
  if (activeColIndexWithShift < loopedSlides) {
    slidesPrepended = Math.max(loopedSlides - activeColIndexWithShift, slidesPerGroup);
    for (let i2 = 0; i2 < loopedSlides - activeColIndexWithShift; i2 += 1) {
      const index = i2 - Math.floor(i2 / cols) * cols;
      if (gridEnabled) {
        const colIndexToPrepend = cols - index - 1;
        for (let i3 = slides.length - 1; i3 >= 0; i3 -= 1) {
          if (slides[i3].column === colIndexToPrepend) prependSlidesIndexes.push(i3);
        }
      } else {
        prependSlidesIndexes.push(cols - index - 1);
      }
    }
  } else if (activeColIndexWithShift + slidesPerView > cols - loopedSlides) {
    slidesAppended = Math.max(activeColIndexWithShift - (cols - loopedSlides * 2), slidesPerGroup);
    if (isInitialOverflow) {
      slidesAppended = Math.max(slidesAppended, slidesPerView - cols + initialSlide + 1);
    }
    for (let i2 = 0; i2 < slidesAppended; i2 += 1) {
      const index = i2 - Math.floor(i2 / cols) * cols;
      if (gridEnabled) {
        slides.forEach((slide2, slideIndex) => {
          if (slide2.column === index) appendSlidesIndexes.push(slideIndex);
        });
      } else {
        appendSlidesIndexes.push(index);
      }
    }
  }
  swiper.__preventObserver__ = true;
  requestAnimationFrame(() => {
    swiper.__preventObserver__ = false;
  });
  if (swiper.params.effect === "cards" && slides.length < slidesPerView + loopedSlides * 2) {
    if (appendSlidesIndexes.includes(activeSlideIndex)) {
      appendSlidesIndexes.splice(appendSlidesIndexes.indexOf(activeSlideIndex), 1);
    }
    if (prependSlidesIndexes.includes(activeSlideIndex)) {
      prependSlidesIndexes.splice(prependSlidesIndexes.indexOf(activeSlideIndex), 1);
    }
  }
  if (isPrev) {
    prependSlidesIndexes.forEach((index) => {
      slides[index].swiperLoopMoveDOM = true;
      slidesEl.prepend(slides[index]);
      slides[index].swiperLoopMoveDOM = false;
    });
  }
  if (isNext) {
    appendSlidesIndexes.forEach((index) => {
      slides[index].swiperLoopMoveDOM = true;
      slidesEl.append(slides[index]);
      slides[index].swiperLoopMoveDOM = false;
    });
  }
  swiper.recalcSlides();
  if (params.slidesPerView === "auto") {
    swiper.updateSlides();
  } else if (gridEnabled && (prependSlidesIndexes.length > 0 && isPrev || appendSlidesIndexes.length > 0 && isNext)) {
    swiper.slides.forEach((slide2, slideIndex) => {
      swiper.grid.updateSlide(slideIndex, slide2, swiper.slides);
    });
  }
  if (params.watchSlidesProgress) {
    swiper.updateSlidesOffset();
  }
  if (slideTo2) {
    if (prependSlidesIndexes.length > 0 && isPrev) {
      if (typeof slideRealIndex === "undefined") {
        const currentSlideTranslate = swiper.slidesGrid[activeIndex];
        const newSlideTranslate = swiper.slidesGrid[activeIndex + slidesPrepended];
        const diff = newSlideTranslate - currentSlideTranslate;
        if (byMousewheel) {
          swiper.setTranslate(swiper.translate - diff);
        } else {
          swiper.slideTo(activeIndex + Math.ceil(slidesPrepended), 0, false, true);
          if (setTranslate2) {
            swiper.touchEventsData.startTranslate = swiper.touchEventsData.startTranslate - diff;
            swiper.touchEventsData.currentTranslate = swiper.touchEventsData.currentTranslate - diff;
          }
        }
      } else {
        if (setTranslate2) {
          const shift = gridEnabled ? prependSlidesIndexes.length / params.grid.rows : prependSlidesIndexes.length;
          swiper.slideTo(swiper.activeIndex + shift, 0, false, true);
          swiper.touchEventsData.currentTranslate = swiper.translate;
        }
      }
    } else if (appendSlidesIndexes.length > 0 && isNext) {
      if (typeof slideRealIndex === "undefined") {
        const currentSlideTranslate = swiper.slidesGrid[activeIndex];
        const newSlideTranslate = swiper.slidesGrid[activeIndex - slidesAppended];
        const diff = newSlideTranslate - currentSlideTranslate;
        if (byMousewheel) {
          swiper.setTranslate(swiper.translate - diff);
        } else {
          swiper.slideTo(activeIndex - slidesAppended, 0, false, true);
          if (setTranslate2) {
            swiper.touchEventsData.startTranslate = swiper.touchEventsData.startTranslate - diff;
            swiper.touchEventsData.currentTranslate = swiper.touchEventsData.currentTranslate - diff;
          }
        }
      } else {
        const shift = gridEnabled ? appendSlidesIndexes.length / params.grid.rows : appendSlidesIndexes.length;
        swiper.slideTo(swiper.activeIndex - shift, 0, false, true);
      }
    }
  }
  swiper.allowSlidePrev = allowSlidePrev;
  swiper.allowSlideNext = allowSlideNext;
  if (swiper.controller && swiper.controller.control && !byController) {
    const loopParams = {
      slideRealIndex,
      direction,
      setTranslate: setTranslate2,
      activeSlideIndex,
      byController: true
    };
    if (Array.isArray(swiper.controller.control)) {
      swiper.controller.control.forEach((c2) => {
        if (!c2.destroyed && c2.params.loop) c2.loopFix({
          ...loopParams,
          slideTo: c2.params.slidesPerView === params.slidesPerView ? slideTo2 : false
        });
      });
    } else if (swiper.controller.control instanceof swiper.constructor && swiper.controller.control.params.loop) {
      swiper.controller.control.loopFix({
        ...loopParams,
        slideTo: swiper.controller.control.params.slidesPerView === params.slidesPerView ? slideTo2 : false
      });
    }
  }
  swiper.emit("loopFix");
}
function loopDestroy() {
  const swiper = this;
  const {
    params,
    slidesEl
  } = swiper;
  if (!params.loop || !slidesEl || swiper.virtual && swiper.params.virtual.enabled) return;
  swiper.recalcSlides();
  const newSlidesOrder = [];
  swiper.slides.forEach((slideEl) => {
    const index = typeof slideEl.swiperSlideIndex === "undefined" ? slideEl.getAttribute("data-swiper-slide-index") * 1 : slideEl.swiperSlideIndex;
    newSlidesOrder[index] = slideEl;
  });
  swiper.slides.forEach((slideEl) => {
    slideEl.removeAttribute("data-swiper-slide-index");
  });
  newSlidesOrder.forEach((slideEl) => {
    slidesEl.append(slideEl);
  });
  swiper.recalcSlides();
  swiper.slideTo(swiper.realIndex, 0);
}
var loop = {
  loopCreate,
  loopFix,
  loopDestroy
};
function setGrabCursor(moving) {
  const swiper = this;
  if (!swiper.params.simulateTouch || swiper.params.watchOverflow && swiper.isLocked || swiper.params.cssMode) return;
  const el = swiper.params.touchEventsTarget === "container" ? swiper.el : swiper.wrapperEl;
  if (swiper.isElement) {
    swiper.__preventObserver__ = true;
  }
  el.style.cursor = "move";
  el.style.cursor = moving ? "grabbing" : "grab";
  if (swiper.isElement) {
    requestAnimationFrame(() => {
      swiper.__preventObserver__ = false;
    });
  }
}
function unsetGrabCursor() {
  const swiper = this;
  if (swiper.params.watchOverflow && swiper.isLocked || swiper.params.cssMode) {
    return;
  }
  if (swiper.isElement) {
    swiper.__preventObserver__ = true;
  }
  swiper[swiper.params.touchEventsTarget === "container" ? "el" : "wrapperEl"].style.cursor = "";
  if (swiper.isElement) {
    requestAnimationFrame(() => {
      swiper.__preventObserver__ = false;
    });
  }
}
var grabCursor = {
  setGrabCursor,
  unsetGrabCursor
};
function closestElement(selector, base = this) {
  function __closestFrom(el) {
    if (!el || el === getDocument() || el === getWindow()) return null;
    if (el.assignedSlot) el = el.assignedSlot;
    const found = el.closest(selector);
    if (!found && !el.getRootNode) {
      return null;
    }
    return found || __closestFrom(el.getRootNode().host);
  }
  return __closestFrom(base);
}
function preventEdgeSwipe(swiper, event2, startX) {
  const window2 = getWindow();
  const {
    params
  } = swiper;
  const edgeSwipeDetection = params.edgeSwipeDetection;
  const edgeSwipeThreshold = params.edgeSwipeThreshold;
  if (edgeSwipeDetection && (startX <= edgeSwipeThreshold || startX >= window2.innerWidth - edgeSwipeThreshold)) {
    if (edgeSwipeDetection === "prevent") {
      event2.preventDefault();
      return true;
    }
    return false;
  }
  return true;
}
function onTouchStart(event2) {
  const swiper = this;
  const document2 = getDocument();
  let e2 = event2;
  if (e2.originalEvent) e2 = e2.originalEvent;
  const data = swiper.touchEventsData;
  if (e2.type === "pointerdown") {
    if (data.pointerId !== null && data.pointerId !== e2.pointerId) {
      return;
    }
    data.pointerId = e2.pointerId;
  } else if (e2.type === "touchstart" && e2.targetTouches.length === 1) {
    data.touchId = e2.targetTouches[0].identifier;
  }
  if (e2.type === "touchstart") {
    preventEdgeSwipe(swiper, e2, e2.targetTouches[0].pageX);
    return;
  }
  const {
    params,
    touches,
    enabled
  } = swiper;
  if (!enabled) return;
  if (!params.simulateTouch && e2.pointerType === "mouse") return;
  if (swiper.animating && params.preventInteractionOnTransition) {
    return;
  }
  if (!swiper.animating && params.cssMode && params.loop) {
    swiper.loopFix();
  }
  let targetEl = e2.target;
  if (params.touchEventsTarget === "wrapper") {
    if (!elementIsChildOf(targetEl, swiper.wrapperEl)) return;
  }
  if ("which" in e2 && e2.which === 3) return;
  if ("button" in e2 && e2.button > 0) return;
  if (data.isTouched && data.isMoved) return;
  const swipingClassHasValue = !!params.noSwipingClass && params.noSwipingClass !== "";
  const eventPath = e2.composedPath ? e2.composedPath() : e2.path;
  if (swipingClassHasValue && e2.target && e2.target.shadowRoot && eventPath) {
    targetEl = eventPath[0];
  }
  const noSwipingSelector = params.noSwipingSelector ? params.noSwipingSelector : `.${params.noSwipingClass}`;
  const isTargetShadow = !!(e2.target && e2.target.shadowRoot);
  if (params.noSwiping && (isTargetShadow ? closestElement(noSwipingSelector, targetEl) : targetEl.closest(noSwipingSelector))) {
    swiper.allowClick = true;
    return;
  }
  if (params.swipeHandler) {
    if (!targetEl.closest(params.swipeHandler)) return;
  }
  touches.currentX = e2.pageX;
  touches.currentY = e2.pageY;
  const startX = touches.currentX;
  const startY = touches.currentY;
  if (!preventEdgeSwipe(swiper, e2, startX)) {
    return;
  }
  Object.assign(data, {
    isTouched: true,
    isMoved: false,
    allowTouchCallbacks: true,
    isScrolling: void 0,
    startMoving: void 0
  });
  touches.startX = startX;
  touches.startY = startY;
  data.touchStartTime = now();
  swiper.allowClick = true;
  swiper.updateSize();
  swiper.swipeDirection = void 0;
  if (params.threshold > 0) data.allowThresholdMove = false;
  let preventDefault = true;
  if (targetEl.matches(data.focusableElements)) {
    preventDefault = false;
    if (targetEl.nodeName === "SELECT") {
      data.isTouched = false;
    }
  }
  if (document2.activeElement && document2.activeElement.matches(data.focusableElements) && document2.activeElement !== targetEl && (e2.pointerType === "mouse" || e2.pointerType !== "mouse" && !targetEl.matches(data.focusableElements))) {
    document2.activeElement.blur();
  }
  const shouldPreventDefault = preventDefault && swiper.allowTouchMove && params.touchStartPreventDefault;
  if ((params.touchStartForcePreventDefault || shouldPreventDefault) && !targetEl.isContentEditable) {
    e2.preventDefault();
  }
  if (params.freeMode && params.freeMode.enabled && swiper.freeMode && swiper.animating && !params.cssMode) {
    swiper.freeMode.onTouchStart();
  }
  swiper.emit("touchStart", e2);
}
function onTouchMove(event2) {
  const document2 = getDocument();
  const swiper = this;
  const data = swiper.touchEventsData;
  const {
    params,
    touches,
    rtlTranslate: rtl,
    enabled
  } = swiper;
  if (!enabled) return;
  if (!params.simulateTouch && event2.pointerType === "mouse") return;
  let e2 = event2;
  if (e2.originalEvent) e2 = e2.originalEvent;
  if (e2.type === "pointermove") {
    if (data.touchId !== null) return;
    const id = e2.pointerId;
    if (id !== data.pointerId) return;
  }
  let targetTouch;
  if (e2.type === "touchmove") {
    targetTouch = [...e2.changedTouches].find((t2) => t2.identifier === data.touchId);
    if (!targetTouch || targetTouch.identifier !== data.touchId) return;
  } else {
    targetTouch = e2;
  }
  if (!data.isTouched) {
    if (data.startMoving && data.isScrolling) {
      swiper.emit("touchMoveOpposite", e2);
    }
    return;
  }
  const pageX = targetTouch.pageX;
  const pageY = targetTouch.pageY;
  if (e2.preventedByNestedSwiper) {
    touches.startX = pageX;
    touches.startY = pageY;
    return;
  }
  if (!swiper.allowTouchMove) {
    if (!e2.target.matches(data.focusableElements)) {
      swiper.allowClick = false;
    }
    if (data.isTouched) {
      Object.assign(touches, {
        startX: pageX,
        startY: pageY,
        currentX: pageX,
        currentY: pageY
      });
      data.touchStartTime = now();
    }
    return;
  }
  if (params.touchReleaseOnEdges && !params.loop) {
    if (swiper.isVertical()) {
      if (pageY < touches.startY && swiper.translate <= swiper.maxTranslate() || pageY > touches.startY && swiper.translate >= swiper.minTranslate()) {
        data.isTouched = false;
        data.isMoved = false;
        return;
      }
    } else if (rtl && (pageX > touches.startX && -swiper.translate <= swiper.maxTranslate() || pageX < touches.startX && -swiper.translate >= swiper.minTranslate())) {
      return;
    } else if (!rtl && (pageX < touches.startX && swiper.translate <= swiper.maxTranslate() || pageX > touches.startX && swiper.translate >= swiper.minTranslate())) {
      return;
    }
  }
  if (document2.activeElement && document2.activeElement.matches(data.focusableElements) && document2.activeElement !== e2.target && e2.pointerType !== "mouse") {
    document2.activeElement.blur();
  }
  if (document2.activeElement) {
    if (e2.target === document2.activeElement && e2.target.matches(data.focusableElements)) {
      data.isMoved = true;
      swiper.allowClick = false;
      return;
    }
  }
  if (data.allowTouchCallbacks) {
    swiper.emit("touchMove", e2);
  }
  touches.previousX = touches.currentX;
  touches.previousY = touches.currentY;
  touches.currentX = pageX;
  touches.currentY = pageY;
  const diffX = touches.currentX - touches.startX;
  const diffY = touches.currentY - touches.startY;
  if (swiper.params.threshold && Math.sqrt(diffX ** 2 + diffY ** 2) < swiper.params.threshold) return;
  if (typeof data.isScrolling === "undefined") {
    let touchAngle;
    if (swiper.isHorizontal() && touches.currentY === touches.startY || swiper.isVertical() && touches.currentX === touches.startX) {
      data.isScrolling = false;
    } else {
      if (diffX * diffX + diffY * diffY >= 25) {
        touchAngle = Math.atan2(Math.abs(diffY), Math.abs(diffX)) * 180 / Math.PI;
        data.isScrolling = swiper.isHorizontal() ? touchAngle > params.touchAngle : 90 - touchAngle > params.touchAngle;
      }
    }
  }
  if (data.isScrolling) {
    swiper.emit("touchMoveOpposite", e2);
  }
  if (typeof data.startMoving === "undefined") {
    if (touches.currentX !== touches.startX || touches.currentY !== touches.startY) {
      data.startMoving = true;
    }
  }
  if (data.isScrolling || e2.type === "touchmove" && data.preventTouchMoveFromPointerMove) {
    data.isTouched = false;
    return;
  }
  if (!data.startMoving) {
    return;
  }
  swiper.allowClick = false;
  if (!params.cssMode && e2.cancelable) {
    e2.preventDefault();
  }
  if (params.touchMoveStopPropagation && !params.nested) {
    e2.stopPropagation();
  }
  let diff = swiper.isHorizontal() ? diffX : diffY;
  let touchesDiff = swiper.isHorizontal() ? touches.currentX - touches.previousX : touches.currentY - touches.previousY;
  if (params.oneWayMovement) {
    diff = Math.abs(diff) * (rtl ? 1 : -1);
    touchesDiff = Math.abs(touchesDiff) * (rtl ? 1 : -1);
  }
  touches.diff = diff;
  diff *= params.touchRatio;
  if (rtl) {
    diff = -diff;
    touchesDiff = -touchesDiff;
  }
  const prevTouchesDirection = swiper.touchesDirection;
  swiper.swipeDirection = diff > 0 ? "prev" : "next";
  swiper.touchesDirection = touchesDiff > 0 ? "prev" : "next";
  const isLoop = swiper.params.loop && !params.cssMode;
  const allowLoopFix = swiper.touchesDirection === "next" && swiper.allowSlideNext || swiper.touchesDirection === "prev" && swiper.allowSlidePrev;
  if (!data.isMoved) {
    if (isLoop && allowLoopFix) {
      swiper.loopFix({
        direction: swiper.swipeDirection
      });
    }
    data.startTranslate = swiper.getTranslate();
    swiper.setTransition(0);
    if (swiper.animating) {
      const evt = new window.CustomEvent("transitionend", {
        bubbles: true,
        cancelable: true,
        detail: {
          bySwiperTouchMove: true
        }
      });
      swiper.wrapperEl.dispatchEvent(evt);
    }
    data.allowMomentumBounce = false;
    if (params.grabCursor && (swiper.allowSlideNext === true || swiper.allowSlidePrev === true)) {
      swiper.setGrabCursor(true);
    }
    swiper.emit("sliderFirstMove", e2);
  }
  (/* @__PURE__ */ new Date()).getTime();
  if (params._loopSwapReset !== false && data.isMoved && data.allowThresholdMove && prevTouchesDirection !== swiper.touchesDirection && isLoop && allowLoopFix && Math.abs(diff) >= 1) {
    Object.assign(touches, {
      startX: pageX,
      startY: pageY,
      currentX: pageX,
      currentY: pageY,
      startTranslate: data.currentTranslate
    });
    data.loopSwapReset = true;
    data.startTranslate = data.currentTranslate;
    return;
  }
  swiper.emit("sliderMove", e2);
  data.isMoved = true;
  data.currentTranslate = diff + data.startTranslate;
  let disableParentSwiper = true;
  let resistanceRatio = params.resistanceRatio;
  if (params.touchReleaseOnEdges) {
    resistanceRatio = 0;
  }
  if (diff > 0) {
    if (isLoop && allowLoopFix && true && data.allowThresholdMove && data.currentTranslate > (params.centeredSlides ? swiper.minTranslate() - swiper.slidesSizesGrid[swiper.activeIndex + 1] - (params.slidesPerView !== "auto" && swiper.slides.length - params.slidesPerView >= 2 ? swiper.slidesSizesGrid[swiper.activeIndex + 1] + swiper.params.spaceBetween : 0) - swiper.params.spaceBetween : swiper.minTranslate())) {
      swiper.loopFix({
        direction: "prev",
        setTranslate: true,
        activeSlideIndex: 0
      });
    }
    if (data.currentTranslate > swiper.minTranslate()) {
      disableParentSwiper = false;
      if (params.resistance) {
        data.currentTranslate = swiper.minTranslate() - 1 + (-swiper.minTranslate() + data.startTranslate + diff) ** resistanceRatio;
      }
    }
  } else if (diff < 0) {
    if (isLoop && allowLoopFix && true && data.allowThresholdMove && data.currentTranslate < (params.centeredSlides ? swiper.maxTranslate() + swiper.slidesSizesGrid[swiper.slidesSizesGrid.length - 1] + swiper.params.spaceBetween + (params.slidesPerView !== "auto" && swiper.slides.length - params.slidesPerView >= 2 ? swiper.slidesSizesGrid[swiper.slidesSizesGrid.length - 1] + swiper.params.spaceBetween : 0) : swiper.maxTranslate())) {
      swiper.loopFix({
        direction: "next",
        setTranslate: true,
        activeSlideIndex: swiper.slides.length - (params.slidesPerView === "auto" ? swiper.slidesPerViewDynamic() : Math.ceil(parseFloat(params.slidesPerView, 10)))
      });
    }
    if (data.currentTranslate < swiper.maxTranslate()) {
      disableParentSwiper = false;
      if (params.resistance) {
        data.currentTranslate = swiper.maxTranslate() + 1 - (swiper.maxTranslate() - data.startTranslate - diff) ** resistanceRatio;
      }
    }
  }
  if (disableParentSwiper) {
    e2.preventedByNestedSwiper = true;
  }
  if (!swiper.allowSlideNext && swiper.swipeDirection === "next" && data.currentTranslate < data.startTranslate) {
    data.currentTranslate = data.startTranslate;
  }
  if (!swiper.allowSlidePrev && swiper.swipeDirection === "prev" && data.currentTranslate > data.startTranslate) {
    data.currentTranslate = data.startTranslate;
  }
  if (!swiper.allowSlidePrev && !swiper.allowSlideNext) {
    data.currentTranslate = data.startTranslate;
  }
  if (params.threshold > 0) {
    if (Math.abs(diff) > params.threshold || data.allowThresholdMove) {
      if (!data.allowThresholdMove) {
        data.allowThresholdMove = true;
        touches.startX = touches.currentX;
        touches.startY = touches.currentY;
        data.currentTranslate = data.startTranslate;
        touches.diff = swiper.isHorizontal() ? touches.currentX - touches.startX : touches.currentY - touches.startY;
        return;
      }
    } else {
      data.currentTranslate = data.startTranslate;
      return;
    }
  }
  if (!params.followFinger || params.cssMode) return;
  if (params.freeMode && params.freeMode.enabled && swiper.freeMode || params.watchSlidesProgress) {
    swiper.updateActiveIndex();
    swiper.updateSlidesClasses();
  }
  if (params.freeMode && params.freeMode.enabled && swiper.freeMode) {
    swiper.freeMode.onTouchMove();
  }
  swiper.updateProgress(data.currentTranslate);
  swiper.setTranslate(data.currentTranslate);
}
function onTouchEnd(event2) {
  const swiper = this;
  const data = swiper.touchEventsData;
  let e2 = event2;
  if (e2.originalEvent) e2 = e2.originalEvent;
  let targetTouch;
  const isTouchEvent = e2.type === "touchend" || e2.type === "touchcancel";
  if (!isTouchEvent) {
    if (data.touchId !== null) return;
    if (e2.pointerId !== data.pointerId) return;
    targetTouch = e2;
  } else {
    targetTouch = [...e2.changedTouches].find((t2) => t2.identifier === data.touchId);
    if (!targetTouch || targetTouch.identifier !== data.touchId) return;
  }
  if (["pointercancel", "pointerout", "pointerleave", "contextmenu"].includes(e2.type)) {
    const proceed = ["pointercancel", "contextmenu"].includes(e2.type) && (swiper.browser.isSafari || swiper.browser.isWebView);
    if (!proceed) {
      return;
    }
  }
  data.pointerId = null;
  data.touchId = null;
  const {
    params,
    touches,
    rtlTranslate: rtl,
    slidesGrid,
    enabled
  } = swiper;
  if (!enabled) return;
  if (!params.simulateTouch && e2.pointerType === "mouse") return;
  if (data.allowTouchCallbacks) {
    swiper.emit("touchEnd", e2);
  }
  data.allowTouchCallbacks = false;
  if (!data.isTouched) {
    if (data.isMoved && params.grabCursor) {
      swiper.setGrabCursor(false);
    }
    data.isMoved = false;
    data.startMoving = false;
    return;
  }
  if (params.grabCursor && data.isMoved && data.isTouched && (swiper.allowSlideNext === true || swiper.allowSlidePrev === true)) {
    swiper.setGrabCursor(false);
  }
  const touchEndTime = now();
  const timeDiff = touchEndTime - data.touchStartTime;
  if (swiper.allowClick) {
    const pathTree = e2.path || e2.composedPath && e2.composedPath();
    swiper.updateClickedSlide(pathTree && pathTree[0] || e2.target, pathTree);
    swiper.emit("tap click", e2);
    if (timeDiff < 300 && touchEndTime - data.lastClickTime < 300) {
      swiper.emit("doubleTap doubleClick", e2);
    }
  }
  data.lastClickTime = now();
  nextTick(() => {
    if (!swiper.destroyed) swiper.allowClick = true;
  });
  if (!data.isTouched || !data.isMoved || !swiper.swipeDirection || touches.diff === 0 && !data.loopSwapReset || data.currentTranslate === data.startTranslate && !data.loopSwapReset) {
    data.isTouched = false;
    data.isMoved = false;
    data.startMoving = false;
    return;
  }
  data.isTouched = false;
  data.isMoved = false;
  data.startMoving = false;
  let currentPos;
  if (params.followFinger) {
    currentPos = rtl ? swiper.translate : -swiper.translate;
  } else {
    currentPos = -data.currentTranslate;
  }
  if (params.cssMode) {
    return;
  }
  if (params.freeMode && params.freeMode.enabled) {
    swiper.freeMode.onTouchEnd({
      currentPos
    });
    return;
  }
  const swipeToLast = currentPos >= -swiper.maxTranslate() && !swiper.params.loop;
  let stopIndex = 0;
  let groupSize = swiper.slidesSizesGrid[0];
  for (let i2 = 0; i2 < slidesGrid.length; i2 += i2 < params.slidesPerGroupSkip ? 1 : params.slidesPerGroup) {
    const increment2 = i2 < params.slidesPerGroupSkip - 1 ? 1 : params.slidesPerGroup;
    if (typeof slidesGrid[i2 + increment2] !== "undefined") {
      if (swipeToLast || currentPos >= slidesGrid[i2] && currentPos < slidesGrid[i2 + increment2]) {
        stopIndex = i2;
        groupSize = slidesGrid[i2 + increment2] - slidesGrid[i2];
      }
    } else if (swipeToLast || currentPos >= slidesGrid[i2]) {
      stopIndex = i2;
      groupSize = slidesGrid[slidesGrid.length - 1] - slidesGrid[slidesGrid.length - 2];
    }
  }
  let rewindFirstIndex = null;
  let rewindLastIndex = null;
  if (params.rewind) {
    if (swiper.isBeginning) {
      rewindLastIndex = params.virtual && params.virtual.enabled && swiper.virtual ? swiper.virtual.slides.length - 1 : swiper.slides.length - 1;
    } else if (swiper.isEnd) {
      rewindFirstIndex = 0;
    }
  }
  const ratio = (currentPos - slidesGrid[stopIndex]) / groupSize;
  const increment = stopIndex < params.slidesPerGroupSkip - 1 ? 1 : params.slidesPerGroup;
  if (timeDiff > params.longSwipesMs) {
    if (!params.longSwipes) {
      swiper.slideTo(swiper.activeIndex);
      return;
    }
    if (swiper.swipeDirection === "next") {
      if (ratio >= params.longSwipesRatio) swiper.slideTo(params.rewind && swiper.isEnd ? rewindFirstIndex : stopIndex + increment);
      else swiper.slideTo(stopIndex);
    }
    if (swiper.swipeDirection === "prev") {
      if (ratio > 1 - params.longSwipesRatio) {
        swiper.slideTo(stopIndex + increment);
      } else if (rewindLastIndex !== null && ratio < 0 && Math.abs(ratio) > params.longSwipesRatio) {
        swiper.slideTo(rewindLastIndex);
      } else {
        swiper.slideTo(stopIndex);
      }
    }
  } else {
    if (!params.shortSwipes) {
      swiper.slideTo(swiper.activeIndex);
      return;
    }
    const isNavButtonTarget = swiper.navigation && (e2.target === swiper.navigation.nextEl || e2.target === swiper.navigation.prevEl);
    if (!isNavButtonTarget) {
      if (swiper.swipeDirection === "next") {
        swiper.slideTo(rewindFirstIndex !== null ? rewindFirstIndex : stopIndex + increment);
      }
      if (swiper.swipeDirection === "prev") {
        swiper.slideTo(rewindLastIndex !== null ? rewindLastIndex : stopIndex);
      }
    } else if (e2.target === swiper.navigation.nextEl) {
      swiper.slideTo(stopIndex + increment);
    } else {
      swiper.slideTo(stopIndex);
    }
  }
}
function onResize() {
  const swiper = this;
  const {
    params,
    el
  } = swiper;
  if (el && el.offsetWidth === 0) return;
  if (params.breakpoints) {
    swiper.setBreakpoint();
  }
  const {
    allowSlideNext,
    allowSlidePrev,
    snapGrid
  } = swiper;
  const isVirtual = swiper.virtual && swiper.params.virtual.enabled;
  swiper.allowSlideNext = true;
  swiper.allowSlidePrev = true;
  swiper.updateSize();
  swiper.updateSlides();
  swiper.updateSlidesClasses();
  const isVirtualLoop = isVirtual && params.loop;
  if ((params.slidesPerView === "auto" || params.slidesPerView > 1) && swiper.isEnd && !swiper.isBeginning && !swiper.params.centeredSlides && !isVirtualLoop) {
    swiper.slideTo(swiper.slides.length - 1, 0, false, true);
  } else {
    if (swiper.params.loop && !isVirtual) {
      swiper.slideToLoop(swiper.realIndex, 0, false, true);
    } else {
      swiper.slideTo(swiper.activeIndex, 0, false, true);
    }
  }
  if (swiper.autoplay && swiper.autoplay.running && swiper.autoplay.paused) {
    clearTimeout(swiper.autoplay.resizeTimeout);
    swiper.autoplay.resizeTimeout = setTimeout(() => {
      if (swiper.autoplay && swiper.autoplay.running && swiper.autoplay.paused) {
        swiper.autoplay.resume();
      }
    }, 500);
  }
  swiper.allowSlidePrev = allowSlidePrev;
  swiper.allowSlideNext = allowSlideNext;
  if (swiper.params.watchOverflow && snapGrid !== swiper.snapGrid) {
    swiper.checkOverflow();
  }
}
function onClick(e2) {
  const swiper = this;
  if (!swiper.enabled) return;
  if (!swiper.allowClick) {
    if (swiper.params.preventClicks) e2.preventDefault();
    if (swiper.params.preventClicksPropagation && swiper.animating) {
      e2.stopPropagation();
      e2.stopImmediatePropagation();
    }
  }
}
function onScroll() {
  const swiper = this;
  const {
    wrapperEl,
    rtlTranslate,
    enabled
  } = swiper;
  if (!enabled) return;
  swiper.previousTranslate = swiper.translate;
  if (swiper.isHorizontal()) {
    swiper.translate = -wrapperEl.scrollLeft;
  } else {
    swiper.translate = -wrapperEl.scrollTop;
  }
  if (swiper.translate === 0) swiper.translate = 0;
  swiper.updateActiveIndex();
  swiper.updateSlidesClasses();
  let newProgress;
  const translatesDiff = swiper.maxTranslate() - swiper.minTranslate();
  if (translatesDiff === 0) {
    newProgress = 0;
  } else {
    newProgress = (swiper.translate - swiper.minTranslate()) / translatesDiff;
  }
  if (newProgress !== swiper.progress) {
    swiper.updateProgress(rtlTranslate ? -swiper.translate : swiper.translate);
  }
  swiper.emit("setTranslate", swiper.translate, false);
}
function onLoad(e2) {
  const swiper = this;
  processLazyPreloader(swiper, e2.target);
  if (swiper.params.cssMode || swiper.params.slidesPerView !== "auto" && !swiper.params.autoHeight) {
    return;
  }
  swiper.update();
}
function onDocumentTouchStart() {
  const swiper = this;
  if (swiper.documentTouchHandlerProceeded) return;
  swiper.documentTouchHandlerProceeded = true;
  if (swiper.params.touchReleaseOnEdges) {
    swiper.el.style.touchAction = "auto";
  }
}
const events = (swiper, method) => {
  const document2 = getDocument();
  const {
    params,
    el,
    wrapperEl,
    device
  } = swiper;
  const capture = !!params.nested;
  const domMethod = method === "on" ? "addEventListener" : "removeEventListener";
  const swiperMethod = method;
  if (!el || typeof el === "string") return;
  document2[domMethod]("touchstart", swiper.onDocumentTouchStart, {
    passive: false,
    capture
  });
  el[domMethod]("touchstart", swiper.onTouchStart, {
    passive: false
  });
  el[domMethod]("pointerdown", swiper.onTouchStart, {
    passive: false
  });
  document2[domMethod]("touchmove", swiper.onTouchMove, {
    passive: false,
    capture
  });
  document2[domMethod]("pointermove", swiper.onTouchMove, {
    passive: false,
    capture
  });
  document2[domMethod]("touchend", swiper.onTouchEnd, {
    passive: true
  });
  document2[domMethod]("pointerup", swiper.onTouchEnd, {
    passive: true
  });
  document2[domMethod]("pointercancel", swiper.onTouchEnd, {
    passive: true
  });
  document2[domMethod]("touchcancel", swiper.onTouchEnd, {
    passive: true
  });
  document2[domMethod]("pointerout", swiper.onTouchEnd, {
    passive: true
  });
  document2[domMethod]("pointerleave", swiper.onTouchEnd, {
    passive: true
  });
  document2[domMethod]("contextmenu", swiper.onTouchEnd, {
    passive: true
  });
  if (params.preventClicks || params.preventClicksPropagation) {
    el[domMethod]("click", swiper.onClick, true);
  }
  if (params.cssMode) {
    wrapperEl[domMethod]("scroll", swiper.onScroll);
  }
  if (params.updateOnWindowResize) {
    swiper[swiperMethod](device.ios || device.android ? "resize orientationchange observerUpdate" : "resize observerUpdate", onResize, true);
  } else {
    swiper[swiperMethod]("observerUpdate", onResize, true);
  }
  el[domMethod]("load", swiper.onLoad, {
    capture: true
  });
};
function attachEvents() {
  const swiper = this;
  const {
    params
  } = swiper;
  swiper.onTouchStart = onTouchStart.bind(swiper);
  swiper.onTouchMove = onTouchMove.bind(swiper);
  swiper.onTouchEnd = onTouchEnd.bind(swiper);
  swiper.onDocumentTouchStart = onDocumentTouchStart.bind(swiper);
  if (params.cssMode) {
    swiper.onScroll = onScroll.bind(swiper);
  }
  swiper.onClick = onClick.bind(swiper);
  swiper.onLoad = onLoad.bind(swiper);
  events(swiper, "on");
}
function detachEvents() {
  const swiper = this;
  events(swiper, "off");
}
var events$1 = {
  attachEvents,
  detachEvents
};
const isGridEnabled = (swiper, params) => {
  return swiper.grid && params.grid && params.grid.rows > 1;
};
function setBreakpoint() {
  const swiper = this;
  const {
    realIndex,
    initialized,
    params,
    el
  } = swiper;
  const breakpoints2 = params.breakpoints;
  if (!breakpoints2 || breakpoints2 && Object.keys(breakpoints2).length === 0) return;
  const document2 = getDocument();
  const breakpointsBase = params.breakpointsBase === "window" || !params.breakpointsBase ? params.breakpointsBase : "container";
  const breakpointContainer = ["window", "container"].includes(params.breakpointsBase) || !params.breakpointsBase ? swiper.el : document2.querySelector(params.breakpointsBase);
  const breakpoint = swiper.getBreakpoint(breakpoints2, breakpointsBase, breakpointContainer);
  if (!breakpoint || swiper.currentBreakpoint === breakpoint) return;
  const breakpointOnlyParams = breakpoint in breakpoints2 ? breakpoints2[breakpoint] : void 0;
  const breakpointParams = breakpointOnlyParams || swiper.originalParams;
  const wasMultiRow = isGridEnabled(swiper, params);
  const isMultiRow = isGridEnabled(swiper, breakpointParams);
  const wasGrabCursor = swiper.params.grabCursor;
  const isGrabCursor = breakpointParams.grabCursor;
  const wasEnabled = params.enabled;
  if (wasMultiRow && !isMultiRow) {
    el.classList.remove(`${params.containerModifierClass}grid`, `${params.containerModifierClass}grid-column`);
    swiper.emitContainerClasses();
  } else if (!wasMultiRow && isMultiRow) {
    el.classList.add(`${params.containerModifierClass}grid`);
    if (breakpointParams.grid.fill && breakpointParams.grid.fill === "column" || !breakpointParams.grid.fill && params.grid.fill === "column") {
      el.classList.add(`${params.containerModifierClass}grid-column`);
    }
    swiper.emitContainerClasses();
  }
  if (wasGrabCursor && !isGrabCursor) {
    swiper.unsetGrabCursor();
  } else if (!wasGrabCursor && isGrabCursor) {
    swiper.setGrabCursor();
  }
  ["navigation", "pagination", "scrollbar"].forEach((prop) => {
    if (typeof breakpointParams[prop] === "undefined") return;
    const wasModuleEnabled = params[prop] && params[prop].enabled;
    const isModuleEnabled = breakpointParams[prop] && breakpointParams[prop].enabled;
    if (wasModuleEnabled && !isModuleEnabled) {
      swiper[prop].disable();
    }
    if (!wasModuleEnabled && isModuleEnabled) {
      swiper[prop].enable();
    }
  });
  const directionChanged = breakpointParams.direction && breakpointParams.direction !== params.direction;
  const needsReLoop = params.loop && (breakpointParams.slidesPerView !== params.slidesPerView || directionChanged);
  const wasLoop = params.loop;
  if (directionChanged && initialized) {
    swiper.changeDirection();
  }
  extend(swiper.params, breakpointParams);
  const isEnabled = swiper.params.enabled;
  const hasLoop = swiper.params.loop;
  Object.assign(swiper, {
    allowTouchMove: swiper.params.allowTouchMove,
    allowSlideNext: swiper.params.allowSlideNext,
    allowSlidePrev: swiper.params.allowSlidePrev
  });
  if (wasEnabled && !isEnabled) {
    swiper.disable();
  } else if (!wasEnabled && isEnabled) {
    swiper.enable();
  }
  swiper.currentBreakpoint = breakpoint;
  swiper.emit("_beforeBreakpoint", breakpointParams);
  if (initialized) {
    if (needsReLoop) {
      swiper.loopDestroy();
      swiper.loopCreate(realIndex);
      swiper.updateSlides();
    } else if (!wasLoop && hasLoop) {
      swiper.loopCreate(realIndex);
      swiper.updateSlides();
    } else if (wasLoop && !hasLoop) {
      swiper.loopDestroy();
    }
  }
  swiper.emit("breakpoint", breakpointParams);
}
function getBreakpoint(breakpoints2, base = "window", containerEl) {
  if (!breakpoints2 || base === "container" && !containerEl) return void 0;
  let breakpoint = false;
  const window2 = getWindow();
  const currentHeight = base === "window" ? window2.innerHeight : containerEl.clientHeight;
  const points = Object.keys(breakpoints2).map((point) => {
    if (typeof point === "string" && point.indexOf("@") === 0) {
      const minRatio = parseFloat(point.substr(1));
      const value = currentHeight * minRatio;
      return {
        value,
        point
      };
    }
    return {
      value: point,
      point
    };
  });
  points.sort((a2, b2) => parseInt(a2.value, 10) - parseInt(b2.value, 10));
  for (let i2 = 0; i2 < points.length; i2 += 1) {
    const {
      point,
      value
    } = points[i2];
    if (base === "window") {
      if (window2.matchMedia(`(min-width: ${value}px)`).matches) {
        breakpoint = point;
      }
    } else if (value <= containerEl.clientWidth) {
      breakpoint = point;
    }
  }
  return breakpoint || "max";
}
var breakpoints = {
  setBreakpoint,
  getBreakpoint
};
function prepareClasses(entries, prefix) {
  const resultClasses = [];
  entries.forEach((item) => {
    if (typeof item === "object") {
      Object.keys(item).forEach((classNames) => {
        if (item[classNames]) {
          resultClasses.push(prefix + classNames);
        }
      });
    } else if (typeof item === "string") {
      resultClasses.push(prefix + item);
    }
  });
  return resultClasses;
}
function addClasses() {
  const swiper = this;
  const {
    classNames,
    params,
    rtl,
    el,
    device
  } = swiper;
  const suffixes = prepareClasses(["initialized", params.direction, {
    "free-mode": swiper.params.freeMode && params.freeMode.enabled
  }, {
    "autoheight": params.autoHeight
  }, {
    "rtl": rtl
  }, {
    "grid": params.grid && params.grid.rows > 1
  }, {
    "grid-column": params.grid && params.grid.rows > 1 && params.grid.fill === "column"
  }, {
    "android": device.android
  }, {
    "ios": device.ios
  }, {
    "css-mode": params.cssMode
  }, {
    "centered": params.cssMode && params.centeredSlides
  }, {
    "watch-progress": params.watchSlidesProgress
  }], params.containerModifierClass);
  classNames.push(...suffixes);
  el.classList.add(...classNames);
  swiper.emitContainerClasses();
}
function removeClasses() {
  const swiper = this;
  const {
    el,
    classNames
  } = swiper;
  if (!el || typeof el === "string") return;
  el.classList.remove(...classNames);
  swiper.emitContainerClasses();
}
var classes = {
  addClasses,
  removeClasses
};
function checkOverflow() {
  const swiper = this;
  const {
    isLocked: wasLocked,
    params
  } = swiper;
  const {
    slidesOffsetBefore
  } = params;
  if (slidesOffsetBefore) {
    const lastSlideIndex = swiper.slides.length - 1;
    const lastSlideRightEdge = swiper.slidesGrid[lastSlideIndex] + swiper.slidesSizesGrid[lastSlideIndex] + slidesOffsetBefore * 2;
    swiper.isLocked = swiper.size > lastSlideRightEdge;
  } else {
    swiper.isLocked = swiper.snapGrid.length === 1;
  }
  if (params.allowSlideNext === true) {
    swiper.allowSlideNext = !swiper.isLocked;
  }
  if (params.allowSlidePrev === true) {
    swiper.allowSlidePrev = !swiper.isLocked;
  }
  if (wasLocked && wasLocked !== swiper.isLocked) {
    swiper.isEnd = false;
  }
  if (wasLocked !== swiper.isLocked) {
    swiper.emit(swiper.isLocked ? "lock" : "unlock");
  }
}
var checkOverflow$1 = {
  checkOverflow
};
var defaults = {
  init: true,
  direction: "horizontal",
  oneWayMovement: false,
  swiperElementNodeName: "SWIPER-CONTAINER",
  touchEventsTarget: "wrapper",
  initialSlide: 0,
  speed: 300,
  cssMode: false,
  updateOnWindowResize: true,
  resizeObserver: true,
  nested: false,
  createElements: false,
  eventsPrefix: "swiper",
  enabled: true,
  focusableElements: "input, select, option, textarea, button, video, label",
  // Overrides
  width: null,
  height: null,
  //
  preventInteractionOnTransition: false,
  // ssr
  userAgent: null,
  url: null,
  // To support iOS's swipe-to-go-back gesture (when being used in-app).
  edgeSwipeDetection: false,
  edgeSwipeThreshold: 20,
  // Autoheight
  autoHeight: false,
  // Set wrapper width
  setWrapperSize: false,
  // Virtual Translate
  virtualTranslate: false,
  // Effects
  effect: "slide",
  // 'slide' or 'fade' or 'cube' or 'coverflow' or 'flip'
  // Breakpoints
  breakpoints: void 0,
  breakpointsBase: "window",
  // Slides grid
  spaceBetween: 0,
  slidesPerView: 1,
  slidesPerGroup: 1,
  slidesPerGroupSkip: 0,
  slidesPerGroupAuto: false,
  centeredSlides: false,
  centeredSlidesBounds: false,
  slidesOffsetBefore: 0,
  // in px
  slidesOffsetAfter: 0,
  // in px
  normalizeSlideIndex: true,
  centerInsufficientSlides: false,
  // Disable swiper and hide navigation when container not overflow
  watchOverflow: true,
  // Round length
  roundLengths: false,
  // Touches
  touchRatio: 1,
  touchAngle: 45,
  simulateTouch: true,
  shortSwipes: true,
  longSwipes: true,
  longSwipesRatio: 0.5,
  longSwipesMs: 300,
  followFinger: true,
  allowTouchMove: true,
  threshold: 5,
  touchMoveStopPropagation: false,
  touchStartPreventDefault: true,
  touchStartForcePreventDefault: false,
  touchReleaseOnEdges: false,
  // Unique Navigation Elements
  uniqueNavElements: true,
  // Resistance
  resistance: true,
  resistanceRatio: 0.85,
  // Progress
  watchSlidesProgress: false,
  // Cursor
  grabCursor: false,
  // Clicks
  preventClicks: true,
  preventClicksPropagation: true,
  slideToClickedSlide: false,
  // loop
  loop: false,
  loopAddBlankSlides: true,
  loopAdditionalSlides: 0,
  loopPreventsSliding: true,
  // rewind
  rewind: false,
  // Swiping/no swiping
  allowSlidePrev: true,
  allowSlideNext: true,
  swipeHandler: null,
  // '.swipe-handler',
  noSwiping: true,
  noSwipingClass: "swiper-no-swiping",
  noSwipingSelector: null,
  // Passive Listeners
  passiveListeners: true,
  maxBackfaceHiddenSlides: 10,
  // NS
  containerModifierClass: "swiper-",
  // NEW
  slideClass: "swiper-slide",
  slideBlankClass: "swiper-slide-blank",
  slideActiveClass: "swiper-slide-active",
  slideVisibleClass: "swiper-slide-visible",
  slideFullyVisibleClass: "swiper-slide-fully-visible",
  slideNextClass: "swiper-slide-next",
  slidePrevClass: "swiper-slide-prev",
  wrapperClass: "swiper-wrapper",
  lazyPreloaderClass: "swiper-lazy-preloader",
  lazyPreloadPrevNext: 0,
  // Callbacks
  runCallbacksOnInit: true,
  // Internals
  _emitClasses: false
};
function moduleExtendParams(params, allModulesParams) {
  return function extendParams(obj = {}) {
    const moduleParamName = Object.keys(obj)[0];
    const moduleParams = obj[moduleParamName];
    if (typeof moduleParams !== "object" || moduleParams === null) {
      extend(allModulesParams, obj);
      return;
    }
    if (params[moduleParamName] === true) {
      params[moduleParamName] = {
        enabled: true
      };
    }
    if (moduleParamName === "navigation" && params[moduleParamName] && params[moduleParamName].enabled && !params[moduleParamName].prevEl && !params[moduleParamName].nextEl) {
      params[moduleParamName].auto = true;
    }
    if (["pagination", "scrollbar"].indexOf(moduleParamName) >= 0 && params[moduleParamName] && params[moduleParamName].enabled && !params[moduleParamName].el) {
      params[moduleParamName].auto = true;
    }
    if (!(moduleParamName in params && "enabled" in moduleParams)) {
      extend(allModulesParams, obj);
      return;
    }
    if (typeof params[moduleParamName] === "object" && !("enabled" in params[moduleParamName])) {
      params[moduleParamName].enabled = true;
    }
    if (!params[moduleParamName]) params[moduleParamName] = {
      enabled: false
    };
    extend(allModulesParams, obj);
  };
}
const prototypes = {
  eventsEmitter,
  update,
  translate,
  transition,
  slide,
  loop,
  grabCursor,
  events: events$1,
  breakpoints,
  checkOverflow: checkOverflow$1,
  classes
};
const extendedDefaults = {};
class Swiper {
  constructor(...args) {
    let el;
    let params;
    if (args.length === 1 && args[0].constructor && Object.prototype.toString.call(args[0]).slice(8, -1) === "Object") {
      params = args[0];
    } else {
      [el, params] = args;
    }
    if (!params) params = {};
    params = extend({}, params);
    if (el && !params.el) params.el = el;
    const document2 = getDocument();
    if (params.el && typeof params.el === "string" && document2.querySelectorAll(params.el).length > 1) {
      const swipers = [];
      document2.querySelectorAll(params.el).forEach((containerEl) => {
        const newParams = extend({}, params, {
          el: containerEl
        });
        swipers.push(new Swiper(newParams));
      });
      return swipers;
    }
    const swiper = this;
    swiper.__swiper__ = true;
    swiper.support = getSupport();
    swiper.device = getDevice({
      userAgent: params.userAgent
    });
    swiper.browser = getBrowser();
    swiper.eventsListeners = {};
    swiper.eventsAnyListeners = [];
    swiper.modules = [...swiper.__modules__];
    if (params.modules && Array.isArray(params.modules)) {
      swiper.modules.push(...params.modules);
    }
    const allModulesParams = {};
    swiper.modules.forEach((mod) => {
      mod({
        params,
        swiper,
        extendParams: moduleExtendParams(params, allModulesParams),
        on: swiper.on.bind(swiper),
        once: swiper.once.bind(swiper),
        off: swiper.off.bind(swiper),
        emit: swiper.emit.bind(swiper)
      });
    });
    const swiperParams = extend({}, defaults, allModulesParams);
    swiper.params = extend({}, swiperParams, extendedDefaults, params);
    swiper.originalParams = extend({}, swiper.params);
    swiper.passedParams = extend({}, params);
    if (swiper.params && swiper.params.on) {
      Object.keys(swiper.params.on).forEach((eventName) => {
        swiper.on(eventName, swiper.params.on[eventName]);
      });
    }
    if (swiper.params && swiper.params.onAny) {
      swiper.onAny(swiper.params.onAny);
    }
    Object.assign(swiper, {
      enabled: swiper.params.enabled,
      el,
      // Classes
      classNames: [],
      // Slides
      slides: [],
      slidesGrid: [],
      snapGrid: [],
      slidesSizesGrid: [],
      // isDirection
      isHorizontal() {
        return swiper.params.direction === "horizontal";
      },
      isVertical() {
        return swiper.params.direction === "vertical";
      },
      // Indexes
      activeIndex: 0,
      realIndex: 0,
      //
      isBeginning: true,
      isEnd: false,
      // Props
      translate: 0,
      previousTranslate: 0,
      progress: 0,
      velocity: 0,
      animating: false,
      cssOverflowAdjustment() {
        return Math.trunc(this.translate / 2 ** 23) * 2 ** 23;
      },
      // Locks
      allowSlideNext: swiper.params.allowSlideNext,
      allowSlidePrev: swiper.params.allowSlidePrev,
      // Touch Events
      touchEventsData: {
        isTouched: void 0,
        isMoved: void 0,
        allowTouchCallbacks: void 0,
        touchStartTime: void 0,
        isScrolling: void 0,
        currentTranslate: void 0,
        startTranslate: void 0,
        allowThresholdMove: void 0,
        // Form elements to match
        focusableElements: swiper.params.focusableElements,
        // Last click time
        lastClickTime: 0,
        clickTimeout: void 0,
        // Velocities
        velocities: [],
        allowMomentumBounce: void 0,
        startMoving: void 0,
        pointerId: null,
        touchId: null
      },
      // Clicks
      allowClick: true,
      // Touches
      allowTouchMove: swiper.params.allowTouchMove,
      touches: {
        startX: 0,
        startY: 0,
        currentX: 0,
        currentY: 0,
        diff: 0
      },
      // Images
      imagesToLoad: [],
      imagesLoaded: 0
    });
    swiper.emit("_swiper");
    if (swiper.params.init) {
      swiper.init();
    }
    return swiper;
  }
  getDirectionLabel(property) {
    if (this.isHorizontal()) {
      return property;
    }
    return {
      "width": "height",
      "margin-top": "margin-left",
      "margin-bottom ": "margin-right",
      "margin-left": "margin-top",
      "margin-right": "margin-bottom",
      "padding-left": "padding-top",
      "padding-right": "padding-bottom",
      "marginRight": "marginBottom"
    }[property];
  }
  getSlideIndex(slideEl) {
    const {
      slidesEl,
      params
    } = this;
    const slides = elementChildren(slidesEl, `.${params.slideClass}, swiper-slide`);
    const firstSlideIndex = elementIndex(slides[0]);
    return elementIndex(slideEl) - firstSlideIndex;
  }
  getSlideIndexByData(index) {
    return this.getSlideIndex(this.slides.find((slideEl) => slideEl.getAttribute("data-swiper-slide-index") * 1 === index));
  }
  getSlideIndexWhenGrid(index) {
    if (this.grid && this.params.grid && this.params.grid.rows > 1) {
      if (this.params.grid.fill === "column") {
        index = Math.floor(index / this.params.grid.rows);
      } else if (this.params.grid.fill === "row") {
        index = index % Math.ceil(this.slides.length / this.params.grid.rows);
      }
    }
    return index;
  }
  recalcSlides() {
    const swiper = this;
    const {
      slidesEl,
      params
    } = swiper;
    swiper.slides = elementChildren(slidesEl, `.${params.slideClass}, swiper-slide`);
  }
  enable() {
    const swiper = this;
    if (swiper.enabled) return;
    swiper.enabled = true;
    if (swiper.params.grabCursor) {
      swiper.setGrabCursor();
    }
    swiper.emit("enable");
  }
  disable() {
    const swiper = this;
    if (!swiper.enabled) return;
    swiper.enabled = false;
    if (swiper.params.grabCursor) {
      swiper.unsetGrabCursor();
    }
    swiper.emit("disable");
  }
  setProgress(progress, speed) {
    const swiper = this;
    progress = Math.min(Math.max(progress, 0), 1);
    const min = swiper.minTranslate();
    const max = swiper.maxTranslate();
    const current = (max - min) * progress + min;
    swiper.translateTo(current, typeof speed === "undefined" ? 0 : speed);
    swiper.updateActiveIndex();
    swiper.updateSlidesClasses();
  }
  emitContainerClasses() {
    const swiper = this;
    if (!swiper.params._emitClasses || !swiper.el) return;
    const cls = swiper.el.className.split(" ").filter((className) => {
      return className.indexOf("swiper") === 0 || className.indexOf(swiper.params.containerModifierClass) === 0;
    });
    swiper.emit("_containerClasses", cls.join(" "));
  }
  getSlideClasses(slideEl) {
    const swiper = this;
    if (swiper.destroyed) return "";
    return slideEl.className.split(" ").filter((className) => {
      return className.indexOf("swiper-slide") === 0 || className.indexOf(swiper.params.slideClass) === 0;
    }).join(" ");
  }
  emitSlidesClasses() {
    const swiper = this;
    if (!swiper.params._emitClasses || !swiper.el) return;
    const updates = [];
    swiper.slides.forEach((slideEl) => {
      const classNames = swiper.getSlideClasses(slideEl);
      updates.push({
        slideEl,
        classNames
      });
      swiper.emit("_slideClass", slideEl, classNames);
    });
    swiper.emit("_slideClasses", updates);
  }
  slidesPerViewDynamic(view = "current", exact = false) {
    const swiper = this;
    const {
      params,
      slides,
      slidesGrid,
      slidesSizesGrid,
      size: swiperSize,
      activeIndex
    } = swiper;
    let spv = 1;
    if (typeof params.slidesPerView === "number") return params.slidesPerView;
    if (params.centeredSlides) {
      let slideSize = slides[activeIndex] ? Math.ceil(slides[activeIndex].swiperSlideSize) : 0;
      let breakLoop;
      for (let i2 = activeIndex + 1; i2 < slides.length; i2 += 1) {
        if (slides[i2] && !breakLoop) {
          slideSize += Math.ceil(slides[i2].swiperSlideSize);
          spv += 1;
          if (slideSize > swiperSize) breakLoop = true;
        }
      }
      for (let i2 = activeIndex - 1; i2 >= 0; i2 -= 1) {
        if (slides[i2] && !breakLoop) {
          slideSize += slides[i2].swiperSlideSize;
          spv += 1;
          if (slideSize > swiperSize) breakLoop = true;
        }
      }
    } else {
      if (view === "current") {
        for (let i2 = activeIndex + 1; i2 < slides.length; i2 += 1) {
          const slideInView = exact ? slidesGrid[i2] + slidesSizesGrid[i2] - slidesGrid[activeIndex] < swiperSize : slidesGrid[i2] - slidesGrid[activeIndex] < swiperSize;
          if (slideInView) {
            spv += 1;
          }
        }
      } else {
        for (let i2 = activeIndex - 1; i2 >= 0; i2 -= 1) {
          const slideInView = slidesGrid[activeIndex] - slidesGrid[i2] < swiperSize;
          if (slideInView) {
            spv += 1;
          }
        }
      }
    }
    return spv;
  }
  update() {
    const swiper = this;
    if (!swiper || swiper.destroyed) return;
    const {
      snapGrid,
      params
    } = swiper;
    if (params.breakpoints) {
      swiper.setBreakpoint();
    }
    [...swiper.el.querySelectorAll('[loading="lazy"]')].forEach((imageEl) => {
      if (imageEl.complete) {
        processLazyPreloader(swiper, imageEl);
      }
    });
    swiper.updateSize();
    swiper.updateSlides();
    swiper.updateProgress();
    swiper.updateSlidesClasses();
    function setTranslate2() {
      const translateValue = swiper.rtlTranslate ? swiper.translate * -1 : swiper.translate;
      const newTranslate = Math.min(Math.max(translateValue, swiper.maxTranslate()), swiper.minTranslate());
      swiper.setTranslate(newTranslate);
      swiper.updateActiveIndex();
      swiper.updateSlidesClasses();
    }
    let translated;
    if (params.freeMode && params.freeMode.enabled && !params.cssMode) {
      setTranslate2();
      if (params.autoHeight) {
        swiper.updateAutoHeight();
      }
    } else {
      if ((params.slidesPerView === "auto" || params.slidesPerView > 1) && swiper.isEnd && !params.centeredSlides) {
        const slides = swiper.virtual && params.virtual.enabled ? swiper.virtual.slides : swiper.slides;
        translated = swiper.slideTo(slides.length - 1, 0, false, true);
      } else {
        translated = swiper.slideTo(swiper.activeIndex, 0, false, true);
      }
      if (!translated) {
        setTranslate2();
      }
    }
    if (params.watchOverflow && snapGrid !== swiper.snapGrid) {
      swiper.checkOverflow();
    }
    swiper.emit("update");
  }
  changeDirection(newDirection, needUpdate = true) {
    const swiper = this;
    const currentDirection = swiper.params.direction;
    if (!newDirection) {
      newDirection = currentDirection === "horizontal" ? "vertical" : "horizontal";
    }
    if (newDirection === currentDirection || newDirection !== "horizontal" && newDirection !== "vertical") {
      return swiper;
    }
    swiper.el.classList.remove(`${swiper.params.containerModifierClass}${currentDirection}`);
    swiper.el.classList.add(`${swiper.params.containerModifierClass}${newDirection}`);
    swiper.emitContainerClasses();
    swiper.params.direction = newDirection;
    swiper.slides.forEach((slideEl) => {
      if (newDirection === "vertical") {
        slideEl.style.width = "";
      } else {
        slideEl.style.height = "";
      }
    });
    swiper.emit("changeDirection");
    if (needUpdate) swiper.update();
    return swiper;
  }
  changeLanguageDirection(direction) {
    const swiper = this;
    if (swiper.rtl && direction === "rtl" || !swiper.rtl && direction === "ltr") return;
    swiper.rtl = direction === "rtl";
    swiper.rtlTranslate = swiper.params.direction === "horizontal" && swiper.rtl;
    if (swiper.rtl) {
      swiper.el.classList.add(`${swiper.params.containerModifierClass}rtl`);
      swiper.el.dir = "rtl";
    } else {
      swiper.el.classList.remove(`${swiper.params.containerModifierClass}rtl`);
      swiper.el.dir = "ltr";
    }
    swiper.update();
  }
  mount(element) {
    const swiper = this;
    if (swiper.mounted) return true;
    let el = element || swiper.params.el;
    if (typeof el === "string") {
      el = document.querySelector(el);
    }
    if (!el) {
      return false;
    }
    el.swiper = swiper;
    if (el.parentNode && el.parentNode.host && el.parentNode.host.nodeName === swiper.params.swiperElementNodeName.toUpperCase()) {
      swiper.isElement = true;
    }
    const getWrapperSelector = () => {
      return `.${(swiper.params.wrapperClass || "").trim().split(" ").join(".")}`;
    };
    const getWrapper = () => {
      if (el && el.shadowRoot && el.shadowRoot.querySelector) {
        const res = el.shadowRoot.querySelector(getWrapperSelector());
        return res;
      }
      return elementChildren(el, getWrapperSelector())[0];
    };
    let wrapperEl = getWrapper();
    if (!wrapperEl && swiper.params.createElements) {
      wrapperEl = createElement("div", swiper.params.wrapperClass);
      el.append(wrapperEl);
      elementChildren(el, `.${swiper.params.slideClass}`).forEach((slideEl) => {
        wrapperEl.append(slideEl);
      });
    }
    Object.assign(swiper, {
      el,
      wrapperEl,
      slidesEl: swiper.isElement && !el.parentNode.host.slideSlots ? el.parentNode.host : wrapperEl,
      hostEl: swiper.isElement ? el.parentNode.host : el,
      mounted: true,
      // RTL
      rtl: el.dir.toLowerCase() === "rtl" || elementStyle(el, "direction") === "rtl",
      rtlTranslate: swiper.params.direction === "horizontal" && (el.dir.toLowerCase() === "rtl" || elementStyle(el, "direction") === "rtl"),
      wrongRTL: elementStyle(wrapperEl, "display") === "-webkit-box"
    });
    return true;
  }
  init(el) {
    const swiper = this;
    if (swiper.initialized) return swiper;
    const mounted = swiper.mount(el);
    if (mounted === false) return swiper;
    swiper.emit("beforeInit");
    if (swiper.params.breakpoints) {
      swiper.setBreakpoint();
    }
    swiper.addClasses();
    swiper.updateSize();
    swiper.updateSlides();
    if (swiper.params.watchOverflow) {
      swiper.checkOverflow();
    }
    if (swiper.params.grabCursor && swiper.enabled) {
      swiper.setGrabCursor();
    }
    if (swiper.params.loop && swiper.virtual && swiper.params.virtual.enabled) {
      swiper.slideTo(swiper.params.initialSlide + swiper.virtual.slidesBefore, 0, swiper.params.runCallbacksOnInit, false, true);
    } else {
      swiper.slideTo(swiper.params.initialSlide, 0, swiper.params.runCallbacksOnInit, false, true);
    }
    if (swiper.params.loop) {
      swiper.loopCreate(void 0, true);
    }
    swiper.attachEvents();
    const lazyElements = [...swiper.el.querySelectorAll('[loading="lazy"]')];
    if (swiper.isElement) {
      lazyElements.push(...swiper.hostEl.querySelectorAll('[loading="lazy"]'));
    }
    lazyElements.forEach((imageEl) => {
      if (imageEl.complete) {
        processLazyPreloader(swiper, imageEl);
      } else {
        imageEl.addEventListener("load", (e2) => {
          processLazyPreloader(swiper, e2.target);
        });
      }
    });
    preload(swiper);
    swiper.initialized = true;
    preload(swiper);
    swiper.emit("init");
    swiper.emit("afterInit");
    return swiper;
  }
  destroy(deleteInstance = true, cleanStyles = true) {
    const swiper = this;
    const {
      params,
      el,
      wrapperEl,
      slides
    } = swiper;
    if (typeof swiper.params === "undefined" || swiper.destroyed) {
      return null;
    }
    swiper.emit("beforeDestroy");
    swiper.initialized = false;
    swiper.detachEvents();
    if (params.loop) {
      swiper.loopDestroy();
    }
    if (cleanStyles) {
      swiper.removeClasses();
      if (el && typeof el !== "string") {
        el.removeAttribute("style");
      }
      if (wrapperEl) {
        wrapperEl.removeAttribute("style");
      }
      if (slides && slides.length) {
        slides.forEach((slideEl) => {
          slideEl.classList.remove(params.slideVisibleClass, params.slideFullyVisibleClass, params.slideActiveClass, params.slideNextClass, params.slidePrevClass);
          slideEl.removeAttribute("style");
          slideEl.removeAttribute("data-swiper-slide-index");
        });
      }
    }
    swiper.emit("destroy");
    Object.keys(swiper.eventsListeners).forEach((eventName) => {
      swiper.off(eventName);
    });
    if (deleteInstance !== false) {
      if (swiper.el && typeof swiper.el !== "string") {
        swiper.el.swiper = null;
      }
      deleteProps(swiper);
    }
    swiper.destroyed = true;
    return null;
  }
  static extendDefaults(newDefaults) {
    extend(extendedDefaults, newDefaults);
  }
  static get extendedDefaults() {
    return extendedDefaults;
  }
  static get defaults() {
    return defaults;
  }
  static installModule(mod) {
    if (!Swiper.prototype.__modules__) Swiper.prototype.__modules__ = [];
    const modules2 = Swiper.prototype.__modules__;
    if (typeof mod === "function" && modules2.indexOf(mod) < 0) {
      modules2.push(mod);
    }
  }
  static use(module) {
    if (Array.isArray(module)) {
      module.forEach((m2) => Swiper.installModule(m2));
      return Swiper;
    }
    Swiper.installModule(module);
    return Swiper;
  }
}
Object.keys(prototypes).forEach((prototypeGroup) => {
  Object.keys(prototypes[prototypeGroup]).forEach((protoMethod) => {
    Swiper.prototype[protoMethod] = prototypes[prototypeGroup][protoMethod];
  });
});
Swiper.use([Resize, Observer]);
function Virtual({
  swiper,
  extendParams,
  on,
  emit
}) {
  extendParams({
    virtual: {
      enabled: false,
      slides: [],
      cache: true,
      slidesPerViewAutoSlideSize: 320,
      renderSlide: null,
      renderExternal: null,
      renderExternalUpdate: true,
      addSlidesBefore: 0,
      addSlidesAfter: 0
    }
  });
  let cssModeTimeout;
  const document2 = getDocument();
  swiper.virtual = {
    cache: {},
    from: void 0,
    to: void 0,
    slides: [],
    offset: 0,
    slidesGrid: []
  };
  const tempDOM = document2.createElement("div");
  function renderSlide(slide2, index) {
    const params = swiper.params.virtual;
    if (params.cache && swiper.virtual.cache[index]) {
      return swiper.virtual.cache[index];
    }
    let slideEl;
    if (params.renderSlide) {
      slideEl = params.renderSlide.call(swiper, slide2, index);
      if (typeof slideEl === "string") {
        setInnerHTML(tempDOM, slideEl);
        slideEl = tempDOM.children[0];
      }
    } else if (swiper.isElement) {
      slideEl = createElement("swiper-slide");
    } else {
      slideEl = createElement("div", swiper.params.slideClass);
    }
    slideEl.setAttribute("data-swiper-slide-index", index);
    if (!params.renderSlide) {
      setInnerHTML(slideEl, slide2);
    }
    if (params.cache) {
      swiper.virtual.cache[index] = slideEl;
    }
    return slideEl;
  }
  function update2(force, beforeInit, forceActiveIndex) {
    const {
      slidesPerGroup,
      centeredSlides,
      slidesPerView,
      loop: isLoop,
      initialSlide
    } = swiper.params;
    if (beforeInit && !isLoop && initialSlide > 0) {
      return;
    }
    const {
      addSlidesBefore,
      addSlidesAfter,
      slidesPerViewAutoSlideSize
    } = swiper.params.virtual;
    const {
      from: previousFrom,
      to: previousTo,
      slides,
      slidesGrid: previousSlidesGrid,
      offset: previousOffset
    } = swiper.virtual;
    if (!swiper.params.cssMode) {
      swiper.updateActiveIndex();
    }
    const activeIndex = typeof forceActiveIndex === "undefined" ? swiper.activeIndex || 0 : forceActiveIndex;
    let offsetProp;
    if (swiper.rtlTranslate) offsetProp = "right";
    else offsetProp = swiper.isHorizontal() ? "left" : "top";
    let slidesPerViewNumeric;
    if (slidesPerView === "auto") {
      if (slidesPerViewAutoSlideSize) {
        let swiperSize = swiper.size;
        if (!swiperSize) {
          swiperSize = swiper.isHorizontal() ? swiper.el.getBoundingClientRect().width : swiper.el.getBoundingClientRect().height;
        }
        slidesPerViewNumeric = Math.max(1, Math.ceil(swiperSize / slidesPerViewAutoSlideSize));
      } else {
        slidesPerViewNumeric = 1;
      }
    } else {
      slidesPerViewNumeric = slidesPerView;
    }
    let slidesAfter;
    let slidesBefore;
    if (centeredSlides) {
      slidesAfter = Math.floor(slidesPerViewNumeric / 2) + slidesPerGroup + addSlidesAfter;
      slidesBefore = Math.floor(slidesPerViewNumeric / 2) + slidesPerGroup + addSlidesBefore;
    } else {
      slidesAfter = slidesPerViewNumeric + (slidesPerGroup - 1) + addSlidesAfter;
      slidesBefore = (isLoop ? slidesPerViewNumeric : slidesPerGroup) + addSlidesBefore;
    }
    let from = activeIndex - slidesBefore;
    let to = activeIndex + slidesAfter;
    if (!isLoop) {
      from = Math.max(from, 0);
      to = Math.min(to, slides.length - 1);
    }
    let offset = (swiper.slidesGrid[from] || 0) - (swiper.slidesGrid[0] || 0);
    if (isLoop && activeIndex >= slidesBefore) {
      from -= slidesBefore;
      if (!centeredSlides) offset += swiper.slidesGrid[0];
    } else if (isLoop && activeIndex < slidesBefore) {
      from = -slidesBefore;
      if (centeredSlides) offset += swiper.slidesGrid[0];
    }
    Object.assign(swiper.virtual, {
      from,
      to,
      offset,
      slidesGrid: swiper.slidesGrid,
      slidesBefore,
      slidesAfter
    });
    function onRendered() {
      swiper.updateSlides();
      swiper.updateProgress();
      swiper.updateSlidesClasses();
      emit("virtualUpdate");
    }
    if (previousFrom === from && previousTo === to && !force) {
      if (swiper.slidesGrid !== previousSlidesGrid && offset !== previousOffset) {
        swiper.slides.forEach((slideEl) => {
          slideEl.style[offsetProp] = `${offset - Math.abs(swiper.cssOverflowAdjustment())}px`;
        });
      }
      swiper.updateProgress();
      emit("virtualUpdate");
      return;
    }
    if (swiper.params.virtual.renderExternal) {
      swiper.params.virtual.renderExternal.call(swiper, {
        offset,
        from,
        to,
        slides: (function getSlides() {
          const slidesToRender = [];
          for (let i2 = from; i2 <= to; i2 += 1) {
            slidesToRender.push(slides[i2]);
          }
          return slidesToRender;
        })()
      });
      if (swiper.params.virtual.renderExternalUpdate) {
        onRendered();
      } else {
        emit("virtualUpdate");
      }
      return;
    }
    const prependIndexes = [];
    const appendIndexes = [];
    const getSlideIndex = (index) => {
      let slideIndex = index;
      if (index < 0) {
        slideIndex = slides.length + index;
      } else if (slideIndex >= slides.length) {
        slideIndex = slideIndex - slides.length;
      }
      return slideIndex;
    };
    if (force) {
      swiper.slides.filter((el) => el.matches(`.${swiper.params.slideClass}, swiper-slide`)).forEach((slideEl) => {
        slideEl.remove();
      });
    } else {
      for (let i2 = previousFrom; i2 <= previousTo; i2 += 1) {
        if (i2 < from || i2 > to) {
          const slideIndex = getSlideIndex(i2);
          swiper.slides.filter((el) => el.matches(`.${swiper.params.slideClass}[data-swiper-slide-index="${slideIndex}"], swiper-slide[data-swiper-slide-index="${slideIndex}"]`)).forEach((slideEl) => {
            slideEl.remove();
          });
        }
      }
    }
    const loopFrom = isLoop ? -slides.length : 0;
    const loopTo = isLoop ? slides.length * 2 : slides.length;
    for (let i2 = loopFrom; i2 < loopTo; i2 += 1) {
      if (i2 >= from && i2 <= to) {
        const slideIndex = getSlideIndex(i2);
        if (typeof previousTo === "undefined" || force) {
          appendIndexes.push(slideIndex);
        } else {
          if (i2 > previousTo) appendIndexes.push(slideIndex);
          if (i2 < previousFrom) prependIndexes.push(slideIndex);
        }
      }
    }
    appendIndexes.forEach((index) => {
      swiper.slidesEl.append(renderSlide(slides[index], index));
    });
    if (isLoop) {
      for (let i2 = prependIndexes.length - 1; i2 >= 0; i2 -= 1) {
        const index = prependIndexes[i2];
        swiper.slidesEl.prepend(renderSlide(slides[index], index));
      }
    } else {
      prependIndexes.sort((a2, b2) => b2 - a2);
      prependIndexes.forEach((index) => {
        swiper.slidesEl.prepend(renderSlide(slides[index], index));
      });
    }
    elementChildren(swiper.slidesEl, ".swiper-slide, swiper-slide").forEach((slideEl) => {
      slideEl.style[offsetProp] = `${offset - Math.abs(swiper.cssOverflowAdjustment())}px`;
    });
    onRendered();
  }
  function appendSlide2(slides) {
    if (typeof slides === "object" && "length" in slides) {
      for (let i2 = 0; i2 < slides.length; i2 += 1) {
        if (slides[i2]) swiper.virtual.slides.push(slides[i2]);
      }
    } else {
      swiper.virtual.slides.push(slides);
    }
    update2(true);
  }
  function prependSlide2(slides) {
    const activeIndex = swiper.activeIndex;
    let newActiveIndex = activeIndex + 1;
    let numberOfNewSlides = 1;
    if (Array.isArray(slides)) {
      for (let i2 = 0; i2 < slides.length; i2 += 1) {
        if (slides[i2]) swiper.virtual.slides.unshift(slides[i2]);
      }
      newActiveIndex = activeIndex + slides.length;
      numberOfNewSlides = slides.length;
    } else {
      swiper.virtual.slides.unshift(slides);
    }
    if (swiper.params.virtual.cache) {
      const cache = swiper.virtual.cache;
      const newCache = {};
      Object.keys(cache).forEach((cachedIndex) => {
        const cachedEl = cache[cachedIndex];
        const cachedElIndex = cachedEl.getAttribute("data-swiper-slide-index");
        if (cachedElIndex) {
          cachedEl.setAttribute("data-swiper-slide-index", parseInt(cachedElIndex, 10) + numberOfNewSlides);
        }
        newCache[parseInt(cachedIndex, 10) + numberOfNewSlides] = cachedEl;
      });
      swiper.virtual.cache = newCache;
    }
    update2(true);
    swiper.slideTo(newActiveIndex, 0);
  }
  function removeSlide2(slidesIndexes) {
    if (typeof slidesIndexes === "undefined" || slidesIndexes === null) return;
    let activeIndex = swiper.activeIndex;
    if (Array.isArray(slidesIndexes)) {
      for (let i2 = slidesIndexes.length - 1; i2 >= 0; i2 -= 1) {
        if (swiper.params.virtual.cache) {
          delete swiper.virtual.cache[slidesIndexes[i2]];
          Object.keys(swiper.virtual.cache).forEach((key) => {
            if (key > slidesIndexes) {
              swiper.virtual.cache[key - 1] = swiper.virtual.cache[key];
              swiper.virtual.cache[key - 1].setAttribute("data-swiper-slide-index", key - 1);
              delete swiper.virtual.cache[key];
            }
          });
        }
        swiper.virtual.slides.splice(slidesIndexes[i2], 1);
        if (slidesIndexes[i2] < activeIndex) activeIndex -= 1;
        activeIndex = Math.max(activeIndex, 0);
      }
    } else {
      if (swiper.params.virtual.cache) {
        delete swiper.virtual.cache[slidesIndexes];
        Object.keys(swiper.virtual.cache).forEach((key) => {
          if (key > slidesIndexes) {
            swiper.virtual.cache[key - 1] = swiper.virtual.cache[key];
            swiper.virtual.cache[key - 1].setAttribute("data-swiper-slide-index", key - 1);
            delete swiper.virtual.cache[key];
          }
        });
      }
      swiper.virtual.slides.splice(slidesIndexes, 1);
      if (slidesIndexes < activeIndex) activeIndex -= 1;
      activeIndex = Math.max(activeIndex, 0);
    }
    update2(true);
    swiper.slideTo(activeIndex, 0);
  }
  function removeAllSlides2() {
    swiper.virtual.slides = [];
    if (swiper.params.virtual.cache) {
      swiper.virtual.cache = {};
    }
    update2(true);
    swiper.slideTo(0, 0);
  }
  on("beforeInit", () => {
    if (!swiper.params.virtual.enabled) return;
    let domSlidesAssigned;
    if (typeof swiper.passedParams.virtual.slides === "undefined") {
      const slides = [...swiper.slidesEl.children].filter((el) => el.matches(`.${swiper.params.slideClass}, swiper-slide`));
      if (slides && slides.length) {
        swiper.virtual.slides = [...slides];
        domSlidesAssigned = true;
        slides.forEach((slideEl, slideIndex) => {
          slideEl.setAttribute("data-swiper-slide-index", slideIndex);
          swiper.virtual.cache[slideIndex] = slideEl;
          slideEl.remove();
        });
      }
    }
    if (!domSlidesAssigned) {
      swiper.virtual.slides = swiper.params.virtual.slides;
    }
    swiper.classNames.push(`${swiper.params.containerModifierClass}virtual`);
    swiper.params.watchSlidesProgress = true;
    swiper.originalParams.watchSlidesProgress = true;
    update2(false, true);
  });
  on("setTranslate", () => {
    if (!swiper.params.virtual.enabled) return;
    if (swiper.params.cssMode && !swiper._immediateVirtual) {
      clearTimeout(cssModeTimeout);
      cssModeTimeout = setTimeout(() => {
        update2();
      }, 100);
    } else {
      update2();
    }
  });
  on("init update resize", () => {
    if (!swiper.params.virtual.enabled) return;
    if (swiper.params.cssMode) {
      setCSSProperty(swiper.wrapperEl, "--swiper-virtual-size", `${swiper.virtualSize}px`);
    }
  });
  Object.assign(swiper.virtual, {
    appendSlide: appendSlide2,
    prependSlide: prependSlide2,
    removeSlide: removeSlide2,
    removeAllSlides: removeAllSlides2,
    update: update2
  });
}
function Keyboard({
  swiper,
  extendParams,
  on,
  emit
}) {
  const document2 = getDocument();
  const window2 = getWindow();
  swiper.keyboard = {
    enabled: false
  };
  extendParams({
    keyboard: {
      enabled: false,
      onlyInViewport: true,
      pageUpDown: true
    }
  });
  function handle(event2) {
    if (!swiper.enabled) return;
    const {
      rtlTranslate: rtl
    } = swiper;
    let e2 = event2;
    if (e2.originalEvent) e2 = e2.originalEvent;
    const kc = e2.keyCode || e2.charCode;
    const pageUpDown = swiper.params.keyboard.pageUpDown;
    const isPageUp = pageUpDown && kc === 33;
    const isPageDown = pageUpDown && kc === 34;
    const isArrowLeft = kc === 37;
    const isArrowRight = kc === 39;
    const isArrowUp = kc === 38;
    const isArrowDown = kc === 40;
    if (!swiper.allowSlideNext && (swiper.isHorizontal() && isArrowRight || swiper.isVertical() && isArrowDown || isPageDown)) {
      return false;
    }
    if (!swiper.allowSlidePrev && (swiper.isHorizontal() && isArrowLeft || swiper.isVertical() && isArrowUp || isPageUp)) {
      return false;
    }
    if (e2.shiftKey || e2.altKey || e2.ctrlKey || e2.metaKey) {
      return void 0;
    }
    if (document2.activeElement && (document2.activeElement.isContentEditable || document2.activeElement.nodeName && (document2.activeElement.nodeName.toLowerCase() === "input" || document2.activeElement.nodeName.toLowerCase() === "textarea"))) {
      return void 0;
    }
    if (swiper.params.keyboard.onlyInViewport && (isPageUp || isPageDown || isArrowLeft || isArrowRight || isArrowUp || isArrowDown)) {
      let inView = false;
      if (elementParents(swiper.el, `.${swiper.params.slideClass}, swiper-slide`).length > 0 && elementParents(swiper.el, `.${swiper.params.slideActiveClass}`).length === 0) {
        return void 0;
      }
      const el = swiper.el;
      const swiperWidth = el.clientWidth;
      const swiperHeight = el.clientHeight;
      const windowWidth = window2.innerWidth;
      const windowHeight = window2.innerHeight;
      const swiperOffset = elementOffset(el);
      if (rtl) swiperOffset.left -= el.scrollLeft;
      const swiperCoord = [[swiperOffset.left, swiperOffset.top], [swiperOffset.left + swiperWidth, swiperOffset.top], [swiperOffset.left, swiperOffset.top + swiperHeight], [swiperOffset.left + swiperWidth, swiperOffset.top + swiperHeight]];
      for (let i2 = 0; i2 < swiperCoord.length; i2 += 1) {
        const point = swiperCoord[i2];
        if (point[0] >= 0 && point[0] <= windowWidth && point[1] >= 0 && point[1] <= windowHeight) {
          if (point[0] === 0 && point[1] === 0) continue;
          inView = true;
        }
      }
      if (!inView) return void 0;
    }
    if (swiper.isHorizontal()) {
      if (isPageUp || isPageDown || isArrowLeft || isArrowRight) {
        if (e2.preventDefault) e2.preventDefault();
        else e2.returnValue = false;
      }
      if ((isPageDown || isArrowRight) && !rtl || (isPageUp || isArrowLeft) && rtl) swiper.slideNext();
      if ((isPageUp || isArrowLeft) && !rtl || (isPageDown || isArrowRight) && rtl) swiper.slidePrev();
    } else {
      if (isPageUp || isPageDown || isArrowUp || isArrowDown) {
        if (e2.preventDefault) e2.preventDefault();
        else e2.returnValue = false;
      }
      if (isPageDown || isArrowDown) swiper.slideNext();
      if (isPageUp || isArrowUp) swiper.slidePrev();
    }
    emit("keyPress", kc);
    return void 0;
  }
  function enable() {
    if (swiper.keyboard.enabled) return;
    document2.addEventListener("keydown", handle);
    swiper.keyboard.enabled = true;
  }
  function disable() {
    if (!swiper.keyboard.enabled) return;
    document2.removeEventListener("keydown", handle);
    swiper.keyboard.enabled = false;
  }
  on("init", () => {
    if (swiper.params.keyboard.enabled) {
      enable();
    }
  });
  on("destroy", () => {
    if (swiper.keyboard.enabled) {
      disable();
    }
  });
  Object.assign(swiper.keyboard, {
    enable,
    disable
  });
}
function Mousewheel({
  swiper,
  extendParams,
  on,
  emit
}) {
  const window2 = getWindow();
  extendParams({
    mousewheel: {
      enabled: false,
      releaseOnEdges: false,
      invert: false,
      forceToAxis: false,
      sensitivity: 1,
      eventsTarget: "container",
      thresholdDelta: null,
      thresholdTime: null,
      noMousewheelClass: "swiper-no-mousewheel"
    }
  });
  swiper.mousewheel = {
    enabled: false
  };
  let timeout;
  let lastScrollTime = now();
  let lastEventBeforeSnap;
  const recentWheelEvents = [];
  function normalize(e2) {
    const PIXEL_STEP = 10;
    const LINE_HEIGHT = 40;
    const PAGE_HEIGHT = 800;
    let sX = 0;
    let sY = 0;
    let pX = 0;
    let pY = 0;
    if ("detail" in e2) {
      sY = e2.detail;
    }
    if ("wheelDelta" in e2) {
      sY = -e2.wheelDelta / 120;
    }
    if ("wheelDeltaY" in e2) {
      sY = -e2.wheelDeltaY / 120;
    }
    if ("wheelDeltaX" in e2) {
      sX = -e2.wheelDeltaX / 120;
    }
    if ("axis" in e2 && e2.axis === e2.HORIZONTAL_AXIS) {
      sX = sY;
      sY = 0;
    }
    pX = sX * PIXEL_STEP;
    pY = sY * PIXEL_STEP;
    if ("deltaY" in e2) {
      pY = e2.deltaY;
    }
    if ("deltaX" in e2) {
      pX = e2.deltaX;
    }
    if (e2.shiftKey && !pX) {
      pX = pY;
      pY = 0;
    }
    if ((pX || pY) && e2.deltaMode) {
      if (e2.deltaMode === 1) {
        pX *= LINE_HEIGHT;
        pY *= LINE_HEIGHT;
      } else {
        pX *= PAGE_HEIGHT;
        pY *= PAGE_HEIGHT;
      }
    }
    if (pX && !sX) {
      sX = pX < 1 ? -1 : 1;
    }
    if (pY && !sY) {
      sY = pY < 1 ? -1 : 1;
    }
    return {
      spinX: sX,
      spinY: sY,
      pixelX: pX,
      pixelY: pY
    };
  }
  function handleMouseEnter() {
    if (!swiper.enabled) return;
    swiper.mouseEntered = true;
  }
  function handleMouseLeave() {
    if (!swiper.enabled) return;
    swiper.mouseEntered = false;
  }
  function animateSlider(newEvent) {
    if (swiper.params.mousewheel.thresholdDelta && newEvent.delta < swiper.params.mousewheel.thresholdDelta) {
      return false;
    }
    if (swiper.params.mousewheel.thresholdTime && now() - lastScrollTime < swiper.params.mousewheel.thresholdTime) {
      return false;
    }
    if (newEvent.delta >= 6 && now() - lastScrollTime < 60) {
      return true;
    }
    if (newEvent.direction < 0) {
      if ((!swiper.isEnd || swiper.params.loop) && !swiper.animating) {
        swiper.slideNext();
        emit("scroll", newEvent.raw);
      }
    } else if ((!swiper.isBeginning || swiper.params.loop) && !swiper.animating) {
      swiper.slidePrev();
      emit("scroll", newEvent.raw);
    }
    lastScrollTime = new window2.Date().getTime();
    return false;
  }
  function releaseScroll(newEvent) {
    const params = swiper.params.mousewheel;
    if (newEvent.direction < 0) {
      if (swiper.isEnd && !swiper.params.loop && params.releaseOnEdges) {
        return true;
      }
    } else if (swiper.isBeginning && !swiper.params.loop && params.releaseOnEdges) {
      return true;
    }
    return false;
  }
  function handle(event2) {
    let e2 = event2;
    let disableParentSwiper = true;
    if (!swiper.enabled) return;
    if (event2.target.closest(`.${swiper.params.mousewheel.noMousewheelClass}`)) return;
    const params = swiper.params.mousewheel;
    if (swiper.params.cssMode) {
      e2.preventDefault();
    }
    let targetEl = swiper.el;
    if (swiper.params.mousewheel.eventsTarget !== "container") {
      targetEl = document.querySelector(swiper.params.mousewheel.eventsTarget);
    }
    const targetElContainsTarget = targetEl && targetEl.contains(e2.target);
    if (!swiper.mouseEntered && !targetElContainsTarget && !params.releaseOnEdges) return true;
    if (e2.originalEvent) e2 = e2.originalEvent;
    let delta = 0;
    const rtlFactor = swiper.rtlTranslate ? -1 : 1;
    const data = normalize(e2);
    if (params.forceToAxis) {
      if (swiper.isHorizontal()) {
        if (Math.abs(data.pixelX) > Math.abs(data.pixelY)) delta = -data.pixelX * rtlFactor;
        else return true;
      } else if (Math.abs(data.pixelY) > Math.abs(data.pixelX)) delta = -data.pixelY;
      else return true;
    } else {
      delta = Math.abs(data.pixelX) > Math.abs(data.pixelY) ? -data.pixelX * rtlFactor : -data.pixelY;
    }
    if (delta === 0) return true;
    if (params.invert) delta = -delta;
    let positions = swiper.getTranslate() + delta * params.sensitivity;
    if (positions >= swiper.minTranslate()) positions = swiper.minTranslate();
    if (positions <= swiper.maxTranslate()) positions = swiper.maxTranslate();
    disableParentSwiper = swiper.params.loop ? true : !(positions === swiper.minTranslate() || positions === swiper.maxTranslate());
    if (disableParentSwiper && swiper.params.nested) e2.stopPropagation();
    if (!swiper.params.freeMode || !swiper.params.freeMode.enabled) {
      const newEvent = {
        time: now(),
        delta: Math.abs(delta),
        direction: Math.sign(delta),
        raw: event2
      };
      if (recentWheelEvents.length >= 2) {
        recentWheelEvents.shift();
      }
      const prevEvent = recentWheelEvents.length ? recentWheelEvents[recentWheelEvents.length - 1] : void 0;
      recentWheelEvents.push(newEvent);
      if (prevEvent) {
        if (newEvent.direction !== prevEvent.direction || newEvent.delta > prevEvent.delta || newEvent.time > prevEvent.time + 150) {
          animateSlider(newEvent);
        }
      } else {
        animateSlider(newEvent);
      }
      if (releaseScroll(newEvent)) {
        return true;
      }
    } else {
      const newEvent = {
        time: now(),
        delta: Math.abs(delta),
        direction: Math.sign(delta)
      };
      const ignoreWheelEvents = lastEventBeforeSnap && newEvent.time < lastEventBeforeSnap.time + 500 && newEvent.delta <= lastEventBeforeSnap.delta && newEvent.direction === lastEventBeforeSnap.direction;
      if (!ignoreWheelEvents) {
        lastEventBeforeSnap = void 0;
        let position = swiper.getTranslate() + delta * params.sensitivity;
        const wasBeginning = swiper.isBeginning;
        const wasEnd = swiper.isEnd;
        if (position >= swiper.minTranslate()) position = swiper.minTranslate();
        if (position <= swiper.maxTranslate()) position = swiper.maxTranslate();
        swiper.setTransition(0);
        swiper.setTranslate(position);
        swiper.updateProgress();
        swiper.updateActiveIndex();
        swiper.updateSlidesClasses();
        if (!wasBeginning && swiper.isBeginning || !wasEnd && swiper.isEnd) {
          swiper.updateSlidesClasses();
        }
        if (swiper.params.loop) {
          swiper.loopFix({
            direction: newEvent.direction < 0 ? "next" : "prev",
            byMousewheel: true
          });
        }
        if (swiper.params.freeMode.sticky) {
          clearTimeout(timeout);
          timeout = void 0;
          if (recentWheelEvents.length >= 15) {
            recentWheelEvents.shift();
          }
          const prevEvent = recentWheelEvents.length ? recentWheelEvents[recentWheelEvents.length - 1] : void 0;
          const firstEvent = recentWheelEvents[0];
          recentWheelEvents.push(newEvent);
          if (prevEvent && (newEvent.delta > prevEvent.delta || newEvent.direction !== prevEvent.direction)) {
            recentWheelEvents.splice(0);
          } else if (recentWheelEvents.length >= 15 && newEvent.time - firstEvent.time < 500 && firstEvent.delta - newEvent.delta >= 1 && newEvent.delta <= 6) {
            const snapToThreshold = delta > 0 ? 0.8 : 0.2;
            lastEventBeforeSnap = newEvent;
            recentWheelEvents.splice(0);
            timeout = nextTick(() => {
              if (swiper.destroyed || !swiper.params) return;
              swiper.slideToClosest(swiper.params.speed, true, void 0, snapToThreshold);
            }, 0);
          }
          if (!timeout) {
            timeout = nextTick(() => {
              if (swiper.destroyed || !swiper.params) return;
              const snapToThreshold = 0.5;
              lastEventBeforeSnap = newEvent;
              recentWheelEvents.splice(0);
              swiper.slideToClosest(swiper.params.speed, true, void 0, snapToThreshold);
            }, 500);
          }
        }
        if (!ignoreWheelEvents) emit("scroll", e2);
        if (swiper.params.autoplay && swiper.params.autoplay.disableOnInteraction) swiper.autoplay.stop();
        if (params.releaseOnEdges && (position === swiper.minTranslate() || position === swiper.maxTranslate())) {
          return true;
        }
      }
    }
    if (e2.preventDefault) e2.preventDefault();
    else e2.returnValue = false;
    return false;
  }
  function events2(method) {
    let targetEl = swiper.el;
    if (swiper.params.mousewheel.eventsTarget !== "container") {
      targetEl = document.querySelector(swiper.params.mousewheel.eventsTarget);
    }
    targetEl[method]("mouseenter", handleMouseEnter);
    targetEl[method]("mouseleave", handleMouseLeave);
    targetEl[method]("wheel", handle);
  }
  function enable() {
    if (swiper.params.cssMode) {
      swiper.wrapperEl.removeEventListener("wheel", handle);
      return true;
    }
    if (swiper.mousewheel.enabled) return false;
    events2("addEventListener");
    swiper.mousewheel.enabled = true;
    return true;
  }
  function disable() {
    if (swiper.params.cssMode) {
      swiper.wrapperEl.addEventListener(event, handle);
      return true;
    }
    if (!swiper.mousewheel.enabled) return false;
    events2("removeEventListener");
    swiper.mousewheel.enabled = false;
    return true;
  }
  on("init", () => {
    if (!swiper.params.mousewheel.enabled && swiper.params.cssMode) {
      disable();
    }
    if (swiper.params.mousewheel.enabled) enable();
  });
  on("destroy", () => {
    if (swiper.params.cssMode) {
      enable();
    }
    if (swiper.mousewheel.enabled) disable();
  });
  Object.assign(swiper.mousewheel, {
    enable,
    disable
  });
}
function createElementIfNotDefined(swiper, originalParams, params, checkProps) {
  if (swiper.params.createElements) {
    Object.keys(checkProps).forEach((key) => {
      if (!params[key] && params.auto === true) {
        let element = elementChildren(swiper.el, `.${checkProps[key]}`)[0];
        if (!element) {
          element = createElement("div", checkProps[key]);
          element.className = checkProps[key];
          swiper.el.append(element);
        }
        params[key] = element;
        originalParams[key] = element;
      }
    });
  }
  return params;
}
const arrowSvg = `<svg class="swiper-navigation-icon" width="11" height="20" viewBox="0 0 11 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.38296 20.0762C0.111788 19.805 0.111788 19.3654 0.38296 19.0942L9.19758 10.2796L0.38296 1.46497C0.111788 1.19379 0.111788 0.754138 0.38296 0.482966C0.654131 0.211794 1.09379 0.211794 1.36496 0.482966L10.4341 9.55214C10.8359 9.9539 10.8359 10.6053 10.4341 11.007L1.36496 20.0762C1.09379 20.3474 0.654131 20.3474 0.38296 20.0762Z" fill="currentColor"/></svg>`;
function Navigation({
  swiper,
  extendParams,
  on,
  emit
}) {
  extendParams({
    navigation: {
      nextEl: null,
      prevEl: null,
      addIcons: true,
      hideOnClick: false,
      disabledClass: "swiper-button-disabled",
      hiddenClass: "swiper-button-hidden",
      lockClass: "swiper-button-lock",
      navigationDisabledClass: "swiper-navigation-disabled"
    }
  });
  swiper.navigation = {
    nextEl: null,
    prevEl: null,
    arrowSvg
  };
  function getEl(el) {
    let res;
    if (el && typeof el === "string" && swiper.isElement) {
      res = swiper.el.querySelector(el) || swiper.hostEl.querySelector(el);
      if (res) return res;
    }
    if (el) {
      if (typeof el === "string") res = [...document.querySelectorAll(el)];
      if (swiper.params.uniqueNavElements && typeof el === "string" && res && res.length > 1 && swiper.el.querySelectorAll(el).length === 1) {
        res = swiper.el.querySelector(el);
      } else if (res && res.length === 1) {
        res = res[0];
      }
    }
    if (el && !res) return el;
    return res;
  }
  function toggleEl(el, disabled) {
    const params = swiper.params.navigation;
    el = makeElementsArray(el);
    el.forEach((subEl) => {
      if (subEl) {
        subEl.classList[disabled ? "add" : "remove"](...params.disabledClass.split(" "));
        if (subEl.tagName === "BUTTON") subEl.disabled = disabled;
        if (swiper.params.watchOverflow && swiper.enabled) {
          subEl.classList[swiper.isLocked ? "add" : "remove"](params.lockClass);
        }
      }
    });
  }
  function update2() {
    const {
      nextEl,
      prevEl
    } = swiper.navigation;
    if (swiper.params.loop) {
      toggleEl(prevEl, false);
      toggleEl(nextEl, false);
      return;
    }
    toggleEl(prevEl, swiper.isBeginning && !swiper.params.rewind);
    toggleEl(nextEl, swiper.isEnd && !swiper.params.rewind);
  }
  function onPrevClick(e2) {
    e2.preventDefault();
    if (swiper.isBeginning && !swiper.params.loop && !swiper.params.rewind) return;
    swiper.slidePrev();
    emit("navigationPrev");
  }
  function onNextClick(e2) {
    e2.preventDefault();
    if (swiper.isEnd && !swiper.params.loop && !swiper.params.rewind) return;
    swiper.slideNext();
    emit("navigationNext");
  }
  function init() {
    const params = swiper.params.navigation;
    swiper.params.navigation = createElementIfNotDefined(swiper, swiper.originalParams.navigation, swiper.params.navigation, {
      nextEl: "swiper-button-next",
      prevEl: "swiper-button-prev"
    });
    if (!(params.nextEl || params.prevEl)) return;
    let nextEl = getEl(params.nextEl);
    let prevEl = getEl(params.prevEl);
    Object.assign(swiper.navigation, {
      nextEl,
      prevEl
    });
    nextEl = makeElementsArray(nextEl);
    prevEl = makeElementsArray(prevEl);
    const initButton = (el, dir) => {
      if (el) {
        if (params.addIcons && el.matches(".swiper-button-next,.swiper-button-prev") && !el.querySelector("svg")) {
          const tempEl = document.createElement("div");
          setInnerHTML(tempEl, arrowSvg);
          el.appendChild(tempEl.querySelector("svg"));
          tempEl.remove();
        }
        el.addEventListener("click", dir === "next" ? onNextClick : onPrevClick);
      }
      if (!swiper.enabled && el) {
        el.classList.add(...params.lockClass.split(" "));
      }
    };
    nextEl.forEach((el) => initButton(el, "next"));
    prevEl.forEach((el) => initButton(el, "prev"));
  }
  function destroy() {
    let {
      nextEl,
      prevEl
    } = swiper.navigation;
    nextEl = makeElementsArray(nextEl);
    prevEl = makeElementsArray(prevEl);
    const destroyButton = (el, dir) => {
      el.removeEventListener("click", dir === "next" ? onNextClick : onPrevClick);
      el.classList.remove(...swiper.params.navigation.disabledClass.split(" "));
    };
    nextEl.forEach((el) => destroyButton(el, "next"));
    prevEl.forEach((el) => destroyButton(el, "prev"));
  }
  on("init", () => {
    if (swiper.params.navigation.enabled === false) {
      disable();
    } else {
      init();
      update2();
    }
  });
  on("toEdge fromEdge lock unlock", () => {
    update2();
  });
  on("destroy", () => {
    destroy();
  });
  on("enable disable", () => {
    let {
      nextEl,
      prevEl
    } = swiper.navigation;
    nextEl = makeElementsArray(nextEl);
    prevEl = makeElementsArray(prevEl);
    if (swiper.enabled) {
      update2();
      return;
    }
    [...nextEl, ...prevEl].filter((el) => !!el).forEach((el) => el.classList.add(swiper.params.navigation.lockClass));
  });
  on("click", (_s, e2) => {
    let {
      nextEl,
      prevEl
    } = swiper.navigation;
    nextEl = makeElementsArray(nextEl);
    prevEl = makeElementsArray(prevEl);
    const targetEl = e2.target;
    let targetIsButton = prevEl.includes(targetEl) || nextEl.includes(targetEl);
    if (swiper.isElement && !targetIsButton) {
      const path = e2.path || e2.composedPath && e2.composedPath();
      if (path) {
        targetIsButton = path.find((pathEl) => nextEl.includes(pathEl) || prevEl.includes(pathEl));
      }
    }
    if (swiper.params.navigation.hideOnClick && !targetIsButton) {
      if (swiper.pagination && swiper.params.pagination && swiper.params.pagination.clickable && (swiper.pagination.el === targetEl || swiper.pagination.el.contains(targetEl))) return;
      let isHidden;
      if (nextEl.length) {
        isHidden = nextEl[0].classList.contains(swiper.params.navigation.hiddenClass);
      } else if (prevEl.length) {
        isHidden = prevEl[0].classList.contains(swiper.params.navigation.hiddenClass);
      }
      if (isHidden === true) {
        emit("navigationShow");
      } else {
        emit("navigationHide");
      }
      [...nextEl, ...prevEl].filter((el) => !!el).forEach((el) => el.classList.toggle(swiper.params.navigation.hiddenClass));
    }
  });
  const enable = () => {
    swiper.el.classList.remove(...swiper.params.navigation.navigationDisabledClass.split(" "));
    init();
    update2();
  };
  const disable = () => {
    swiper.el.classList.add(...swiper.params.navigation.navigationDisabledClass.split(" "));
    destroy();
  };
  Object.assign(swiper.navigation, {
    enable,
    disable,
    update: update2,
    init,
    destroy
  });
}
function classesToSelector(classes2 = "") {
  return `.${classes2.trim().replace(/([\.:!+\/()[\]])/g, "\\$1").replace(/ /g, ".")}`;
}
function Pagination({
  swiper,
  extendParams,
  on,
  emit
}) {
  const pfx = "swiper-pagination";
  extendParams({
    pagination: {
      el: null,
      bulletElement: "span",
      clickable: false,
      hideOnClick: false,
      renderBullet: null,
      renderProgressbar: null,
      renderFraction: null,
      renderCustom: null,
      progressbarOpposite: false,
      type: "bullets",
      // 'bullets' or 'progressbar' or 'fraction' or 'custom'
      dynamicBullets: false,
      dynamicMainBullets: 1,
      formatFractionCurrent: (number) => number,
      formatFractionTotal: (number) => number,
      bulletClass: `${pfx}-bullet`,
      bulletActiveClass: `${pfx}-bullet-active`,
      modifierClass: `${pfx}-`,
      currentClass: `${pfx}-current`,
      totalClass: `${pfx}-total`,
      hiddenClass: `${pfx}-hidden`,
      progressbarFillClass: `${pfx}-progressbar-fill`,
      progressbarOppositeClass: `${pfx}-progressbar-opposite`,
      clickableClass: `${pfx}-clickable`,
      lockClass: `${pfx}-lock`,
      horizontalClass: `${pfx}-horizontal`,
      verticalClass: `${pfx}-vertical`,
      paginationDisabledClass: `${pfx}-disabled`
    }
  });
  swiper.pagination = {
    el: null,
    bullets: []
  };
  let bulletSize;
  let dynamicBulletIndex = 0;
  function isPaginationDisabled() {
    return !swiper.params.pagination.el || !swiper.pagination.el || Array.isArray(swiper.pagination.el) && swiper.pagination.el.length === 0;
  }
  function setSideBullets(bulletEl, position) {
    const {
      bulletActiveClass
    } = swiper.params.pagination;
    if (!bulletEl) return;
    bulletEl = bulletEl[`${position === "prev" ? "previous" : "next"}ElementSibling`];
    if (bulletEl) {
      bulletEl.classList.add(`${bulletActiveClass}-${position}`);
      bulletEl = bulletEl[`${position === "prev" ? "previous" : "next"}ElementSibling`];
      if (bulletEl) {
        bulletEl.classList.add(`${bulletActiveClass}-${position}-${position}`);
      }
    }
  }
  function getMoveDirection(prevIndex, nextIndex, length) {
    prevIndex = prevIndex % length;
    nextIndex = nextIndex % length;
    if (nextIndex === prevIndex + 1) {
      return "next";
    } else if (nextIndex === prevIndex - 1) {
      return "previous";
    }
    return;
  }
  function onBulletClick(e2) {
    const bulletEl = e2.target.closest(classesToSelector(swiper.params.pagination.bulletClass));
    if (!bulletEl) {
      return;
    }
    e2.preventDefault();
    const index = elementIndex(bulletEl) * swiper.params.slidesPerGroup;
    if (swiper.params.loop) {
      if (swiper.realIndex === index) return;
      const moveDirection = getMoveDirection(swiper.realIndex, index, swiper.slides.length);
      if (moveDirection === "next") {
        swiper.slideNext();
      } else if (moveDirection === "previous") {
        swiper.slidePrev();
      } else {
        swiper.slideToLoop(index);
      }
    } else {
      swiper.slideTo(index);
    }
  }
  function update2() {
    const rtl = swiper.rtl;
    const params = swiper.params.pagination;
    if (isPaginationDisabled()) return;
    let el = swiper.pagination.el;
    el = makeElementsArray(el);
    let current;
    let previousIndex;
    const slidesLength = swiper.virtual && swiper.params.virtual.enabled ? swiper.virtual.slides.length : swiper.slides.length;
    const total = swiper.params.loop ? Math.ceil(slidesLength / swiper.params.slidesPerGroup) : swiper.snapGrid.length;
    if (swiper.params.loop) {
      previousIndex = swiper.previousRealIndex || 0;
      current = swiper.params.slidesPerGroup > 1 ? Math.floor(swiper.realIndex / swiper.params.slidesPerGroup) : swiper.realIndex;
    } else if (typeof swiper.snapIndex !== "undefined") {
      current = swiper.snapIndex;
      previousIndex = swiper.previousSnapIndex;
    } else {
      previousIndex = swiper.previousIndex || 0;
      current = swiper.activeIndex || 0;
    }
    if (params.type === "bullets" && swiper.pagination.bullets && swiper.pagination.bullets.length > 0) {
      const bullets = swiper.pagination.bullets;
      let firstIndex;
      let lastIndex;
      let midIndex;
      if (params.dynamicBullets) {
        bulletSize = elementOuterSize(bullets[0], swiper.isHorizontal() ? "width" : "height");
        el.forEach((subEl) => {
          subEl.style[swiper.isHorizontal() ? "width" : "height"] = `${bulletSize * (params.dynamicMainBullets + 4)}px`;
        });
        if (params.dynamicMainBullets > 1 && previousIndex !== void 0) {
          dynamicBulletIndex += current - (previousIndex || 0);
          if (dynamicBulletIndex > params.dynamicMainBullets - 1) {
            dynamicBulletIndex = params.dynamicMainBullets - 1;
          } else if (dynamicBulletIndex < 0) {
            dynamicBulletIndex = 0;
          }
        }
        firstIndex = Math.max(current - dynamicBulletIndex, 0);
        lastIndex = firstIndex + (Math.min(bullets.length, params.dynamicMainBullets) - 1);
        midIndex = (lastIndex + firstIndex) / 2;
      }
      bullets.forEach((bulletEl) => {
        const classesToRemove = [...["", "-next", "-next-next", "-prev", "-prev-prev", "-main"].map((suffix) => `${params.bulletActiveClass}${suffix}`)].map((s2) => typeof s2 === "string" && s2.includes(" ") ? s2.split(" ") : s2).flat();
        bulletEl.classList.remove(...classesToRemove);
      });
      if (el.length > 1) {
        bullets.forEach((bullet) => {
          const bulletIndex = elementIndex(bullet);
          if (bulletIndex === current) {
            bullet.classList.add(...params.bulletActiveClass.split(" "));
          } else if (swiper.isElement) {
            bullet.setAttribute("part", "bullet");
          }
          if (params.dynamicBullets) {
            if (bulletIndex >= firstIndex && bulletIndex <= lastIndex) {
              bullet.classList.add(...`${params.bulletActiveClass}-main`.split(" "));
            }
            if (bulletIndex === firstIndex) {
              setSideBullets(bullet, "prev");
            }
            if (bulletIndex === lastIndex) {
              setSideBullets(bullet, "next");
            }
          }
        });
      } else {
        const bullet = bullets[current];
        if (bullet) {
          bullet.classList.add(...params.bulletActiveClass.split(" "));
        }
        if (swiper.isElement) {
          bullets.forEach((bulletEl, bulletIndex) => {
            bulletEl.setAttribute("part", bulletIndex === current ? "bullet-active" : "bullet");
          });
        }
        if (params.dynamicBullets) {
          const firstDisplayedBullet = bullets[firstIndex];
          const lastDisplayedBullet = bullets[lastIndex];
          for (let i2 = firstIndex; i2 <= lastIndex; i2 += 1) {
            if (bullets[i2]) {
              bullets[i2].classList.add(...`${params.bulletActiveClass}-main`.split(" "));
            }
          }
          setSideBullets(firstDisplayedBullet, "prev");
          setSideBullets(lastDisplayedBullet, "next");
        }
      }
      if (params.dynamicBullets) {
        const dynamicBulletsLength = Math.min(bullets.length, params.dynamicMainBullets + 4);
        const bulletsOffset = (bulletSize * dynamicBulletsLength - bulletSize) / 2 - midIndex * bulletSize;
        const offsetProp = rtl ? "right" : "left";
        bullets.forEach((bullet) => {
          bullet.style[swiper.isHorizontal() ? offsetProp : "top"] = `${bulletsOffset}px`;
        });
      }
    }
    el.forEach((subEl, subElIndex) => {
      if (params.type === "fraction") {
        subEl.querySelectorAll(classesToSelector(params.currentClass)).forEach((fractionEl) => {
          fractionEl.textContent = params.formatFractionCurrent(current + 1);
        });
        subEl.querySelectorAll(classesToSelector(params.totalClass)).forEach((totalEl) => {
          totalEl.textContent = params.formatFractionTotal(total);
        });
      }
      if (params.type === "progressbar") {
        let progressbarDirection;
        if (params.progressbarOpposite) {
          progressbarDirection = swiper.isHorizontal() ? "vertical" : "horizontal";
        } else {
          progressbarDirection = swiper.isHorizontal() ? "horizontal" : "vertical";
        }
        const scale = (current + 1) / total;
        let scaleX = 1;
        let scaleY = 1;
        if (progressbarDirection === "horizontal") {
          scaleX = scale;
        } else {
          scaleY = scale;
        }
        subEl.querySelectorAll(classesToSelector(params.progressbarFillClass)).forEach((progressEl) => {
          progressEl.style.transform = `translate3d(0,0,0) scaleX(${scaleX}) scaleY(${scaleY})`;
          progressEl.style.transitionDuration = `${swiper.params.speed}ms`;
        });
      }
      if (params.type === "custom" && params.renderCustom) {
        setInnerHTML(subEl, params.renderCustom(swiper, current + 1, total));
        if (subElIndex === 0) emit("paginationRender", subEl);
      } else {
        if (subElIndex === 0) emit("paginationRender", subEl);
        emit("paginationUpdate", subEl);
      }
      if (swiper.params.watchOverflow && swiper.enabled) {
        subEl.classList[swiper.isLocked ? "add" : "remove"](params.lockClass);
      }
    });
  }
  function render() {
    const params = swiper.params.pagination;
    if (isPaginationDisabled()) return;
    const slidesLength = swiper.virtual && swiper.params.virtual.enabled ? swiper.virtual.slides.length : swiper.grid && swiper.params.grid.rows > 1 ? swiper.slides.length / Math.ceil(swiper.params.grid.rows) : swiper.slides.length;
    let el = swiper.pagination.el;
    el = makeElementsArray(el);
    let paginationHTML = "";
    if (params.type === "bullets") {
      let numberOfBullets = swiper.params.loop ? Math.ceil(slidesLength / swiper.params.slidesPerGroup) : swiper.snapGrid.length;
      if (swiper.params.freeMode && swiper.params.freeMode.enabled && numberOfBullets > slidesLength) {
        numberOfBullets = slidesLength;
      }
      for (let i2 = 0; i2 < numberOfBullets; i2 += 1) {
        if (params.renderBullet) {
          paginationHTML += params.renderBullet.call(swiper, i2, params.bulletClass);
        } else {
          paginationHTML += `<${params.bulletElement} ${swiper.isElement ? 'part="bullet"' : ""} class="${params.bulletClass}"></${params.bulletElement}>`;
        }
      }
    }
    if (params.type === "fraction") {
      if (params.renderFraction) {
        paginationHTML = params.renderFraction.call(swiper, params.currentClass, params.totalClass);
      } else {
        paginationHTML = `<span class="${params.currentClass}"></span> / <span class="${params.totalClass}"></span>`;
      }
    }
    if (params.type === "progressbar") {
      if (params.renderProgressbar) {
        paginationHTML = params.renderProgressbar.call(swiper, params.progressbarFillClass);
      } else {
        paginationHTML = `<span class="${params.progressbarFillClass}"></span>`;
      }
    }
    swiper.pagination.bullets = [];
    el.forEach((subEl) => {
      if (params.type !== "custom") {
        setInnerHTML(subEl, paginationHTML || "");
      }
      if (params.type === "bullets") {
        swiper.pagination.bullets.push(...subEl.querySelectorAll(classesToSelector(params.bulletClass)));
      }
    });
    if (params.type !== "custom") {
      emit("paginationRender", el[0]);
    }
  }
  function init() {
    swiper.params.pagination = createElementIfNotDefined(swiper, swiper.originalParams.pagination, swiper.params.pagination, {
      el: "swiper-pagination"
    });
    const params = swiper.params.pagination;
    if (!params.el) return;
    let el;
    if (typeof params.el === "string" && swiper.isElement) {
      el = swiper.el.querySelector(params.el);
    }
    if (!el && typeof params.el === "string") {
      el = [...document.querySelectorAll(params.el)];
    }
    if (!el) {
      el = params.el;
    }
    if (!el || el.length === 0) return;
    if (swiper.params.uniqueNavElements && typeof params.el === "string" && Array.isArray(el) && el.length > 1) {
      el = [...swiper.el.querySelectorAll(params.el)];
      if (el.length > 1) {
        el = el.find((subEl) => {
          if (elementParents(subEl, ".swiper")[0] !== swiper.el) return false;
          return true;
        });
      }
    }
    if (Array.isArray(el) && el.length === 1) el = el[0];
    Object.assign(swiper.pagination, {
      el
    });
    el = makeElementsArray(el);
    el.forEach((subEl) => {
      if (params.type === "bullets" && params.clickable) {
        subEl.classList.add(...(params.clickableClass || "").split(" "));
      }
      subEl.classList.add(params.modifierClass + params.type);
      subEl.classList.add(swiper.isHorizontal() ? params.horizontalClass : params.verticalClass);
      if (params.type === "bullets" && params.dynamicBullets) {
        subEl.classList.add(`${params.modifierClass}${params.type}-dynamic`);
        dynamicBulletIndex = 0;
        if (params.dynamicMainBullets < 1) {
          params.dynamicMainBullets = 1;
        }
      }
      if (params.type === "progressbar" && params.progressbarOpposite) {
        subEl.classList.add(params.progressbarOppositeClass);
      }
      if (params.clickable) {
        subEl.addEventListener("click", onBulletClick);
      }
      if (!swiper.enabled) {
        subEl.classList.add(params.lockClass);
      }
    });
  }
  function destroy() {
    const params = swiper.params.pagination;
    if (isPaginationDisabled()) return;
    let el = swiper.pagination.el;
    if (el) {
      el = makeElementsArray(el);
      el.forEach((subEl) => {
        subEl.classList.remove(params.hiddenClass);
        subEl.classList.remove(params.modifierClass + params.type);
        subEl.classList.remove(swiper.isHorizontal() ? params.horizontalClass : params.verticalClass);
        if (params.clickable) {
          subEl.classList.remove(...(params.clickableClass || "").split(" "));
          subEl.removeEventListener("click", onBulletClick);
        }
      });
    }
    if (swiper.pagination.bullets) swiper.pagination.bullets.forEach((subEl) => subEl.classList.remove(...params.bulletActiveClass.split(" ")));
  }
  on("changeDirection", () => {
    if (!swiper.pagination || !swiper.pagination.el) return;
    const params = swiper.params.pagination;
    let {
      el
    } = swiper.pagination;
    el = makeElementsArray(el);
    el.forEach((subEl) => {
      subEl.classList.remove(params.horizontalClass, params.verticalClass);
      subEl.classList.add(swiper.isHorizontal() ? params.horizontalClass : params.verticalClass);
    });
  });
  on("init", () => {
    if (swiper.params.pagination.enabled === false) {
      disable();
    } else {
      init();
      render();
      update2();
    }
  });
  on("activeIndexChange", () => {
    if (typeof swiper.snapIndex === "undefined") {
      update2();
    }
  });
  on("snapIndexChange", () => {
    update2();
  });
  on("snapGridLengthChange", () => {
    render();
    update2();
  });
  on("destroy", () => {
    destroy();
  });
  on("enable disable", () => {
    let {
      el
    } = swiper.pagination;
    if (el) {
      el = makeElementsArray(el);
      el.forEach((subEl) => subEl.classList[swiper.enabled ? "remove" : "add"](swiper.params.pagination.lockClass));
    }
  });
  on("lock unlock", () => {
    update2();
  });
  on("click", (_s, e2) => {
    const targetEl = e2.target;
    const el = makeElementsArray(swiper.pagination.el);
    if (swiper.params.pagination.el && swiper.params.pagination.hideOnClick && el && el.length > 0 && !targetEl.classList.contains(swiper.params.pagination.bulletClass)) {
      if (swiper.navigation && (swiper.navigation.nextEl && targetEl === swiper.navigation.nextEl || swiper.navigation.prevEl && targetEl === swiper.navigation.prevEl)) return;
      const isHidden = el[0].classList.contains(swiper.params.pagination.hiddenClass);
      if (isHidden === true) {
        emit("paginationShow");
      } else {
        emit("paginationHide");
      }
      el.forEach((subEl) => subEl.classList.toggle(swiper.params.pagination.hiddenClass));
    }
  });
  const enable = () => {
    swiper.el.classList.remove(swiper.params.pagination.paginationDisabledClass);
    let {
      el
    } = swiper.pagination;
    if (el) {
      el = makeElementsArray(el);
      el.forEach((subEl) => subEl.classList.remove(swiper.params.pagination.paginationDisabledClass));
    }
    init();
    render();
    update2();
  };
  const disable = () => {
    swiper.el.classList.add(swiper.params.pagination.paginationDisabledClass);
    let {
      el
    } = swiper.pagination;
    if (el) {
      el = makeElementsArray(el);
      el.forEach((subEl) => subEl.classList.add(swiper.params.pagination.paginationDisabledClass));
    }
    destroy();
  };
  Object.assign(swiper.pagination, {
    enable,
    disable,
    render,
    update: update2,
    init,
    destroy
  });
}
function Scrollbar({
  swiper,
  extendParams,
  on,
  emit
}) {
  const document2 = getDocument();
  let isTouched = false;
  let timeout = null;
  let dragTimeout = null;
  let dragStartPos;
  let dragSize;
  let trackSize;
  let divider;
  extendParams({
    scrollbar: {
      el: null,
      dragSize: "auto",
      hide: false,
      draggable: false,
      snapOnRelease: true,
      lockClass: "swiper-scrollbar-lock",
      dragClass: "swiper-scrollbar-drag",
      scrollbarDisabledClass: "swiper-scrollbar-disabled",
      horizontalClass: `swiper-scrollbar-horizontal`,
      verticalClass: `swiper-scrollbar-vertical`
    }
  });
  swiper.scrollbar = {
    el: null,
    dragEl: null
  };
  function setTranslate2() {
    if (!swiper.params.scrollbar.el || !swiper.scrollbar.el) return;
    const {
      scrollbar,
      rtlTranslate: rtl
    } = swiper;
    const {
      dragEl,
      el
    } = scrollbar;
    const params = swiper.params.scrollbar;
    const progress = swiper.params.loop ? swiper.progressLoop : swiper.progress;
    let newSize = dragSize;
    let newPos = (trackSize - dragSize) * progress;
    if (rtl) {
      newPos = -newPos;
      if (newPos > 0) {
        newSize = dragSize - newPos;
        newPos = 0;
      } else if (-newPos + dragSize > trackSize) {
        newSize = trackSize + newPos;
      }
    } else if (newPos < 0) {
      newSize = dragSize + newPos;
      newPos = 0;
    } else if (newPos + dragSize > trackSize) {
      newSize = trackSize - newPos;
    }
    if (swiper.isHorizontal()) {
      dragEl.style.transform = `translate3d(${newPos}px, 0, 0)`;
      dragEl.style.width = `${newSize}px`;
    } else {
      dragEl.style.transform = `translate3d(0px, ${newPos}px, 0)`;
      dragEl.style.height = `${newSize}px`;
    }
    if (params.hide) {
      clearTimeout(timeout);
      el.style.opacity = 1;
      timeout = setTimeout(() => {
        el.style.opacity = 0;
        el.style.transitionDuration = "400ms";
      }, 1e3);
    }
  }
  function setTransition2(duration) {
    if (!swiper.params.scrollbar.el || !swiper.scrollbar.el) return;
    swiper.scrollbar.dragEl.style.transitionDuration = `${duration}ms`;
  }
  function updateSize2() {
    if (!swiper.params.scrollbar.el || !swiper.scrollbar.el) return;
    const {
      scrollbar
    } = swiper;
    const {
      dragEl,
      el
    } = scrollbar;
    dragEl.style.width = "";
    dragEl.style.height = "";
    trackSize = swiper.isHorizontal() ? el.offsetWidth : el.offsetHeight;
    divider = swiper.size / (swiper.virtualSize + swiper.params.slidesOffsetBefore - (swiper.params.centeredSlides ? swiper.snapGrid[0] : 0));
    if (swiper.params.scrollbar.dragSize === "auto") {
      dragSize = trackSize * divider;
    } else {
      dragSize = parseInt(swiper.params.scrollbar.dragSize, 10);
    }
    if (swiper.isHorizontal()) {
      dragEl.style.width = `${dragSize}px`;
    } else {
      dragEl.style.height = `${dragSize}px`;
    }
    if (divider >= 1) {
      el.style.display = "none";
    } else {
      el.style.display = "";
    }
    if (swiper.params.scrollbar.hide) {
      el.style.opacity = 0;
    }
    if (swiper.params.watchOverflow && swiper.enabled) {
      scrollbar.el.classList[swiper.isLocked ? "add" : "remove"](swiper.params.scrollbar.lockClass);
    }
  }
  function getPointerPosition(e2) {
    return swiper.isHorizontal() ? e2.clientX : e2.clientY;
  }
  function setDragPosition(e2) {
    const {
      scrollbar,
      rtlTranslate: rtl
    } = swiper;
    const {
      el
    } = scrollbar;
    let positionRatio;
    positionRatio = (getPointerPosition(e2) - elementOffset(el)[swiper.isHorizontal() ? "left" : "top"] - (dragStartPos !== null ? dragStartPos : dragSize / 2)) / (trackSize - dragSize);
    positionRatio = Math.max(Math.min(positionRatio, 1), 0);
    if (rtl) {
      positionRatio = 1 - positionRatio;
    }
    const position = swiper.minTranslate() + (swiper.maxTranslate() - swiper.minTranslate()) * positionRatio;
    swiper.updateProgress(position);
    swiper.setTranslate(position);
    swiper.updateActiveIndex();
    swiper.updateSlidesClasses();
  }
  function onDragStart(e2) {
    const params = swiper.params.scrollbar;
    const {
      scrollbar,
      wrapperEl
    } = swiper;
    const {
      el,
      dragEl
    } = scrollbar;
    isTouched = true;
    dragStartPos = e2.target === dragEl ? getPointerPosition(e2) - e2.target.getBoundingClientRect()[swiper.isHorizontal() ? "left" : "top"] : null;
    e2.preventDefault();
    e2.stopPropagation();
    wrapperEl.style.transitionDuration = "100ms";
    dragEl.style.transitionDuration = "100ms";
    setDragPosition(e2);
    clearTimeout(dragTimeout);
    el.style.transitionDuration = "0ms";
    if (params.hide) {
      el.style.opacity = 1;
    }
    if (swiper.params.cssMode) {
      swiper.wrapperEl.style["scroll-snap-type"] = "none";
    }
    emit("scrollbarDragStart", e2);
  }
  function onDragMove(e2) {
    const {
      scrollbar,
      wrapperEl
    } = swiper;
    const {
      el,
      dragEl
    } = scrollbar;
    if (!isTouched) return;
    if (e2.preventDefault && e2.cancelable) e2.preventDefault();
    else e2.returnValue = false;
    setDragPosition(e2);
    wrapperEl.style.transitionDuration = "0ms";
    el.style.transitionDuration = "0ms";
    dragEl.style.transitionDuration = "0ms";
    emit("scrollbarDragMove", e2);
  }
  function onDragEnd(e2) {
    const params = swiper.params.scrollbar;
    const {
      scrollbar,
      wrapperEl
    } = swiper;
    const {
      el
    } = scrollbar;
    if (!isTouched) return;
    isTouched = false;
    if (swiper.params.cssMode) {
      swiper.wrapperEl.style["scroll-snap-type"] = "";
      wrapperEl.style.transitionDuration = "";
    }
    if (params.hide) {
      clearTimeout(dragTimeout);
      dragTimeout = nextTick(() => {
        el.style.opacity = 0;
        el.style.transitionDuration = "400ms";
      }, 1e3);
    }
    emit("scrollbarDragEnd", e2);
    if (params.snapOnRelease) {
      swiper.slideToClosest();
    }
  }
  function events2(method) {
    const {
      scrollbar,
      params
    } = swiper;
    const el = scrollbar.el;
    if (!el) return;
    const target = el;
    const activeListener = params.passiveListeners ? {
      passive: false,
      capture: false
    } : false;
    const passiveListener = params.passiveListeners ? {
      passive: true,
      capture: false
    } : false;
    if (!target) return;
    const eventMethod = method === "on" ? "addEventListener" : "removeEventListener";
    target[eventMethod]("pointerdown", onDragStart, activeListener);
    document2[eventMethod]("pointermove", onDragMove, activeListener);
    document2[eventMethod]("pointerup", onDragEnd, passiveListener);
  }
  function enableDraggable() {
    if (!swiper.params.scrollbar.el || !swiper.scrollbar.el) return;
    events2("on");
  }
  function disableDraggable() {
    if (!swiper.params.scrollbar.el || !swiper.scrollbar.el) return;
    events2("off");
  }
  function init() {
    const {
      scrollbar,
      el: swiperEl
    } = swiper;
    swiper.params.scrollbar = createElementIfNotDefined(swiper, swiper.originalParams.scrollbar, swiper.params.scrollbar, {
      el: "swiper-scrollbar"
    });
    const params = swiper.params.scrollbar;
    if (!params.el) return;
    let el;
    if (typeof params.el === "string" && swiper.isElement) {
      el = swiper.el.querySelector(params.el);
    }
    if (!el && typeof params.el === "string") {
      el = document2.querySelectorAll(params.el);
      if (!el.length) return;
    } else if (!el) {
      el = params.el;
    }
    if (swiper.params.uniqueNavElements && typeof params.el === "string" && el.length > 1 && swiperEl.querySelectorAll(params.el).length === 1) {
      el = swiperEl.querySelector(params.el);
    }
    if (el.length > 0) el = el[0];
    el.classList.add(swiper.isHorizontal() ? params.horizontalClass : params.verticalClass);
    let dragEl;
    if (el) {
      dragEl = el.querySelector(classesToSelector(swiper.params.scrollbar.dragClass));
      if (!dragEl) {
        dragEl = createElement("div", swiper.params.scrollbar.dragClass);
        el.append(dragEl);
      }
    }
    Object.assign(scrollbar, {
      el,
      dragEl
    });
    if (params.draggable) {
      enableDraggable();
    }
    if (el) {
      el.classList[swiper.enabled ? "remove" : "add"](...classesToTokens(swiper.params.scrollbar.lockClass));
    }
  }
  function destroy() {
    const params = swiper.params.scrollbar;
    const el = swiper.scrollbar.el;
    if (el) {
      el.classList.remove(...classesToTokens(swiper.isHorizontal() ? params.horizontalClass : params.verticalClass));
    }
    disableDraggable();
  }
  on("changeDirection", () => {
    if (!swiper.scrollbar || !swiper.scrollbar.el) return;
    const params = swiper.params.scrollbar;
    let {
      el
    } = swiper.scrollbar;
    el = makeElementsArray(el);
    el.forEach((subEl) => {
      subEl.classList.remove(params.horizontalClass, params.verticalClass);
      subEl.classList.add(swiper.isHorizontal() ? params.horizontalClass : params.verticalClass);
    });
  });
  on("init", () => {
    if (swiper.params.scrollbar.enabled === false) {
      disable();
    } else {
      init();
      updateSize2();
      setTranslate2();
    }
  });
  on("update resize observerUpdate lock unlock changeDirection", () => {
    updateSize2();
  });
  on("setTranslate", () => {
    setTranslate2();
  });
  on("setTransition", (_s, duration) => {
    setTransition2(duration);
  });
  on("enable disable", () => {
    const {
      el
    } = swiper.scrollbar;
    if (el) {
      el.classList[swiper.enabled ? "remove" : "add"](...classesToTokens(swiper.params.scrollbar.lockClass));
    }
  });
  on("destroy", () => {
    destroy();
  });
  const enable = () => {
    swiper.el.classList.remove(...classesToTokens(swiper.params.scrollbar.scrollbarDisabledClass));
    if (swiper.scrollbar.el) {
      swiper.scrollbar.el.classList.remove(...classesToTokens(swiper.params.scrollbar.scrollbarDisabledClass));
    }
    init();
    updateSize2();
    setTranslate2();
  };
  const disable = () => {
    swiper.el.classList.add(...classesToTokens(swiper.params.scrollbar.scrollbarDisabledClass));
    if (swiper.scrollbar.el) {
      swiper.scrollbar.el.classList.add(...classesToTokens(swiper.params.scrollbar.scrollbarDisabledClass));
    }
    destroy();
  };
  Object.assign(swiper.scrollbar, {
    enable,
    disable,
    updateSize: updateSize2,
    setTranslate: setTranslate2,
    init,
    destroy
  });
}
function Parallax({
  swiper,
  extendParams,
  on
}) {
  extendParams({
    parallax: {
      enabled: false
    }
  });
  const elementsSelector = "[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y], [data-swiper-parallax-opacity], [data-swiper-parallax-scale]";
  const setTransform = (el, progress) => {
    const {
      rtl
    } = swiper;
    const rtlFactor = rtl ? -1 : 1;
    const p2 = el.getAttribute("data-swiper-parallax") || "0";
    let x2 = el.getAttribute("data-swiper-parallax-x");
    let y2 = el.getAttribute("data-swiper-parallax-y");
    const scale = el.getAttribute("data-swiper-parallax-scale");
    const opacity = el.getAttribute("data-swiper-parallax-opacity");
    const rotate = el.getAttribute("data-swiper-parallax-rotate");
    if (x2 || y2) {
      x2 = x2 || "0";
      y2 = y2 || "0";
    } else if (swiper.isHorizontal()) {
      x2 = p2;
      y2 = "0";
    } else {
      y2 = p2;
      x2 = "0";
    }
    if (x2.indexOf("%") >= 0) {
      x2 = `${parseInt(x2, 10) * progress * rtlFactor}%`;
    } else {
      x2 = `${x2 * progress * rtlFactor}px`;
    }
    if (y2.indexOf("%") >= 0) {
      y2 = `${parseInt(y2, 10) * progress}%`;
    } else {
      y2 = `${y2 * progress}px`;
    }
    if (typeof opacity !== "undefined" && opacity !== null) {
      const currentOpacity = opacity - (opacity - 1) * (1 - Math.abs(progress));
      el.style.opacity = currentOpacity;
    }
    let transform = `translate3d(${x2}, ${y2}, 0px)`;
    if (typeof scale !== "undefined" && scale !== null) {
      const currentScale = scale - (scale - 1) * (1 - Math.abs(progress));
      transform += ` scale(${currentScale})`;
    }
    if (rotate && typeof rotate !== "undefined" && rotate !== null) {
      const currentRotate = rotate * progress * -1;
      transform += ` rotate(${currentRotate}deg)`;
    }
    el.style.transform = transform;
  };
  const setTranslate2 = () => {
    const {
      el,
      slides,
      progress,
      snapGrid,
      isElement
    } = swiper;
    const elements = elementChildren(el, elementsSelector);
    if (swiper.isElement) {
      elements.push(...elementChildren(swiper.hostEl, elementsSelector));
    }
    elements.forEach((subEl) => {
      setTransform(subEl, progress);
    });
    slides.forEach((slideEl, slideIndex) => {
      let slideProgress = slideEl.progress;
      if (swiper.params.slidesPerGroup > 1 && swiper.params.slidesPerView !== "auto") {
        slideProgress += Math.ceil(slideIndex / 2) - progress * (snapGrid.length - 1);
      }
      slideProgress = Math.min(Math.max(slideProgress, -1), 1);
      slideEl.querySelectorAll(`${elementsSelector}, [data-swiper-parallax-rotate]`).forEach((subEl) => {
        setTransform(subEl, slideProgress);
      });
    });
  };
  const setTransition2 = (duration = swiper.params.speed) => {
    const {
      el,
      hostEl
    } = swiper;
    const elements = [...el.querySelectorAll(elementsSelector)];
    if (swiper.isElement) {
      elements.push(...hostEl.querySelectorAll(elementsSelector));
    }
    elements.forEach((parallaxEl) => {
      let parallaxDuration = parseInt(parallaxEl.getAttribute("data-swiper-parallax-duration"), 10) || duration;
      if (duration === 0) parallaxDuration = 0;
      parallaxEl.style.transitionDuration = `${parallaxDuration}ms`;
    });
  };
  on("beforeInit", () => {
    if (!swiper.params.parallax.enabled) return;
    swiper.params.watchSlidesProgress = true;
    swiper.originalParams.watchSlidesProgress = true;
  });
  on("init", () => {
    if (!swiper.params.parallax.enabled) return;
    setTranslate2();
  });
  on("setTranslate", () => {
    if (!swiper.params.parallax.enabled) return;
    setTranslate2();
  });
  on("setTransition", (_swiper, duration) => {
    if (!swiper.params.parallax.enabled) return;
    setTransition2(duration);
  });
}
function Zoom({
  swiper,
  extendParams,
  on,
  emit
}) {
  const window2 = getWindow();
  extendParams({
    zoom: {
      enabled: false,
      limitToOriginalSize: false,
      maxRatio: 3,
      minRatio: 1,
      panOnMouseMove: false,
      toggle: true,
      containerClass: "swiper-zoom-container",
      zoomedSlideClass: "swiper-slide-zoomed"
    }
  });
  swiper.zoom = {
    enabled: false
  };
  let currentScale = 1;
  let isScaling = false;
  let isPanningWithMouse = false;
  let mousePanStart = {
    x: 0,
    y: 0
  };
  const mousePanSensitivity = -3;
  let fakeGestureTouched;
  let fakeGestureMoved;
  const evCache = [];
  const gesture = {
    originX: 0,
    originY: 0,
    slideEl: void 0,
    slideWidth: void 0,
    slideHeight: void 0,
    imageEl: void 0,
    imageWrapEl: void 0,
    maxRatio: 3
  };
  const image = {
    isTouched: void 0,
    isMoved: void 0,
    currentX: void 0,
    currentY: void 0,
    minX: void 0,
    minY: void 0,
    maxX: void 0,
    maxY: void 0,
    width: void 0,
    height: void 0,
    startX: void 0,
    startY: void 0,
    touchesStart: {},
    touchesCurrent: {}
  };
  const velocity = {
    x: void 0,
    y: void 0,
    prevPositionX: void 0,
    prevPositionY: void 0,
    prevTime: void 0
  };
  let scale = 1;
  Object.defineProperty(swiper.zoom, "scale", {
    get() {
      return scale;
    },
    set(value) {
      if (scale !== value) {
        const imageEl = gesture.imageEl;
        const slideEl = gesture.slideEl;
        emit("zoomChange", value, imageEl, slideEl);
      }
      scale = value;
    }
  });
  function getDistanceBetweenTouches() {
    if (evCache.length < 2) return 1;
    const x1 = evCache[0].pageX;
    const y1 = evCache[0].pageY;
    const x2 = evCache[1].pageX;
    const y2 = evCache[1].pageY;
    const distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    return distance;
  }
  function getMaxRatio() {
    const params = swiper.params.zoom;
    const maxRatio = gesture.imageWrapEl.getAttribute("data-swiper-zoom") || params.maxRatio;
    if (params.limitToOriginalSize && gesture.imageEl && gesture.imageEl.naturalWidth) {
      const imageMaxRatio = gesture.imageEl.naturalWidth / gesture.imageEl.offsetWidth;
      return Math.min(imageMaxRatio, maxRatio);
    }
    return maxRatio;
  }
  function getScaleOrigin() {
    if (evCache.length < 2) return {
      x: null,
      y: null
    };
    const box = gesture.imageEl.getBoundingClientRect();
    return [(evCache[0].pageX + (evCache[1].pageX - evCache[0].pageX) / 2 - box.x - window2.scrollX) / currentScale, (evCache[0].pageY + (evCache[1].pageY - evCache[0].pageY) / 2 - box.y - window2.scrollY) / currentScale];
  }
  function getSlideSelector() {
    return swiper.isElement ? `swiper-slide` : `.${swiper.params.slideClass}`;
  }
  function eventWithinSlide(e2) {
    const slideSelector = getSlideSelector();
    if (e2.target.matches(slideSelector)) return true;
    if (swiper.slides.filter((slideEl) => slideEl.contains(e2.target)).length > 0) return true;
    return false;
  }
  function eventWithinZoomContainer(e2) {
    const selector = `.${swiper.params.zoom.containerClass}`;
    if (e2.target.matches(selector)) return true;
    if ([...swiper.hostEl.querySelectorAll(selector)].filter((containerEl) => containerEl.contains(e2.target)).length > 0) return true;
    return false;
  }
  function onGestureStart(e2) {
    if (e2.pointerType === "mouse") {
      evCache.splice(0, evCache.length);
    }
    if (!eventWithinSlide(e2)) return;
    const params = swiper.params.zoom;
    fakeGestureTouched = false;
    fakeGestureMoved = false;
    evCache.push(e2);
    if (evCache.length < 2) {
      return;
    }
    fakeGestureTouched = true;
    gesture.scaleStart = getDistanceBetweenTouches();
    if (!gesture.slideEl) {
      gesture.slideEl = e2.target.closest(`.${swiper.params.slideClass}, swiper-slide`);
      if (!gesture.slideEl) gesture.slideEl = swiper.slides[swiper.activeIndex];
      let imageEl = gesture.slideEl.querySelector(`.${params.containerClass}`);
      if (imageEl) {
        imageEl = imageEl.querySelectorAll("picture, img, svg, canvas, .swiper-zoom-target")[0];
      }
      gesture.imageEl = imageEl;
      if (imageEl) {
        gesture.imageWrapEl = elementParents(gesture.imageEl, `.${params.containerClass}`)[0];
      } else {
        gesture.imageWrapEl = void 0;
      }
      if (!gesture.imageWrapEl) {
        gesture.imageEl = void 0;
        return;
      }
      gesture.maxRatio = getMaxRatio();
    }
    if (gesture.imageEl) {
      const [originX, originY] = getScaleOrigin();
      gesture.originX = originX;
      gesture.originY = originY;
      gesture.imageEl.style.transitionDuration = "0ms";
    }
    isScaling = true;
  }
  function onGestureChange(e2) {
    if (!eventWithinSlide(e2)) return;
    const params = swiper.params.zoom;
    const zoom = swiper.zoom;
    const pointerIndex = evCache.findIndex((cachedEv) => cachedEv.pointerId === e2.pointerId);
    if (pointerIndex >= 0) evCache[pointerIndex] = e2;
    if (evCache.length < 2) {
      return;
    }
    fakeGestureMoved = true;
    gesture.scaleMove = getDistanceBetweenTouches();
    if (!gesture.imageEl) {
      return;
    }
    zoom.scale = gesture.scaleMove / gesture.scaleStart * currentScale;
    if (zoom.scale > gesture.maxRatio) {
      zoom.scale = gesture.maxRatio - 1 + (zoom.scale - gesture.maxRatio + 1) ** 0.5;
    }
    if (zoom.scale < params.minRatio) {
      zoom.scale = params.minRatio + 1 - (params.minRatio - zoom.scale + 1) ** 0.5;
    }
    gesture.imageEl.style.transform = `translate3d(0,0,0) scale(${zoom.scale})`;
  }
  function onGestureEnd(e2) {
    if (!eventWithinSlide(e2)) return;
    if (e2.pointerType === "mouse" && e2.type === "pointerout") return;
    const params = swiper.params.zoom;
    const zoom = swiper.zoom;
    const pointerIndex = evCache.findIndex((cachedEv) => cachedEv.pointerId === e2.pointerId);
    if (pointerIndex >= 0) evCache.splice(pointerIndex, 1);
    if (!fakeGestureTouched || !fakeGestureMoved) {
      return;
    }
    fakeGestureTouched = false;
    fakeGestureMoved = false;
    if (!gesture.imageEl) return;
    zoom.scale = Math.max(Math.min(zoom.scale, gesture.maxRatio), params.minRatio);
    gesture.imageEl.style.transitionDuration = `${swiper.params.speed}ms`;
    gesture.imageEl.style.transform = `translate3d(0,0,0) scale(${zoom.scale})`;
    currentScale = zoom.scale;
    isScaling = false;
    if (zoom.scale > 1 && gesture.slideEl) {
      gesture.slideEl.classList.add(`${params.zoomedSlideClass}`);
    } else if (zoom.scale <= 1 && gesture.slideEl) {
      gesture.slideEl.classList.remove(`${params.zoomedSlideClass}`);
    }
    if (zoom.scale === 1) {
      gesture.originX = 0;
      gesture.originY = 0;
      gesture.slideEl = void 0;
    }
  }
  let allowTouchMoveTimeout;
  function allowTouchMove() {
    swiper.touchEventsData.preventTouchMoveFromPointerMove = false;
  }
  function preventTouchMove() {
    clearTimeout(allowTouchMoveTimeout);
    swiper.touchEventsData.preventTouchMoveFromPointerMove = true;
    allowTouchMoveTimeout = setTimeout(() => {
      if (swiper.destroyed) return;
      allowTouchMove();
    });
  }
  function onTouchStart2(e2) {
    const device = swiper.device;
    if (!gesture.imageEl) return;
    if (image.isTouched) return;
    if (device.android && e2.cancelable) e2.preventDefault();
    image.isTouched = true;
    const event2 = evCache.length > 0 ? evCache[0] : e2;
    image.touchesStart.x = event2.pageX;
    image.touchesStart.y = event2.pageY;
  }
  function onTouchMove2(e2) {
    const isMouseEvent = e2.pointerType === "mouse";
    const isMousePan = isMouseEvent && swiper.params.zoom.panOnMouseMove;
    if (!eventWithinSlide(e2) || !eventWithinZoomContainer(e2)) {
      return;
    }
    const zoom = swiper.zoom;
    if (!gesture.imageEl) {
      return;
    }
    if (!image.isTouched || !gesture.slideEl) {
      if (isMousePan) onMouseMove(e2);
      return;
    }
    if (isMousePan) {
      onMouseMove(e2);
      return;
    }
    if (!image.isMoved) {
      image.width = gesture.imageEl.offsetWidth || gesture.imageEl.clientWidth;
      image.height = gesture.imageEl.offsetHeight || gesture.imageEl.clientHeight;
      image.startX = getTranslate(gesture.imageWrapEl, "x") || 0;
      image.startY = getTranslate(gesture.imageWrapEl, "y") || 0;
      gesture.slideWidth = gesture.slideEl.offsetWidth;
      gesture.slideHeight = gesture.slideEl.offsetHeight;
      gesture.imageWrapEl.style.transitionDuration = "0ms";
    }
    const scaledWidth = image.width * zoom.scale;
    const scaledHeight = image.height * zoom.scale;
    image.minX = Math.min(gesture.slideWidth / 2 - scaledWidth / 2, 0);
    image.maxX = -image.minX;
    image.minY = Math.min(gesture.slideHeight / 2 - scaledHeight / 2, 0);
    image.maxY = -image.minY;
    image.touchesCurrent.x = evCache.length > 0 ? evCache[0].pageX : e2.pageX;
    image.touchesCurrent.y = evCache.length > 0 ? evCache[0].pageY : e2.pageY;
    const touchesDiff = Math.max(Math.abs(image.touchesCurrent.x - image.touchesStart.x), Math.abs(image.touchesCurrent.y - image.touchesStart.y));
    if (touchesDiff > 5) {
      swiper.allowClick = false;
    }
    if (!image.isMoved && !isScaling) {
      if (swiper.isHorizontal() && (Math.floor(image.minX) === Math.floor(image.startX) && image.touchesCurrent.x < image.touchesStart.x || Math.floor(image.maxX) === Math.floor(image.startX) && image.touchesCurrent.x > image.touchesStart.x)) {
        image.isTouched = false;
        allowTouchMove();
        return;
      }
      if (!swiper.isHorizontal() && (Math.floor(image.minY) === Math.floor(image.startY) && image.touchesCurrent.y < image.touchesStart.y || Math.floor(image.maxY) === Math.floor(image.startY) && image.touchesCurrent.y > image.touchesStart.y)) {
        image.isTouched = false;
        allowTouchMove();
        return;
      }
    }
    if (e2.cancelable) {
      e2.preventDefault();
    }
    e2.stopPropagation();
    preventTouchMove();
    image.isMoved = true;
    const scaleRatio = (zoom.scale - currentScale) / (gesture.maxRatio - swiper.params.zoom.minRatio);
    const {
      originX,
      originY
    } = gesture;
    image.currentX = image.touchesCurrent.x - image.touchesStart.x + image.startX + scaleRatio * (image.width - originX * 2);
    image.currentY = image.touchesCurrent.y - image.touchesStart.y + image.startY + scaleRatio * (image.height - originY * 2);
    if (image.currentX < image.minX) {
      image.currentX = image.minX + 1 - (image.minX - image.currentX + 1) ** 0.8;
    }
    if (image.currentX > image.maxX) {
      image.currentX = image.maxX - 1 + (image.currentX - image.maxX + 1) ** 0.8;
    }
    if (image.currentY < image.minY) {
      image.currentY = image.minY + 1 - (image.minY - image.currentY + 1) ** 0.8;
    }
    if (image.currentY > image.maxY) {
      image.currentY = image.maxY - 1 + (image.currentY - image.maxY + 1) ** 0.8;
    }
    if (!velocity.prevPositionX) velocity.prevPositionX = image.touchesCurrent.x;
    if (!velocity.prevPositionY) velocity.prevPositionY = image.touchesCurrent.y;
    if (!velocity.prevTime) velocity.prevTime = Date.now();
    velocity.x = (image.touchesCurrent.x - velocity.prevPositionX) / (Date.now() - velocity.prevTime) / 2;
    velocity.y = (image.touchesCurrent.y - velocity.prevPositionY) / (Date.now() - velocity.prevTime) / 2;
    if (Math.abs(image.touchesCurrent.x - velocity.prevPositionX) < 2) velocity.x = 0;
    if (Math.abs(image.touchesCurrent.y - velocity.prevPositionY) < 2) velocity.y = 0;
    velocity.prevPositionX = image.touchesCurrent.x;
    velocity.prevPositionY = image.touchesCurrent.y;
    velocity.prevTime = Date.now();
    gesture.imageWrapEl.style.transform = `translate3d(${image.currentX}px, ${image.currentY}px,0)`;
  }
  function onTouchEnd2() {
    const zoom = swiper.zoom;
    evCache.length = 0;
    if (!gesture.imageEl) return;
    if (!image.isTouched || !image.isMoved) {
      image.isTouched = false;
      image.isMoved = false;
      return;
    }
    image.isTouched = false;
    image.isMoved = false;
    let momentumDurationX = 300;
    let momentumDurationY = 300;
    const momentumDistanceX = velocity.x * momentumDurationX;
    const newPositionX = image.currentX + momentumDistanceX;
    const momentumDistanceY = velocity.y * momentumDurationY;
    const newPositionY = image.currentY + momentumDistanceY;
    if (velocity.x !== 0) momentumDurationX = Math.abs((newPositionX - image.currentX) / velocity.x);
    if (velocity.y !== 0) momentumDurationY = Math.abs((newPositionY - image.currentY) / velocity.y);
    const momentumDuration = Math.max(momentumDurationX, momentumDurationY);
    image.currentX = newPositionX;
    image.currentY = newPositionY;
    const scaledWidth = image.width * zoom.scale;
    const scaledHeight = image.height * zoom.scale;
    image.minX = Math.min(gesture.slideWidth / 2 - scaledWidth / 2, 0);
    image.maxX = -image.minX;
    image.minY = Math.min(gesture.slideHeight / 2 - scaledHeight / 2, 0);
    image.maxY = -image.minY;
    image.currentX = Math.max(Math.min(image.currentX, image.maxX), image.minX);
    image.currentY = Math.max(Math.min(image.currentY, image.maxY), image.minY);
    gesture.imageWrapEl.style.transitionDuration = `${momentumDuration}ms`;
    gesture.imageWrapEl.style.transform = `translate3d(${image.currentX}px, ${image.currentY}px,0)`;
  }
  function onTransitionEnd() {
    const zoom = swiper.zoom;
    if (gesture.slideEl && swiper.activeIndex !== swiper.slides.indexOf(gesture.slideEl)) {
      if (gesture.imageEl) {
        gesture.imageEl.style.transform = "translate3d(0,0,0) scale(1)";
      }
      if (gesture.imageWrapEl) {
        gesture.imageWrapEl.style.transform = "translate3d(0,0,0)";
      }
      gesture.slideEl.classList.remove(`${swiper.params.zoom.zoomedSlideClass}`);
      zoom.scale = 1;
      currentScale = 1;
      gesture.slideEl = void 0;
      gesture.imageEl = void 0;
      gesture.imageWrapEl = void 0;
      gesture.originX = 0;
      gesture.originY = 0;
    }
  }
  function onMouseMove(e2) {
    if (currentScale <= 1 || !gesture.imageWrapEl) return;
    if (!eventWithinSlide(e2) || !eventWithinZoomContainer(e2)) return;
    const currentTransform = window2.getComputedStyle(gesture.imageWrapEl).transform;
    const matrix = new window2.DOMMatrix(currentTransform);
    if (!isPanningWithMouse) {
      isPanningWithMouse = true;
      mousePanStart.x = e2.clientX;
      mousePanStart.y = e2.clientY;
      image.startX = matrix.e;
      image.startY = matrix.f;
      image.width = gesture.imageEl.offsetWidth || gesture.imageEl.clientWidth;
      image.height = gesture.imageEl.offsetHeight || gesture.imageEl.clientHeight;
      gesture.slideWidth = gesture.slideEl.offsetWidth;
      gesture.slideHeight = gesture.slideEl.offsetHeight;
      return;
    }
    const deltaX = (e2.clientX - mousePanStart.x) * mousePanSensitivity;
    const deltaY = (e2.clientY - mousePanStart.y) * mousePanSensitivity;
    const scaledWidth = image.width * currentScale;
    const scaledHeight = image.height * currentScale;
    const slideWidth = gesture.slideWidth;
    const slideHeight = gesture.slideHeight;
    const minX = Math.min(slideWidth / 2 - scaledWidth / 2, 0);
    const maxX = -minX;
    const minY = Math.min(slideHeight / 2 - scaledHeight / 2, 0);
    const maxY = -minY;
    const newX = Math.max(Math.min(image.startX + deltaX, maxX), minX);
    const newY = Math.max(Math.min(image.startY + deltaY, maxY), minY);
    gesture.imageWrapEl.style.transitionDuration = "0ms";
    gesture.imageWrapEl.style.transform = `translate3d(${newX}px, ${newY}px, 0)`;
    mousePanStart.x = e2.clientX;
    mousePanStart.y = e2.clientY;
    image.startX = newX;
    image.startY = newY;
    image.currentX = newX;
    image.currentY = newY;
  }
  function zoomIn(e2) {
    const zoom = swiper.zoom;
    const params = swiper.params.zoom;
    if (!gesture.slideEl) {
      if (e2 && e2.target) {
        gesture.slideEl = e2.target.closest(`.${swiper.params.slideClass}, swiper-slide`);
      }
      if (!gesture.slideEl) {
        if (swiper.params.virtual && swiper.params.virtual.enabled && swiper.virtual) {
          gesture.slideEl = elementChildren(swiper.slidesEl, `.${swiper.params.slideActiveClass}`)[0];
        } else {
          gesture.slideEl = swiper.slides[swiper.activeIndex];
        }
      }
      let imageEl = gesture.slideEl.querySelector(`.${params.containerClass}`);
      if (imageEl) {
        imageEl = imageEl.querySelectorAll("picture, img, svg, canvas, .swiper-zoom-target")[0];
      }
      gesture.imageEl = imageEl;
      if (imageEl) {
        gesture.imageWrapEl = elementParents(gesture.imageEl, `.${params.containerClass}`)[0];
      } else {
        gesture.imageWrapEl = void 0;
      }
    }
    if (!gesture.imageEl || !gesture.imageWrapEl) return;
    if (swiper.params.cssMode) {
      swiper.wrapperEl.style.overflow = "hidden";
      swiper.wrapperEl.style.touchAction = "none";
    }
    gesture.slideEl.classList.add(`${params.zoomedSlideClass}`);
    let touchX;
    let touchY;
    let offsetX;
    let offsetY;
    let diffX;
    let diffY;
    let translateX;
    let translateY;
    let imageWidth;
    let imageHeight;
    let scaledWidth;
    let scaledHeight;
    let translateMinX;
    let translateMinY;
    let translateMaxX;
    let translateMaxY;
    let slideWidth;
    let slideHeight;
    if (typeof image.touchesStart.x === "undefined" && e2) {
      touchX = e2.pageX;
      touchY = e2.pageY;
    } else {
      touchX = image.touchesStart.x;
      touchY = image.touchesStart.y;
    }
    const prevScale = currentScale;
    const forceZoomRatio = typeof e2 === "number" ? e2 : null;
    if (currentScale === 1 && forceZoomRatio) {
      touchX = void 0;
      touchY = void 0;
      image.touchesStart.x = void 0;
      image.touchesStart.y = void 0;
    }
    const maxRatio = getMaxRatio();
    zoom.scale = forceZoomRatio || maxRatio;
    currentScale = forceZoomRatio || maxRatio;
    if (e2 && !(currentScale === 1 && forceZoomRatio)) {
      slideWidth = gesture.slideEl.offsetWidth;
      slideHeight = gesture.slideEl.offsetHeight;
      offsetX = elementOffset(gesture.slideEl).left + window2.scrollX;
      offsetY = elementOffset(gesture.slideEl).top + window2.scrollY;
      diffX = offsetX + slideWidth / 2 - touchX;
      diffY = offsetY + slideHeight / 2 - touchY;
      imageWidth = gesture.imageEl.offsetWidth || gesture.imageEl.clientWidth;
      imageHeight = gesture.imageEl.offsetHeight || gesture.imageEl.clientHeight;
      scaledWidth = imageWidth * zoom.scale;
      scaledHeight = imageHeight * zoom.scale;
      translateMinX = Math.min(slideWidth / 2 - scaledWidth / 2, 0);
      translateMinY = Math.min(slideHeight / 2 - scaledHeight / 2, 0);
      translateMaxX = -translateMinX;
      translateMaxY = -translateMinY;
      if (prevScale > 0 && forceZoomRatio && typeof image.currentX === "number" && typeof image.currentY === "number") {
        translateX = image.currentX * zoom.scale / prevScale;
        translateY = image.currentY * zoom.scale / prevScale;
      } else {
        translateX = diffX * zoom.scale;
        translateY = diffY * zoom.scale;
      }
      if (translateX < translateMinX) {
        translateX = translateMinX;
      }
      if (translateX > translateMaxX) {
        translateX = translateMaxX;
      }
      if (translateY < translateMinY) {
        translateY = translateMinY;
      }
      if (translateY > translateMaxY) {
        translateY = translateMaxY;
      }
    } else {
      translateX = 0;
      translateY = 0;
    }
    if (forceZoomRatio && zoom.scale === 1) {
      gesture.originX = 0;
      gesture.originY = 0;
    }
    image.currentX = translateX;
    image.currentY = translateY;
    gesture.imageWrapEl.style.transitionDuration = "300ms";
    gesture.imageWrapEl.style.transform = `translate3d(${translateX}px, ${translateY}px,0)`;
    gesture.imageEl.style.transitionDuration = "300ms";
    gesture.imageEl.style.transform = `translate3d(0,0,0) scale(${zoom.scale})`;
  }
  function zoomOut() {
    const zoom = swiper.zoom;
    const params = swiper.params.zoom;
    if (!gesture.slideEl) {
      if (swiper.params.virtual && swiper.params.virtual.enabled && swiper.virtual) {
        gesture.slideEl = elementChildren(swiper.slidesEl, `.${swiper.params.slideActiveClass}`)[0];
      } else {
        gesture.slideEl = swiper.slides[swiper.activeIndex];
      }
      let imageEl = gesture.slideEl.querySelector(`.${params.containerClass}`);
      if (imageEl) {
        imageEl = imageEl.querySelectorAll("picture, img, svg, canvas, .swiper-zoom-target")[0];
      }
      gesture.imageEl = imageEl;
      if (imageEl) {
        gesture.imageWrapEl = elementParents(gesture.imageEl, `.${params.containerClass}`)[0];
      } else {
        gesture.imageWrapEl = void 0;
      }
    }
    if (!gesture.imageEl || !gesture.imageWrapEl) return;
    if (swiper.params.cssMode) {
      swiper.wrapperEl.style.overflow = "";
      swiper.wrapperEl.style.touchAction = "";
    }
    zoom.scale = 1;
    currentScale = 1;
    image.currentX = void 0;
    image.currentY = void 0;
    image.touchesStart.x = void 0;
    image.touchesStart.y = void 0;
    gesture.imageWrapEl.style.transitionDuration = "300ms";
    gesture.imageWrapEl.style.transform = "translate3d(0,0,0)";
    gesture.imageEl.style.transitionDuration = "300ms";
    gesture.imageEl.style.transform = "translate3d(0,0,0) scale(1)";
    gesture.slideEl.classList.remove(`${params.zoomedSlideClass}`);
    gesture.slideEl = void 0;
    gesture.originX = 0;
    gesture.originY = 0;
    if (swiper.params.zoom.panOnMouseMove) {
      mousePanStart = {
        x: 0,
        y: 0
      };
      if (isPanningWithMouse) {
        isPanningWithMouse = false;
        image.startX = 0;
        image.startY = 0;
      }
    }
  }
  function zoomToggle(e2) {
    const zoom = swiper.zoom;
    if (zoom.scale && zoom.scale !== 1) {
      zoomOut();
    } else {
      zoomIn(e2);
    }
  }
  function getListeners() {
    const passiveListener = swiper.params.passiveListeners ? {
      passive: true,
      capture: false
    } : false;
    const activeListenerWithCapture = swiper.params.passiveListeners ? {
      passive: false,
      capture: true
    } : true;
    return {
      passiveListener,
      activeListenerWithCapture
    };
  }
  function enable() {
    const zoom = swiper.zoom;
    if (zoom.enabled) return;
    zoom.enabled = true;
    const {
      passiveListener,
      activeListenerWithCapture
    } = getListeners();
    swiper.wrapperEl.addEventListener("pointerdown", onGestureStart, passiveListener);
    swiper.wrapperEl.addEventListener("pointermove", onGestureChange, activeListenerWithCapture);
    ["pointerup", "pointercancel", "pointerout"].forEach((eventName) => {
      swiper.wrapperEl.addEventListener(eventName, onGestureEnd, passiveListener);
    });
    swiper.wrapperEl.addEventListener("pointermove", onTouchMove2, activeListenerWithCapture);
  }
  function disable() {
    const zoom = swiper.zoom;
    if (!zoom.enabled) return;
    zoom.enabled = false;
    const {
      passiveListener,
      activeListenerWithCapture
    } = getListeners();
    swiper.wrapperEl.removeEventListener("pointerdown", onGestureStart, passiveListener);
    swiper.wrapperEl.removeEventListener("pointermove", onGestureChange, activeListenerWithCapture);
    ["pointerup", "pointercancel", "pointerout"].forEach((eventName) => {
      swiper.wrapperEl.removeEventListener(eventName, onGestureEnd, passiveListener);
    });
    swiper.wrapperEl.removeEventListener("pointermove", onTouchMove2, activeListenerWithCapture);
  }
  on("init", () => {
    if (swiper.params.zoom.enabled) {
      enable();
    }
  });
  on("destroy", () => {
    disable();
  });
  on("touchStart", (_s, e2) => {
    if (!swiper.zoom.enabled) return;
    onTouchStart2(e2);
  });
  on("touchEnd", (_s, e2) => {
    if (!swiper.zoom.enabled) return;
    onTouchEnd2();
  });
  on("doubleTap", (_s, e2) => {
    if (!swiper.animating && swiper.params.zoom.enabled && swiper.zoom.enabled && swiper.params.zoom.toggle) {
      zoomToggle(e2);
    }
  });
  on("transitionEnd", () => {
    if (swiper.zoom.enabled && swiper.params.zoom.enabled) {
      onTransitionEnd();
    }
  });
  on("slideChange", () => {
    if (swiper.zoom.enabled && swiper.params.zoom.enabled && swiper.params.cssMode) {
      onTransitionEnd();
    }
  });
  Object.assign(swiper.zoom, {
    enable,
    disable,
    in: zoomIn,
    out: zoomOut,
    toggle: zoomToggle
  });
}
function Controller({
  swiper,
  extendParams,
  on
}) {
  extendParams({
    controller: {
      control: void 0,
      inverse: false,
      by: "slide"
      // or 'container'
    }
  });
  swiper.controller = {
    control: void 0
  };
  function LinearSpline(x2, y2) {
    const binarySearch = /* @__PURE__ */ (function search() {
      let maxIndex;
      let minIndex;
      let guess;
      return (array, val) => {
        minIndex = -1;
        maxIndex = array.length;
        while (maxIndex - minIndex > 1) {
          guess = maxIndex + minIndex >> 1;
          if (array[guess] <= val) {
            minIndex = guess;
          } else {
            maxIndex = guess;
          }
        }
        return maxIndex;
      };
    })();
    this.x = x2;
    this.y = y2;
    this.lastIndex = x2.length - 1;
    let i1;
    let i3;
    this.interpolate = function interpolate(x22) {
      if (!x22) return 0;
      i3 = binarySearch(this.x, x22);
      i1 = i3 - 1;
      return (x22 - this.x[i1]) * (this.y[i3] - this.y[i1]) / (this.x[i3] - this.x[i1]) + this.y[i1];
    };
    return this;
  }
  function getInterpolateFunction(c2) {
    swiper.controller.spline = swiper.params.loop ? new LinearSpline(swiper.slidesGrid, c2.slidesGrid) : new LinearSpline(swiper.snapGrid, c2.snapGrid);
  }
  function setTranslate2(_t, byController) {
    const controlled = swiper.controller.control;
    let multiplier;
    let controlledTranslate;
    const Swiper2 = swiper.constructor;
    function setControlledTranslate(c2) {
      if (c2.destroyed) return;
      const translate2 = swiper.rtlTranslate ? -swiper.translate : swiper.translate;
      if (swiper.params.controller.by === "slide") {
        getInterpolateFunction(c2);
        controlledTranslate = -swiper.controller.spline.interpolate(-translate2);
      }
      if (!controlledTranslate || swiper.params.controller.by === "container") {
        multiplier = (c2.maxTranslate() - c2.minTranslate()) / (swiper.maxTranslate() - swiper.minTranslate());
        if (Number.isNaN(multiplier) || !Number.isFinite(multiplier)) {
          multiplier = 1;
        }
        controlledTranslate = (translate2 - swiper.minTranslate()) * multiplier + c2.minTranslate();
      }
      if (swiper.params.controller.inverse) {
        controlledTranslate = c2.maxTranslate() - controlledTranslate;
      }
      c2.updateProgress(controlledTranslate);
      c2.setTranslate(controlledTranslate, swiper);
      c2.updateActiveIndex();
      c2.updateSlidesClasses();
    }
    if (Array.isArray(controlled)) {
      for (let i2 = 0; i2 < controlled.length; i2 += 1) {
        if (controlled[i2] !== byController && controlled[i2] instanceof Swiper2) {
          setControlledTranslate(controlled[i2]);
        }
      }
    } else if (controlled instanceof Swiper2 && byController !== controlled) {
      setControlledTranslate(controlled);
    }
  }
  function setTransition2(duration, byController) {
    const Swiper2 = swiper.constructor;
    const controlled = swiper.controller.control;
    let i2;
    function setControlledTransition(c2) {
      if (c2.destroyed) return;
      c2.setTransition(duration, swiper);
      if (duration !== 0) {
        c2.transitionStart();
        if (c2.params.autoHeight) {
          nextTick(() => {
            c2.updateAutoHeight();
          });
        }
        elementTransitionEnd(c2.wrapperEl, () => {
          if (!controlled) return;
          c2.transitionEnd();
        });
      }
    }
    if (Array.isArray(controlled)) {
      for (i2 = 0; i2 < controlled.length; i2 += 1) {
        if (controlled[i2] !== byController && controlled[i2] instanceof Swiper2) {
          setControlledTransition(controlled[i2]);
        }
      }
    } else if (controlled instanceof Swiper2 && byController !== controlled) {
      setControlledTransition(controlled);
    }
  }
  function removeSpline() {
    if (!swiper.controller.control) return;
    if (swiper.controller.spline) {
      swiper.controller.spline = void 0;
      delete swiper.controller.spline;
    }
  }
  on("beforeInit", () => {
    if (typeof window !== "undefined" && // eslint-disable-line
    (typeof swiper.params.controller.control === "string" || swiper.params.controller.control instanceof HTMLElement)) {
      const controlElements = typeof swiper.params.controller.control === "string" ? [...document.querySelectorAll(swiper.params.controller.control)] : [swiper.params.controller.control];
      controlElements.forEach((controlElement) => {
        if (!swiper.controller.control) swiper.controller.control = [];
        if (controlElement && controlElement.swiper) {
          swiper.controller.control.push(controlElement.swiper);
        } else if (controlElement) {
          const eventName = `${swiper.params.eventsPrefix}init`;
          const onControllerSwiper = (e2) => {
            swiper.controller.control.push(e2.detail[0]);
            swiper.update();
            controlElement.removeEventListener(eventName, onControllerSwiper);
          };
          controlElement.addEventListener(eventName, onControllerSwiper);
        }
      });
      return;
    }
    swiper.controller.control = swiper.params.controller.control;
  });
  on("update", () => {
    removeSpline();
  });
  on("resize", () => {
    removeSpline();
  });
  on("observerUpdate", () => {
    removeSpline();
  });
  on("setTranslate", (_s, translate2, byController) => {
    if (!swiper.controller.control || swiper.controller.control.destroyed) return;
    swiper.controller.setTranslate(translate2, byController);
  });
  on("setTransition", (_s, duration, byController) => {
    if (!swiper.controller.control || swiper.controller.control.destroyed) return;
    swiper.controller.setTransition(duration, byController);
  });
  Object.assign(swiper.controller, {
    setTranslate: setTranslate2,
    setTransition: setTransition2
  });
}
function A11y({
  swiper,
  extendParams,
  on
}) {
  extendParams({
    a11y: {
      enabled: true,
      notificationClass: "swiper-notification",
      prevSlideMessage: "Previous slide",
      nextSlideMessage: "Next slide",
      firstSlideMessage: "This is the first slide",
      lastSlideMessage: "This is the last slide",
      paginationBulletMessage: "Go to slide {{index}}",
      slideLabelMessage: "{{index}} / {{slidesLength}}",
      containerMessage: null,
      containerRoleDescriptionMessage: null,
      containerRole: null,
      itemRoleDescriptionMessage: null,
      slideRole: "group",
      id: null,
      scrollOnFocus: true,
      wrapperLiveRegion: true
    }
  });
  swiper.a11y = {
    clicked: false
  };
  let liveRegion = null;
  let preventFocusHandler;
  let focusTargetSlideEl;
  let visibilityChangedTimestamp = (/* @__PURE__ */ new Date()).getTime();
  function notify(message) {
    const notification = liveRegion;
    if (notification.length === 0) return;
    setInnerHTML(notification, message);
  }
  function getRandomNumber(size = 16) {
    const randomChar = () => Math.round(16 * Math.random()).toString(16);
    return "x".repeat(size).replace(/x/g, randomChar);
  }
  function makeElFocusable(el) {
    el = makeElementsArray(el);
    el.forEach((subEl) => {
      subEl.setAttribute("tabIndex", "0");
    });
  }
  function makeElNotFocusable(el) {
    el = makeElementsArray(el);
    el.forEach((subEl) => {
      subEl.setAttribute("tabIndex", "-1");
    });
  }
  function addElRole(el, role) {
    el = makeElementsArray(el);
    el.forEach((subEl) => {
      subEl.setAttribute("role", role);
    });
  }
  function addElRoleDescription(el, description) {
    el = makeElementsArray(el);
    el.forEach((subEl) => {
      subEl.setAttribute("aria-roledescription", description);
    });
  }
  function addElControls(el, controls) {
    el = makeElementsArray(el);
    el.forEach((subEl) => {
      subEl.setAttribute("aria-controls", controls);
    });
  }
  function addElLabel(el, label) {
    el = makeElementsArray(el);
    el.forEach((subEl) => {
      subEl.setAttribute("aria-label", label);
    });
  }
  function addElId(el, id) {
    el = makeElementsArray(el);
    el.forEach((subEl) => {
      subEl.setAttribute("id", id);
    });
  }
  function addElLive(el, live) {
    el = makeElementsArray(el);
    el.forEach((subEl) => {
      subEl.setAttribute("aria-live", live);
    });
  }
  function disableEl(el) {
    el = makeElementsArray(el);
    el.forEach((subEl) => {
      subEl.setAttribute("aria-disabled", true);
    });
  }
  function enableEl(el) {
    el = makeElementsArray(el);
    el.forEach((subEl) => {
      subEl.setAttribute("aria-disabled", false);
    });
  }
  function onEnterOrSpaceKey(e2) {
    if (e2.keyCode !== 13 && e2.keyCode !== 32) return;
    const params = swiper.params.a11y;
    const targetEl = e2.target;
    if (swiper.pagination && swiper.pagination.el && (targetEl === swiper.pagination.el || swiper.pagination.el.contains(e2.target))) {
      if (!e2.target.matches(classesToSelector(swiper.params.pagination.bulletClass))) return;
    }
    if (swiper.navigation && swiper.navigation.prevEl && swiper.navigation.nextEl) {
      const prevEls = makeElementsArray(swiper.navigation.prevEl);
      const nextEls = makeElementsArray(swiper.navigation.nextEl);
      if (nextEls.includes(targetEl)) {
        if (!(swiper.isEnd && !swiper.params.loop)) {
          swiper.slideNext();
        }
        if (swiper.isEnd) {
          notify(params.lastSlideMessage);
        } else {
          notify(params.nextSlideMessage);
        }
      }
      if (prevEls.includes(targetEl)) {
        if (!(swiper.isBeginning && !swiper.params.loop)) {
          swiper.slidePrev();
        }
        if (swiper.isBeginning) {
          notify(params.firstSlideMessage);
        } else {
          notify(params.prevSlideMessage);
        }
      }
    }
    if (swiper.pagination && targetEl.matches(classesToSelector(swiper.params.pagination.bulletClass))) {
      targetEl.click();
    }
  }
  function updateNavigation() {
    if (swiper.params.loop || swiper.params.rewind || !swiper.navigation) return;
    const {
      nextEl,
      prevEl
    } = swiper.navigation;
    if (prevEl) {
      if (swiper.isBeginning) {
        disableEl(prevEl);
        makeElNotFocusable(prevEl);
      } else {
        enableEl(prevEl);
        makeElFocusable(prevEl);
      }
    }
    if (nextEl) {
      if (swiper.isEnd) {
        disableEl(nextEl);
        makeElNotFocusable(nextEl);
      } else {
        enableEl(nextEl);
        makeElFocusable(nextEl);
      }
    }
  }
  function hasPagination() {
    return swiper.pagination && swiper.pagination.bullets && swiper.pagination.bullets.length;
  }
  function hasClickablePagination() {
    return hasPagination() && swiper.params.pagination.clickable;
  }
  function updatePagination() {
    const params = swiper.params.a11y;
    if (!hasPagination()) return;
    swiper.pagination.bullets.forEach((bulletEl) => {
      if (swiper.params.pagination.clickable) {
        makeElFocusable(bulletEl);
        if (!swiper.params.pagination.renderBullet) {
          addElRole(bulletEl, "button");
          addElLabel(bulletEl, params.paginationBulletMessage.replace(/\{\{index\}\}/, elementIndex(bulletEl) + 1));
        }
      }
      if (bulletEl.matches(classesToSelector(swiper.params.pagination.bulletActiveClass))) {
        bulletEl.setAttribute("aria-current", "true");
      } else {
        bulletEl.removeAttribute("aria-current");
      }
    });
  }
  const initNavEl = (el, wrapperId, message) => {
    makeElFocusable(el);
    if (el.tagName !== "BUTTON") {
      addElRole(el, "button");
      el.addEventListener("keydown", onEnterOrSpaceKey);
    }
    addElLabel(el, message);
    addElControls(el, wrapperId);
  };
  const handlePointerDown = (e2) => {
    if (focusTargetSlideEl && focusTargetSlideEl !== e2.target && !focusTargetSlideEl.contains(e2.target)) {
      preventFocusHandler = true;
    }
    swiper.a11y.clicked = true;
  };
  const handlePointerUp = () => {
    preventFocusHandler = false;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (!swiper.destroyed) {
          swiper.a11y.clicked = false;
        }
      });
    });
  };
  const onVisibilityChange = (e2) => {
    visibilityChangedTimestamp = (/* @__PURE__ */ new Date()).getTime();
  };
  const handleFocus = (e2) => {
    if (swiper.a11y.clicked || !swiper.params.a11y.scrollOnFocus) return;
    if ((/* @__PURE__ */ new Date()).getTime() - visibilityChangedTimestamp < 100) return;
    const slideEl = e2.target.closest(`.${swiper.params.slideClass}, swiper-slide`);
    if (!slideEl || !swiper.slides.includes(slideEl)) return;
    focusTargetSlideEl = slideEl;
    const isActive = swiper.slides.indexOf(slideEl) === swiper.activeIndex;
    const isVisible = swiper.params.watchSlidesProgress && swiper.visibleSlides && swiper.visibleSlides.includes(slideEl);
    if (isActive || isVisible) return;
    if (e2.sourceCapabilities && e2.sourceCapabilities.firesTouchEvents) return;
    if (swiper.isHorizontal()) {
      swiper.el.scrollLeft = 0;
    } else {
      swiper.el.scrollTop = 0;
    }
    requestAnimationFrame(() => {
      if (preventFocusHandler) return;
      if (swiper.params.loop) {
        swiper.slideToLoop(swiper.getSlideIndexWhenGrid(parseInt(slideEl.getAttribute("data-swiper-slide-index"))), 0);
      } else {
        swiper.slideTo(swiper.getSlideIndexWhenGrid(swiper.slides.indexOf(slideEl)), 0);
      }
      preventFocusHandler = false;
    });
  };
  const initSlides = () => {
    const params = swiper.params.a11y;
    if (params.itemRoleDescriptionMessage) {
      addElRoleDescription(swiper.slides, params.itemRoleDescriptionMessage);
    }
    if (params.slideRole) {
      addElRole(swiper.slides, params.slideRole);
    }
    const slidesLength = swiper.slides.length;
    if (params.slideLabelMessage) {
      swiper.slides.forEach((slideEl, index) => {
        const slideIndex = swiper.params.loop ? parseInt(slideEl.getAttribute("data-swiper-slide-index"), 10) : index;
        const ariaLabelMessage = params.slideLabelMessage.replace(/\{\{index\}\}/, slideIndex + 1).replace(/\{\{slidesLength\}\}/, slidesLength);
        addElLabel(slideEl, ariaLabelMessage);
      });
    }
  };
  const init = () => {
    const params = swiper.params.a11y;
    swiper.el.append(liveRegion);
    const containerEl = swiper.el;
    if (params.containerRoleDescriptionMessage) {
      addElRoleDescription(containerEl, params.containerRoleDescriptionMessage);
    }
    if (params.containerMessage) {
      addElLabel(containerEl, params.containerMessage);
    }
    if (params.containerRole) {
      addElRole(containerEl, params.containerRole);
    }
    const wrapperEl = swiper.wrapperEl;
    const wrapperId = params.id || wrapperEl.getAttribute("id") || `swiper-wrapper-${getRandomNumber(16)}`;
    addElId(wrapperEl, wrapperId);
    if (params.wrapperLiveRegion) {
      const live = swiper.params.autoplay && swiper.params.autoplay.enabled ? "off" : "polite";
      addElLive(wrapperEl, live);
    }
    initSlides();
    let {
      nextEl,
      prevEl
    } = swiper.navigation ? swiper.navigation : {};
    nextEl = makeElementsArray(nextEl);
    prevEl = makeElementsArray(prevEl);
    if (nextEl) {
      nextEl.forEach((el) => initNavEl(el, wrapperId, params.nextSlideMessage));
    }
    if (prevEl) {
      prevEl.forEach((el) => initNavEl(el, wrapperId, params.prevSlideMessage));
    }
    if (hasClickablePagination()) {
      const paginationEl = makeElementsArray(swiper.pagination.el);
      paginationEl.forEach((el) => {
        el.addEventListener("keydown", onEnterOrSpaceKey);
      });
    }
    const document2 = getDocument();
    document2.addEventListener("visibilitychange", onVisibilityChange);
    swiper.el.addEventListener("focus", handleFocus, true);
    swiper.el.addEventListener("focus", handleFocus, true);
    swiper.el.addEventListener("pointerdown", handlePointerDown, true);
    swiper.el.addEventListener("pointerup", handlePointerUp, true);
  };
  function destroy() {
    if (liveRegion) liveRegion.remove();
    let {
      nextEl,
      prevEl
    } = swiper.navigation ? swiper.navigation : {};
    nextEl = makeElementsArray(nextEl);
    prevEl = makeElementsArray(prevEl);
    if (nextEl) {
      nextEl.forEach((el) => el.removeEventListener("keydown", onEnterOrSpaceKey));
    }
    if (prevEl) {
      prevEl.forEach((el) => el.removeEventListener("keydown", onEnterOrSpaceKey));
    }
    if (hasClickablePagination()) {
      const paginationEl = makeElementsArray(swiper.pagination.el);
      paginationEl.forEach((el) => {
        el.removeEventListener("keydown", onEnterOrSpaceKey);
      });
    }
    const document2 = getDocument();
    document2.removeEventListener("visibilitychange", onVisibilityChange);
    if (swiper.el && typeof swiper.el !== "string") {
      swiper.el.removeEventListener("focus", handleFocus, true);
      swiper.el.removeEventListener("pointerdown", handlePointerDown, true);
      swiper.el.removeEventListener("pointerup", handlePointerUp, true);
    }
  }
  on("beforeInit", () => {
    liveRegion = createElement("span", swiper.params.a11y.notificationClass);
    liveRegion.setAttribute("aria-live", "assertive");
    liveRegion.setAttribute("aria-atomic", "true");
  });
  on("afterInit", () => {
    if (!swiper.params.a11y.enabled) return;
    init();
  });
  on("slidesLengthChange snapGridLengthChange slidesGridLengthChange", () => {
    if (!swiper.params.a11y.enabled) return;
    initSlides();
  });
  on("fromEdge toEdge afterInit lock unlock", () => {
    if (!swiper.params.a11y.enabled) return;
    updateNavigation();
  });
  on("paginationUpdate", () => {
    if (!swiper.params.a11y.enabled) return;
    updatePagination();
  });
  on("destroy", () => {
    if (!swiper.params.a11y.enabled) return;
    destroy();
  });
}
function History({
  swiper,
  extendParams,
  on
}) {
  extendParams({
    history: {
      enabled: false,
      root: "",
      replaceState: false,
      key: "slides",
      keepQuery: false
    }
  });
  let initialized = false;
  let paths = {};
  const slugify = (text) => {
    return text.toString().replace(/\s+/g, "-").replace(/[^\w-]+/g, "").replace(/--+/g, "-").replace(/^-+/, "").replace(/-+$/, "");
  };
  const getPathValues = (urlOverride) => {
    const window2 = getWindow();
    let location2;
    if (urlOverride) {
      location2 = new URL(urlOverride);
    } else {
      location2 = window2.location;
    }
    const pathArray = location2.pathname.slice(1).split("/").filter((part) => part !== "");
    const total = pathArray.length;
    const key = pathArray[total - 2];
    const value = pathArray[total - 1];
    return {
      key,
      value
    };
  };
  const setHistory = (key, index) => {
    const window2 = getWindow();
    if (!initialized || !swiper.params.history.enabled) return;
    let location2;
    if (swiper.params.url) {
      location2 = new URL(swiper.params.url);
    } else {
      location2 = window2.location;
    }
    const slide2 = swiper.virtual && swiper.params.virtual.enabled ? swiper.slidesEl.querySelector(`[data-swiper-slide-index="${index}"]`) : swiper.slides[index];
    let value = slugify(slide2.getAttribute("data-history"));
    if (swiper.params.history.root.length > 0) {
      let root = swiper.params.history.root;
      if (root[root.length - 1] === "/") root = root.slice(0, root.length - 1);
      value = `${root}/${key ? `${key}/` : ""}${value}`;
    } else if (!location2.pathname.includes(key)) {
      value = `${key ? `${key}/` : ""}${value}`;
    }
    if (swiper.params.history.keepQuery) {
      value += location2.search;
    }
    const currentState = window2.history.state;
    if (currentState && currentState.value === value) {
      return;
    }
    if (swiper.params.history.replaceState) {
      window2.history.replaceState({
        value
      }, null, value);
    } else {
      window2.history.pushState({
        value
      }, null, value);
    }
  };
  const scrollToSlide = (speed, value, runCallbacks) => {
    if (value) {
      for (let i2 = 0, length = swiper.slides.length; i2 < length; i2 += 1) {
        const slide2 = swiper.slides[i2];
        const slideHistory = slugify(slide2.getAttribute("data-history"));
        if (slideHistory === value) {
          const index = swiper.getSlideIndex(slide2);
          swiper.slideTo(index, speed, runCallbacks);
        }
      }
    } else {
      swiper.slideTo(0, speed, runCallbacks);
    }
  };
  const setHistoryPopState = () => {
    paths = getPathValues(swiper.params.url);
    scrollToSlide(swiper.params.speed, paths.value, false);
  };
  const init = () => {
    const window2 = getWindow();
    if (!swiper.params.history) return;
    if (!window2.history || !window2.history.pushState) {
      swiper.params.history.enabled = false;
      swiper.params.hashNavigation.enabled = true;
      return;
    }
    initialized = true;
    paths = getPathValues(swiper.params.url);
    if (!paths.key && !paths.value) {
      if (!swiper.params.history.replaceState) {
        window2.addEventListener("popstate", setHistoryPopState);
      }
      return;
    }
    scrollToSlide(0, paths.value, swiper.params.runCallbacksOnInit);
    if (!swiper.params.history.replaceState) {
      window2.addEventListener("popstate", setHistoryPopState);
    }
  };
  const destroy = () => {
    const window2 = getWindow();
    if (!swiper.params.history.replaceState) {
      window2.removeEventListener("popstate", setHistoryPopState);
    }
  };
  on("init", () => {
    if (swiper.params.history.enabled) {
      init();
    }
  });
  on("destroy", () => {
    if (swiper.params.history.enabled) {
      destroy();
    }
  });
  on("transitionEnd _freeModeNoMomentumRelease", () => {
    if (initialized) {
      setHistory(swiper.params.history.key, swiper.activeIndex);
    }
  });
  on("slideChange", () => {
    if (initialized && swiper.params.cssMode) {
      setHistory(swiper.params.history.key, swiper.activeIndex);
    }
  });
}
function HashNavigation({
  swiper,
  extendParams,
  emit,
  on
}) {
  let initialized = false;
  const document2 = getDocument();
  const window2 = getWindow();
  extendParams({
    hashNavigation: {
      enabled: false,
      replaceState: false,
      watchState: false,
      getSlideIndex(_s, hash) {
        if (swiper.virtual && swiper.params.virtual.enabled) {
          const slideWithHash = swiper.slides.find((slideEl) => slideEl.getAttribute("data-hash") === hash);
          if (!slideWithHash) return 0;
          const index = parseInt(slideWithHash.getAttribute("data-swiper-slide-index"), 10);
          return index;
        }
        return swiper.getSlideIndex(elementChildren(swiper.slidesEl, `.${swiper.params.slideClass}[data-hash="${hash}"], swiper-slide[data-hash="${hash}"]`)[0]);
      }
    }
  });
  const onHashChange = () => {
    emit("hashChange");
    const newHash = document2.location.hash.replace("#", "");
    const activeSlideEl = swiper.virtual && swiper.params.virtual.enabled ? swiper.slidesEl.querySelector(`[data-swiper-slide-index="${swiper.activeIndex}"]`) : swiper.slides[swiper.activeIndex];
    const activeSlideHash = activeSlideEl ? activeSlideEl.getAttribute("data-hash") : "";
    if (newHash !== activeSlideHash) {
      const newIndex = swiper.params.hashNavigation.getSlideIndex(swiper, newHash);
      if (typeof newIndex === "undefined" || Number.isNaN(newIndex)) return;
      swiper.slideTo(newIndex);
    }
  };
  const setHash = () => {
    if (!initialized || !swiper.params.hashNavigation.enabled) return;
    const activeSlideEl = swiper.virtual && swiper.params.virtual.enabled ? swiper.slidesEl.querySelector(`[data-swiper-slide-index="${swiper.activeIndex}"]`) : swiper.slides[swiper.activeIndex];
    const activeSlideHash = activeSlideEl ? activeSlideEl.getAttribute("data-hash") || activeSlideEl.getAttribute("data-history") : "";
    if (swiper.params.hashNavigation.replaceState && window2.history && window2.history.replaceState) {
      window2.history.replaceState(null, null, `#${activeSlideHash}` || "");
      emit("hashSet");
    } else {
      document2.location.hash = activeSlideHash || "";
      emit("hashSet");
    }
  };
  const init = () => {
    if (!swiper.params.hashNavigation.enabled || swiper.params.history && swiper.params.history.enabled) return;
    initialized = true;
    const hash = document2.location.hash.replace("#", "");
    if (hash) {
      const speed = 0;
      const index = swiper.params.hashNavigation.getSlideIndex(swiper, hash);
      swiper.slideTo(index || 0, speed, swiper.params.runCallbacksOnInit, true);
    }
    if (swiper.params.hashNavigation.watchState) {
      window2.addEventListener("hashchange", onHashChange);
    }
  };
  const destroy = () => {
    if (swiper.params.hashNavigation.watchState) {
      window2.removeEventListener("hashchange", onHashChange);
    }
  };
  on("init", () => {
    if (swiper.params.hashNavigation.enabled) {
      init();
    }
  });
  on("destroy", () => {
    if (swiper.params.hashNavigation.enabled) {
      destroy();
    }
  });
  on("transitionEnd _freeModeNoMomentumRelease", () => {
    if (initialized) {
      setHash();
    }
  });
  on("slideChange", () => {
    if (initialized && swiper.params.cssMode) {
      setHash();
    }
  });
}
function Autoplay({
  swiper,
  extendParams,
  on,
  emit,
  params
}) {
  swiper.autoplay = {
    running: false,
    paused: false,
    timeLeft: 0
  };
  extendParams({
    autoplay: {
      enabled: false,
      delay: 3e3,
      waitForTransition: true,
      disableOnInteraction: false,
      stopOnLastSlide: false,
      reverseDirection: false,
      pauseOnMouseEnter: false
    }
  });
  let timeout;
  let raf;
  let autoplayDelayTotal = params && params.autoplay ? params.autoplay.delay : 3e3;
  let autoplayDelayCurrent = params && params.autoplay ? params.autoplay.delay : 3e3;
  let autoplayTimeLeft;
  let autoplayStartTime = (/* @__PURE__ */ new Date()).getTime();
  let wasPaused;
  let isTouched;
  let pausedByTouch;
  let touchStartTimeout;
  let slideChanged;
  let pausedByInteraction;
  let pausedByPointerEnter;
  function onTransitionEnd(e2) {
    if (!swiper || swiper.destroyed || !swiper.wrapperEl) return;
    if (e2.target !== swiper.wrapperEl) return;
    swiper.wrapperEl.removeEventListener("transitionend", onTransitionEnd);
    if (pausedByPointerEnter || e2.detail && e2.detail.bySwiperTouchMove) {
      return;
    }
    resume();
  }
  const calcTimeLeft = () => {
    if (swiper.destroyed || !swiper.autoplay.running) return;
    if (swiper.autoplay.paused) {
      wasPaused = true;
    } else if (wasPaused) {
      autoplayDelayCurrent = autoplayTimeLeft;
      wasPaused = false;
    }
    const timeLeft = swiper.autoplay.paused ? autoplayTimeLeft : autoplayStartTime + autoplayDelayCurrent - (/* @__PURE__ */ new Date()).getTime();
    swiper.autoplay.timeLeft = timeLeft;
    emit("autoplayTimeLeft", timeLeft, timeLeft / autoplayDelayTotal);
    raf = requestAnimationFrame(() => {
      calcTimeLeft();
    });
  };
  const getSlideDelay = () => {
    let activeSlideEl;
    if (swiper.virtual && swiper.params.virtual.enabled) {
      activeSlideEl = swiper.slides.find((slideEl) => slideEl.classList.contains("swiper-slide-active"));
    } else {
      activeSlideEl = swiper.slides[swiper.activeIndex];
    }
    if (!activeSlideEl) return void 0;
    const currentSlideDelay = parseInt(activeSlideEl.getAttribute("data-swiper-autoplay"), 10);
    return currentSlideDelay;
  };
  const run = (delayForce) => {
    if (swiper.destroyed || !swiper.autoplay.running) return;
    cancelAnimationFrame(raf);
    calcTimeLeft();
    let delay = typeof delayForce === "undefined" ? swiper.params.autoplay.delay : delayForce;
    autoplayDelayTotal = swiper.params.autoplay.delay;
    autoplayDelayCurrent = swiper.params.autoplay.delay;
    const currentSlideDelay = getSlideDelay();
    if (!Number.isNaN(currentSlideDelay) && currentSlideDelay > 0 && typeof delayForce === "undefined") {
      delay = currentSlideDelay;
      autoplayDelayTotal = currentSlideDelay;
      autoplayDelayCurrent = currentSlideDelay;
    }
    autoplayTimeLeft = delay;
    const speed = swiper.params.speed;
    const proceed = () => {
      if (!swiper || swiper.destroyed) return;
      if (swiper.params.autoplay.reverseDirection) {
        if (!swiper.isBeginning || swiper.params.loop || swiper.params.rewind) {
          swiper.slidePrev(speed, true, true);
          emit("autoplay");
        } else if (!swiper.params.autoplay.stopOnLastSlide) {
          swiper.slideTo(swiper.slides.length - 1, speed, true, true);
          emit("autoplay");
        }
      } else {
        if (!swiper.isEnd || swiper.params.loop || swiper.params.rewind) {
          swiper.slideNext(speed, true, true);
          emit("autoplay");
        } else if (!swiper.params.autoplay.stopOnLastSlide) {
          swiper.slideTo(0, speed, true, true);
          emit("autoplay");
        }
      }
      if (swiper.params.cssMode) {
        autoplayStartTime = (/* @__PURE__ */ new Date()).getTime();
        requestAnimationFrame(() => {
          run();
        });
      }
    };
    if (delay > 0) {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        proceed();
      }, delay);
    } else {
      requestAnimationFrame(() => {
        proceed();
      });
    }
    return delay;
  };
  const start = () => {
    autoplayStartTime = (/* @__PURE__ */ new Date()).getTime();
    swiper.autoplay.running = true;
    run();
    emit("autoplayStart");
  };
  const stop = () => {
    swiper.autoplay.running = false;
    clearTimeout(timeout);
    cancelAnimationFrame(raf);
    emit("autoplayStop");
  };
  const pause = (internal, reset) => {
    if (swiper.destroyed || !swiper.autoplay.running) return;
    clearTimeout(timeout);
    if (!internal) {
      pausedByInteraction = true;
    }
    const proceed = () => {
      emit("autoplayPause");
      if (swiper.params.autoplay.waitForTransition) {
        swiper.wrapperEl.addEventListener("transitionend", onTransitionEnd);
      } else {
        resume();
      }
    };
    swiper.autoplay.paused = true;
    if (reset) {
      if (slideChanged) {
        autoplayTimeLeft = swiper.params.autoplay.delay;
      }
      slideChanged = false;
      proceed();
      return;
    }
    const delay = autoplayTimeLeft || swiper.params.autoplay.delay;
    autoplayTimeLeft = delay - ((/* @__PURE__ */ new Date()).getTime() - autoplayStartTime);
    if (swiper.isEnd && autoplayTimeLeft < 0 && !swiper.params.loop) return;
    if (autoplayTimeLeft < 0) autoplayTimeLeft = 0;
    proceed();
  };
  const resume = () => {
    if (swiper.isEnd && autoplayTimeLeft < 0 && !swiper.params.loop || swiper.destroyed || !swiper.autoplay.running) return;
    autoplayStartTime = (/* @__PURE__ */ new Date()).getTime();
    if (pausedByInteraction) {
      pausedByInteraction = false;
      run(autoplayTimeLeft);
    } else {
      run();
    }
    swiper.autoplay.paused = false;
    emit("autoplayResume");
  };
  const onVisibilityChange = () => {
    if (swiper.destroyed || !swiper.autoplay.running) return;
    const document2 = getDocument();
    if (document2.visibilityState === "hidden") {
      pausedByInteraction = true;
      pause(true);
    }
    if (document2.visibilityState === "visible") {
      resume();
    }
  };
  const onPointerEnter = (e2) => {
    if (e2.pointerType !== "mouse") return;
    pausedByInteraction = true;
    pausedByPointerEnter = true;
    if (swiper.animating || swiper.autoplay.paused) return;
    pause(true);
  };
  const onPointerLeave = (e2) => {
    if (e2.pointerType !== "mouse") return;
    pausedByPointerEnter = false;
    if (swiper.autoplay.paused) {
      resume();
    }
  };
  const attachMouseEvents = () => {
    if (swiper.params.autoplay.pauseOnMouseEnter) {
      swiper.el.addEventListener("pointerenter", onPointerEnter);
      swiper.el.addEventListener("pointerleave", onPointerLeave);
    }
  };
  const detachMouseEvents = () => {
    if (swiper.el && typeof swiper.el !== "string") {
      swiper.el.removeEventListener("pointerenter", onPointerEnter);
      swiper.el.removeEventListener("pointerleave", onPointerLeave);
    }
  };
  const attachDocumentEvents = () => {
    const document2 = getDocument();
    document2.addEventListener("visibilitychange", onVisibilityChange);
  };
  const detachDocumentEvents = () => {
    const document2 = getDocument();
    document2.removeEventListener("visibilitychange", onVisibilityChange);
  };
  on("init", () => {
    if (swiper.params.autoplay.enabled) {
      attachMouseEvents();
      attachDocumentEvents();
      start();
    }
  });
  on("destroy", () => {
    detachMouseEvents();
    detachDocumentEvents();
    if (swiper.autoplay.running) {
      stop();
    }
  });
  on("_freeModeStaticRelease", () => {
    if (pausedByTouch || pausedByInteraction) {
      resume();
    }
  });
  on("_freeModeNoMomentumRelease", () => {
    if (!swiper.params.autoplay.disableOnInteraction) {
      pause(true, true);
    } else {
      stop();
    }
  });
  on("beforeTransitionStart", (_s, speed, internal) => {
    if (swiper.destroyed || !swiper.autoplay.running) return;
    if (internal || !swiper.params.autoplay.disableOnInteraction) {
      pause(true, true);
    } else {
      stop();
    }
  });
  on("sliderFirstMove", () => {
    if (swiper.destroyed || !swiper.autoplay.running) return;
    if (swiper.params.autoplay.disableOnInteraction) {
      stop();
      return;
    }
    isTouched = true;
    pausedByTouch = false;
    pausedByInteraction = false;
    touchStartTimeout = setTimeout(() => {
      pausedByInteraction = true;
      pausedByTouch = true;
      pause(true);
    }, 200);
  });
  on("touchEnd", () => {
    if (swiper.destroyed || !swiper.autoplay.running || !isTouched) return;
    clearTimeout(touchStartTimeout);
    clearTimeout(timeout);
    if (swiper.params.autoplay.disableOnInteraction) {
      pausedByTouch = false;
      isTouched = false;
      return;
    }
    if (pausedByTouch && swiper.params.cssMode) resume();
    pausedByTouch = false;
    isTouched = false;
  });
  on("slideChange", () => {
    if (swiper.destroyed || !swiper.autoplay.running) return;
    slideChanged = true;
  });
  Object.assign(swiper.autoplay, {
    start,
    stop,
    pause,
    resume
  });
}
function Thumb({
  swiper,
  extendParams,
  on
}) {
  extendParams({
    thumbs: {
      swiper: null,
      multipleActiveThumbs: true,
      autoScrollOffset: 0,
      slideThumbActiveClass: "swiper-slide-thumb-active",
      thumbsContainerClass: "swiper-thumbs"
    }
  });
  let initialized = false;
  let swiperCreated = false;
  swiper.thumbs = {
    swiper: null
  };
  function onThumbClick() {
    const thumbsSwiper = swiper.thumbs.swiper;
    if (!thumbsSwiper || thumbsSwiper.destroyed) return;
    const clickedIndex = thumbsSwiper.clickedIndex;
    const clickedSlide = thumbsSwiper.clickedSlide;
    if (clickedSlide && clickedSlide.classList.contains(swiper.params.thumbs.slideThumbActiveClass)) return;
    if (typeof clickedIndex === "undefined" || clickedIndex === null) return;
    let slideToIndex;
    if (thumbsSwiper.params.loop) {
      slideToIndex = parseInt(thumbsSwiper.clickedSlide.getAttribute("data-swiper-slide-index"), 10);
    } else {
      slideToIndex = clickedIndex;
    }
    if (swiper.params.loop) {
      swiper.slideToLoop(slideToIndex);
    } else {
      swiper.slideTo(slideToIndex);
    }
  }
  function init() {
    const {
      thumbs: thumbsParams
    } = swiper.params;
    if (initialized) return false;
    initialized = true;
    const SwiperClass = swiper.constructor;
    if (thumbsParams.swiper instanceof SwiperClass) {
      if (thumbsParams.swiper.destroyed) {
        initialized = false;
        return false;
      }
      swiper.thumbs.swiper = thumbsParams.swiper;
      Object.assign(swiper.thumbs.swiper.originalParams, {
        watchSlidesProgress: true,
        slideToClickedSlide: false
      });
      Object.assign(swiper.thumbs.swiper.params, {
        watchSlidesProgress: true,
        slideToClickedSlide: false
      });
      swiper.thumbs.swiper.update();
    } else if (isObject$1(thumbsParams.swiper)) {
      const thumbsSwiperParams = Object.assign({}, thumbsParams.swiper);
      Object.assign(thumbsSwiperParams, {
        watchSlidesProgress: true,
        slideToClickedSlide: false
      });
      swiper.thumbs.swiper = new SwiperClass(thumbsSwiperParams);
      swiperCreated = true;
    }
    swiper.thumbs.swiper.el.classList.add(swiper.params.thumbs.thumbsContainerClass);
    swiper.thumbs.swiper.on("tap", onThumbClick);
    return true;
  }
  function update2(initial) {
    const thumbsSwiper = swiper.thumbs.swiper;
    if (!thumbsSwiper || thumbsSwiper.destroyed) return;
    const slidesPerView = thumbsSwiper.params.slidesPerView === "auto" ? thumbsSwiper.slidesPerViewDynamic() : thumbsSwiper.params.slidesPerView;
    let thumbsToActivate = 1;
    const thumbActiveClass = swiper.params.thumbs.slideThumbActiveClass;
    if (swiper.params.slidesPerView > 1 && !swiper.params.centeredSlides) {
      thumbsToActivate = swiper.params.slidesPerView;
    }
    if (!swiper.params.thumbs.multipleActiveThumbs) {
      thumbsToActivate = 1;
    }
    thumbsToActivate = Math.floor(thumbsToActivate);
    thumbsSwiper.slides.forEach((slideEl) => slideEl.classList.remove(thumbActiveClass));
    if (thumbsSwiper.params.loop || thumbsSwiper.params.virtual && thumbsSwiper.params.virtual.enabled) {
      for (let i2 = 0; i2 < thumbsToActivate; i2 += 1) {
        elementChildren(thumbsSwiper.slidesEl, `[data-swiper-slide-index="${swiper.realIndex + i2}"]`).forEach((slideEl) => {
          slideEl.classList.add(thumbActiveClass);
        });
      }
    } else {
      for (let i2 = 0; i2 < thumbsToActivate; i2 += 1) {
        if (thumbsSwiper.slides[swiper.realIndex + i2]) {
          thumbsSwiper.slides[swiper.realIndex + i2].classList.add(thumbActiveClass);
        }
      }
    }
    const autoScrollOffset = swiper.params.thumbs.autoScrollOffset;
    const useOffset = autoScrollOffset && !thumbsSwiper.params.loop;
    if (swiper.realIndex !== thumbsSwiper.realIndex || useOffset) {
      const currentThumbsIndex = thumbsSwiper.activeIndex;
      let newThumbsIndex;
      let direction;
      if (thumbsSwiper.params.loop) {
        const newThumbsSlide = thumbsSwiper.slides.find((slideEl) => slideEl.getAttribute("data-swiper-slide-index") === `${swiper.realIndex}`);
        newThumbsIndex = thumbsSwiper.slides.indexOf(newThumbsSlide);
        direction = swiper.activeIndex > swiper.previousIndex ? "next" : "prev";
      } else {
        newThumbsIndex = swiper.realIndex;
        direction = newThumbsIndex > swiper.previousIndex ? "next" : "prev";
      }
      if (useOffset) {
        newThumbsIndex += direction === "next" ? autoScrollOffset : -1 * autoScrollOffset;
      }
      if (thumbsSwiper.visibleSlidesIndexes && thumbsSwiper.visibleSlidesIndexes.indexOf(newThumbsIndex) < 0) {
        if (thumbsSwiper.params.centeredSlides) {
          if (newThumbsIndex > currentThumbsIndex) {
            newThumbsIndex = newThumbsIndex - Math.floor(slidesPerView / 2) + 1;
          } else {
            newThumbsIndex = newThumbsIndex + Math.floor(slidesPerView / 2) - 1;
          }
        } else if (newThumbsIndex > currentThumbsIndex && thumbsSwiper.params.slidesPerGroup === 1) ;
        thumbsSwiper.slideTo(newThumbsIndex, initial ? 0 : void 0);
      }
    }
  }
  on("beforeInit", () => {
    const {
      thumbs
    } = swiper.params;
    if (!thumbs || !thumbs.swiper) return;
    if (typeof thumbs.swiper === "string" || thumbs.swiper instanceof HTMLElement) {
      const document2 = getDocument();
      const getThumbsElementAndInit = () => {
        const thumbsElement = typeof thumbs.swiper === "string" ? document2.querySelector(thumbs.swiper) : thumbs.swiper;
        if (thumbsElement && thumbsElement.swiper) {
          thumbs.swiper = thumbsElement.swiper;
          init();
          update2(true);
        } else if (thumbsElement) {
          const eventName = `${swiper.params.eventsPrefix}init`;
          const onThumbsSwiper = (e2) => {
            thumbs.swiper = e2.detail[0];
            thumbsElement.removeEventListener(eventName, onThumbsSwiper);
            init();
            update2(true);
            thumbs.swiper.update();
            swiper.update();
          };
          thumbsElement.addEventListener(eventName, onThumbsSwiper);
        }
        return thumbsElement;
      };
      const watchForThumbsToAppear = () => {
        if (swiper.destroyed) return;
        const thumbsElement = getThumbsElementAndInit();
        if (!thumbsElement) {
          requestAnimationFrame(watchForThumbsToAppear);
        }
      };
      requestAnimationFrame(watchForThumbsToAppear);
    } else {
      init();
      update2(true);
    }
  });
  on("slideChange update resize observerUpdate", () => {
    update2();
  });
  on("setTransition", (_s, duration) => {
    const thumbsSwiper = swiper.thumbs.swiper;
    if (!thumbsSwiper || thumbsSwiper.destroyed) return;
    thumbsSwiper.setTransition(duration);
  });
  on("beforeDestroy", () => {
    const thumbsSwiper = swiper.thumbs.swiper;
    if (!thumbsSwiper || thumbsSwiper.destroyed) return;
    if (swiperCreated) {
      thumbsSwiper.destroy();
    }
  });
  Object.assign(swiper.thumbs, {
    init,
    update: update2
  });
}
function freeMode({
  swiper,
  extendParams,
  emit,
  once
}) {
  extendParams({
    freeMode: {
      enabled: false,
      momentum: true,
      momentumRatio: 1,
      momentumBounce: true,
      momentumBounceRatio: 1,
      momentumVelocityRatio: 1,
      sticky: false,
      minimumVelocity: 0.02
    }
  });
  function onTouchStart2() {
    if (swiper.params.cssMode) return;
    const translate2 = swiper.getTranslate();
    swiper.setTranslate(translate2);
    swiper.setTransition(0);
    swiper.touchEventsData.velocities.length = 0;
    swiper.freeMode.onTouchEnd({
      currentPos: swiper.rtl ? swiper.translate : -swiper.translate
    });
  }
  function onTouchMove2() {
    if (swiper.params.cssMode) return;
    const {
      touchEventsData: data,
      touches
    } = swiper;
    if (data.velocities.length === 0) {
      data.velocities.push({
        position: touches[swiper.isHorizontal() ? "startX" : "startY"],
        time: data.touchStartTime
      });
    }
    data.velocities.push({
      position: touches[swiper.isHorizontal() ? "currentX" : "currentY"],
      time: now()
    });
  }
  function onTouchEnd2({
    currentPos
  }) {
    if (swiper.params.cssMode) return;
    const {
      params,
      wrapperEl,
      rtlTranslate: rtl,
      snapGrid,
      touchEventsData: data
    } = swiper;
    const touchEndTime = now();
    const timeDiff = touchEndTime - data.touchStartTime;
    if (currentPos < -swiper.minTranslate()) {
      swiper.slideTo(swiper.activeIndex);
      return;
    }
    if (currentPos > -swiper.maxTranslate()) {
      if (swiper.slides.length < snapGrid.length) {
        swiper.slideTo(snapGrid.length - 1);
      } else {
        swiper.slideTo(swiper.slides.length - 1);
      }
      return;
    }
    if (params.freeMode.momentum) {
      if (data.velocities.length > 1) {
        const lastMoveEvent = data.velocities.pop();
        const velocityEvent = data.velocities.pop();
        const distance = lastMoveEvent.position - velocityEvent.position;
        const time = lastMoveEvent.time - velocityEvent.time;
        swiper.velocity = distance / time;
        swiper.velocity /= 2;
        if (Math.abs(swiper.velocity) < params.freeMode.minimumVelocity) {
          swiper.velocity = 0;
        }
        if (time > 150 || now() - lastMoveEvent.time > 300) {
          swiper.velocity = 0;
        }
      } else {
        swiper.velocity = 0;
      }
      swiper.velocity *= params.freeMode.momentumVelocityRatio;
      data.velocities.length = 0;
      let momentumDuration = 1e3 * params.freeMode.momentumRatio;
      const momentumDistance = swiper.velocity * momentumDuration;
      let newPosition = swiper.translate + momentumDistance;
      if (rtl) newPosition = -newPosition;
      let doBounce = false;
      let afterBouncePosition;
      const bounceAmount = Math.abs(swiper.velocity) * 20 * params.freeMode.momentumBounceRatio;
      let needsLoopFix;
      if (newPosition < swiper.maxTranslate()) {
        if (params.freeMode.momentumBounce) {
          if (newPosition + swiper.maxTranslate() < -bounceAmount) {
            newPosition = swiper.maxTranslate() - bounceAmount;
          }
          afterBouncePosition = swiper.maxTranslate();
          doBounce = true;
          data.allowMomentumBounce = true;
        } else {
          newPosition = swiper.maxTranslate();
        }
        if (params.loop && params.centeredSlides) needsLoopFix = true;
      } else if (newPosition > swiper.minTranslate()) {
        if (params.freeMode.momentumBounce) {
          if (newPosition - swiper.minTranslate() > bounceAmount) {
            newPosition = swiper.minTranslate() + bounceAmount;
          }
          afterBouncePosition = swiper.minTranslate();
          doBounce = true;
          data.allowMomentumBounce = true;
        } else {
          newPosition = swiper.minTranslate();
        }
        if (params.loop && params.centeredSlides) needsLoopFix = true;
      } else if (params.freeMode.sticky) {
        let nextSlide;
        for (let j2 = 0; j2 < snapGrid.length; j2 += 1) {
          if (snapGrid[j2] > -newPosition) {
            nextSlide = j2;
            break;
          }
        }
        if (Math.abs(snapGrid[nextSlide] - newPosition) < Math.abs(snapGrid[nextSlide - 1] - newPosition) || swiper.swipeDirection === "next") {
          newPosition = snapGrid[nextSlide];
        } else {
          newPosition = snapGrid[nextSlide - 1];
        }
        newPosition = -newPosition;
      }
      if (needsLoopFix) {
        once("transitionEnd", () => {
          swiper.loopFix();
        });
      }
      if (swiper.velocity !== 0) {
        if (rtl) {
          momentumDuration = Math.abs((-newPosition - swiper.translate) / swiper.velocity);
        } else {
          momentumDuration = Math.abs((newPosition - swiper.translate) / swiper.velocity);
        }
        if (params.freeMode.sticky) {
          const moveDistance = Math.abs((rtl ? -newPosition : newPosition) - swiper.translate);
          const currentSlideSize = swiper.slidesSizesGrid[swiper.activeIndex];
          if (moveDistance < currentSlideSize) {
            momentumDuration = params.speed;
          } else if (moveDistance < 2 * currentSlideSize) {
            momentumDuration = params.speed * 1.5;
          } else {
            momentumDuration = params.speed * 2.5;
          }
        }
      } else if (params.freeMode.sticky) {
        swiper.slideToClosest();
        return;
      }
      if (params.freeMode.momentumBounce && doBounce) {
        swiper.updateProgress(afterBouncePosition);
        swiper.setTransition(momentumDuration);
        swiper.setTranslate(newPosition);
        swiper.transitionStart(true, swiper.swipeDirection);
        swiper.animating = true;
        elementTransitionEnd(wrapperEl, () => {
          if (!swiper || swiper.destroyed || !data.allowMomentumBounce) return;
          emit("momentumBounce");
          swiper.setTransition(params.speed);
          setTimeout(() => {
            swiper.setTranslate(afterBouncePosition);
            elementTransitionEnd(wrapperEl, () => {
              if (!swiper || swiper.destroyed) return;
              swiper.transitionEnd();
            });
          }, 0);
        });
      } else if (swiper.velocity) {
        emit("_freeModeNoMomentumRelease");
        swiper.updateProgress(newPosition);
        swiper.setTransition(momentumDuration);
        swiper.setTranslate(newPosition);
        swiper.transitionStart(true, swiper.swipeDirection);
        if (!swiper.animating) {
          swiper.animating = true;
          elementTransitionEnd(wrapperEl, () => {
            if (!swiper || swiper.destroyed) return;
            swiper.transitionEnd();
          });
        }
      } else {
        swiper.updateProgress(newPosition);
      }
      swiper.updateActiveIndex();
      swiper.updateSlidesClasses();
    } else if (params.freeMode.sticky) {
      swiper.slideToClosest();
      return;
    } else if (params.freeMode) {
      emit("_freeModeNoMomentumRelease");
    }
    if (!params.freeMode.momentum || timeDiff >= params.longSwipesMs) {
      emit("_freeModeStaticRelease");
      swiper.updateProgress();
      swiper.updateActiveIndex();
      swiper.updateSlidesClasses();
    }
  }
  Object.assign(swiper, {
    freeMode: {
      onTouchStart: onTouchStart2,
      onTouchMove: onTouchMove2,
      onTouchEnd: onTouchEnd2
    }
  });
}
function Grid({
  swiper,
  extendParams,
  on
}) {
  extendParams({
    grid: {
      rows: 1,
      fill: "column"
    }
  });
  let slidesNumberEvenToRows;
  let slidesPerRow;
  let numFullColumns;
  let wasMultiRow;
  const getSpaceBetween = () => {
    let spaceBetween = swiper.params.spaceBetween;
    if (typeof spaceBetween === "string" && spaceBetween.indexOf("%") >= 0) {
      spaceBetween = parseFloat(spaceBetween.replace("%", "")) / 100 * swiper.size;
    } else if (typeof spaceBetween === "string") {
      spaceBetween = parseFloat(spaceBetween);
    }
    return spaceBetween;
  };
  const initSlides = (slides) => {
    const {
      slidesPerView
    } = swiper.params;
    const {
      rows,
      fill
    } = swiper.params.grid;
    const slidesLength = swiper.virtual && swiper.params.virtual.enabled ? swiper.virtual.slides.length : slides.length;
    numFullColumns = Math.floor(slidesLength / rows);
    if (Math.floor(slidesLength / rows) === slidesLength / rows) {
      slidesNumberEvenToRows = slidesLength;
    } else {
      slidesNumberEvenToRows = Math.ceil(slidesLength / rows) * rows;
    }
    if (slidesPerView !== "auto" && fill === "row") {
      slidesNumberEvenToRows = Math.max(slidesNumberEvenToRows, slidesPerView * rows);
    }
    slidesPerRow = slidesNumberEvenToRows / rows;
  };
  const unsetSlides = () => {
    if (swiper.slides) {
      swiper.slides.forEach((slide2) => {
        if (slide2.swiperSlideGridSet) {
          slide2.style.height = "";
          slide2.style[swiper.getDirectionLabel("margin-top")] = "";
        }
      });
    }
  };
  const updateSlide = (i2, slide2, slides) => {
    const {
      slidesPerGroup
    } = swiper.params;
    const spaceBetween = getSpaceBetween();
    const {
      rows,
      fill
    } = swiper.params.grid;
    const slidesLength = swiper.virtual && swiper.params.virtual.enabled ? swiper.virtual.slides.length : slides.length;
    let newSlideOrderIndex;
    let column;
    let row;
    if (fill === "row" && slidesPerGroup > 1) {
      const groupIndex = Math.floor(i2 / (slidesPerGroup * rows));
      const slideIndexInGroup = i2 - rows * slidesPerGroup * groupIndex;
      const columnsInGroup = groupIndex === 0 ? slidesPerGroup : Math.min(Math.ceil((slidesLength - groupIndex * rows * slidesPerGroup) / rows), slidesPerGroup);
      row = Math.floor(slideIndexInGroup / columnsInGroup);
      column = slideIndexInGroup - row * columnsInGroup + groupIndex * slidesPerGroup;
      newSlideOrderIndex = column + row * slidesNumberEvenToRows / rows;
      slide2.style.order = newSlideOrderIndex;
    } else if (fill === "column") {
      column = Math.floor(i2 / rows);
      row = i2 - column * rows;
      if (column > numFullColumns || column === numFullColumns && row === rows - 1) {
        row += 1;
        if (row >= rows) {
          row = 0;
          column += 1;
        }
      }
    } else {
      row = Math.floor(i2 / slidesPerRow);
      column = i2 - row * slidesPerRow;
    }
    slide2.row = row;
    slide2.column = column;
    slide2.style.height = `calc((100% - ${(rows - 1) * spaceBetween}px) / ${rows})`;
    slide2.style[swiper.getDirectionLabel("margin-top")] = row !== 0 ? spaceBetween && `${spaceBetween}px` : "";
    slide2.swiperSlideGridSet = true;
  };
  const updateWrapperSize = (slideSize, snapGrid) => {
    const {
      centeredSlides,
      roundLengths
    } = swiper.params;
    const spaceBetween = getSpaceBetween();
    const {
      rows
    } = swiper.params.grid;
    swiper.virtualSize = (slideSize + spaceBetween) * slidesNumberEvenToRows;
    swiper.virtualSize = Math.ceil(swiper.virtualSize / rows) - spaceBetween;
    if (!swiper.params.cssMode) {
      swiper.wrapperEl.style[swiper.getDirectionLabel("width")] = `${swiper.virtualSize + spaceBetween}px`;
    }
    if (centeredSlides) {
      const newSlidesGrid = [];
      for (let i2 = 0; i2 < snapGrid.length; i2 += 1) {
        let slidesGridItem = snapGrid[i2];
        if (roundLengths) slidesGridItem = Math.floor(slidesGridItem);
        if (snapGrid[i2] < swiper.virtualSize + snapGrid[0]) newSlidesGrid.push(slidesGridItem);
      }
      snapGrid.splice(0, snapGrid.length);
      snapGrid.push(...newSlidesGrid);
    }
  };
  const onInit = () => {
    wasMultiRow = swiper.params.grid && swiper.params.grid.rows > 1;
  };
  const onUpdate = () => {
    const {
      params,
      el
    } = swiper;
    const isMultiRow = params.grid && params.grid.rows > 1;
    if (wasMultiRow && !isMultiRow) {
      el.classList.remove(`${params.containerModifierClass}grid`, `${params.containerModifierClass}grid-column`);
      numFullColumns = 1;
      swiper.emitContainerClasses();
    } else if (!wasMultiRow && isMultiRow) {
      el.classList.add(`${params.containerModifierClass}grid`);
      if (params.grid.fill === "column") {
        el.classList.add(`${params.containerModifierClass}grid-column`);
      }
      swiper.emitContainerClasses();
    }
    wasMultiRow = isMultiRow;
  };
  on("init", onInit);
  on("update", onUpdate);
  swiper.grid = {
    initSlides,
    unsetSlides,
    updateSlide,
    updateWrapperSize
  };
}
function appendSlide(slides) {
  const swiper = this;
  const {
    params,
    slidesEl
  } = swiper;
  if (params.loop) {
    swiper.loopDestroy();
  }
  const appendElement = (slideEl) => {
    if (typeof slideEl === "string") {
      const tempDOM = document.createElement("div");
      setInnerHTML(tempDOM, slideEl);
      slidesEl.append(tempDOM.children[0]);
      setInnerHTML(tempDOM, "");
    } else {
      slidesEl.append(slideEl);
    }
  };
  if (typeof slides === "object" && "length" in slides) {
    for (let i2 = 0; i2 < slides.length; i2 += 1) {
      if (slides[i2]) appendElement(slides[i2]);
    }
  } else {
    appendElement(slides);
  }
  swiper.recalcSlides();
  if (params.loop) {
    swiper.loopCreate();
  }
  if (!params.observer || swiper.isElement) {
    swiper.update();
  }
}
function prependSlide(slides) {
  const swiper = this;
  const {
    params,
    activeIndex,
    slidesEl
  } = swiper;
  if (params.loop) {
    swiper.loopDestroy();
  }
  let newActiveIndex = activeIndex + 1;
  const prependElement = (slideEl) => {
    if (typeof slideEl === "string") {
      const tempDOM = document.createElement("div");
      setInnerHTML(tempDOM, slideEl);
      slidesEl.prepend(tempDOM.children[0]);
      setInnerHTML(tempDOM, "");
    } else {
      slidesEl.prepend(slideEl);
    }
  };
  if (typeof slides === "object" && "length" in slides) {
    for (let i2 = 0; i2 < slides.length; i2 += 1) {
      if (slides[i2]) prependElement(slides[i2]);
    }
    newActiveIndex = activeIndex + slides.length;
  } else {
    prependElement(slides);
  }
  swiper.recalcSlides();
  if (params.loop) {
    swiper.loopCreate();
  }
  if (!params.observer || swiper.isElement) {
    swiper.update();
  }
  swiper.slideTo(newActiveIndex, 0, false);
}
function addSlide(index, slides) {
  const swiper = this;
  const {
    params,
    activeIndex,
    slidesEl
  } = swiper;
  let activeIndexBuffer = activeIndex;
  if (params.loop) {
    activeIndexBuffer -= swiper.loopedSlides;
    swiper.loopDestroy();
    swiper.recalcSlides();
  }
  const baseLength = swiper.slides.length;
  if (index <= 0) {
    swiper.prependSlide(slides);
    return;
  }
  if (index >= baseLength) {
    swiper.appendSlide(slides);
    return;
  }
  let newActiveIndex = activeIndexBuffer > index ? activeIndexBuffer + 1 : activeIndexBuffer;
  const slidesBuffer = [];
  for (let i2 = baseLength - 1; i2 >= index; i2 -= 1) {
    const currentSlide = swiper.slides[i2];
    currentSlide.remove();
    slidesBuffer.unshift(currentSlide);
  }
  if (typeof slides === "object" && "length" in slides) {
    for (let i2 = 0; i2 < slides.length; i2 += 1) {
      if (slides[i2]) slidesEl.append(slides[i2]);
    }
    newActiveIndex = activeIndexBuffer > index ? activeIndexBuffer + slides.length : activeIndexBuffer;
  } else {
    slidesEl.append(slides);
  }
  for (let i2 = 0; i2 < slidesBuffer.length; i2 += 1) {
    slidesEl.append(slidesBuffer[i2]);
  }
  swiper.recalcSlides();
  if (params.loop) {
    swiper.loopCreate();
  }
  if (!params.observer || swiper.isElement) {
    swiper.update();
  }
  if (params.loop) {
    swiper.slideTo(newActiveIndex + swiper.loopedSlides, 0, false);
  } else {
    swiper.slideTo(newActiveIndex, 0, false);
  }
}
function removeSlide(slidesIndexes) {
  const swiper = this;
  const {
    params,
    activeIndex
  } = swiper;
  let activeIndexBuffer = activeIndex;
  if (params.loop) {
    activeIndexBuffer -= swiper.loopedSlides;
    swiper.loopDestroy();
  }
  let newActiveIndex = activeIndexBuffer;
  let indexToRemove;
  if (typeof slidesIndexes === "object" && "length" in slidesIndexes) {
    for (let i2 = 0; i2 < slidesIndexes.length; i2 += 1) {
      indexToRemove = slidesIndexes[i2];
      if (swiper.slides[indexToRemove]) swiper.slides[indexToRemove].remove();
      if (indexToRemove < newActiveIndex) newActiveIndex -= 1;
    }
    newActiveIndex = Math.max(newActiveIndex, 0);
  } else {
    indexToRemove = slidesIndexes;
    if (swiper.slides[indexToRemove]) swiper.slides[indexToRemove].remove();
    if (indexToRemove < newActiveIndex) newActiveIndex -= 1;
    newActiveIndex = Math.max(newActiveIndex, 0);
  }
  swiper.recalcSlides();
  if (params.loop) {
    swiper.loopCreate();
  }
  if (!params.observer || swiper.isElement) {
    swiper.update();
  }
  if (params.loop) {
    swiper.slideTo(newActiveIndex + swiper.loopedSlides, 0, false);
  } else {
    swiper.slideTo(newActiveIndex, 0, false);
  }
}
function removeAllSlides() {
  const swiper = this;
  const slidesIndexes = [];
  for (let i2 = 0; i2 < swiper.slides.length; i2 += 1) {
    slidesIndexes.push(i2);
  }
  swiper.removeSlide(slidesIndexes);
}
function Manipulation({
  swiper
}) {
  Object.assign(swiper, {
    appendSlide: appendSlide.bind(swiper),
    prependSlide: prependSlide.bind(swiper),
    addSlide: addSlide.bind(swiper),
    removeSlide: removeSlide.bind(swiper),
    removeAllSlides: removeAllSlides.bind(swiper)
  });
}
function effectInit(params) {
  const {
    effect,
    swiper,
    on,
    setTranslate: setTranslate2,
    setTransition: setTransition2,
    overwriteParams,
    perspective,
    recreateShadows,
    getEffectParams
  } = params;
  on("beforeInit", () => {
    if (swiper.params.effect !== effect) return;
    swiper.classNames.push(`${swiper.params.containerModifierClass}${effect}`);
    if (perspective && perspective()) {
      swiper.classNames.push(`${swiper.params.containerModifierClass}3d`);
    }
    const overwriteParamsResult = overwriteParams ? overwriteParams() : {};
    Object.assign(swiper.params, overwriteParamsResult);
    Object.assign(swiper.originalParams, overwriteParamsResult);
  });
  on("setTranslate _virtualUpdated", () => {
    if (swiper.params.effect !== effect) return;
    setTranslate2();
  });
  on("setTransition", (_s, duration) => {
    if (swiper.params.effect !== effect) return;
    setTransition2(duration);
  });
  on("transitionEnd", () => {
    if (swiper.params.effect !== effect) return;
    if (recreateShadows) {
      if (!getEffectParams || !getEffectParams().slideShadows) return;
      swiper.slides.forEach((slideEl) => {
        slideEl.querySelectorAll(".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left").forEach((shadowEl) => shadowEl.remove());
      });
      recreateShadows();
    }
  });
  let requireUpdateOnVirtual;
  on("virtualUpdate", () => {
    if (swiper.params.effect !== effect) return;
    if (!swiper.slides.length) {
      requireUpdateOnVirtual = true;
    }
    requestAnimationFrame(() => {
      if (requireUpdateOnVirtual && swiper.slides && swiper.slides.length) {
        setTranslate2();
        requireUpdateOnVirtual = false;
      }
    });
  });
}
function effectTarget(effectParams, slideEl) {
  const transformEl = getSlideTransformEl(slideEl);
  if (transformEl !== slideEl) {
    transformEl.style.backfaceVisibility = "hidden";
    transformEl.style["-webkit-backface-visibility"] = "hidden";
  }
  return transformEl;
}
function effectVirtualTransitionEnd({
  swiper,
  duration,
  transformElements,
  allSlides
}) {
  const {
    activeIndex
  } = swiper;
  const getSlide = (el) => {
    if (!el.parentElement) {
      const slide2 = swiper.slides.find((slideEl) => slideEl.shadowRoot && slideEl.shadowRoot === el.parentNode);
      return slide2;
    }
    return el.parentElement;
  };
  if (swiper.params.virtualTranslate && duration !== 0) {
    let eventTriggered = false;
    let transitionEndTarget;
    if (allSlides) {
      transitionEndTarget = transformElements;
    } else {
      transitionEndTarget = transformElements.filter((transformEl) => {
        const el = transformEl.classList.contains("swiper-slide-transform") ? getSlide(transformEl) : transformEl;
        return swiper.getSlideIndex(el) === activeIndex;
      });
    }
    transitionEndTarget.forEach((el) => {
      elementTransitionEnd(el, () => {
        if (eventTriggered) return;
        if (!swiper || swiper.destroyed) return;
        eventTriggered = true;
        swiper.animating = false;
        const evt = new window.CustomEvent("transitionend", {
          bubbles: true,
          cancelable: true
        });
        swiper.wrapperEl.dispatchEvent(evt);
      });
    });
  }
}
function EffectFade({
  swiper,
  extendParams,
  on
}) {
  extendParams({
    fadeEffect: {
      crossFade: false
    }
  });
  const setTranslate2 = () => {
    const {
      slides
    } = swiper;
    const params = swiper.params.fadeEffect;
    for (let i2 = 0; i2 < slides.length; i2 += 1) {
      const slideEl = swiper.slides[i2];
      const offset = slideEl.swiperSlideOffset;
      let tx = -offset;
      if (!swiper.params.virtualTranslate) tx -= swiper.translate;
      let ty = 0;
      if (!swiper.isHorizontal()) {
        ty = tx;
        tx = 0;
      }
      const slideOpacity = swiper.params.fadeEffect.crossFade ? Math.max(1 - Math.abs(slideEl.progress), 0) : 1 + Math.min(Math.max(slideEl.progress, -1), 0);
      const targetEl = effectTarget(params, slideEl);
      targetEl.style.opacity = slideOpacity;
      targetEl.style.transform = `translate3d(${tx}px, ${ty}px, 0px)`;
    }
  };
  const setTransition2 = (duration) => {
    const transformElements = swiper.slides.map((slideEl) => getSlideTransformEl(slideEl));
    transformElements.forEach((el) => {
      el.style.transitionDuration = `${duration}ms`;
    });
    effectVirtualTransitionEnd({
      swiper,
      duration,
      transformElements,
      allSlides: true
    });
  };
  effectInit({
    effect: "fade",
    swiper,
    on,
    setTranslate: setTranslate2,
    setTransition: setTransition2,
    overwriteParams: () => ({
      slidesPerView: 1,
      slidesPerGroup: 1,
      watchSlidesProgress: true,
      spaceBetween: 0,
      virtualTranslate: !swiper.params.cssMode
    })
  });
}
function EffectCube({
  swiper,
  extendParams,
  on
}) {
  extendParams({
    cubeEffect: {
      slideShadows: true,
      shadow: true,
      shadowOffset: 20,
      shadowScale: 0.94
    }
  });
  const createSlideShadows = (slideEl, progress, isHorizontal) => {
    let shadowBefore = isHorizontal ? slideEl.querySelector(".swiper-slide-shadow-left") : slideEl.querySelector(".swiper-slide-shadow-top");
    let shadowAfter = isHorizontal ? slideEl.querySelector(".swiper-slide-shadow-right") : slideEl.querySelector(".swiper-slide-shadow-bottom");
    if (!shadowBefore) {
      shadowBefore = createElement("div", `swiper-slide-shadow-cube swiper-slide-shadow-${isHorizontal ? "left" : "top"}`.split(" "));
      slideEl.append(shadowBefore);
    }
    if (!shadowAfter) {
      shadowAfter = createElement("div", `swiper-slide-shadow-cube swiper-slide-shadow-${isHorizontal ? "right" : "bottom"}`.split(" "));
      slideEl.append(shadowAfter);
    }
    if (shadowBefore) shadowBefore.style.opacity = Math.max(-progress, 0);
    if (shadowAfter) shadowAfter.style.opacity = Math.max(progress, 0);
  };
  const recreateShadows = () => {
    const isHorizontal = swiper.isHorizontal();
    swiper.slides.forEach((slideEl) => {
      const progress = Math.max(Math.min(slideEl.progress, 1), -1);
      createSlideShadows(slideEl, progress, isHorizontal);
    });
  };
  const setTranslate2 = () => {
    const {
      el,
      wrapperEl,
      slides,
      width: swiperWidth,
      height: swiperHeight,
      rtlTranslate: rtl,
      size: swiperSize,
      browser: browser2
    } = swiper;
    const r2 = getRotateFix(swiper);
    const params = swiper.params.cubeEffect;
    const isHorizontal = swiper.isHorizontal();
    const isVirtual = swiper.virtual && swiper.params.virtual.enabled;
    let wrapperRotate = 0;
    let cubeShadowEl;
    if (params.shadow) {
      if (isHorizontal) {
        cubeShadowEl = swiper.wrapperEl.querySelector(".swiper-cube-shadow");
        if (!cubeShadowEl) {
          cubeShadowEl = createElement("div", "swiper-cube-shadow");
          swiper.wrapperEl.append(cubeShadowEl);
        }
        cubeShadowEl.style.height = `${swiperWidth}px`;
      } else {
        cubeShadowEl = el.querySelector(".swiper-cube-shadow");
        if (!cubeShadowEl) {
          cubeShadowEl = createElement("div", "swiper-cube-shadow");
          el.append(cubeShadowEl);
        }
      }
    }
    for (let i2 = 0; i2 < slides.length; i2 += 1) {
      const slideEl = slides[i2];
      let slideIndex = i2;
      if (isVirtual) {
        slideIndex = parseInt(slideEl.getAttribute("data-swiper-slide-index"), 10);
      }
      let slideAngle = slideIndex * 90;
      let round = Math.floor(slideAngle / 360);
      if (rtl) {
        slideAngle = -slideAngle;
        round = Math.floor(-slideAngle / 360);
      }
      const progress = Math.max(Math.min(slideEl.progress, 1), -1);
      let tx = 0;
      let ty = 0;
      let tz = 0;
      if (slideIndex % 4 === 0) {
        tx = -round * 4 * swiperSize;
        tz = 0;
      } else if ((slideIndex - 1) % 4 === 0) {
        tx = 0;
        tz = -round * 4 * swiperSize;
      } else if ((slideIndex - 2) % 4 === 0) {
        tx = swiperSize + round * 4 * swiperSize;
        tz = swiperSize;
      } else if ((slideIndex - 3) % 4 === 0) {
        tx = -swiperSize;
        tz = 3 * swiperSize + swiperSize * 4 * round;
      }
      if (rtl) {
        tx = -tx;
      }
      if (!isHorizontal) {
        ty = tx;
        tx = 0;
      }
      const transform = `rotateX(${r2(isHorizontal ? 0 : -slideAngle)}deg) rotateY(${r2(isHorizontal ? slideAngle : 0)}deg) translate3d(${tx}px, ${ty}px, ${tz}px)`;
      if (progress <= 1 && progress > -1) {
        wrapperRotate = slideIndex * 90 + progress * 90;
        if (rtl) wrapperRotate = -slideIndex * 90 - progress * 90;
      }
      slideEl.style.transform = transform;
      if (params.slideShadows) {
        createSlideShadows(slideEl, progress, isHorizontal);
      }
    }
    wrapperEl.style.transformOrigin = `50% 50% -${swiperSize / 2}px`;
    wrapperEl.style["-webkit-transform-origin"] = `50% 50% -${swiperSize / 2}px`;
    if (params.shadow) {
      if (isHorizontal) {
        cubeShadowEl.style.transform = `translate3d(0px, ${swiperWidth / 2 + params.shadowOffset}px, ${-swiperWidth / 2}px) rotateX(89.99deg) rotateZ(0deg) scale(${params.shadowScale})`;
      } else {
        const shadowAngle = Math.abs(wrapperRotate) - Math.floor(Math.abs(wrapperRotate) / 90) * 90;
        const multiplier = 1.5 - (Math.sin(shadowAngle * 2 * Math.PI / 360) / 2 + Math.cos(shadowAngle * 2 * Math.PI / 360) / 2);
        const scale1 = params.shadowScale;
        const scale2 = params.shadowScale / multiplier;
        const offset = params.shadowOffset;
        cubeShadowEl.style.transform = `scale3d(${scale1}, 1, ${scale2}) translate3d(0px, ${swiperHeight / 2 + offset}px, ${-swiperHeight / 2 / scale2}px) rotateX(-89.99deg)`;
      }
    }
    const zFactor = (browser2.isSafari || browser2.isWebView) && browser2.needPerspectiveFix ? -swiperSize / 2 : 0;
    wrapperEl.style.transform = `translate3d(0px,0,${zFactor}px) rotateX(${r2(swiper.isHorizontal() ? 0 : wrapperRotate)}deg) rotateY(${r2(swiper.isHorizontal() ? -wrapperRotate : 0)}deg)`;
    wrapperEl.style.setProperty("--swiper-cube-translate-z", `${zFactor}px`);
  };
  const setTransition2 = (duration) => {
    const {
      el,
      slides
    } = swiper;
    slides.forEach((slideEl) => {
      slideEl.style.transitionDuration = `${duration}ms`;
      slideEl.querySelectorAll(".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left").forEach((subEl) => {
        subEl.style.transitionDuration = `${duration}ms`;
      });
    });
    if (swiper.params.cubeEffect.shadow && !swiper.isHorizontal()) {
      const shadowEl = el.querySelector(".swiper-cube-shadow");
      if (shadowEl) shadowEl.style.transitionDuration = `${duration}ms`;
    }
  };
  effectInit({
    effect: "cube",
    swiper,
    on,
    setTranslate: setTranslate2,
    setTransition: setTransition2,
    recreateShadows,
    getEffectParams: () => swiper.params.cubeEffect,
    perspective: () => true,
    overwriteParams: () => ({
      slidesPerView: 1,
      slidesPerGroup: 1,
      watchSlidesProgress: true,
      resistanceRatio: 0,
      spaceBetween: 0,
      centeredSlides: false,
      virtualTranslate: true
    })
  });
}
function createShadow(suffix, slideEl, side) {
  const shadowClass = `swiper-slide-shadow${side ? `-${side}` : ""}${suffix ? ` swiper-slide-shadow-${suffix}` : ""}`;
  const shadowContainer = getSlideTransformEl(slideEl);
  let shadowEl = shadowContainer.querySelector(`.${shadowClass.split(" ").join(".")}`);
  if (!shadowEl) {
    shadowEl = createElement("div", shadowClass.split(" "));
    shadowContainer.append(shadowEl);
  }
  return shadowEl;
}
function EffectFlip({
  swiper,
  extendParams,
  on
}) {
  extendParams({
    flipEffect: {
      slideShadows: true,
      limitRotation: true
    }
  });
  const createSlideShadows = (slideEl, progress) => {
    let shadowBefore = swiper.isHorizontal() ? slideEl.querySelector(".swiper-slide-shadow-left") : slideEl.querySelector(".swiper-slide-shadow-top");
    let shadowAfter = swiper.isHorizontal() ? slideEl.querySelector(".swiper-slide-shadow-right") : slideEl.querySelector(".swiper-slide-shadow-bottom");
    if (!shadowBefore) {
      shadowBefore = createShadow("flip", slideEl, swiper.isHorizontal() ? "left" : "top");
    }
    if (!shadowAfter) {
      shadowAfter = createShadow("flip", slideEl, swiper.isHorizontal() ? "right" : "bottom");
    }
    if (shadowBefore) shadowBefore.style.opacity = Math.max(-progress, 0);
    if (shadowAfter) shadowAfter.style.opacity = Math.max(progress, 0);
  };
  const recreateShadows = () => {
    swiper.params.flipEffect;
    swiper.slides.forEach((slideEl) => {
      let progress = slideEl.progress;
      if (swiper.params.flipEffect.limitRotation) {
        progress = Math.max(Math.min(slideEl.progress, 1), -1);
      }
      createSlideShadows(slideEl, progress);
    });
  };
  const setTranslate2 = () => {
    const {
      slides,
      rtlTranslate: rtl
    } = swiper;
    const params = swiper.params.flipEffect;
    const rotateFix = getRotateFix(swiper);
    for (let i2 = 0; i2 < slides.length; i2 += 1) {
      const slideEl = slides[i2];
      let progress = slideEl.progress;
      if (swiper.params.flipEffect.limitRotation) {
        progress = Math.max(Math.min(slideEl.progress, 1), -1);
      }
      const offset = slideEl.swiperSlideOffset;
      const rotate = -180 * progress;
      let rotateY = rotate;
      let rotateX = 0;
      let tx = swiper.params.cssMode ? -offset - swiper.translate : -offset;
      let ty = 0;
      if (!swiper.isHorizontal()) {
        ty = tx;
        tx = 0;
        rotateX = -rotateY;
        rotateY = 0;
      } else if (rtl) {
        rotateY = -rotateY;
      }
      slideEl.style.zIndex = -Math.abs(Math.round(progress)) + slides.length;
      if (params.slideShadows) {
        createSlideShadows(slideEl, progress);
      }
      const transform = `translate3d(${tx}px, ${ty}px, 0px) rotateX(${rotateFix(rotateX)}deg) rotateY(${rotateFix(rotateY)}deg)`;
      const targetEl = effectTarget(params, slideEl);
      targetEl.style.transform = transform;
    }
  };
  const setTransition2 = (duration) => {
    const transformElements = swiper.slides.map((slideEl) => getSlideTransformEl(slideEl));
    transformElements.forEach((el) => {
      el.style.transitionDuration = `${duration}ms`;
      el.querySelectorAll(".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left").forEach((shadowEl) => {
        shadowEl.style.transitionDuration = `${duration}ms`;
      });
    });
    effectVirtualTransitionEnd({
      swiper,
      duration,
      transformElements
    });
  };
  effectInit({
    effect: "flip",
    swiper,
    on,
    setTranslate: setTranslate2,
    setTransition: setTransition2,
    recreateShadows,
    getEffectParams: () => swiper.params.flipEffect,
    perspective: () => true,
    overwriteParams: () => ({
      slidesPerView: 1,
      slidesPerGroup: 1,
      watchSlidesProgress: true,
      spaceBetween: 0,
      virtualTranslate: !swiper.params.cssMode
    })
  });
}
function EffectCoverflow({
  swiper,
  extendParams,
  on
}) {
  extendParams({
    coverflowEffect: {
      rotate: 50,
      stretch: 0,
      depth: 100,
      scale: 1,
      modifier: 1,
      slideShadows: true
    }
  });
  const setTranslate2 = () => {
    const {
      width: swiperWidth,
      height: swiperHeight,
      slides,
      slidesSizesGrid
    } = swiper;
    const params = swiper.params.coverflowEffect;
    const isHorizontal = swiper.isHorizontal();
    const transform = swiper.translate;
    const center = isHorizontal ? -transform + swiperWidth / 2 : -transform + swiperHeight / 2;
    const rotate = isHorizontal ? params.rotate : -params.rotate;
    const translate2 = params.depth;
    const r2 = getRotateFix(swiper);
    for (let i2 = 0, length = slides.length; i2 < length; i2 += 1) {
      const slideEl = slides[i2];
      const slideSize = slidesSizesGrid[i2];
      const slideOffset = slideEl.swiperSlideOffset;
      const centerOffset = (center - slideOffset - slideSize / 2) / slideSize;
      const offsetMultiplier = typeof params.modifier === "function" ? params.modifier(centerOffset) : centerOffset * params.modifier;
      let rotateY = isHorizontal ? rotate * offsetMultiplier : 0;
      let rotateX = isHorizontal ? 0 : rotate * offsetMultiplier;
      let translateZ = -translate2 * Math.abs(offsetMultiplier);
      let stretch = params.stretch;
      if (typeof stretch === "string" && stretch.indexOf("%") !== -1) {
        stretch = parseFloat(params.stretch) / 100 * slideSize;
      }
      let translateY = isHorizontal ? 0 : stretch * offsetMultiplier;
      let translateX = isHorizontal ? stretch * offsetMultiplier : 0;
      let scale = 1 - (1 - params.scale) * Math.abs(offsetMultiplier);
      if (Math.abs(translateX) < 1e-3) translateX = 0;
      if (Math.abs(translateY) < 1e-3) translateY = 0;
      if (Math.abs(translateZ) < 1e-3) translateZ = 0;
      if (Math.abs(rotateY) < 1e-3) rotateY = 0;
      if (Math.abs(rotateX) < 1e-3) rotateX = 0;
      if (Math.abs(scale) < 1e-3) scale = 0;
      const slideTransform = `translate3d(${translateX}px,${translateY}px,${translateZ}px)  rotateX(${r2(rotateX)}deg) rotateY(${r2(rotateY)}deg) scale(${scale})`;
      const targetEl = effectTarget(params, slideEl);
      targetEl.style.transform = slideTransform;
      slideEl.style.zIndex = -Math.abs(Math.round(offsetMultiplier)) + 1;
      if (params.slideShadows) {
        let shadowBeforeEl = isHorizontal ? slideEl.querySelector(".swiper-slide-shadow-left") : slideEl.querySelector(".swiper-slide-shadow-top");
        let shadowAfterEl = isHorizontal ? slideEl.querySelector(".swiper-slide-shadow-right") : slideEl.querySelector(".swiper-slide-shadow-bottom");
        if (!shadowBeforeEl) {
          shadowBeforeEl = createShadow("coverflow", slideEl, isHorizontal ? "left" : "top");
        }
        if (!shadowAfterEl) {
          shadowAfterEl = createShadow("coverflow", slideEl, isHorizontal ? "right" : "bottom");
        }
        if (shadowBeforeEl) shadowBeforeEl.style.opacity = offsetMultiplier > 0 ? offsetMultiplier : 0;
        if (shadowAfterEl) shadowAfterEl.style.opacity = -offsetMultiplier > 0 ? -offsetMultiplier : 0;
      }
    }
  };
  const setTransition2 = (duration) => {
    const transformElements = swiper.slides.map((slideEl) => getSlideTransformEl(slideEl));
    transformElements.forEach((el) => {
      el.style.transitionDuration = `${duration}ms`;
      el.querySelectorAll(".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left").forEach((shadowEl) => {
        shadowEl.style.transitionDuration = `${duration}ms`;
      });
    });
  };
  effectInit({
    effect: "coverflow",
    swiper,
    on,
    setTranslate: setTranslate2,
    setTransition: setTransition2,
    perspective: () => true,
    overwriteParams: () => ({
      watchSlidesProgress: true
    })
  });
}
function EffectCreative({
  swiper,
  extendParams,
  on
}) {
  extendParams({
    creativeEffect: {
      limitProgress: 1,
      shadowPerProgress: false,
      progressMultiplier: 1,
      perspective: true,
      prev: {
        translate: [0, 0, 0],
        rotate: [0, 0, 0],
        opacity: 1,
        scale: 1
      },
      next: {
        translate: [0, 0, 0],
        rotate: [0, 0, 0],
        opacity: 1,
        scale: 1
      }
    }
  });
  const getTranslateValue = (value) => {
    if (typeof value === "string") return value;
    return `${value}px`;
  };
  const setTranslate2 = () => {
    const {
      slides,
      wrapperEl,
      slidesSizesGrid
    } = swiper;
    const params = swiper.params.creativeEffect;
    const {
      progressMultiplier: multiplier
    } = params;
    const isCenteredSlides = swiper.params.centeredSlides;
    const rotateFix = getRotateFix(swiper);
    if (isCenteredSlides) {
      const margin = slidesSizesGrid[0] / 2 - swiper.params.slidesOffsetBefore || 0;
      wrapperEl.style.transform = `translateX(calc(50% - ${margin}px))`;
    }
    for (let i2 = 0; i2 < slides.length; i2 += 1) {
      const slideEl = slides[i2];
      const slideProgress = slideEl.progress;
      const progress = Math.min(Math.max(slideEl.progress, -params.limitProgress), params.limitProgress);
      let originalProgress = progress;
      if (!isCenteredSlides) {
        originalProgress = Math.min(Math.max(slideEl.originalProgress, -params.limitProgress), params.limitProgress);
      }
      const offset = slideEl.swiperSlideOffset;
      const t2 = [swiper.params.cssMode ? -offset - swiper.translate : -offset, 0, 0];
      const r2 = [0, 0, 0];
      let custom = false;
      if (!swiper.isHorizontal()) {
        t2[1] = t2[0];
        t2[0] = 0;
      }
      let data = {
        translate: [0, 0, 0],
        rotate: [0, 0, 0],
        scale: 1,
        opacity: 1
      };
      if (progress < 0) {
        data = params.next;
        custom = true;
      } else if (progress > 0) {
        data = params.prev;
        custom = true;
      }
      t2.forEach((value, index) => {
        t2[index] = `calc(${value}px + (${getTranslateValue(data.translate[index])} * ${Math.abs(progress * multiplier)}))`;
      });
      r2.forEach((value, index) => {
        let val = data.rotate[index] * Math.abs(progress * multiplier);
        r2[index] = val;
      });
      slideEl.style.zIndex = -Math.abs(Math.round(slideProgress)) + slides.length;
      const translateString = t2.join(", ");
      const rotateString = `rotateX(${rotateFix(r2[0])}deg) rotateY(${rotateFix(r2[1])}deg) rotateZ(${rotateFix(r2[2])}deg)`;
      const scaleString = originalProgress < 0 ? `scale(${1 + (1 - data.scale) * originalProgress * multiplier})` : `scale(${1 - (1 - data.scale) * originalProgress * multiplier})`;
      const opacityString = originalProgress < 0 ? 1 + (1 - data.opacity) * originalProgress * multiplier : 1 - (1 - data.opacity) * originalProgress * multiplier;
      const transform = `translate3d(${translateString}) ${rotateString} ${scaleString}`;
      if (custom && data.shadow || !custom) {
        let shadowEl = slideEl.querySelector(".swiper-slide-shadow");
        if (!shadowEl && data.shadow) {
          shadowEl = createShadow("creative", slideEl);
        }
        if (shadowEl) {
          const shadowOpacity = params.shadowPerProgress ? progress * (1 / params.limitProgress) : progress;
          shadowEl.style.opacity = Math.min(Math.max(Math.abs(shadowOpacity), 0), 1);
        }
      }
      const targetEl = effectTarget(params, slideEl);
      targetEl.style.transform = transform;
      targetEl.style.opacity = opacityString;
      if (data.origin) {
        targetEl.style.transformOrigin = data.origin;
      }
    }
  };
  const setTransition2 = (duration) => {
    const transformElements = swiper.slides.map((slideEl) => getSlideTransformEl(slideEl));
    transformElements.forEach((el) => {
      el.style.transitionDuration = `${duration}ms`;
      el.querySelectorAll(".swiper-slide-shadow").forEach((shadowEl) => {
        shadowEl.style.transitionDuration = `${duration}ms`;
      });
    });
    effectVirtualTransitionEnd({
      swiper,
      duration,
      transformElements,
      allSlides: true
    });
  };
  effectInit({
    effect: "creative",
    swiper,
    on,
    setTranslate: setTranslate2,
    setTransition: setTransition2,
    perspective: () => swiper.params.creativeEffect.perspective,
    overwriteParams: () => ({
      watchSlidesProgress: true,
      virtualTranslate: !swiper.params.cssMode
    })
  });
}
function EffectCards({
  swiper,
  extendParams,
  on
}) {
  extendParams({
    cardsEffect: {
      slideShadows: true,
      rotate: true,
      perSlideRotate: 2,
      perSlideOffset: 8
    }
  });
  const setTranslate2 = () => {
    const {
      slides,
      activeIndex,
      rtlTranslate: rtl
    } = swiper;
    const params = swiper.params.cardsEffect;
    const {
      startTranslate,
      isTouched
    } = swiper.touchEventsData;
    const currentTranslate = rtl ? -swiper.translate : swiper.translate;
    for (let i2 = 0; i2 < slides.length; i2 += 1) {
      const slideEl = slides[i2];
      const slideProgress = slideEl.progress;
      const progress = Math.min(Math.max(slideProgress, -4), 4);
      let offset = slideEl.swiperSlideOffset;
      if (swiper.params.centeredSlides && !swiper.params.cssMode) {
        swiper.wrapperEl.style.transform = `translateX(${swiper.minTranslate()}px)`;
      }
      if (swiper.params.centeredSlides && swiper.params.cssMode) {
        offset -= slides[0].swiperSlideOffset;
      }
      let tX = swiper.params.cssMode ? -offset - swiper.translate : -offset;
      let tY = 0;
      const tZ = -100 * Math.abs(progress);
      let scale = 1;
      let rotate = -params.perSlideRotate * progress;
      let tXAdd = params.perSlideOffset - Math.abs(progress) * 0.75;
      const slideIndex = swiper.virtual && swiper.params.virtual.enabled ? swiper.virtual.from + i2 : i2;
      const isSwipeToNext = (slideIndex === activeIndex || slideIndex === activeIndex - 1) && progress > 0 && progress < 1 && (isTouched || swiper.params.cssMode) && currentTranslate < startTranslate;
      const isSwipeToPrev = (slideIndex === activeIndex || slideIndex === activeIndex + 1) && progress < 0 && progress > -1 && (isTouched || swiper.params.cssMode) && currentTranslate > startTranslate;
      if (isSwipeToNext || isSwipeToPrev) {
        const subProgress = (1 - Math.abs((Math.abs(progress) - 0.5) / 0.5)) ** 0.5;
        rotate += -28 * progress * subProgress;
        scale += -0.5 * subProgress;
        tXAdd += 96 * subProgress;
        tY = `${(params.rotate || swiper.isHorizontal() ? -25 : 0) * subProgress * Math.abs(progress)}%`;
      }
      if (progress < 0) {
        tX = `calc(${tX}px ${rtl ? "-" : "+"} (${tXAdd * Math.abs(progress)}%))`;
      } else if (progress > 0) {
        tX = `calc(${tX}px ${rtl ? "-" : "+"} (-${tXAdd * Math.abs(progress)}%))`;
      } else {
        tX = `${tX}px`;
      }
      if (!swiper.isHorizontal()) {
        const prevY = tY;
        tY = tX;
        tX = prevY;
      }
      const scaleString = progress < 0 ? `${1 + (1 - scale) * progress}` : `${1 - (1 - scale) * progress}`;
      const transform = `
        translate3d(${tX}, ${tY}, ${tZ}px)
        rotateZ(${params.rotate ? rtl ? -rotate : rotate : 0}deg)
        scale(${scaleString})
      `;
      if (params.slideShadows) {
        let shadowEl = slideEl.querySelector(".swiper-slide-shadow");
        if (!shadowEl) {
          shadowEl = createShadow("cards", slideEl);
        }
        if (shadowEl) shadowEl.style.opacity = Math.min(Math.max((Math.abs(progress) - 0.5) / 0.5, 0), 1);
      }
      slideEl.style.zIndex = -Math.abs(Math.round(slideProgress)) + slides.length;
      const targetEl = effectTarget(params, slideEl);
      targetEl.style.transform = transform;
    }
  };
  const setTransition2 = (duration) => {
    const transformElements = swiper.slides.map((slideEl) => getSlideTransformEl(slideEl));
    transformElements.forEach((el) => {
      el.style.transitionDuration = `${duration}ms`;
      el.querySelectorAll(".swiper-slide-shadow").forEach((shadowEl) => {
        shadowEl.style.transitionDuration = `${duration}ms`;
      });
    });
    effectVirtualTransitionEnd({
      swiper,
      duration,
      transformElements
    });
  };
  effectInit({
    effect: "cards",
    swiper,
    on,
    setTranslate: setTranslate2,
    setTransition: setTransition2,
    perspective: () => true,
    overwriteParams: () => ({
      _loopSwapReset: false,
      watchSlidesProgress: true,
      loopAdditionalSlides: swiper.params.cardsEffect.rotate ? 3 : 2,
      centeredSlides: true,
      virtualTranslate: !swiper.params.cssMode
    })
  });
}
const modules = [Virtual, Keyboard, Mousewheel, Navigation, Pagination, Scrollbar, Parallax, Zoom, Controller, A11y, History, HashNavigation, Autoplay, Thumb, freeMode, Grid, Manipulation, EffectFade, EffectCube, EffectFlip, EffectCoverflow, EffectCreative, EffectCards];
Swiper.use(modules);
const t$7 = (t2) => "object" == typeof t2 && null !== t2 && t2.constructor === Object && "[object Object]" === Object.prototype.toString.call(t2);
const t$6 = (t2) => "string" == typeof t2;
const n$9 = (n2) => n2 && null !== n2 && n2 instanceof Element && "nodeType" in n2;
const e$9 = function(e2) {
  var t2 = new DOMParser().parseFromString(e2, "text/html").body;
  if (t2.childElementCount > 1) {
    for (var n2 = document.createElement("div"); t2.firstChild; ) n2.appendChild(t2.firstChild);
    return n2;
  }
  let r2 = t2.firstChild;
  return !r2 || r2 instanceof HTMLElement ? r2 : ((n2 = document.createElement("div")).appendChild(r2), n2);
};
const e$8 = function(e2) {
  if (!(e2 && e2 instanceof Element && e2.offsetParent)) return false;
  let n2 = false, i2 = false;
  if (e2.scrollWidth > e2.clientWidth) {
    const i3 = window.getComputedStyle(e2).overflowX, t2 = -1 !== i3.indexOf("hidden"), o2 = -1 !== i3.indexOf("clip"), d2 = -1 !== i3.indexOf("visible");
    n2 = !t2 && !o2 && !d2;
  }
  if (e2.scrollHeight > e2.clientHeight) {
    const n3 = window.getComputedStyle(e2).overflowY, t2 = -1 !== n3.indexOf("hidden"), o2 = -1 !== n3.indexOf("clip"), d2 = -1 !== n3.indexOf("visible");
    i2 = !t2 && !o2 && !d2;
  }
  return n2 || i2;
}, n$8 = function(i2, t2 = void 0) {
  return !i2 || i2 === document.body || t2 && i2 === t2 ? null : e$8(i2) ? i2 : n$8(i2.parentElement, t2);
};
const t$5 = (t2 = true, e2 = "--f-scrollbar-compensate", s2 = "--f-body-margin", o2 = "hide-scrollbar") => {
  const n2 = document, r2 = n2.body, l2 = n2.documentElement;
  if (t2) {
    if (r2.classList.contains(o2)) return;
    let t3 = window.innerWidth - l2.getBoundingClientRect().width;
    t3 < 0 && (t3 = 0), l2.style.setProperty(e2, `${t3}px`);
    const n3 = parseFloat(window.getComputedStyle(r2).marginRight);
    n3 && r2.style.setProperty(s2, `${n3}px`), r2.classList.add(o2);
  } else r2.classList.remove(o2), r2.style.setProperty(s2, ""), n2.documentElement.style.setProperty(e2, "");
};
const r$5 = (t2, ...e2) => {
  const n2 = e2.length;
  for (let c2 = 0; c2 < n2; c2++) {
    const n3 = e2[c2] || {};
    Object.entries(n3).forEach((([e3, n4]) => {
      const c3 = Array.isArray(n4) ? [] : {};
      t2[e3] || Object.assign(t2, { [e3]: c3 }), t$7(n4) ? Object.assign(t2[e3], r$5(t2[e3], n4)) : Array.isArray(n4) ? Object.assign(t2, { [e3]: [...n4] }) : Object.assign(t2, { [e3]: n4 });
    }));
  }
  return t2;
};
function e$7() {
  return !("undefined" == typeof window || !window.document || !window.document.createElement);
}
const t$4 = function(t2 = 0, n2 = 0, a2 = 0) {
  return Math.max(Math.min(n2, a2), t2);
};
const t$3 = function(t2 = 0, n2 = 0, r2 = 0, c2 = 0, m2 = 0, p2 = false) {
  const s2 = (t2 - n2) / (r2 - n2) * (m2 - c2) + c2;
  return p2 ? c2 < m2 ? t$4(c2, s2, m2) : t$4(m2, s2, c2) : s2;
};
const s$9 = (s2, t2 = "") => {
  s2 && s2.classList && t2.split(" ").forEach(((t3) => {
    t3 && s2.classList.add(t3);
  }));
};
const s$8 = (s2, t2 = "") => {
  s2 && s2.classList && t2.split(" ").forEach(((t3) => {
    t3 && s2.classList.remove(t3);
  }));
};
const s$7 = (s2, t2 = "", c2) => {
  s2 && s2.classList && t2.split(" ").forEach(((t3) => {
    t3 && s2.classList.toggle(t3, c2 || false);
  }));
};
function e$6(e2) {
  return t$7(e2) || Array.isArray(e2);
}
function n$7(t2, r2) {
  const o2 = Object.keys(t2), c2 = Object.keys(r2);
  return o2.length === c2.length && o2.every(((o3) => {
    const c3 = t2[o3], i2 = r2[o3];
    return "function" == typeof c3 ? `${c3}` == `${i2}` : e$6(c3) && e$6(i2) ? n$7(c3, i2) : c3 === i2;
  }));
}
const e$5 = function(n2) {
  for (const t2 of s$6) t2.getState() === i$7.Running && t2.tick(a$6 ? n2 - a$6 : 0);
  a$6 = n2, u$3 = window.requestAnimationFrame(e$5);
};
var i$7, o$7, r$4;
!(function(n2) {
  n2[n2.Initializing = 0] = "Initializing", n2[n2.Running = 1] = "Running", n2[n2.Paused = 2] = "Paused", n2[n2.Completed = 3] = "Completed", n2[n2.Destroyed = 4] = "Destroyed";
})(i$7 || (i$7 = {})), (function(n2) {
  n2[n2.Spring = 0] = "Spring", n2[n2.Ease = 1] = "Ease";
})(o$7 || (o$7 = {})), (function(n2) {
  n2[n2.Loop = 0] = "Loop", n2[n2.Reverse = 1] = "Reverse";
})(r$4 || (r$4 = {}));
const s$6 = /* @__PURE__ */ new Set();
let u$3 = null, a$6 = 0;
function c$3() {
  let a2 = i$7.Initializing, f2 = o$7.Ease, l2 = 0, g = 0, p2 = c$3.Easings.Linear, m2 = 500, d2 = 0, b2 = 0, S = 0, h2 = 0, y2 = 1 / 0, E2 = 0.01, R2 = 0.01, M2 = false, j2 = {}, w2 = null, v2 = {}, O2 = {}, C = {}, L = 0, I2 = 0, D2 = r$4.Loop, z2 = c$3.Easings.Linear;
  const N2 = /* @__PURE__ */ new Map();
  function V(n2, ...t2) {
    for (const e2 of N2.get(n2) || []) e2(...t2);
  }
  function q2(n2) {
    return g = 0, n2 ? w2 = setTimeout((() => {
      x2();
    }), n2) : x2(), F;
  }
  function x2() {
    a2 = i$7.Running, V("start", v2, O2);
  }
  function A2() {
    if (a2 = i$7.Completed, C = {}, V("end", v2), a2 === i$7.Completed) if (l2 < L) {
      if (l2++, D2 === r$4.Reverse) {
        const n2 = Object.assign({}, j2);
        j2 = Object.assign({}, O2), O2 = n2;
      }
      q2(I2);
    } else l2 = 0;
    return F;
  }
  const F = { getState: function() {
    return a2;
  }, easing: function(n2) {
    return p2 = n2, f2 = o$7.Ease, C = {}, F;
  }, duration: function(n2) {
    return m2 = n2, F;
  }, spring: function(n2 = {}) {
    f2 = o$7.Spring;
    const t2 = { velocity: 0, mass: 1, tension: 170, friction: 26, restDelta: 0.1, restSpeed: 0.1, maxSpeed: 1 / 0, clamp: true }, { velocity: e2, mass: i2, tension: r2, friction: s2, restDelta: u2, restSpeed: a3, maxSpeed: c2, clamp: l3 } = Object.assign(Object.assign({}, t2), n2);
    return d2 = e2, b2 = i2, S = r2, h2 = s2, R2 = u2, E2 = a3, y2 = c2, M2 = l3, C = {}, F;
  }, isRunning: function() {
    return a2 === i$7.Running;
  }, isSpring: function() {
    return f2 === o$7.Spring;
  }, from: function(n2) {
    return v2 = Object.assign({}, n2), F;
  }, to: function(n2) {
    return O2 = n2, F;
  }, repeat: function(n2, t2 = 0, e2 = r$4.Loop, i2) {
    return L = n2, I2 = t2, D2 = e2, z2 = i2 || p2, F;
  }, on: function(n2, t2) {
    var e2, i2;
    return e2 = n2, i2 = t2, N2.set(e2, [...N2.get(e2) || [], i2]), F;
  }, off: function(n2, t2) {
    var e2, i2;
    return e2 = n2, i2 = t2, N2.has(e2) && N2.set(e2, N2.get(e2).filter(((n3) => n3 !== i2))), F;
  }, start: function(n2) {
    return n$7(v2, O2) || (a2 = i$7.Initializing, j2 = Object.assign({}, v2), s$6.add(this), u$3 || (u$3 = window.requestAnimationFrame(e$5)), q2(n2)), F;
  }, pause: function() {
    return w2 && (clearTimeout(w2), w2 = null), a2 === i$7.Running && (a2 = i$7.Paused, V("pause", v2)), F;
  }, end: A2, tick: function(e2) {
    e2 > 50 && (e2 = 50), g += e2;
    let s2 = 0, u2 = false;
    if (a2 !== i$7.Running) return F;
    if (f2 === o$7.Ease) {
      s2 = t$4(0, g / m2, 1), u2 = 1 === s2;
      const t2 = D2 === r$4.Reverse ? z2 : p2;
      for (const n2 in v2) v2[n2] = j2[n2] + (O2[n2] - j2[n2]) * t2(s2);
    }
    if (f2 === o$7.Spring) {
      const t2 = 1e-3 * e2;
      let i2 = 0;
      for (const e3 in v2) {
        const o2 = O2[e3];
        let r2 = v2[e3];
        if ("number" != typeof o2 || isNaN(o2) || "number" != typeof r2 || isNaN(r2)) continue;
        if (Math.abs(o2 - r2) <= R2) {
          v2[e3] = o2, C[e3] = 0;
          continue;
        }
        C[e3] || ("object" == typeof d2 && "number" == typeof d2[e3] ? C[e3] = d2[e3] : C[e3] = "number" == typeof d2 ? d2 : 0);
        let s3 = C[e3];
        s3 = t$4(-1 * Math.abs(y2), s3, Math.abs(y2));
        const u3 = s3 * b2 * h2;
        s3 += ((r2 > o2 ? -1 : 1) * (Math.abs(o2 - r2) * S) - u3) / b2 * t2, r2 += s3 * t2;
        const a3 = v2[e3] > o2 ? r2 < o2 : r2 > o2;
        let c3 = Math.abs(s3) < E2 && Math.abs(o2 - r2) <= R2;
        M2 && a3 && (c3 = true), c3 ? (r2 = o2, s3 = 0) : i2++, v2[e3] = r2, C[e3] = s3;
      }
      u2 = !i2;
    }
    const c2 = Object.assign({}, O2);
    return V("step", v2, j2, O2, s2), u2 && a2 === i$7.Running && n$7(O2, c2) && (a2 = i$7.Completed, A2()), F;
  }, getStartValues: function() {
    return j2;
  }, getCurrentValues: function() {
    return v2;
  }, getCurrentVelocities: function() {
    return C;
  }, getEndValues: function() {
    return O2;
  }, destroy: function() {
    a2 = i$7.Destroyed, w2 && (clearTimeout(w2), w2 = null), j2 = v2 = O2 = {}, s$6.delete(this);
  } };
  return F;
}
c$3.destroy = () => {
  for (const n2 of s$6) n2.destroy();
  u$3 && (cancelAnimationFrame(u$3), u$3 = null);
}, c$3.Easings = { Linear: function(n2) {
  return n2;
}, EaseIn: function(n2) {
  return 0 === n2 ? 0 : Math.pow(2, 10 * n2 - 10);
}, EaseOut: function(n2) {
  return 1 === n2 ? 1 : 1 - Math.pow(2, -10 * n2);
}, EaseInOut: function(n2) {
  return 0 === n2 ? 0 : 1 === n2 ? 1 : n2 < 0.5 ? Math.pow(2, 20 * n2 - 10) / 2 : (2 - Math.pow(2, -20 * n2 + 10)) / 2;
} };
function e$4(e2) {
  return "undefined" != typeof TouchEvent && e2 instanceof TouchEvent;
}
function t$2(t2, n2) {
  const o2 = [], s2 = e$4(t2) ? t2[n2] : t2 instanceof MouseEvent && ("changedTouches" === n2 || "mouseup" !== t2.type) ? [t2] : [];
  for (const e2 of s2) o2.push({ x: e2.clientX, y: e2.clientY, ts: Date.now() });
  return o2;
}
function n$6(e2) {
  return t$2(e2, "touches");
}
function o$6(e2) {
  return t$2(e2, "targetTouches");
}
function s$5(e2) {
  return t$2(e2, "changedTouches");
}
function i$6(e2) {
  const t2 = e2[0], n2 = e2[1] || t2;
  return { x: (t2.x + n2.x) / 2, y: (t2.y + n2.y) / 2, ts: n2.ts };
}
function r$3(e2) {
  const t2 = e2[0], n2 = e2[1] || e2[0];
  return t2 && n2 ? -1 * Math.sqrt((n2.x - t2.x) * (n2.x - t2.x) + (n2.y - t2.y) * (n2.y - t2.y)) : 0;
}
const c$2 = (e2) => {
  e2.cancelable && e2.preventDefault();
}, a$5 = { passive: false }, u$2 = { panThreshold: 5, swipeThreshold: 3, ignore: ["textarea", "input", "select", "[contenteditable]", "[data-selectable]", "[data-draggable]"] };
let l$6 = false, d$1 = true;
const f$1 = (e2, t2) => {
  let f2, h2, v2, g = Object.assign(Object.assign({}, u$2), t2), p2 = [], m2 = [], E2 = [], w2 = false, y2 = false, T = false, b2 = false, M2 = 0, x2 = 0, L = 0, P = 0, D2 = 0, X = 0, Y = 0, j2 = 0, k2 = 0, R2 = [], z2 = 0, A2 = 0;
  const O2 = /* @__PURE__ */ new Map();
  function S(e3) {
    const t3 = r$3(m2), n2 = r$3(E2), o2 = t3 && n2 ? t3 / n2 : 0, s2 = Math.abs(Y) > Math.abs(j2) ? Y : j2, i2 = { srcEvent: f2, isPanRecognized: w2, isSwipeRecognized: y2, firstTouch: p2, previousTouch: E2, currentTouch: m2, deltaX: L, deltaY: P, offsetX: D2, offsetY: X, velocityX: Y, velocityY: j2, velocity: s2, angle: k2, axis: v2, scale: o2, center: h2 };
    for (const t4 of O2.get(e3) || []) t4(i2);
  }
  function q2(e3) {
    const t3 = e3.target, n2 = e3.composedPath()[0], o2 = g.ignore.join(","), s2 = (e4) => e4 && (e4.matches(o2) || e4.closest(o2));
    if (s2(t3) || s2(n2)) return false;
  }
  function C(e3) {
    const t3 = Date.now();
    if (R2 = R2.filter(((e4) => !e4.ts || e4.ts > t3 - 100)), e3 && R2.push(e3), Y = 0, j2 = 0, R2.length > 3) {
      const e4 = R2[0], t4 = R2[R2.length - 1];
      if (e4 && t4) {
        const n2 = t4.x - e4.x, o2 = t4.y - e4.y, s2 = e4.ts && t4.ts ? t4.ts - e4.ts : 0;
        s2 > 0 && (Y = Math.abs(n2) > 3 ? n2 / (s2 / 30) : 0, j2 = Math.abs(o2) > 3 ? o2 / (s2 / 30) : 0);
      }
    }
  }
  function I2(e3) {
    if (false === q2(e3)) return;
    if ("undefined" != typeof MouseEvent && e3 instanceof MouseEvent) {
      if (l$6) return;
    } else l$6 = true;
    if ("undefined" != typeof MouseEvent && e3 instanceof MouseEvent) {
      if (!e3.buttons || 0 !== e3.button) return;
      c$2(e3);
    }
    e3 instanceof MouseEvent && (window.addEventListener("mousemove", B2), window.addEventListener("mouseup", F)), window.addEventListener("blur", G), f2 = e3, m2 = o$6(e3), p2 = [...m2], E2 = [], x2 = m2.length, h2 = i$6(m2), 1 === x2 && (w2 = false, y2 = false, T = false), x2 && C(i$6(m2));
    const t3 = Date.now(), n2 = t3 - (M2 || t3);
    b2 = n2 > 0 && n2 <= 250 && 1 === x2, M2 = t3, clearTimeout(z2), S("start");
  }
  function B2(e3) {
    var t3;
    if (!p2.length) return;
    if (e3.defaultPrevented) return;
    if (false === q2(e3)) return;
    f2 = e3, E2 = [...m2], m2 = n$6(e3);
    const o2 = i$6(E2), s2 = i$6(n$6(e3));
    if (C(s2), x2 = m2.length, h2 = s2, E2.length === m2.length ? (L = s2.x - o2.x, P = s2.y - o2.y) : (L = 0, P = 0), p2.length) {
      const e4 = i$6(p2);
      D2 = s2.x - e4.x, X = s2.y - e4.y;
    }
    if (m2.length > 1) {
      const e4 = r$3(m2), t4 = r$3(E2);
      Math.abs(e4 - t4) >= 0.1 && (T = true, S("pinch"));
    }
    w2 || (w2 = Math.abs(D2) > g.panThreshold || Math.abs(X) > g.panThreshold, w2 && (d$1 = false, clearTimeout(A2), A2 = 0, k2 = Math.abs(180 * Math.atan2(X, D2) / Math.PI), v2 = k2 > 45 && k2 < 135 ? "y" : "x", p2 = [...m2], E2 = [...m2], D2 = 0, X = 0, L = 0, P = 0, null === (t3 = window.getSelection()) || void 0 === t3 || t3.removeAllRanges(), S("panstart"))), w2 && (L || P) && S("pan"), S("move");
  }
  function F(e3) {
    if (f2 = e3, !p2.length) return;
    const t3 = o$6(e3), n2 = s$5(e3);
    if (x2 = t3.length, h2 = i$6(n2), n2.length && C(i$6(n2)), E2 = [...m2], m2 = [...t3], p2 = [...t3], x2 > 0) S("end"), w2 = false, y2 = false, R2 = [];
    else {
      const e4 = g.swipeThreshold;
      (Math.abs(Y) > e4 || Math.abs(j2) > e4) && (y2 = true), w2 && S("panend"), y2 && S("swipe"), w2 || y2 || T || (S("tap"), b2 ? S("doubleTap") : z2 = setTimeout((function() {
        S("singleTap");
      }), 250)), S("end"), H2();
    }
  }
  function G() {
    clearTimeout(z2), H2(), w2 && S("panend"), S("end");
  }
  function H2() {
    l$6 = false, w2 = false, y2 = false, b2 = false, x2 = 0, R2 = [], m2 = [], E2 = [], p2 = [], L = 0, P = 0, D2 = 0, X = 0, Y = 0, j2 = 0, k2 = 0, v2 = void 0, window.removeEventListener("mousemove", B2), window.removeEventListener("mouseup", F), window.removeEventListener("blur", G), d$1 || A2 || (A2 = setTimeout((() => {
      d$1 = true, A2 = 0;
    }), 100));
  }
  function J(e3) {
    const t3 = e3.target;
    l$6 = false, t3 && !e3.defaultPrevented && (d$1 || (c$2(e3), e3.stopPropagation()));
  }
  const K = { init: function() {
    return e2 && (e2.addEventListener("click", J, a$5), e2.addEventListener("mousedown", I2, a$5), e2.addEventListener("touchstart", I2, a$5), e2.addEventListener("touchmove", B2, a$5), e2.addEventListener("touchend", F), e2.addEventListener("touchcancel", F)), K;
  }, on: function(e3, t3) {
    return (function(e4, t4) {
      O2.set(e4, [...O2.get(e4) || [], t4]);
    })(e3, t3), K;
  }, off: function(e3, t3) {
    return O2.has(e3) && O2.set(e3, O2.get(e3).filter(((e4) => e4 !== t3))), K;
  }, isPointerDown: () => x2 > 0, destroy: function() {
    clearTimeout(z2), clearTimeout(A2), A2 = 0, e2 && (e2.removeEventListener("click", J, a$5), e2.removeEventListener("mousedown", I2, a$5), e2.removeEventListener("touchstart", I2, a$5), e2.removeEventListener("touchmove", B2, a$5), e2.removeEventListener("touchend", F), e2.removeEventListener("touchcancel", F)), e2 = null, H2();
  } };
  return K;
};
f$1.isClickAllowed = () => d$1;
const e$3 = { IMAGE_ERROR: "This image couldn't be loaded. <br /> Please try again later.", MOVE_UP: "Move up", MOVE_DOWN: "Move down", MOVE_LEFT: "Move left", MOVE_RIGHT: "Move right", ZOOM_IN: "Zoom in", ZOOM_OUT: "Zoom out", TOGGLE_FULL: "Toggle zoom level", TOGGLE_1TO1: "Toggle zoom level", ITERATE_ZOOM: "Toggle zoom level", ROTATE_CCW: "Rotate counterclockwise", ROTATE_CW: "Rotate clockwise", FLIP_X: "Flip horizontally", FLIP_Y: "Flip vertically", RESET: "Reset", TOGGLE_FS: "Toggle fullscreen" };
const h$1 = (e2) => {
  e2.cancelable && e2.preventDefault();
}, m$1 = (e2, t2 = 1e4) => (e2 = parseFloat(e2 + "") || 0, Math.round((e2 + Number.EPSILON) * t2) / t2), p = (e2) => e2 instanceof HTMLImageElement;
var v$1, b$1;
!(function(e2) {
  e2.Reset = "reset", e2.Zoom = "zoom", e2.ZoomIn = "zoomIn", e2.ZoomOut = "zoomOut", e2.ZoomTo = "zoomTo", e2.ToggleCover = "toggleCover", e2.ToggleFull = "toggleFull", e2.ToggleMax = "toggleMax", e2.IterateZoom = "iterateZoom", e2.Pan = "pan", e2.Swipe = "swipe", e2.Move = "move", e2.MoveLeft = "moveLeft", e2.MoveRight = "moveRight", e2.MoveUp = "moveUp", e2.MoveDown = "moveDown", e2.RotateCCW = "rotateCCW", e2.RotateCW = "rotateCW", e2.FlipX = "flipX", e2.FlipY = "flipY", e2.ToggleFS = "toggleFS";
})(v$1 || (v$1 = {})), (function(e2) {
  e2.Cover = "cover", e2.Full = "full", e2.Max = "max";
})(b$1 || (b$1 = {}));
const y$1 = { x: 0, y: 0, scale: 1, angle: 0, flipX: 1, flipY: 1 }, x = { bounds: true, classes: { container: "f-panzoom", wrapper: "f-panzoom__wrapper", content: "f-panzoom__content", viewport: "f-panzoom__viewport" }, clickAction: v$1.ToggleFull, dblClickAction: false, gestures: {}, height: "auto", l10n: e$3, maxScale: 4, minScale: 1, mouseMoveFactor: 1, panMode: "drag", protected: false, singleClickAction: false, spinnerTpl: '<div class="f-spinner"></div>', wheelAction: v$1.Zoom, width: "auto" };
let w, M$1 = 0, k$1 = 0, j = 0;
const E$1 = (c2, b2 = {}, E2 = {}) => {
  let S, O2, A2, C, T, F, Z, L, P = 0, X = Object.assign(Object.assign({}, x), b2), Y = {}, R2 = Object.assign({}, y$1), z2 = Object.assign({}, y$1);
  const D2 = [];
  function I2(e2) {
    let t2 = X[e2];
    return t2 && "function" == typeof t2 ? t2(je) : t2;
  }
  function W() {
    return c2 && c2.parentElement && S && 3 === P;
  }
  const q2 = /* @__PURE__ */ new Map();
  function H2(e2, ...t2) {
    const n2 = [...q2.get(e2) || []];
    X.on && n2.push(X.on[e2]);
    for (const e3 of n2) e3 && e3 instanceof Function && e3(je, ...t2);
    "*" !== e2 && H2("*", e2, ...t2);
  }
  function $(e2) {
    if (!W()) return;
    const t2 = e2.target;
    if (n$8(t2)) return;
    const o2 = Date.now(), a2 = [-e2.deltaX || 0, -e2.deltaY || 0, -e2.detail || 0].reduce((function(e3, t3) {
      return Math.abs(t3) > Math.abs(e3) ? t3 : e3;
    })), s2 = t$4(-1, a2, 1);
    H2("wheel", e2, s2);
    const r2 = I2("wheelAction");
    if (!r2) return;
    if (e2.defaultPrevented) return;
    const l2 = z2.scale;
    let c3 = l2 * (s2 > 0 ? 1.5 : 0.5);
    if (r2 === v$1.Zoom) {
      const t3 = Math.abs(e2.deltaY) < 100 && Math.abs(e2.deltaX) < 100;
      if (o2 - k$1 < (t3 ? 200 : 45)) return void h$1(e2);
      k$1 = o2;
      const n2 = ne(), a3 = se();
      if (m$1(c3) < m$1(n2) && m$1(l2) <= m$1(n2) ? (j += Math.abs(s2), c3 = n2) : m$1(c3) > m$1(a3) && m$1(l2) >= m$1(a3) ? (j += Math.abs(s2), c3 = a3) : (j = 0, c3 = t$4(n2, c3, a3)), j > 7) return;
    }
    switch (h$1(e2), r2) {
      case v$1.Pan:
        ue(r2, { srcEvent: e2, deltaX: 2 * -e2.deltaX, deltaY: 2 * -e2.deltaY });
        break;
      case v$1.Zoom:
        ue(v$1.ZoomTo, { srcEvent: e2, scale: c3, center: { x: e2.clientX, y: e2.clientY } });
        break;
      default:
        ue(r2, { srcEvent: e2 });
    }
  }
  function _2(e2) {
    var n2, o2;
    const i2 = e2.composedPath()[0];
    if (!f$1.isClickAllowed()) return;
    if (!n$9(i2) || e2.defaultPrevented) return;
    if (!(null == c2 ? void 0 : c2.contains(i2))) return;
    if (i2.hasAttribute("disabled") || i2.hasAttribute("aria-disabled") || i2.hasAttribute("data-carousel-go-prev") || i2.hasAttribute("data-carousel-go-next")) return;
    const a2 = i2.closest("[data-panzoom-action]"), s2 = null === (n2 = null == a2 ? void 0 : a2.dataset) || void 0 === n2 ? void 0 : n2.panzoomAction, r2 = (null === (o2 = null == a2 ? void 0 : a2.dataset) || void 0 === o2 ? void 0 : o2.panzoomValue) || "";
    if (s2) {
      switch (h$1(e2), s2) {
        case v$1.ZoomTo:
        case v$1.ZoomIn:
        case v$1.ZoomOut:
          ue(s2, { scale: parseFloat(r2 || "") || void 0 });
          break;
        case v$1.MoveLeft:
        case v$1.MoveRight:
          ue(s2, { deltaX: parseFloat(r2 || "") || void 0 });
          break;
        case v$1.MoveUp:
        case v$1.MoveDown:
          ue(s2, { deltaY: parseFloat(r2 || "") || void 0 });
          break;
        case v$1.ToggleFS:
          Me();
          break;
        default:
          ue(s2);
      }
      return;
    }
    if (!(null == S ? void 0 : S.contains(i2))) return;
    const u2 = { srcEvent: e2 };
    if (ue(I2("clickAction"), u2), I2("dblClickAction")) {
      const e3 = Date.now(), t2 = e3 - (M$1 || e3);
      M$1 = e3, t2 > 0 && t2 <= 250 ? (w && (clearTimeout(w), w = void 0), ue(I2("dblClickAction"), u2)) : w = setTimeout((() => {
        ue(I2("singleClickAction"), u2);
      }), 250);
    }
  }
  function B2(e2) {
    if (L = e2, !W() || !Q()) return;
    if (R2.scale <= 1 || z2.scale <= 1) return;
    if (((null == S ? void 0 : S.dataset.animationName) || "").indexOf("zoom") > -1) return;
    const t2 = ee(z2.scale);
    if (!t2) return;
    const { x: n2, y: o2 } = t2;
    ue(v$1.Pan, { deltaX: n2 - z2.x, deltaY: o2 - z2.y });
  }
  function N2() {
    var e2;
    c2 && (s$8(c2, "is-loading"), null === (e2 = c2.querySelector(".f-spinner")) || void 0 === e2 || e2.remove());
  }
  function V() {
    if (!c2 || !O2) return;
    if (N2(), p(O2) && (!O2.complete || !O2.naturalWidth)) return P = 2, null == S || S.classList.add("has-error"), void H2("error");
    H2("loaded");
    const { width: e2, height: t2 } = J();
    p(O2) && (O2.setAttribute("width", e2 + ""), O2.setAttribute("height", t2 + "")), S && (s$8(S, "has-error"), p(O2) && (S.setAttribute("width", e2 + ""), S.setAttribute("height", t2 + ""), S.style.aspectRatio = `${e2 / t2 || ""}`)), F = c$3().on("start", ((e3, t3) => {
      void 0 !== t3.angle && (t3.angle = 90 * Math.round(t3.angle / 90)), void 0 !== t3.flipX && (t3.flipX = t3.flipX > 0 ? 1 : -1), void 0 !== t3.flipY && (t3.flipY = t3.flipY > 0 ? 1 : -1), z2 = Object.assign(Object.assign({}, y$1), t3), ce(), H2("animationStart");
    })).on("pause", ((e3) => {
      z2 = Object.assign(Object.assign({}, y$1), e3);
    })).on("step", ((e3) => {
      if (!W()) return void (null == F || F.end());
      if (R2 = Object.assign(Object.assign({}, y$1), e3), Q() || !I2("bounds") || ye() || z2.scale > R2.scale || z2.scale < oe()) return void de();
      const t3 = re(z2.scale);
      let n3 = false, o2 = false, a2 = false, s2 = false;
      R2.x < t3.x[0] && (n3 = true), R2.x > t3.x[1] && (o2 = true), R2.y < t3.y[0] && (s2 = true), R2.y > t3.y[1] && (a2 = true);
      let r2 = false, l2 = false, c3 = false, u2 = false;
      z2.x < t3.x[0] && (r2 = true), z2.x > t3.x[1] && (l2 = true), z2.y < t3.y[0] && (u2 = true), z2.y > t3.y[1] && (c3 = true);
      let d2 = false;
      (o2 && l2 || n3 && r2) && (z2.x = t$4(t3.x[0], z2.x, t3.x[1]), d2 = true), (a2 && c3 || s2 && u2) && (z2.y = t$4(t3.y[0], z2.y, t3.y[1]), d2 = true), d2 && F && F.spring({ tension: 94, friction: 17, maxSpeed: 555 * z2.scale, restDelta: 0.1, restSpeed: 0.1, velocity: F.getCurrentVelocities() }).from(R2).to(z2).start(), de();
    })).on("end", (() => {
      (null == T ? void 0 : T.isPointerDown()) || le(), (null == F ? void 0 : F.isRunning()) || (ce(), H2("animationEnd"));
    })), (function() {
      const e3 = I2("gestures");
      if (!e3) return;
      if (!C || !O2) return;
      let t3 = false;
      T = f$1(C, e3).on("start", ((e4) => {
        if (!I2("gestures")) return;
        if (!F) return;
        if (!W() || Q()) return;
        const n3 = e4.srcEvent;
        (R2.scale > 1 || e4.currentTouch.length > 1) && (null == n3 || n3.stopPropagation(), F.pause(), t3 = true), 1 === e4.currentTouch.length && H2("touchStart");
      })).on("move", ((e4) => {
        var n3;
        t3 && (1 !== z2.scale || e4.currentTouch.length > 1) && (h$1(e4.srcEvent), null === (n3 = e4.srcEvent) || void 0 === n3 || n3.stopPropagation());
      })).on("pan", ((e4) => {
        if (!t3) return;
        const n3 = e4.srcEvent;
        (1 !== z2.scale || e4.currentTouch.length > 1) && (h$1(n3), ue(v$1.Pan, e4));
      })).on("swipe", ((e4) => {
        t3 && z2.scale > 1 && ue(v$1.Swipe, e4);
      })).on("tap", ((e4) => {
        H2("click", e4);
      })).on("singleTap", ((e4) => {
        H2("singleClick", e4);
      })).on("doubleTap", ((e4) => {
        H2("dblClick", e4);
      })).on("pinch", ((e4) => {
        t3 && (e4.scale > oe() ? ue(v$1.ZoomIn, e4) : e4.scale < oe() ? ue(v$1.ZoomOut, e4) : ue(v$1.Pan, e4));
      })).on("end", ((e4) => {
        t3 && (e4.currentTouch.length ? (e4.srcEvent.stopPropagation(), h$1(e4.srcEvent), null == F || F.end()) : (t3 = false, ce(), le(), H2("touchEnd")));
      })).init();
    })(), C && (C.addEventListener("wheel", $, { passive: false }), D2.push((() => {
      null == C || C.removeEventListener("wheel", $, { passive: false });
    }))), null == c2 || c2.addEventListener("click", _2), null === document || void 0 === document || document.addEventListener("mousemove", B2), D2.push((() => {
      null == c2 || c2.removeEventListener("click", _2), null === document || void 0 === document || document.removeEventListener("mousemove", B2);
    }));
    const n2 = U();
    R2 = Object.assign({}, n2), z2 = Object.assign({}, n2), P = 3, de(), ce(), H2("ready"), requestAnimationFrame((() => {
      N2(), C && (C.style.visibility = "");
    }));
  }
  function U() {
    const e2 = Object.assign({}, I2("startPos") || {});
    let t2 = e2.scale, n2 = 1;
    n2 = "string" == typeof t2 ? te(t2) : "number" == typeof t2 ? t2 : oe();
    const o2 = Object.assign(Object.assign(Object.assign({}, y$1), e2), { scale: n2 }), i2 = Q() ? ee(n2) : void 0;
    if (i2) {
      const { x: e3, y: t3 } = i2;
      o2.x = e3, o2.y = t3;
    }
    return o2;
  }
  function G() {
    const e2 = { top: 0, left: 0, width: 0, height: 0 };
    if (S) {
      const t2 = S.getBoundingClientRect();
      z2.angle % 180 == 90 ? (e2.top = t2.top + 0.5 * t2.height - 0.5 * t2.width, e2.left = t2.left + 0.5 * t2.width - 0.5 * t2.height, e2.width = t2.height, e2.height = t2.width) : (e2.top = t2.top, e2.left = t2.left, e2.width = t2.width, e2.height = t2.height);
    }
    return e2;
  }
  function J() {
    let t2 = I2("width"), n2 = I2("height");
    if (O2 && "auto" === t2) {
      const e2 = O2.getAttribute("width");
      t2 = e2 ? parseFloat(e2 + "") : void 0 !== O2.dataset.width ? parseFloat(O2.dataset.width + "") : p(C) ? C.naturalWidth : p(O2) ? O2.naturalWidth : (null == S ? void 0 : S.getBoundingClientRect().width) || 0;
    } else t2 = t$6(t2) ? parseFloat(t2) : t2;
    if (O2 && "auto" === n2) {
      const e2 = O2.getAttribute("height");
      n2 = e2 ? parseFloat(e2 + "") : void 0 !== O2.dataset.height ? parseFloat(O2.dataset.height + "") : p(C) ? C.naturalHeight : p(O2) ? O2.naturalHeight : (null == S ? void 0 : S.getBoundingClientRect().height) || 0;
    } else n2 = t$6(n2) ? parseFloat(n2) : n2;
    return { width: t2, height: n2 };
  }
  function K() {
    const e2 = G();
    return { width: e2.width, height: e2.height };
  }
  function Q() {
    return "mousemove" === I2("panMode") && matchMedia("(hover: hover)").matches;
  }
  function ee(e2) {
    const t2 = L || I2("event"), n2 = null == S ? void 0 : S.getBoundingClientRect();
    if (!t2 || !n2 || e2 <= 1) return { x: 0, y: 0 };
    const o2 = (t2.clientX || 0) - n2.left, a2 = (t2.clientY || 0) - n2.top, { width: s2, height: r2 } = K(), l2 = re(e2);
    if (e2 > 1) {
      const t3 = I2("mouseMoveFactor");
      t3 > 1 && (e2 *= t3);
    }
    let c3 = s2 * e2, u2 = r2 * e2, d2 = 0.5 * (c3 - s2) - o2 / s2 * 100 / 100 * (c3 - s2), f2 = 0.5 * (u2 - r2) - a2 / r2 * 100 / 100 * (u2 - r2);
    return d2 = t$4(l2.x[0], d2, l2.x[1]), f2 = t$4(l2.y[0], f2, l2.y[1]), { x: d2, y: f2 };
  }
  function te(e2 = "base") {
    if (!c2) return 1;
    const t2 = c2.getBoundingClientRect(), n2 = G(), { width: o2, height: a2 } = J(), s2 = (e3) => {
      if ("number" == typeof e3) return e3;
      switch (e3) {
        case "min":
        case "base":
          return 1;
        case "cover":
          return Math.max(t2.height / n2.height, t2.width / n2.width) || 1;
        case "full":
        case "max": {
          const e4 = z2.angle % 180 == 90 ? a2 : o2;
          return e4 && n2.width ? e4 / n2.width : 1;
        }
      }
    }, r2 = I2("minScale"), l2 = I2("maxScale"), u2 = Math.min(s2("full"), s2(r2)), d2 = "number" == typeof l2 ? s2("full") * l2 : Math.min(s2("full"), s2(l2));
    switch (e2) {
      case "min":
        return u2;
      case "base":
        return t$4(u2, 1, d2);
      case "cover":
        return s2("cover");
      case "full":
        return Math.min(d2, s2("full"));
      case "max":
        return d2;
    }
  }
  function ne() {
    return te("min");
  }
  function oe() {
    return te("base");
  }
  function ie() {
    return te("cover");
  }
  function ae() {
    return te("full");
  }
  function se() {
    return te("max");
  }
  function re(e2) {
    const t2 = { x: [0, 0], y: [0, 0] }, n2 = null == c2 ? void 0 : c2.getBoundingClientRect();
    if (!n2) return t2;
    const o2 = G(), i2 = n2.width, a2 = n2.height;
    let s2 = o2.width, r2 = o2.height, l2 = e2 = void 0 === e2 ? z2.scale : e2, u2 = e2;
    if (Q() && e2 > 1) {
      const t3 = I2("mouseMoveFactor");
      t3 > 1 && (s2 * e2 > i2 + 0.01 && (l2 *= t3), r2 * e2 > a2 + 0.01 && (u2 *= t3));
    }
    return s2 *= l2, r2 *= u2, e2 > 1 && (s2 > i2 && (t2.x[0] = 0.5 * (i2 - s2), t2.x[1] = 0.5 * (s2 - i2)), t2.x[0] -= 0.5 * (o2.left - n2.left), t2.x[1] -= 0.5 * (o2.left - n2.left), t2.x[0] -= 0.5 * (o2.left + o2.width - n2.right), t2.x[1] -= 0.5 * (o2.left + o2.width - n2.right), r2 > a2 && (t2.y[0] = 0.5 * (a2 - r2), t2.y[1] = 0.5 * (r2 - a2)), t2.y[0] -= 0.5 * (o2.top - n2.top), t2.y[1] -= 0.5 * (o2.top - n2.top), t2.y[0] -= 0.5 * (o2.top + o2.height - n2.bottom), t2.y[1] -= 0.5 * (o2.top + o2.height - n2.bottom)), t2;
  }
  function le() {
    if (!W()) return;
    if (!I2("bounds")) return;
    if (!F) return;
    const e2 = ne(), t2 = se(), n2 = t$4(e2, z2.scale, t2);
    if (z2.scale < e2 - 0.01 || z2.scale > t2 + 0.01) return void ue(v$1.ZoomTo, { scale: n2 });
    if (F.isRunning()) return;
    if (ye()) return;
    const o2 = re(n2);
    z2.x < o2.x[0] || z2.x > o2.x[1] || z2.y < o2.y[0] || z2.y > o2.y[1] ? (z2.x = t$4(o2.x[0], z2.x, o2.x[1]), z2.y = t$4(o2.y[0], z2.y, o2.y[1]), F.spring({ tension: 170, friction: 17, restDelta: 1e-3, restSpeed: 1e-3, maxSpeed: 1 / 0, velocity: F.getCurrentVelocities() }), F.from(R2).to(z2).start()) : de();
  }
  function ce(e2) {
    var t2;
    if (!W()) return;
    const n2 = be(), o2 = ye(), i2 = xe(), a2 = we(), s2 = ge(), r2 = he();
    s$7(S, "is-fullsize", a2), s$7(S, "is-expanded", i2), s$7(S, "is-dragging", o2), s$7(S, "can-drag", n2), s$7(S, "will-zoom-in", s2), s$7(S, "will-zoom-out", r2);
    const l2 = pe(), u2 = ve(), d2 = me(), g = !W();
    for (const n3 of (null === (t2 = e2 || c2) || void 0 === t2 ? void 0 : t2.querySelectorAll("[data-panzoom-action]")) || []) {
      const e3 = n3.dataset.panzoomAction;
      let t3 = false;
      if (g) t3 = true;
      else switch (e3) {
        case v$1.ZoomIn:
          l2 || (t3 = true);
          break;
        case v$1.ZoomOut:
          d2 || (t3 = true);
          break;
        case v$1.ToggleFull: {
          u2 || d2 || (t3 = true);
          const e4 = n3.querySelector("g");
          e4 && (e4.style.display = a2 && !t3 ? "none" : "");
          break;
        }
        case v$1.IterateZoom: {
          l2 || d2 || (t3 = true);
          const e4 = n3.querySelector("g");
          e4 && (e4.style.display = l2 || t3 ? "" : "none");
          break;
        }
        case v$1.ToggleCover:
        case v$1.ToggleMax:
          l2 || d2 || (t3 = true);
      }
      t3 ? (n3.setAttribute("aria-disabled", ""), n3.setAttribute("tabindex", "-1")) : (n3.removeAttribute("aria-disabled"), n3.removeAttribute("tabindex"));
    }
  }
  function ue(e2, t2) {
    var n2;
    if (!(e2 && c2 && O2 && F && W())) return;
    if (e2 === v$1.Swipe && Math.abs(F.getCurrentVelocities().scale) > 0.01) return;
    const o2 = Object.assign({}, z2);
    let a2 = Object.assign({}, z2), l2 = re(Q() ? o2.scale : R2.scale);
    const u2 = F.getCurrentVelocities(), d2 = G(), f2 = ((null === (n2 = (t2 = t2 || {}).currentTouch) || void 0 === n2 ? void 0 : n2.length) || 0) > 1, h2 = t2.velocityX || 0, m2 = t2.velocityY || 0;
    let p2 = t2.center;
    t2.srcEvent && (p2 = i$6(s$5(t2.srcEvent)));
    let b3 = t2.deltaX || 0, x2 = t2.deltaY || 0;
    switch (e2) {
      case v$1.MoveRight:
        b3 = t2.deltaX || 100;
        break;
      case v$1.MoveLeft:
        b3 = t2.deltaX || -100;
        break;
      case v$1.MoveUp:
        x2 = t2.deltaY || -100;
        break;
      case v$1.MoveDown:
        x2 = t2.deltaY || 100;
    }
    let w2 = [];
    switch (e2) {
      case v$1.Reset:
        a2 = Object.assign({}, y$1), a2.scale = oe();
        break;
      case v$1.Pan:
      case v$1.Move:
      case v$1.MoveLeft:
      case v$1.MoveRight:
      case v$1.MoveUp:
      case v$1.MoveDown:
        if (ye()) {
          let e4 = 1, t3 = 1;
          a2.x <= l2.x[0] && h2 <= 0 && (e4 = Math.max(0.01, 1 - Math.abs(1 / d2.width * Math.abs(a2.x - l2.x[0]))), e4 *= 0.2), a2.x >= l2.x[1] && h2 >= 0 && (e4 = Math.max(0.01, 1 - Math.abs(1 / d2.width * Math.abs(a2.x - l2.x[1]))), e4 *= 0.2), a2.y <= l2.y[0] && m2 <= 0 && (t3 = Math.max(0.01, 1 - Math.abs(1 / d2.height * Math.abs(a2.y - l2.y[0]))), t3 *= 0.2), a2.y >= l2.y[1] && m2 >= 0 && (t3 = Math.max(0.01, 1 - Math.abs(1 / d2.height * Math.abs(a2.y - l2.y[1]))), t3 *= 0.2), a2.x += b3 * e4, a2.y += x2 * t3;
        } else a2.x = t$4(l2.x[0], a2.x + b3, l2.x[1]), a2.y = t$4(l2.y[0], a2.y + x2, l2.y[1]);
        break;
      case v$1.Swipe:
        const e3 = (e4 = 0) => Math.sign(e4) * Math.pow(Math.abs(e4), 1.5);
        a2.x += t$4(-1e3, e3(h2), 1e3), a2.y += t$4(-1e3, e3(m2), 1e3), m2 && !h2 && (a2.x = t$4(l2.x[0], a2.x, l2.x[1])), !m2 && h2 && (a2.y = t$4(l2.y[0], a2.y, l2.y[1])), u2.x = h2, u2.y = m2;
        break;
      case v$1.ZoomTo:
        a2.scale = t2.scale || 1;
        break;
      case v$1.ZoomIn:
        a2.scale = a2.scale * (t2.scale || 2), f2 || (a2.scale = Math.min(a2.scale, se()));
        break;
      case v$1.ZoomOut:
        a2.scale = a2.scale * (t2.scale || 0.5), f2 || (a2.scale = Math.max(a2.scale, ne()));
        break;
      case v$1.ToggleCover:
        w2 = [oe(), ie()];
        break;
      case v$1.ToggleFull:
        w2 = [oe(), ae()];
        break;
      case v$1.ToggleMax:
        w2 = [oe(), se()];
        break;
      case v$1.IterateZoom:
        w2 = [oe(), ae(), se()];
        break;
      case v$1.Zoom:
        const n3 = ae();
        a2.scale >= n3 - 0.05 ? a2.scale = oe() : a2.scale = Math.min(n3, a2.scale * (t2.scale || 2));
        break;
      case v$1.RotateCW:
        a2.angle += 90;
        break;
      case v$1.RotateCCW:
        a2.angle -= 90;
        break;
      case v$1.FlipX:
        a2.flipX *= -1;
        break;
      case v$1.FlipY:
        a2.flipY *= -1;
    }
    if (void 0 !== R2.angle && Math.abs(R2.angle) >= 360 && (a2.angle -= 360 * Math.floor(R2.angle / 360), R2.angle -= 360 * Math.floor(R2.angle / 360)), w2.length) {
      const e3 = w2.findIndex(((e4) => e4 > a2.scale + 1e-4));
      a2.scale = w2[e3] || w2[0];
    }
    if (f2 && (a2.scale = t$4(ne() * (f2 ? 0.8 : 1), a2.scale, se() * (f2 ? 1.6 : 1))), Q()) {
      const e3 = ee(a2.scale);
      if (e3) {
        const { x: t3, y: n3 } = e3;
        a2.x = t3, a2.y = n3;
      }
    } else if (Math.abs(a2.scale - o2.scale) > 1e-4) {
      let e3 = 0, t3 = 0;
      if (p2) e3 = p2.x, t3 = p2.y;
      else {
        const n4 = c2.getBoundingClientRect();
        e3 = n4.x + 0.5 * n4.width, t3 = n4.y + 0.5 * n4.height;
      }
      let n3 = e3 - d2.left, s2 = t3 - d2.top;
      n3 -= 0.5 * d2.width, s2 -= 0.5 * d2.height;
      const r2 = (n3 - o2.x) / o2.scale, u3 = (s2 - o2.y) / o2.scale;
      a2.x = n3 - r2 * a2.scale, a2.y = s2 - u3 * a2.scale, !f2 && I2("bounds") && (l2 = re(a2.scale), a2.x = t$4(l2.x[0], a2.x, l2.x[1]), a2.y = t$4(l2.y[0], a2.y, l2.y[1]));
    }
    if (e2 === v$1.Swipe) {
      let e3 = 94, t3 = 17, n3 = 500 * a2.scale, o3 = u2;
      F.spring({ tension: e3, friction: t3, maxSpeed: n3, restDelta: 0.1, restSpeed: 0.1, velocity: o3 });
    } else e2 === v$1.Pan || f2 ? F.spring({ tension: 900, friction: 17, restDelta: 0.01, restSpeed: 0.01, maxSpeed: 1 }) : F.spring({ tension: 170, friction: 17, restDelta: 1e-3, restSpeed: 1e-3, maxSpeed: 1 / 0, velocity: u2 });
    if (0 === t2.velocity || n$7(R2, a2)) R2 = Object.assign({}, a2), z2 = Object.assign({}, a2), F.end(), de(), ce();
    else {
      if (n$7(z2, a2)) return;
      F.from(R2).to(a2).start();
    }
    H2("action", e2);
  }
  function de() {
    if (!O2 || !S || !C) return;
    const { width: e2, height: t2 } = J();
    Object.assign(S.style, { maxWidth: `min(${e2}px, 100%)`, maxHeight: `min(${t2}px, 100%)` });
    const n2 = (function() {
      const { width: e3, height: t3 } = J(), { width: n3, height: o3 } = K();
      if (!c2) return { x: 0, y: 0, width: 0, height: 0, scale: 0, flipX: 0, flipY: 0, angle: 0, fitWidth: n3, fitHeight: o3, fullWidth: e3, fullHeight: t3 };
      let { x: i3, y: a3, scale: s3, angle: r3, flipX: l3, flipY: u3 } = R2, d3 = 1 / ae(), f3 = e3, g = t3, h2 = R2.scale * d3, m2 = z2.scale * d3;
      const p2 = Math.max(n3, o3), v2 = Math.min(n3, o3);
      e3 > t3 ? (f3 = p2, g = v2) : (f3 = v2, g = p2);
      h2 = e3 > t3 ? p2 * s3 / e3 || 1 : p2 * s3 / t3 || 1;
      let b3 = f3 ? e3 * m2 : 0, y2 = g ? t3 * m2 : 0, x2 = f3 && g ? e3 * h2 / b3 : 0;
      return i3 = i3 + 0.5 * f3 - 0.5 * b3, a3 = a3 + 0.5 * g - 0.5 * y2, { x: i3, y: a3, width: b3, height: y2, scale: x2, flipX: l3, flipY: u3, angle: r3, fitWidth: n3, fitHeight: o3, fullWidth: e3, fullHeight: t3 };
    })(), { x: o2, y: i2, width: a2, height: s2, scale: r2, angle: l2, flipX: u2, flipY: d2 } = n2;
    let f2 = `translate(${m$1(o2)}px, ${m$1(i2)}px)`;
    f2 += 1 !== u2 || 1 !== d2 ? ` scaleX(${m$1(r2 * u2)}) scaleY(${m$1(r2 * d2)})` : ` scale(${m$1(r2)})`, 0 !== l2 && (f2 += ` rotate(${l2}deg)`), C.style.width = `${m$1(a2)}px`, C.style.height = `${m$1(s2)}px`, C.style.transform = `${f2}`, H2("render");
  }
  function fe() {
    let e2 = z2.scale;
    const t2 = I2("clickAction");
    let n2 = oe();
    if (t2) {
      let o2 = [];
      switch (t2) {
        case v$1.ZoomIn:
          n2 = 2 * e2;
          break;
        case v$1.ZoomOut:
          n2 = 0.5 * e2;
          break;
        case v$1.ToggleCover:
          o2 = [oe(), ie()];
          break;
        case v$1.ToggleFull:
          o2 = [oe(), ae()];
          break;
        case v$1.ToggleMax:
          o2 = [oe(), se()];
          break;
        case v$1.IterateZoom:
          o2 = [oe(), ae(), se()];
          break;
        case v$1.Zoom:
          const t3 = ae();
          n2 = e2 >= t3 - 0.05 ? oe() : Math.min(t3, 2 * e2);
      }
      if (o2.length) {
        const t3 = o2.findIndex(((t4) => t4 > e2 + 1e-4));
        n2 = o2[t3] || oe();
      }
    }
    return n2 = t$4(ne(), n2, se()), n2;
  }
  function ge() {
    return !!(W() && fe() > z2.scale);
  }
  function he() {
    return !!(W() && fe() < z2.scale);
  }
  function me() {
    return !!(W() && z2.scale > ne());
  }
  function pe() {
    return !!(W() && z2.scale < se());
  }
  function ve() {
    return !!(W() && z2.scale < ae());
  }
  function be() {
    return !(!(W() && xe() && T) || Q());
  }
  function ye() {
    return !(!W() || !(null == T ? void 0 : T.isPointerDown()) || Q());
  }
  function xe() {
    return !!(W() && z2.scale > oe());
  }
  function we() {
    return !!(W() && z2.scale >= ae());
  }
  function Me() {
    const e2 = "in-fullscreen", t2 = "with-panzoom-in-fullscreen";
    null == c2 || c2.classList.toggle(e2);
    const n2 = null == c2 ? void 0 : c2.classList.contains(e2);
    n2 ? (document.documentElement.classList.add(t2), document.addEventListener("keydown", ke, true)) : (document.documentElement.classList.remove(t2), document.removeEventListener("keydown", ke, true)), de(), H2(n2 ? "enterFS" : "exitFS");
  }
  function ke(e2) {
    "Escape" !== e2.key || e2.defaultPrevented || Me();
  }
  const je = { canDrag: be, canZoomIn: pe, canZoomOut: me, canZoomToFull: ve, destroy: function() {
    H2("destroy");
    for (const e2 of Object.values(Y)) null == e2 || e2.destroy(je);
    for (const e2 of D2) e2();
    return S && (S.style.aspectRatio = "", S.style.maxWidth = "", S.style.maxHeight = ""), C && (C.style.width = "", C.style.height = "", C.style.transform = ""), S = void 0, O2 = void 0, C = void 0, R2 = Object.assign({}, y$1), z2 = Object.assign({}, y$1), null == F || F.destroy(), F = void 0, null == T || T.destroy(), T = void 0, P = 4, je;
  }, emit: H2, execute: ue, getBoundaries: re, getContainer: function() {
    return c2;
  }, getContent: function() {
    return O2;
  }, getFullDim: J, getGestures: function() {
    return T;
  }, getMousemovePos: ee, getOptions: function() {
    return X;
  }, getPlugins: function() {
    return Y;
  }, getScale: te, getStartPosition: U, getState: function() {
    return P;
  }, getTransform: function(e2) {
    return true === e2 ? z2 : R2;
  }, getTween: function() {
    return F;
  }, getViewport: function() {
    return C;
  }, getWrapper: function() {
    return S;
  }, init: function() {
    return P = 0, H2("init"), (function() {
      for (const [e2, t2] of Object.entries(Object.assign(Object.assign({}, E2), X.plugins || {}))) if (e2 && !Y[e2] && t2 instanceof Function) {
        const n2 = t2();
        n2.init(je), Y[e2] = n2;
      }
      H2("initPlugins");
    })(), (function() {
      const e2 = Object.assign(Object.assign({}, x.classes), I2("classes"));
      if (!c2) return;
      if (s$9(c2, e2.container), O2 = c2.querySelector("." + e2.content), !O2) return;
      O2.setAttribute("draggable", "false"), S = c2.querySelector("." + e2.wrapper), S || (S = document.createElement("div"), s$9(S, e2.wrapper), O2.insertAdjacentElement("beforebegin", S), S.insertAdjacentElement("afterbegin", O2));
      C = c2.querySelector("." + e2.viewport), C || (C = document.createElement("div"), s$9(C, e2.viewport), C.insertAdjacentElement("afterbegin", O2), S.insertAdjacentElement("beforeend", C));
      A2 = O2.cloneNode(true), A2.removeAttribute("id"), S.insertAdjacentElement("afterbegin", A2), O2 instanceof HTMLPictureElement && (O2 = O2.querySelector("img"));
      A2 instanceof HTMLPictureElement && (A2 = A2.querySelector("img"));
      C instanceof HTMLPictureElement && (C = C.querySelector("img"));
      if (C && (C.style.visibility = "hidden", I2("protected"))) {
        C.addEventListener("contextmenu", ((e4) => {
          h$1(e4);
        }));
        const e3 = document.createElement("div");
        s$9(e3, "f-panzoom__protected"), C.appendChild(e3);
      }
      H2("initLayout");
    })(), (function() {
      if (c2 && S && !Z) {
        let e2 = null;
        Z = new ResizeObserver((() => {
          W() && (e2 = e2 || requestAnimationFrame((() => {
            W() && (ce(), le(), H2("refresh")), e2 = null;
          })));
        })), Z.observe(S), D2.push((() => {
          null == Z || Z.disconnect(), Z = void 0, e2 && (cancelAnimationFrame(e2), e2 = null);
        }));
      }
    })(), (function() {
      if (!c2 || !O2) return;
      if (!p(O2) || !p(A2)) return void V();
      const e2 = () => {
        O2 && p(O2) && O2.decode().then((() => {
          V();
        })).catch((() => {
          V();
        }));
      };
      if (P = 1, c2.classList.add("is-loading"), H2("loading"), A2.src && A2.complete) return void e2();
      (function() {
        if (!c2) return;
        if (null == c2 ? void 0 : c2.querySelector(".f-spinner")) return;
        const e3 = I2("spinnerTpl"), t2 = e$9(e3);
        t2 && (t2.classList.add("f-spinner"), c2.classList.add("is-loading"), null == S || S.insertAdjacentElement("afterbegin", t2));
      })(), A2.addEventListener("load", e2, false), A2.addEventListener("error", e2, false), D2.push((() => {
        null == A2 || A2.removeEventListener("load", e2, false), null == A2 || A2.removeEventListener("error", e2, false);
      }));
    })(), je;
  }, isDragging: ye, isExpanded: xe, isFullsize: we, isMousemoveMode: Q, localize: function(e2, t2 = []) {
    const n2 = I2("l10n") || {};
    e2 = String(e2).replace(/\{\{(\w+)\}\}/g, ((e3, t3) => n2[t3] || e3));
    for (let n3 = 0; n3 < t2.length; n3++) e2 = e2.split(t2[n3][0]).join(t2[n3][1]);
    return e2 = e2.replace(/\{\{(.*?)\}\}/g, ((e3, t3) => t3));
  }, off: function(e2, t2) {
    for (const n2 of e2 instanceof Array ? e2 : [e2]) q2.has(n2) && q2.set(n2, q2.get(n2).filter(((e3) => e3 !== t2)));
    return je;
  }, on: function(e2, t2) {
    for (const n2 of e2 instanceof Array ? e2 : [e2]) q2.set(n2, [...q2.get(n2) || [], t2]);
    return je;
  }, toggleFS: Me, updateControls: ce, version: "6.1.6", willZoomIn: ge, willZoomOut: he };
  return je;
};
E$1.l10n = { en_EN: e$3 }, E$1.getDefaults = () => x;
const e$2 = (e2, o2) => {
  let t2 = [];
  return e2.childNodes.forEach(((e3) => {
    e3.nodeType !== Node.ELEMENT_NODE || o2 && !e3.matches(o2) || t2.push(e3);
  })), t2;
};
const o$5 = Object.assign(Object.assign({}, e$3), { ERROR: "Something went wrong. <br /> Please try again later.", NEXT: "Next page", PREV: "Previous page", GOTO: "Go to page #%d", DOWNLOAD: "Download", TOGGLE_FULLSCREEN: "Toggle full-screen mode", TOGGLE_EXPAND: "Toggle full-size mode", TOGGLE_THUMBS: "Toggle thumbnails", TOGGLE_AUTOPLAY: "Toggle slideshow" });
const m = (t2) => {
  t2.cancelable && t2.preventDefault();
}, h = { adaptiveHeight: false, center: true, classes: { container: "f-carousel", isEnabled: "is-enabled", isLTR: "is-ltr", isRTL: "is-rtl", isHorizontal: "is-horizontal", isVertical: "is-vertical", hasAdaptiveHeight: "has-adaptive-height", viewport: "f-carousel__viewport", slide: "f-carousel__slide", isSelected: "is-selected" }, dragFree: false, enabled: true, errorTpl: '<div class="f-html">{{ERROR}}</div>', fill: false, infinite: true, initialPage: 0, l10n: o$5, rtl: false, slides: [], slidesPerPage: "auto", spinnerTpl: '<div class="f-spinner"></div>', transition: "fade", tween: { clamp: true, mass: 1, tension: 160, friction: 25, restDelta: 1, restSpeed: 1, velocity: 0 }, vertical: false };
let b, y = 0;
const E = (g, x2 = {}, M2 = {}) => {
  y++;
  let w2, S, j2, A2, L, P = 0, T = Object.assign({}, h), O2 = Object.assign({}, h), R2 = {}, H2 = null, V = null, C = 0, D2 = 0, $ = 0, q2 = false, I2 = false, F = false, z2 = "height", k2 = 0, N2 = true, B2 = 0, _2 = 0, G = 0, X = 0, Y = "*", W = [], J = [];
  const K = /* @__PURE__ */ new Set();
  let Q = [], U = [], Z = 0, tt = 0, et = 0;
  function nt(t2, ...e2) {
    let n2 = O2[t2];
    return n2 && n2 instanceof Function ? n2(It, ...e2) : n2;
  }
  function it(t2, e2 = []) {
    const n2 = nt("l10n") || {};
    t2 = String(t2).replace(/\{\{(\w+)\}\}/g, ((t3, e3) => n2[e3] || t3));
    for (let n3 = 0; n3 < e2.length; n3++) t2 = t2.split(e2[n3][0]).join(e2[n3][1]);
    return t2 = t2.replace(/\{\{(.*?)\}\}/g, ((t3, e3) => e3));
  }
  const ot = /* @__PURE__ */ new Map();
  function st(t2, ...e2) {
    const n2 = [...ot.get(t2) || []];
    O2.on && n2.push(O2.on[t2]);
    for (const t3 of n2) t3 && t3 instanceof Function && t3(It, ...e2);
    "*" !== t2 && st("*", t2, ...e2);
  }
  function rt() {
    var e2, n2;
    const i2 = r$5({}, h, T);
    r$5(i2, h, T);
    let r2 = "";
    const l2 = T.breakpoints || {};
    if (l2) for (const [t2, e3] of Object.entries(l2)) window.matchMedia(t2).matches && (r2 += t2, r$5(i2, e3));
    if (void 0 === L || r2 !== L) {
      if (L = r2, 0 !== P) {
        let t2 = null === (n2 = null === (e2 = U[B2]) || void 0 === e2 ? void 0 : e2.slides[0]) || void 0 === n2 ? void 0 : n2.index;
        void 0 === t2 && (t2 = O2.initialSlide), i2.initialSlide = t2, i2.slides = [];
        for (const t3 of W) t3.isVirtual && i2.slides.push(t3);
      }
      Dt(), O2 = i2, false !== nt("enabled") && (P = 0, st("init"), (function() {
        for (const [t2, e3] of Object.entries(Object.assign(Object.assign({}, M2), O2.plugins || {}))) if (t2 && !R2[t2] && e3 instanceof Function) {
          const n3 = e3();
          n3.init(It, E), R2[t2] = n3;
        }
        st("initPlugins");
      })(), (function() {
        if (!H2) return;
        const e3 = nt("classes") || {};
        s$9(H2, e3.container);
        const n3 = nt("style");
        if (n3 && t$7(n3)) for (const [t2, e4] of Object.entries(n3)) H2.style.setProperty(t2, e4);
        V = H2.querySelector(`.${e3.viewport}`), V || (V = document.createElement("div"), s$9(V, e3.viewport), V.append(...e$2(H2, `.${e3.slide}`)), H2.insertAdjacentElement("afterbegin", V)), H2.carousel = It, st("initLayout");
      })(), (function() {
        if (!V) return;
        const t2 = nt("classes") || {};
        W = [], [...e$2(V, `.${t2.slide}`)].forEach(((t3) => {
          if (t3.parentElement) {
            const e3 = yt(Object.assign({ el: t3, isVirtual: false }, t3.dataset || {}));
            st("createSlide", e3), W.push(e3);
          }
        })), wt();
        for (const t3 of W) st("addSlide", t3);
        bt(nt("slides"));
        for (const t3 of W) {
          const e3 = t3.el;
          (null == e3 ? void 0 : e3.parentElement) === V && (s$9(e3, O2.classes.slide), s$9(e3, t3.class), Rt(t3), st("attachSlideEl", t3));
        }
        st("initSlides");
      })(), St(), P = 1, s$9(H2, (nt("classes") || {}).isEnabled || ""), Ct(), ut(), S = c$3().on("start", (() => {
        w2 && w2.isPointerDown() || (dt(), Ct());
      })).on("step", ((t2) => {
        const e3 = k2;
        k2 = t2.pos, k2 !== e3 && (N2 = false, Ct());
      })).on("end", ((t2) => {
        (null == w2 ? void 0 : w2.isPointerDown()) || (k2 = t2.pos, S && !q2 && (k2 < G || k2 > X) ? S.spring({ clamp: true, mass: 1, tension: 200, friction: 25, velocity: 0, restDelta: 1, restSpeed: 1 }).from({ pos: k2 }).to({ pos: t$4(G, k2, X) }).start() : N2 || (N2 = true, st("settle")));
      })), at(), (function() {
        if (!H2 || !V) return;
        H2.addEventListener("click", Pt), document.addEventListener("mousemove", lt);
        const t2 = V.getBoundingClientRect();
        if (Z = t2.height, tt = t2.width, !j2) {
          let t3 = null;
          j2 = new ResizeObserver((() => {
            t3 || (t3 = requestAnimationFrame((() => {
              !(function() {
                if (1 !== P || !V) return;
                const t4 = U.length, e3 = V.getBoundingClientRect(), n3 = e3.height, i3 = e3.width;
                t4 > 1 && (F && Math.abs(n3 - Z) < 0.5 || !F && Math.abs(i3 - tt) < 0.5) || (St(), at(), Z = n3, tt = i3, F && !Z || !F && !tt || H2 && V && (t4 === U.length && (null == w2 ? void 0 : w2.isPointerDown()) || (nt("dragFree") && (q2 || k2 > G && k2 < X) ? (dt(), Ct()) : Ht(B2, { transition: false }))));
              })(), t3 = null;
            })));
          })), j2.observe(V);
        }
      })(), st("ready"));
    }
  }
  function lt(t2) {
    b = t2;
  }
  function at() {
    false === nt("gestures") ? w2 && (w2.destroy(), w2 = void 0) : w2 || (function() {
      const t2 = nt("gestures");
      !w2 && false !== t2 && V && (w2 = f$1(V, t2).on("start", ((t3) => {
        var e2, n2;
        if (!S) return;
        if (false === nt("gestures", t3)) return;
        const { srcEvent: o2 } = t3;
        F && e$4(o2) && !n$8(o2.target) && m(o2), S.pause(), S.getCurrentVelocities().pos = 0;
        const s2 = null === (e2 = U[B2]) || void 0 === e2 ? void 0 : e2.slides[0], r2 = null == s2 ? void 0 : s2.el;
        s2 && K.has(s2.index) && r2 && (k2 = s2.offset || 0, k2 += ((function(t4) {
          const e3 = window.getComputedStyle(t4), n3 = new DOMMatrixReadOnly(e3.transform);
          return { width: n3.m41 || 0, height: n3.m42 || 0 };
        })(r2)[z2] || 0) * (I2 && !F ? 1 : -1)), At(), q2 || (k2 < G || k2 > X) && S.spring({ clamp: true, mass: 1, tension: 500, friction: 25, velocity: (null === (n2 = S.getCurrentVelocities()) || void 0 === n2 ? void 0 : n2.pos) || 0, restDelta: 1, restSpeed: 1 }).from({ pos: k2 }).to({ pos: t$4(G, k2, X) }).start();
      })).on("move", ((t3) => {
        var e2, n2;
        if (false === nt("gestures", t3)) return;
        const { srcEvent: o2, axis: s2, deltaX: r2, deltaY: l2 } = t3;
        if (e$4(o2) && (null === (e2 = o2.touches) || void 0 === e2 ? void 0 : e2.length) > 1) return;
        const a2 = o2.target, c2 = n$8(a2), d2 = c2 ? c2.scrollHeight > c2.clientHeight ? "y" : "x" : void 0;
        if (c2 && c2 !== V && (!s2 || s2 === d2)) return;
        if (!s2) return m(o2), o2.stopPropagation(), void o2.stopImmediatePropagation();
        if ("y" === s2 && !F || "x" === s2 && F) return;
        if (m(o2), o2.stopPropagation(), !S) return;
        const u2 = I2 && !F ? 1 : -1, f2 = F ? l2 : r2;
        let v2 = (null == S ? void 0 : S.isRunning()) ? S.getEndValues().pos : k2, g2 = 1;
        q2 || (v2 <= G && f2 * u2 < 0 ? (g2 = Math.max(0.01, 1 - (Math.abs(1 / gt() * Math.abs(v2 - G)) || 0)), g2 *= 0.2) : v2 >= X && f2 * u2 > 0 && (g2 = Math.max(0.01, 1 - (Math.abs(1 / gt() * Math.abs(v2 - X)) || 0)), g2 *= 0.2)), v2 += f2 * g2 * u2, S.spring({ clamp: true, mass: 1, tension: 700, friction: 25, velocity: (null === (n2 = S.getCurrentVelocities()) || void 0 === n2 ? void 0 : n2.pos) || 0, restDelta: 1, restSpeed: 1 }).from({ pos: k2 }).to({ pos: v2 }).start();
      })).on("panstart", ((t3) => {
        false !== nt("gestures", t3) && (null == t3 ? void 0 : t3.axis) === (F ? "y" : "x") && s$9(V, "is-dragging");
      })).on("panend", ((t3) => {
        false !== nt("gestures", t3) && s$8(V, "is-dragging");
      })).on("end", ((t3) => {
        var e2, n2;
        if (false === nt("gestures", t3)) return;
        const { srcEvent: o2, axis: s2, velocityX: r2, velocityY: l2, currentTouch: c2 } = t3;
        if (c2.length > 0 || !S) return;
        const d2 = o2.target, u2 = n$8(d2), f2 = u2 ? u2.scrollHeight > u2.clientHeight ? "y" : "x" : void 0, v2 = u2 && (!s2 || s2 === f2);
        F && e$4(o2) && !t3.axis && Pt(o2);
        const g2 = U.length, m2 = nt("dragFree");
        if (!g2) return;
        const h2 = v2 ? 0 : nt("vertical") ? l2 : r2;
        let b2 = (null == S ? void 0 : S.isRunning()) ? S.getEndValues().pos : k2;
        const y2 = I2 && !F ? 1 : -1;
        if (v2 || (b2 += h2 * (m2 ? 5 : 1) * y2), !q2 && (h2 * y2 <= 0 && b2 < G || h2 * y2 >= 0 && b2 > X)) {
          let t4 = 0;
          return Math.abs(h2) > 0 && (t4 = 2 * Math.abs(h2), t4 = Math.min(0.3 * gt(), t4)), b2 = t$4(G + -1 * t4, b2, X + t4), void S.spring({ clamp: true, mass: 1, tension: 380, friction: 25, velocity: -1 * h2, restDelta: 1, restSpeed: 1 }).from({ pos: k2 }).to({ pos: b2 }).start();
        }
        if (m2 || (null === (e2 = R2.Autoscroll) || void 0 === e2 ? void 0 : e2.isEnabled())) return void (Math.abs(h2) > 10 ? S.spring({ clamp: true, mass: 1, tension: 150, friction: 25, velocity: -1 * h2, restDelta: 1, restSpeed: 1 }).from({ pos: k2 }).to({ pos: b2 }).start() : S.isRunning() || N2 || (N2 = true, st("settle")));
        if (!m2 && !(null === (n2 = R2.Autoscroll) || void 0 === n2 ? void 0 : n2.isEnabled()) && (!t3.offsetX && !t3.offsetY || "y" === s2 && !F || "x" === s2 && F)) return void Ht(B2, { transition: "tween" });
        let E2 = vt(b2);
        Math.abs(h2) > 10 && E2 === B2 && (E2 += h2 > 0 ? I2 && !F ? 1 : -1 : I2 && !F ? -1 : 1), Ht(E2, { transition: "tween", tween: { velocity: -1 * h2 } });
      })).init());
    })(), s$7(V, "is-draggable", !!w2 && U.length > 0);
  }
  function ct(t2 = "*") {
    var e2;
    const n2 = [];
    for (const i2 of W) ("*" === t2 || i2.class && i2.class.includes(t2) || i2.el && (null === (e2 = i2.el) || void 0 === e2 ? void 0 : e2.classList.contains(t2))) && n2.push(i2);
    A2 = void 0, Y = t2, J = [...n2];
  }
  function dt() {
    if (!S) return;
    const t2 = vt((null == S ? void 0 : S.isRunning()) ? S.getEndValues().pos : k2);
    t2 !== B2 && (A2 = B2, B2 = t2, Rt(), ut(), ft(), st("change", B2, A2));
  }
  function ut() {
    var t2, e2;
    if (!H2) return;
    for (const t3 of H2.querySelectorAll("[data-carousel-index]")) t3.innerHTML = B2 + "";
    for (const t3 of H2.querySelectorAll("[data-carousel-page]")) t3.innerHTML = B2 + 1 + "";
    for (const t3 of H2.querySelectorAll("[data-carousel-pages]")) t3.innerHTML = U.length + "";
    for (const e3 of H2.querySelectorAll("[data-carousel-go-to]")) {
      parseInt((null === (t2 = e3.dataset) || void 0 === t2 ? void 0 : t2.carouselGoTo) || "-1", 10) === B2 ? e3.setAttribute("aria-current", "true") : e3.removeAttribute("aria-current");
    }
    for (const t3 of H2.querySelectorAll("[data-carousel-go-prev]")) t3.toggleAttribute("aria-disabled", !$t()), $t() ? t3.removeAttribute("tabindex") : t3.setAttribute("tabindex", "-1");
    for (const t3 of H2.querySelectorAll("[data-carousel-go-next]")) t3.toggleAttribute("aria-disabled", !qt()), qt() ? t3.removeAttribute("tabindex") : t3.setAttribute("tabindex", "-1");
    let n2 = false;
    const i2 = null === (e2 = U[B2]) || void 0 === e2 ? void 0 : e2.slides[0];
    i2 && (i2.downloadSrc || "image" === i2.type && i2.src) && (n2 = true);
    for (const t3 of H2.querySelectorAll("[data-carousel-download]")) t3.toggleAttribute("aria-disabled", !n2);
  }
  function ft(t2) {
    var e2;
    t2 || (t2 = null === (e2 = U[B2]) || void 0 === e2 ? void 0 : e2.slides[0]);
    const n2 = null == t2 ? void 0 : t2.el;
    if (n2) for (const e3 of n2.querySelectorAll("[data-slide-index]")) e3.innerHTML = t2.index + 1 + "";
  }
  function vt(t2) {
    var e2, n2, i2;
    if (!U.length) return 0;
    const o2 = mt();
    let s2 = t2;
    q2 ? s2 -= Math.floor((t2 - (null === (e2 = U[0]) || void 0 === e2 ? void 0 : e2.pos)) / o2) * o2 || 0 : s2 = t$4(null === (n2 = U[0]) || void 0 === n2 ? void 0 : n2.pos, t2, null === (i2 = U[U.length - 1]) || void 0 === i2 ? void 0 : i2.pos);
    const r2 = /* @__PURE__ */ new Map();
    let l2 = 0;
    for (const t3 of U) {
      const e3 = Math.abs(t3.pos - s2), n3 = Math.abs(t3.pos - s2 - o2), i3 = Math.abs(t3.pos - s2 + o2), a2 = Math.min(e3, n3, i3);
      r2.set(l2, a2), l2++;
    }
    const c2 = r2.size > 0 ? [...r2.entries()].reduce(((t3, e3) => e3[1] < t3[1] ? e3 : t3)) : [B2, 0];
    return parseInt(c2[0]);
  }
  function pt() {
    return et;
  }
  function gt() {
    return C;
  }
  function mt(t2 = true) {
    return J.length ? J.reduce(((t3, e2) => t3 + e2.dim), 0) + (J.length - (q2 && t2 ? 0 : 1)) * et : 0;
  }
  function ht(t2) {
    const e2 = mt(), n2 = gt();
    if (!e2 || !V || !n2) return [];
    const i2 = [];
    t2 = void 0 === t2 ? k2 : t2, q2 && (t2 -= Math.floor(t2 / e2) * e2 || 0);
    let o2 = 0;
    for (let s2 of J) {
      const r2 = (e3 = 0) => {
        i2.indexOf(s2) > -1 || (s2.pos = o2 - t2 + e3 || 0, s2.offset + e3 > t2 - s2.dim - D2 + 0.51 && s2.offset + e3 < t2 + n2 + $ - 0.51 && i2.push(s2));
      };
      s2.offset = o2, q2 && (r2(e2), r2(-1 * e2)), r2(), o2 += s2.dim + et;
    }
    return i2;
  }
  function bt(t2, e2) {
    const n2 = [];
    for (const e3 of Array.isArray(t2) ? t2 : [t2]) {
      const t3 = yt(Object.assign(Object.assign({}, e3), { isVirtual: true }));
      t3.el || (t3.el = document.createElement("div")), st("createSlide", t3), n2.push(t3);
    }
    W.splice(void 0 === e2 ? W.length : e2, 0, ...n2), wt();
    for (const t3 of n2) st("addSlide", t3), Et(t3);
    return ct(Y), n2;
  }
  function yt(t2) {
    return (t$6(t2) || t2 instanceof HTMLElement) && (t2 = { html: t2 }), Object.assign({ index: -1, el: void 0, class: "", isVirtual: true, dim: 0, pos: 0, offset: 0, html: "", src: "" }, t2);
  }
  function Et(t2) {
    let e2 = t2.el;
    if (!t2 || !e2) return;
    const n2 = t2.html ? t2.html instanceof HTMLElement ? t2.html : e$9(t2.html) : void 0;
    n2 && (s$9(n2, "f-html"), t2.htmlEl = n2, s$9(e2, "has-html"), e2.append(n2), st("contentReady", t2));
  }
  function xt(t2) {
    if (!V || !t2) return;
    let e2 = t2.el;
    if (e2) {
      if (e2.setAttribute("index", t2.index + ""), e2.parentElement !== V) {
        let n2;
        s$9(e2, O2.classes.slide), s$9(e2, t2.class), Rt(t2);
        for (const e3 of W) if (e3.index > t2.index) {
          n2 = e3.el;
          break;
        }
        V.insertBefore(e2, n2 && V.contains(n2) ? n2 : null), st("attachSlideEl", t2);
      }
      return ft(t2), e2;
    }
  }
  function Mt(t2) {
    const e2 = null == t2 ? void 0 : t2.el;
    e2 && (e2.remove(), jt(e2), st("detachSlideEl", t2));
  }
  function wt() {
    for (let t2 = 0; t2 < W.length; t2++) {
      const e2 = W[t2], n2 = e2.el;
      n2 && (e2.index !== t2 && jt(n2), n2.setAttribute("index", `${t2}`)), e2.index = t2;
    }
  }
  function St() {
    var t2, n2, i2, o2, s2;
    if (!H2 || !V) return;
    I2 = nt("rtl"), F = nt("vertical"), z2 = F ? "height" : "width";
    const r2 = nt("classes");
    if (s$7(H2, r2.isLTR, !I2), s$7(H2, r2.isRTL, I2), s$7(H2, r2.isHorizontal, !F), s$7(H2, r2.isVertical, F), s$7(H2, r2.hasAdaptiveHeight, nt("adaptiveHeight")), C = 0, D2 = 0, $ = 0, et = 0, V) {
      V.childElementCount || (V.style.display = "grid");
      const t3 = V.getBoundingClientRect();
      C = V.getBoundingClientRect()[z2] || 0;
      const e2 = window.getComputedStyle(V);
      et = parseFloat(e2.getPropertyValue("--f-carousel-gap")) || 0;
      "visible" === e2.getPropertyValue("overflow-" + (F ? "y" : "x")) && (D2 = Math.abs(t3[F ? "top" : "left"]), $ = Math.abs(window[F ? "innerHeight" : "innerWidth"] - t3[F ? "bottom" : "right"])), V.style.display = "";
    }
    if (!C) return;
    const l2 = (function() {
      let t3 = 0;
      if (V) {
        let e2 = document.createElement("div");
        e2.style.display = "block", s$9(e2, O2.classes.slide), V.appendChild(e2), t3 = e2.getBoundingClientRect()[z2], e2.remove(), e2 = void 0;
      }
      return t3;
    })();
    for (const n3 of J) {
      const i3 = n3.el;
      let o3 = 0;
      if (!n3.isVirtual && i3 && n$9(i3)) {
        let e2 = false;
        i3.parentElement && i3.parentElement === V || (V.appendChild(i3), e2 = true), o3 = i3.getBoundingClientRect()[z2], e2 && (null === (t2 = i3.parentElement) || void 0 === t2 || t2.removeChild(i3));
      } else o3 = l2;
      n3.dim = o3;
    }
    if (q2 = false, nt("infinite")) {
      q2 = true;
      const t3 = mt();
      let e2 = C + D2 + $;
      for (let i3 = 0; i3 < J.length; i3++) {
        const o3 = (null === (n2 = J[i3]) || void 0 === n2 ? void 0 : n2.dim) + et;
        if (t3 - o3 < e2 && t3 - o3 - e2 < o3) {
          q2 = false;
          break;
        }
      }
    }
    !(function() {
      var t3;
      if (!H2) return;
      const e2 = gt(), n3 = mt(false);
      let i3 = nt("slidesPerPage");
      i3 = "auto" === i3 ? 1 / 0 : parseFloat(i3 + ""), U = [];
      let o3 = 0, s3 = 0;
      for (const n4 of J) (!U.length || o3 + n4.dim - e2 > 0.05 || s3 >= i3) && (U.push({ index: U.length, slides: [], dim: 0, offset: 0, pos: 0 }), o3 = 0, s3 = 0), null === (t3 = U[U.length - 1]) || void 0 === t3 || t3.slides.push(n4), o3 += n4.dim + et, s3++;
      const r3 = nt("center"), l3 = nt("fill");
      let c2 = 0;
      for (const t4 of U) {
        t4.dim = (t4.slides.length - 1) * et;
        for (const e3 of t4.slides) t4.dim += e3.dim;
        t4.offset = c2, t4.pos = c2, false !== r3 && (t4.pos -= 0.5 * (e2 - t4.dim)), l3 && !q2 && n3 > e2 && (t4.pos = t$4(0, t4.pos, n3 - e2)), c2 += t4.dim + et;
      }
      const d2 = [];
      let u2;
      for (const t4 of U) {
        const e3 = Object.assign({}, t4);
        u2 && Math.abs(e3.pos - u2.pos) < 0.1 ? (u2.dim += e3.dim, u2.slides = [...u2.slides, ...e3.slides]) : (u2 = e3, e3.index = d2.length, d2.push(e3));
      }
      U = d2, B2 = t$4(0, B2, U.length - 1);
    })(), G = (null === (i2 = U[0]) || void 0 === i2 ? void 0 : i2.pos) || 0, X = (null === (o2 = U[U.length - 1]) || void 0 === o2 ? void 0 : o2.pos) || 0, 0 === P ? (function() {
      var t3;
      A2 = void 0, B2 = nt("initialPage");
      const e2 = nt("initialSlide") || void 0;
      void 0 !== e2 && (B2 = It.getPageIndex(e2) || 0), B2 = t$4(0, B2, U.length - 1), k2 = (null === (t3 = U[B2]) || void 0 === t3 ? void 0 : t3.pos) || 0, _2 = k2;
    })() : _2 = (null === (s2 = U[B2 || 0]) || void 0 === s2 ? void 0 : s2.pos) || 0, st("refresh"), ut();
  }
  function jt(t2) {
    if (!t2 || !n$9(t2)) return;
    const n2 = parseInt(t2.getAttribute("index") || "-1");
    let i2 = "";
    for (const e2 of Array.from(t2.classList)) {
      const t3 = e2.match(/^f-(\w+)(Out|In)$/);
      t3 && t3[1] && (i2 = t3[1] + "");
    }
    if (!t2 || !i2) return;
    const o2 = [`f-${i2}Out`, `f-${i2}In`, "to-prev", "to-next", "from-prev", "from-next"];
    t2.removeEventListener("animationend", Lt), s$8(t2, o2.join(" ")), K.delete(n2);
  }
  function At() {
    if (!V) return;
    const t2 = K.size > 0;
    for (const t3 of J) jt(t3.el);
    K.clear(), t2 && Ct();
  }
  function Lt(t2) {
    var e2;
    "f-" === (null === (e2 = t2.animationName) || void 0 === e2 ? void 0 : e2.substring(0, 2)) && (jt(t2.target), K.size || (s$8(H2, "in-transition"), !N2 && Math.abs(It.getPosition(true) - _2) < 0.5 && (N2 = true, st("settle"))), Ct());
  }
  function Pt(t2) {
    var e2;
    if (t2.defaultPrevented) return;
    const n2 = t2.composedPath()[0];
    if (n2.closest("[data-carousel-go-prev]")) return m(t2), void It.prev();
    if (n2.closest("[data-carousel-go-next]")) return m(t2), void It.next();
    const i2 = n2.closest("[data-carousel-go-to]");
    if (i2) return m(t2), void It.goTo(parseFloat(i2.dataset.carouselGoTo || "") || 0);
    if (n2.closest("[data-carousel-download]")) {
      m(t2);
      const n3 = null === (e2 = U[B2]) || void 0 === e2 ? void 0 : e2.slides[0];
      if (n3 && (n3.downloadSrc || "image" === n3.type && n3.src)) {
        const t3 = n3.downloadFilename, e3 = document.createElement("a"), i3 = n3.downloadSrc || n3.src || "";
        e3.href = i3, e3.target = "_blank", e3.download = t3 || i3, e3.click();
      }
    } else st("click", t2);
  }
  function Tt(t2) {
    var e2;
    const n2 = t2.el;
    n2 && (null === (e2 = n2.querySelector(".f-spinner")) || void 0 === e2 || e2.remove());
  }
  function Ot(t2) {
    var e2;
    const n2 = t2.el;
    n2 && (null === (e2 = n2.querySelector(".f-html.is-error")) || void 0 === e2 || e2.remove(), s$8(n2, "has-error"));
  }
  function Rt(t2) {
    var e2;
    t2 || (t2 = null === (e2 = U[B2]) || void 0 === e2 ? void 0 : e2.slides[0]);
    const i2 = null == t2 ? void 0 : t2.el;
    if (!i2) return;
    let o2 = nt("formatCaption", t2);
    void 0 === o2 && (o2 = t2.caption), o2 = o2 || "";
    const s2 = nt("captionEl");
    if (s2 && s2 instanceof HTMLElement) {
      if (t2.index !== B2) return;
      if (t$6(o2) && (s2.innerHTML = it(o2 + "")), o2 instanceof HTMLElement) {
        if (o2.parentElement === s2) return;
        s2.innerHTML = "", o2.parentElement && (o2 = o2.cloneNode(true)), s2.append(o2);
      }
      return;
    }
    if (!o2) return;
    let r2 = t2.captionEl || i2.querySelector(".f-caption");
    !r2 && o2 instanceof HTMLElement && o2.classList.contains("f-caption") && (r2 = o2), r2 || (r2 = document.createElement("div"), s$9(r2, "f-caption"), t$6(o2) ? r2.innerHTML = it(o2 + "") : o2 instanceof HTMLElement && (o2.parentElement && (o2 = o2.cloneNode(true)), r2.append(o2)));
    const l2 = `f-caption-${y}_${t2.index}`;
    r2.setAttribute("id", l2), r2.dataset.selectable = "true", s$9(i2, "has-caption"), i2.setAttribute("aria-labelledby", l2), t2.captionEl = r2, i2.insertAdjacentElement("beforeend", r2);
  }
  function Ht(e2, i2 = {}) {
    var o2, r2;
    let { transition: l2, tween: u2 } = Object.assign({ transition: O2.transition, tween: O2.tween }, i2 || {});
    if (!H2 || !S) return;
    const f2 = U.length;
    if (!f2) return;
    if ((function(t2, e3) {
      var i3, o3, s2;
      if (!(H2 && C && S && e3 && t$6(e3) && "tween" !== e3)) return false;
      for (const t3 of Q) if (C - t3.dim > 0.5) return false;
      if (D2 > 0.5 || $ > 0.5) return;
      const r3 = U.length;
      let l3 = t2 > B2 ? 1 : -1;
      t2 = q2 ? (t2 % r3 + r3) % r3 : t$4(0, t2, r3 - 1), I2 && (l3 *= -1);
      const u3 = null === (i3 = U[B2]) || void 0 === i3 ? void 0 : i3.slides[0], f3 = null == u3 ? void 0 : u3.index, v3 = null === (o3 = U[t2]) || void 0 === o3 ? void 0 : o3.slides[0], p3 = null == v3 ? void 0 : v3.index, g2 = null === (s2 = U[t2]) || void 0 === s2 ? void 0 : s2.pos;
      if (void 0 === p3 || void 0 === f3 || f3 === p3 || k2 === g2 || Math.abs(C - ((null == v3 ? void 0 : v3.dim) || 0)) > 1) return false;
      N2 = false, S.pause(), At(), s$9(H2, "in-transition"), k2 = _2 = g2;
      const m2 = xt(u3), h2 = xt(v3);
      return dt(), m2 && (K.add(f3), m2.style.transform = "", m2.addEventListener("animationend", Lt), s$8(m2, O2.classes.isSelected), m2.inert = false, s$9(m2, `f-${e3}Out to-${l3 > 0 ? "next" : "prev"}`)), h2 && (K.add(p3), h2.style.transform = "", h2.addEventListener("animationend", Lt), s$9(h2, O2.classes.isSelected), h2.inert = false, s$9(h2, `f-${e3}In from-${l3 > 0 ? "prev" : "next"}`)), Ct(), true;
    })(e2, l2)) return;
    e2 = q2 ? (e2 % f2 + f2) % f2 : t$4(0, e2, f2 - 1);
    const v2 = (null === (o2 = U[e2 || 0]) || void 0 === o2 ? void 0 : o2.pos) || 0;
    _2 = v2;
    const p2 = S.isRunning() ? S.getEndValues().pos : k2;
    if (Math.abs(_2 - p2) < 1) return k2 = _2, B2 !== e2 && (Rt(), A2 = B2, B2 = e2, ut(), ft(), st("change", B2, A2)), Ct(), void (N2 || (N2 = true, st("settle")));
    if (S.pause(), At(), q2) {
      const t2 = mt(), e3 = Math.floor((p2 - (null === (r2 = U[0]) || void 0 === r2 ? void 0 : r2.pos)) / t2) || 0, n2 = _2 + e3 * t2;
      _2 = [n2 + t2, n2, n2 - t2].reduce((function(t3, e4) {
        return Math.abs(e4 - p2) < Math.abs(t3 - p2) ? e4 : t3;
      }));
    }
    false !== l2 && t$7(u2) ? S.spring(r$5({}, O2.tween, u2)).from({ pos: k2 }).to({ pos: _2 }).start() : (k2 = _2, dt(), Ct(), N2 || (N2 = true, st("settle")));
  }
  function Vt(t2) {
    var e2;
    let n2 = k2;
    if (q2 && true !== t2) {
      const t3 = mt();
      n2 -= (Math.floor((k2 - (null === (e2 = U[0]) || void 0 === e2 ? void 0 : e2.pos) || 0) / t3) || 0) * t3;
    }
    return n2;
  }
  function Ct() {
    var t2;
    if (!H2 || !V) return;
    Q = ht();
    const e2 = /* @__PURE__ */ new Set(), n2 = [], i2 = U[B2], s2 = O2.setTransform;
    let l2;
    for (const o2 of J) {
      const s3 = K.has(o2.index), r2 = Q.indexOf(o2) > -1, a2 = (null === (t2 = null == i2 ? void 0 : i2.slides) || void 0 === t2 ? void 0 : t2.indexOf(o2)) > -1;
      if (o2.isVirtual && !s3 && !r2) continue;
      let c2 = xt(o2);
      if (c2 && (n2.push(o2), a2 && e2.add(c2), nt("adaptiveHeight") && a2)) {
        const t3 = (c2.firstElementChild || c2).getBoundingClientRect().height;
        l2 = null == l2 ? t3 : Math.max(l2, t3);
      }
    }
    V && l2 && (V.style.height = `${l2}px`), [...e$2(V, `.${O2.classes.slide}`)].forEach(((t3) => {
      s$7(t3, O2.classes.isSelected, e2.has(t3));
      const n3 = W[parseInt(t3.getAttribute("index") || "-1")];
      if (!n3) return t3.remove(), void jt(t3);
      const i3 = K.has(n3.index), o2 = Q.indexOf(n3) > -1;
      if (n3.isVirtual && !i3 && !o2) return void Mt(n3);
      if (t3.inert = !o2, false === s2) return;
      let l3 = n3.pos ? Math.round(1e4 * n3.pos) / 1e4 : 0, a2 = 0, c2 = 0, d2 = 0, f2 = 0;
      i3 || (a2 = F ? 0 : I2 ? -1 * l3 : l3, c2 = F ? l3 : 0, d2 = t$3(a2, 0, n3.dim, 0, 100), f2 = t$3(c2, 0, n3.dim, 0, 100)), s2 instanceof Function && !i3 ? s2(It, n3, { x: a2, y: c2, xPercent: d2, yPercent: f2 }) : t3.style.transform = a2 || c2 ? `translate3d(${d2}%, ${f2}%,0)` : "";
    })), st("render", n2);
  }
  function Dt() {
    null == H2 || H2.removeEventListener("click", Pt), document.removeEventListener("mousemove", lt), K.clear(), null == j2 || j2.disconnect(), j2 = void 0;
    for (const t2 of W) {
      let n2 = t2.el;
      n2 && n$9(n2) && (t2.state = void 0, Tt(t2), Ot(t2), t2.isVirtual ? (Mt(t2), t2.el = void 0) : (jt(n2), n2.style.transform = "", V && !V.contains(n2) && V.appendChild(n2)));
    }
    for (const t2 of Object.values(R2)) null == t2 || t2.destroy();
    R2 = {}, null == w2 || w2.destroy(), w2 = void 0, null == S || S.destroy(), S = void 0;
    for (const [t2, e2] of Object.entries(O2.classes || {})) "container" !== t2 && s$8(H2, e2);
    s$8(V, "is-draggable");
  }
  function $t() {
    return q2 || B2 > 0;
  }
  function qt() {
    return q2 || B2 < U.length - 1;
  }
  const It = { add: function(t2, e2) {
    var n2;
    let i2 = k2;
    const o2 = B2, s2 = mt(), r2 = (null == S ? void 0 : S.isRunning()) ? S.getEndValues().pos : k2, l2 = s2 && Math.floor((r2 - ((null === (n2 = U[0]) || void 0 === n2 ? void 0 : n2.pos) || 0)) / s2) || 0;
    return bt(t2, e2), ct(Y), St(), S && s2 && (o2 === B2 && (i2 -= l2 * s2), i2 === _2 ? k2 = _2 : S.spring({ clamp: true, mass: 1, tension: 300, friction: 25, restDelta: 1, restSpeed: 1 }).from({ pos: i2 }).to({ pos: _2 }).start()), Ct(), It;
  }, canGoPrev: $t, canGoNext: qt, destroy: function() {
    return st("destroy"), window.removeEventListener("resize", rt), Dt(), ot.clear(), H2 = null, U = [], W = [], O2 = Object.assign({}, h), R2 = {}, J = [], L = void 0, Y = "*", P = 2, It;
  }, emit: st, filter: function(t2 = "*") {
    return ct(t2), St(), k2 = t$4(G, k2, X), Ct(), st("filter", t2), It;
  }, getContainer: function() {
    return H2;
  }, getGapDim: pt, getGestures: function() {
    return w2;
  }, getLastMouseMove: function() {
    return b;
  }, getOption: function(t2) {
    return nt(t2);
  }, getOptions: function() {
    return O2;
  }, getPage: function() {
    return U[B2];
  }, getPageIndex: function(t2) {
    if (void 0 !== t2) {
      for (const e2 of U || []) for (const n2 of e2.slides) if (n2.index === t2) return e2.index;
      return -1;
    }
    return B2;
  }, getPageIndexFromPosition: vt, getPageProgress: function(t2, e2) {
    var n2;
    void 0 === t2 && (t2 = B2);
    const i2 = U[t2];
    if (!i2) return t2 > B2 ? -1 : 1;
    const o2 = mt(), s2 = pt();
    let r2 = i2.pos, l2 = Vt();
    if (q2 && true !== e2) {
      const t3 = Math.floor((l2 - (null === (n2 = U[0]) || void 0 === n2 ? void 0 : n2.pos)) / o2) || 0;
      l2 -= t3 * o2, r2 = [r2 + o2, r2, r2 - o2].reduce((function(t4, e3) {
        return Math.abs(e3 - l2) < Math.abs(t4 - l2) ? e3 : t4;
      }));
    }
    return (l2 - r2) / (i2.dim + s2) || 0;
  }, getPageVisibility: function(t2) {
    var e2;
    void 0 === t2 && (t2 = B2);
    const n2 = U[t2];
    if (!n2) return t2 > B2 ? -1 : 1;
    const i2 = Vt(), o2 = gt();
    let s2 = n2.pos;
    if (q2) {
      const t3 = mt(), n3 = s2 + (Math.floor((i2 - (null === (e2 = U[0]) || void 0 === e2 ? void 0 : e2.pos)) / t3) || 0) * t3;
      s2 = [n3 + t3, n3, n3 - t3].reduce((function(t4, e3) {
        return Math.abs(e3 - i2) < Math.abs(t4 - i2) ? e3 : t4;
      }));
    }
    return s2 > i2 && s2 + n2.dim < i2 + o2 ? 1 : s2 < i2 ? (s2 + n2.dim - i2) / n2.dim || 0 : s2 + n2.dim > i2 + o2 && (i2 + o2 - s2) / n2.dim || 0;
  }, getPages: function() {
    return U;
  }, getPlugins: function() {
    return R2;
  }, getPosition: Vt, getSlides: function() {
    return W;
  }, getState: function() {
    return P;
  }, getTotalSlideDim: mt, getTween: function() {
    return S;
  }, getViewport: function() {
    return V;
  }, getViewportDim: gt, getVisibleSlides: function(t2) {
    return void 0 === t2 ? Q : ht(t2);
  }, goTo: Ht, hasNavigated: function() {
    return void 0 !== A2;
  }, hideError: Ot, hideLoading: Tt, init: function() {
    if (!g || !n$9(g)) throw new Error("No Element found");
    return 0 !== P && (Dt(), P = 0), H2 = g, T = x2, window.removeEventListener("resize", rt), T.breakpoints && window.addEventListener("resize", rt), rt(), It;
  }, isInfinite: function() {
    return q2;
  }, isInTransition: function() {
    return K.size > 0;
  }, isRTL: function() {
    return I2;
  }, isSettled: function() {
    return N2;
  }, isVertical: function() {
    return F;
  }, localize: function(t2, e2 = []) {
    return it(t2, e2);
  }, next: function(t2 = {}) {
    return Ht(B2 + 1, t2), It;
  }, off: function(t2, e2) {
    for (const n2 of t2 instanceof Array ? t2 : [t2]) ot.has(n2) && ot.set(n2, ot.get(n2).filter(((t3) => t3 !== e2)));
    return It;
  }, on: function(t2, e2) {
    for (const n2 of t2 instanceof Array ? t2 : [t2]) ot.set(n2, [...ot.get(n2) || [], e2]);
    return It;
  }, prev: function(t2 = {}) {
    return Ht(B2 - 1, t2), It;
  }, reInit: function(e2 = {}, n2) {
    return Dt(), P = 0, L = void 0, Y = "*", x2 = e2, T = e2, t$7(n2) && (M2 = n2), rt(), It;
  }, remove: function(t2) {
    void 0 === t2 && (t2 = W.length - 1);
    const e2 = W[t2];
    return e2 && (st("removeSlide", e2), e2.el && (jt(e2.el), e2.el.remove(), e2.el = void 0), W.splice(t2, 1), ct(Y), St(), k2 = t$4(G, k2, X), Ct()), It;
  }, setPosition: function(t2) {
    k2 = t2, dt(), Ct();
  }, showError: function(t2, e2) {
    Tt(t2), Ot(t2);
    const n2 = t2.el;
    if (n2) {
      const i2 = document.createElement("div");
      s$9(i2, "f-html"), s$9(i2, "is-error"), i2.innerHTML = it(e2 || "<p>{{ERROR}}</p>"), t2.htmlEl = i2, s$9(n2, "has-html"), s$9(n2, "has-error"), n2.insertAdjacentElement("afterbegin", i2), st("contentReady", t2);
    }
    return It;
  }, showLoading: function(t2) {
    const e2 = t2.el, n2 = null == e2 ? void 0 : e2.querySelector(".f-spinner");
    if (!e2 || n2) return It;
    const i2 = nt("spinnerTpl"), o2 = e$9(i2);
    return o2 && (s$9(o2, "f-spinner"), e2.insertAdjacentElement("beforeend", o2)), It;
  }, version: "6.1.6" };
  return It;
};
E.l10n = { en_EN: o$5 }, E.getDefaults = () => h;
const n$5 = function(n2 = "", t2 = "", o2 = "") {
  return n2.split(t2).join(o2);
};
const a$4 = { tpl: (t2) => `<img class="f-panzoom__content" 
    ${t2.srcset ? 'data-lazy-srcset="{{srcset}}"' : ""} 
    ${t2.sizes ? 'data-lazy-sizes="{{sizes}}"' : ""} 
    data-lazy-src="{{src}}" alt="{{alt}}" />` }, s$4 = () => {
  let s2;
  function l2(e2, o2) {
    const n2 = null == s2 ? void 0 : s2.getOptions().Zoomable;
    let i2 = (t$7(n2) ? Object.assign(Object.assign({}, a$4), n2) : a$4)[e2];
    return i2 && "function" == typeof i2 && o2 ? i2(o2) : i2;
  }
  function c2() {
    s2 && false !== s2.getOptions().Zoomable && (s2.on("addSlide", f2), s2.on("removeSlide", u2), s2.on("attachSlideEl", g), s2.on("click", d2), s2.on("change", r2), s2.on("ready", r2));
  }
  function r2() {
    m2();
    const t2 = (null == s2 ? void 0 : s2.getVisibleSlides()) || [];
    if (t2.length > 1 || "slide" === (null == s2 ? void 0 : s2.getOption("transition"))) for (const e2 of t2) {
      const t3 = e2.panzoomRef;
      t3 && ((null == s2 ? void 0 : s2.getPage().slides) || []).indexOf(e2) < 0 && t3.execute(v$1.ZoomTo, Object.assign({}, t3.getStartPosition()));
    }
  }
  function d2(t2, e2) {
    const o2 = e2.target;
    o2 && !e2.defaultPrevented && o2.dataset.panzoomAction && p2(o2.dataset.panzoomAction);
  }
  function f2(t2, i2) {
    const a2 = i2.el;
    if (!s2 || !a2 || i2.panzoomRef) return;
    const c3 = i2.src || i2.lazySrc || "", r3 = i2.alt || i2.caption || `Image #${i2.index}`, d3 = i2.srcset || i2.lazySrcset || "", f3 = i2.sizes || i2.lazySizes || "";
    if (c3 && t$6(c3) && !i2.html && (!i2.type || "image" === i2.type)) {
      i2.type = "image", i2.thumbSrc = i2.thumbSrc || c3;
      let t3 = l2("tpl", i2);
      t3 = n$5(t3, "{{src}}", c3 + ""), t3 = n$5(t3, "{{srcset}}", d3 + ""), t3 = n$5(t3, "{{sizes}}", f3 + ""), a2.insertAdjacentHTML("afterbegin", t3);
    }
    const u3 = a2.querySelector(".f-panzoom__content");
    if (!u3) return;
    u3.setAttribute("alt", r3 + "");
    const g2 = i2.width && "auto" !== i2.width ? parseFloat(i2.width + "") : "auto", p3 = i2.height && "auto" !== i2.height ? parseFloat(i2.height + "") : "auto", z2 = E$1(a2, Object.assign({ width: g2, height: p3, classes: { container: "f-zoomable" }, event: () => null == s2 ? void 0 : s2.getLastMouseMove(), spinnerTpl: () => (null == s2 ? void 0 : s2.getOption("spinnerTpl")) || "" }, l2("Panzoom")));
    z2.on("*", ((t3, e2, ...o2) => {
      s2 && ("loading" === e2 && (i2.state = 0), "loaded" === e2 && (i2.state = 1), "error" === e2 && (i2.state = 2, null == s2 || s2.showError(i2, "{{IMAGE_ERROR}}")), s2.emit(`panzoom:${e2}`, i2, ...o2), "ready" === e2 && s2.emit("contentReady", i2), i2.index === (null == s2 ? void 0 : s2.getPageIndex()) && m2());
    })), i2.panzoomRef = z2;
  }
  function u2(t2, e2) {
    e2.panzoomRef && (e2.panzoomRef.destroy(), e2.panzoomRef = void 0);
  }
  function g(t2, e2) {
    const o2 = e2.panzoomRef;
    if (o2) switch (o2.getState()) {
      case 0:
        o2.init();
        break;
      case 3:
        o2.execute(v$1.ZoomTo, Object.assign(Object.assign({}, o2.getStartPosition()), { velocity: 0 }));
    }
  }
  function m2() {
    var t2, e2;
    const o2 = (null == s2 ? void 0 : s2.getContainer()) || void 0, n2 = null === (e2 = null === (t2 = null == s2 ? void 0 : s2.getPage()) || void 0 === t2 ? void 0 : t2.slides[0]) || void 0 === e2 ? void 0 : e2.panzoomRef;
    if (o2) if (n2) n2.updateControls(o2);
    else for (const t3 of o2.querySelectorAll("[data-panzoom-action]") || []) t3.setAttribute("aria-disabled", ""), t3.setAttribute("tabindex", "-1");
  }
  function p2(t2, ...e2) {
    var o2;
    null === (o2 = null == s2 ? void 0 : s2.getPage().slides[0].panzoomRef) || void 0 === o2 || o2.execute(t2, ...e2);
  }
  return { init: function(t2) {
    s2 = t2, s2.on("initPlugins", c2);
  }, destroy: function() {
    if (s2) {
      s2.off("initPlugins", c2), s2.off("addSlide", f2), s2.off("removeSlide", u2), s2.off("attachSlideEl", g), s2.off("click", d2), s2.off("change", r2), s2.off("ready", r2);
      for (const t2 of s2.getSlides()) u2(0, t2);
    }
    s2 = void 0;
  }, execute: p2 };
};
const e$1 = { syncOnChange: false, syncOnClick: true, syncOnHover: false }, i$5 = () => {
  let i2, t2;
  function o2() {
    const t3 = null == i2 ? void 0 : i2.getOptions().Sync;
    return t$7(t3) ? Object.assign(Object.assign({}, e$1), t3) : e$1;
  }
  function s2(n2) {
    var e2, s3, l3;
    i2 && n2 && (t2 = n2, i2.getOptions().classes = Object.assign(Object.assign({}, i2.getOptions().classes), { isSelected: "" }), i2.getOptions().initialSlide = (null === (s3 = null === (e2 = t2.getPage()) || void 0 === e2 ? void 0 : e2.slides[0]) || void 0 === s3 ? void 0 : s3.index) || 0, o2().syncOnChange && i2.on("change", c2), o2().syncOnClick && i2.on("click", g), o2().syncOnHover && (null === (l3 = i2.getViewport()) || void 0 === l3 || l3.addEventListener("mouseover", u2)), (function() {
      if (!i2 || !t2) return;
      i2.on("ready", d2), i2.on("refresh", a2), t2.on("change", r2), t2.on("filter", f2);
    })());
  }
  function l2() {
    const n2 = o2().target;
    i2 && n2 && s2(n2);
  }
  function d2() {
    v2();
  }
  function c2() {
    var n2;
    if (i2 && t2) {
      const e2 = (null === (n2 = i2.getPage()) || void 0 === n2 ? void 0 : n2.slides) || [], o3 = t2.getPageIndex(e2[0].index || 0);
      o3 > -1 && t2.goTo(o3, i2.hasNavigated() ? void 0 : { tween: false, transition: false }), v2();
    }
  }
  function r2() {
    var n2;
    if (i2 && t2) {
      const e2 = i2.getPageIndex((null === (n2 = t2.getPage()) || void 0 === n2 ? void 0 : n2.slides[0].index) || 0);
      e2 > -1 && i2.goTo(e2, t2.hasNavigated() ? void 0 : { tween: false, transition: false }), v2();
    }
  }
  function g(n2, e2) {
    var o3;
    if (!i2 || !t2) return;
    if (null === (o3 = i2.getTween()) || void 0 === o3 ? void 0 : o3.isRunning()) return;
    const s3 = null == i2 ? void 0 : i2.getOptions().classes.slide;
    if (!s3) return;
    const l3 = s3 ? e2.target.closest(`.${s3}`) : null;
    if (l3) {
      const n3 = parseInt(l3.getAttribute("index") || "") || 0, e3 = t2.getPageIndex(n3);
      t2.goTo(e3);
    }
  }
  function u2(n2) {
    i2 && g(0, n2);
  }
  function a2() {
    var n2;
    if (i2 && t2) {
      const e2 = i2.getPageIndex((null === (n2 = t2.getPage()) || void 0 === n2 ? void 0 : n2.slides[0].index) || 0);
      e2 > -1 && i2.goTo(e2, { tween: false, transition: false }), v2();
    }
  }
  function f2(n2, e2) {
    i2 && t2 && (i2.filter(e2), r2());
  }
  function v2() {
    var n2, e2, o3;
    if (!t2) return;
    const s3 = (null === (e2 = null === (n2 = t2.getPage()) || void 0 === n2 ? void 0 : n2.slides[0]) || void 0 === e2 ? void 0 : e2.index) || 0;
    for (const n3 of (null == i2 ? void 0 : i2.getSlides()) || []) null === (o3 = n3.el) || void 0 === o3 || o3.classList.toggle("is-selected", n3.index === s3);
  }
  return { init: function(n2) {
    i2 = n2, i2.on("initSlides", l2);
  }, destroy: function() {
    var n2;
    null == i2 || i2.off("ready", d2), null == i2 || i2.off("refresh", a2), null == i2 || i2.off("change", c2), null == i2 || i2.off("click", g), null === (n2 = null == i2 ? void 0 : i2.getViewport()) || void 0 === n2 || n2.removeEventListener("mouseover", u2), null == t2 || t2.off("change", r2), null == t2 || t2.off("filter", f2), t2 = void 0, null == i2 || i2.off("initSlides", l2), i2 = void 0;
  }, getTarget: function() {
    return t2;
  } };
};
const s$3 = { showLoading: true, preload: 1 }, n$4 = "is-lazyloading", o$4 = "is-lazyloaded", l$5 = "has-lazyerror", i$4 = () => {
  let i2;
  function d2() {
    const e2 = null == i2 ? void 0 : i2.getOptions().Lazyload;
    return t$7(e2) ? Object.assign(Object.assign({}, s$3), e2) : s$3;
  }
  function r2(t2) {
    var s2;
    const r3 = t2.el;
    if (!r3) return;
    const c3 = "[data-lazy-src],[data-lazy-srcset],[data-lazy-bg]", u2 = Array.from(r3.querySelectorAll(c3));
    r3.matches(c3) && u2.push(r3);
    for (const r4 of u2) {
      const c4 = r4.dataset.lazySrc, u3 = r4.dataset.lazySrcset, f2 = r4.dataset.lazySizes, m2 = r4.dataset.lazyBg, y2 = (r4 instanceof HTMLImageElement || r4 instanceof HTMLSourceElement) && (c4 || u3), z2 = r4 instanceof HTMLElement && m2;
      if (!y2 && !z2) continue;
      const g = c4 || u3 || m2;
      if (g) {
        if (y2 && g) {
          const m3 = null === (s2 = r4.parentElement) || void 0 === s2 ? void 0 : s2.classList.contains("f-panzoom__wrapper");
          d2().showLoading && (null == i2 || i2.showLoading(t2)), r4.addEventListener("load", (() => {
            null == i2 || i2.hideLoading(t2), s$8(r4, l$5), r4 instanceof HTMLImageElement ? r4.decode().then((() => {
              s$8(r4, n$4), s$9(r4, o$4);
            })) : (s$8(r4, n$4), s$9(r4, o$4)), m3 || null == i2 || i2.emit("lazyLoad:loaded", t2, r4, g);
          })), r4.addEventListener("error", (() => {
            null == i2 || i2.hideLoading(t2), s$8(r4, n$4), s$9(r4, l$5), m3 || null == i2 || i2.emit("lazyLoad:error", t2, r4, g);
          })), r4.classList.add("f-lazyload"), r4.classList.add(n$4), m3 || null == i2 || i2.emit("lazyLoad:load", t2, r4, g), c4 && (r4.src = c4), u3 && (r4.srcset = u3), f2 && (r4.sizes = f2);
        } else if (z2) {
          if (!document.body.contains(r4)) {
            document.createElement("img").src = m2;
          }
          r4.style.backgroundImage = `url('${m2}')`;
        }
        delete r4.dataset.lazySrc, delete r4.dataset.lazySrcset, delete r4.dataset.lazySizes, delete r4.dataset.lazyBg;
      }
    }
  }
  function c2() {
    if (!i2) return;
    const e2 = [...i2.getVisibleSlides()], t2 = d2().preload;
    if (t2 > 0) {
      const a2 = i2.getPosition(), s2 = i2.getViewportDim();
      e2.push(...i2.getVisibleSlides(a2 + s2 * t2), ...i2.getVisibleSlides(a2 - s2 * t2));
    }
    for (const t3 of e2) r2(t3);
  }
  return { init: function(e2) {
    i2 = e2, i2.on("render", c2);
  }, destroy: function() {
    null == i2 || i2.off("render", c2), i2 = void 0;
  } };
};
const r$2 = '<svg width="24" height="24" viewBox="0 0 24 24" tabindex="-1">', i$3 = "</svg>", s$2 = { prevTpl: r$2 + '<path d="M15 3l-9 9 9 9"></path>' + i$3, nextTpl: r$2 + '<path d="M9 3l9 9-9 9"></path>' + i$3 }, l$4 = () => {
  let r2, i2, l2;
  function a2() {
    const t2 = null == r2 ? void 0 : r2.getOptions().Arrows;
    return t$7(t2) ? Object.assign(Object.assign({}, s$2), t2) : s$2;
  }
  function u2(e2) {
    if (!r2) return;
    const o2 = `<button data-carousel-go-${e2} tabindex="0" class="f-button is-arrow is-${e2}" title="{{${e2.toUpperCase()}}}">` + a2()[`${e2}Tpl`] + "</button", i3 = e$9(r2.localize(o2)) || void 0;
    return i3 && s$9(i3, a2()[`${e2}Class`]), i3;
  }
  function c2() {
    var t2;
    null == i2 || i2.remove(), i2 = void 0, null == l2 || l2.remove(), l2 = void 0, null === (t2 = null == r2 ? void 0 : r2.getContainer()) || void 0 === t2 || t2.classList.remove("has-arrows");
  }
  function d2() {
    r2 && false !== r2.getOptions().Arrows && r2.getPages().length > 1 ? (!(function() {
      if (!r2) return;
      const t2 = r2.getViewport();
      t2 && (i2 || (i2 = u2("prev"), i2 && t2.insertAdjacentElement("beforebegin", i2)), l2 || (l2 = u2("next"), l2 && t2.insertAdjacentElement("afterend", l2)), s$7(r2.getContainer(), "has-arrows", !(!i2 && !l2)));
    })(), r2 && (null == i2 || i2.toggleAttribute("aria-disabled", !r2.canGoPrev()), null == l2 || l2.toggleAttribute("aria-disabled", !r2.canGoNext()))) : c2();
  }
  return { init: function(t2) {
    r2 = t2.on(["change", "refresh"], d2);
  }, destroy: function() {
    c2(), null == r2 || r2.off(["change", "refresh"], d2), r2 = void 0;
  } };
};
const t$1 = '<circle cx="11" cy="11" r="7.5"/><path d="m21 21-4.35-4.35M8 11h6"/>', M = '<g><line x1="11" y1="8" x2="11" y2="14"></line></g>' + t$1, o$3 = { moveLeft: ["moveLeft", "MOVE_LEFT", '<path d="M5 12h14M5 12l6 6M5 12l6-6"/>'], moveRight: ["moveRight", "MOVE_RIGHT", '<path d="M5 12h14M13 18l6-6M13 6l6 6"/>'], moveUp: ["moveUp", "MOVE_UP", '<path d="M12 5v14M18 11l-6-6M6 11l6-6"/>'], moveDown: ["moveDown", "MOVE_DOWN", '<path d="M12 5v14M18 13l-6 6M6 13l6 6"/>'], zoomOut: ["zoomOut", "ZOOM_OUT", t$1], zoomIn: ["zoomIn", "ZOOM_IN", M], toggleFull: ["toggleFull", "TOGGLE_FULL", M], iterateZoom: ["iterateZoom", "ITERATE_ZOOM", M], toggle1to1: ["toggleFull", "TOGGLE_FULL", '<path d="M3.51 3.07c5.74.02 11.48-.02 17.22.02 1.37.1 2.34 1.64 2.18 3.13 0 4.08.02 8.16 0 12.23-.1 1.54-1.47 2.64-2.79 2.46-5.61-.01-11.24.02-16.86-.01-1.36-.12-2.33-1.65-2.17-3.14 0-4.07-.02-8.16 0-12.23.1-1.36 1.22-2.48 2.42-2.46Z"/><path d="M5.65 8.54h1.49v6.92m8.94-6.92h1.49v6.92M11.5 9.4v.02m0 5.18v0"/>'], rotateCCW: ["rotateCCW", "ROTATE_CCW", '<path d="M15 4.55a8 8 0 0 0-6 14.9M9 15v5H4M18.37 7.16v.01M13 19.94v.01M16.84 18.37v.01M19.37 15.1v.01M19.94 11v.01"/>'], rotateCW: ["rotateCW", "ROTATE_CW", '<path d="M9 4.55a8 8 0 0 1 6 14.9M15 15v5h5M5.63 7.16v.01M4.06 11v.01M4.63 15.1v.01M7.16 18.37v.01M11 19.94v.01"/>'], flipX: ["flipX", "FLIP_X", '<path d="M12 3v18M16 7v10h5L16 7M8 7v10H3L8 7"/>'], flipY: ["flipY", "FLIP_Y", '<path d="M3 12h18M7 16h10L7 21v-5M7 8h10L7 3v5"/>'], reset: ["reset", "RESET", '<path d="M20 11A8.1 8.1 0 0 0 4.5 9M4 5v4h4M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4"/>'], toggleFS: ["toggleFS", "TOGGLE_FS", '<g><path d="M14.5 9.5 21 3m0 0h-6m6 0v6M3 21l6.5-6.5M3 21v-6m0 6h6"/></g><g><path d="m14 10 7-7m-7 7h6m-6 0V4M3 21l7-7m0 0v6m0-6H4"/></g>'] }, v = {};
for (const [t2, M2] of Object.entries(o$3)) v[t2] = { tpl: `<button data-panzoom-action="${M2[0]}" class="f-button" title="{{${M2[1]}}}"><svg>${M2[2]}</svg></button>` };
var l$3;
!(function(t2) {
  t2.Left = "left", t2.middle = "middle", t2.right = "right";
})(l$3 || (l$3 = {}));
const s$1 = Object.assign({ counter: { tpl: '<div class="f-counter"><span data-carousel-page></span>/<span data-carousel-pages></span></div>' }, download: { tpl: '<button data-carousel-download class="f-button" title="{{DOWNLOAD}}"><svg><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2M7 11l5 5 5-5M12 4v12"/></svg></button>' }, autoplay: { tpl: '<button data-autoplay-action="toggle" class="f-button" title="{{TOGGLE_AUTOPLAY}}"><svg><g><path d="M5 3.5 19 12 5 20.5Z"/></g><g><path d="M8 4v15M17 4v15"/></g></svg></button>' }, thumbs: { tpl: '<button data-thumbs-action="toggle" class="f-button" title="{{TOGGLE_THUMBS}}"><svg><rect width="18" height="14" x="3" y="3" rx="2"/><path d="M4 21h1M9 21h1M14 21h1M19 21h1"/></svg></button>' } }, v), a$3 = { absolute: false, display: { left: [], middle: ["zoomIn", "zoomOut", "toggle1to1", "rotateCCW", "rotateCW", "flipX", "flipY", "reset"], right: [] }, enabled: "auto", items: {} }, r$1 = () => {
  let l2, r2;
  function u2(e2) {
    const o2 = null == l2 ? void 0 : l2.getOptions().Toolbar;
    let n2 = (t$7(o2) ? Object.assign(Object.assign({}, a$3), o2) : a$3)[e2];
    return n2 && "function" == typeof n2 && l2 ? n2(l2) : n2;
  }
  function c2() {
    var a2, c3;
    if (!(null == l2 ? void 0 : l2.getOptions().Toolbar)) return;
    if (!l2 || r2) return;
    const d2 = l2.getContainer();
    if (!d2) return;
    let f2 = u2("enabled");
    if (!f2) return;
    const g = u2("absolute"), p2 = l2.getSlides().length > 1;
    let b2 = false, m2 = false;
    for (const t2 of l2.getSlides()) t2.panzoomRef && (b2 = true), (t2.downloadSrc || "image" === t2.type && t2.src) && (m2 = true);
    const v$12 = (null === (a2 = l2.getPlugins().Thumbs) || void 0 === a2 ? void 0 : a2.isEnabled()) || false, h2 = p2 && l2.getPlugins().Autoplay || false, E2 = l2.getPlugins().Fullscreen && (document.fullscreenEnabled || document.webkitFullscreenEnabled);
    if ("auto" === f2 && (f2 = b2), !f2) return;
    r2 = d2.querySelector(".f-carousel__toolbar") || void 0, r2 || (r2 = document.createElement("div"), r2.classList.add("f-carousel__toolbar"));
    const y2 = u2("display"), j2 = r$5({}, s$1, u2("items"));
    for (const i2 of ["left", "middle", "right"]) {
      const s2 = y2[i2] || [], a3 = document.createElement("div");
      a3.classList.add("f-carousel__toolbar__column"), a3.classList.add(`is-${i2}`);
      for (const i3 of s2) {
        let s3;
        if (t$6(i3)) {
          if ("counter" === i3 && !p2) continue;
          if ("autoplay" === i3 && !h2) continue;
          if (v[i3] && !b2) continue;
          if ("fullscreen" === i3 && !E2) continue;
          if ("thumbs" === i3 && !v$12) continue;
          if ("download" === i3 && !m2) continue;
          s3 = j2[i3];
        }
        if (t$7(i3) && (s3 = i3), s3 && s3.tpl) {
          let t2 = l2.localize(s3.tpl);
          t2 = t2.split("<svg>").join('<svg tabindex="-1" width="24" height="24" viewBox="0 0 24 24">');
          const e2 = e$9(t2);
          e2 && ("function" == typeof s3.click && l2 && e2.addEventListener("click", ((t3) => {
            t3.preventDefault(), t3.stopPropagation(), "function" == typeof s3.click && l2 && s3.click(l2, t3);
          })), a3.append(e2));
        }
      }
      r2.append(a3);
    }
    if (r2.childElementCount) {
      if (g && r2.classList.add("is-absolute"), !r2.parentElement) {
        const t2 = u2("parentEl");
        t2 ? t2.insertAdjacentElement("afterbegin", r2) : null === (c3 = l2.getViewport()) || void 0 === c3 || c3.insertAdjacentElement("beforebegin", r2);
      }
      d2.contains(r2) && d2.classList.add("has-toolbar");
    }
  }
  return { init: function(t2) {
    l2 = t2, null == l2 || l2.on("initSlides", c2);
  }, destroy: function() {
    var t2;
    null == l2 || l2.off("initSlides", c2), null === (t2 = null == l2 ? void 0 : l2.getContainer()) || void 0 === t2 || t2.classList.remove("has-toolbar"), null == r2 || r2.remove(), r2 = void 0;
  }, add: function(t2, e2) {
    s$1[t2] = e2;
  }, isEnabled: function() {
    return !!r2;
  } };
};
const n$3 = { autoStart: true, pauseOnHover: true, showProgressbar: true, timeout: 2e3 }, o$2 = () => {
  let o2, i2, a2 = false, s2 = false, l2 = false, r2 = null;
  function u2(e2) {
    const i3 = null == o2 ? void 0 : o2.getOptions().Autoplay;
    let a3 = (t$7(i3) ? Object.assign(Object.assign({}, n$3), i3) : n$3)[e2];
    return a3 && "function" == typeof a3 && o2 ? a3(o2) : a3;
  }
  function f2() {
    clearTimeout(i2), i2 = void 0;
  }
  function g() {
    if (!o2 || !a2 || l2 || s2 || i2 || !o2.isSettled() || (function() {
      var t3;
      const e2 = (null === (t3 = null == o2 ? void 0 : o2.getPage()) || void 0 === t3 ? void 0 : t3.slides) || [];
      for (const t4 of e2) if (0 === t4.state) return true;
      return false;
    })()) return;
    !(function() {
      var t3, n2, i3, a3;
      if (!o2) return;
      if (v2(), !u2("showProgressbar")) return;
      let s3 = u2("progressbarParentEl");
      !s3 && (null === (t3 = o2.getPlugins().Toolbar) || void 0 === t3 ? void 0 : t3.isEnabled()) && (s3 = o2.getContainer());
      if (!s3 && true !== (null === (n2 = o2.getPlugins().Toolbar) || void 0 === n2 ? void 0 : n2.isEnabled())) {
        const t4 = (null === (i3 = o2.getPages()[0]) || void 0 === i3 ? void 0 : i3.slides) || [], e2 = (null === (a3 = o2.getPage()) || void 0 === a3 ? void 0 : a3.slides) || [];
        1 === t4.length && 1 === e2.length && (s3 = e2[0].el);
      }
      s3 || (s3 = o2.getViewport());
      if (!s3) return;
      r2 = document.createElement("div"), s$9(r2, "f-progressbar"), s3.prepend(r2);
      const l3 = u2("timeout") || 1e3;
      r2.style.animationDuration = `${l3}ms`;
    })();
    const t2 = u2("timeout");
    i2 = setTimeout((() => {
      o2 && a2 && !s2 && (o2.isInfinite() || o2.getPageIndex() !== o2.getPages().length - 1 ? o2.next() : o2.goTo(0));
    }), t2);
  }
  function c2() {
    var t2;
    if (!o2 || o2.getPages().length < 2 || false === o2.getOptions().Autoplay) return;
    if (a2) return;
    a2 = true, o2.emit("autoplay:start", u2("timeout")), s$9(o2.getContainer(), "has-autoplay"), null === (t2 = o2.getTween()) || void 0 === t2 || t2.on("start", b2);
    const n2 = null == o2 ? void 0 : o2.getContainer();
    n2 && u2("pauseOnHover") && matchMedia("(hover: hover)").matches && (n2.addEventListener("mouseenter", E2, false), n2.addEventListener("mouseleave", w2, false)), o2.on("change", P), o2.on("settle", y2), o2.on("contentReady", p2), o2.on("panzoom:touchStart", d2), o2.on("panzoom:wheel", d2), o2.isSettled() && g();
  }
  function d2() {
    var t2;
    if (f2(), v2(), o2) {
      if (a2) {
        o2.emit("autoplay:end"), null === (t2 = o2.getTween()) || void 0 === t2 || t2.off("start", b2);
        const e2 = o2.getContainer();
        e2 && (e2.classList.remove("has-autoplay"), e2.removeEventListener("mouseenter", E2, false), e2.removeEventListener("mouseleave", w2, false));
      }
      o2.off("change", P), o2.off("settle", y2), o2.off("contentReady", p2), o2.off("panzoom:touchStart", d2), o2.off("panzoom:wheel", d2);
    }
    a2 = false, s2 = false;
  }
  function v2() {
    r2 && (r2.remove(), r2 = null);
  }
  function m2() {
    o2 && o2.getPages().length > 1 && u2("autoStart") && c2();
  }
  function p2() {
    g();
  }
  function h2(t2, e2) {
    const n2 = e2.target;
    n2 && !e2.defaultPrevented && "toggle" === n2.dataset.autoplayAction && O2.toggle();
  }
  function P() {
    !o2 || !(null == o2 ? void 0 : o2.isInfinite()) && o2.getPageIndex() === o2.getPages().length - 1 ? d2() : (v2(), f2());
  }
  function y2() {
    g();
  }
  function b2() {
    f2(), v2();
  }
  function E2() {
    l2 = true, a2 && (v2(), f2());
  }
  function w2() {
    l2 = false, a2 && !s2 && (null == o2 ? void 0 : o2.isSettled()) && g();
  }
  const O2 = { init: function(t2) {
    o2 = t2, o2.on("ready", m2), o2.on("click", h2);
  }, destroy: function() {
    d2(), null == o2 || o2.off("ready", m2), null == o2 || o2.off("click", h2), o2 = void 0;
  }, isEnabled: () => a2, pause: function() {
    s2 = true, f2();
  }, resume: function() {
    s2 = false, a2 && !l2 && g();
  }, start() {
    c2();
  }, stop() {
    d2();
  }, toggle() {
    a2 ? d2() : c2();
  } };
  return O2;
};
const u$1 = { Carousel: { Lazyload: { showLoading: false } }, minCount: 2, showOnStart: true, thumbTpl: '<button aria-label="Slide to #{{page}}"><img draggable="false" alt="{{alt}}" data-lazy-src="{{src}}" /></button>', type: "modern" };
let a$2;
const c$1 = () => {
  let c2, d2, f2, m2, g, h2 = 0, v2 = 0, p2 = true;
  function b2(e2) {
    const n2 = null == c2 ? void 0 : c2.getOptions().Thumbs;
    let o2 = (t$7(n2) ? Object.assign(Object.assign({}, u$1), n2) : u$1)[e2];
    return o2 && "function" == typeof o2 && c2 ? o2(c2) : o2;
  }
  function y2() {
    if (!c2) return false;
    if (false === (null == c2 ? void 0 : c2.getOptions().Thumbs)) return false;
    let t2 = 0;
    for (const e2 of c2.getSlides()) e2.thumbSrc && t2++;
    return t2 >= b2("minCount");
  }
  function x2() {
    return "modern" === b2("type");
  }
  function S() {
    return "scrollable" === b2("type");
  }
  function C() {
    const t2 = [], e2 = (null == c2 ? void 0 : c2.getSlides()) || [];
    for (const n2 of e2) t2.push({ index: n2.index, class: n2.thumbClass, html: T(n2) });
    return t2;
  }
  function T(t2) {
    const e2 = t2.thumb ? t2.thumb instanceof HTMLImageElement ? t2.thumb.src : t2.thumb : t2.thumbSrc || void 0, o2 = void 0 === t2.thumbAlt ? `Thumbnail #${t2.index}` : t2.thumbAlt + "";
    let i2 = b2("thumbTpl");
    return i2 = n$5(i2, "{{alt}}", o2), i2 = n$5(i2, "{{src}}", e2 + ""), i2 = n$5(i2, "{{index}}", `${t2.index}`), i2 = n$5(i2, "{{page}}", `${t2.index || 1}`), i2;
  }
  function L(t2) {
    return `<div index="${t2.index || 0}" class="f-thumbs__slide ${t2.class || ""}">${t2.html || ""}</div>`;
  }
  function E2(t2 = false) {
    var e2;
    const n2 = null == c2 ? void 0 : c2.getContainer();
    if (!c2 || !n2 || f2) return;
    if (!y2()) return;
    const o2 = (null === (e2 = b2("Carousel")) || void 0 === e2 ? void 0 : e2.classes) || {};
    if (o2.container = o2.container || "f-thumbs", !f2) {
      const t3 = n2.nextElementSibling;
      (null == t3 ? void 0 : t3.classList.contains(o2.container)) && (f2 = t3);
    }
    if (!f2) {
      f2 = document.createElement("div");
      const t3 = b2("parentEl");
      t3 ? t3.insertAdjacentElement("beforeend", f2) : n2.insertAdjacentElement("afterend", f2);
    }
    s$9(f2, o2.container), s$9(f2, "f-thumbs"), s$9(f2, `is-${b2("type")}`), t2 && s$9(f2, "is-hidden");
  }
  function P() {
    if (!f2 || !S()) return;
    m2 = document.createElement("div"), s$9(m2, "f-thumbs__viewport");
    let t2 = "";
    for (const e2 of C()) {
      "string" == typeof (e2.html || "") && (t2 += L(e2));
    }
    m2.innerHTML = t2, f2.append(m2), f2.addEventListener("click", ((t3) => {
      t3.preventDefault();
      const e2 = t3.target.closest("[index]"), n2 = parseInt((null == e2 ? void 0 : e2.getAttribute("index")) || "-1");
      c2 && n2 > -1 && c2.goTo(n2);
    })), g = new IntersectionObserver(((t3) => {
      t3.forEach(((t4) => {
        t4.isIntersecting && t4.target instanceof HTMLImageElement && (t4.target.src = t4.target.getAttribute("data-lazy-src") + "", t4.target.removeAttribute("data-lazy-src"), null == g || g.unobserve(t4.target));
      }));
    }), { root: m2, rootMargin: "100px" }), f2.querySelectorAll("[data-lazy-src]").forEach(((t3) => {
      null == g || g.observe(t3);
    })), null == c2 || c2.emit("thumbs:ready");
  }
  function w2() {
    var t2;
    if (!a$2 || !c2 || !f2 || S() || d2) return;
    const n2 = C();
    if (!n2.length) return;
    const o2 = r$5({}, { Sync: { target: c2 }, Lazyload: { preload: 1 }, slides: n2, classes: { container: "f-thumbs", viewport: "f-thumbs__viewport", slide: "f-thumbs__slide" }, center: true, fill: !x2(), infinite: false, dragFree: true, rtl: c2.getOptions().rtl || false, slidesPerPage: (t3) => {
      let e2 = 0;
      return x2() && (!(function() {
        if (!x2()) return;
        if (!f2) return;
        const t4 = (t5) => f2 && parseFloat(getComputedStyle(f2).getPropertyValue("--f-thumb-" + t5)) || 0;
        h2 = t4("width"), v2 = t4("clip-width");
      })(), e2 = 4 * (h2 - v2)), t3 && t3.getTotalSlideDim() <= t3.getViewportDim() - e2 ? 1 / 0 : 1;
    } }, u$1.Carousel || {}, b2("Carousel") || {});
    d2 = a$2(f2, o2, { Sync: i$5, Lazyload: i$4 }), d2.on("ready", (() => {
      s$9(f2, "is-syncing"), null == c2 || c2.emit("thumbs:ready"), x2() && (null == c2 || c2.on("render", $));
    })), d2.on("destroy", (() => {
      null == c2 || c2.emit("thumbs:destroy");
    })), d2.init(), null === (t2 = d2.getGestures()) || void 0 === t2 || t2.on("start", (() => {
      p2 = false;
    })), d2.on("click", ((t3, e2) => {
      const n3 = e2.target;
      if (n3) {
        const t4 = n3.matches("button") ? n3 : n3.firstElementChild;
        t4 && t4.matches("button") && (e2.preventDefault(), t4.focus({ preventScroll: true }));
      }
    })), s$9(c2.getContainer(), "has-thumbs"), R2();
  }
  function j2() {
    y2() && b2("showOnStart") && (E2(), P());
  }
  function A2() {
    var t2;
    y2() && (w2(), null == c2 || c2.on("addSlide", z2), null == c2 || c2.on("removeSlide", _2), null == c2 || c2.on("click", I2), null == c2 || c2.on("refresh", q2), null === (t2 = null == c2 ? void 0 : c2.getGestures()) || void 0 === t2 || t2.on("start", M2), D2(true));
  }
  function M2() {
    var t2, e2;
    p2 = true;
    (null === (t2 = document.activeElement) || void 0 === t2 ? void 0 : t2.closest(".f-thumbs")) && (null === (e2 = document.activeElement) || void 0 === e2 || e2.blur());
  }
  function $() {
    var t2, e2;
    null == f2 || f2.classList.toggle("is-syncing", false === (null == c2 ? void 0 : c2.hasNavigated()) || (null === (t2 = null == c2 ? void 0 : c2.getTween()) || void 0 === t2 ? void 0 : t2.isRunning())), R2(), (null === (e2 = null == c2 ? void 0 : c2.getGestures()) || void 0 === e2 ? void 0 : e2.isPointerDown()) && (function() {
      if (!x2()) return;
      if (!c2 || !d2) return;
      if (!p2) return;
      const t3 = d2.getTween(), e3 = d2.getPages(), n2 = c2.getPageIndex() || 0, i2 = c2.getPageProgress() || 0;
      if (!(c2 && e3 && e3[n2] && t3)) return;
      const l2 = t3.isRunning() ? t3.getCurrentValues().pos : d2.getPosition();
      if (void 0 === l2) return;
      let r2 = e3[n2].pos + i2 * (h2 - v2);
      r2 = t$4(e3[0].pos, r2, e3[e3.length - 1].pos), t3.from({ pos: l2 }).to({ pos: r2 }).start();
    })();
  }
  function O2() {
    p2 = true, D2();
  }
  function z2(t2, e2) {
    const n2 = { html: T(e2) };
    if (d2) d2.add(n2, e2.index);
    else if (m2) {
      const t3 = e$9(L(n2));
      if (t3) {
        m2.append(t3);
        const e3 = t3.querySelector("img");
        e3 && (null == g || g.observe(e3));
      }
    }
  }
  function _2(t2, e2) {
    var n2;
    d2 ? d2.remove(e2.index) : m2 && (null === (n2 = m2.querySelector(`[index="${e2.index}"]`)) || void 0 === n2 || n2.remove());
  }
  function I2(t2, e2) {
    var n2;
    const o2 = e2.target;
    e2.defaultPrevented || "toggle" !== (null === (n2 = null == o2 ? void 0 : o2.dataset) || void 0 === n2 ? void 0 : n2.thumbsAction) || (f2 || (E2(true), P(), w2()), f2 && f2.classList.toggle("is-hidden"));
  }
  function q2() {
    D2();
  }
  function D2(t2 = false) {
    if (!c2 || !m2 || !S()) return;
    const e2 = c2.getPageIndex();
    m2.querySelectorAll(".is-selected").forEach(((t3) => {
      t3.classList.remove("is-selected");
    }));
    const n2 = m2.querySelector(`[index="${e2}"]`);
    if (n2) {
      n2.classList.add("is-selected");
      const e3 = m2.getBoundingClientRect(), o2 = n2.getBoundingClientRect(), i2 = n2.offsetTop - m2.offsetTop - 0.5 * e3.height + 0.5 * o2.height, l2 = n2.scrollLeft - m2.scrollLeft - 0.5 * e3.width + 0.5 * o2.width;
      m2.scrollTo({ top: i2, left: l2, behavior: t2 ? "instant" : "smooth" });
    }
  }
  function R2() {
    if (!x2()) return;
    if (!c2 || !d2) return;
    const t2 = (null == d2 ? void 0 : d2.getSlides()) || [];
    let e2 = -0.5 * h2;
    for (const n2 of t2) {
      const t3 = n2.el;
      if (!t3) continue;
      let o2 = c2.getPageProgress(n2.index) || 0;
      o2 = Math.max(-1, Math.min(1, o2)), o2 > -1 && o2 < 1 && (e2 += 0.5 * h2 * (1 - Math.abs(o2))), o2 = Math.round(1e4 * o2) / 1e4, e2 = Math.round(1e4 * e2) / 1e4, t3.style.setProperty("--progress", `${Math.abs(o2)}`), t3.style.setProperty("--shift", `${(null == c2 ? void 0 : c2.isRTL()) ? -1 * e2 : e2}px`), o2 > -1 && o2 < 1 && (e2 += 0.5 * h2 * (1 - Math.abs(o2)));
    }
  }
  return { init: function(t2, e2) {
    a$2 = e2, c2 = t2, c2.on("ready", A2), c2.on("initSlides", j2), c2.on("change", O2);
  }, destroy: function() {
    var t2, e2;
    S() && (null == c2 || c2.emit("thumbs:destroy")), null == c2 || c2.off("ready", A2), null == c2 || c2.off("initSlides", j2), null == c2 || c2.off("change", O2), null == c2 || c2.off("render", $), null == c2 || c2.off("addSlide", z2), null == c2 || c2.off("click", I2), null == c2 || c2.off("refresh", q2), null === (t2 = null == c2 ? void 0 : c2.getGestures()) || void 0 === t2 || t2.off("start", M2), null === (e2 = null == c2 ? void 0 : c2.getContainer()) || void 0 === e2 || e2.classList.remove("has-thumbs"), c2 = void 0, null == d2 || d2.destroy(), d2 = void 0, null == f2 || f2.remove(), f2 = void 0;
  }, getCarousel: function() {
    return d2;
  }, getContainer: function() {
    return f2;
  }, getType: function() {
    return b2("type");
  }, isEnabled: y2 };
};
const a$1 = { iframeAttr: { allow: "autoplay; fullscreen", scrolling: "auto" } }, i$2 = () => {
  let i2;
  function l2(t2, a2) {
    let i3 = a2.src;
    if (!t$6(i3)) return;
    let l3 = a2.type;
    if (!l3) {
      if (l3 || ("#" === i3.charAt(0) ? l3 = "inline" : i3.match(/(^data:image\/[a-z0-9+\/=]*,)|(\.((a)?png|avif|gif|jp(g|eg)|pjp(eg)?|jfif|svg|webp|bmp|ico|tif(f)?)((\?|#).*)?$)/i) ? l3 = "image" : i3.match(/\.(pdf)((\?|#).*)?$/i) ? l3 = "pdf" : i3.match(/\.(html|php)((\?|#).*)?$/i) && (l3 = "iframe")), !l3) {
        const t3 = i3.match(/(?:maps\.)?google\.([a-z]{2,3}(?:\.[a-z]{2})?)\/(?:(?:(?:maps\/(?:place\/(?:.*)\/)?\@(.*),(\d+.?\d+?)z))|(?:\?ll=))(.*)?/i);
        t3 && (i3 = `https://maps.google.${t3[1]}/?ll=${(t3[2] ? t3[2] + "&z=" + Math.floor(parseFloat(t3[3])) + (t3[4] ? t3[4].replace(/^\//, "&") : "") : t3[4] + "").replace(/\?/, "&")}&output=${t3[4] && t3[4].indexOf("layer=c") > 0 ? "svembed" : "embed"}`, l3 = "gmap");
      }
      if (!l3) {
        const t3 = i3.match(/(?:maps\.)?google\.([a-z]{2,3}(?:\.[a-z]{2})?)\/(?:maps\/search\/)(.*)/i);
        t3 && (i3 = `https://maps.google.${t3[1]}/maps?q=${t3[2].replace("query=", "q=").replace("api=1", "")}&output=embed`, l3 = "gmap");
      }
      a2.src = i3, a2.type = l3;
    }
  }
  function o2(e2, l3) {
    "iframe" !== l3.type && "pdf" !== l3.type && "gmap" !== l3.type || (function(e3) {
      if (!i2 || !e3.el || !e3.src) return;
      const l4 = document.createElement("iframe");
      l4.classList.add("f-iframe");
      for (const [e4, o4] of Object.entries((function() {
        const e5 = null == i2 ? void 0 : i2.getOptions().Html;
        return t$7(e5) ? Object.assign(Object.assign({}, a$1), e5) : a$1;
      })().iframeAttr || {})) l4.setAttribute(e4, o4);
      l4.onerror = () => {
        i2 && 1 === i2.getState() && i2.showError(e3, "{{IFRAME_ERROR}}");
      }, l4.src = e3.src;
      const o3 = document.createElement("div");
      if (o3.classList.add("f-html"), o3.append(l4), e3.width) {
        let t2 = `${e3.width}`;
        t2.match(/^\d+$/) && (t2 += "px"), o3.style.maxWidth = `${t2}`;
      }
      if (e3.height) {
        let t2 = `${e3.height}`;
        t2.match(/^\d+$/) && (t2 += "px"), o3.style.maxHeight = `${t2}`;
      }
      if (e3.aspectRatio) {
        const t2 = e3.el.getBoundingClientRect();
        o3.style.aspectRatio = `${e3.aspectRatio}`, o3.style[t2.width > t2.height ? "width" : "height"] = "auto", o3.style[t2.width > t2.height ? "maxWidth" : "maxHeight"] = "none";
      }
      e3.contentEl = l4, e3.htmlEl = o3, e3.el.classList.add("has-html"), e3.el.classList.add("has-iframe"), e3.el.classList.add(`has-${e3.type}`), e3.el.prepend(o3), i2.emit("contentReady", e3);
    })(l3);
  }
  function n2(t2, e2) {
    var a2, l3;
    "iframe" !== e2.type && "pdf" !== e2.type && "gmap" !== e2.type || (null == i2 || i2.hideError(e2), null === (a2 = e2.contentEl) || void 0 === a2 || a2.remove(), e2.contentEl = void 0, null === (l3 = e2.htmlEl) || void 0 === l3 || l3.remove(), e2.htmlEl = void 0);
  }
  return { init: function(t2) {
    i2 = t2, i2.on("addSlide", l2), i2.on("attachSlideEl", o2), i2.on("detachSlideEl", n2);
  }, destroy: function() {
    null == i2 || i2.off("addSlide", l2), null == i2 || i2.off("attachSlideEl", o2), null == i2 || i2.off("detachSlideEl", n2), i2 = void 0;
  } };
};
const n$2 = (t2, e2 = {}) => {
  const o2 = new URL(t2), n2 = new URLSearchParams(o2.search), i2 = new URLSearchParams();
  for (const [t3, o3] of [...n2, ...Object.entries(e2)]) {
    let e3 = o3 + "";
    if ("t" === t3) {
      let t4 = e3.match(/((\d*)m)?(\d*)s?/);
      t4 && i2.set("start", 60 * parseInt(t4[2] || "0") + parseInt(t4[3] || "0") + "");
    } else i2.set(t3, e3);
  }
  let l2 = i2 + "", s2 = t2.match(/#t=((.*)?\d+s)/);
  return s2 && (l2 += `#t=${s2[1]}`), l2;
}, i$1 = { autoplay: false, html5videoTpl: `<video class="f-html5video" playsinline controls controlsList="nodownload" poster="{{poster}}">
    <source src="{{src}}" type="{{format}}" />Sorry, your browser doesn't support embedded videos.</video>`, iframeAttr: { allow: "autoplay; fullscreen", scrolling: "auto", credentialless: "" }, vimeo: { byline: 1, color: "00adef", controls: 1, dnt: 1, muted: 0 }, youtube: { controls: 1, enablejsapi: 1, nocookie: 1, rel: 0, fs: 1 } }, l$2 = () => {
  let l2, s2 = false;
  function a2() {
    const e2 = null == l2 ? void 0 : l2.getOptions().Video;
    return t$7(e2) ? Object.assign(Object.assign({}, i$1), e2) : i$1;
  }
  function r2() {
    var t2;
    return null === (t2 = null == l2 ? void 0 : l2.getPage()) || void 0 === t2 ? void 0 : t2.slides[0];
  }
  const c2 = (t2) => {
    var e2;
    try {
      let o2 = JSON.parse(t2.data);
      if ("https://player.vimeo.com" === t2.origin) {
        if ("ready" === o2.event) for (let o3 of Array.from((null === (e2 = null == l2 ? void 0 : l2.getContainer()) || void 0 === e2 ? void 0 : e2.getElementsByClassName("f-iframe")) || [])) o3 instanceof HTMLIFrameElement && o3.contentWindow === t2.source && (o3.dataset.ready = "true");
      } else if (t2.origin.match(/^https:\/\/(www.)?youtube(-nocookie)?.com$/) && "onReady" === o2.event) {
        const t3 = document.getElementById(o2.id);
        t3 && (t3.dataset.ready = "true");
      }
    } catch (t3) {
    }
  };
  function d2(t2, o2) {
    const i2 = o2.src;
    if (!t$6(i2)) return;
    let l3 = o2.type;
    if (!l3 || "html5video" === l3) {
      const t3 = i2.match(/\.(mp4|mov|ogv|webm)((\?|#).*)?$/i);
      t3 && (l3 = "html5video", o2.html5videoFormat = o2.html5videoFormat || "video/" + ("ogv" === t3[1] ? "ogg" : t3[1]));
    }
    if (!l3 || "youtube" === l3) {
      const t3 = i2.match(/(youtube\.com|youtu\.be|youtube\-nocookie\.com)\/(?:watch\?(?:.*&)?v=|v\/|u\/|shorts\/|embed\/?)?(videoseries\?list=(?:.*)|[\w-]{11}|\?listType=(?:.*)&list=(?:.*))(?:.*)/i);
      if (t3) {
        const e2 = Object.assign(Object.assign({}, a2().youtube), o2.youtube || {}), s3 = `www.youtube${e2.nocookie ? "-nocookie" : ""}.com`, r3 = n$2(i2, e2), c3 = encodeURIComponent(t3[2]);
        o2.videoId = c3, o2.src = `https://${s3}/embed/${c3}?${r3}`, o2.thumb = o2.thumb || `https://i.ytimg.com/vi/${c3}/mqdefault.jpg`, l3 = "youtube";
      }
    }
    if (!l3 || "vimeo" === l3) {
      const t3 = i2.match(/^.+vimeo.com\/(?:\/)?(video\/)?([\d]+)((\/|\?h=)([a-z0-9]+))?(.*)?/);
      if (t3) {
        const e2 = Object.assign(Object.assign({}, a2().vimeo), o2.vimeo || {}), s3 = n$2(i2, e2), r3 = encodeURIComponent(t3[2]), c3 = t3[5] || "";
        o2.videoId = r3, o2.src = `https://player.vimeo.com/video/${r3}?${c3 ? `h=${c3}${s3 ? "&" : ""}` : ""}${s3}`, l3 = "vimeo";
      }
    }
    o2.type = l3;
  }
  function u2(t2, n2) {
    "html5video" === n2.type && (function(t3) {
      if (!l2 || !t3.el || !t3.src) return;
      const { el: n3, src: i2 } = t3;
      if (!n3 || !i2) return;
      const s3 = t3.html5videoTpl || a2().html5videoTpl, r3 = t3.html5videoFormat || a2().html5videoFormat;
      if (!s3) return;
      const c3 = t3.poster || (t3.thumb && t$6(t3.thumb) ? t3.thumb : ""), d3 = e$9(s3.replace(/\{\{src\}\}/gi, i2 + "").replace(/\{\{format\}\}/gi, r3 || "").replace(/\{\{poster\}\}/gi, c3 + ""));
      if (!d3) return;
      const u3 = document.createElement("div");
      u3.classList.add("f-html"), u3.append(d3), t3.contentEl = d3, t3.htmlEl = u3, n3.classList.add(`has-${t3.type}`), n3.prepend(u3), h2(t3), l2.emit("contentReady", t3);
    })(n2), "youtube" !== n2.type && "vimeo" !== n2.type || (function(t3) {
      if (!l2 || !t3.el || !t3.src) return;
      const e2 = document.createElement("iframe");
      e2.classList.add("f-iframe"), e2.setAttribute("id", `f-iframe_${t3.videoId}`);
      for (const [t4, o3] of Object.entries(a2().iframeAttr || {})) e2.setAttribute(t4, o3);
      e2.onload = () => {
        var o3;
        l2 && 1 === l2.getState() && "youtube" === t3.type && (null === (o3 = e2.contentWindow) || void 0 === o3 || o3.postMessage(JSON.stringify({ event: "listening", id: e2.getAttribute("id") }), "*"));
      }, e2.onerror = () => {
        l2 && 1 === l2.getState() && (null == l2 || l2.showError(t3, "{{IFRAME_ERROR}}"));
      }, e2.src = t3.src;
      const o2 = document.createElement("div");
      o2.classList.add("f-html"), o2.append(e2), t3.contentEl = e2, t3.htmlEl = o2, t3.el.classList.add("has-html"), t3.el.classList.add("has-iframe"), t3.el.classList.add(`has-${t3.type}`), t3.el.prepend(o2), h2(t3), l2.emit("contentReady", t3);
    })(n2);
  }
  function m2(t2, e2) {
    var o2, n2;
    "html5video" !== e2.type && "youtube" !== e2.type && "vimeo" !== e2.type || (null === (o2 = e2.contentEl) || void 0 === o2 || o2.remove(), e2.contentEl = void 0, null === (n2 = e2.htmlEl) || void 0 === n2 || n2.remove(), e2.htmlEl = void 0), e2.poller && clearTimeout(e2.poller);
  }
  function f2() {
    s2 = false;
  }
  function p2() {
    if (s2) return;
    s2 = true;
    const t2 = r2();
    (t2 && void 0 !== t2.autoplay ? t2.autoplay : a2().autoplay) && ((function() {
      var t3;
      const e2 = r2(), o2 = null == e2 ? void 0 : e2.el;
      if (o2 && "html5video" === (null == e2 ? void 0 : e2.type)) try {
        const t4 = o2.querySelector("video");
        if (t4) {
          const e3 = t4.play();
          void 0 !== e3 && e3.then((() => {
          })).catch(((e4) => {
            t4.muted = true, t4.play();
          }));
        }
      } catch (t4) {
      }
      const n2 = null == e2 ? void 0 : e2.htmlEl;
      n2 instanceof HTMLIFrameElement && (null === (t3 = n2.contentWindow) || void 0 === t3 || t3.postMessage('{"event":"command","func":"stopVideo","args":""}', "*"));
    })(), (function() {
      const t3 = r2(), e2 = null == t3 ? void 0 : t3.type;
      if (!(null == t3 ? void 0 : t3.el) || "youtube" !== e2 && "vimeo" !== e2) return;
      const o2 = () => {
        if (t3.contentEl && t3.contentEl instanceof HTMLIFrameElement && t3.contentEl.contentWindow) {
          let e3;
          if ("true" === t3.contentEl.dataset.ready) return e3 = "youtube" === t3.type ? { event: "command", func: "playVideo" } : { method: "play", value: "true" }, e3 && t3.contentEl.contentWindow.postMessage(JSON.stringify(e3), "*"), void (t3.poller = void 0);
          "youtube" === t3.type && (e3 = { event: "listening", id: t3.contentEl.getAttribute("id") }, t3.contentEl.contentWindow.postMessage(JSON.stringify(e3), "*"));
        }
        t3.poller = setTimeout(o2, 250);
      };
      o2();
    })());
  }
  function h2(t2) {
    const e2 = null == t2 ? void 0 : t2.htmlEl;
    if (t2 && e2 && ("html5video" === t2.type || "youtube" === t2.type || "vimeo" === t2.type)) {
      if (e2.style.aspectRatio = "", e2.style.width = "", e2.style.height = "", e2.style.maxWidth = "", e2.style.maxHeight = "", t2.width) {
        let o2 = `${t2.width}`;
        o2.match(/^\d+$/) && (o2 += "px"), e2.style.maxWidth = `${o2}`;
      }
      if (t2.height) {
        let o2 = `${t2.height}`;
        o2.match(/^\d+$/) && (o2 += "px"), e2.style.maxHeight = `${o2}`;
      }
      if (t2.aspectRatio) {
        const o2 = t2.aspectRatio.split("/"), n2 = parseFloat(o2[0].trim()), i2 = o2[1] ? parseFloat(o2[1].trim()) : 0, l3 = n2 && i2 ? n2 / i2 : n2;
        e2.offsetHeight;
        const s3 = e2.getBoundingClientRect(), a3 = l3 < (s3.width || 1) / (s3.height || 1);
        e2.style.aspectRatio = `${t2.aspectRatio}`, e2.style.width = a3 ? "auto" : "", e2.style.height = a3 ? "" : "auto";
      }
    }
  }
  function v2() {
    h2(r2());
  }
  return { init: function(t2) {
    l2 = t2, l2.on("addSlide", d2), l2.on("attachSlideEl", u2), l2.on("detachSlideEl", m2), l2.on("ready", p2), l2.on("change", f2), l2.on("settle", p2), l2.on("refresh", v2), window.addEventListener("message", c2);
  }, destroy: function() {
    null == l2 || l2.off("addSlide", d2), null == l2 || l2.off("attachSlideEl", u2), null == l2 || l2.off("detachSlideEl", m2), null == l2 || l2.off("ready", p2), null == l2 || l2.off("change", f2), null == l2 || l2.off("settle", p2), null == l2 || l2.off("refresh", v2), window.removeEventListener("message", c2), l2 = void 0;
  } };
};
const n$1 = { autoStart: false, btnTpl: '<button data-fullscreen-action="toggle" class="f-button" title="{{TOGGLE_FULLSCREEN}}"><svg><g><path d="M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M16 21h3a2 2 0 0 0 2-2v-3"/></g><g><path d="M15 19v-2a2 2 0 0 1 2-2h2M15 5v2a2 2 0 0 0 2 2h2M5 15h2a2 2 0 0 1 2 2v2M5 9h2a2 2 0 0 0 2-2V5"/></g></svg></button>' }, t = "in-fullscreen-mode", l$1 = () => {
  let l2;
  function u2(t2) {
    const u3 = null == l2 ? void 0 : l2.getOptions().Fullscreen;
    let o3 = (t$7(u3) ? Object.assign(Object.assign({}, n$1), u3) : n$1)[t2];
    return o3 && "function" == typeof o3 && l2 ? o3(l2) : o3;
  }
  function o2() {
    var e2;
    null === (e2 = null == l2 ? void 0 : l2.getPlugins().Toolbar) || void 0 === e2 || e2.add("fullscreen", { tpl: u2("btnTpl") });
  }
  function c2() {
    if (u2("autoStart")) {
      const e2 = s2();
      e2 && a2(e2);
    }
  }
  function i2(e2, n2) {
    const t2 = n2.target;
    t2 && !n2.defaultPrevented && "toggle" === t2.dataset.fullscreenAction && d2();
  }
  function s2() {
    return u2("el") || (null == l2 ? void 0 : l2.getContainer()) || void 0;
  }
  function r2() {
    const e2 = document;
    return e2.fullscreenEnabled ? !!e2.fullscreenElement : !!e2.webkitFullscreenEnabled && !!e2.webkitFullscreenElement;
  }
  function a2(e2) {
    const n2 = document;
    let l3;
    return e2 || (e2 = n2.documentElement), n2.fullscreenEnabled ? l3 = e2.requestFullscreen() : n2.webkitFullscreenEnabled && (l3 = e2.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT)), l3 && l3.then((() => {
      e2.classList.add(t);
    })), l3;
  }
  function f2() {
    const e2 = document;
    let n2;
    return e2.fullscreenEnabled ? n2 = e2.fullscreenElement && e2.exitFullscreen() : e2.webkitFullscreenEnabled && (n2 = e2.webkitFullscreenElement && e2.webkitExitFullscreen()), n2 && n2.then((() => {
      var e3;
      null === (e3 = s2()) || void 0 === e3 || e3.classList.remove(t);
    })), n2;
  }
  function d2() {
    if (r2()) f2();
    else {
      const e2 = s2();
      e2 && a2(e2);
    }
  }
  return { init: function(e2) {
    l2 = e2, l2.on("initPlugins", o2), l2.on("ready", c2), l2.on("click", i2);
  }, destroy: function() {
    null == l2 || l2.off("initPlugins", o2), null == l2 || l2.off("ready", c2), null == l2 || l2.off("click", i2);
  }, exit: f2, inFullscreen: r2, request: a2, toggle: d2 };
};
let e, n, o$1 = false, r = false, i = false, l = false;
const s = () => {
  const t2 = new URL(document.URL).hash, e2 = t2.slice(1).split("-"), n2 = e2[e2.length - 1], o2 = n2 && /^\+?\d+$/.test(n2) && parseInt(e2.pop() || "1", 10) || 1;
  return { urlHash: t2, urlSlug: e2.join("-"), urlIndex: o2 };
}, a = () => {
  const t2 = null == e ? void 0 : e.getInstance();
  return !(!t2 || 1 != t2.getState());
}, u = () => {
  if (!e) return;
  if (a()) return;
  const { urlSlug: t2, urlIndex: n2 } = s();
  if (!t2) return;
  let o2 = document.querySelector(`[data-slug="${t2}"]`);
  o2 && e.fromTriggerEl(o2), a() || (o2 = document.querySelectorAll(`[data-fancybox="${t2}"]`)[n2 - 1], o2 && e.fromTriggerEl(o2, { startIndex: n2 - 1 })), a() && o2 && !o2.closest("[inert]") && o2.scrollIntoView({ behavior: "instant", block: "center", inline: "center" });
}, c = () => {
  if (!e) return;
  if (i) return;
  const t2 = null == e ? void 0 : e.getInstance(), n2 = null == t2 ? void 0 : t2.getCarousel();
  if (false === (null == t2 ? void 0 : t2.getOptions().Hash)) return;
  const { urlSlug: o2, urlIndex: a2 } = s();
  if (t2 && n2) {
    const e2 = n2.getSlides();
    for (const t3 of e2 || []) if (o2 === t3.slug || o2 === t3.fancybox && t3.index === a2 - 1) return r = false, void n2.goTo(t3.index);
    l = true, t2.close(), l = false;
  }
  u();
}, d = () => {
  e && (n = setTimeout((() => {
    o$1 = true, u(), o$1 = false;
  }), 300), window.addEventListener("hashchange", c, false));
}, f = () => {
  let t2, e2 = "auto", a2 = "";
  function u2() {
    var n2, i2, l2;
    if (!t2 || !t2.isTopMost()) return;
    if (false === t2.getOptions().Hash) return;
    if (o$1) {
      const e3 = t2.getOptions().sync;
      e3 && e3.goTo((null === (n2 = null == t2 ? void 0 : t2.getCarousel()) || void 0 === n2 ? void 0 : n2.getPageIndex()) || 0, { transition: false, tween: false });
    }
    const u3 = t2.getCarousel();
    if (!u3) return;
    const { urlHash: d3, urlSlug: f2 } = s(), g = t2.getSlide();
    if (!g) return;
    let h2 = g.slug || g.fancybox || "", w2 = parseInt(g.index + "", 10) + 1;
    if (!h2) return;
    let p2 = g.slug ? `#${g.slug}` : `#${h2}-${w2}`;
    ((null === (l2 = null === (i2 = t2.getCarousel()) || void 0 === i2 ? void 0 : i2.getPages()) || void 0 === l2 ? void 0 : l2.length) || 0) < 2 && (p2 = `#${h2}`), d3 !== p2 && (a2 = d3), history.scrollRestoration && (e2 = history.scrollRestoration, history.scrollRestoration = "manual"), u3.on("change", c2);
    const y2 = h2 !== f2;
    try {
      window.history[y2 ? "pushState" : "replaceState"]({}, document.title, window.location.pathname + window.location.search + p2), y2 && (r = true);
    } catch (t3) {
    }
  }
  function c2() {
    if (!t2 || !t2.isTopMost()) return;
    if (false === t2.getOptions().Hash) return;
    const e3 = t2.getSlide();
    if (!e3) return;
    let n2 = e3.slug || e3.fancybox || "", o2 = e3.index + 1, r2 = e3.slug ? `#${e3.slug}` : `#${n2}-${o2}`;
    i = true;
    try {
      window.history.replaceState({}, document.title, window.location.pathname + window.location.search + r2);
    } catch (t3) {
    }
    i = false;
  }
  function d2() {
    if (l) return;
    if (!t2 || !t2.isTopMost()) return;
    if (false === t2.getOptions().Hash) return;
    const e3 = t2.getSlide();
    if (!e3) return;
    if (e3.fancybox || "") {
      i = true;
      try {
        r && !(function() {
          if (window.parent === window) return false;
          try {
            var t3 = window.frameElement;
          } catch (e4) {
            t3 = null;
          }
          return null === t3 ? "data:" === location.protocol : t3.hasAttribute("sandbox");
        })() ? window.history.back() : window.history.replaceState({}, document.title, window.location.pathname + window.location.search + a2);
      } catch (t3) {
      }
      i = false;
    }
  }
  return { init: function(e3) {
    clearTimeout(n), t2 = e3, t2.on("ready", u2), t2.on("close", d2);
  }, destroy: function() {
    null == t2 || t2.off("ready", u2), null == t2 || t2.off("close", d2);
    const n2 = null == t2 ? void 0 : t2.getCarousel();
    n2 && n2.off("change", c2), t2 = void 0, history.scrollRestoration && e2 && (history.scrollRestoration = e2);
  } };
};
f.startFromUrl = u, f.setup = function(n2) {
  e || (e = n2, e$7() && (/complete|interactive|loaded/.test(document.readyState) ? d() : document.addEventListener("DOMContentLoaded", d)));
};
const o = Object.assign(Object.assign({}, o$5), { CLOSE: "Close", NEXT: "Next", PREV: "Previous", MODAL: "You can close this modal content with the ESC key", ELEMENT_NOT_FOUND: "HTML Element Not Found", IFRAME_ERROR: "Error Loading Page" });
const A = '<button class="f-button" title="{{CLOSE}}" data-fancybox-close><svg tabindex="-1" width="24" height="24" viewBox="0 0 24 24"><path d="M19.286 4.714 4.714 19.286M4.714 4.714l14.572 14.572" /></svg></button>';
r$1().add("close", { tpl: A });
const k = (e2) => {
  e2.cancelable && e2.preventDefault();
};
const O = (e2 = null, t2 = "", n2) => {
  if (!e2 || !e2.parentElement || !t2) return void (n2 && n2());
  R(e2);
  const o2 = (i2) => {
    i2.target === e2 && e2.dataset.animationName && (e2.removeEventListener("animationend", o2), delete e2.dataset.animationName, n2 && n2(), e2.classList.remove(t2));
  };
  e2.dataset.animationName = t2, e2.addEventListener("animationend", o2), s$9(e2, t2);
}, R = (e2) => {
  e2 && e2.dispatchEvent(new CustomEvent("animationend", { bubbles: false, cancelable: true, currentTarget: e2 }));
};
var _;
!(function(e2) {
  e2[e2.Init = 0] = "Init", e2[e2.Ready = 1] = "Ready", e2[e2.Closing = 2] = "Closing", e2[e2.Destroyed = 3] = "Destroyed";
})(_ || (_ = {}));
const I = { ajax: null, backdropClick: "close", Carousel: {}, closeButton: "auto", closeExisting: false, delegateEl: void 0, dragToClose: true, fadeEffect: true, groupAll: false, groupAttr: "data-fancybox", hideClass: "f-fadeOut", hideScrollbar: true, id: void 0, idle: false, keyboard: { Escape: "close", Delete: "close", Backspace: "close", PageUp: "next", PageDown: "prev", ArrowUp: "prev", ArrowDown: "next", ArrowRight: "next", ArrowLeft: "prev" }, l10n: o, mainClass: "", mainStyle: {}, mainTpl: '<dialog class="fancybox__dialog">\n    <div class="fancybox__container" tabindex="0" aria-label="{{MODAL}}">\n      <div class="fancybox__backdrop"></div>\n      <div class="fancybox__carousel"></div>\n    </div>\n  </dialog>', modal: true, on: {}, parentEl: void 0, placeFocusBack: true, showClass: "f-zoomInUp", startIndex: 0, sync: void 0, theme: "dark", triggerEl: void 0, triggerEvent: void 0, zoomEffect: true }, z = /* @__PURE__ */ new Map();
let H = 0;
const D = "with-fancybox", B = () => {
  let r2, T, M2, B2, q2, F, V, W = _.Init, $ = Object.assign({}, I), K = -1, U = {}, X = [], G = false, Y = true, Z = 0;
  function J(e2, ...t2) {
    let n2 = $[e2];
    return n2 && "function" == typeof n2 ? n2(Oe, ...t2) : n2;
  }
  function Q(e2, t2 = []) {
    const n2 = J("l10n") || {};
    e2 = String(e2).replace(/\{\{(\w+)\}\}/g, ((e3, t3) => n2[t3] || e3));
    for (let n3 = 0; n3 < t2.length; n3++) e2 = e2.split(t2[n3][0]).join(t2[n3][1]);
    return e2 = e2.replace(/\{\{(.*?)\}\}/g, ((e3, t3) => t3));
  }
  const ee = /* @__PURE__ */ new Map();
  function te(e2, ...t2) {
    const n2 = [...ee.get(e2) || []];
    for (const [t3, o2] of Object.entries($.on || {})) (t3 === e2 || t3.split(" ").indexOf(e2) > -1) && n2.push(o2);
    for (const e3 of n2) e3 && "function" == typeof e3 && e3(Oe, ...t2);
    "*" !== e2 && te("*", e2, ...t2);
  }
  function ne() {
    s$8(T, "is-revealing");
    try {
      if (document.activeElement === r2) {
        ((null == T ? void 0 : T.querySelector("[autofocus]")) || T).focus();
      }
    } catch (e2) {
    }
  }
  function oe(e2, n2) {
    var o2;
    ve(n2), de(), null === (o2 = n2.el) || void 0 === o2 || o2.addEventListener("click", se), "inline" !== n2.type && "clone" !== n2.type || (function(e3) {
      if (!B2 || !e3 || !e3.el) return;
      let n3 = null;
      if (t$6(e3.src)) {
        const t2 = e3.src.split("#", 2).pop();
        n3 = t2 ? document.getElementById(t2) : null;
      }
      if (n3) {
        if (s$9(n3, "f-html"), "clone" === e3.type || n3.closest(".fancybox__carousel")) {
          n3 = n3.cloneNode(true);
          const t2 = n3.dataset.animationName;
          t2 && (n3.classList.remove(t2), delete n3.dataset.animationName);
          let o3 = n3.getAttribute("id");
          o3 = o3 ? `${o3}--clone` : `clone-${K}-${e3.index}`, n3.setAttribute("id", o3);
        } else if (n3.parentNode) {
          const t2 = document.createElement("div");
          t2.inert = true, n3.parentNode.insertBefore(t2, n3), e3.placeholderEl = t2;
        }
        e3.htmlEl = n3, s$9(e3.el, "has-html"), e3.el.prepend(n3), n3.classList.remove("hidden"), "none" === n3.style.display && (n3.style.display = ""), "none" === getComputedStyle(n3).getPropertyValue("display") && (n3.style.display = n3.dataset.display || "flex"), null == B2 || B2.emit("contentReady", e3);
      } else null == B2 || B2.showError(e3, "{{ELEMENT_NOT_FOUND}}");
    })(n2), "ajax" === n2.type && (function(e3) {
      const t2 = e3.el;
      if (!t2) return;
      if (e3.htmlEl || e3.xhr) return;
      null == B2 || B2.showLoading(e3), e3.state = 0;
      const n3 = new XMLHttpRequest();
      n3.onreadystatechange = function() {
        if (n3.readyState === XMLHttpRequest.DONE && W === _.Ready) if (null == B2 || B2.hideLoading(e3), e3.state = 1, 200 === n3.status) {
          let o4 = n3.responseText + "", i2 = null, s2 = null;
          if (e3.filter) {
            const t3 = document.createElement("div");
            t3.innerHTML = o4, s2 = t3.querySelector(e3.filter + "");
          }
          s2 && s2 instanceof HTMLElement ? i2 = s2 : (i2 = document.createElement("div"), i2.innerHTML = o4), i2.classList.add("f-html"), e3.htmlEl = i2, t2.classList.add("has-html"), t2.classList.add("has-ajax"), t2.prepend(i2), null == B2 || B2.emit("contentReady", e3);
        } else null == B2 || B2.showError(e3);
      };
      const o3 = J("ajax") || null;
      n3.open(o3 ? "POST" : "GET", e3.src + ""), n3.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"), n3.setRequestHeader("X-Requested-With", "XMLHttpRequest"), n3.send(o3), e3.xhr = n3;
    })(n2);
  }
  function ie(e2, t2) {
    var n2;
    ye(t2), null === (n2 = t2.el) || void 0 === n2 || n2.removeEventListener("click", se), "inline" !== t2.type && "clone" !== t2.type || (function(e3) {
      const t3 = e3.htmlEl, n3 = e3.placeholderEl;
      t3 && ("none" !== getComputedStyle(t3).getPropertyValue("display") && (t3.style.display = "none"), t3.offsetHeight);
      n3 && (t3 && n3.parentNode && n3.parentNode.insertBefore(t3, n3), n3.remove());
      e3.htmlEl = void 0, e3.placeholderEl = void 0;
    })(t2), t2.xhr && (t2.xhr.abort(), t2.xhr = void 0);
  }
  function se(e2) {
    if (!be()) return;
    if (W !== _.Ready) return k(e2), void e2.stopPropagation();
    if (e2.defaultPrevented) return;
    if (!f$1.isClickAllowed()) return;
    const t2 = e2.composedPath()[0];
    t2.closest(".fancybox__carousel") && t2.classList.contains("fancybox__slide") && fe(e2);
  }
  function le() {
    Y = false, T && B2 && T.classList.remove("is-revealing"), de();
    const e2 = J("sync");
    if (B2 && e2) {
      const t2 = e2.getPageIndex(B2.getPageIndex()) || 0;
      e2.goTo(t2, { transition: false, tween: false });
    }
  }
  function re() {
    var e2;
    !(function() {
      const e3 = null == B2 ? void 0 : B2.getViewport();
      if (!J("dragToClose") || !B2 || !e3) return;
      if (q2 = f$1(e3).init(), !q2) return;
      let t3 = false, n2 = 0, o2 = 0, s2 = {}, l2 = 1;
      function r3() {
        var e4, t4;
        null == F || F.spring({ clamp: true, mass: 1, tension: 0 === o2 ? 140 : 960, friction: 17, restDelta: 0.1, restSpeed: 0.1, maxSpeed: 1 / 0 }).from({ y: n2 }).to({ y: o2 }).start();
        const i2 = (null === (e4 = null == B2 ? void 0 : B2.getViewport()) || void 0 === e4 ? void 0 : e4.getBoundingClientRect().height) || 0, s3 = null === (t4 = Ee()) || void 0 === t4 ? void 0 : t4.panzoomRef;
        if (i2 && s3) if (0 === o2) s3.execute(v$1.Reset);
        else {
          const e5 = t$3(Math.abs(n2), 0, 0.33 * i2, l2, 0.77 * l2, false);
          s3.execute(v$1.ZoomTo, { scale: e5 });
        }
      }
      const c2 = (e4) => {
        var t4;
        const n3 = e4.srcEvent, o3 = n3.target;
        return B2 && !(e$4(n3) && (null === (t4 = n3.touches) || void 0 === t4 ? void 0 : t4.length) > 1) && o3 && !n$8(o3);
      };
      F = c$3().on("step", ((t4) => {
        if (T && e3 && W === _.Ready) {
          const o3 = e3.getBoundingClientRect().height;
          n2 = Math.min(o3, Math.max(-1 * o3, t4.y));
          const i2 = t$3(Math.abs(n2), 0, 0.5 * o3, 1, 0, true);
          T.style.setProperty("--f-drag-opacity", i2 + ""), T.style.setProperty("--f-drag-offset", n2 + "px");
        }
      })), q2.on("start", (function() {
        t3 || (null == F || F.pause(), o2 = n2);
      })).on("panstart", ((e4) => {
        var n3, o3;
        if (!t3 && c2(e4) && "y" === e4.axis) {
          k(e4.srcEvent), t3 = true, Te(), null === (n3 = null == B2 ? void 0 : B2.getViewport()) || void 0 === n3 || n3.classList.add("is-dragging");
          const i2 = null === (o3 = Ee()) || void 0 === o3 ? void 0 : o3.panzoomRef;
          if (i2) {
            l2 = i2.getTransform().scale || 1;
            const e5 = i2.getOptions();
            s2 = Object.assign({}, e5), e5.bounds = false, e5.gestures = false;
          }
        } else t3 = false;
      })).on("pan", (function(e4) {
        t3 && c2(e4) && (k(e4.srcEvent), e4.srcEvent.stopPropagation(), "y" === e4.axis && (o2 += e4.deltaY, r3()));
      })).on("end", ((e4) => {
        var i2, l3, a2;
        if (null === (i2 = null == B2 ? void 0 : B2.getViewport()) || void 0 === i2 || i2.classList.remove("is-dragging"), t3) {
          const t4 = null === (l3 = Ee()) || void 0 === l3 ? void 0 : l3.panzoomRef;
          if (t4) {
            null === (a2 = t4.getTween()) || void 0 === a2 || a2.end();
            const e5 = t4.getOptions();
            e5.bounds = s2.bounds || false, e5.gestures = s2.gestures || false;
          }
          c2(e4) && "y" === e4.axis && (Math.abs(e4.velocityY) > 5 || Math.abs(n2) > 50) && Me(e4.srcEvent, "f-throwOut" + (e4.velocityY > 0 ? "Down" : "Up"));
        }
        t3 = false, W === _.Ready && 0 !== n2 && (o2 = 0, r3());
      }));
    })(), document.body.addEventListener("click", pe), document.body.addEventListener("keydown", ge, { passive: false, capture: true }), de(), je();
    const t2 = J("sync");
    B2 && t2 && (null === (e2 = t2.getTween()) || void 0 === e2 || e2.start()), he(Ee());
  }
  function ae() {
    (null == B2 ? void 0 : B2.canGoNext()) ? je() : Ce();
  }
  function ce(e2, t2) {
    ve(t2), he(t2);
  }
  function ue() {
    var e2;
    const t2 = null == B2 ? void 0 : B2.getPlugins().Thumbs;
    s$7(T, "has-thumbs", (null == t2 ? void 0 : t2.isEnabled()) || false), s$7(T, "has-vertical-thumbs", !!t2 && ("scrollable" === t2.getType() || true === (null === (e2 = t2.getCarousel()) || void 0 === e2 ? void 0 : e2.isVertical())));
  }
  function de() {
    if (T) {
      const e2 = (null == B2 ? void 0 : B2.getPages()) || [], t2 = (null == B2 ? void 0 : B2.getPageIndex()) || 0;
      for (const e3 of T.querySelectorAll("[data-fancybox-index]")) e3.innerHTML = t2 + "";
      for (const e3 of T.querySelectorAll("[data-fancybox-page]")) e3.innerHTML = t2 + 1 + "";
      for (const t3 of T.querySelectorAll("[data-fancybox-pages]")) t3.innerHTML = e2.length + "";
    }
  }
  function fe(e2) {
    if (!!e2.composedPath()[0].closest("[data-fancybox-close]")) return void Me(e2);
    if (te("backdropClick", e2), e2.defaultPrevented) return;
    J("backdropClick") && Me(e2);
  }
  function me() {
    Pe();
  }
  function ge(e2) {
    if (!be()) return;
    if (W !== _.Ready) return;
    const t2 = e2.key, o2 = J("keyboard");
    if (!o2) return;
    if (e2.ctrlKey || e2.altKey || e2.shiftKey) return;
    const i2 = e2.composedPath()[0];
    if (!n$9(i2)) return;
    if ("Escape" !== t2 && ((e3) => {
      const t3 = ["input", "textarea", "select", "option", "video", "iframe", "[contenteditable]", "[data-selectable]", "[data-draggable]"].join(",");
      return e3.matches(t3) || e3.closest(t3);
    })(i2)) return;
    if (te("keydown", e2), e2.defaultPrevented) return;
    const s2 = o2[t2];
    if (s2) switch (s2) {
      case "close":
        Me(e2);
        break;
      case "next":
        k(e2), null == B2 || B2.next();
        break;
      case "prev":
        k(e2), null == B2 || B2.prev();
    }
  }
  function pe(e2) {
    if (!be()) return;
    if (W !== _.Ready) return;
    if (Pe(), e2.defaultPrevented) return;
    const t2 = e2.composedPath()[0], n2 = !!t2.closest("[data-fancybox-close]"), o2 = t2.classList.contains("fancybox__backdrop");
    (n2 || o2) && fe(e2);
  }
  function ve(e2) {
    var t2;
    const { el: n2, htmlEl: i2, panzoomRef: s2, closeButtonEl: l2 } = e2, r3 = s2 ? s2.getWrapper() : i2;
    if (!n2 || !n2.parentElement || !r3) return;
    let a2 = J("closeButton");
    if ("auto" === a2 && (a2 = true !== (null === (t2 = null == B2 ? void 0 : B2.getPlugins().Toolbar) || void 0 === t2 ? void 0 : t2.isEnabled())), a2) {
      if (!l2) {
        const t3 = e$9(Q(A));
        t3 && (s$9(t3, "is-close-button"), e2.closeButtonEl = r3.insertAdjacentElement("afterbegin", t3), s$9(n2, "has-close-btn"));
      }
    } else ye(e2);
  }
  function ye(e2) {
    e2.closeButtonEl && (e2.closeButtonEl.remove(), e2.closeButtonEl = void 0), s$8(e2.el, "has-close-btn");
  }
  function he(e2) {
    if (!(Y && B2 && 1 === B2.getState() && e2 && e2.index === B2.getOptions().initialPage && e2.el && e2.el.parentElement)) return;
    if (void 0 !== e2.state && 1 !== e2.state) return;
    Y = false;
    const t2 = e2.panzoomRef, n2 = null == t2 ? void 0 : t2.getTween(), o2 = J("zoomEffect") && n2 ? we(e2) : void 0;
    if (t2 && n2 && o2) {
      const { x: e3, y: i3, scale: s2 } = t2.getStartPosition();
      return void n2.spring({ tension: 215, friction: 25, restDelta: 1e-3, restSpeed: 1e-3, maxSpeed: 1 / 0 }).from(o2).to({ x: e3, y: i3, scale: s2 }).start();
    }
    const i2 = (null == t2 ? void 0 : t2.getContent()) || e2.htmlEl;
    i2 && O(i2, J("showClass", e2));
  }
  function be() {
    var e2;
    return (null === (e2 = N.getInstance()) || void 0 === e2 ? void 0 : e2.getId()) === K;
  }
  function Ee() {
    var e2;
    return null === (e2 = null == B2 ? void 0 : B2.getPage()) || void 0 === e2 ? void 0 : e2.slides[0];
  }
  function xe() {
    const e2 = Ee();
    return e2 ? e2.triggerEl || J("triggerEl") : void 0;
  }
  function we(e2) {
    var t2, n2;
    const o2 = e2.thumbEl;
    if (!o2 || !((e3) => {
      const t3 = e3.getBoundingClientRect(), n3 = e3.closest("[style]"), o3 = null == n3 ? void 0 : n3.parentElement;
      if (n3 && n3.style.transform && o3) {
        const e4 = o3.getBoundingClientRect();
        if (t3.left < e4.left || t3.left > e4.left + e4.width - t3.width) return false;
        if (t3.top < e4.top || t3.top > e4.top + e4.height - t3.height) return false;
      }
      const i3 = Math.max(document.documentElement.clientHeight, window.innerHeight), s3 = Math.max(document.documentElement.clientWidth, window.innerWidth);
      return !(t3.bottom < 0 || t3.top - i3 >= 0 || t3.right < 0 || t3.left - s3 >= 0);
    })(o2)) return;
    const i2 = null === (n2 = null === (t2 = e2.panzoomRef) || void 0 === t2 ? void 0 : t2.getWrapper()) || void 0 === n2 ? void 0 : n2.getBoundingClientRect(), s2 = null == i2 ? void 0 : i2.width, l2 = null == i2 ? void 0 : i2.height;
    if (!s2 || !l2) return;
    const r3 = o2.getBoundingClientRect();
    let a2 = r3.width, c2 = r3.height, u2 = r3.left, d2 = r3.top;
    if (!r3 || !a2 || !c2) return;
    if (o2 instanceof HTMLImageElement) {
      const e3 = window.getComputedStyle(o2).getPropertyValue("object-fit");
      if ("contain" === e3 || "scale-down" === e3) {
        const { width: t3, height: n3 } = ((e4, t4, n4, o3, i3 = "contain") => {
          if ("contain" === i3 || e4 > n4 || t4 > o3) {
            const i4 = n4 / e4, s3 = o3 / t4, l3 = Math.min(i4, s3);
            e4 *= l3, t4 *= l3;
          }
          return { width: e4, height: t4 };
        })(o2.naturalWidth, o2.naturalHeight, a2, c2, e3);
        u2 += 0.5 * (a2 - t3), d2 += 0.5 * (c2 - n3), a2 = t3, c2 = n3;
      }
    }
    if (Math.abs(s2 / l2 - a2 / c2) > 0.1) return;
    return { x: u2 + 0.5 * a2 - (i2.left + 0.5 * s2), y: d2 + 0.5 * c2 - (i2.top + 0.5 * l2), scale: a2 / s2 };
  }
  function Le() {
    V && clearTimeout(V), V = void 0, document.removeEventListener("mousemove", me);
  }
  function je() {
    if (G) return;
    if (V) return;
    const e2 = J("idle");
    e2 && (V = setTimeout(Se, e2));
  }
  function Se() {
    T && (Le(), s$9(T, "is-idle"), document.addEventListener("mousemove", me), G = true);
  }
  function Pe() {
    G && (Ce(), je());
  }
  function Ce() {
    Le(), null == T || T.classList.remove("is-idle"), G = false;
  }
  function Te() {
    const e2 = xe();
    var t2;
    !e2 || (t2 = e2.getBoundingClientRect()).bottom > 0 && t2.right > 0 && t2.left < (window.innerWidth || document.documentElement.clientWidth) && t2.top < (window.innerHeight || document.documentElement.clientHeight) || e2.closest("[inert]") || e2.scrollIntoView({ behavior: "instant", block: "center", inline: "center" });
  }
  function Me(e2, t2) {
    var n2, o2, i2, s2, r3;
    if (W === _.Closing || W === _.Destroyed) return;
    const a2 = new Event("shouldClose", { bubbles: true, cancelable: true });
    if (te("shouldClose", a2, e2), a2.defaultPrevented) return;
    if (Le(), e2) {
      if (e2.defaultPrevented) return;
      k(e2), e2.stopPropagation(), e2.stopImmediatePropagation();
    }
    if (W = _.Closing, null == F || F.pause(), null == q2 || q2.destroy(), B2) {
      null === (n2 = B2.getGestures()) || void 0 === n2 || n2.destroy(), null === (o2 = B2.getTween()) || void 0 === o2 || o2.pause();
      for (const e3 of B2.getSlides()) {
        const t3 = e3.panzoomRef;
        t3 && (r$5(t3.getOptions(), { clickAction: false, dblClickAction: false, wheelAction: false, bounds: false, minScale: 0, maxScale: 1 / 0 }), null === (i2 = t3.getGestures()) || void 0 === i2 || i2.destroy(), null === (s2 = t3.getTween()) || void 0 === s2 || s2.pause());
      }
    }
    const c2 = null == B2 ? void 0 : B2.getPlugins();
    null === (r3 = null == c2 ? void 0 : c2.Autoplay) || void 0 === r3 || r3.stop();
    const u2 = null == c2 ? void 0 : c2.Fullscreen;
    u2 && u2.inFullscreen() ? Promise.resolve(u2.exit()).then((() => {
      setTimeout((() => {
        Ae(e2, t2);
      }), 150);
    })) : Ae(e2, t2);
  }
  function Ae(e2, t2) {
    var n2, o2;
    if (W !== _.Closing) return;
    te("close", e2), Y = false, document.body.removeEventListener("click", pe), document.body.removeEventListener("keydown", ge, { passive: false, capture: true }), J("placeFocusBack") && Te();
    const i2 = document.activeElement;
    i2 && (null == r2 ? void 0 : r2.contains(i2)) && i2.blur(), J("fadeEffect") && (null == T || T.classList.remove("is-ready"), null == T || T.classList.add("is-hiding")), null == T || T.classList.add("is-closing");
    const s2 = Ee(), l2 = null == s2 ? void 0 : s2.el, a2 = null == s2 ? void 0 : s2.panzoomRef, c2 = null === (n2 = null == s2 ? void 0 : s2.panzoomRef) || void 0 === n2 ? void 0 : n2.getTween(), u2 = t2 || J("hideClass");
    let d2 = false, m2 = false;
    if (B2 && s2 && l2 && a2 && c2) {
      let e3;
      if (J("zoomEffect") && 1 === s2.state && (e3 = we(s2)), e3) {
        d2 = true;
        const t3 = () => {
          e3 = we(s2), e3 ? c2.to(Object.assign(Object.assign({}, y$1), e3)) : ke();
        };
        a2.on("refresh", (() => {
          t3();
        })), c2.easing(c$3.Easings.EaseOut).duration(350).from(Object.assign({}, a2.getTransform())).to(Object.assign(Object.assign({}, y$1), e3)).start(), (null == l2 ? void 0 : l2.getAnimations()) && (l2.style.animationPlayState = "paused", requestAnimationFrame((() => {
          t3();
        })));
      }
    }
    const g = (null == s2 ? void 0 : s2.htmlEl) || (null === (o2 = null == s2 ? void 0 : s2.panzoomRef) || void 0 === o2 ? void 0 : o2.getWrapper());
    g && R(g), !d2 && u2 && g && (m2 = true, O(g, u2, (() => {
      ke();
    }))), d2 || m2 ? setTimeout((() => {
      ke();
    }), 350) : ke();
  }
  function ke() {
    var e2, t2, n2, o2, i2;
    if (W === _.Destroyed) return;
    W = _.Destroyed;
    const l2 = xe();
    te("destroy"), null === (t2 = null === (e2 = J("sync")) || void 0 === e2 ? void 0 : e2.getPlugins().Autoplay) || void 0 === t2 || t2.resume(), null === (o2 = null === (n2 = J("sync")) || void 0 === n2 ? void 0 : n2.getPlugins().Autoscroll) || void 0 === o2 || o2.resume(), r2 instanceof HTMLDialogElement && r2.close(), null === (i2 = null == B2 ? void 0 : B2.getContainer()) || void 0 === i2 || i2.classList.remove("is-idle"), null == B2 || B2.destroy();
    for (const e3 of Object.values(U)) null == e3 || e3.destroy();
    if (U = {}, null == r2 || r2.remove(), r2 = void 0, T = void 0, B2 = void 0, z.delete(K), !z.size && (t$5(false), document.documentElement.classList.remove(D), J("placeFocusBack") && l2 && !l2.closest("[inert]"))) try {
      null == l2 || l2.focus({ preventScroll: true });
    } catch (e3) {
    }
  }
  const Oe = { close: Me, destroy: ke, getCarousel: function() {
    return B2;
  }, getContainer: function() {
    return T;
  }, getId: function() {
    return K;
  }, getOptions: function() {
    return $;
  }, getPlugins: function() {
    return U;
  }, getSlide: function() {
    return Ee();
  }, getState: function() {
    return W;
  }, init: function(t2 = [], n2 = {}) {
    W !== _.Init && (Oe.destroy(), W = _.Init), $ = r$5({}, I, n2), K = J("id") || "fancybox-" + ++H;
    const a2 = z.get(K);
    if (a2 && a2.destroy(), z.set(K, Oe), te("init"), (function() {
      for (const [e2, t3] of Object.entries(Object.assign(Object.assign({}, N.Plugins), $.plugins || {}))) if (e2 && !U[e2] && t3 instanceof Function) {
        const n3 = t3();
        n3.init(Oe), U[e2] = n3;
      }
      te("initPlugins");
    })(), (function(e2 = []) {
      te("initSlides", e2), X = [...e2];
    })(t2), (function() {
      const t3 = J("parentEl") || document.body;
      if (!(t3 && t3 instanceof HTMLElement)) return;
      const n3 = Q(J("mainTpl") || "");
      if (r2 = e$9(n3) || void 0, !r2) return;
      if (T = r2.querySelector(".fancybox__container"), !(T && T instanceof HTMLElement)) return;
      const l2 = J("mainClass");
      l2 && s$9(T, l2);
      const a3 = J("mainStyle");
      if (a3 && t$7(a3)) for (const [e2, t4] of Object.entries(a3)) T.style.setProperty(e2, t4);
      const u2 = J("theme"), d2 = "auto" === u2 ? window.matchMedia("(prefers-color-scheme:light)").matches : "light" === u2;
      T.setAttribute("theme", d2 ? "light" : "dark"), r2.setAttribute("id", `${K}`), r2.addEventListener("keydown", ((e2) => {
        "Escape" === e2.key && k(e2);
      })), r2.addEventListener("wheel", ((e2) => {
        const t4 = e2.target;
        let n4 = J("wheel", e2);
        t4.closest(".f-thumbs") && (n4 = "slide");
        const o2 = "slide" === n4, s2 = [-e2.deltaX || 0, -e2.deltaY || 0, -e2.detail || 0].reduce((function(e3, t5) {
          return Math.abs(t5) > Math.abs(e3) ? t5 : e3;
        })), l3 = Math.max(-1, Math.min(1, s2)), r3 = Date.now();
        Z && r3 - Z < 300 ? o2 && k(e2) : (Z = r3, te("wheel", e2, l3), e2.defaultPrevented || ("close" === n4 ? Me(e2) : "slide" === n4 && B2 && !n$8(t4) && (k(e2), B2[l3 > 0 ? "prev" : "next"]())));
      }), { capture: true, passive: false }), r2.addEventListener("cancel", ((e2) => {
        Me(e2);
      })), t3.append(r2), 1 === z.size && (J("hideScrollbar") && t$5(true), document.documentElement.classList.add(D));
      r2 instanceof HTMLDialogElement && (J("modal") ? r2.showModal() : r2.show());
      te("initLayout");
    })(), (function() {
      if (M2 = (null == r2 ? void 0 : r2.querySelector(".fancybox__carousel")) || void 0, !M2) return;
      M2.fancybox = Oe;
      const e2 = r$5({}, { Autoplay: { autoStart: false, pauseOnHover: false, progressbarParentEl: (e3) => {
        const t3 = e3.getContainer();
        return (null == t3 ? void 0 : t3.querySelector(".f-carousel__toolbar [data-autoplay-action]")) || t3;
      } }, Fullscreen: { el: T }, Toolbar: { absolute: true, items: { counter: { tpl: '<div class="f-counter"><span data-fancybox-page></span>/<span data-fancybox-pages></span></div>' } }, display: { left: ["counter"], right: ["toggleFull", "autoplay", "fullscreen", "thumbs", "close"] } }, Video: { autoplay: true }, Thumbs: { minCount: 2, Carousel: { classes: { container: "fancybox__thumbs" } } }, classes: { container: "fancybox__carousel", viewport: "fancybox__viewport", slide: "fancybox__slide" }, spinnerTpl: '<div class="f-spinner" data-fancybox-close></div>', dragFree: false, slidesPerPage: 1, plugins: { Sync: i$5, Arrows: l$4, Lazyload: i$4, Zoomable: s$4, Html: i$2, Video: l$2, Autoplay: o$2, Fullscreen: l$1, Thumbs: c$1, Toolbar: r$1 } }, J("Carousel") || {}, { slides: X, enabled: true, initialPage: J("startIndex") || 0, l10n: J("l10n") });
      B2 = E(M2, e2), te("initCarousel", B2), B2.on("*", ((e3, t3, ...n3) => {
        te(`Carousel.${t3}`, e3, ...n3);
      })), B2.on("attachSlideEl", oe), B2.on("detachSlideEl", ie), B2.on("contentReady", ce), B2.on("ready", re), B2.on("change", le), B2.on("settle", ae), B2.on("thumbs:ready", ue), B2.on("thumbs:destroy", ue), B2.init();
    })(), r2 && T) {
      if (J("closeExisting")) for (const [e2, t3] of z.entries()) e2 !== K && t3.close();
      J("fadeEffect") ? (setTimeout((() => {
        ne();
      }), 500), s$9(T, "is-revealing")) : ne(), T.classList.add("is-ready"), W = _.Ready, te("ready");
    }
  }, isCurrentSlide: function(e2) {
    const t2 = Ee();
    return !(!e2 || !t2) && t2.index === e2.index;
  }, isTopMost: function() {
    return be();
  }, off: function(e2, t2) {
    return ee.has(e2) && ee.set(e2, ee.get(e2).filter(((e3) => e3 !== t2))), Oe;
  }, on: function(e2, t2) {
    return ee.set(e2, [...ee.get(e2) || [], t2]), Oe;
  }, toggleIdle(e2) {
    (G || true === e2) && Se(), G && false !== e2 || Ce();
  } };
  return Oe;
};
function q(e2, t2 = {}) {
  var n2, o2, i2;
  if (!(e2 && e2 instanceof Element)) return;
  let s2, r2, a2, c2, u2 = {};
  for (const [t3, n3] of N.openers) if (t3.contains(e2)) for (const [o3, i3] of n3) {
    let n4;
    if (o3) {
      for (const i4 of t3.querySelectorAll(o3)) if (i4.contains(e2)) {
        n4 = i4;
        break;
      }
      if (!n4) continue;
    }
    for (const [o4, d3] of i3) {
      let i4 = null;
      try {
        i4 = e2.closest(o4);
      } catch (e3) {
      }
      i4 && (r2 = t3, a2 = n4, s2 = i4, c2 = o4, r$5(u2, d3 || {}));
    }
  }
  if (!r2 || !c2 || !s2) return;
  const d2 = r$5({}, I, t2, u2, { triggerEl: s2 });
  let f2 = [].slice.call((a2 || r2).querySelectorAll(c2));
  const m2 = s2.closest(".f-carousel"), g = null == m2 ? void 0 : m2.carousel;
  if (g && (!a2 || !m2.contains(a2))) {
    const e3 = [];
    for (const t3 of null == g ? void 0 : g.getSlides()) {
      const n3 = t3.el;
      n3 && (n3.matches(c2) ? e3.push(n3) : e3.push(...[].slice.call(n3.querySelectorAll(c2))));
    }
    e3.length && (f2 = [...e3], null === (n2 = g.getPlugins().Autoplay) || void 0 === n2 || n2.pause(), null === (o2 = g.getPlugins().Autoscroll) || void 0 === o2 || o2.pause(), d2.sync = g);
  }
  if (false === d2.groupAll) {
    const e3 = d2.groupAttr, t3 = e3 && s2 ? s2.getAttribute(`${e3}`) : "";
    f2 = e3 && t3 ? f2.filter(((n3) => n3.getAttribute(`${e3}`) === t3)) : [s2];
  }
  if (!f2.length) return;
  null === (i2 = d2.triggerEvent) || void 0 === i2 || i2.preventDefault();
  const p2 = N.getInstance();
  if (p2) {
    const e3 = p2.getOptions().triggerEl;
    if (e3 && f2.indexOf(e3) > -1) return;
  }
  return Object.assign({}, d2.Carousel || {}).rtl && (f2 = f2.reverse()), s2 && void 0 === t2.startIndex && (d2.startIndex = f2.indexOf(s2)), N.fromNodes(f2, d2);
}
const N = { Plugins: { Hash: f }, version: "6.1.6", openers: /* @__PURE__ */ new Map(), bind: function(e2, n2, o2, i2) {
  if (!e$7()) return;
  let s2 = document.body, l2 = null, a2 = "[data-fancybox]", c2 = {};
  e2 instanceof Element && (s2 = e2), t$6(e2) && t$6(n2) ? (l2 = e2, a2 = n2) : t$6(n2) && t$6(o2) ? (l2 = n2, a2 = o2) : t$6(n2) ? a2 = n2 : t$6(e2) && (a2 = e2), "object" == typeof n2 && (c2 = n2 || {}), "object" == typeof o2 && (c2 = o2 || {}), "object" == typeof i2 && (c2 = i2 || {}), (function(e3, t2, n3, o3 = {}) {
    if (!(e3 && e3 instanceof Element && n3)) return;
    const i3 = N.openers.get(e3) || /* @__PURE__ */ new Map(), s3 = i3.get(t2) || /* @__PURE__ */ new Map();
    if (s3.set(n3, o3), i3.set(t2, s3), N.openers.set(e3, i3), 1 === i3.size && e3.addEventListener("click", N.fromEvent), 1 === N.openers.size) for (const e4 of Object.values(N.Plugins)) {
      const t3 = e4.setup;
      "function" == typeof t3 && t3(N);
    }
  })(s2, l2, a2, c2);
}, close: function(e2 = true, ...t2) {
  if (e2) for (const e3 of z.values()) e3.close(...t2);
  else {
    const e3 = N.getInstance();
    e3 && e3.close(...t2);
  }
}, destroy: function() {
  let e2;
  for (; e2 = N.getInstance(); ) e2.destroy();
  for (const e3 of N.openers.keys()) e3.removeEventListener("click", N.fromEvent);
  N.openers.clear();
}, fromEvent: function(e2) {
  if (e2.defaultPrevented) return;
  if (e2.button && 0 !== e2.button) return;
  if (e2.ctrlKey || e2.metaKey || e2.shiftKey) return;
  let t2 = e2.composedPath()[0];
  const n2 = { triggerEvent: e2 };
  if (t2.closest(".fancybox__container.is-hiding")) return k(e2), void e2.stopPropagation();
  const o2 = t2.closest("[data-fancybox-delegate]") || void 0;
  if (o2) {
    const e3 = o2.dataset.fancyboxDelegate || "", i2 = document.querySelectorAll(`[data-fancybox="${e3}"]`), s2 = parseInt(o2.dataset.fancyboxIndex || "", 10) || 0;
    t2 = i2[s2] || i2[0], r$5(n2, { delegateEl: o2, startIndex: s2 });
  }
  return q(t2, n2);
}, fromNodes: function(e2, t2) {
  t2 = r$5({}, I, t2 || {});
  const n2 = [], o2 = (e3) => e3 instanceof HTMLImageElement ? e3 : e3 instanceof HTMLElement ? e3.querySelector("img:not([aria-hidden])") : void 0;
  for (const i2 of e2) {
    const s2 = i2.dataset || {}, l2 = t2.delegateEl && e2.indexOf(i2) === t2.startIndex ? t2.delegateEl : void 0, r2 = o2(l2) || o2(i2) || void 0, a2 = s2.src || i2.getAttribute("href") || i2.getAttribute("currentSrc") || i2.getAttribute("src") || void 0, c2 = s2.thumb || s2.thumbSrc || (null == r2 ? void 0 : r2.getAttribute("currentSrc")) || (null == r2 ? void 0 : r2.getAttribute("src")) || (null == r2 ? void 0 : r2.dataset.lazySrc) || void 0, u2 = { src: a2, alt: s2.alt || (null == r2 ? void 0 : r2.getAttribute("alt")) || void 0, thumbSrc: c2, thumbEl: r2, triggerEl: i2, delegateEl: l2 };
    for (const e3 in s2) {
      let t3 = s2[e3] + "";
      t3 = "false" !== t3 && ("true" === t3 || t3), u2[e3] = t3;
    }
    n2.push(u2);
  }
  return N.show(n2, t2);
}, fromSelector: function(e2, n2, o2, i2) {
  if (!e$7()) return;
  let s2 = document.body, l2 = null, a2 = "[data-fancybox]", c2 = {};
  e2 instanceof Element && (s2 = e2), t$6(e2) && t$6(n2) ? (l2 = e2, a2 = n2) : t$6(n2) && t$6(o2) ? (l2 = n2, a2 = o2) : t$6(n2) ? a2 = n2 : t$6(e2) && (a2 = e2), "object" == typeof n2 && (c2 = n2 || {}), "object" == typeof o2 && (c2 = o2 || {}), "object" == typeof i2 && (c2 = i2 || {});
  for (const [e3, t2] of N.openers) for (const [n3, o3] of t2) for (const [t3, i3] of o3) if (e3 === s2 && n3 === l2) {
    const e4 = s2.querySelector((n3 ? `${n3} ` : "") + a2);
    if (e4 && e4.matches(t3)) return N.fromTriggerEl(e4, c2);
  }
}, fromTriggerEl: q, getCarousel: function() {
  var e2;
  return (null === (e2 = N.getInstance()) || void 0 === e2 ? void 0 : e2.getCarousel()) || void 0;
}, getDefaults: function() {
  return I;
}, getInstance: function(e2) {
  if (e2) {
    const t2 = z.get(e2);
    return t2 && t2.getState() !== _.Destroyed ? t2 : void 0;
  }
  return Array.from(z.values()).reverse().find(((e3) => {
    if (e3.getState() !== _.Destroyed) return e3;
  })) || void 0;
}, getSlide: function() {
  var e2;
  return (null === (e2 = N.getInstance()) || void 0 === e2 ? void 0 : e2.getSlide()) || void 0;
}, show: function(e2 = [], t2 = {}) {
  return B().init(e2, t2);
}, unbind: function(e2, n2, o2) {
  if (!e$7()) return;
  let i2 = document.body, s2 = null, l2 = "[data-fancybox]";
  e2 instanceof Element && (i2 = e2), t$6(e2) && t$6(n2) ? (s2 = e2, l2 = n2) : t$6(n2) && t$6(o2) ? (s2 = n2, l2 = o2) : t$6(n2) ? l2 = n2 : t$6(e2) && (l2 = e2), (function(e3, t2, n3) {
    if (!(e3 && e3 instanceof Element && n3)) return;
    const o3 = N.openers.get(e3) || /* @__PURE__ */ new Map(), i3 = o3.get(t2) || /* @__PURE__ */ new Map();
    i3 && n3 && i3.delete(n3), i3.size && n3 || o3.delete(t2), o3.size || (N.openers.delete(e3), e3.removeEventListener("click", N.fromEvent));
  })(i2, s2, l2);
} };
class AutoCalc {
  constructor(selector, options) {
    const defaultOptions = {
      selector: "[data-auto-calc]",
      units: "rem"
    };
    this.options = Object.assign(defaultOptions, options);
    this.selector = selector || this.options.selector;
    this.elements = document.querySelectorAll(this.selector);
    this.init();
  }
  setValue(name, property, value) {
    const { units } = this.options;
    const valueUnits = units === "rem" ? value / 16 + "rem" : units === "em" ? value / 16 + "em" : value + "px";
    document.querySelector(":root").style.setProperty(`--${name}-${property}`, valueUnits);
  }
  calcValue(element, props) {
    const [name, property] = props;
    if (property === "width") {
      const value = element.offsetWidth;
      this.setValue(name, property, value);
      return;
    }
    if (property === "height") {
      const value = element.offsetHeight;
      this.setValue(name, property, value);
      return;
    }
    const values = [element.offsetWidth, element.offsetHeight];
    const properties = ["width", "height"];
    values.forEach((value, index) => this.setValue(name, properties[index], value));
  }
  init() {
    if (!this.elements.length) return;
    const recalcAll = () => {
      this.elements.forEach((element) => {
        const props = element.getAttribute("data-auto-calc").toLowerCase().replaceAll(" ", "").split(",");
        this.calcValue(element, props);
      });
    };
    if (document.readyState === "complete" || document.readyState === "interactive") {
      recalcAll();
    } else {
      window.addEventListener("DOMContentLoaded", recalcAll);
    }
    window.addEventListener("resize", recalcAll);
  }
}
class Menu {
  constructor(params) {
    const defaultParams = {
      btn: "[data-menu-btn]",
      menu: "[data-menu]",
      activeClass: "open-menu",
      btnActiveClass: "active",
      closeBtns: ["a"],
      scrollTo: "",
      // если нужно прокрутить контейнер до submenu
      btnIsLabel: false
      // если кнопка label то срабатывает дважды
    };
    this.params = { ...defaultParams, ...params };
    this.menuEl = document.querySelector(this.params.menu);
    this.btnEl = document.querySelectorAll(this.params.btn);
    this.init();
  }
  closeMenu(menu) {
    menu.classList.remove(this.params.activeClass);
    document.documentElement.classList.remove(this.params.activeClass);
    this.btnEl.forEach((btn) => btn.classList.remove(this.params.btnActiveClass));
  }
  init() {
    const eventTarget = this.params.btnIsLabel ? "pointerdown" : "click";
    document.addEventListener(eventTarget, (e2) => {
      const menu = this.menuEl;
      const isBtn = e2.target.closest(this.params.btn);
      const isInsideMenu = e2.target.closest(this.params.menu);
      if (isBtn) {
        const btn = isBtn;
        if (btn.tagName === "A") e2.preventDefault();
        menu.classList.toggle(this.params.activeClass);
        document.documentElement.classList.toggle(this.params.activeClass);
        this.btnEl.forEach((b2) => b2.classList.toggle(this.params.btnActiveClass));
        if (this.params.scrollTo) {
          const megaMenu = menu.closest(this.params.scrollTo);
          if (megaMenu) {
            const menuRect = megaMenu.getBoundingClientRect();
            const subRect = menu.getBoundingClientRect();
            const scrollTop = megaMenu.scrollTop + (subRect.top - menuRect.top);
            megaMenu.scrollTo({ top: scrollTop, behavior: "smooth" });
          }
        }
        return;
      }
      if (!menu) return;
      if (this.params.closeBtns.length && menu.classList.contains(this.params.activeClass)) {
        const allBtns = this.params.closeBtns.join(",");
        if (e2.target.closest(allBtns)) {
          this.closeMenu(menu);
          return;
        }
      }
      if (!isInsideMenu && !isBtn && menu.classList.contains(this.params.activeClass)) {
        this.closeMenu(menu);
      }
    });
  }
}
class Modal {
  constructor(params) {
    const defaultParams = {
      modal: "[data-modal]",
      btn: "[data-modal-btn]",
      btnAttr: "data-modal-btn",
      activeClass: "active-modal",
      closeBtn: "[data-modal-close]",
      modalBox: "[data-modal-box]"
    };
    this.params = { ...defaultParams, ...params };
    this.btns = document.querySelectorAll(this.params.btn);
    this.modals = document.querySelectorAll(this.params.modal);
    this.init();
  }
  init() {
    document.addEventListener("click", (e2) => {
      const btn = e2.target.closest(this.params.btn);
      if (btn) {
        e2.preventDefault();
        const id = btn.getAttribute(this.params.btnAttr);
        if (id) {
          history.replaceState(null, null, `#${id}`);
          this.openFromHash();
        }
        return;
      }
      const link = e2.target.closest('a[href^="#"]');
      if (link) {
        const id = link.getAttribute("href").replace("#", "");
        if (!id) return;
        const modal2 = document.getElementById(id);
        if (modal2 && modal2.hasAttribute("data-modal")) {
          e2.preventDefault();
          history.replaceState(null, null, `#${id}`);
          this.openFromHash();
          return;
        }
      }
      const closeBtn = e2.target.closest(this.params.closeBtn);
      if (closeBtn) {
        e2.preventDefault();
        this.closeAll();
        history.replaceState(
          null,
          null,
          window.location.pathname + window.location.search
        );
        return;
      }
      const modal = e2.target.closest(this.params.modal);
      if (modal && !e2.target.closest(this.params.modalBox)) {
        this.closeAll();
        history.replaceState(
          null,
          null,
          window.location.pathname + window.location.search
        );
      }
    });
    window.addEventListener("hashchange", () => {
      this.openFromHash();
    });
    this.openFromHash();
  }
  openFromHash() {
    this.closeAll();
    const hash = location.hash.replace("#", "");
    if (!hash) return;
    const modal = document.getElementById(hash);
    if (!modal) return;
    if (!modal.hasAttribute("data-modal")) return;
    modal.classList.add(this.params.activeClass);
    document.documentElement.classList.add(this.params.activeClass);
  }
  closeAll() {
    this.modals.forEach((modal) => {
      modal.classList.remove(this.params.activeClass);
    });
    document.documentElement.classList.remove(this.params.activeClass);
  }
}
function isString(str) {
  return typeof str === "string" || str instanceof String;
}
function isObject(obj) {
  var _obj$constructor;
  return typeof obj === "object" && obj != null && (obj == null || (_obj$constructor = obj.constructor) == null ? void 0 : _obj$constructor.name) === "Object";
}
function pick(obj, keys) {
  if (Array.isArray(keys)) return pick(obj, (_2, k2) => keys.includes(k2));
  return Object.entries(obj).reduce((acc, _ref) => {
    let [k2, v2] = _ref;
    if (keys(v2, k2)) acc[k2] = v2;
    return acc;
  }, {});
}
const DIRECTION = {
  NONE: "NONE",
  LEFT: "LEFT",
  FORCE_LEFT: "FORCE_LEFT",
  RIGHT: "RIGHT",
  FORCE_RIGHT: "FORCE_RIGHT"
};
function forceDirection(direction) {
  switch (direction) {
    case DIRECTION.LEFT:
      return DIRECTION.FORCE_LEFT;
    case DIRECTION.RIGHT:
      return DIRECTION.FORCE_RIGHT;
    default:
      return direction;
  }
}
function escapeRegExp(str) {
  return str.replace(/([.*+?^=!:${}()|[\]/\\])/g, "\\$1");
}
function objectIncludes(b2, a2) {
  if (a2 === b2) return true;
  const arrA = Array.isArray(a2), arrB = Array.isArray(b2);
  let i2;
  if (arrA && arrB) {
    if (a2.length != b2.length) return false;
    for (i2 = 0; i2 < a2.length; i2++) if (!objectIncludes(a2[i2], b2[i2])) return false;
    return true;
  }
  if (arrA != arrB) return false;
  if (a2 && b2 && typeof a2 === "object" && typeof b2 === "object") {
    const dateA = a2 instanceof Date, dateB = b2 instanceof Date;
    if (dateA && dateB) return a2.getTime() == b2.getTime();
    if (dateA != dateB) return false;
    const regexpA = a2 instanceof RegExp, regexpB = b2 instanceof RegExp;
    if (regexpA && regexpB) return a2.toString() == b2.toString();
    if (regexpA != regexpB) return false;
    const keys = Object.keys(a2);
    for (i2 = 0; i2 < keys.length; i2++) if (!Object.prototype.hasOwnProperty.call(b2, keys[i2])) return false;
    for (i2 = 0; i2 < keys.length; i2++) if (!objectIncludes(b2[keys[i2]], a2[keys[i2]])) return false;
    return true;
  } else if (a2 && b2 && typeof a2 === "function" && typeof b2 === "function") {
    return a2.toString() === b2.toString();
  }
  return false;
}
class ActionDetails {
  /** Current input value */
  /** Current cursor position */
  /** Old input value */
  /** Old selection */
  constructor(opts) {
    Object.assign(this, opts);
    while (this.value.slice(0, this.startChangePos) !== this.oldValue.slice(0, this.startChangePos)) {
      --this.oldSelection.start;
    }
    if (this.insertedCount) {
      while (this.value.slice(this.cursorPos) !== this.oldValue.slice(this.oldSelection.end)) {
        if (this.value.length - this.cursorPos < this.oldValue.length - this.oldSelection.end) ++this.oldSelection.end;
        else ++this.cursorPos;
      }
    }
  }
  /** Start changing position */
  get startChangePos() {
    return Math.min(this.cursorPos, this.oldSelection.start);
  }
  /** Inserted symbols count */
  get insertedCount() {
    return this.cursorPos - this.startChangePos;
  }
  /** Inserted symbols */
  get inserted() {
    return this.value.substr(this.startChangePos, this.insertedCount);
  }
  /** Removed symbols count */
  get removedCount() {
    return Math.max(this.oldSelection.end - this.startChangePos || // for Delete
    this.oldValue.length - this.value.length, 0);
  }
  /** Removed symbols */
  get removed() {
    return this.oldValue.substr(this.startChangePos, this.removedCount);
  }
  /** Unchanged head symbols */
  get head() {
    return this.value.substring(0, this.startChangePos);
  }
  /** Unchanged tail symbols */
  get tail() {
    return this.value.substring(this.startChangePos + this.insertedCount);
  }
  /** Remove direction */
  get removeDirection() {
    if (!this.removedCount || this.insertedCount) return DIRECTION.NONE;
    return (this.oldSelection.end === this.cursorPos || this.oldSelection.start === this.cursorPos) && // if not range removed (event with backspace)
    this.oldSelection.end === this.oldSelection.start ? DIRECTION.RIGHT : DIRECTION.LEFT;
  }
}
function IMask(el, opts) {
  return new IMask.InputMask(el, opts);
}
function maskedClass(mask) {
  if (mask == null) throw new Error("mask property should be defined");
  if (mask instanceof RegExp) return IMask.MaskedRegExp;
  if (isString(mask)) return IMask.MaskedPattern;
  if (mask === Date) return IMask.MaskedDate;
  if (mask === Number) return IMask.MaskedNumber;
  if (Array.isArray(mask) || mask === Array) return IMask.MaskedDynamic;
  if (IMask.Masked && mask.prototype instanceof IMask.Masked) return mask;
  if (IMask.Masked && mask instanceof IMask.Masked) return mask.constructor;
  if (mask instanceof Function) return IMask.MaskedFunction;
  console.warn("Mask not found for mask", mask);
  return IMask.Masked;
}
function normalizeOpts(opts) {
  if (!opts) throw new Error("Options in not defined");
  if (IMask.Masked) {
    if (opts.prototype instanceof IMask.Masked) return {
      mask: opts
    };
    const {
      mask = void 0,
      ...instanceOpts
    } = opts instanceof IMask.Masked ? {
      mask: opts
    } : isObject(opts) && opts.mask instanceof IMask.Masked ? opts : {};
    if (mask) {
      const _mask = mask.mask;
      return {
        ...pick(mask, (_2, k2) => !k2.startsWith("_")),
        mask: mask.constructor,
        _mask,
        ...instanceOpts
      };
    }
  }
  if (!isObject(opts)) return {
    mask: opts
  };
  return {
    ...opts
  };
}
function createMask(opts) {
  if (IMask.Masked && opts instanceof IMask.Masked) return opts;
  const nOpts = normalizeOpts(opts);
  const MaskedClass = maskedClass(nOpts.mask);
  if (!MaskedClass) throw new Error("Masked class is not found for provided mask " + nOpts.mask + ", appropriate module needs to be imported manually before creating mask.");
  if (nOpts.mask === MaskedClass) delete nOpts.mask;
  if (nOpts._mask) {
    nOpts.mask = nOpts._mask;
    delete nOpts._mask;
  }
  return new MaskedClass(nOpts);
}
IMask.createMask = createMask;
class MaskElement {
  /** */
  /** */
  /** */
  /** Safely returns selection start */
  get selectionStart() {
    let start;
    try {
      start = this._unsafeSelectionStart;
    } catch {
    }
    return start != null ? start : this.value.length;
  }
  /** Safely returns selection end */
  get selectionEnd() {
    let end;
    try {
      end = this._unsafeSelectionEnd;
    } catch {
    }
    return end != null ? end : this.value.length;
  }
  /** Safely sets element selection */
  select(start, end) {
    if (start == null || end == null || start === this.selectionStart && end === this.selectionEnd) return;
    try {
      this._unsafeSelect(start, end);
    } catch {
    }
  }
  /** */
  get isActive() {
    return false;
  }
  /** */
  /** */
  /** */
}
IMask.MaskElement = MaskElement;
const KEY_Z = 90;
const KEY_Y = 89;
class HTMLMaskElement extends MaskElement {
  /** HTMLElement to use mask on */
  constructor(input) {
    super();
    this.input = input;
    this._onKeydown = this._onKeydown.bind(this);
    this._onInput = this._onInput.bind(this);
    this._onBeforeinput = this._onBeforeinput.bind(this);
    this._onCompositionEnd = this._onCompositionEnd.bind(this);
  }
  get rootElement() {
    var _this$input$getRootNo, _this$input$getRootNo2, _this$input;
    return (_this$input$getRootNo = (_this$input$getRootNo2 = (_this$input = this.input).getRootNode) == null ? void 0 : _this$input$getRootNo2.call(_this$input)) != null ? _this$input$getRootNo : document;
  }
  /** Is element in focus */
  get isActive() {
    return this.input === this.rootElement.activeElement;
  }
  /** Binds HTMLElement events to mask internal events */
  bindEvents(handlers) {
    this.input.addEventListener("keydown", this._onKeydown);
    this.input.addEventListener("input", this._onInput);
    this.input.addEventListener("beforeinput", this._onBeforeinput);
    this.input.addEventListener("compositionend", this._onCompositionEnd);
    this.input.addEventListener("drop", handlers.drop);
    this.input.addEventListener("click", handlers.click);
    this.input.addEventListener("focus", handlers.focus);
    this.input.addEventListener("blur", handlers.commit);
    this._handlers = handlers;
  }
  _onKeydown(e2) {
    if (this._handlers.redo && (e2.keyCode === KEY_Z && e2.shiftKey && (e2.metaKey || e2.ctrlKey) || e2.keyCode === KEY_Y && e2.ctrlKey)) {
      e2.preventDefault();
      return this._handlers.redo(e2);
    }
    if (this._handlers.undo && e2.keyCode === KEY_Z && (e2.metaKey || e2.ctrlKey)) {
      e2.preventDefault();
      return this._handlers.undo(e2);
    }
    if (!e2.isComposing) this._handlers.selectionChange(e2);
  }
  _onBeforeinput(e2) {
    if (e2.inputType === "historyUndo" && this._handlers.undo) {
      e2.preventDefault();
      return this._handlers.undo(e2);
    }
    if (e2.inputType === "historyRedo" && this._handlers.redo) {
      e2.preventDefault();
      return this._handlers.redo(e2);
    }
  }
  _onCompositionEnd(e2) {
    this._handlers.input(e2);
  }
  _onInput(e2) {
    if (!e2.isComposing) this._handlers.input(e2);
  }
  /** Unbinds HTMLElement events to mask internal events */
  unbindEvents() {
    this.input.removeEventListener("keydown", this._onKeydown);
    this.input.removeEventListener("input", this._onInput);
    this.input.removeEventListener("beforeinput", this._onBeforeinput);
    this.input.removeEventListener("compositionend", this._onCompositionEnd);
    this.input.removeEventListener("drop", this._handlers.drop);
    this.input.removeEventListener("click", this._handlers.click);
    this.input.removeEventListener("focus", this._handlers.focus);
    this.input.removeEventListener("blur", this._handlers.commit);
    this._handlers = {};
  }
}
IMask.HTMLMaskElement = HTMLMaskElement;
class HTMLInputMaskElement extends HTMLMaskElement {
  /** InputElement to use mask on */
  constructor(input) {
    super(input);
    this.input = input;
  }
  /** Returns InputElement selection start */
  get _unsafeSelectionStart() {
    return this.input.selectionStart != null ? this.input.selectionStart : this.value.length;
  }
  /** Returns InputElement selection end */
  get _unsafeSelectionEnd() {
    return this.input.selectionEnd;
  }
  /** Sets InputElement selection */
  _unsafeSelect(start, end) {
    this.input.setSelectionRange(start, end);
  }
  get value() {
    return this.input.value;
  }
  set value(value) {
    this.input.value = value;
  }
}
IMask.HTMLMaskElement = HTMLMaskElement;
class HTMLContenteditableMaskElement extends HTMLMaskElement {
  /** Returns HTMLElement selection start */
  get _unsafeSelectionStart() {
    const root = this.rootElement;
    const selection = root.getSelection && root.getSelection();
    const anchorOffset = selection && selection.anchorOffset;
    const focusOffset = selection && selection.focusOffset;
    if (focusOffset == null || anchorOffset == null || anchorOffset < focusOffset) {
      return anchorOffset;
    }
    return focusOffset;
  }
  /** Returns HTMLElement selection end */
  get _unsafeSelectionEnd() {
    const root = this.rootElement;
    const selection = root.getSelection && root.getSelection();
    const anchorOffset = selection && selection.anchorOffset;
    const focusOffset = selection && selection.focusOffset;
    if (focusOffset == null || anchorOffset == null || anchorOffset > focusOffset) {
      return anchorOffset;
    }
    return focusOffset;
  }
  /** Sets HTMLElement selection */
  _unsafeSelect(start, end) {
    if (!this.rootElement.createRange) return;
    const range = this.rootElement.createRange();
    range.setStart(this.input.firstChild || this.input, start);
    range.setEnd(this.input.lastChild || this.input, end);
    const root = this.rootElement;
    const selection = root.getSelection && root.getSelection();
    if (selection) {
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }
  /** HTMLElement value */
  get value() {
    return this.input.textContent || "";
  }
  set value(value) {
    this.input.textContent = value;
  }
}
IMask.HTMLContenteditableMaskElement = HTMLContenteditableMaskElement;
class InputHistory {
  constructor() {
    this.states = [];
    this.currentIndex = 0;
  }
  get currentState() {
    return this.states[this.currentIndex];
  }
  get isEmpty() {
    return this.states.length === 0;
  }
  push(state) {
    if (this.currentIndex < this.states.length - 1) this.states.length = this.currentIndex + 1;
    this.states.push(state);
    if (this.states.length > InputHistory.MAX_LENGTH) this.states.shift();
    this.currentIndex = this.states.length - 1;
  }
  go(steps) {
    this.currentIndex = Math.min(Math.max(this.currentIndex + steps, 0), this.states.length - 1);
    return this.currentState;
  }
  undo() {
    return this.go(-1);
  }
  redo() {
    return this.go(1);
  }
  clear() {
    this.states.length = 0;
    this.currentIndex = 0;
  }
}
InputHistory.MAX_LENGTH = 100;
class InputMask {
  /**
    View element
  */
  /** Internal {@link Masked} model */
  constructor(el, opts) {
    this.el = el instanceof MaskElement ? el : el.isContentEditable && el.tagName !== "INPUT" && el.tagName !== "TEXTAREA" ? new HTMLContenteditableMaskElement(el) : new HTMLInputMaskElement(el);
    this.masked = createMask(opts);
    this._listeners = {};
    this._value = "";
    this._unmaskedValue = "";
    this._rawInputValue = "";
    this.history = new InputHistory();
    this._saveSelection = this._saveSelection.bind(this);
    this._onInput = this._onInput.bind(this);
    this._onChange = this._onChange.bind(this);
    this._onDrop = this._onDrop.bind(this);
    this._onFocus = this._onFocus.bind(this);
    this._onClick = this._onClick.bind(this);
    this._onUndo = this._onUndo.bind(this);
    this._onRedo = this._onRedo.bind(this);
    this.alignCursor = this.alignCursor.bind(this);
    this.alignCursorFriendly = this.alignCursorFriendly.bind(this);
    this._bindEvents();
    this.updateValue();
    this._onChange();
  }
  maskEquals(mask) {
    var _this$masked;
    return mask == null || ((_this$masked = this.masked) == null ? void 0 : _this$masked.maskEquals(mask));
  }
  /** Masked */
  get mask() {
    return this.masked.mask;
  }
  set mask(mask) {
    if (this.maskEquals(mask)) return;
    if (!(mask instanceof IMask.Masked) && this.masked.constructor === maskedClass(mask)) {
      this.masked.updateOptions({
        mask
      });
      return;
    }
    const masked = mask instanceof IMask.Masked ? mask : createMask({
      mask
    });
    masked.unmaskedValue = this.masked.unmaskedValue;
    this.masked = masked;
  }
  /** Raw value */
  get value() {
    return this._value;
  }
  set value(str) {
    if (this.value === str) return;
    this.masked.value = str;
    this.updateControl("auto");
  }
  /** Unmasked value */
  get unmaskedValue() {
    return this._unmaskedValue;
  }
  set unmaskedValue(str) {
    if (this.unmaskedValue === str) return;
    this.masked.unmaskedValue = str;
    this.updateControl("auto");
  }
  /** Raw input value */
  get rawInputValue() {
    return this._rawInputValue;
  }
  set rawInputValue(str) {
    if (this.rawInputValue === str) return;
    this.masked.rawInputValue = str;
    this.updateControl();
    this.alignCursor();
  }
  /** Typed unmasked value */
  get typedValue() {
    return this.masked.typedValue;
  }
  set typedValue(val) {
    if (this.masked.typedValueEquals(val)) return;
    this.masked.typedValue = val;
    this.updateControl("auto");
  }
  /** Display value */
  get displayValue() {
    return this.masked.displayValue;
  }
  /** Starts listening to element events */
  _bindEvents() {
    this.el.bindEvents({
      selectionChange: this._saveSelection,
      input: this._onInput,
      drop: this._onDrop,
      click: this._onClick,
      focus: this._onFocus,
      commit: this._onChange,
      undo: this._onUndo,
      redo: this._onRedo
    });
  }
  /** Stops listening to element events */
  _unbindEvents() {
    if (this.el) this.el.unbindEvents();
  }
  /** Fires custom event */
  _fireEvent(ev, e2) {
    const listeners = this._listeners[ev];
    if (!listeners) return;
    listeners.forEach((l2) => l2(e2));
  }
  /** Current selection start */
  get selectionStart() {
    return this._cursorChanging ? this._changingCursorPos : this.el.selectionStart;
  }
  /** Current cursor position */
  get cursorPos() {
    return this._cursorChanging ? this._changingCursorPos : this.el.selectionEnd;
  }
  set cursorPos(pos) {
    if (!this.el || !this.el.isActive) return;
    this.el.select(pos, pos);
    this._saveSelection();
  }
  /** Stores current selection */
  _saveSelection() {
    if (this.displayValue !== this.el.value) {
      console.warn("Element value was changed outside of mask. Syncronize mask using `mask.updateValue()` to work properly.");
    }
    this._selection = {
      start: this.selectionStart,
      end: this.cursorPos
    };
  }
  /** Syncronizes model value from view */
  updateValue() {
    this.masked.value = this.el.value;
    this._value = this.masked.value;
    this._unmaskedValue = this.masked.unmaskedValue;
    this._rawInputValue = this.masked.rawInputValue;
  }
  /** Syncronizes view from model value, fires change events */
  updateControl(cursorPos) {
    const newUnmaskedValue = this.masked.unmaskedValue;
    const newValue = this.masked.value;
    const newRawInputValue = this.masked.rawInputValue;
    const newDisplayValue = this.displayValue;
    const isChanged = this.unmaskedValue !== newUnmaskedValue || this.value !== newValue || this._rawInputValue !== newRawInputValue;
    this._unmaskedValue = newUnmaskedValue;
    this._value = newValue;
    this._rawInputValue = newRawInputValue;
    if (this.el.value !== newDisplayValue) this.el.value = newDisplayValue;
    if (cursorPos === "auto") this.alignCursor();
    else if (cursorPos != null) this.cursorPos = cursorPos;
    if (isChanged) this._fireChangeEvents();
    if (!this._historyChanging && (isChanged || this.history.isEmpty)) this.history.push({
      unmaskedValue: newUnmaskedValue,
      selection: {
        start: this.selectionStart,
        end: this.cursorPos
      }
    });
  }
  /** Updates options with deep equal check, recreates {@link Masked} model if mask type changes */
  updateOptions(opts) {
    const {
      mask,
      ...restOpts
    } = opts;
    const updateMask = !this.maskEquals(mask);
    const updateOpts = this.masked.optionsIsChanged(restOpts);
    if (updateMask) this.mask = mask;
    if (updateOpts) this.masked.updateOptions(restOpts);
    if (updateMask || updateOpts) this.updateControl();
  }
  /** Updates cursor */
  updateCursor(cursorPos) {
    if (cursorPos == null) return;
    this.cursorPos = cursorPos;
    this._delayUpdateCursor(cursorPos);
  }
  /** Delays cursor update to support mobile browsers */
  _delayUpdateCursor(cursorPos) {
    this._abortUpdateCursor();
    this._changingCursorPos = cursorPos;
    this._cursorChanging = setTimeout(() => {
      if (!this.el) return;
      this.cursorPos = this._changingCursorPos;
      this._abortUpdateCursor();
    }, 10);
  }
  /** Fires custom events */
  _fireChangeEvents() {
    this._fireEvent("accept", this._inputEvent);
    if (this.masked.isComplete) this._fireEvent("complete", this._inputEvent);
  }
  /** Aborts delayed cursor update */
  _abortUpdateCursor() {
    if (this._cursorChanging) {
      clearTimeout(this._cursorChanging);
      delete this._cursorChanging;
    }
  }
  /** Aligns cursor to nearest available position */
  alignCursor() {
    this.cursorPos = this.masked.nearestInputPos(this.masked.nearestInputPos(this.cursorPos, DIRECTION.LEFT));
  }
  /** Aligns cursor only if selection is empty */
  alignCursorFriendly() {
    if (this.selectionStart !== this.cursorPos) return;
    this.alignCursor();
  }
  /** Adds listener on custom event */
  on(ev, handler) {
    if (!this._listeners[ev]) this._listeners[ev] = [];
    this._listeners[ev].push(handler);
    return this;
  }
  /** Removes custom event listener */
  off(ev, handler) {
    if (!this._listeners[ev]) return this;
    if (!handler) {
      delete this._listeners[ev];
      return this;
    }
    const hIndex = this._listeners[ev].indexOf(handler);
    if (hIndex >= 0) this._listeners[ev].splice(hIndex, 1);
    return this;
  }
  /** Handles view input event */
  _onInput(e2) {
    this._inputEvent = e2;
    this._abortUpdateCursor();
    const details = new ActionDetails({
      // new state
      value: this.el.value,
      cursorPos: this.cursorPos,
      // old state
      oldValue: this.displayValue,
      oldSelection: this._selection
    });
    const oldRawValue = this.masked.rawInputValue;
    const offset = this.masked.splice(details.startChangePos, details.removed.length, details.inserted, details.removeDirection, {
      input: true,
      raw: true
    }).offset;
    const removeDirection = oldRawValue === this.masked.rawInputValue ? details.removeDirection : DIRECTION.NONE;
    let cursorPos = this.masked.nearestInputPos(details.startChangePos + offset, removeDirection);
    if (removeDirection !== DIRECTION.NONE) cursorPos = this.masked.nearestInputPos(cursorPos, DIRECTION.NONE);
    this.updateControl(cursorPos);
    delete this._inputEvent;
  }
  /** Handles view change event and commits model value */
  _onChange() {
    if (this.displayValue !== this.el.value) this.updateValue();
    this.masked.doCommit();
    this.updateControl();
    this._saveSelection();
  }
  /** Handles view drop event, prevents by default */
  _onDrop(ev) {
    ev.preventDefault();
    ev.stopPropagation();
  }
  /** Restore last selection on focus */
  _onFocus(ev) {
    this.alignCursorFriendly();
  }
  /** Restore last selection on focus */
  _onClick(ev) {
    this.alignCursorFriendly();
  }
  _onUndo() {
    this._applyHistoryState(this.history.undo());
  }
  _onRedo() {
    this._applyHistoryState(this.history.redo());
  }
  _applyHistoryState(state) {
    if (!state) return;
    this._historyChanging = true;
    this.unmaskedValue = state.unmaskedValue;
    this.el.select(state.selection.start, state.selection.end);
    this._saveSelection();
    this._historyChanging = false;
  }
  /** Unbind view events and removes element reference */
  destroy() {
    this._unbindEvents();
    this._listeners.length = 0;
    delete this.el;
  }
}
IMask.InputMask = InputMask;
class ChangeDetails {
  /** Inserted symbols */
  /** Additional offset if any changes occurred before tail */
  /** Raw inserted is used by dynamic mask */
  /** Can skip chars */
  static normalize(prep) {
    return Array.isArray(prep) ? prep : [prep, new ChangeDetails()];
  }
  constructor(details) {
    Object.assign(this, {
      inserted: "",
      rawInserted: "",
      tailShift: 0,
      skip: false
    }, details);
  }
  /** Aggregate changes */
  aggregate(details) {
    this.inserted += details.inserted;
    this.rawInserted += details.rawInserted;
    this.tailShift += details.tailShift;
    this.skip = this.skip || details.skip;
    return this;
  }
  /** Total offset considering all changes */
  get offset() {
    return this.tailShift + this.inserted.length;
  }
  get consumed() {
    return Boolean(this.rawInserted) || this.skip;
  }
  equals(details) {
    return this.inserted === details.inserted && this.tailShift === details.tailShift && this.rawInserted === details.rawInserted && this.skip === details.skip;
  }
}
IMask.ChangeDetails = ChangeDetails;
class ContinuousTailDetails {
  /** Tail value as string */
  /** Tail start position */
  /** Start position */
  constructor(value, from, stop) {
    if (value === void 0) {
      value = "";
    }
    if (from === void 0) {
      from = 0;
    }
    this.value = value;
    this.from = from;
    this.stop = stop;
  }
  toString() {
    return this.value;
  }
  extend(tail) {
    this.value += String(tail);
  }
  appendTo(masked) {
    return masked.append(this.toString(), {
      tail: true
    }).aggregate(masked._appendPlaceholder());
  }
  get state() {
    return {
      value: this.value,
      from: this.from,
      stop: this.stop
    };
  }
  set state(state) {
    Object.assign(this, state);
  }
  unshift(beforePos) {
    if (!this.value.length || beforePos != null && this.from >= beforePos) return "";
    const shiftChar = this.value[0];
    this.value = this.value.slice(1);
    return shiftChar;
  }
  shift() {
    if (!this.value.length) return "";
    const shiftChar = this.value[this.value.length - 1];
    this.value = this.value.slice(0, -1);
    return shiftChar;
  }
}
class Masked {
  /** */
  /** */
  /** Transforms value before mask processing */
  /** Transforms each char before mask processing */
  /** Validates if value is acceptable */
  /** Does additional processing at the end of editing */
  /** Format typed value to string */
  /** Parse string to get typed value */
  /** Enable characters overwriting */
  /** */
  /** */
  /** */
  /** */
  constructor(opts) {
    this._value = "";
    this._update({
      ...Masked.DEFAULTS,
      ...opts
    });
    this._initialized = true;
  }
  /** Sets and applies new options */
  updateOptions(opts) {
    if (!this.optionsIsChanged(opts)) return;
    this.withValueRefresh(this._update.bind(this, opts));
  }
  /** Sets new options */
  _update(opts) {
    Object.assign(this, opts);
  }
  /** Mask state */
  get state() {
    return {
      _value: this.value,
      _rawInputValue: this.rawInputValue
    };
  }
  set state(state) {
    this._value = state._value;
  }
  /** Resets value */
  reset() {
    this._value = "";
  }
  get value() {
    return this._value;
  }
  set value(value) {
    this.resolve(value, {
      input: true
    });
  }
  /** Resolve new value */
  resolve(value, flags) {
    if (flags === void 0) {
      flags = {
        input: true
      };
    }
    this.reset();
    this.append(value, flags, "");
    this.doCommit();
  }
  get unmaskedValue() {
    return this.value;
  }
  set unmaskedValue(value) {
    this.resolve(value, {});
  }
  get typedValue() {
    return this.parse ? this.parse(this.value, this) : this.unmaskedValue;
  }
  set typedValue(value) {
    if (this.format) {
      this.value = this.format(value, this);
    } else {
      this.unmaskedValue = String(value);
    }
  }
  /** Value that includes raw user input */
  get rawInputValue() {
    return this.extractInput(0, this.displayValue.length, {
      raw: true
    });
  }
  set rawInputValue(value) {
    this.resolve(value, {
      raw: true
    });
  }
  get displayValue() {
    return this.value;
  }
  get isComplete() {
    return true;
  }
  get isFilled() {
    return this.isComplete;
  }
  /** Finds nearest input position in direction */
  nearestInputPos(cursorPos, direction) {
    return cursorPos;
  }
  totalInputPositions(fromPos, toPos) {
    if (fromPos === void 0) {
      fromPos = 0;
    }
    if (toPos === void 0) {
      toPos = this.displayValue.length;
    }
    return Math.min(this.displayValue.length, toPos - fromPos);
  }
  /** Extracts value in range considering flags */
  extractInput(fromPos, toPos, flags) {
    if (fromPos === void 0) {
      fromPos = 0;
    }
    if (toPos === void 0) {
      toPos = this.displayValue.length;
    }
    return this.displayValue.slice(fromPos, toPos);
  }
  /** Extracts tail in range */
  extractTail(fromPos, toPos) {
    if (fromPos === void 0) {
      fromPos = 0;
    }
    if (toPos === void 0) {
      toPos = this.displayValue.length;
    }
    return new ContinuousTailDetails(this.extractInput(fromPos, toPos), fromPos);
  }
  /** Appends tail */
  appendTail(tail) {
    if (isString(tail)) tail = new ContinuousTailDetails(String(tail));
    return tail.appendTo(this);
  }
  /** Appends char */
  _appendCharRaw(ch, flags) {
    if (!ch) return new ChangeDetails();
    this._value += ch;
    return new ChangeDetails({
      inserted: ch,
      rawInserted: ch
    });
  }
  /** Appends char */
  _appendChar(ch, flags, checkTail) {
    if (flags === void 0) {
      flags = {};
    }
    const consistentState = this.state;
    let details;
    [ch, details] = this.doPrepareChar(ch, flags);
    if (ch) {
      details = details.aggregate(this._appendCharRaw(ch, flags));
      if (!details.rawInserted && this.autofix === "pad") {
        const noFixState = this.state;
        this.state = consistentState;
        let fixDetails = this.pad(flags);
        const chDetails = this._appendCharRaw(ch, flags);
        fixDetails = fixDetails.aggregate(chDetails);
        if (chDetails.rawInserted || fixDetails.equals(details)) {
          details = fixDetails;
        } else {
          this.state = noFixState;
        }
      }
    }
    if (details.inserted) {
      let consistentTail;
      let appended = this.doValidate(flags) !== false;
      if (appended && checkTail != null) {
        const beforeTailState = this.state;
        if (this.overwrite === true) {
          consistentTail = checkTail.state;
          for (let i2 = 0; i2 < details.rawInserted.length; ++i2) {
            checkTail.unshift(this.displayValue.length - details.tailShift);
          }
        }
        let tailDetails = this.appendTail(checkTail);
        appended = tailDetails.rawInserted.length === checkTail.toString().length;
        if (!(appended && tailDetails.inserted) && this.overwrite === "shift") {
          this.state = beforeTailState;
          consistentTail = checkTail.state;
          for (let i2 = 0; i2 < details.rawInserted.length; ++i2) {
            checkTail.shift();
          }
          tailDetails = this.appendTail(checkTail);
          appended = tailDetails.rawInserted.length === checkTail.toString().length;
        }
        if (appended && tailDetails.inserted) this.state = beforeTailState;
      }
      if (!appended) {
        details = new ChangeDetails();
        this.state = consistentState;
        if (checkTail && consistentTail) checkTail.state = consistentTail;
      }
    }
    return details;
  }
  /** Appends optional placeholder at the end */
  _appendPlaceholder() {
    return new ChangeDetails();
  }
  /** Appends optional eager placeholder at the end */
  _appendEager() {
    return new ChangeDetails();
  }
  /** Appends symbols considering flags */
  append(str, flags, tail) {
    if (!isString(str)) throw new Error("value should be string");
    const checkTail = isString(tail) ? new ContinuousTailDetails(String(tail)) : tail;
    if (flags != null && flags.tail) flags._beforeTailState = this.state;
    let details;
    [str, details] = this.doPrepare(str, flags);
    for (let ci = 0; ci < str.length; ++ci) {
      const d2 = this._appendChar(str[ci], flags, checkTail);
      if (!d2.rawInserted && !this.doSkipInvalid(str[ci], flags, checkTail)) break;
      details.aggregate(d2);
    }
    if ((this.eager === true || this.eager === "append") && flags != null && flags.input && str) {
      details.aggregate(this._appendEager());
    }
    if (checkTail != null) {
      details.tailShift += this.appendTail(checkTail).tailShift;
    }
    return details;
  }
  remove(fromPos, toPos) {
    if (fromPos === void 0) {
      fromPos = 0;
    }
    if (toPos === void 0) {
      toPos = this.displayValue.length;
    }
    this._value = this.displayValue.slice(0, fromPos) + this.displayValue.slice(toPos);
    return new ChangeDetails();
  }
  /** Calls function and reapplies current value */
  withValueRefresh(fn) {
    if (this._refreshing || !this._initialized) return fn();
    this._refreshing = true;
    const rawInput = this.rawInputValue;
    const value = this.value;
    const ret = fn();
    this.rawInputValue = rawInput;
    if (this.value && this.value !== value && value.indexOf(this.value) === 0) {
      this.append(value.slice(this.displayValue.length), {}, "");
      this.doCommit();
    }
    delete this._refreshing;
    return ret;
  }
  runIsolated(fn) {
    if (this._isolated || !this._initialized) return fn(this);
    this._isolated = true;
    const state = this.state;
    const ret = fn(this);
    this.state = state;
    delete this._isolated;
    return ret;
  }
  doSkipInvalid(ch, flags, checkTail) {
    return Boolean(this.skipInvalid);
  }
  /** Prepares string before mask processing */
  doPrepare(str, flags) {
    if (flags === void 0) {
      flags = {};
    }
    return ChangeDetails.normalize(this.prepare ? this.prepare(str, this, flags) : str);
  }
  /** Prepares each char before mask processing */
  doPrepareChar(str, flags) {
    if (flags === void 0) {
      flags = {};
    }
    return ChangeDetails.normalize(this.prepareChar ? this.prepareChar(str, this, flags) : str);
  }
  /** Validates if value is acceptable */
  doValidate(flags) {
    return (!this.validate || this.validate(this.value, this, flags)) && (!this.parent || this.parent.doValidate(flags));
  }
  /** Does additional processing at the end of editing */
  doCommit() {
    if (this.commit) this.commit(this.value, this);
  }
  splice(start, deleteCount, inserted, removeDirection, flags) {
    if (inserted === void 0) {
      inserted = "";
    }
    if (removeDirection === void 0) {
      removeDirection = DIRECTION.NONE;
    }
    if (flags === void 0) {
      flags = {
        input: true
      };
    }
    const tailPos = start + deleteCount;
    const tail = this.extractTail(tailPos);
    const eagerRemove = this.eager === true || this.eager === "remove";
    let oldRawValue;
    if (eagerRemove) {
      removeDirection = forceDirection(removeDirection);
      oldRawValue = this.extractInput(0, tailPos, {
        raw: true
      });
    }
    let startChangePos = start;
    const details = new ChangeDetails();
    if (removeDirection !== DIRECTION.NONE) {
      startChangePos = this.nearestInputPos(start, deleteCount > 1 && start !== 0 && !eagerRemove ? DIRECTION.NONE : removeDirection);
      details.tailShift = startChangePos - start;
    }
    details.aggregate(this.remove(startChangePos));
    if (eagerRemove && removeDirection !== DIRECTION.NONE && oldRawValue === this.rawInputValue) {
      if (removeDirection === DIRECTION.FORCE_LEFT) {
        let valLength;
        while (oldRawValue === this.rawInputValue && (valLength = this.displayValue.length)) {
          details.aggregate(new ChangeDetails({
            tailShift: -1
          })).aggregate(this.remove(valLength - 1));
        }
      } else if (removeDirection === DIRECTION.FORCE_RIGHT) {
        tail.unshift();
      }
    }
    return details.aggregate(this.append(inserted, flags, tail));
  }
  maskEquals(mask) {
    return this.mask === mask;
  }
  optionsIsChanged(opts) {
    return !objectIncludes(this, opts);
  }
  typedValueEquals(value) {
    const tval = this.typedValue;
    return value === tval || Masked.EMPTY_VALUES.includes(value) && Masked.EMPTY_VALUES.includes(tval) || (this.format ? this.format(value, this) === this.format(this.typedValue, this) : false);
  }
  pad(flags) {
    return new ChangeDetails();
  }
}
Masked.DEFAULTS = {
  skipInvalid: true
};
Masked.EMPTY_VALUES = [void 0, null, ""];
IMask.Masked = Masked;
class ChunksTailDetails {
  /** */
  constructor(chunks, from) {
    if (chunks === void 0) {
      chunks = [];
    }
    if (from === void 0) {
      from = 0;
    }
    this.chunks = chunks;
    this.from = from;
  }
  toString() {
    return this.chunks.map(String).join("");
  }
  extend(tailChunk) {
    if (!String(tailChunk)) return;
    tailChunk = isString(tailChunk) ? new ContinuousTailDetails(String(tailChunk)) : tailChunk;
    const lastChunk = this.chunks[this.chunks.length - 1];
    const extendLast = lastChunk && // if stops are same or tail has no stop
    (lastChunk.stop === tailChunk.stop || tailChunk.stop == null) && // if tail chunk goes just after last chunk
    tailChunk.from === lastChunk.from + lastChunk.toString().length;
    if (tailChunk instanceof ContinuousTailDetails) {
      if (extendLast) {
        lastChunk.extend(tailChunk.toString());
      } else {
        this.chunks.push(tailChunk);
      }
    } else if (tailChunk instanceof ChunksTailDetails) {
      if (tailChunk.stop == null) {
        let firstTailChunk;
        while (tailChunk.chunks.length && tailChunk.chunks[0].stop == null) {
          firstTailChunk = tailChunk.chunks.shift();
          firstTailChunk.from += tailChunk.from;
          this.extend(firstTailChunk);
        }
      }
      if (tailChunk.toString()) {
        tailChunk.stop = tailChunk.blockIndex;
        this.chunks.push(tailChunk);
      }
    }
  }
  appendTo(masked) {
    if (!(masked instanceof IMask.MaskedPattern)) {
      const tail = new ContinuousTailDetails(this.toString());
      return tail.appendTo(masked);
    }
    const details = new ChangeDetails();
    for (let ci = 0; ci < this.chunks.length; ++ci) {
      const chunk = this.chunks[ci];
      const lastBlockIter = masked._mapPosToBlock(masked.displayValue.length);
      const stop = chunk.stop;
      let chunkBlock;
      if (stop != null && // if block not found or stop is behind lastBlock
      (!lastBlockIter || lastBlockIter.index <= stop)) {
        if (chunk instanceof ChunksTailDetails || // for continuous block also check if stop is exist
        masked._stops.indexOf(stop) >= 0) {
          details.aggregate(masked._appendPlaceholder(stop));
        }
        chunkBlock = chunk instanceof ChunksTailDetails && masked._blocks[stop];
      }
      if (chunkBlock) {
        const tailDetails = chunkBlock.appendTail(chunk);
        details.aggregate(tailDetails);
        const remainChars = chunk.toString().slice(tailDetails.rawInserted.length);
        if (remainChars) details.aggregate(masked.append(remainChars, {
          tail: true
        }));
      } else {
        details.aggregate(masked.append(chunk.toString(), {
          tail: true
        }));
      }
    }
    return details;
  }
  get state() {
    return {
      chunks: this.chunks.map((c2) => c2.state),
      from: this.from,
      stop: this.stop,
      blockIndex: this.blockIndex
    };
  }
  set state(state) {
    const {
      chunks,
      ...props
    } = state;
    Object.assign(this, props);
    this.chunks = chunks.map((cstate) => {
      const chunk = "chunks" in cstate ? new ChunksTailDetails() : new ContinuousTailDetails();
      chunk.state = cstate;
      return chunk;
    });
  }
  unshift(beforePos) {
    if (!this.chunks.length || beforePos != null && this.from >= beforePos) return "";
    const chunkShiftPos = beforePos != null ? beforePos - this.from : beforePos;
    let ci = 0;
    while (ci < this.chunks.length) {
      const chunk = this.chunks[ci];
      const shiftChar = chunk.unshift(chunkShiftPos);
      if (chunk.toString()) {
        if (!shiftChar) break;
        ++ci;
      } else {
        this.chunks.splice(ci, 1);
      }
      if (shiftChar) return shiftChar;
    }
    return "";
  }
  shift() {
    if (!this.chunks.length) return "";
    let ci = this.chunks.length - 1;
    while (0 <= ci) {
      const chunk = this.chunks[ci];
      const shiftChar = chunk.shift();
      if (chunk.toString()) {
        if (!shiftChar) break;
        --ci;
      } else {
        this.chunks.splice(ci, 1);
      }
      if (shiftChar) return shiftChar;
    }
    return "";
  }
}
class PatternCursor {
  constructor(masked, pos) {
    this.masked = masked;
    this._log = [];
    const {
      offset,
      index
    } = masked._mapPosToBlock(pos) || (pos < 0 ? (
      // first
      {
        index: 0,
        offset: 0
      }
    ) : (
      // last
      {
        index: this.masked._blocks.length,
        offset: 0
      }
    ));
    this.offset = offset;
    this.index = index;
    this.ok = false;
  }
  get block() {
    return this.masked._blocks[this.index];
  }
  get pos() {
    return this.masked._blockStartPos(this.index) + this.offset;
  }
  get state() {
    return {
      index: this.index,
      offset: this.offset,
      ok: this.ok
    };
  }
  set state(s2) {
    Object.assign(this, s2);
  }
  pushState() {
    this._log.push(this.state);
  }
  popState() {
    const s2 = this._log.pop();
    if (s2) this.state = s2;
    return s2;
  }
  bindBlock() {
    if (this.block) return;
    if (this.index < 0) {
      this.index = 0;
      this.offset = 0;
    }
    if (this.index >= this.masked._blocks.length) {
      this.index = this.masked._blocks.length - 1;
      this.offset = this.block.displayValue.length;
    }
  }
  _pushLeft(fn) {
    this.pushState();
    for (this.bindBlock(); 0 <= this.index; --this.index, this.offset = ((_this$block = this.block) == null ? void 0 : _this$block.displayValue.length) || 0) {
      var _this$block;
      if (fn()) return this.ok = true;
    }
    return this.ok = false;
  }
  _pushRight(fn) {
    this.pushState();
    for (this.bindBlock(); this.index < this.masked._blocks.length; ++this.index, this.offset = 0) {
      if (fn()) return this.ok = true;
    }
    return this.ok = false;
  }
  pushLeftBeforeFilled() {
    return this._pushLeft(() => {
      if (this.block.isFixed || !this.block.value) return;
      this.offset = this.block.nearestInputPos(this.offset, DIRECTION.FORCE_LEFT);
      if (this.offset !== 0) return true;
    });
  }
  pushLeftBeforeInput() {
    return this._pushLeft(() => {
      if (this.block.isFixed) return;
      this.offset = this.block.nearestInputPos(this.offset, DIRECTION.LEFT);
      return true;
    });
  }
  pushLeftBeforeRequired() {
    return this._pushLeft(() => {
      if (this.block.isFixed || this.block.isOptional && !this.block.value) return;
      this.offset = this.block.nearestInputPos(this.offset, DIRECTION.LEFT);
      return true;
    });
  }
  pushRightBeforeFilled() {
    return this._pushRight(() => {
      if (this.block.isFixed || !this.block.value) return;
      this.offset = this.block.nearestInputPos(this.offset, DIRECTION.FORCE_RIGHT);
      if (this.offset !== this.block.value.length) return true;
    });
  }
  pushRightBeforeInput() {
    return this._pushRight(() => {
      if (this.block.isFixed) return;
      this.offset = this.block.nearestInputPos(this.offset, DIRECTION.NONE);
      return true;
    });
  }
  pushRightBeforeRequired() {
    return this._pushRight(() => {
      if (this.block.isFixed || this.block.isOptional && !this.block.value) return;
      this.offset = this.block.nearestInputPos(this.offset, DIRECTION.NONE);
      return true;
    });
  }
}
class PatternFixedDefinition {
  /** */
  /** */
  /** */
  /** */
  /** */
  /** */
  constructor(opts) {
    Object.assign(this, opts);
    this._value = "";
    this.isFixed = true;
  }
  get value() {
    return this._value;
  }
  get unmaskedValue() {
    return this.isUnmasking ? this.value : "";
  }
  get rawInputValue() {
    return this._isRawInput ? this.value : "";
  }
  get displayValue() {
    return this.value;
  }
  reset() {
    this._isRawInput = false;
    this._value = "";
  }
  remove(fromPos, toPos) {
    if (fromPos === void 0) {
      fromPos = 0;
    }
    if (toPos === void 0) {
      toPos = this._value.length;
    }
    this._value = this._value.slice(0, fromPos) + this._value.slice(toPos);
    if (!this._value) this._isRawInput = false;
    return new ChangeDetails();
  }
  nearestInputPos(cursorPos, direction) {
    if (direction === void 0) {
      direction = DIRECTION.NONE;
    }
    const minPos = 0;
    const maxPos = this._value.length;
    switch (direction) {
      case DIRECTION.LEFT:
      case DIRECTION.FORCE_LEFT:
        return minPos;
      case DIRECTION.NONE:
      case DIRECTION.RIGHT:
      case DIRECTION.FORCE_RIGHT:
      default:
        return maxPos;
    }
  }
  totalInputPositions(fromPos, toPos) {
    if (fromPos === void 0) {
      fromPos = 0;
    }
    if (toPos === void 0) {
      toPos = this._value.length;
    }
    return this._isRawInput ? toPos - fromPos : 0;
  }
  extractInput(fromPos, toPos, flags) {
    if (fromPos === void 0) {
      fromPos = 0;
    }
    if (toPos === void 0) {
      toPos = this._value.length;
    }
    if (flags === void 0) {
      flags = {};
    }
    return flags.raw && this._isRawInput && this._value.slice(fromPos, toPos) || "";
  }
  get isComplete() {
    return true;
  }
  get isFilled() {
    return Boolean(this._value);
  }
  _appendChar(ch, flags) {
    if (flags === void 0) {
      flags = {};
    }
    if (this.isFilled) return new ChangeDetails();
    const appendEager = this.eager === true || this.eager === "append";
    const appended = this.char === ch;
    const isResolved = appended && (this.isUnmasking || flags.input || flags.raw) && (!flags.raw || !appendEager) && !flags.tail;
    const details = new ChangeDetails({
      inserted: this.char,
      rawInserted: isResolved ? this.char : ""
    });
    this._value = this.char;
    this._isRawInput = isResolved && (flags.raw || flags.input);
    return details;
  }
  _appendEager() {
    return this._appendChar(this.char, {
      tail: true
    });
  }
  _appendPlaceholder() {
    const details = new ChangeDetails();
    if (this.isFilled) return details;
    this._value = details.inserted = this.char;
    return details;
  }
  extractTail() {
    return new ContinuousTailDetails("");
  }
  appendTail(tail) {
    if (isString(tail)) tail = new ContinuousTailDetails(String(tail));
    return tail.appendTo(this);
  }
  append(str, flags, tail) {
    const details = this._appendChar(str[0], flags);
    if (tail != null) {
      details.tailShift += this.appendTail(tail).tailShift;
    }
    return details;
  }
  doCommit() {
  }
  get state() {
    return {
      _value: this._value,
      _rawInputValue: this.rawInputValue
    };
  }
  set state(state) {
    this._value = state._value;
    this._isRawInput = Boolean(state._rawInputValue);
  }
  pad(flags) {
    return this._appendPlaceholder();
  }
}
class PatternInputDefinition {
  /** */
  /** */
  /** */
  /** */
  /** */
  /** */
  /** */
  /** */
  constructor(opts) {
    const {
      parent,
      isOptional,
      placeholderChar,
      displayChar,
      lazy,
      eager,
      ...maskOpts
    } = opts;
    this.masked = createMask(maskOpts);
    Object.assign(this, {
      parent,
      isOptional,
      placeholderChar,
      displayChar,
      lazy,
      eager
    });
  }
  reset() {
    this.isFilled = false;
    this.masked.reset();
  }
  remove(fromPos, toPos) {
    if (fromPos === void 0) {
      fromPos = 0;
    }
    if (toPos === void 0) {
      toPos = this.value.length;
    }
    if (fromPos === 0 && toPos >= 1) {
      this.isFilled = false;
      return this.masked.remove(fromPos, toPos);
    }
    return new ChangeDetails();
  }
  get value() {
    return this.masked.value || (this.isFilled && !this.isOptional ? this.placeholderChar : "");
  }
  get unmaskedValue() {
    return this.masked.unmaskedValue;
  }
  get rawInputValue() {
    return this.masked.rawInputValue;
  }
  get displayValue() {
    return this.masked.value && this.displayChar || this.value;
  }
  get isComplete() {
    return Boolean(this.masked.value) || this.isOptional;
  }
  _appendChar(ch, flags) {
    if (flags === void 0) {
      flags = {};
    }
    if (this.isFilled) return new ChangeDetails();
    const state = this.masked.state;
    let details = this.masked._appendChar(ch, this.currentMaskFlags(flags));
    if (details.inserted && this.doValidate(flags) === false) {
      details = new ChangeDetails();
      this.masked.state = state;
    }
    if (!details.inserted && !this.isOptional && !this.lazy && !flags.input) {
      details.inserted = this.placeholderChar;
    }
    details.skip = !details.inserted && !this.isOptional;
    this.isFilled = Boolean(details.inserted);
    return details;
  }
  append(str, flags, tail) {
    return this.masked.append(str, this.currentMaskFlags(flags), tail);
  }
  _appendPlaceholder() {
    if (this.isFilled || this.isOptional) return new ChangeDetails();
    this.isFilled = true;
    return new ChangeDetails({
      inserted: this.placeholderChar
    });
  }
  _appendEager() {
    return new ChangeDetails();
  }
  extractTail(fromPos, toPos) {
    return this.masked.extractTail(fromPos, toPos);
  }
  appendTail(tail) {
    return this.masked.appendTail(tail);
  }
  extractInput(fromPos, toPos, flags) {
    if (fromPos === void 0) {
      fromPos = 0;
    }
    if (toPos === void 0) {
      toPos = this.value.length;
    }
    return this.masked.extractInput(fromPos, toPos, flags);
  }
  nearestInputPos(cursorPos, direction) {
    if (direction === void 0) {
      direction = DIRECTION.NONE;
    }
    const minPos = 0;
    const maxPos = this.value.length;
    const boundPos = Math.min(Math.max(cursorPos, minPos), maxPos);
    switch (direction) {
      case DIRECTION.LEFT:
      case DIRECTION.FORCE_LEFT:
        return this.isComplete ? boundPos : minPos;
      case DIRECTION.RIGHT:
      case DIRECTION.FORCE_RIGHT:
        return this.isComplete ? boundPos : maxPos;
      case DIRECTION.NONE:
      default:
        return boundPos;
    }
  }
  totalInputPositions(fromPos, toPos) {
    if (fromPos === void 0) {
      fromPos = 0;
    }
    if (toPos === void 0) {
      toPos = this.value.length;
    }
    return this.value.slice(fromPos, toPos).length;
  }
  doValidate(flags) {
    return this.masked.doValidate(this.currentMaskFlags(flags)) && (!this.parent || this.parent.doValidate(this.currentMaskFlags(flags)));
  }
  doCommit() {
    this.masked.doCommit();
  }
  get state() {
    return {
      _value: this.value,
      _rawInputValue: this.rawInputValue,
      masked: this.masked.state,
      isFilled: this.isFilled
    };
  }
  set state(state) {
    this.masked.state = state.masked;
    this.isFilled = state.isFilled;
  }
  currentMaskFlags(flags) {
    var _flags$_beforeTailSta;
    return {
      ...flags,
      _beforeTailState: (flags == null || (_flags$_beforeTailSta = flags._beforeTailState) == null ? void 0 : _flags$_beforeTailSta.masked) || (flags == null ? void 0 : flags._beforeTailState)
    };
  }
  pad(flags) {
    return new ChangeDetails();
  }
}
PatternInputDefinition.DEFAULT_DEFINITIONS = {
  "0": /\d/,
  "a": /[\u0041-\u005A\u0061-\u007A\u00AA\u00B5\u00BA\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u0527\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0\u08A2-\u08AC\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0977\u0979-\u097F\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C33\u0C35-\u0C39\u0C3D\u0C58\u0C59\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D60\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191C\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19C1-\u19C7\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2183\u2184\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005\u3006\u3031-\u3035\u303B\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA697\uA6A0-\uA6E5\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA793\uA7A0-\uA7AA\uA7F8-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA80-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uABC0-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]/,
  // http://stackoverflow.com/a/22075070
  "*": /./
};
class MaskedRegExp extends Masked {
  /** */
  /** Enable characters overwriting */
  /** */
  /** */
  /** */
  updateOptions(opts) {
    super.updateOptions(opts);
  }
  _update(opts) {
    const mask = opts.mask;
    if (mask) opts.validate = (value) => value.search(mask) >= 0;
    super._update(opts);
  }
}
IMask.MaskedRegExp = MaskedRegExp;
class MaskedPattern extends Masked {
  /** */
  /** */
  /** Single char for empty input */
  /** Single char for filled input */
  /** Show placeholder only when needed */
  /** Enable characters overwriting */
  /** */
  /** */
  /** */
  constructor(opts) {
    super({
      ...MaskedPattern.DEFAULTS,
      ...opts,
      definitions: Object.assign({}, PatternInputDefinition.DEFAULT_DEFINITIONS, opts == null ? void 0 : opts.definitions)
    });
  }
  updateOptions(opts) {
    super.updateOptions(opts);
  }
  _update(opts) {
    opts.definitions = Object.assign({}, this.definitions, opts.definitions);
    super._update(opts);
    this._rebuildMask();
  }
  _rebuildMask() {
    const defs = this.definitions;
    this._blocks = [];
    this.exposeBlock = void 0;
    this._stops = [];
    this._maskedBlocks = {};
    const pattern = this.mask;
    if (!pattern || !defs) return;
    let unmaskingBlock = false;
    let optionalBlock = false;
    for (let i2 = 0; i2 < pattern.length; ++i2) {
      if (this.blocks) {
        const p2 = pattern.slice(i2);
        const bNames = Object.keys(this.blocks).filter((bName2) => p2.indexOf(bName2) === 0);
        bNames.sort((a2, b2) => b2.length - a2.length);
        const bName = bNames[0];
        if (bName) {
          const {
            expose,
            repeat,
            ...bOpts
          } = normalizeOpts(this.blocks[bName]);
          const blockOpts = {
            lazy: this.lazy,
            eager: this.eager,
            placeholderChar: this.placeholderChar,
            displayChar: this.displayChar,
            overwrite: this.overwrite,
            autofix: this.autofix,
            ...bOpts,
            repeat,
            parent: this
          };
          const maskedBlock = repeat != null ? new IMask.RepeatBlock(
            blockOpts
            /* TODO */
          ) : createMask(blockOpts);
          if (maskedBlock) {
            this._blocks.push(maskedBlock);
            if (expose) this.exposeBlock = maskedBlock;
            if (!this._maskedBlocks[bName]) this._maskedBlocks[bName] = [];
            this._maskedBlocks[bName].push(this._blocks.length - 1);
          }
          i2 += bName.length - 1;
          continue;
        }
      }
      let char = pattern[i2];
      let isInput = char in defs;
      if (char === MaskedPattern.STOP_CHAR) {
        this._stops.push(this._blocks.length);
        continue;
      }
      if (char === "{" || char === "}") {
        unmaskingBlock = !unmaskingBlock;
        continue;
      }
      if (char === "[" || char === "]") {
        optionalBlock = !optionalBlock;
        continue;
      }
      if (char === MaskedPattern.ESCAPE_CHAR) {
        ++i2;
        char = pattern[i2];
        if (!char) break;
        isInput = false;
      }
      const def = isInput ? new PatternInputDefinition({
        isOptional: optionalBlock,
        lazy: this.lazy,
        eager: this.eager,
        placeholderChar: this.placeholderChar,
        displayChar: this.displayChar,
        ...normalizeOpts(defs[char]),
        parent: this
      }) : new PatternFixedDefinition({
        char,
        eager: this.eager,
        isUnmasking: unmaskingBlock
      });
      this._blocks.push(def);
    }
  }
  get state() {
    return {
      ...super.state,
      _blocks: this._blocks.map((b2) => b2.state)
    };
  }
  set state(state) {
    if (!state) {
      this.reset();
      return;
    }
    const {
      _blocks,
      ...maskedState
    } = state;
    this._blocks.forEach((b2, bi) => b2.state = _blocks[bi]);
    super.state = maskedState;
  }
  reset() {
    super.reset();
    this._blocks.forEach((b2) => b2.reset());
  }
  get isComplete() {
    return this.exposeBlock ? this.exposeBlock.isComplete : this._blocks.every((b2) => b2.isComplete);
  }
  get isFilled() {
    return this._blocks.every((b2) => b2.isFilled);
  }
  get isFixed() {
    return this._blocks.every((b2) => b2.isFixed);
  }
  get isOptional() {
    return this._blocks.every((b2) => b2.isOptional);
  }
  doCommit() {
    this._blocks.forEach((b2) => b2.doCommit());
    super.doCommit();
  }
  get unmaskedValue() {
    return this.exposeBlock ? this.exposeBlock.unmaskedValue : this._blocks.reduce((str, b2) => str += b2.unmaskedValue, "");
  }
  set unmaskedValue(unmaskedValue) {
    if (this.exposeBlock) {
      const tail = this.extractTail(this._blockStartPos(this._blocks.indexOf(this.exposeBlock)) + this.exposeBlock.displayValue.length);
      this.exposeBlock.unmaskedValue = unmaskedValue;
      this.appendTail(tail);
      this.doCommit();
    } else super.unmaskedValue = unmaskedValue;
  }
  get value() {
    return this.exposeBlock ? this.exposeBlock.value : (
      // TODO return _value when not in change?
      this._blocks.reduce((str, b2) => str += b2.value, "")
    );
  }
  set value(value) {
    if (this.exposeBlock) {
      const tail = this.extractTail(this._blockStartPos(this._blocks.indexOf(this.exposeBlock)) + this.exposeBlock.displayValue.length);
      this.exposeBlock.value = value;
      this.appendTail(tail);
      this.doCommit();
    } else super.value = value;
  }
  get typedValue() {
    return this.exposeBlock ? this.exposeBlock.typedValue : super.typedValue;
  }
  set typedValue(value) {
    if (this.exposeBlock) {
      const tail = this.extractTail(this._blockStartPos(this._blocks.indexOf(this.exposeBlock)) + this.exposeBlock.displayValue.length);
      this.exposeBlock.typedValue = value;
      this.appendTail(tail);
      this.doCommit();
    } else super.typedValue = value;
  }
  get displayValue() {
    return this._blocks.reduce((str, b2) => str += b2.displayValue, "");
  }
  appendTail(tail) {
    return super.appendTail(tail).aggregate(this._appendPlaceholder());
  }
  _appendEager() {
    var _this$_mapPosToBlock;
    const details = new ChangeDetails();
    let startBlockIndex = (_this$_mapPosToBlock = this._mapPosToBlock(this.displayValue.length)) == null ? void 0 : _this$_mapPosToBlock.index;
    if (startBlockIndex == null) return details;
    if (this._blocks[startBlockIndex].isFilled) ++startBlockIndex;
    for (let bi = startBlockIndex; bi < this._blocks.length; ++bi) {
      const d2 = this._blocks[bi]._appendEager();
      if (!d2.inserted) break;
      details.aggregate(d2);
    }
    return details;
  }
  _appendCharRaw(ch, flags) {
    if (flags === void 0) {
      flags = {};
    }
    const blockIter = this._mapPosToBlock(this.displayValue.length);
    const details = new ChangeDetails();
    if (!blockIter) return details;
    for (let bi = blockIter.index, block; block = this._blocks[bi]; ++bi) {
      var _flags$_beforeTailSta;
      const blockDetails = block._appendChar(ch, {
        ...flags,
        _beforeTailState: (_flags$_beforeTailSta = flags._beforeTailState) == null || (_flags$_beforeTailSta = _flags$_beforeTailSta._blocks) == null ? void 0 : _flags$_beforeTailSta[bi]
      });
      details.aggregate(blockDetails);
      if (blockDetails.consumed) break;
    }
    return details;
  }
  extractTail(fromPos, toPos) {
    if (fromPos === void 0) {
      fromPos = 0;
    }
    if (toPos === void 0) {
      toPos = this.displayValue.length;
    }
    const chunkTail = new ChunksTailDetails();
    if (fromPos === toPos) return chunkTail;
    this._forEachBlocksInRange(fromPos, toPos, (b2, bi, bFromPos, bToPos) => {
      const blockChunk = b2.extractTail(bFromPos, bToPos);
      blockChunk.stop = this._findStopBefore(bi);
      blockChunk.from = this._blockStartPos(bi);
      if (blockChunk instanceof ChunksTailDetails) blockChunk.blockIndex = bi;
      chunkTail.extend(blockChunk);
    });
    return chunkTail;
  }
  extractInput(fromPos, toPos, flags) {
    if (fromPos === void 0) {
      fromPos = 0;
    }
    if (toPos === void 0) {
      toPos = this.displayValue.length;
    }
    if (flags === void 0) {
      flags = {};
    }
    if (fromPos === toPos) return "";
    let input = "";
    this._forEachBlocksInRange(fromPos, toPos, (b2, _2, fromPos2, toPos2) => {
      input += b2.extractInput(fromPos2, toPos2, flags);
    });
    return input;
  }
  _findStopBefore(blockIndex) {
    let stopBefore;
    for (let si = 0; si < this._stops.length; ++si) {
      const stop = this._stops[si];
      if (stop <= blockIndex) stopBefore = stop;
      else break;
    }
    return stopBefore;
  }
  /** Appends placeholder depending on laziness */
  _appendPlaceholder(toBlockIndex) {
    const details = new ChangeDetails();
    if (this.lazy && toBlockIndex == null) return details;
    const startBlockIter = this._mapPosToBlock(this.displayValue.length);
    if (!startBlockIter) return details;
    const startBlockIndex = startBlockIter.index;
    const endBlockIndex = toBlockIndex != null ? toBlockIndex : this._blocks.length;
    this._blocks.slice(startBlockIndex, endBlockIndex).forEach((b2) => {
      if (!b2.lazy || toBlockIndex != null) {
        var _blocks2;
        details.aggregate(b2._appendPlaceholder((_blocks2 = b2._blocks) == null ? void 0 : _blocks2.length));
      }
    });
    return details;
  }
  /** Finds block in pos */
  _mapPosToBlock(pos) {
    let accVal = "";
    for (let bi = 0; bi < this._blocks.length; ++bi) {
      const block = this._blocks[bi];
      const blockStartPos = accVal.length;
      accVal += block.displayValue;
      if (pos <= accVal.length) {
        return {
          index: bi,
          offset: pos - blockStartPos
        };
      }
    }
  }
  _blockStartPos(blockIndex) {
    return this._blocks.slice(0, blockIndex).reduce((pos, b2) => pos += b2.displayValue.length, 0);
  }
  _forEachBlocksInRange(fromPos, toPos, fn) {
    if (toPos === void 0) {
      toPos = this.displayValue.length;
    }
    const fromBlockIter = this._mapPosToBlock(fromPos);
    if (fromBlockIter) {
      const toBlockIter = this._mapPosToBlock(toPos);
      const isSameBlock = toBlockIter && fromBlockIter.index === toBlockIter.index;
      const fromBlockStartPos = fromBlockIter.offset;
      const fromBlockEndPos = toBlockIter && isSameBlock ? toBlockIter.offset : this._blocks[fromBlockIter.index].displayValue.length;
      fn(this._blocks[fromBlockIter.index], fromBlockIter.index, fromBlockStartPos, fromBlockEndPos);
      if (toBlockIter && !isSameBlock) {
        for (let bi = fromBlockIter.index + 1; bi < toBlockIter.index; ++bi) {
          fn(this._blocks[bi], bi, 0, this._blocks[bi].displayValue.length);
        }
        fn(this._blocks[toBlockIter.index], toBlockIter.index, 0, toBlockIter.offset);
      }
    }
  }
  remove(fromPos, toPos) {
    if (fromPos === void 0) {
      fromPos = 0;
    }
    if (toPos === void 0) {
      toPos = this.displayValue.length;
    }
    const removeDetails = super.remove(fromPos, toPos);
    this._forEachBlocksInRange(fromPos, toPos, (b2, _2, bFromPos, bToPos) => {
      removeDetails.aggregate(b2.remove(bFromPos, bToPos));
    });
    return removeDetails;
  }
  nearestInputPos(cursorPos, direction) {
    if (direction === void 0) {
      direction = DIRECTION.NONE;
    }
    if (!this._blocks.length) return 0;
    const cursor = new PatternCursor(this, cursorPos);
    if (direction === DIRECTION.NONE) {
      if (cursor.pushRightBeforeInput()) return cursor.pos;
      cursor.popState();
      if (cursor.pushLeftBeforeInput()) return cursor.pos;
      return this.displayValue.length;
    }
    if (direction === DIRECTION.LEFT || direction === DIRECTION.FORCE_LEFT) {
      if (direction === DIRECTION.LEFT) {
        cursor.pushRightBeforeFilled();
        if (cursor.ok && cursor.pos === cursorPos) return cursorPos;
        cursor.popState();
      }
      cursor.pushLeftBeforeInput();
      cursor.pushLeftBeforeRequired();
      cursor.pushLeftBeforeFilled();
      if (direction === DIRECTION.LEFT) {
        cursor.pushRightBeforeInput();
        cursor.pushRightBeforeRequired();
        if (cursor.ok && cursor.pos <= cursorPos) return cursor.pos;
        cursor.popState();
        if (cursor.ok && cursor.pos <= cursorPos) return cursor.pos;
        cursor.popState();
      }
      if (cursor.ok) return cursor.pos;
      if (direction === DIRECTION.FORCE_LEFT) return 0;
      cursor.popState();
      if (cursor.ok) return cursor.pos;
      cursor.popState();
      if (cursor.ok) return cursor.pos;
      return 0;
    }
    if (direction === DIRECTION.RIGHT || direction === DIRECTION.FORCE_RIGHT) {
      cursor.pushRightBeforeInput();
      cursor.pushRightBeforeRequired();
      if (cursor.pushRightBeforeFilled()) return cursor.pos;
      if (direction === DIRECTION.FORCE_RIGHT) return this.displayValue.length;
      cursor.popState();
      if (cursor.ok) return cursor.pos;
      cursor.popState();
      if (cursor.ok) return cursor.pos;
      return this.nearestInputPos(cursorPos, DIRECTION.LEFT);
    }
    return cursorPos;
  }
  totalInputPositions(fromPos, toPos) {
    if (fromPos === void 0) {
      fromPos = 0;
    }
    if (toPos === void 0) {
      toPos = this.displayValue.length;
    }
    let total = 0;
    this._forEachBlocksInRange(fromPos, toPos, (b2, _2, bFromPos, bToPos) => {
      total += b2.totalInputPositions(bFromPos, bToPos);
    });
    return total;
  }
  /** Get block by name */
  maskedBlock(name) {
    return this.maskedBlocks(name)[0];
  }
  /** Get all blocks by name */
  maskedBlocks(name) {
    const indices = this._maskedBlocks[name];
    if (!indices) return [];
    return indices.map((gi) => this._blocks[gi]);
  }
  pad(flags) {
    const details = new ChangeDetails();
    this._forEachBlocksInRange(0, this.displayValue.length, (b2) => details.aggregate(b2.pad(flags)));
    return details;
  }
}
MaskedPattern.DEFAULTS = {
  ...Masked.DEFAULTS,
  lazy: true,
  placeholderChar: "_"
};
MaskedPattern.STOP_CHAR = "`";
MaskedPattern.ESCAPE_CHAR = "\\";
MaskedPattern.InputDefinition = PatternInputDefinition;
MaskedPattern.FixedDefinition = PatternFixedDefinition;
IMask.MaskedPattern = MaskedPattern;
class MaskedRange extends MaskedPattern {
  /**
    Optionally sets max length of pattern.
    Used when pattern length is longer then `to` param length. Pads zeros at start in this case.
  */
  /** Min bound */
  /** Max bound */
  get _matchFrom() {
    return this.maxLength - String(this.from).length;
  }
  constructor(opts) {
    super(opts);
  }
  updateOptions(opts) {
    super.updateOptions(opts);
  }
  _update(opts) {
    const {
      to = this.to || 0,
      from = this.from || 0,
      maxLength = this.maxLength || 0,
      autofix = this.autofix,
      ...patternOpts
    } = opts;
    this.to = to;
    this.from = from;
    this.maxLength = Math.max(String(to).length, maxLength);
    this.autofix = autofix;
    const fromStr = String(this.from).padStart(this.maxLength, "0");
    const toStr = String(this.to).padStart(this.maxLength, "0");
    let sameCharsCount = 0;
    while (sameCharsCount < toStr.length && toStr[sameCharsCount] === fromStr[sameCharsCount]) ++sameCharsCount;
    patternOpts.mask = toStr.slice(0, sameCharsCount).replace(/0/g, "\\0") + "0".repeat(this.maxLength - sameCharsCount);
    super._update(patternOpts);
  }
  get isComplete() {
    return super.isComplete && Boolean(this.value);
  }
  boundaries(str) {
    let minstr = "";
    let maxstr = "";
    const [, placeholder, num] = str.match(/^(\D*)(\d*)(\D*)/) || [];
    if (num) {
      minstr = "0".repeat(placeholder.length) + num;
      maxstr = "9".repeat(placeholder.length) + num;
    }
    minstr = minstr.padEnd(this.maxLength, "0");
    maxstr = maxstr.padEnd(this.maxLength, "9");
    return [minstr, maxstr];
  }
  doPrepareChar(ch, flags) {
    if (flags === void 0) {
      flags = {};
    }
    let details;
    [ch, details] = super.doPrepareChar(ch.replace(/\D/g, ""), flags);
    if (!ch) details.skip = !this.isComplete;
    return [ch, details];
  }
  _appendCharRaw(ch, flags) {
    if (flags === void 0) {
      flags = {};
    }
    if (!this.autofix || this.value.length + 1 > this.maxLength) return super._appendCharRaw(ch, flags);
    const fromStr = String(this.from).padStart(this.maxLength, "0");
    const toStr = String(this.to).padStart(this.maxLength, "0");
    const [minstr, maxstr] = this.boundaries(this.value + ch);
    if (Number(maxstr) < this.from) return super._appendCharRaw(fromStr[this.value.length], flags);
    if (Number(minstr) > this.to) {
      if (!flags.tail && this.autofix === "pad" && this.value.length + 1 < this.maxLength) {
        return super._appendCharRaw(fromStr[this.value.length], flags).aggregate(this._appendCharRaw(ch, flags));
      }
      return super._appendCharRaw(toStr[this.value.length], flags);
    }
    return super._appendCharRaw(ch, flags);
  }
  doValidate(flags) {
    const str = this.value;
    const firstNonZero = str.search(/[^0]/);
    if (firstNonZero === -1 && str.length <= this._matchFrom) return true;
    const [minstr, maxstr] = this.boundaries(str);
    return this.from <= Number(maxstr) && Number(minstr) <= this.to && super.doValidate(flags);
  }
  pad(flags) {
    const details = new ChangeDetails();
    if (this.value.length === this.maxLength) return details;
    const value = this.value;
    const padLength = this.maxLength - this.value.length;
    if (padLength) {
      this.reset();
      for (let i2 = 0; i2 < padLength; ++i2) {
        details.aggregate(super._appendCharRaw("0", flags));
      }
      value.split("").forEach((ch) => this._appendCharRaw(ch));
    }
    return details;
  }
}
IMask.MaskedRange = MaskedRange;
const DefaultPattern = "d{.}`m{.}`Y";
class MaskedDate extends MaskedPattern {
  static extractPatternOptions(opts) {
    const {
      mask,
      pattern,
      ...patternOpts
    } = opts;
    return {
      ...patternOpts,
      mask: isString(mask) ? mask : pattern
    };
  }
  /** Pattern mask for date according to {@link MaskedDate#format} */
  /** Start date */
  /** End date */
  /** Format typed value to string */
  /** Parse string to get typed value */
  constructor(opts) {
    super(MaskedDate.extractPatternOptions({
      ...MaskedDate.DEFAULTS,
      ...opts
    }));
  }
  updateOptions(opts) {
    super.updateOptions(opts);
  }
  _update(opts) {
    const {
      mask,
      pattern,
      blocks,
      ...patternOpts
    } = {
      ...MaskedDate.DEFAULTS,
      ...opts
    };
    const patternBlocks = Object.assign({}, MaskedDate.GET_DEFAULT_BLOCKS());
    if (opts.min) patternBlocks.Y.from = opts.min.getFullYear();
    if (opts.max) patternBlocks.Y.to = opts.max.getFullYear();
    if (opts.min && opts.max && patternBlocks.Y.from === patternBlocks.Y.to) {
      patternBlocks.m.from = opts.min.getMonth() + 1;
      patternBlocks.m.to = opts.max.getMonth() + 1;
      if (patternBlocks.m.from === patternBlocks.m.to) {
        patternBlocks.d.from = opts.min.getDate();
        patternBlocks.d.to = opts.max.getDate();
      }
    }
    Object.assign(patternBlocks, this.blocks, blocks);
    super._update({
      ...patternOpts,
      mask: isString(mask) ? mask : pattern,
      blocks: patternBlocks
    });
  }
  doValidate(flags) {
    const date = this.date;
    return super.doValidate(flags) && (!this.isComplete || this.isDateExist(this.value) && date != null && (this.min == null || this.min <= date) && (this.max == null || date <= this.max));
  }
  /** Checks if date is exists */
  isDateExist(str) {
    return this.format(this.parse(str, this), this).indexOf(str) >= 0;
  }
  /** Parsed Date */
  get date() {
    return this.typedValue;
  }
  set date(date) {
    this.typedValue = date;
  }
  get typedValue() {
    return this.isComplete ? super.typedValue : null;
  }
  set typedValue(value) {
    super.typedValue = value;
  }
  maskEquals(mask) {
    return mask === Date || super.maskEquals(mask);
  }
  optionsIsChanged(opts) {
    return super.optionsIsChanged(MaskedDate.extractPatternOptions(opts));
  }
}
MaskedDate.GET_DEFAULT_BLOCKS = () => ({
  d: {
    mask: MaskedRange,
    from: 1,
    to: 31,
    maxLength: 2
  },
  m: {
    mask: MaskedRange,
    from: 1,
    to: 12,
    maxLength: 2
  },
  Y: {
    mask: MaskedRange,
    from: 1900,
    to: 9999
  }
});
MaskedDate.DEFAULTS = {
  ...MaskedPattern.DEFAULTS,
  mask: Date,
  pattern: DefaultPattern,
  format: (date, masked) => {
    if (!date) return "";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return [day, month, year].join(".");
  },
  parse: (str, masked) => {
    const [day, month, year] = str.split(".").map(Number);
    return new Date(year, month - 1, day);
  }
};
IMask.MaskedDate = MaskedDate;
class MaskedDynamic extends Masked {
  constructor(opts) {
    super({
      ...MaskedDynamic.DEFAULTS,
      ...opts
    });
    this.currentMask = void 0;
  }
  updateOptions(opts) {
    super.updateOptions(opts);
  }
  _update(opts) {
    super._update(opts);
    if ("mask" in opts) {
      this.exposeMask = void 0;
      this.compiledMasks = Array.isArray(opts.mask) ? opts.mask.map((m2) => {
        const {
          expose,
          ...maskOpts
        } = normalizeOpts(m2);
        const masked = createMask({
          overwrite: this._overwrite,
          eager: this._eager,
          skipInvalid: this._skipInvalid,
          ...maskOpts
        });
        if (expose) this.exposeMask = masked;
        return masked;
      }) : [];
    }
  }
  _appendCharRaw(ch, flags) {
    if (flags === void 0) {
      flags = {};
    }
    const details = this._applyDispatch(ch, flags);
    if (this.currentMask) {
      details.aggregate(this.currentMask._appendChar(ch, this.currentMaskFlags(flags)));
    }
    return details;
  }
  _applyDispatch(appended, flags, tail) {
    if (appended === void 0) {
      appended = "";
    }
    if (flags === void 0) {
      flags = {};
    }
    if (tail === void 0) {
      tail = "";
    }
    const prevValueBeforeTail = flags.tail && flags._beforeTailState != null ? flags._beforeTailState._value : this.value;
    const inputValue = this.rawInputValue;
    const insertValue = flags.tail && flags._beforeTailState != null ? flags._beforeTailState._rawInputValue : inputValue;
    const tailValue = inputValue.slice(insertValue.length);
    const prevMask = this.currentMask;
    const details = new ChangeDetails();
    const prevMaskState = prevMask == null ? void 0 : prevMask.state;
    this.currentMask = this.doDispatch(appended, {
      ...flags
    }, tail);
    if (this.currentMask) {
      if (this.currentMask !== prevMask) {
        this.currentMask.reset();
        if (insertValue) {
          this.currentMask.append(insertValue, {
            raw: true
          });
          details.tailShift = this.currentMask.value.length - prevValueBeforeTail.length;
        }
        if (tailValue) {
          details.tailShift += this.currentMask.append(tailValue, {
            raw: true,
            tail: true
          }).tailShift;
        }
      } else if (prevMaskState) {
        this.currentMask.state = prevMaskState;
      }
    }
    return details;
  }
  _appendPlaceholder() {
    const details = this._applyDispatch();
    if (this.currentMask) {
      details.aggregate(this.currentMask._appendPlaceholder());
    }
    return details;
  }
  _appendEager() {
    const details = this._applyDispatch();
    if (this.currentMask) {
      details.aggregate(this.currentMask._appendEager());
    }
    return details;
  }
  appendTail(tail) {
    const details = new ChangeDetails();
    if (tail) details.aggregate(this._applyDispatch("", {}, tail));
    return details.aggregate(this.currentMask ? this.currentMask.appendTail(tail) : super.appendTail(tail));
  }
  currentMaskFlags(flags) {
    var _flags$_beforeTailSta, _flags$_beforeTailSta2;
    return {
      ...flags,
      _beforeTailState: ((_flags$_beforeTailSta = flags._beforeTailState) == null ? void 0 : _flags$_beforeTailSta.currentMaskRef) === this.currentMask && ((_flags$_beforeTailSta2 = flags._beforeTailState) == null ? void 0 : _flags$_beforeTailSta2.currentMask) || flags._beforeTailState
    };
  }
  doDispatch(appended, flags, tail) {
    if (flags === void 0) {
      flags = {};
    }
    if (tail === void 0) {
      tail = "";
    }
    return this.dispatch(appended, this, flags, tail);
  }
  doValidate(flags) {
    return super.doValidate(flags) && (!this.currentMask || this.currentMask.doValidate(this.currentMaskFlags(flags)));
  }
  doPrepare(str, flags) {
    if (flags === void 0) {
      flags = {};
    }
    let [s2, details] = super.doPrepare(str, flags);
    if (this.currentMask) {
      let currentDetails;
      [s2, currentDetails] = super.doPrepare(s2, this.currentMaskFlags(flags));
      details = details.aggregate(currentDetails);
    }
    return [s2, details];
  }
  doPrepareChar(str, flags) {
    if (flags === void 0) {
      flags = {};
    }
    let [s2, details] = super.doPrepareChar(str, flags);
    if (this.currentMask) {
      let currentDetails;
      [s2, currentDetails] = super.doPrepareChar(s2, this.currentMaskFlags(flags));
      details = details.aggregate(currentDetails);
    }
    return [s2, details];
  }
  reset() {
    var _this$currentMask;
    (_this$currentMask = this.currentMask) == null || _this$currentMask.reset();
    this.compiledMasks.forEach((m2) => m2.reset());
  }
  get value() {
    return this.exposeMask ? this.exposeMask.value : this.currentMask ? this.currentMask.value : "";
  }
  set value(value) {
    if (this.exposeMask) {
      this.exposeMask.value = value;
      this.currentMask = this.exposeMask;
      this._applyDispatch();
    } else super.value = value;
  }
  get unmaskedValue() {
    return this.exposeMask ? this.exposeMask.unmaskedValue : this.currentMask ? this.currentMask.unmaskedValue : "";
  }
  set unmaskedValue(unmaskedValue) {
    if (this.exposeMask) {
      this.exposeMask.unmaskedValue = unmaskedValue;
      this.currentMask = this.exposeMask;
      this._applyDispatch();
    } else super.unmaskedValue = unmaskedValue;
  }
  get typedValue() {
    return this.exposeMask ? this.exposeMask.typedValue : this.currentMask ? this.currentMask.typedValue : "";
  }
  set typedValue(typedValue) {
    if (this.exposeMask) {
      this.exposeMask.typedValue = typedValue;
      this.currentMask = this.exposeMask;
      this._applyDispatch();
      return;
    }
    let unmaskedValue = String(typedValue);
    if (this.currentMask) {
      this.currentMask.typedValue = typedValue;
      unmaskedValue = this.currentMask.unmaskedValue;
    }
    this.unmaskedValue = unmaskedValue;
  }
  get displayValue() {
    return this.currentMask ? this.currentMask.displayValue : "";
  }
  get isComplete() {
    var _this$currentMask2;
    return Boolean((_this$currentMask2 = this.currentMask) == null ? void 0 : _this$currentMask2.isComplete);
  }
  get isFilled() {
    var _this$currentMask3;
    return Boolean((_this$currentMask3 = this.currentMask) == null ? void 0 : _this$currentMask3.isFilled);
  }
  remove(fromPos, toPos) {
    const details = new ChangeDetails();
    if (this.currentMask) {
      details.aggregate(this.currentMask.remove(fromPos, toPos)).aggregate(this._applyDispatch());
    }
    return details;
  }
  get state() {
    var _this$currentMask4;
    return {
      ...super.state,
      _rawInputValue: this.rawInputValue,
      compiledMasks: this.compiledMasks.map((m2) => m2.state),
      currentMaskRef: this.currentMask,
      currentMask: (_this$currentMask4 = this.currentMask) == null ? void 0 : _this$currentMask4.state
    };
  }
  set state(state) {
    const {
      compiledMasks,
      currentMaskRef,
      currentMask,
      ...maskedState
    } = state;
    if (compiledMasks) this.compiledMasks.forEach((m2, mi) => m2.state = compiledMasks[mi]);
    if (currentMaskRef != null) {
      this.currentMask = currentMaskRef;
      this.currentMask.state = currentMask;
    }
    super.state = maskedState;
  }
  extractInput(fromPos, toPos, flags) {
    return this.currentMask ? this.currentMask.extractInput(fromPos, toPos, flags) : "";
  }
  extractTail(fromPos, toPos) {
    return this.currentMask ? this.currentMask.extractTail(fromPos, toPos) : super.extractTail(fromPos, toPos);
  }
  doCommit() {
    if (this.currentMask) this.currentMask.doCommit();
    super.doCommit();
  }
  nearestInputPos(cursorPos, direction) {
    return this.currentMask ? this.currentMask.nearestInputPos(cursorPos, direction) : super.nearestInputPos(cursorPos, direction);
  }
  get overwrite() {
    return this.currentMask ? this.currentMask.overwrite : this._overwrite;
  }
  set overwrite(overwrite) {
    this._overwrite = overwrite;
  }
  get eager() {
    return this.currentMask ? this.currentMask.eager : this._eager;
  }
  set eager(eager) {
    this._eager = eager;
  }
  get skipInvalid() {
    return this.currentMask ? this.currentMask.skipInvalid : this._skipInvalid;
  }
  set skipInvalid(skipInvalid) {
    this._skipInvalid = skipInvalid;
  }
  get autofix() {
    return this.currentMask ? this.currentMask.autofix : this._autofix;
  }
  set autofix(autofix) {
    this._autofix = autofix;
  }
  maskEquals(mask) {
    return Array.isArray(mask) ? this.compiledMasks.every((m2, mi) => {
      if (!mask[mi]) return;
      const {
        mask: oldMask,
        ...restOpts
      } = mask[mi];
      return objectIncludes(m2, restOpts) && m2.maskEquals(oldMask);
    }) : super.maskEquals(mask);
  }
  typedValueEquals(value) {
    var _this$currentMask5;
    return Boolean((_this$currentMask5 = this.currentMask) == null ? void 0 : _this$currentMask5.typedValueEquals(value));
  }
}
MaskedDynamic.DEFAULTS = {
  ...Masked.DEFAULTS,
  dispatch: (appended, masked, flags, tail) => {
    if (!masked.compiledMasks.length) return;
    const inputValue = masked.rawInputValue;
    const inputs = masked.compiledMasks.map((m2, index) => {
      const isCurrent = masked.currentMask === m2;
      const startInputPos = isCurrent ? m2.displayValue.length : m2.nearestInputPos(m2.displayValue.length, DIRECTION.FORCE_LEFT);
      if (m2.rawInputValue !== inputValue) {
        m2.reset();
        m2.append(inputValue, {
          raw: true
        });
      } else if (!isCurrent) {
        m2.remove(startInputPos);
      }
      m2.append(appended, masked.currentMaskFlags(flags));
      m2.appendTail(tail);
      return {
        index,
        weight: m2.rawInputValue.length,
        totalInputPositions: m2.totalInputPositions(0, Math.max(startInputPos, m2.nearestInputPos(m2.displayValue.length, DIRECTION.FORCE_LEFT)))
      };
    });
    inputs.sort((i1, i2) => i2.weight - i1.weight || i2.totalInputPositions - i1.totalInputPositions);
    return masked.compiledMasks[inputs[0].index];
  }
};
IMask.MaskedDynamic = MaskedDynamic;
class MaskedEnum extends MaskedPattern {
  constructor(opts) {
    super({
      ...MaskedEnum.DEFAULTS,
      ...opts
    });
  }
  updateOptions(opts) {
    super.updateOptions(opts);
  }
  _update(opts) {
    const {
      enum: enum_,
      ...eopts
    } = opts;
    if (enum_) {
      const lengths = enum_.map((e2) => e2.length);
      const requiredLength = Math.min(...lengths);
      const optionalLength = Math.max(...lengths) - requiredLength;
      eopts.mask = "*".repeat(requiredLength);
      if (optionalLength) eopts.mask += "[" + "*".repeat(optionalLength) + "]";
      this.enum = enum_;
    }
    super._update(eopts);
  }
  _appendCharRaw(ch, flags) {
    if (flags === void 0) {
      flags = {};
    }
    const matchFrom = Math.min(this.nearestInputPos(0, DIRECTION.FORCE_RIGHT), this.value.length);
    const matches = this.enum.filter((e2) => this.matchValue(e2, this.unmaskedValue + ch, matchFrom));
    if (matches.length) {
      if (matches.length === 1) {
        this._forEachBlocksInRange(0, this.value.length, (b2, bi) => {
          const mch = matches[0][bi];
          if (bi >= this.value.length || mch === b2.value) return;
          b2.reset();
          b2._appendChar(mch, flags);
        });
      }
      const d2 = super._appendCharRaw(matches[0][this.value.length], flags);
      if (matches.length === 1) {
        matches[0].slice(this.unmaskedValue.length).split("").forEach((mch) => d2.aggregate(super._appendCharRaw(mch)));
      }
      return d2;
    }
    return new ChangeDetails({
      skip: !this.isComplete
    });
  }
  extractTail(fromPos, toPos) {
    if (fromPos === void 0) {
      fromPos = 0;
    }
    if (toPos === void 0) {
      toPos = this.displayValue.length;
    }
    return new ContinuousTailDetails("", fromPos);
  }
  remove(fromPos, toPos) {
    if (fromPos === void 0) {
      fromPos = 0;
    }
    if (toPos === void 0) {
      toPos = this.displayValue.length;
    }
    if (fromPos === toPos) return new ChangeDetails();
    const matchFrom = Math.min(super.nearestInputPos(0, DIRECTION.FORCE_RIGHT), this.value.length);
    let pos;
    for (pos = fromPos; pos >= 0; --pos) {
      const matches = this.enum.filter((e2) => this.matchValue(e2, this.value.slice(matchFrom, pos), matchFrom));
      if (matches.length > 1) break;
    }
    const details = super.remove(pos, toPos);
    details.tailShift += pos - fromPos;
    return details;
  }
  get isComplete() {
    return this.enum.indexOf(this.value) >= 0;
  }
}
MaskedEnum.DEFAULTS = {
  ...MaskedPattern.DEFAULTS,
  matchValue: (estr, istr, matchFrom) => estr.indexOf(istr, matchFrom) === matchFrom
};
IMask.MaskedEnum = MaskedEnum;
class MaskedFunction extends Masked {
  /** */
  /** Enable characters overwriting */
  /** */
  /** */
  /** */
  updateOptions(opts) {
    super.updateOptions(opts);
  }
  _update(opts) {
    super._update({
      ...opts,
      validate: opts.mask
    });
  }
}
IMask.MaskedFunction = MaskedFunction;
var _MaskedNumber;
class MaskedNumber extends Masked {
  /** Single char */
  /** Single char */
  /** Array of single chars */
  /** */
  /** */
  /** Digits after point */
  /** Flag to remove leading and trailing zeros in the end of editing */
  /** Flag to pad trailing zeros after point in the end of editing */
  /** Enable characters overwriting */
  /** */
  /** */
  /** */
  /** Format typed value to string */
  /** Parse string to get typed value */
  constructor(opts) {
    super({
      ...MaskedNumber.DEFAULTS,
      ...opts
    });
  }
  updateOptions(opts) {
    super.updateOptions(opts);
  }
  _update(opts) {
    super._update(opts);
    this._updateRegExps();
  }
  _updateRegExps() {
    const start = "^" + (this.allowNegative ? "[+|\\-]?" : "");
    const mid = "\\d*";
    const end = (this.scale ? "(" + escapeRegExp(this.radix) + "\\d{0," + this.scale + "})?" : "") + "$";
    this._numberRegExp = new RegExp(start + mid + end);
    this._mapToRadixRegExp = new RegExp("[" + this.mapToRadix.map(escapeRegExp).join("") + "]", "g");
    this._thousandsSeparatorRegExp = new RegExp(escapeRegExp(this.thousandsSeparator), "g");
  }
  _removeThousandsSeparators(value) {
    return value.replace(this._thousandsSeparatorRegExp, "");
  }
  _insertThousandsSeparators(value) {
    const parts = value.split(this.radix);
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, this.thousandsSeparator);
    return parts.join(this.radix);
  }
  doPrepareChar(ch, flags) {
    if (flags === void 0) {
      flags = {};
    }
    const [prepCh, details] = super.doPrepareChar(this._removeThousandsSeparators(this.scale && this.mapToRadix.length && /*
      radix should be mapped when
      1) input is done from keyboard = flags.input && flags.raw
      2) unmasked value is set = !flags.input && !flags.raw
      and should not be mapped when
      1) value is set = flags.input && !flags.raw
      2) raw value is set = !flags.input && flags.raw
    */
    (flags.input && flags.raw || !flags.input && !flags.raw) ? ch.replace(this._mapToRadixRegExp, this.radix) : ch), flags);
    if (ch && !prepCh) details.skip = true;
    if (prepCh && !this.allowPositive && !this.value && prepCh !== "-") details.aggregate(this._appendChar("-"));
    return [prepCh, details];
  }
  _separatorsCount(to, extendOnSeparators) {
    if (extendOnSeparators === void 0) {
      extendOnSeparators = false;
    }
    let count = 0;
    for (let pos = 0; pos < to; ++pos) {
      if (this._value.indexOf(this.thousandsSeparator, pos) === pos) {
        ++count;
        if (extendOnSeparators) to += this.thousandsSeparator.length;
      }
    }
    return count;
  }
  _separatorsCountFromSlice(slice) {
    if (slice === void 0) {
      slice = this._value;
    }
    return this._separatorsCount(this._removeThousandsSeparators(slice).length, true);
  }
  extractInput(fromPos, toPos, flags) {
    if (fromPos === void 0) {
      fromPos = 0;
    }
    if (toPos === void 0) {
      toPos = this.displayValue.length;
    }
    [fromPos, toPos] = this._adjustRangeWithSeparators(fromPos, toPos);
    return this._removeThousandsSeparators(super.extractInput(fromPos, toPos, flags));
  }
  _appendCharRaw(ch, flags) {
    if (flags === void 0) {
      flags = {};
    }
    const prevBeforeTailValue = flags.tail && flags._beforeTailState ? flags._beforeTailState._value : this._value;
    const prevBeforeTailSeparatorsCount = this._separatorsCountFromSlice(prevBeforeTailValue);
    this._value = this._removeThousandsSeparators(this.value);
    const oldValue = this._value;
    this._value += ch;
    const num = this.number;
    let accepted = !isNaN(num);
    let skip = false;
    if (accepted) {
      let fixedNum;
      if (this.min != null && this.min < 0 && this.number < this.min) fixedNum = this.min;
      if (this.max != null && this.max > 0 && this.number > this.max) fixedNum = this.max;
      if (fixedNum != null) {
        if (this.autofix) {
          this._value = this.format(fixedNum, this).replace(MaskedNumber.UNMASKED_RADIX, this.radix);
          skip || (skip = oldValue === this._value && !flags.tail);
        } else {
          accepted = false;
        }
      }
      accepted && (accepted = Boolean(this._value.match(this._numberRegExp)));
    }
    let appendDetails;
    if (!accepted) {
      this._value = oldValue;
      appendDetails = new ChangeDetails();
    } else {
      appendDetails = new ChangeDetails({
        inserted: this._value.slice(oldValue.length),
        rawInserted: skip ? "" : ch,
        skip
      });
    }
    this._value = this._insertThousandsSeparators(this._value);
    const beforeTailValue = flags.tail && flags._beforeTailState ? flags._beforeTailState._value : this._value;
    const beforeTailSeparatorsCount = this._separatorsCountFromSlice(beforeTailValue);
    appendDetails.tailShift += (beforeTailSeparatorsCount - prevBeforeTailSeparatorsCount) * this.thousandsSeparator.length;
    return appendDetails;
  }
  _findSeparatorAround(pos) {
    if (this.thousandsSeparator) {
      const searchFrom = pos - this.thousandsSeparator.length + 1;
      const separatorPos = this.value.indexOf(this.thousandsSeparator, searchFrom);
      if (separatorPos <= pos) return separatorPos;
    }
    return -1;
  }
  _adjustRangeWithSeparators(from, to) {
    const separatorAroundFromPos = this._findSeparatorAround(from);
    if (separatorAroundFromPos >= 0) from = separatorAroundFromPos;
    const separatorAroundToPos = this._findSeparatorAround(to);
    if (separatorAroundToPos >= 0) to = separatorAroundToPos + this.thousandsSeparator.length;
    return [from, to];
  }
  remove(fromPos, toPos) {
    if (fromPos === void 0) {
      fromPos = 0;
    }
    if (toPos === void 0) {
      toPos = this.displayValue.length;
    }
    [fromPos, toPos] = this._adjustRangeWithSeparators(fromPos, toPos);
    const valueBeforePos = this.value.slice(0, fromPos);
    const valueAfterPos = this.value.slice(toPos);
    const prevBeforeTailSeparatorsCount = this._separatorsCount(valueBeforePos.length);
    this._value = this._insertThousandsSeparators(this._removeThousandsSeparators(valueBeforePos + valueAfterPos));
    const beforeTailSeparatorsCount = this._separatorsCountFromSlice(valueBeforePos);
    return new ChangeDetails({
      tailShift: (beforeTailSeparatorsCount - prevBeforeTailSeparatorsCount) * this.thousandsSeparator.length
    });
  }
  nearestInputPos(cursorPos, direction) {
    if (!this.thousandsSeparator) return cursorPos;
    switch (direction) {
      case DIRECTION.NONE:
      case DIRECTION.LEFT:
      case DIRECTION.FORCE_LEFT: {
        const separatorAtLeftPos = this._findSeparatorAround(cursorPos - 1);
        if (separatorAtLeftPos >= 0) {
          const separatorAtLeftEndPos = separatorAtLeftPos + this.thousandsSeparator.length;
          if (cursorPos < separatorAtLeftEndPos || this.value.length <= separatorAtLeftEndPos || direction === DIRECTION.FORCE_LEFT) {
            return separatorAtLeftPos;
          }
        }
        break;
      }
      case DIRECTION.RIGHT:
      case DIRECTION.FORCE_RIGHT: {
        const separatorAtRightPos = this._findSeparatorAround(cursorPos);
        if (separatorAtRightPos >= 0) {
          return separatorAtRightPos + this.thousandsSeparator.length;
        }
      }
    }
    return cursorPos;
  }
  doCommit() {
    if (this.value) {
      const number = this.number;
      let validnum = number;
      if (this.min != null) validnum = Math.max(validnum, this.min);
      if (this.max != null) validnum = Math.min(validnum, this.max);
      if (validnum !== number) this.unmaskedValue = this.format(validnum, this);
      let formatted = this.value;
      if (this.normalizeZeros) formatted = this._normalizeZeros(formatted);
      if (this.padFractionalZeros && this.scale > 0) formatted = this._padFractionalZeros(formatted);
      this._value = formatted;
    }
    super.doCommit();
  }
  _normalizeZeros(value) {
    const parts = this._removeThousandsSeparators(value).split(this.radix);
    parts[0] = parts[0].replace(/^(\D*)(0*)(\d*)/, (match, sign, zeros, num) => sign + num);
    if (value.length && !/\d$/.test(parts[0])) parts[0] = parts[0] + "0";
    if (parts.length > 1) {
      parts[1] = parts[1].replace(/0*$/, "");
      if (!parts[1].length) parts.length = 1;
    }
    return this._insertThousandsSeparators(parts.join(this.radix));
  }
  _padFractionalZeros(value) {
    if (!value) return value;
    const parts = value.split(this.radix);
    if (parts.length < 2) parts.push("");
    parts[1] = parts[1].padEnd(this.scale, "0");
    return parts.join(this.radix);
  }
  doSkipInvalid(ch, flags, checkTail) {
    if (flags === void 0) {
      flags = {};
    }
    const dropFractional = this.scale === 0 && ch !== this.thousandsSeparator && (ch === this.radix || ch === MaskedNumber.UNMASKED_RADIX || this.mapToRadix.includes(ch));
    return super.doSkipInvalid(ch, flags, checkTail) && !dropFractional;
  }
  get unmaskedValue() {
    return this._removeThousandsSeparators(this._normalizeZeros(this.value)).replace(this.radix, MaskedNumber.UNMASKED_RADIX);
  }
  set unmaskedValue(unmaskedValue) {
    super.unmaskedValue = unmaskedValue;
  }
  get typedValue() {
    return this.parse(this.unmaskedValue, this);
  }
  set typedValue(n2) {
    this.rawInputValue = this.format(n2, this).replace(MaskedNumber.UNMASKED_RADIX, this.radix);
  }
  /** Parsed Number */
  get number() {
    return this.typedValue;
  }
  set number(number) {
    this.typedValue = number;
  }
  get allowNegative() {
    return this.min != null && this.min < 0 || this.max != null && this.max < 0;
  }
  get allowPositive() {
    return this.min != null && this.min > 0 || this.max != null && this.max > 0;
  }
  typedValueEquals(value) {
    return (super.typedValueEquals(value) || MaskedNumber.EMPTY_VALUES.includes(value) && MaskedNumber.EMPTY_VALUES.includes(this.typedValue)) && !(value === 0 && this.value === "");
  }
}
_MaskedNumber = MaskedNumber;
MaskedNumber.UNMASKED_RADIX = ".";
MaskedNumber.EMPTY_VALUES = [...Masked.EMPTY_VALUES, 0];
MaskedNumber.DEFAULTS = {
  ...Masked.DEFAULTS,
  mask: Number,
  radix: ",",
  thousandsSeparator: "",
  mapToRadix: [_MaskedNumber.UNMASKED_RADIX],
  min: Number.MIN_SAFE_INTEGER,
  max: Number.MAX_SAFE_INTEGER,
  scale: 2,
  normalizeZeros: true,
  padFractionalZeros: false,
  parse: Number,
  format: (n2) => n2.toLocaleString("en-US", {
    useGrouping: false,
    maximumFractionDigits: 20
  })
};
IMask.MaskedNumber = MaskedNumber;
const PIPE_TYPE = {
  MASKED: "value",
  UNMASKED: "unmaskedValue",
  TYPED: "typedValue"
};
function createPipe(arg, from, to) {
  if (from === void 0) {
    from = PIPE_TYPE.MASKED;
  }
  if (to === void 0) {
    to = PIPE_TYPE.MASKED;
  }
  const masked = createMask(arg);
  return (value) => masked.runIsolated((m2) => {
    m2[from] = value;
    return m2[to];
  });
}
function pipe(value, mask, from, to) {
  return createPipe(mask, from, to)(value);
}
IMask.PIPE_TYPE = PIPE_TYPE;
IMask.createPipe = createPipe;
IMask.pipe = pipe;
class RepeatBlock extends MaskedPattern {
  get repeatFrom() {
    var _ref;
    return (_ref = Array.isArray(this.repeat) ? this.repeat[0] : this.repeat === Infinity ? 0 : this.repeat) != null ? _ref : 0;
  }
  get repeatTo() {
    var _ref2;
    return (_ref2 = Array.isArray(this.repeat) ? this.repeat[1] : this.repeat) != null ? _ref2 : Infinity;
  }
  constructor(opts) {
    super(opts);
  }
  updateOptions(opts) {
    super.updateOptions(opts);
  }
  _update(opts) {
    var _ref3, _ref4, _this$_blocks;
    const {
      repeat,
      ...blockOpts
    } = normalizeOpts(opts);
    this._blockOpts = Object.assign({}, this._blockOpts, blockOpts);
    const block = createMask(this._blockOpts);
    this.repeat = (_ref3 = (_ref4 = repeat != null ? repeat : block.repeat) != null ? _ref4 : this.repeat) != null ? _ref3 : Infinity;
    super._update({
      mask: "m".repeat(Math.max(this.repeatTo === Infinity && ((_this$_blocks = this._blocks) == null ? void 0 : _this$_blocks.length) || 0, this.repeatFrom)),
      blocks: {
        m: block
      },
      eager: block.eager,
      overwrite: block.overwrite,
      skipInvalid: block.skipInvalid,
      lazy: block.lazy,
      placeholderChar: block.placeholderChar,
      displayChar: block.displayChar
    });
  }
  _allocateBlock(bi) {
    if (bi < this._blocks.length) return this._blocks[bi];
    if (this.repeatTo === Infinity || this._blocks.length < this.repeatTo) {
      this._blocks.push(createMask(this._blockOpts));
      this.mask += "m";
      return this._blocks[this._blocks.length - 1];
    }
  }
  _appendCharRaw(ch, flags) {
    if (flags === void 0) {
      flags = {};
    }
    const details = new ChangeDetails();
    for (
      let bi = (_this$_mapPosToBlock$ = (_this$_mapPosToBlock = this._mapPosToBlock(this.displayValue.length)) == null ? void 0 : _this$_mapPosToBlock.index) != null ? _this$_mapPosToBlock$ : Math.max(this._blocks.length - 1, 0), block, allocated;
      // try to get a block or
      // try to allocate a new block if not allocated already
      block = (_this$_blocks$bi = this._blocks[bi]) != null ? _this$_blocks$bi : allocated = !allocated && this._allocateBlock(bi);
      ++bi
    ) {
      var _this$_mapPosToBlock$, _this$_mapPosToBlock, _this$_blocks$bi, _flags$_beforeTailSta;
      const blockDetails = block._appendChar(ch, {
        ...flags,
        _beforeTailState: (_flags$_beforeTailSta = flags._beforeTailState) == null || (_flags$_beforeTailSta = _flags$_beforeTailSta._blocks) == null ? void 0 : _flags$_beforeTailSta[bi]
      });
      if (blockDetails.skip && allocated) {
        this._blocks.pop();
        this.mask = this.mask.slice(1);
        break;
      }
      details.aggregate(blockDetails);
      if (blockDetails.consumed) break;
    }
    return details;
  }
  _trimEmptyTail(fromPos, toPos) {
    var _this$_mapPosToBlock2, _this$_mapPosToBlock3;
    if (fromPos === void 0) {
      fromPos = 0;
    }
    const firstBlockIndex = Math.max(((_this$_mapPosToBlock2 = this._mapPosToBlock(fromPos)) == null ? void 0 : _this$_mapPosToBlock2.index) || 0, this.repeatFrom, 0);
    let lastBlockIndex;
    if (toPos != null) lastBlockIndex = (_this$_mapPosToBlock3 = this._mapPosToBlock(toPos)) == null ? void 0 : _this$_mapPosToBlock3.index;
    if (lastBlockIndex == null) lastBlockIndex = this._blocks.length - 1;
    let removeCount = 0;
    for (let blockIndex = lastBlockIndex; firstBlockIndex <= blockIndex; --blockIndex, ++removeCount) {
      if (this._blocks[blockIndex].unmaskedValue) break;
    }
    if (removeCount) {
      this._blocks.splice(lastBlockIndex - removeCount + 1, removeCount);
      this.mask = this.mask.slice(removeCount);
    }
  }
  reset() {
    super.reset();
    this._trimEmptyTail();
  }
  remove(fromPos, toPos) {
    if (fromPos === void 0) {
      fromPos = 0;
    }
    if (toPos === void 0) {
      toPos = this.displayValue.length;
    }
    const removeDetails = super.remove(fromPos, toPos);
    this._trimEmptyTail(fromPos, toPos);
    return removeDetails;
  }
  totalInputPositions(fromPos, toPos) {
    if (fromPos === void 0) {
      fromPos = 0;
    }
    if (toPos == null && this.repeatTo === Infinity) return Infinity;
    return super.totalInputPositions(fromPos, toPos);
  }
  get state() {
    return super.state;
  }
  set state(state) {
    this._blocks.length = state._blocks.length;
    this.mask = this.mask.slice(0, this._blocks.length);
    super.state = state;
  }
}
IMask.RepeatBlock = RepeatBlock;
try {
  globalThis.IMask = IMask;
} catch {
}
const imask = () => {
  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll('input[type="tel"]').forEach((input) => {
      const mask = IMask(input, {
        //mask: /^\+?\d{0,15}$/,
        mask: "+{375} (00) 000-00-00",
        //{ mask: '+000 (00) 000-00-00' }
        lazy: true,
        // изначально скрыта
        placeholderChar: "_"
      });
      input.addEventListener("focus", () => {
        mask.updateOptions({ lazy: false });
        mask.value = mask.value;
      });
      input.addEventListener("blur", () => {
        if (!mask.unmaskedValue) {
          mask.updateOptions({ lazy: true });
          mask.value = "";
        }
      });
    });
  });
};
function fileBtn(placeholderText = "Файл не выбран") {
  document.querySelectorAll(".form-file").forEach((input) => {
    let fileText = input.parentElement.querySelector(".file-label__text");
    if (!fileText) {
      fileText = document.createElement("div");
      fileText.className = "file-text";
      fileText.innerHTML = input.closest(".file-label").querySelector(".file-label__text")?.innerHTML || placeholderText;
      input.parentElement.appendChild(fileText);
    }
    input.addEventListener("change", (e2) => {
      const fileName = e2.target.files[0]?.name || placeholderText || "Файл не выбран";
      fileText.innerHTML = fileName;
    });
  });
}
class Spoiler {
  constructor(selector, options) {
    let defaultOptions = {
      onlyOneOpen: false,
      speed: 300,
      fixSpoilerHeightOnResize: true,
      media: false,
      titleSelector: "[data-spoiler-title]",
      contentSelector: "[data-spoiler-content]",
      buttonClass: "spoiler-button-title",
      activeClass: "spoiler-active",
      createdClass: "spoiler-created",
      createButton: true,
      resetButtonStylesClass: "spoiler-styles",
      resetButtonStyles: `
				display: block;
				width: 100%;
				font: inherit;
				color: inherit;
				cursor: pointer;
				background: transparent;
				border: unset;
				padding: unset;
				margin: unset;
			`,
      create: () => {
      },
      open: () => {
      },
      close: () => {
      },
      remove: () => {
      }
    };
    this.selector = selector || "[data-spoiler]";
    this.allSpoilers = document.querySelectorAll(this.selector);
    this.options = Object.assign(defaultOptions, options);
    this.matchMedia = window.matchMedia(`(${this.options.media})`);
    this.isCreated = false;
    this.resizeObservers = /* @__PURE__ */ new Map();
    this.event();
  }
  // НОВЫЙ МЕТОД: Настройка наблюдателя за изменением размеров
  setupResizeObserver(spoiler) {
    const content = spoiler.querySelector(this.options.contentSelector || "[data-spoiler-content]") || spoiler.children[1];
    if (!content) return;
    const observer = new ResizeObserver(() => {
      if (spoiler.classList.contains(this.options.activeClass)) {
        const currentHeight = content.scrollHeight;
        if (currentHeight > 0) {
          content.style.maxHeight = `${currentHeight}px`;
        }
      }
    });
    observer.observe(spoiler);
    this.resizeObservers.set(spoiler, observer);
  }
  createButton(spoiler) {
    const title = spoiler.querySelector(this.options.titleSelector || "[data-spoiler-title]") || spoiler.children[0];
    if (title.tagName.toLowerCase() !== "button") {
      const button = document.createElement("button");
      button.classList.add(this.options.buttonClass);
      button.setAttribute("role", "button");
      if (title.hasAttribute("data-spoiler-title")) {
        button.setAttribute("data-spoiler-title", "");
        title.removeAttribute("data-spoiler-title");
      }
      spoiler.insertAdjacentElement("afterbegin", button);
      button.insertAdjacentElement("afterbegin", title);
    }
  }
  removeButton(spoiler) {
    const button = spoiler.querySelector(`.${this.options.buttonClass}`);
    if (button) {
      const title = button.children[0];
      if (button.hasAttribute("data-spoiler-title")) {
        title.setAttribute("data-spoiler-title", "");
        button.removeAttribute("data-spoiler-title");
      }
      spoiler.insertAdjacentElement("afterbegin", title);
      button.remove();
    }
  }
  resetButtonStyles() {
    if (this.options.resetButtonStyles && this.options.createButton) {
      if (!document.querySelector(`.${this.options.resetButtonStylesClass}`)) {
        const style = document.createElement("style");
        style.classList.add(this.options.resetButtonStylesClass);
        style.innerHTML = `.${this.options.buttonClass}{${this.options.resetButtonStyles}}`.trim().replaceAll("	", "").replaceAll("\n", "");
        document.head.insertAdjacentElement("afterbegin", style);
      }
    }
  }
  returnToInitial(spoiler) {
    const title = spoiler.querySelector(this.options.titleSelector || "[data-spoiler-title]") || spoiler.children[0];
    const content = spoiler.querySelector(this.options.contentSelector || "[data-spoiler-content]") || spoiler.children[1];
    spoiler.classList.remove(this.options.activeClass);
    title.removeAttribute("aria-expanded");
    content.removeAttribute("aria-hidden");
    content.style.cssText = `max-height: 100%; opacity: 1; visibility: visible; will-change: max-height; transition: all var(--spoiler-animation-time, 0.3s);`;
  }
  openSpoiler(spoiler) {
    const title = spoiler.querySelector(this.options.titleSelector || "[data-spoiler-title]") || spoiler.children[0];
    const content = spoiler.querySelector(this.options.contentSelector || "[data-spoiler-content]") || spoiler.children[1];
    const contentHeight = content.scrollHeight;
    spoiler.classList.add(this.options.activeClass);
    title.setAttribute("aria-expanded", true);
    content.setAttribute("aria-hidden", false);
    content.style.cssText = `max-height: ${contentHeight}px; opacity: 1; visibility: visible; will-change: max-height; transition: all var(--spoiler-animation-time, 0.3s);`;
  }
  closeSpoiler(spoiler) {
    const title = spoiler.querySelector(this.options.titleSelector || "[data-spoiler-title]") || spoiler.children[0];
    const content = spoiler.querySelector(this.options.contentSelector || "[data-spoiler-content]") || spoiler.children[1];
    spoiler.classList.remove(this.options.activeClass);
    title.setAttribute("aria-expanded", false);
    content.setAttribute("aria-hidden", true);
    content.style.cssText = `max-height: 0px; opacity: 0; visibility: hidden; will-change: max-height; transition: all var(--spoiler-animation-time, 0.3s);`;
  }
  clickHandler(spoiler) {
    if (this.options.onlyOneOpen) {
      this.allSpoilers.forEach((s2) => this.closeSpoiler(s2));
    }
    if (spoiler.classList.contains(this.options.activeClass)) {
      this.options.close(this);
      this.closeSpoiler(spoiler);
    } else {
      this.options.open(this);
      this.openSpoiler(spoiler);
    }
  }
  createSpoiler() {
    if (!this.isCreated) {
      this.options.create(this);
    }
    this.allSpoilers.forEach((spoiler) => {
      spoiler.classList.add(this.options.createdClass);
      spoiler.style.cssText += `--spoiler-animation-time: ${this.options.speed / 1e3}s;`;
      if (this.options.createButton) {
        this.createButton(spoiler);
      }
      let isActive = spoiler.getAttribute("data-spoiler") === "active" || spoiler.classList.contains(this.options.activeClass);
      if (isActive) {
        this.openSpoiler(spoiler);
      } else {
        this.closeSpoiler(spoiler);
      }
      this.setupResizeObserver(spoiler);
      const title = spoiler.querySelector(this.options.titleSelector || "[data-spoiler-title]") || spoiler.children[0];
      if (!this.isCreated) {
        title.addEventListener("click", () => this.clickHandler(spoiler));
      }
    });
  }
  removeSpoiler() {
    if (this.isCreated) {
      this.options.remove(this);
    }
    this.allSpoilers.forEach((spoiler) => {
      spoiler.classList.remove(this.options.createdClass);
      if (this.options.createButton) {
        this.removeButton(spoiler);
      }
      this.returnToInitial(spoiler);
      const title = spoiler.querySelector(this.options.titleSelector || "[data-spoiler-title]") || spoiler.children[0];
      title.removeEventListener("click", () => this.clickHandler(spoiler));
      const observer = this.resizeObservers.get(spoiler);
      if (observer) {
        observer.disconnect();
        this.resizeObservers.delete(spoiler);
      }
    });
  }
  mediaHandler() {
    if (this.matchMedia.matches) {
      this.createSpoiler();
      this.isCreated = true;
    } else {
      this.removeSpoiler();
      this.isCreated = false;
    }
  }
  fixOpenSpoilerHeight() {
    this.allSpoilers.forEach((spoiler) => {
      if (spoiler.classList.contains(this.options.activeClass)) {
        const content = spoiler.querySelector(this.options.contentSelector || "[data-spoiler-content]") || spoiler.children[1];
        const contentHeight = content.scrollHeight;
        content.style.cssText = `max-height: ${contentHeight}px; opacity: 1; visibility: visible; will-change: max-height; transition: all var(--spoiler-animation-time, 0.3s);`;
      }
    });
  }
  event() {
    if (this.allSpoilers.length) {
      if (this.options.fixSpoilerHeightOnResize) {
        window.addEventListener("load", () => this.fixOpenSpoilerHeight());
        window.addEventListener("resize", () => this.fixOpenSpoilerHeight());
      }
      if (this.options.resetButtonStyles) {
        this.resetButtonStyles();
      }
      if (this.options.media) {
        this.mediaHandler();
        window.addEventListener("resize", () => {
          if (this.options.media) {
            this.mediaHandler();
          }
        });
      } else {
        this.createSpoiler();
      }
    } else {
      console.warn(`${this.selector} is not found!`);
    }
  }
}
class ScrollToTop {
  constructor(selector, options) {
    const defaultOptions = {
      activeClass: "active",
      scrollThreshold: 200
      // Порог, после которого появляется кнопка
    };
    this.options = Object.assign(defaultOptions, options);
    this.selector = selector || ".scroll-to-top";
    this.btn = document.querySelector(this.selector);
    this.init();
  }
  toggleButton(btn) {
    if (window.scrollY > this.options.scrollThreshold) {
      btn.classList.add(this.options.activeClass);
    } else {
      btn.classList.remove(this.options.activeClass);
    }
  }
  init() {
    if (!this.btn) return;
    this.btn.addEventListener("click", (e2) => {
      e2.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    window.addEventListener("scroll", () => this.toggleButton(this.btn));
  }
}
class MXSwiper {
  constructor(selector, paramsAttr) {
    this.swipers = document.querySelectorAll(selector || "[data-swiper]");
    this.paramsAttr = paramsAttr || "data-swiper";
    this.init();
  }
  init() {
    if (!this.swipers.length) return;
    this.swipers.forEach((swiper, index) => {
      let params = {};
      const attrValue = swiper.getAttribute(this.paramsAttr);
      if (attrValue) {
        try {
          params = JSON.parse(attrValue.replace(/'/g, '"'));
        } catch (e2) {
          console.error("Ошибка парсинга JSON в атрибуте data-swiper:", e2, attrValue);
        }
      }
      const btnsPrev = [...document.querySelectorAll("[data-swiper-btn-prev]")].filter((btn) => {
        const selector = btn.dataset.swiperBtnPrev;
        return selector && swiper.matches(selector);
      });
      const btnsNext = [...document.querySelectorAll("[data-swiper-btn-next]")].filter((btn) => {
        const selector = btn.dataset.swiperBtnNext;
        return selector && swiper.matches(selector);
      });
      const paginations = [...document.querySelectorAll("[data-swiper-pagination]")].filter((el) => {
        const selector = el.dataset.swiperPagination;
        return selector && swiper.matches(selector);
      });
      const scrollbars = [...document.querySelectorAll("[data-swiper-scrollbar]")].filter((el) => {
        const selector = el.dataset.swiperScrollbar;
        return selector && swiper.matches(selector);
      });
      if (btnsPrev.length > 0 || btnsNext.length > 0) {
        params.navigation = params.navigation || {};
        if (btnsPrev.length > 0) {
          params.navigation.prevEl = btnsPrev.length === 1 ? btnsPrev[0] : btnsPrev;
        }
        if (btnsNext.length > 0) {
          params.navigation.nextEl = btnsNext.length === 1 ? btnsNext[0] : btnsNext;
        }
      }
      if (paginations.length > 0) {
        params.pagination = params.pagination || {};
        params.pagination.clickable = true;
        if (paginations.length === 1) {
          params.pagination.el = paginations[0];
        } else {
          const uniqueClass = `mx-swiper-pag-${index}-${Date.now()}`;
          paginations.forEach((el) => el.classList.add(uniqueClass));
          params.pagination.el = `.${uniqueClass}`;
        }
      }
      if (scrollbars.length > 0) {
        params.scrollbar = params.scrollbar || {};
        params.scrollbar.draggable = true;
        if (scrollbars.length === 1) {
          params.scrollbar.el = scrollbars[0];
        } else {
          const uniqueClass = `mx-swiper-sb-${index}-${Date.now()}`;
          scrollbars.forEach((el) => el.classList.add(uniqueClass));
          params.scrollbar.el = `.${uniqueClass}`;
        }
      }
      new Swiper(swiper, params);
    });
  }
}
class CustomSelect {
  constructor(options) {
    const defaultOptions = {
      selector: "[data-custom-select]",
      forceSend: false,
      className: {
        wrapper: "custom-select",
        list: "custom-select__list",
        selectField: "custom-select__select-field",
        item: "custom-select__item",
        btn: "custom-select__btn",
        hidden: "custom-select-hidden",
        active: "custom-select-active",
        listUp: "list--up"
      }
    };
    this.options = Object.assign(defaultOptions, options);
    this.selects = document.querySelectorAll(this.options.selector);
    this.init();
  }
  changeMarkup(select) {
    const parent = select.parentElement;
    const sibling = select.nextElementSibling;
    const children = Array.from(select.children);
    const wrapper = document.createElement("div");
    const list = document.createElement("ul");
    wrapper.classList.add(this.options.className.wrapper);
    list.classList.add(this.options.className.list);
    wrapper.appendChild(list);
    children.forEach((option, i2) => {
      const text = option.innerHTML;
      const isSelected = option.hasAttribute("selected");
      if (isSelected || !isSelected && !Array.from(children).some((c2) => c2.hasAttribute("selected")) && i2 === 0) {
        wrapper.insertAdjacentHTML(
          "afterbegin",
          `<button class="${this.options.className.selectField}" data-select-option="${i2}" type="button">${text}</button>`
        );
      }
      list.insertAdjacentHTML(
        "beforeend",
        `<li class="${this.options.className.item}">
					<button class="${this.options.className.btn} ${isSelected ? "active" : ""}" type="button" data-select-option="${i2}">${text}</button>
				</li>`
      );
    });
    if (sibling) {
      sibling.insertAdjacentElement("beforebegin", wrapper);
    } else {
      parent.insertAdjacentElement("beforeend", wrapper);
    }
    select.classList.add(this.options.className.hidden);
  }
  customSelectHandler() {
    document.addEventListener("click", (e2) => {
      const { className } = this.options;
      if (e2.target.closest(`.${className.btn}`)) {
        const btn = e2.target.closest(`.${className.btn}`);
        const index = Number(btn.dataset.selectOption);
        const parentWrapper = btn.closest(`.${className.wrapper}`);
        const select = parentWrapper.previousElementSibling;
        const selectField = parentWrapper.querySelector(`.${className.selectField}`);
        const customOptions = parentWrapper.querySelectorAll(`.${className.btn}`);
        Array.from(select.children).forEach((opt) => opt.selected = false);
        select.children[index].selected = true;
        customOptions.forEach((b2) => b2.classList.remove(className.active));
        customOptions[index].classList.add(className.active);
        selectField.innerHTML = customOptions[index].innerHTML;
        parentWrapper.classList.remove(className.active);
        if (this.options.forceSend) {
          select.dispatchEvent(new Event("change", { bubbles: true }));
        }
      }
      if (e2.target.closest(`.${className.selectField}`)) {
        e2.preventDefault();
        const parentWrapper = e2.target.closest(`.${className.wrapper}`);
        parentWrapper.classList.toggle(className.active);
      }
      if (!e2.target.closest(`.${className.wrapper}`)) {
        document.querySelector(`.${className.wrapper}`).classList.remove(className.active);
      }
    });
  }
  init() {
    if (!this.selects.length) return;
    this.selects.forEach((select) => {
      this.changeMarkup(select);
    });
    this.customSelectHandler();
  }
}
new AutoCalc();
new Menu({
  btn: ".burger-btn",
  //.burger-btn-icon
  menu: ".header-menu",
  activeClass: "open-header-menu",
  closeBtns: ["a", ".cart-btn"]
});
new Menu({
  btn: ".phone-btn",
  //.burger-btn-icon
  menu: ".header-phone-box",
  activeClass: "open-phone-box",
  closeBtns: [".burger-btn"]
});
new Modal();
imask();
N.bind("[data-fancybox]", {
  placeFocusBack: false
});
new ScrollToTop();
new Spoiler();
new MXSwiper();
new CustomSelect({
  selector: "select",
  forceSend: true
});
fileBtn();
document.addEventListener("DOMContentLoaded", () => {
  const cartCounter = document.querySelector("[data-cart-counter]");
  const cartBtn = document.querySelector(".header__cart");
  if (!cartBtn) return;
  const updateCartCounter = () => {
    fetch("/?wc-ajax=get_refreshed_fragments", {
      method: "GET",
      headers: {
        "X-Requested-With": "XMLHttpRequest"
      }
    }).then((response) => response.json()).then((data) => {
      if (data && data.cart_hash && data.fragments) {
        const cartCount = parseInt(data.cart_hash.split("-")[1]) || 0;
        if (cartCount > 0) {
          if (!cartCounter) {
            const counter = document.createElement("span");
            counter.className = "cart-btn__counter";
            counter.setAttribute("data-cart-counter", "");
            counter.textContent = cartCount;
            cartBtn.appendChild(counter);
          } else {
            cartCounter.textContent = cartCount;
          }
        } else if (cartCounter) {
          cartCounter.remove();
        }
      }
    }).catch((error) => console.error("Cart counter error:", error));
  };
  document.body.addEventListener("added_to_cart", updateCartCounter);
  document.body.addEventListener("removed_from_cart", updateCartCounter);
  document.body.addEventListener("wc_fragments_refreshed", updateCartCounter);
  document.body.addEventListener("change", (e2) => {
    if (e2.target.classList.contains("qty")) {
      setTimeout(updateCartCounter, 500);
    }
  });
});
document.addEventListener("DOMContentLoaded", () => {
  const catalogBtn = document.querySelector(".header__catalog-btn");
  const catalogMenu = document.querySelector(".header-catalog");
  const overlay = document.querySelector(".catalog-overlay") || createOverlay();
  const backBtn = catalogMenu?.querySelector(".catalog-back-btn");
  const levelsContainer = catalogMenu?.querySelector(".header-catalog__levels");
  let currentLevel = 0;
  if (!catalogBtn || !catalogMenu) return;
  function createOverlay() {
    const el = document.createElement("div");
    el.className = "catalog-overlay";
    document.body.appendChild(el);
    return el;
  }
  const toggleCatalog = (isOpen) => {
    if (isOpen) {
      catalogMenu.classList.add("is-active");
      overlay.classList.add("is-active");
      document.body.style.overflow = "hidden";
      catalogBtn.setAttribute("aria-expanded", "true");
      resetToMainLevel();
    } else {
      catalogMenu.classList.remove("is-active");
      overlay.classList.remove("is-active");
      document.body.style.overflow = "";
      catalogBtn.setAttribute("aria-expanded", "false");
    }
  };
  catalogBtn.addEventListener("click", () => {
    const isOpen = catalogMenu.classList.contains("is-active");
    toggleCatalog(!isOpen);
  });
  overlay.addEventListener("click", () => toggleCatalog(false));
  if (backBtn) backBtn.addEventListener("click", goBack);
  document.addEventListener("keydown", (e2) => {
    if (e2.key === "Escape" && catalogMenu.classList.contains("is-active")) {
      if (currentLevel > 0) goBack();
      else toggleCatalog(false);
    }
  });
  function resetToMainLevel() {
    document.querySelectorAll(".header-catalog__level").forEach((level, index) => {
      if (index === 0) {
        level.classList.add("is-active");
        level.classList.remove("is-prev");
      } else {
        level.classList.remove("is-active", "is-prev");
        level.remove();
      }
    });
    currentLevel = 0;
    updateHeader();
  }
  function updateHeader() {
    if (currentLevel > 0) {
      backBtn.style.display = "inline-flex";
    } else {
      backBtn.style.display = "none";
    }
  }
  function goBack() {
    if (currentLevel === 0) return;
    const currentLevelEl = document.querySelector(
      `.header-catalog__level--${currentLevel}`
    );
    const prevLevelEl = document.querySelector(
      `.header-catalog__level--${currentLevel - 1}`
    );
    if (currentLevelEl) {
      currentLevelEl.classList.remove("is-active");
      currentLevelEl.classList.add("is-prev");
      setTimeout(() => currentLevelEl.remove(), 300);
    }
    if (prevLevelEl) {
      prevLevelEl.classList.remove("is-prev");
      prevLevelEl.classList.add("is-active");
    }
    currentLevel--;
    updateHeader();
  }
  function addArrowAndListener(item) {
    const link = item.querySelector("a");
    if (!link) return;
    if (link.querySelector(".header-catalog__arrow")) return;
    const arrow = document.createElement("button");
    arrow.className = "header-catalog__arrow";
    arrow.type = "button";
    arrow.setAttribute("aria-label", "Открыть подкатегорию");
    arrow.innerHTML = `
			<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
			</svg>
		`;
    link.appendChild(arrow);
    arrow.addEventListener("click", (e2) => {
      e2.preventDefault();
      e2.stopPropagation();
      const levelEl = item.closest(".header-catalog__level");
      if (levelEl && levelEl.classList.contains("header-catalog__level--0")) {
        openSubMenu(item);
      } else if (levelEl) {
        openSubMenuFromLevel(item, levelEl);
      }
    });
  }
  function initMenu() {
    const mainList = catalogMenu.querySelector(".header-catalog__list");
    if (!mainList) return;
    const itemsWithChildren = mainList.querySelectorAll(
      ".menu-item-has-children"
    );
    itemsWithChildren.forEach((item) => addArrowAndListener(item));
  }
  function initSubMenuLevel(levelEl) {
    const itemsWithChildren = levelEl.querySelectorAll(
      ".menu-item-has-children"
    );
    itemsWithChildren.forEach((item) => addArrowAndListener(item));
  }
  function openSubMenu(parentItem) {
    const subMenu = parentItem.querySelector(".sub-menu");
    if (!subMenu) return;
    const newLevel = document.createElement("div");
    newLevel.className = "header-catalog__level header-catalog__level--" + (currentLevel + 1);
    const newList = subMenu.cloneNode(true);
    newList.classList.remove("sub-menu");
    newList.classList.add("header-catalog__list");
    const oldArrows = newList.querySelectorAll(".header-catalog__arrow");
    oldArrows.forEach((arrow) => arrow.remove());
    newLevel.appendChild(newList);
    levelsContainer.appendChild(newLevel);
    const currentLevelEl = document.querySelector(
      `.header-catalog__level--${currentLevel}`
    );
    if (currentLevelEl) {
      currentLevelEl.classList.remove("is-active");
      currentLevelEl.classList.add("is-prev");
    }
    setTimeout(() => newLevel.classList.add("is-active"), 50);
    currentLevel++;
    updateHeader();
    initSubMenuLevel(newLevel);
  }
  function openSubMenuFromLevel(parentItem, currentLevelEl) {
    const subMenu = parentItem.querySelector(".sub-menu");
    if (!subMenu) return;
    const newLevel = document.createElement("div");
    newLevel.className = "header-catalog__level header-catalog__level--" + (currentLevel + 1);
    const newList = subMenu.cloneNode(true);
    newList.classList.remove("sub-menu");
    newList.classList.add("header-catalog__list");
    const oldArrows = newList.querySelectorAll(".header-catalog__arrow");
    oldArrows.forEach((arrow) => arrow.remove());
    newLevel.appendChild(newList);
    levelsContainer.appendChild(newLevel);
    currentLevelEl.classList.remove("is-active");
    currentLevelEl.classList.add("is-prev");
    setTimeout(() => newLevel.classList.add("is-active"), 50);
    currentLevel++;
    updateHeader();
    initSubMenuLevel(newLevel);
  }
  initMenu();
});
document.addEventListener("DOMContentLoaded", () => {
  if (document.querySelector(".product-main-swiper")) {
    const thumbsSwiper = new Swiper(".product-thumbs-swiper", {
      spaceBetween: 12,
      slidesPerView: 4,
      freeMode: true,
      watchSlidesProgress: true,
      breakpoints: {
        769: {
          slidesPerView: 6
        }
      }
    });
    new Swiper(".product-main-swiper", {
      spaceBetween: 12,
      rewind: true,
      thumbs: {
        swiper: thumbsSwiper
      }
    });
  }
  const variationsForm = document.querySelector(".variations_form");
  if (variationsForm) {
    const selects = variationsForm.querySelectorAll(".variations select");
    const singleVariationWrap = variationsForm.querySelector(".single_variation");
    const addToCartWrap = variationsForm.querySelector(
      ".woocommerce-variation-add-to-cart"
    );
    const addToCartBtn = variationsForm.querySelector(
      ".single_add_to_cart_button"
    );
    const variationIdInput = variationsForm.querySelector("input.variation_id");
    let isUpdatingDOM = false;
    const cleanEmptyAlerts = () => {
      variationsForm.querySelectorAll('div[role="alert"]:not(.single_variation)').forEach((el) => {
        el.remove();
      });
    };
    const unlockAddToCartButton = () => {
      if (addToCartWrap) {
        addToCartWrap.classList.remove(
          "woocommerce-variation-add-to-cart-disabled"
        );
        addToCartWrap.classList.add(
          "woocommerce-variation-add-to-cart-enabled"
        );
      }
      if (addToCartBtn) {
        addToCartBtn.classList.remove(
          "disabled",
          "wc-variation-selection-needed",
          "wc-variation-is-unavailable"
        );
        addToCartBtn.disabled = false;
      }
    };
    const enableFallbackVariation = () => {
      cleanEmptyAlerts();
      if (singleVariationWrap) {
        if (window.jQuery) {
          window.jQuery(singleVariationWrap).stop(true, true).show();
        }
        singleVariationWrap.style.display = "block";
        if (!singleVariationWrap.querySelector(".price-on-request")) {
          singleVariationWrap.innerHTML = '<div class="woocommerce-variation-price"><span class="price"><span class="price-on-request">Уточнить наличие и цену</span></span></div>';
        }
      }
      unlockAddToCartButton();
    };
    const updateButtonsState = () => {
      if (isUpdatingDOM) return;
      isUpdatingDOM = true;
      selects.forEach((select) => {
        const container = select.nextElementSibling;
        if (!container || !container.classList.contains("custom-variation-buttons"))
          return;
        Array.from(select.options).forEach((opt) => {
          if (opt.disabled) opt.disabled = false;
        });
        container.querySelectorAll(".variation-btn").forEach((btn) => {
          const val = btn.getAttribute("data-value");
          btn.classList.remove("disabled");
          if (select.value === val) {
            btn.classList.add("active");
          } else {
            btn.classList.remove("active");
          }
        });
      });
      cleanEmptyAlerts();
      isUpdatingDOM = false;
    };
    selects.forEach((select) => {
      const buttonsContainer = document.createElement("div");
      buttonsContainer.className = "custom-variation-buttons";
      const initialOptions = Array.from(select.options).filter((opt) => opt.value !== "").map((opt) => ({ value: opt.value, text: opt.textContent }));
      if (!select.value && initialOptions.length > 0) {
        select.value = initialOptions[0].value;
      }
      initialOptions.forEach((optData) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "variation-btn";
        btn.textContent = optData.text;
        btn.setAttribute("data-value", optData.value);
        if (select.value === optData.value) {
          btn.classList.add("active");
        }
        btn.addEventListener("click", (e2) => {
          e2.preventDefault();
          e2.stopImmediatePropagation();
          isUpdatingDOM = true;
          buttonsContainer.querySelectorAll(".variation-btn").forEach((b2) => b2.classList.remove("active"));
          btn.classList.add("active");
          if (variationIdInput) {
            variationIdInput.value = "";
          }
          let targetOption = Array.from(select.options).find(
            (o2) => o2.value === optData.value
          );
          if (!targetOption) {
            targetOption = new Option(optData.text, optData.value, true, true);
            select.add(targetOption);
          }
          targetOption.disabled = false;
          select.value = optData.value;
          isUpdatingDOM = false;
          if (window.jQuery) {
            window.jQuery(select).trigger("change");
            window.jQuery(variationsForm).trigger("check_variations");
          } else {
            select.dispatchEvent(new Event("change", { bubbles: true }));
          }
          setTimeout(() => {
            cleanEmptyAlerts();
            buttonsContainer.querySelectorAll(".variation-btn").forEach((b2) => b2.classList.remove("active"));
            btn.classList.add("active");
            if (!variationIdInput || !variationIdInput.value || variationIdInput.value === "0") {
              enableFallbackVariation();
            } else {
              unlockAddToCartButton();
            }
          }, 30);
        });
        buttonsContainer.appendChild(btn);
      });
      select.after(buttonsContainer);
      const observer = new MutationObserver(updateButtonsState);
      observer.observe(select, { childList: true });
    });
    if (window.jQuery) {
      window.jQuery(variationsForm).on("hide_variation reset_data", () => {
        enableFallbackVariation();
      });
      window.jQuery(variationsForm).on(
        "found_variation.wc-variation-form show_variation",
        (event2, variation) => {
          cleanEmptyAlerts();
          if (!variation || !variation.price_html || variation.display_price === 0 || variation.display_price === "") {
            enableFallbackVariation();
          } else {
            unlockAddToCartButton();
          }
        }
      );
    }
    if (addToCartBtn) {
      addToCartBtn.addEventListener(
        "click",
        (e2) => {
          unlockAddToCartButton();
          if (!variationIdInput || !variationIdInput.value || variationIdInput.value === "0") {
            e2.stopImmediatePropagation();
          }
        },
        true
      );
    }
    setTimeout(() => {
      if (window.jQuery) {
        window.jQuery(variationsForm).trigger("check_variations");
      }
      setTimeout(() => {
        cleanEmptyAlerts();
        if (!variationIdInput || !variationIdInput.value || variationIdInput.value === "0") {
          enableFallbackVariation();
        } else {
          unlockAddToCartButton();
        }
      }, 50);
    }, 100);
  }
});
const allModalBtnsJob = document.querySelectorAll("[data-modal-title]");
if (allModalBtnsJob.length) {
  allModalBtnsJob.forEach((btn) => {
    btn.addEventListener("click", () => {
      const title = btn.getAttribute("data-modal-title");
      const modal = document.querySelector(".modal-job");
      const input = modal.querySelector("#user_job");
      input.value = title;
    });
  });
}
//# sourceMappingURL=main.js.map
