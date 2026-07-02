/* @ds-bundle: {"format":3,"namespace":"LmNypontDesignSystem_ff7634","components":[{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"BeforeAfter","sourcePath":"components/core/BeforeAfter.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"DoodleMark","sourcePath":"components/core/DoodleMark.jsx"},{"name":"Eyebrow","sourcePath":"components/core/Eyebrow.jsx"},{"name":"Field","sourcePath":"components/core/Field.jsx"},{"name":"StatBlock","sourcePath":"components/core/StatBlock.jsx"},{"name":"StyleChip","sourcePath":"components/core/StyleChip.jsx"}],"sourceHashes":{"components/core/Badge.jsx":"ac7eab250c39","components/core/BeforeAfter.jsx":"92e1418c528e","components/core/Button.jsx":"7e396888c029","components/core/Card.jsx":"3707b65a0c36","components/core/DoodleMark.jsx":"5128eedd0556","components/core/Eyebrow.jsx":"0588d0618491","components/core/Field.jsx":"e56ac26aae55","components/core/StatBlock.jsx":"f3ce7d1bd80b","components/core/StyleChip.jsx":"356f7bc2d714","ui_kits/ai-selfiemata/ContactForm.jsx":"1307a5ca41ad","ui_kits/ai-selfiemata/Doodle.jsx":"2c4ecb5c305c","ui_kits/ai-selfiemata/Footer.jsx":"364ede6e3609","ui_kits/ai-selfiemata/Header.jsx":"e7ca6d1b5dff","ui_kits/ai-selfiemata/Hero.jsx":"34791190398e","ui_kits/ai-selfiemata/HowItWorks.jsx":"f9ccb43ce262","ui_kits/ai-selfiemata/StyleGallery.jsx":"258fc497d645","ui_kits/ai-selfiemata/WhySection.jsx":"5155104bfe42"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.LmNypontDesignSystem_ff7634 = window.LmNypontDesignSystem_ff7634 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Badge / trend tag — small rounded label. solid = filled accent
 * (e.g. "#1 RENDEZVÉNY TREND 2026"); soft = tinted; outline = bordered.
 */
function Badge({
  children,
  variant = 'solid',
  // solid | soft | outline
  color = 'var(--brand)',
  style,
  ...rest
}) {
  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    fontFamily: 'var(--font-body)',
    fontWeight: 700,
    fontSize: '12px',
    letterSpacing: '0.04em',
    lineHeight: 1,
    padding: '7px 13px',
    borderRadius: 'var(--radius-pill)',
    textTransform: 'uppercase'
  };
  const variants = {
    solid: {
      backgroundColor: color,
      color: '#fff'
    },
    soft: {
      backgroundColor: 'color-mix(in srgb, ' + color + ' 14%, transparent)',
      color
    },
    outline: {
      backgroundColor: 'transparent',
      color,
      border: '1px solid currentColor'
    }
  };
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      ...base,
      ...variants[variant],
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/BeforeAfter.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Before / after slider — the "Lehetsz bárki" core motif.
 * Drag the divider to reveal the AI transform. Eredeti → AI ✦.
 */
function BeforeAfter({
  before,
  // image src (original)
  after,
  // image src (AI)
  beforeLabel = 'Eredeti',
  afterLabel = 'AI ✦',
  start = 50,
  // initial split %
  radius = 'var(--radius-lg)',
  style,
  ...rest
}) {
  const [pos, setPos] = React.useState(start);
  const ref = React.useRef(null);
  const dragging = React.useRef(false);
  const move = clientX => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const p = (clientX - r.left) / r.width * 100;
    setPos(Math.max(0, Math.min(100, p)));
  };
  React.useEffect(() => {
    const up = () => dragging.current = false;
    const mv = e => {
      if (dragging.current) move(e.touches ? e.touches[0].clientX : e.clientX);
    };
    window.addEventListener('mousemove', mv);
    window.addEventListener('mouseup', up);
    window.addEventListener('touchmove', mv);
    window.addEventListener('touchend', up);
    return () => {
      window.removeEventListener('mousemove', mv);
      window.removeEventListener('mouseup', up);
      window.removeEventListener('touchmove', mv);
      window.removeEventListener('touchend', up);
    };
  }, []);
  const lbl = {
    position: 'absolute',
    top: '14px',
    fontFamily: 'var(--font-body)',
    fontSize: '11px',
    fontWeight: 700,
    letterSpacing: 'var(--ls-eyebrow)',
    textTransform: 'uppercase',
    color: '#fff',
    padding: '5px 11px',
    borderRadius: 'var(--radius-pill)',
    backdropFilter: 'blur(4px)'
  };
  return /*#__PURE__*/React.createElement("div", _extends({
    ref: ref,
    onMouseDown: e => {
      dragging.current = true;
      move(e.clientX);
    },
    onTouchStart: e => {
      dragging.current = true;
      move(e.touches[0].clientX);
    },
    style: {
      position: 'relative',
      overflow: 'hidden',
      borderRadius: radius,
      userSelect: 'none',
      cursor: 'ew-resize',
      boxShadow: 'var(--shadow-lg)',
      aspectRatio: '16 / 10',
      background: 'var(--ink-900)',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("img", {
    src: after,
    alt: afterLabel,
    draggable: false,
    style: {
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      width: pos + '%',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: before,
    alt: beforeLabel,
    draggable: false,
    style: {
      position: 'absolute',
      inset: 0,
      width: (ref.current ? ref.current.clientWidth : 1000) + 'px',
      maxWidth: 'none',
      height: '100%',
      objectFit: 'cover'
    }
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      ...lbl,
      left: '14px',
      background: 'rgba(23,21,13,.55)'
    }
  }, beforeLabel), /*#__PURE__*/React.createElement("span", {
    style: {
      ...lbl,
      right: '14px',
      background: 'var(--purple-600)'
    }
  }, afterLabel), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: pos + '%',
      width: '2px',
      background: '#fff',
      transform: 'translateX(-1px)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: '50%',
      left: pos + '%',
      width: '40px',
      height: '40px',
      transform: 'translate(-50%,-50%)',
      borderRadius: '50%',
      background: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--ink-900)',
      fontWeight: 700,
      boxShadow: 'var(--shadow-md)'
    }
  }, "\u21C4"));
}
Object.assign(__ds_scope, { BeforeAfter });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/BeforeAfter.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Élménypont primary action. Pill-shaped, warm shadow on the
 * accent variants. Arrow (→) is part of the brand CTA language.
 */
