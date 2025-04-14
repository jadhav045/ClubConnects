import { Typography } from "@mui/material";

export const TypographyComponent = ({
	variant = "body1",
	color = "inherit",
	fontWeight,
	children,
}) => {
	return (
		<Typography
			variant={variant}
			color={color}
			style={{ fontWeight }}
		>
			{children}
		</Typography>
	);
};
