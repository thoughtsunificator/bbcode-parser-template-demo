import "assets/stylesheets.css"

import { Core } from "domodel"
import { Template } from "@thoughtsunificator/bbcode-parser-template"
import * as Codes from "@thoughtsunificator/bbcode-parser-template-example"

import BBCODE_SAMPLES from "data/bbcode_samples.js"
import HTML_SAMPLES from "data/html_samples.js"

import GridModel from "./model/grid.js"

import GridBinding from "./model/grid.binding.js"

const template = new Template(Object.values(Codes), document)

window.addEventListener("load", async function() {

	Core.run(GridModel({ from: "BBCode", to: "HTML", cases: BBCODE_SAMPLES }), { parentNode: document.body, binding: new GridBinding({ output: "html", template }) })
	Core.run(GridModel({ from: "HTML", to: "BBCode", cases: HTML_SAMPLES }), { parentNode: document.body, binding: new GridBinding({ output: "bbcode", template }) })

})
