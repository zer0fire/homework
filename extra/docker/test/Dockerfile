# Dockerfile
FROM treehouses/pm2
WORKDIR /usr/src/app
ADD ./koa /usr/src/app
RUN npm config set registry https://registry.npm.taobao.org/ && \
    npm cache clean --force && \
    npm i
EXPOSE 3000
#pm2在docker中使用命令为pm2-docker
CMD ["pm2-runtime", "start", "--json", "process.json"]
