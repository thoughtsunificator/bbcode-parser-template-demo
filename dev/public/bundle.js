
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
(function () {
	'use strict';

	/** @module binding */

	class Binding {

		/**
		 * @param {object} properties
		 */
		constructor(properties) {
			this._identifier = {};
			this._properties = {...properties};
			this._parent = null;
			this._children = [];
			this._listeners = [];
		}

		/**
		 * @return {object}
		 */
		get identifier() {
			return this._identifier
		}

		/**
		 * @return {object}
		 */
		get properties() {
			return this._properties
		}

		/**
		 * @return {Node}
		 */
		get root() {
			return this._root
		}

		/**
		 * @param  {string}   eventName
		 * @param  {Function} callback
		 * @returns {Listener}
		 */
		listen(observable, eventName, callback) {
			const listener = observable.listen(eventName, callback);
			this._listeners.push(listener);
			return listener
		}

		run(model, properties) {
			properties.binding._parent = this;
			this._children.push(properties.binding);
			properties.binding._properties = {
				...this.properties,
				...properties.binding.properties
			};
			Core.run(model, { parentNode: this.root, ...properties });
		}

		remove() {
			const listeners = this._listeners.slice();
			for(const listener of listeners) {
				listener.remove();
			}
			const children = this._children.slice();
			for(const child of children) {
				child.remove();
			}
			if(this._parent !== null) {
				this._parent._children = this._parent._children.filter(child => child !== this);
			}
			this.root.remove();
		}

		/**
			* @abstract
			*/
		onCreated() {

		}

		/**
			* @abstract
			*/
		async onRendered() {

		}

	}

	/** @module core */

	/**
	 * @memberof module:core
	 */
	class Core {

		static PROPERTIES = [
			"tagName",
			"children",
			"identifier",
			"model",
			"binding",
			"properties"
		]
		/**
			* @readonly
			* @enum {number}
			*/
		static METHOD = {
			APPEND_CHILD: "APPEND_CHILD",
			INSERT_BEFORE: "INSERT_BEFORE",
			REPLACE_NODE: "REPLACE_NODE",
			WRAP_NODE: "WRAP_NODE",
			PREPEND: "PREPEND",
		}

		/**
			* @param {Object}  model
			* @param {Object}  properties
			* @param {Element} properties.parentNode
			* @param {number}  [properties.method=METHOD.APPEND_CHILD]
			* @param {Binding} [properties.binding=Binding]
			*/
		static run(model, { parentNode, method = Core.METHOD.APPEND_CHILD, binding = new Binding() } = {}) {
			const node = Core.createNode(parentNode, model, binding);
			binding._root = node;
			binding.onCreated();
			if (method === Core.METHOD.APPEND_CHILD) {
				parentNode.appendChild(node);
			} else if (method === Core.METHOD.INSERT_BEFORE) {
				parentNode.parentNode.insertBefore(node, parentNode);
			} else if (method === Core.METHOD.REPLACE_NODE) {
				parentNode.replaceWith(node);
			} else if (method === Core.METHOD.WRAP_NODE) {
				node.appendChild(parentNode.cloneNode(true));
				parentNode.replaceWith(node);
			} else if (method === Core.METHOD.PREPEND) {
				parentNode.prepend(node);
			}
			binding.onRendered();
		}

		/**
			* @ignore
			* @param   {Object} Node
			* @param   {Object} model
			* @param   {Object} Binding
			* @returns {Node}
			*/
		static createNode(parentNode, model, binding) {
			const { tagName, children = [] } = model;
			const node = parentNode.ownerDocument.createElement(tagName);
			Object.keys(model).filter(property => Core.PROPERTIES.includes(property) === false).forEach(function(property) {
				node[property] = model[property];
			});
			for (const child of children) {
				if(Object.prototype.hasOwnProperty.call(child, "model") === true) {
					let childBinding;
					if(Object.prototype.hasOwnProperty.call(child, "binding") === true) {
						childBinding = new child.binding({...binding.properties, ...child.properties});
						if(Object.prototype.hasOwnProperty.call(child, "identifier") === true) {
							binding.identifier[child.identifier] = childBinding;
						}
					}
					binding.run(child.model, { parentNode: node, binding: childBinding });
				} else {
					const childNode = Core.createNode(parentNode, child, binding);
					node.appendChild(childNode);
				}
			}
			if(Object.prototype.hasOwnProperty.call(model, "identifier") === true) {
				binding.identifier[model.identifier] = node;
			}
			return node
		}

	}

	/** @module listener */

	/**
	 * @memberof module:listener
	 */
	class Listener {

		/**
		 * @param   {Observable}   observable
		 * @param   {string}       eventName
		 * @param   {Function}     callback
		 */
		constructor(observable, eventName, callback) {
			this._observable = observable;
			this._eventName = eventName;
			this._callback = callback;
		}

		/**
		 * Remove listener
		 */
		remove() {
			this._observable.removeListener(this);
		}

		/**
		 * @readonly
		 * @type {string}
		 */
		get eventName() {
			return this._eventName
		}

		/**
		 * @readonly
		 * @type {Function}
		 */
		get callback() {
			return this._callback
		}


	}

	/** @module observable */

	/**
	 * @memberof module:observable
	 */
	class Observable {

		constructor() {
			this._listeners = {};
		}

		/**
		 * @param  {string}   eventName
		 * @param  {Function} callback
		 * @returns {Listener}
		 */
		listen(eventName, callback) {
			if(!Array.isArray(this._listeners[eventName])) {
				this._listeners[eventName] = [];
			}
			const listener = new Listener(this, eventName, callback);
			this._listeners[eventName].push(listener);
			return listener
		}

		/**
		 * @param  {Listener} listener
		 */
		removeListener(listener) {
			this._listeners[listener.eventName] = this._listeners[listener.eventName].filter(listener_ => listener_ !== listener);
		}

		/**
		 * @param  {string} eventName
		 * @param  {*} 			args
		 */
		emit(eventName, args) {
			if(Array.isArray(this._listeners[eventName])) {
				for (const listener of this._listeners[eventName]) {
					listener.callback(args);
				}
			}
		}

	}

	/** @module code */

	/**
	 * @memberof module:code
	 */
	class Code {

		/**
			* @readonly
			* @type {string}
			* @abstract
			*/
		static tagName

		/**
			* @abstract
			* @param {Node} node
			* @returns {boolean}
			*/
		static testNode(node) {}

		/**
			* @abstract
			* @param {Conversion} conversion
			*/
		static beforeCreateBBNode(conversion) {}

		/**
			* @abstract
			* @param {Conversion} conversion
			* @returns {BBNode}
			*/
		static createBBNode(conversion) {}

		/**
			* @abstract
			* @param {Conversion} conversion
			*/
		static beforeCreateNode(conversion) {}

		/**
			* @param {Conversion} conversion
			*/
		static appendBBNode(conversion) {
			conversion.parentMatch.bbNode.appendChild(conversion.bbNode);
		}

		/**
			* @abstract
			* @param {Conversion} conversion
			* @returns {Node}
			*/
		static createNode(conversion) {}

		/**
			* @param {Conversion} conversion
			*/
		static appendNode(conversion) {
			conversion.parentMatch.node.appendChild(conversion.node);
		}

	}

	/** @module conversion */

	/**
	 * @memberof module:conversion
	 */
	class Conversion {

		constructor(bbDocument, document) {
			this._bbDocument = bbDocument;
			this._document = document;
			this._nodeList = [];
			this._ignoreNodeList = [];
			this._matches = [];
			this._bbNode = null;
			this._code = null;
			this._parentMatch = null;
			this._node = null;
			this._tags = null;
		}

		/**
		 * @readonly
		 * @type {Document}
		 */
		get document() {
			return this._document
		}

		/**
		 * @readonly
		 * @type {BBDocument}
		 */
		get bbDocument() {
			return this._bbDocument
		}

		/**
		 * @readonly
		 * @type {BBNode[]}
		 */
		get nodeList() {
			return this._nodeList
		}

		/**
		 * @readonly
		 * @type {BBNode[]}
		 */
		get ignoreNodeList() {
			return this._ignoreNodeList
		}

		/**
		 * @readonly
		 * @type {Object[]}
		 */
		get matches() {
			return this._matches
		}

		/**
		 * @readonly
		 * @type {BBNode}
		 */
		get bbNode() {
			return this._currentBBNode
		}

		set bbNode(bbNode) {
			this._currentBBNode = bbNode;
		}

		/**
		 * @readonly
		 * @type {Code}
		 */
		get code() {
			return this._code
		}

		set code(code) {
			this._code = code;
		}

		/**
		 * @readonly
		 * @type {Node}
		 */
		get node() {
			return this._node
		}

		set node(node) {
			this._node = node;
		}

		/**
		 * @readonly
		 * @type {Node}
		 */
		get tags() {
			return this._tags
		}

		set tags(tags) {
			this._tags = tags;
		}

	}

	/** @module token/token */

	/**
	 * @memberof: module:token/token
	 */
	class Token {

		/**
		 * @readonly
		 * @enum {string}
		 */
		static NAME = {
			TEXT: "text",
			OPENING_TAG: "opening tag",
			CLOSING_TAG: "closing tag"
		}

		/**
		 * @param {string} name
		 * @param {string} buffer
		 * @param {number} bufferIndex
		 */
		constructor(name, buffer, bufferIndex) {
			this._name = name;
			this._buffer = buffer;
			this._bufferIndex = bufferIndex;
		}

		/**
		 * @readonly
		 * @type {string}
		 */
		get name() {
			return this._name
		}

		/**
		 * @readonly
		 * @type {string}
		 */
		get buffer() {
			return this._buffer
		}

		/**
		 * @readonly
		 * @type {number}
		 */
		get bufferIndex() {
			return this._bufferIndex
		}

	}

	/** @module token/texttoken */

	/**
	 * @memberof: module:token/texttoken
	 */
	class TextToken extends Token {

		/**
		 * @param {string} name
		 * @param {string} buffer
		 * @param {number} bufferIndex
		 */
		constructor(buffer, bufferIndex) {
			super(Token.NAME.TEXT, buffer, bufferIndex);
		}

	}

	/** @module token/tagtoken */

	/**
	 * @memberof: module:token/tagtoken
	 */
	class TagToken extends Token {

		/**
		 * @param {string} name
		 * @param {string} buffer
		 * @param {number} bufferIndex
		 * @param {Key[]}  keys
		 */
		constructor(name, buffer, bufferIndex, keys = []) {
			super(name, buffer, bufferIndex);
			this._keys = keys;
		}

		/**
		 * @readonly
		 * @type {Key[]}
		 */
		get keys() {
			return this._keys
		}

	}

	/** @module token/key */

	/**
	 * @memberof: module:token/key
	 */
	class Key {

		/**
		 * @param {string} name
		 * @param {string} value
		 */
		constructor(name, value) {
			this._name = name;
			this._value = value;
		}

		/**
		 * @readonly
		 * @type {string}
		 */
		get name() {
			return this._name
		}

		/**
		 * @readonly
		 * @type {string}
		 */
		get value() {
			return this._value
		}

	}

	/** @module tokenizer */

	const ALPHABET = "abcdefghijklmnopqrstuvwxyz";
	const DIGITS = "0123456789";
	const CHARACTERS_SPECIAL_TAG_NAME = "*";
	const CHARACTERS_SPECIAL_TAG_VALUE = "#:/.";

	const CHARACTERS_TAG_NAME = [...ALPHABET + CHARACTERS_SPECIAL_TAG_NAME];
	const CHARACTERS_TAG_VALUE = [...ALPHABET + DIGITS + CHARACTERS_SPECIAL_TAG_VALUE];

	/**
	 * @param   {string}  str The text input
	 * @returns {Token[]}			An array of tokens
	 */
	function tokenize$1(str) {
		const characters = [...str];
		let buffer = "";
		const tokens = [];
		const keys = [];
		for(const [index, character] of characters.entries()) {
			buffer += character;
			const bufferIndex = index - buffer.length + 1;
			if (buffer[0] + buffer[1] === "[/") {
				if (buffer.length === 2) {
					continue
				}
				if (keys.length === 0) {
					if (CHARACTERS_TAG_NAME.includes(character.toLowerCase()) === true) {
						keys.push(new Key(character, null));
					} else {
						tokens.push(new TextToken(buffer, bufferIndex));
						buffer = "";
					}
				} else if (keys.length >= 1) {
					const key = keys[keys.length - 1];
					if (CHARACTERS_TAG_NAME.includes(character.toLowerCase()) === true) {
						key._name += character;
					} else if (character === "]") {
						tokens.push(new TagToken(Token.NAME.CLOSING_TAG, buffer, bufferIndex, [...keys]));
						keys.splice(0, keys.length);
						buffer = "";
					} else {
						tokens.push(new TextToken(buffer, bufferIndex));
						keys.splice(0, keys.length);
						buffer = "";
					}
				}
			} else if (buffer[0] === "[") {
				if (buffer.length === 1) {
					continue
				}
				if (keys.length === 0) {
					if (CHARACTERS_TAG_NAME.includes(character.toLowerCase()) === true) {
						keys.push(new Key(character, null));
					} else {
						tokens.push(new TextToken(buffer, bufferIndex));
						buffer = "";
					}
				} else if (keys.length >= 1) {
					const key = keys[keys.length - 1];
					if (typeof key.value === "string") {
						if (key.value.length === 0) {
							if (CHARACTERS_TAG_VALUE.includes(character.toLowerCase()) === true || character === "'" || character === '"') {
								key._value += character;
							} else {
								tokens.push(new TextToken(buffer, bufferIndex));
								buffer = "";
								keys.splice(0, keys.length);
							}
						} else if (key.value.length >= 1) {
							const parsingQuote = (key.value[0] === "'" || key.value[0] === '"')
							&& (key.value[0] !== key.value[key.value.length -1] || key.value.length === 1);
							if ((key.value[0] === "'" ||  key.value[0] === '"') && (parsingQuote === false && key.value.length > 1 && key.value[0] === key.value[key.value.length -1])) {
								key._value = key.value.substring(1, key.value.length - 1);
							}
							if (CHARACTERS_TAG_VALUE.includes(character.toLowerCase()) === true || parsingQuote) {
								key._value += character;
							} else if (character === "]") {
								tokens.push(new TagToken(Token.NAME.OPENING_TAG, buffer, bufferIndex, [...keys]));
								keys.splice(0, keys.length);
								buffer = "";
							} else if (character === " ") {
								keys.push(new Key("", null));
							} else {
								tokens.push(new TextToken(buffer, bufferIndex));
								buffer = "";
								keys.splice(0, keys.length);
							}
						}
					} else if (CHARACTERS_TAG_NAME.includes(character.toLowerCase()) === true) {
						key._name += character;
					} else if (character === "]") {
						tokens.push(new TagToken(Token.NAME.OPENING_TAG, buffer, bufferIndex, [...keys]));
						keys.splice(0, keys.length);
						buffer = "";
					} else if (character === "=") {
						key._value = "";
					} else if (key.name.length >= 1 && character === " ") {
						keys.push(new Key("", null));
					} else {
						tokens.push(new TextToken(buffer, bufferIndex));
						buffer = "";
						keys.splice(0, keys.length);
					}
				}
			} else {
				tokens.push(new TextToken(buffer, bufferIndex));
				buffer = "";
			}
		}
		return tokens
	}

	/** @module bbdocument/bbnode */

	/**
	 * @memberof module:bbdocument/bbnode
	 */
	class BBNode {

		/**
		 * @readonly
		 * @type {Number}
		 */
		static ELEMENT_BBNODE = 1
		/**
		 * @readonly
		 * @type {Number}
		 */
		static TEXT_BBNODE = 2

		constructor() {
			this._ownerDocument = null;
			this._parentNode = null;
			this._previousSibling = null;
			this._nextSibling = null;
			this._textContent = "";
		}

		/**
		 * @readonly
		 * @type {BBElement}
		 */
		get ownerDocument() {
			return this._ownerDocument
		}

		/**
		 * @readonly
		 * @type {BBElement}
		 */
		get parentNode() {
			return this._parentNode
		}

		/**
		 * @readonly
		 * @type {BBNode}
		 */
		get previousSibling() {
			return this._previousSibling
		}

		/**
		 * @readonly
		 * @type {BBNode}
		 */
		get nextSibling() {
			return this._nextSibling
		}

		/**
		 * @readonly
		 * @type {number}
		 */
		get nodeType() {
			return this._nodeType
		}

		/**
		 * @type {string}
		 */
		get textContent() {
			return this._textContent
		}

		set textContent(textContent) {
			if(this.nodeType === BBNode.ELEMENT_BBNODE) {
				for(let i = 0; i < this.childNodes.length; i++) {
					this.removeChild(this.childNodes[i]);
					i--;
				}
				const bbText = parse(textContent).documentElement.childNodes[0];
				this.appendChild(bbText);
			}
			this._textContent = textContent;
		}

		remove() {
			this.parentNode.removeChild(this);
		}

		/**
		 * @param   {boolean} deep
		 * @returns {BBNode}
		 */
		cloneNode(deep) {
			let bbNode;
			if(this.nodeType === BBNode.ELEMENT_BBNODE) {
				bbNode = new BBElement(this.tagName);
				for(const [key, value] of this.keys) {
					bbNode.setKey(key, value);
				}
				bbNode._keys = new Map(this.keys);
				if(deep) {
					bbNode.innerBBCode = this.innerBBCode;
				}
			} else {
				bbNode = new BBText(this.textContent);
			}
			return bbNode
		}

	}

	/** @module bbdocument/treewalker */

	/**
	 * @memberof module:bbdocument/treewalker
	 */
	class TreeWalker {

		/**
		 * @param {BBElement} rootNode
		 */
		constructor(rootNode) {
			this._currentNode = rootNode;
			this._rootNode = rootNode;
			this._path = [];
		}

		/**
		 * @readonly
		 * @type {BBElement}
		 */
		get currentNode() {
			return this._currentNode
		}

		/**
		 * @returns {BBElement}
		 */
		parentNode() {
			this._currentNode = this._currentNode.parentNode;
			return this._currentNode
		}

		nextNode() {
			if(this.currentNode.nodeType === BBNode.ELEMENT_BBNODE && this.currentNode.childNodes.length >= 1) {
				const previousNode = this.currentNode;
				this._currentNode = this.currentNode.childNodes[0];
				if(previousNode !== this._rootNode) {
					this._path.push(previousNode);
				}
			} else if(this.currentNode.nextSibling !== null  && !this._path.includes(this.currentNode.nextSibling)) {
				this._path.push(this.currentNode.nextSibling);
				this._currentNode = this.currentNode.nextSibling;
			} else {
				this._currentNode = null;
				const parents = this._path.slice();
				parents.reverse();
				for(const node of parents) {
					if(node.nextSibling !== null && !this._path.includes(node.nextSibling)) {
						this._currentNode = node.nextSibling;
						this._path.push(node.nextSibling);
						break
					}
				}
			}
			return this.currentNode
		}

	}

	/** @module bbdocument/bbelement */

	/**
	 * @memberof module:bbdocument/bbelement
	 */
	class BBElement extends BBNode {

		/**
		 * @param  {string}   name
		 * @param  {string} 	[value=null]
		 */
		constructor(name, value = null) {
			super();
			this._nodeType = BBNode.ELEMENT_BBNODE;
			this._childNodes = [];
			this._tagName = name;
			this._keys = new Map([ [name, value] ]);
			this._innerBBCode = "";
			const tags = this.tags();
			this._outerBBCode = `${tags.opening}${tags.closing}`;
		}

		/**
		 * @readonly
		 * @type {string}
		 */
		get tagName() {
			return this._tagName
		}

		/**
		 * @readonly
		 * @type {BBNode[]}
		 */
		get childNodes() {
			return this._childNodes
		}

		/**
		 * @readonly
		 * @type {Map}
		 */
		get keys() {
			return this._keys
		}

		/**
		 * @type {string}
		 */
		get innerBBCode() {
			return this._innerBBCode
		}

		set innerBBCode(innerBBCode) {
			for(let i = 0; i < this.childNodes.length; i++) {
				this.removeChild(this.childNodes[i]);
				i--;
			}
			const childNodes = parse(innerBBCode).documentElement.childNodes;
			for(const node of childNodes) {
				this.appendChild(node);
			}
			this._innerBBCode = innerBBCode;
		}

		/**
		 * @readonly
		 * @type {string}
		 */
		get outerBBCode() {
			return this._outerBBCode
		}

		/**
		 * @ignore
		 * @param {string}        name
		 * @param {string|number} value
		 */
		setKey(name, value = null) {
			this._keys.set(name, value);
			const tags = this.tags();
			this._outerBBCode = `${tags.opening}${tags.closing}`;
		}

		/**
		 * @param  {BBNode} bbNode
		 */
		appendChild(bbNode) {
			if(this.childNodes.length >= 1) {
				const lastBBNode = this.childNodes[this.childNodes.length - 1];
				lastBBNode._nextSibling = bbNode;
				bbNode._previousSibling = lastBBNode;
			}
			bbNode._parentNode = this;
			this.childNodes.push(bbNode);
			this.build();
		}

		/**
		 * @param  {BBNode} bbNode
		 */
		removeChild(bbNode) {
			if(bbNode.previousSibling !== null) {
				bbNode.previousSibling._nextSibling = bbNode.nextSibling;
			}
			if(bbNode.nextSibling !== null) {
				bbNode.nextSibling._previousSibling = bbNode.previousSibling;
			}
			this.childNodes.splice(this.childNodes.indexOf(bbNode), 1);
			this.build();
		}

		/**
		 * @ignore
		 * Used to rebuild the Node hierarchy after either textContent or innerBBCode was updated
		 */
		build() {
			const nodeList = [this];
			let parentNode = this.parentNode;
			while (parentNode !== null) {
				nodeList.push(parentNode);
				parentNode = parentNode.parentNode;
			}
			for(const node of nodeList) {
				node._textContent = serialize(node, { excludeBBCode: true });
				node._innerBBCode = serialize(node, { excludeBBCode: false });
				node._outerBBCode = serialize(node, { excludeRoot: false });
			}
		}

		/**
		 * Converts an array of keys into an opening and closing tag string
		 * @param  {Object[]} keys
		 * @returns {object}
		 */
		tags() {
			const tags = { opening: "", closing: "" };
			tags.opening += "[";
			for(const [key, value] of this.keys) {
				if (tags.opening.length >= 2) {
					tags.opening += " ";
				}
				tags.opening += key;
				if (value !== null) {
					if (value.includes(" ") === true) {
						tags.opening += "=" + "\"" + value + "\"";
					} else {
						tags.opening += "=" + value;
					}
				}
			}
			tags.opening += "]";
			if(this.tagName !== "*") {
				tags.closing = "[/" + this.tagName + "]";
			}
			return tags
		}

		/**
		 * @param   {string} tagName
		 * @returns {BBNode}
		 */
		querySelector(tagName) {
			const treeWalker = new TreeWalker(this);
			let node = null;
			while(treeWalker.nextNode()) {
				if(treeWalker.currentNode.tagName === tagName) {
					node = treeWalker.currentNode;
					break
				}
			}
			return node
		}

		/**
		 * @param   {string} tagName
		 * @returns {BBNode[]}
		 */
		querySelectorAll(tagName) {
			const treeWalker = new TreeWalker(this);
			let nodeList = [];
			while(treeWalker.nextNode()) {
				if(treeWalker.currentNode.tagName === tagName) {
					nodeList.push(treeWalker.currentNode);
				}
			}
			return nodeList
		}

	}

	/** @module bbdocument/bbtext */

	/**
	 * @memberof module:bbdocument/bbtext
	 */
	class BBText extends BBNode {

		/**
		 * @param {string} text
		 */
		constructor(text) {
			super();
			this._nodeType = BBNode.TEXT_BBNODE;
			this._textContent = text;
		}

	}

	/** @module bbdocument/bbdocument */

	/**
	 * @memberof module:bbdocument/bbdocument
	 */
	class BBDocument {

		constructor() {
			this._documentElement = new BBElement();
			this._documentElement._ownerDocument = this;
		}

		/**
		 * @readonly
		 * @type {BBElement}
		 */
		get documentElement() {
			return this._documentElement
		}

		/**
		 * @param  {string} text
		 * @returns {BBText}
		 */
		createTextNode(text) {
			const bbNode = new BBText(text);
			bbNode._ownerDocument = this;
			return bbNode
		}

		/**
		 * @param   {string}        name
		 * @param   {string|number} value
		 * @returns {BBElement}
		 */
		createElement(name, value) {
			const bbNode = new BBElement(name, value);
			bbNode._ownerDocument = this;
			return bbNode
		}

		/**
		 * @param   {BBElement}  rootNode
		 * @returns {TreeWalker}
		 */
		createTreeWalker(rootNode) {
			return new TreeWalker(rootNode)
		}

	}

	/** @module parser */

	/**
	 * @param  {Node}    rootNode
	 * @param  {object}  parameters
	 * @param  {boolean} parameters.excludeBBCode=false
	 * @param  {boolean} parameters.excludeRoot=true
	 * @returns {string}
	 */
	function serialize(rootNode, {excludeBBCode = false, excludeRoot = true} = {}) {
		let str = "";
		if(rootNode.nodeType === BBNode.ELEMENT_BBNODE) {
			const tags = rootNode.tags();
			let str_ = "";
			for(const bbNode of rootNode.childNodes) {
				str_ += serialize(bbNode, { excludeBBCode, excludeRoot: false });
			}
			if((!rootNode.ownerDocument || rootNode.ownerDocument.documentElement !== rootNode) && excludeBBCode === false && excludeRoot === false) {
				str += `${tags.opening}${str_}${tags.closing}`;
			} else {
				str += str_;
			}
		} else {
			str += rootNode.textContent;
		}
		return str
	}

	/**
	 * @param  {string}   str
	 * @returns {Object[]}
	 */
	function tokenize(str) {
		let tokens = tokenize$1(str);
		let openedCodeCount = 0;
		let raw = false;
		let rawTokens = [];
		tokens.filter(token => token.name === Token.NAME.OPENING_TAG || token.name === Token.NAME.CLOSING_TAG).forEach(function(token) {
			if (token.name === Token.NAME.OPENING_TAG && token.keys[0].name === "code") {
				if (raw === true) {
					rawTokens.push(token);
					openedCodeCount++;
				} else {
					raw = true;
				}
			} else if (token.name === Token.NAME.CLOSING_TAG && token.keys[0].name === "code") {
				if (raw === true && openedCodeCount === 0) {
					rawTokens.forEach(function(token_) {
						token_._name = Token.NAME.TEXT;
					});
					raw = false;
					rawTokens = [];
				} else {
					rawTokens.push(token);
					if (openedCodeCount >= 1) {
						openedCodeCount--;
					}
				}
			} else if (raw === true) {
				rawTokens.push(token);
			}
		});
		const openedTokens = [];
		const matchedTokens = [];
		tokens.filter(token => token.name === Token.NAME.OPENING_TAG || token.name === Token.NAME.CLOSING_TAG).forEach(token => {
			if (token.name === Token.NAME.OPENING_TAG) {
				if (token.keys[0].name === "*") {
					const matches = openedTokens.filter(openedToken => openedToken.keys[0].name === "*");
					if (matches.length >= 1) {
						matchedTokens.push({
							name: "bbcode",
							bufferIndex: matches[matches.length - 1].bufferIndex,
							openingTag: matches[matches.length - 1],
							closingTag: new TagToken(Token.NAME.CLOSING_TAG, token.buffer, token.bufferIndex, token.keys),
						});
						openedTokens.splice(openedTokens.indexOf(matches[matches.length - 1]), 1);
					}
				}
				openedTokens.push(token);
			} else if (token.name === Token.NAME.CLOSING_TAG) {
				if (token.keys[0].name === "list") {
					const peers_ = openedTokens.filter(openedToken => openedToken.keys[0].name === "*");
					if (peers_.length >= 1) {
						matchedTokens.push({
							name: "bbcode",
							bufferIndex: peers_[peers_.length - 1].bufferIndex,
							openingTag: peers_[peers_.length - 1],
							closingTag: token,
						});
						openedTokens.splice(openedTokens.indexOf(peers_[peers_.length - 1]), 1);
					}
				}
				const matches = openedTokens.filter(openedToken => openedToken.keys[0].name ===  token.keys[0].name);
				if (matches.length >= 1 && token.keys[0].name !== "*") {
					openedTokens.splice(openedTokens.indexOf(matches[matches.length - 1]), 1);
					matchedTokens.push({
						name: "bbcode",
						bufferIndex: matches[matches.length - 1].bufferIndex,
						openingTag: matches[matches.length - 1],
						closingTag: token
					});
				} else {
					token._name = Token.NAME.TEXT;
				}
			}
		});
		for(const token of openedTokens) {
			token._name = Token.NAME.TEXT;
		}
		let mergedTextToken = null;
		for (let i = 0; i < tokens.length; i++) {
			if (tokens[i].name === Token.NAME.TEXT) {
				if (mergedTextToken === null) {
					mergedTextToken = tokens[i];
				} else {
					mergedTextToken._buffer += tokens[i].buffer;
					tokens.splice(i, 1);
					i--;
				}
			} else {
				mergedTextToken = null;
			}
		}
		tokens = matchedTokens.concat(tokens.filter(token => token.name === Token.NAME.TEXT));
		tokens.sort((a, b) => a.bufferIndex - b.bufferIndex);
		return tokens
	}

	/**
	 * @param   {string} 	   str The input text
	 * @returns {BBDocument}     An array of BBNode
	 */
	function parse(str) {
		let tokens = tokenize(str);
		const bbDocument = new BBDocument();
		tokens = tokens.map(token => {
			if(token.name === "bbcode") {
				const keys = token.openingTag.keys;
				const bbNode = bbDocument.createElement(keys[0].name, keys[0].value);
				keys.slice(1).forEach(key => bbNode.setKey(key.name, key.value));
				token.bbNode = bbNode;
			} else if(token.name === Token.NAME.TEXT) {
				token.bbNode = bbDocument.createTextNode(token.buffer);
			}
			return token
		});
		tokens.forEach(token => {
			const parents = tokens.filter(token_ => token_.name === "bbcode" && token_ !== token && token_.bufferIndex < token.bufferIndex && token.bufferIndex < token_.closingTag.bufferIndex);
			if (parents.length >= 1) {
				parents[parents.length - 1].bbNode.appendChild(token.bbNode);
			} else {
				bbDocument.documentElement.appendChild(token.bbNode);
			}
		});
		return bbDocument
	}

	/** @module template */

	class Template {

		/**
		 * @param   {Code[]} codes
		 * @param   {Document} document
		 */
		constructor(codes, document) {
			this._codes = codes;
			this._document = document;
		}

		/**
		 * @readonly
		 * @type {Code[]}
		 */
		get codes() {
			return this._codes
		}

		/**
		 * @readonly
		 * @type {Document}
		 */
		get document() {
			return this._document
		}

		/**
		 * Convert BBcode string to HTML string
		 * @param  {string} input
		 * @return {string}
		 */
		toHTML(input) {
			const bbDocument = parse(input);
			const conversion = new Conversion(bbDocument, this.document);
			const treeWalker = bbDocument.createTreeWalker(bbDocument.documentElement);
			while (treeWalker.nextNode()) {
				conversion.nodeList.push(treeWalker.currentNode);
			}
			const rootNode = this.document.createElement("div");
			for(const bbNode of conversion.nodeList) {
				conversion.bbNode = bbNode;
				conversion.tags = null;
				conversion.code = null;
				conversion.node = null;
				conversion.parentMatch = null;
				if (conversion.ignoreNodeList.indexOf(bbNode) !== -1) {
					continue
				}
				if (bbNode.nodeType === BBNode.ELEMENT_BBNODE) {
					conversion.tags = bbNode.tags();
					const code = this.codes.find(code => code.tagName === bbNode.tagName);
					if (code) {
						conversion.code = code;
						conversion.code.beforeCreateNode(conversion);
						conversion.node = conversion.code.createNode(conversion);
					} else {
						const treeWalker = bbDocument.createTreeWalker(bbNode);
						while (treeWalker.nextNode()) {
							conversion.ignoreNodeList.push(treeWalker.currentNode);
						}
						conversion.node = this.document.createTextNode(bbNode.outerHTML);
					}
				} else {
					conversion.node = this.document.createTextNode(bbNode.textContent);
				}
				const parentMatch = conversion.matches.find(matchedNode => matchedNode.bbNode === bbNode.parentNode);
				if(parentMatch) {
					conversion.parentMatch = parentMatch;
					const code = this.codes.find(code => code.tagName === parentMatch.bbNode.tagName);
					if(code) {
						code.appendNode(conversion);
					} else {
						conversion.parentMatch.node.appendChild(conversion.node);
					}
				} else {
					rootNode.appendChild(conversion.node);
				}
				if (conversion.node.nodeType === this.document.ELEMENT_NODE) {
					conversion.matches.push({ bbNode, node: conversion.node });
				}
			}
			return rootNode.innerHTML
		}

		/**
		 * Convert HTML string to BBcode string
		 * @param  {string} input
		 * @return {string}
		 */
		toBBCode(input) {
			const bbDocument = new BBDocument();
			const conversion = new Conversion(bbDocument, this.document);
			const element = this.document.createElement("div");
			element.innerHTML = input;
			const treeWalker = this.document.createTreeWalker(element);
			while (treeWalker.nextNode()) {
				conversion.nodeList.push(treeWalker.currentNode);
			}
			for(const node of conversion.nodeList) {
				conversion.node = node;
				conversion.code = null;
				conversion.bbNode = null;
				conversion.tags = null;
				conversion.parentMatch = null;
				if (conversion.ignoreNodeList.indexOf(node) !== -1) {
					continue
				}
				if (node.nodeType === this.document.ELEMENT_NODE) {
					const code = this.codes.find(code => code.testNode(node) === true);
					if (code) {
						conversion.code = code;
						conversion.code.beforeCreateBBNode(conversion);
						conversion.bbNode = conversion.code.createBBNode(conversion);
						conversion.tags = conversion.bbNode.tags();
					} else {
						const treeWalker = this.document.createTreeWalker(node);
						while (treeWalker.nextNode()) {
							conversion.ignoreNodeList.push(treeWalker.currentNode);
						}
						conversion.bbNode = bbDocument.createTextNode(node.outerHTML);
					}
				} else if (node.nodeType === this.document.TEXT_NODE) {
					conversion.bbNode = bbDocument.createTextNode(node.textContent);
				}
				const parentMatch = conversion.matches.find(match => match.node === node.parentNode);
				if(parentMatch) {
					conversion.parentMatch = parentMatch;
					const code = this.codes.find(code => code.tagName === parentMatch.bbNode.tagName);
					if(code) {
						code.appendBBNode(conversion);
					} else {
						conversion.parentMatch.bbNode.appendChild(conversion.bbNode);
					}
				} else {
					bbDocument.documentElement.appendChild(conversion.bbNode);
				}
				if (conversion.bbNode.nodeType === BBNode.ELEMENT_BBNODE) {
					conversion.matches.push({ bbNode: conversion.bbNode, node });
				}
			}
			return bbDocument.documentElement.innerBBCode
		}

	}

	class asterisk extends Code {

		/**
			* @readonly
			* @type {string}
			*/
		static tagName = "*"

		/**
			* @param {Node} node
			* @returns {boolean}
			*/
		static testNode(node) {
			return node.nodeName === "LI"
		}

		/**
			* @param {Conversion} conversion
			* @returns {BBNode}
			*/
		static createBBNode(conversion) {
			const bbNode = conversion.bbDocument.createElement("*");
			return bbNode
		}

		/**
			* @param {Conversion} conversion
			* @returns {Node}
			*/
		static createNode(conversion) {
			const node = conversion.document.createElement("li");
			return node
		}

	}

	class bold extends Code {

		/**
			* @readonly
			* @type {string}
			*/
		static tagName = "b"

		/**
			* @param {Node} node
			* @returns {boolean}
			*/
		static testNode(node) {
			return node.nodeName === "SPAN" && node.style.fontWeight === "bold"
		}

		/**
			* @param {Conversion} conversion
			* @returns {BBNode}
			*/
		static createBBNode(conversion) {
			const bbNode = conversion.bbDocument.createElement("b");
			return bbNode
		}

		/**
			* @param {Conversion} conversion
			* @returns {Node}
			*/
		static createNode(conversion) {
			const node = conversion.document.createElement("span");
			node.style.fontWeight = "bold";
			return node
		}

	}

	class center extends Code {

		/**
			* @readonly
			* @type {string}
			*/
		static tagName = "center"

		/**
			* @param {Node} node
			* @returns {boolean}
			*/
		static testNode(node) {
			return node.nodeName === "DIV" && node.getAttribute("align") === "center"
		}

		/**
			* @param {Conversion} conversion
			* @returns {BBNode}
			*/
		static createBBNode(conversion) {
			const bbNode = conversion.bbDocument.createElement("center");
			return bbNode
		}

		/**
			* @param {Conversion} conversion
			* @returns {Node}
			*/
		static createNode(conversion) {
			const node = conversion.document.createElement("div");
			node.align = "center";
			return node
		}

	}

	class code extends Code {

		/**
			* @readonly
			* @type {string}
			*/
		static tagName = "code"

		/**
			* @param {Node} node
			* @returns {boolean}
			*/
		static testNode(node) {
			return node.nodeName === "DIV" && node.className === "codetext"
		}

		/**
			* @param {Conversion} conversion
			*/
		static beforeCreateBBNode(conversion) {
			conversion.ignoreNodeList.push(conversion.node.children[0]);
			conversion.node.children[0].childNodes.forEach(childNode => conversion.node.appendChild(childNode));
		}

		/**
			* @param {Conversion} conversion
			* @returns {BBNode}
			*/
		static createBBNode(conversion) {
			const bbNode = conversion.bbDocument.createElement("code");
			return bbNode
		}

		/**
			* @param {Conversion} conversion
			* @returns {Node}
			*/
		static createNode(conversion) {
			const node = conversion.document.createElement("div");
			node.className = "codetext";
			const pre = conversion.document.createElement("pre");
			node.appendChild(pre);
			return node
		}

		/**
			* @param {Conversion} conversion
			*/
		static appendNode(conversion) {
			if (conversion.parentMatch.node.className === "codetext") {
				conversion.parentMatch.node.querySelector("pre").appendChild(conversion.node);
			}
		}

	}

	class color extends Code {
		/**
			* @readonly
			* @type {string}
			*/
		static tagName = "color"

		/**
			* @param {Node} node
			* @returns {boolean}
			*/
		static testNode(node) {
			return node.nodeName === "SPAN" && node.style.color !== ""
		}

		/**
			* @param {Conversion} conversion
			* @returns {BBNode}
			*/
		static createBBNode(conversion) {
			let color = null;
			if(conversion.node.style.color.slice(0, 4) === "rgb(") {
				const colors = conversion.node.style.color.slice(4, -1).split(",");
				const red = `${Number(colors[0]).toString(16)}`.padStart(2, "0");
				const green = `${Number(colors[1]).toString(16)}`.padStart(2, "0");
				const blue = `${Number(colors[2]).toString(16)}`.padStart(2, "0");
				color = `#${red}${green}${blue}`.toUpperCase();
			} else {
				color = conversion.node.style.color;
			}
			const bbNode = conversion.bbDocument.createElement("color", color);
			return bbNode
		}

		/**
			* @param {Conversion} conversion
			* @returns {Node}
			*/
		static createNode(conversion) {
			const node = conversion.document.createElement("span");
			node.style.color = conversion.bbNode.keys.get("color");
			return node
		}

	}

	class italic extends Code {

		/**
			* @readonly
			* @type {string}
			*/
		static tagName = "i"

		/**
			* @param {Node} node
			* @returns {boolean}
			*/
		static testNode(node) {
			return node.nodeName === "SPAN" && node.style.fontStyle === "italic"
		}

		/**
			* @param {Conversion} conversion
			* @returns {BBNode}
			*/
		static createBBNode(conversion) {
			const bbNode = conversion.bbDocument.createElement("i");
			return bbNode
		}

		/**
			* @param {Conversion} conversion
			* @returns {Node}
			*/
		static createNode(conversion) {
			const node = conversion.document.createElement("span");
			node.style.fontStyle = "italic";
			return node
		}

	}

	class image extends Code {

		/**
			* @readonly
			* @type {string}
			*/
		static tagName = "img"

		/**
			* @param {Node} node
			* @returns {boolean}
			*/
		static testNode(node) {
			return node.nodeName === "IMG"
		}

		/**
			* @param {Conversion} conversion
			* @returns {BBNode}
			*/
		static createBBNode(conversion) {
			const bbNode = conversion.bbDocument.createElement("img");
			bbNode.textContent = conversion.node.getAttribute("src");
			return bbNode
		}

		/**
			* @param {Conversion} conversion
			* @returns {Node}
			*/
		static createNode(conversion) {
			const node = conversion.document.createElement("img");
			node.className = "userimg";
			if (conversion.bbNode.childNodes.length >= 1) {
				node.src = conversion.bbNode.textContent;
			} else {
				node.src = conversion.bbNode.keys.get("img");
			}
			if (conversion.bbNode.keys.has("align")) {
				if (conversion.bbNode.keys.get("align") === "left") {
					node.className = "userimg img-a-l";
				} else if (conversion.bbNode.keys.get("align") === "right") {
					node.className = "userimg img-a-r";
				}
			}
			return node
		}

	}

	class list extends Code {

		/**
			* @readonly
			* @type {string}
			*/
		static tagName = "list"

		/**
			* @param {Node} node
			* @returns {boolean}
			*/
		static testNode(node) {
			return node.nodeName === "UL" || node.nodeName === "OL"
		}

		/**
			* @param {Conversion} conversion
			* @returns {BBNode}
			*/
		static createBBNode(conversion) {
			let value = null;
			if (conversion.node.nodeName === "OL") {
				value = "1";
			}
			const	bbNode = conversion.bbDocument.createElement("list", value);
			return bbNode
		}

		/**
			* @param {Conversion} conversion
			* @returns {Node}
			*/
		static createNode(conversion) {
			let node;
			if (conversion.bbNode.keys.get("list") === "1") {
				node = conversion.document.createElement("ol");
			} else {
				node = conversion.document.createElement("ul");
			}
			return node
		}

	}

	class quote extends Code {

		/**
			* @readonly
			* @type {string}
			*/
		static tagName = "quote"

		/**
			* @param {Node} node
			* @returns {boolean}
			*/
		static testNode(node) {
			return node.nodeName === "DIV" && node.className === "quotetext"
		}

		/**
			* @param {Conversion} conversion
			*/
		static beforeCreateBBNode(conversion) {
			if (conversion.node.parentNode.className === "spoiler_content") {
				conversion.node.parentNode.parentNode.parentNode.appendChild(conversion.node);
			}
			if (conversion.node.children.length >= 1 && conversion.node.children[0].nodeName === "STRONG") {
				conversion.ignoreNodeList.push(conversion.node.children[0]);
				conversion.ignoreNodeList.push(conversion.node.children[0].firstChild);
				conversion.ignoreNodeList.push(conversion.node.children[1]);
				conversion.ignoreNodeList.push(conversion.node.querySelector(".hide_button"));
				conversion.ignoreNodeList.push(conversion.node.querySelector(".hide_button input"));
				conversion.ignoreNodeList.push(conversion.node.querySelector(".hide_button .spoiler_content"));
			}
		}

		/**
			* @param {Conversion} conversion
			* @returns {BBNode}
			*/
		static createBBNode(conversion) {
			let value = null;
			if (conversion.node.children.length >= 1 && conversion.node.children[0].nodeName === "STRONG") {
				value = conversion.node.children[0].textContent.substring(0, conversion.node.children[0].textContent.length - " said:".length);
			}
			const bbNode = conversion.bbDocument.createElement("quote", value);
			return bbNode
		}

		/**
			* @param {Conversion} conversion
			* @returns {Node}
			*/
		static createNode(conversion) {
			const node = conversion.document.createElement("div");
			node.className = "quotetext";
			if (conversion.bbNode.keys.get("quote") !== null) {
				const strong = conversion.document.createElement("strong");
				strong.textContent = conversion.bbNode.keys.get("quote") + " said:";
				node.appendChild(strong);
				const br = conversion.document.createElement("br");
				node.appendChild(br);
			}
			let treeWalker = conversion.bbNode.ownerDocument.createTreeWalker(conversion.bbNode);
			const parentBBNodes = [];
			while(treeWalker.parentNode()) {
				parentBBNodes.push(treeWalker.currentNode);
			}
			const parentQuoteBBNodes = parentBBNodes.filter(bbNode_ => bbNode_.tagName === "quote");
			treeWalker = conversion.bbNode.ownerDocument.createTreeWalker(conversion.bbNode);
			const childrenBBNodes = [];
			while(treeWalker.nextNode()) {
				childrenBBNodes.push(treeWalker.currentNode);
			}
			const childrenQuoteBBNodes = childrenBBNodes.filter(bbNode_ => bbNode_.tagName === "quote");
			if (parentQuoteBBNodes.length === 1 && childrenQuoteBBNodes.length >= 1) {
				const node2 = conversion.document.createElement("div");
				node2.className = "hide_button";
				const input = conversion.document.createElement("input");
				input.type = "button";
				input.className = "button expand_quote";
				input.setAttribute("onclick", "this.nextSibling.style.display = \"block\";this.remove();");
				input.value = "Expand Quote";
				node2.appendChild(input);
				const span = conversion.document.createElement("span");
				span.className = "spoiler_content";
				span.style.display = "none";
				node.appendChild(node2);
				node2.appendChild(span);
			}
			return node
		}

		/**
			* @param {Conversion} conversion
			*/
		static appendNode(conversion) {
			if (conversion.parentMatch.node.className === "quotetext") {
				const treeWalker = conversion.bbDocument.createTreeWalker(conversion.bbNode);
				const parentBBNodes = [];
				while(treeWalker.parentNode()) {
					parentBBNodes.push(treeWalker.currentNode);
				}
				const parentQuoteBBNodes = parentBBNodes.filter(bbNode_ => bbNode_.tagName === "quote");
				if (conversion.node.className === "quotetext" && parentQuoteBBNodes.length === 2) {
					conversion.matches.find(matchedNode => matchedNode.bbNode === parentQuoteBBNodes[1]).node.querySelector(".spoiler_content").appendChild(conversion.node);
				} else {
					const hideButton = [...conversion.parentMatch.node.children].find(child => child.className === "hide_button");
					if(hideButton) {
						hideButton.before(conversion.node);
					} else {
						conversion.parentMatch.node.appendChild(conversion.node);
					}
				}
			}
		}

	}

	class right extends Code {

		/**
			* @readonly
			* @type {string}
			*/
		static tagName = "right"

		/**
			* @param {Node} node
			* @returns {boolean}
			*/
		static testNode(node) {
			return node.nodeName === "DIV" && node.getAttribute("align") === "right"
		}

		/**
			* @param {Conversion} conversion
			* @returns {BBNode}
			*/
		static createBBNode(conversion) {
			const bbNode = conversion.bbDocument.createElement("right");
			return bbNode
		}

		/**
			* @param {Conversion} conversion
			* @returns {Node}
			*/
		static createNode(conversion) {
			const node = conversion.document.createElement("div");
			node.align = "right";
			return node
		}

	}

	class strike extends Code {

		/**
			* @readonly
			* @type {string}
			*/
		static tagName = "s"

		/**
			* @param {Node} node
			* @returns {boolean}
			*/
		static testNode(node) {
			return node.nodeName === "SPAN" && node.style.textDecoration === "line-through"
		}

		/**
			* @param {Conversion} conversion
			* @returns {BBNode}
			*/
		static createBBNode(conversion) {
			const bbNode = conversion.bbDocument.createElement("s");
			return bbNode
		}

		/**
			* @param {Conversion} conversion
			* @returns {Node}
			*/
		static createNode(conversion) {
			const node = conversion.document.createElement("span");
			node.style.textDecoration = "line-through";
			return node
		}

	}

	class size extends Code {

		/**
			* @readonly
			* @type {string}
			*/
		static tagName = "size"

		/**
			* @param {Node} node
			* @returns {boolean}
			*/
		static testNode(node) {
			return node.nodeName === "SPAN" && node.style.fontSize !== ""
		}

		/**
			* @param {Conversion} conversion
			* @returns {BBNode}
			*/
		static createBBNode(conversion) {
			const bbNode = conversion.bbDocument.createElement("size", conversion.node.style.fontSize.substring(0, conversion.node.style.fontSize.length - 1));
			return bbNode
		}

		/**
			* @param {Conversion} conversion
			* @returns {Node}
			*/
		static createNode(conversion) {
			const node = conversion.document.createElement("span");
			node.style.fontSize = conversion.bbNode.keys.get("size") + "%";
			return node
		}

	}

	class spoiler extends Code {

		/**
			* @readonly
			* @type {string}
			*/
		static tagName = "spoiler"

		/**
			* @param {Node} node
			* @returns {boolean}
			*/
		static testNode(node) {
			return node.nodeName === "DIV" && node.className === "hide_button" && node.children.length === 2 && node.children[0].nodeName === "INPUT"
			&& node.children[0].className === "button show_button" && node.children[1].nodeName === "SPAN" && node.children[1].className === "spoiler_content"
		}

		/**
			* @param {Conversion} conversion
			*/
		static beforeCreateBBNode(conversion) {
			if (conversion.node.parentNode.className === "spoiler_content") {
				conversion.node.parentNode.parentNode.appendChild(conversion.node);
			}
			const input = conversion.node.children[0];
			input.nextElementSibling.childNodes.forEach(childNode => conversion.node.appendChild(childNode));
			conversion.ignoreNodeList.push(input);
			conversion.ignoreNodeList.push(input.nextElementSibling);
		}

		/**
			* @param {Conversion} conversion
			* @returns {BBNode}
			*/
		static createBBNode(conversion) {
			let value = null;
			let spoilerName = conversion.node.children[0].value.substring("show ".length);
			if (spoilerName !== "spoiler") {
				value = spoilerName;
			}
			const bbNode = conversion.bbDocument.createElement("spoiler", value);
			return bbNode
		}

		/**
			* @param {Conversion} conversion
			* @returns {Node}
			*/
		static createNode(conversion) {
			const node = conversion.document.createElement("div");
			node.className = "hide_button";
			const input = conversion.document.createElement("input");
			input.type = "button";
			input.className = "button show_button";
			input.setAttribute("onclick", "const isHidden=this.nextElementSibling.style.display === \"none\";this.value=isHidden === true  ? this.value.replace(\"Show\", \"Hide\") : this.value.replace(\"Hide\", \"Show\");this.nextElementSibling.style.display=isHidden === true ? \"block\" : \"none\";");
			if (conversion.bbNode.keys.get("spoiler") !== null) {
				input.value = `Show ${conversion.bbNode.keys.get("spoiler")}`;
			} else {
				input.value = "Show spoiler";
			}
			node.appendChild(input);
			const span = conversion.document.createElement("span");
			span.className = "spoiler_content";
			span.style.display = "none";
			node.appendChild(span);
			return node
		}

		/**
			* @param {Conversion} conversion
			*/
		static appendNode(conversion) {
			if (conversion.parentMatch.node.className === "hide_button") {
				conversion.parentMatch.node.querySelector(".spoiler_content").appendChild(conversion.node);
			}
		}

	}

	class underline extends Code {

		/**
			* @readonly
			* @type {string}
			*/
		static tagName = "u"

		/**
			* @param {Node} node
			* @returns {boolean}
			*/
		static testNode(node) {
			return node.nodeName === "SPAN" && node.style.textDecoration === "underline"
		}

		/**
			* @param {Conversion} conversion
			* @returns {BBNode}
			*/
		static createBBNode(conversion) {
			const bbNode = conversion.bbDocument.createElement("u");
			return bbNode
		}

		/**
			* @param {Conversion} conversion
			* @returns {Node}
			*/
		static createNode(conversion) {
			const node = conversion.document.createElement("span");
			node.style.textDecoration = "underline";
			return node
		}

	}

	class url extends Code {

		/**
			* @readonly
			* @type {string}
			*/
		static tagName = "url"

		/**
			* @param {Node} node
			* @returns {boolean}
			*/
		static testNode(node) {
			return node.nodeName === "A"
		}

		/**
			* @param {Conversion} conversion
			* @returns {BBNode}
			*/
		static createBBNode(conversion) {
			const bbNode = conversion.bbDocument.createElement("url",  conversion.node.getAttribute("href"));
			return bbNode
		}

		/**
			* @param {Conversion} conversion
			* @returns {Node}
			*/
		static createNode(conversion) {
			const node = conversion.document.createElement("a");
			node.href = conversion.bbNode.keys.get("url");
			node.rel = "nofollow noopener noreferrer";
			node.target = "_blank";
			return node
		}

	}

	class youtube extends Code {

		/**
			* @readonly
			* @type {string}
			*/
		static tagName = "yt"

		/**
			* @param {Node} node
			* @returns {boolean}
			*/
		static testNode(node) {
			return node.nodeName === "IFRAME" && node.className === "movie youtube"
			&& node.src.startsWith("https://youtube.com/embed/") && node.src.length > "https://youtube.com/embed/".length
		}

		/**
			* @param {Conversion} conversion
			* @returns {BBNode}
			*/
		static createBBNode(conversion) {
			const bbNode = conversion.bbDocument.createElement("yt");
			return bbNode
		}

		/**
			* @param {Conversion} conversion
			* @returns {Node}
			*/
		static createNode(conversion) {
			const node = conversion.document.createElement("iframe");
			node.className = "movie youtube";
			if (conversion.bbNode.childNodes.length >= 1) {
				node.src = "https://youtube.com/embed/" +  conversion.bbNode.textContent;
			} else {
				node.src = "https://youtube.com/embed/" + conversion.bbNode.keys.get("yt");
			}
			node.width = "425";
			node.height = "355";
			node.frameBorder = "0";
			node.allow = "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture";
			node.allowFullscreen = true;
			return node
		}

	}

	var Codes = /*#__PURE__*/Object.freeze({
		__proto__: null,
		asterisk: asterisk,
		bold: bold,
		center: center,
		code: code,
		color: color,
		italic: italic,
		image: image,
		list: list,
		quote: quote,
		right: right,
		strike: strike,
		size: size,
		spoiler: spoiler,
		underline: underline,
		url: url,
		youtube: youtube
	});

	var BBCODE_SAMPLES = [
		{
			name: "Help page",
			value: `How to use BBcode

BBcode is used to format text, insert url's and pictures in a post on the forums, profile, comments and in PM's. BBcode is similar to HTML. The only difference is BBcode uses square braces [] instead of <> in HTML. Written by Cheesebaron.

Text Formatting

	You can change the style of the text the following ways:
	[b]bo-rudo[/b] - this makes the text bold
	[u]anda-rain[/u] - this underlines the text
	[i]itarikku[/i] - this italicises the text
	[s]sutoraiki[/s] - this strikes through the text
	[center]text[/center] - this centers the text
	[right]text[/right] - this right justifies the text

Changing the text color and size

	[color=blue]buru[/color] - this changes the text color to blue

	You can also use colour codes to define what colour you want your text to be
	[color=#FFFFFF]Shiroi[/color] - this changes the text color to white

	You can change the text size by using the [size=][/size] tag, the size is dependant on what value written. You can choose 20 to 200, which is representing the size in percent.

		[size=30]KOMAKAI[/size] - will give a very small text size [size=200]KOUDAI[/size] - will give a huge text size

Posting a YouTube Video

	[yt]_YL7t_QbQ2M[/yt]

	Posts a YouTube video.

Creating lists

	You can create a list by using the [code][list][/list][/code] tag.

	To create an un-ordered list:

		[list]
		[*]kawaii
		[*]fugu
		[*]shouen
		[/list]


	To create an ordered, numbered list:


	[list=1]
	[*]kawaii
	[*]fugu
	[*]shouen
	[/list]

	Nested list:

		[list][*]Level 1.[*]Level 1.
	[list][*]Level 2.[*]Level 2.
	[list][*]Level 3.[*]Level 3.
	[list][*]Level 4.[*]Level 4.
	[list=1][*]Numbered list.[*]Numbered list.
	[/list][/list][/list][/list][/list]


Creating links and showing images

	[url=https://myanimelist.net]Visit MyAnimeList[/url] - this would display Visit MyAnimeList as an URL.

	To insert a picture to your post you can use the [code][img][/img][/code] tag.

		[img]./resource/image.jpg[/img]

	To insert a left/right aligned picture you can use the [code][img align=(left or right)][/img][/code].

		[img align=left]./resource/image.jpg[/img]
		[img align=right]./resource/image.jpg[/img]

Making a spoiler button

	To make a spoiler button use the [spoiler][/spoiler] tag, and the text in between the tags become invisible until the "Show spoiler" button is clicked.

		[spoiler]This is a spoiler for an episode of an anime that could make people angry[/spoiler]

	To make a named spoiler button you can use the [code][spoiler=name][/spoiler][/code].

		[spoiler=secret]Secret[/spoiler]
		[spoiler="big secret"]Big Secret[/spoiler]
		[spoiler='big secret']Big Secret[/spoiler]
		[spoiler='nested spoiler'][spoiler][spoiler][spoiler][spoiler]Secret[/spoiler][/spoiler][/spoiler][/spoiler][/spoiler]

Writing raw text

	To write raw text use the [code][/code] tag.

		[code]You can make the text bold with [code][b][b][b]text[/b][/b][/b][/code][code][b][/b][/code]tag.[/code]

Combining BBcode

	You can combine BBcodes, but you have to remember to end the tags in the right order
	This example is WRONG:
	[url=https://myanimelist.net][img]https://myanimelist.net/picture.jpg[/url][/img]
	This example is RIGHT:
	[url=https://myanimelist.net][img]https://myanimelist.net/picture.jpg[/img][/url]

Quotes

[quote]Some text[/quote]

[quote=nickname]Some text[/quote]

[quote=nickname]Some text[quote=nickname]Some text[quote=nickname]Some text[quote=nickname]Some text[quote="nickname"]Some text[/quote][/quote][/quote][/quote][/quote]



User Mention

	To mention another user on the forum add an @ symbol before their name. For example @user_name`
	},
	{
		name: "Underline",
		value: `[u]text[/u]`
	},
	{
		name: "Mixed",
		value: `[u][u][b]test[b]test[/b][/u][/u][/b]` // invalid
	},
	{
		name: "Mixed_2",
		value: `[u][u][b]test[b]test[/b][/b][/u][/u]`
	},
	{
		name: "Quote",
		value: `[quote]Some text[/quote]

[quote=nickname1]Some text[/quote]

[quote=nickname1]Text 1[quote=nickname2]Text 2[quote=nickname3]Text 3[quote=nickname4]Text 4[quote="nickname5"]Text 5[/quote][/quote][/quote][/quote][/quote]

[quote=nickname1]Some text[quote=nickname2]Some text 2[/quote][/quote]`
	},
	{
		name: "Spoiler",
		value: `[spoiler=name]First level[spoiler=hello]Second level[spoiler]Third Level[spoiler]Fourth level[/spoiler][/spoiler][/spoiler][/spoiler][spoiler]First level[/spoiler]`
	},
	{
		name: "List",
		value: `[list][*]test[*]test[*]test[/list]`
	},
	{
		name: "List",
		value: `[list][*]test[*]test[list][*]test[*]test[*]test[list][*]test[*]test[*]test[/list][/list][list][*]test[*]test[*]test[/list][/list][list][*]test[*]test[*]test[/list]`
	}, {
		name: "code",
		value: `[code][b][/b][s][/s][code]tesdsadt[/code][/code]`
	},
	{
		name: "linefeed2",
		value: `dsadsad

test
test`
	},
	{
		name: "linefeed2",
		value: `dsadsad
dsadsad


dsadsadsad


dsadsad



dsadsadsada




dsad

`
	}
	];

	var HTML_SAMPLES = [
		// Help page
		{
			name: "Help page",
			value: `How to use BBcode

BBcode is used to format text, insert url's and pictures in a post on the forums, profile, comments and in PM's. BBcode is similar to HTML. The only difference is BBcode uses square braces [] instead of &lt;&gt; in HTML. Written by Cheesebaron.

Text Formatting

	You can change the style of the text the following ways:
	<span style="font-weight: bold;">bo-rudo</span> - this makes the text bold
	<span style="text-decoration: underline;">anda-rain</span> - this underlines the text
	<span style="font-style: italic;">itarikku</span> - this italicises the text
	<span style="text-decoration: line-through;">sutoraiki</span> - this strikes through the text
	<div align="center">text</div> - this centers the text
	<div align="right">text</div> - this right justifies the text

Changing the text color and size

	<span style="color: blue;">buru</span> - this changes the text color to blue

	You can also use colour codes to define what colour you want your text to be
	<span style="color: rgb(255, 255, 255);">Shiroi</span> - this changes the text color to white

	You can change the text size by using the [size=][/size] tag, the size is dependant on what value written. You can choose 20 to 200, which is representing the size in percent.

		<span style="font-size: 30%;">KOMAKAI</span> - will give a very small text size <span style="font-size: 200%;">KOUDAI</span> - will give a huge text size

Posting a YouTube Video

	<iframe class="movie youtube" src="https://youtube.com/embed/_YL7t_QbQ2M" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen="" width="425" height="355" frameborder="0">_YL7t_QbQ2M</iframe>

	Posts a YouTube video.

Creating lists

	You can create a list by using the <div class="codetext"><pre>[list][/list]</pre></div> tag.

	To create an un-ordered list:

		<ul>
		<li></li>kawaii
		<li></li>fugu
		<li>shouen
		</li></ul>


	To create an ordered, numbered list:


	<ol>
	<li></li>kawaii
	<li></li>fugu
	<li>shouen
	</li></ol>

	Nested list:

		<ul><li></li>Level 1.<li></li>Level 1.
	<ul><li></li>Level 2.<li></li>Level 2.
	<ul><li></li>Level 3.<li></li>Level 3.
	<ul><li></li>Level 4.<li></li>Level 4.
	<ol><li></li>Numbered list.<li>Numbered list.
	</li></ol></ul></ul></ul></ul>


Creating links and showing images

	<a href="https://myanimelist.net" rel="nofollow noopener noreferrer" target="_blank">Visit MyAnimeList</a> - this would display Visit MyAnimeList as an URL.

	To insert a picture to your post you can use the <div class="codetext"><pre>[img][/img]</pre></div> tag.

		<img class="userimg" src="./resource/image.jpg">

	To insert a left/right aligned picture you can use the <div class="codetext"><pre>[img align=(left or right)][/img]</pre></div>.

		<img class="userimg img-a-l" src="./resource/image.jpg">
		<img class="userimg img-a-r" src="./resource/image.jpg">

Making a spoiler button

	To make a spoiler button use the <div class="hide_button"><input type="button" class="button show_button" onclick="const isHidden=this.nextElementSibling.style.display === &quot;none&quot;;this.value=isHidden === true  ? this.value.replace(&quot;Show&quot;, &quot;Hide&quot;) : this.value.replace(&quot;Hide&quot;, &quot;Show&quot;);this.nextElementSibling.style.display=isHidden === true ? &quot;block&quot; : &quot;none&quot;;" value="Show spoiler"><span class="spoiler_content" style="display: none;"></span></div> tag, and the text in between the tags become invisible until the "Show spoiler" button is clicked.

		<div class="hide_button"><input type="button" class="button show_button" onclick="const isHidden=this.nextElementSibling.style.display === &quot;none&quot;;this.value=isHidden === true  ? this.value.replace(&quot;Show&quot;, &quot;Hide&quot;) : this.value.replace(&quot;Hide&quot;, &quot;Show&quot;);this.nextElementSibling.style.display=isHidden === true ? &quot;block&quot; : &quot;none&quot;;" value="Show spoiler"><span class="spoiler_content" style="display: none;">This is a spoiler for an episode of an anime that could make people angry</span></div>

	To make a named spoiler button you can use the <div class="codetext"><pre>[spoiler=name][/spoiler]</pre></div>.

		<div class="hide_button"><input type="button" class="button show_button" onclick="const isHidden=this.nextElementSibling.style.display === &quot;none&quot;;this.value=isHidden === true  ? this.value.replace(&quot;Show&quot;, &quot;Hide&quot;) : this.value.replace(&quot;Hide&quot;, &quot;Show&quot;);this.nextElementSibling.style.display=isHidden === true ? &quot;block&quot; : &quot;none&quot;;" value="Show secret"><span class="spoiler_content" style="display: none;">Secret</span></div>
		<div class="hide_button"><input type="button" class="button show_button" onclick="const isHidden=this.nextElementSibling.style.display === &quot;none&quot;;this.value=isHidden === true  ? this.value.replace(&quot;Show&quot;, &quot;Hide&quot;) : this.value.replace(&quot;Hide&quot;, &quot;Show&quot;);this.nextElementSibling.style.display=isHidden === true ? &quot;block&quot; : &quot;none&quot;;" value="Show big secret"><span class="spoiler_content" style="display: none;">Big Secret</span></div>
		<div class="hide_button"><input type="button" class="button show_button" onclick="const isHidden=this.nextElementSibling.style.display === &quot;none&quot;;this.value=isHidden === true  ? this.value.replace(&quot;Show&quot;, &quot;Hide&quot;) : this.value.replace(&quot;Hide&quot;, &quot;Show&quot;);this.nextElementSibling.style.display=isHidden === true ? &quot;block&quot; : &quot;none&quot;;" value="Show big secret"><span class="spoiler_content" style="display: none;">Big Secret</span></div>
		<div class="hide_button"><input type="button" class="button show_button" onclick="const isHidden=this.nextElementSibling.style.display === &quot;none&quot;;this.value=isHidden === true  ? this.value.replace(&quot;Show&quot;, &quot;Hide&quot;) : this.value.replace(&quot;Hide&quot;, &quot;Show&quot;);this.nextElementSibling.style.display=isHidden === true ? &quot;block&quot; : &quot;none&quot;;" value="Show nested spoiler"><span class="spoiler_content" style="display: none;"><div class="hide_button"><input type="button" class="button show_button" onclick="const isHidden=this.nextElementSibling.style.display === &quot;none&quot;;this.value=isHidden === true  ? this.value.replace(&quot;Show&quot;, &quot;Hide&quot;) : this.value.replace(&quot;Hide&quot;, &quot;Show&quot;);this.nextElementSibling.style.display=isHidden === true ? &quot;block&quot; : &quot;none&quot;;" value="Show spoiler"><span class="spoiler_content" style="display: none;"><div class="hide_button"><input type="button" class="button show_button" onclick="const isHidden=this.nextElementSibling.style.display === &quot;none&quot;;this.value=isHidden === true  ? this.value.replace(&quot;Show&quot;, &quot;Hide&quot;) : this.value.replace(&quot;Hide&quot;, &quot;Show&quot;);this.nextElementSibling.style.display=isHidden === true ? &quot;block&quot; : &quot;none&quot;;" value="Show spoiler"><span class="spoiler_content" style="display: none;"><div class="hide_button"><input type="button" class="button show_button" onclick="const isHidden=this.nextElementSibling.style.display === &quot;none&quot;;this.value=isHidden === true  ? this.value.replace(&quot;Show&quot;, &quot;Hide&quot;) : this.value.replace(&quot;Hide&quot;, &quot;Show&quot;);this.nextElementSibling.style.display=isHidden === true ? &quot;block&quot; : &quot;none&quot;;" value="Show spoiler"><span class="spoiler_content" style="display: none;"><div class="hide_button"><input type="button" class="button show_button" onclick="const isHidden=this.nextElementSibling.style.display === &quot;none&quot;;this.value=isHidden === true  ? this.value.replace(&quot;Show&quot;, &quot;Hide&quot;) : this.value.replace(&quot;Hide&quot;, &quot;Show&quot;);this.nextElementSibling.style.display=isHidden === true ? &quot;block&quot; : &quot;none&quot;;" value="Show spoiler"><span class="spoiler_content" style="display: none;">Secret</span></div></span></div></span></div></span></div></span></div>

Writing raw text

	To write raw text use the <div class="codetext"><pre></pre></div> tag.

		<div class="codetext"><pre>You can make the text bold with [code][b][b][b]text[/b][/b][/b][/code][code][b][/b][/code]tag.</pre></div>

Combining BBcode

	You can combine BBcodes, but you have to remember to end the tags in the right order
	This example is WRONG:
	<a href="https://myanimelist.net" rel="nofollow noopener noreferrer" target="_blank"><img class="userimg" src="https://myanimelist.net/picture.jpg"></a>
	This example is RIGHT:
	<a href="https://myanimelist.net" rel="nofollow noopener noreferrer" target="_blank"><img class="userimg" src="https://myanimelist.net/picture.jpg"></a>

Quotes

<div class="quotetext">Some text</div>

<div class="quotetext"><strong>nickname said:</strong><br>Some text</div>

<div class="quotetext"><strong>nickname said:</strong><br>Some text<div class="quotetext"><strong>nickname said:</strong><br><div class="hide_button"><input type="button" class="button expand_quote" onclick="this.nextSibling.style.display = &quot;block&quot;;this.remove();" value="Expand Quote"><span class="spoiler_content" style="display: none;"><div class="quotetext"><strong>nickname said:</strong><br>Some text<div class="quotetext"><strong>nickname said:</strong><br>Some text<div class="quotetext"><strong>nickname said:</strong><br>Some text</div></div></div></span></div>Some text</div></div>



User Mention

	To mention another user on the forum add an @ symbol before their name. For example @user_name`
		},
		// Anchor
		{
			name: "Anchor",
			value: `<a href="https://myanimelist.net" rel="nofollow">Hello World</a> `
		},
		// Quote
		{
			name: "Quote",
			value: `<div class="quotetext">Some text</div>

<div class="quotetext"><strong>nickname1 said:</strong><br>Some text</div>

<div class="quotetext"><strong>nickname1 said:</strong><br>Text 1<div class="quotetext"><strong>nickname2 said:</strong><br>Text 2<div class="hide_button"><input class="button expand_quote" onclick="this.nextSibling.style.display = &quot;block&quot;;this.remove();" value="Expand Quote" type="button"><span class="spoiler_content" style="display: none;"><div class="quotetext"><strong>nickname3 said:</strong><br>Text 3<div class="quotetext"><strong>nickname4 said:</strong><br>Text 4<div class="quotetext"><strong>nickname5 said:</strong><br>Text 5</div></div></div></span></div></div></div>

<div class="quotetext"><strong>nickname1 said:</strong><br>Some text<div class="quotetext"><strong>nickname2 said:</strong><br>Some text 2</div></div>`
		},
		// Quote 2
		{
			name: "Quote_2",
			value: `<div class="quotetext">
	<strong>nickname1 said:</strong>
	<br>Text 1<div class="quotetext">
		<strong>nickname2 said:</strong>
		<br>Text 2<div class="hide_button">
			<input value="Expand Quote" class="button expand_quote" type="button" onclick="this.nextSibling.style.display = &quot;block&quot;;this.remove();">
			<span class="spoiler_content" style="display: none;">
				<div class="quotetext">
					<strong>nickname3 said:</strong>
					<br>Text 3<div class="quotetext">
						<strong>nickname4 said:</strong>
						<br>Text 4<div class="quotetext">
							<strong>nickname5 said:</strong>
							<br>Text 5
						</div>
					</div>
				</div>
			</span>
		</div>
	</div>
</div>`
		},
		// List
		{
			name: "List",
			value: `<ul><li>test</li>
<li>test</li>
<li>test</li>
<li>test</li></ul>`
		},
		// Spoiler
		{
			name: "Spoiler",
			value: `<div class="hide_button"><input class="button show_button" onclick="let isHidden=this.nextElementSibling.style.display === &quot;none&quot;;this.value=isHidden === true  ? this.value.replace(&quot;Show&quot;, &quot;Hide&quot;) : this.value.replace(&quot;Hide&quot;, &quot;Show&quot;);this.nextElementSibling.style.display=isHidden === true ? &quot;block&quot; : &quot;none&quot;;" value="Show name" type="button"><span class="spoiler_content" style="display: none;">First level<div class="hide_button"><input class="button show_button" onclick="let isHidden=this.nextElementSibling.style.display === &quot;none&quot;;this.value=isHidden === true  ? this.value.replace(&quot;Show&quot;, &quot;Hide&quot;) : this.value.replace(&quot;Hide&quot;, &quot;Show&quot;);this.nextElementSibling.style.display=isHidden === true ? &quot;block&quot; : &quot;none&quot;;" value="Show hello" type="button"><span class="spoiler_content" style="display: none;">Second level<div class="hide_button"><input class="button show_button" onclick="let isHidden=this.nextElementSibling.style.display === &quot;none&quot;;this.value=isHidden === true  ? this.value.replace(&quot;Show&quot;, &quot;Hide&quot;) : this.value.replace(&quot;Hide&quot;, &quot;Show&quot;);this.nextElementSibling.style.display=isHidden === true ? &quot;block&quot; : &quot;none&quot;;" value="Show spoiler" type="button"><span class="spoiler_content" style="display: none;">Third Level<div class="hide_button"><input class="button show_button" onclick="let isHidden=this.nextElementSibling.style.display === &quot;none&quot;;this.value=isHidden === true  ? this.value.replace(&quot;Show&quot;, &quot;Hide&quot;) : this.value.replace(&quot;Hide&quot;, &quot;Show&quot;);this.nextElementSibling.style.display=isHidden === true ? &quot;block&quot; : &quot;none&quot;;" value="Show spoiler" type="button"><span class="spoiler_content" style="display: none;">Fourth level</span></div></span></div></span></div></span></div><div class="hide_button"><input class="button show_button" onclick="let isHidden=this.nextElementSibling.style.display === &quot;none&quot;;this.value=isHidden === true  ? this.value.replace(&quot;Show&quot;, &quot;Hide&quot;) : this.value.replace(&quot;Hide&quot;, &quot;Show&quot;);this.nextElementSibling.style.display=isHidden === true ? &quot;block&quot; : &quot;none&quot;;" value="Show spoiler" type="button"><span class="spoiler_content" style="display: none;">First level</span></div>`
		},
		// Spoiler 2
		{
			name: "Spoiler_2",
			value: `<div class="hide_button">
	<input class="button show_button" onclick="let isHidden=this.nextElementSibling.style.display === &quot;none&quot;;this.value=isHidden === true  ? this.value.replace(&quot;Show&quot;, &quot;Hide&quot;) : this.value.replace(&quot;Hide&quot;, &quot;Show&quot;);this.nextElementSibling.style.display=isHidden === true ? &quot;block&quot; : &quot;none&quot;;" value="Show name" type="button">
	<span class="spoiler_content" style="display: none;">First level<div class="hide_button">
			<input class="button show_button" onclick="let isHidden=this.nextElementSibling.style.display === &quot;none&quot;;this.value=isHidden === true  ? this.value.replace(&quot;Show&quot;, &quot;Hide&quot;) : this.value.replace(&quot;Hide&quot;, &quot;Show&quot;);this.nextElementSibling.style.display=isHidden === true ? &quot;block&quot; : &quot;none&quot;;" value="Show hello" type="button">
			<span class="spoiler_content" style="display: none;">Second level<div class="hide_button">
					<input class="button show_button" onclick="let isHidden=this.nextElementSibling.style.display === &quot;none&quot;;this.value=isHidden === true  ? this.value.replace(&quot;Show&quot;, &quot;Hide&quot;) : this.value.replace(&quot;Hide&quot;, &quot;Show&quot;);this.nextElementSibling.style.display=isHidden === true ? &quot;block&quot; : &quot;none&quot;;" value="Show spoiler" type="button">
					<span class="spoiler_content" style="display: none;">Third Level<div class="hide_button">
							<input class="button show_button" onclick="let isHidden=this.nextElementSibling.style.display === &quot;none&quot;;this.value=isHidden === true  ? this.value.replace(&quot;Show&quot;, &quot;Hide&quot;) : this.value.replace(&quot;Hide&quot;, &quot;Show&quot;);this.nextElementSibling.style.display=isHidden === true ? &quot;block&quot; : &quot;none&quot;;" value="Show spoiler" type="button">
							<span class="spoiler_content" style="display: none;">Fourth level</span>
						</div>
					</span>
				</div>
			</span>
		</div>
	</span>
</div>
<div class="hide_button">
	<input class="button show_button" onclick="let isHidden=this.nextElementSibling.style.display === &quot;none&quot;;this.value=isHidden === true  ? this.value.replace(&quot;Show&quot;, &quot;Hide&quot;) : this.value.replace(&quot;Hide&quot;, &quot;Show&quot;);this.nextElementSibling.style.display=isHidden === true ? &quot;block&quot; : &quot;none&quot;;" value="Show spoiler" type="button">
	<span class="spoiler_content" style="display: none;">First level</span>
</div>`
		},
		{
			name: "List 2",
			value: `<ul>
	<li>test</li>
	<li>test<ul>
			<li>test</li>
			<li>test</li>
			<li>test<ul>
					<li>test</li>
					<li>test</li>
					<li>test</li>
				</ul>
			</li>
		</ul>
	</li>
	<ul>
		<li>test</li>
		<li>test</li>
		<li>test</li>
	</ul>
</ul>
<ul>
	<li>test</li>
	<li>test</li>
	<li>test</li>
</ul>`
		}, {
			name: "code",
			value: `
<div class="codetext">
<pre>[b][/b][s][/s][code]tesdsadt[/code]</pre>
</div>

			`
		},
		{
			name: "linefeed",
			value: `<div>dsadsad</div><div>dsadsad</div><div><br></div><div>dsadsadsad</div><div><br></div><div>dsadsad<br><br><br><br>dsadsadsada<br><br><br><br><br>dsad<br></div>`
		},
		{
			name: "linefeed2",
			value: `<div>dsadsad</div>
test
test`
		}
	];

	var GridModel = data => ({
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
	});

	class GridBinding extends Binding {

		onCreated() {

			const { output, template } = this.properties;

			const grid = new Observable();

			if(output === "html") {
				this.listen(grid, "update", async () => {
					this.identifier.inputPreview.textContent = template.toHTML(this.identifier.input.value);
					this.identifier.output.innerHTML = template.toHTML(this.identifier.input.value);
				});
			} else if(output === "bbcode") {
				this.listen(grid, "update", async () => {
					this.identifier.inputPreview.textContent = template.toBBCode(this.identifier.input.value);
					this.identifier.output.innerHTML = template.toHTML(template.toBBCode(this.identifier.input.value));
				});
			}

			this.identifier.input.addEventListener("input", () => grid.emit("update"));

			this.identifier.case.addEventListener("change", () => {
				this.identifier.input.value = this.identifier.case.value;
				grid.emit("update");
			});

			this.identifier.input.value = this.identifier.case.value;

			grid.emit("update");

		}

	}

	const template = new Template(Object.values(Codes), document);

	window.addEventListener("load", async function() {

		Core.run(GridModel({ from: "BBCode", to: "HTML", cases: BBCODE_SAMPLES }), { parentNode: document.body, binding: new GridBinding({ output: "html", template }) });
		Core.run(GridModel({ from: "HTML", to: "BBCode", cases: HTML_SAMPLES }), { parentNode: document.body, binding: new GridBinding({ output: "bbcode", template }) });

	});

}());
//# sourceMappingURL=bundle.js.map
