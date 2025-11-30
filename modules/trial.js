const axios = require('axios');
const { exec } = require('child_process');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./sellvpn.db');
async function trialssh(username, password, exp, iplimit, serverId) {
  console.log(`Creating SSH account for ${username} with expiry ${exp} days, IP limit ${iplimit}, and password ${password}`);

  // Validasi username
if (!/^[a-z0-9-]+$/.test(username)) {
    return '❌ Username tidak valid. Mohon gunakan hanya huruf dan angka tanpa spasi.';
  }

  return new Promise((resolve) => {
    db.get('SELECT * FROM Server WHERE id = ?', [serverId], (err, server) => {
      if (err || !server) {
        console.error('❌ Error fetching server:', err?.message || 'server null');
        return resolve('❌ Server tidak ditemukan. Silakan coba lagi.');
      }

      const domain = server.domain;
      const param = `/vps/trialsshvpn`;
      const web_URL = `http://${domain}${param}`; // misalnya: http://idnusastb.domain.web.id/vps/sshvpn
      const AUTH_TOKEN = server.auth;
      const days = exp;
      const KUOTA = "0"; // jika perlu di-hardcode, bisa diubah jadi parameter juga
      const LIMIT_IP = iplimit;

  const curlCommand = `curl -s -X POST "${web_URL}" \
-H "Authorization: ${AUTH_TOKEN}" \
-H "Content-Type: application/json" \
-H "Accept: application/json" \
-d '{"timelimit":"3h"}'`;

      exec(curlCommand, (_, stdout) => {
        let d;
        try {
          d = JSON.parse(stdout);
        } catch (e) {
          console.error('❌ Gagal parsing JSON:', e.message);
          console.error('🪵 Output:', stdout);
          return resolve('❌ Format respon dari server tidak valid.');
        }

        if (d?.meta?.code !== 200 || !d.data) {
          console.error('❌ Respons error:', d);
          const errMsg = d?.message || d?.meta?.message || JSON.stringify(d, null, 2);
          return resolve(`❌ Respons error:\n${errMsg}`);
        }

        const s = d.data;
        console.log("⚠️ FULL DATA:", JSON.stringify(d, null, 2));

        const msg = `𝘼𝘾𝘾𝙊𝙐𝙉𝙏 𝘾𝙍𝙀𝘼𝙏𝙀𝘿
━━━━━━━━━━━━━━━━━━━━━
🔹 *ISP:* \`${s.ISP}\`
🔹 *Host:* \`${s.hostname}\`
👤 *Username:* \`${s.username}\`
🔑 *Password:* \`${s.password}\`
🔹 *Port WS:* \`80, 8080\`
🔹 *SSL/TLS:* \`443, 8443\`
🔹 *Squid:* \`3128\` 
🔹 *UDP Custom:* \`1-65535\`
🔹 *UDPGW:* \`7100 - 7600\`  
━━━━━━━━━━━━━━━━━━━━━
⚙️ Payload WS:  
\`GET / HTTP/1.1[crlf]Host: ${s.hostname}[crlf]Connection: Keep-Alive[crlf]User-Agent: [ua][crlf]Upgrade: websocket[crlf][crlf]\`

⚙️ Payload WSS:  
\`GET wss://BUG.COM/ HTTP/1.1[crlf]Host: ${s.hostname}[crlf]Connection: Keep-Alive[crlf]User-Agent: [ua][crlf]Upgrade: websocket[crlf][crlf]\`
━━━━━━━━━━━━━━━━━━━━━
📅 *Expired Until:* \`${s.exp}\`
━━━━━━━━━━━━━━━━━━━━━`;
        return resolve(msg);
      });
    });
  });
}
async function trialvmess(username, exp, quota, limitip, serverId) {
  console.log(`Creating VMess account for ${username} with expiry ${exp} days, quota ${quota} GB, IP limit ${limitip}`);

  // Validasi username
if (!/^[a-z0-9-]+$/.test(username)) {
    return '❌ Username tidak valid. Mohon gunakan hanya huruf dan angka tanpa spasi.';
  }

  return new Promise((resolve) => {
    db.get('SELECT * FROM Server WHERE id = ?', [serverId], (err, server) => {
      if (err || !server) {
        console.error('❌ Error fetching server:', err?.message || 'server null');
        return resolve('❌ Server tidak ditemukan. Silakan coba lagi.');
      }

      const domain = server.domain;
      const param = `/vps/trialvmessall`;
      const web_URL = `http://${domain}${param}`; // contoh: http://idnusastb.domain.web.id/vps/vmess
      const AUTH_TOKEN = server.auth;
      const days = exp;
      const KUOTA = quota;
      const LIMIT_IP = limitip;

  const curlCommand = `curl -s -X POST "${web_URL}" \
-H "Authorization: ${AUTH_TOKEN}" \
-H "Content-Type: application/json" \
-H "Accept: application/json" \
-d '{"timelimit":"3h"}'`;

      exec(curlCommand, (_, stdout) => {
        let d;
        try {
          d = JSON.parse(stdout);
        } catch (e) {
          console.error('❌ Gagal parsing JSON:', e.message);
          console.error('🪵 Output:', stdout);
          return resolve('❌ Format respon dari server tidak valid.');
        }

        if (d?.meta?.code !== 200 || !d.data) {
          console.error('❌ Respons error:', d);
          const errMsg = d?.message || d?.meta?.message || JSON.stringify(d, null, 2);
          return resolve(`❌ Respons error:\n${errMsg}`);
        }

        const s = d.data;
        console.log("⚠️ FULL DATA:", JSON.stringify(d, null, 2));

        const msg = `𝘼𝘾𝘾𝙊𝙐𝙉𝙏 𝘾𝙍𝙀𝘼𝙏𝙀𝘿
━━━━━━━━━━━━━━━━━━━━━
🔹 *User:* \`${s.username}\`
🔹 *Host:* \`${s.hostname}\`
🔹 *CITY:* \`${s.CITY}\`
🔹 *ISP:* \`${s.ISP}\`
🔹 *UUID:* \`${s.uuid}\`
🔹 *Port TLS:* \`443\`, \`8443\` 
🔹 *Port NTLS:* \`80\`, \`8080\`  
🔹 *Port Any:* \`2052\`, \`2053\`, \`8880\`
🔹 *Network:* \`ws,grpc,upgrade\`
🔹 *gRPC Path:* \`vmess\`  
🔹 *WS Path:* \`${s.path.stn}\`
🔹 *Multi Path:* \`${s.path.multi}\`
🔹 *Upgrade Path:* \`${s.path.up}\`  
🔹 *Expired:* \`${s.expired}\`
━━━━━━━━━━━━━━━━━━━━━
🔗 *TLS:* 
 \`${s.link.tls}\`
━━━━━━━━━━━━━━━━━━━━━
🔗 *NON-TLS:* 
 \`${s.link.none}\`
━━━━━━━━━━━━━━━━━━━━━
🔗 *GRPC:* 
 \`${s.link.grpc}\`
━━━━━━━━━━━━━━━━━━━━━
🔗 *TLS UPGRADE:* 
 \`${s.link.uptls}\`
━━━━━━━━━━━━━━━━━━━━━
🔗 *NON-TLS UPGRADE:* 
 \`${s.link.upntls}\`
━━━━━━━━━━━━━━━━━━━━━`;

        return resolve(msg);
      });
    });
  });
}