function Button({
  children,
  variant = 'primary',
  // primary | product | secondary | ghost | dark
  size = 'md',
  // sm | md | lg
  arrow = false,
  // append a → 
  disabled = false,
  onClick,
  type = 'button',
  style,
  ...rest
}) {
  const sizes = {
    sm: {
      padding: '8px 16px',
      font: '14px'
    },
    md: {
      padding: '13px 24px',
      font: '15px'
    },
    lg: {
      padding: '17px 32px',
      font: '17px'
    }
  };
  const variants = {
    primary: {
      backgroundColor: 'var(--brand)',
      color: 'var(--text-on-brand)',
      boxShadow: 'var(--shadow-coral)',
      border: '1px solid transparent'
    },
    product: {
      backgroundColor: 'var(--product-accent)',
      color: '#fff',
      boxShadow: 'var(--shadow-ai)',
      border: '1px solid transparent'
    },
    secondary: {
      backgroundColor: 'var(--surface-card)',
      color: 'var(--text-strong)',
      boxShadow: 'var(--shadow-sm)',
      border: '1px solid var(--border-strong)'
    },
    ghost: {
      backgroundColor: 'transparent',
      color: 'var(--text-strong)',
      boxShadow: 'none',
      border: '1px solid transparent'
    },
    dark: {
      backgroundColor: 'var(--cream-100)',
      color: 'var(--ink-900)',
      boxShadow: 'none',
      border: '1px solid transparent'
    }
  };
  const s = sizes[size] || sizes.md;
  const v = variants[variant] || variants.primary;
  const [hover, setHover] = React.useState(false);
  const [press, setPress] = React.useState(false);
  const hoverShift = {
    primary: {
      backgroundColor: 'var(--brand-hover)'
    },
    product: {
      backgroundColor: 'var(--product-accent-hover)'
    },
    secondary: {
      backgroundColor: 'var(--surface-sunken)'
    },
    ghost: {
      backgroundColor: 'var(--surface-sunken)'
    },
    dark: {
      backgroundColor: '#fff'
    }
  };
  return /*#__PURE__*/React.createElement("button", _extends({
    type: type,
    disabled: disabled,
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => {
      setHover(false);
      setPress(false);
    },
    onMouseDown: () => setPress(true),
    onMouseUp: () => setPress(false),
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      fontFamily: 'var(--font-body)',
      fontWeight: 600,
      fontSize: s.font,
      lineHeight: 1,
      padding: s.padding,
      borderRadius: 'var(--radius-pill)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      transition: 'background var(--dur-fast) var(--ease-out), transform var(--dur-fast) var(--ease-out)',
      transform: press ? 'scale(0.97)' : 'none',
      opacity: disabled ? 0.45 : 1,
      ...v,
      ...(hover && !disabled ? hoverShift[variant] : null),
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", null, children), arrow && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '1.1em',
      transform: hover && !disabled ? 'translateX(2px)' : 'none',
      transition: 'transform var(--dur-fast) var(--ease-out)'
    }
  }, "\u2192"));
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Surface card — white on cream, soft warm shadow, rounded.
 * Optional numbered marker (01, 02…) for the guided narrative.
 */
function Card({
  children,
  number,
  // optional "01" style marker
  accent = 'var(--brand)',
  padding = 'var(--space-6)',
  hoverable = false,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", _extends({
    onMouseEnter: () => hoverable && setHover(true),
    onMouseLeave: () => hoverable && setHover(false),
    style: {
      position: 'relative',
      backgroundColor: 'var(--surface-card)',
      border: '1px solid var(--border-soft)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: hover ? 'var(--shadow-lg)' : 'var(--shadow-md)',
      padding,
      transform: hover ? 'translateY(-3px)' : 'none',
      transition: 'box-shadow var(--dur-med) var(--ease-out), transform var(--dur-med) var(--ease-out)',
      ...style
    }
  }, rest), number != null && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: '2.25rem',
      lineHeight: 1,
      color: accent,
      letterSpacing: 'var(--ls-display)',
      marginBottom: 'var(--space-4)'
    }
  }, number), children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// components/core/DoodleMark.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * DoodleMark — renders one of the brand doodles as a decorative accent.
 * Use airy: one per section, lots of space. Chrome, not showcase.
 * Pass the asset URL via `src` (copy doodles into the consuming project).
 */
