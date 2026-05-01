# Tasker recipe — Shift+F3 Case Cycle on Android

A self-contained Tasker profile that lets you cycle the clipboard
through the same five cases as the desktop and web builds, without
leaving the current app.

## Profile

| Field    | Value                                               |
| -------- | --------------------------------------------------- |
| Name     | `Shift+F3 Case Cycle`                               |
| Trigger  | **Event → Variable Set** on `%CLIPCYCLE` (or a quick-tile shortcut) |
| Task     | `Shift+F3 Case Cycle` (below)                       |

## Task

1. **Variable Add** — `%STATE` (Wrap Around: 5)
2. **JavaScriptlet** with the snippet below.
3. **Set Clipboard** to `%OUT`.
4. **Flash** `%NAME → done`.

```javascript
// Inputs:  CLIP (string), STATE (0..4)
// Outputs: OUT (string), NAME (string)
var CYCLE = ['invert', 'lower', 'upper', 'title', 'sentence'];
var SMALL = new Set(['a','an','and','as','at','but','by','for','if','in',
                     'nor','of','on','or','so','the','to','up','yet','via']);

function invert(s){var o='';for(var i=0;i<s.length;i++){var c=s[i],l=c.toLowerCase(),u=c.toUpperCase();
  o+=(c===l&&c!==u)?u:(c===u&&c!==l)?l:c;}return o;}
function title(s){return s.replace(/(\S+)/g,function(w,_,o,f){
  var lc=w.toLowerCase(),s2=lc.replace(/[^a-z']/gi,''),
      atStart=o===0||/[\.\!\?]\s*$/.test(f.slice(0,o));
  return (!atStart&&SMALL.has(s2))?lc:lc.replace(/[a-zà-ÿ]/,function(c){return c.toUpperCase();});});}
function sentence(s){return s.toLowerCase().replace(/(^|[\.\!\?]\s+|[\r\n]+)(\S)/g,
  function(_,a,b){return a+b.toUpperCase();});}

var name = CYCLE[Number(STATE)||0];
var OUT = name==='invert'?invert(CLIP)
        : name==='lower'?CLIP.toLowerCase()
        : name==='upper'?CLIP.toUpperCase()
        : name==='title'?title(CLIP)
        : sentence(CLIP);
var NAME = name;
```

The clipboard is read in the trigger and written back at the end, so
you never leave the source app. Bind the task to a quick-tile or a
gesture for a Shift+F3-equivalent feel on Android.
