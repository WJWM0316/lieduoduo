// 手机号正则
export const mobileReg = /^1(3|4|5|6|7|8|9)\d{9}$/

// 微信号正则
export const wechatReg = /^.{2,20}$/

//身份证正则表达式
export const idCardReg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/

// 邮箱
export const emailReg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[-_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/

// 用户名
export const userNameReg = /^.{2,20}$/

// 真实姓名
export const realNameReg = /^[\u4E00-\u9FA5]{2,20}$/

// 密码
export const passwordReg = /^[0-9A-Za-z_\-\@\#\$\%\^&\*\'\/\<\>]{6,20}$/

// 验证码
export const captchaCodeReg = /^[0-9A-Za-z]{6,8}$/

// 职位
export const positionReg = /^.{2,20}$/

// 公司简称
export const abbreviationReg = /^.{1,10}$/

// 过滤纯空格 
export const allspaceReg = /^(?!(\s+$))/ 

// 工作内容
export const workContentReg = /^.{1,1000}$/


// 链接
export const urlReg = /^((https?|ftp|news):\/\/)?([a-z]([a-z0-9\-]*[\.。])+([a-z]{2}|aero|arpa|biz|com|coop|edu|gov|info|int|jobs|mil|museum|name|nato|net|org|pro|travel)|(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]))(\/[a-z0-9_\-\.~]+)*(\/([a-z0-9_\-\.]*)(\?[a-z0-9+_\-\.%=&]*)?)?(#[a-z][a-z0-9_]*)?$/ // 链接网址验证

// 工作内容
export const productNameReg = /^.{1,20}$/