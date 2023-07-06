container （可读写） -> image （只读） -> image ...

docker --version

<!-- run -->

<!-- 第一次会到 docker hub 拉取镜像 -->

Docker hub 是官方的镜像社区网站
docker container run nginx
docker run nginx

<!-- 展示运行中 -->

docker container ls
docker ps

<!-- 编号模式 -->

docker container ls -aq

<!-- 展示所有 -->

docker container ps -a
docker container ps -aq

<!-- 关闭 -->

docker container stop $(docker container ps -aq)
docker stop
docker container rm $(docker container ps -aq)
docker container rm $(code) -f
docker rm

<!-- 端口映射 -->
<!-- 前台模式 attach 模式 -->

-p 端口映射，前面是本机端口，后面是容器的端口，比如吧 Docker 的 80 映射到就本机的 90，需要 90:80
docker container run -p 80:80 nginx

<!-- 后台模式 detach 模式 -->

docker container run -d -p 80:80 nginx

<!-- 后转前 -->

docker attach $(code)

<!-- log -->

docker container logs $(code)

<!-- 跟踪 log -->

docker container logs -f $(code)

<!-- 交互默认 -it -->

docker container run -it ubuntu sh

<!-- 退出交互 -->

容器中输入 "exit"

<!-- 进入交互模式 -->

exec 执行，-it 交互模式，sh 交互的方式，用 shell 交互
docker exec -it $(code) sh

## 获取镜像的机种方式

pull from registry (online)
Dockerfile (online)
自有文件导入 (offline)

## 示例： WordPress

docker pull wordpress

docker image

<!-- 拉取镜像 -->

docker image pull $(image-name)

<!-- 查看所有镜像 -->

docker image ls
docker image inspect baf

官方的方式如果不够的话，可以从其他网站上拉取镜像，比如 https://quay.io

<!-- 从其他网站拉取 -->

docker image pull quay.io/calico/node

<!-- 查看镜像具体信息 -->

docker image inspect $(image-id/name)

<!-- 删除 -->

docker image rm

<!-- 导出镜像 -->

-o 代表输出，后面代表输出的名字
docker image save busybox:latest -o myBusybox.image

<!-- 导入镜像 -->

docker image load -i ./myBusybox.image

# Dockerfile

1. 用于构建 docker 镜像的文件
2. 包含了构建镜像需要的指令
3. 有其特定的语法规则

尝试制作一个镜像，安装一个 ubuntu 系统，并且下载安装 python 环境

```shell
apt-get update && \
DEBIAN_FRONTEND=noninteractive apt-get install --no-install-recommends -y python3.9 python3-pip python3.9-dev
print("Hello JSPang")
python3 hello.py
```

<!-- 通过 Dockerfile 构建镜像 -->

docker image build -t $(image-name) $(file-path)
docker image build -t jspang .
docker image build -f $(file-name) -t $(image-name)

<!-- 社区镜像发布，先去一个符合社区的名称 -->

docker image build -t jspangcom/jspang

<!-- 改名 -->

docker image tag $(old image name) $(new image name)

<!-- 推送 -->

docker login
docker image push $(name:[tag])

docker container run -d $(image-name) -p 80:80

<!-- Docker file 关键字 -->

## FROM

FROM 基础镜像
选择镜像的三个基本原则：官方优于非官方，固定版本的 tag 优于 latest (生产项目)，功能满足尽量体积小

## RUN

RUN 执行指令。RUN 没一个都是一个分层，所以要适当少用 RUN，否则打包出来的镜像会变大

```dockerfile
FROM ubuntu:latest
RUN apt-get update
RUN apt-get install -y wget
RUN wget https://github.com/ipinfo/cli/releases/download/ipinfo-2.0.1/ipinfo_2.0.1_linux_amd64.tar.gz
RUN tar zxf ipinfo_2.0.1_linux_amd64.tar.gz
RUN mv ipinfo_2.0.1_linux_amd64 /usr/bin/ipinfo
RUN rm -rf ipinfo_2.0.1_linux_amd64.tar.gz
```

正确的 RUN 指令，是把所有的执行命令放到一个 RUN

```dockerfile
FROM ubuntu:latest
RUN apt-get update && \
    apt-get install -y wget && \
    wget https://github.com/ipinfo/cli/releases/download/ipinfo-2.0.1/ipinfo_2.0.1_linux_amd64.tar.gz && \
    tar zxf ipinfo_2.0.1_linux_amd64.tar.gz && \
    mv ipinfo_2.0.1_linux_amd64 /usr/bin/ipinfo && \
    rm -rf ipinfo_2.0.1_linux_amd64.tar.gz
```

