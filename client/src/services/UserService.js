/**
 * %%%%%%%%%%%%%%%%%%%%% *
 * %%% USER SERVICES %%% *
 * %%%%%%%%%%%%%%%%%%%%% *
*/
// [IMPORT] //
import jwtDecode from 'jwt-decode'
import axios from 'axios'


// [AUTH-TOKEN-SETUP] //
async function authAxios() {
	return axios.create({
		baseURL: '/api/users',
		headers: {
			authorization: `Bearer ${localStorage.usertoken}`
		}
	})
}


/******************* [USER PROFILE] *******************/
// [TOKEN DECODE] //
async function getUserTokenDecodeData() {
	let decoded = {}

	if (localStorage.usertoken) {
		decoded = jwtDecode(localStorage.usertoken)
	}
	else {
		decoded = {
			_id: '',
			email: '',
			username: '',
			first_name: '',
			last_name: '',
		}
	}

	return decoded
}


// [READ] //
async function s_read(user_id) {
	const authAxios = await this.authAxios()
	let profileData = ''

	if (user_id) { profileData = await authAxios.get(`/read/${user_id}`) }
	else { profileData = await authAxios.get('/read') }

	return profileData.data
}


// [UPDATE] //
async function s_update(img_url) {
	const authAxios = await this.authAxios()

	return await authAxios.post(`/update`, { img_url })
}


/******************* [USER LOGIN/REGISTER] *******************/
// [LOGIN] //
async function login(email, password) {
	const authAxios = await this.authAxios()

	try { return await authAxios.post('/login', { email, password }) }
	catch(e) { return e }
}


// [REGISTER] //
async function register(first_name, last_name, username, email, password) {
	const authAxios = await this.authAxios()
	
	try {
		return await authAxios.post('/register', {
			first_name,
			last_name,
			username,
			email,
			password,
		})
	}
	catch (e) {
		console.log(`Caught Error --> ${e}`)
		return e	
	}
}


// [EXPORT] //
export default {
	authAxios,
	getUserTokenDecodeData,
	s_read,
	s_update,
	login,
	register,
}