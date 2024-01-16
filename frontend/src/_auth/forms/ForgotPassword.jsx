import PropTypes from "prop-types";
import { forgotPassword } from "../../api/api_Auth";

export const ForgotPassword = ({ toggleForm, setRequestDetails }) => {
	ForgotPassword.propTypes = {
		toggleForm: PropTypes.func.isRequired,
		setRequestDetails: PropTypes.func.isRequired,
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const { email } = e.target;

		setRequestDetails({ isFetching: true, details: "Sending..." });
		await forgotPassword(email.value).then((res) => {
			if (res.code === "ERR_NETWORK") {
				setRequestDetails({
					isFetching: false,
					details: "Network error. Please try again later.",
					confirmation: true,
					error: true,
				});
			} else if (res.status !== 200) {
				setRequestDetails({
					isFetching: false,
					details: res.response.data,
					confirmation: true,
					error: true,
				});
			} else {
				setRequestDetails({
					isFetching: false,
					details: "Email sent!",
					confirmation: true,
				});
			}
		});
	};

	return (
		<>
			<form className="auth-form" onSubmit={handleSubmit}>
				<div className="imput-container">
					<label className="form-label" htmlFor="email">
						Email:
					</label>
					<input
						className="form-input"
						min="3"
						max="25"
						type="email"
						name="email"
						id="email"
						required
					/>
				</div>

				<div className="controls">
					<button className="form-btn form-submit-btn" type="submit">
						{"Send >"}
					</button>
					<button
						className="form-btn"
						onClick={() => toggleForm("login")}
					>
						{"< Back"}
					</button>
				</div>
			</form>
		</>
	);
};
