import {
	TextField,
	RadioGroup,
	FormControlLabel,
	Radio,
	Checkbox,
	Select,
	MenuItem,
	IconButton,
	FormControl,
	FormLabel,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";

export const TextQuestion = ({ value, onChange, required, label }) => (
	<TextField
		fullWidth
		variant="outlined"
		value={value}
		onChange={(e) => onChange(e.target.value)}
		required={required}
		label={label}
	/>
);

export const MultipleChoiceQuestion = ({ options, value, onChange, label }) => (
	<FormControl fullWidth>
		<FormLabel>{label}</FormLabel>
		<RadioGroup
			value={value}
			onChange={(e) => onChange(e.target.value)}
		>
			{options.map((option) => (
				<FormControlLabel
					key={option}
					value={option}
					control={<Radio />}
					label={option}
				/>
			))}
		</RadioGroup>
	</FormControl>
);

export const CheckboxQuestion = ({ options, value = [], onChange, label }) => (
	<FormControl fullWidth>
		<FormLabel>{label}</FormLabel>
		<div>
			{options.map((option) => (
				<FormControlLabel
					key={option}
					control={
						<Checkbox
							checked={value.includes(option)}
							onChange={(e) => {
								const newValue = e.target.checked
									? [...value, option]
									: value.filter((v) => v !== option);
								onChange(newValue);
							}}
						/>
					}
					label={option}
				/>
			))}
		</div>
	</FormControl>
);

export const DropdownQuestion = ({ options, value, onChange, label }) => (
	<FormControl fullWidth>
		<Select
			value={value || ""}
			onChange={(e) => onChange(e.target.value)}
			label={label}
			displayEmpty
		>
			<MenuItem
				value=""
				disabled
			>
				{label}
			</MenuItem>
			{options.map((option) => (
				<MenuItem
					key={option}
					value={option}
				>
					{option}
				</MenuItem>
			))}
		</Select>
	</FormControl>
);

export const RatingQuestion = ({ value, onChange, label }) => (
	<FormControl fullWidth>
		<FormLabel>{label}</FormLabel>
		<div style={{ display: "flex", gap: "8px" }}>
			{[1, 2, 3, 4, 5].map((num) => (
				<IconButton
					key={num}
					onClick={() => onChange(num)}
				>
					<StarIcon
						sx={{
							color: num <= value ? "#ffc107" : "#e0e0e0",
							fontSize: "24px",
						}}
					/>
				</IconButton>
			))}
		</div>
	</FormControl>
);
