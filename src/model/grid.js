export default data => ({
	tagName: "div",
	style: "overflow: hidden",
	children: [
		{
			tagName: "h1",
			style: "text-align: center",
			textContent: `${data.from} to ${data.to}`
		},
		{
			tagName: "section",
			style: "display: grid;grid-template-columns: 35vw 30vw 30vw;grid-gap: 25px; overflow: hidden; height: 100%",
			children: [
				{
					tagName: "div",
					style: "overflow: hidden",
					children: [
						{
							tagName: "select",
							style: "width: 100%",
							identifier: "case",
							children: data.cases.map(case_ => ({
								tagName: "option",
								value: case_.value,
								textContent: case_.name
							}))
						},
						{
							tagName: "textarea",
							identifier: "input"
						}
					]
				},
				{
					tagName: "pre",
					style: "overflow: auto; word-break: break-word; white-space: break-spaces;",
					identifier: "inputPreview"
				},
				{
					tagName: "div",
					className: "output",
					style: "overflow: auto; word-break: break-word; white-space: break-spaces;",
					identifier: "output"
				}
			]
		}
	]
})