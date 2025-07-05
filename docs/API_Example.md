
API的调用方式举例：

// 举例registerData_Input的输入形式
1.注册API
const registerData_Input = {
  username: "testuser8",
  password: "mypassword",
  nickname: "Test User",
  userGroup: "user"
};
<AButton @click="register_API(registerData_Input)">
        <IconFolder />
        注册API
</AButton>

2.登录API
 const loginData_Input = {
   username: "testuser3",
  password: "mypassword",
}

<AButton @click="login_API(loginData_Input)">
<IconFolder />
登录API
</AButton>

3.用Token获得当前用户信息


//测试token，需要更改为每次登陆时临时生成的Token。在Login_API函数中用data.body.token获得登录的Token，然后保存下来。
const token_Input ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywidXNlcm5hbWUiOiJ0ZXN0dXNlcjMiLCJ1c2VyX2dyb3VwIjoidXNlciIsImlhdCI6MTc1MTAzOTAzMCwiZXhwIjoxNzUxMDQ2MjMwfQ.3SRusglhCEJWlilWzuzvdz6aBseiIGSm9NJq_5RDz9k"

<AButton @click="profile(token_Input)">
<IconFolder />
获取当前用户信息API
</AButton>