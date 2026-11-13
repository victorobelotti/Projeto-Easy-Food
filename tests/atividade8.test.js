const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
const read = file => fs.readFileSync(path.join(root, file), "utf8");
test("schema inclui imagem de usuário, categoria e vínculo de proprietário", () => {
 const s = read("prisma/schema.prisma"); assert.match(s, /imageUrl\s+String\?/); assert.match(s, /ownerId\s+Int\?/); assert.match(s, /category\s+String\?/); assert.match(s, /dishes\s+Dish\[\]/);
});
test("upload de perfil exige JWT e usa o usuário autenticado", () => {
 const r = read("src/modules/auth/auth.routes.js"), c = read("src/modules/auth/auth.controller.js"), s = read("src/modules/auth/auth.service.js");
 assert.match(r, /router\.post\(["']\/me\/image["'],\s*authenticate,\s*upload\.single\(["']image["']\)/); assert.match(c, /uploadProfileImage\(req\.user\.id,\s*req\.file\.buffer\)/); assert.match(s, /optimizeImage\(buffer,\s*["']users["']\)/);
});
test("upload de prato exige JWT e valida propriedade", () => {
 const r = read("src/modules/dishes/dish.routes.js"), c = read("src/modules/dishes/dish.controller.js"), s = read("src/modules/dishes/dish.service.js");
 assert.match(r, /router\.post\(["']\/dishes\/:dishId\/image["'],\s*authenticate,\s*upload\.single\(["']image["']\)/); assert.match(c, /req\.params\.dishId,\s*req\.file\.buffer,\s*req\.user\.id/); assert.match(s, /ensureOwnership\(dish\.restaurant/);
});
test("serviço compartilhado aceita apenas destinos users e dishes", () => {
 const s = read("src/modules/shared/image.service.js"), u = read("src/modules/shared/upload.middleware.js"); assert.match(s, /new Set\(\["dishes",\s*"users"\]\)/); assert.match(u, /image\/jpeg/); assert.match(u, /image\/png/); assert.match(u, /image\/webp/); assert.match(u, /5\s*\*\s*1024\s*\*\s*1024/);
});
test("app publica uploads e trata limite de tamanho", () => { const a = read("src/app.js"); assert.match(a, /app\.use\(["']\/uploads["'],\s*express\.static/); assert.match(a, /LIMIT_FILE_SIZE/); assert.match(a, /status\(413\)/); });
