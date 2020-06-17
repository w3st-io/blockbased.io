/**
 * %%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% COMMENT SERVICES %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%% *
*/
// [IMPORT] //
import axios from 'axios'

class CommentService {
	/******************* [COMMENT CRUD] *******************/
	// [CREATE] //
	static createComment(block_id, user_id, email, username, comment) {
		return axios.post(`/api/comments/create`, {
			block_id,
			user_id,
			email,
			username,
			comment,
		})	
	}


	// [READ-ALL] //
	static getAllComments(block_id, amountPerPage, pageNumber) {
		// multiply page nubmer with # comments per page to know how much to skip
		let skip = pageNumber * amountPerPage

		let result = new Promise ((resolve, reject) => {
			axios.get(`/api/comments/read-all/${block_id}/${amountPerPage}/${skip}`)
				.then((res) => {
					const data = res.data
					resolve(
						data.map((comment) => ({
							...comment,
						}))
					)
				})
				.catch((err) => { reject(err) })
		})

		return result
	}
}

// [EXPORT] //
export default CommentService