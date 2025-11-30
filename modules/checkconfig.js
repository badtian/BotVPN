const axios = require('axios');
const { exec } = require('child_process');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./sellvpn.db');

async function checkconfigsshvpn(username, password, exp, iplimit, serverId) {
  console.log(`Check config SSH account for ${username}`);

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
      const web_URL = `http://${domain}/vps/checkconfigsshvpn/${username}`; // Contoh: http://domainmu.com/vps/checkconfigsshvpn/aristore
      const AUTH_TOKEN = server.auth;
      const LIMIT_IP = iplimit;

      const curlCommand = `curl -s -X GET "${web_URL}" \
-H "Authorization: ${AUTH_TOKEN}" \
-H "accept: application/json"`;

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
async function checkconfigvmess(username, exp, quota, iplimit, serverId) {
  console.log(`Check config VMess account for ${username}`);

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
      const web_URL = `http://${domain}/vps/checkconfigvmess/${username}`; // contoh: http://domain.com/vps/checkconfigvmess/aristore
      const AUTH_TOKEN = server.auth;
      const LIMIT_IP = iplimit;
      const KUOTA = quota;

  const curlCommand = `curl -s -X GET "${web_URL}" \
-H "Authorization: ${AUTH_TOKEN}" \
-H "accept: application/json"`;

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
async function checkconfigvless(username, exp, quota, iplimit, serverId) {
  console.log(`Check config VLESS account for ${username}`);

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
      const web_URL = `http://${domain}/vps/checkconfigvless/${username}`; // contoh: http://domain.com/vps/checkconfigvless/aristore
      const AUTH_TOKEN = server.auth;
      const LIMIT_IP = iplimit;
      const KUOTA = quota;

  const curlCommand = `curl -s -X GET "${web_URL}" \
-H "Authorization: ${AUTH_TOKEN}" \
-H "accept: application/json"`;

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
async function checkconfigtrojan(username, exp, quota, iplimit, serverId) {
  console.log(`Check config TROJAN account for ${username}`);

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
      const web_URL = `http://${domain}/vps/checkconfigtrojan/${username}`; // contoh: http://domain.com/vps/checkconfigtrojan/aristore
      const AUTH_TOKEN = server.auth;
      const LIMIT_IP = iplimit;
      const KUOTA = quota;

  const curlCommand = `curl -s -X GET "${web_URL}" \
-H "Authorization: ${AUTH_TOKEN}" \
-H "accept: application/json"`;

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
  
module.exports = { checkconfigtrojan, checkconfigvless, checkconfigvmess, checkconfigsshvpn };
