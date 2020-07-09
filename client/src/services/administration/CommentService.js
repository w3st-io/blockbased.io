/**
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% ADMINISTRATION COMMENT SERVICES %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
*/
// [IMPORT] //
import axios from 'axios'


// [AUTH TOKEN SETUP] //
const token = localStorage.admintoken
const authAxios = axios.create({
	baseURL: '/api/administration/comments',
	headers: {
		authorization2: `Bearer ${token}`
	}
})


class AdministrationCommentService {
	/******************* [COMMENT] *******************/
	// [READ-ALL] Auth Required //
	static adminGetAllComments(amountPerPage, pageNumber) {
		// * page number with # comments per page to calc. skip

		let skip = pageNumber * amountPerPage

		let result = new Promise ((resolve, reject) => {
			authAxios.get(`/read-all/${amountPerPage}/${skip}`)
				.then((res) => {
					resolve(
						res.data.map((comment) => ({
							...comment,
							createdAt: new Date(comment.createdAt).toLocaleString(),
						}))
					)
				})
				.catch((err) => { reject(err) })
		})

		return result
	}


	// [READ-ALL] Auth Required - Within a Block //
	static getAllComments(block_id, amountPerPage, pageNumber) {
		// * page number with # comments per page to calc. skip
		let skip = pageNumber * amountPerPage

		let result = new Promise ((resolve, reject) => {
			authAxios.get(`/read-all/${block_id}/${amountPerPage}/${skip}`)
				.then((res) => {
					const data = res.data
					resolve(
						data.map((comment) => ({ ...comment }))
					)
				})
				.catch((err) => { reject(err) })
		})

		return result
	}


	// [READ] //
	static getComment(comment_id) {
		let result = new Promise ((resolve, reject) => {
			authAxios.get(`/read/${comment_id}`)
			.then((res) => { resolve(res.data) })
			.catch((err) => { reject(err) })
		})

		return result
	}


	// [UPDATE] //
	static updateComment(comment_id, comment) {
		console.log('comment:',comment)
		let result = new Promise ((resolve, reject) => {
			authAxios.post(`/update/${comment_id}`, { comment })
				.then((res) => { resolve(res.data) })
				.catch((err) => { reject(err) })
		})

		return result
	}


	// [DELETE] //
	static deleteComment(comment_id) {
		let result = new Promise ((resolve, reject) => {
			authAxios.delete(`/delete/${comment_id}`)
				.then((res) => { resolve(res) })
				.catch((err) => { reject(err) })
		})

		return result	
	}
}


// [EXPORT] //
export default AdministrationCommentService