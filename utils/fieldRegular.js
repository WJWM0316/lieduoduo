// 手机号正则
export const mobile = /^1(3|4|5|6|7|8|9)\d{9}$/

//身份证正则表达式
export const idCard = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/

// 邮箱
export const email = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/

// 用户名
export const userName = /^[A-Za-z_\s]{2,20}$/

// 真实姓名
export const realName = /^[\u4E00-\u9FA5]{2,20}$/

// 密码
export const password = /^[0-9A-Za-z_\-\@\#\$\%\^&\*\'\/\<\>]{6,20}$/

// 验证码
export const captchaCode = /^[0-9A-Za-z]{6,8}$/