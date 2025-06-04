FROM node:22.4.1-bookworm

# 各種必要なパッケージの用意
RUN apt-get update \
    && apt-get install -y git vim curl sudo \
    && apt-get clean

# 新規ユーザーの作成
RUN useradd -ms /bin/bash devuser
RUN echo "devuser ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers

# エイリアスの設定
RUN touch /home/devuser/.bash_aliases
RUN echo "# Alias setting" >> /home/devuser/.bash_aliases
RUN echo "alias la='ls -a'" >> /home/devuser/.bash_aliases
RUN echo "alias ll='ls -l'" >> /home/devuser/.bash_aliases

# bashで日本語を使う設定
RUN apt-get update \
    && apt-get install -y locales
RUN locale-gen ja_JP.UTF-8
RUN echo "# Lang setting" >> /home/devuser/.bash_aliases
RUN echo "export LANG=ja_JP.UTF-8" >> /home/devuser/.bash_aliases
RUN echo 'export LANGUAGE="ja_JP:ja"' >> /home/devuser/.bash_aliases
RUN echo 'export LC_ALL="ja_JP.UTF-8"' >> /home/devuser/.bash_aliases
RUN localedef -f UTF-8 -i ja_JP ja_JP.utf8

# 作業ディレクトリの作成
RUN mkdir -p /home/devuser/workspace/frontend
WORKDIR /home/devuser/workspace/frontend

# サーバーを立ち上げるための準備
COPY frontend/package*.json ./ 
RUN npm install
COPY frontend/. .

# 作業ディレクトリの権限の設定
RUN chown -R devuser:devuser /home/devuser/workspace/frontend

# サーバー起動
USER devuser
EXPOSE 3000
CMD ["npm", "run", "dev"]