function DoodleMark({
  src,
  size = 64,
  opacity = 1,
  rotate = 0,
  alt = '',
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("img", _extends({
    src: src,
    alt: alt,
    "aria-hidden": alt === '' ? 'true' : undefined,
    style: {
      width: typeof size === 'number' ? size + 'px' : size,
      height: 'auto',
      opacity,
      transform: rotate ? `rotate(${rotate}deg)` : undefined,
      pointerEvents: 'none',
      userSelect: 'none',
      ...style
    }
  }, rest));
}
Object.assign(__ds_scope, { DoodleMark });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/DoodleMark.jsx", error: String((e && e.message) || e) }); }

// components/core/Eyebrow.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Eyebrow label — uppercase, letterspaced. The "MIÉRT MOST? MIÉRT AI?"
 * section marker. Coral by default; pass color for product surfaces.
 */
function Eyebrow({
  children,
  color = 'var(--brand)',
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      fontFamily: 'var(--font-body)',
      fontWeight: 600,
      fontSize: 'var(--text-eyebrow)',
      letterSpacing: 'var(--ls-eyebrow)',
      textTransform: 'uppercase',
      color,
      display: 'inline-block',
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Eyebrow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Eyebrow.jsx", error: String((e && e.message) || e) }); }

// components/core/Field.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Form field — label + input/textarea. Rounded, cream-sunken fill,
 * coral focus ring. Matches the ajánlatkérő form.
 */
function Field({
  label,
  required = false,
  type = 'text',
  textarea = false,
  rows = 3,
  placeholder,
  value,
  onChange,
  id,
  style,
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const fieldStyle = {
    width: '100%',
    boxSizing: 'border-box',
    fontFamily: 'var(--font-body)',
    fontSize: '15px',
    color: 'var(--text-strong)',
    backgroundColor: 'var(--surface-base)',
    border: '1px solid ' + (focus ? 'var(--brand)' : 'var(--border-strong)'),
    borderRadius: 'var(--radius-md)',
    padding: '12px 14px',
    outline: 'none',
    boxShadow: focus ? '0 0 0 4px var(--focus-ring)' : 'none',
    transition: 'border-color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)',
    resize: textarea ? 'vertical' : undefined
  };
  return /*#__PURE__*/React.createElement("label", {
    htmlFor: id,
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '7px',
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontWeight: 500,
      fontSize: '13.5px',
      color: 'var(--text-body)'
    }
  }, label, required && /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--brand)'
    }
  }, " *")), textarea ? /*#__PURE__*/React.createElement("textarea", _extends({
    id: id,
    rows: rows,
    placeholder: placeholder,
    value: value,
    onChange: onChange,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: fieldStyle
  }, rest)) : /*#__PURE__*/React.createElement("input", _extends({
    id: id,
    type: type,
    placeholder: placeholder,
    value: value,
    onChange: onChange,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: fieldStyle
  }, rest)));
}
Object.assign(__ds_scope, { Field });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Field.jsx", error: String((e && e.message) || e) }); }

// components/core/StatBlock.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Stat block — big number + short caption. The brand's proof device
 * (9–15 mp / 4+ stílus / 100%). Number uses Syne; accent-colored.
 */
function StatBlock({
  value,
  label,
  accent = 'var(--brand)',
  labelColor = 'var(--text-muted)',
  align = 'left',
  // left | center
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      textAlign: align,
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 'clamp(2rem, 4vw, 3rem)',
      lineHeight: 1,
      letterSpacing: 'var(--ls-display)',
      color: accent
    }
  }, value), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontWeight: 500,
      fontSize: '14px',
      color: labelColor
    }
  }, label));
}
Object.assign(__ds_scope, { StatBlock });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/StatBlock.jsx", error: String((e && e.message) || e) }); }

// components/core/StyleChip.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Selectable style pill — the AI style picker (Festmény / Extrém /
 * Karikatúra / Űrhajós / egyedi). Selected pill carries the accent.
 */
