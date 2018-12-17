## 猎多多开发文档
备足说明：此项目采用小程序原生开发，开启eslint规则，项目结构分明，采用分包机制，需注意页面存放位置

### 主要的目录结构
> README.md  开发文档
> config 配置文件， 用于api的host,或者其他链接定义
>  api 
 >> pages 按模块划分api 
>> require 请求中间层
>
>  components
>  > business 业务组件文件夹， 主要存放业务组件，如各类选项卡、头部、底部、各种内容模块
>  > functional 功能组件文件夹， 主要存放功能性组件，如上传组件、截图组件、多媒体组件、选择器组件
>  > layout 基本布局文件夹，主要存放一些小部件，如空白数据展示组件、返回顶部组件等等
> 
> images 本地开发存放图片
>
> page
> > applicant  求职者端 页面文件
> > common 公共页面文件
>  > recruiter 招聘者端 页面文件
>
> utils 各类js封装文件夹
>

### 组件使用
1. auth ----- 授权组件
在需要授权的页面引入授权组件，需要在onLoad里写上以前代码，在授权回调那里请求页面数据
``` javascript  
getApp().checkLogin().then(res => {
   console.log(res) // 数据请求返回用户信息之后再发送请求
})
```
2.avatarUpload ----- 头像截图组件
直接引入即可， props值 src， 用于展示默认图

3.myPicker ----- 自定义的picker选择器， 基本包含项目所有选择器
props值
+ pickerType： String类型， value值如下：
  - startTime - 开始时间， 格式： XXXX年XX日
  - endTime- 结束时间， 格式： XXXX年XX日 
  - workTime- 开始工作时间，格式： XXXX年XX日
  -  dateTime-选择面试时间，格式： XXXX年XX日XX日 XX:XX
  - birthday-生日时间， 格式： XXXX年XX日XX日
  - education-选择学历
   - sex-选择性别
  - jobStatus-求职状态
  - experience-经验要求
  - staffMembers-公司人员规模
  - financing-公司融资情况
+ setResult：String类型，picker的默认值设置，按照实际具体的字符串传入即可，一定要跟选择器选择展示的字符串一致才可
``` html
<myPicker pickerType="dateTime" setResult="2018年12月17日 13:22"></myPicker>
```

4.myCalendar ----- 自定义日历组件， prpos值 setDateList，Array类型， 用于标注需要面试的时间

5.calendar ---- 极点日历插件 自己查看官方文档