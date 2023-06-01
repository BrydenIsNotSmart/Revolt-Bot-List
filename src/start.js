global.config = require("../config.js");

require("./clients/manager/client.js");
require("./clients/servers/client.js"); 
require("./database/connect.js");
require("./server/app.js");
