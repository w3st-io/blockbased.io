/**
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
 * %%% ADMINISTRATION USER SERVICES %%%
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
*/
// [IMPORT] //
import axios from 'axios'


// [AUTH-TOKEN-SETUP] //
async function authAxios() {
	return axios.create({
		baseURL: '/api/administration/users',
		headers: {
			authorization: `Bearer ${localStorage.usertoken}`,
			authorization2: `Bearer ${localStorage.admintoken}`
		}
	})
}


/******************* [CRUD] *******************/
// [UPDATE] Auth Required //
async function s_update(user_id, img_url, bio) {
	try {
		const authAxios = await this.authAxios()

		return (await authAxios.post(`/update`, { user_id, img_url, bio })).data
	}
	catch (err) {
		return {
			executed: false,
			status: false,
			message: `UserService: Error --> ${err}`
		}
	}
	
}

/******************* [USER PROFILE] *******************/
async function s_banUser(user_id, hours) {
	try {
		const authAxios = await this.authAxios()

		return (await authAxios.post(`/ban`, { user_id, hours })).data
	}
	catch (err) {
		return {
			executed: false,
			status: false,
			message: `UserService: Error --> ${err}`
		}
	}
}


// [EXPORT] //
export default {
	authAxios,
	s_update,
	s_banUser,
}