function StyleChip({
  children,
  selected = false,
  accent = 'var(--product-accent)',
  onClick,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    "aria-pressed": selected,
    style: {
      fontFamily: 'var(--font-body)',
      fontWeight: 600,
      fontSize: '14px',
      lineHeight: 1,
      padding: '10px 18px',
      borderRadius: 'var(--radius-pill)',
      cursor: 'pointer',
      border: selected ? '1px solid transparent' : '1px solid var(--border-strong)',
      backgroundColor: selected ? accent : hover ? 'var(--surface-sunken)' : 'transparent',
      color: selected ? '#fff' : 'var(--text-strong)',
      boxShadow: selected ? 'var(--shadow-ai)' : 'none',
      transition: 'all var(--dur-fast) var(--ease-out)',
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { StyleChip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/StyleChip.jsx", error: String((e && e.message) || e) }); }

// ui_kits/ai-selfiemata/ContactForm.jsx
try { (() => {
// ContactForm.jsx — ajánlatkérő. BOLD coral band + cut, white form card.
const {
  Eyebrow: CfEyebrow,
  Field: CfField,
  Button: CfButton
} = window.LmNypontDesignSystem_ff7634;
function ContactForm() {
  const [sent, setSent] = React.useState(false);
  return /*#__PURE__*/React.createElement("section", {
    id: "ajanlat",
    style: {
      position: 'relative',
      overflow: 'hidden',
      background: 'var(--brand)',
      clipPath: 'polygon(0 56px, 100% 0, 100% 100%, 0 100%)',
      paddingTop: '56px'
    }
  }, /*#__PURE__*/React.createElement(DoodleUnderlay, {
    tone: "white",
    opacity: 0.08,
    size: 400
  }), /*#__PURE__*/React.createElement(Doodle, {
    name: "doodle-5-hello-bubble",
    variant: "white",
    size: 84,
    rotate: -8,
    anim: "wiggle",
    style: {
      position: 'absolute',
      top: '90px',
      left: '6%'
    },
    className: "ep-hide-sm"
  }), /*#__PURE__*/React.createElement(Doodle, {
    name: "doodle-3-polaroid",
    variant: "white",
    size: 70,
    rotate: 10,
    anim: "float",
    style: {
      position: 'absolute',
      bottom: '40px',
      right: '7%'
    },
    className: "ep-hide-sm"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      maxWidth: '880px',
      margin: '0 auto',
      padding: 'clamp(32px, 5vw, 72px) clamp(20px, 5vw, 56px) clamp(48px, 6vw, 96px)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      marginBottom: '36px'
    }
  }, /*#__PURE__*/React.createElement(CfEyebrow, {
    color: "#fff",
    style: {
      marginBottom: '14px',
      opacity: 0.85
    }
  }, "Aj\xE1nlatk\xE9r\xE9s"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 'var(--text-h2)',
      letterSpacing: 'var(--ls-heading)',
      color: '#fff',
      margin: '0 0 10px'
    }
  }, "K\xE9rj szem\xE9lyre szabott aj\xE1nlatot!"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: '16px',
      color: 'rgba(255,255,255,.9)',
      margin: 0
    }
  }, "Add meg az adataidat \xE9s mi felvessz\xFCk veled a kapcsolatot.")), sent ? /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      background: 'var(--surface-card)',
      borderRadius: 'var(--radius-lg)',
      padding: 'var(--space-8)',
      boxShadow: 'var(--shadow-lg)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: '1.7rem',
      color: 'var(--brand)',
      marginBottom: '8px'
    }
  }, "K\xF6sz\xF6nj\xFCk! \u2726"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-body)',
      color: 'var(--text-muted)',
      margin: 0
    }
  }, "Hamarosan keres\xFCnk a megadott el\xE9rhet\u0151s\xE9gen.")) : /*#__PURE__*/React.createElement("form", {
    onSubmit: e => {
      e.preventDefault();
      setSent(true);
    },
    className: "ep-form-grid",
    style: {
      background: 'var(--surface-card)',
      borderRadius: 'var(--radius-lg)',
      padding: 'clamp(24px, 4vw, 44px)',
      boxShadow: 'var(--shadow-lg)',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '18px'
    }
  }, /*#__PURE__*/React.createElement(CfField, {
    label: "A neved",
    placeholder: "Kov\xE1cs Anna"
  }), /*#__PURE__*/React.createElement(CfField, {
    label: "E-mail c\xEDmed",
    required: true,
    type: "email",
    placeholder: "te@pelda.hu"
  }), /*#__PURE__*/React.createElement(CfField, {
    label: "Telefonsz\xE1mod",
    placeholder: "+36 20 \u2026"
  }), /*#__PURE__*/React.createElement(CfField, {
    label: "Rendezv\xE9ny d\xE1tuma",
    placeholder: "2026. \u2026"
  }), /*#__PURE__*/React.createElement(CfField, {
    label: "Rendezv\xE9ny t\xEDpusa",
    placeholder: "C\xE9ges party, esk\xFCv\u0151\u2026"
  }), /*#__PURE__*/React.createElement(CfField, {
    label: "V\xE1rhat\xF3 l\xE9tsz\xE1m / id\u0151tartam",
    placeholder: "200 f\u0151 \xB7 8 \xF3ra"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      gridColumn: '1 / -1'
    }
  }, /*#__PURE__*/React.createElement(CfField, {
    label: "\xDCzenet, egy\xE9b info",
    textarea: true,
    rows: 3,
    placeholder: "Mes\xE9lj a rendezv\xE9nyr\u0151l\u2026"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      gridColumn: '1 / -1',
      display: 'flex',
      justifyContent: 'center',
      marginTop: '6px'
    }
  }, /*#__PURE__*/React.createElement(CfButton, {
    variant: "primary",
    size: "lg",
    arrow: true,
    type: "submit"
  }, "K\xFCldd el az \xFCzenetet!")))));
}
window.ContactForm = ContactForm;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/ai-selfiemata/ContactForm.jsx", error: String((e && e.message) || e) }); }

