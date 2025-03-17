import React, { useState } from "react";
import {
	Card,
	CardHeader,
	CardContent,
	Typography,
	Avatar,
	IconButton,
	Button,
	Dialog,
	DialogTitle,
	DialogContent,
	List,
	ListItem,
	ListItemAvatar,
	ListItemText,
	Divider,
	Chip,
	Box,
	Menu,
	MenuItem,
	useTheme,
} from "@mui/material";
import {
	Favorite,
	FavoriteBorder,
	CommentOutlined,
	AttachFile,
	OpenInNew,
	MoreVert,
} from "@mui/icons-material";
import { formatDistanceToNow } from "date-fns";

const PostCard = ({ post }) => {
	const theme = useTheme();
	const [openComments, setOpenComments] = useState(false);
	const [liked, setLiked] = useState(
		post.interactions.likes.includes("67cb18d2fd4d5bd90bfc14dd")
	);
	const [likesCount, setLikesCount] = useState(post.interactions.likes.length);
	const [anchorEl, setAnchorEl] = useState(null);

	const handleMenuOpen = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleMenuClose = () => {
		setAnchorEl(null);
	};

	const handleLike = () => {
		setLiked(!liked);
		setLikesCount(liked ? likesCount - 1 : likesCount + 1);
	};

	return (
		<Card
			sx={{
				maxWidth: 600,
				margin: "auto",
				mt: 3,
				borderRadius: 4,
				boxShadow: theme.shadows[3],
				"&:hover": { boxShadow: theme.shadows[6] },
				transition: "box-shadow 0.3s ease",
			}}
		>
			{/* Author Section */}
			<CardHeader
				avatar={
					<Avatar
						src={post.author.avatar}
						sx={{ bgcolor: theme.palette.primary.main }}
					>
						{/* {post.author.name[0]} */}
					</Avatar>
				}
				action={
					<>
						<IconButton onClick={handleMenuOpen}>
							<MoreVert />
						</IconButton>
						<Menu
							anchorEl={anchorEl}
							open={Boolean(anchorEl)}
							onClose={handleMenuClose}
						>
							<MenuItem onClick={handleMenuClose}>Save Post</MenuItem>
							<MenuItem onClick={handleMenuClose}>Report</MenuItem>
						</Menu>
					</>
				}
				title={
					<Typography
						variant="subtitle1"
						fontWeight="600"
					>
						{post.author.name}
					</Typography>
				}
				subheader={
					<Typography
						variant="caption"
						color="text.secondary"
					>
						{post.author.role} • {formatDistanceToNow(new Date(post.createdAt))}{" "}
						ago
					</Typography>
				}
			/>

			{/* Post Content */}
			<CardContent sx={{ pt: 0 }}>
				<Typography
					variant="body1"
					paragraph
					sx={{ lineHeight: 1.6 }}
				>
					{post.content.text}
				</Typography>

				{/* Attachments */}
				{post.content.attachments.map((attachment, index) => (
					<Box
						key={index}
						sx={{ mb: 2, position: "relative" }}
					>
						{attachment.fileType === "pdf" ? (
							<Button
								variant="contained"
								startIcon={<AttachFile />}
								endIcon={<OpenInNew />}
								href={attachment.fileUrl}
								target="_blank"
								sx={{
									borderRadius: 3,
									textTransform: "none",
									bgcolor: theme.palette.grey[200],
									color: "text.primary",
									"&:hover": { bgcolor: theme.palette.grey[300] },
								}}
							>
								View PDF
							</Button>
						) : (
							<Box
								sx={{
									borderRadius: 3,
									overflow: "hidden",
									position: "relative",
									"&:hover img": { transform: "scale(1.02)" },
								}}
							>
								<img
									src={attachment.fileUrl}
									alt={`Attachment ${index}`}
									style={{
										width: "100%",
										transition: "transform 0.3s ease",
									}}
								/>
							</Box>
						)}
					</Box>
				))}
			</CardContent>

			{/* Tags & Mentions */}
			<Box sx={{ px: 2, display: "flex", gap: 1, flexWrap: "wrap" }}>
				{post.tags.map((tag, index) => (
					<Chip
						key={index}
						label={`#${tag}`}
						size="small"
						sx={{
							bgcolor: theme.palette.primary.light,
							color: theme.palette.primary.contrastText,
						}}
					/>
				))}
				{post.mentions.map((mention, index) => (
					<Chip
						key={index}
						label={`@${mention}`}
						size="small"
						sx={{
							bgcolor: theme.palette.secondary.light,
							color: theme.palette.secondary.contrastText,
						}}
					/>
				))}
			</Box>

			{/* Interaction Buttons */}
			<Box
				sx={{
					display: "flex",
					alignItems: "center",
					px: 2,
					py: 1,
					borderTop: `1px solid ${theme.palette.divider}`,
				}}
			>
				<IconButton
					onClick={handleLike}
					sx={{
						color: liked ? theme.palette.error.main : "inherit",
						"&:hover": { color: theme.palette.error.light },
					}}
				>
					{liked ? <Favorite /> : <FavoriteBorder />}
					<Typography
						variant="body2"
						sx={{ ml: 0.5 }}
					>
						{likesCount}
					</Typography>
				</IconButton>

				<IconButton
					onClick={() => setOpenComments(true)}
					sx={{
						color: "text.secondary",
						"&:hover": { color: theme.palette.primary.main },
					}}
				>
					<CommentOutlined />
					<Typography
						variant="body2"
						sx={{ ml: 0.5 }}
					>
						{post.interactions.comments.length}
					</Typography>
				</IconButton>
			</Box>

			{/* Comments Dialog */}
			<Dialog
				open={openComments}
				onClose={() => setOpenComments(false)}
				fullWidth
				maxWidth="sm"
			>
				<DialogTitle
					sx={{
						bgcolor: theme.palette.background.paper,
						borderBottom: `1px solid ${theme.palette.divider}`,
					}}
				>
					Comments ({post.interactions.comments.length})
				</DialogTitle>
				<DialogContent sx={{ p: 0 }}>
					<List>
						{post.interactions.comments.map((comment) => (
							<React.Fragment key={comment._id}>
								<ListItem
									alignItems="flex-start"
									sx={{ py: 2 }}
								>
									<ListItemAvatar>
										<Avatar src={comment.userAvatar}>
											{/* {comment.userName[0]} */}
										</Avatar>
									</ListItemAvatar>
									<ListItemText
										primary={
											<>
												<Typography
													variant="subtitle2"
													component="span"
													fontWeight="600"
												>
													{comment.userName}
												</Typography>
												<Typography
													variant="caption"
													color="text.secondary"
													sx={{ ml: 1 }}
												>
													{formatDistanceToNow(new Date(comment.timestamp))} ago
												</Typography>
											</>
										}
										secondary={
											<Typography
												variant="body2"
												color="text.primary"
											>
												{comment.text}
											</Typography>
										}
									/>
								</ListItem>

								{/* Replies */}
								{comment.replies.map((reply) => (
									<ListItem
										key={reply._id}
										alignItems="flex-start"
										sx={{
											py: 2,
											pl: 8,
											bgcolor: theme.palette.background.default,
										}}
									>
										<ListItemAvatar sx={{ minWidth: 40 }}>
											<Avatar sx={{ width: 32, height: 32 }}>
												{/* {reply.userName[0]} */}
											</Avatar>
										</ListItemAvatar>
										<ListItemText
											primary={
												<>
													<Typography
														variant="subtitle2"
														component="span"
														fontWeight="600"
													>
														{reply.userName}
													</Typography>
													<Typography
														variant="caption"
														color="text.secondary"
														sx={{ ml: 1 }}
													>
														{formatDistanceToNow(new Date(reply.timestamp))} ago
													</Typography>
												</>
											}
											secondary={
												<Typography
													variant="body2"
													color="text.primary"
												>
													{reply.text}
												</Typography>
											}
										/>
									</ListItem>
								))}
								<Divider
									variant="inset"
									component="li"
								/>
							</React.Fragment>
						))}
					</List>
				</DialogContent>
			</Dialog>
		</Card>
	);
};

export default PostCard;
