// 手机号正则
export const mobileReg = /^1(3|4|5|6|7|8|9)\d{9}$/

// 微信号正则
export const wechatReg = /^.{2,20}$/

//身份证正则表达式
export const idCardReg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/

// 邮箱
export const emailReg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/

// 用户名
export const userNameReg = /^[A-Za-z_\s]{2,20}$/

// 真实姓名
export const realNameReg = /^[\u4E00-\u9FA5]{2,20}$/

// 密码
export const passwordReg = /^[0-9A-Za-z_\-\@\#\$\%\^&\*\'\/\<\>]{6,20}$/

// 验证码
export const captchaCodeReg = /^[0-9A-Za-z]{6,8}$/

// 职位
export const positionReg = /^.{2,50}$/

// 公司简称
export const abbreviationReg = /^.{1,10}$/


// 过滤纯空格 
export const allspaceReg = /^(?!(\s+$))/ 
