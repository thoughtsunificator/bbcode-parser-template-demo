export default [
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
]
