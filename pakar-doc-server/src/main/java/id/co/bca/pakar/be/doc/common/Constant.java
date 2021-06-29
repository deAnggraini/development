package id.co.bca.pakar.be.doc.common;

public class Constant {
	public static final String OK_ACK = "00";

	public static enum ApiResponseCode {
		// This will call enum constructor with one
		// String argument
		LOGIN_SUCCEED(new String[] { "00", "LOGIN SUCCESS" }),
		INCORRECT_USERNAME_PASSWORD(new String[] { "01", "Incorrect User ID or password" }),
		SESSION_HAS_EXPIRED(new String[] { "02", "Session has expired" }),
		LOGOUT_SUCCEED(new String[] { "00", "User Has Logout" }),
		LOGOUT_FAILED(new String[] { "01", "User Fail to Logout" }),
		REFRESH_TOKEN_SUCCEED(new String[] { "00", "New Access Token Has Generated" }),
		REFRESH_TOKEN_FAILED(new String[] { "01", "Fail to Generate new access token" }),
		EXIST_USER_PROFILE(new String[] { "00", "User Profile Exist" }),
		USER_PROFILE_NOT_FOUND(new String[] { "01", "User Profile Not Found" }),
		MENU_PROFILE_SUCCESS(new String[] { "00", "Menu Success Load" }),
		OK(new String[] { "00", "Response OK" }),
		GENERAL_ERROR(new String[] { "01", "Undefined Error" }),
		REQUEST_PARAM_INVALID(new String[] { "01", "Request Param Invalid" }),
		MAX_UPLOAD_EXCEEDED(new String[] { "01", "Exceeded file size" }),
		DATA_NOT_FOUND(new String[] { "01", "Not found data" }),
		INVALID_STRUCUTURE_LEVEL(new String[] { "01", "Level Structure Invalid" });;

		// declaring private variable for getting values
		private String action[];

		// getter method
		public String[] getAction() {
			return this.action;
		}

		// enum constructor - cannot be public or protected
		private ApiResponseCode(String[] action) {
			this.action = action;
		}
	}
}