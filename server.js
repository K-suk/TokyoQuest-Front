const express = require('express');
const next = require('next');
const helmet = require('helmet');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  // セキュリティヘッダーを追加するためにHelmetを使用
  server.use(helmet());

  // HTTPSリダイレクト
  server.use((req, res, next) => {
    if (req.headers['x-forwarded-proto'] !== 'https' && !dev) {
      res.redirect(`https://${req.headers.host}${req.url}`);
    } else {
      next();
    }
  });

  server.all('*', (req, res) => handle(req, res));

  const PORT = process.env.PORT || 3000;
  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${PORT}`);
  });
});
