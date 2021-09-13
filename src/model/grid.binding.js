import { Binding, Observable } from "domodel"

export default class extends Binding {

	onCreated() {

		const { output, template } = this.properties

		const grid = new Observable()

		if(output === "html") {
			this.listen(grid, "update", async () => {
				this.identifier.inputPreview.textContent = template.toHTML(this.identifier.input.value)
				this.identifier.output.innerHTML = template.toHTML(this.identifier.input.value)
			})
		} else if(output === "bbcode") {
			this.listen(grid, "update", async () => {
				this.identifier.inputPreview.textContent = template.toBBCode(this.identifier.input.value)
				this.identifier.output.innerHTML = template.toHTML(template.toBBCode(this.identifier.input.value))
			})
		}

		this.identifier.input.addEventListener("input", () => grid.emit("update"))

		this.identifier.case.addEventListener("change", () => {
			this.identifier.input.value = this.identifier.case.value
			grid.emit("update")
		})

		this.identifier.input.value = this.identifier.case.value

		grid.emit("update")

	}

}
