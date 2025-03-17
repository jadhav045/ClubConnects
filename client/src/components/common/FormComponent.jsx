const FormLayout = ({ title, children, onSubmit }) => {
	return (
		<div className="max-w-4xl mx-auto p-6 bg-green rounded-2xl shadow-xl">
			<h2 className="text-2xl font-semibold mb-4">{title}</h2>
			<form
				onSubmit={onSubmit}
				className="space-y-4"
			>
				{children}
			</form>
		</div>
	);
};
export default FormLayout;
