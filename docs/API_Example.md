
API的调用方式举例：

// 举例registerData_Input的输入形式
1.注册API

数据形式：
const registerData_Input = {
  username: "testuser8",
  password: "mypassword",
  nickname: "Test User",
  userGroup: "user"
};

调用方法：
<AButton @click="register_API(registerData_Input)">
        <IconFolder />
        注册API
</AButton>

2.登录API

数据形式：
 const loginData_Input = {
   username: "testuser3",
  password: "mypassword",
}

调用方法：
<AButton @click="login_API(loginData_Input)">
<IconFolder />
登录API
</AButton>

3.用Token获得当前用户信息

数据形式：
//测试token，需要更改为每次登陆时临时生成的Token。在Login_API函数中用data.body.token获得登录的Token，然后保存下来。
const token_Input ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywidXNlcm5hbWUiOiJ0ZXN0dXNlcjMiLCJ1c2VyX2dyb3VwIjoidXNlciIsImlhdCI6MTc1MTAzOTAzMCwiZXhwIjoxNzUxMDQ2MjMwfQ.3SRusglhCEJWlilWzuzvdz6aBseiIGSm9NJq_5RDz9k"

调用方法：
<AButton @click="profile(token_Input)">
<IconFolder />
获取当前用户信息API
</AButton>

4.创建文件夹API

数据形式：
const folder_Data_Input = {
  name: "testFolder13",
  parent_folder_id: null,
}

调用方法：
<AButton size="large" @click="createFolder(token_Input, folder_Data_Input)">
  <template #icon><Icon name="ri:file-copy-line" /></template>
  创建文件夹
</AButton>

5.重命名文件夹API

数据形式：
const reName_Data_Input = {
  new_name: "22233"
}
const folderId_Input = '10'; // 要重命名的文件夹ID

调用方法：
  <AButton size="large" @click="reNameFolder(token_Input, reName_Data_Input, folderId_Input)">
  <template #icon><Icon name="ri:file-copy-line" /></template>
  重命名文件夹
</AButton>



6.删除文件夹API
数据形式：const folderId_Input = '10'; // 要删除的文件夹ID，和重命名的一样

调用方法：
<AButton size="large" @click="deleteFolder(token_Input, folderId_Input)">
  <template #icon><Icon name="ri:file-copy-line" /></template>
  删除文件夹
</AButton>