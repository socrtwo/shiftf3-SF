; Shift+F3 Case Changer — Windows installer (NSIS)
;
; Wraps the standalone PyInstaller binary (shiftf3-py.exe) in a proper
; installer: Program Files install, Start Menu shortcut, an optional
; "run at login" Startup shortcut (this is a background hotkey app), an
; uninstaller, and an Add/Remove Programs entry.
;
; NSIS resolves File/license/icon/OutFile paths relative to THIS script's
; directory (windows/), so all paths below are written relative to windows/
; (i.e. "..\" reaches the repo root). PyInstaller writes shiftf3-py.exe to
; the repo-root dist/, hence the "..\dist\..." default.
;
; Build:
;     makensis /DVERSION=1.0.8 windows\installer.nsi
;
; Produces: ..\out\shiftf3-setup-<version>.exe (relative to windows/).

Unicode true
SetCompressor /SOLID lzma

!ifndef VERSION
  !define VERSION "0.0.0"
!endif
!ifndef SRCEXE
  !define SRCEXE "..\dist\shiftf3-py.exe"
!endif
!ifndef OUTFILE
  !define OUTFILE "..\out\shiftf3-setup-${VERSION}.exe"
!endif

!define APPNAME "Shift+F3 Case Changer"
!define COMPANY "socrtwo"
!define EXENAME "shiftf3-py.exe"
!define REGKEY "Software\Microsoft\Windows\CurrentVersion\Uninstall\Shift+F3 Case Changer"

!include "MUI2.nsh"

Name "${APPNAME} ${VERSION}"
OutFile "${OUTFILE}"
InstallDir "$PROGRAMFILES64\${APPNAME}"
InstallDirRegKey HKLM "Software\${APPNAME}" "InstallDir"
RequestExecutionLevel admin

!define MUI_ICON "..\32X32-shift-F3-case-changer-icon.ico"
!define MUI_UNICON "..\32X32-shift-F3-case-changer-icon.ico"
!define MUI_ABORTWARNING

!insertmacro MUI_PAGE_LICENSE "..\LICENSE"
!insertmacro MUI_PAGE_COMPONENTS
!insertmacro MUI_PAGE_DIRECTORY
!insertmacro MUI_PAGE_INSTFILES
!define MUI_FINISHPAGE_RUN "$INSTDIR\${EXENAME}"
!define MUI_FINISHPAGE_RUN_TEXT "Launch ${APPNAME} now"
!insertmacro MUI_PAGE_FINISH

!insertmacro MUI_UNPAGE_CONFIRM
!insertmacro MUI_UNPAGE_INSTFILES

!insertmacro MUI_LANGUAGE "English"

; ---- Install ----------------------------------------------------------

Section "${APPNAME} (required)" SecCore
  SectionIn RO
  SetOutPath "$INSTDIR"
  File "/oname=${EXENAME}" "${SRCEXE}"
  File "/oname=LICENSE.txt" "..\LICENSE"

  ; Start Menu shortcut
  CreateDirectory "$SMPROGRAMS\${APPNAME}"
  CreateShortcut "$SMPROGRAMS\${APPNAME}\${APPNAME}.lnk" "$INSTDIR\${EXENAME}"
  CreateShortcut "$SMPROGRAMS\${APPNAME}\Uninstall ${APPNAME}.lnk" "$INSTDIR\uninstall.exe"

  ; Registry: install dir + Add/Remove Programs entry
  WriteRegStr HKLM "Software\${APPNAME}" "InstallDir" "$INSTDIR"
  WriteRegStr HKLM "${REGKEY}" "DisplayName" "${APPNAME}"
  WriteRegStr HKLM "${REGKEY}" "DisplayVersion" "${VERSION}"
  WriteRegStr HKLM "${REGKEY}" "Publisher" "${COMPANY}"
  WriteRegStr HKLM "${REGKEY}" "DisplayIcon" "$INSTDIR\${EXENAME}"
  WriteRegStr HKLM "${REGKEY}" "UninstallString" "$INSTDIR\uninstall.exe"
  WriteRegStr HKLM "${REGKEY}" "QuietUninstallString" "$INSTDIR\uninstall.exe /S"
  WriteRegDWORD HKLM "${REGKEY}" "NoModify" 1
  WriteRegDWORD HKLM "${REGKEY}" "NoRepair" 1

  WriteUninstaller "$INSTDIR\uninstall.exe"
SectionEnd

Section "Run at login (background hotkey)" SecStartup
  ; Shift+F3 is a global-hotkey background app; most users want it always on.
  CreateShortcut "$SMSTARTUP\${APPNAME}.lnk" "$INSTDIR\${EXENAME}"
SectionEnd

Section "Desktop shortcut" SecDesktop
  CreateShortcut "$DESKTOP\${APPNAME}.lnk" "$INSTDIR\${EXENAME}"
SectionEnd

LangString DESC_SecCore    ${LANG_ENGLISH} "The ${APPNAME} application and license."
LangString DESC_SecStartup ${LANG_ENGLISH} "Start ${APPNAME} automatically when you log in (recommended for a hotkey app)."
LangString DESC_SecDesktop ${LANG_ENGLISH} "Add a shortcut to your Desktop."

!insertmacro MUI_FUNCTION_DESCRIPTION_BEGIN
  !insertmacro MUI_DESCRIPTION_TEXT ${SecCore}    $(DESC_SecCore)
  !insertmacro MUI_DESCRIPTION_TEXT ${SecStartup} $(DESC_SecStartup)
  !insertmacro MUI_DESCRIPTION_TEXT ${SecDesktop} $(DESC_SecDesktop)
!insertmacro MUI_FUNCTION_DESCRIPTION_END

; ---- Uninstall --------------------------------------------------------

Section "Uninstall"
  Delete "$INSTDIR\${EXENAME}"
  Delete "$INSTDIR\LICENSE.txt"
  Delete "$INSTDIR\uninstall.exe"
  RMDir "$INSTDIR"

  Delete "$SMPROGRAMS\${APPNAME}\${APPNAME}.lnk"
  Delete "$SMPROGRAMS\${APPNAME}\Uninstall ${APPNAME}.lnk"
  RMDir "$SMPROGRAMS\${APPNAME}"
  Delete "$SMSTARTUP\${APPNAME}.lnk"
  Delete "$DESKTOP\${APPNAME}.lnk"

  DeleteRegKey HKLM "${REGKEY}"
  DeleteRegKey HKLM "Software\${APPNAME}"
SectionEnd
