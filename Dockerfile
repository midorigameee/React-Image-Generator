FROM node:22.4.1-bookworm AS fullstack

# 必要なパッケージのインストール
RUN apt-get update && apt-get install -y \
    git vim curl sudo \
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

### bashでGit情報を表示させるプロンプトの設定
RUN echo "# Git setting" >> ~/.bashrc
RUN echo "source /usr/share/bash-completion/completions/git" >> ~/.bashrc

WORKDIR /usr/share/bash-completion/completions

RUN curl -O https://raw.githubusercontent.com/git/git/master/contrib/completion/git-prompt.sh
RUN curl -O https://raw.githubusercontent.com/git/git/master/contrib/completion/git-completion.bash
RUN chmod a+x git*.*
RUN ls -l $PWD/git*.* | awk '{print "source "$9}' >> ~/.bashrc

RUN echo "GIT_PS1_SHOWDIRTYSTATE=true" >> ~/.bashrc
RUN echo "GIT_PS1_SHOWUNTRACKEDFILES=true" >> ~/.bashrc
RUN echo "GIT_PS1_SHOWUPSTREAM=auto" >> ~/.bashrc

RUN echo 'export PS1="\[\033[01;32m\]\u@\h\[\033[01;33m\] \w \[\033[01;31m\]\$(__git_ps1 \"(%s)\") \\n\[\033[01;34m\]\\$ \[\033[00m\]"' >> ~/.bashrc

# 作業ディレクトリ
RUN mkdir -p /home/devuser/workspace
WORKDIR /home/devuser/workspace

### Gitの設定
RUN git config --global --add safe.directory /home/devuser/workspace
RUN git config --global core.quotepath false
RUN git config --global push.default current

# Nodeの準備
RUN mkdir -p /home/devuser/workspace/frontend
COPY ./frontend/package*.json ./frontend
WORKDIR /home/devuser/workspace/frontend
RUN npm install

# # Python環境の準備
RUN apt-get install -y python3-venv python3-pip
RUN python3 -m venv /home/devuser/venv
RUN echo "source /home/devuser/venv/bin/activate" >> /home/devuser/.bash_aliases
RUN echo "alias pydev='uvicorn app.main:app --reload --host 0.0.0.0 --port 8000'" >> /home/devuser/.bash_aliases

# requirements を先にコピーしてキャッシュ活用
# RUN mkdir -p /home/devuser/workspace/backend
# COPY ./backend/requirements.txt ./backend
# WORKDIR /home/devuser/workspace/backend
# RUN ls -l;/home/devuser/venv/bin/pip install --upgrade pip && \
#     /home/devuser/venv/bin/pip install --no-cache-dir -r requirements.txt

# 作業ディレクトリの権限の設定
RUN chown -R devuser:devuser /home/devuser/workspace