
// 文本溢出打点  ctx canvas对象 text 文本  width 限制宽度 
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

// 文本换行  ctx canvas对象 text 文本  width 限制宽度  bgUrl 背景图url
export const lineFeed = (ctx, text, width, x, y, bgUrl, bgW = 750, bgH = 90) => {
	text = text.replace(/[\r\n]/g, '<newLine>')
	let textArray = text.split('<newLine>')
	let curHeight = y
	textArray.map((item, index) => {
		let descString = ''
		let descWidth = 0
		item = item.trim()
		if (ctx.measureText(item).width > width) {
	    let iIndex = 0 // 最后一行的第一个字的索引
	    for (let i = 0; i < item.length; i++) {
	      descString = descString + item[i]
	      descWidth = ctx.measureText(descString).width   
	      if (descWidth > width) {
	      	if (bgUrl) ctx.drawImage(bgUrl, 0, curHeight, bgW, bgH)
	        ctx.fillText(descString, 80, curHeight)
	        iIndex = i
	        descString = ''
	        curHeight += 48
	      }
	    }
	    if (iIndex === item.length - 1) return
	    if (bgUrl) ctx.drawImage(bgUrl, 0, curHeight, bgW, bgH)
	    ctx.fillText(item.slice(iIndex + 1, item.length), 80, curHeight)
	  } else {
	    if (bgUrl) ctx.drawImage(bgUrl, 0, curHeight, bgW, bgH)
	    ctx.fillText(item, x, curHeight)
	  }
	  curHeight += 48
	})
  return curHeight
}