// ui_kits/ai-selfiemata/Doodle.jsx
try { (() => {
// Doodle.jsx — decorative doodle helpers + the rocket-on-a-dashed-line divider.

// Single decorative doodle. variant: coral | ink | white.
function Doodle({
  name,
  variant = 'coral',
  size = 64,
  rotate = 0,
  anim,
  style
}) {
  const cls = anim === 'float' ? 'ep-float' : anim === 'wiggle' ? 'ep-wiggle' : '';
  return /*#__PURE__*/React.createElement("img", {
    className: cls,
    src: `../../assets/doodles/${variant === 'white' ? '' : variant + '/'}${name}.png`,
    alt: "",
    "aria-hidden": "true",
    style: {
      width: typeof size === 'number' ? size + 'px' : size,
      height: 'auto',
      transform: rotate ? `rotate(${rotate}deg)` : undefined,
      pointerEvents: 'none',
      userSelect: 'none',
      ...style
    }
  });
}

// Faint full-bleed doodle-pattern underlay. tone: coral | white.
function DoodleUnderlay({
  tone = 'coral',
  opacity = 0.06,
  size = 420
}) {
  const file = tone === 'white' ? 'EP_bg_white' : 'EP_bg_coral';
  return /*#__PURE__*/React.createElement("div", {
    "aria-hidden": "true",
    style: {
      position: 'absolute',
      inset: 0,
      pointerEvents: 'none',
      background: `url(../../assets/patterns/${file}.png)`,
      backgroundSize: size + 'px',
      opacity
    }
  });
}

// Rocket flying along a dashed line — the brand's signature micro-animation.
function RocketDivider() {
  return /*#__PURE__*/React.createElement("div", {
    "aria-hidden": "true",
    style: {
      position: 'relative',
      height: '92px',
      background: 'var(--surface-base)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "ep-dashline",
    style: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: '50%',
      height: '3px',
      backgroundImage: 'repeating-linear-gradient(90deg, var(--coral-300) 0 14px, transparent 14px 28px)',
      backgroundSize: '28px 3px',
      animation: 'epDash 1.2s linear infinite',
      opacity: 0.7
    }
  }), /*#__PURE__*/React.createElement("img", {
    className: "ep-rocket",
    src: "../../assets/doodles/coral/doodle-1-rocket.png",
    alt: "",
    style: {
      position: 'absolute',
      top: '50%',
      width: '54px',
      marginTop: '-46px',
      animation: 'epRocketFly 7s linear infinite'
    }
  }));
}
window.Doodle = Doodle;
window.DoodleUnderlay = DoodleUnderlay;
window.RocketDivider = RocketDivider;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/ai-selfiemata/Doodle.jsx", error: String((e && e.message) || e) }); }

// ui_kits/ai-selfiemata/Footer.jsx
try { (() => {
// Footer.jsx — contact + brand close.
function Footer() {
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      background: 'var(--ink-900)',
      borderTop: '1px solid var(--border-dark)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--container)',
      margin: '0 auto',
      padding: 'clamp(40px, 5vw, 64px) clamp(20px, 5vw, 56px)',
      display: 'flex',
      flexWrap: 'wrap',
      gap: '32px',
      justifyContent: 'space-between',
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: '300px'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo/elmenypont-logo-white.png",
    alt: "\xC9lm\xE9nypont",
    style: {
      height: '28px',
      marginBottom: '16px'
    }
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: '14px',
      lineHeight: 1.55,
      color: 'var(--text-inverse-muted)',
      margin: 0
    }
  }, "Keress minket b\xE1tran, ha egy j\xF3 programra vagy \xF6tletre van sz\xFCks\xE9ged!")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'clamp(32px, 5vw, 72px)',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: '11px',
      letterSpacing: 'var(--ls-eyebrow)',
      textTransform: 'uppercase',
      fontWeight: 600,
      color: 'var(--text-inverse-muted)',
      marginBottom: '12px'
    }
  }, "Kapcsolat"), /*#__PURE__*/React.createElement("a", {
    href: "mailto:hello@elmeny.hu",
    style: {
      display: 'block',
      fontFamily: 'var(--font-body)',
      fontSize: '15px',
      color: 'var(--cream-100)',
      textDecoration: 'none',
      marginBottom: '6px'
    }
  }, "hello@elmeny.hu"), /*#__PURE__*/React.createElement("a", {
    href: "tel:+36204680489",
    style: {
      display: 'block',
      fontFamily: 'var(--font-body)',
      fontSize: '15px',
      color: 'var(--cream-100)',
      textDecoration: 'none'
    }
  }, "+36 20 468 0489")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: '11px',
      letterSpacing: 'var(--ls-eyebrow)',
      textTransform: 'uppercase',
      fontWeight: 600,
      color: 'var(--text-inverse-muted)',
      marginBottom: '12px'
    }
  }, "T\xF6bb \xF6tlet"), /*#__PURE__*/React.createElement("a", {
    href: "https://www.elmeny.hu",
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: '15px',
      color: 'var(--cream-100)',
      textDecoration: 'none'
    }
  }, "www.elmeny.hu")))), /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: '1px solid var(--border-dark)',
      padding: '18px clamp(20px, 5vw, 56px)',
      fontFamily: 'var(--font-body)',
      fontSize: '13px',
      color: 'var(--text-inverse-muted)'
    }
  }, "\xA9 2026 \xE9lm\xE9nypont \u2014 AI Selfiemata"));
}
window.Footer = Footer;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/ai-selfiemata/Footer.jsx", error: String((e && e.message) || e) }); }

// ui_kits/ai-selfiemata/Header.jsx
try { (() => {
// Header.jsx — light, sticky. Coral top accent line, logo, nav, coral CTA.
const {
  Button: EpButton
} = window.LmNypontDesignSystem_ff7634;
function Header({
  onQuote
}) {
  const nav = ['Miért AI?', 'Stílusok', 'Hogyan?', 'Személyre szabás'];
  return /*#__PURE__*/React.createElement("header", {
    style: {
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: 'rgba(246,241,233,.82)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border-soft)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: '4px',
      background: 'var(--brand)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '14px clamp(20px, 5vw, 56px)'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo/elmenypont-logo-coral.png",
    alt: "\xC9lm\xE9nypont",
    style: {
      height: '30px'
    }
  }), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      gap: '28px'
    },
    className: "ep-desktop-nav"
  }, nav.map(n => /*#__PURE__*/React.createElement("a", {
    key: n,
    href: "#",
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: '14px',
      fontWeight: 500,
      color: 'var(--text-body)',
      textDecoration: 'none',
      transition: 'color var(--dur-fast) var(--ease-out)'
    },
    onMouseEnter: e => e.target.style.color = 'var(--brand)',
    onMouseLeave: e => e.target.style.color = 'var(--text-body)'
  }, n))), /*#__PURE__*/React.createElement(EpButton, {
    variant: "primary",
    size: "sm",
    arrow: true,
    onClick: onQuote
  }, "Aj\xE1nlatot k\xE9rek")));
}
window.Header = Header;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/ai-selfiemata/Header.jsx", error: String((e && e.message) || e) }); }

