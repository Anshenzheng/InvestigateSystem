# 在线问卷系统

一个基于 Angular + Java + MySQL 开发的在线问卷系统，支持创建、发布、填写和统计问卷。

## 功能特性

- ✅ 用户注册/登录（JWT 认证）
- ✅ 创建问卷（支持单选、多选题型）
- ✅ 发布/取消发布问卷
- ✅ 匿名问卷（允许非登录用户填写）
- ✅ 非匿名问卷（必须登录才能填写）
- ✅ 问卷结果统计（图表展示）
- ✅ 极简清新的 UI 风格

## 技术栈

### 后端
- Java 11
- Spring Boot 2.7.18
- Spring Security + JWT
- Spring Data JPA
- MySQL 8.0
- Maven

### 前端
- Angular 16
- TypeScript
- Chart.js + ng2-charts（图表展示）
- SCSS 样式

## 项目结构

```
InvestigateSystem/
├── backend/                    # 后端 Java 项目
│   ├── src/
│   │   └── main/
│   │       ├── java/com/survey/
│   │       │   ├── config/           # 配置类
│   │       │   ├── controller/       # 控制器
│   │       │   ├── dto/              # 数据传输对象
│   │       │   ├── entity/           # 实体类
│   │       │   ├── repository/       # 数据访问层
│   │       │   ├── security/         # 安全相关
│   │       │   └── service/          # 业务逻辑层
│   │       └── resources/
│   │           └── application.properties
│   └── pom.xml
├── frontend/                   # 前端 Angular 项目
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/               # 核心模块
│   │   │   │   ├── guards/         # 路由守卫
│   │   │   │   ├── interceptors/   # 拦截器
│   │   │   │   └── services/       # 服务
│   │   │   ├── models/             # 数据模型
│   │   │   └── pages/              # 页面组件
│   │   ├── index.html
│   │   ├── main.ts
│   │   └── styles.scss
│   ├── angular.json
│   ├── package.json
│   └── tsconfig.json
└── database/                   # 数据库脚本
    └── init.sql
```

## 快速开始

### 环境准备

确保你的开发环境已安装：
- JDK 11+
- Node.js 18+
- MySQL 8.0+
- Maven 3.6+
- Angular CLI 16+ (`npm install -g @angular/cli@16`)

### 1. 初始化数据库

```bash
# 登录 MySQL
mysql -u root -p

# 执行初始化脚本
source database/init.sql
```

或者手动创建数据库：
```sql
CREATE DATABASE survey_system DEFAULT CHARACTER SET utf8mb4;
```

修改数据库配置：`backend/src/main/resources/application.properties`
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/survey_system
spring.datasource.username=root
spring.datasource.password=你的密码
```

### 2. 启动后端

```bash
cd backend

# 安装依赖并启动
mvn clean install
mvn spring-boot:run
```

后端服务将在 `http://localhost:8080` 启动。

### 3. 启动前端

```bash
cd frontend

# 安装依赖
npm install

# 启动开发服务器
npm start
```

前端应用将在 `http://localhost:4200` 启动。

### 4. 访问系统

打开浏览器访问：`http://localhost:4200`

## API 接口

### 认证接口
| 方法 | 路径 | 说明 |
|------|------|------|
| POST | /api/auth/register | 用户注册 |
| POST | /api/auth/login | 用户登录 |
| GET | /api/auth/me | 获取当前用户信息 |

### 问卷接口
| 方法 | 路径 | 说明 | 权限 |
|------|------|------|------|
| GET | /api/surveys/my | 获取我的问卷 | 需登录 |
| GET | /api/surveys/:id | 获取问卷详情 | 需登录 |
| POST | /api/surveys | 创建问卷 | 需登录 |
| PUT | /api/surveys/:id | 更新问卷 | 需登录 |
| DELETE | /api/surveys/:id | 删除问卷 | 需登录 |
| POST | /api/surveys/:id/publish | 发布问卷 | 需登录 |
| POST | /api/surveys/:id/unpublish | 取消发布 | 需登录 |

### 公开问卷接口
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/surveys/public | 获取所有已发布问卷 |
| GET | /api/surveys/public/:id | 获取已发布问卷详情 |

### 回答接口
| 方法 | 路径 | 说明 |
|------|------|------|
| POST | /api/responses | 提交问卷回答 |
| GET | /api/responses/survey/:id | 获取问卷的所有回答 | 需登录（创建者） |

### 统计接口
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/statistics/survey/:id | 获取问卷统计数据 |

## 使用流程

### 1. 注册/登录
1. 访问首页，点击「注册」创建账号
2. 使用账号密码登录系统

### 2. 创建问卷
1. 登录后点击「我的问卷」→「创建问卷」
2. 填写问卷标题、描述
3. 选择问卷类型：
   - **匿名问卷**：允许非登录用户填写
   - **需登录填写**：只有登录用户才能填写
4. 添加问题：
   - 支持单选、多选题型
   - 设置是否必填
   - 添加选项
5. 点击「保存问卷」

### 3. 发布问卷
1. 在「我的问卷」列表中找到创建的问卷
2. 点击「发布」按钮
3. 发布后问卷将出现在「问卷广场」

### 4. 填写问卷
1. 在「问卷广场」找到感兴趣的问卷
2. 点击「参与问卷」
3. 选择选项后点击「提交问卷」

### 5. 查看统计
1. 在「我的问卷」列表中找到已发布的问卷
2. 点击「统计」查看结果
3. 支持饼图和进度条两种可视化方式

## 数据库设计

### 核心表结构

| 表名 | 说明 |
|------|------|
| users | 用户表 |
| surveys | 问卷表 |
| questions | 问题表 |
| options | 选项表 |
| responses | 回答记录表 |
| answers | 答案表 |

## 特性说明

### 匿名与非匿名问卷
- **匿名问卷** (`is_anonymous = true`)
  - 发布后任何人都可以填写
  - 无需登录
  - 适用于公开调研

- **非匿名问卷** (`is_anonymous = false`)
  - 只有登录用户才能填写
  - 会记录填写者信息
  - 适用于内部调查

### 用户权限
- **已登录用户**：
  - 创建、编辑、删除、发布问卷
  - 查看自己创建的问卷统计
  - 填写所有问卷（包括需要登录的）

- **未登录用户**：
  - 只能查看和填写匿名问卷
  - 无法创建问卷
  - 无法查看统计

## 开发说明

### 后端开发
- 项目使用 Spring Boot 2.7.x（支持 Java 11）
- JPA 自动建表，首次运行会自动创建数据库表
- JWT 令牌有效期 24 小时

### 前端开发
- 使用 Angular 16 + Standalone Components
- 样式使用 SCSS，主题色为紫色 (#6366f1)
- 图表使用 ng2-charts + Chart.js

## 常见问题

### 1. 数据库连接失败
检查 MySQL 是否启动，用户名密码是否正确，数据库是否已创建。

### 2. 前端无法访问后端
确认后端已在 8080 端口启动，CORS 配置正确。

### 3. 登录后刷新页面状态丢失
这是正常的，JWT 存储在 localStorage 中，刷新页面后状态应该保持。如果丢失，请检查浏览器是否禁用了 localStorage。

## License

MIT License
