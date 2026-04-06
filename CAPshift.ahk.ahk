;
; AutoHotkey Version: 1.x
; Language:       English
; Platform:       Win9x/NT
; Author:         Skrommel
;
; Script Function: With AutoHotKey installedm and this script run, holding down the caps lock key for ).4 second will produce a menu with extended features for the key including converting to upper, lower, title and invert cases.  This script was published in the directory of F3 Case changer simply lifting the code from this Autohotkey forum page: http://www.autohotkey.com/forum/topic4559.html.  It is used without permission but the forum is public.
;	
;

#NoEnv  ; Recommended for performance and compatibility with future AutoHotkey releases.
SendMode Input  ; Recommended for new scripts due to its superior speed and reliability.
SetWorkingDir %A_ScriptDir%  ; Ensures a consistent starting directory.

;CAPshift.ahk
;Slows down and extends the cap locks key.
;
;Hold for 0.4 sec to toggle caps lock on or off.
;Hold for 0.9 sec to show a menu that converts selected text to
; UPPER CASE, lower case, Title Case or iNVERT cASE.
;Skrommel @2005

SetTimer,TOOLTIP,1500
SetTimer,TOOLTIP,Off

CapsLock::
counter=0
Loop,90
{
  Sleep,10
  counter+=1
  If counter=40
    SoundPlay,%SYSTEMROOT%\Media\ding.wav
  GetKeyState,state,CapsLock,P
  If state=U
    Break
}
If counter=90
  Gosub,MENU
Else
If counter>40
{
  GetKeyState,state,CapsLock,T
  If state=D
    Gosub,OFF
  Else
    Gosub,ON
}
Return

MENU:
Menu,convert,Add
Menu,convert,Delete
Menu,convert,Add,CAPshift,EMPTY
Menu,convert,Add,
Menu,Convert,Add,CapsLock &On,On
Menu,Convert,Add,&CapsLock Off,Off
Menu,convert,Add,
Menu,convert,Add,&UPPER CASE,UPPER
Menu,convert,Add,&lower case,LOWER
Menu,convert,Add,&Title Case,TITLE
Menu,convert,Add,&iNVERT cASE,INVERT
Menu,convert,Add,
Menu,convert,Add,&About,ABOUT
Menu,convert,Add,&Quit,QUIT
Menu,convert,Default,CapShift
Menu,convert,Show
Return

EMPTY:
Return

TOOLTIP:
ToolTip,
SetTimer,TOOLTIP,Off
Return

ON:
SetCapsLockState,On
ToolTip,CapsLock On
SetTimer,TOOLTIP,On
Return

OFF:
SetCapsLockState,Off
ToolTip,CapsLock Off
SetTimer,TOOLTIP,On
Return

CUT:
Send,^x
ClipWait,1
string=%clipboard%
Return

PASTE:
clipboard=%string%
Send,^v
Return

UPPER:
Gosub,CUT
StringUpper,string,string
Gosub,PASTE
ToolTip,Selection converted to UPPER CASE
SetTimer,TOOLTIP,On
Return

LOWER:
Gosub,CUT
StringLower,string,string
Gosub,PASTE
ToolTip,Selection converted to lower case
SetTimer,TOOLTIP,On
Return

TITLE:
Gosub,CUT
StringLower,string,string,T
Gosub,PASTE
ToolTip,Selection converted to Title Case
SetTimer,TOOLTIP,On
Return

INVERT:
AutoTrim,Off
StringCaseSense,On
Gosub,CUT
lower=abcdefghijklmnopqrstuvwxyzæøå
upper=ABCDEFGHIJKLMNOPQRSTUVWXYZÆØÅ
StringLen,length,string

Loop,%length%
{
  StringLeft,char,string,1
  StringGetPos,pos,lower,%char%
  pos+=1
  If pos<>0
    StringMid,char,upper,%pos%,1
  Else
  {   
    StringGetPos,pos,upper,%char%
    pos+=1
    If pos<>0
      StringMid,char,lower,%pos%,1
  }
  StringTrimLeft,string,string,1
  string=%string%%char%
}
ToolTip,Selection converted to iNVERTED cASE
SetTimer,TOOLTIP,On
Gosub,PASTE
Return

ABOUT:
MsgBox,0,CAPshift,CAPshift slows down and extends the caps lock key.`n`nHold down caps lock for 0.4 sec to toggle caps lock on or off.`nHold for 0.9 sec to show a menu that converts selected text to UPPER CASE, lower case, Title Case or iNVERT cASE.`n`nSkrommel @2005
Return

QUIT:
ExitApp