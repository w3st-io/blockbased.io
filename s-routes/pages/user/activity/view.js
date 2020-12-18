/**
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
 * %%% USER ACTIVITY VIEW PAGE %%%
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
*/
// [REQUIRE] //
const cors = require('cors')
const express = require('express')


// [REQUIRE] Personal //
const activitiesCollection = require('../../../../s-collections/activitiesCollection')
const Auth = require('../../../../s-middleware/Auth')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


router.get(
	'/:user_id/:sort/:limit/:page',
	Auth.userToken(),
	async (req, res) => {
		try {
			// [VALIDATE] //
			if (
				Number.isInteger(parseInt(req.params.sort)) &&
				Number.isInteger(parseInt(req.params.limit)) &&
				Number.isInteger(parseInt(req.params.page))
			) {
				// [INIT] //
				const sort = parseInt(req.params.sort)
				const limit = parseInt(req.params.limit)
				const pageIndex = parseInt(req.params.page) - 1
				const skip = pageIndex * limit

				const activitiesObj = await activitiesCollection.c_readAllSortByUser(
					req.params.user_id,
					sort,
					limit,
					skip
				)
				
				// [COUNT] Activities //
				activitiesObj.count = (
					await activitiesCollection.c_countAllByUser(req.params.user_id)
				).count
				
				// [COUNT] Calculate Pages //
				activitiesObj.pageCount = Math.ceil(activitiesObj.count / limit)

				res.status(200).send(activitiesObj)
			}
			else {
				res.status(200).send({
					executed: true,
					status: false,
					message: '/pages/user/activity: Invalid params'
				})
			}
		}
		catch (err) {
			res.status(200).send({
				executed: false,
				status: false,
				message: `/pages/activity: Error --> ${err}`
			})
		}
	}
)


// [EXPORT] //
module.exports = router