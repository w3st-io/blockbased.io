/**
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% NOTIFICATIONS ROUTES %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%% *
*/
// [REQUIRE] //
const cors = require('cors')
const express = require('express')
require('dotenv').config()


// [REQUIRE] Personal //
const Collections = require('../../server-collections')
const Auth = require('../../server-middleware/AuthMiddleware')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


// [EXPORT] //
module.exports = router