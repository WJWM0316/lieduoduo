
export const ellipsis = (ctx, text, width, x, y) => {
	let ellipsisWidth = ctx.measureText('...').width
	let textWidth = ctx.measureText(text).width
	let curString = ''
	if (textWidth > width) {
		for(let i = 0; i < text.length; i++) {
			curString = curString + text[i]
			if (ctx.measureText(curString).width >= (width - ellipsisWidth)) {
				curString = curString + '...'
        ctx.fillText(curString, x, y)
        break
			}
		}
	} else {
		ctx.fillText(text, x, y)
	}
} 