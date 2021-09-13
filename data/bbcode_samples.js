export default [
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
]
