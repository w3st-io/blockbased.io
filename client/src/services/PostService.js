/**
 * %%%%%%%%%%%%%%%%%%%%%%
 * %%% BLOCK SERVICES %%%
 * %%%%%%%%%%%%%%%%%%%%%%
*/
// [IMPORT] //
import axios from 'axios'


// [AUTH-TOKEN-SETUP] //
async function authAxios() {
	return axios.create({
		baseURL: '/api/posts',
		headers: { authorization: `Bearer ${localStorage.usertoken}` }
	})
}


/******************* [CRUD] *******************/
// [CREATE] Auth Required //
async function s_create(cat_id, title, text) {
	try {
		const authAxios = await this.authAxios()
		
		return (await authAxios.post('/create', { cat_id, title, text })).data
	}
	catch (err) {
		return {
			executed: false,
			status: false,
			message: `PostService: Error --> ${err}`
		}
	}
}


// [READ] Single Post //
async function s_read(post_id) {
	try {
		const authAxios = await this.authAxios()
		
		return (await authAxios.get(`/read/${post_id}`)).data
	}
	catch (err) {
		return {
			executed: false,
			status: false,
			message: `PostService: Error --> ${err}`
		}
	}
}


/******************* [LIKE-SYSTEM] *******************/
// ADD/REMOVE LIKE //
async function s_like(post_id, postUser_id) {
	try {
		const authAxios = await this.authAxios()

		return (await authAxios.post('/like', { post_id, postUser_id })).data
	}
	catch (err) {
		return {
			executed: false,
			status: false,
			error: `PostService: Error --> ${err}`
		}
	}
}


async function s_unlike(post_id) {
	try {
		const authAxios = await this.authAxios()

		return (await authAxios.post('/unlike', { post_id })).data
	}
	catch (err) {
		return {
			executed: false,
			status: false,
			error: `PostService: Error --> ${err}`
		}
	}
}


/******************* [FOLLOW SYSTEM] *******************/
// ADD/REMOVE LIKE //
async function s_follow(post_id) {
	try {
		const authAxios = await this.authAxios()

		return (await authAxios.post('/follow', { post_id })).data
	}
	catch (err) {
		return {
			executed: false,
			status: false,
			error: `PostService: Error --> ${err}`
		}
	}
}

async function s_unfollow(post_id) {
	try {
		const authAxios = await this.authAxios()

		return (await authAxios.post('/unfollow', { post_id })).data
	}
	catch (err) {
		return {
			executed: false,
			status: false,
			error: `PostService: Error --> ${err}`
		}
	}
}


// [EXPORT] //
export default {
	authAxios,
	s_create,
	s_read,
	s_like,
	s_unlike,
	s_follow,
	s_unfollow,
}