async function trialvless(username, exp, quota, limitip, serverId) {
  console.log(`Creating VLESS account for ${username} with expiry ${exp} days, quota ${quota} GB, limit IP ${limitip}`);

  // Validasi username
if (!/^[a-z0-9-]+$/.test(username)) {
    return '❌ Username tidak valid. Mohon gunakan hanya huruf dan angka tanpa spasi.';
  }

  return new Promise((resolve) => {
    db.get('SELECT * FROM Server WHERE id = ?', [serverId], (err, server) => {
      if (err || !server) {
        console.error('❌ Error fetching server:', err?.message || 'server null');
        return resolve('❌ Server tidak ditemukan. Silakan coba lagi.');
      }

      const domain = server.domain;
      const param = `/vps/trialvlessall`;
      const web_URL = `http://${domain}${param}`; // Contoh: http://domainmu.com/vps/vless
      const AUTH_TOKEN = server.auth;
      const days = exp;
      const KUOTA = quota;
      const LIMIT_IP = limitip;

  const curlCommand = `curl -s -X POST "${web_URL}" \
-H "Authorization: ${AUTH_TOKEN}" \
-H "Content-Type: application/json" \
-H "Accept: application/json" \
-d '{"timelimit":"3h"}'`;

      exec(curlCommand, (_, stdout) => {
        let d;
        try {
          d = JSON.parse(stdout);
        } catch (e) {
          console.error('❌ Gagal parsing JSON:', e.message);
          console.error('🪵 Output:', stdout);
          return resolve('❌ Format respon dari server tidak valid.');
        }

        if (d?.meta?.code !== 200 || !d.data) {
          console.error('❌ Respons error:', d);
          const errMsg = d?.message || d?.meta?.message || JSON.stringify(d, null, 2);
          return resolve(`❌ Respons error:\n${errMsg}`);
        }

        const s = d.data;
        console.log("⚠️ FULL DATA:", JSON.stringify(d, null, 2));

        const msg = `𝘼𝘾𝘾𝙊𝙐𝙉𝙏 𝘾𝙍𝙀𝘼𝙏𝙀𝘿
━━━━━━━━━━━━━━━━━━━━━
🔹 *User:* \`${s.username}\`
🔹 *Host:* \`${s.hostname}\`
🔹 *CITY:* \`${s.CITY}\`
🔹 *ISP:* \`${s.ISP}\`
🔹 *UUID:* \`${s.uuid}\`
🔹 *Port TLS:* \`443\`, \`8443\` 
🔹 *Port NTLS:* \`80\`, \`8080\`  
🔹 *Port Any:* \`2052\`, \`2053\`, \`8880\`
🔹 *Network:* \`ws,grpc,upgrade\`
🔹 *gRPC Path:* \`vmess\`  
🔹 *WS Path:* \`${s.path.stn}\`
🔹 *Multi Path:* \`${s.path.multi}\`
🔹 *Upgrade Path:* \`${s.path.up}\`  
🔹 *Expired:* \`${s.expired}\`
━━━━━━━━━━━━━━━━━━━━━
🔗 *TLS:* 
 \`${s.link.tls}\`
━━━━━━━━━━━━━━━━━━━━━
🔗 *NON-TLS:* 
 \`${s.link.none}\`
━━━━━━━━━━━━━━━━━━━━━
🔗 *GRPC:* 
 \`${s.link.grpc}\`
━━━━━━━━━━━━━━━━━━━━━
🔗 *TLS UPGRADE:* 
 \`${s.link.uptls}\`
━━━━━━━━━━━━━━━━━━━━━
🔗 *NON-TLS UPGRADE:* 
 \`${s.link.upntls}\`
━━━━━━━━━━━━━━━━━━━━━`;

        return resolve(msg);
      });
    });
  });
}
async function trialtrojan(username, exp, quota, limitip, serverId) {
  console.log(`Creating Trojan account for ${username} with expiry ${exp} days, quota ${quota} GB, limit IP ${limitip}`);

  // Validasi username
if (!/^[a-z0-9-]+$/.test(username)) {
    return '❌ Username tidak valid. Mohon gunakan hanya huruf dan angka tanpa spasi.';
  }

  return new Promise((resolve) => {
    db.get('SELECT * FROM Server WHERE id = ?', [serverId], (err, server) => {
      if (err || !server) {
        console.error('❌ Error fetching server:', err?.message || 'server null');
        return resolve('❌ Server tidak ditemukan. Silakan coba lagi.');
      }

      const domain = server.domain;
      const param = `/vps/trialtrojanall`;
      const web_URL = `http://${domain}${param}`; // contoh: http://domainmu.com/vps/trojan
      const AUTH_TOKEN = server.auth;
      const days = exp;
      const KUOTA = quota;
      const LIMIT_IP = limitip;

  const curlCommand = `curl -s -X POST "${web_URL}" \
-H "Authorization: ${AUTH_TOKEN}" \
-H "Content-Type: application/json" \
-H "Accept: application/json" \
-d '{"timelimit":"3h"}'`;

      exec(curlCommand, (_, stdout) => {
        let d;
        try {
          d = JSON.parse(stdout);
        } catch (e) {
          console.error('❌ Gagal parsing JSON:', e.message);
          console.error('🪵 Output:', stdout);
          return resolve('❌ Format respon dari server tidak valid.');
        }

        if (d?.meta?.code !== 200 || !d.data) {
          console.error('❌ Respons error:', d);
          const errMsg = d?.message || d?.meta?.message || JSON.stringify(d, null, 2);
          return resolve(`❌ Respons error:\n${errMsg}`);
        }

        const s = d.data;
        console.log("⚠️ FULL DATA:", JSON.stringify(d, null, 2));

        const msg = `𝘼𝘾𝘾𝙊𝙐𝙉𝙏 𝘾𝙍𝙀𝘼𝙏𝙀𝘿
━━━━━━━━━━━━━━━━━━━━━
🔹 *User:* \`${s.username}\`
🔹 *Host:* \`${s.hostname}\`
🔹 *CITY:* \`${s.CITY}\`
🔹 *ISP:* \`${s.ISP}\`
🔹 *UUID:* \`${s.uuid}\`
🔹 *Port TLS:* \`443\`, \`8443\` 
🔹 *Port NTLS:* \`80\`, \`8080\`  
🔹 *Port Any:* \`2052\`, \`2053\`, \`8880\`
🔹 *Network:* \`ws,grpc,upgrade\`
🔹 *gRPC Path:* \`vmess\`  
🔹 *WS Path:* \`${s.path.stn}\`
🔹 *Multi Path:* \`${s.path.multi}\`
🔹 *Upgrade Path:* \`${s.path.up}\`  
🔹 *Expired:* \`${s.expired}\`
━━━━━━━━━━━━━━━━━━━━━
🔗 *TLS:* 
 \`${s.link.tls}\`
━━━━━━━━━━━━━━━━━━━━━
🔗 *NON-TLS:* 
 \`${s.link.none}\`
━━━━━━━━━━━━━━━━━━━━━
🔗 *GRPC:* 
 \`${s.link.grpc}\`
━━━━━━━━━━━━━━━━━━━━━
🔗 *TLS UPGRADE:* 
 \`${s.link.uptls}\`
━━━━━━━━━━━━━━━━━━━━━
🔗 *NON-TLS UPGRADE:* 
 \`${s.link.upntls}\`
━━━━━━━━━━━━━━━━━━━━━`;

        return resolve(msg);
      });
    });
  });
}


