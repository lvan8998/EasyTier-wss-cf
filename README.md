# EasyTier WSS CF

EasyTier WSS CF 是一个**完全独立部署在 Cloudflare Workers 上**的 EasyTier WSS 支持项目。

它不是代理服务器，也不依赖你自己的公网中转机，而是直接运行在 Cloudflare Workers + Durable Objects 上，提供以下能力：

- EasyTier WSS 接入
- 管理后台
- 路由配置管理
- 同一路由内的连接协调
- 基础连接统计与事件记录

## 项目定位

这个项目的目标很明确：

> 让 EasyTier 的 `wss` 接入直接跑在 Cloudflare Workers 上。

部署完成后，你会得到一个可以直接使用的 Workers 入口，客户端通过它连接 EasyTier，不需要额外准备中转服务器。

## 主要功能

- **独立运行**：整个服务只依赖 Cloudflare Workers。
- **管理后台**：支持新增、编辑、删除路由。
- **支持 EasyTier WSS**：每条路由都有独立的 `wss://` 入口。
- **密码保护**：后台登录密码通过 Cloudflare Workers Secret 设置。
- **路由可视化**：可以查看每条路由的公用入口、EasyTier 命令和连接状态。

## 工作原理

### 1. 管理后台

管理后台地址是：

```text
/panel
```

后台可以用来：

- 登录
- 创建路由
- 修改路由
- 删除路由
- 查看连接统计
- 复制 EasyTier 连接命令

### 2. EasyTier WSS 接入

每条路由都有一个公开入口：

```text
wss://<你的域名>/ws/<route-id>/<client-token>
```

EasyTier 客户端会直接连接到这个地址。

### 3. Durable Objects

项目使用两个 Durable Object：

- `AdminStore`：保存路由、统计和事件
- `RouteHub`：负责同一路由内的 WebSocket 连接协调

### 4. 协议处理

Workers 接收到 WSS 连接后，会根据 EasyTier 的 peer 信息在同一路由内进行消息协调，从而让多个客户端正确建立连接。

## 接口说明

### 页面

- `/panel`：管理后台

### API

- `/api/login`：后台登录
- `/api/state`：获取后台状态
- `/api/routes`：创建路由
- `/api/routes/:id`：读取、更新、删除路由
- `/api/routes/:id/test`：验证路由配置

### WSS

- `/ws/:routeId/:clientToken`：EasyTier WSS 接入入口

## 后台密码如何设置

后台密码不要写死在代码里，而是应该在 Cloudflare Workers 的部署配置里设置。

推荐使用这个变量名：

- `ADMIN_PASSWORD`

项目也兼容旧变量：

- `ADMIN_SECRET`

但新部署建议优先使用 `ADMIN_PASSWORD`，语义更清晰。

## 部署方式

本项目推荐的部署方式是：

1. 先在 GitHub 上 fork 本项目
2. 再在 Cloudflare Workers 网页后台连接你的 GitHub 仓库并部署
3. 最后在 Cloudflare Dashboard 里设置后台密码

整个过程**不需要在本地执行命令**。

### 第一步：Fork 仓库

先把本项目 fork 到你自己的 GitHub 账号下。

### 第二步：在 Cloudflare Workers 网页上部署

进入 Cloudflare Dashboard 的 Workers 创建页面，选择从 GitHub 导入项目，然后绑定你 fork 后的仓库。

Cloudflare 会自动读取仓库中的 `wrangler.toml` 和源码文件，并完成部署。

### 第三步：设置后台密码

部署完成后，进入 Cloudflare Dashboard 中该 Worker 的设置页面，在 **Secrets / Variables** 中添加：

- `ADMIN_PASSWORD`

然后填写你自己的后台密码。

例如：

```text
MyStrongPanelPassword123
```

如果你之前用过旧变量名，也可以继续保留 `ADMIN_SECRET`，但建议以后统一使用 `ADMIN_PASSWORD`。

### 第四步：打开管理后台

部署完成后，访问：

```text
https://你的 Workers 域名/panel
```

然后使用你设置的 `ADMIN_PASSWORD` 登录。

## 创建 EasyTier 路由

登录后台后，你可以创建一条路由，并填写：

- 路由名称
- `network-name`
- `network-secret`
- `client token`
- 启用/禁用状态
- 备注

创建完成后，后台会自动生成：

- 公用 WSS 地址
- EasyTier 启动命令

示例命令如下：

```bash
sudo easytier-core -d --network-name <name> --network-secret <secret> -p 'wss://your-domain/ws/<route-id>/<client-token>'
```

## EasyTier 客户端如何连接

你只需要把后台生成的命令复制到客户端使用即可。

示例：

```bash
sudo easytier-core -d --network-name my-network --network-secret my-secret -p 'wss://your-domain/ws/route-id/client-token'
```

## GitHub Pages 介绍页

仓库已经提供一个 Apple 风格的静态介绍页，文件位于：

- `docs/index.html`

### 启用 GitHub Pages

如果你想把这个介绍页发布到 GitHub Pages，可以在仓库设置里这样操作：

1. 打开仓库的 **Settings**
2. 进入 **Pages**
3. 在 **Build and deployment** 中选择 **Deploy from a branch**
4. 分支选择 `main`
5. 目录选择 `/docs`
6. 保存设置

设置完成后，GitHub Pages 就会使用 `docs/index.html` 作为站点首页。

### Pages 页面内容

这个 GitHub Pages 页面包含：

- 项目介绍
- 架构说明
- Cloudflare Workers 部署说明
- 后台密码设置说明
- EasyTier 路由创建说明
- 常见问题

## 配置建议

- `network-name`：建议使用有辨识度的名称
- `network-secret`：请使用足够强的共享密钥
- `client token`：建议保持随机且唯一
- 后台密码：请使用独立且足够强的密码

## 常见问题

### 1. 这个项目是代理别的 WSS 服务吗？

不是。这个项目本身就是运行在 Cloudflare Workers 上的 EasyTier WSS 支持实现。

### 2. 为什么后台密码要放到 Workers Secret？

因为这是 Cloudflare Workers 的推荐做法，能避免把敏感信息写进仓库代码。

### 3. 可以只部署一份 Workers 吗？

可以。这个项目就是按单 Worker 独立部署设计的。

### 4. 部署时一定要本地操作吗？

不需要。你可以直接通过 GitHub fork + Cloudflare Workers 网页完成部署。

## 开发与测试

如果你需要在本地自检，可以运行：

```bash
npm test
```

以及语法检查：

```bash
node --check src/index.js
node --check src/route-hub.js
node --check src/store.js
node --check src/relay.js
node --check src/ui.js
```

## 目录说明

- `src/index.js`：Worker 入口和 API 路由
- `src/route-hub.js`：WSS 连接协调
- `src/store.js`：路由和统计存储
- `src/auth.js`：后台令牌签名与验证
- `src/ui.js`：管理后台页面
- `docs/index.html`：GitHub Pages 介绍页
- `wrangler.toml`：Cloudflare Workers 配置

## 许可证

本项目采用 MIT License，详见 `LICENSE`。
