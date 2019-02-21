
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
	bgH = 150
	text = text.replace(/[\r\n]/g, '<newLine>')
	let textArray = text.split('<newLine>')
	let curHeight = y
	for (let j = 0; j < textArray.length; j++) {
		let item = textArray[j].trim()
		if (!item.match(/^[ ]+$/)) {
			let descString = ''
			let nextDescString = ''
			let nextDescWidth = 0
			if (ctx.measureText(item).width > width) {
		    let iIndex = 0 // 最后一行的第一个字的索引
		    for (let i = 0; i < item.length; i++) {
		      descString = descString + item[i]
		      nextDescString = descString + item[i]
		      nextDescWidth = ctx.measureText(nextDescString).width
		      if (nextDescWidth > width + 20) {
		      	if (bgUrl) ctx.drawImage(bgUrl, 0, curHeight, bgW, bgH)
		        ctx.fillText(descString, 80, curHeight)
		        iIndex = i
		        descString = ''
		        curHeight += 48
		      }
		    }
		    if (iIndex !== item.length - 1) {
		    	if (bgUrl) ctx.drawImage(bgUrl, 0, curHeight, bgW, bgH)
		    	ctx.fillText(item.slice(iIndex + 1, item.length), 80, curHeight)
		    }
		  } else {
		    if (bgUrl) ctx.drawImage(bgUrl, 0, curHeight, bgW, bgH)
		    ctx.fillText(item, x, curHeight)
		  }
		  curHeight += 48
		  if (curHeight > 2120) {
		  	ctx.setTextAlign('center')
	    	ctx.setFontSize(28)
	    	ctx.setFillStyle('#652791')
	    	if (bgUrl) ctx.drawImage(bgUrl, 0, curHeight, bgW, bgH)
		  	ctx.fillText('长按识别查看完整职位详情', 375, curHeight)
		  	curHeight += 40
		  	ctx.setTextAlign('left')
		  	return curHeight
		  }
		}
	}
  return curHeight
}


// 遍历标签
export const drawLabel = (ctx, dataArray, width, x, y, labelStyle = {type: 'rectangle', padding: 12, height: 34, marginRight: 8, fontSize: 20, background: '#EFE9F4'}) => {
	let padding = labelStyle.padding
	let labelPosition = {
    x: x,
    y: y
  }
  ctx.setFontSize(labelStyle.fontSize)
  dataArray.map((item, index) => {
    addLabel(item, index)
  })
  function addTeamLabel(item, index) {
    let metricsW = ctx.measureText(item.name).width // 当前文本宽度
    ctx.setFillStyle('#EFE9F4')
    ctx.fillRect(teamPosition.x, teamPosition.y, metricsW + 40, 42)
    ctx.setFillStyle('#652791')
    ctx.fillText(item.name, teamPosition.x + padding, teamPosition.y + 29)

    // 下个标签的宽度
    let newLabelWidth = 0
    if (index < info.skillsLabel.length-1) {
      newLabelWidth = ctx.measureText(info.skillsLabel[index+1].name).width + 2*padding
    }

    // 下一个标签的横坐标
    teamPosition.x = teamPosition.x + 2*padding + metricsW + 12

    // 判断是否需要换行
    if (newLabelWidth > (750 - 80 - teamPosition.x)) {
      teamPosition.x = 80
      teamPosition.y = teamPosition.y + 2*padding + 15
      curHeight = teamPosition.y
    }
  }
}

    