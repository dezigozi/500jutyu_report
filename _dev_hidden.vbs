Dim ws, fso, dir, p

Set ws  = WScript.CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")

dir = fso.GetParentFolderName(WScript.ScriptFullName)
ws.CurrentDirectory = dir

' npm PATH補完
Dim pgFiles, nvmSym, nvmHome
pgFiles = ws.Environment("Process").Item("ProgramFiles")
nvmSym  = ws.Environment("Process").Item("NVM_SYMLINK")
nvmHome = ws.Environment("Process").Item("NVM_HOME")

p = ws.Environment("Process").Item("PATH")
If pgFiles <> "" Then
    If fso.FileExists(pgFiles & "\nodejs\npm.cmd") Then p = pgFiles & "\nodejs;" & p
End If
If nvmSym <> "" Then
    If fso.FileExists(nvmSym & "\npm.cmd") Then p = nvmSym & ";" & p
End If
If nvmHome <> "" Then
    If fso.FileExists(nvmHome & "\npm.cmd") Then p = nvmHome & ";" & p
End If
ws.Environment("Process").Item("PATH") = p

' ウィンドウ非表示(0)で起動、終了を待たない(False)
ws.Run "cmd.exe /c npm run dev", 0, False

Set fso = Nothing
Set ws  = Nothing
