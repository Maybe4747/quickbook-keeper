# QuickBook Keeper API 接口文档

## 基础 URL

`http://localhost:5000/api`

## 身份验证

所有受保护的路由都需要在 Authorization 头中提供 Bearer 令牌：

```
Authorization: Bearer <token>
```

## 响应格式

所有 API 响应都遵循以下格式：

```json
{
  "code": 0,
  "msg": "操作成功",
  "data": {}
}
```

错误响应：

```json
{
  "code": -1,
  "msg": "错误消息",
  "data": null
}
```

## 接口列表

### 用户身份验证

#### 注册用户

- **POST** `/users/register`
- **描述**: 注册新用户
- **公共路由**
- **请求体**:

```json
{
  "username": "字符串 (必填, 3-30字符)",
  "password": "字符串 (必填, 最少6字符)"
}
```

- **响应**:

```json
{
  "code": 0,
  "msg": "用户注册成功",
  "data": {
    "_id": "ObjectId",
    "username": "字符串",
    "token": "JWT令牌"
  }
}
```

#### 用户登录

- **POST** `/users/login`
- **描述**: 验证用户并获取令牌
- **公共路由**
- **请求体**:

```json
{
  "username": "字符串 (必填)",
  "password": "字符串 (必填)"
}
```

- **响应**:

```json
{
  "code": 0,
  "msg": "用户登录成功",
  "data": {
    "_id": "ObjectId",
    "username": "字符串",
    "token": "JWT令牌"
  }
}
```

#### 获取用户资料

- **GET** `/users/profile`
- **描述**: 获取登录用户的资料
- **受保护路由**
- **响应**:

```json
{
  "code": 0,
  "msg": "获取用户资料成功",
  "data": {
    "_id": "ObjectId",
    "username": "字符串"
  }
}
```

#### 更新用户资料

- **PUT** `/users/profile`
- **描述**: 更新登录用户的资料
- **受保护路由**
- **请求体** (全部可选):

```json
{
  "username": "字符串",
  "password": "字符串 (最少6字符)"
}
```

- **响应**:

```json
{
  "code": 0,
  "msg": "更新用户资料成功",
  "data": {
    "_id": "ObjectId",
    "username": "字符串",
    "token": "JWT令牌"
  }
}
```

### 账单

#### 获取所有账单

- **GET** `/bills`
- **描述**: 获取所有账单，支持分页和过滤
- **受保护路由**
- **查询参数**:
  - `page`: 页码 (默认 1)
  - `limit`: 每页项目数 (默认 10)
  - `type`: 账单类型 ('expense' 或 'income')
  - `categoryId`: 按分类 ID 过滤
  - `startDate`: 开始日期 (格式: YYYY-MM-DD)
  - `endDate`: 结束日期 (格式: YYYY-MM-DD)
  - `keyword`: 在备注字段中搜索关键字
- **响应**:

```json
{
  "code": 0,
  "msg": "获取账单成功",
  "data": {
    "list": [
      {
        "_id": "字符串",
        "amount": "数字",
        "type": "字符串 (expense/income)",
        "categoryId": "字符串",
        "category": {
          "_id": "字符串",
          "name": "字符串",
          "type": "字符串 (expense/income)"
        },
        "date": "日期字符串",
        "note": "字符串",
        "createdAt": "日期字符串"
      }
    ],
    "pagination": {
      "current": "数字",
      "pageSize": "数字",
      "total": "数字"
    },
    "stats": {
      "totalIncome": "数字",
      "totalExpense": "数字"
    }
  }
}
```

#### 根据 ID 获取账单

- **GET** `/bills/:id`
- **描述**: 根据 ID 获取特定账单
- **受保护路由**
- **响应**:

```json
{
  "code": 0,
  "msg": "获取账单成功",
  "data": {
    "_id": "字符串",
    "amount": "数字",
    "type": "字符串 (expense/income)",
    "categoryId": "字符串",
    "date": "日期字符串",
    "note": "字符串",
    "createdAt": "日期字符串"
  }
}
```

#### 创建账单

- **POST** `/bills`
- **描述**: 创建新账单
- **受保护路由**
- **请求体**:

```json
{
  "amount": "数字 (必填)",
  "type": "字符串 (必填, expense/income)",
  "categoryId": "字符串 (必填)",
  "date": "日期字符串 (必填)",
  "note": "字符串 (可选)"
}
```

- **响应**:

