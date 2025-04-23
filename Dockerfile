# 使用官方 Nginx 基础镜像
FROM nginx:alpine

# 删除默认的 Nginx 页面
RUN rm -rf /usr/share/nginx/html/*

# 将构建生成的 dist 文件夹复制到 Nginx 的静态资源目录中
COPY dist/ /usr/share/nginx/html/

# 将自定义的 Nginx 配置文件复制到 Nginx 的配置目录中
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 暴露 Nginx 的端口
EXPOSE 80

# 启动 Nginx
CMD ["nginx", "-g", "daemon off;"]


# docker build --platform linux/amd64 -t cms-web:latest .
# docker push cms-web:latest


# docker login --username=a2506377990 --password aiziji500 crpi-wali3s44jxv70u4q.cn-beijing.personal.cr.aliyuncs.com
# docker tag [ImageId] crpi-wali3s44jxv70u4q.cn-beijing.personal.cr.aliyuncs.com/xiaoia/cms:latest
# docker push crpi-wali3s44jxv70u4q.cn-beijing.personal.cr.aliyuncs.com/xiaoia/cms:latest


# docker run -d -p 8080:80 --name cms-web --restart=always crpi-wali3s44jxv70u4q.cn-beijing.personal.cr.aliyuncs.com/xiaoia/cms:latest
