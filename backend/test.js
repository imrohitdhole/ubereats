const bcrypt = require('bcryptjs');

(async () => {
  const hash = "$2a$10$izg5VnRgIV2.bfkoWRPPsem4tPuavAfzQdg0c6d9dPEV.TjRREYdu";
  const result = await bcrypt.compare("taco@123", hash);
  console.log('Password match result:', result);
})();