// ui_kits/ai-selfiemata/Hero.jsx
try { (() => {
// Hero.jsx — light cream, coral accent, bold cut block behind the
// before/after, doodle decor. The flagship hero.
const {
  Button: HeroBtn,
  Badge: HeroBadge,
  StatBlock: HeroStat,
  BeforeAfter: HeroBA
} = window.LmNypontDesignSystem_ff7634;
function Hero({
  onQuote
}) {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      position: 'relative',
      overflow: 'hidden',
      background: 'var(--surface-base)'
    }
  }, /*#__PURE__*/React.createElement(DoodleUnderlay, {
    tone: "coral",
    opacity: 0.05,
    size: 440
  }), /*#__PURE__*/React.createElement("div", {
    "aria-hidden": "true",
    style: {
      position: 'absolute',
      top: '-120px',
      right: '-80px',
      width: '520px',
      height: '520px',
      background: 'var(--coral-50)',
      clipPath: 'polygon(28% 0, 100% 0, 100% 72%)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "ep-hero-grid",
    style: {
      position: 'relative',
      maxWidth: 'var(--container)',
      margin: '0 auto',
      padding: 'clamp(44px, 6vw, 88px) clamp(20px, 5vw, 56px)',
      display: 'grid',
      gridTemplateColumns: '1.05fr 1fr',
      gap: 'clamp(32px, 5vw, 72px)',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(HeroBadge, {
    variant: "soft",
    color: "var(--brand)",
    style: {
      marginBottom: '22px'
    }
  }, "#1 rendezv\xE9ny trend 2026-ban"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      color: 'var(--text-strong)',
      fontSize: 'clamp(2.5rem, 5.2vw, 4.5rem)',
      lineHeight: 1.04,
      letterSpacing: 'var(--ls-display)',
      margin: '0 0 18px'
    }
  }, "A fot\xF3automata", /*#__PURE__*/React.createElement("br", null), "\xFAjra\xEDrva \u2014", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      color: 'var(--brand)'
    }
  }, "AI Selfiemata.")), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 'clamp(1rem, 1.4vw, 1.18rem)',
      lineHeight: 1.55,
      color: 'var(--text-body)',
      maxWidth: '470px',
      margin: '0 0 30px'
    }
  }, "Val\xF3s idej\u0171 AI k\xE9pgener\xE1l\xE1s rendezv\xE9nyeken. A k\xE9sz\xFClt fot\xF3t az AI \xE1tvar\xE1zsolja \u2014 egyedi, megoszthat\xF3, brandingelt eml\xE9k, ", /*#__PURE__*/React.createElement("strong", {
    style: {
      color: 'var(--text-strong)'
    }
  }, "10 m\xE1sodperc alatt.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '12px',
      flexWrap: 'wrap',
      marginBottom: '40px'
    }
  }, /*#__PURE__*/React.createElement(HeroBtn, {
    variant: "primary",
    size: "lg",
    arrow: true,
    onClick: onQuote
  }, "Aj\xE1nlatot k\xE9rek"), /*#__PURE__*/React.createElement(HeroBtn, {
    variant: "secondary",
    size: "lg"
  }, "St\xEDlusok \u2193")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex',
      gap: 'clamp(22px, 4vw, 44px)',
      backgroundColor: 'var(--ink-900)',
      borderRadius: 'var(--radius-lg)',
      padding: '20px clamp(22px, 3vw, 32px)',
      boxShadow: 'var(--shadow-md)'
    }
  }, /*#__PURE__*/React.createElement(HeroStat, {
    value: "9\u201315 mp",
    label: "AI gener\xE1l\xE1s",
    accent: "var(--coral-300)",
    labelColor: "var(--text-inverse-muted)"
  }), /*#__PURE__*/React.createElement(HeroStat, {
    value: "4+ st\xEDlus",
    label: "v\xE1laszthat\xF3 t\xE9ma",
    accent: "var(--purple-500)",
    labelColor: "var(--text-inverse-muted)"
  }), /*#__PURE__*/React.createElement(HeroStat, {
    value: "100%",
    label: "rendezv\xE9nyre szabva",
    accent: "var(--teal-500)",
    labelColor: "var(--text-inverse-muted)"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    "aria-hidden": "true",
    style: {
      position: 'absolute',
      inset: '18px -18px -18px 18px',
      background: 'var(--brand)',
      borderRadius: 'var(--radius-xl)',
      transform: 'rotate(2.5deg)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement(HeroBA, {
    before: "../../assets/photos/original.png",
    after: "../../assets/photos/style-astronaut.png",
    start: 48
  })), /*#__PURE__*/React.createElement("div", {
    className: "ep-hide-sm"
  }, /*#__PURE__*/React.createElement(Doodle, {
    name: "doodle-5-hello-bubble",
    variant: "coral",
    size: 78,
    rotate: -10,
    anim: "wiggle",
    style: {
      position: 'absolute',
      top: '-40px',
      left: '-34px'
    }
  }), /*#__PURE__*/React.createElement(Doodle, {
    name: "doodle-3-polaroid",
    variant: "ink",
    size: 62,
    anim: "float",
    style: {
      position: 'absolute',
      bottom: '-34px',
      right: '-22px'
    }
  })), /*#__PURE__*/React.createElement("p", {
    style: {
      textAlign: 'center',
      marginTop: '22px',
      fontFamily: 'var(--font-body)',
      fontSize: '12px',
      letterSpacing: 'var(--ls-eyebrow)',
      textTransform: 'uppercase',
      color: 'var(--text-muted)'
    }
  }, "Egy \xFAj gener\xE1ci\xF3s szelfig\xE9p \u2014 mesters\xE9ges intelligenci\xE1val"))));
}
window.Hero = Hero;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/ai-selfiemata/Hero.jsx", error: String((e && e.message) || e) }); }

