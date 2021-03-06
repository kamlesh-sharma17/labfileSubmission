let getDbConnection = require("../util/db_util");
const User = require("./user_m");
const hashUtil = require('../util/hash_util');
let db;
class Teacher {
	static async registerTeacher(email, name, password, dept) {
		try {
			let result;
			db = !db ? await getDbConnection() : db;
			result = await db.collection("teachers").findOne({
				_id: email
			});
			if (result) return "EMAIL_EXISTS";
			// check if a student is trying to register with same email

			result = await db.collection("students").findOne({
				_id: email
			});

			if (result) return "STUDENT_EMAIL_EXISTS";
			else {
				let hashedPass = await hashUtil.hashPass(password);
				result = await db.collection("teachers").insertOne({
					name: name,
					_id: email,
					dept,
					password: hashedPass,
					verified: false,
					joinedOn: Date.now(),
					teaches: [],
				});
				/*
				teaches ;[
				  {
				    subName:"",
				    subCode:"",
				    sem:
				  }
				] 
				 */
				if (result) {
					return true;
				}
			}
		} catch (error) {
			throw new Error(error);
		}
	}

	static async loginTeacher(email, password) {
		try {
			let result;
			result = await User.loginUser(email, password, "teachers");
			return result;
		} catch (error) {
			throw new Error(error);
		}
	}

	// static async addSubject(email, sem, subCode) {

	// }
}

module.exports = Teacher;