# 佳琦哥给的建议

1. 偏向务实 Be pragmatic

   1. 实现功能 implement the functions
   2. 能力的发掘 Dig the ability / Ability discovery
      1. 看沟通 communication ability
      2. 看组织代码能力 organize the code
   3. 承认 nest 不熟悉，我是个前端，我经历也是前端，所以如果后端答的不好也见谅
      Actually I applying the post of front-end developer, my resume also mentioned that, I'm not very familiar with nest framework, so if you want to ask me something about nest.js, please forgive me if I made some mistake
      I finished the coding challenge by google\ some document and some ai helping, all of things I can imagine

      I think these backend coding types is very complex / complicated when you first try to write, but if you adapt these types, you will also write code fast

   4. 切换环境，代码速度 Coding Speed, Change the environment
   5. 一开始速出，稳定了慢慢补，敏捷软件开发的要点

2. More new feature process

   1. Restful API review：GET POST DELETE PUT PATCH JSON schema
   2. 错误处理 Error handling
      1. 返回多个状态码 return more status code
      2. 401 Unauthorized 403 Forbidden(Authorize but not allow)
      3. lock the user 429 too many attempts
      4. try catch handle the error
      5. use sentry in the nest.js
   3. log 和监控 Grafana monitor, if you want to know more detail about the application, you need logging system and a monitor system
      1. winston
   4. 安全性 Security,
      1. use interceptor to remove all sensitive message
      2. use rate limit control access request frequency
      3. use https by library `helmet`
   5. i18n internationalization
   6. type 补一下, fill in the type
   7. 缓存 cache, redis cache
   8. corepack prepare pnpm@latest --activate
   9. 压力测试 stress test
   10. 数据格式 Data format
       - 数据 dto 删除
   11. Coding process 处理
       - import but not used，删除

3. 练，多练，practice, more practice, more confident

4. Introduce my project
   - Write down all you want to say, Actually I think if I can speak slowly, I'll reduce modal particle frequency

First you need to tell the interviewee

Thanks for your time and this is my project demonstration
Firstly, secondly, finally
Basis on these two api

How it works

I have experience of programming, Actually I learned nest in three weeks, I can learn about new tech in a short time

I'm focus on developing technical stack, I'm learning more skills on React\WebGL\Next.js, actually

Firstly, I build a backend project by use Nest framework, it has been warp by docker, so we will start it by the command `Docker compose up`

After that, I add the document system by nest/swagger, and access /api/doc path will return the page of document
There are two interface, two post request that used to implement the function of the challenge, and other interfaces are the basis of the project,

I'll introduce these two interface, init interface used to create the seed data for users and /auth/login interface used to implement the user login function

Other three interface, firstly the main path interface is used to access the project start, and second the user interface is implement to search all users, and the user interface include id is implement the function of the unique user searching

and this is my e2e testing, actually I just write a part of testing, because some testing isn't recoverable, so for the reduce develop time, I reduce some testing

I use mongoDB to store the user data

I use redis to store the attempts data by use the expires time

Thanks for your time and this is my project demonstration

Be confident, and guide the interviewee to enter your area

I got it / I see
