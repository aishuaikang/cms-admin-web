# 项目名称

cms-admin

## 项目简介

这是一个使用 Vite 构建的 React 项目，使用 TypeScript 作为开发语言，集成了许多常用的技术栈和工具。该项目使用 Zustand 作为状态管理库，使用 React Router 作为路由管理库，使用 Styled Components 作为 CSS-in-JS 解决方案，使用 Antd 作为 UI 组件库，使用 Dayjs 作为日期和时间处理库，使用 Immer 作为不可变数据结构库，使用 Ahooks 作为 React Hooks 库。

## 如何使用

### 安装依赖

```bash
pnpm install
```

### 运行

```bash
pnpm dev
```

### 构建

```bash
pnpm build
```

### 预览

```bash
pnpm preview
```

### 代码规范

```bash
pnpm lint
```

### 代码格式化

```bash
pnpm format
```

### 提交代码

```bash
# 已将 git add -A 与 git commit -m "\*" 包装为以下命令

pnpm commit
```

### 部署

```bash
docker run \
-p 7000:8000 \
-p 7001:8001 \
-p 7002:8002 \
-p 7003:8003 \
--name nginx \
-v /home/tester/cms/web/nginx/conf/nginx.conf:/etc/nginx/nginx.conf \
-v /home/tester/cms/web/nginx/conf/conf.d:/etc/nginx/conf.d \
-v /home/tester/cms/web/nginx/log:/var/log/nginx \
-v /home/tester/cms/web/nginx/html:/usr/share/nginx/html \
-d nginx:latest

docker run \
-p 7000:8000 \
-p 7001:8001 \
-p 7002:8002 \
-p 7003:8003 \
--name nginx \
-v /home/noder/cms/web/nginx/conf/nginx.conf:/etc/nginx/nginx.conf \
-v /home/noder/cms/web/nginx/conf/conf.d:/etc/nginx/conf.d \
-v /home/noder/cms/web/nginx/log:/var/log/nginx \
-v /home/noder/cms/web/nginx/html:/usr/share/nginx/html \
-d nginx:latest
```

1. 登录阿里云 Docker Registry
   $ docker login --username=a2506377990 crpi-wali3s44jxv70u4q.cn-beijing.personal.cr.aliyuncs.com
   用于登录的用户名为阿里云账号全名，密码为开通服务时设置的密码。

您可以在访问凭证页面修改凭证密码。

2. 从 Registry 中拉取镜像
   $ docker pull crpi-wali3s44jxv70u4q.cn-beijing.personal.cr.aliyuncs.com/xiaoia/cms:[镜像版本号]
3. 将镜像推送到 Registry
   $ docker login --username=a2506377990 crpi-wali3s44jxv70u4q.cn-beijing.personal.cr.aliyuncs.com
   $ docker tag [ImageId] crpi-wali3s44jxv70u4q.cn-beijing.personal.cr.aliyuncs.com/xiaoia/cms:[镜像版本号]
   $ docker push crpi-wali3s44jxv70u4q.cn-beijing.personal.cr.aliyuncs.com/xiaoia/cms:[镜像版本号]
   请根据实际镜像信息替换示例中的[ImageId]和[镜像版本号]参数。

4. 选择合适的镜像仓库地址
   从 ECS 推送镜像时，可以选择使用镜像仓库内网地址。推送速度将得到提升并且将不会损耗您的公网流量。

如果您使用的机器位于 VPC 网络，请使用 crpi-wali3s44jxv70u4q-vpc.cn-beijing.personal.cr.aliyuncs.com 作为 Registry 的域名登录。

5. 示例
   使用"docker tag"命令重命名镜像，并将它通过专有网络地址推送至 Registry。

$ docker images
REPOSITORY TAG IMAGE ID CREATED VIRTUAL SIZE
registry.aliyuncs.com/acs/agent 0.7-dfb6816 37bb9c63c8b2 7 days ago 37.89 MB
$ docker tag 37bb9c63c8b2 crpi-wali3s44jxv70u4q-vpc.cn-beijing.personal.cr.aliyuncs.com/acs/agent:0.7-dfb6816
使用 "docker push" 命令将该镜像推送至远程。

$ docker push crpi-wali3s44jxv70u4q-vpc.cn-beijing.personal.cr.aliyuncs.com/acs/agent:0.7-dfb6816