## COPY

复制普通文件，如果复制的路径不存在，就会自动创建（可以复制本地文件）

```dockerfile
FROM node:alpine3.14
COPY index.js  /app/index.js
```

## ADD

ADD 和 COPY 稍微不同，ADD 会解压 gzip 文件

```dockerfile
FROM node:alpine3.14
ADD index.tar  /app/
```

## WORKDIR

切换工作目录，比如切换到 /app 工作目录，所有操作会进入 /app 下执行

```dockerfile
FROM node:alpine3.14
WORKDIR /app
ADD index.tar  index.js
```

## ARG 和 ENV 变量

注意 ENV 变量值不能有任何空格，ARG 也是，在普通变量上没什么区别，两者都行

```dockerfile
FROM ubuntu:latest
# ARG VERSION=2.0.1
ENV VERSION=2.0.1
RUN apt-get update && \
    apt-get install -y wget && \
    wget https://github.com/ipinfo/cli/releases/download/ipinfo-${VERSION}/ipinfo_${VERSION}_linux_amd64.tar.gz && \
    tar zxf ipinfo_${VERSION}_linux_amd64.tar.gz && \
    mv ipinfo_${VERSION}_linux_amd64 /usr/bin/ipinfo && \
    rm -rf ipinfo_${VERSION}_linux_amd64.tar.gz
```

两者的区别

1. ARG 是构建环境，ENV 是可以带到镜像中，镜像中 `env` 命令可以看到 ENV 变量
2. ARG 可以在构建中改变，ENV 不可变，使用 --build-arg $()

docker image build -f Dockerfile.ARG -t ipinfo-arg-2.0.0 --build-arg $(arg-name)=$(arg-value) $(dir)

## CMD 命令

<!-- 批量删除已经退出的容器 -->

docker system prune -f

<!-- 批量删除所有没有在使用的镜像 -->

docker image prune -a

CMD 命令需要遵守几个规则

1. 容器启动时默认执行
2. 如果 docker container run 启动时制定了其他命令，那么 CMD 失效
3. 如果定义了多个 CMD，只有最后一个 CMD 生效

```dockerfile
FROM ubuntu:latest
ENV VERSION=2.0.1
RUN apt-get update && \
    apt-get install -y wget && \
    wget https://github.com/ipinfo/cli/releases/download/ipinfo-${VERSION}/ipinfo_${VERSION}_linux_amd64.tar.gz && \
    tar zxf ipinfo_${VERSION}_linux_amd64.tar.gz && \
    mv ipinfo_${VERSION}_linux_amd64 /usr/bin/ipinfo && \
    rm -rf ipinfo_${VERSION}_linux_amd64.tar.gz
CMD ["ipinfo","version"]
```

## ENTRYPOINT

ENTRYPOINT 也是设置容器启动时要执行的命令，但和 CMD 有区别

1. CMD 设置的命令，可以再 docker container run 传入其他命令覆盖，但是 ENTRYPOINT 一定会执行
2. ENTRYPOINT 可以和 CMD 联合使用，ENTRYPOINT 设置执行的方法， CMD 用于传参数

docker container run --rm -t demo-entrypoint echo "jspang.com"

```dockerfile
FROM ubuntu:21.04
ENTRYPOINT ["echo"]
CMD []
```

## VOLUME

VOLUME ["/${dir name}"] 访问文件夹，没有就创建

docker history $(image-id) 具体镜像的分层情况

docker container run -d my-image
docker container exec -it $(ID) sh

docker image build -f Dockerfile-cmd -t demo-cmd
docker container run -it demo-cmd

<!-- volume 镜像数据本地持久化 -->

docker volume ls
docker volume inspect $(volume-name|data-name)
docker -v $(data-name):$(data-path)
docker container run -d -v my-data:/app my-image
docker volume ls
docker container ls

<!-- 删除容器 -->

docker container rm -f e00

<!-- 从 volume 中恢复数据 -->

docker container run -d -v my-data:/app my-image

<!-- Bind mount 数据持久化，绑定到自定义位置 -->

docker container run -it -v ${pwd}:/app node sh

docker container run

docker container inspect --format '{{.Config.ExposedPorts}}' <ContainerID>

docker-compose.yml

docker-compose 复用命令、shell 形式，可以执行多条命令

docker compose up
docker compose up -d
docker compose ps
docker-compose -p $(container name) up -d
