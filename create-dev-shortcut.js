/**
 * プロジェクトフォルダに「開発で起動.lnk」を作成（ダブルクリックで npm run dev）。
 * 初回のみ: npm run shortcut:dev
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const appDir = __dirname;
const vbsPath = path.join(appDir, '_dev_hidden.vbs');
const shortcutPath = path.join(appDir, '開発で起動.lnk');

const iconCandidates = ['app-icon.ico', 'app-icon.png'];

function pickIcon() {
  for (const f of iconCandidates) {
    const p = path.join(appDir, f);
    if (fs.existsSync(p)) return p;
  }
  return '';
}

/** PowerShell 単一引用符内用 */
function psEscape(s) {
  return String(s).replace(/'/g, "''");
}

function createShortcut() {
  const iconPath = pickIcon();
  const iconLoc = iconPath ? `${psEscape(iconPath)},0` : '';

  const psScript = `
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$ErrorActionPreference = 'Stop'
$ws = New-Object -ComObject WScript.Shell
$sc = $ws.CreateShortcut('${psEscape(shortcutPath)}')
$sc.TargetPath = 'wscript.exe'
$sc.Arguments = '"${psEscape(vbsPath)}"'
$sc.WorkingDirectory = '${psEscape(appDir)}'
$sc.Description = '架装品500受注レポート（ターミナルなし起動）'
${iconLoc ? `$sc.IconLocation = '${iconLoc}'` : ''}
$sc.Save()
Write-Host 'OK'
`;

  const tempPs = path.join(appDir, '_mkdevlink.ps1');
  fs.writeFileSync(tempPs, '\ufeff' + psScript, 'utf16le');

  try {
    const out = execSync(
      `powershell -NoProfile -ExecutionPolicy Bypass -File "${tempPs}"`,
      { encoding: 'utf8' }
    );
    console.log(out.trim());
    console.log(`作成しました: ${shortcutPath}`);
    console.log('エクスプローラーで「開発で起動」をダブルクリックすると開発モードが起動します。');
  } finally {
    try { fs.unlinkSync(tempPs); } catch (_) {}
  }
}

if (!fs.existsSync(vbsPath)) {
  console.error('_dev_hidden.vbs が見つかりません:', vbsPath);
  process.exit(1);
}

try {
  createShortcut();
} catch (err) {
  console.error(err.message);
  process.exit(1);
}
