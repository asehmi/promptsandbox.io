export default function RangeInput({
	handleChange,
	numberValue,
	propertyName,
	min = 0,
	max = 1,
	step = 0.01,
}: {
	numberValue: number;
	propertyName: string;
	handleChange: (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
	) => void;
	min?: number;
	max?: number;
	step?: number;
}) {
	return (
		<div className="flex items-center justify-between gap-2 pt-4">
			<div className="items-star flex w-full flex-col">
				<label htmlFor={propertyName} className="block text-sm font-medium text-slate-900 ">
					{propertyName}
				</label>
				<input
					id={`${propertyName}-slider`}
					name={`${propertyName}-slider`}
					type="range"
					min={min}
					max={max}
					step={step}
					className="w-full"
					value={numberValue}
					onChange={handleChange}
				/>
			</div>
			<input
				type="number"
				name={propertyName}
				id={`${propertyName}`}
				min={min}
				max={max}
				step={step}
				className="block w-1/3 rounded-md border-0 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 sm:py-1.5 sm:text-sm sm:leading-6"
				value={numberValue}
				onChange={handleChange}
			/>
		</div>
	);
}