// ui_kits/ai-selfiemata/HowItWorks.jsx
try { (() => {
// HowItWorks.jsx — 4 lépés, 10 másodperc. Cream, bold coral-cut booth frame.
const {
  Eyebrow: HwEyebrow
} = window.LmNypontDesignSystem_ff7634;
function HowItWorks() {
  const steps = [{
    n: '01',
    t: 'Stílus',
    d: 'A vendég választ a rendezvényre tervezett AI stílusok közül.',
    a: 'var(--brand)'
  }, {
    n: '02',
    t: 'Fotó',
    d: 'Az érintőképernyős automatával lefényképezi magát — személyzet is segít.',
    a: 'var(--purple-500)'
  }, {
    n: '03',
    t: 'AI varázsol',
    d: 'A felhőalapú AI 9–15 másodperc alatt újrarajzolja a képet.',
    a: 'var(--teal-500)'
  }, {
    n: '04',
    t: 'Megosztás',
    d: 'QR-kóddal, emailen vagy nyomtatva átveszi — akár azonnal megosztja.',
    a: 'var(--green-500)'
  }];
  return /*#__PURE__*/React.createElement("section", {
    style: {
      position: 'relative',
      background: 'var(--surface-base)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--container)',
      margin: '0 auto',
      padding: 'clamp(48px, 6vw, 96px) clamp(20px, 5vw, 56px)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "ep-how-grid",
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 'clamp(32px, 5vw, 72px)',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    "aria-hidden": "true",
    style: {
      position: 'absolute',
      inset: '-16px -16px 16px 16px',
      background: 'var(--coral-100)',
      borderRadius: 'var(--radius-xl)',
      transform: 'rotate(-2deg)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      borderRadius: 'var(--radius-xl)',
      overflow: 'hidden',
      boxShadow: 'var(--shadow-lg)',
      aspectRatio: '7/5',
      background: 'var(--ink-900)'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/photos/booth.png",
    alt: "AI Selfiemata \xE1llom\xE1s",
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'contain'
    }
  })), /*#__PURE__*/React.createElement(Doodle, {
    name: "doodle-6-boombox",
    variant: "coral",
    size: 66,
    rotate: 8,
    anim: "wiggle",
    style: {
      position: 'absolute',
      top: '-44px',
      right: '-18px'
    },
    className: "ep-hide-sm"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(HwEyebrow, {
    style: {
      marginBottom: '14px'
    }
  }, "Hogyan m\u0171k\xF6dik?"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 'var(--text-h2)',
      letterSpacing: 'var(--ls-heading)',
      color: 'var(--text-strong)',
      margin: '0 0 28px'
    }
  }, "4 l\xE9p\xE9s. ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--brand)'
    }
  }, "10 m\xE1sodperc.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: '4px'
    }
  }, steps.map((s, i) => /*#__PURE__*/React.createElement("div", {
    key: s.n,
    style: {
      display: 'flex',
      gap: '18px',
      padding: '16px 0',
      borderTop: i === 0 ? 'none' : '1px solid var(--border-soft)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: '1.5rem',
      color: s.a,
      lineHeight: 1,
      minWidth: '40px'
    }
  }, s.n), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 600,
      fontSize: '1.1rem',
      color: 'var(--text-strong)',
      marginBottom: '3px'
    }
  }, s.t), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: '14.5px',
      color: 'var(--text-muted)',
      lineHeight: 1.5
    }
  }, s.d)))))))));
}
window.HowItWorks = HowItWorks;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/ai-selfiemata/HowItWorks.jsx", error: String((e && e.message) || e) }); }

// ui_kits/ai-selfiemata/StyleGallery.jsx
try { (() => {
// StyleGallery.jsx — "AI stílusok". Light + coral, bold cuts. Pick a
// style → big showcase swaps. Doodle decor.
const {
  Eyebrow: SgEyebrow,
  StyleChip: SgChip
} = window.LmNypontDesignSystem_ff7634;
const EP_STYLES = [{
  key: 'Festmény',
  sub: 'Van Gogh, Klimt, Pop Art',
  img: 'style-masterpiece.png',
  accent: 'var(--purple-500)'
}, {
  key: 'Extrém',
  sub: 'F1, viking, űrhajós',
  img: 'style-astronaut.png',
  accent: 'var(--blue-500)'
}, {
  key: 'Karikatúra',
  sub: 'Vicces AI torzítás',
  img: 'style-karikatura.png',
  accent: 'var(--brand)'
}, {
  key: 'Pixar Mode',
  sub: '3D animációs karakter',
  img: 'style-pixar.png',
  accent: 'var(--green-500)'
}, {
  key: 'Anime',
  sub: 'Japán animációs portré',
  img: 'style-anime.png',
  accent: 'var(--teal-500)'
}, {
  key: 'Cyberpunk',
  sub: 'Neon city, 2076',
  img: 'style-cyberpunk.png',
  accent: 'var(--purple-500)'
}];
function StyleGallery() {
  const [active, setActive] = React.useState(EP_STYLES[1]);
  return /*#__PURE__*/React.createElement("section", {
    style: {
      position: 'relative',
      overflow: 'hidden',
      background: 'var(--surface-sunken)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      maxWidth: 'var(--container)',
      margin: '0 auto',
      padding: 'clamp(48px, 6vw, 96px) clamp(20px, 5vw, 56px)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      maxWidth: '640px',
      margin: '0 auto clamp(32px, 4vw, 48px)'
    }
  }, /*#__PURE__*/React.createElement(SgEyebrow, {
    color: "var(--brand)",
    style: {
      marginBottom: '14px'
    }
  }, "AI st\xEDlusok"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 'var(--text-h2)',
      lineHeight: 1.1,
      letterSpacing: 'var(--ls-heading)',
      color: 'var(--text-strong)',
      margin: '0 0 12px'
    }
  }, "Nem filter. Nem sablon.", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--brand)'
    }
  }, "Minden k\xE9p egyedi alkot\xE1s."))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '10px',
      flexWrap: 'wrap',
      justifyContent: 'center',
      marginBottom: 'clamp(28px, 3vw, 40px)'
    }
  }, EP_STYLES.map(s => /*#__PURE__*/React.createElement(SgChip, {
    key: s.key,
    selected: active.key === s.key,
    accent: s.accent,
    onClick: () => setActive(s)
  }, s.key))), /*#__PURE__*/React.createElement("div", {
    className: "ep-gallery-grid",
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1.15fr',
      gap: 'clamp(20px, 3vw, 48px)',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 'clamp(2.25rem, 3.6vw, 3rem)',
      color: active.accent,
      letterSpacing: 'var(--ls-display)',
      lineHeight: 1.05,
      marginBottom: '8px',
      transition: 'color var(--dur-med) var(--ease-out)'
    }
  }, active.key), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: '16px',
      color: 'var(--text-muted)',
      margin: '0 0 24px'
    }
  }, active.sub), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: '13px'
    }
  }, ['Egyedi prompt rendszer rendezvényenként', 'Brandelt keret a megosztott képeken', 'Egyedi stílus is kérhető'].map(t => /*#__PURE__*/React.createElement("div", {
    key: t,
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '12px',
      color: 'var(--text-body)',
      fontFamily: 'var(--font-body)',
      fontSize: '15px',
      lineHeight: 1.45
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: active.accent,
      fontWeight: 700
    }
  }, "\u2726"), " ", t))), /*#__PURE__*/React.createElement(Doodle, {
    name: "doodle-4-glasses-3d",
    variant: "ink",
    size: 64,
    rotate: -6,
    anim: "float",
    style: {
      position: 'absolute',
      bottom: '-56px',
      left: '4px'
    },
    className: "ep-hide-sm"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    "aria-hidden": "true",
    style: {
      position: 'absolute',
      inset: '-16px 16px 16px -16px',
      backgroundColor: active.accent,
      borderRadius: 'var(--radius-xl)',
      clipPath: 'polygon(0 0, 100% 0, 100% 86%, 86% 100%, 0 100%)',
      transition: 'background-color var(--dur-med) var(--ease-out)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      borderRadius: 'var(--radius-xl)',
      overflow: 'hidden',
      boxShadow: 'var(--shadow-lg)',
      aspectRatio: '4/3',
      background: 'var(--charcoal)',
      clipPath: 'polygon(0 0, 100% 0, 100% 86%, 86% 100%, 0 100%)'
    }
  }, /*#__PURE__*/React.createElement("img", {
    key: active.img,
    src: '../../assets/photos/' + active.img,
    alt: active.key,
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      objectPosition: 'top'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: '16px',
      bottom: '22px',
      padding: '7px 14px',
      borderRadius: 'var(--radius-pill)',
      background: 'rgba(23,21,13,.55)',
      backdropFilter: 'blur(6px)',
      color: '#fff',
      fontFamily: 'var(--font-body)',
      fontWeight: 700,
      fontSize: '12px',
      letterSpacing: 'var(--ls-eyebrow)',
      textTransform: 'uppercase'
    }
  }, active.key, " \u2726"))))));
}
window.StyleGallery = StyleGallery;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/ai-selfiemata/StyleGallery.jsx", error: String((e && e.message) || e) }); }

