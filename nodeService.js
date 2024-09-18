const Service = require("node-windows").Service
const svc = new Service({
  name: "servicePokimoneSnack",
  description: "this is server for dashbord pokemone snack",
  script:
    "C:\\Users\\abdel\\Desktop\\work\\projet_snack_pokemon_dashbord\\server\\index.js",
});
svc.on("install", function () {
  svc.start();
});
svc.install();