//create shadowsocks ga ada di potato
async function trialshadowsocks(username, exp, quota, limitip, serverId) {
  console.log(`Creating Shadowsocks account for ${username} with expiry ${exp} days, quota ${quota} GB, limit IP ${limitip} on server ${serverId}`);
  
  // Validasi username
if (!/^[a-z0-9-]+$/.test(username)) {
    return '❌ Username tidak valid. Mohon gunakan hanya huruf dan angka tanpa spasi.';
  }

  // Ambil domain dari database
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM Server WHERE id = ?', [serverId], (err, server) => {
      if (err) {
        console.error('Error fetching server:', err.message);
        return resolve('❌ Server tidak ditemukan. Silakan coba lagi.');
      }

      if (!server) return resolve('❌ Server tidak ditemukan. Silakan coba lagi.');

      const domain = server.domain;
      const auth = server.auth;
      const param = `:5888/createshadowsocks?user=${username}&exp=${exp}&quota=${quota}&iplimit=${limitip}&auth=${auth}`;
      const url = `http://${domain}${param}`;
      axios.get(url)
        .then(response => {
          if (response.data.status === "success") {
            const shadowsocksData = response.data.data;
            const msg = `
🌟 *AKUN SHADOWSOCKS PREMIUM* 🌟

🔹 *Informasi Akun*
┌─────────────────────
│ *Username* : \`${shadowsocksData.username}\`
│ *Domain*   : \`${shadowsocksData.domain}\`
│ *NS*       : \`${shadowsocksData.ns_domain}\`
│ *Port TLS* : \`443\`
│ *Port HTTP*: \`80\`
│ *Alter ID* : \`0\`
│ *Security* : \`Auto\`
│ *Network*  : \`Websocket (WS)\`
│ *Path*     : \`/shadowsocks\`
│ *Path GRPC*: \`shadowsocks-grpc\`
└─────────────────────
🔐 *URL SHADOWSOCKS TLS*
\`\`\`
${shadowsocksData.ss_link_ws}
\`\`\`
🔒 *URL SHADOWSOCKS GRPC*
\`\`\`
${shadowsocksData.ss_link_grpc}
\`\`\`
🔒 *PUBKEY*
\`\`\`
${shadowsocksData.pubkey}
\`\`\`
┌─────────────────────
│ Expiry: \`${shadowsocksData.expired}\`
│ Quota: \`${shadowsocksData.quota === '0 GB' ? 'Unlimited' : shadowsocksData.quota}\`
│ IP Limit: \`${shadowsocksData.ip_limit === '0' ? 'Unlimited' : shadowsocksData.ip_limit} IP\`
└─────────────────────
Save Account Link: [Save Account](https://${shadowsocksData.domain}:81/shadowsocks-${shadowsocksData.username}.txt)
✨ Selamat menggunakan layanan kami! ✨
`;
              console.log('Shadowsocks account created successfully');
              return resolve(msg);
            } else {
              console.log('Error creating Shadowsocks account');
              return resolve(`❌ Terjadi kesalahan: ${response.data.message}`);
            }
          })
        .catch(error => {
          console.error('Error saat membuat Shadowsocks:', error);
          return resolve('❌ Terjadi kesalahan saat membuat Shadowsocks. Silakan coba lagi nanti.');
        });
    });
  });
}

module.exports = { trialssh, trialvmess, trialvless, trialtrojan, trialshadowsocks }; 