// ui_kits/ai-selfiemata/WhySection.jsx
try { (() => {
// WhySection.jsx — "Miért most? Miért AI?" numbered narrative on cream.
const {
  Eyebrow: WhyEyebrow,
  Card: WhyCard
} = window.LmNypontDesignSystem_ff7634;
function WhySection() {
  const items = [{
    n: '01',
    t: 'A vendégek AI élményt várnak',
    d: 'Az okostelefon már nem elég. Az emberek valami olyat akarnak, amit otthon nem tudnak könnyen megcsinálni.',
    a: 'var(--brand)'
  }, {
    n: '02',
    t: 'Organikus viral tartalom',
    d: 'Egy egyedi AI kép 3× nagyobb valószínűséggel kerül ki social médiára, mint egy hagyományos fotó.',
    a: 'var(--purple-500)'
  }, {
    n: '03',
    t: 'Brand aktiváció új szinten',
    d: 'Az AI kimenet brandingelhető — minden megosztott kép a te logóddal, a te rendezvényed nevével megy ki.',
    a: 'var(--teal-500)'
  }];
  return /*#__PURE__*/React.createElement("section", {
    style: {
      position: 'relative',
      background: 'var(--surface-base)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      maxWidth: 'var(--container)',
      margin: '0 auto',
      padding: 'clamp(40px, 6vw, 96px) clamp(20px, 5vw, 56px)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      maxWidth: '660px',
      marginBottom: 'clamp(40px, 5vw, 64px)'
    }
  }, /*#__PURE__*/React.createElement(WhyEyebrow, {
    style: {
      marginBottom: '14px'
    }
  }, "Mi\xE9rt most? Mi\xE9rt AI?"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 'var(--text-h2)',
      lineHeight: 1.12,
      letterSpacing: 'var(--ls-heading)',
      color: 'var(--text-strong)',
      margin: 0
    }
  }, "A rendezv\xE9nyipar legnagyobb trendje 2026-ban ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--brand)'
    }
  }, "az AI \xE9lm\xE9ny.")), /*#__PURE__*/React.createElement(Doodle, {
    name: "doodle-2-megaphone",
    variant: "coral",
    size: 74,
    rotate: -8,
    anim: "float",
    style: {
      position: 'absolute',
      top: '-30px',
      right: '-10px'
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "ep-3col",
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 'clamp(16px, 2vw, 24px)'
    }
  }, items.map(it => /*#__PURE__*/React.createElement(WhyCard, {
    key: it.n,
    number: it.n,
    accent: it.a,
    hoverable: true
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 600,
      fontSize: '1.35rem',
      color: 'var(--text-strong)',
      margin: '0 0 10px',
      letterSpacing: 'var(--ls-heading)'
    }
  }, it.t), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: '15px',
      lineHeight: 1.55,
      color: 'var(--text-muted)',
      margin: 0
    }
  }, it.d))))));
}
window.WhySection = WhySection;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/ai-selfiemata/WhySection.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.BeforeAfter = __ds_scope.BeforeAfter;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.DoodleMark = __ds_scope.DoodleMark;

__ds_ns.Eyebrow = __ds_scope.Eyebrow;

__ds_ns.Field = __ds_scope.Field;

__ds_ns.StatBlock = __ds_scope.StatBlock;

__ds_ns.StyleChip = __ds_scope.StyleChip;

})();
