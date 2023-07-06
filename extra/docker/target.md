# 用 vite 创建一个 React 项目，并且用 pm2 启动

ngix + node(pm2) + npm

ngix 配置地址映射，假如 localhost:8080 -> localhost

node 安装

nginx 镜像，-v 持久化映射到本地

pm2 镜像，process.json 启动了 koa 服务，对外暴露端口

docker-compose.yml 配置 pm2 和 nginx 形成一个容器
