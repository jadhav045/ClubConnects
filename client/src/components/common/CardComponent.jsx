import { Card, CardContent, CardHeader } from "@mui/material";

export const CardComponent = ({ title, children, style }) => {
	return (
		<Card style={style}>
			{title && <CardHeader title={title} />}
			<CardContent>{children}</CardContent>
		</Card>
	);
};