```json
{
  "code": 0,
  "msg": "账单创建成功",
  "data": {
    "_id": "字符串",
    "amount": "数字",
    "type": "字符串 (expense/income)",
    "categoryId": "字符串",
    "date": "日期字符串",
    "note": "字符串",
    "createdAt": "日期字符串"
  }
}
```

#### 更新账单

- **PUT** `/bills/:id`
- **描述**: 更新特定账单
- **受保护路由**
- **请求体**:

```json
{
  "amount": "数字",
  "type": "字符串 (expense/income)",
  "categoryId": "字符串",
  "date": "日期字符串",
  "note": "字符串"
}
```

- **响应**:

```json
{
  "code": 0,
  "msg": "账单更新成功",
  "data": {
    "_id": "字符串",
    "amount": "数字",
    "type": "字符串 (expense/income)",
    "categoryId": "字符串",
    "date": "日期字符串",
    "note": "字符串",
    "createdAt": "日期字符串"
  }
}
```

#### 删除账单

- **DELETE** `/bills/:id`
- **描述**: 删除特定账单
- **受保护路由**
- **响应**:

```json
{
  "code": 0,
  "msg": "账单删除成功",
  "data": null
}
```

#### 获取账单摘要

- **GET** `/bills/summary`
- **描述**: 获取摘要统计信息（总收入、支出和余额）
- **受保护路由**
- **响应**:

```json
{
  "code": 0,
  "msg": "获取账单摘要成功",
  "data": {
    "expense": "数字",
    "income": "数字",
    "balance": "数字"
  }
}
```

#### 获取最近账单

- **GET** `/bills/recent`
- **描述**: 获取最近账单（默认 5 条）
- **受保护路由**
- **查询参数**:
  - `limit`: 要返回的账单数量（默认 5）
- **响应**:

```json
{
  "code": 0,
  "msg": "获取最近账单成功",
  "data": [
    {
      "_id": "字符串",
      "amount": "数字",
      "type": "字符串 (expense/income)",
      "categoryId": "字符串",
      "category": {
        "_id": "字符串",
        "name": "字符串",
        "type": "字符串 (expense/income)"
      },
      "date": "日期字符串",
      "note": "字符串",
      "createdAt": "日期字符串"
    }
  ]
}
```

### 分类

#### 获取所有分类

- **GET** `/categories`
- **描述**: 获取所有分类
- **受保护路由**
- **响应**:

```json
{
  "code": 0,
  "msg": "获取分类成功",
  "data": [
    {
      "_id": "字符串",
      "name": "字符串",
      "type": "字符串 (expense/income)",
      "createdAt": "日期字符串"
    }
  ]
}
```

#### 根据 ID 获取分类

- **GET** `/categories/:id`
- **描述**: 根据 ID 获取特定分类
- **受保护路由**
- **响应**:

```json
{
  "code": 0,
  "msg": "获取分类成功",
  "data": {
    "_id": "字符串",
    "name": "字符串",
    "type": "字符串 (expense/income)",
    "createdAt": "日期字符串",
    "updatedAt": "日期字符串"
  }
}
```

#### 创建分类

- **POST** `/categories`
- **描述**: 创建新分类
- **受保护路由**
- **请求体**:

```json
{
  "name": "字符串 (必填)",
  "type": "字符串 (必填, expense/income)"
}
```

- **响应**:

```json
{
  "code": 0,
  "msg": "分类创建成功",
  "data": {
    "_id": "字符串",
    "name": "字符串",
    "type": "字符串 (expense/income)",
    "createdAt": "日期字符串"
  }
}
```

#### 更新分类

- **PUT** `/categories/:id`
- **描述**: 更新特定分类
- **受保护路由**
- **请求体**:

```json
{
  "name": "字符串",
  "type": "字符串 (expense/income)"
}
```

- **响应**:

```json
{
  "code": 0,
  "msg": "分类更新成功",
  "data": {
    "_id": "字符串",
    "name": "字符串",
    "type": "字符串 (expense/income)",
    "updatedAt": "日期字符串"
  }
}
```

#### 删除分类

- **DELETE** `/categories/:id`
- **描述**: 删除特定分类
- **受保护路由**
- **响应**:

```json
{
  "code": 0,
  "msg": "分类删除成功",
  "data": null
}
```

## 错误响应

所有错误响应都遵循以下格式：

```json
{
  "code": -1,
  "msg": "错误消息",
  "data": null
}
```

## 状态码

- `200`: 成功
- `201`: 已创建
- `400`: 请求错误
- `401`: 未授权
- `404`: 未找到
- `500`: 服务器错误
