; ============================================================================
;  Shift F3 Case Changer  ―  AutoHotkey v2
;  Cycles the selected text through five cases each time you press Shift+F3:
;
;      iNVERT cASE  →  lower case  →  UPPER CASE  →  Title Case  →  Sentence case
;
;  Original AHK v1 author: socrtwo (Paul D Pruitt) with code by "None" and
;  "Lazslo" from the AutoHotKey forum.
;  This v2 port: 2026 — preserves the original behavior while using the
;  current AutoHotkey v2 syntax and reliable clipboard handling.
;
;  Requirements: AutoHotkey v2.0+ (https://www.autohotkey.com/)
;  License: MIT (see ../LICENSE)
; ============================================================================

#Requires AutoHotkey v2.0
#SingleInstance Force
SetWorkingDir A_ScriptDir

global State := 0  ; 0 invert  1 lower  2 upper  3 title  4 sentence

+F3:: {
    global State
    saved := ClipboardAll()
    A_Clipboard := ""
    Send("^c")
    if !ClipWait(0.5) {
        A_Clipboard := saved
        return
    }
    text := A_Clipboard
    if (text = "") {
        A_Clipboard := saved
        return
    }

    switch State {
        case 0: out := Invert(text)
        case 1: out := StrLower(text)
        case 2: out := StrUpper(text)
        case 3: out := TitleCase(text)
        case 4: out := SentenceCase(text)
        default: out := text
    }
    State := Mod(State + 1, 5)

    A_Clipboard := out
    Send("^v")
    Sleep 60

    ; Re-select the replaced text by sending Shift+Left for each char
    ; (mirrors the original AHK v1 behavior).
    len := StrLen(out)
    if (len > 0)
        Send("+{Left " . len . "}")

    Sleep 30
    A_Clipboard := saved
    saved := ""  ; release the ClipboardAll buffer
}

Invert(s) {
    out := ""
    Loop Parse, s {
        c := A_LoopField
        lower := StrLower(c)
        upper := StrUpper(c)
        if (c == lower && c !== upper)
            out .= upper
        else if (c == upper && c !== lower)
            out .= lower
        else
            out .= c
    }
    return out
}

TitleCase(s) {
    static small := "|a|an|and|as|at|but|by|for|if|in|nor|of|on|or|so|the|to|up|yet|via|"
    static keep := Map("i", "I", "ahk", "AHK", "autohotkey", "AutoHotkey")
    result := ""
    pos := 1
    haystack := s
    ; Lowercase first; we'll capitalize per-word below.
    haystack := StrLower(haystack)
    ; Walk through whitespace-separated tokens.
    Loop Parse, haystack, " `t`r`n", "" {
        word := A_LoopField
        prefix := A_Index = 1 ? "" : SubStr(haystack, pos, 1)
        if (word = "") {
            result .= prefix
            pos += 1
            continue
        }
        atStart := (A_Index = 1) || RegExMatch(SubStr(s, 1, pos), "[\.\!\?]\s*$")
        clean := RegExReplace(word, "[^a-zA-Z']", "")
        if (!atStart && InStr(small, "|" . clean . "|")) {
            piece := word
        } else {
            piece := StrUpper(SubStr(word, 1, 1)) . SubStr(word, 2)
        }
        if (keep.Has(StrLower(clean)))
            piece := RegExReplace(piece, "i)\b" . clean . "\b", keep[StrLower(clean)])
        result .= (A_Index = 1 ? "" : " ") . piece
        pos += StrLen(word) + 1
    }
    return result
}

SentenceCase(s) {
    lc := StrLower(s)
    out := ""
    capNext := true
    Loop Parse, lc {
        c := A_LoopField
        if (capNext && RegExMatch(c, "\S")) {
            out .= StrUpper(c)
            capNext := false
        } else {
            out .= c
            if RegExMatch(c, "[\.\!\?\r\n]")
                capNext := true
        }
    }
    return out
}
