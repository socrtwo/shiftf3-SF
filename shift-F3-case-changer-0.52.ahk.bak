;Shift F3 Case Changer - 0.52 Alpha
;AutoHotkey Version: 1.x
;Language:       English
;Platform:       Win9x/NT
;
;  Author:         socrtwo <socrtwo@s2services.com>, "None" and "Lazslo" from the AutoHotKey forum, most of the coding of this script is by "None".  See - http://www.autohotkey.com/forum/viewtopic.php?t=55868
;  Summary: Change case in any Windows app by holding down the shift key and tapping F3. 
;  Details: In any Windows application this script translates holding down the shift key and tapping on F3 into cycling your selected text through invert, lower, upper, title and sentence cases.  This program uses the clipbaoard in order to carry out its function but returns at least the text that existed on the clipbaord in the beginning. This program copies the similar feature in MS Word that uses the same key combination. The feature in Word omits the invert and sentence case but in Word, these can be accessed from customizing the Quick Access Toolbar. The script is mostly by None with the sentence case function by Laszlo both from the AutoHotKey forum. The script idea was suggested and after minor synthesis and adjustment compiled by me socrtwo (Paul D Pruitt).
;  Bugs: Send any you find to me.  Right now it works poorly in Excel, probably due to the attempt to capture the clipboard to the variable Clip_Save before working on the text.

;#NOENV  ; Recommended for performance and compatibility with future AutoHotkey releases.--I commented this out since it seems to limit the effective text selection size.--03/23-2010
SetWorkingDir %A_ScriptDir%  ; Ensures a consistent starting directory.
State=0
*F3::
If !GetKeyState("Shift","P")
  Return
;Clip_Save = %Clipboard%                                            ; save original contents of clipboard
Send ^x
StringReplace, Length, Clipboard, `r`n , `n, All
Len:=strlen(Length)
If State=0
 Changed:=Invert(Clipboard) ;call the INVERT function
If State=1
 Stringlower, Changed, Clipboard
If State=2
 Stringupper, Changed, Clipboard
If State=3
 Stringlower, Changed, Clipboard ,T
If State=4
 Changed:=Title(Clipboard) ;call the TITLE function
State:=State<4 ? State+1 : 0
Clipboard:=Changed
Send ^v
Sleep 50
SendInput {Blind}{Left %Len%}
;Clipboard = %Clip_Save%
Return

INVERT(String){
AutoTrim,Off
StringCaseSense,On
lower=abcdefghijklmnopqrstuvwxyzæøå
upper=ABCDEFGHIJKLMNOPQRSTUVWXYZÆØÅ
StringLen,INVlength,String

Loop,%INVlength%
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
Return %string%
}

Title(Title){
X = I,AHK,AutoHotkey

Title := RegExReplace(Title, "[\.\!\?]\s+|\R+", "$0þ") ; mark 1st letters of sentences with char 254
Loop Parse, Title, þ
{
   StringLower L, A_LoopField
   I := Chr(Asc(A_LoopField))
   StringUpper I, I
   S .= I SubStr(L,2)
}
Loop Parse, X, `,
   S := RegExReplace(S,"i)\b" A_LoopField "\b", A_LoopField)

Return %S%
}